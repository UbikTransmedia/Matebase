/* Tema: El disco de Poincare en un shader */
Course.topic('gfx-hiperbolico', function (p) {

  p.text('En [[av-noeuclidea]] apareció una geometría en la que por un punto exterior a una recta pasan ' +
    'infinitas paralelas, los triángulos suman menos de $180^\\circ$ y el espacio «crece» mucho más deprisa que ' +
    'el plano. Parece imposible de dibujar, porque no cabe en una hoja sin deformarse. Pero hay una manera de ' +
    'meterla entera en un círculo: el <strong>disco de Poincaré</strong>. Y como un shader pinta cualquier ' +
    'función del plano, la geometría hiperbólica se puede ver, recorrer y teselar en tiempo real.');

  /* ---------------------------------------------------------------- */
  p.section('El disco de Poincaré');

  p.text('Todo el plano hiperbólico se representa dentro del círculo de radio 1. Los puntos del borde no forman ' +
    'parte de él: están infinitamente lejos. Las <strong>rectas</strong> son los diámetros y los arcos de ' +
    'circunferencia que cortan el borde en ángulo recto. Y las <strong>distancias</strong> se estiran cada vez más ' +
    'al acercarse al borde, de modo que un paso que en el centro parece largo, cerca del borde parece diminuto.');

  p.formula('d_H(0, z) = \\ln\\frac{1 + |z|}{1 - |z|} = 2\\operatorname{argth}|z|',
    'la distancia hiperbólica al centro del disco',
    'Cuando $|z|$ es pequeño, $d_H \\approx 2|z|$: cerca del centro el disco se parece al plano, a escala doble.<br><br>' +
    'Cuando $|z| \\to 1$, el denominador tiende a 0 y la distancia al [[fn-exp-log|logaritmo]] crece sin límite: el ' +
    'borde está a distancia infinita.<br><br>Por ejemplo, $|z| = 0{,}9$ está a distancia $\\ln 19 \\approx 2{,}94$, y ' +
    '$|z| = 0{,}99$, a $\\ln 199 \\approx 5{,}29$.');

  p.demo({
    title: 'Casillas del mismo tamaño',
    intro: 'Un tablero en coordenadas polares hiperbólicas: cada anillo está a la misma distancia hiperbólica del siguiente. Todas las casillas de un mismo anillo son iguales, aunque a nuestros ojos se encojan hacia el borde. Nunca se llega al borde: siempre caben más anillos.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-hiperbolico-1', alto: 320,
        aria: 'Un disco dividido en casillas por anillos y radios; los anillos se apiñan cada vez más cerca del borde.',
        mandos: [
          { n: 'paso', label: 'distancia entre anillos', min: 0.2, max: 1.5, step: 0.05, value: 0.6, dec: 2 },
          { n: 'radios', label: 'sectores', min: 4, max: 24, step: 2, value: 12, dec: 0 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 z = (fragCoord - 0.5 * iResolution.xy) / iResolution.y * 2.1;\n' +
          '    float r = length(z);\n' +
          '    if (r >= 1.0) { color = vec4(vec3(0.06), 1.0); return; }\n' +
          '\n' +
          '    // distancia hiperbolica al centro: crece sin limite hacia el borde\n' +
          '    float dh = log((1.0 + r) / (1.0 - r));\n' +
          '    float a = atan(z.y, z.x);\n' +
          '\n' +
          '    // un tablero en coordenadas polares hiperbolicas\n' +
          '    float casilla = mod(floor(dh / paso) + floor(a / TAU * radios), 2.0);\n' +
          '    vec3 c = mix(vec3(0.15, 0.3, 0.55), vec3(0.95, 0.85, 0.6), casilla);\n' +
          '\n' +
          '    // oscurecer hacia el borde, donde se amontona todo\n' +
          '    c *= 0.35 + 0.65 * (1.0 - r * r);\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Cambia <code>dh</code> por <code>r</code> en la línea del tablero y los anillos pasarán a estar a la misma distancia euclídea: en ese caso sí se acabarían.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Moverse por el disco: transformaciones de Möbius');

  p.text('En el plano, desplazarse es sumar un vector. En el disco hiperbólico no sirve: sumar sacaría puntos del ' +
    'disco. Los desplazamientos que conservan las distancias hiperbólicas son otras funciones, fáciles de escribir ' +
    'con [[al-complejos|números complejos]]:');

  p.formula('f_a(z) = \\frac{z - a}{1 - \\overline{a}\\,z}, \\qquad |a| < 1',
    'la traslación hiperbólica que lleva a al centro',
    '$\\overline{a}$ es el conjugado de $a$. Es una <strong>transformación de Möbius</strong>, un cociente de dos ' +
    'expresiones de primer grado en $z$.<br><br>$f_a(a) = 0$: el punto $a$ va a parar al centro del disco. Y si ' +
    '$|z| < 1$, también $|f_a(z)| < 1$: el disco se transforma en sí mismo.<br><br>Para el ojo, una traslación ' +
    'hiperbólica no parece un desplazamiento: las figuras crecen al acercarse al centro y se encogen al alejarse, ' +
    'pero en la geometría del disco no han cambiado de tamaño.<br><br>En GLSL, con un <code>vec2</code> por complejo, ' +
    'hacen falta el producto y la división de complejos.');

  /* ---------------------------------------------------------------- */
  p.section('Teselados hiperbólicos por reflexiones');

  p.text('En el plano, solo triángulos, cuadrados y hexágonos regulares teselan: con $p$ lados y $q$ polígonos por ' +
    'vértice hace falta $\\frac{1}{p} + \\frac{1}{q} = \\frac{1}{2}$ (lo viste en [[gfx-mosaicos]]). En el plano ' +
    'hiperbólico, en cambio, hay un teselado regular para cada par con $\\frac{1}{p} + \\frac{1}{q} < \\frac{1}{2}$: ' +
    'heptágonos de tres en tres, cuadrados de cinco en cinco, pentágonos de cuatro en cuatro… Infinitos teselados ' +
    'distintos.');

  p.text('Para dibujarlos se usa el mismo truco de los caleidoscopios de [[gfx-simetria]]: todo el mosaico es un ' +
    'pequeño triángulo reflejado muchas veces. Cada píxel se «dobla» con reflexiones hasta caer dentro de ese ' +
    'triángulo, y se cuenta cuántas veces se ha doblado. Dos lados del triángulo son rectas por el centro; el tercero ' +
    'es un arco de circunferencia perpendicular al borde, y reflejar en él es una <strong>inversión</strong>.');

  p.formula('c = \\frac{\\cos\\frac{\\pi}{q}}{\\sqrt{\\cos^2\\frac{\\pi}{q} - \\operatorname{sen}^2\\frac{\\pi}{p}}}, \\qquad \\rho = c\\,\\frac{\\operatorname{sen}\\frac{\\pi}{p}}{\\cos\\frac{\\pi}{q}}, \\qquad z \\to \\vec c + (z - \\vec c)\\,\\frac{\\rho^2}{|z - \\vec c|^2}',
    'la circunferencia del triángulo fundamental y la inversión en ella',
    'La circunferencia tiene centro $(c, 0)$ y radio $\\rho$. Cumple $c^2 - \\rho^2 = 1$, que es la condición para cortar al ' +
    'borde del disco en ángulo recto.<br><br>La raíz solo existe si $\\cos\\frac{\\pi}{q} > \\operatorname{sen}\\frac{\\pi}{p}$, ' +
    'que equivale a $\\frac{1}{p} + \\frac{1}{q} < \\frac{1}{2}$: la condición hiperbólica aparece sola en la fórmula.<br><br>' +
    'La inversión deja fijos los puntos de la circunferencia e intercambia su interior y su exterior, igual que un ' +
    'espejo intercambia los dos lados de una recta.');

  p.demo({
    title: 'Un teselado hiperbólico en movimiento',
    intro: 'Elige cuántos lados tienen los polígonos y cuántos se juntan en cada vértice. El shader dobla cada píxel con reflexiones hasta el triángulo fundamental y lo colorea según haya hecho un número par o impar de reflexiones. Sube el movimiento para trasladarte por el plano hiperbólico con una transformación de Möbius: todos los polígonos son iguales, aunque no lo parezca.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-hiperbolico-2', alto: 340,
        aria: 'Un teselado hiperbólico regular dentro del disco de Poincaré, con polígonos que se hacen diminutos hacia el borde y que se desplazan.',
        mandos: [
          { n: 'lados', label: 'lados de cada polígono (p)', min: 3, max: 8, step: 1, value: 7, dec: 0 },
          { n: 'porVertice', label: 'polígonos por vértice (q)', min: 3, max: 8, step: 1, value: 3, dec: 0 },
          { n: 'movimiento', label: 'movimiento', min: 0.0, max: 1.0, step: 0.01, value: 0.4, dec: 2 },
          { n: 'triangulos', label: 'marcar los triángulos', min: 0, max: 1, step: 1, value: 0, dec: 0 }
        ],
        codigo:
          'vec2 mulC(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }\n' +
          'vec2 divC(vec2 a, vec2 b) { return vec2(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y) / dot(b, b); }\n' +
          '\n' +
          '// traslacion hiperbolica: lleva el punto a al centro del disco\n' +
          'vec2 mobius(vec2 z, vec2 a)\n' +
          '{\n' +
          '    return divC(z - a, vec2(1.0, 0.0) - mulC(vec2(a.x, -a.y), z));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 z = (fragCoord - 0.5 * iResolution.xy) / iResolution.y * 2.1;\n' +
          '    if (dot(z, z) >= 1.0) { color = vec4(vec3(0.06), 1.0); return; }\n' +
          '\n' +
          '    // p y q, forzando la condicion hiperbolica 1/p + 1/q < 1/2\n' +
          '    float P = floor(lados);\n' +
          '    float Q = max(floor(porVertice), floor(2.0 * P / (P - 2.0)) + 1.0);\n' +
          '\n' +
          '    vec2 a = 0.6 * movimiento * vec2(cos(0.25 * iTime), sin(0.35 * iTime));\n' +
          '    z = mobius(z, a);\n' +
          '\n' +
          '    // el triangulo fundamental: dos rectas por el centro y un arco\n' +
          '    float cq = cos(PI / Q), sp = sin(PI / P);\n' +
          '    float cx = cq / sqrt(cq * cq - sp * sp);\n' +
          '    float rr = cx * sp / cq;\n' +
          '    vec2 n = vec2(-sin(PI / P), cos(PI / P));\n' +
          '\n' +
          '    float saltos = 0.0;\n' +
          '    for (int i = 0; i < 48; i++) {\n' +
          '        float hecho = 0.0;\n' +
          '        if (z.y < 0.0) { z.y = -z.y; saltos += 1.0; hecho = 1.0; }            // espejo: eje x\n' +
          '        float dd = dot(z, n);\n' +
          '        if (dd > 0.0) { z -= 2.0 * dd * n; saltos += 1.0; hecho = 1.0; }       // espejo: recta a angulo PI/p\n' +
          '        vec2 w = z - vec2(cx, 0.0);\n' +
          '        float l2 = dot(w, w);\n' +
          '        if (l2 < rr * rr) { z = vec2(cx, 0.0) + w * (rr * rr / l2); saltos += 1.0; hecho = 1.0; }   // inversion\n' +
          '        if (hecho < 0.5) break;\n' +
          '    }\n' +
          '\n' +
          '    float lado = abs(length(z - vec2(cx, 0.0)) - rr);                 // lado del poligono\n' +
          '    float radio = min(abs(z.y), abs(dot(z, n)));                       // lados del triangulo\n' +
          '    vec3 c = mix(vec3(0.15, 0.3, 0.55), vec3(0.95, 0.85, 0.6), mod(saltos, 2.0));\n' +
          '    c = mix(c, vec3(0.05), 0.9 * (1.0 - smoothstep(0.0, 0.012, lado)));\n' +
          '    c = mix(c, vec3(0.05), 0.4 * triangulos * (1.0 - smoothstep(0.0, 0.006, radio)));\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Si eliges un par con 1/p + 1/q ≥ 1/2, el shader sube q hasta el primer valor hiperbólico: esos pares no existen en este disco, sino en el plano o en la esfera.'
      });
    }
  });

  p.hist('Henri Poincaré propuso el modelo del disco en la década de 1880, estudiando ecuaciones diferenciales, ' +
    'no dibujos. En 1956, el geómetra canadiense Donald Coxeter envió a M. C. Escher un artículo con una figura de ' +
    'un teselado hiperbólico de triángulos. Escher no entendió las fórmulas, pero sí el dibujo, y a partir de él ' +
    'creó la serie <em>Límite circular</em> (1958-1960), con peces que se hacen infinitamente pequeños hacia el ' +
    'borde. Coxeter escribió después que Escher había construido las líneas con una precisión de milímetros, sin ' +
    'más ayuda que el compás y la intuición.');

  p.util('La geometría hiperbólica ha encontrado un uso muy concreto en la informática: las redes jerárquicas, ' +
    'como un árbol genealógico o las relaciones entre palabras, crecen exponencialmente, igual que el plano ' +
    'hiperbólico. Por eso se representan mucho mejor en un disco de Poincaré que en un plano, y hay sistemas de ' +
    'aprendizaje automático que colocan los datos en espacios hiperbólicos.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Distancia hiperbólica al centro',
    level: 'basico',
    gen: function (r) {
      var z = r.pick([0.2, 0.5, 0.6, 0.8, 0.9, 0.95, 0.99]);
      return { z: z, d: Math.log((1 + z) / (1 - z)) };
    },
    ask: function (d) { return 'En el disco de Poincaré, ¿a qué distancia hiperbólica del centro está un punto con $|z| = ' + U.fmt(d.z, 2) + '$? (Tres decimales.)'; },
    fields: [{ name: 'd', label: 'distancia', w: 'wide' }],
    sol: function (d) { return { d: U.round(d.d, 6) }; },
    tol: 1e-3,
    errores: [
      { si: function (v, d) { return Math.abs(v.d - d.z) < 5e-4; }, msg: 'Esa es la distancia euclídea, la que mide una regla sobre el dibujo. En el disco las distancias se estiran hacia el borde: $d_H = \\ln\\frac{1 + |z|}{1 - |z|}$.' },
      { si: function (v, d) { return Math.abs(v.d - Math.log10((1 + d.z) / (1 - d.z))) < 5e-4; }, msg: 'Es el logaritmo <strong>neperiano</strong>, en base $e$, no el decimal.' }
    ],
    hint: function () { return ['$d_H = \\ln\\dfrac{1 + |z|}{1 - |z|}$.']; },
    steps: function (d) {
      return ['$d_H = \\ln\\dfrac{1 + ' + U.fmt(d.z, 2) + '}{1 - ' + U.fmt(d.z, 2) + '} = \\ln ' + U.fmt((1 + d.z) / (1 - d.z), 3) + ' \\approx ' + U.fmt(d.d, 3) + '$',
        'En el dibujo está a ' + U.fmt(d.z, 2) + ' del centro, pero en la geometría del disco, a ' + U.fmt(d.d, 3) + '.'];
    },
    answer: function (d) { return U.fmt(d.d, 3); }
  });

  p.exercise({
    title: '¿Esfera, plano o disco?',
    level: 'medio',
    gen: function (r) {
      var pq = r.pick([[3, 3], [3, 4], [4, 3], [3, 5], [5, 3], [4, 4], [3, 6], [6, 3], [3, 7], [4, 5], [5, 4], [7, 3], [6, 4], [8, 3]]);
      var s = ML.F(1, pq[0]).add(ML.F(1, pq[1]));
      var cmp = s.cmp(ML.F(1, 2));
      return { p: pq[0], q: pq[1], s: s, tipo: cmp > 0 ? 'esfera' : (cmp === 0 ? 'plano' : 'disco') };
    },
    ask: function (d) {
      return 'Se quiere teselar con polígonos regulares de $p = ' + d.p + '$ lados, juntando $q = ' + d.q + '$ en cada vértice. ¿Dónde es posible ese mosaico regular?';
    },
    fields: [{ name: 't', label: 'Es posible en', opts: [{ t: 'la esfera (es un poliedro regular)', v: 'esfera' }, { t: 'el plano euclídeo', v: 'plano' }, { t: 'el plano hiperbólico', v: 'disco' }] }],
    sol: function (d) { return { t: d.tipo }; },
    hint: function () { return ['Calcula $\\frac{1}{p} + \\frac{1}{q}$ y compáralo con $\\frac{1}{2}$.', 'Mayor: esfera. Igual: plano. Menor: hiperbólico.']; },
    steps: function (d) {
      return ['$\\dfrac{1}{' + d.p + '} + \\dfrac{1}{' + d.q + '} = ' + d.s.tex() + '$, que es ' + (d.tipo === 'esfera' ? 'mayor' : (d.tipo === 'plano' ? 'igual' : 'menor')) + ' que $\\frac{1}{2}$.',
        { esfera: 'Los polígonos «sobran» ángulo en cada vértice y el mosaico se cierra sobre sí mismo: es uno de los cinco poliedros regulares.',
          plano: 'Los ángulos encajan exactamente en $360^\\circ$: es uno de los tres mosaicos regulares del plano.',
          disco: 'Falta ángulo para cerrar en el plano, y el mosaico solo existe en el plano hiperbólico, donde los polígonos tienen ángulos menores.' }[d.tipo]];
    },
    answer: function (d) { return { esfera: 'Esfera', plano: 'Plano', disco: 'Plano hiperbólico' }[d.tipo]; }
  });

  p.exercise({
    title: 'Una traslación de Möbius',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([0.2, 0.5, -0.5, 0.25, -0.25]), z = r.pick([0, 0.5, -0.5, 0.8, -0.8, 0.25]);
      if (a === z) return null;
      return { a: a, z: z, w: (z - a) / (1 - a * z), resta: z - a };
    },
    ask: function (d) {
      return 'La traslación hiperbólica $f_a(z) = \\dfrac{z - a}{1 - \\overline{a}\\,z}$, con $a = ' + U.fmt(d.a, 2) + '$ (un número real, así que $\\overline{a} = a$), ¿a dónde lleva el punto $z = ' + U.fmt(d.z, 2) + '$? (Tres decimales.)';
    },
    fields: [{ name: 'w', label: '$f_a(z)$', w: 'wide' }],
    sol: function (d) { return { w: U.round(d.w, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(d.resta - d.w) > 2e-3 && Math.abs(v.w - d.resta) < 5e-4; }, msg: 'Eso sería una traslación del plano euclídeo. En el disco hay que dividir por $1 - \\overline{a}\\,z$, que es lo que mantiene los puntos dentro.' }],
    hint: function () { return ['Con números reales: $f_a(z) = \\dfrac{z - a}{1 - a\\,z}$.']; },
    steps: function (d) {
      return ['$f_a(' + U.fmt(d.z, 2) + ') = \\dfrac{' + U.fmt(d.z, 2) + ' - ' + (d.a < 0 ? '(' + U.fmt(d.a, 2) + ')' : U.fmt(d.a, 2)) + '}{1 - ' + (d.a < 0 ? '(' + U.fmt(d.a, 2) + ')' : U.fmt(d.a, 2)) + '\\cdot ' + (d.z < 0 ? '(' + U.fmt(d.z, 2) + ')' : U.fmt(d.z, 2)) + '} \\approx ' + U.fmt(d.w, 3) + '$',
        'Queda dentro del disco, $|f_a(z)| < 1$, aunque $z$ esté muy cerca del borde.'];
    },
    answer: function (d) { return U.fmt(d.w, 3); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float r = length(z);\nfloat dh = log((1.0 + r) / (1.0 - r));\nfloat v = step(0.5, fract(dh));',
          o: ['Anillos concéntricos cada vez más apretados hacia el borde del disco', 'Anillos concéntricos todos igual de separados', 'Radios que salen del centro', 'Un disco blanco uniforme'],
          por: 'Cada anillo ocupa la misma distancia hiperbólica, y esas distancias se encogen a la vista cerca del borde: los anillos se apiñan.' },
        { c: 'float r = length(z);\nfloat v = step(0.5, fract(8.0 * r));',
          o: ['Anillos concéntricos todos igual de separados, que acaban en el borde', 'Anillos cada vez más apretados hacia el borde', 'Un tablero de ajedrez', 'Radios que salen del centro'],
          por: 'Aquí se usa la distancia euclídea $r$: ocho anillos por unidad, todos iguales, y al llegar a $r = 1$ se acaban.' },
        { c: 'z = mobius(z, vec2(0.5, 0.0));   // antes del teselado',
          o: ['El teselado aparece desplazado: los polígonos de un lado se agrandan y los del otro se encogen, pero todos siguen siendo iguales en la geometría del disco', 'El teselado se ve igual', 'El teselado se desplaza como en el plano, sin deformarse', 'El teselado se sale del disco'],
          por: 'Una traslación hiperbólica lleva el punto $(0{,}5, 0)$ al centro. A la vista eso deforma las figuras, pero conserva las distancias hiperbólicas.' },
        { c: 'float v = mod(saltos, 2.0);',
          o: ['Triángulos alternados en dos colores, como un tablero de ajedrez curvo', 'Todo el disco de un color', 'Solo las líneas de los bordes', 'Anillos concéntricos'],
          por: 'Cada reflexión cambia la paridad del contador: triángulos vecinos, separados por un espejo, reciben colores distintos.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'Con <code>z</code> el punto del disco de radio 1 y las funciones del tema, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Se mide con la distancia euclídea o con la hiperbólica?', 'Una transformación de Möbius deforma a la vista, pero no en la geometría del disco.']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'En el disco de Poincaré el borde está a distancia infinita: $d_H(0, z) = \\ln\\frac{1 + |z|}{1 - |z|}$.',
    'Las rectas hiperbólicas son diámetros y arcos perpendiculares al borde.',
    'Las traslaciones hiperbólicas son transformaciones de Möbius, $f_a(z) = \\frac{z - a}{1 - \\overline{a}z}$, que se programan con complejos.',
    'Hay un teselado regular $\\{p, q\\}$ hiperbólico para cada par con $\\frac{1}{p} + \\frac{1}{q} < \\frac{1}{2}$, y se dibuja doblando cada píxel con reflexiones hasta un triángulo fundamental.'
  ]);
});
