/* Tema: Filtros de cámara */
Course.topic('gfx-filtros', function (p) {

  p.puente('[[gfx-post|La última pasada]] retocaba una imagen que había calculado el propio shader. ' +
    'Este tema trabaja sobre una imagen de verdad: una foto o tu cámara. Vuelven la ' +
    '[[cib-filtrado|media móvil]], ahora en dos dimensiones, las [[gfx-derivadas|derivadas por ' +
    'diferencias]], que aquí encuentran los bordes, y la [[gfx-color|luminancia]].');

  p.text('Los filtros de una aplicación de fotos parecen magia, y no lo son: cada uno es un programa ' +
    'que se ejecuta una vez por píxel, <strong>lee la foto</strong> en ese punto, a veces también en ' +
    'los de alrededor, y devuelve otro color. Es exactamente un fragment shader, y en la mayoría de ' +
    'los móviles se ejecuta literalmente así, en la tarjeta gráfica, a treinta imágenes por segundo.');

  /* ---------------------------------------------------------------- */
  p.section('La imagen es una función');

  p.text('En los visores de este tema hay una imagen esperando en <code>iChannel1</code>: una foto que ' +
    'pinta el propio curso, con un cartel de letras, colores y grises para ver bien qué hace cada ' +
    'filtro. Con el botón <strong>Usar la cámara</strong> se cambia por la imagen de tu cámara. Esa ' +
    'imagen no sale de tu ordenador: se procesa en la tarjeta gráfica y ahí se queda.');

  p.formula('\\text{color} = \\text{foto}(u, v), \\qquad (u, v) \\in [0, 1]^2',
    'la foto como función',
    'Una imagen es una función que a cada punto del cuadrado unidad le asigna un color. En GLSL se ' +
    'evalúa con <code>texture2D(iChannel1, uv).rgb</code>: $(0, 0)$ es la esquina de abajo a la ' +
    'izquierda y $(1, 1)$ la de arriba a la derecha, sea cual sea el tamaño en píxeles.<br><br>' +
    'El lienzo no suele tener la misma proporción que la foto. Para no deformarla se escala hasta ' +
    'cubrirlo y se recorta lo que sobra; el tamaño de la foto está en ' +
    '<code>iChannelResolution[1].xy</code>.');

  p.text('Con la foto en la mano, un filtro de <strong>un solo píxel</strong> es una función del color: ' +
    'entra una terna de números y sale otra. Casi todos los ajustes de una aplicación de fotos son de ' +
    'este tipo, y ya los conoces de [[gfx-color]]:');

  p.table(['Ajuste', 'Operación', 'Qué hace'], [
    ['Exposición', '<code>c * k</code>', 'aclara u oscurece todo en la misma proporción'],
    ['Contraste', '<code>(c - 0.5) * k + 0.5</code>', 'aleja cada canal del gris medio, o lo acerca'],
    ['Saturación', '<code>mix(vec3(gris), c, k)</code>', 'mezcla el color con su propio gris; con <code>k</code> > 1 exagera'],
    ['Temperatura', '<code>c * vec3(1.0 + t, 1.0, 1.0 - t)</code>', 'más rojo y menos azul (cálida), o al revés'],
    ['Umbral', '<code>vec3(step(0.5, gris))</code>', 'solo blanco o negro, sin grises'],
    ['Posterizado', '<code>floor(c * n) / n</code>', 'pocos niveles por canal, como un cartel serigrafiado']
  ]);

  p.demo({
    title: 'La mesa de revelado',
    intro: 'A la izquierda de la raya, la foto tal cual; a la derecha, con los cuatro ajustes. Haz clic en la imagen para mover la raya. Prueba después con tu cámara.',
    predice: 'Pon la saturación a 0 y el contraste a 1: ¿los seis colores del cartel quedarán en seis grises iguales o distintos? ¿Cuál será el más claro? Piensa en los pesos de la luminancia.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-filtros-1', alto: 340, imagen: true,
        aria: 'Una foto de un paisaje con un cartel de colores, partida en dos: a un lado la original y al otro con exposición, contraste, saturación y temperatura ajustables.',
        mandos: [
          { n: 'exposicion', label: 'exposición', min: 0.2, max: 2, step: 0.01, value: 1.0, dec: 2 },
          { n: 'contraste', label: 'contraste', min: 0, max: 2, step: 0.01, value: 1.25, dec: 2 },
          { n: 'saturacion', label: 'saturación', min: 0, max: 2, step: 0.01, value: 1.3, dec: 2 },
          { n: 'temperatura', label: 'temperatura', min: -0.3, max: 0.3, step: 0.01, value: 0.08, dec: 2 }
        ],
        codigo:
          '// escala la foto hasta cubrir el lienzo sin deformarla\n' +
          'vec2 cubre(vec2 fc)\n' +
          '{\n' +
          '    vec2 r = iResolution.xy, t = iChannelResolution[1].xy;\n' +
          '    float s = max(r.x / t.x, r.y / t.y);\n' +
          '    return (fc - 0.5 * r) / (s * t) + 0.5;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec3 c = texture2D(iChannel1, cubre(fragCoord)).rgb;\n' +
          '    vec3 antes = c;\n' +
          '\n' +
          '    c *= exposicion;                                  // 1. exposicion\n' +
          '    c = (c - 0.5) * contraste + 0.5;                  // 2. contraste\n' +
          '    float gris = dot(c, vec3(0.2126, 0.7152, 0.0722));\n' +
          '    c = mix(vec3(gris), c, saturacion);               // 3. saturacion\n' +
          '    c *= vec3(1.0 + temperatura, 1.0, 1.0 - temperatura);   // 4. temperatura\n' +
          '    c = clamp(c, 0.0, 1.0);\n' +
          '\n' +
          '    // a la izquierda de la raya, la foto sin tocar\n' +
          '    float corte = iMouse.x > 0.0 ? iMouse.x : 0.5 * iResolution.x;\n' +
          '    c = mix(antes, c, step(corte, fragCoord.x));\n' +
          '    c *= smoothstep(0.0, 1.5, abs(fragCoord.x - corte));\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'El orden importa: si la saturación se aplicara antes que el contraste, el contraste volvería a separar los canales y la imagen recuperaría algo de color.'
      });
    }
  });

  p.text('Hay una familia de filtros de color que no cabe en la tabla: los que <strong>rehacen cada ' +
    'canal a partir de los tres</strong>. El sepia, por ejemplo, calcula el rojo nuevo con un poco de ' +
    'rojo, mucho verde y algo de azul, y lo mismo el verde y el azul con otras proporciones. Eso es ' +
    'multiplicar el color por una matriz, y es otra vez la aplicación lineal de [[gfx-matrices]]:');

  p.formula('\\begin{pmatrix} r\' \\\\ g\' \\\\ b\' \\end{pmatrix} = ' +
    '\\begin{pmatrix} 0{,}393 & 0{,}769 & 0{,}189 \\\\ 0{,}349 & 0{,}686 & 0{,}168 \\\\ 0{,}272 & 0{,}534 & 0{,}131 \\end{pmatrix}' +
    '\\begin{pmatrix} r \\\\ g \\\\ b \\end{pmatrix}',
    'el filtro sepia',
    'Cada fila da un canal de salida: $r\' = 0{,}393\\,r + 0{,}769\\,g + 0{,}189\\,b$. Las tres filas ' +
    'pesan el verde más que nada, como la luminancia, y la primera suma más que la tercera: por eso ' +
    'sale un gris cálido, como el de una foto vieja.<br><br>' +
    'En GLSL, <code>mat3</code> se rellena <strong>por columnas</strong>. Si se escriben los nueve ' +
    'números fila a fila, lo que queda guardado es la traspuesta, y hay que multiplicar por la ' +
    'derecha: <code>c * sepia</code>.');

  p.comprueba('Se escribe <code>mat3 sepia = mat3(0.393, 0.769, 0.189, 0.349, 0.686, 0.168, 0.272, 0.534, 0.131);</code> copiando la matriz fila a fila. ¿Cómo se aplica a <code>c</code>?', [
    { t: 'c * sepia: mat3 guarda por columnas, y multiplicar por la derecha usa esas columnas como filas', ok: true, por: '<code>v * m</code> es la traspuesta de <code>m</code> por <code>v</code>. Como las filas se han escrito donde GLSL pone las columnas, la traspuesta devuelve la matriz del papel.' },
    { t: 'sepia * c, que es como se escribe en el papel', ok: false, por: 'Así se aplicaría la traspuesta de la matriz del papel: el rojo nuevo saldría con los pesos de la primera columna, 0,393, 0,349 y 0,272, y el tono cambiaría.' },
    { t: 'Da igual el orden: las dos multiplicaciones dan lo mismo', ok: false, por: 'Solo si la matriz fuera simétrica. La del sepia no lo es: su 0,769 y su 0,349 están en posiciones traspuestas.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Mirar a los vecinos: la convolución');

  p.text('Desenfocar, enfocar o encontrar los bordes no se puede hacer mirando un solo píxel: hace falta ' +
    'saber qué hay alrededor. La idea es la de la [[cib-filtrado|media móvil]], que suavizaba una ' +
    'señal promediando sus últimos valores, llevada a dos dimensiones: cada píxel se sustituye por una ' +
    '<strong>suma ponderada de sus vecinos</strong>. Los pesos se escriben en una tablita de 3 × 3, el ' +
    '<strong>núcleo</strong>, y la operación se llama <strong>convolución</strong>.');

  p.formula('g(x, y) = \\sum_{i=-1}^{1}\\sum_{j=-1}^{1} K_{ij}\\; f(x + i,\\ y + j)',
    'convolución con un núcleo de 3 × 3',
    'Se dice: <em>«el valor nuevo es la suma, para los nueve vecinos, del peso de cada vecino por su ' +
    'valor»</em>. $f$ es la imagen, $K$ el núcleo y $g$ el resultado.<br><br>' +
    'En el shader, «el vecino de la derecha» está a un píxel <strong>de la imagen</strong>, que en ' +
    'coordenadas de 0 a 1 mide <code>1.0 / iChannelResolution[1].xy</code>, y no a un píxel del lienzo.');

  p.table(['Núcleo', 'Pesos', 'Suman', 'Qué hace'], [
    ['Caja', '$\\frac{1}{9}\\begin{pmatrix}1&1&1\\\\1&1&1\\\\1&1&1\\end{pmatrix}$', '1', 'promedio de los nueve: desenfoque'],
    ['Gauss', '$\\frac{1}{16}\\begin{pmatrix}1&2&1\\\\2&4&2\\\\1&2&1\\end{pmatrix}$', '1', 'desenfoque más suave, que pesa más lo cercano'],
    ['Nitidez', '$\\begin{pmatrix}0&-1&0\\\\-1&5&-1\\\\0&-1&0\\end{pmatrix}$', '1', 'resta a cada píxel sus vecinos: exagera las diferencias'],
    ['Bordes (Sobel)', '$\\begin{pmatrix}-1&0&1\\\\-2&0&2\\\\-1&0&1\\end{pmatrix}$', '0', 'derecha menos izquierda: se enciende donde hay un cambio']
  ]);

  p.text('La columna «Suman» es la que lo explica todo. En una zona lisa, donde los nueve vecinos valen ' +
    'lo mismo, el resultado es ese valor multiplicado por la suma de los pesos. Si suman 1, lo liso ' +
    'queda igual y solo cambian los detalles: es un filtro que <strong>conserva el brillo</strong>. Si ' +
    'suman 0, lo liso se vuelve negro y solo sobrevive lo que cambia: el de Sobel es una ' +
    '[[gfx-derivadas|derivada por diferencias]], con los vecinos de arriba y de abajo añadidos para ' +
    'que el ruido le afecte menos.');

  p.demo({
    title: 'El taller de núcleos',
    intro: 'El mismo bucle de nueve lecturas con cinco núcleos distintos. «Radio» separa los vecinos: con radio 3 el vecino está a tres píxeles de la foto, y el efecto se nota más. «Mezcla» vuelve poco a poco a la foto original.',
    predice: 'Con el núcleo de bordes (3), ¿qué quedará del cielo, que es un degradado suave: blanco, negro o su propio color? Suma los pesos antes de mirar.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-filtros-2', alto: 340, imagen: true,
        aria: 'La foto del paisaje filtrada con un núcleo de convolución que se elige con un mando: desenfoque de caja, gaussiano, nitidez, bordes y relieve.',
        mandos: [
          { n: 'nucleo', label: 'núcleo: 0 caja · 1 Gauss · 2 nitidez · 3 bordes · 4 relieve', min: 0, max: 4, step: 1, value: 3, dec: 0 },
          { n: 'radio', label: 'radio (píxeles de la foto)', min: 1, max: 6, step: 0.5, value: 1.5, dec: 1 },
          { n: 'mezcla', label: 'mezcla con el filtro', min: 0, max: 1, step: 0.01, value: 1, dec: 2 }
        ],
        codigo:
          'vec2 cubre(vec2 fc)\n' +
          '{\n' +
          '    vec2 r = iResolution.xy, t = iChannelResolution[1].xy;\n' +
          '    float s = max(r.x / t.x, r.y / t.y);\n' +
          '    return (fc - 0.5 * r) / (s * t) + 0.5;\n' +
          '}\n' +
          '\n' +
          '// k[i][j] es el peso del vecino (i - 1, j - 1): columna i, fila j\n' +
          'mat3 elige(float n)\n' +
          '{\n' +
          '    if (n < 0.5) return mat3(vec3(1.0), vec3(1.0), vec3(1.0)) / 9.0;             // caja\n' +
          '    if (n < 1.5) return mat3(1.0, 2.0, 1.0, 2.0, 4.0, 2.0, 1.0, 2.0, 1.0) / 16.0;  // Gauss\n' +
          '    if (n < 2.5) return mat3(0.0, -1.0, 0.0, -1.0, 5.0, -1.0, 0.0, -1.0, 0.0);     // nitidez\n' +
          '    if (n < 3.5) return mat3(-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);      // Sobel\n' +
          '    return mat3(-2.0, -1.0, 0.0, -1.0, 1.0, 1.0, 0.0, 1.0, 2.0);                   // relieve\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = cubre(fragCoord);\n' +
          '    vec2 paso = radio / iChannelResolution[1].xy;    // en pixeles de la foto\n' +
          '    mat3 k = elige(nucleo);\n' +
          '\n' +
          '    vec3 suma = vec3(0.0);\n' +
          '    for (int i = 0; i < 3; i++) {\n' +
          '        for (int j = 0; j < 3; j++) {\n' +
          '            vec2 desp = vec2(float(i) - 1.0, float(j) - 1.0) * paso;\n' +
          '            suma += k[i][j] * texture2D(iChannel1, uv + desp).rgb;\n' +
          '        }\n' +
          '    }\n' +
          '\n' +
          '    // en los bordes importa cuanto cambia, no hacia donde\n' +
          '    if (nucleo > 2.5 && nucleo < 3.5) suma = abs(suma) * 2.0;\n' +
          '\n' +
          '    vec3 foto = texture2D(iChannel1, uv).rgb;\n' +
          '    color = vec4(clamp(mix(foto, suma, mezcla), 0.0, 1.0), 1.0);\n' +
          '}\n',
        nota: 'Este Sobel solo ve los bordes <strong>verticales</strong>, porque resta derecha menos izquierda: el horizonte del lago casi desaparece. Los horizontales salen con el mismo núcleo girado, y un detector completo combina los dos con <code>length(vec2(gx, gy))</code>. El relieve (4) suma 1 pero pesa distinto cada lado: parece que la foto esté estampada en metal.'
      });
    }
  });

  p.ejemplo({
    title: 'Cuatro núcleos sobre nueve números',
    enunciado: 'Una zona de la foto en gris tiene un borde vertical: las dos columnas de la izquierda valen $0{,}2$ y la de la derecha, $0{,}8$. Calcular el valor nuevo del píxel central con los núcleos de caja, de Gauss, de Sobel y de nitidez.',
    pasos: [
      { t: '<strong>La vecindad.</strong> $\\begin{pmatrix}0{,}2 & 0{,}2 & 0{,}8\\\\0{,}2 & 0{,}2 & 0{,}8\\\\0{,}2 & 0{,}2 & 0{,}8\\end{pmatrix}$, con el píxel central en $0{,}2$ y su vecino de la derecha en $0{,}8$.' },
      { t: '<strong>Caja.</strong> Seis veces $0{,}2$ y tres veces $0{,}8$: $1{,}2 + 2{,}4 = 3{,}6$, y entre 9, $0{,}4$. El píxel oscuro se ha aclarado: el borde se ha repartido entre los dos lados, que es desenfocar.', antes: 'Suma los nueve valores y divide entre 9.' },
      { t: '<strong>Gauss.</strong> La columna izquierda pesa $1 + 2 + 1 = 4$, la central $8$ y la derecha $4$: $4\\cdot 0{,}2 + 8\\cdot 0{,}2 + 4\\cdot 0{,}8 = 5{,}6$, y entre 16, $0{,}35$. También desenfoca, pero menos que la caja, porque el centro pesa más.', antes: '¿Cuánto pesa en total cada columna?' },
      { t: '<strong>Sobel.</strong> La columna izquierda pesa $-4$, la central $0$ y la derecha $+4$: $-4\\cdot 0{,}2 + 4\\cdot 0{,}8 = 2{,}4$. Un número grande: hay un borde. En una zona lisa de $0{,}2$ daría $-0{,}8 + 0{,}8 = 0$.', antes: 'Derecha menos izquierda, con pesos 1, 2 y 1.' },
      { t: '<strong>Nitidez.</strong> Cinco veces el centro menos sus cuatro vecinos en cruz: $5\\cdot 0{,}2 - (0{,}2 + 0{,}2 + 0{,}2 + 0{,}8) = 1 - 1{,}4 = -0{,}4$, que al recortar queda en $0$. El lado oscuro del borde se ha oscurecido todavía más: así se ve más nítido.', antes: '¿Qué vecinos entran, y con qué signo?' }
    ],
    cierre: 'Los tres primeros resultados se leen con la suma de los pesos: el desenfoque y la nitidez suman 1 y dejan igual lo liso; el de Sobel suma 0 y solo responde al cambio.'
  });

  p.comprueba('Un núcleo de 3 × 3 tiene todos los pesos positivos y suman 2. ¿Qué le hace a una zona lisa de la foto?', [
    { t: 'La deja con el doble de brillo, aunque la desenfoque', ok: true, por: 'En una zona lisa los nueve vecinos valen lo mismo, $v$, y el resultado es $v$ por la suma de los pesos: $2v$. Por eso los desenfoques se dividen entre la suma.' },
    { t: 'La deja igual, porque es lisa', ok: false, por: 'Eso solo pasa si los pesos suman 1. Lo liso no se desenfoca, pero sí se multiplica por la suma.' },
    { t: 'La vuelve negra, como el de bordes', ok: false, por: 'El de bordes se vuelve negro en lo liso porque sus pesos suman 0. Estos suman 2.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Filtros con estilo: píxeles, puntos y viñetas de cómic');

  p.text('Los filtros más llamativos juntan las dos ideas anteriores con lo que ya sabes de ' +
    '[[gfx-repetir|repetir el espacio]]:');

  p.list([
    '<strong>Pixelado.</strong> Todos los píxeles de un bloque leen la foto en el centro del bloque: <code>(floor(fragCoord / tam) + 0.5) * tam</code>. Es redondear la coordenada antes de leer.',
    '<strong>Trama de puntos.</strong> El espacio se parte en celdas y en cada una se dibuja un punto negro, tanto mayor cuanto más oscura es la foto allí. Así imprimen los periódicos: es el <strong>semitono</strong>.',
    '<strong>Cómic.</strong> Pocos niveles de color, con <code>floor</code>, y encima los bordes en negro, con una derivada.'
  ]);

  p.formula('\\pi r^2 = 1 - \\ell \\quad\\Longrightarrow\\quad r = \\sqrt{\\frac{1 - \\ell}{\\pi}}',
    'el radio de cada punto de la trama',
    'Desde lejos, el ojo promedia tinta y papel. Para que una celda de lado 1 se vea con luminancia ' +
    '$\\ell$, la fracción cubierta de tinta tiene que ser $1 - \\ell$, y esa fracción es el ' +
    '<strong>área</strong> del punto. El radio, por tanto, crece con la raíz: una zona el doble de ' +
    'oscura lleva puntos de área doble, no de radio doble.');

  p.demo({
    title: 'Del píxel al periódico',
    intro: 'Tres filtros de estilo sobre la misma foto. En la trama los puntos van girados 45°, como en la imprenta, porque así el ojo detecta menos la rejilla. Con la cámara, prueba a acercar la cara.',
    predice: 'En la trama de puntos, ¿dónde se tocarán los puntos vecinos: en el cielo, en el prado oscuro o en las letras blancas del cartel? Mira la fórmula del radio con $\\ell$ cerca de 0.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-filtros-3', alto: 340, imagen: true,
        aria: 'La foto del paisaje con un filtro de estilo a elegir: pixelada en bloques, impresa con una trama de puntos o posterizada con bordes negros de cómic.',
        mandos: [
          { n: 'estilo', label: 'estilo: 0 pixelado · 1 trama · 2 cómic', min: 0, max: 2, step: 1, value: 1, dec: 0 },
          { n: 'tam', label: 'tamaño de la celda (píxeles)', min: 3, max: 30, step: 1, value: 8, dec: 0 },
          { n: 'niveles', label: 'niveles de color del cómic', min: 2, max: 8, step: 1, value: 4, dec: 0 }
        ],
        codigo:
          'vec2 cubre(vec2 fc)\n' +
          '{\n' +
          '    vec2 r = iResolution.xy, t = iChannelResolution[1].xy;\n' +
          '    float s = max(r.x / t.x, r.y / t.y);\n' +
          '    return (fc - 0.5 * r) / (s * t) + 0.5;\n' +
          '}\n' +
          '\n' +
          'vec3 foto(vec2 fc) { return texture2D(iChannel1, cubre(fc)).rgb; }\n' +
          'float luz(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec3 c;\n' +
          '    if (estilo < 0.5) {\n' +
          '        // PIXELADO: el bloque entero lee el color de su centro\n' +
          '        c = foto((floor(fragCoord / tam) + 0.5) * tam);\n' +
          '    } else if (estilo < 1.5) {\n' +
          '        // TRAMA: una rejilla girada 45 grados, un punto por celda\n' +
          '        mat2 giro = mat2(0.7071, 0.7071, -0.7071, 0.7071);\n' +
          '        vec2 q = giro * fragCoord / tam;\n' +
          '        vec2 celda = floor(q) + 0.5;\n' +
          '        float l = luz(foto((celda * tam) * giro));    // la foto en el centro de la celda\n' +
          '        float r = sqrt((1.0 - l) / PI);                // area de tinta = 1 - l\n' +
          '        float tinta = 1.0 - smoothstep(r - 0.05, r + 0.05, length(q - celda));\n' +
          '        c = mix(vec3(0.97, 0.95, 0.89), vec3(0.08), tinta);\n' +
          '    } else {\n' +
          '        // COMIC: pocos niveles y bordes negros\n' +
          '        c = floor(foto(fragCoord) * niveles + 0.5) / niveles;\n' +
          '        vec2 e = vec2(1.5, 0.0);\n' +
          '        float gx = luz(foto(fragCoord + e.xy)) - luz(foto(fragCoord - e.xy));\n' +
          '        float gy = luz(foto(fragCoord + e.yx)) - luz(foto(fragCoord - e.yx));\n' +
          '        c *= 1.0 - smoothstep(0.06, 0.16, length(vec2(gx, gy)));\n' +
          '    }\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'En la trama, <code>giro * fragCoord</code> lleva el píxel a la rejilla girada y <code>(celda * tam) * giro</code> lo devuelve: multiplicar por la derecha aplica la traspuesta, que en un giro es el giro contrario.'
      });
    }
  });

  p.util('Cada filtro de este tema tiene detrás una industria. Los ajustes de revelado y las matrices ' +
    'de color son los de cualquier aplicación de fotos y los de la sala de etalonaje del cine. La ' +
    'convolución es la operación básica del procesado de imagen médica y de los sistemas que leen ' +
    'matrículas o texto, donde se buscan bordes antes de reconocer nada, y da nombre a las redes ' +
    'neuronales <em>convolucionales</em>, cuyas primeras capas aprenden solas núcleos muy parecidos al ' +
    'de Sobel. Y el semitono sigue siendo como se imprime todo lo que lleva fotos en papel.');

  p.hist('La primera fotografía impresa con semitono en un periódico apareció en el <em>Daily Graphic</em> ' +
    'de Nueva York en 1880, y durante un siglo la trama se hizo con retículas de cristal delante de la ' +
    'película. El operador de Sobel lo presentaron Irwin Sobel y Gary Feldman en 1968, en el laboratorio ' +
    'de inteligencia artificial de Stanford, como una forma barata de estimar el gradiente de una imagen. ' +
    'Y cuando Instagram salió en 2010 con una docena de filtros de un píxel, casi todos imitaban los ' +
    'defectos de color de películas y cámaras baratas de los años setenta.');

  p.trampas([
    { e: 'Leer al vecino sumando un píxel del lienzo', por: 'La foto está escalada: un píxel del lienzo no es un píxel de la foto, y el desenfoque cambiaría con el tamaño de la ventana. El paso es <code>1.0 / iChannelResolution[1].xy</code>.' },
    { e: 'Olvidar dividir el desenfoque entre la suma de los pesos', por: 'Con la caja sin el $\\frac{1}{9}$, una zona lisa de $0{,}2$ sale $1{,}8$: blanco quemado. Los núcleos que no deben cambiar el brillo suman 1.' },
    { e: 'Escribir la matriz de color fila a fila y multiplicar por la izquierda', por: '<code>mat3</code> se rellena por columnas: <code>sepia * c</code> aplicaría la traspuesta y el tono saldría otro. Con las filas escritas en orden, se multiplica <code>c * sepia</code>.' },
    { e: 'Hacer el radio del punto proporcional a la oscuridad', por: 'Lo que el ojo promedia es el área. Con $r = (1 - \\ell)/2$, una zona de luminancia $0{,}5$ llevaría solo un 20 % de tinta y se vería mucho más clara.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La luminancia de un píxel',
    level: 'basico',
    gen: function (r) {
      var c = [r.int(0, 20) / 20, r.int(0, 20) / 20, r.int(0, 20) / 20];
      var l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      if (Math.abs(l - 0.5) < 0.01) return null;
      return { c: c, l: l, media: (c[0] + c[1] + c[2]) / 3, t: l >= 0.5 ? 'blanco' : 'negro' };
    },
    ask: function (d) {
      return 'Un píxel de la foto tiene el color <code>vec3(' + d.c.map(function (x) { return U.fmt(x, 2).replace(',', '.'); }).join(', ') +
        ')</code>. ¿Cuál es su luminancia, <code>dot(c, vec3(0.2126, 0.7152, 0.0722))</code>? Y con el filtro de umbral ' +
        '<code>step(0.5, luminancia)</code>, ¿ese píxel sale blanco o negro? (cuatro decimales)';
    },
    fields: [
      { name: 'l', label: 'luminancia', w: 'tiny' },
      { name: 't', label: 'con el umbral sale', opts: [{ t: 'blanco', v: 'blanco' }, { t: 'negro', v: 'negro' }] }
    ],
    sol: function (d) { return { l: U.round(d.l, 6), t: d.t }; },
    dec: { l: 4 },
    errores: [{
      si: function (v, d) { return Math.abs(d.media - d.l) > 1e-3 && Math.abs(v.l - d.media) < 5e-5; },
      msg: 'Ese es el promedio de los tres canales. El ojo pesa mucho más el verde que el azul: la luminancia usa los pesos 0,2126, 0,7152 y 0,0722.'
    }],
    hint: function () { return ['Es un producto escalar: cada canal por su peso, y se suman los tres.', '<code>step(0.5, x)</code> vale 1, blanco, si $x \\ge 0{,}5$.']; },
    steps: function (d) {
      return ['$\\ell = 0{,}2126\\cdot ' + U.fmt(d.c[0], 2) + ' + 0{,}7152\\cdot ' + U.fmt(d.c[1], 2) + ' + 0{,}0722\\cdot ' + U.fmt(d.c[2], 2) + '$',
        '$= ' + U.fmt(0.2126 * d.c[0], 4) + ' + ' + U.fmt(0.7152 * d.c[1], 4) + ' + ' + U.fmt(0.0722 * d.c[2], 4) + ' = ' + U.fmt(d.l, 4) + '$',
        d.t === 'blanco' ? 'Como $' + U.fmt(d.l, 4) + ' \\ge 0{,}5$, el umbral da 1: <strong>blanco</strong>.' : 'Como $' + U.fmt(d.l, 4) + ' < 0{,}5$, el umbral da 0: <strong>negro</strong>.'];
    },
    answer: function (d) { return U.fmt(d.l, 4) + ' · ' + d.t; }
  });

  var NUCLEOS = [
    { n: 'caja', k: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], div: 9, tex: '\\frac{1}{9}' },
    { n: 'Gauss', k: [[1, 2, 1], [2, 4, 2], [1, 2, 1]], div: 16, tex: '\\frac{1}{16}' },
    { n: 'nitidez', k: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], div: 1, tex: '' },
    { n: 'Sobel', k: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], div: 1, tex: '' }
  ];
  function matTex(m, fmt) {
    return '\\begin{pmatrix}' + m.map(function (fila) { return fila.map(fmt).join(' & '); }).join('\\\\') + '\\end{pmatrix}';
  }

  p.exercise({
    title: 'Un núcleo sobre nueve números',
    level: 'medio',
    gen: function (r) {
      var f = [[r.int(0, 9) / 10, r.int(0, 9) / 10, r.int(0, 9) / 10],
        [r.int(0, 9) / 10, r.int(0, 9) / 10, r.int(0, 9) / 10],
        [r.int(0, 9) / 10, r.int(0, 9) / 10, r.int(0, 9) / 10]];
      var K = NUCLEOS[r.int(0, 3)];
      var suma = 0;
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) suma += K.k[i][j] * f[i][j];
      return { f: f, K: K, bruto: suma, v: suma / K.div };
    },
    ask: function (d) {
      return 'Una vecindad de 3 × 3 de la foto, en gris, y un núcleo de ' + d.K.n + ':' +
        '<br>$f = ' + matTex(d.f, function (x) { return U.fmt(x, 1); }) + '\\qquad K = ' + d.K.tex + matTex(d.K.k, String) + '$' +
        '<br>¿Qué valor sale en el píxel central? Cada peso multiplica al vecino que ocupa su misma posición. (Sin recortar: puede salir negativo o mayor que 1. Cuatro decimales.)';
    },
    fields: [{ name: 'v', label: 'valor nuevo', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    dec: 4,
    errores: [{
      si: function (v, d) { return d.K.div !== 1 && Math.abs(d.bruto - d.v) > 1e-3 && Math.abs(v.v - d.bruto) < 5e-5; },
      msg: 'Falta dividir entre la suma de los pesos: sin eso, el desenfoque multiplica el brillo de las zonas lisas.'
    }],
    hint: function (d) {
      return ['Multiplica cada número de $f$ por el peso que está en el mismo sitio de $K$ y suma los nueve productos.',
        d.K.div !== 1 ? 'Al final, divide entre ' + d.K.div + '.' : 'Los pesos cero se pueden saltar.'];
    },
    steps: function (d) {
      var terminos = [];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
        if (d.K.k[i][j]) terminos.push('(' + d.K.k[i][j] + ')\\cdot ' + U.fmt(d.f[i][j], 1));
      }
      var s = ['Productos que no son cero: $' + terminos.join(' + ') + '$', 'Suma: $' + U.fmt(d.bruto, 4) + '$'];
      if (d.K.div !== 1) s.push('Entre ' + d.K.div + ': $' + U.fmt(d.v, 4) + '$');
      s.push(d.K.n === 'Sobel' ? 'El resultado mide cuánto más clara es la columna derecha que la izquierda: un borde vertical.'
        : (d.K.div !== 1 ? 'Es un promedio ponderado de la vecindad: desenfoca.' : 'Cinco veces el centro menos sus cuatro vecinos en cruz: realza la diferencia con ellos.'));
      return s;
    },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.exercise({
    title: 'El radio del punto de la trama',
    level: 'medio',
    gen: function (r) {
      var l = r.int(1, 19) * 0.05;
      var tinta = 1 - l;
      return { l: l, tinta: tinta, r: Math.sqrt(tinta / Math.PI), lineal: tinta / 2, sinRaiz: tinta / Math.PI };
    },
    ask: function (d) {
      return 'En una trama de puntos, cada celda mide 1 × 1 y lleva un punto de tinta negra sobre papel blanco. ' +
        'Para que la celda se vea desde lejos con luminancia $\\ell = ' + U.fmt(d.l, 2) + '$, ¿qué fracción de la celda tiene que cubrir la tinta, ' +
        'y qué radio tiene el punto? (cuatro decimales)';
    },
    fields: [{ name: 'f', label: 'fracción con tinta', w: 'tiny' }, { name: 'r', label: 'radio', w: 'tiny' }],
    sol: function (d) { return { f: U.round(d.tinta, 6), r: U.round(d.r, 6) }; },
    dec: 4,
    errores: [
      { si: function (v, d) { return Math.abs(d.lineal - d.r) > 1e-3 && Math.abs(v.r - d.lineal) < 5e-5; }, msg: 'El radio no crece como la oscuridad: lo que tiene que valer $1 - \\ell$ es el área, $\\pi r^2$. Despeja $r$.' },
      { si: function (v, d) { return Math.abs(d.sinRaiz - d.r) > 1e-3 && Math.abs(v.r - d.sinRaiz) < 5e-5; }, msg: 'Eso es $r^2$: falta la raíz cuadrada.' }
    ],
    hint: function () { return ['El ojo promedia: la fracción de papel que se ve es la luminancia, y la de tinta, lo que falta hasta 1.', 'Esa fracción es el área del punto, $\\pi r^2$, porque la celda mide 1.']; },
    steps: function (d) {
      return ['Fracción con tinta: $1 - ' + U.fmt(d.l, 2) + ' = ' + U.fmt(d.tinta, 2) + '$.',
        '$\\pi r^2 = ' + U.fmt(d.tinta, 2) + ' \\Rightarrow r = \\sqrt{' + U.fmt(d.tinta, 2) + '/\\pi} = ' + U.fmt(d.r, 4) + '$.',
        d.r > 0.5 ? 'Con radio mayor que 0,5 el punto se sale de la celda y se toca con los vecinos: la tinta se une.' : 'Con radio menor que 0,5 cada punto queda aislado en su celda.'];
    },
    answer: function (d) { return 'tinta ' + U.fmt(d.tinta, 2) + ' · radio ' + U.fmt(d.r, 4); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'c = vec3(step(0.5, dot(c, vec3(0.2126, 0.7152, 0.0722))));',
          o: ['Solo blanco y negro, sin ningún gris', 'Blanco y negro con todos los grises', 'Los colores más saturados', 'El negativo de la foto'],
          por: '<code>step</code> devuelve 0 o 1 y nada entre medias: cada píxel es blanco si su luminancia llega a 0,5 y negro si no.' },
        { c: 'c = floor(c * 4.0) / 4.0;',
          o: ['Los degradados se vuelven escalones: pocos colores, como un cartel serigrafiado', 'La foto se ve en bloques cuadrados', 'La foto se desenfoca', 'La foto no cambia'],
          por: 'Cada canal solo puede valer 0, 0,25, 0,5 o 0,75: el cielo, que era un degradado, se parte en franjas de color liso. La posición de cada píxel no cambia.' },
        { c: 'vec2 b = floor(uv * 40.0) / 40.0;\nc = texture2D(iChannel1, b).rgb;',
          o: ['La foto en bloques de color liso: pixelada', 'Pocos colores, con los bordes nítidos', 'La foto borrosa', 'La foto repetida cuarenta veces'],
          por: 'Lo que se redondea es la coordenada, no el color: todos los píxeles de un bloque leen la foto en el mismo punto.' },
        { c: 'c = 1.0 - c;',
          o: ['El negativo: el cielo azul sale anaranjado y lo claro, oscuro', 'La foto en blanco y negro', 'Más contraste', 'La misma foto, más oscura'],
          por: 'Cada canal se cambia por lo que le falta hasta 1: el azul del cielo, con mucho azul y poco rojo, pasa a tener mucho rojo y poco azul.' },
        { c: 'float gx = luz(derecha) - luz(izquierda);\nc = vec3(abs(gx) * 4.0);',
          o: ['Casi todo negro, con líneas claras donde hay bordes verticales', 'La foto en gris', 'La foto borrosa', 'Todo blanco, con los bordes en negro'],
          por: 'La resta de los vecinos es cero en lo liso y grande donde la luminancia salta de izquierda a derecha: una derivada que solo ve los bordes verticales.' },
        { c: 'vec3 media = (c + arriba + abajo + izquierda + derecha) / 5.0;\nc = media;',
          o: ['Un poco borrosa, con el mismo brillo', 'Cinco veces más clara', 'Con los bordes realzados', 'Pixelada'],
          por: 'Es un promedio de cinco píxeles vecinos con pesos que suman 1: suaviza los detalles y deja las zonas lisas igual.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'Con <code>c</code> el color de la foto en el píxel, <code>uv</code> su coordenada y <code>luz</code> la luminancia, ¿qué filtro produce esto?' +
        '<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Se toca el color o la coordenada? ¿Se mira un píxel o sus vecinos? ¿Los pesos suman 1 o 0?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe el filtro',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'la foto en <strong>blanco y negro</strong>, con la luminancia',
          ref: 'vec3(dot(c, vec3(0.2126, 0.7152, 0.0722)))' },
        { pide: 'el <strong>negativo</strong> de la foto',
          ref: '1.0 - c' },
        { pide: 'un <strong>posterizado</strong> a 4 niveles por canal, redondeando hacia abajo',
          ref: 'floor(c * 4.0) / 4.0' },
        { pide: '<strong>más contraste</strong>: la distancia de cada canal al gris medio 0,5, multiplicada por 1,5',
          ref: '(c - 0.5) * 1.5 + 0.5' },
        { pide: 'el <strong>sepia</strong>, con la matriz del tema escrita fila a fila',
          ref: 'c * mat3(0.393, 0.769, 0.189, 0.349, 0.686, 0.168, 0.272, 0.534, 0.131)' },
        { pide: 'un <strong>umbral</strong>: blanco donde la luminancia llega a 0,5 y negro en el resto',
          ref: 'vec3(step(0.5, dot(c, vec3(0.2126, 0.7152, 0.0722))))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 uv = fragCoord / iResolution.xy;\nvec3 c = texture2D(iChannel1, uv).rgb;\nc = <strong>???</strong> ;\ncolor = vec4(clamp(c, 0.0, 1.0), 1.0);</pre>';
    },
    fields: [{ name: 'f', label: 'el filtro', w: 'wide' }],
    sol: function (d) { return { f: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.f || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = fragCoord / iResolution.xy;\n' +
          '  vec3 c = texture2D(iChannel1, uv).rgb;\n' +
          '  c = ' + x + ';\n' +
          '  color = vec4(clamp(c, 0.0, 1.0), 1.0);\n}';
      }
      // Tolerancia baja a proposito: son operaciones exactas sobre la misma
      // foto, y dos formas de escribir lo mismo dan distancia 0. Con 4 pasaba
      // un contraste de 1,4 cuando se pedia 1,5.
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 3 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado tiene que ser un <code>vec3</code>, y los números llevan punto decimal: <code>4.0</code>, no <code>4</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la foto no queda como se pedía. Piensa si el filtro multiplica, resta de 1, redondea o mezcla los canales, y comprueba los números.' };
      }
      return { ok: true };
    },
    hint: function () { return 'Todos son filtros de un píxel: una expresión con <code>c</code> que devuelve un <code>vec3</code>. La tabla y la fórmula del sepia del tema tienen las seis.'; },
    steps: function (d) { return ['Se pedía ' + d.pide + '.', 'Una respuesta: <code>' + d.ref + '</code>.', 'El corrector compara las imágenes que salen, así que cualquier forma equivalente de escribirlo vale.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Un filtro es un shader que lee la imagen con <code>texture2D(iChannel1, uv)</code> y devuelve otro color para cada píxel.',
    'Los filtros de un píxel son funciones del color: multiplicar es exposición, alejar de 0,5 es contraste, mezclar con la luminancia es saturación, y una matriz 3 × 3 rehace los tres canales.',
    'Una <strong>convolución</strong> suma los vecinos por los pesos de un núcleo. Si los pesos suman 1 conserva el brillo; si suman 0, borra lo liso y deja los bordes.',
    'El desenfoque es la media móvil en dos dimensiones, y el detector de bordes de Sobel es una derivada por diferencias.',
    'Los vecinos están a un píxel de la <strong>imagen</strong>, <code>1.0 / iChannelResolution[1].xy</code>, no del lienzo.',
    'En una trama de puntos, lo proporcional a la oscuridad es el área de cada punto: el radio crece con la raíz.'
  ]);
});
