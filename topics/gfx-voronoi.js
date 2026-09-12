/* Tema: Voronoi: el patrón de las células */
Course.topic('gfx-voronoi', function (p) {

  p.puente('La rejilla del tema de repetición ponía una figura en cada celda; este tema pone un punto ' +
    'y pregunta cuál queda más cerca. Las fronteras que salen son [[ge-rectas|mediatrices]], y cambiar ' +
    'la [[av-espacios|norma]] con la que se mide cambia la forma de las celdas.');

  p.text('Hay un patrón que aparece en sitios que no tienen nada que ver entre sí: las manchas de ' +
    'una jirafa, las escamas de una piña, el barro seco de una charca, las burbujas de una espuma, ' +
    'los granos de un metal visto al microscopio, las celdas de un panal y el reparto de las galaxias ' +
    'en el universo. Es siempre el mismo, y sale de una pregunta de una sola línea: ' +
    '<strong>¿cuál es el punto sembrado más cercano?</strong>');

  p.section('La construcción');

  p.text('Siembra unos cuantos puntos por el plano. Ahora, para cada punto del plano, pregúntate ' +
    'cuál de los sembrados te queda más cerca. Los que comparten respuesta forman una región, y esas ' +
    'regiones se llaman <strong>celdas de Voronoi</strong>.');

  p.text('Las fronteras salen solas y son exactamente lo que estudiaste en geometría: entre dos ' +
    'puntos sembrados, la frontera es la <strong>mediatriz</strong> del segmento que los une, porque ' +
    'ahí es donde las dos distancias empatan. Todas las celdas son polígonos convexos, y el reparto ' +
    'cubre el plano entero sin huecos y sin solapes.');

  p.note('El dual de este dibujo —unir con una arista los puntos cuyas celdas se tocan— es la ' +
    '<strong>triangulación de Delaunay</strong>, que es un [[av-grafos|grafo]] con propiedades muy ' +
    'buenas: es la triangulación que evita los triángulos afilados. Las dos construcciones son la ' +
    'misma información vista del derecho y del revés.', null, 'Voronoi y Delaunay');

  p.ejemplo({
    title: 'Tres semillas y un píxel',
    enunciado: 'Semillas $A = (0, 0)$, $B = (2, 0)$ y $C = (0, 2)$. Para el píxel $(0{,}8,\\ 0{,}9)$, calcular $F_1$, $F_2$, la celda ganadora y la lectura $F_2 - F_1$. Repetir con la distancia Manhattan.',
    pasos: [
      { t: '<strong>Las tres distancias.</strong> A $A$: $\\sqrt{0{,}64 + 0{,}81} = \\sqrt{1{,}45} \\approx 1{,}204$. A $B$: $\\sqrt{1{,}44 + 0{,}81} = 1{,}5$. A $C$: $\\sqrt{0{,}64 + 1{,}21} \\approx 1{,}360$.', antes: 'Pitágoras tres veces.' },
      { t: '<strong>Ordenar.</strong> $F_1 = 1{,}204$ (gana $A$), $F_2 = 1{,}360$ ($C$). El píxel está en la celda de $A$.' },
      { t: '<strong>La grieta.</strong> $F_2 - F_1 = 0{,}156$: pequeño, el píxel está cerca de la frontera entre $A$ y $C$. Esa frontera es la mediatriz de $AC$, la recta $y = 1$, y el píxel está a $0{,}1$ de ella. La resta no da 0,1 exacto: es una aproximación, siempre algo mayor.', antes: '¿Cuál es la mediatriz de $A$ y $C$? ¿A qué distancia está el píxel de ella?' },
      { t: '<strong>Con Manhattan.</strong> A $A$: $0{,}8 + 0{,}9 = 1{,}7$. A $B$: $1{,}2 + 0{,}9 = 2{,}1$. A $C$: $0{,}8 + 1{,}1 = 1{,}9$. Sigue ganando $A$, pero las fronteras ya no son las mismas rectas: salen tramos a 45° y las celdas cambian de forma.', antes: 'Suma de valores absolutos en vez de raíz de cuadrados. ¿Cambia el ganador?' }
    ],
    cierre: 'El mismo píxel, las mismas semillas, y dos mosaicos distintos según cómo se mida. El bucle del shader hace exactamente esto, nueve veces por píxel.'
  });

  p.section('Hacerlo en un shader: sembrar sin lista');

  p.text('El problema evidente es que un shader no puede tener una lista de puntos y recorrerla. ' +
    'Pero no hace falta: se usa la idea del tema de [[gfx-repetir|repetición]] al revés. Se parte el ' +
    'plano en celdas cuadradas y <strong>cada celda siembra un punto dentro de sí misma</strong>, en ' +
    'la posición que le diga el <em>hash</em> de sus coordenadas. Nada guardado, todo recalculado.');

  p.text('Y aquí está la trampa que hay que ver antes de escribir una línea: ' +
    '<strong>el punto más cercano no tiene por qué estar en tu celda</strong>. Si tú estás pegado al ' +
    'borde derecho y el punto de tu celda está pegado al izquierdo, el de la celda vecina te pilla ' +
    'mucho más cerca. Por eso hay que mirar las <strong>nueve celdas</strong> del entorno: la tuya y ' +
    'las ocho de alrededor.');

  p.note('Nueve y no más, y eso se puede demostrar: como cada celda mide 1 y siembra su punto dentro, ' +
    'el punto de tu propia celda está como mucho a $\\sqrt{2} \\approx 1{,}41$ de ti; y cualquier ' +
    'punto de una celda que no toque la tuya está al menos a 1 de tu borde, o sea que <em>puede</em> ' +
    'quedar más cerca. Con celdas de lado 1 y un punto por celda, mirar 3×3 basta para el vecino más ' +
    'cercano, que es lo que dibujamos.', null, 'Por qué justo nueve');

  p.demo({
    title: 'Sembrar y preguntar',
    intro: 'Cada celda siembra un punto y cada píxel busca el más cercano de las nueve celdas vecinas. El brillo es la distancia a ese punto; los puntos negros son las semillas. Enciende el movimiento y mira cómo las fronteras se reorganizan solas.',
    predice: 'Con las semillas quietas, ¿las fronteras entre celdas serán rectas o curvas? ¿Y habrá alguna celda con un lado curvo?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-vor-1', alto: 340,
        aria: 'Un patrón de celdas de Voronoi con puntos sembrados que se mueven lentamente.',
        mandos: [
          { n: 'escala', label: 'celdas', min: 2, max: 16, step: 0.5, value: 6, dec: 1 },
          { n: 'mueve', label: 'movimiento', min: 0, max: 1, step: 0.05, value: 0.6, dec: 2 },
          { n: 'verPuntos', label: 'ver las semillas', min: 0, max: 1, step: 1, value: 1, dec: 0 }
        ],
        codigo:
          '// un hash que devuelve DOS numeros: la posicion dentro de la celda\n' +
          'vec2 hash2(vec2 p)\n' +
          '{\n' +
          '    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));\n' +
          '    return fract(sin(p) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = escala * fragCoord / iResolution.y;\n' +
          '\n' +
          '    vec2 celda  = floor(p);\n' +
          '    vec2 dentro = fract(p);\n' +
          '\n' +
          '    float d = 8.0;          // la mejor distancia encontrada\n' +
          '    float dSemilla = 8.0;   // solo para pintar los puntos\n' +
          '\n' +
          '    // las NUEVE celdas del entorno\n' +
          '    for (int j = -1; j <= 1; j++) {\n' +
          '        for (int i = -1; i <= 1; i++) {\n' +
          '            vec2 g = vec2(float(i), float(j));      // que vecina\n' +
          '            vec2 o = hash2(celda + g);              // donde siembra\n' +
          '\n' +
          '            // que los puntos se muevan, cada uno a su aire\n' +
          '            o = 0.5 + 0.5 * sin(iTime * mueve + TAU * o);\n' +
          '\n' +
          '            vec2 hacia = g + o - dentro;            // del pixel al punto\n' +
          '            d = min(d, length(hacia));\n' +
          '            dSemilla = min(dSemilla, length(hacia));\n' +
          '        }\n' +
          '    }\n' +
          '\n' +
          '    vec3 c = vec3(d);                                // el degradado de la distancia\n' +
          '    c *= 0.5 + 0.5 * cos(TAU * (d + vec3(0.0, 0.2, 0.4)));\n' +
          '    c = mix(c, vec3(0.0), verPuntos * (1.0 - smoothstep(0.02, 0.05, dSemilla)));\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'El bucle no recorre puntos: recorre <strong>celdas</strong>. Da igual que la pantalla ' +
          'tenga cuatro semillas o cuatro mil, el coste por píxel es siempre el mismo: nueve ' +
          'preguntas.'
      });
    }
  });

  p.section('Tres cosas que devuelve el mismo bucle');

  p.text('Con muy poco más, el mismo recorrido de nueve celdas da tres informaciones distintas, y ' +
    'cada una dibuja algo diferente:');

  p.table(['Qué guardas', 'Qué dibuja'], [
    ['$F_1$: la distancia al más cercano', 'el degradado hacia cada semilla: escamas, burbujas, piedras'],
    ['La <strong>identidad</strong> de la celda ganadora', 'un color plano por celda: mosaico, manchas de jirafa, cristales'],
    ['$F_2 - F_1$: la diferencia con el segundo', 'las <strong>fronteras</strong>: grietas, juntas, nervios de una hoja']
  ]);

  p.text('La tercera merece una explicación. Si estás justo en la frontera entre dos celdas, las dos ' +
    'primeras distancias empatan y $F_2 - F_1 = 0$. Cuanto más te alejas de la frontera, más se ' +
    'separan. Así que esa resta <strong>es</strong>, aproximadamente, la distancia a la grieta más ' +
    'cercana. Y como es aproximada y no exacta, las esquinas donde se juntan tres celdas salen algo ' +
    'más gruesas; hay una versión exacta que necesita un segundo recorrido, pero para dibujar casi ' +
    'nunca compensa.');

  p.comprueba('En un píxel, $F_2 - F_1 = 0$. ¿Dónde está?', [
    { t: 'Justo en la frontera entre dos celdas: las dos semillas más cercanas empatan', ok: true, por: 'La frontera es el lugar donde no hay ganador claro. Por eso pintar «oscuro donde $F_2 - F_1$ es pequeño» dibuja las grietas.' },
    { t: 'Encima de una semilla', ok: false, por: 'Ahí $F_1 = 0$, pero $F_2$ es la distancia a la siguiente semilla, mayor que cero. La resta es máxima, no nula.' },
    { t: 'En el centro de una celda', ok: false, por: 'El centro de una celda es donde la semilla queda más claramente ganadora: la segunda está lejos y la resta es grande.' }
  ]);

  p.demo({
    title: 'Grietas, mosaico y piel',
    intro: 'El mismo bucle, mostrando cada una de las tres cosas. Cambia el modo y verás que la estructura por debajo es siempre idéntica: solo cambia qué se lee de ella.',
    predice: 'En modo grietas con grosor 0,08, ¿las esquinas donde se juntan tres celdas saldrán igual de finas que los lados, o más gruesas? Piensa en cuántas distancias empatan allí.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-vor-2', alto: 360,
        aria: 'Tres lecturas del mismo patrón de Voronoi: degradado, mosaico de colores y grietas.',
        mandos: [
          { n: 'modo', label: 'modo (0 piel, 1 mosaico, 2 grietas)', min: 0, max: 2, step: 1, value: 2, dec: 0 },
          { n: 'escala', label: 'celdas', min: 2, max: 14, step: 0.5, value: 7, dec: 1 },
          { n: 'grosor', label: 'grosor de la grieta', min: 0.01, max: 0.3, step: 0.01, value: 0.08, dec: 2 },
          { n: 'mueve', label: 'movimiento', min: 0, max: 1, step: 0.05, value: 0.3, dec: 2 }
        ],
        codigo:
          'vec2 hash2(vec2 p)\n' +
          '{\n' +
          '    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));\n' +
          '    return fract(sin(p) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = escala * fragCoord / iResolution.y;\n' +
          '    vec2 celda = floor(p), dentro = fract(p);\n' +
          '\n' +
          '    float d1 = 8.0, d2 = 8.0;      // la mejor y la segunda\n' +
          '    vec2 gana = vec2(0.0);         // quien gana\n' +
          '\n' +
          '    for (int j = -1; j <= 1; j++) {\n' +
          '        for (int i = -1; i <= 1; i++) {\n' +
          '            vec2 g = vec2(float(i), float(j));\n' +
          '            vec2 o = hash2(celda + g);\n' +
          '            o = 0.5 + 0.5 * sin(iTime * mueve + TAU * o);\n' +
          '\n' +
          '            float dist = length(g + o - dentro);\n' +
          '\n' +
          '            if (dist < d1)      { d2 = d1; d1 = dist; gana = celda + g; }\n' +
          '            else if (dist < d2) { d2 = dist; }\n' +
          '        }\n' +
          '    }\n' +
          '\n' +
          '    vec3 c;\n' +
          '\n' +
          '    if (modo < 0.5) {\n' +
          '        // PIEL: el degradado hacia cada semilla\n' +
          '        c = vec3(1.0 - d1) * vec3(0.95, 0.75, 0.45);\n' +
          '    } else if (modo < 1.5) {\n' +
          '        // MOSAICO: un color por celda, sacado de su identidad\n' +
          '        vec2 h = hash2(gana);\n' +
          '        c = 0.45 + 0.45 * cos(TAU * (h.x + vec3(0.0, 0.33, 0.67)));\n' +
          '        c *= 0.7 + 0.3 * h.y;\n' +
          '    } else {\n' +
          '        // GRIETAS: donde las dos primeras distancias empatan\n' +
          '        float borde = smoothstep(0.0, grosor, d2 - d1);\n' +
          '        c = mix(vec3(0.05, 0.03, 0.06), vec3(0.9, 0.85, 0.7), borde);\n' +
          '    }\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'En el modo mosaico, el color sale del <em>hash</em> de la celda ganadora. Como el ' +
          '<em>hash</em> es determinista, cada celda conserva su color aunque los puntos se muevan: ' +
          'las manchas cambian de forma pero no de identidad.'
      });
    }
  });

  p.section('Cambiar la distancia, cambiar el mundo');

  p.text('Nada obliga a usar la distancia de siempre. Si en vez de $\\sqrt{x^2+y^2}$ mides con otra ' +
    'regla, las celdas cambian de forma sin tocar ni una semilla:');

  p.table(['Métrica', 'Cómo se escribe', 'Qué sale'], [
    ['Euclídea', '<code>length(v)</code>', 'celdas poligonales normales'],
    ['Manhattan', '<code>abs(v.x) + abs(v.y)</code>', 'celdas con lados a 45°, aspecto de circuito'],
    ['Chebyshev', '<code>max(abs(v.x), abs(v.y))</code>', 'celdas rectangulares, aspecto de baldosa']
  ]);

  p.text('Esas tres son [[av-espacios|normas]] distintas sobre el mismo plano, las del álgebra lineal, y ' +
    'aquí se ve para qué sirve que existan varias: no son un capricho de matemático, son tres ' +
    'texturas visualmente distintas que salen de cambiar dos caracteres.');

  p.note('Y hay un uso que no tiene nada de decorativo. Si los puntos sembrados son ejemplos ya ' +
    'clasificados y cada región hereda la etiqueta del suyo, este mismo dibujo es la ' +
    '<strong>frontera de decisión</strong> de un clasificador: el del vecino más cercano, que a cada ' +
    'punto nuevo le contesta lo que diga el ejemplo que tenga más cerca. Se ve funcionando en ' +
    '[[ia-distancia|la primera IA es una distancia]].', 'ok', 'El mismo dibujo, clasificando');

  p.util('El diagrama de Voronoi es de las estructuras más reutilizadas que hay. En epidemiología lo ' +
    'usó John Snow en 1854, dibujando qué casas de Londres tenían más cerca la bomba de agua de Broad ' +
    'Street que cualquier otra, y con ese mapa demostró que el cólera iba por el agua. En logística ' +
    'define zonas de reparto; en telefonía, qué antena te atiende; en biología, el territorio de cada ' +
    'árbol o de cada nido; en geología, la cristalización de un metal al enfriarse. Y en gráficos es ' +
    'el generador de todo lo que parezca celular: escamas, pieles, adoquines, hielo roto.');

  p.hist('Georgi Voronói formalizó el reparto en 1908, aunque Descartes ya había dibujado algo ' +
    'parecido en 1644 al imaginar cómo se repartían las estrellas el espacio. En gráficos entró en ' +
    '1996 de la mano de Steven Worley, que publicó una función de ruido celular pensada exactamente ' +
    'para lo que estás haciendo aquí; por eso a este patrón se le llama a veces «ruido de Worley». Y ' +
    'aquel mapa del cólera de John Snow sigue siendo, siglo y medio después, el ejemplo de manual de ' +
    'cómo un dibujo bien pensado gana una discusión.');

  p.trampas([
    { e: 'Mirar solo la semilla de la propia celda', por: 'Un píxel pegado al borde derecho puede tener más cerca la semilla de la celda vecina. Sin las nueve celdas aparecen costuras rectas siguiendo la rejilla.' },
    { e: 'Olvidar sumar <code>g</code> a la semilla vecina', por: 'La semilla de la celda de al lado se mide desde <em>su</em> origen, una unidad más allá: el vector es <code>g + o - dentro</code>. Sin el <code>g</code>, todas las vecinas parecen estar en la celda propia.' },
    { e: 'Tomar $F_2 - F_1$ como distancia exacta a la frontera', por: 'Es una aproximación: da 0,156 donde la distancia real es 0,1. Por eso las esquinas de tres celdas salen más gruesas. Para dibujar, casi siempre basta.' },
    { e: 'Creer que cambiar la norma mueve las semillas', por: 'Las semillas no se tocan: cambia cómo se mide, y con ello quién gana en cada píxel. Manhattan y Chebyshev dan celdas de otra forma con la misma siembra.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Quién gana?',
    level: 'basico',
    gen: function (r) {
      var pts = [];
      for (var i = 0; i < 4; i++) pts.push([r.real(0, 3, 2), r.real(0, 3, 2)]);
      var qx = r.real(0.5, 2.5, 2), qy = r.real(0.5, 2.5, 2);
      var ds = pts.map(function (a) {
        return Math.sqrt((a[0] - qx) * (a[0] - qx) + (a[1] - qy) * (a[1] - qy));
      });
      var orden = ds.slice().sort(function (a, b) { return a - b; });
      var idx = ds.indexOf(orden[0]);
      return { pts: pts, qx: qx, qy: qy, ds: ds, d1: orden[0], d2: orden[1], gana: idx + 1 };
    },
    ask: function (d) {
      var filas = d.pts.map(function (a, i) {
        return 'semilla ' + (i + 1) + ': (' + U.fmt(a[0], 2) + ', ' + U.fmt(a[1], 2) + ')';
      }).join('<br>');
      return 'Cuatro semillas:<br><br>' + filas + '<br><br>El píxel está en <code>(' +
        U.fmt(d.qx, 2) + ', ' + U.fmt(d.qy, 2) + ')</code>.<br><br>¿Qué semilla gana, a qué distancia ' +
        'está ($F_1$) y a cuánto está la segunda ($F_2$)? (cuatro decimales)';
    },
    fields: [
      { name: 'g', label: 'semilla ganadora', w: 'tiny' },
      { name: 'a', label: 'F1', w: 'tiny' },
      { name: 'b', label: 'F2', w: 'tiny' }
    ],
    sol: function (d) { return { g: d.gana, a: U.round(d.d1, 8), b: U.round(d.d2, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'Cuatro distancias y a ordenar. No hace falta la raíz para comparar —basta con los ' +
        'cuadrados— pero sí para dar el resultado.';
    },
    steps: function (d) {
      var s = d.ds.map(function (x, i) {
        return 'A la semilla ' + (i + 1) + ': $' + U.fmt(x, 4) + '$';
      });
      s.push('La más cercana es la <strong>' + d.gana + '</strong>, con $F_1 = ' + U.fmt(d.d1, 4) +
        '$, y la segunda está a $F_2 = ' + U.fmt(d.d2, 4) + '$.');
      s.push('La diferencia $F_2 - F_1 = ' + U.fmt(d.d2 - d.d1, 4) + '$ mide lo lejos que estás de la ' +
        'frontera: si fuera cero, estarías justo encima de la mediatriz entre las dos.');
      return s;
    },
    answer: function (d) {
      return 'semilla ' + d.gana + ' · F1 = ' + U.fmt(d.d1, 4) + ' · F2 = ' + U.fmt(d.d2, 4);
    }
  });

  p.exercise({
    title: 'Por qué no basta con tu celda',
    level: 'medio',
    gen: function (r) {
      // el pixel esta pegado al borde derecho; su celda siembra a la izquierda
      var fx = r.real(0.82, 0.97, 2), fy = r.real(0.35, 0.65, 2);
      var ox = r.real(0.05, 0.25, 2), oy = r.real(0.3, 0.7, 2);   // punto de la celda propia
      var vx = r.real(0.05, 0.3, 2), vy = r.real(0.3, 0.7, 2);    // punto de la celda de la derecha
      var dPropio = Math.sqrt((ox - fx) * (ox - fx) + (oy - fy) * (oy - fy));
      var dVecino = Math.sqrt((1 + vx - fx) * (1 + vx - fx) + (vy - fy) * (vy - fy));
      return { fx: fx, fy: fy, ox: ox, oy: oy, vx: vx, vy: vy,
        dp: dPropio, dv: dVecino, mejor: Math.min(dPropio, dVecino) };
    },
    ask: function (d) {
      return 'Un píxel cae en <code>dentro = (' + U.fmt(d.fx, 2) + ', ' + U.fmt(d.fy, 2) + ')</code>, ' +
        'o sea muy pegado al borde derecho de su celda.<br><br>Su propia celda siembra en <code>(' +
        U.fmt(d.ox, 2) + ', ' + U.fmt(d.oy, 2) + ')</code>, y la celda de <strong>su derecha</strong> ' +
        'siembra en <code>(' + U.fmt(d.vx, 2) + ', ' + U.fmt(d.vy, 2) + ')</code> —pero medida desde ' +
        'el origen de <em>esa</em> celda, que está una unidad a la derecha—.<br><br>Calcula las dos ' +
        'distancias y di cuál es la buena. (cuatro decimales)';
    },
    fields: [
      { name: 'p', label: 'a la propia', w: 'tiny' },
      { name: 'v', label: 'a la vecina', w: 'tiny' },
      { name: 'm', label: 'F1 correcta', w: 'tiny' }
    ],
    sol: function (d) {
      return { p: U.round(d.dp, 8), v: U.round(d.dv, 8), m: U.round(d.mejor, 8) };
    },
    tol: 3e-4,
    hint: function () {
      return 'Para el punto de la celda vecina, súmale <code>(1, 0)</code> a su posición antes de ' +
        'restar: eso es exactamente lo que hace el <code>g +</code> del bucle.';
    },
    steps: function (d) {
      return ['A la semilla propia: $\\sqrt{(' + U.fmt(d.ox, 2) + ' - ' + U.fmt(d.fx, 2) + ')^2 + (' +
        U.fmt(d.oy, 2) + ' - ' + U.fmt(d.fy, 2) + ')^2} = ' + U.fmt(d.dp, 4) + '$',
        'A la de la derecha, que está en $(1 + ' + U.fmt(d.vx, 2) + ',\\ ' + U.fmt(d.vy, 2) +
          ')$: $' + U.fmt(d.dv, 4) + '$',
        (d.dv < d.dp
          ? '<strong>Gana la vecina</strong>, por ' + U.fmt(d.dp - d.dv, 4) + '. Un shader que solo ' +
            'mirase su propia celda daría aquí una respuesta falsa, y en la imagen aparecerían ' +
            'costuras rectas siguiendo la rejilla.'
          : 'Aquí gana la propia, por ' + U.fmt(d.dv - d.dp, 4) + '. Pero el shader no puede saberlo ' +
            'de antemano: por eso mira siempre las nueve, y por eso el coste es constante.'),
        'Esa es la razón entera del bucle doble de $-1$ a $1$.'];
    },
    answer: function (d) {
      return 'propia ' + U.fmt(d.dp, 4) + ' · vecina ' + U.fmt(d.dv, 4) + ' · F1 = ' + U.fmt(d.mejor, 4);
    }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float v = primera;   // distancia al punto sembrado mas cercano',
          o: ['Puntos oscuros en las semillas que se aclaran hacia fuera, formando celdas', 'Celdas de colores lisos', 'Solo las líneas de los bordes entre celdas', 'Rayas'],
          por: 'La distancia vale 0 en cada semilla y crece al alejarse, hasta el borde con la celda vecina, donde vuelve a empezar a contar desde otra semilla.' },
        { c: 'float v = segunda - primera;',
          o: ['Líneas oscuras en los bordes entre celdas y claro en su interior', 'Puntos oscuros en las semillas', 'Celdas de colores lisos', 'Un degradado uniforme'],
          por: 'En el borde entre dos celdas las dos semillas más cercanas están a la misma distancia, así que la diferencia vale 0: ahí sale oscuro.' },
        { c: 'vec3 col = 0.5 + 0.5 * cos(TAU * (hash(celdaMasCercana) + vec3(0.0, 0.33, 0.67)));',
          o: ['Celdas poligonales de colores lisos, como un mosaico de cristales', 'Manchas redondas difuminadas', 'Solo los bordes de las celdas', 'Rayas de colores'],
          por: 'Todos los píxeles de una celda comparten la misma semilla más cercana, y por tanto el mismo color.' },
        { c: 'float v = step(0.05, primera);',
          o: ['Fondo blanco con un punto negro en cada semilla', 'Fondo negro con un punto blanco en cada semilla', 'Líneas negras en los bordes', 'Celdas grises'],
          por: 'Solo cerca de una semilla la distancia es menor que 0,05; ahí el <code>step</code> da 0, negro, y en el resto, 1.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'En el Voronoi del tema, <code>primera</code> y <code>segunda</code> son las distancias a las dos semillas más cercanas. Con el color final <code>vec3(v)</code> o <code>col</code>, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Qué vale la distancia en una semilla? ¿Y en el borde entre dos celdas?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Cambia la regla de medir',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'la distancia <strong>euclídea</strong> de siempre',
          ref: 'length(g + o - dentro)' },
        { pide: 'la distancia <strong>Manhattan</strong>, la suma de los dos valores absolutos (celdas con lados en diagonal)',
          ref: 'abs(g.x + o.x - dentro.x) + abs(g.y + o.y - dentro.y)' },
        { pide: 'la distancia <strong>Chebyshev</strong>, el mayor de los dos valores absolutos (celdas rectangulares)',
          ref: 'max(abs(g.x + o.x - dentro.x), abs(g.y + o.y - dentro.y))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa el cálculo de la distancia dentro del bucle para usar ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 g = vec2(float(i), float(j));   // que celda vecina\nvec2 o = hash2(celda + g);           // donde siembra\nfloat dist = <strong>???</strong> ;\nd = min(d, dist);</pre>';
    },
    fields: [{ name: 'd', label: 'la distancia', w: 'wide' }],
    sol: function (d) { return { d: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.d || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'vec2 hash2(vec2 q){\n' +
          '  q = vec2(dot(q, vec2(127.1, 311.7)), dot(q, vec2(269.5, 183.3)));\n' +
          '  return fract(sin(q) * 43758.5453);\n}\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = 5.0 * fragCoord / iResolution.y;\n' +
          '  vec2 celda = floor(p), dentro = fract(p);\n' +
          '  float d = 8.0;\n' +
          '  for (int j = -1; j <= 1; j++) {\n' +
          '    for (int i = -1; i <= 1; i++) {\n' +
          '      vec2 g = vec2(float(i), float(j));\n' +
          '      vec2 o = hash2(celda + g);\n' +
          '      float dist = ' + x + ';\n' +
          '      d = min(d, dist);\n' +
          '    }\n  }\n' +
          '  color = vec4(vec3(d), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 8 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado tiene que ser un <code>float</code>: si ' +
          'usas <code>abs</code> sobre un <code>vec2</code>, te devuelve un <code>vec2</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero el patrón no es el pedido. El vector que va del ' +
          'píxel al punto sembrado es siempre <code>g + o - dentro</code>: lo único que cambia es ' +
          'cómo mides su longitud.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'El vector es el mismo en los tres casos: <code>g + o - dentro</code>. Cambia solo la ' +
        'norma: raíz de la suma de cuadrados, suma de valores absolutos, o el mayor de los dos.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Tres normas distintas, tres texturas distintas, la misma siembra por debajo.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Voronoi contesta una sola pregunta por punto: <strong>¿cuál es la semilla más cercana?</strong> Las fronteras que salen son mediatrices.',
    'En un shader se siembra <strong>un punto por celda</strong> con un <em>hash</em>: nada guardado, todo recalculado.',
    'Hay que mirar las <strong>nueve celdas</strong> del entorno, porque el punto más cercano puede estar en la de al lado.',
    'El mismo bucle da tres dibujos: $F_1$ (piel), la identidad de la celda (mosaico) y $F_2 - F_1$ (grietas).',
    'Cambiar la <strong>norma</strong> —euclídea, Manhattan, Chebyshev— cambia por completo la forma de las celdas.'
  ]);
});
