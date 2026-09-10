/* Tema: Descomposicion en valores singulares */
Course.topic('av-svd', function (p) {

  p.text('Los [[av-lineal|autovalores]] tienen un problema: solo existen para matrices cuadradas, y no todas los tienen ' +
    'reales ni tienen suficientes autovectores. Hay una descomposición que no falla nunca, que existe para ' +
    '<strong>cualquier matriz</strong>, cuadrada o no, y que dice algo muy visual: toda transformación lineal es un giro, ' +
    'seguido de un estiramiento en direcciones perpendiculares, seguido de otro giro. Se llama descomposición en ' +
    'valores singulares, y es probablemente el resultado de álgebra lineal con más aplicaciones.');

  /* ---------------------------------------------------------------- */
  p.section('Valores y vectores singulares');

  p.text('Una matriz 2×2 transforma la circunferencia de radio 1 en una elipse. Los semiejes de esa elipse son ' +
    'perpendiculares, y vienen de dos direcciones de la circunferencia que también lo son. Esas direcciones son los ' +
    '<strong>vectores singulares</strong> $\\vec v_1$ y $\\vec v_2$; las longitudes de los semiejes, los <strong>valores ' +
    'singulares</strong> $\\sigma_1 \\ge \\sigma_2 \\ge 0$.');

  p.formulas([
    'A = U\\,\\Sigma\\,V^{t}, \\qquad A\\,\\vec v_i = \\sigma_i\\,\\vec u_i',
    '\\sigma_i = \\sqrt{\\lambda_i}, \\qquad \\lambda_i \\text{ autovalores de } A^{t}A'
  ], 'la descomposición en valores singulares',
    '$V$ y $U$ son matrices <strong>ortogonales</strong>, giros o simetrías: sus columnas son vectores unitarios perpendiculares. $\\Sigma$ es diagonal, con los valores singulares.<br><br>' +
    'Leída de derecha a izquierda: $V^t$ gira el espacio hasta que las direcciones $\\vec v_i$ caen sobre los ejes, $\\Sigma$ estira cada eje por $\\sigma_i$, y $U$ gira el resultado a su posición final.<br><br>' +
    '$A^tA$ es simétrica, y las matrices simétricas tienen siempre autovalores reales no negativos y autovectores perpendiculares: por eso la descomposición existe siempre.');

  p.demo({
    title: 'El círculo que se convierte en elipse',
    intro: 'Mueve las cuatro entradas de la matriz. La circunferencia de puntos se transforma en la elipse. Las dos direcciones marcadas en la circunferencia son perpendiculares, y la matriz las lleva a los ejes de la elipse, también perpendiculares. Las longitudes de esos ejes son los valores singulares.',
    build: function (host) {
      var M = [[1.5, 0.8], [0.3, 1]];
      var out = W.readout(host, '');
      function svd2() {
        var a = M[0][0], b = M[0][1], c = M[1][0], d = M[1][1];
        var pp = a * a + c * c, q = a * b + c * d, rr = b * b + d * d;
        var med = (pp + rr) / 2, rad = Math.sqrt(Math.pow((pp - rr) / 2, 2) + q * q);
        var l1 = med + rad, l2 = Math.max(0, med - rad);
        var v1 = Math.abs(q) > 1e-12 ? [l1 - rr, q] : (pp >= rr ? [1, 0] : [0, 1]);
        var n1 = Math.hypot(v1[0], v1[1]);
        v1 = [v1[0] / n1, v1[1] / n1];
        var v2 = [-v1[1], v1[0]];
        return { s1: Math.sqrt(l1), s2: Math.sqrt(l2), v1: v1, v2: v2, Av1: [a * v1[0] + b * v1[1], c * v1[0] + d * v1[1]], Av2: [a * v2[0] + b * v2[1], c * v2[0] + d * v2[1]], det: a * d - b * c };
      }
      var plot = W.board(host, {
        xmin: -3, xmax: 3, ymin: -3, ymax: 3, height: 320,
        aria: 'Una circunferencia unidad, la elipse en la que la transforma la matriz y los vectores singulares',
        draw: function (g) {
          var s = svd2();
          g.circle(0, 0, 1, { color: 'axis', w: 1.4, dash: [4, 4] });
          g.param(function (t) { return M[0][0] * Math.cos(t) + M[0][1] * Math.sin(t); }, function (t) { return M[1][0] * Math.cos(t) + M[1][1] * Math.sin(t); }, 0, 2 * Math.PI, { color: 0, w: 2.6, fill: true, fillAlpha: 0.08 });
          g.vec(0, 0, s.v1[0], s.v1[1], { color: 1, w: 2, dash: [4, 3], label: 'v₁' });
          g.vec(0, 0, s.v2[0], s.v2[1], { color: 2, w: 2, dash: [4, 3], label: 'v₂' });
          g.vec(0, 0, s.Av1[0], s.Av1[1], { color: 1, w: 3, label: 'σ₁u₁' });
          g.vec(0, 0, s.Av2[0], s.Av2[1], { color: 2, w: 3, label: 'σ₂u₂' });
        }
      });
      function pinta() {
        var s = svd2();
        out.set('$\\sigma_1 \\approx ' + U.fmt(s.s1, 3) + '$, $\\sigma_2 \\approx ' + U.fmt(s.s2, 3) + '$ &nbsp;·&nbsp; $\\sigma_1\\sigma_2 = ' + U.fmt(s.s1 * s.s2, 3) + '$ y $|\\det A| = ' + U.fmt(Math.abs(s.det), 3) + '$: el área de la elipse es $\\pi\\sigma_1\\sigma_2$' +
          (s.s2 < 1e-3 ? ' &nbsp;·&nbsp; <strong>$\\sigma_2 = 0$: la matriz aplasta el plano en una recta, tiene rango 1</strong>' : ''));
        plot.render();
      }
      var f1 = W.row(host), f2 = W.row(host);
      [[0, 0, f1], [0, 1, f1], [1, 0, f2], [1, 1, f2]].forEach(function (c) {
        W.slider(c[2], { label: 'fila ' + (c[0] + 1) + ', columna ' + (c[1] + 1), min: -2, max: 2, step: 0.05, value: M[c[0]][c[1]], on: function (v) { M[c[0]][c[1]] = v; pinta(); } });
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Aproximación de rango bajo');

  p.text('La descomposición se puede escribir también como una suma de matrices muy sencillas, cada una formada por un ' +
    'solo producto de un vector columna por un vector fila. Y como los valores singulares están ordenados de mayor a ' +
    'menor, los primeros términos contienen lo más importante de la matriz.');

  p.formula('A = \\sigma_1\\,\\vec u_1\\vec v_1^{t} + \\sigma_2\\,\\vec u_2\\vec v_2^{t} + \\dots + \\sigma_r\\,\\vec u_r\\vec v_r^{t} \\qquad\\Rightarrow\\qquad A_k = \\sum_{i=1}^{k} \\sigma_i\\,\\vec u_i\\vec v_i^{t}',
    'truncar la suma',
    '$r$ es el rango de $A$: el número de valores singulares distintos de cero.<br><br>Quedarse con los $k$ primeros ' +
    'términos da $A_k$, una matriz de rango $k$. El <strong>teorema de Eckart-Young</strong> (1936) dice que es la mejor ' +
    'aproximación posible de rango $k$: ninguna otra matriz de ese rango está más cerca de $A$.<br><br>El error, medido ' +
    'como raíz de la suma de los cuadrados de las diferencias, es $\\sqrt{\\sigma_{k+1}^2 + \\dots + \\sigma_r^2}$.');

  p.demo({
    title: 'Comprimir una imagen',
    intro: 'Una imagen de 48 por 48 píxeles es una matriz de 2304 números. A la derecha se reconstruye con solo los k valores singulares mayores. Con muy pocos ya se reconoce la forma; con una docena casi no se distingue del original, y guarda muchos menos números. Abajo, los valores singulares, que caen muy deprisa.',
    build: function (host) {
      var N = 48, k = 3, i, j, m;
      var A = [];
      for (i = 0; i < N; i++) {
        A.push([]);
        for (j = 0; j < N; j++) {
          var x = (j - 23.5) / 24, y = (i - 23.5) / 24, v = 0.3 + 0.2 * x;
          if (Math.hypot(x, y) < 0.8) v = 0.85;
          if (Math.hypot(x + 0.3, y + 0.25) < 0.12 || Math.hypot(x - 0.3, y + 0.25) < 0.12) v = 0.1;
          if (Math.abs(Math.hypot(x, y + 0.05) - 0.45) < 0.06 && y > 0.15) v = 0.15;
          A[i].push(v);
        }
      }
      // A^t A y sus autovectores por el metodo de Jacobi
      var S = [], V = [];
      for (i = 0; i < N; i++) { S.push(new Array(N).fill(0)); V.push(new Array(N).fill(0)); V[i][i] = 1; }
      for (i = 0; i < N; i++) for (j = i; j < N; j++) { var s = 0; for (m = 0; m < N; m++) s += A[m][i] * A[m][j]; S[i][j] = s; S[j][i] = s; }
      for (var barrido = 0; barrido < 25; barrido++) {
        var fuera = 0;
        for (i = 0; i < N; i++) for (j = i + 1; j < N; j++) fuera += S[i][j] * S[i][j];
        if (fuera < 1e-18) break;
        for (var pp = 0; pp < N - 1; pp++) for (var qq = pp + 1; qq < N; qq++) {
          if (Math.abs(S[pp][qq]) < 1e-13) continue;
          var th = (S[qq][qq] - S[pp][pp]) / (2 * S[pp][qq]);
          var t = (th >= 0 ? 1 : -1) / (Math.abs(th) + Math.sqrt(th * th + 1));
          var c = 1 / Math.sqrt(t * t + 1), sn = t * c;
          for (m = 0; m < N; m++) { var smp = S[m][pp], smq = S[m][qq]; S[m][pp] = c * smp - sn * smq; S[m][qq] = sn * smp + c * smq; }
          for (m = 0; m < N; m++) { var spm = S[pp][m], sqm = S[qq][m]; S[pp][m] = c * spm - sn * sqm; S[qq][m] = sn * spm + c * sqm; }
          for (m = 0; m < N; m++) { var vmp = V[m][pp], vmq = V[m][qq]; V[m][pp] = c * vmp - sn * vmq; V[m][qq] = sn * vmp + c * vmq; }
        }
      }
      var orden = [];
      for (i = 0; i < N; i++) orden.push(i);
      orden.sort(function (a1, b1) { return S[b1][b1] - S[a1][a1]; });
      var sig = orden.map(function (o) { return Math.sqrt(Math.max(0, S[o][o])); });
      var total = sig.reduce(function (acc, x) { return acc + x * x; }, 0);
      // A v_r para cada vector singular: son sigma_r u_r
      var AV = orden.map(function (o) { var col = []; for (var ii = 0; ii < N; ii++) { var ss = 0; for (var mm = 0; mm < N; mm++) ss += A[ii][mm] * V[mm][o]; col.push(ss); } return col; });

      var caja = U.el('div');
      caja.style.cssText = 'display:flex;gap:1rem;justify-content:center;flex-wrap:wrap';
      host.appendChild(caja);
      function lienzo(txt) {
        var fig = U.el('div');
        fig.style.cssText = 'text-align:center;font-size:0.8125rem';
        var cv = U.el('canvas', { width: N, height: N, role: 'img', 'aria-label': txt });
        cv.style.cssText = 'width:min(40vw,200px);aspect-ratio:1;image-rendering:pixelated;display:block;border-radius:4px';
        fig.appendChild(cv);
        fig.appendChild(U.el('div', { text: txt }));
        caja.appendChild(fig);
        return cv;
      }
      var cvO = lienzo('Imagen original'), cvK = lienzo('Reconstrucción con k valores singulares');
      function pintaMatriz(cv, B) {
        var ctx = cv.getContext('2d'), img = ctx.createImageData(N, N);
        for (var ii = 0; ii < N; ii++) for (var jj = 0; jj < N; jj++) {
          var val = Math.max(0, Math.min(1, B[ii][jj])) * 255, idx = 4 * (ii * N + jj);
          img.data[idx] = val; img.data[idx + 1] = val; img.data[idx + 2] = val; img.data[idx + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      pintaMatriz(cvO, A);
      var out = W.readout(host, '');
      var barras = W.plot(host, {
        xmin: 0, xmax: 21, ymin: 0, ymax: 1.1 * sig[0], height: 180, xlabel: 'i', ylabel: 'σᵢ',
        aria: 'Los veinte valores singulares mayores de la imagen, ordenados de mayor a menor',
        draw: function (g) {
          var datos = [];
          for (var r = 0; r < 20; r++) datos.push({ x: r + 1, h: sig[r], color: r < k ? 0 : 'axis' });
          g.bars(datos, { width: 0.7 });
        }
      });
      function pinta() {
        var B = [], ii, jj, r;
        for (ii = 0; ii < N; ii++) { B.push(new Array(N).fill(0)); }
        for (r = 0; r < k; r++) {
          var o = orden[r];
          for (ii = 0; ii < N; ii++) { var a = AV[r][ii]; if (!a) continue; for (jj = 0; jj < N; jj++) B[ii][jj] += a * V[jj][o]; }
        }
        pintaMatriz(cvK, B);
        var resto = 0;
        for (r = k; r < N; r++) resto += sig[r] * sig[r];
        var guarda = k * (2 * N + 1);
        out.set('$k = ' + k + '$ &nbsp;·&nbsp; se guardan $' + k + '\\cdot(48 + 48 + 1) = ' + guarda + '$ números en lugar de 2304 (' + U.fmt(100 * guarda / 2304, 1) + ' %) &nbsp;·&nbsp; error relativo: $' + U.fmt(100 * Math.sqrt(resto / total), 2) + '$ %');
        barras.render();
      }
      W.slider(W.row(host), { label: 'valores singulares usados k', min: 1, max: 24, step: 1, value: k, on: function (v) { k = v; pinta(); } });
      pinta();
    }
  });

  p.hist('La descomposición la descubrieron casi a la vez Eugenio Beltrami, en 1873, y Camille Jordan, en 1874. El ' +
    'resultado de que truncarla da la mejor aproximación es de Carl Eckart y Gale Young, dos psicólogos cuantitativos, ' +
    'en 1936. Pero su gran época llegó con los ordenadores: en 1965 Gene Golub y William Kahan dieron un algoritmo ' +
    'estable para calcularla, y en el concurso Netflix de 2006 a 2009, en el que se ofrecía un millón de dólares por ' +
    'mejorar las recomendaciones de películas, las técnicas ganadoras se basaban en factorizar la enorme matriz de ' +
    'valoraciones de los usuarios, con ideas directamente emparentadas con esta.');

  p.util('El análisis de componentes principales, la herramienta básica para reducir datos de muchas variables a unas ' +
    'pocas que expliquen casi todo, es una descomposición en valores singulares. Los buscadores la han usado para ' +
    'encontrar documentos relacionados aunque no compartan palabras, los sistemas de recomendación para adivinar qué te ' +
    'gustará, y en física cuántica mide cuánto entrelazamiento hay entre dos partes de un sistema.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Valores singulares de una matriz diagonal',
    level: 'basico',
    gen: function (r) {
      var a = r.pm(1, 6), b = r.pm(1, 6);
      if (Math.abs(a) === Math.abs(b)) return null;
      return { a: a, b: b, s1: Math.max(Math.abs(a), Math.abs(b)), s2: Math.min(Math.abs(a), Math.abs(b)) };
    },
    ask: function (d) { return '¿Cuáles son los valores singulares de $A = \\begin{pmatrix} ' + d.a + ' & 0 \\\\ 0 & ' + d.b + ' \\end{pmatrix}$? (Primero el mayor.)'; },
    fields: [{ name: 's1', label: '$\\sigma_1$', w: 'tiny' }, { name: 's2', label: '$\\sigma_2$', w: 'tiny' }],
    sol: function (d) { return { s1: d.s1, s2: d.s2 }; },
    errores: [{ si: function (v, d) { return (v.s1 < 0 || v.s2 < 0); }, msg: 'Los valores singulares son longitudes de semiejes: nunca son negativos. Un signo negativo en la diagonal es una simetría, que va a parar a $U$ o a $V$.' }],
    hint: function () { return ['Calcula $A^tA$: sale diagonal con los cuadrados.', 'Los valores singulares son las raíces de sus autovalores.']; },
    steps: function (d) { return ['$A^tA = \\begin{pmatrix} ' + (d.a * d.a) + ' & 0 \\\\ 0 & ' + (d.b * d.b) + ' \\end{pmatrix}$', 'Valores singulares: $\\sqrt{' + (d.s1 * d.s1) + '} = ' + d.s1 + '$ y $\\sqrt{' + (d.s2 * d.s2) + '} = ' + d.s2 + '$.']; },
    answer: function (d) { return d.s1 + ' y ' + d.s2; }
  });

  p.exercise({
    title: 'Cuánto ocupa una imagen comprimida',
    level: 'basico',
    gen: function (r) {
      var dim = r.pick([[100, 100], [480, 640], [1000, 1500]]), k = r.pick([5, 20, 50]);
      var guarda = k * (dim[0] + dim[1] + 1);
      return { m: dim[0], n: dim[1], k: k, guarda: guarda, pc: 100 * guarda / (dim[0] * dim[1]) };
    },
    ask: function (d) {
      return 'Una imagen en escala de grises de ' + d.m + ' × ' + d.n + ' píxeles se guarda con solo sus ' + d.k + ' primeros términos $\\sigma_i\\,\\vec u_i\\vec v_i^t$. ¿Cuántos números hay que guardar? ¿Qué porcentaje del tamaño original es? (Dos decimales.)';
    },
    fields: [{ name: 'g', label: 'números', w: 'wide' }, { name: 'p', label: 'porcentaje', w: 'tiny' }],
    sol: function (d) { return { g: d.guarda, p: U.round(d.pc, 4) }; },
    tol: 0.006,
    errores: [{ si: function (v, d) { return Math.abs(v.g - d.k * d.m * d.n) < 0.5; }, msg: 'No hace falta guardar cada matriz $\\vec u_i\\vec v_i^t$ entera: basta con los dos vectores y el número $\\sigma_i$.' }],
    hint: function () { return ['Cada término necesita un vector $\\vec u_i$ de ' + 'tantos números como filas, un $\\vec v_i$ de tantos como columnas y un número $\\sigma_i$.']; },
    steps: function (d) {
      return ['Cada término: $' + d.m + ' + ' + d.n + ' + 1 = ' + (d.m + d.n + 1) + '$ números.', 'Con ' + d.k + ' términos: $' + U.miles(d.guarda) + '$ números, frente a $' + U.miles(d.m * d.n) + '$.', 'Porcentaje: $' + U.fmt(d.pc, 2) + '$ %.'];
    },
    answer: function (d) { return U.miles(d.guarda) + ' números, ' + U.fmt(d.pc, 2) + ' %'; }
  });

  p.exercise({
    title: 'Valores singulares con AᵗA',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { A: [[3, 0], [4, 5]], AtA: [[25, 20], [20, 25]], l: [45, 5], eig: [5, 3] },
        { A: [[2, 2], [1, -1]], AtA: [[5, 3], [3, 5]], l: [8, 2], eig: [(1 + Math.sqrt(17)) / 2, (1 - Math.sqrt(17)) / 2] },
        { A: [[1, 1], [0, 1]], AtA: [[1, 1], [1, 2]], l: [(3 + Math.sqrt(5)) / 2, (3 - Math.sqrt(5)) / 2], eig: [1, 1] },
        { A: [[4, 0], [3, 0]], AtA: [[25, 0], [0, 0]], l: [25, 0], eig: [4, 0] },
        { A: [[0, 2], [-3, 0]], AtA: [[9, 0], [0, 4]], l: [9, 4], eig: [NaN, NaN] }
      ];
      var c = r.pick(casos);
      return { A: c.A, AtA: c.AtA, s1: Math.sqrt(c.l[0]), s2: Math.sqrt(c.l[1]), eig: c.eig };
    },
    ask: function (d) { return 'Calcula los valores singulares de $A = ' + ML.matTex(d.A) + '$. (Tres decimales; primero el mayor.)'; },
    fields: [{ name: 's1', label: '$\\sigma_1$', w: 'tiny' }, { name: 's2', label: '$\\sigma_2$', w: 'tiny' }],
    sol: function (d) { return { s1: U.round(d.s1, 6), s2: U.round(d.s2, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return isFinite(d.eig[0]) && (Math.abs(d.eig[0] - d.s1) > 2e-3 || Math.abs(d.eig[1] - d.s2) > 2e-3) && Math.abs(v.s1 - d.eig[0]) < 5e-4 && Math.abs(v.s2 - d.eig[1]) < 5e-4; }, msg: 'Esos son los autovalores de $A$. Los valores singulares son las raíces cuadradas de los autovalores de $A^tA$, y solo coinciden con los de $A$ en casos especiales.' }],
    hint: function () { return ['Calcula $A^tA$.', 'Halla sus autovalores con la ecuación característica y toma raíces cuadradas.']; },
    steps: function (d) {
      return ['$A^tA = ' + ML.matTex(d.AtA) + '$', 'Sus autovalores son $' + U.fmt(d.s1 * d.s1, 4) + '$ y $' + U.fmt(d.s2 * d.s2, 4) + '$.', 'Valores singulares: $\\sigma_1 \\approx ' + U.fmt(d.s1, 3) + '$ y $\\sigma_2 \\approx ' + U.fmt(d.s2, 3) + '$.'];
    },
    answer: function (d) { return U.fmt(d.s1, 3) + ' y ' + U.fmt(d.s2, 3); }
  });

  p.exercise({
    title: 'El error de truncar',
    level: 'avanzado',
    gen: function (r) {
      var s = [r.int(8, 12), r.int(4, 7), r.int(2, 3), 1, 1].sort(function (a, b) { return b - a; }), k = r.int(1, 3);
      var resto = 0, total = 0;
      s.forEach(function (x, i) { total += x * x; if (i >= k) resto += x * x; });
      return { s: s, k: k, err: Math.sqrt(resto), rel: Math.sqrt(resto / total), solo: s[k] };
    },
    ask: function (d) {
      return 'Una matriz tiene valores singulares $' + d.s.join(',\\ ') + '$. Si se aproxima con sus ' + d.k + (d.k === 1 ? ' primer término' : ' primeros términos') +
        ', ¿cuánto vale el error $\\sqrt{\\sum_{i > k} \\sigma_i^2}$ y qué fracción es del tamaño total $\\sqrt{\\sum \\sigma_i^2}$? (Tres decimales.)';
    },
    fields: [{ name: 'e', label: 'error', w: 'tiny' }, { name: 'r', label: 'fracción', w: 'tiny' }],
    sol: function (d) { return { e: U.round(d.err, 6), r: U.round(d.rel, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(d.solo - d.err) > 2e-3 && Math.abs(v.e - d.solo) < 5e-4; }, msg: 'Ese es solo el primer valor singular que se descarta. El error suma los cuadrados de <strong>todos</strong> los descartados.' }],
    hint: function () { return ['Suma los cuadrados de los valores singulares que no se usan y toma la raíz.', 'Divide por la raíz de la suma de todos los cuadrados.']; },
    steps: function (d) {
      var desc = d.s.slice(d.k);
      return ['Descartados: $' + desc.join(',\\ ') + '$, con $\\sum \\sigma_i^2 = ' + desc.reduce(function (a, x) { return a + x * x; }, 0) + '$.', 'Error: $\\approx ' + U.fmt(d.err, 3) + '$.',
        'Total: $\\sqrt{' + d.s.reduce(function (a, x) { return a + x * x; }, 0) + '}$; fracción $\\approx ' + U.fmt(d.rel, 3) + '$.'];
    },
    answer: function (d) { return U.fmt(d.err, 3) + ', ' + U.fmt(d.rel, 3); }
  });

  p.keys([
    'Toda matriz se descompone como $A = U\\Sigma V^t$: un giro, un estiramiento en direcciones perpendiculares y otro giro.',
    'Los valores singulares son las longitudes de los semiejes de la imagen de la esfera unidad, y valen $\\sqrt{\\lambda_i(A^tA)}$.',
    'Truncando la suma $\\sum \\sigma_i\\vec u_i\\vec v_i^t$ se obtiene la mejor aproximación de rango $k$ (Eckart-Young).',
    'Cuando los valores singulares caen deprisa, unos pocos términos guardan casi toda la información: así se comprimen imágenes y datos.'
  ]);
});
