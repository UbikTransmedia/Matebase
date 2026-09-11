/* Tema: Nubes y humo */
Course.topic('gfx-nubes', function (p) {

  var RUIDO3 =
    'float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\n' +
    '\n' +
    'float ruido(vec3 q)\n' +
    '{\n' +
    '    vec3 i = floor(q), f = fract(q);\n' +
    '    vec3 u = f * f * (3.0 - 2.0 * f);\n' +
    '    float a = mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), u.x);\n' +
    '    float b = mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), u.x);\n' +
    '    float c = mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), u.x);\n' +
    '    float d = mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), u.x);\n' +
    '    return mix(mix(a, b, u.y), mix(c, d, u.y), u.z);\n' +
    '}\n' +
    '\n' +
    '// fbm con un numero de octavas a elegir: la luz se conforma con menos\n' +
    'float fbm(vec3 p, float octavas)\n' +
    '{\n' +
    '    float s = 0.0, a = 0.5;\n' +
    '    for (int i = 0; i < 5; i++) {\n' +
    '        if (float(i) >= octavas) break;\n' +
    '        s += a * ruido(p);\n' +
    '        p = 2.03 * p + vec3(1.7, 9.2, 3.1);\n' +
    '        a *= 0.5;\n' +
    '    }\n' +
    '    return s;\n' +
    '}\n';

  p.puente('La [[gfx-luz|niebla]] ya usaba la ley de Beer-Lambert con un aire de densidad constante. Si la ' +
    'densidad cambia de un punto a otro, la [[fn-exp-log|exponencial]] lleva dentro una ' +
    '[[fn-integral-def|integral]], que el shader aproxima con una suma de Riemann a lo largo del rayo. ' +
    'La densidad la pone el [[gfx-materiales|ruido en tres dimensiones]].');

  p.text('Una nube no tiene superficie. El raymarching de las esferas y las cajas se paraba al tocar ' +
    'algo, pero en el humo no hay nada que tocar: la luz entra, una parte se pierde, otra rebota hacia ' +
    'el ojo, y lo de detrás se sigue viendo a medias. Para dibujarla, el rayo tiene que ' +
    '<strong>atravesar</strong> el volumen entero, y en cada tramo apuntar dos cosas: cuánta luz le ' +
    'llega de ahí y cuánta transparencia le queda.');

  /* ---------------------------------------------------------------- */
  p.section('Lo que deja pasar un medio');

  p.text('Un rayo que cruza una rodaja fina de humo pierde una fracción de su luz proporcional a la ' +
    'densidad y al grosor. Rodaja tras rodaja, las fracciones se multiplican, y eso da una exponencial: ' +
    'es la ley de Beer-Lambert, ahora con una densidad $\\rho$ que cambia a lo largo del camino.');

  p.formula('T = \\exp\\Bigl(-\\sigma\\int_0^{s} \\rho(\\vec o + u\\,\\vec d)\\,du\\Bigr)' +
    '\\;\\approx\\; \\prod_{i} e^{-\\sigma\\,\\rho_i\\,\\Delta s} = e^{-\\sigma\\sum_i \\rho_i\\,\\Delta s}',
    'la transmitancia',
    '$T$ es la fracción de luz que atraviesa el tramo: 1 si no hay nada, 0 si es opaco. $\\sigma$ dice ' +
    'lo que absorbe el material y $\\rho$ la densidad en cada punto.<br><br>' +
    'La integral no se puede resolver con un ruido dentro, así que se parte el rayo en rodajas de grosor ' +
    '$\\Delta s$ y se suma: es una suma de Riemann. Al número $\\tau = \\sigma\\sum_i \\rho_i\\,\\Delta s$ ' +
    'se le llama <strong>espesor óptico</strong>.');

  p.text('Además de quitar, cada rodaja <em>pone</em>: la luz que rebota en sus gotas hacia el ojo. La ' +
    'rodaja $i$ desvía hacia el ojo la fracción que absorbe, $1 - e^{-\\sigma\\rho_i\\Delta s}$, de la luz ' +
    '$L_i$ que le llega. Pero lo que aporta tiene que atravesar todas las rodajas de delante, así que se ' +
    'multiplica por la transmitancia acumulada hasta ella:');

  p.formula('L = \\sum_i T_i\\,\\bigl(1 - e^{-\\sigma\\rho_i\\Delta s}\\bigr)\\,L_i \\;+\\; T\\,L_{\\text{fondo}},' +
    '\\qquad T_{i+1} = T_i\\, e^{-\\sigma\\rho_i\\Delta s}',
    'lo que llega al ojo',
    'Se recorre de delante hacia atrás. En el shader son dos líneas dentro del bucle, y en este orden: ' +
    'primero <code>luz += T * a * L;</code> y después <code>T *= 1.0 - a;</code>. Al final se suma lo ' +
    'que queda del fondo, <code>T * fondo</code>.');

  p.ejemplo({
    title: 'Tres rodajas de humo',
    enunciado: 'Un rayo cruza tres rodajas de grosor $\\Delta s = 0{,}4$, con densidades $0{,}5$, $2$ y $1$, en un humo con $\\sigma = 1$. Cada rodaja recibe una luz blanca $L = 1$ y el fondo es negro. ¿Qué transmitancia queda y cuánta luz llega al ojo?',
    pasos: [
      { t: '<strong>Cada rodaja.</strong> $\\sigma\\rho\\Delta s$ vale $0{,}2$, $0{,}8$ y $0{,}4$. Dejan pasar $e^{-0{,}2} = 0{,}8187$, $e^{-0{,}8} = 0{,}4493$ y $e^{-0{,}4} = 0{,}6703$.', antes: '¿Cuánto deja pasar cada rodaja por separado?' },
      { t: '<strong>La transmitancia.</strong> Se multiplican: $0{,}8187\\cdot 0{,}4493\\cdot 0{,}6703 = 0{,}2466$, que es $e^{-1{,}4}$. El espesor óptico es la suma, $0{,}2 + 0{,}8 + 0{,}4 = 1{,}4$.', antes: '¿Se suman o se multiplican las transmitancias?' },
      { t: '<strong>La luz, rodaja a rodaja.</strong> La primera aporta $1\\cdot(1 - 0{,}8187) = 0{,}1813$. La segunda, $0{,}8187\\cdot(1 - 0{,}4493) = 0{,}4509$. La tercera, $0{,}3679\\cdot(1 - 0{,}6703) = 0{,}1213$.', antes: 'La segunda rodaja aporta lo que absorbe, pero ¿cuánto de eso atraviesa la primera?' },
      { t: '<strong>El total.</strong> $0{,}1813 + 0{,}4509 + 0{,}1213 = 0{,}7534$, que es justo $1 - 0{,}2466$. Con luz blanca en todas partes, la nube tapa el fondo exactamente en la proporción en que brilla.' }
    ],
    cierre: 'La rodaja más densa, la del medio, es la que más aporta, pero no tanto como aportaría si estuviera delante: la primera ya le ha quitado casi un 20 % de la luz.'
  });

  p.comprueba('Un rayo cruza dos capas de niebla iguales, y cada una sola deja pasar el 50 % de la luz. ¿Cuánto deja pasar el conjunto?', [
    { t: 'El 25 %', ok: true, por: 'La segunda capa deja pasar la mitad de lo que le llega, que ya era la mitad: $0{,}5\\cdot 0{,}5$. Las transmitancias se multiplican y los espesores ópticos se suman.' },
    { t: 'Nada: 50 % más 50 % es el 100 % absorbido', ok: false, por: 'Las absorciones no se suman: la segunda capa solo puede quitar luz de la que le llega. Por eso ninguna cantidad finita de niebla es del todo opaca.' },
    { t: 'El 50 %, porque las dos capas son iguales', ok: false, por: 'Serían el 50 % si la luz atravesase solo una. Cada capa quita su parte de lo que queda.' }
  ]);

  p.demo({
    title: 'Una bola de humo',
    intro: 'Una esfera llena de humo que sube, delante de un tablero. El rayo recorre el tramo que queda dentro de la esfera en rodajas iguales, y el tablero se ve a través en la proporción que marca la transmitancia. Aquí la luz de cada rodaja es solo más clara arriba que abajo.',
    predice: 'Baja los pasos a 4. ¿El humo se verá más claro, más oscuro, o partido en capas? ¿Cambiará mucho cuánto tablero se ve a través?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-nubes-1', alto: 320,
        aria: 'Una bola de humo anaranjado, más clara arriba, que se agita y deja ver a medias un tablero de cuadros detrás.',
        mandos: [
          { n: 'sigma', label: 'absorción σ', min: 0.5, max: 12, step: 0.1, value: 4, dec: 1 },
          { n: 'detalle', label: 'detalle del ruido', min: 0, max: 1.5, step: 0.05, value: 1, dec: 2 },
          { n: 'pasos', label: 'pasos (rodajas)', min: 2, max: 64, step: 1, value: 40, dec: 0 }
        ],
        codigo: RUIDO3 +
          '\n' +
          '// la densidad: 1 en el centro de la bola, 0 fuera, agitada por el ruido\n' +
          'float densidad(vec3 p)\n' +
          '{\n' +
          '    float bola = 1.0 - length(p);\n' +
          '    float n = fbm(2.0 * p + vec3(0.0, -0.4 * iTime, 0.0), 5.0);\n' +
          '    return clamp(1.5 * bola + detalle * 2.0 * (n - 0.5), 0.0, 1.0);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec3 ojo = vec3(0.0, 0.0, -3.0);\n' +
          '    vec3 dir = normalize(vec3(uv, 1.3));\n' +
          '\n' +
          '    // el fondo: un tablero, para ver lo que deja pasar el humo\n' +
          '    vec2 celda = floor(uv * 8.0);\n' +
          '    vec3 fondo = mix(vec3(0.02, 0.04, 0.08), vec3(0.45, 0.5, 0.6), mod(celda.x + celda.y, 2.0));\n' +
          '    vec3 col = fondo;\n' +
          '\n' +
          '    // el tramo del rayo dentro de la esfera de radio 1\n' +
          '    float b = dot(ojo, dir);\n' +
          '    float disc = b * b - dot(ojo, ojo) + 1.0;\n' +
          '    if (disc > 0.0) {\n' +
          '        float t0 = -b - sqrt(disc), t1 = -b + sqrt(disc);\n' +
          '        float ds = (t1 - t0) / pasos;\n' +
          '        float T = 1.0;          // lo que deja pasar lo ya recorrido\n' +
          '        vec3 luz = vec3(0.0);   // la luz que llega al ojo\n' +
          '        for (int i = 0; i < 64; i++) {\n' +
          '            if (float(i) >= pasos) break;\n' +
          '            vec3 p = ojo + (t0 + (float(i) + 0.5) * ds) * dir;\n' +
          '            float a = 1.0 - exp(-sigma * densidad(p) * ds);   // lo que absorbe la rodaja\n' +
          '            vec3 L = mix(vec3(0.12, 0.08, 0.14), vec3(1.0, 0.8, 0.6), clamp(0.6 + 0.6 * p.y, 0.0, 1.0));\n' +
          '            luz += T * a * L;      // lo que pone, tapado por lo de delante\n' +
          '            T *= 1.0 - a;          // y lo que quita a lo de detras\n' +
          '        }\n' +
          '        col = luz + T * fondo;\n' +
          '    }\n' +
          '    color = vec4(sqrt(col), 1.0);\n' +
          '}\n',
        nota: 'El grosor de cada rodaja entra en la absorción: <code>exp(-sigma * densidad(p) * ds)</code>. Por eso, al cambiar los pasos, la cantidad total de humo casi no cambia; lo que cambia es lo bien que se ve el detalle.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La luz que llega hasta dentro');

  p.text('En la bola de humo la luz de cada rodaja era un color inventado. En una nube de verdad, a cada ' +
    'punto le llega la luz del sol <strong>después de atravesar la nube</strong> que tiene entre él y el ' +
    'sol. Es la misma idea que la [[gfx-luz|sombra suave]], pero con transmitancia: desde cada muestra se ' +
    'da una segunda marcha, corta, hacia el sol.');

  p.formula('L_i = L_{\\text{sol}}\\; e^{-\\sigma\\sum_{j} \\rho(\\vec p_i + j\\,\\delta\\,\\vec l)\\,\\delta} \\;+\\; L_{\\text{cielo}}',
    'la luz en un punto de la nube',
    '$\\vec l$ es la dirección hacia el sol y $\\delta$ el paso de esa segunda marcha. El término del ' +
    'cielo es una luz ambiente azulada, la que llega de todas partes.<br><br>' +
    'Por eso las nubes tienen la base oscura y los bordes que dan al sol brillantes: la luz que llega ' +
    'abajo ha tenido que atravesar toda la nube.');

  p.text('Queda darle forma. Una nube es un fbm al que se le quita un umbral, para que solo asome donde ' +
    'el ruido es alto, multiplicado por un perfil que la encierra en una capa del cielo:');

  p.formula('\\rho(\\vec p) = \\max\\bigl(\\text{fbm}(0{,}4\\,\\vec p + \\vec v\\,t) - u,\\ 0\\bigr)\\cdot \\text{perfil}(p_y)',
    'la densidad de una capa de nubes',
    'El umbral $u$ es la cobertura: con $u$ bajo casi todo es nube, y con $u$ alto quedan unos pocos ' +
    'cúmulos. $\\vec v\\,t$ desplaza el ruido, y eso es el viento. El perfil vale 1 entre las alturas de ' +
    'la capa y cae a 0 fuera, con dos <code>smoothstep</code>.');

  p.table(['Coste', 'Veces por píxel', 'Truco'], [
    ['Muestras a lo largo del rayo', '32', 'saltar las muestras sin densidad'],
    ['Muestras hacia el sol, por cada una', '3', 'menos octavas de ruido: la luz no necesita detalle'],
    ['Octavas en cada muestra', '4 y 2', 'parar cuando $T$ baja de 0,02: detrás ya no se ve nada']
  ]);

  p.demo({
    title: 'Un cielo de nubes',
    intro: 'Una capa de nubes entre las alturas 2 y 4,6, vista desde el suelo. Cada rayo que sube la cruza en 32 rodajas, y desde cada rodaja con nube se dan tres pasos hacia el sol.',
    predice: 'Baja el sol a 0,05, casi en el horizonte. ¿Qué parte de cada nube se oscurecerá más: la base, la cara que mira al sol o la cara opuesta?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-nubes-2', alto: 340,
        aria: 'Un cielo azul con cúmulos blancos de base gris que avanzan con el viento, iluminados por un sol bajo.',
        mandos: [
          { n: 'cobertura', label: 'cobertura', min: 0, max: 1, step: 0.01, value: 0.55, dec: 2 },
          { n: 'absorcion', label: 'absorción σ', min: 0.5, max: 8, step: 0.1, value: 3, dec: 1 },
          { n: 'alturaSol', label: 'altura del sol', min: 0.05, max: 1.5, step: 0.05, value: 0.4, dec: 2 }
        ],
        codigo: RUIDO3 +
          '\n' +
          'float densidad(vec3 p, float octavas)\n' +
          '{\n' +
          '    vec3 q = 0.4 * p + vec3(0.25 * iTime, 0.0, 0.08 * iTime);           // el viento\n' +
          '    float perfil = smoothstep(2.0, 2.7, p.y) * (1.0 - smoothstep(3.3, 4.6, p.y));\n' +
          '    float umbral = 0.75 - 0.4 * cobertura;\n' +
          '    return 6.0 * max(fbm(q, octavas) - umbral, 0.0) * perfil;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec3 ojo = vec3(0.0);\n' +
          '    vec3 f = normalize(vec3(0.0, 0.35, 1.0));\n' +
          '    vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));\n' +
          '    vec3 u = cross(f, r);\n' +
          '    vec3 dir = normalize(uv.x * r + uv.y * u + 1.3 * f);\n' +
          '\n' +
          '    vec3 sol = normalize(vec3(0.6, alturaSol, 1.0));\n' +
          '    vec3 cielo = mix(vec3(0.72, 0.8, 0.9), vec3(0.22, 0.42, 0.78), clamp(1.5 * dir.y, 0.0, 1.0));\n' +
          '    vec3 col = cielo + vec3(1.0, 0.85, 0.6) * pow(max(dot(dir, sol), 0.0), 400.0) * 3.0;\n' +
          '\n' +
          '    if (dir.y > 0.03) {\n' +
          '        // el tramo del rayo dentro de la capa\n' +
          '        float t0 = 2.0 / dir.y;\n' +
          '        float t1 = min(4.6 / dir.y, t0 + 12.0);\n' +
          '        float ds = (t1 - t0) / 32.0;\n' +
          '        float T = 1.0;\n' +
          '        vec3 luz = vec3(0.0);\n' +
          '        for (int i = 0; i < 32; i++) {\n' +
          '            vec3 p = ojo + (t0 + (float(i) + 0.5) * ds) * dir;\n' +
          '            float rho = densidad(p, 4.0);\n' +
          '            if (rho > 0.001) {\n' +
          '                // cuanta nube hay entre este punto y el sol: tres pasos\n' +
          '                float camino = 0.0;\n' +
          '                for (int j = 1; j <= 3; j++) camino += 0.3 * densidad(p + sol * 0.3 * float(j), 2.0);\n' +
          '                vec3 L = vec3(1.0, 0.93, 0.82) * exp(-absorcion * camino)    // el sol, atenuado\n' +
          '                       + vec3(0.4, 0.5, 0.65) * 0.4;                         // el cielo\n' +
          '                float a = 1.0 - exp(-absorcion * rho * ds);\n' +
          '                luz += T * a * L;\n' +
          '                T *= 1.0 - a;\n' +
          '                if (T < 0.02) break;    // detras ya no se ve nada\n' +
          '            }\n' +
          '        }\n' +
          '        vec3 nubes = col * T + luz;\n' +
          '        col = mix(nubes, col, 1.0 - exp(-0.002 * t0 * t0));   // lejos, se funden con el cielo\n' +
          '    }\n' +
          '    color = vec4(sqrt(col), 1.0);\n' +
          '}\n',
        nota: 'La marcha hacia el sol usa solo dos octavas de ruido: la sombra dentro de una nube es suave y no necesita detalle. Es el truco que hace que un cielo así quepa en tiempo real.'
      });
    }
  });

  p.comprueba('En el cielo de nubes, se quita la marcha hacia el sol y cada punto recibe la luz del sol entera. ¿Qué cambia?', [
    { t: 'Las nubes quedan igual de claras por todas partes, sin base oscura: parecen algodón plano', ok: true, por: 'La base oscura y los bordes brillantes salen de la luz que la nube se quita a sí misma. Sin esa marcha, toda la nube recibe lo mismo y solo se distingue su silueta.' },
    { t: 'Desaparecen las nubes', ok: false, por: 'La forma la dan la densidad y la transmitancia a lo largo del rayo de la cámara, que siguen ahí. Lo que se pierde es el relieve de la luz.' },
    { t: 'Las nubes se vuelven negras', ok: false, por: 'Sin la marcha, la luz que llega es la máxima, no la mínima: si acaso, más claras.' }
  ]);

  p.util('Los cielos de los videojuegos actuales se dibujan así: en 2015, Andrew Schneider contó en SIGGRAPH ' +
    'cómo su equipo pintaba en tiempo real las nubes de <em>Horizon Zero Dawn</em> con ruido en 3D, una ' +
    'marcha por el volumen y otra hacia el sol. El cine usa la misma integral con muchos más pasos para ' +
    'humo, fuego y explosiones. Y en medicina es una herramienta diaria: el renderizado de volumen de un ' +
    'TAC o una resonancia acumula a lo largo de cada rayo la densidad de los tejidos, con la misma ' +
    'suma de delante hacia atrás, para enseñar huesos y vasos sin cortar nada.');

  p.hist('Pierre Bouguer midió en 1729 cómo se apaga la luz de las estrellas al atravesar la atmósfera, ' +
    'Johann Heinrich Lambert lo escribió como una exponencial en 1760, y August Beer lo aplicó en 1852 a ' +
    'la concentración de una disolución. En 1941 Louis Henyey y Jesse Greenstein describieron cómo el polvo ' +
    'interestelar reparte la luz según el ángulo, una fórmula que todavía se usa para las nubes. James ' +
    'Kajiya y Brian Von Herzen trazaron rayos a través de densidades en 1984, y en 1988 Marc Levoy y el ' +
    'grupo de Robert Drebin, Loren Carpenter y Pat Hanrahan publicaron el renderizado de volumen.');

  p.trampas([
    { e: 'Sumar la luz de cada rodaja sin multiplicar por $T$', por: 'Lo de detrás brillaría igual que lo de delante, como si la nube fuera transparente para su propia luz: sale plana y demasiado brillante.' },
    { e: 'Actualizar $T$ antes de sumar la luz de la rodaja', por: 'La rodaja se tapa a sí misma dos veces y la nube sale más oscura de lo que debe. El orden es: primero <code>luz += T * a * L</code>, después <code>T *= 1.0 - a</code>.' },
    { e: 'Olvidar el grosor de la rodaja', por: 'Con <code>a = 1.0 - exp(-sigma * rho)</code> la nube se vuelve más opaca cuantos más pasos se dan. El grosor $\\Delta s$ va dentro de la exponencial.' },
    { e: 'Muestrear todos los rayos en los mismos planos', por: 'Con pocos pasos aparecen capas visibles, como lonchas. Se disimula desplazando el inicio de cada rayo una fracción de paso distinta en cada píxel, con un hash.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Capas que se multiplican',
    level: 'basico',
    gen: function (r) {
      var sigma = r.pick([0.5, 1, 2]), ds = r.pick([0.1, 0.25, 0.5]);
      var rho = [r.int(1, 20) / 10, r.int(1, 20) / 10, r.int(1, 20) / 10];
      var suma = rho[0] + rho[1] + rho[2], tau = sigma * ds * suma;
      if (tau > 2.5 || tau < 0.1) return null;
      var lin = 1;
      rho.forEach(function (x) { lin *= 1 - sigma * x * ds; });
      return { sigma: sigma, ds: ds, rho: rho, suma: suma, tau: tau, T: Math.exp(-tau), unoMenos: 1 - tau, lin: lin };
    },
    ask: function (d) {
      return 'Un rayo cruza tres rodajas de humo de grosor $\\Delta s = ' + U.fmt(d.ds, 2) + '$, con densidades ' + d.rho.map(function (x) { return '$' + U.fmt(x, 1) + '$'; }).join(', ') +
        ', en un humo con $\\sigma = ' + U.fmt(d.sigma, 1) + '$. ¿Cuál es el espesor óptico $\\tau$, y qué fracción de la luz atraviesa las tres? (cuatro decimales)';
    },
    fields: [{ name: 'tau', label: '$\\tau$', w: 'tiny' }, { name: 'T', label: 'transmitancia', w: 'tiny' }],
    sol: function (d) { return { tau: U.round(d.tau, 6), T: U.round(d.T, 6) }; },
    dec: 4,
    errores: [
      { si: function (v, d) { return Math.abs(d.unoMenos - d.T) > 1e-3 && Math.abs(v.T - d.unoMenos) < 5e-5; }, msg: 'Eso es $1 - \\tau$, que solo se parece a $e^{-\\tau}$ cuando $\\tau$ es muy pequeño. Las absorciones no se restan: la transmitancia es la exponencial.' },
      { si: function (v, d) { return Math.abs(d.lin - d.T) > 1e-3 && Math.abs(v.T - d.lin) < 5e-5; }, msg: 'Has multiplicado $1 - \\sigma\\rho\\Delta s$ en cada rodaja. Cada una deja pasar $e^{-\\sigma\\rho\\Delta s}$, que no es lo mismo con rodajas gruesas.' }
    ],
    hint: function () { return ['$\\tau = \\sigma\\,\\Delta s\\,(\\rho_1 + \\rho_2 + \\rho_3)$.', 'La transmitancia es $e^{-\\tau}$.']; },
    steps: function (d) {
      return ['$\\tau = ' + U.fmt(d.sigma, 1) + '\\cdot ' + U.fmt(d.ds, 2) + '\\cdot ' + U.fmt(d.suma, 1) + ' = ' + U.fmt(d.tau, 4) + '$.',
        '$T = e^{-' + U.fmt(d.tau, 4) + '} = ' + U.fmt(d.T, 4) + '$: pasa el ' + U.fmt(100 * d.T, 1) + ' % de la luz.',
        'Es lo mismo que multiplicar lo que deja pasar cada rodaja, porque el producto de exponenciales es la exponencial de la suma.'];
    },
    answer: function (d) { return 'τ ' + U.fmt(d.tau, 4) + ' · T ' + U.fmt(d.T, 4); }
  });

  p.exercise({
    title: 'Lo que llega al ojo',
    level: 'medio',
    gen: function (r) {
      var t1 = r.int(1, 15) / 10, t2 = r.int(1, 15) / 10, L1 = r.int(2, 10) / 10, L2 = r.int(2, 10) / 10, F = r.int(0, 10) / 10;
      var a1 = 1 - Math.exp(-t1), a2 = 1 - Math.exp(-t2), T1 = Math.exp(-t1), T2 = Math.exp(-t1 - t2);
      var luz = a1 * L1 + T1 * a2 * L2 + T2 * F;
      return { t1: t1, t2: t2, L1: L1, L2: L2, F: F, a1: a1, a2: a2, T1: T1, T2: T2, luz: luz,
        sinT: a1 * L1 + a2 * L2 + T2 * F, sinFondo: a1 * L1 + T1 * a2 * L2 };
    },
    ask: function (d) {
      return 'Un rayo cruza dos rodajas. En la de delante $\\sigma\\rho\\Delta s = ' + U.fmt(d.t1, 1) + '$ y le llega una luz $L_1 = ' + U.fmt(d.L1, 1) +
        '$; en la de detrás, $\\sigma\\rho\\Delta s = ' + U.fmt(d.t2, 1) + '$ y $L_2 = ' + U.fmt(d.L2, 1) + '$. Detrás está el fondo, con brillo $' + U.fmt(d.F, 1) +
        '$. Recorriendo de delante hacia atrás, ¿qué transmitancia queda al final y cuánta luz llega al ojo? (cuatro decimales)';
    },
    fields: [{ name: 'T', label: 'transmitancia final', w: 'tiny' }, { name: 'L', label: 'luz en el ojo', w: 'tiny' }],
    sol: function (d) { return { T: U.round(d.T2, 6), L: U.round(d.luz, 6) }; },
    dec: 4,
    errores: [
      { si: function (v, d) { return Math.abs(d.sinT - d.luz) > 1e-3 && Math.abs(v.L - d.sinT) < 5e-5; }, msg: 'La luz de la rodaja de detrás tiene que atravesar la de delante: se multiplica por lo que deja pasar la primera, $e^{-\\sigma\\rho\\Delta s}$.' },
      { si: function (v, d) { return d.F > 0 && Math.abs(v.L - d.sinFondo) < 5e-5; }, msg: 'Falta el fondo: la transmitancia que queda al final deja ver su brillo, que se suma multiplicado por $T$.' }
    ],
    hint: function () { return ['Cada rodaja pone $T\\,(1 - e^{-\\sigma\\rho\\Delta s})\\,L$, con la $T$ que queda justo antes de ella.', 'Al final, suma $T\\cdot\\text{fondo}$.']; },
    steps: function (d) {
      return ['Delante: $T = 1$ y $a_1 = 1 - e^{-' + U.fmt(d.t1, 1) + '} = ' + U.fmt(d.a1, 4) + '$; pone $' + U.fmt(d.a1 * d.L1, 4) + '$ y deja $T = ' + U.fmt(d.T1, 4) + '$.',
        'Detrás: $a_2 = ' + U.fmt(d.a2, 4) + '$; pone $' + U.fmt(d.T1, 4) + '\\cdot ' + U.fmt(d.a2, 4) + '\\cdot ' + U.fmt(d.L2, 1) + ' = ' + U.fmt(d.T1 * d.a2 * d.L2, 4) + '$ y deja $T = ' + U.fmt(d.T2, 4) + '$.',
        'Fondo: $' + U.fmt(d.T2, 4) + '\\cdot ' + U.fmt(d.F, 1) + ' = ' + U.fmt(d.T2 * d.F, 4) + '$. Total: $' + U.fmt(d.luz, 4) + '$.'];
    },
    answer: function (d) { return 'T ' + U.fmt(d.T2, 4) + ' · luz ' + U.fmt(d.luz, 4); }
  });

  p.exercise({
    title: 'Cuánta niebla hace falta',
    level: 'medio',
    gen: function (r) {
      var sigma = r.pick([0.5, 1, 2]), rho = r.pick([0.5, 1, 2, 4]), q = r.pick([0.5, 0.25, 0.1, 0.01]);
      var k = sigma * rho;
      return { sigma: sigma, rho: rho, q: q, s: Math.log(1 / q) / k, log10: Math.log(1 / q) / Math.LN10 / k, lin: (1 - q) / k };
    },
    ask: function (d) {
      return 'Una niebla uniforme tiene $\\sigma = ' + U.fmt(d.sigma, 1) + '$ y densidad $\\rho = ' + U.fmt(d.rho, 1) + '$. ¿Qué espesor hay que atravesar para que solo pase el ' +
        U.fmt(100 * d.q, 0) + ' % de la luz? (cuatro decimales)';
    },
    fields: [{ name: 's', label: 'espesor', w: 'tiny' }],
    sol: function (d) { return { s: U.round(d.s, 6) }; },
    dec: 4,
    errores: [
      { si: function (v, d) { return Math.abs(v.s - d.log10) < 5e-5; }, msg: 'Ese es el logaritmo decimal. La exponencial de Beer-Lambert es $e^{x}$, así que se despeja con el logaritmo neperiano, $\\ln$.' },
      { si: function (v, d) { return Math.abs(d.lin - d.s) > 1e-3 && Math.abs(v.s - d.lin) < 5e-5; }, msg: 'Así sería si la luz se perdiera en línea recta, $1 - \\sigma\\rho s$. Se pierde en exponencial: iguala $e^{-\\sigma\\rho s}$ a la fracción que pasa.' }
    ],
    hint: function () { return ['Plantea $e^{-\\sigma\\rho s} = $ la fracción que pasa, y toma logaritmos.']; },
    steps: function (d) {
      return ['$e^{-' + U.fmt(d.sigma * d.rho, 1) + '\\,s} = ' + U.fmt(d.q, 2) + ' \\Rightarrow s = \\frac{\\ln(1/' + U.fmt(d.q, 2) + ')}{' + U.fmt(d.sigma * d.rho, 1) + '}$.',
        '$s = \\frac{' + U.fmt(Math.log(1 / d.q), 4) + '}{' + U.fmt(d.sigma * d.rho, 1) + '} = ' + U.fmt(d.s, 4) + '$.',
        'Cada vez que se atraviesa ese mismo espesor, la luz vuelve a quedarse en el ' + U.fmt(100 * d.q, 0) + ' % de la que había: la exponencial no llega nunca a cero.'];
    },
    answer: function (d) { return U.fmt(d.s, 4); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'luz += a * L;      // antes: luz += T * a * L;',
          o: ['La nube sale plana y demasiado brillante: lo de detrás brilla igual que lo de delante', 'La nube sale más oscura', 'La nube desaparece', 'No cambia nada'],
          por: 'Sin la $T$, la luz de las rodajas del fondo llega al ojo sin atravesar las de delante. Se suman todas enteras y se pierde la sensación de volumen.' },
        { c: 'float a = 1.0 - exp(-sigma * densidad(p));   // sin ds',
          o: ['La opacidad de la nube depende del número de pasos: con más pasos, más opaca', 'La nube no cambia al mover los pasos', 'La nube se vuelve transparente del todo', 'Solo cambia el color'],
          por: 'Cada rodaja absorbe como si midiera 1, sea cual sea su grosor real: cuantas más rodajas, más absorción total.' },
        { c: 'T *= 1.0 - a;\nluz += T * a * L;   // las dos lineas, al reves',
          o: ['La nube sale algo más oscura: cada rodaja se tapa a sí misma', 'La nube sale más brillante', 'Aparece un agujero en el centro', 'No cambia nada'],
          por: 'La rodaja se multiplica por su propia transmitancia antes de aportar su luz, así que aporta $a(1 - a)$ en vez de $a$.' },
        { c: 'vec3 L = vec3(1.0, 0.93, 0.82) + vec3(0.4, 0.5, 0.65) * 0.4;   // sin la marcha al sol',
          o: ['Nubes igual de claras por todas partes, sin base oscura ni bordes brillantes', 'Nubes negras', 'Un cielo sin nubes', 'Nubes con sombras más marcadas'],
          por: 'La base oscura sale de la luz que la propia nube le quita al sol. Sin la segunda marcha, todos los puntos reciben lo mismo.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'En los shaders de volumen del tema se cambia esto. ¿Qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿La línea toca la transmitancia, la absorción de una rodaja, el orden de la acumulación o la luz que llega a cada punto?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  var BUCLE = {
    a: { linea: 'float a = <strong>???</strong> ;', pide: 'la fracción que <strong>absorbe</strong> la rodaja, con <code>sigma</code>, <code>rho</code> y <code>ds</code>', ref: '1.0 - exp(-sigma * rho * ds)' },
    luz: { linea: 'luz += <strong>???</strong> ;', pide: 'lo que la rodaja <strong>suma a la luz</strong>, con <code>T</code>, <code>a</code> y el color <code>humo</code>', ref: 'T * a * humo' },
    T: { linea: 'T = <strong>???</strong> ;', pide: 'la <strong>transmitancia</strong> que queda tras la rodaja, con <code>T</code> y <code>a</code>', ref: 'T * (1.0 - a)' }
  };

  p.exercise({
    title: 'Escribe la acumulación',
    level: 'avanzado',
    gen: function (r) { return { k: r.pick(['a', 'luz', 'T']) }; },
    ask: function (d) {
      var l = { a: 'float a = 1.0 - exp(-sigma * rho * ds);', luz: 'luz += T * a * humo;', T: 'T = T * (1.0 - a);' };
      l[d.k] = BUCLE[d.k].linea;
      return 'Completa el bucle que recorre una bola de humo para escribir ' + BUCLE[d.k].pide + ':<br>' +
        '<pre class="shd__mini">for (int i = 0; i &lt; 6; i++) {\n    vec3 p = ojo + (t0 + (float(i) + 0.5) * ds) * dir;\n    float rho = densidad(p);\n    ' +
        l.a + '\n    ' + l.luz + '\n    ' + l.T + '\n}\ncol = luz + T * fondo;</pre>';
    },
    fields: [{ name: 'x', label: 'la expresión', w: 'wide' }],
    sol: function (d) { return { x: BUCLE[d.k].ref }; },
    check: function (v, d) {
      var texto = String(v.raw.x || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        var l = { a: '1.0 - exp(-sigma * rho * ds)', luz: 'T * a * humo', T: 'T * (1.0 - a)' };
        l[d.k] = x;
        return RUIDO3 +
          'float densidad(vec3 p) { return clamp(1.5 * (1.0 - length(p)) + 2.0 * (fbm(2.0 * p, 4.0) - 0.5), 0.0, 1.0); }\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '  vec3 ojo = vec3(0.0, 0.0, -2.6), dir = normalize(vec3(uv, 1.2));\n' +
          '  vec2 celda = floor(uv * 6.0);\n' +
          '  vec3 fondo = vec3(mod(celda.x + celda.y, 2.0));\n' +
          '  vec3 col = fondo;\n' +
          '  float b = dot(ojo, dir), disc = b * b - dot(ojo, ojo) + 1.0;\n' +
          '  if (disc > 0.0) {\n' +
          '    float t0 = -b - sqrt(disc), ds = 2.0 * sqrt(disc) / 6.0;\n' +
          '    float sigma = 6.0, T = 1.0;\n' +
          '    vec3 luz = vec3(0.0);\n' +
          '    for (int i = 0; i < 6; i++) {\n' +
          '      vec3 p = ojo + (t0 + (float(i) + 0.5) * ds) * dir;\n' +
          '      vec3 humo = mix(vec3(1.0, 0.3, 0.0), vec3(0.0, 0.5, 1.0), float(i) / 5.0);\n' +
          '      float rho = densidad(p);\n' +
          '      float a = ' + l.a + ';\n' +
          '      luz += ' + l.luz + ';\n' +
          '      T = ' + l.T + ';\n' +
          '    }\n' +
          '    col = luz + T * fondo;\n' +
          '  }\n' +
          '  color = vec4(clamp(col, 0.0, 1.0), 1.0);\n}';
      }
      // Pocas rodajas gruesas y un color que cambia con la profundidad: asi se
      // nota una absorcion lineal, sigma * rho * ds, que con muchas rodajas
      // finas y un solo color casi coincidia con la exponencial.
      var r = W.glslIguales(env(texto), env(BUCLE[d.k].ref), { tam: 48, tol: 4 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Comprueba el tipo: <code>a</code> y <code>T</code> son <code>float</code>, y lo que se suma a <code>luz</code> es un <code>vec3</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la bola de humo no queda como debería. Repasa la exponencial, el grosor <code>ds</code> y qué se multiplica por la transmitancia.' };
      }
      return { ok: true };
    },
    hint: function () { return 'Una rodaja deja pasar $e^{-\\sigma\\rho\\Delta s}$ y absorbe el resto. Lo que aporta a la luz es lo que absorbe, por su color, por lo que dejan pasar las de delante.'; },
    steps: function (d) { return ['Se pedía ' + BUCLE[d.k].pide + '.', 'Una respuesta: <code>' + BUCLE[d.k].ref + '</code>.', 'El corrector pinta la bola de humo con tu línea y con la de referencia, delante de un tablero, y compara las dos imágenes.']; },
    answer: function (d) { return BUCLE[d.k].ref; }
  });

  p.keys([
    'Un volumen se dibuja atravesándolo: el rayo se parte en rodajas y en cada una se apunta la luz que pone y la transparencia que quita.',
    'La <strong>transmitancia</strong> es $e^{-\\sigma\\int\\rho}$: las de las rodajas se multiplican y los espesores ópticos se suman. La integral se aproxima con una suma de Riemann.',
    'De delante hacia atrás: <code>luz += T * a * L</code> y después <code>T *= 1.0 - a</code>, con <code>a = 1.0 - exp(-sigma * rho * ds)</code>.',
    'La luz de cada punto es la del sol atenuada por la nube que tiene delante del sol: por eso las nubes tienen la base oscura.',
    'Una capa de nubes es un fbm menos un umbral, dentro de un perfil de alturas, y el viento es desplazar el ruido con el tiempo.'
  ]);
});
