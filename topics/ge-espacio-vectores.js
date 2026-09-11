/* Tema: Vectores en el espacio */
Course.topic('ge-espacio-vectores', function (p) {

  /* utilidades del tema */
  function cruz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function esc(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function mod(a) { return Math.sqrt(esc(a, a)); }
  function suma(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function resta(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function por(k, a) { return [k * a[0], k * a[1], k * a[2]]; }
  function vt(a) { return '(' + a.join(',\\ ') + ')'; }
  function pa(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function det3(m) { return ML.det3(m); }

  p.puente('En el plano, un punto necesitaba dos números. En el espacio necesita <strong>tres</strong>: ' +
    'cuánto avanzar hacia delante, cuánto hacia la derecha y cuánto subir. Todo lo que aprendiste con ' +
    'los [[ge-vectores|vectores del plano]] sigue valiendo con una coordenada más, y aparecen dos ' +
    'operaciones nuevas —el producto vectorial y el mixto— que se calculan con los ' +
    '[[al-determinantes|determinantes]] del bloque de álgebra y que hacen de la geometría del ' +
    'espacio algo que se calcula en vez de algo que se imagina.');

  p.text('Este tema es la caja de herramientas de los dos siguientes. Con los tres productos de aquí se ' +
    'escriben las ecuaciones de rectas y planos, se miden ángulos y distancias y se calculan áreas y ' +
    'volúmenes. Merece la pena dominarlo antes de seguir: en el examen, casi todos los fallos de ' +
    'geometría son fallos de estas cuentas.');

  /* ---------------------------------------------------------------- */
  p.section('Puntos y vectores con tres coordenadas');

  p.text('Se elige un origen $O$ y tres ejes perpendiculares $x$, $y$, $z$. Un punto es $P(x, y, z)$ y ' +
    'su <strong>vector de posición</strong> es $\\overrightarrow{OP} = (x, y, z)$. Entre dos puntos, el ' +
    'vector se calcula como siempre: <em>extremo menos origen</em>.');

  p.formulas([
    '\\overrightarrow{AB} = B - A = (b_1 - a_1,\\ b_2 - a_2,\\ b_3 - a_3)',
    '|\\vec{v}| = \\sqrt{v_1^2 + v_2^2 + v_3^2}'
  ], 'vector entre dos puntos y módulo',
    'La flecha larga encima de $AB$ se lee «vector a be». Se calcula restando las coordenadas del ' +
      'origen $A$ a las del extremo $B$, en ese orden: <em>«extremo menos origen»</em>.<br><br>' +
      'Las barras $|\\vec{v}|$ se leen «módulo de uve»: la longitud de la flecha.<br><br>' +
      'Y el módulo es otra vez Pitágoras, aplicado <strong>dos veces</strong>: primero en el suelo ' +
      '(con $v_1$ y $v_2$) y después en altura, con lo que salió y $v_3$.');

  p.demo({
    title: 'Un punto en el espacio y su vector de posición',
    intro: 'Mueve las tres coordenadas y gira el dibujo arrastrándolo. Las líneas de puntos son los dos triángulos rectángulos que dan el módulo: uno en el suelo y otro de pie.',
    predice: '$P = (3, 2, 4)$. ¿Cuánto mide su sombra en el suelo, $\\sqrt{3^2 + 2^2}$? ¿Y el vector completo? Pitágoras dos veces.',
    build: function (host) {
      var P = [3, 2, 4];
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 5, height: 360,
        aria: 'Un punto P del espacio unido al origen por su vector de posición, con su sombra sobre el plano del suelo y los dos triángulos rectángulos que dan su módulo',
        draw: function (g) {
          var base = [P[0], P[1], 0];
          g.seg([P[0], 0, 0], base, { color: 'axis', dash: [3, 4], w: 1 });
          g.seg([0, P[1], 0], base, { color: 'axis', dash: [3, 4], w: 1 });
          g.seg([0, 0, 0], base, { color: 3, dash: [6, 4], w: 2 });
          g.seg(base, P, { color: 3, dash: [6, 4], w: 2 });
          g.vec([0, 0, 0], P, { color: 0, w: 3.2 });
          g.punto(base, { color: 3, r: 3.5 });
          g.punto(P, { color: 0, label: 'P' });
        }
      });
      function pinta() {
        var s = P[0] * P[0] + P[1] * P[1];
        var m = Math.sqrt(s + P[2] * P[2]);
        out.set('$P = ' + vt(P) + '$<br>' +
          'En el suelo: $\\sqrt{' + pa(P[0]) + '^2 + ' + pa(P[1]) + '^2} = \\sqrt{' + s + '} \\approx ' + U.fmt(Math.sqrt(s), 3) + '$<br>' +
          'De pie: $|\\overrightarrow{OP}| = \\sqrt{' + s + ' + ' + pa(P[2]) + '^2} = \\sqrt{' + (s + P[2] * P[2]) + '} \\approx ' + U.fmt(m, 3) + '$');
        vista.render();
      }
      var fila = W.row(host);
      ['x', 'y', 'z'].forEach(function (n, i) {
        W.slider(fila, { label: 'coordenada ' + n, min: -4, max: 4, step: 1, value: P[i], on: function (val) { P[i] = val; pinta(); } });
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Combinaciones lineales, dependencia y bases');

  p.text('Una <strong>combinación lineal</strong> de $\\vec{u}$ y $\\vec{v}$ es cualquier vector de la ' +
    'forma $\\lambda\\vec{u} + \\mu\\vec{v}$, con $\\lambda$ y $\\mu$ números. Si uno de los vectores de ' +
    'una lista se puede escribir como combinación de los demás, sobra: se dice que son ' +
    '<strong>linealmente dependientes</strong>. Si ninguno sobra, son <strong>independientes</strong>.');

  p.text('En el espacio eso tiene una lectura geométrica muy limpia:');

  p.list([
    '<strong>Dos</strong> vectores son dependientes cuando son <strong>paralelos</strong>: uno es múltiplo del otro, y sus coordenadas son proporcionales.',
    '<strong>Tres</strong> vectores son dependientes cuando son <strong>coplanarios</strong>: los tres caben en un mismo plano.',
    '<strong>Cuatro</strong> vectores del espacio son <strong>siempre</strong> dependientes: no hay sitio para un cuarto independiente.'
  ]);

  p.text('Tres vectores independientes forman una <strong>base</strong> de $\\mathbb{R}^3$: cualquier ' +
    'otro vector se escribe, de una sola manera, como combinación de ellos. La más cómoda es la base ' +
    'canónica $\\vec{\\imath} = (1,0,0)$, $\\vec{\\jmath} = (0,1,0)$, $\\vec{k} = (0,0,1)$. Y para ' +
    'saber si tres vectores forman base no hace falta dibujar nada: basta un ' +
    '[[al-determinantes|determinante]].');

  p.formula('\\{\\vec{u}, \\vec{v}, \\vec{w}\\}\\ \\text{es base} \\iff \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3 \\end{vmatrix} \\ne 0',
    'criterio para una base de ℝ³',
    'Las llaves $\\{\\ \\}$ agrupan los tres vectores. El símbolo $\\iff$ se lee «si y solo si».<br><br>' +
      'Se dice: <em>«u, v y w forman base si y solo si el determinante con sus coordenadas por filas ' +
      'es distinto de cero»</em>.<br><br>Por qué: ese determinante es el volumen (con signo) de la caja ' +
      'que forman los tres. Si vale cero, la caja está aplastada, los tres están en un plano, y un ' +
      'plano no alcanza a describir todo el espacio.');

  p.comprueba('¿Forman base $\\vec u = (1, 0, 0)$, $\\vec v = (0, 1, 0)$ y $\\vec w = (2, 3, 0)$?', [
    { t: 'Sí: son tres vectores distintos', ok: false, por: 'Ser distintos no basta. $\\vec w = 2\\vec u + 3\\vec v$: es combinación de los otros dos y sobra.' },
    { t: 'No: los tres están en el plano del suelo', ok: true, por: 'Los tres tienen tercera coordenada 0. El determinante vale 0 (la tercera columna es de ceros): la caja está aplastada.' }
  ]);

  p.note('Es lo mismo que decir que la matriz de los tres vectores tiene <strong>rango 3</strong>. Y si ' +
    'el rango es 2, los tres son coplanarios pero no paralelos; si es 1, los tres son paralelos. Esa ' +
    'traducción entre rango y posición es la llave del tema [[ge-espacio]].', 'ok', 'Rango y geometría');

  /* ---------------------------------------------------------------- */
  p.section('Producto escalar: ángulos y proyecciones');

  p.text('Funciona exactamente igual que en el plano, con un sumando más. Devuelve un <strong>número</strong>, ' +
    'y ese número mide cuánto «van en la misma dirección» los dos vectores.');

  p.formulas([
    '\\vec{u}\\cdot\\vec{v} = u_1v_1 + u_2v_2 + u_3v_3 = |\\vec{u}|\\,|\\vec{v}|\\cos\\alpha',
    '\\cos\\alpha = \\frac{\\vec{u}\\cdot\\vec{v}}{|\\vec{u}|\\,|\\vec{v}|} \\qquad \\vec{u}\\perp\\vec{v} \\iff \\vec{u}\\cdot\\vec{v} = 0'
  ], 'producto escalar, ángulo y perpendicularidad',
    'El punto gordo entre dos vectores se lee «escalar»: <em>«u escalar v»</em>. $\\alpha$ es el ' +
      'ángulo que forman, entre 0° y 180°.<br><br>El símbolo $\\perp$ se lee «es perpendicular a».<br><br>' +
      'Las dos fórmulas son la misma: una dice cómo se calcula con coordenadas y la otra qué significa. ' +
      'Igualarlas es lo que permite despejar el ángulo.');

  p.text('Y hay una tercera lectura que se usa mucho: $\\dfrac{\\vec{u}\\cdot\\vec{v}}{|\\vec{v}|}$ es la ' +
    '<strong>proyección</strong> de $\\vec{u}$ sobre la dirección de $\\vec{v}$, es decir, la sombra que ' +
    'deja $\\vec{u}$ sobre la recta de $\\vec{v}$ si le da la luz en perpendicular. Es la idea que hay ' +
    'detrás de todas las distancias del tema [[ge-metrico]].');

  /* ---------------------------------------------------------------- */
  p.section('Producto vectorial: un vector perpendicular a dos');

  p.text('Aquí aparece algo que en el plano no tenía sentido: una operación que toma dos vectores y ' +
    'devuelve <strong>otro vector</strong>, perpendicular a los dos a la vez.');

  p.formula('\\vec{u}\\times\\vec{v} = \\begin{vmatrix} \\vec{\\imath} & \\vec{\\jmath} & \\vec{k} \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{vmatrix} = \\left( \\begin{vmatrix} u_2 & u_3 \\\\ v_2 & v_3 \\end{vmatrix},\\ -\\begin{vmatrix} u_1 & u_3 \\\\ v_1 & v_3 \\end{vmatrix},\\ \\begin{vmatrix} u_1 & u_2 \\\\ v_1 & v_2 \\end{vmatrix} \\right)',
    'se calcula como un determinante',
    'El aspa $\\times$ se lee «vectorial»: <em>«u vectorial v»</em>. El resultado es un vector.<br><br>' +
      'Poner $\\vec{\\imath}$, $\\vec{\\jmath}$, $\\vec{k}$ en la primera fila es un truco para acordarse: ' +
      'se desarrolla por esa fila y cada componente es un determinante 2×2 que sale tapando una ' +
      'columna.<br><br>Y el signo menos de la segunda componente <strong>no es opcional</strong>: es el ' +
      'signo del adjunto que ocupa ese sitio. Olvidarlo es el error número uno.');

  p.list([
    'Es <strong>perpendicular</strong> a $\\vec{u}$ y a $\\vec{v}$: por eso sirve para fabricar normales.',
    'Su <strong>módulo</strong> es el área del paralelogramo que forman: $|\\vec{u}\\times\\vec{v}| = |\\vec u|\\,|\\vec v|\\operatorname{sen}\\alpha$.',
    'Su <strong>sentido</strong> lo da la regla de la mano derecha: índice hacia $\\vec{u}$, corazón hacia $\\vec{v}$, y el pulgar señala $\\vec{u}\\times\\vec{v}$.',
    'Cambiar el orden cambia el sentido: $\\vec{v}\\times\\vec{u} = -\\,\\vec{u}\\times\\vec{v}$.',
    'Es el vector cero exactamente cuando los dos vectores son paralelos.'
  ]);

  p.formula('\\text{Área}_{ABC} = \\frac{1}{2}\\left|\\overrightarrow{AB}\\times\\overrightarrow{AC}\\right|',
    'área de un triángulo en el espacio',
    'Se dice: <em>«el área del triángulo a be ce es la mitad del módulo del producto vectorial de a be ' +
      'por a ce»</em>.<br><br>El producto vectorial da el área del paralelogramo que forman los dos ' +
      'lados, y el triángulo es justo la mitad de ese paralelogramo.');

  p.ejemplo({
    title: 'Un producto vectorial, con el signo del medio vigilado',
    enunciado: 'Calcular $\\vec u\\times\\vec v$ con $\\vec u = (1, 2, 0)$ y $\\vec v = (0, 1, 3)$, y comprobar que es perpendicular a los dos.',
    pasos: [
      { t: '<strong>Primera componente.</strong> Se tapa la primera columna: $\\begin{vmatrix} 2 & 0 \\\\ 1 & 3 \\end{vmatrix} = 6 - 0 = 6$.', antes: 'Tapa la primera columna. ¿Qué determinante $2\\times 2$ queda?' },
      { t: '<strong>Segunda componente, con el menos.</strong> Se tapa la segunda columna: $\\begin{vmatrix} 1 & 0 \\\\ 0 & 3 \\end{vmatrix} = 3$, y se cambia de signo: $-3$.', antes: 'Tapa la columna del medio. Sale 3. ¿Qué signo lleva?' },
      { t: '<strong>Tercera componente.</strong> $\\begin{vmatrix} 1 & 2 \\\\ 0 & 1 \\end{vmatrix} = 1 - 0 = 1$. Así que $\\vec u\\times\\vec v = (6, -3, 1)$.' },
      { t: '<strong>Comprobar.</strong> $\\vec u\\cdot(6, -3, 1) = 6 - 6 + 0 = 0$ ✓ y $\\vec v\\cdot(6, -3, 1) = 0 - 3 + 3 = 0$ ✓. Perpendicular a los dos: la cuenta está bien.', antes: '¿Cómo comprobarías el resultado sin dibujar nada?' },
      { t: '<strong>Área.</strong> $|\\vec u\\times\\vec v| = \\sqrt{36 + 9 + 1} = \\sqrt{46}$ es el área del paralelogramo; el triángulo con esos dos lados mide $\\frac{\\sqrt{46}}{2}$.' }
    ],
    cierre: 'La comprobación con los dos productos escalares tarda diez segundos y detecta el error del signo del medio: si hubiéramos escrito $(6, 3, 1)$, saldría $\\vec u\\cdot(6, 3, 1) = 12 \\ne 0$.'
  });

  p.demo({
    title: 'El producto vectorial, de pie sobre el paralelogramo',
    intro: 'Cambia los dos vectores y gira el dibujo. El vector violeta es u×v: siempre perpendicular al paralelogramo, y tanto más largo cuanto mayor es su área. Pon los dos vectores paralelos y verás que se anula.',
    predice: '$\\vec u = (3, 0, 0)$ y $\\vec v = (1, 2, 0)$ están los dos en el suelo. ¿Hacia dónde apuntará $\\vec u\\times\\vec v$? ¿Y cuánto medirá, si el paralelogramo tiene base 3 y altura 2?',
    build: function (host) {
      var u = [3, 0, 0], v = [1, 2, 0];
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 4, height: 380,
        aria: 'Dos vectores u y v que salen del origen, el paralelogramo que forman y su producto vectorial, perpendicular a los dos',
        draw: function (g) {
          var c = cruz(u, v), m = mod(c);
          var k = m > 3.8 ? 3.8 / m : 1;            // si no cabe, se dibuja a escala
          g.poli([[0, 0, 0], u, suma(u, v), v], { color: 2, fillAlpha: 0.22, w: 1.4 });
          g.vec([0, 0, 0], u, { color: 0, w: 3, label: 'u' });
          g.vec([0, 0, 0], v, { color: 1, w: 3, label: 'v' });
          if (m > 1e-9) g.vec([0, 0, 0], por(k, c), { color: 4, w: 3, label: k < 1 ? 'u×v (a escala)' : 'u×v' });
        }
      });
      function pinta() {
        var c = cruz(u, v), m = mod(c);
        out.set('$\\vec{u}\\times\\vec{v} = ' + vt(c) + '$<br>' +
          'Área del paralelogramo: $|\\vec{u}\\times\\vec{v}| \\approx ' + U.fmt(m, 3) + '$ &nbsp;·&nbsp; del triángulo: $\\approx ' + U.fmt(m / 2, 3) + '$<br>' +
          'Comprobación de perpendicularidad: $\\vec{u}\\cdot(\\vec{u}\\times\\vec{v}) = ' + esc(u, c) +
          '$ y $\\vec{v}\\cdot(\\vec{u}\\times\\vec{v}) = ' + esc(v, c) + '$' +
          (m < 1e-9 ? '<br><strong style="color:var(--bad)">Vector cero: u y v son paralelos y no encierran ningún área.</strong>' : ''));
        vista.render();
      }
      [['u', u], ['v', v]].forEach(function (par) {
        var fila = W.row(host);
        [0, 1, 2].forEach(function (i) {
          W.slider(fila, {
            label: par[0] + '<sub>' + (i + 1) + '</sub>', min: -3, max: 3, step: 1, value: par[1][i],
            on: function (val) { par[1][i] = val; pinta(); }
          });
        });
      });
      pinta();
    }
  });

  p.hist('El producto vectorial nació dentro de otra cosa. En 1843 William Rowan Hamilton inventó los ' +
    '<em>cuaterniones</em>, números con cuatro componentes, y al multiplicar dos de ellos aparecían, ' +
    'mezclados, un producto escalar y uno vectorial. Durante cuarenta años la física se escribió con ' +
    'cuaterniones y resultaba engorrosa. Hacia 1880 Josiah Willard Gibbs, en Estados Unidos, y Oliver ' +
    'Heaviside, en Inglaterra, cada uno por su lado, separaron las dos partes y crearon el cálculo ' +
    'vectorial tal como se estudia hoy. Los partidarios de Hamilton lo consideraron una mutilación, y ' +
    'la discusión en las revistas científicas duró años.');

  /* ---------------------------------------------------------------- */
  p.section('Producto mixto: volúmenes y coplanariedad');

  p.text('Combinando los dos productos aparece un tercero que devuelve un número con una lectura ' +
    'geométrica muy directa: el volumen de la caja torcida —el <strong>paralelepípedo</strong>— que ' +
    'forman tres vectores.');

  p.formulas([
    '[\\vec{u},\\vec{v},\\vec{w}] = \\vec{u}\\cdot(\\vec{v}\\times\\vec{w}) = \\begin{vmatrix} u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\\\ w_1 & w_2 & w_3\\end{vmatrix}',
    'V_{\\text{paralelepípedo}} = \\left|[\\vec{u},\\vec{v},\\vec{w}]\\right| \\qquad V_{\\text{tetraedro}} = \\frac{1}{6}\\left|[\\overrightarrow{AB},\\overrightarrow{AC},\\overrightarrow{AD}]\\right|'
  ], 'producto mixto y volúmenes',
    'Los corchetes $[\\vec{u},\\vec{v},\\vec{w}]$ se leen «producto mixto de u, v y w», y se calcula ' +
      'como el determinante de los tres vectores puestos por filas.<br><br>Su valor absoluto es el volumen ' +
      'del paralelepípedo. El tetraedro de vértices $A$, $B$, $C$, $D$ ocupa exactamente ' +
      '<strong>la sexta parte</strong> del paralelepípedo que forman sus tres aristas desde $A$: un ' +
      'medio por ser de base triangular y un tercio por ser una pirámide.');

  p.text('Y de paso resuelve una pregunta que en el papel no se ve: tres vectores son coplanarios, y ' +
    'cuatro puntos están en un mismo plano, exactamente cuando el producto mixto vale cero.');

  p.demo({
    title: 'La caja se aplasta: base o no base',
    intro: 'Los vectores u y v están fijos; el plano sombreado es el que generan. Mueve w. Mientras w se salga del plano, la caja tiene volumen y los tres forman base. Cuando w cae en el plano, el determinante se anula.',
    predice: '$\\vec w = (1, 1, 3)$. Si bajas $w_3$ a 0, ¿qué le pasará al determinante? ¿Y si cambias $w_1$ o $w_2$ manteniendo $w_3 = 3$?',
    build: function (host) {
      var u = [3, 0, 0], v = [1, 3, 0], w = [1, 1, 3];
      var out = W.readout(host, '');
      var vista = W.space3d(host, {
        rango: 5, height: 380,
        aria: 'El paralelepípedo que forman tres vectores u, v y w, y el plano generado por u y v',
        draw: function (g) {
          var n = cruz(u, v);
          g.plano(n, 0, { color: 5, fillAlpha: 0.10, w: 0.8 });
          var O = [0, 0, 0], U1 = u, V1 = v, W1 = w;
          var UV = suma(u, v), UW = suma(u, w), VW = suma(v, w), UVW = suma(UV, w);
          var aristas = [[O, U1], [O, V1], [O, W1], [U1, UV], [U1, UW], [V1, UV], [V1, VW], [W1, UW], [W1, VW], [UV, UVW], [UW, UVW], [VW, UVW]];
          aristas.forEach(function (a) { g.seg(a[0], a[1], { color: 2, w: 1.3, alpha: 0.8 }); });
          g.vec(O, u, { color: 0, w: 3, label: 'u' });
          g.vec(O, v, { color: 1, w: 3, label: 'v' });
          g.vec(O, w, { color: 3, w: 3, label: 'w' });
        }
      });
      function pinta() {
        var d = det3([u, v, w]);
        out.set('$[\\vec{u},\\vec{v},\\vec{w}] = ' + ML.matTex([u, v, w], 'vmatrix') + ' = ' + d + '$<br>' +
          (d === 0
            ? '<strong style="color:var(--bad)">Volumen cero: w está en el plano de u y v. Los tres son coplanarios y no forman base.</strong>'
            : 'Volumen del paralelepípedo: $' + Math.abs(d) + '$ &nbsp;·&nbsp; tetraedro: $\\frac{' + Math.abs(d) + '}{6} \\approx ' + U.fmt(Math.abs(d) / 6, 3) + '$. <strong>Forman base.</strong>'));
        vista.render();
      }
      var fila = W.row(host);
      [0, 1, 2].forEach(function (i) {
        W.slider(fila, { label: 'w<sub>' + (i + 1) + '</sub>', min: -3, max: 3, step: 1, value: w[i], on: function (val) { w[i] = val; pinta(); } });
      });
      W.hint(host, 'Prueba w = (1, 1, 0) o w = (4, 3, 0): están en el plano del suelo, que es el de u y v.');
      pinta();
    }
  });

  p.util('Cada superficie de un videojuego o de una película de animación es una malla de miles de ' +
    'triángulos, y para iluminar cada uno hay que saber hacia dónde mira: su normal, que se calcula ' +
    'con un producto vectorial de dos de sus lados. La tarjeta gráfica hace esa cuenta millones de ' +
    'veces por segundo. En física, el producto vectorial es el momento de una fuerza —por qué una llave ' +
    'larga afloja mejor un tornillo— y la fuerza que un campo magnético ejerce sobre una carga, que es ' +
    'lo que hace girar cualquier motor eléctrico. Y el producto mixto es la cuenta con la que un programa ' +
    'de diseño 3D calcula el volumen, y por tanto el peso, de una pieza antes de fabricarla.');

  p.trampas([
    { e: 'Olvidar el signo menos de la segunda componente de $\\vec u\\times\\vec v$', por: 'Es el adjunto de la posición $(1, 2)$, que lleva signo negativo. La comprobación $\\vec u\\cdot(\\vec u\\times\\vec v) = 0$ lo delata.' },
    { e: '$\\vec u\\cdot\\vec v$ es un vector y $\\vec u\\times\\vec v$ un número', por: 'Al revés: el escalar da un número (se suman productos) y el vectorial da un vector (perpendicular a los dos).' },
    { e: '«El determinante vale cero, luego forman base»', por: 'Es justo lo contrario: determinante cero significa caja aplastada, vectores coplanarios, <em>no</em> forman base.' },
    { e: '$\\vec u\\times\\vec v = \\vec v\\times\\vec u$', por: 'Cambiar el orden cambia el sentido: $\\vec v\\times\\vec u = -\\vec u\\times\\vec v$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Vector entre dos puntos y su módulo',
    level: 'basico',
    gen: function (r) {
      var A = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
      var B = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
      var v = resta(B, A);
      if (!v[0] && !v[1] && !v[2]) return null;
      return { A: A, B: B, v: v, m2: esc(v, v) };
    },
    ask: function (d) {
      return 'Dados $A' + vt(d.A) + '$ y $B' + vt(d.B) + '$, calcula $\\overrightarrow{AB}$ y su módulo ' +
        '(el módulo puede darse como raíz: <em>sqrt(29)</em>).';
    },
    fields: [
      { name: 'a', label: '1.ª', w: 'tiny' }, { name: 'b', label: '2.ª', w: 'tiny' },
      { name: 'c', label: '3.ª', w: 'tiny' }, { name: 'm', label: '$|\\overrightarrow{AB}|$', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.v[0], b: d.v[1], c: d.v[2], m: Math.sqrt(d.m2) }; },
    tol: 1e-4,
    errores: [{
      si: function (v, d) { return v.a === -d.v[0] && v.b === -d.v[1] && v.c === -d.v[2]; },
      msg: 'Has calculado $\\overrightarrow{BA}$: el vector de $A$ a $B$ es <em>extremo menos origen</em>, $B - A$.'
    }],
    hint: function () {
      return ['Un vector entre dos puntos es «extremo menos origen».',
        'Resta coordenada a coordenada: $B - A$. El módulo es la raíz de la suma de los cuadrados.'];
    },
    steps: function (d) {
      return ['$\\overrightarrow{AB} = B - A = (' + d.B[0] + ' - ' + pa(d.A[0]) + ',\\ ' + d.B[1] + ' - ' + pa(d.A[1]) +
        ',\\ ' + d.B[2] + ' - ' + pa(d.A[2]) + ') = ' + vt(d.v) + '$',
        '$|\\overrightarrow{AB}| = \\sqrt{' + pa(d.v[0]) + '^2 + ' + pa(d.v[1]) + '^2 + ' + pa(d.v[2]) + '^2} = \\sqrt{' + d.m2 +
        '} \\approx ' + U.fmt(Math.sqrt(d.m2), 4) + '$'];
    },
    answer: function (d) { return '$' + vt(d.v) + '$, módulo $\\sqrt{' + d.m2 + '}$'; }
  });

  p.exercise({
    title: '¿Forman base?',
    level: 'medio',
    gen: function (r) {
      var u = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var v = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      if (!mod(cruz(u, v))) return null;
      var w;
      if (r.bool(0.45)) {
        var l = r.pick([-2, -1, 1, 2]), m = r.pick([-1, 1, 2]);
        w = suma(por(l, u), por(m, v));
        if (Math.max(Math.abs(w[0]), Math.abs(w[1]), Math.abs(w[2])) > 9) return null;
      } else {
        w = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      }
      var dt = det3([u, v, w]);
      return { u: u, v: v, w: w, det: dt, base: dt !== 0 ? 'si' : 'no' };
    },
    ask: function (d) {
      return '¿Forman base de $\\mathbb{R}^3$ los vectores $\\vec{u} = ' + vt(d.u) + '$, $\\vec{v} = ' + vt(d.v) +
        '$ y $\\vec{w} = ' + vt(d.w) + '$? Calcula el determinante y decide.';
    },
    fields: [
      { name: 'd', label: 'determinante', w: 'tiny' },
      { name: 'b', label: '¿Base?', opts: [{ t: 'Sí, forman base', v: 'si' }, { t: 'No, son coplanarios', v: 'no' }] }
    ],
    sol: function (d) { return { d: d.det, b: d.base }; },
    hint: function () {
      return ['Tres vectores forman base si no caben en un mismo plano.',
        'Eso se decide con el determinante de los tres vectores puestos por filas.',
        'Si sale cero, son dependientes (coplanarios); si no, forman base.'];
    },
    steps: function (d) {
      return ['Se colocan por filas: $' + ML.matTex([d.u, d.v, d.w], 'vmatrix') + '$',
        'Por Sarrus sale $' + d.det + '$.',
        d.det === 0 ? 'Vale cero: uno de los tres es combinación de los otros dos. Están en un plano y <strong>no forman base</strong>.'
          : 'No es cero: ninguno sobra, la caja tiene volumen y <strong>forman base</strong>.'];
    },
    answer: function (d) { return 'det = ' + d.det + ' → ' + (d.det ? 'forman base' : 'no forman base'); }
  });

  p.exercise({
    title: 'Ángulo entre dos vectores',
    level: 'medio',
    gen: function (r) {
      var u = [r.pm(0, 4), r.pm(0, 4), r.pm(0, 4)];
      var v = [r.pm(0, 4), r.pm(0, 4), r.pm(0, 4)];
      if (!mod(u) || !mod(v)) return null;
      var c = esc(u, v) / (mod(u) * mod(v));
      if (Math.abs(Math.abs(c) - 1) < 1e-9) return null;
      var ang = Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
      return { u: u, v: v, e: esc(u, v), mu2: esc(u, u), mv2: esc(v, v), ang: ang };
    },
    ask: function (d) {
      return 'Halla el ángulo, en grados, que forman $\\vec{u} = ' + vt(d.u) + '$ y $\\vec{v} = ' + vt(d.v) + '$ (dos decimales).';
    },
    fields: [{ name: 'a', label: 'ángulo (°)', w: 'wide' }],
    sol: function (d) { return { a: U.round(d.ang, 4) }; },
    dec: 2,
    tol: 1e-3,      // el arco coseno amplifica el redondeo del coseno
    errores: [
      {
        si: function (v, d) { return Math.abs(v.a - d.ang * Math.PI / 180) < 0.01; },
        msg: 'Ese número es el ángulo en <strong>radianes</strong>: pon la calculadora en grados (DEG) o multiplica por $\\frac{180}{\\pi}$.'
      },
      {
        si: function (v, d) { return Math.abs(d.ang - 90) > 0.5 && Math.abs(v.a - (180 - d.ang)) < 0.05; },
        msg: 'Has salido con el ángulo suplementario: el signo del producto escalar importa. Si es negativo, el ángulo es obtuso.'
      }
    ],
    hint: function () {
      return ['Iguala las dos expresiones del producto escalar y despeja el coseno.',
        '$\\cos\\alpha = \\frac{\\vec{u}\\cdot\\vec{v}}{|\\vec u|\\,|\\vec v|}$, y luego $\\alpha = \\arccos(\\ldots)$ en grados.'];
    },
    steps: function (d) {
      return ['$\\vec{u}\\cdot\\vec{v} = ' + d.e + '$, $|\\vec{u}| = \\sqrt{' + d.mu2 + '}$, $|\\vec{v}| = \\sqrt{' + d.mv2 + '}$',
        '$\\cos\\alpha = \\dfrac{' + d.e + '}{\\sqrt{' + d.mu2 + '}\\,\\sqrt{' + d.mv2 + '}} \\approx ' + U.fmt(d.e / Math.sqrt(d.mu2 * d.mv2), 5) + '$',
        '$\\alpha = \\arccos(' + U.fmt(d.e / Math.sqrt(d.mu2 * d.mv2), 5) + ') \\approx ' + U.fmt(d.ang, 2) + '^\\circ$' +
        (d.e < 0 ? ' (obtuso, porque el producto escalar es negativo)' : '')];
    },
    answer: function (d) { return U.fmt(d.ang, 2) + '°'; }
  });

  p.exercise({
    title: 'Producto vectorial',
    level: 'medio',
    gen: function (r) {
      var u = [r.pm(0, 5), r.pm(0, 5), r.pm(0, 5)];
      var v = [r.pm(0, 5), r.pm(0, 5), r.pm(0, 5)];
      var c = cruz(u, v);
      if (!c[0] && !c[1] && !c[2]) return null;
      if (!c[1]) return null;                  // que el error del signo se pueda ver
      return { u: u, v: v, c: c };
    },
    ask: function (d) {
      return 'Calcula $\\vec{u}\\times\\vec{v}$ siendo $\\vec{u} = ' + vt(d.u) + '$ y $\\vec{v} = ' + vt(d.v) + '$.';
    },
    fields: [
      { name: 'a', label: '1.ª componente', w: 'tiny' },
      { name: 'b', label: '2.ª componente', w: 'tiny' },
      { name: 'c', label: '3.ª componente', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.c[0], b: d.c[1], c: d.c[2] }; },
    errores: [
      {
        si: function (v, d) { return v.a === d.c[0] && v.b === -d.c[1] && v.c === d.c[2]; },
        msg: 'Te has dejado el <strong>signo menos</strong> de la segunda componente: al desarrollar por la primera fila, el adjunto del centro cambia de signo.'
      },
      {
        si: function (v, d) { return v.a === -d.c[0] && v.b === -d.c[1] && v.c === -d.c[2]; },
        msg: 'Te sale justo el opuesto: has calculado $\\vec{v}\\times\\vec{u}$. El orden importa.'
      }
    ],
    hint: function () {
      return ['Monta el determinante con $\\vec{\\imath}, \\vec{\\jmath}, \\vec{k}$ arriba, $\\vec u$ en medio y $\\vec v$ abajo.',
        'Cada componente es el determinante 2×2 que queda al tapar su columna. <strong>La segunda cambia de signo.</strong>'];
    },
    steps: function (d) {
      return ['Primera componente: $u_2v_3 - u_3v_2 = ' + d.u[1] + '\\cdot' + pa(d.v[2]) + ' - ' + pa(d.u[2]) + '\\cdot' + pa(d.v[1]) + ' = ' + d.c[0] + '$.',
        'Segunda: $-(u_1v_3 - u_3v_1) = -(' + d.u[0] + '\\cdot' + pa(d.v[2]) + ' - ' + pa(d.u[2]) + '\\cdot' + pa(d.v[0]) + ') = ' + d.c[1] + '$.',
        'Tercera: $u_1v_2 - u_2v_1 = ' + d.u[0] + '\\cdot' + pa(d.v[1]) + ' - ' + pa(d.u[1]) + '\\cdot' + pa(d.v[0]) + ' = ' + d.c[2] + '$.',
        'Comprobación: $\\vec{u}\\cdot(\\vec{u}\\times\\vec{v}) = ' + esc(d.u, d.c) + '$ ✓ (perpendicular)'];
    },
    answer: function (d) { return '$' + vt(d.c) + '$'; }
  });

  p.problem({
    title: 'Triángulo, tetraedro y coplanariedad',
    level: 'avanzado',
    gen: function (r) {
      var A = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      var AB = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var AC = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var n = cruz(AB, AC);
      if (!n[0] && !n[1] && !n[2]) return null;
      var AD;
      if (r.bool(0.35)) {
        AD = suma(por(r.pick([-1, 1, 2]), AB), por(r.pick([-1, 1]), AC));
      } else {
        AD = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
        if (det3([AB, AC, AD]) === 0) return null;
      }
      var mixto = det3([AB, AC, AD]);
      return {
        A: A, B: suma(A, AB), C: suma(A, AC), D: suma(A, AD), AB: AB, AC: AC, AD: AD,
        n: n, n2: esc(n, n), mixto: mixto, copla: mixto === 0 ? 'si' : 'no'
      };
    },
    intro: function (d) {
      return 'Se consideran los puntos $A' + vt(d.A) + '$, $B' + vt(d.B) + '$, $C' + vt(d.C) + '$ y $D' + vt(d.D) + '$.';
    },
    partes: [
      {
        ask: function () { return 'Calcula el área del triángulo $ABC$ (cuatro decimales, o como raíz).'; },
        fields: [{ name: 's', label: 'área', w: 'wide' }],
        sol: function (d) { return { s: Math.sqrt(d.n2) / 2 }; },
        tol: 3e-4,
        errores: [{
          si: function (v, d) { return Math.abs(v.s - Math.sqrt(d.n2)) < 1e-3; },
          msg: 'Eso es el área del <strong>paralelogramo</strong>: el triángulo es la mitad.'
        }],
        hint: function () {
          return ['Calcula $\\overrightarrow{AB}$ y $\\overrightarrow{AC}$.',
            'El área es $\\frac{1}{2}|\\overrightarrow{AB}\\times\\overrightarrow{AC}|$.'];
        },
        steps: function (d) {
          return ['$\\overrightarrow{AB} = ' + vt(d.AB) + '$, $\\overrightarrow{AC} = ' + vt(d.AC) + '$',
            '$\\overrightarrow{AB}\\times\\overrightarrow{AC} = ' + vt(d.n) + '$',
            '$\\text{Área} = \\frac{1}{2}\\sqrt{' + d.n2 + '} \\approx ' + U.fmt(Math.sqrt(d.n2) / 2, 4) + '$'];
        },
        answer: function (d) { return '$\\frac{\\sqrt{' + d.n2 + '}}{2} \\approx ' + U.fmt(Math.sqrt(d.n2) / 2, 4) + '$'; }
      },
      {
        ask: function () { return 'Calcula el volumen del tetraedro $ABCD$.'; },
        fields: [{ name: 'v', label: 'volumen', w: 'wide' }],
        sol: function (d) { return { v: Math.abs(d.mixto) / 6 }; },
        tol: 1e-4,
        errores: [
          {
            si: function (v, d) { return d.mixto !== 0 && Math.abs(v.v - Math.abs(d.mixto)) < 1e-3; },
            msg: 'Ese es el volumen del <strong>paralelepípedo</strong>. El tetraedro es la sexta parte.'
          },
          {
            si: function (v, d) { return d.mixto !== 0 && (Math.abs(v.v - Math.abs(d.mixto) / 3) < 1e-3 || Math.abs(v.v - Math.abs(d.mixto) / 2) < 1e-3); },
            msg: 'Casi: el tetraedro es un sexto del paralelepípedo, no un tercio ni un medio.'
          },
          {
            si: function (v, d) { return d.mixto < 0 && Math.abs(v.v - d.mixto / 6) < 1e-3; },
            msg: 'Un volumen no puede ser negativo: toma el <strong>valor absoluto</strong> del producto mixto.'
          }
        ],
        hint: function () {
          return ['Necesitas también $\\overrightarrow{AD}$.',
            'El volumen es $\\frac{1}{6}\\left|[\\overrightarrow{AB},\\overrightarrow{AC},\\overrightarrow{AD}]\\right|$: un determinante 3×3.'];
        },
        steps: function (d) {
          return ['$\\overrightarrow{AD} = ' + vt(d.AD) + '$',
            '$[\\overrightarrow{AB},\\overrightarrow{AC},\\overrightarrow{AD}] = ' + ML.matTex([d.AB, d.AC, d.AD], 'vmatrix') + ' = ' + d.mixto + '$',
            '$V = \\frac{|' + d.mixto + '|}{6} = ' + ML.F(Math.abs(d.mixto), 6).tex() + '$'];
        },
        answer: function (d) { return '$V = ' + ML.F(Math.abs(d.mixto), 6).tex() + '$'; }
      },
      {
        ask: function () { return '¿Están los cuatro puntos en un mismo plano?'; },
        fields: [{ name: 'c', label: 'Los puntos', opts: [{ t: 'Sí, son coplanarios', v: 'si' }, { t: 'No, no son coplanarios', v: 'no' }] }],
        sol: function (d) { return { c: d.copla }; },
        hint: function () { return 'Mira el producto mixto del apartado anterior.'; },
        steps: function (d) {
          return [d.mixto === 0
            ? 'El producto mixto es cero: el tetraedro no tiene volumen, así que los cuatro puntos <strong>son coplanarios</strong>.'
            : 'El producto mixto no es cero: el tetraedro tiene volumen, así que <strong>no</strong> están en un mismo plano.'];
        },
        answer: function (d) { return d.mixto === 0 ? 'Sí, coplanarios' : 'No son coplanarios'; }
      }
    ]
  });

  p.exercise({
    title: 'El valor que los hace coplanarios',
    level: 'avanzado',
    gen: function (r) {
      var u = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var v = [r.pm(0, 3), r.pm(0, 3), r.pm(0, 3)];
      var a = r.pm(0, 4), b = r.pm(0, 4);
      // det(u, v, (a, m, b)) = A·a - B·m + C·b
      var A = u[1] * v[2] - u[2] * v[1], B = u[0] * v[2] - u[2] * v[0], C = u[0] * v[1] - u[1] * v[0];
      if (B === 0) return null;
      return { u: u, v: v, a: a, b: b, A: A, B: B, C: C, m: ML.F(A * a + C * b, B) };
    },
    ask: function (d) {
      return 'Halla $m$ para que $\\vec{u} = ' + vt(d.u) + '$, $\\vec{v} = ' + vt(d.v) + '$ y $\\vec{w} = (' + d.a +
        ',\\ m,\\ ' + d.b + ')$ sean coplanarios. (Vale una fracción.)';
    },
    fields: [{ name: 'm', label: 'm =', w: 'tiny' }],
    sol: function (d) { return { m: d.m.val() }; },
    tol: 1e-6,
    hint: function () {
      return ['Coplanarios quiere decir que su producto mixto vale cero.',
        'Plantea el determinante con $m$ dentro: sale una ecuación de primer grado en $m$.'];
    },
    steps: function (d) {
      var c0 = d.A * d.a + d.C * d.b;
      return ['Coplanarios $\\iff [\\vec{u},\\vec{v},\\vec{w}] = 0$.',
        '$' + ML.matTex([d.u, d.v, [d.a, 'm', d.b]], 'vmatrix') + ' = ' + ML.termTex(-d.B, 'm', 1, true) + ML.termTex(c0, '', 0, false) + '$',
        '$' + ML.termTex(-d.B, 'm', 1, true) + ML.termTex(c0, '', 0, false) + ' = 0 \\Rightarrow m = ' + d.m.tex() + '$'];
    },
    answer: function (d) { return '$m = ' + d.m.tex() + '$'; }
  });

  p.keys([
    'Un vector entre dos puntos es <strong>extremo menos origen</strong>, y su módulo es Pitágoras aplicado dos veces.',
    'Tres vectores forman base de $\\mathbb{R}^3$ si y solo si su determinante no es cero; si es cero, son coplanarios.',
    'Producto <strong>escalar</strong>: número; cero si son perpendiculares; da ángulos y proyecciones.',
    'Producto <strong>vectorial</strong>: vector perpendicular a los dos; su módulo es el área del paralelogramo, y la mitad, la del triángulo.',
    'En $\\vec u\\times\\vec v$ la segunda componente lleva un signo menos, y cambiar el orden cambia el sentido.',
    'Producto <strong>mixto</strong>: determinante 3×3; su valor absoluto es el volumen del paralelepípedo, y un sexto, el del tetraedro.',
    'Cuatro puntos son coplanarios si y solo si el producto mixto de sus tres aristas desde uno de ellos es cero.'
  ]);
});
