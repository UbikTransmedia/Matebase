/* Tema: Criptografia moderna: Diffie-Hellman y curvas elipticas */
Course.topic('av-cripto-curvas', function (p) {

  p.text('Durante siglos, toda la criptografía tuvo el mismo problema: para enviarse mensajes secretos, dos ' +
    'personas tenían que haber acordado antes una clave, en persona o por un mensajero de confianza. Internet no ' +
    'funciona así. Tu navegador habla con un banco al que nunca ha visto, por cables que cualquiera puede ' +
    'espiar, y aun así los dos acaban compartiendo una clave que nadie más conoce.');

  p.text('Parece imposible y es aritmética: la [[av-numeros|aritmética modular]] de la teoría de números y la ' +
    'estructura de [[av-grupos|grupo]] de unos objetos muy curiosos, las curvas elípticas.');

  /* ---------------------------------------------------------------- */
  p.section('El intercambio de claves de Diffie-Hellman');

  p.text('Alicia y Benito acuerdan en público dos números: un primo $p$ y una base $g$. Cada uno elige además un ' +
    'número secreto que no cuenta a nadie: Alicia, $a$; Benito, $b$. Y ocurre esto:');

  p.formulas([
    'A = g^a \\bmod p \\qquad\\text{(Alicia lo envía en público)}',
    'B = g^b \\bmod p \\qquad\\text{(Benito lo envía en público)}',
    'K = B^a \\bmod p = A^b \\bmod p = g^{ab} \\bmod p'
  ], 'el intercambio de Diffie-Hellman',
    '$x \\bmod p$ es el resto de dividir $x$ entre $p$.<br><br>Alicia calcula $B^a = (g^b)^a = g^{ab}$ y Benito calcula ' +
    '$A^b = (g^a)^b = g^{ab}$. Por las propiedades de las potencias, <strong>llegan al mismo número sin haberlo enviado ' +
    'nunca</strong>.<br><br>Quien espía ve $p$, $g$, $A$ y $B$. Para obtener $K$ necesitaría $a$ o $b$, y para eso tendría ' +
    'que despejar el exponente de $A = g^a \\bmod p$.');

  p.note('Una forma de imaginarlo con pintura: los dos parten de un mismo color público. Cada uno le mezcla un ' +
    'color secreto y envía el resultado. Al recibir la mezcla del otro, cada uno le añade su color secreto. Los dos ' +
    'acaban con la misma mezcla de tres colores, y quien vio pasar las dos mezclas intermedias no sabe «desmezclar» ' +
    'la pintura para sacar los colores secretos.', 'ok', 'La analogía de la pintura');

  p.demo({
    title: 'Diffie-Hellman con números pequeños',
    intro: 'Todo lo que aparece en la columna del medio viaja por un canal público: cualquiera lo ve. Cambia los números secretos de Alicia y Benito y comprueba que las dos claves que calculan siempre coinciden.',
    build: function (host) {
      var P = 23, G = 5, a = 6, b = 15;
      var PRIMOS = { 23: 5, 47: 5, 97: 5 };
      var out = W.readout(host, '');
      function potMod(base, e, m) { var res = 1; base %= m; while (e > 0) { if (e & 1) res = res * base % m; base = base * base % m; e = Math.floor(e / 2); } return res; }
      function pinta() {
        var A = potMod(G, a, P), B = potMod(G, b, P), KA = potMod(B, a, P), KB = potMod(A, b, P);
        out.innerHTML = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Alicia (en secreto)</th><th>Canal público</th><th>Benito (en secreto)</th></tr></thead><tbody>' +
          '<tr><td></td><td>$p = ' + P + '$, $g = ' + G + '$</td><td></td></tr>' +
          '<tr><td>elige $a = ' + a + '$</td><td></td><td>elige $b = ' + b + '$</td></tr>' +
          '<tr><td>$A = ' + G + '^{' + a + '} \\bmod ' + P + ' = ' + A + '$</td><td>$A = ' + A + '$ &nbsp;·&nbsp; $B = ' + B + '$</td><td>$B = ' + G + '^{' + b + '} \\bmod ' + P + ' = ' + B + '$</td></tr>' +
          '<tr><td>$K = ' + B + '^{' + a + '} \\bmod ' + P + ' = <strong>' + KA + '</strong>$</td><td>?</td><td>$K = ' + A + '^{' + b + '} \\bmod ' + P + ' = <strong>' + KB + '</strong>$</td></tr>' +
          '</tbody></table></div>';
        out.set(out.innerHTML);
      }
      W.chips(host, Object.keys(PRIMOS).map(function (k) { return { label: 'p = ' + k, value: +k }; }), { value: P, on: function (v) { P = v; G = PRIMOS[v]; pinta(); } });
      var fila = W.row(host);
      W.slider(fila, { label: 'secreto de Alicia a', min: 1, max: 95, step: 1, value: a, on: function (v) { a = v; pinta(); } });
      W.slider(fila, { label: 'secreto de Benito b', min: 1, max: 95, step: 1, value: b, on: function (v) { b = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El problema del logaritmo discreto');

  p.text('Toda la seguridad depende de que, conocidos $g$, $p$ y $A = g^a \\bmod p$, sea muy difícil encontrar $a$. ' +
    'Con números reales sería un logaritmo, y los logaritmos se calculan en un instante. Pero el resto de la ' +
    'división lo desordena todo: las potencias de $g$ saltan de un valor a otro sin ningún patrón visible, y no se ' +
    'conoce ningún método esencialmente mejor que ir probando. Se llama el <strong>problema del logaritmo discreto</strong>.');

  p.demo({
    title: 'Las potencias, desordenadas',
    intro: 'Cada punto es la potencia gᵏ mod p, para k = 1, 2, 3… Con números reales, las potencias formarían una curva exponencial suave, y con ella se leería el exponente. Aquí los puntos saltan sin orden aparente: por eso no hay atajo para volver del resultado al exponente.',
    build: function (host) {
      var P = 97, G = 5;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 97, ymin: 0, ymax: 97, height: 300, xlabel: 'exponente k', ylabel: 'gᵏ mod p',
        aria: 'Las potencias sucesivas de un número módulo un primo, repartidas sin orden aparente',
        draw: function (g) {
          var v = 1;
          for (var k = 1; k < P; k++) { v = v * G % P; g.point(k, v, { color: 0, r: 2.8 }); }
        }
      });
      function pinta() {
        var v = 1, lista = [];
        for (var k = 1; k <= 12; k++) { v = v * G % P; lista.push(v); }
        plot.view(0, P, 0, P);
        out.set('Primeras potencias de $' + G + '$ módulo $' + P + '$: $' + lista.join(',\\ ') + ',\\ \\dots$ &nbsp;·&nbsp; con un primo de 600 cifras, probar todos los exponentes llevaría más tiempo que la edad del universo.');
      }
      W.chips(host, [{ label: 'p = 23, g = 5', value: 23 }, { label: 'p = 97, g = 5', value: 97 }, { label: 'p = 1009, g = 11', value: 1009 }], { value: P, on: function (v) { P = v; G = v === 1009 ? 11 : 5; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La suma de puntos de una curva elíptica');

  p.text('Con primos grandes, Diffie-Hellman necesita números de más de 600 cifras para ser seguro. Hay una manera ' +
    'de conseguir la misma seguridad con números mucho más cortos: sustituir las potencias por la «suma» de puntos ' +
    'de una curva elíptica. Una curva elíptica es el conjunto de soluciones de una ecuación como $y^2 = x^3 + ax + b$, ' +
    'y tiene una propiedad geométrica asombrosa: sus puntos se pueden sumar.');

  p.formulas([
    '\\lambda = \\frac{y_2 - y_1}{x_2 - x_1} \\quad\\text{(si } P \\ne Q\\text{)}, \\qquad \\lambda = \\frac{3x_1^2 + a}{2y_1} \\quad\\text{(si } P = Q\\text{)}',
    'x_3 = \\lambda^2 - x_1 - x_2, \\qquad y_3 = \\lambda\\,(x_1 - x_3) - y_1'
  ], 'la suma de puntos P + Q = (x₃, y₃)',
    'Geométricamente: se traza la recta que pasa por $P$ y $Q$ (la tangente, si son el mismo punto). Corta a la curva ' +
    'en un tercer punto, y $P + Q$ es su simétrico respecto del eje $x$.<br><br>$\\lambda$ es la pendiente de esa recta. ' +
    'Las fórmulas de $x_3$ salen de sustituir la recta en la ecuación de la curva y usar que las tres raíces de la ' +
    'cúbica suman $\\lambda^2$.<br><br>Con esta suma los puntos forman un [[av-grupos|grupo]], con un «punto del ' +
    'infinito» como elemento neutro. Y en criptografía todo se hace <strong>módulo un primo</strong>: las divisiones ' +
    'se convierten en multiplicar por el inverso modular.');

  p.demo({
    title: 'Sumar dos puntos con una recta',
    intro: 'La curva y² = x³ − x + 1. Elige la abscisa de P y de Q y si están en la rama de arriba o en la de abajo. La recta que los une corta a la curva en un tercer punto; su reflejo es P + Q. Pon los dos puntos en el mismo sitio para ver la tangente.',
    build: function (host) {
      var xp = -1, xq = 0.5, sp = 1, sq = 1;
      var RAIZ = -1.324718;
      var out = W.readout(host, '');
      function yDe(x, s) { var v = x * x * x - x + 1; return v < 0 ? NaN : s * Math.sqrt(v); }
      var plot = W.board(host, {
        xmin: -2.2, xmax: 3.2, ymin: -4.2, ymax: 4.2, height: 340,
        aria: 'Una curva elíptica con dos puntos, la recta que los une y el punto suma',
        draw: function (g) {
          g.fn(function (x) { return yDe(x, 1); }, { color: 0, w: 2.6, from: RAIZ, samples: 500 });
          g.fn(function (x) { return yDe(x, -1); }, { color: 0, w: 2.6, from: RAIZ, samples: 500 });
          var x1 = xp, y1 = yDe(xp, sp), x2 = xq, y2 = yDe(xq, sq);
          g.point(x1, y1, { color: 1, r: 6, label: 'P' });
          g.point(x2, y2, { color: 1, r: 6, label: 'Q' });
          var lam;
          if (Math.abs(x1 - x2) < 1e-9) {
            if (Math.abs(y1 + y2) < 1e-9) { g.vline(x1, { color: 'axis', dash: [4, 4], w: 1.4 }); out.set('Los puntos son simétricos: la recta es vertical y no corta a la curva en ningún otro punto. $P + Q$ es el punto del infinito, el neutro del grupo.'); return; }
            lam = (3 * x1 * x1 - 1) / (2 * y1);
          } else lam = (y2 - y1) / (x2 - x1);
          var x3 = lam * lam - x1 - x2, y3 = lam * (x1 - x3) - y1;
          g.fn(function (x) { return y1 + lam * (x - x1); }, { color: 'axis', w: 1.4 });
          g.seg(x3, -y3, x3, y3, { color: 2, dash: [4, 4], w: 1.4 });
          g.point(x3, -y3, { color: 'axis', r: 5, hollow: true });
          g.point(x3, y3, { color: 2, r: 7, label: 'P + Q' });
          out.set('$P = (' + U.fmt(x1, 2) + ',\\ ' + U.fmt(y1, 2) + ')$, $Q = (' + U.fmt(x2, 2) + ',\\ ' + U.fmt(y2, 2) + ')$ &nbsp;·&nbsp; pendiente $\\lambda = ' + U.fmt(lam, 3) + '$ &nbsp;·&nbsp; $P + Q = (' + U.fmt(x3, 3) + ',\\ ' + U.fmt(y3, 3) + ')$');
        }
      });
      var f1 = W.row(host);
      W.slider(f1, { label: 'x de P', min: RAIZ, max: 2.5, step: 0.01, value: xp, on: function (v) { xp = v; plot.render(); } });
      W.chips(f1, [{ label: 'P arriba', value: 1 }, { label: 'P abajo', value: -1 }], { value: sp, on: function (v) { sp = v; plot.render(); } });
      var f2 = W.row(host);
      W.slider(f2, { label: 'x de Q', min: RAIZ, max: 2.5, step: 0.01, value: xq, on: function (v) { xq = v; plot.render(); } });
      W.chips(f2, [{ label: 'Q arriba', value: 1 }, { label: 'Q abajo', value: -1 }], { value: sq, on: function (v) { sq = v; plot.render(); } });
    }
  });

  p.text('La versión con curvas del intercambio de claves es idéntica a la de potencias. Se acuerda en público una ' +
    'curva y un punto $G$. Alicia elige un número secreto $a$ y envía el punto $aG = G + G + \\dots + G$; Benito envía ' +
    '$bG$. Los dos calculan $abG$. Y deshacer $aG$ para obtener $a$ es el logaritmo discreto en la curva, que es ' +
    'todavía más difícil: una clave de curva elíptica de 256 bits da una seguridad comparable a la de una clave de ' +
    'potencias de más de 3000 bits.');

  p.hist('Whitfield Diffie y Martin Hellman publicaron su método en 1976, en un artículo titulado <em>New ' +
    'Directions in Cryptography</em>, y con él nació la criptografía de clave pública. Años después se supo que ' +
    'Malcolm Williamson, en el servicio de inteligencia británico, había llegado a lo mismo hacia 1974, pero su ' +
    'trabajo fue secreto hasta 1997. En 1985, Neal Koblitz y Victor Miller propusieron por separado usar curvas ' +
    'elípticas, unos objetos que los matemáticos estudiaban desde el siglo XIX sin ninguna aplicación a la vista.');

  p.util('Cada vez que una página web se carga con el candado de conexión segura, el navegador y el servidor hacen ' +
    'un intercambio de Diffie-Hellman con curvas elípticas para acordar la clave de la sesión. Las aplicaciones de ' +
    'mensajería cifrada lo repiten constantemente para renovar sus claves, y las firmas de las transacciones de ' +
    'muchas criptomonedas usan una curva elíptica concreta, llamada secp256k1.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  function potMod(base, e, m) { var res = 1; base %= m; while (e > 0) { if (e & 1) res = res * base % m; base = base * base % m; e = Math.floor(e / 2); } return res; }

  p.exercise({
    title: 'Un intercambio de claves',
    level: 'medio',
    gen: function (r) {
      var par = r.pick([[23, 5], [29, 2], [31, 3], [37, 2]]), P = par[0], G = par[1], a = r.int(2, 9), b = r.int(2, 9);
      var A = potMod(G, a, P), B = potMod(G, b, P);
      return { P: P, G: G, a: a, b: b, A: A, B: B, K: potMod(B, a, P), suma: potMod(G, a + b, P) };
    },
    ask: function (d) {
      return 'Alicia y Benito acuerdan $p = ' + d.P + '$ y $g = ' + d.G + '$. El secreto de Alicia es $a = ' + d.a + '$ y el de Benito, $b = ' + d.b + '$. ¿Qué número $A$ envía Alicia, qué $B$ envía Benito y cuál es la clave compartida $K$?';
    },
    fields: [{ name: 'A', label: '$A$', w: 'tiny' }, { name: 'B', label: '$B$', w: 'tiny' }, { name: 'K', label: '$K$', w: 'tiny' }],
    sol: function (d) { return { A: d.A, B: d.B, K: d.K }; },
    errores: [{ si: function (v, d) { return d.suma !== d.K && v.K === d.suma; }, msg: 'La clave no es $g^{a + b}$: es $(g^b)^a = g^{ab}$. Cada uno eleva lo que recibe a su propio secreto.' }],
    hint: function () { return ['Para calcular $g^a \\bmod p$ sin números enormes, multiplica paso a paso y quédate con el resto en cada paso.', 'La clave es $B^a \\bmod p$, que tiene que coincidir con $A^b \\bmod p$.']; },
    steps: function (d) {
      return ['$A = ' + d.G + '^{' + d.a + '} \\bmod ' + d.P + ' = ' + d.A + '$', '$B = ' + d.G + '^{' + d.b + '} \\bmod ' + d.P + ' = ' + d.B + '$',
        '$K = ' + d.B + '^{' + d.a + '} \\bmod ' + d.P + ' = ' + d.K + '$, y también $' + d.A + '^{' + d.b + '} \\bmod ' + d.P + ' = ' + potMod(d.A, d.b, d.P) + '$ ✓'];
    },
    answer: function (d) { return 'A = ' + d.A + ', B = ' + d.B + ', K = ' + d.K; }
  });

  p.exercise({
    title: 'Un logaritmo discreto a mano',
    level: 'medio',
    gen: function (r) {
      var P = r.pick([11, 13]), a = r.int(2, P - 2);
      return { P: P, a: a, A: potMod(2, a, P) };
    },
    ask: function (d) { return 'Se sabe que $2^a \\bmod ' + d.P + ' = ' + d.A + '$, con $a$ entre 1 y ' + (d.P - 2) + '. ¿Cuánto vale $a$?'; },
    fields: [{ name: 'a', label: '$a$', w: 'tiny' }],
    sol: function (d) { return { a: d.a }; },
    hint: function () { return ['No hay atajo: calcula las potencias de 2 módulo el primo, una tras otra, multiplicando cada vez por 2 y quedándote con el resto.']; },
    steps: function (d) {
      var v = 1, l = [];
      for (var k = 1; k <= d.a; k++) { v = v * 2 % d.P; l.push('2^{' + k + '} \\equiv ' + v); }
      return ['$' + l.join(',\\quad ') + '$', 'La primera potencia que da ' + d.A + ' es la de exponente <strong>' + d.a + '</strong>.', 'Con un primo de cientos de cifras, esta lista tendría más elementos que átomos hay en el universo.'];
    },
    answer: function (d) { return 'a = ' + d.a; }
  });

  /* La curva de los ejercicios: y^2 = x^3 + 2x + 2 modulo 17, con G = (5, 1), de orden 19 */
  function modP(n) { return ((n % 17) + 17) % 17; }
  function inv(n) { n = modP(n); for (var k = 1; k < 17; k++) if (n * k % 17 === 1) return k; return 0; }
  function sumaPuntos(A, B) {
    if (!A) return B; if (!B) return A;
    if (A[0] === B[0] && modP(A[1] + B[1]) === 0) return null;
    var l = A[0] === B[0] ? modP((3 * A[0] * A[0] + 2) * inv(2 * A[1])) : modP((B[1] - A[1]) * inv(B[0] - A[0]));
    var x = modP(l * l - A[0] - B[0]);
    return [x, modP(l * (A[0] - x) - A[1]), l];
  }
  function multiplo(k) { var R = null; for (var i = 0; i < k; i++) R = sumaPuntos(R, [5, 1]); return R; }

  p.exercise({
    title: 'Sumar dos puntos módulo 17',
    level: 'avanzado',
    gen: function (r) {
      var i = r.int(1, 6), j = r.int(1, 6);
      if (i === j) return null;
      var A = multiplo(i), B = multiplo(j);
      if (A[0] === B[0]) return null;
      var S = sumaPuntos([A[0], A[1]], [B[0], B[1]]);
      return { A: [A[0], A[1]], B: [B[0], B[1]], S: [S[0], S[1]], l: S[2], num: modP(B[1] - A[1]), den: modP(B[0] - A[0]), inv: inv(B[0] - A[0]) };
    },
    ask: function (d) {
      return 'En la curva $y^2 = x^3 + 2x + 2$ módulo 17, suma los puntos $P = (' + d.A.join(',\\ ') + ')$ y $Q = (' + d.B.join(',\\ ') + ')$. Da las coordenadas de $P + Q$ entre 0 y 16.';
    },
    fields: [{ name: 'x', label: '$x_3$', w: 'tiny' }, { name: 'y', label: '$y_3$', w: 'tiny' }],
    sol: function (d) { return { x: d.S[0], y: d.S[1] }; },
    errores: [{ si: function (v, d) { return Number.isInteger(v.x) && Number.isInteger(v.y) && modP(v.x) === d.S[0] && modP(v.y) === d.S[1] && (v.x !== d.S[0] || v.y !== d.S[1]); }, msg: 'Es el punto correcto, pero hay que reducir cada coordenada módulo 17, a un número entre 0 y 16.' }],
    hint: function () { return ['$\\lambda = (y_2 - y_1)\\cdot(x_2 - x_1)^{-1} \\bmod 17$. El inverso de $n$ es el número que multiplicado por $n$ da resto 1.', 'Después, $x_3 = \\lambda^2 - x_1 - x_2$ e $y_3 = \\lambda(x_1 - x_3) - y_1$, todo módulo 17.']; },
    steps: function (d) {
      return ['$y_2 - y_1 \\equiv ' + d.num + '$ y $x_2 - x_1 \\equiv ' + d.den + '$; el inverso de ' + d.den + ' módulo 17 es ' + d.inv + ', porque $' + d.den + '\\cdot ' + d.inv + ' = ' + (d.den * d.inv) + ' \\equiv 1$.',
        '$\\lambda \\equiv ' + d.num + '\\cdot ' + d.inv + ' \\equiv ' + d.l + '$',
        '$x_3 \\equiv ' + d.l + '^2 - ' + d.A[0] + ' - ' + d.B[0] + ' \\equiv ' + d.S[0] + '$, $y_3 \\equiv ' + d.l + '\\cdot(' + d.A[0] + ' - ' + d.S[0] + ') - ' + d.A[1] + ' \\equiv ' + d.S[1] + '$',
        'Comprobación: $' + d.S[1] + '^2 \\equiv ' + modP(d.S[1] * d.S[1]) + '$ y $' + d.S[0] + '^3 + 2\\cdot ' + d.S[0] + ' + 2 \\equiv ' + modP(d.S[0] * d.S[0] * d.S[0] + 2 * d.S[0] + 2) + '$ ✓'];
    },
    answer: function (d) { return '(' + d.S.join(', ') + ')'; }
  });

  p.exercise({
    title: 'Doblar un punto módulo 17',
    level: 'avanzado',
    gen: function (r) {
      var i = r.int(1, 8), A = multiplo(i);
      if (A[1] === 0) return null;
      var D = sumaPuntos([A[0], A[1]], [A[0], A[1]]);
      if (!D) return null;
      return { A: [A[0], A[1]], D: [D[0], D[1]], l: D[2], num: modP(3 * A[0] * A[0] + 2), den: modP(2 * A[1]), inv: inv(2 * A[1]) };
    },
    ask: function (d) { return 'En la curva $y^2 = x^3 + 2x + 2$ módulo 17 (aquí $a = 2$), calcula $2P = P + P$ para $P = (' + d.A.join(',\\ ') + ')$. Da las coordenadas entre 0 y 16.'; },
    fields: [{ name: 'x', label: '$x_3$', w: 'tiny' }, { name: 'y', label: '$y_3$', w: 'tiny' }],
    sol: function (d) { return { x: d.D[0], y: d.D[1] }; },
    errores: [{ si: function (v, d) { return Number.isInteger(v.x) && Number.isInteger(v.y) && modP(v.x) === d.D[0] && modP(v.y) === d.D[1] && (v.x !== d.D[0] || v.y !== d.D[1]); }, msg: 'Es el punto correcto, pero hay que reducir cada coordenada módulo 17, a un número entre 0 y 16.' }],
    hint: function () { return ['Al doblar se usa la tangente: $\\lambda = (3x_1^2 + a)\\cdot(2y_1)^{-1} \\bmod 17$.', 'Después, $x_3 = \\lambda^2 - 2x_1$ e $y_3 = \\lambda(x_1 - x_3) - y_1$.']; },
    steps: function (d) {
      return ['$3x_1^2 + 2 \\equiv ' + d.num + '$ y $2y_1 \\equiv ' + d.den + '$, con inverso ' + d.inv + '.', '$\\lambda \\equiv ' + d.num + '\\cdot ' + d.inv + ' \\equiv ' + d.l + '$',
        '$x_3 \\equiv ' + d.l + '^2 - 2\\cdot ' + d.A[0] + ' \\equiv ' + d.D[0] + '$, $y_3 \\equiv ' + d.l + '\\cdot(' + d.A[0] + ' - ' + d.D[0] + ') - ' + d.A[1] + ' \\equiv ' + d.D[1] + '$'];
    },
    answer: function (d) { return '(' + d.D.join(', ') + ')'; }
  });

  p.keys([
    'Diffie-Hellman: se envían $g^a$ y $g^b$ módulo $p$ en público, y los dos calculan $g^{ab}$ sin transmitirlo nunca.',
    'La seguridad descansa en el logaritmo discreto: dado $g^a \\bmod p$, no se conoce forma eficiente de hallar $a$.',
    'Los puntos de una curva elíptica se suman con una recta: el tercer corte, reflejado. Forman un grupo.',
    'Con curvas elípticas se consigue la misma seguridad con claves mucho más cortas, y por eso las usa casi toda la criptografía actual.'
  ]);
});
