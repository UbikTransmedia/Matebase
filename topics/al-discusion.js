/* Tema: Discusión de sistemas con parámetro */
Course.topic('al-discusion', function (p) {

  /* utilidades del tema */
  var F = ML.F;
  function det(M) { return ML.det3(M); }
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
  function ampliada(A, b) { return A.map(function (f, i) { return f.concat([b[i]]); }); }
  function clasifica(A, b) {
    var rA = rango(A), rS = rango(ampliada(A, b)), n = A[0].length;
    return { rA: rA, rS: rS, tipo: rA !== rS ? 'SI' : (rA === n ? 'SCD' : 'SCI') };
  }
  function cramer(A, b) {
    var d = det(A);
    return [0, 1, 2].map(function (j) {
      var Aj = A.map(function (f, i) { return f.map(function (x, c) { return c === j ? b[i] : x; }); });
      return F(det(Aj), d);
    });
  }
  function eqTex(f, c) {
    var s = ML.termTex(f[0], 'x', 1, true);
    s += ML.termTex(f[1], 'y', 1, s === '');
    s += ML.termTex(f[2], 'z', 1, s === '');
    return (s || '0') + ' = ' + c;
  }
  var NOMBRE = { SCD: 'compatible determinado', SCI: 'compatible indeterminado', SI: 'incompatible' };
  var OPTS = [{ t: 'Compatible determinado', v: 'SCD' }, { t: 'Compatible indeterminado', v: 'SCI' }, { t: 'Incompatible', v: 'SI' }];

  p.text('Esta es, probablemente, la pregunta de álgebra más repetida del examen: <em>«discute el ' +
    'siguiente sistema según los valores del parámetro $k$ y resuélvelo cuando sea compatible ' +
    'determinado»</em>. Asusta porque parece que hay infinitos casos, uno por cada valor de $k$. En ' +
    'realidad casi siempre hay solo tres, y hay un método para encontrarlos que no falla.');

  p.text('Todo lo que hace falta está ya en el curso: el [[al-gauss|método de Gauss]], el ' +
    '[[al-determinantes|rango]] y los [[al-determinantes|determinantes]]. Aquí se juntan en un ' +
    'teorema y en una receta.');

  /* ---------------------------------------------------------------- */
  p.section('El teorema de Rouché-Frobenius');

  p.formulas([
    '\\operatorname{rg}(A) \\ne \\operatorname{rg}(A^*) \\iff \\text{incompatible (SI)}',
    '\\operatorname{rg}(A) = \\operatorname{rg}(A^*) = n \\iff \\text{compatible determinado (SCD)}',
    '\\operatorname{rg}(A) = \\operatorname{rg}(A^*) < n \\iff \\text{compatible indeterminado (SCI)}'
  ], 'Rouché-Frobenius, con n incógnitas',
    '$A$ es la matriz de coeficientes y $A^*$ la <strong>ampliada</strong>, con la columna de términos ' +
      'independientes pegada.<br><br>Se lee: <em>«si el rango de a y el de a ampliada son distintos, el ' +
      'sistema es incompatible; si son iguales al número de incógnitas, compatible determinado; si son ' +
      'iguales pero menores, compatible indeterminado»</em>.<br><br>Y en el caso indeterminado, el número ' +
      'de <strong>grados de libertad</strong> —cuántas incógnitas quedan libres como parámetros— es ' +
      '$n - \\operatorname{rg}(A)$.');

  p.text('Por qué es cierto, sin demostración formal: el rango de $A$ cuenta cuántas ecuaciones son de ' +
    'verdad independientes. Si al añadir la columna de resultados el rango sube, es que hay una ecuación ' +
    'que combina a las demás en los coeficientes pero no en el resultado: dice algo como «$0 = 5$». Si no ' +
    'sube, no hay contradicción, y lo que falta saber es si hay tantas ecuaciones útiles como incógnitas.');

  /* ---------------------------------------------------------------- */
  p.section('La receta para discutir con un parámetro');

  p.list([
    '<strong>Escribe $A$ y $A^*$</strong>, con el parámetro dentro.',
    '<strong>Calcula $\\det A$</strong> (si $A$ es cuadrada) y halla los valores de $k$ que lo anulan. Son los <strong>valores críticos</strong>.',
    '<strong>Para $k$ distinto de todos los críticos</strong>: $\\det A \\ne 0$, así que $\\operatorname{rg}(A) = \\operatorname{rg}(A^*) = n$. Sistema compatible determinado. No hay nada más que hacer.',
    '<strong>Para cada valor crítico, uno por uno</strong>: se sustituye $k$, se calculan los dos rangos con números concretos y se aplica el teorema.',
    '<strong>Si piden resolver</strong>: en el caso determinado, por Gauss o por Cramer; en el indeterminado, se pasan las incógnitas libres al otro lado como parámetros.'
  ], true);

  p.note('El error que más puntos cuesta es estudiar los valores críticos «en general», con el parámetro ' +
    'todavía dentro. Hay que <strong>sustituir</strong> cada valor y trabajar con números: en un valor ' +
    'crítico el sistema puede ser incompatible y en el otro indeterminado, y solo se ve sustituyendo.',
    'warn', 'Los valores críticos se estudian sustituyendo');

  p.demo({
    title: 'Discutir mirando los tres planos',
    intro: 'El sistema kx + y + z = 1, x + ky + z = k, x + y + kz = k². Mueve k: casi siempre los tres planos se cortan en un punto. Solo en k = 1 y k = −2 pasa otra cosa, y es distinta en cada uno.',
    build: function (host) {
      var k = 0;
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 3, height: 380,
        aria: 'Los tres planos de un sistema de ecuaciones con parámetro, que cambian de posición al mover k',
        draw: function (g) {
          var A = [[k, 1, 1], [1, k, 1], [1, 1, k]], b = [1, k, k * k];
          A.forEach(function (f, i) {
            if (f[0] || f[1] || f[2]) g.plano(f, -b[i], { color: i, fillAlpha: 0.14, w: 1 });
          });
          var c = clasifica(A, b);
          if (c.tipo === 'SCD') {
            var s = cramer(A, b).map(function (x) { return x.val(); });
            if (s.every(function (x) { return Math.abs(x) <= 3; })) g.punto(s, { color: 'ink', r: 5, label: 'solución' });
          }
        }
      });
      function pinta() {
        var A = [[k, 1, 1], [1, k, 1], [1, 1, k]], b = [1, k, k * k];
        var c = clasifica(A, b);
        var extra = '';
        if (c.tipo === 'SCD') extra = 'Solución: $(' + cramer(A, b).map(function (x) { return x.tex(); }).join(',\\ ') + ')$';
        else if (c.tipo === 'SCI') extra = 'Las tres ecuaciones son la misma: un solo plano con infinitos puntos (dos grados de libertad).';
        else extra = 'Los planos se cortan dos a dos, pero no hay ningún punto común a los tres.';
        out.set('$k = ' + U.fmt(k, 1) + '$: &nbsp;$\\det A = (k-1)^2(k+2) = ' + U.fmt((k - 1) * (k - 1) * (k + 2), 2) + '$<br>' +
          '$\\operatorname{rg}(A) = ' + c.rA + '$, $\\operatorname{rg}(A^*) = ' + c.rS + '$ &nbsp;→&nbsp; <strong>' + NOMBRE[c.tipo] + '</strong><br>' + extra);
        vista.render();
      }
      W.slider(W.row(host), { label: 'parámetro k', min: -3, max: 3, step: 1, value: k, on: function (x) { k = x; pinta(); } });
      W.hint(host, 'Ve a k = 1 (los tres planos coinciden) y a k = −2 (forman un prisma, sin punto común).');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La regla de Cramer');

  p.text('Cuando el sistema es cuadrado y compatible determinado, cada incógnita se puede escribir ' +
    'directamente como un cociente de determinantes. No siempre es lo más rápido, pero es muy cómodo ' +
    'para sistemas 2×2 y 3×3, y sobre todo para resolver con parámetros dentro.');

  p.formula('x = \\frac{\\begin{vmatrix} b_1 & a_{12} & a_{13} \\\\ b_2 & a_{22} & a_{23} \\\\ b_3 & a_{32} & a_{33} \\end{vmatrix}}{\\det A} \\qquad y = \\frac{\\det A_y}{\\det A} \\qquad z = \\frac{\\det A_z}{\\det A}',
    'regla de Cramer para un sistema 3×3',
    'Para la $x$, se copia la matriz de coeficientes y se <strong>sustituye su primera columna</strong> ' +
      'por la de términos independientes; su determinante, dividido por $\\det A$, es $x$. Para la $y$ se ' +
      'sustituye la segunda columna, y para la $z$ la tercera.<br><br>Solo vale si $\\det A \\ne 0$.');

  p.hist('Gabriel Cramer, un matemático suizo, publicó su regla en 1750 en un libro sobre curvas ' +
    'algebraicas: quería saber cuántos puntos hacen falta para determinar una curva, y eso lo llevó a ' +
    'sistemas de ecuaciones. El teorema de los rangos tiene una historia más curiosa: en España se ' +
    'llama de <em>Rouché-Frobenius</em>, en Italia de <em>Rouché-Capelli</em>, en Rusia de ' +
    '<em>Kronecker-Capelli</em> y en Francia de <em>Rouché-Fontené</em>. Varios matemáticos lo ' +
    'enunciaron casi a la vez hacia 1875 y cada país se quedó con los suyos.');

  /* ---------------------------------------------------------------- */
  p.section('Sistemas homogéneos');

  p.text('Un sistema es <strong>homogéneo</strong> cuando todos sus términos independientes son cero. ' +
    'Entonces nunca puede ser incompatible, porque $x = y = z = 0$ siempre es solución: la ' +
    '<strong>solución trivial</strong>. La única pregunta interesante es si tiene otras.');

  p.formula('\\text{un sistema homogéneo cuadrado tiene soluciones no triviales} \\iff \\det A = 0',
    'la pregunta de los homogéneos',
    'Se lee: <em>«tiene soluciones distintas de la trivial si y solo si el determinante de a es ' +
      'cero»</em>.<br><br>Porque si $\\det A \\ne 0$ el sistema es compatible determinado y su única ' +
      'solución es la trivial; si $\\det A = 0$ el rango baja, es indeterminado y tiene infinitas.');

  p.util('Ajustar una reacción química es resolver un sistema homogéneo. En $a\\,\\mathrm{CH_4} + b\\,\\mathrm{O_2} \\to ' +
    'c\\,\\mathrm{CO_2} + d\\,\\mathrm{H_2O}$ cada elemento da una ecuación —los átomos de carbono, de ' +
    'hidrógeno y de oxígeno se conservan— y todas igualadas a cero. La solución trivial no sirve para ' +
    'nada, así que el sistema tiene que ser indeterminado, y la solución más sencilla con números ' +
    'enteros son los coeficientes: 1, 2, 1, 2. Los programas de química lo hacen exactamente así. En ' +
    'economía, las tablas de Leontief, que describen cuánto necesita cada sector de los demás, son ' +
    'sistemas lineales cuya discusión dice si una economía puede sostenerse.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Clasificar por los rangos',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([2, 3, 3, 4]);
      var rA = r.int(1, Math.min(3, n)), rS = rA + (r.bool(0.35) ? 1 : 0);
      if (rS > 4) rS = rA;
      return { n: n, rA: rA, rS: rS, tipo: rA !== rS ? 'SI' : (rA === n ? 'SCD' : 'SCI') };
    },
    ask: function (d) {
      return 'Un sistema de ecuaciones con $' + d.n + '$ incógnitas cumple $\\operatorname{rg}(A) = ' + d.rA + '$ y $\\operatorname{rg}(A^*) = ' + d.rS + '$. ¿Cómo es?';
    },
    fields: [{ name: 't', label: 'El sistema es', opts: OPTS }],
    sol: function (d) { return { t: d.tipo }; },
    errores: [{
      si: function (v, d) { return d.tipo === 'SCI' && v.raw.t === 'SCD'; },
      msg: 'Los rangos coinciden, sí, pero son menores que el número de incógnitas: quedan incógnitas libres.'
    }],
    hint: function () { return ['Primero: ¿son iguales los dos rangos?', 'Si lo son, compáralos con el número de incógnitas.']; },
    steps: function (d) {
      return [d.rA !== d.rS ? 'Los rangos son distintos: <strong>incompatible</strong>.'
        : (d.rA === d.n ? 'Iguales entre sí e iguales al número de incógnitas: <strong>compatible determinado</strong>.'
          : 'Iguales entre sí pero menores que ' + d.n + ': <strong>compatible indeterminado</strong>, con $' + (d.n - d.rA) + '$ grado' + (d.n - d.rA === 1 ? '' : 's') + ' de libertad.')];
    },
    answer: function (d) { return NOMBRE[d.tipo]; }
  });

  p.exercise({
    title: 'Resolver por Cramer',
    level: 'medio',
    gen: function (r) {
      var A = [];
      for (var i = 0; i < 3; i++) A.push([r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)]);
      var d = det(A);
      if (!d || Math.abs(d) > 30) return null;
      var sol = [r.pm(0, 4), r.pm(0, 4), r.pm(0, 4)];
      var b = A.map(function (f) { return f[0] * sol[0] + f[1] * sol[1] + f[2] * sol[2]; });
      return { A: A, b: b, sol: sol, d: d };
    },
    ask: function (d) {
      return 'Resuelve por Cramer: $\\begin{cases}' + d.A.map(function (f, i) { return eqTex(f, d.b[i]); }).join(' \\\\ ') + '\\end{cases}$';
    },
    fields: [{ name: 'x', label: 'x =', w: 'tiny' }, { name: 'y', label: 'y =', w: 'tiny' }, { name: 'z', label: 'z =', w: 'tiny' }],
    sol: function (d) { return { x: d.sol[0], y: d.sol[1], z: d.sol[2] }; },
    hint: function () {
      return ['Calcula primero $\\det A$: si no es cero, se puede usar Cramer.',
        'Para $x$, cambia la primera columna por los términos independientes y divide su determinante por $\\det A$. Igual con $y$ (segunda columna) y $z$ (tercera).'];
    },
    steps: function (d) {
      var nombres = ['x', 'y', 'z'];
      var s = ['$\\det A = ' + ML.matTex(d.A, 'vmatrix') + ' = ' + d.d + '$'];
      [0, 1, 2].forEach(function (j) {
        var Aj = d.A.map(function (f, i) { return f.map(function (x, c) { return c === j ? d.b[i] : x; }); });
        s.push('$' + nombres[j] + ' = \\dfrac{' + ML.matTex(Aj, 'vmatrix') + '}{' + d.d + '} = \\dfrac{' + det(Aj) + '}{' + d.d + '} = ' + d.sol[j] + '$');
      });
      return s;
    },
    answer: function (d) { return 'x = ' + d.sol[0] + ', y = ' + d.sol[1] + ', z = ' + d.sol[2]; }
  });

  p.exercise({
    title: 'El homogéneo con soluciones no triviales',
    level: 'medio',
    gen: function (r) {
      var a = r.pm(0, 3), b = r.pm(0, 3), c = r.pm(0, 3), d0 = r.pm(0, 3), f = r.pm(0, 3), g = r.pm(0, 3), h = r.pm(0, 3), i = r.pm(0, 3);
      // A = [[a,b,c],[d0,k,f],[g,h,i]]: det = k(a i - c g) + resto
      var coef = a * i - c * g;
      if (!coef) return null;
      var resto = ML.det3([[a, b, c], [d0, 0, f], [g, h, i]]);
      return { M: [[a, b, c], [d0, 'k', f], [g, h, i]], coef: coef, resto: resto, k: F(-resto, coef), filas: [[a, b, c], [d0, null, f], [g, h, i]] };
    },
    ask: function (d) {
      var eq = function (f, i) {
        var s = ML.termTex(f[0], 'x', 1, true);
        s += i === 1 ? (s ? ' + ky' : 'ky') : ML.termTex(f[1], 'y', 1, s === '');
        s += ML.termTex(f[2], 'z', 1, s === '');
        return (s || '0') + ' = 0';
      };
      return 'Halla $k$ para que el sistema homogéneo $\\begin{cases}' + d.filas.map(eq).join(' \\\\ ') + '\\end{cases}$ tenga soluciones distintas de la trivial. (Vale una fracción.)';
    },
    fields: [{ name: 'k', label: 'k =', w: 'tiny' }],
    sol: function (d) { return { k: d.k.val() }; },
    tol: 1e-9,
    hint: function () { return ['Un homogéneo tiene soluciones no triviales solo si $\\det A = 0$.', 'El determinante es de primer grado en $k$: iguálalo a cero y despeja.']; },
    steps: function (d) {
      return ['$\\det A = ' + ML.matTex(d.M, 'vmatrix') + ' = ' + ML.termTex(d.coef, 'k', 1, true) + ML.termTex(d.resto, '', 0, false) + '$',
        'Igualando a cero: $k = ' + d.k.tex() + '$. Para ese valor, el sistema es compatible indeterminado.'];
    },
    answer: function (d) { return '$k = ' + d.k.tex() + '$'; }
  });

  p.problem({
    title: 'Discute y resuelve el sistema',
    level: 'avanzado',
    gen: function (r) {
      // A(k) = [[1,1,k],[1,k,1],[k,1,1]]: det = -(k-1)^2 (k+2)
      var tipo = r.int(0, 3), b;
      if (tipo === 0) { var c = r.pm(1, 3); b = [c, c, c]; }                 // k=1 SCI, k=-2 SI
      else if (tipo === 1) {                                                   // k=1 SI, k=-2 SCI
        var p1 = r.pm(0, 3), p2 = r.pm(0, 3);
        b = [p1, p2, -p1 - p2];
        if (p1 === p2 && p2 === -p1 - p2) return null;
      } else if (tipo === 2) {                                                 // los dos SI
        b = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
        if ((b[0] === b[1] && b[1] === b[2]) || b[0] + b[1] + b[2] === 0) return null;
      } else { b = [0, 0, 0]; }                                               // homogeneo: los dos SCI
      var A = function (k) { return [[1, 1, k], [1, k, 1], [k, 1, 1]]; };
      var c1 = clasifica(A(1), b), c2 = clasifica(A(-2), b);
      var s0 = cramer(A(0), b);
      return { b: b, t1: c1.tipo, t2: c2.tipo, s0: s0 };
    },
    intro: function (d) {
      return 'Se considera el sistema $\\begin{cases} x + y + kz = ' + d.b[0] + ' \\\\ x + ky + z = ' + d.b[1] + ' \\\\ kx + y + z = ' + d.b[2] + '\\end{cases}$';
    },
    partes: [
      {
        ask: function () { return 'Halla los valores críticos de $k$ (los que anulan $\\det A$), separados por punto y coma.'; },
        fields: [{ name: 'k', label: 'valores críticos', w: 'wide' }],
        sol: function () { return { k: '1; -2' }; },
        check: function (v) {
          if (!String(v.raw.k || '').trim()) return { ok: false, msg: 'Escribe los valores separados por punto y coma.' };
          return Ex.sameSet(v.raw.k, [1, -2]);
        },
        hint: function () {
          return ['Calcula $\\det A$ con $k$ dentro.', 'Sumando las tres columnas aparece el factor $(k + 2)$; el resto da $(k-1)^2$.'];
        },
        steps: function () { return ['$\\det A = ' + '\\begin{vmatrix} 1 & 1 & k \\\\ 1 & k & 1 \\\\ k & 1 & 1 \\end{vmatrix} = -(k - 1)^2(k + 2)$', 'Se anula en $k = 1$ y en $k = -2$.']; },
        answer: function () { return 'k = 1 y k = −2'; }
      },
      {
        ask: function () { return '¿Cómo es el sistema si $k$ no es ninguno de esos valores?'; },
        fields: [{ name: 't', label: 'El sistema es', opts: OPTS }],
        sol: function () { return { t: 'SCD' }; },
        hint: function () { return 'Si $\\det A \\ne 0$, ¿qué rango tienen $A$ y $A^*$?'; },
        steps: function () { return ['$\\det A \\ne 0 \\Rightarrow \\operatorname{rg}(A) = \\operatorname{rg}(A^*) = 3$ = número de incógnitas: <strong>compatible determinado</strong>.']; },
        answer: function () { return 'Compatible determinado'; }
      },
      {
        ask: function () { return '¿Y para $k = 1$?'; },
        fields: [{ name: 't', label: 'El sistema es', opts: OPTS }],
        sol: function (d) { return { t: d.t1 }; },
        hint: function () { return ['Sustituye $k = 1$: las tres ecuaciones tienen los mismos coeficientes.', 'Ahora mira los términos independientes: ¿coinciden?']; },
        steps: function (d) {
          return ['Con $k = 1$ las tres filas de $A$ son $(1\\ 1\\ 1)$: $\\operatorname{rg}(A) = 1$.',
            d.t1 === 'SCI' ? 'Los términos independientes son iguales: $\\operatorname{rg}(A^*) = 1 < 3$, <strong>compatible indeterminado</strong> con dos grados de libertad.'
              : 'Los términos independientes no son todos iguales: $\\operatorname{rg}(A^*) = 2$, <strong>incompatible</strong>.'];
        },
        answer: function (d) { return NOMBRE[d.t1]; }
      },
      {
        ask: function () { return '¿Y para $k = -2$?'; },
        fields: [{ name: 't', label: 'El sistema es', opts: OPTS }],
        sol: function (d) { return { t: d.t2 }; },
        errores: [{
          si: function (v, d) { return d.t2 === 'SI' && v.raw.t === 'SCI'; },
          msg: 'Que el determinante sea cero no basta para ser indeterminado: calcula también el rango de la <strong>ampliada</strong>.'
        }],
        hint: function () { return ['Sustituye $k = -2$ y fíjate en que la suma de las tres filas de $A$ da cero.', 'El sistema es compatible solo si la suma de los términos independientes también es cero.']; },
        steps: function (d) {
          return ['Con $k = -2$, $\\operatorname{rg}(A) = 2$ (hay un menor 2×2 no nulo y la suma de las tres filas es cero).',
            d.t2 === 'SCI' ? 'La suma de los términos independientes también es 0: $\\operatorname{rg}(A^*) = 2 < 3$, <strong>compatible indeterminado</strong>.'
              : 'La suma de los términos independientes no es 0: $\\operatorname{rg}(A^*) = 3$, <strong>incompatible</strong>.'];
        },
        answer: function (d) { return NOMBRE[d.t2]; }
      },
      {
        ask: function () { return 'Resuélvelo para $k = 0$. (Valen fracciones.)'; },
        fields: [{ name: 'x', label: 'x =', w: 'tiny' }, { name: 'y', label: 'y =', w: 'tiny' }, { name: 'z', label: 'z =', w: 'tiny' }],
        sol: function (d) { return { x: d.s0[0].val(), y: d.s0[1].val(), z: d.s0[2].val() }; },
        tol: 1e-9,
        hint: function () { return ['Con $k = 0$ el determinante vale $-2$: se puede usar Cramer o Gauss.', 'El sistema queda $x + y = b_1$, $x + z = b_2$, $y + z = b_3$.']; },
        steps: function (d) {
          return ['Con $k = 0$: $\\begin{cases} x + y = ' + d.b[0] + ' \\\\ x + z = ' + d.b[1] + ' \\\\ y + z = ' + d.b[2] + '\\end{cases}$',
            'Sumando las tres: $2(x + y + z) = ' + (d.b[0] + d.b[1] + d.b[2]) + '$, y restando cada ecuación se despeja cada incógnita.',
            '$x = ' + d.s0[0].tex() + '$, $y = ' + d.s0[1].tex() + '$, $z = ' + d.s0[2].tex() + '$'];
        },
        answer: function (d) { return '$x = ' + d.s0[0].tex() + '$, $y = ' + d.s0[1].tex() + '$, $z = ' + d.s0[2].tex() + '$'; }
      }
    ]
  });

  p.keys([
    'Rouché-Frobenius: rangos distintos, incompatible; iguales a $n$, determinado; iguales y menores, indeterminado.',
    'Grados de libertad en un indeterminado: $n - \\operatorname{rg}(A)$.',
    'Receta con parámetro: $\\det A = 0$ da los valores críticos; fuera de ellos, SCD; en cada uno, sustituir y calcular rangos.',
    'Los valores críticos se estudian <strong>sustituyendo</strong>, nunca con el parámetro dentro.',
    'Cramer: cada incógnita es $\\det A_i / \\det A$, sustituyendo su columna por los términos independientes.',
    'Un homogéneo siempre es compatible; tiene soluciones no triviales si y solo si $\\det A = 0$.',
    'Discutir un sistema de tres incógnitas es decidir cómo están colocados tres planos: lo verás en [[ge-espacio]].'
  ]);
});
