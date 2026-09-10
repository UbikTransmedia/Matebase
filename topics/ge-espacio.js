/* Tema: Rectas y planos en el espacio */
Course.topic('ge-espacio', function (p) {

  /* utilidades del tema */
  function cruz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function esc(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function suma(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function resta(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function por(k, a) { return [k * a[0], k * a[1], k * a[2]]; }
  function nulo(a) { return !a[0] && !a[1] && !a[2]; }
  function vt(a) { return '(' + a.join(',\\ ') + ')'; }
  function menos(letra, a) { return a === 0 ? letra : letra + (a > 0 ? ' - ' + a : ' + ' + (-a)); }
  /** Ax + By + Cz + D = 0 bien escrito, sin «+ -» ni «0y». */
  function planoTex(n, D) {
    var s = ML.termTex(n[0], 'x', 1, true);
    s += ML.termTex(n[1], 'y', 1, s === '');
    s += ML.termTex(n[2], 'z', 1, s === '');
    s += ML.termTex(D, '', 0, s === '');
    return (s || '0') + ' = 0';
  }
  function paramTex(P, v, par) {
    par = par || '\\lambda';
    return '\\begin{cases} x = ' + P[0] + ML.termTex(v[0], par, 1, false) + ' \\\\ y = ' + P[1] +
      ML.termTex(v[1], par, 1, false) + ' \\\\ z = ' + P[2] + ML.termTex(v[2], par, 1, false) + '\\end{cases}';
  }
  function continuaTex(P, v) {
    return '\\frac{' + menos('x', P[0]) + '}{' + v[0] + '} = \\frac{' + menos('y', P[1]) + '}{' + v[1] + '} = \\frac{' + menos('z', P[2]) + '}{' + v[2] + '}';
  }
  /** Rango de una matriz pequeña, por eliminación. */
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
  function proporcional(a, b) {
    return nulo(cruz(a, b)) && !nulo(a) && !nulo(b);
  }

  p.text('Con los [[ge-espacio-vectores|vectores del espacio]] ya se pueden escribir los dos objetos ' +
    'con los que se construye toda la geometría del espacio: la <strong>recta</strong> y el ' +
    '<strong>plano</strong>. La idea es la misma que en el [[ge-rectas|plano]]: un punto para fijar ' +
    'dónde está y uno o dos vectores para decir hacia dónde se extiende.');

  p.text('Y la pregunta central del tema, cómo están colocados unos respecto de otros, no se resuelve ' +
    'dibujando —en el papel dos rectas que se cruzan parecen cortarse— sino con una herramienta que ya ' +
    'tienes: el <strong>rango</strong> de una matriz y el teorema de [[al-discusion|Rouché-Frobenius]].');

  /* ---------------------------------------------------------------- */
  p.section('La recta: un punto y una dirección');

  p.text('Una recta queda fijada por un punto $P(p_1, p_2, p_3)$ y un <strong>vector director</strong> ' +
    '$\\vec{v} = (v_1, v_2, v_3)$. Cada valor del parámetro $\\lambda$ da un punto de la recta: se sale ' +
    'de $P$ y se avanza $\\lambda$ veces el vector.');

  p.formulas([
    '(x, y, z) = (p_1, p_2, p_3) + \\lambda\\,(v_1, v_2, v_3) \\quad \\text{(vectorial)}',
    '\\begin{cases} x = p_1 + \\lambda v_1 \\\\ y = p_2 + \\lambda v_2 \\\\ z = p_3 + \\lambda v_3 \\end{cases} \\quad \\text{(paramétricas)}',
    '\\frac{x - p_1}{v_1} = \\frac{y - p_2}{v_2} = \\frac{z - p_3}{v_3} \\quad \\text{(continua)}',
    '\\begin{cases} A_1x + B_1y + C_1z + D_1 = 0 \\\\ A_2x + B_2y + C_2z + D_2 = 0 \\end{cases} \\quad \\text{(implícitas: corte de dos planos)}'
  ], 'cuatro formas de escribir la misma recta',
    'La $\\lambda$ es la letra griega lambda y hace de «parámetro»: un número que se mueve y va dando ' +
      'puntos.<br><br>La <strong>continua</strong> sale de despejar $\\lambda$ en las tres paramétricas ' +
      'e igualar. Cuidado con los signos: $\\frac{x+2}{3}$ quiere decir que $p_1 = -2$.<br><br>Las ' +
      '<strong>implícitas</strong> son dos ecuaciones de plano a la vez: la recta es donde se cortan. ' +
      'Para volver a punto y vector, el director es $\\vec{n}_1\\times\\vec{n}_2$ (perpendicular a las ' +
      'dos normales) y un punto se saca dando un valor a una incógnita y resolviendo el sistema 2×2.');

  p.demo({
    title: 'Recorrer una recta con el parámetro',
    intro: 'Mueve λ y el punto X recorre la recta: cada valor del parámetro es un punto. Gira el dibujo para convencerte de que es una recta de verdad y no un trazo en el papel.',
    build: function (host) {
      var P = [1, -2, 1], v = [2, 1, 2], lam = 1;
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 5, height: 360,
        aria: 'Una recta del espacio que pasa por el punto P con vector director v, y un punto X que la recorre según el parámetro lambda',
        draw: function (g) {
          g.linea(P, v, { color: 0, w: 2.2 });
          g.vec(P, suma(P, v), { color: 1, w: 3, label: 'v' });
          var X = suma(P, por(lam, v));
          g.seg([X[0], X[1], 0], X, { color: 'axis', dash: [3, 4], w: 1 });
          g.punto(P, { color: 0, label: 'P' });
          g.punto(X, { color: 2, label: 'X' });
        }
      });
      function pinta() {
        var X = suma(P, por(lam, v));
        out.set('$\\lambda = ' + U.fmt(lam, 2) + '$ &nbsp;→&nbsp; $X = (1 + 2\\lambda,\\ -2 + \\lambda,\\ 1 + 2\\lambda) = (' +
          U.fmt(X[0], 2) + ',\\ ' + U.fmt(X[1], 2) + ',\\ ' + U.fmt(X[2], 2) + ')$');
        vista.render();
      }
      W.slider(W.row(host), { label: 'parámetro λ', min: -3, max: 2, step: 0.05, value: lam, on: function (x) { lam = x; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El plano: un punto y un vector normal');

  p.text('Un plano queda fijado por un punto y <strong>dos</strong> vectores directores no paralelos, o, ' +
    'mucho más cómodo, por un punto y un <strong>vector normal</strong> $\\vec{n}$, perpendicular a él. ' +
    'Un punto $X$ está en el plano exactamente cuando $\\overrightarrow{PX}$ es perpendicular a ' +
    '$\\vec{n}$, es decir, cuando $\\vec{n}\\cdot\\overrightarrow{PX} = 0$. Desarrollando esa condición ' +
    'sale la ecuación general.');

  p.formulas([
    '(x, y, z) = P + \\lambda\\,\\vec{u} + \\mu\\,\\vec{v} \\quad \\text{(vectorial)}',
    'Ax + By + Cz + D = 0, \\qquad \\vec{n} = (A, B, C) \\quad \\text{(general)}'
  ], 'dos formas de escribir un plano',
    'La $\\mu$ es la letra mu: un plano necesita <strong>dos</strong> parámetros, porque se extiende en ' +
      'dos direcciones.<br><br>En la general, los coeficientes de $x$, $y$ y $z$ son directamente las ' +
      'coordenadas del vector normal. Y $D$ se calcula obligando a que el plano pase por un punto ' +
      'conocido.');

  p.list([
    '<strong>Por tres puntos</strong> $A$, $B$, $C$: normal $\\vec{n} = \\overrightarrow{AB}\\times\\overrightarrow{AC}$ y se sustituye $A$ para hallar $D$.',
    '<strong>Por un punto y conteniendo una recta</strong>: los directores son el de la recta y el vector que va del punto a un punto de la recta.',
    '<strong>Que contiene una recta y es paralelo a otra</strong>: normal $\\vec{n} = \\vec{u}\\times\\vec{v}$ con los directores de las dos.'
  ]);

  p.demo({
    title: 'El plano que pasa por tres puntos',
    intro: 'A y B están fijos en los ejes; mueve C. El producto vectorial de dos lados del triángulo da la normal, y con ella la ecuación. Gira el dibujo para ver la normal de perfil: es perpendicular a todo el plano, no solo al triángulo.',
    build: function (host) {
      var A = [3, 0, 0], B = [0, 3, 0], C = [0, 0, 2];
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 4, height: 380,
        aria: 'El plano determinado por tres puntos A, B y C, con el triángulo que forman y su vector normal',
        draw: function (g) {
          var n = cruz(resta(B, A), resta(C, A)), D = -esc(n, A);
          if (nulo(n)) return;
          g.plano(n, D, { color: 0, fillAlpha: 0.12, w: 0.8 });
          g.poli([A, B, C], { color: 2, fillAlpha: 0.3, w: 1.6 });
          var G = por(1 / 3, suma(suma(A, B), C));
          var m = Math.sqrt(esc(n, n));
          g.vec(G, suma(G, por(1.6 / m, n)), { color: 4, w: 3, label: 'n' });
          g.punto(A, { color: 2, label: 'A' });
          g.punto(B, { color: 2, label: 'B' });
          g.punto(C, { color: 2, label: 'C' });
        }
      });
      function pinta() {
        var AB = resta(B, A), AC = resta(C, A), n = cruz(AB, AC);
        if (nulo(n)) {
          out.set('<strong style="color:var(--bad)">Los tres puntos están alineados: hay infinitos planos que los contienen.</strong>');
        } else {
          var D = -esc(n, A);
          out.set('$\\overrightarrow{AB} = ' + vt(AB) + '$, $\\overrightarrow{AC} = ' + vt(AC) + '$<br>' +
            '$\\vec{n} = \\overrightarrow{AB}\\times\\overrightarrow{AC} = ' + vt(n) + '$<br>' +
            'Pasa por $A$: $D = -\\vec{n}\\cdot A = ' + D + '$ &nbsp;→&nbsp; $\\pi:\\ ' + planoTex(n, D) + '$');
        }
        vista.render();
      }
      var fila = W.row(host);
      ['x', 'y', 'z'].forEach(function (nom, i) {
        W.slider(fila, { label: 'C: ' + nom, min: -3, max: 3, step: 1, value: C[i], on: function (x) { C[i] = x; pinta(); } });
      });
      pinta();
    }
  });

  p.hist('Durante años, la manera de representar el espacio en un papel fue un secreto militar. Gaspard ' +
    'Monge, profesor en la escuela de ingenieros de Mézières, encontró hacia 1765 un método para ' +
    'resolver sobre planos dibujados los problemas de fortificación que los oficiales resolvían con ' +
    'cálculos larguísimos: proyectar cada objeto sobre dos planos perpendiculares. El ejército francés ' +
    'lo declaró reservado, y la <em>geometría descriptiva</em> no se enseñó en público hasta 1795. ' +
    'El propio Monge fue de los primeros en escribir sistemáticamente planos y rectas con ecuaciones, ' +
    'que es lo que hace este tema: sustituir el dibujo por el cálculo.');

  /* ---------------------------------------------------------------- */
  p.section('Posiciones relativas: el rango lo decide');

  p.text('Dos planos, una recta y un plano, dos rectas: en todos los casos se trata de un sistema de ' +
    'ecuaciones, y cómo están colocados es lo mismo que <strong>cuántas soluciones</strong> tiene. Por ' +
    'eso la clasificación sale de comparar rangos, como en [[al-discusion|Rouché-Frobenius]]: la ' +
    'matriz de coeficientes $M$ y la ampliada $M^*$.');

  p.sub('Dos planos');
  p.table(['$\\operatorname{rg} M$', '$\\operatorname{rg} M^*$', 'Posición', 'Cómo se reconoce'],
    [['2', '2', 'se cortan en una recta', 'las normales no son paralelas'],
     ['1', '2', 'paralelos', 'normales paralelas, $D$ no proporcional'],
     ['1', '1', 'coincidentes', 'las dos ecuaciones son proporcionales']]);

  p.sub('Una recta y un plano');
  p.text('Con la recta en forma de punto $P$ y director $\\vec{v}$, y el plano con normal $\\vec{n}$, ' +
    'no hace falta montar ninguna matriz: basta el producto escalar.');
  p.table(['Condición', 'Posición'],
    [['$\\vec{v}\\cdot\\vec{n} \\ne 0$', 'la recta <strong>corta</strong> al plano en un punto'],
     ['$\\vec{v}\\cdot\\vec{n} = 0$ y $P \\notin \\pi$', 'la recta es <strong>paralela</strong> al plano'],
     ['$\\vec{v}\\cdot\\vec{n} = 0$ y $P \\in \\pi$', 'la recta está <strong>contenida</strong> en el plano']]);

  p.sub('Dos rectas');
  p.text('Aquí aparece la posibilidad que no existe en el plano: dos rectas que ni se cortan ni son ' +
    'paralelas. <strong>Se cruzan</strong>, como una calle y un puente que pasa por encima. Con ' +
    '$r$ por $P$ con director $\\vec{u}$ y $s$ por $Q$ con director $\\vec{v}$:');
  p.table(['$\\operatorname{rg}(\\vec u, \\vec v)$', '$\\operatorname{rg}(\\vec u, \\vec v, \\overrightarrow{PQ})$', 'Posición'],
    [['1', '1', 'coincidentes'],
     ['1', '2', 'paralelas'],
     ['2', '2 (el determinante vale 0)', '<strong>se cortan</strong> en un punto'],
     ['2', '3 (el determinante no es 0)', '<strong>se cruzan</strong>']]);

  p.formula('r \\text{ y } s \\text{ se cruzan} \\iff \\left[\\vec{u},\\ \\vec{v},\\ \\overrightarrow{PQ}\\right] \\ne 0',
    'el criterio de las rectas que se cruzan',
    'Se dice: <em>«r y s se cruzan si y solo si el producto mixto de u, v y pe cu no es cero»</em>.<br><br>' +
      'Por qué: si las rectas se cortaran o fueran paralelas, estarían en un mismo plano, y entonces ' +
      'los tres vectores —los dos directores y el que une un punto de cada una— serían coplanarios, con ' +
      'producto mixto cero. Si no lo es, no hay plano que contenga a las dos.');

  p.demo({
    title: 'Cortarse, cruzarse o ser paralelas',
    intro: 'La recta r es el eje x. La recta s pasa a una altura h y está girada un ángulo θ. Con h = 0 las dos se cortan; con θ = 0 son paralelas; con las dos cosas distintas de cero, se cruzan. Gira el dibujo: de frente parecen cortarse siempre.',
    build: function (host) {
      var h = 2, th = 60;
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 4, height: 380,
        aria: 'Dos rectas del espacio: el eje x y otra recta a una altura h, girada un ángulo theta, con el segmento perpendicular que las une',
        draw: function (g) {
          var a = th * Math.PI / 180;
          var v = [Math.cos(a), Math.sin(a), 0];
          g.linea([0, 0, 0], [1, 0, 0], { color: 0, w: 2.6 });
          g.linea([0, 0, h], v, { color: 1, w: 2.6 });
          if (h !== 0) g.seg([0, 0, 0], [0, 0, h], { color: 3, dash: [5, 4], w: 2 });
          g.texto([3.4, 0, 0.35], 'r', { color: 0, italic: true, size: 15 });
          g.texto(suma([0, 0, h], por(3.4, v)), 's', { color: 1, italic: true, size: 15 });
        }
      });
      function pinta() {
        var a = th * Math.PI / 180;
        var u = [1, 0, 0], v = [Math.cos(a), Math.sin(a), 0], PQ = [0, 0, h];
        var r2 = rango([u, v]), r3 = rango([u, v, PQ]);
        var det = ML.det3([u, v, PQ]);
        var pos = r2 === 1 ? (r3 === 1 ? 'coincidentes' : 'paralelas') : (Math.abs(det) < 1e-9 ? 'se cortan' : 'se cruzan');
        out.set('$\\vec{u} = (1,\\ 0,\\ 0)$, $\\vec{v} = (' + U.fmt(v[0], 2) + ',\\ ' + U.fmt(v[1], 2) + ',\\ 0)$, $\\overrightarrow{PQ} = (0,\\ 0,\\ ' + U.fmt(h, 1) + ')$<br>' +
          '$\\operatorname{rg}(\\vec u,\\vec v) = ' + r2 + '$ &nbsp;·&nbsp; $[\\vec u,\\vec v,\\overrightarrow{PQ}] = ' + U.fmt(det, 3) + '$<br>' +
          'Posición: <strong>' + pos + '</strong>' + (pos === 'se cruzan' ? ' — la distancia entre ellas es $|h| = ' + U.fmt(Math.abs(h), 1) + '$' : ''));
        vista.render();
      }
      var fila = W.row(host);
      W.slider(fila, { label: 'altura h de s', min: -3, max: 3, step: 0.5, value: h, on: function (x) { h = x; pinta(); } });
      W.slider(fila, { label: 'giro θ de s (grados)', min: 0, max: 180, step: 15, value: th, on: function (x) { th = x; pinta(); } });
      pinta();
    }
  });

  p.sub('Tres planos');
  p.text('Tres planos son un sistema de tres ecuaciones con tres incógnitas, y sus posiciones son ' +
    'exactamente los casos de la discusión de un sistema:');
  p.table(['$\\operatorname{rg} M$', '$\\operatorname{rg} M^*$', 'Posición'],
    [['3', '3', 'se cortan en <strong>un punto</strong> (sistema compatible determinado)'],
     ['2', '2', 'tienen <strong>una recta común</strong>: forman parte de un haz (indeterminado)'],
     ['2', '3', 'se cortan <strong>dos a dos</strong> formando un prisma, o dos son paralelos y el tercero los corta (incompatible)'],
     ['1', '2', 'tres planos <strong>paralelos</strong>, o dos coincidentes y uno paralelo'],
     ['1', '1', 'los tres <strong>coincidentes</strong>']]);

  p.demo({
    title: 'Las cinco maneras de colocar tres planos',
    intro: 'Elige una configuración y gira el dibujo. Debajo, los rangos que la delatan: el dibujo y la cuenta cuentan la misma historia.',
    build: function (host) {
      var CASOS = {
        punto: { t: 'un punto común', p: [[[1, 0, 0], -1], [[0, 1, 0], -1], [[0, 0, 1], -1]] },
        haz: { t: 'una recta común', p: [[[1, 0, 0], -1], [[1, 1, 0], -1], [[1, -1, 0], -1]] },
        prisma: { t: 'se cortan dos a dos', p: [[[1, 0, 0], -1.5], [[0, 1, 0], -1.5], [[1, 1, 0], 1]] },
        dos: { t: 'dos paralelos y uno que los corta', p: [[[0, 0, 1], -1.5], [[0, 0, 1], 1.5], [[1, 0, 0], 0]] },
        paralelos: { t: 'tres paralelos', p: [[[0, 0, 1], -2], [[0, 0, 1], 0], [[0, 0, 1], 2]] }
      };
      var caso = 'punto';
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 3, height: 380,
        aria: 'Tres planos del espacio en la configuración elegida',
        draw: function (g) {
          CASOS[caso].p.forEach(function (pl, i) {
            g.plano(pl[0], pl[1], { color: i, fillAlpha: 0.16, w: 1.2 });
          });
        }
      });
      function pinta() {
        var M = CASOS[caso].p.map(function (pl) { return pl[0]; });
        var Ma = CASOS[caso].p.map(function (pl) { return pl[0].concat([-pl[1]]); });
        out.set('Ecuaciones: ' + CASOS[caso].p.map(function (pl) { return '$' + planoTex(pl[0], pl[1]) + '$'; }).join(' &nbsp;·&nbsp; ') + '<br>' +
          '$\\operatorname{rg} M = ' + rango(M) + '$, $\\operatorname{rg} M^* = ' + rango(Ma) + '$ &nbsp;→&nbsp; <strong>' + CASOS[caso].t + '</strong>');
        vista.render();
      }
      W.chips(host, Object.keys(CASOS).map(function (k) { return { label: CASOS[k].t, value: k }; }),
        { value: caso, on: function (v) { caso = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Haces de planos');

  p.text('Todos los planos que contienen a una misma recta forman un <strong>haz</strong>. Si la recta ' +
    'viene dada como corte de dos planos $\\pi_1$ y $\\pi_2$, cualquier plano del haz se escribe ' +
    'mezclando sus ecuaciones:');

  p.formula('\\alpha\\,(A_1x + B_1y + C_1z + D_1) + \\beta\\,(A_2x + B_2y + C_2z + D_2) = 0',
    'haz de planos de arista r',
    'Las letras griegas $\\alpha$ (alfa) y $\\beta$ (beta) son dos números cualesquiera, no los dos a ' +
      'la vez cero.<br><br>Por qué funciona: si un punto cumple las dos ecuaciones, cumple también ' +
      'cualquier mezcla de ellas. Así que cada plano de esta familia contiene la recta, y dando valores ' +
      'a $\\alpha$ y $\\beta$ se consiguen todos.<br><br>Es el atajo para problemas del tipo «el plano ' +
      'que contiene a $r$ y pasa por el punto $Q$»: se sustituye $Q$ y se despeja la proporción entre ' +
      '$\\alpha$ y $\\beta$.');

  p.util('Estas cuentas son las que hace, millones de veces por segundo, un programa que dibuja en tres ' +
    'dimensiones. Para saber qué se ve en cada píxel se lanza una recta desde el ojo y se busca dónde ' +
    'corta a los planos de la escena: es exactamente el caso «recta y plano» de este tema, y está ' +
    'resuelto con código en [[gfx-trazado]]. Las impresoras 3D hacen lo contrario: cortan la pieza con ' +
    'planos horizontales, capa a capa. Y en robótica, saber si dos brazos articulados pueden chocar ' +
    'empieza por saber si las rectas de sus ejes se cortan o se cruzan.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Punto y vector director desde la continua',
    level: 'basico',
    gen: function (r) {
      var P = [r.pm(0, 6), r.pm(0, 6), r.pm(0, 6)];
      var v = [r.pm(1, 5), r.pm(1, 5), r.pm(1, 5)];
      return { P: P, v: v };
    },
    ask: function (d) {
      return 'De la recta $r:\\ ' + continuaTex(d.P, d.v) + '$ da un punto y un vector director.';
    },
    fields: [
      { name: 'p1', label: '$p_1$', w: 'tiny' }, { name: 'p2', label: '$p_2$', w: 'tiny' }, { name: 'p3', label: '$p_3$', w: 'tiny' },
      { name: 'v1', label: '$v_1$', w: 'tiny' }, { name: 'v2', label: '$v_2$', w: 'tiny' }, { name: 'v3', label: '$v_3$', w: 'tiny' }
    ],
    sol: function (d) { return { p1: d.P[0], p2: d.P[1], p3: d.P[2], v1: d.v[0], v2: d.v[1], v3: d.v[2] }; },
    check: function (v, d) {
      var X = [v.p1, v.p2, v.p3], w = [v.v1, v.v2, v.v3];
      if (X.concat(w).some(isNaN)) return { ok: false, msg: 'Rellena las seis casillas.' };
      var okV = proporcional(w, d.v);
      var okP = nulo(cruz(resta(X, d.P), d.v));      // cualquier punto de la recta vale
      return {
        ok: okV && okP, fields: { p1: okP, p2: okP, p3: okP, v1: okV, v2: okV, v3: okV },
        msg: okV && okP ? '<strong>¡Correcto!</strong> Cualquier otro punto de la recta y cualquier múltiplo del vector también valían.' : null
      };
    },
    errores: [{
      si: function (v, d) { return v.p1 === -d.P[0] && v.p2 === -d.P[1] && v.p3 === -d.P[2] && !(d.P[0] === 0 && d.P[1] === 0 && d.P[2] === 0); },
      msg: 'Los signos del punto están al revés: en $\\frac{x - p_1}{v_1}$ lo que aparece restando es $p_1$, así que $x + 3$ significa $p_1 = -3$.'
    }],
    hint: function () {
      return ['La forma continua es $\\frac{x - p_1}{v_1} = \\frac{y - p_2}{v_2} = \\frac{z - p_3}{v_3}$.',
        'Los numeradores dan el punto <strong>con el signo cambiado</strong>; los denominadores, el vector.'];
    },
    steps: function (d) {
      return ['Se compara con $\\frac{x - p_1}{v_1} = \\frac{y - p_2}{v_2} = \\frac{z - p_3}{v_3}$.',
        'Punto: $P' + vt(d.P) + '$. Vector director: $\\vec{v} = ' + vt(d.v) + '$.',
        'Cualquier múltiplo de $\\vec v$ y cualquier otro punto de la recta serían igual de válidos.'];
    },
    answer: function (d) { return '$P' + vt(d.P) + '$, $\\vec v = ' + vt(d.v) + '$'; }
  });

  p.exercise({
    title: 'El plano que pasa por tres puntos',
    level: 'medio',
    gen: function (r) {
      var A = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      var AB = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)], AC = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var n = cruz(AB, AC);
      if (nulo(n)) return null;
      return { A: A, B: suma(A, AB), C: suma(A, AC), AB: AB, AC: AC, n: n, D: -esc(n, A) };
    },
    ask: function (d) {
      return 'Halla la ecuación general $Ax + By + Cz + D = 0$ del plano que pasa por $A' + vt(d.A) + '$, $B' + vt(d.B) +
        '$ y $C' + vt(d.C) + '$.';
    },
    fields: [{ name: 'A', label: 'A', w: 'tiny' }, { name: 'B', label: 'B', w: 'tiny' }, { name: 'C', label: 'C', w: 'tiny' }, { name: 'D', label: 'D', w: 'tiny' }],
    sol: function (d) { return { A: d.n[0], B: d.n[1], C: d.n[2], D: d.D }; },
    check: function (v, d) {
      var n = [v.A, v.B, v.C];
      if ([v.A, v.B, v.C, v.D].some(isNaN)) return { ok: false, msg: 'Rellena los cuatro coeficientes.' };
      if (nulo(n)) return { ok: false, msg: 'El vector normal $(A, B, C)$ no puede ser el cero.' };
      var okN = proporcional(n, d.n);
      var okP = [d.A, d.B, d.C].every(function (X) { return Math.abs(esc(n, X) + v.D) < 1e-9; });
      return {
        ok: okN && okP, fields: { A: okN, B: okN, C: okN, D: okP },
        msg: okN && !okP ? 'La normal está bien, pero el plano no pasa por los tres puntos: recalcula $D$ sustituyendo uno de ellos.' : null
      };
    },
    hint: function () {
      return ['Dos vectores del plano: $\\overrightarrow{AB}$ y $\\overrightarrow{AC}$.',
        'Su producto vectorial es un vector normal $(A, B, C)$.',
        'Para $D$, obliga a que el plano pase por $A$: $D = -(A a_1 + B a_2 + C a_3)$.'];
    },
    steps: function (d) {
      return ['$\\overrightarrow{AB} = ' + vt(d.AB) + '$, $\\overrightarrow{AC} = ' + vt(d.AC) + '$',
        '$\\vec{n} = \\overrightarrow{AB}\\times\\overrightarrow{AC} = ' + vt(d.n) + '$',
        'Sustituyendo $A$: $D = -(' + esc(d.n, d.A) + ') = ' + d.D + '$',
        '$\\pi:\\ ' + planoTex(d.n, d.D) + '$ (cualquier ecuación proporcional es el mismo plano)'];
    },
    answer: function (d) { return '$' + planoTex(d.n, d.D) + '$'; }
  });

  p.exercise({
    title: 'Director de una recta dada como corte de dos planos',
    level: 'medio',
    gen: function (r) {
      var n1 = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)], n2 = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var v = cruz(n1, n2);
      if (nulo(v)) return null;
      return { n1: n1, n2: n2, D1: r.pm(0, 5), D2: r.pm(0, 5), v: v };
    },
    ask: function (d) {
      return 'Halla un vector director de la recta $r:\\ \\begin{cases} ' + planoTex(d.n1, d.D1) + ' \\\\ ' + planoTex(d.n2, d.D2) + '\\end{cases}$';
    },
    fields: [{ name: 'a', label: '$v_1$', w: 'tiny' }, { name: 'b', label: '$v_2$', w: 'tiny' }, { name: 'c', label: '$v_3$', w: 'tiny' }],
    sol: function (d) { return { a: d.v[0], b: d.v[1], c: d.v[2] }; },
    check: function (v, d) {
      var w = [v.a, v.b, v.c];
      if (w.some(isNaN)) return { ok: false, msg: 'Rellena las tres componentes.' };
      return proporcional(w, d.v);
    },
    hint: function () {
      return ['La recta está en los dos planos, así que su dirección es perpendicular a las dos normales.',
        'Un vector perpendicular a dos a la vez: el producto vectorial $\\vec{n}_1\\times\\vec{n}_2$.'];
    },
    steps: function (d) {
      return ['Normales: $\\vec{n}_1 = ' + vt(d.n1) + '$ y $\\vec{n}_2 = ' + vt(d.n2) + '$.',
        '$\\vec{v} = \\vec{n}_1\\times\\vec{n}_2 = ' + vt(d.v) + '$ (o cualquier múltiplo).'];
    },
    answer: function (d) { return '$' + vt(d.v) + '$'; }
  });

  p.exercise({
    title: 'Posición de una recta y un plano',
    level: 'medio',
    gen: function (r) {
      var n = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      if (nulo(n)) return null;
      var P = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
      var tipo = r.pick(['corta', 'paralela', 'contenida']);
      var v;
      if (tipo === 'corta') {
        v = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
        if (esc(v, n) === 0) return null;
      } else {
        v = cruz(n, [r.pm(0, 2), r.pm(0, 2), r.pm(0, 2)]);
        if (nulo(v) || Math.max(Math.abs(v[0]), Math.abs(v[1]), Math.abs(v[2])) > 9) return null;
      }
      var D = -esc(n, P) + (tipo === 'paralela' ? r.pm(1, 5) : 0);
      return { n: n, P: P, v: v, D: D, tipo: tipo, vn: esc(v, n), sust: esc(n, P) + D };
    },
    ask: function (d) {
      return 'Estudia la posición relativa de la recta $r:\\ ' + paramTex(d.P, d.v) + '$ y el plano $\\pi:\\ ' + planoTex(d.n, d.D) + '$.';
    },
    fields: [{
      name: 't', label: 'La recta', opts: [
        { t: 'corta al plano en un punto', v: 'corta' },
        { t: 'es paralela al plano', v: 'paralela' },
        { t: 'está contenida en el plano', v: 'contenida' }]
    }],
    sol: function (d) { return { t: d.tipo }; },
    hint: function () {
      return ['Compara el vector director de la recta con el vector normal del plano.',
        'Si $\\vec v\\cdot\\vec n \\ne 0$, se cortan. Si vale 0, mira si el punto de la recta cumple la ecuación del plano.'];
    },
    steps: function (d) {
      var s = ['$\\vec{v} = ' + vt(d.v) + '$, $\\vec{n} = ' + vt(d.n) + '$, $\\vec v\\cdot\\vec n = ' + d.vn + '$.'];
      if (d.vn !== 0) s.push('No es cero: la recta no es paralela al plano, así que lo <strong>corta en un punto</strong>.');
      else {
        s.push('Es cero: la recta es paralela al plano o está dentro. Se prueba el punto $P' + vt(d.P) + '$ en la ecuación: sale $' + d.sust + '$.');
        s.push(d.sust === 0 ? 'Lo cumple: la recta está <strong>contenida</strong> en el plano.' : 'No lo cumple: la recta es <strong>paralela</strong> al plano.');
      }
      return s;
    },
    answer: function (d) { return { corta: 'Se cortan en un punto', paralela: 'Paralela', contenida: 'Contenida' }[d.tipo]; }
  });

  p.exercise({
    title: 'Posición de dos planos',
    level: 'basico',
    gen: function (r) {
      var n1 = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      if (nulo(n1)) return null;
      var D1 = r.pm(0, 6), tipo = r.pick(['cortan', 'paralelos', 'coincidentes']), k = r.pick([-2, 2, 3, -1]);
      var n2, D2;
      if (tipo === 'cortan') {
        n2 = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
        if (nulo(n2) || proporcional(n1, n2)) return null;
        D2 = r.pm(0, 6);
      } else {
        n2 = por(k, n1);
        D2 = k * D1 + (tipo === 'paralelos' ? r.pm(1, 4) : 0);
      }
      return { n1: n1, D1: D1, n2: n2, D2: D2, tipo: tipo, k: k };
    },
    ask: function (d) {
      return '¿Cómo están colocados $\\pi_1:\\ ' + planoTex(d.n1, d.D1) + '$ y $\\pi_2:\\ ' + planoTex(d.n2, d.D2) + '$?';
    },
    fields: [{ name: 't', label: 'Los planos', opts: [{ t: 'Se cortan en una recta', v: 'cortan' }, { t: 'Son paralelos', v: 'paralelos' }, { t: 'Son coincidentes', v: 'coincidentes' }] }],
    sol: function (d) { return { t: d.tipo }; },
    hint: function () { return ['Mira primero si las normales son proporcionales.', 'Si lo son, mira si también lo es el término independiente.']; },
    steps: function (d) {
      if (d.tipo === 'cortan') return ['Las normales $' + vt(d.n1) + '$ y $' + vt(d.n2) + '$ no son proporcionales: $\\operatorname{rg} M = 2$, los planos <strong>se cortan en una recta</strong>.'];
      return ['La normal de $\\pi_2$ es $' + d.k + '$ veces la de $\\pi_1$: $\\operatorname{rg} M = 1$.',
        d.tipo === 'coincidentes' ? 'Y el término independiente también está multiplicado por $' + d.k + '$: son la misma ecuación, <strong>coincidentes</strong>.'
          : 'Pero el término independiente no guarda esa proporción: $\\operatorname{rg} M^* = 2$, <strong>paralelos</strong>.'];
    },
    answer: function (d) { return { cortan: 'Se cortan en una recta', paralelos: 'Paralelos', coincidentes: 'Coincidentes' }[d.tipo]; }
  });

  p.problem({
    title: 'Dos rectas y el plano que las acompaña',
    level: 'avanzado',
    gen: function (r) {
      var P = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      var u = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)], v = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var n = cruz(u, v);
      if (nulo(n) || nulo(u) || nulo(v)) return null;
      var Q;
      if (r.bool(0.45)) Q = suma(suma(P, por(r.pick([-2, -1, 1, 2]), u)), por(r.pick([-1, 1, 2]), v));
      else Q = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
      if (Math.max.apply(null, Q.map(Math.abs)) > 9) return null;
      var PQ = resta(Q, P), det = ML.det3([u, v, PQ]);
      return { P: P, u: u, Q: Q, v: v, PQ: PQ, det: det, n: n, D: -esc(n, P), pos: det === 0 ? 'cortan' : 'cruzan' };
    },
    intro: function (d) {
      return 'Se consideran las rectas $r:\\ (x,y,z) = ' + vt(d.P) + ' + \\lambda' + vt(d.u) + '$ y $s:\\ (x,y,z) = ' +
        vt(d.Q) + ' + \\mu' + vt(d.v) + '$.';
    },
    partes: [
      {
        ask: function () { return 'Calcula el producto mixto $[\\vec{u},\\vec{v},\\overrightarrow{PQ}]$, siendo $P$ y $Q$ los puntos que aparecen en las ecuaciones.'; },
        fields: [{ name: 'm', label: 'producto mixto', w: 'tiny' }],
        sol: function (d) { return { m: d.det }; },
        errores: [{
          si: function (v, d) { return d.det !== 0 && v.m === -d.det; },
          msg: 'El valor absoluto está bien pero el signo no: revisa $\\overrightarrow{PQ} = Q - P$ (extremo menos origen) o el orden de las filas.'
        }],
        hint: function () { return ['$\\overrightarrow{PQ} = Q - P$.', 'Monta el determinante con $\\vec u$, $\\vec v$ y $\\overrightarrow{PQ}$ por filas.']; },
        steps: function (d) {
          return ['$\\vec{u} = ' + vt(d.u) + '$, $\\vec{v} = ' + vt(d.v) + '$, $\\overrightarrow{PQ} = ' + vt(d.PQ) + '$',
            '$' + ML.matTex([d.u, d.v, d.PQ], 'vmatrix') + ' = ' + d.det + '$'];
        },
        answer: function (d) { return String(d.det); }
      },
      {
        ask: function () { return 'Estudia su posición relativa.'; },
        fields: [{ name: 't', label: 'Las rectas', opts: [{ t: 'Se cortan en un punto', v: 'cortan' }, { t: 'Se cruzan', v: 'cruzan' }, { t: 'Son paralelas', v: 'paralelas' }, { t: 'Son coincidentes', v: 'coincidentes' }] }],
        sol: function (d) { return { t: d.pos }; },
        hint: function () { return ['¿Son paralelos los directores?', 'Si no lo son, el producto mixto decide: cero, se cortan; distinto de cero, se cruzan.']; },
        steps: function (d) {
          return ['Los directores $' + vt(d.u) + '$ y $' + vt(d.v) + '$ no son proporcionales: ni paralelas ni coincidentes.',
            d.det === 0 ? 'El producto mixto es 0: las dos rectas están en un mismo plano y <strong>se cortan</strong>.'
              : 'El producto mixto no es 0: no hay plano que contenga a las dos. <strong>Se cruzan</strong>.'];
        },
        answer: function (d) { return d.pos === 'cortan' ? 'Se cortan' : 'Se cruzan'; }
      },
      {
        ask: function () { return 'Halla el plano que contiene a $r$ y es paralelo a $s$, en la forma $Ax + By + Cz + D = 0$.'; },
        fields: [{ name: 'A', label: 'A', w: 'tiny' }, { name: 'B', label: 'B', w: 'tiny' }, { name: 'C', label: 'C', w: 'tiny' }, { name: 'D', label: 'D', w: 'tiny' }],
        sol: function (d) { return { A: d.n[0], B: d.n[1], C: d.n[2], D: d.D }; },
        check: function (v, d) {
          var n = [v.A, v.B, v.C];
          if ([v.A, v.B, v.C, v.D].some(isNaN)) return { ok: false, msg: 'Rellena los cuatro coeficientes.' };
          if (nulo(n)) return { ok: false, msg: 'El vector normal no puede ser el cero.' };
          var okN = Math.abs(esc(n, d.u)) < 1e-9 && Math.abs(esc(n, d.v)) < 1e-9;
          var okP = Math.abs(esc(n, d.P) + v.D) < 1e-9;
          return {
            ok: okN && okP, fields: { A: okN, B: okN, C: okN, D: okP },
            msg: !okN ? 'La normal tiene que ser perpendicular a los dos directores: prueba con $\\vec u\\times\\vec v$.'
              : (!okP ? 'La dirección es buena, pero el plano no contiene a $r$: tiene que pasar por su punto $P$.' : null)
          };
        },
        hint: function () {
          return ['Si el plano contiene a $r$ y es paralelo a $s$, sus dos vectores directores son $\\vec u$ y $\\vec v$.',
            'Normal: $\\vec n = \\vec u\\times\\vec v$. Luego obliga a que pase por el punto de $r$.'];
        },
        steps: function (d) {
          return ['$\\vec{n} = \\vec{u}\\times\\vec{v} = ' + vt(d.n) + '$',
            'Pasa por $P' + vt(d.P) + '$: $D = -(' + esc(d.n, d.P) + ') = ' + d.D + '$',
            '$\\pi:\\ ' + planoTex(d.n, d.D) + '$' + (d.pos === 'cortan' ? ' — y como las rectas se cortan, este plano contiene también a $s$.' : '')];
        },
        answer: function (d) { return '$' + planoTex(d.n, d.D) + '$'; }
      }
    ]
  });

  p.keys([
    'Una recta es un punto y un vector director; se escribe en forma vectorial, paramétrica, continua o como corte de dos planos.',
    'En la continua $\\frac{x-p_1}{v_1}$ el punto aparece con el signo cambiado; los denominadores son el director.',
    'Un plano es un punto y un vector normal: en $Ax+By+Cz+D=0$, la normal es $(A, B, C)$.',
    'Plano por tres puntos: normal $\\overrightarrow{AB}\\times\\overrightarrow{AC}$ y $D$ sustituyendo un punto.',
    'Las posiciones relativas son sistemas de ecuaciones: se deciden comparando rangos.',
    'Recta y plano: si $\\vec v\\cdot\\vec n \\ne 0$ se cortan; si es 0, paralela o contenida según el punto.',
    'Dos rectas no paralelas se cortan si $[\\vec u,\\vec v,\\overrightarrow{PQ}] = 0$ y <strong>se cruzan</strong> si no.',
    'Todos los planos que contienen una recta forman un haz: $\\alpha\\pi_1 + \\beta\\pi_2 = 0$.'
  ]);
});
