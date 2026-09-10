/* Tema: El túnel */
Course.topic('gfx-tunel', function (p) {

  p.text('Si has visto una <em>demo</em> de los años noventa, has visto un túnel. Era el efecto ' +
    'obligatorio, el que todo el mundo programaba para demostrar que sabía, y sigue apareciendo en ' +
    'pantallas de conciertos treinta años después. Da la impresión de que hay una geometría ' +
    'tridimensional detrás. No hay ninguna: hay una división.');

  p.section('Por qué una división es profundidad');

  p.text('Imagina un cilindro infinito de radio $R$, con el ojo en el eje mirando hacia dentro. Un ' +
    'punto de la pared que esté a profundidad $z$ se proyecta en la pantalla a una distancia del ' +
    'centro que sale de la [[ge-semejanza|semejanza de triángulos]] de toda la vida:');

  p.formula('r = \\frac{f\\,R}{z} \\qquad\\Longleftrightarrow\\qquad z = \\frac{f\\,R}{r}',
    'la perspectiva, despejada',
    'Donde $f$ es la distancia del ojo al plano de la pantalla. Lo que importa es la forma: la ' +
      'profundidad es <strong>inversamente proporcional</strong> al radio en pantalla.');

  p.text('Y esa es toda la técnica. En vez de calcular dónde cae cada punto de la pared, se hace al ' +
    'revés: para cada píxel, se mira a qué distancia del centro está y se deduce a qué profundidad ' +
    'de la pared le corresponde. Un píxel pegado al centro mira infinitamente lejos; uno del borde, ' +
    'mira la pared que tiene al lado.');

  p.text('Con eso, las dos coordenadas de la pared del túnel salen así:');

  p.formulas([
    'u = \\frac{a}{2\\pi} \\quad \\text{(la vuelta alrededor del tubo)}',
    'v = \\frac{k}{r} + t \\quad \\text{(el avance a lo largo del tubo)}'
  ], 'desenrollar el cilindro');

  p.text('El $+t$ es el movimiento: sumarle tiempo a la profundidad hace que la pared se deslice ' +
    'hacia ti, que es exactamente lo mismo que avanzar. Y es el mismo truco del tema del ' +
    '[[gfx-tiempo|tiempo]]: no se mueve nada, se desplaza el sitio desde el que se pregunta.');

  p.demo({
    title: 'El túnel mínimo',
    intro: 'Doce líneas. Una división, un ajedrez y un oscurecimiento hacia el centro. Prueba a poner la velocidad en negativo para retroceder, y mira qué pasa con el ajedrez cuando los anillos no son un número entero.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-tun-1', alto: 340,
        aria: 'Un túnel de ajedrez en perspectiva por el que se avanza continuamente.',
        mandos: [
          { n: 'velocidad', label: 'velocidad', min: -2, max: 2, step: 0.05, value: 0.6, dec: 2 },
          { n: 'gajos', label: 'gajos alrededor', min: 2, max: 24, step: 1, value: 10, dec: 0 },
          { n: 'anillos', label: 'anillos a lo largo', min: 1, max: 20, step: 0.5, value: 8, dec: 1 },
          { n: 'k', label: 'radio del tubo (k)', min: 0.05, max: 0.6, step: 0.01, value: 0.25, dec: 2 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    float r = length(p);\n' +
          '    float a = atan(p.y, p.x);\n' +
          '\n' +
          '    // LA linea: uno partido por erre es profundidad\n' +
          '    vec2 uv = vec2(a / TAU,\n' +
          '                   k / r + iTime * velocidad);\n' +
          '\n' +
          '    // un ajedrez sobre la pared desenrollada\n' +
          '    vec2 celda = floor(vec2(uv.x * gajos, uv.y * anillos));\n' +
          '    float tablero = mod(celda.x + celda.y, 2.0);\n' +
          '\n' +
          '    vec3 c = mix(vec3(0.10, 0.05, 0.20), vec3(0.95, 0.85, 0.55), tablero);\n' +
          '\n' +
          '    // lo lejano se apaga: cerca del centro, r es pequeno y z enorme\n' +
          '    c *= smoothstep(0.0, 0.35, r);\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Si los gajos no son un número entero, aparece una <strong>costura</strong> vertical: ' +
          'es el sitio donde el ángulo salta de $+\\pi$ a $-\\pi$ y el dibujo no cierra. Es la misma ' +
          'costura de las celdas del tema de repetición, ahora dando la vuelta al tubo.'
      });
    }
  });

  p.section('Vestir la pared');

  p.text('Ese ajedrez está ahí para que se vea la geometría, pero una vez tienes las coordenadas ' +
    '$(u, v)$ de la pared puedes dibujar en ellas <strong>cualquier cosa de las que ya sabes ' +
    'hacer</strong>: ruido, celdas de Voronoi, una paleta de cosenos, un patrón torcido. Es una ' +
    'textura procedural sobre una superficie que no existe.');

  p.text('Merece la pena señalar por qué esto era tan importante en su momento. Un túnel con textura ' +
    'de verdad exigía guardar una imagen en memoria, y en una demo de 64 kilobytes eso era ' +
    'impensable. Generar la textura con una fórmula costaba unas pocas líneas y ninguna memoria: ' +
    '<strong>la restricción produjo la estética</strong>.');

  p.demo({
    title: 'El túnel vestido',
    intro: 'La misma división, con humo procedural en la pared, niebla en la distancia y una curva. El mando de curvatura es el que convierte un tubo recto en algo por lo que apetece viajar.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-tun-2', alto: 380,
        aria: 'Un túnel curvo con textura de humo procedural y niebla en la distancia.',
        mandos: [
          { n: 'velocidad', label: 'velocidad', min: 0, max: 2, step: 0.05, value: 0.7, dec: 2 },
          { n: 'curva', label: 'curvatura', min: 0, max: 0.5, step: 0.01, value: 0.22, dec: 2 },
          { n: 'giro', label: 'giro del tubo', min: -1, max: 1, step: 0.05, value: 0.25, dec: 2 },
          { n: 'detalle', label: 'detalle de la pared', min: 1, max: 8, step: 0.5, value: 4, dec: 1 }
        ],
        codigo:
          'float hash(vec2 p)\n' +
          '{\n' +
          '    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          'float ruido(vec2 p)\n' +
          '{\n' +
          '    vec2 i = floor(p), f = fract(p);\n' +
          '    vec2 u = f * f * (3.0 - 2.0 * f);\n' +
          '    return mix(mix(hash(i),                 hash(i + vec2(1.0, 0.0)), u.x),\n' +
          '               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);\n' +
          '}\n' +
          '\n' +
          'float fbm(vec2 p)\n' +
          '{\n' +
          '    float s = 0.0, a = 0.5;\n' +
          '    for (int k = 0; k < 5; k++) { s += a * ruido(p); p *= 2.0; a *= 0.5; }\n' +
          '    return s;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float t = iTime * velocidad;\n' +
          '\n' +
          '    // el centro del tubo se desplaza: el tunel se curva\n' +
          '    p -= curva * vec2(sin(t * 0.7), cos(t * 0.5));\n' +
          '\n' +
          '    float r = length(p);\n' +
          '    float a = atan(p.y, p.x) + t * giro;\n' +
          '\n' +
          '    vec2 uv = vec2(a / TAU, 0.25 / r + t);\n' +
          '\n' +
          '    // la pared: humo, no ajedrez\n' +
          '    float n = fbm(vec2(uv.x * 6.0, uv.y * 2.0) * detalle);\n' +
          '    n = 0.35 + 0.9 * n;\n' +
          '\n' +
          '    // color de paleta, con el tono cambiando a lo largo del tubo\n' +
          '    vec3 c = 0.5 + 0.5 * cos(TAU * (uv.y * 0.35 + n * 0.3 + vec3(0.0, 0.28, 0.55)) + 2.5);\n' +
          '    c *= n;\n' +
          '\n' +
          '    // niebla: cuanto mas lejos (r pequeno), mas se apaga\n' +
          '    c *= smoothstep(0.0, 0.42, r);\n' +
          '\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'La curvatura es una trampa honesta: no se curva el tubo, se <strong>mueve el centro ' +
          'de la proyección</strong>. Geométricamente no es un tubo curvo, pero el ojo lo compra sin ' +
          'rechistar, y cuesta una línea en vez de un motor de trazado.'
      });
    }
  });

  p.note('Ojo con el centro. Cuando $r$ tiende a cero, $k/r$ tiende a infinito, y ahí ' +
    '<code>float</code> se rinde: aparecen anillos parpadeantes y ruido. Por eso conviene o bien ' +
    'apagar la imagen cerca del centro —lo que hace el <code>smoothstep</code>— o sumar un pelín al ' +
    'radio: <code>k / (r + 0.02)</code>. Es el mismo problema que la [[fn-limites|asíntota]] de ' +
    '$1/x$ en el origen, con consecuencias visibles.', 'warn', 'La singularidad del centro');

  p.section('Otras formas con la misma idea');

  p.text('El túnel es un caso de algo más general: <strong>inventarse un mapa de la pantalla a las ' +
    'coordenadas de una superficie</strong>. Cambiando la fórmula sale otra superficie:');

  p.table(['Fórmula de $v$', 'Qué se ve'], [
    ['<code>k / r</code>', 'túnel cilíndrico'],
    ['<code>k / (r * r)</code>', 'túnel que se estrecha: parece un embudo'],
    ['<code>k / abs(p.y)</code> y <code>u = p.x / abs(p.y)</code>', 'un <strong>suelo infinito</strong> en perspectiva, el otro gran efecto de la época'],
    ['<code>log(r)</code>', 'un espacio autosemejante: haces zoom y vuelve a empezar'],
    ['<code>r</code> a secas', 'anillos planos, sin perspectiva']
  ]);

  p.text('La tercera fila merece que la pruebes: dos divisiones y tienes el suelo de damero que sale ' +
    'en todas las demos y en la pantalla de título de media docena de juegos.');

  p.util('El túnel de los noventa era un ejercicio de aritmética: aquellas máquinas no tenían coma ' +
    'flotante rápida, así que la división por píxel se precalculaba en una tabla y el efecto se ' +
    'reducía a leer memoria. Hoy la división es gratis y el efecto sobrevive por otra razón: es ' +
    'legible. Un túnel comunica movimiento y profundidad de forma inmediata, sin que el espectador ' +
    'tenga que interpretar nada, y por eso sigue en escenarios, en videoclips y en los fondos de ' +
    'pantalla de las conferencias tecnológicas.');

  p.hist('El túnel se convirtió en el <em>hola mundo</em> de la demoscene alrededor de 1993, junto ' +
    'con el fuego, las plasmas y los rotozooms. Casi todos aquellos efectos eran, mirados de cerca, ' +
    'un cambio de coordenadas: una tabla precalculada que decía, para cada píxel de la pantalla, qué ' +
    'punto de una textura había que leer. Cambiabas la tabla y tenías otro efecto. Este bloque entero ' +
    'no es más que aquella idea, con la tabla sustituida por una fórmula que se recalcula sesenta ' +
    'veces por segundo.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'De la pantalla a la pared',
    level: 'basico',
    gen: function (r) {
      var k = r.pick([0.2, 0.25, 0.3, 0.4]);
      var px = r.real(-0.5, 0.5, 3), py = r.real(-0.5, 0.5, 3);
      var rad = Math.sqrt(px * px + py * py);
      if (rad < 0.08) return null;
      var ang = Math.atan2(py, px);
      return { k: k, px: px, py: py, r: rad, a: ang, u: ang / (2 * Math.PI), v: k / rad };
    },
    ask: function (d) {
      return 'Un píxel cae en <code>p = (' + U.fmt(d.px, 3) + ', ' + U.fmt(d.py, 3) + ')</code> y el ' +
        'túnel usa <code>k = ' + U.fmt(d.k, 2) + '</code>, sin movimiento (<code>iTime = 0</code>).' +
        '<br><br>Calcula el radio en pantalla, y las dos coordenadas de la pared: <code>u = a/TAU</code> ' +
        'y <code>v = k/r</code>. (cuatro decimales)';
    },
    fields: [
      { name: 'r', label: 'radio', w: 'tiny' },
      { name: 'u', label: 'u', w: 'tiny' },
      { name: 'v', label: 'v', w: 'tiny' }
    ],
    sol: function (d) { return { r: U.round(d.r, 8), u: U.round(d.u, 8), v: U.round(d.v, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'El ángulo de <code>atan(y, x)</code> sale entre $-\\pi$ y $\\pi$, así que ' +
        '<code>u</code> sale entre $-0{,}5$ y $0{,}5$: es una vuelta completa al tubo.';
    },
    steps: function (d) {
      return ['$r = \\sqrt{' + U.fmt(d.px, 3) + '^2 + ' + U.fmt(d.py, 3) + '^2} = ' + U.fmt(d.r, 4) + '$',
        '$a = \\operatorname{atan}(' + U.fmt(d.py, 3) + ',\\ ' + U.fmt(d.px, 3) + ') = ' +
          U.fmt(d.a, 4) + '$ rad, así que $u = ' + U.fmt(d.a, 4) + '/2\\pi = ' + U.fmt(d.u, 4) + '$',
        '$v = ' + U.fmt(d.k, 2) + '/' + U.fmt(d.r, 4) + ' = ' + U.fmt(d.v, 4) + '$',
        'Ese $v$ es la profundidad: cuanto más cerca del centro esté el píxel, más grande sale, ' +
          'porque está mirando más lejos.'];
    },
    answer: function (d) {
      return 'r = ' + U.fmt(d.r, 4) + ' · u = ' + U.fmt(d.u, 4) + ' · v = ' + U.fmt(d.v, 4);
    }
  });

  p.exercise({
    title: 'Por qué lo lejano se mueve despacio',
    level: 'medio',
    gen: function (r) {
      var k = r.pick([0.25, 0.3]);
      var v1 = r.pick([2, 3, 4]);          // profundidad de un anillo cercano
      var v2 = v1 + r.pick([4, 6, 8]);     // otro mas lejano
      var dt = r.pick([0.5, 1]);           // avance en unidades de v
      return { k: k, v1: v1, v2: v2, dt: dt,
        r1: k / v1, r2: k / v2, r1b: k / (v1 - dt), r2b: k / (v2 - dt) };
    },
    ask: function (d) {
      return 'Dos anillos del túnel están a profundidad <strong>' + d.v1 + '</strong> y <strong>' +
        d.v2 + '</strong> (en unidades de $v$), con <code>k = ' + U.fmt(d.k, 2) + '</code>.<br><br>' +
        '¿A qué radio de pantalla se ve cada uno? Y si avanzas <strong>' + U.fmt(d.dt, 1) + '</strong> ' +
        'unidades, ¿cuánto se ha desplazado en pantalla el <strong>cercano</strong>? (cuatro decimales)';
    },
    fields: [
      { name: 'a', label: 'radio del cercano', w: 'tiny' },
      { name: 'b', label: 'radio del lejano', w: 'tiny' },
      { name: 'd', label: 'desplazamiento del cercano', w: 'tiny' }
    ],
    sol: function (d) {
      return { a: U.round(d.r1, 8), b: U.round(d.r2, 8), d: U.round(d.r1b - d.r1, 8) };
    },
    tol: 3e-4,
    hint: function (d) {
      return 'Radio y profundidad están relacionados por $r = k/v$. Para el desplazamiento, calcula ' +
        'el radio antes y después de avanzar: el anillo pasa de estar a ' + d.v1 + ' a estar a ' +
        U.fmt(d.v1 - d.dt, 1) + '.';
    },
    steps: function (d) {
      return ['Cercano: $r = ' + U.fmt(d.k, 2) + '/' + d.v1 + ' = ' + U.fmt(d.r1, 4) + '$',
        'Lejano: $r = ' + U.fmt(d.k, 2) + '/' + d.v2 + ' = ' + U.fmt(d.r2, 4) + '$',
        'Tras avanzar, el cercano queda a profundidad $' + U.fmt(d.v1 - d.dt, 1) + '$ y radio $' +
          U.fmt(d.r1b, 4) + '$: se ha movido $' + U.fmt(d.r1b - d.r1, 4) + '$.',
        'El lejano, en cambio, solo se mueve $' + U.fmt(d.r2b - d.r2, 4) + '$: unas ' +
          U.fmt((d.r1b - d.r1) / (d.r2b - d.r2), 1) + ' veces menos.',
        'Eso es el <strong>paralaje</strong>, y no ha habido que programarlo: sale gratis de que la ' +
          'relación sea $1/v$ y no lineal. Es lo que hace que el efecto se lea como profundidad de ' +
          'verdad.'];
    },
    answer: function (d) {
      return 'cercano ' + U.fmt(d.r1, 4) + ' · lejano ' + U.fmt(d.r2, 4) + ' · avanza ' +
        U.fmt(d.r1b - d.r1, 4);
    }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float r = length(p);\nfloat v = step(0.5, fract(4.0 * (0.3 / r + iTime)));',
          o: ['Anillos que nacen en el centro y se ensanchan hacia fuera, cada vez más separados: parece que avanzas por un túnel', 'Anillos igual de separados que se mueven hacia el centro', 'Rayas verticales que se desplazan', 'Sectores que giran'],
          por: 'Con $\\frac{0{,}3}{r}$ los anillos se apiñan cerca del centro y se espacian lejos, como la profundidad. Al crecer el tiempo, cada anillo necesita un $r$ mayor: salen hacia fuera.' },
        { c: 'float a = atan(p.y, p.x);\nfloat v = step(0.5, fract(8.0 * a / TAU));',
          o: ['Ocho franjas claras y ocho oscuras que salen del centro, como las paredes del túnel en tiras', 'Anillos concéntricos', 'Rayas horizontales', 'Un círculo en el centro'],
          por: 'El valor solo depende del ángulo, repetido ocho veces por vuelta: sectores, que en el túnel parecen tiras a lo largo de la pared.' },
        { c: 'float r = length(p);\nvec3 col = vec3(v) * r * 2.0;',
          o: ['El centro oscuro, como el fondo lejano del túnel, y los bordes más claros', 'El centro claro y los bordes oscuros', 'Brillo uniforme', 'Solo el centro visible'],
          por: 'Multiplicar por $r$ oscurece cerca del centro, que en el túnel representa lo más lejano: es una niebla barata.' },
        { c: 'p += 0.2 * vec2(sin(iTime), cos(iTime));\nfloat r = length(p);\nfloat a = atan(p.y, p.x);',
          o: ['El fondo del túnel se mueve describiendo círculos, como si el túnel se curvara', 'El túnel gira sobre sí mismo sin moverse el fondo', 'El túnel se queda quieto', 'El túnel se estira a lo ancho'],
          por: 'Desplazar <code>p</code> mueve el centro de las polares, que es el fondo del túnel; al desplazarlo con un seno y un coseno, recorre una circunferencia.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'En el túnel del tema, con <code>p</code> centrada y <code>v</code> el dibujo de la pared, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['En el túnel, $\\frac{1}{r}$ hace de profundidad y el ángulo, de posición alrededor de la pared.']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe el mapa',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'un <strong>túnel cilíndrico</strong>: una vuelta alrededor en <code>u</code> y la profundidad $0{,}25/r$ en <code>v</code>',
          ref: 'vec2(atan(p.y, p.x) / TAU, 0.25 / length(p))' },
        { pide: 'un <strong>embudo</strong>: igual, pero con la profundidad $0{,}25/r^2$, que se estrecha más deprisa',
          ref: 'vec2(atan(p.y, p.x) / TAU, 0.25 / dot(p, p))' },
        { pide: 'un <strong>suelo infinito</strong> en perspectiva: <code>u = p.x / |p.y|</code> y <code>v = 0.25 / |p.y|</code>',
          ref: 'vec2(p.x / abs(p.y), 0.25 / abs(p.y))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe el mapa de la pantalla a la pared para ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\nvec2 uv = <strong>???</strong> ;\nvec2 celda = floor(vec2(uv.x * 8.0, uv.y * 6.0));\nfloat t = mod(celda.x + celda.y, 2.0);\ncolor = vec4(vec3(t), 1.0);</pre>' +
        'Recuerda que <code>dot(p, p)</code> es $r^2$ y sale más barato que <code>length(p)*length(p)</code>.';
    },
    fields: [{ name: 'uv', label: 'el mapa', w: 'wide' }],
    sol: function (d) { return { uv: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.uv || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  vec2 uv = ' + x + ';\n' +
          '  vec2 celda = floor(vec2(uv.x * 8.0, uv.y * 6.0));\n' +
          '  float t = mod(celda.x + celda.y, 2.0);\n' +
          '  color = vec4(vec3(t), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 64, tol: 9 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado tiene que ser un <code>vec2</code> con la ' +
          'vuelta en <code>x</code> y la profundidad en <code>y</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la perspectiva no es la pedida. La clave está en el ' +
          'denominador: qué se divide y por qué.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'La primera componente da la vuelta (un ángulo dividido entre $2\\pi$, o una razón entre ' +
        'coordenadas) y la segunda es una <strong>división</strong>: eso es lo que crea la ' +
        'profundidad.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Cambiar el denominador cambia la superficie entera: cilindro, embudo o suelo.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Un túnel no tiene geometría: tiene una <strong>división</strong>. La profundidad es $k/r$, y eso sale de la semejanza de triángulos.',
    'Las coordenadas de la pared son el <strong>ángulo</strong> (la vuelta) y $k/r + t$ (el avance).',
    'Sumar tiempo a la profundidad <strong>es</strong> avanzar: no se mueve nada, se pregunta más allá.',
    'El paralaje —que lo lejano se mueva menos— sale gratis de que la relación sea $1/r$.',
    'Cerca del centro, $1/r$ se dispara: hay que apagar la imagen o sumar un pelín al radio.',
    'Cambiando el denominador salen otras superficies: embudo, suelo infinito, espacio autosemejante.'
  ]);
});
