/* Tema: Letras sin fuentes */
Course.topic('gfx-texto', function (p) {

  p.puente('En [[gfx-curvas]] una estrella era la unión de sus segmentos, y una letra no es otra ' +
    'cosa. Este tema escribe números y palabras con esas distancias, reparte los caracteres en ' +
    '[[gfx-repetir|celdas con floor]] y saca las cifras de un número con el ' +
    '[[ar-naturales|valor posicional]].');

  p.text('Un shader no tiene tipos de letra: no hay <code>print</code>, ni fuentes instaladas, ni una ' +
    'función que escriba «Hola». Y aun así las demos y los juegos escriben marcadores, títulos que ' +
    'brillan y letreros que se desplazan. Lo hacen de dos maneras, las dos matemáticas: dibujando las ' +
    'letras con <strong>distancias a segmentos</strong>, o guardando cada letra dentro de un ' +
    '<strong>número</strong> y leyendo sus bits. La primera tiene un regalo: con la distancia en la ' +
    'mano, el contorno, el brillo y la sombra salen casi gratis.');

  /* ---------------------------------------------------------------- */
  p.section('Siete segmentos: los números del reloj digital');

  p.text('Una cifra de reloj digital son siete trazos que se encienden o no. Se nombran con letras: ' +
    '<strong>a</strong> arriba, <strong>b</strong> y <strong>c</strong> a la derecha de arriba abajo, ' +
    '<strong>d</strong> abajo, <strong>e</strong> y <strong>f</strong> a la izquierda de abajo arriba ' +
    'y <strong>g</strong> el del centro. Cada cifra es una elección de cuáles se encienden, y esa ' +
    'elección cabe en un número de siete bits: el bit 0 dice si se enciende la a, el bit 1 la b, y así ' +
    'hasta el bit 6, la g.');

  p.table(['Cifra', 'Segmentos', 'En binario (g…a)', 'Código'], [
    ['0', 'a b c d e f', '0111111', '63'],
    ['1', 'b c', '0000110', '6'],
    ['2', 'a b d e g', '1011011', '91'],
    ['3', 'a b c d g', '1001111', '79'],
    ['4', 'b c f g', '1100110', '102'],
    ['5', 'a c d f g', '1101101', '109'],
    ['6', 'a c d e f g', '1111101', '125'],
    ['7', 'a b c', '0000111', '7'],
    ['8', 'todos', '1111111', '127'],
    ['9', 'a b c d f g', '1101111', '111']
  ], { num: [3] });

  p.formula('\\text{bit}_k(n) = \\left\\lfloor \\frac{n}{2^k} \\right\\rfloor \\bmod 2',
    'leer un bit sin operadores de bits',
    'Se dice: <em>«el bit k de n es la parte entera de n entre dos elevado a k, módulo dos»</em>. ' +
    'Dividir entre $2^k$ desplaza las cifras binarias $k$ lugares a la derecha, la parte entera tira ' +
    'las que han pasado la coma, y el resto entre 2 se queda con la última.<br><br>' +
    'En GLSL: <code>mod(floor(n / pow(2.0, k)), 2.0)</code>. WebGL 1 no tiene operadores de bits, así ' +
    'que se hace con aritmética. Y la cifra de orden $k$ de un número en base 10 sale igual: ' +
    '<code>mod(floor(x / pow(10.0, k)), 10.0)</code>.');

  p.comprueba('El código del 7 es 7, que en binario es 0000111. ¿Qué segmentos enciende?', [
    { t: 'a, b y c: el de arriba y los dos de la derecha', ok: true, por: 'Los bits encendidos son el 0, el 1 y el 2, y el bit 0 es la a. Leído desde la derecha, 0000111 dice a sí, b sí, c sí, y el resto no.' },
    { t: 'e, f y g', ok: false, por: 'Eso es leer los bits al revés, desde la izquierda. El bit 0 es la cifra binaria de la derecha, la de las unidades.' },
    { t: 'Los siete, porque el código es 7', ok: false, por: 'El número no cuenta segmentos: es una lista de síes y noes escrita en binario. Los siete encendidos son 127.' }
  ]);

  p.demo({
    title: 'Un marcador que cuenta',
    intro: 'Cuatro celdas, cada una con su cifra sacada del contador con floor y mod, y cada cifra dibujada con los segmentos que su código enciende. Los segmentos apagados se ven en rojo muy oscuro, como en un visor de verdad.',
    predice: 'Con velocidad 10, ¿cada cuánto tiempo cambia la cifra de las decenas? ¿Y la de los millares? Piensa en qué potencia de 10 divide al contador.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-texto-1', alto: 260,
        aria: 'Un marcador de cuatro cifras rojas de siete segmentos que cuenta hacia arriba, con los segmentos apagados en rojo oscuro.',
        mandos: [
          { n: 'velocidad', label: 'velocidad (cuentas por segundo)', min: 0.5, max: 60, step: 0.5, value: 10, dec: 1 },
          { n: 'grosor', label: 'grosor', min: 0.02, max: 0.1, step: 0.005, value: 0.05, dec: 3 },
          { n: 'inclinacion', label: 'cursiva', min: 0, max: 0.4, step: 0.01, value: 0.12, dec: 2 }
        ],
        codigo:
          'float sdSegmento(vec2 p, vec2 a, vec2 b)\n' +
          '{\n' +
          '    vec2 pa = p - a, ba = b - a;\n' +
          '    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);\n' +
          '    return length(pa - ba * h);\n' +
          '}\n' +
          '\n' +
          '// un segmento acortado por los dos lados, para que haya hueco en las esquinas\n' +
          'float seg(vec2 p, vec2 a, vec2 b)\n' +
          '{\n' +
          '    vec2 u = normalize(b - a) * 0.07;\n' +
          '    return sdSegmento(p, a + u, b - u);\n' +
          '}\n' +
          '\n' +
          '// bit 0 = a (arriba), 1 = b, 2 = c, 3 = d (abajo), 4 = e, 5 = f, 6 = g (centro)\n' +
          'float codigo(float n)\n' +
          '{\n' +
          '    if (n < 0.5) return 63.0;\n' +
          '    if (n < 1.5) return 6.0;\n' +
          '    if (n < 2.5) return 91.0;\n' +
          '    if (n < 3.5) return 79.0;\n' +
          '    if (n < 4.5) return 102.0;\n' +
          '    if (n < 5.5) return 109.0;\n' +
          '    if (n < 6.5) return 125.0;\n' +
          '    if (n < 7.5) return 7.0;\n' +
          '    if (n < 8.5) return 127.0;\n' +
          '    return 111.0;\n' +
          '}\n' +
          '\n' +
          'float bit(float n, float k) { return mod(floor(n / pow(2.0, k)), 2.0); }\n' +
          '\n' +
          '// distancia a la cifra n, en una caja de 0.5 de ancho y 1 de alto\n' +
          'float cifra(vec2 p, float n)\n' +
          '{\n' +
          '    float c = codigo(n);\n' +
          '    vec2 A = vec2(-0.25, 0.5), B = vec2(0.25, 0.5);\n' +
          '    vec2 C = vec2(-0.25, 0.0), D = vec2(0.25, 0.0);\n' +
          '    vec2 E = vec2(-0.25, -0.5), F = vec2(0.25, -0.5);\n' +
          '    // un segmento apagado se aleja 10 unidades y el min lo ignora\n' +
          '    float d = 10.0;\n' +
          '    d = min(d, seg(p, A, B) + 10.0 * (1.0 - bit(c, 0.0)));   // a\n' +
          '    d = min(d, seg(p, B, D) + 10.0 * (1.0 - bit(c, 1.0)));   // b\n' +
          '    d = min(d, seg(p, D, F) + 10.0 * (1.0 - bit(c, 2.0)));   // c\n' +
          '    d = min(d, seg(p, E, F) + 10.0 * (1.0 - bit(c, 3.0)));   // d\n' +
          '    d = min(d, seg(p, C, E) + 10.0 * (1.0 - bit(c, 4.0)));   // e\n' +
          '    d = min(d, seg(p, A, C) + 10.0 * (1.0 - bit(c, 5.0)));   // f\n' +
          '    d = min(d, seg(p, C, D) + 10.0 * (1.0 - bit(c, 6.0)));   // g\n' +
          '    return d;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    p.x -= inclinacion * p.y;          // cursiva: se inclina el espacio, al reves\n' +
          '    p *= 3.2;                          // cada cifra mide 1 de alto\n' +
          '\n' +
          '    float valor = floor(iTime * velocidad);\n' +
          '    float celda = floor(p.x / 0.8 + 2.0);            // 0, 1, 2, 3 de izquierda a derecha\n' +
          '    vec2 q = vec2(mod(p.x + 1.6, 0.8) - 0.4, p.y);   // posicion dentro de la celda\n' +
          '\n' +
          '    float d = 10.0, todos = 10.0;\n' +
          '    if (celda >= 0.0 && celda <= 3.0) {\n' +
          '        float k = 3.0 - celda;                             // 0 unidades, 1 decenas...\n' +
          '        float n = mod(floor(valor / pow(10.0, k)), 10.0);  // la cifra de orden k\n' +
          '        d = cifra(q, n);\n' +
          '        todos = cifra(q, 8.0);                             // el 8 los enciende todos\n' +
          '    }\n' +
          '\n' +
          '    float trazo = 1.0 - smoothstep(grosor, grosor + 0.02, d);\n' +
          '    float apagado = 1.0 - smoothstep(grosor, grosor + 0.02, todos);\n' +
          '    vec3 c = vec3(0.03, 0.035, 0.05) + vec3(0.1, 0.02, 0.02) * apagado;\n' +
          '    c = mix(c, vec3(1.0, 0.25, 0.15), trazo);\n' +
          '    c += vec3(1.0, 0.2, 0.1) * 0.02 / (d + 0.05);    // resplandor\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'La cursiva resta: <code>p.x -= inclinacion * p.y</code>. Arriba, donde <code>p.y</code> es positivo, cada píxel pregunta a la izquierda de donde está, y por eso la cifra se ve desplazada a la derecha. Es la regla de [[gfx-matrices]]: se transforma la coordenada, y la figura se mueve al revés.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Letras hechas de trazos, y los efectos que regalan');

  p.text('Una letra de palo seco es un puñado de segmentos: la T son dos, la A tres, la M y la E ' +
    'cuatro. Su distancia es el <strong>mínimo</strong> de las distancias a sus segmentos, y la de ' +
    'una palabra, el mínimo de las de sus letras, cada una trasladada a su sitio. Restando un grosor, ' +
    '$d = \\min_i d_i - g$, se tiene una distancia con signo: negativa dentro del trazo y positiva ' +
    'fuera. Y con ese número se hacen todos los efectos de un título:');

  p.table(['Efecto', 'Con la distancia', 'Por qué'], [
    ['Relleno', '<code>1.0 - smoothstep(0.0, 0.01, d)</code>', 'dentro, $d < 0$; el borde suave evita los dientes'],
    ['Contorno', '<code>abs(d - w) &lt; 0.01</code>', 'los puntos a distancia $w$ de la letra forman una línea que la rodea'],
    ['Brillo', '<code>exp(-k * max(d, 0.0))</code>', 'vale 1 en la letra y se apaga al alejarse'],
    ['Sombra', '<code>palabra(p - vec2(s, -s))</code>', 'la misma palabra, preguntada desde otro sitio: sale desplazada $(s, -s)$'],
    ['Ondas', '<code>p.y += a * sin(f * p.x)</code>', 'se tuerce el espacio antes de preguntar, y la letra ondula'],
    ['Negrita', '<code>d - 0.03</code>', 'restar a una distancia infla la figura']
  ]);

  p.demo({
    title: 'Un título con efectos',
    intro: 'La palabra MATE, hecha con trece segmentos. Cada mando enciende un efecto, y todos salen de la misma distancia. Pon todos a cero y súbelos de uno en uno.',
    predice: 'Con la sombra a 0,1, ¿hacia dónde saldrá: abajo a la derecha o arriba a la izquierda? Mira el signo con que entra el desplazamiento en el código.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-texto-2', alto: 300,
        aria: 'La palabra MATE en letras de trazo, con contorno, brillo, sombra, ondas y un bote de cada letra ajustables.',
        mandos: [
          { n: 'contorno', label: 'contorno (distancia)', min: 0, max: 0.15, step: 0.005, value: 0.05, dec: 3 },
          { n: 'brillo', label: 'brillo', min: 0, max: 1.5, step: 0.05, value: 0.6, dec: 2 },
          { n: 'sombra', label: 'sombra', min: 0, max: 0.15, step: 0.005, value: 0.06, dec: 3 },
          { n: 'onda', label: 'ondas', min: 0, max: 0.3, step: 0.01, value: 0, dec: 2 },
          { n: 'salto', label: 'bote de cada letra', min: 0, max: 0.3, step: 0.01, value: 0.1, dec: 2 }
        ],
        codigo:
          'float sdSegmento(vec2 p, vec2 a, vec2 b)\n' +
          '{\n' +
          '    vec2 pa = p - a, ba = b - a;\n' +
          '    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);\n' +
          '    return length(pa - ba * h);\n' +
          '}\n' +
          '\n' +
          '// cada letra cabe en una caja de 0.6 por 1, centrada en el origen\n' +
          'float letraM(vec2 p)\n' +
          '{\n' +
          '    float d = sdSegmento(p, vec2(-0.3, -0.5), vec2(-0.3, 0.5));\n' +
          '    d = min(d, sdSegmento(p, vec2(-0.3, 0.5), vec2(0.0, 0.0)));\n' +
          '    d = min(d, sdSegmento(p, vec2(0.0, 0.0), vec2(0.3, 0.5)));\n' +
          '    return min(d, sdSegmento(p, vec2(0.3, 0.5), vec2(0.3, -0.5)));\n' +
          '}\n' +
          'float letraA(vec2 p)\n' +
          '{\n' +
          '    float d = sdSegmento(p, vec2(-0.3, -0.5), vec2(0.0, 0.5));\n' +
          '    d = min(d, sdSegmento(p, vec2(0.0, 0.5), vec2(0.3, -0.5)));\n' +
          '    return min(d, sdSegmento(p, vec2(-0.17, -0.08), vec2(0.17, -0.08)));\n' +
          '}\n' +
          'float letraT(vec2 p)\n' +
          '{\n' +
          '    return min(sdSegmento(p, vec2(-0.3, 0.5), vec2(0.3, 0.5)),\n' +
          '               sdSegmento(p, vec2(0.0, 0.5), vec2(0.0, -0.5)));\n' +
          '}\n' +
          'float letraE(vec2 p)\n' +
          '{\n' +
          '    float d = sdSegmento(p, vec2(-0.25, -0.5), vec2(-0.25, 0.5));\n' +
          '    d = min(d, sdSegmento(p, vec2(-0.25, 0.5), vec2(0.25, 0.5)));\n' +
          '    d = min(d, sdSegmento(p, vec2(-0.25, 0.0), vec2(0.15, 0.0)));\n' +
          '    return min(d, sdSegmento(p, vec2(-0.25, -0.5), vec2(0.25, -0.5)));\n' +
          '}\n' +
          '\n' +
          'float bote(float i) { return salto * abs(sin(3.0 * iTime - 0.8 * i)); }\n' +
          '\n' +
          '// la palabra: cada letra trasladada a su hueco, y cada una bota con su desfase\n' +
          'float palabra(vec2 p)\n' +
          '{\n' +
          '    float d = letraM(p - vec2(-1.35, bote(0.0)));\n' +
          '    d = min(d, letraA(p - vec2(-0.45, bote(1.0))));\n' +
          '    d = min(d, letraT(p - vec2(0.45, bote(2.0))));\n' +
          '    return min(d, letraE(p - vec2(1.35, bote(3.0))));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = 3.0 * (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    p.y += onda * sin(4.0 * p.x - 3.0 * iTime);    // se tuerce el espacio\n' +
          '\n' +
          '    float g = 0.07;                                 // medio grosor del trazo\n' +
          '    float d = palabra(p) - g;                       // negativa dentro de las letras\n' +
          '    float ds = palabra(p - vec2(sombra, -sombra)) - g;\n' +
          '\n' +
          '    vec3 c = mix(vec3(0.10, 0.08, 0.16), vec3(0.18, 0.11, 0.25), fragCoord.y / iResolution.y);\n' +
          '    c = mix(c, vec3(0.02), 0.65 * (1.0 - smoothstep(0.0, 0.05, ds)) * step(0.001, sombra));\n' +
          '    c += brillo * vec3(1.0, 0.45, 0.8) * exp(-6.0 * max(d, 0.0));\n' +
          '    c = mix(c, vec3(1.0, 0.93, 0.78), 1.0 - smoothstep(0.0, 0.02, d));\n' +
          '    float borde = 1.0 - smoothstep(0.0, 0.02, abs(d - contorno) - 0.012);\n' +
          '    c = mix(c, vec3(0.35, 0.9, 1.0), borde * step(0.001, contorno));\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'La sombra y las ondas no tocan las letras: tocan la pregunta. La sombra evalúa la palabra en <code>p - vec2(s, -s)</code>, y las ondas mueven <code>p.y</code> antes de preguntar. Por eso se combinan con todo lo demás sin reescribir una sola letra.'
      });
    }
  });

  p.comprueba('Se quiere la sombra de la palabra un poco abajo y a la derecha. ¿Qué distancia hay que usar?', [
    { t: 'palabra(p - vec2(0.05, -0.05))', ok: true, por: 'Preguntar en $p - \\vec s$ dibuja la figura trasladada $+\\vec s$: con $\\vec s = (0{,}05, -0{,}05)$, a la derecha y hacia abajo.' },
    { t: 'palabra(p + vec2(0.05, -0.05))', ok: false, por: 'Sumar traslada al revés: la sombra saldría a la izquierda y hacia arriba. Es la misma regla que la de la cursiva.' },
    { t: 'palabra(p) - 0.05', ok: false, por: 'Restar a la distancia no mueve la palabra: la engorda. Eso es la negrita, no la sombra.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Una letra dentro de un número');

  p.text('Dibujar cada letra con segmentos está bien para un título, pero es trabajoso para un abecedario ' +
    'entero. La alternativa es la de las primeras pantallas: una <strong>fuente de mapa de bits</strong>. ' +
    'Cada letra es una rejilla diminuta de píxeles encendidos o apagados, aquí de 3 columnas por 5 filas, ' +
    'y esos 15 síes y noes se guardan como un número. Leer un píxel es leer un bit, con la misma fórmula ' +
    'de los siete segmentos.');

  p.formula('k = x + 3y, \\qquad \\text{encendido}(x, y) = \\left\\lfloor \\frac{n}{2^{\\,x + 3y}} \\right\\rfloor \\bmod 2',
    'el píxel (x, y) de la letra',
    'La columna $x$ va de 0 a 2, de izquierda a derecha, y la fila $y$ de 0 a 4, de abajo arriba. ' +
    'La fila $y$ ocupa los bits $3y$, $3y + 1$ y $3y + 2$, así que el bit del píxel es $x + 3y$.<br><br>' +
    'Por qué 3 × 5 y no 5 × 5: un float de 32 bits solo guarda con exactitud los enteros hasta ' +
    '$2^{24} = 16\\,777\\,216$. Quince bits caben de sobra; veinticinco, no.');

  p.ejemplo({
    title: 'La A en un número',
    enunciado: 'La A de la fuente, de arriba abajo, es <code>.#.</code>, <code>#.#</code>, <code>###</code>, <code>#.#</code> y <code>#.#</code>. Calcular su número y comprobar dos de sus píxeles.',
    pasos: [
      { t: '<strong>Las filas, de abajo arriba.</strong> La fila 0 es <code>#.#</code>, la 1 <code>#.#</code>, la 2 <code>###</code>, la 3 <code>#.#</code> y la 4 <code>.#.</code>. La fila $y$ usa los bits $3y$, $3y + 1$ y $3y + 2$.' },
      { t: '<strong>Los bits encendidos.</strong> Fila 0: bits 0 y 2, que valen $1 + 4 = 5$. Fila 1: bits 3 y 5, $8 + 32 = 40$. Fila 2: bits 6, 7 y 8, $64 + 128 + 256 = 448$. Fila 3: bits 9 y 11, $512 + 2048 = 2560$. Fila 4: solo el bit 13, $8192$.', antes: '¿Qué bits enciende la fila 2, que está entera, y cuánto suman?' },
      { t: '<strong>El número.</strong> $5 + 40 + 448 + 2560 + 8192 = 11\\,245$. La A entera cabe en un float.' },
      { t: '<strong>Un píxel encendido.</strong> El $(1, 2)$, el centro de la barra, es el bit $1 + 3\\cdot 2 = 7$: $\\lfloor 11\\,245 / 128 \\rfloor = 87$, que es impar. Encendido.', antes: '¿Qué bit corresponde al píxel (1, 2)?' },
      { t: '<strong>Un píxel apagado.</strong> El $(1, 1)$, el hueco entre las patas, es el bit 4: $\\lfloor 11\\,245 / 16 \\rfloor = 702$, par. Apagado.' }
    ],
    cierre: 'Con un número por letra y la fórmula del bit se escribe cualquier texto. Así funcionan los letreros de puntos luminosos y así escribían las primeras consolas.'
  });

  p.demo({
    title: 'Un letrero luminoso',
    intro: 'MATEBASE con la fuente de 3 × 5: ocho números, uno por letra. Cada píxel de letra se dibuja como un LED redondo, y el letrero se desplaza sumando al número de columna un contador del tiempo.',
    predice: 'Los tres bits más bajos del número de la E, 29 391, son su fila de abajo. ¿Cuántos LED tiene encendidos esa fila? Calcula 29 391 mod 8 antes de mirar.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-texto-3', alto: 220,
        aria: 'Un letrero de LED ámbar con la palabra MATEBASE en letras de puntos que se desplaza de derecha a izquierda.',
        mandos: [
          { n: 'tamano', label: 'tamaño del LED (píxeles)', min: 6, max: 24, step: 1, value: 12, dec: 0 },
          { n: 'velocidad', label: 'velocidad (columnas por segundo)', min: 0, max: 12, step: 0.5, value: 5, dec: 1 }
        ],
        codigo:
          '// la fuente: cada letra de 3 x 5 guardada en 15 bits, bit k = x + 3y\n' +
          'float glifo(float i)\n' +
          '{\n' +
          '    if (i < 0.5) return 24557.0;   // M\n' +
          '    if (i < 1.5) return 11245.0;   // A\n' +
          '    if (i < 2.5) return 29842.0;   // T\n' +
          '    if (i < 3.5) return 29391.0;   // E\n' +
          '    if (i < 4.5) return 15083.0;   // B\n' +
          '    if (i < 5.5) return 11245.0;   // A\n' +
          '    if (i < 6.5) return 25251.0;   // S\n' +
          '    return 29391.0;                // E\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    // 40 columnas: 8 letras de 4 (3 y un hueco) y 8 de separacion\n' +
          '    vec2 origen = 0.5 * iResolution.xy - 0.5 * tamano * vec2(40.0, 5.0);\n' +
          '    vec2 g = floor((fragCoord - origen) / tamano);          // pixel de letra\n' +
          '    float col = mod(g.x + floor(iTime * velocidad), 40.0);  // el letrero corre\n' +
          '    float i = floor(col / 4.0);                             // que letra\n' +
          '    float x = col - 4.0 * i;                                // columna en la letra\n' +
          '    float y = g.y;                                          // fila, desde abajo\n' +
          '\n' +
          '    float enc = 0.0;\n' +
          '    bool ventana = g.x >= 0.0 && g.x < 40.0 && y >= 0.0 && y < 5.0;\n' +
          '    if (ventana && i < 8.0 && x < 3.0) {\n' +
          '        enc = mod(floor(glifo(i) / pow(2.0, x + 3.0 * y)), 2.0);   // el bit\n' +
          '    }\n' +
          '\n' +
          '    // cada pixel de letra, un LED redondo\n' +
          '    vec2 local = fract((fragCoord - origen) / tamano) - 0.5;\n' +
          '    float led = 1.0 - smoothstep(0.32, 0.42, length(local));\n' +
          '    vec3 c = vec3(0.02, 0.02, 0.03);\n' +
          '    if (ventana) c += vec3(0.08, 0.045, 0.02) * led;        // LED apagados\n' +
          '    c = mix(c, vec3(1.0, 0.72, 0.2), enc * led);            // LED encendidos\n' +
          '    c += vec3(1.0, 0.5, 0.1) * 0.25 * enc * (1.0 - led);    // su halo\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Con <code>tamano</code> a 6 los LED se juntan y el letrero parece escrito con una fuente normal de píxeles, que es exactamente lo que es.'
      });
    }
  });

  p.util('El texto por distancias es como se escribe hoy en muchos videojuegos: en 2007, Chris Green, de ' +
    'Valve, mostró que guardando en una textura la distancia a los bordes de cada letra, en vez de la ' +
    'letra misma, se consiguen textos nítidos a cualquier tamaño y contornos, brillos y sombras por el ' +
    'coste de un <code>smoothstep</code>. Los siete segmentos siguen en microondas, surtidores de ' +
    'gasolina y marcadores deportivos, y las fuentes de bits, en los letreros de autobús y en las ' +
    'pantallas diminutas de cualquier aparato.');

  p.hist('La idea de formar cifras con segmentos aparece ya en patentes de principios del siglo XX, pero se ' +
    'hizo ubicua en los años setenta, con las calculadoras de bolsillo y los relojes de LED y de cristal ' +
    'líquido. Las fuentes de mapa de bits son tan viejas como las pantallas: los primeros ordenadores ' +
    'personales guardaban cada letra en una memoria de solo lectura, unos pocos bytes por carácter, y la ' +
    'demoscene heredó la costumbre de meter un abecedario entero en unos cientos de bytes.');

  p.trampas([
    { e: 'Mover una letra sumando el desplazamiento a p', por: '<code>letra(p + vec2(0.5, 0.0))</code> la dibuja a la <em>izquierda</em>. Para llevarla a $(0{,}5, 0)$ se pregunta en <code>p - vec2(0.5, 0.0)</code>.' },
    { e: 'Leer las cifras de un número de izquierda a derecha', por: 'En <code>mod(floor(x / pow(10.0, k)), 10.0)</code>, $k = 0$ es la cifra de las unidades, la de la derecha. Con 5 821, $k = 0$ da 1, no 5.' },
    { e: 'Leer los bits del código desde la izquierda', por: 'El bit 0 es la última cifra binaria. El 7 es 0000111: se encienden a, b y c, no e, f y g.' },
    { e: 'Guardar una letra de 5 × 5 en un float', por: 'Harían falta 25 bits, y un float de 32 bits solo representa con exactitud los enteros hasta $2^{24}$: el último bit se pierde y aparecen píxeles cambiados. Con 3 × 5 hay 15 bits.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var ORDENES = ['unidades', 'decenas', 'centenas', 'millares'];

  p.exercise({
    title: 'La cifra que toca',
    level: 'basico',
    gen: function (r) {
      var x = r.int(1000, 99999), k = r.int(0, 3);
      var cifra = Math.floor(x / Math.pow(10, k)) % 10;
      var s = String(x), izq = +s.charAt(k);
      return { x: x, k: k, cifra: cifra, izq: izq, orden: ORDENES[k] };
    },
    ask: function (d) {
      return 'Un marcador guarda <code>x = ' + d.x + '.0</code>. ¿Qué cifra dibuja la celda que calcula ' +
        '<code>mod(floor(x / pow(10.0, k)), 10.0)</code> con <code>k = ' + d.k + '.0</code>? ¿Y de qué orden es?';
    },
    fields: [
      { name: 'c', label: 'cifra', w: 'tiny' },
      { name: 'o', label: 'es la de las', opts: ORDENES.map(function (o) { return { t: o, v: o }; }) }
    ],
    sol: function (d) { return { c: d.cifra, o: d.orden }; },
    errores: [{
      si: function (v, d) { return d.izq !== d.cifra && v.c === d.izq; },
      msg: 'Esa es la cifra número ' + '$k$ contando desde la izquierda. Dividir entre $10^k$ quita las $k$ cifras de la <strong>derecha</strong>, y el resto entre 10 se queda con la última que queda.'
    }],
    hint: function (d) { return ['Primero la división y la parte entera: ¿qué queda de ' + d.x + ' al quitarle ' + d.k + ' cifras por la derecha?', 'Luego el resto entre 10: la última cifra de lo que quedó.']; },
    steps: function (d) {
      var q = Math.floor(d.x / Math.pow(10, d.k));
      return ['$\\lfloor ' + d.x + ' / 10^{' + d.k + '} \\rfloor = ' + q + '$: se han ido las ' + d.k + ' cifras de la derecha.',
        '$' + q + ' \\bmod 10 = ' + d.cifra + '$.',
        'Con $k = ' + d.k + '$ sale la cifra de las <strong>' + d.orden + '</strong>.'];
    },
    answer: function (d) { return d.cifra + ', la de las ' + d.orden; }
  });

  var CODIGOS = [63, 6, 91, 79, 102, 109, 125, 7, 127, 111];
  var SEGMENTOS = ['a, el de arriba', 'b, arriba a la derecha', 'c, abajo a la derecha', 'd, el de abajo',
    'e, abajo a la izquierda', 'f, arriba a la izquierda', 'g, el del centro'];

  p.exercise({
    title: '¿Está encendido el segmento?',
    level: 'medio',
    gen: function (r) {
      var n = r.int(0, 9), k = r.int(0, 6), c = CODIGOS[n];
      var q = Math.floor(c / Math.pow(2, k));
      return { n: n, k: k, c: c, q: q, on: q % 2 === 1 ? 'encendido' : 'apagado', mal: k > 1 ? Math.floor(c / (2 * k)) : -1 };
    },
    ask: function (d) {
      return 'En el marcador, la cifra ' + d.n + ' tiene el código <code>' + d.c + '.0</code>, y el segmento <strong>' +
        SEGMENTOS[d.k] + '</strong> es el bit <code>k = ' + d.k + '</code>. ¿Cuánto vale <code>floor(codigo / pow(2.0, k))</code>, ' +
        'y el segmento está encendido o apagado?';
    },
    fields: [
      { name: 'q', label: 'floor(código / 2^k)', w: 'tiny' },
      { name: 'e', label: 'el segmento está', opts: [{ t: 'encendido', v: 'encendido' }, { t: 'apagado', v: 'apagado' }] }
    ],
    sol: function (d) { return { q: d.q, e: d.on }; },
    errores: [{
      si: function (v, d) { return d.mal >= 0 && d.mal !== d.q && v.q === d.mal; },
      msg: 'Se divide entre $2^k$, una potencia, no entre $2k$: con $k = 3$ es entre 8, no entre 6.'
    }],
    hint: function (d) { return ['$2^{' + d.k + '} = ' + Math.pow(2, d.k) + '$.', 'Si el cociente es impar, el bit vale 1 y el segmento está encendido.']; },
    steps: function (d) {
      var bin = ('0000000' + d.c.toString(2)).slice(-7);
      return ['$' + d.c + '$ en binario es <code>' + bin + '</code>, y el bit ' + d.k + ' es la cifra ' + (d.k + 1) + ' contando desde la derecha.',
        '$\\lfloor ' + d.c + ' / ' + Math.pow(2, d.k) + ' \\rfloor = ' + d.q + '$, que es ' + (d.q % 2 ? 'impar' : 'par') + ': el bit vale ' + (d.q % 2) + '.',
        'El segmento está <strong>' + d.on + '</strong>.'];
    },
    answer: function (d) { return d.q + ', ' + d.on; }
  });

  var LETRAS = [
    { l: 'M', n: 24557, f: ['#.#', '###', '###', '#.#', '#.#'] },
    { l: 'A', n: 11245, f: ['.#.', '#.#', '###', '#.#', '#.#'] },
    { l: 'T', n: 29842, f: ['###', '.#.', '.#.', '.#.', '.#.'] },
    { l: 'E', n: 29391, f: ['###', '#..', '##.', '#..', '###'] },
    { l: 'B', n: 15083, f: ['##.', '#.#', '##.', '#.#', '##.'] },
    { l: 'S', n: 25251, f: ['.##', '#..', '.#.', '..#', '##.'] }
  ];

  p.exercise({
    title: 'Un píxel de la letra',
    level: 'medio',
    gen: function (r) {
      var L = r.pick(LETRAS), x = r.int(0, 2), y = r.int(0, 4);
      var k = x + 3 * y;
      var on = Math.floor(L.n / Math.pow(2, k)) % 2 === 1;
      return { L: L, x: x, y: y, k: k, e: on ? 'encendido' : 'apagado', kCruzado: 3 * x + y, kArriba: x + 3 * (4 - y) };
    },
    ask: function (d) {
      return 'En la fuente de 3 × 5 del tema, la <strong>' + d.L.l + '</strong> se guarda como <code>' + d.L.n + '.0</code>. ' +
        'El píxel de la columna $x$ (de 0 a 2, de izquierda a derecha) y la fila $y$ (de 0 a 4, de abajo arriba) es el bit ' +
        '$k = x + 3y$. Para el píxel $(x, y) = (' + d.x + ', ' + d.y + ')$, ¿qué bit es y está encendido?';
    },
    fields: [
      { name: 'k', label: 'k', w: 'tiny' },
      { name: 'e', label: 'el píxel está', opts: [{ t: 'encendido', v: 'encendido' }, { t: 'apagado', v: 'apagado' }] }
    ],
    sol: function (d) { return { k: d.k, e: d.e }; },
    errores: [
      { si: function (v, d) { return d.kCruzado !== d.k && v.k === d.kCruzado; }, msg: 'Están cruzados: cada fila tiene 3 píxeles, así que lo que se multiplica por 3 es la fila, $k = x + 3y$.' },
      { si: function (v, d) { return d.kArriba !== d.k && d.kArriba !== d.kCruzado && v.k === d.kArriba; }, msg: 'Las filas se cuentan desde abajo: la fila 0 es la de abajo, como en <code>fragCoord</code>.' }
    ],
    hint: function () { return ['$k = x + 3y$.', 'Divide el número entre $2^k$, quédate con la parte entera y mira si es par o impar.']; },
    steps: function (d) {
      var q = Math.floor(d.L.n / Math.pow(2, d.k));
      return ['$k = ' + d.x + ' + 3\\cdot ' + d.y + ' = ' + d.k + '$.',
        '$\\lfloor ' + d.L.n + ' / 2^{' + d.k + '} \\rfloor = ' + q + '$, ' + (q % 2 ? 'impar' : 'par') + ': el píxel está <strong>' + d.e + '</strong>.',
        'Se ve en el dibujo de la letra, fila ' + d.y + ' contando desde abajo: <code>' + d.L.f[4 - d.y] + '</code>.'];
    },
    answer: function (d) { return 'k = ' + d.k + ', ' + d.e; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float d = palabra(p) - 0.07;\nfloat v = 1.0 - smoothstep(0.0, 0.02, abs(d) - 0.01);',
          o: ['Las letras huecas: solo una línea fina sobre su borde', 'Las letras rellenas', 'Las letras con un resplandor', 'Todo blanco salvo las letras'],
          por: '<code>abs(d)</code> es la distancia al borde de la letra, por dentro y por fuera. Solo es menor que 0,01 muy cerca del borde: una línea.' },
        { c: 'float d = palabra(p) - 0.07;\nfloat v = exp(-8.0 * max(d, 0.0));',
          o: ['Letras blancas con un resplandor que se apaga al alejarse', 'Letras con el borde duro y nada alrededor', 'Solo el contorno de las letras', 'Letras negras sobre blanco'],
          por: 'Dentro, $d < 0$ y el <code>max</code> da 0: vale 1. Fuera, la exponencial cae con la distancia: un halo.' },
        { c: 'float s = palabra(p - vec2(0.06, -0.06)) - 0.07;\nfloat v = 1.0 - smoothstep(0.0, 0.02, s);',
          o: ['La palabra desplazada un poco abajo y a la derecha', 'La palabra desplazada arriba y a la izquierda', 'La palabra más gorda', 'La palabra más pequeña'],
          por: 'Preguntar en $p - \\vec s$ dibuja la figura en $+\\vec s$: a la derecha y abajo. Usada debajo de las letras, es su sombra.' },
        { c: 'p.y += 0.1 * sin(5.0 * p.x);\nfloat d = palabra(p) - 0.07;',
          o: ['Las letras ondulan arriba y abajo, como una bandera', 'Las letras se inclinan', 'Las letras se estiran a lo ancho', 'Las letras no cambian'],
          por: 'Cada columna pregunta a una altura desplazada por un seno de su $x$: las letras se curvan en ondas.' },
        { c: 'p.x -= 0.3 * p.y;\nfloat d = palabra(p) - 0.07;',
          o: ['Letras en cursiva, con la parte de arriba hacia la derecha', 'Letras en cursiva, con la parte de arriba hacia la izquierda', 'Letras ondulantes', 'Letras giradas 90°'],
          por: 'Arriba, $p_y > 0$ y cada píxel pregunta más a la izquierda: la figura se ve desplazada hacia la derecha cuanto más arriba. Cursiva normal.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'Con <code>palabra(p)</code> la distancia a los trazos de una palabra y el color final <code>vec3(v)</code> (o el de las letras en <code>d</code>), ¿qué se ve?' +
        '<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Se toca la distancia, o la coordenada antes de preguntar? Lo segundo mueve o deforma las letras; lo primero cambia cómo se pintan.']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe el efecto',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'la letra <strong>rellena</strong>, con un borde suave de 0,01', ref: '1.0 - smoothstep(0.0, 0.01, d)' },
        { pide: 'solo el <strong>contorno</strong>: una línea de medio grosor 0,01 centrada en el borde de la letra', ref: '1.0 - smoothstep(0.0, 0.01, abs(d) - 0.01)' },
        { pide: 'un <strong>brillo</strong>: 1 dentro de la letra, y fuera <code>exp(-10·d)</code>', ref: 'exp(-10.0 * max(d, 0.0))' },
        { pide: 'la <strong>sombra</strong>: la letra rellena, con borde de 0,01, desplazada a $(0{,}05,\\ -0{,}05)$', ref: '1.0 - smoothstep(0.0, 0.01, letra(p - vec2(0.05, -0.05)))' },
        { pide: 'la letra en <strong>negrita</strong>: rellena, con borde de 0,01, e inflada 0,03', ref: '1.0 - smoothstep(0.0, 0.01, d - 0.03)' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa para dibujar ' + d.pide + ':<br>' +
        '<pre class="shd__mini">// letra(q): distancia con signo a una T, negativa dentro\nvec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\nfloat d = letra(p);\nfloat v = <strong>???</strong> ;\ncolor = vec4(vec3(v), 1.0);</pre>';
    },
    fields: [{ name: 'v', label: 'el efecto', w: 'wide' }],
    sol: function (d) { return { v: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.v || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'float sdSegmento(vec2 p, vec2 a, vec2 b){\n' +
          '  vec2 pa = p - a, ba = b - a;\n' +
          '  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);\n' +
          '  return length(pa - ba * h);\n}\n' +
          'float letra(vec2 q){\n' +
          '  return min(sdSegmento(q, vec2(-0.28, 0.3), vec2(0.28, 0.3)),\n' +
          '             sdSegmento(q, vec2(0.0, 0.3), vec2(0.0, -0.32))) - 0.06;\n}\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '  float d = letra(p);\n' +
          '  float v = ' + x + ';\n' +
          '  color = vec4(vec3(clamp(v, 0.0, 1.0)), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 64, tol: 6 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado es un <code>float</code>, los números llevan punto decimal y la función de la letra se llama <code>letra</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero no dibuja lo pedido. ¿Hay que tocar la distancia (relleno, contorno, brillo, negrita) o la coordenada con que se pregunta (sombra)?' };
      }
      return { ok: true };
    },
    hint: function () { return 'Todo sale de <code>d</code>: negativa dentro, cero en el borde, positiva fuera. <code>smoothstep</code> la convierte en máscara, <code>abs</code> se queda con el borde y <code>exp</code> con un brillo.'; },
    steps: function (d) { return ['Se pedía ' + d.pide + '.', 'Una respuesta: <code>' + d.ref + '</code>.', 'El corrector compara las imágenes, así que valen formas equivalentes.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Un shader escribe sin fuentes: o dibuja cada letra como la unión de sus segmentos, o guarda cada letra en un número y lee sus bits.',
    'Sin operadores de bits, el bit $k$ de $n$ es <code>mod(floor(n / pow(2.0, k)), 2.0)</code>, y la cifra decimal de orden $k$, <code>mod(floor(x / pow(10.0, k)), 10.0)</code>.',
    'Una cifra de siete segmentos es un código de 7 bits; una letra de 3 × 5, uno de 15, que cabe exacto en un float.',
    'Con la distancia con signo a las letras, el relleno es un <code>smoothstep</code>, el contorno un <code>abs</code>, el brillo una exponencial y la negrita una resta.',
    'La sombra, las ondas y la cursiva no tocan las letras: cambian la coordenada con que se pregunta, y por eso la figura se mueve al revés.'
  ]);
});
