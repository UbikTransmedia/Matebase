/* Tema: Azar sin azar: ruido */
Course.topic('gfx-ruido', function (p) {

  p.puente('Formas y colores perfectos delatan a la máquina. Este tema fabrica desorden reproducible: ' +
    'un hash que amplifica diferencias como el [[av-caos|caos determinista]], la interpolación de ' +
    '[[gfx-decidir|mix]] para suavizarlo y una [[fn-series|serie geométrica]] para sumar octavas.');

  p.text('Todo lo que has dibujado hasta ahora es perfecto, y por eso se nota que es una máquina la ' +
    'que lo dibuja. Las nubes no son círculos, el mármol no es una rejilla, la corteza de un árbol ' +
    'no tiene simetría. Para que una imagen parezca de este mundo hace falta <strong>desorden</strong>, ' +
    'y aquí llega el problema más bonito del bloque: <em>un shader no puede tirar los dados</em>.');

  p.text('No puede por dos razones. La primera es que no hay memoria: cada píxel se calcula solo, ' +
    'sin recordar nada de la imagen anterior ni saber nada de sus vecinos. La segunda es más grave: ' +
    'si cada fotograma saliera un número distinto, la imagen hervería como la nieve de un televisor ' +
    'mal sintonizado. Lo que se necesita no es azar: es <strong>desorden que siempre salga igual</strong>.');

  p.note('A esto se le llama <em>azar reproducible</em> o <em>pseudoaleatorio</em>, y es el mismo ' +
    'que usan los ejercicios de este curso: el generador de este tema te da los mismos números si ' +
    'le das la misma semilla. Aquí la semilla es la coordenada del píxel. Un punto del plano siempre ' +
    'devolverá el mismo número, hoy y dentro de un año.', null, 'Azar que no cambia');

  p.section('Un hash de una línea');

  p.text('La receta más famosa del oficio cabe en un renglón y no tiene ninguna justificación ' +
    'teórica decente. Funciona, y se usa:');

  p.demo({
    title: 'Nieve determinista',
    intro: 'Cada píxel calcula un número entre 0 y 1 a partir de su propia coordenada. Parece ruido de televisor, pero está congelado: no cambia con el tiempo porque no depende del tiempo.',
    predice: 'Con grano 80 se ven cuadraditos. Si subes el grano a 300, ¿serán más grandes o más pequeños? Y si escribieras <code>iTime</code> dentro del hash, ¿qué pasaría con la imagen?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-rui-1', alto: 280,
        aria: 'Una nube de puntos blancos y negros, fija, parecida a la estática de un televisor.',
        mandos: [
          { n: 'escala', label: 'grano', min: 2, max: 300, step: 1, value: 80, dec: 0 }
        ],
        codigo:
          '// devuelve un numero entre 0 y 1 a partir de un punto\n' +
          'float hash(vec2 p)\n' +
          '{\n' +
          '    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = fragCoord / iResolution.y;\n' +
          '    float v = hash(floor(p * escala));\n' +
          '    color = vec4(vec3(v), 1.0);\n' +
          '}\n',
        nota: 'El <code>floor</code> es lo que hace los cuadraditos: sin él, cada píxel tendría su ' +
          'propio número y el grano sería del tamaño de un píxel. Con él, todos los píxeles de una ' +
          'misma celda comparten valor.'
      });
    }
  });

  p.text('Merece la pena desarmar esa línea, porque explica por qué funciona algo que parece un truco:');

  p.table(['Trozo', 'Qué hace'], [
    ['<code>dot(p, vec2(127.1, 311.7))</code>', 'convierte el punto en <strong>un solo número</strong>, mezclando las dos coordenadas con pesos raros y sin relación entre sí'],
    ['<code>sin(...)</code>', 'el número anterior es enorme, y el seno oscila endiabladamente rápido ahí arriba: dos puntos casi iguales caen en partes muy distintas de la onda'],
    ['<code>* 43758.5453</code>', 'multiplica por un número grande y feo para separar aún más lo que estaba cerca'],
    ['<code>fract(...)</code>', 'se queda solo con la parte decimal, que ya está completamente revuelta, y la devuelve entre 0 y 1']
  ]);

  p.text('La idea de fondo es la <strong>sensibilidad a las condiciones iniciales</strong>: una ' +
    'función que amplifica muchísimo las diferencias pequeñas convierte una entrada ordenada en una ' +
    'salida que parece caótica. Es exactamente el mecanismo que estudiaste en [[av-caos|caos ' +
    'determinista]], puesto a trabajar como fábrica de números.');

  p.note('Esta función <strong>no es un buen generador aleatorio</strong> y no debe usarse para nada ' +
    'serio: falla las pruebas estadísticas y, peor, el <code>sin</code> de argumentos gigantes se ' +
    'calcula de forma distinta en cada tarjeta gráfica, así que la misma imagen puede salir con ' +
    'granos diferentes en dos ordenadores. Para dibujar da igual. Para criptografía o para simular, ' +
    'jamás.', 'warn', 'No es aleatorio de verdad');

  p.comprueba('Quieres nubes y tienes la estática de arriba. ¿Por qué no basta con bajar el grano?', [
    { t: 'Porque dos puntos vecinos no se parecen en nada; hay que sortear en pocos puntos e interpolar entre ellos', ok: true, por: 'Una nube es continua: la densidad cambia poco de un punto al de al lado. El hash da valores sin relación entre vecinos. Sorteando solo en los vértices de una rejilla y mezclando por dentro, la continuidad aparece.' },
    { t: 'Porque el hash no admite decimales', ok: false, por: 'Los admite, y con ellos da un valor distinto por píxel: justo el problema. Lo que falta no es precisión, es parecido entre vecinos.' },
    { t: 'Porque con grano fino cuesta demasiado', ok: false, por: 'Cuesta lo mismo: un hash por píxel. El ruido suave cuesta más, cuatro hashes y tres mezclas, y aun así es lo que se usa, porque el problema no es el coste.' }
  ]);

  p.section('De la estática a las nubes');

  p.text('El ruido de arriba no sirve para casi nada: es demasiado brusco. En la naturaleza los ' +
    'valores cercanos se parecen —dos puntos vecinos de una nube tienen densidad parecida— y aquí ' +
    'no se parecen en nada. La solución es la misma idea del tema anterior: <strong>sortear solo en ' +
    'los vértices de una rejilla e interpolar por dentro</strong>.');

  p.formulas([
    'i = \\lfloor p \\rfloor \\quad\\text{(en qué celda)}',
    'f = \\operatorname{fract}(p) \\quad\\text{(dónde dentro)}',
    'u = f^2(3 - 2f) \\quad\\text{(suavizado)}'
  ], 'preparar la interpolación');

  p.text('Los cuatro vértices de la celda reciben cada uno su número del <em>hash</em>, y el valor ' +
    'del píxel es una mezcla de los cuatro: primero se mezcla horizontalmente arriba y abajo, y ' +
    'luego se mezclan esas dos mezclas verticalmente. Se llama <strong>interpolación bilineal</strong> ' +
    'y son tres <code>mix</code> encadenados.');

  p.text('El detalle que lo cambia todo es esa $u = f^2(3-2f)$, que es la curva de ' +
    '<code>smoothstep</code> que ya conoces. Si se interpola con $f$ a secas, las celdas se notan: ' +
    'aparece un enrejado de pliegues porque la pendiente cambia de golpe al cruzar cada borde. Con ' +
    '$u$ la pendiente llega a cero justo en los vértices, y la costura desaparece.');

  p.demo({
    title: 'Ruido de valor',
    intro: 'Sortea en los vértices e interpola por dentro. El mando «suavizado» apaga y enciende la curva de smoothstep: con él a cero se ven las costuras de la rejilla; con él a uno, desaparecen.',
    predice: 'Con suavizado 0, ¿dónde se verán las costuras: en los bordes de las celdas o en sus centros? ¿Serán saltos de valor o solo cambios bruscos de pendiente?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-rui-2', alto: 300,
        aria: 'Una mancha suave de grises, como una nube desenfocada, cuya escala se puede cambiar.',
        mandos: [
          { n: 'escala', label: 'escala', min: 1, max: 24, step: 0.5, value: 6, dec: 1 },
          { n: 'suavizado', label: 'suavizado', min: 0, max: 1, step: 0.01, value: 1, dec: 2 }
        ],
        codigo:
          'float hash(vec2 p)\n' +
          '{\n' +
          '    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          'float ruido(vec2 p)\n' +
          '{\n' +
          '    vec2 i = floor(p);          // celda\n' +
          '    vec2 f = fract(p);          // posicion dentro de ella\n' +
          '\n' +
          '    // la curva suave, o la recta si el mando esta a cero\n' +
          '    vec2 u = mix(f, f * f * (3.0 - 2.0 * f), suavizado);\n' +
          '\n' +
          '    float a = hash(i);\n' +
          '    float b = hash(i + vec2(1.0, 0.0));\n' +
          '    float c = hash(i + vec2(0.0, 1.0));\n' +
          '    float d = hash(i + vec2(1.0, 1.0));\n' +
          '\n' +
          '    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = fragCoord / iResolution.y;\n' +
          '    float v = ruido(p * escala);\n' +
          '    color = vec4(vec3(v), 1.0);\n' +
          '}\n',
        nota: 'Cuatro llamadas al <em>hash</em> y tres <code>mix</code>. Nada más. Prueba a poner el ' +
          'suavizado a 0 y mira aparecer el enrejado: esa es la diferencia entre interpolar con $f$ ' +
          'e interpolar con $f^2(3-2f)$.'
      });
    }
  });

  p.sub('Ruido de gradiente');

  p.text('El ruido de valor tiene un defecto que, una vez visto, no se deja de ver: sus máximos y mínimos ' +
    'caen justo en las esquinas de la rejilla, y la imagen tiene un aire cuadriculado. Ken Perlin lo evitó ' +
    'cambiando lo que se sortea en cada esquina. En lugar de un <strong>valor</strong>, se sortea una ' +
    '<strong>pendiente</strong>: un vector gradiente. En la esquina el ruido vale 0, pero sale de ella con esa ' +
    'inclinación. Cada esquina aporta el [[ge-vectores|producto escalar]] de su gradiente con el vector que va ' +
    'de la esquina al punto, y las cuatro aportaciones se interpolan.');

  p.formula('n(\\vec p) = \\operatorname{mix}\\bigl(\\operatorname{mix}(a, b, u_x),\\ \\operatorname{mix}(c, d, u_x),\\ u_y\\bigr), \\qquad a = \\vec g_{00}\\cdot(\\vec p - \\vec c_{00}),\\ \\dots',
    'ruido de gradiente',
    '$\\vec g_{00}$ es el gradiente sorteado en la esquina $\\vec c_{00}$, y lo mismo con las otras tres.<br><br>' +
    'El peso $u = 6f^5 - 15f^4 + 10f^3$ es un polinomio de quinto grado que Perlin propuso en 2002: como ' +
    '<code>smoothstep</code>, vale 0 y 1 en los extremos con derivada nula, pero además tiene nula la ' +
    '<strong>segunda</strong> derivada, y eso elimina unas arrugas que se veían al iluminar el relieve.');

  p.demo({
    title: 'Valor frente a gradiente',
    intro: 'A la izquierda, ruido de valor; a la derecha, ruido de gradiente, con la misma escala. Activa la rejilla: en el de valor, las zonas más claras y más oscuras se pegan a las esquinas; en el de gradiente, las esquinas son grises medios y las manchas se reparten libremente.',
    predice: 'Activa la rejilla: ¿en cuál de las dos mitades todas las esquinas serán del mismo gris? Piensa en qué vale el producto escalar cuando el vector es cero.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-ruido-gradiente', alto: 280,
        aria: 'Dos mitades de ruido que se desplazan despacio: ruido de valor a la izquierda y ruido de gradiente a la derecha.',
        mandos: [
          { n: 'escala', label: 'escala', min: 2.0, max: 20.0, step: 0.5, value: 6.0, dec: 1 },
          { n: 'rejilla', label: 'mostrar rejilla', min: 0, max: 1, step: 1, value: 0, dec: 0 }
        ],
        codigo:
          'float hash1(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }\n' +
          '\n' +
          'vec2 hash2(vec2 c)\n' +
          '{\n' +
          '    c = vec2(dot(c, vec2(127.1, 311.7)), dot(c, vec2(269.5, 183.3)));\n' +
          '    return -1.0 + 2.0 * fract(sin(c) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          'float ruidoValor(vec2 p)\n' +
          '{\n' +
          '    vec2 i = floor(p), f = fract(p);\n' +
          '    vec2 u = f * f * (3.0 - 2.0 * f);\n' +
          '    return mix(mix(hash1(i), hash1(i + vec2(1.0, 0.0)), u.x),\n' +
          '               mix(hash1(i + vec2(0.0, 1.0)), hash1(i + vec2(1.0, 1.0)), u.x), u.y);\n' +
          '}\n' +
          '\n' +
          'float ruidoGradiente(vec2 p)\n' +
          '{\n' +
          '    vec2 i = floor(p), f = fract(p);\n' +
          '    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);     // 6f^5 - 15f^4 + 10f^3\n' +
          '    float a = dot(hash2(i), f);\n' +
          '    float b = dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));\n' +
          '    float c = dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));\n' +
          '    float d = dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));\n' +
          '    return 0.5 + 0.7 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = fragCoord / iResolution.xy;\n' +
          '    vec2 p = fragCoord / iResolution.y * escala + vec2(iTime * 0.2, 0.0);\n' +
          '\n' +
          '    float n = uv.x < 0.5 ? ruidoValor(p) : ruidoGradiente(p);\n' +
          '    vec3 col = vec3(n);\n' +
          '\n' +
          '    float linea = 1.0 - smoothstep(0.0, 0.04, min(fract(p.x), fract(p.y)));\n' +
          '    col = mix(col, vec3(1.0, 0.35, 0.25), rejilla * linea);\n' +
          '    col *= smoothstep(0.0, 0.004, abs(uv.x - 0.5));        // la raya que separa las dos mitades\n' +
          '    color = vec4(col, 1.0);\n' +
          '}\n',
        nota: 'En la mitad derecha, cambia el 0.7 por un número mayor para ver más contraste: el ruido de gradiente sale más apagado porque rara vez llega a sus extremos.'
      });
    }
  });

  p.section('Sumar octavas: el ruido fractal');

  p.text('El ruido de valor tiene un solo tamaño de detalle: manchas todas igual de grandes. Las ' +
    'cosas reales no son así. Una montaña tiene bultos grandes, sobre esos bultos hay bultos ' +
    'medianos, sobre esos hay piedras y sobre las piedras hay grano. La receta que imita eso es ' +
    'sumar el mismo ruido varias veces, <strong>cada vez más pequeño y más apretado</strong>:');

  p.formula('\\text{fbm}(p) = \\sum_{k=0}^{n-1} g^{k}\\, \\text{ruido}\\!\\left(2^{k} p\\right)',
    'ruido browniano fraccionario',
    'Se lee: <em>«la suma, para ka de cero a ene menos uno, de ge elevado a ka por ruido de dos ' +
      'elevado a ka por pe»</em>.<br><br>Cada paso se llama <strong>octava</strong>, tomando ' +
      'prestada la palabra de la música: en cada vuelta la frecuencia se duplica, igual que al subir ' +
      'una octava en un piano. El número $g$ (la <em>ganancia</em>, típicamente $0{,}5$) dice cuánto ' +
      'pesa cada octava respecto de la anterior.');

  p.text('Fíjate en lo que estás sumando: una [[fn-series|serie geométrica]] de razón $g$. Si $g < 1$ ' +
    'la suma converge, y sabes exactamente a cuánto: el valor máximo posible del <em>fbm</em> es ' +
    '$\\frac{1-g^n}{1-g}$, que con $g = 0{,}5$ y muchas octavas tiende a 2. Por eso los shaders ' +
    'suelen dividir el resultado entre ese número: para que vuelva a caber entre 0 y 1.');

  p.ejemplo({
    title: 'Tres octavas, a mano',
    enunciado: 'En un punto, el ruido vale $0{,}6$ a escala 1, $0{,}3$ al doble y $0{,}8$ al cuádruple. Calcular el fbm de tres octavas con ganancia $0{,}5$ y con ganancia $0{,}7$, normalizado.',
    pasos: [
      { t: '<strong>Ganancia 0,5.</strong> Amplitudes $1,\\ 0{,}5,\\ 0{,}25$. Suma: $1\\cdot 0{,}6 + 0{,}5\\cdot 0{,}3 + 0{,}25\\cdot 0{,}8 = 0{,}95$.', antes: 'Cada octava pesa la mitad que la anterior. Multiplica y suma.' },
      { t: '<strong>Normalizar.</strong> El máximo posible es la suma de amplitudes, $1 + 0{,}5 + 0{,}25 = 1{,}75 = \\frac{1 - 0{,}5^3}{1 - 0{,}5}$. Resultado: $0{,}95 / 1{,}75 \\approx 0{,}54$.', antes: '¿Cuánto valdría la suma si los tres ruidos valieran 1?' },
      { t: '<strong>Ganancia 0,7.</strong> Amplitudes $1,\\ 0{,}7,\\ 0{,}49$. Suma: $0{,}6 + 0{,}21 + 0{,}392 = 1{,}202$. Máximo: $2{,}19$. Resultado: $\\approx 0{,}55$.', antes: 'Repite con 0,7. ¿Cambia mucho el resultado normalizado?' },
      { t: '<strong>Lo que sí cambia.</strong> Con ganancia 0,5 la octava fina aporta el 14 % del total; con 0,7, el 22 %. El valor apenas se mueve, pero el detalle fino pesa más: por eso la ganancia alta da roca y la baja, algodón.' },
      { t: '<strong>Con infinitas octavas.</strong> Con $g = 0{,}5$ el máximo tiende a $\\frac{1}{1 - 0{,}5} = 2$; con $0{,}7$, a $3{,}33$. Con $g \\ge 1$ la serie no converge y el fbm no se puede normalizar: por eso la ganancia es siempre menor que 1.' }
    ],
    cierre: 'El fbm es una serie geométrica de ruidos. La razón decide cuánto pesa el detalle, y saber sumarla es lo que permite devolver el resultado a $[0, 1]$.'
  });

  p.demo({
    title: 'Nubes con octavas',
    intro: 'Sube las octavas de una en una y mira cómo el detalle se va metiendo dentro del detalle. Con una octava es la mancha de antes; con seis, es una nube.',
    predice: 'Con 1 octava, ¿cómo serán las nubes? Al pasar a 6, ¿qué cambiará: el tamaño de las manchas grandes o el detalle de sus bordes?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-rui-3', alto: 320,
        aria: 'Nubes procedurales en movimiento lento cuyo nivel de detalle se puede aumentar.',
        mandos: [
          { n: 'octavas', label: 'octavas', min: 1, max: 7, step: 1, value: 5, dec: 0 },
          { n: 'ganancia', label: 'ganancia', min: 0.2, max: 0.75, step: 0.01, value: 0.5, dec: 2 },
          { n: 'deriva', label: 'deriva', min: 0, max: 0.4, step: 0.01, value: 0.08, dec: 2 }
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
          '    return mix(mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),\n' +
          '               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);\n' +
          '}\n' +
          '\n' +
          'float fbm(vec2 p)\n' +
          '{\n' +
          '    float suma = 0.0;\n' +
          '    float amplitud = 1.0;\n' +
          '    float total = 0.0;    // para normalizar al final\n' +
          '\n' +
          '    for (int k = 0; k < 7; k++) {\n' +
          '        if (float(k) >= octavas) break;\n' +
          '        suma  += amplitud * ruido(p);\n' +
          '        total += amplitud;\n' +
          '        p *= 2.0;              // el doble de apretado\n' +
          '        amplitud *= ganancia;  // y menos peso\n' +
          '    }\n' +
          '    return suma / total;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = fragCoord / iResolution.y;\n' +
          '    p.x -= iTime * deriva;      // las nubes pasan\n' +
          '\n' +
          '    float n = fbm(p * 4.0);\n' +
          '\n' +
          '    vec3 cielo = vec3(0.15, 0.20, 0.45);\n' +
          '    vec3 nube  = vec3(1.00, 0.95, 0.90);\n' +
          '    color = vec4(mix(cielo, nube, smoothstep(0.35, 0.75, n)), 1.0);\n' +
          '}\n',
        nota: 'La ganancia es el mando expresivo: baja (0,3) da nubes lisas y algodonosas; alta ' +
          '(0,7) da algo áspero, más de humo o de roca. Es la razón de la serie geométrica ' +
          'decidiendo la textura del mundo.'
      });
    }
  });

  p.note('Cuidado con el coste. Cada octava vuelve a llamar al ruido, y el ruido llama cuatro veces ' +
    'al <em>hash</em>. Seis octavas son veinticuatro <em>hash</em> por píxel, y en una pantalla de dos ' +
    'millones de píxeles a sesenta imágenes por segundo eso son tres mil millones de senos por ' +
    'segundo. Funciona porque la tarjeta hace miles a la vez, pero es el sitio donde un shader se ' +
    'atasca primero.', 'warn', 'Lo que cuesta una octava');

  p.util('El ruido fractal es, probablemente, la función más rentable de la historia de los gráficos. ' +
    'Con ella se generan los terrenos de los videojuegos, las nubes y el humo del cine, las vetas del ' +
    'mármol y la madera, el óxido de una superficie desgastada, el oleaje, el pelaje de un animal y ' +
    'el mapa entero de mundos como el de <em>Minecraft</em> o <em>No Man\'s Sky</em>, donde el ' +
    'planeta no está guardado en ningún sitio: se recalcula con una fórmula cada vez que lo miras.');

  p.hist('Ken Perlin inventó su ruido en 1983 mientras trabajaba en los efectos de <em>Tron</em>, ' +
    'harto de que todo lo generado por ordenador tuviera aquel aspecto de plástico. En 1997 la ' +
    'Academia de Hollywood le dio un Oscar técnico por ello: uno de los pocos premios de cine ' +
    'concedidos a una función matemática. El ruido que ves aquí es el <em>de valor</em>, más simple ' +
    'que el de Perlin —que interpola gradientes en vez de valores— pero de la misma familia y con la ' +
    'misma intención.');

  p.trampas([
    { e: 'Usar el hash del seno para algo serio', por: 'Falla las pruebas estadísticas y el seno de argumentos enormes se calcula distinto en cada tarjeta. Para dibujar sirve; para simular o cifrar, nunca.' },
    { e: 'Sortear un valor por píxel y esperar nubes', por: 'Sale estática: vecinos sin relación. Las nubes exigen sortear en los vértices de una rejilla e interpolar por dentro.' },
    { e: 'Interpolar con $f$ a secas', por: 'La pendiente cambia de golpe al cruzar cada borde de celda y se ve un enrejado. La curva $f^2(3 - 2f)$ lleva la pendiente a cero en los vértices y lo borra.' },
    { e: 'Olvidar normalizar el fbm', por: 'Con ganancia 0,5 y muchas octavas la suma llega casi a 2 y el color se satura a blanco. Se divide entre la suma de amplitudes, $\\frac{1 - g^n}{1 - g}$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Interpolar dentro de la celda',
    level: 'basico',
    gen: function (r) {
      var a = r.real(0, 1, 3), b = r.real(0, 1, 3), c = r.real(0, 1, 3), d = r.real(0, 1, 3);
      var fx = r.real(0.1, 0.9, 2), fy = r.real(0.1, 0.9, 2);
      var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
      var ab = a + (b - a) * ux, cd = c + (d - c) * ux;
      return { a: a, b: b, c: c, d: d, fx: fx, fy: fy, ux: ux, uy: uy,
        ab: ab, cd: cd, v: ab + (cd - ab) * uy };
    },
    ask: function (d) {
      return 'Los cuatro vértices de la celda valen <code>a = ' + U.fmt(d.a, 3) + '</code> (abajo ' +
        'izquierda), <code>b = ' + U.fmt(d.b, 3) + '</code> (abajo derecha), <code>c = ' +
        U.fmt(d.c, 3) + '</code> (arriba izquierda) y <code>d = ' + U.fmt(d.d, 3) + '</code> ' +
        '(arriba derecha).<br><br>El píxel cae en <code>f = (' + U.fmt(d.fx, 2) + ', ' +
        U.fmt(d.fy, 2) + ')</code> dentro de la celda. Aplica el suavizado ' +
        '$u = f^2(3-2f)$ y luego los tres <code>mix</code>. ¿Qué valor sale? (cuatro decimales)';
    },
    fields: [
      { name: 'ux', label: 'u.x', w: 'tiny' },
      { name: 'v', label: 'valor final', w: 'tiny' }
    ],
    sol: function (d) { return { ux: U.round(d.ux, 8), v: U.round(d.v, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'Primero suaviza las dos componentes por separado. Luego mezcla abajo ($a$ con $b$) y ' +
        'arriba ($c$ con $d$) usando <code>u.x</code>, y por último mezcla esos dos resultados con ' +
        '<code>u.y</code>. Recuerda que $\\operatorname{mix}(a,b,t) = a + (b-a)t$.';
    },
    steps: function (d) {
      return ['$u_x = ' + U.fmt(d.fx, 2) + '^2\\,(3 - 2\\cdot' + U.fmt(d.fx, 2) + ') = ' + U.fmt(d.ux, 4) + '$',
        '$u_y = ' + U.fmt(d.fy, 2) + '^2\\,(3 - 2\\cdot' + U.fmt(d.fy, 2) + ') = ' + U.fmt(d.uy, 4) + '$',
        'Abajo: $\\operatorname{mix}(' + U.fmt(d.a, 3) + ', ' + U.fmt(d.b, 3) + ', ' + U.fmt(d.ux, 4) +
          ') = ' + U.fmt(d.ab, 4) + '$',
        'Arriba: $\\operatorname{mix}(' + U.fmt(d.c, 3) + ', ' + U.fmt(d.d, 3) + ', ' + U.fmt(d.ux, 4) +
          ') = ' + U.fmt(d.cd, 4) + '$',
        'Y entre ambas: $\\operatorname{mix}(' + U.fmt(d.ab, 4) + ', ' + U.fmt(d.cd, 4) + ', ' +
          U.fmt(d.uy, 4) + ') = ' + U.fmt(d.v, 4) + '$'];
    },
    answer: function (d) { return 'u.x = ' + U.fmt(d.ux, 4) + ' · valor = ' + U.fmt(d.v, 4); }
  });

  p.exercise({
    title: 'Cuánto suma el fbm',
    level: 'medio',
    gen: function (r) {
      var g = r.pick([0.4, 0.5, 0.55, 0.6, 0.65]);
      var n = r.int(3, 7);
      var tot = (1 - Math.pow(g, n)) / (1 - g);
      return { g: g, n: n, tot: tot, lim: 1 / (1 - g), a: Math.pow(g, n - 1) };
    },
    ask: function (d) {
      return 'Un <em>fbm</em> de <strong>' + d.n + ' octavas</strong> con ganancia <strong>' +
        U.fmt(d.g, 2) + '</strong> empieza con amplitud 1 y la multiplica por la ganancia en cada ' +
        'vuelta.<br><br>¿Cuál es la <strong>amplitud de la última octava</strong> y cuál el ' +
        '<strong>valor máximo</strong> que puede alcanzar la suma antes de normalizar? Y si hubiera ' +
        'infinitas octavas, ¿a qué tendería ese máximo? (cuatro decimales)';
    },
    fields: [
      { name: 'a', label: 'amplitud última', w: 'tiny' },
      { name: 's', label: 'suma máxima', w: 'tiny' },
      { name: 'l', label: 'límite infinito', w: 'tiny' }
    ],
    sol: function (d) {
      return { a: U.round(d.a, 8), s: U.round(d.tot, 8), l: U.round(d.lim, 8) };
    },
    tol: 3e-4,
    hint: function (d) {
      return 'Las amplitudes son $1, g, g^2, \\dots$: una progresión geométrica. La última es ' +
        '$g^{n-1}$ porque la primera ya cuenta como octava. Para la suma, la fórmula de la ' +
        '[[fn-series|serie geométrica]]: $\\frac{1-g^n}{1-g}$.';
    },
    steps: function (d) {
      return ['Amplitudes: $1,\\ ' + U.fmt(d.g, 2) + ',\\ ' + U.fmt(d.g * d.g, 4) + ',\\ \\dots$ hasta ' +
        '$g^{' + (d.n - 1) + '} = ' + U.fmt(d.a, 4) + '$',
        'Suma de ' + d.n + ' términos: $\\dfrac{1 - ' + U.fmt(d.g, 2) + '^{' + d.n + '}}{1 - ' +
          U.fmt(d.g, 2) + '} = ' + U.fmt(d.tot, 4) + '$',
        'Con infinitas: $\\dfrac{1}{1 - ' + U.fmt(d.g, 2) + '} = ' + U.fmt(d.lim, 4) + '$, porque la ' +
          'razón es menor que 1 y la serie converge.',
        'Dividir entre ' + U.fmt(d.tot, 4) + ' es lo que devuelve el resultado al intervalo $[0,1]$.'];
    },
    answer: function (d) {
      return 'amplitud ' + U.fmt(d.a, 4) + ' · suma ' + U.fmt(d.tot, 4) + ' · límite ' + U.fmt(d.lim, 4);
    }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float v = hash(floor(p * 8.0));',
          o: ['Una cuadrícula de cuadrados, cada uno de un gris al azar', 'Nubes suaves', 'Estática que cambia de un píxel a otro', 'Un degradado'],
          por: 'Todos los píxeles de una misma celda tienen el mismo <code>floor</code>, así que reciben el mismo número al azar: bloques de gris uniforme.' },
        { c: 'float v = hash(fragCoord);',
          o: ['Estática: cada píxel con un gris al azar, como una tele sin señal', 'Cuadrados grandes de grises', 'Nubes suaves', 'Una pantalla gris uniforme'],
          por: 'Cada píxel tiene una coordenada distinta, así que cada uno recibe su propio número al azar, sin relación con el vecino.' },
        { c: 'float v = ruido(p * 4.0);',
          o: ['Manchas suaves y borrosas, todas de un tamaño parecido', 'Estática', 'Nubes con detalle a muchas escalas', 'Rayas regulares'],
          por: 'El ruido interpola suavemente entre los valores de las esquinas de una rejilla: sale una sola escala de manchas, sin detalle fino.' },
        { c: 'float v = 0.5 * ruido(p * 4.0) + 0.25 * ruido(p * 8.0) + 0.125 * ruido(p * 16.0);',
          o: ['Nubes con detalle a varias escalas: manchas grandes de borde rugoso', 'Manchas suaves de un solo tamaño', 'Estática', 'Cuadrados de grises'],
          por: 'Cada octava dobla la frecuencia y reduce a la mitad la amplitud: las manchas grandes llevan encima detalles cada vez más pequeños.' },
        { c: 'float v = hash(floor(p * 8.0) + floor(iTime));',
          o: ['Cuadrados de grises al azar que cambian todos de golpe una vez por segundo', 'Cuadrados que cambian de gris suavemente', 'Estática que cambia en cada fotograma', 'Una imagen quieta'],
          por: '<code>floor(iTime)</code> solo cambia al empezar cada segundo; entre tanto, el hash recibe los mismos números y la imagen no se mueve.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'Con <code>p</code> centrada, <code>hash</code> y <code>ruido</code> como en el tema y el color final <code>vec3(v)</code>, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿El número al azar cambia de un píxel a otro, de una celda a otra o de forma continua?', '¿Hay una sola escala de detalle o varias sumadas?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe el paso de la octava',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'que cada octava vaya al <strong>doble de frecuencia</strong> y a la <strong>mitad de amplitud</strong>',
          ref: 'suma += a * ruido(p); p *= 2.0; a *= 0.5;' },
        { pide: 'que cada octava vaya al <strong>triple de frecuencia</strong> y a la <strong>mitad de amplitud</strong>',
          ref: 'suma += a * ruido(p); p *= 3.0; a *= 0.5;' },
        { pide: 'que cada octava vaya al <strong>doble de frecuencia</strong> y a la <strong>tercera parte de amplitud</strong>',
          ref: 'suma += a * ruido(p); p *= 2.0; a *= 0.3333333;' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa el cuerpo del bucle para ' + d.pide + ':<br>' +
        '<pre class="shd__mini">float suma = 0.0, a = 1.0;\nfor (int k = 0; k &lt; 4; k++) {\n    <strong>???</strong>\n}\ncolor = vec4(vec3(suma * 0.5), 1.0);</pre>' +
        'Tres instrucciones, con sus punto y coma.';
    },
    fields: [{ name: 'c', label: 'el cuerpo del bucle', w: 'wide' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe las tres instrucciones.' };
      function env(x) {
        return 'float hash(vec2 q){ return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }\n' +
          'float ruido(vec2 q){\n' +
          '  vec2 i = floor(q), f = fract(q);\n' +
          '  vec2 u = f * f * (3.0 - 2.0 * f);\n' +
          '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),\n' +
          '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);\n}\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = 4.0 * fragCoord / iResolution.y;\n' +
          '  float suma = 0.0, a = 1.0;\n' +
          '  for (int k = 0; k < 4; k++) {\n    ' + x + '\n  }\n' +
          '  color = vec4(vec3(suma * 0.5), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 9 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Recuerda los punto y coma y que los números llevan ' +
          'punto decimal: <code>2.0</code>, no <code>2</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero el resultado no coincide. Repasa el orden: primero ' +
          'se acumula con la amplitud actual, y solo después se cambian <code>p</code> y ' +
          '<code>a</code> para la vuelta siguiente.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Tres cosas por vuelta: acumular <code>a * ruido(p)</code>, apretar el espacio ' +
        'multiplicando <code>p</code>, y encoger la amplitud multiplicando <code>a</code>.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Acumular antes de modificar: si cambias <code>a</code> primero, la primera octava ya entra ' +
        'rebajada y el resultado sale más apagado.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'El ruido de gradiente sortea pendientes en lugar de valores: vale 0 en las esquinas y evita el aspecto cuadriculado del ruido de valor.',
    'Un shader no puede tirar los dados: necesita <strong>desorden reproducible</strong>, el mismo número para el mismo punto siempre.',
    'Un <em>hash</em> es una función que amplifica muchísimo las diferencias: la misma idea del [[av-caos|caos determinista]], usada como generador.',
    'El ruido útil sortea en los <strong>vértices de una rejilla</strong> e interpola por dentro con la curva $f^2(3-2f)$, que es lo que borra las costuras.',
    'El <em>fbm</em> suma octavas: doble de frecuencia y menos amplitud en cada vuelta. Es una [[fn-series|serie geométrica]], y por eso se sabe normalizar.',
    'La <strong>ganancia</strong> es el mando expresivo: baja da algodón, alta da roca.'
  ]);
});
