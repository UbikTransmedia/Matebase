/* Tema: Vectores en el plano */
Course.topic('ge-vectores', function (p) {

  p.puente('Con Pitágoras calculabas distancias entre dos puntos; con las coordenadas, situabas puntos ' +
    'en el plano. Un vector junta las dos cosas: es un desplazamiento con coordenadas, y su longitud ' +
    'sale de Pitágoras. La novedad de este tema es el producto escalar, una operación que devuelve un ' +
    'número y que responde a la pregunta «¿cuánto van estos dos en la misma dirección?». Con ella, ' +
    'comprobar un ángulo recto se reduce a una multiplicación.');

  p.text('Hay magnitudes que quedan definidas con un número: la masa, la temperatura, el tiempo. ' +
    'Se llaman <strong>escalares</strong>. Pero otras necesitan además una dirección: la velocidad, ' +
    'la fuerza, un desplazamiento. Para esas hace falta un <strong>vector</strong>: una flecha.');

  p.text('Un vector tiene tres cosas: <strong>módulo</strong> (su longitud), <strong>dirección</strong> ' +
    '(la recta sobre la que va) y <strong>sentido</strong> (hacia dónde apunta de los dos posibles).');

  p.formula('\\vec{v} = (v_1, v_2) \\qquad |\\vec{v}| = \\sqrt{v_1^2 + v_2^2}', 'componentes y módulo',
    'La flechita de encima se lee «vector»: $\\vec{v}$ es «vector uve». Las dos barras verticales, ' +
      '$|\\vec{v}|$, se dicen «módulo de uve», que es su longitud.<br><br>Se lee: <em>«vector uve es ' +
      'igual al par uve sub uno, uve sub dos; y el módulo de uve es la raíz cuadrada de uve sub uno al ' +
      'cuadrado más uve sub dos al cuadrado»</em>.<br><br>La fórmula del módulo no es nueva: es el ' +
      'teorema de Pitágoras, con las componentes del vector haciendo de catetos.');

  p.note('El módulo es Pitágoras otra vez: las componentes son los catetos y el vector, la hipotenusa.',
    'ok');

  p.text('El vector que va del punto $A(a_1,a_2)$ al punto $B(b_1,b_2)$ se calcula restando: ' +
    '<strong>final menos inicial</strong>.');

  p.formula('\\vec{AB} = B - A = (b_1 - a_1,\\ b_2 - a_2)');

  p.comprueba('$A(2, 5)$ y $B(-1, 3)$. ¿Cuál es $\\vec{AB}$?', [
    { t: '$(3, 2)$', ok: false, por: 'Eso es $A - B$: el vector que va de $B$ a $A$, o sea $\\vec{BA}$. Tiene el sentido contrario.' },
    { t: '$(-3, -2)$', ok: true, por: 'Final menos inicial: $(-1 - 2,\\ 3 - 5) = (-3, -2)$. Para ir de $A$ a $B$ hay que retroceder 3 y bajar 2.' },
    { t: '$(1, 8)$', ok: false, por: 'Sumar los puntos no da un vector con sentido geométrico. El vector es la <em>diferencia</em> de coordenadas.' }
  ]);

  p.demo({
    title: 'Un vector, sus componentes y su módulo',
    intro: 'Arrastra la punta del vector. Fíjate en el triángulo rectángulo que forman las componentes.',
    predice: 'Lleva la punta a $(3, 4)$. ¿Cuánto medirá el módulo? Piensa en la terna pitagórica antes de mirar.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -8, xmax: 8, ymin: -6, ymax: 6, height: 340,
        handles: {
          V: {
            x: 4, y: 3, label: 'v', color: 0,
            constrain: function (h) { h.x = Math.round(h.x * 2) / 2; h.y = Math.round(h.y * 2) / 2; }
          }
        },
        draw: function (g) {
          var v = g.h('V');
          g.seg(0, 0, v.x, 0, { color: 3, w: 2, dash: true });
          g.seg(v.x, 0, v.x, v.y, { color: 3, w: 2, dash: true });
          g.vec(0, 0, v.x, v.y, { color: 0, w: 3 });
          g.text(v.x / 2, -0.35, 'v₁ = ' + U.fmt(v.x, 1), { align: 'center', color: 3, size: 12, box: true });
          g.text(v.x + 0.25, v.y / 2, 'v₂ = ' + U.fmt(v.y, 1), { align: 'left', color: 3, size: 12, box: true });
          var m = Math.hypot(v.x, v.y);
          var ang = Math.atan2(v.y, v.x) * 180 / Math.PI;
          out.set('$\\vec{v} = (' + U.fmt(v.x, 1) + ', ' + U.fmt(v.y, 1) + ')$ &nbsp;·&nbsp; ' +
            '$|\\vec{v}| = \\sqrt{' + U.fmt(v.x * v.x, 2) + ' + ' + U.fmt(v.y * v.y, 2) + '} = ' + U.fmt(m, 4) + '$' +
            ' &nbsp;·&nbsp; ángulo con el eje X: $' + U.fmt(ang < 0 ? ang + 360 : ang, 1) + '^\\circ$');
        }
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Operaciones');

  p.sub('Suma: la regla del paralelogramo');
  p.text('Para sumar dos vectores se suman sus componentes. Geométricamente, se pone uno a ' +
    'continuación del otro y el resultado va del principio del primero al final del segundo.');

  p.formula('\\vec{u} + \\vec{v} = (u_1+v_1,\\ u_2+v_2)');

  p.sub('Producto por un número');
  p.text('Multiplicar por un escalar $k$ estira o encoge el vector. Si $k$ es negativo, además le da ' +
    'la vuelta.');

  p.formula('k\\,\\vec{v} = (k\\,v_1,\\ k\\,v_2) \\qquad |k\\vec{v}| = |k|\\,|\\vec{v}|');

  p.demo({
    title: 'Sumar vectores',
    intro: 'Arrastra las puntas de los dos vectores. La flecha verde es la suma: es la diagonal del paralelogramo que forman.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -9, xmax: 9, ymin: -6, ymax: 7, height: 350,
        handles: {
          U: { x: 4, y: 1, label: 'u', color: 0, constrain: snap },
          V: { x: 1, y: 3, label: 'v', color: 1, constrain: snap }
        },
        draw: function (g) {
          var u = g.h('U'), v = g.h('V');
          var s = [u.x + v.x, u.y + v.y];
          g.seg(u.x, u.y, s[0], s[1], { color: 1, w: 1.6, dash: true, alpha: .7 });
          g.seg(v.x, v.y, s[0], s[1], { color: 0, w: 1.6, dash: true, alpha: .7 });
          g.vec(0, 0, u.x, u.y, { color: 0, w: 3 });
          g.vec(0, 0, v.x, v.y, { color: 1, w: 3 });
          g.vec(0, 0, s[0], s[1], { color: 2, w: 3.4 });
          g.text(s[0], s[1], 'u+v', { color: 2, dx: 10, dy: -10, box: true, size: 13 });
          out.set('$\\vec{u} = (' + u.x + ', ' + u.y + ')$, &nbsp; $\\vec{v} = (' + v.x + ', ' + v.y + ')$<br>' +
            '$\\vec{u}+\\vec{v} = (' + s[0] + ', ' + s[1] + ')$, &nbsp; módulo $' + U.fmt(Math.hypot(s[0], s[1]), 3) + '$');
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Un vector es la forma natural de decir «cuánto y hacia dónde», y por eso aparece en cuanto algo ' +
    'tiene dirección: el viento que desvía a un avión, la corriente que arrastra a un nadador, la ' +
    'fuerza con la que dos personas empujan un mueble. Sumar vectores es lo que hace un piloto al ' +
    'calcular el rumbo que debe llevar para acabar donde quiere pese al viento cruzado: el rumbo ' +
    'verdadero es la suma del suyo y el del aire.');

  p.section('Producto escalar');

  p.text('Llega una operación rara. Hasta ahora, al operar con vectores salían vectores: sumas uno y ' +
    'otro y obtienes un vector. Esta devuelve <strong>un número</strong> —por eso se llama ' +
    '<em>escalar</em>, que es como se llaman los números cuando se los quiere distinguir de los ' +
    'vectores— y hay que entender antes qué mide ese número, porque si no la fórmula parece salida ' +
    'de la nada.');

  p.text('Lo que mide es <strong>cuánto van los dos vectores en la misma dirección</strong>. Piensa en ' +
    'empujar un carrito. Si empujas justo hacia donde quieres que vaya, todo tu esfuerzo cuenta. Si ' +
    'empujas un poco de lado, solo aprovechas una parte. Y si empujas perpendicularmente, hacia el ' +
    'suelo, el carrito no avanza nada por mucho que te canses: tu esfuerzo no cuenta.');

  p.text('El producto escalar pone número a esa idea. Sale <strong>positivo</strong> si los dos ' +
    'vectores apuntan más o menos hacia el mismo lado, <strong>cero</strong> si son perpendiculares y ' +
    '<strong>negativo</strong> si apuntan en sentidos opuestos. Solo con el signo ya sabes en qué ' +
    'situación estás, sin calcular ningún ángulo.');

  p.sub('Las dos fórmulas');
  p.text('Y ahora las fórmulas, que son dos y dan lo mismo. La primera es la que se usa para calcular, ' +
    'porque solo pide las coordenadas; la segunda es la que se usa para <em>entender</em>, porque ' +
    'enseña el ángulo. Igualarlas es lo que permite despejar ese ángulo, y de ahí sale la tercera línea.');

  p.formulas([
    '\\vec{u}\\cdot\\vec{v} = u_1v_1 + u_2v_2',
    '\\vec{u}\\cdot\\vec{v} = |\\vec{u}|\\,|\\vec{v}|\\cos\\alpha',
    '\\cos\\alpha = \\frac{u_1v_1+u_2v_2}{|\\vec{u}|\\,|\\vec{v}|}'
  ], 'las dos caras del producto escalar, y el ángulo que sale de igualarlas',
    'El punto entre los vectores se lee «producto escalar»: $\\vec{u}\\cdot\\vec{v}$ es «u escalar v», ' +
    'nunca «u por v».<br><br>Se leen: <em>«u escalar v es igual a u uno por uve uno, más u dos por ' +
    'uve dos»</em> · <em>«u escalar v es igual al módulo de u, por el módulo de v, por el coseno de ' +
    'alfa»</em> · <em>«coseno de alfa es igual a u uno uve uno más u dos uve dos, partido por el ' +
    'módulo de u por el módulo de v»</em>.<br><br>$\\alpha$ es la letra griega alfa y aquí es el ' +
    'ángulo que forman los dos vectores.');

  p.note('Consecuencia importantísima: <strong>dos vectores son perpendiculares si y solo si su ' +
    'producto escalar vale cero</strong>, porque $\\cos 90^\\circ = 0$. Es la forma más rápida de ' +
    'comprobar un ángulo recto sin dibujar nada.', 'ok', 'La prueba de la perpendicularidad');

  p.ejemplo({
    title: 'Del producto escalar al ángulo, y de vuelta',
    enunciado: 'Dados $\\vec u = (3, 1)$ y $\\vec v = (-1, 2)$: ¿qué ángulo forman? ¿Y qué vector es perpendicular a $\\vec u$?',
    pasos: [
      { t: '<strong>El signo, primero.</strong> $\\vec u\\cdot\\vec v = 3\\cdot(-1) + 1\\cdot 2 = -3 + 2 = -1$. Negativo: el ángulo será <strong>obtuso</strong>, más de $90^\\circ$. Ya sabemos en qué zona buscar.', antes: 'Calcula $\\vec u\\cdot\\vec v$. Solo con el signo, ¿el ángulo es agudo u obtuso?' },
      { t: '<strong>Los módulos.</strong> $|\\vec u| = \\sqrt{9 + 1} = \\sqrt{10}$ y $|\\vec v| = \\sqrt{1 + 4} = \\sqrt{5}$.' },
      { t: '<strong>El coseno y el ángulo.</strong> $\\cos\\alpha = \\dfrac{-1}{\\sqrt{10}\\sqrt{5}} = \\dfrac{-1}{\\sqrt{50}} \\approx -0{,}1414$, así que $\\alpha = \\arccos(-0{,}1414) \\approx 98{,}1^\\circ$. Obtuso, como se había previsto. ✓', antes: 'Con el coseno negativo, ¿el arco coseno saldrá menor o mayor que $90^\\circ$?' },
      { t: '<strong>Un perpendicular a $\\vec u$.</strong> Se buscan $(a, b)$ con $3a + b = 0$. La forma rápida: intercambiar componentes y cambiar un signo, $(-1, 3)$. Comprobación: $3\\cdot(-1) + 1\\cdot 3 = 0$ ✓.', antes: '¿Cómo fabricarías un vector perpendicular a $(3, 1)$ sin calcular ningún ángulo?' }
    ],
    cierre: 'El producto escalar da dos herramientas: el signo, que clasifica el ángulo gratis, y el cero, que detecta la perpendicularidad. El ángulo exacto solo hace falta cuando lo piden.'
  });

  p.demo({
    title: 'Producto escalar y ángulo',
    intro: 'Gira los dos vectores y observa el signo del producto escalar: positivo si el ángulo es agudo, cero si es recto, negativo si es obtuso.',
    predice: 'Con $\\vec u = (4, 0)$, ¿dónde tendrías que colocar $\\vec v$ para que el producto escalar sea exactamente 0? ¿Hay más de una respuesta?',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -7, xmax: 7, ymin: -5, ymax: 5, height: 330,
        handles: {
          U: { x: 4, y: 0, label: 'u', color: 0, constrain: snap },
          V: { x: 1, y: 3, label: 'v', color: 1, constrain: snap }
        },
        draw: function (g) {
          var u = g.h('U'), v = g.h('V');
          var pe = u.x * v.x + u.y * v.y;
          var mu = Math.hypot(u.x, u.y), mv = Math.hypot(v.x, v.y);
          var cos = pe / (mu * mv);
          var ang = Math.acos(U.clamp(cos, -1, 1));
          var a1 = Math.atan2(u.y, u.x), a2 = Math.atan2(v.y, v.x);
          g.arc(0, 0, 1.2, a1, a2, { color: 2, w: 2, fill: 2, fillAlpha: .15 });
          g.vec(0, 0, u.x, u.y, { color: 0, w: 3 });
          g.vec(0, 0, v.x, v.y, { color: 1, w: 3 });
          var col = Math.abs(pe) < 1e-9 ? 'var(--ok)' : (pe > 0 ? 'var(--c1)' : 'var(--bad)');
          out.set('$\\vec{u}\\cdot\\vec{v} = ' + u.x + '\\cdot' + v.x + ' + ' + u.y + '\\cdot' + v.y +
            ' = $ <strong style="color:' + col + '">' + U.fmt(pe, 2) + '</strong>' +
            ' &nbsp;·&nbsp; $\\alpha = ' + U.fmt(ang * 180 / Math.PI, 1) + '^\\circ$' +
            (Math.abs(pe) < 1e-9 ? ' &nbsp;→ <strong style="color:var(--ok)">¡perpendiculares!</strong>' : ''));
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
      W.hint(host, 'Intenta dejar el producto escalar exactamente en 0.');
    }
  });

  p.section('Bases y proyecciones');

  p.text('Dos vectores del plano que <strong>no son paralelos</strong> forman una <strong>base</strong>: ' +
    'cualquier otro vector se escribe, de una sola manera, como combinación lineal de ellos, ' +
    '$\\vec{w} = a\\,\\vec{u} + b\\,\\vec{v}$. Los números $a$ y $b$ son las coordenadas de $\\vec{w}$ en esa ' +
    'base. La base de siempre, $(1, 0)$ y $(0, 1)$, es solo la más cómoda; con cualquier otra, las ' +
    'coordenadas se calculan resolviendo un [[al-sistemas|sistema]] de dos ecuaciones.');

  p.text('Y el producto escalar da una operación más, que se usará mucho en el espacio: la ' +
    '<strong>proyección</strong> de un vector sobre otro, la sombra que deja $\\vec{u}$ sobre la dirección ' +
    'de $\\vec{v}$ cuando la luz cae en perpendicular.');

  p.formulas([
    '\\operatorname{proy}_{\\vec{v}}\\,\\vec{u} = \\frac{\\vec{u}\\cdot\\vec{v}}{|\\vec{v}|} \\quad \\text{(longitud de la sombra, con signo)}',
    '\\frac{\\vec{u}\\cdot\\vec{v}}{|\\vec{v}|^2}\\,\\vec{v} \\quad \\text{(la sombra como vector)}'
  ], 'proyección de u sobre v',
    'Se lee: <em>«la proyección de u sobre v es u escalar v partido por el módulo de v»</em>.<br><br>' +
      'Sale de la definición: $\\vec u\\cdot\\vec v = |\\vec u|\\,|\\vec v|\\cos\\alpha$, y la sombra mide ' +
      '$|\\vec u|\\cos\\alpha$. Si el ángulo es obtuso, la sombra cae hacia atrás y sale negativa.<br><br>' +
      'La segunda línea da la sombra como vector: esa longitud por el vector unitario en la dirección de $\\vec v$.');

  p.demo({
    title: 'La sombra de un vector sobre otro',
    intro: 'Mueve los dos vectores. El vector verde es la proyección de u sobre la recta de v: su sombra con la luz cayendo en perpendicular. Pon u perpendicular a v y la sombra desaparece.',
    predice: 'Si $\\vec u$ y $\\vec v$ apuntan en sentidos casi opuestos, ¿hacia dónde caerá la sombra verde: hacia $\\vec v$ o hacia el lado contrario? ¿Qué signo tendrá la proyección?',
    build: function (host) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -6, xmax: 6, ymin: -4.5, ymax: 4.5, height: 320,
        handles: {
          U: { x: 2, y: 3, label: 'u', color: 0, constrain: snap },
          V: { x: 4, y: 1, label: 'v', color: 1, constrain: snap }
        },
        draw: function (g) {
          var u = g.h('U'), v = g.h('V'), vv = v.x * v.x + v.y * v.y;
          if (!vv) { out.set('$\\vec v$ no puede ser el vector cero.'); return; }
          var ue = u.x * v.x + u.y * v.y, k = ue / vv;
          g.seg(-6 * v.x, -6 * v.y, 6 * v.x, 6 * v.y, { color: 'axis', w: 1, dash: [4, 4] });
          g.seg(u.x, u.y, k * v.x, k * v.y, { color: 'axis', w: 1.2, dash: true });
          if (ue) g.vec(0, 0, k * v.x, k * v.y, { color: 2, w: 4.5 });
          g.vec(0, 0, v.x, v.y, { color: 1, w: 2.4 });
          g.vec(0, 0, u.x, u.y, { color: 0, w: 2.4 });
          out.set('$\\vec u\\cdot\\vec v = ' + ue + '$, $|\\vec v| = \\sqrt{' + vv + '}$ &nbsp;→&nbsp; proyección $= \\frac{' + ue + '}{\\sqrt{' + vv + '}} \\approx ' + U.fmt(ue / Math.sqrt(vv), 3) + '$' +
            (ue === 0 ? ' &nbsp;<strong>(perpendiculares: sombra nula)</strong>' : (ue < 0 ? ' &nbsp;(negativa: la sombra cae hacia atrás)' : '')));
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
    }
  });

  p.trampas([
    { e: '$\\vec{AB} = A - B$', por: 'Es <em>final menos inicial</em>: $B - A$. Al revés sale el vector con el sentido cambiado.' },
    { e: '$\\vec u\\cdot\\vec v$ es un vector', por: 'Es un número. Multiplicar componente a componente y <em>sumar</em>: $(3, 1)\\cdot(2, 5) = 6 + 5 = 11$, no $(6, 5)$.' },
    { e: '$|\\vec u + \\vec v| = |\\vec u| + |\\vec v|$', por: 'Solo si tienen la misma dirección y sentido. En general la diagonal del paralelogramo es más corta que los dos lados sumados: es la desigualdad triangular.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('El producto escalar mide «cuánto va en la misma dirección», y de ahí salen dos usos constantes. ' +
    'En física es el trabajo: empujar un carrito hacia delante cansa, empujarlo hacia el suelo no lo ' +
    'mueve, y la fórmula lo recoge sola porque el coseno de 90° vale cero. En informática es cómo se ' +
    'ilumina una escena en 3D: el brillo de cada punto se calcula con el producto escalar entre la ' +
    'normal de la superficie y la dirección de la luz.');

  p.hist('Los vectores tal como los usamos son sorprendentemente recientes. Nacieron a finales del siglo ' +
    'XIX de una guerra académica: Hamilton había inventado los cuaterniones, un sistema elegante ' +
    'pero incómodo, y Gibbs y Heaviside extrajeron de ellos por separado lo que de verdad hacía ' +
    'falta en física, los productos escalar y vectorial. Los partidarios de Hamilton lo consideraron ' +
    'una mutilación y la polémica duró décadas. Ganaron los prácticos, y por eso hoy se estudia esto ' +
    'y no aquello.');

  p.section('Practica');

  p.exercise({
    title: 'Vector entre dos puntos y su módulo',
    level: 'basico',
    gen: function (r) {
      var ternas = [[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [7, 24]];
      var t = r.pick(ternas);
      var sx = r.sign(), sy = r.sign();
      var x1 = r.pm(0, 6), y1 = r.pm(0, 6);
      return {
        x1: x1, y1: y1, x2: x1 + t[0] * sx, y2: y1 + t[1] * sy,
        vx: t[0] * sx, vy: t[1] * sy, mod: Math.hypot(t[0], t[1])
      };
    },
    ask: function (d) {
      return 'Dados $A(' + d.x1 + ', ' + d.y1 + ')$ y $B(' + d.x2 + ', ' + d.y2 + ')$, calcula las ' +
        'componentes de $\\vec{AB}$ y su módulo.';
    },
    fields: [
      { name: 'a', label: '1.ª componente', w: 'tiny' },
      { name: 'b', label: '2.ª componente', w: 'tiny' },
      { name: 'm', label: 'Módulo', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.vx, b: d.vy, m: d.mod }; },
    tol: 1e-6,
    hint: function () { return 'Final menos inicial. Y el módulo es Pitágoras con las componentes.'; },
    steps: function (d) {
      return ['$\\vec{AB} = B - A = (' + d.x2 + ' - (' + d.x1 + '),\\ ' + d.y2 + ' - (' + d.y1 + ')) = (' + d.vx + ', ' + d.vy + ')$',
        '$|\\vec{AB}| = \\sqrt{(' + d.vx + ')^2 + (' + d.vy + ')^2} = \\sqrt{' + (d.vx * d.vx + d.vy * d.vy) + '} = ' + d.mod + '$'];
    },
    answer: function (d) { return '$\\vec{AB} = (' + d.vx + ', ' + d.vy + ')$, módulo $' + d.mod + '$'; }
  });

  p.exercise({
    title: 'Combinación lineal',
    level: 'medio',
    gen: function (r) {
      var u = [r.pm(1, 6), r.pm(1, 6)], v = [r.pm(1, 6), r.pm(1, 6)];
      var k1 = r.nz(-4, 4), k2 = r.nz(-4, 4);
      return { u: u, v: v, k1: k1, k2: k2, r: [k1 * u[0] + k2 * v[0], k1 * u[1] + k2 * v[1]] };
    },
    ask: function (d) {
      return 'Si $\\vec{u} = (' + d.u + ')$ y $\\vec{v} = (' + d.v + ')$, calcula ' +
        '$' + ML.termTex(d.k1, '\\vec{u}', 1, true) + ML.termTex(d.k2, '\\vec{v}', 1, false) + '$.';
    },
    fields: [{ name: 'a', label: '1.ª componente', w: 'tiny' }, { name: 'b', label: '2.ª componente', w: 'tiny' }],
    sol: function (d) { return { a: d.r[0], b: d.r[1] }; },
    hint: function () { return 'Multiplica cada vector por su número y después suma componente a componente.'; },
    steps: function (d) {
      return ['$' + d.k1 + '\\vec{u} = (' + (d.k1 * d.u[0]) + ', ' + (d.k1 * d.u[1]) + ')$',
        '$' + d.k2 + '\\vec{v} = (' + (d.k2 * d.v[0]) + ', ' + (d.k2 * d.v[1]) + ')$',
        'Sumando: $(' + d.r[0] + ', ' + d.r[1] + ')$'];
    },
    answer: function (d) { return '$(' + d.r[0] + ', ' + d.r[1] + ')$'; }
  });

  p.exercise({
    title: 'Producto escalar y perpendicularidad',
    level: 'medio',
    gen: function (r) {
      var u = [r.nz(-6, 6), r.nz(-6, 6)];
      var perp = r.bool(0.4);
      var v = perp ? [-u[1], u[0]] : [r.nz(-6, 6), r.nz(-6, 6)];
      var pe = u[0] * v[0] + u[1] * v[1];
      return { u: u, v: v, pe: pe, perp: Math.abs(pe) < 1e-9 };
    },
    ask: function (d) {
      return 'Calcula $\\vec{u}\\cdot\\vec{v}$ siendo $\\vec{u} = (' + d.u + ')$ y $\\vec{v} = (' + d.v + ')$, y di si son perpendiculares.';
    },
    fields: [
      { name: 'pe', label: 'Producto escalar', w: 'tiny' },
      { name: 'q', label: '¿Perpendiculares?', opts: [{ t: 'sí', v: '1' }, { t: 'no', v: '0' }] }
    ],
    sol: function (d) { return { pe: d.pe, q: d.perp ? '1' : '0' }; },
    hint: function () { return 'Producto escalar cero ⟺ perpendiculares.'; },
    steps: function (d) {
      return ['$\\vec{u}\\cdot\\vec{v} = ' + d.u[0] + '\\cdot(' + d.v[0] + ') + ' + d.u[1] + '\\cdot(' + d.v[1] + ')$',
        '$= ' + (d.u[0] * d.v[0]) + ' + (' + (d.u[1] * d.v[1]) + ') = ' + d.pe + '$',
        d.perp ? 'Como vale cero, los vectores <strong>son perpendiculares</strong>.'
          : 'Como no vale cero, <strong>no son perpendiculares</strong>.'];
    },
    answer: function (d) { return '$\\vec{u}\\cdot\\vec{v} = ' + d.pe + '$; ' + (d.perp ? 'sí' : 'no') + ' son perpendiculares.'; }
  });

  p.exercise({
    title: 'Proyección de un vector sobre otro',
    level: 'medio',
    gen: function (r) {
      var u = [r.pm(0, 5), r.pm(0, 5)], v = [r.pm(0, 5), r.pm(0, 5)];
      var vv = v[0] * v[0] + v[1] * v[1];
      if (!vv || (!u[0] && !u[1])) return null;
      var ue = u[0] * v[0] + u[1] * v[1];
      return { u: u, v: v, vv: vv, ue: ue, val: ue / Math.sqrt(vv) };
    },
    ask: function (d) { return 'Calcula la proyección (con signo) de $\\vec u = (' + d.u.join(',\\ ') + ')$ sobre la dirección de $\\vec v = (' + d.v.join(',\\ ') + ')$ (cuatro decimales).'; },
    fields: [{ name: 'p', label: 'proyección', w: 'wide' }],
    sol: function (d) { return { p: U.round(d.val, 6) }; },
    tol: 3e-4,
    errores: [
      { si: function (v, d) { return d.vv !== 1 && d.ue !== 0 && Math.abs(v.p - d.ue) < 1e-6; }, msg: 'Eso es el producto escalar. La sombra se obtiene dividiéndolo por el <strong>módulo</strong> de $\\vec v$.' },
      { si: function (v, d) { return d.vv !== 1 && d.ue !== 0 && Math.abs(v.p - d.ue / d.vv) < 1e-4; }, msg: 'Has dividido por el módulo al cuadrado: eso da el coeficiente del vector proyección, no la longitud de la sombra.' }
    ],
    hint: function () { return 'Proyección de $\\vec u$ sobre $\\vec v$: $\\frac{\\vec u\\cdot\\vec v}{|\\vec v|}$.'; },
    steps: function (d) { return ['$\\vec u\\cdot\\vec v = ' + d.ue + '$ y $|\\vec v| = \\sqrt{' + d.vv + '}$.', 'Proyección: $\\dfrac{' + d.ue + '}{\\sqrt{' + d.vv + '}} \\approx ' + U.fmt(d.val, 4) + '$' + (d.ue < 0 ? ' (negativa: el ángulo es obtuso).' : '.')]; },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Ángulo entre dos vectores',
    level: 'avanzado',
    gen: function (r) {
      var u = [r.nz(-6, 6), r.nz(-6, 6)], v = [r.nz(-6, 6), r.nz(-6, 6)];
      var pe = u[0] * v[0] + u[1] * v[1];
      var mu = Math.hypot(u[0], u[1]), mv = Math.hypot(v[0], v[1]);
      var ang = Math.acos(U.clamp(pe / (mu * mv), -1, 1)) * 180 / Math.PI;
      return { u: u, v: v, pe: pe, mu: mu, mv: mv, ang: ang };
    },
    ask: function (d) {
      return 'Halla el ángulo que forman $\\vec{u} = (' + d.u + ')$ y $\\vec{v} = (' + d.v + ')$, ' +
        'en grados y con un decimal.';
    },
    fields: [{ name: 'a', label: 'Ángulo (°)', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.ang, 1) }; },
    tol: 2e-3,
    hint: function () { return 'Usa $\\cos\\alpha = \\dfrac{\\vec{u}\\cdot\\vec{v}}{|\\vec{u}||\\vec{v}|}$ y después el arco coseno.'; },
    steps: function (d) {
      return ['Producto escalar: $\\vec{u}\\cdot\\vec{v} = ' + d.pe + '$.',
        'Módulos: $|\\vec{u}| = ' + U.fmt(d.mu, 4) + '$ y $|\\vec{v}| = ' + U.fmt(d.mv, 4) + '$.',
        '$\\cos\\alpha = \\dfrac{' + d.pe + '}{' + U.fmt(d.mu * d.mv, 4) + '} = ' + U.fmt(d.pe / (d.mu * d.mv), 4) + '$',
        '$\\alpha = \\arccos(' + U.fmt(d.pe / (d.mu * d.mv), 4) + ') \\approx ' + U.fmt(d.ang, 1) + '^\\circ$'];
    },
    answer: function (d) { return U.fmt(d.ang, 1) + '°'; }
  });

  p.exercise({
    title: 'Coordenadas en otra base',
    level: 'avanzado',
    gen: function (r) {
      var u = [r.pm(0, 3), r.pm(0, 3)], v = [r.pm(0, 3), r.pm(0, 3)];
      if (u[0] * v[1] - u[1] * v[0] === 0) return null;
      var a = r.pm(1, 4), b = r.pm(1, 4);
      return { u: u, v: v, a: a, b: b, w: [a * u[0] + b * v[0], a * u[1] + b * v[1]] };
    },
    ask: function (d) { return 'Escribe $\\vec w = (' + d.w.join(',\\ ') + ')$ como combinación lineal $a\\,\\vec u + b\\,\\vec v$ de $\\vec u = (' + d.u.join(',\\ ') + ')$ y $\\vec v = (' + d.v.join(',\\ ') + ')$.'; },
    fields: [{ name: 'a', label: 'a =', w: 'tiny' }, { name: 'b', label: 'b =', w: 'tiny' }],
    sol: function (d) { return { a: d.a, b: d.b }; },
    errores: [{ si: function (v, d) { return d.a !== d.b && v.a === d.b && v.b === d.a; }, msg: 'Están intercambiados: $a$ acompaña a $\\vec u$ y $b$ a $\\vec v$.' }],
    hint: function (d) { return ['Plantea $(' + d.w.join(', ') + ') = a(' + d.u.join(', ') + ') + b(' + d.v.join(', ') + ')$ componente a componente.', 'Sale un sistema de dos ecuaciones con incógnitas $a$ y $b$.']; },
    steps: function (d) {
      return ['$\\begin{cases} ' + ML.termTex(d.u[0], 'a', 1, true) + ML.termTex(d.v[0], 'b', 1, !d.u[0]) + ' = ' + d.w[0] + ' \\\\ ' + ML.termTex(d.u[1], 'a', 1, true) + ML.termTex(d.v[1], 'b', 1, !d.u[1]) + ' = ' + d.w[1] + '\\end{cases}$',
        'Resolviendo: $a = ' + d.a + '$, $b = ' + d.b + '$. Como $\\vec u$ y $\\vec v$ no son paralelos, la solución es única.'];
    },
    answer: function (d) { return 'a = ' + d.a + ', b = ' + d.b; }
  });

  p.keys([
    'Dos vectores no paralelos forman una base del plano; las coordenadas de otro vector en ella salen de un sistema.',
    'Proyección de $\\vec u$ sobre $\\vec v$: $\\frac{\\vec u\\cdot\\vec v}{|\\vec v|}$, la sombra de $\\vec u$ en la dirección de $\\vec v$.',
    'Vector = módulo + dirección + sentido. En componentes, $\\vec{v}=(v_1,v_2)$.',
    '$\\vec{AB} = B - A$: final menos inicial. Nunca al revés.',
    '$|\\vec{v}| = \\sqrt{v_1^2+v_2^2}$ — Pitágoras otra vez.',
    'Se suman componente a componente; multiplicar por $k$ estira (y si $k<0$, da la vuelta).',
    'Producto escalar $= u_1v_1+u_2v_2 = |\\vec u||\\vec v|\\cos\\alpha$.',
    '<strong>Producto escalar cero ⟺ perpendiculares.</strong>'
  ]);
});
