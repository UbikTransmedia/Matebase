/* Tema: Raymarching: 3D con una fórmula */
Course.topic('gfx-raymarching', function (p) {

  p.puente('El trazado resolvía la ecuación del choque; este tema no la resuelve: avanza. La ' +
    '[[gfx-distancia|distancia con signo]] del plano pasa a tres dimensiones sin cambiar una letra, el ' +
    'avance seguro es un método iterativo como los de [[av-numerico|cálculo numérico]], y la normal es ' +
    'el [[av-vectorial|gradiente]] del campo.');

  p.text('Un ordenador dibuja objetos en tres dimensiones partiéndolos en triángulos: miles, ' +
    'millones de triangulitos guardados en memoria, cada uno con sus tres vértices. Es lo que hace ' +
    'un videojuego. Aquí vamos a dibujar en tres dimensiones <strong>sin un solo triángulo y sin ' +
    'guardar nada</strong>, con la misma idea de siempre: una función que contesta preguntas.');

  p.section('La misma distancia, con una coordenada más');

  p.text('En el tema de [[gfx-distancia|distancia]] definiste un círculo así: dado un punto del ' +
    'plano, <code>length(p) - r</code> te dice a qué distancia está del borde, negativa por dentro ' +
    'y positiva por fuera. La misma línea, con <code>p</code> de tres componentes en vez de dos, ' +
    'define una <strong>esfera</strong>. Sin cambiar nada.');

  p.formulas([
    'd_{\\text{esfera}}(\\vec{p}) = \\left| \\vec{p} - \\vec{c} \\right| - r',
    'd_{\\text{plano}}(\\vec{p}) = \\vec{p}\\cdot\\vec{n} - h'
  ], 'dos cuerpos en tres líneas');

  p.text('Y las operaciones también se traducen tal cual: <code>min</code> sigue siendo la unión de ' +
    'dos cuerpos, <code>max</code> la intersección, y <code>max(a, -b)</code> el agujero de $b$ en ' +
    '$a$. Todo lo que aprendiste en el plano vale aquí, palabra por palabra.');

  p.note('A una función así se le llama <strong>SDF</strong>, de <em>signed distance function</em>: ' +
    'función de distancia con signo. Es la definición completa del objeto. No hay una lista de ' +
    'vértices en ninguna parte: una esfera pesa exactamente una línea de código, y una esfera de un ' +
    'kilómetro de radio pesa lo mismo que una de un milímetro.', null, 'Qué es una SDF');

  p.section('El problema: ver');

  p.text('Sabemos describir un cuerpo. Falta lo difícil: cada píxel de la pantalla tiene que ' +
    'averiguar <em>qué se ve a través de él</em>. La idea es física y no puede ser más intuitiva: ' +
    'por cada píxel se lanza un <strong>rayo</strong> desde el ojo hacia dentro de la escena, y se ' +
    'mira dónde choca.');

  p.text('El rayo es una [[ge-rectas|recta en forma paramétrica]], la de la geometría del plano y del espacio:');

  p.formula('\\vec{P}(t) = \\vec{o} + t\\,\\vec{d}, \\qquad t \\ge 0',
    'el rayo', 'Donde $\\vec{o}$ es el ojo, $\\vec{d}$ la dirección hacia el píxel (unitaria) y $t$ ' +
      'la distancia recorrida. Encontrar el choque es encontrar el menor $t$ tal que el punto esté ' +
      'sobre la superficie.');

  p.text('Con una esfera se podría resolver esa ecuación a mano —sale una de segundo grado— pero con ' +
    'una escena cualquiera, no. Aquí entra la idea que hace todo esto posible, y es una preciosidad.');

  p.section('Avanzar a ciegas, pero sin miedo');

  p.text('Estás en un punto del espacio y la función te dice: <em>«el objeto más cercano está a ' +
    '0,8»</em>. Entonces puedes avanzar 0,8 <strong>en cualquier dirección</strong> con la absoluta ' +
    'garantía de no atravesar nada, porque no hay nada más cerca que eso. Avanzas, vuelves a ' +
    'preguntar, te contestan menos, avanzas menos. Y así hasta que la respuesta sea casi cero: has ' +
    'llegado a la superficie.');

  p.list([
    'Empiezas en el ojo con $t = 0$.',
    'Preguntas la distancia $d$ en el punto $\\vec{o} + t\\vec{d}$.',
    'Si $d$ es diminuta, has chocado: paras.',
    'Si $t$ se ha hecho enorme, no hay nada ahí: es el fondo.',
    'Si no, haces $t = t + d$ y vuelves a preguntar.'
  ], true);

  p.comprueba('En el punto actual, la escena dice $d = 0{,}8$. ¿Cuánto puede avanzar el rayo sin riesgo de atravesar nada?', [
    { t: 'Exactamente $0{,}8$, vaya en la dirección que vaya', ok: true, por: 'La distancia es al objeto más cercano en <em>cualquier</em> dirección. Dentro de esa esfera de radio 0,8 no hay nada: el rayo puede recorrerla entera. Por eso se llama esfera trazada.' },
    { t: 'Solo un poco, porque no se sabe hacia dónde está el objeto', ok: false, por: 'No hace falta saberlo. La garantía es «no hay nada a menos de 0,8», y eso vale para todas las direcciones a la vez.' },
    { t: 'Hasta que $d$ llegue a cero, sin límite', ok: false, por: 'Más allá de 0,8 podría haber algo: la escena no ha prometido nada sobre lo que hay más lejos. Se avanza 0,8 y se vuelve a preguntar.' }
  ]);

  p.text('Se llama <strong>esfera trazada</strong> (<em>sphere tracing</em>) porque en cada paso ' +
    'estás usando la mayor esfera vacía que cabe alrededor de ti. Y converge rápido: normalmente ' +
    'bastan veinte o treinta preguntas por píxel. Es, en el fondo, un método iterativo de los del ' +
    '[[av-numerico|cálculo numérico]]: te acercas a la solución sin resolver nunca la ecuación.');

  p.ejemplo({
    title: 'Un rayo que avanza a ciegas',
    enunciado: 'Escena $\\min(|\\vec p - (0, 0, 5)| - 1,\\ p_y + 1)$: una esfera de radio 1 en $z = 5$ y un suelo en $y = -1$. Rayo desde el origen en la dirección $(0, 0, 1)$. Seguir el avance hasta chocar y calcular la normal en el choque.',
    pasos: [
      { t: '<strong>$t = 0$.</strong> Esfera: $5 - 1 = 4$. Suelo: $0 + 1 = 1$. La escena devuelve el menor, 1. Se avanza 1.', antes: 'Evalúa las dos distancias en el origen. ¿Cuál manda?' },
      { t: '<strong>$t = 1, 2, 3$.</strong> El suelo sigue a 1 (el rayo va a altura 0) y la esfera a $3, 2, 1$. En cada paso la escena devuelve 1: el suelo limita el avance aunque el rayo nunca vaya a tocarlo.', antes: '¿Qué devuelve la escena en $t = 3$? ¿Quién está limitando?' },
      { t: '<strong>$t = 4$.</strong> Esfera: $|(0, 0, 4) - (0, 0, 5)| - 1 = 0$. Choque en $\\vec P = (0, 0, 4)$, tras cuatro pasos. Sin el suelo habría llegado en un solo paso de 4.' },
      { t: '<strong>La normal.</strong> Gradiente de $|\\vec p - \\vec c| - 1$ en $\\vec P$: $(\\vec P - \\vec c)/|\\vec P - \\vec c| = (0, 0, -1)$. Apunta hacia el ojo, como corresponde a la cara frontal de la esfera.', antes: 'La normal de una esfera es el vector del centro al punto, normalizado.' },
      { t: '<strong>Lo que enseña.</strong> Cada paso es seguro, pero el paso lo fija el objeto más cercano, sea o no el que se va a tocar. Y el método nunca se pasa: llega a $\\vec P$ exactamente, sin cruzar la superficie.' }
    ],
    cierre: 'Cuatro preguntas a la escena, ninguna ecuación resuelta. Con una escena de cien objetos la cuenta sería la misma: preguntar, avanzar, preguntar.'
  });

  p.demo({
    title: 'Los pasos, uno a uno',
    intro: 'Una esfera y un suelo. El mando de pasos limita cuántas preguntas puede hacer cada rayo: con pocos, los rayos que pasan rozando la esfera se quedan a medio camino y aparece una sombra fantasma. Los colores muestran cuántos pasos ha necesitado cada píxel.',
    predice: 'Con pasos máximos 8, ¿qué zona quedará sin dibujar: el centro de la esfera, su contorno o el suelo lejano? Piensa en dónde los pasos son diminutos.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-ray-1', alto: 330,
        aria: 'Una esfera sobre un suelo, coloreada según cuántos pasos de avance ha necesitado cada rayo.',
        mandos: [
          { n: 'pasos', label: 'pasos máximos', min: 2, max: 80, step: 1, value: 60, dec: 0 },
          { n: 'verMapa', label: 'ver el coste', min: 0, max: 1, step: 1, value: 1, dec: 0 }
        ],
        codigo:
          '// la escena entera: una esfera y un suelo\n' +
          'float mapa(vec3 p)\n' +
          '{\n' +
          '    float esfera = length(p) - 1.0;\n' +
          '    float suelo  = p.y + 1.0;\n' +
          '    return min(esfera, suelo);      // union\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    vec3 ojo = vec3(0.0, 0.6, -3.5);         // de donde sale el rayo\n' +
          '    vec3 dir = normalize(vec3(uv, 1.0));     // hacia donde va\n' +
          '\n' +
          '    float t = 0.0;\n' +
          '    float n = 0.0;      // cuantos pasos ha dado\n' +
          '    bool choca = false;\n' +
          '\n' +
          '    for (int i = 0; i < 80; i++) {\n' +
          '        if (float(i) >= pasos) break;\n' +
          '        float d = mapa(ojo + t * dir);\n' +
          '        n += 1.0;\n' +
          '        if (d < 0.001) { choca = true; break; }   // llegado\n' +
          '        if (t > 20.0) break;                       // al infinito\n' +
          '        t += d;                                    // avanzar SIN MIEDO\n' +
          '    }\n' +
          '\n' +
          '    vec3 c = vec3(0.05, 0.06, 0.12);\n' +
          '    if (choca) c = vec3(0.9, 0.75, 0.5) * (1.0 - t * 0.06);\n' +
          '\n' +
          '    // el mapa de coste: azul barato, rojo caro\n' +
          '    vec3 coste = mix(vec3(0.1, 0.3, 0.9), vec3(1.0, 0.3, 0.1), n / pasos);\n' +
          '    color = vec4(mix(c, coste, verMapa), 1.0);\n' +
          '}\n',
        nota: 'Mira el mapa de coste: el interior de la esfera es barato (el rayo llega de dos ' +
          'zancadas) y el <strong>contorno</strong> es carísimo, porque ahí el rayo pasa rozando y ' +
          'avanza a pasitos minúsculos sin llegar a chocar. Ese halo rojo es la debilidad del método.'
      });
    }
  });

  p.section('La normal es el gradiente');

  p.text('Ya sabes dónde chocó el rayo. Para pintarlo hace falta saber <strong>hacia dónde mira la ' +
    'superficie</strong> en ese punto, y aquí ocurre algo elegante: la dirección en la que la ' +
    'distancia crece más deprisa es, exactamente, la dirección perpendicular a la superficie. Es ' +
    'decir: <strong>la normal es el gradiente del campo de distancias</strong>.');

  p.formula('\\vec{n} = \\frac{\\nabla d}{\\left| \\nabla d \\right|}, \\qquad ' +
    '\\frac{\\partial d}{\\partial x} \\approx \\frac{d(x+\\varepsilon) - d(x-\\varepsilon)}{2\\varepsilon}',
    'la normal por diferencias centradas');

  p.text('Y el [[av-vectorial|gradiente]] se calcula preguntando seis veces: un pelín a cada lado en ' +
    'cada eje. No hay que derivar nada a mano, funcione la escena que funcione. Con la normal ya se ' +
    'ilumina con el mismo producto escalar del tema anterior.');

  p.demo({
    title: 'Una escena iluminada',
    intro: 'La misma esfera, ahora con luz, sombra proyectada y suelo de baldosas. Es lo mismo de antes más treinta líneas: todo lo que ves sale de la función mapa, que ocupa cinco renglones.',
    predice: 'Sube la altura de la luz al máximo: ¿la sombra de la esfera se hará más corta o más larga? ¿Y si la bajas a 0,5?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-ray-2', alto: 360,
        aria: 'Una esfera iluminada sobre un suelo de baldosas, girando lentamente, con su sombra proyectada.',
        mandos: [
          { n: 'radio', label: 'radio', min: 0.3, max: 1.4, step: 0.05, value: 1, dec: 2 },
          { n: 'altura', label: 'altura de la luz', min: 0.5, max: 5, step: 0.1, value: 3, dec: 1 },
          { n: 'orbita', label: 'órbita', min: 0, max: 1, step: 0.01, value: 1, dec: 2 }
        ],
        codigo:
          'float mapa(vec3 p)\n' +
          '{\n' +
          '    float esfera = length(p - vec3(0.0, 0.0, 0.0)) - radio;\n' +
          '    float suelo  = p.y + 1.0;\n' +
          '    return min(esfera, suelo);\n' +
          '}\n' +
          '\n' +
          '// el gradiente, preguntando un poquito a cada lado\n' +
          'vec3 normal(vec3 p)\n' +
          '{\n' +
          '    vec2 e = vec2(0.002, 0.0);\n' +
          '    return normalize(vec3(mapa(p + e.xyy) - mapa(p - e.xyy),\n' +
          '                          mapa(p + e.yxy) - mapa(p - e.yxy),\n' +
          '                          mapa(p + e.yyx) - mapa(p - e.yyx)));\n' +
          '}\n' +
          '\n' +
          'float avanza(vec3 o, vec3 d)\n' +
          '{\n' +
          '    float t = 0.0;\n' +
          '    for (int i = 0; i < 70; i++) {\n' +
          '        float h = mapa(o + t * d);\n' +
          '        if (h < 0.001 || t > 25.0) break;\n' +
          '        t += h;\n' +
          '    }\n' +
          '    return t;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    float a = iTime * 0.4 * orbita;\n' +
          '    vec3 ojo = vec3(3.6 * sin(a), 1.1, -3.6 * cos(a));\n' +
          '\n' +
          '    // mirar siempre al centro: tres vectores perpendiculares\n' +
          '    vec3 f = normalize(-ojo);\n' +
          '    vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));\n' +
          '    vec3 u = cross(f, r);\n' +
          '    vec3 dir = normalize(uv.x * r + uv.y * u + 1.4 * f);\n' +
          '\n' +
          '    float t = avanza(ojo, dir);\n' +
          '    vec3 c = vec3(0.05, 0.06, 0.12);      // el fondo\n' +
          '\n' +
          '    if (t < 25.0) {\n' +
          '        vec3 pos = ojo + t * dir;\n' +
          '        vec3 n   = normal(pos);\n' +
          '        vec3 luz = normalize(vec3(1.2, altura, -0.8) - pos);\n' +
          '\n' +
          '        float dif = max(dot(n, luz), 0.0);\n' +
          '\n' +
          '        // sombra: lanzar OTRO rayo desde el punto hacia la luz\n' +
          '        float ts = avanza(pos + n * 0.01, luz);\n' +
          '        if (ts < length(vec3(1.2, altura, -0.8) - pos)) dif *= 0.25;\n' +
          '\n' +
          '        // baldosas si es el suelo, liso si es la esfera\n' +
          '        vec3 base = vec3(0.85, 0.55, 0.75);\n' +
          '        if (pos.y < -0.99) {\n' +
          '            float b = mod(floor(pos.x) + floor(pos.z), 2.0);\n' +
          '            base = mix(vec3(0.25), vec3(0.6), b);\n' +
          '        }\n' +
          '        c = base * (0.15 + dif);\n' +
          '        c = mix(c, vec3(0.05, 0.06, 0.12), 1.0 - exp(-0.02 * t * t));  // niebla\n' +
          '    }\n' +
          '\n' +
          '    color = vec4(sqrt(c), 1.0);      // correccion de gamma\n' +
          '}\n',
        nota: 'La sombra son <strong>tres líneas</strong>: desde el punto donde chocaste, lanzas ' +
          'otro rayo hacia la luz; si choca con algo antes de llegar, es que hay algo en medio y ' +
          'estás en sombra. Ese <code>+ n * 0.01</code> despega el rayo de la superficie para que no ' +
          'se choque consigo mismo nada más salir.'
      });
    }
  });

  p.note('El <code>sqrt</code> del final es la <strong>corrección de gamma</strong>: las pantallas ' +
    'no responden linealmente al valor que les mandas, así que una imagen calculada con física ' +
    'correcta se ve más oscura de lo debido. Elevar a $1/2$ (o mejor, a $1/2{,}2$) lo compensa. Es ' +
    'un detalle de dos caracteres que separa una imagen sucia de una limpia.', null, 'Por qué esa raíz');

  p.note('Dos cosas rompen el raymarching, y conviene reconocerlas. La primera: si tu función ' +
    'devuelve una distancia <strong>mayor</strong> que la real, los rayos se saltan la superficie y ' +
    'aparecen agujeros. Por eso al multiplicar el espacio hay que dividir la distancia, y por eso ' +
    'muchas escenas avanzan <code>t += h * 0.7</code>, para ir con cuidado. La segunda: los rayos ' +
    'rasantes cuestan carísimo, como viste en el mapa de coste.', 'warn', 'Cuándo se rompe');

  p.util('Esta técnica no es la que mueve los videojuegos —para eso siguen ganando los triángulos, ' +
    'que las tarjetas dibujan por millones— pero sí es la que domina en la demoscene, en Shadertoy y ' +
    'en el arte generativo, y ha entrado en el cine para volúmenes: nubes, humo y niebla se trazan ' +
    'así. También se usa en impresión 3D y en diseño industrial, donde describir una pieza con una ' +
    'fórmula permite cambiarle un parámetro sin rehacer la malla, y en las fuentes de letra de tu ' +
    'móvil, que se dibujan con campos de distancia para verse nítidas a cualquier tamaño.');

  p.hist('El <em>sphere tracing</em> lo formuló John Hart en 1996 para dibujar fractales, y durmió ' +
    'una década hasta que las tarjetas programables lo hicieron viable en tiempo real. Quien lo ' +
    'convirtió en un lenguaje fue Íñigo Quílez, que publicó un catálogo abierto de funciones de ' +
    'distancia —esfera, caja, toro, cápsula, y las operaciones para combinarlas— que hoy usa todo el ' +
    'mundo. Buena parte de lo que se ve en Shadertoy es ese catálogo, recombinado.');

  p.trampas([
    { e: 'Devolver una distancia mayor que la real', por: 'El rayo avanza más de lo seguro y atraviesa la superficie: agujeros. Pasa al escalar el espacio sin dividir la distancia, o al deformar. Remedio: avanzar <code>t += 0.7 * h</code>.' },
    { e: 'Lanzar la sombra desde el punto exacto', por: 'Ahí $h \\approx 0$ y el bucle cree que ha chocado nada más salir: sombra moteada por toda la superficie. Se despega el origen por la normal, $\\vec P + 0{,}01\\,\\vec n$.' },
    { e: 'Poner pocos pasos para ir más deprisa', por: 'Los rayos rasantes avanzan a pasitos y se agotan sin chocar: aparece un halo fantasma alrededor de las siluetas. El mapa de coste lo enseña en rojo.' },
    { e: 'Usar el gradiente sin normalizar', por: 'Las diferencias finitas dan un vector proporcional a $2\\varepsilon$, minúsculo. El producto escalar con la luz saldría casi cero y todo se vería negro.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Preguntarle a la escena',
    level: 'basico',
    gen: function (r) {
      var cx = r.int(-2, 2), cy = r.int(-1, 2), cz = r.int(1, 5);
      var rad = r.pick([0.5, 1, 1.5, 2]);
      var px = r.int(-3, 3), py = r.int(-2, 3), pz = r.int(-2, 6);
      var dist = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy) + (pz - cz) * (pz - cz));
      var esf = dist - rad, sue = py + 1;
      return { cx: cx, cy: cy, cz: cz, r: rad, px: px, py: py, pz: pz,
        dist: dist, esf: esf, sue: sue, m: Math.min(esf, sue) };
    },
    ask: function (d) {
      return 'La escena es <code>min(length(p - vec3(' + d.cx + '.0, ' + d.cy + '.0, ' + d.cz +
        '.0)) - ' + U.fmt(d.r, 1) + ', p.y + 1.0)</code>.<br><br>¿Cuánto devuelve en el punto ' +
        '<code>p = (' + d.px + ', ' + d.py + ', ' + d.pz + ')</code>? Da también la distancia a la ' +
        'esfera por separado. (cuatro decimales)';
    },
    fields: [
      { name: 'e', label: 'a la esfera', w: 'tiny' },
      { name: 'm', label: 'la escena', w: 'tiny' }
    ],
    sol: function (d) { return { e: U.round(d.esf, 8), m: U.round(d.m, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'La distancia al centro es la raíz de la suma de los tres cuadrados. Réstale el radio, ' +
        'y compárala con la del suelo, que es simplemente <code>p.y + 1</code>. El <code>min</code> ' +
        'se queda con lo más cercano.';
    },
    steps: function (d) {
      return ['Al centro: $\\sqrt{' + Math.pow(d.px - d.cx, 2) + ' + ' + Math.pow(d.py - d.cy, 2) +
        ' + ' + Math.pow(d.pz - d.cz, 2) + '} = ' + U.fmt(d.dist, 4) + '$',
        'A la esfera: $' + U.fmt(d.dist, 4) + ' - ' + U.fmt(d.r, 1) + ' = ' + U.fmt(d.esf, 4) + '$' +
          (d.esf < 0 ? ' (negativa: el punto está <em>dentro</em>)' : ''),
        'Al suelo: $' + d.py + ' + 1 = ' + U.fmt(d.sue, 4) + '$',
        'La escena devuelve el menor: $' + U.fmt(d.m, 4) + '$, que es ' +
          (d.esf <= d.sue ? 'la esfera' : 'el suelo') + '.'];
    },
    answer: function (d) { return 'esfera ' + U.fmt(d.esf, 4) + ' · escena ' + U.fmt(d.m, 4); }
  });

  p.exercise({
    title: 'Tres pasos del rayo',
    level: 'medio',
    gen: function (r) {
      var cz = r.int(4, 8);
      var rad = r.pick([1, 1.5, 2]);
      var bx = r.pick([0.5, 1, 1.5, 2, 2.5]);
      var t = 0, pasos = [];
      for (var i = 0; i < 3; i++) {
        var dd = Math.sqrt(bx * bx + (cz - t) * (cz - t)) - rad;
        pasos.push({ t: t, d: dd });
        t += dd;
      }
      return { cz: cz, r: rad, bx: bx, pasos: pasos, tf: t, roza: bx >= rad,
        real: bx < rad ? cz - Math.sqrt(rad * rad - bx * bx) : null };
    },
    ask: function (d) {
      return 'Un rayo sale del origen en la dirección <code>(0, 0, 1)</code>. La escena es una sola ' +
        'esfera de radio <strong>' + U.fmt(d.r, 1) + '</strong> centrada en <code>(' + U.fmt(d.bx, 1) +
        ', 0, ' + d.cz + ')</code>, o sea, un poco apartada del eje.<br><br>Aplica el avance ' +
        '<code>t += mapa(o + t·d)</code> <strong>tres veces</strong> empezando en $t = 0$. ¿Qué ' +
        'distancia devuelve la escena en cada paso, y en qué $t$ acabas? (cuatro decimales)';
    },
    fields: [
      { name: 'd1', label: 'd en el paso 1', w: 'tiny' },
      { name: 'd2', label: 'd en el paso 2', w: 'tiny' },
      { name: 'd3', label: 'd en el paso 3', w: 'tiny' },
      { name: 't', label: 't final', w: 'tiny' }
    ],
    sol: function (d) {
      return { d1: U.round(d.pasos[0].d, 8), d2: U.round(d.pasos[1].d, 8),
        d3: U.round(d.pasos[2].d, 8), t: U.round(d.tf, 8) };
    },
    tol: 3e-4,
    hint: function (d) {
      return 'Desde el punto $(0, 0, t)$ hasta el centro hay $\sqrt{' + U.fmt(d.bx, 1) + '^2 + (' +
        d.cz + ' - t)^2}$. Réstale el radio, avanza esa cantidad, y vuelve a preguntar con el nuevo $t$.';
    },
    steps: function (d) {
      var s = [];
      d.pasos.forEach(function (x, i) {
        s.push('Paso ' + (i + 1) + ': en $t = ' + U.fmt(x.t, 4) + '$ la distancia al centro es ' +
          '$\sqrt{' + U.fmt(d.bx * d.bx, 2) + ' + ' + U.fmt((d.cz - x.t) * (d.cz - x.t), 4) + '} = ' +
          U.fmt(Math.sqrt(d.bx * d.bx + (d.cz - x.t) * (d.cz - x.t)), 4) + '$, así que devuelve $' +
          U.fmt(x.d, 4) + '$ y $t$ pasa a $' + U.fmt(x.t + x.d, 4) + '$');
      });
      if (d.roza) {
        s.push('Como el desplazamiento lateral ($' + U.fmt(d.bx, 1) + '$) es mayor que el radio ($' +
          U.fmt(d.r, 1) + '$), este rayo <strong>no llega a chocar</strong>: pasa rozando. Los pasos ' +
          'se van haciendo pequeños y el bucle se agota sin tocar nada. Ese es el halo caro del mapa ' +
          'de coste.');
      } else {
        s.push('El choque real está en $t = ' + d.cz + ' - \sqrt{' + U.fmt(d.r * d.r, 2) + ' - ' +
          U.fmt(d.bx * d.bx, 2) + '} = ' + U.fmt(d.real, 4) + '$. En tres pasos ya andas por $' +
          U.fmt(d.tf, 4) + '$: te acercas deprisa, pero por debajo, sin pasarte nunca.');
      }
      s.push('Y esa es la garantía del método: cada paso es seguro, así que la superficie no se ' +
        'salta jamás.');
      return s;
    },
    answer: function (d) {
      return d.pasos.map(function (x) { return U.fmt(x.d, 4); }).join(' · ') + ' → t = ' + U.fmt(d.tf, 4);
    }
  });

  p.exercise({
    title: 'Modela la escena',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'una <strong>esfera de radio 1</strong> centrada en el origen <strong>unida</strong> a un suelo en <code>y = -1</code>',
          ref: 'min(length(p) - 1.0, p.y + 1.0)' },
        { pide: 'una <strong>esfera de radio 1,3</strong> centrada en el origen <strong>unida</strong> a un suelo en <code>y = -1</code>',
          ref: 'min(length(p) - 1.3, p.y + 1.0)' },
        { pide: 'la <strong>intersección</strong> de una esfera de radio 1,3 con el semiespacio de arriba del plano <code>y = 0</code>',
          ref: 'max(length(p) - 1.3, -p.y)' },
        { pide: 'una <strong>esfera de radio 1,3 con un agujero esférico</strong> de radio 1 en el mismo centro (una cáscara)',
          ref: 'max(length(p) - 1.3, -(length(p) - 1.0))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe la función de distancia para ' + d.pide + ':<br>' +
        '<pre class="shd__mini">float mapa(vec3 p)\n{\n    return <strong>???</strong> ;\n}</pre>' +
        'Recuerda: <code>min</code> une, <code>max</code> corta, y un menos delante invierte dentro y fuera.';
    },
    fields: [{ name: 'm', label: 'la distancia', w: 'wide' }],
    sol: function (d) { return { m: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.m || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'float mapa(vec3 p){ return ' + x + '; }\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  vec3 o = vec3(0.9, 1.2, -3.0), f = normalize(-o);\n' +
          '  vec3 r = normalize(cross(vec3(0.0,1.0,0.0), f)), u = cross(f, r);\n' +
          '  vec3 dir = normalize(uv.x*r + uv.y*u + 1.5*f);\n' +
          '  float t = 0.0;\n' +
          '  for (int i = 0; i < 60; i++) {\n' +
          '    float h = mapa(o + t*dir);\n' +
          '    if (h < 0.002 || t > 20.0) break;\n' +
          '    t += h;\n  }\n' +
          '  vec3 c = vec3(0.0);\n' +
          '  if (t < 20.0) {\n' +
          '    vec3 q = o + t*dir; vec2 e = vec2(0.003, 0.0);\n' +
          '    vec3 n = normalize(vec3(mapa(q+e.xyy)-mapa(q-e.xyy),\n' +
          '                            mapa(q+e.yxy)-mapa(q-e.yxy),\n' +
          '                            mapa(q+e.yyx)-mapa(q-e.yyx)));\n' +
          '    c = vec3(0.5) + 0.5*n;\n  }\n' +
          '  color = vec4(c, 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 12 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Comprueba que todos los números llevan punto decimal ' +
          'y que <code>length</code> recibe un <code>vec3</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la escena no coincide. Repasa qué operación toca: ' +
          '<code>min</code> para unir, <code>max</code> para quedarse con lo común, y un signo menos ' +
          'para vaciar.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Es lo mismo que hiciste en dos dimensiones. Una esfera es <code>length(p) - radio</code>, ' +
        'un plano horizontal es <code>p.y - altura</code>, y para vaciar $b$ de $a$ se escribe ' +
        '<code>max(a, -b)</code>.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Toda la geometría de la imagen cabe en ese renglón: no hay vértices, ni caras, ni malla.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { c: 'float t = 0.0;\nfor (int i = 0; i &lt; 64; i++) {\n    float d = length(ro + t * rd) - 1.0;\n    if (d &lt; 0.001) break;\n    t += d;\n}\nfloat v = step(t, 20.0);',
          o: ['La silueta blanca de una esfera sobre fondo negro', 'Una esfera iluminada con luces y sombras', 'Un cubo', 'Toda la pantalla blanca'],
          por: 'Los rayos que chocan con la esfera se paran con un $t$ pequeño; los que no chocan siguen avanzando hasta pasar de 20. Sin iluminación, solo queda la silueta.' },
        { c: 'float sdf(vec3 q) { return max(length(q) - 1.0, abs(q.y) - 0.3); }',
          o: ['Una esfera cortada por arriba y por abajo: un disco grueso de canto redondeado', 'Una esfera completa', 'Un cilindro de bases planas y canto recto', 'Dos esferas'],
          por: 'El máximo de dos distancias es su intersección: los puntos dentro de la esfera y dentro de la franja $|y| < 0{,}3$.' },
        { c: 'vec3 n = normalize(vec3(sdf(P + e.xyy) - sdf(P - e.xyy),\n                      sdf(P + e.yxy) - sdf(P - e.yxy),\n                      sdf(P + e.yyx) - sdf(P - e.yyx)));\nvec3 col = 0.5 + 0.5 * n;',
          o: ['La superficie coloreada según la dirección hacia la que mira, calculada como el gradiente de la distancia', 'La superficie de un solo color', 'Solo la silueta', 'El fondo coloreado y la figura negra'],
          por: 'Las diferencias de la distancia en las tres direcciones forman su gradiente, que es perpendicular a la superficie: la normal, pintada como color.' },
        { c: 't += 0.5 * d;   // antes: t += d;',
          o: ['La misma imagen, pero el algoritmo necesita más pasos para llegar a la superficie', 'La esfera se ve la mitad de grande', 'La esfera desaparece', 'La esfera se ve el doble de lejos'],
          por: 'Avanzar solo la mitad de la distancia segura sigue sin atravesar nada, pero se llega más despacio: con pasos suficientes, la imagen es la misma.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'En el raymarcher del tema, con <code>ro</code> el ojo, <code>rd</code> el rayo del píxel y <code>P</code> el punto alcanzado, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Se usa solo si hay choque, la forma de la distancia o la dirección de la superficie?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'Una <strong>SDF</strong> describe un cuerpo entero con una fórmula: la distancia con signo a su superficie. Lo que valía en el plano vale igual en el espacio.',
    'Se dibuja lanzando un rayo por píxel y <strong>avanzando la distancia que la escena declara</strong>: es seguro porque no hay nada más cerca.',
    'Es un método iterativo, no una ecuación resuelta: se llega a la superficie por aproximación, como en el [[av-numerico|cálculo numérico]].',
    'La <strong>normal es el gradiente</strong> del campo de distancias, y se obtiene preguntando seis veces alrededor del punto.',
    'Una sombra es otro rayo, lanzado desde el punto hacia la luz. Tres líneas.',
    'Los rayos rasantes son caros y las distancias exageradas abren agujeros: son los dos fallos clásicos.'
  ]);
});
