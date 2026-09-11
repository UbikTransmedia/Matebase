/* Tema: El color como función */
Course.topic('gfx-color', function (p) {

  p.puente('Hasta aquí, formas en gris. Este tema da color con tres ideas conocidas: una ' +
    '[[tr-funciones|onda]] por canal con fases distintas, una potencia que separa el valor guardado de ' +
    'la luz real, y el tono como ángulo de las [[gfx-coordenadas|coordenadas polares]].');

  p.text('Llevas siete temas dibujando formas y todas han salido de un gris o de un color puesto a ' +
    'ojo. Toca hablar del color en serio, porque es lo que separa un ejercicio de una imagen, y ' +
    'porque esconde dos ideas matemáticas que casi nadie cuenta: una que <strong>regala paletas</strong> ' +
    'y otra que explica por qué <strong>las mezclas salen sucias</strong>.');

  p.section('Una paleta en una línea');

  p.text('Tienes un número $t$ entre 0 y 1 —una distancia, una altura, un número de iteraciones— y ' +
    'quieres convertirlo en color. La solución habitual es una lista de colores y una interpolación ' +
    'entre ellos. La solución elegante es esta:');

  p.formula('\\vec{c}(t) = \\vec{a} + \\vec{b}\\,\\cos\\bigl(2\\pi\\,(\\vec{f}\\,t + \\vec{d})\\bigr)',
    'paleta de cosenos',
    'Se lee: <em>«ce de te es igual a vector a más vector b por el coseno de dos pi por, vector efe ' +
      'por te más vector de»</em>.<br><br>Los cuatro vectores tienen tres componentes, una por canal, ' +
      'y todas las operaciones se hacen <strong>canal a canal</strong>: el rojo es un coseno, el ' +
      'verde es otro y el azul otro más.');

  p.text('Doce números, y con ellos cualquier paleta suave que puedas imaginar. Cada vector tiene un ' +
    'papel muy claro:');

  p.table(['Vector', 'Qué controla'], [
    ['$\\vec{a}$', 'el <strong>centro</strong>: alrededor de qué gris oscila cada canal'],
    ['$\\vec{b}$', 'la <strong>amplitud</strong>: cuánto contraste hay entre lo más claro y lo más oscuro'],
    ['$\\vec{f}$', 'la <strong>frecuencia</strong>: cuántas veces recorre el ciclo mientras $t$ va de 0 a 1'],
    ['$\\vec{d}$', 'la <strong>fase</strong>: el desfase entre canales, que es lo que decide el tono']
  ]);

  p.text('La fase es la que hace la magia. Si los tres canales van en fase, sale una escala de ' +
    'grises. Si los desfasas un tercio de vuelta cada uno —0, ⅓, ⅔— cada canal alcanza su máximo en ' +
    'un momento distinto y sale un arcoíris completo. Es exactamente el desfase que estudiaste en ' +
    '[[tr-funciones|funciones trigonométricas]], usado como generador de color.');

  p.comprueba('Una paleta de cosenos con las tres fases iguales, $\\vec d = (0, 0, 0)$. ¿Qué produce?', [
    { t: 'Solo grises: los tres canales suben y bajan a la vez', ok: true, por: 'Si rojo, verde y azul valen siempre lo mismo, el color es gris. El tono aparece cuando un canal va por delante de otro: la fase es el color.' },
    { t: 'Un arcoíris', ok: false, por: 'El arcoíris exige que cada canal alcance su máximo en un momento distinto: fases 0, un tercio y dos tercios. Con las tres iguales no hay tono.' },
    { t: 'Un color liso', ok: false, por: 'Sigue variando con $t$: va de claro a oscuro y vuelve. Lo que no varía es el tono, porque nunca lo hay.' }
  ]);

  p.demo({
    title: 'El taller de paletas',
    intro: 'La franja de abajo es la paleta pura, de t = 0 a t = 1. Arriba, la misma paleta aplicada a unos anillos. Empieza moviendo solo las fases y mira cómo cambia el tono sin tocar nada más.',
    predice: 'Si pones las fases del verde y del azul a 0, ¿qué verás en la franja? Y con frecuencia 2, ¿cuántas veces se repetirá el arcoíris de izquierda a derecha?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-col-1', alto: 340,
        aria: 'Anillos concéntricos coloreados con una paleta de cosenos, y una franja debajo que muestra la paleta completa.',
        mandos: [
          { n: 'centro', label: 'centro (a)', min: 0, max: 1, step: 0.01, value: 0.5, dec: 2 },
          { n: 'amplitud', label: 'amplitud (b)', min: 0, max: 0.6, step: 0.01, value: 0.5, dec: 2 },
          { n: 'freq', label: 'frecuencia (f)', min: 0.2, max: 4, step: 0.1, value: 1, dec: 1 },
          { n: 'dg', label: 'fase del verde', min: 0, max: 1, step: 0.01, value: 0.33, dec: 2 },
          { n: 'db', label: 'fase del azul', min: 0, max: 1, step: 0.01, value: 0.67, dec: 2 }
        ],
        codigo:
          '// doce numeros y ya tienes paleta\n' +
          'vec3 paleta(float t)\n' +
          '{\n' +
          '    vec3 a = vec3(centro);\n' +
          '    vec3 b = vec3(amplitud);\n' +
          '    vec3 f = vec3(freq);\n' +
          '    vec3 d = vec3(0.0, dg, db);        // la fase decide el tono\n' +
          '\n' +
          '    return a + b * cos(TAU * (f * t + d));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = fragCoord / iResolution.xy;\n' +
          '\n' +
          '    // la franja de abajo: la paleta tal cual\n' +
          '    if (uv.y < 0.16) {\n' +
          '        color = vec4(paleta(uv.x), 1.0);\n' +
          '        return;\n' +
          '    }\n' +
          '\n' +
          '    // arriba: anillos que respiran\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float r = length(p) * 2.2 - iTime * 0.15;\n' +
          '\n' +
          '    color = vec4(paleta(fract(r)), 1.0);\n' +
          '}\n',
        nota: 'Pon las dos fases a cero: los tres canales van juntos y solo hay grises. Ponlas en ' +
          '0,33 y 0,67 y aparece el arcoíris. Ese único cambio es toda la diferencia entre una ' +
          'imagen en blanco y negro y una en color.'
      });
    }
  });

  p.note('Esta fórmula es de Íñigo Quílez y está en casi todos los shaders bonitos que veas por ahí, ' +
    'incluidos varios de este bloque. Merece la pena guardarse cuatro juegos de números favoritos: ' +
    'ocupan una línea y salvan cualquier imagen sosa.', null, 'Doce números que conviene tener a mano');

  p.section('El problema del amarillo que no aparece');

  p.text('Ahora la parte incómoda. Mezcla rojo puro con verde puro, mitad y mitad. Debería salir un ' +
    'amarillo brillante, porque el amarillo <em>es</em> rojo más verde. Sale un caqui apagado, feo, ' +
    'como de uniforme militar. No es culpa tuya: es culpa de que <strong>el número que le mandas a ' +
    'la pantalla no es la cantidad de luz</strong>.');

  p.text('Las pantallas responden de forma no lineal: si les mandas 0,5, no emiten la mitad de luz, ' +
    'sino aproximadamente un 22 %. Eso no es un defecto, es una decisión deliberada de hace décadas: ' +
    'el ojo distingue mucho mejor entre oscuros que entre claros, así que gastar más valores en la ' +
    'zona oscura aprovecha mejor los 256 escalones de un byte.');

  p.formulas([
    'L = v^{2{,}2} \\quad \\text{(del valor guardado a la luz real)}',
    'v = L^{1/2{,}2} \\quad \\text{(de la luz real al valor guardado)}'
  ], 'la curva gamma');

  p.text('La consecuencia práctica es contundente: <strong>sumar y promediar colores solo tiene ' +
    'sentido en luz, no en valores</strong>. Si mezclas los valores directamente estás promediando ' +
    'la escala equivocada, y por eso el punto medio sale más oscuro de lo que debería.');

  p.ejemplo({
    title: 'Tres colores de la paleta y una mezcla honesta',
    enunciado: 'Paleta con $\\vec a = \\vec b = 0{,}5$, $\\vec f = 1$ y $\\vec d = (0,\\ \\tfrac{1}{3},\\ \\tfrac{2}{3})$. Evaluarla en $t = 0$ y en $t = \\tfrac{1}{3}$. Después, mezclar a partes iguales rojo puro y verde puro, en valores y en luz.',
    pasos: [
      { t: '<strong>En $t = 0$.</strong> Rojo: $0{,}5 + 0{,}5\\cos 0 = 1$. Verde: $0{,}5 + 0{,}5\\cos\\frac{2\\pi}{3} = 0{,}25$. Azul: $0{,}5 + 0{,}5\\cos\\frac{4\\pi}{3} = 0{,}25$. Un rojo con algo de gris.', antes: 'Cada canal, la misma fórmula; solo cambia la fase.' },
      { t: '<strong>En $t = \\frac{1}{3}$.</strong> Rojo: $\\cos\\frac{2\\pi}{3} \\to 0{,}25$. Verde: $\\cos\\frac{4\\pi}{3} \\to 0{,}25$. Azul: $\\cos 2\\pi \\to 1$. Ahora manda el azul: su fase de $\\frac{2}{3}$ hace que alcance el máximo un tercio de ciclo después que el rojo.', antes: 'Suma $\\frac{1}{3}$ a cada fase antes del coseno. ¿Qué canal vale 1?' },
      { t: '<strong>Mezcla en valores.</strong> $\\frac{(1, 0, 0) + (0, 1, 0)}{2} = (0{,}5,\\ 0{,}5,\\ 0)$. En luz eso es $0{,}5^{2{,}2} \\approx 0{,}22$ por canal: un amarillo con la quinta parte de la luz. El caqui.' },
      { t: '<strong>Mezcla en luz.</strong> Rojo puro y verde puro ya están a luz 1. Media en luz: $(0{,}5,\\ 0{,}5,\\ 0)$. De vuelta a valores: $0{,}5^{1/2{,}2} \\approx 0{,}73$. Hay que mandar $(0{,}73,\\ 0{,}73,\\ 0)$: un amarillo con la mitad de la luz, que es lo que se pedía.', antes: 'Pasa a luz, promedia, y vuelve con la potencia $1/2{,}2$.' }
    ],
    cierre: 'Las dos mezclas difieren en 0,23 por canal, y esa diferencia separa un degradado sucio de uno limpio. La paleta de cosenos no tiene este problema porque no mezcla: calcula cada color directamente.'
  });

  p.demo({
    title: 'La misma mezcla, dos veces',
    intro: 'Dos degradados idénticos entre los mismos dos colores. El de arriba mezcla los valores tal cual; el de abajo pasa a luz, mezcla, y vuelve. Mira el centro de cada uno.',
    predice: 'Con negro a blanco y gamma 2,2, ¿el gris del centro del degradado de abajo será más claro o más oscuro que el de arriba? ¿Valdrá 0,5 o 0,73?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-col-2', alto: 300,
        aria: 'Dos degradados entre los mismos dos colores, uno mezclado en valores y otro mezclado en luz.',
        mandos: [
          { n: 'gamma', label: 'gamma', min: 1, max: 3, step: 0.05, value: 2.2, dec: 2 },
          { n: 'cual', label: 'colores', min: 0, max: 2, step: 1, value: 0, dec: 0 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = fragCoord / iResolution.xy;\n' +
          '\n' +
          '    vec3 c1 = vec3(1.0, 0.0, 0.0);      // rojo\n' +
          '    vec3 c2 = vec3(0.0, 1.0, 0.0);      // verde\n' +
          '    if (cual > 0.5) { c1 = vec3(0.0, 0.35, 1.0); c2 = vec3(1.0, 0.9, 0.0); }\n' +
          '    if (cual > 1.5) { c1 = vec3(0.0); c2 = vec3(1.0); }\n' +
          '\n' +
          '    float t = uv.x;\n' +
          '    vec3 c;\n' +
          '\n' +
          '    if (uv.y > 0.5) {\n' +
          '        // MAL: mezclar los valores directamente\n' +
          '        c = mix(c1, c2, t);\n' +
          '    } else {\n' +
          '        // BIEN: a luz, mezclar, y volver\n' +
          '        vec3 l1 = pow(c1, vec3(gamma));\n' +
          '        vec3 l2 = pow(c2, vec3(gamma));\n' +
          '        c = pow(mix(l1, l2, t), vec3(1.0 / gamma));\n' +
          '    }\n' +
          '\n' +
          '    // una linea fina para separar los dos\n' +
          '    float sep = abs(fragCoord.y - 0.5 * iResolution.y);\n' +
          '    color = vec4(mix(vec3(0.0), c, step(1.5, sep)), 1.0);\n' +
          '}\n',
        nota: 'Con la gamma a 1 los dos degradados son idénticos, porque no se corrige nada. Súbela ' +
          'a 2,2 —el valor real de una pantalla— y el degradado de abajo se ilumina por el centro. ' +
          'El tercer par de colores, negro a blanco, enseña el efecto en su forma más limpia: ' +
          '¿dónde está el gris medio de verdad?'
      });
    }
  });

  p.note('El gris que a un ojo humano le parece «la mitad» entre el negro y el blanco no es el 0,5, ' +
    'sino aproximadamente el <strong>0,73</strong> —que en luz es $0{,}73^{2,2} \\approx 0{,}5$—. ' +
    'Por eso una imagen reducida a la mitad de tamaño con un programa mal escrito sale más oscura ' +
    'que el original: ha promediado valores en vez de luz, y ese error lleva décadas repitiéndose en ' +
    'software profesional.', 'warn', 'El gris medio no es 0,5');

  p.text('En la práctica, el remedio del oficio cabe en dos líneas: se calcula todo en luz y se ' +
    'aplica una raíz al final, que es lo que hacía aquel <code>sqrt</code> del tema de ' +
    '[[gfx-raymarching|raymarching]]. La raíz es una gamma de 2 en vez de 2,2: no es exacta, pero ' +
    'cuesta un ciclo y acierta casi.');

  p.section('HSV: el tono es un ángulo');

  p.text('Una pantalla mezcla rojo, verde y azul porque así funcionan sus luces. Pero nadie piensa así un ' +
    'color. Se piensa en qué color es —rojo, naranja, azul—, en lo vivo o apagado que está y en lo claro u ' +
    'oscuro. Esas tres ideas son el modelo <strong>HSV</strong>: tono (<em>hue</em>), saturación y valor o brillo.');

  p.text('Lo interesante matemáticamente es el tono: <strong>es un ángulo</strong>. Los colores puros forman ' +
    'una rueda en la que, después del magenta, se vuelve al rojo. Por eso el tono se mide en grados, o en ' +
    'fracciones de vuelta de 0 a 1, y por eso se puede calcular con un [[gfx-coordenadas|atan]]: una rueda ' +
    'de colores es, literalmente, las coordenadas polares pintadas.');

  p.formula('\\text{rgb} = V\\cdot\\operatorname{mix}\\left(\\vec 1,\\ \\operatorname{clamp}\\left(\\left|\\operatorname{mod}(6H + (0, 4, 2),\\ 6) - 3\\right| - 1,\\ 0,\\ 1\\right),\\ S\\right)',
    'de HSV a RGB en una línea, con H entre 0 y 1',
    'Cada canal es la misma onda en forma de trapecio, desplazada un tercio de vuelta: los sumandos 0, 4 y 2 ' +
    '(sextos de vuelta) hacen que el rojo tenga su máximo en $H = 0$, el verde en $H = \\frac{1}{3}$ y el azul en ' +
    '$H = \\frac{2}{3}$.<br><br>$S$ mezcla ese color puro con el blanco: con $S = 0$ sale gris. $V$ lo oscurece ' +
    'multiplicando: con $V = 0$ sale negro.<br><br>En GLSL: <code>vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return v * mix(vec3(1.0), k, s);</code>');

  p.demo({
    title: 'La rueda de colores',
    intro: 'El ángulo de cada punto es su tono y la distancia al centro, su saturación: en el centro, blanco; en el borde, el color puro. Baja el brillo para ver cómo todo tiende al negro, y hazla girar: girar la rueda es sumar una constante al tono.',
    predice: 'Con brillo 1, ¿de qué color es el centro exacto de la rueda? Y si la giras media vuelta, ¿qué color ocupará el sitio del rojo?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-color-hsv', alto: 300,
        aria: 'Una rueda de colores: el tono cambia con el ángulo y la saturación con la distancia al centro.',
        mandos: [
          { n: 'brillo', label: 'brillo V', min: 0.0, max: 1.0, step: 0.01, value: 1.0, dec: 2 },
          { n: 'giro', label: 'velocidad de giro', min: 0.0, max: 2.0, step: 0.05, value: 0.3, dec: 2 }
        ],
        codigo:
          'vec3 hsv2rgb(vec3 c)\n' +
          '{\n' +
          '    vec3 k = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);\n' +
          '    return c.z * mix(vec3(1.0), k, c.y);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float r = length(p) / 0.45;\n' +
          '\n' +
          '    // el tono es el angulo, pasado a fraccion de vuelta\n' +
          '    float h = fract(atan(p.y, p.x) / TAU + 0.1 * giro * iTime);\n' +
          '    vec3 c = hsv2rgb(vec3(h, clamp(r, 0.0, 1.0), brillo));\n' +
          '\n' +
          '    float dentro = 1.0 - smoothstep(1.0, 1.01, r);\n' +
          '    color = vec4(mix(vec3(0.1), c, dentro), 1.0);\n' +
          '}\n',
        nota: 'Mezclar dos colores en HSV y en RGB no da lo mismo: a medio camino entre rojo y verde, RGB da un marrón apagado y HSV da amarillo, porque recorre la rueda.'
      });
    }
  });

  p.section('El color como señal');

  p.text('Merece la pena quedarse con el cambio de mentalidad. Un color no es un nombre ni una ' +
    'muestra de pintura: es una <strong>terna de números que atraviesa funciones</strong>. Puedes ' +
    'sumarlo, multiplicarlo, elevarlo, meterlo en un coseno o interpolarlo, y cada operación tiene ' +
    'un efecto visual que se aprende a reconocer:');

  p.table(['Operación', 'Qué se ve'], [
    ['<code>c * k</code>', 'más brillo (o menos): es <strong>exposición</strong>'],
    ['<code>pow(c, vec3(k))</code>', 'cambia el contraste de los medios sin tocar el negro ni el blanco'],
    ['<code>mix(vec3(gris), c, k)</code>', 'saturar o desaturar, según <code>k</code> pase o no de 1'],
    ['<code>1.0 - c</code>', 'el negativo'],
    ['<code>c.bgr</code>', 'intercambiar canales: gratis, y a veces salva una paleta']
  ]);

  p.text('Y ese gris de la tercera fila no es el promedio de los tres canales: el ojo es mucho más ' +
    'sensible al verde que al azul, así que la <strong>luminancia</strong> se pesa. La receta ' +
    'estándar es <code>dot(c, vec3(0.2126, 0.7152, 0.0722))</code>, y esos tres números son un ' +
    'resumen de cómo está construida tu retina.');

  p.util('Todo esto sale de la industria y no del arte. La curva gamma nació de la física de los ' +
    'tubos de rayos catódicos, que respondían a la tensión con una potencia de 2,2; cuando llegaron ' +
    'las pantallas planas, que son lineales, se les añadió la curva a propósito para no romper la ' +
    'compatibilidad con cincuenta años de imágenes. Los pesos de la luminancia vienen de medir a ' +
    'personas reales mirando parpadeos de colores en un laboratorio. Y las paletas de coseno vienen ' +
    'de un demoscener que no quería gastar cuatro kilobytes en una tabla de colores.');

  p.hist('El desacuerdo sobre el color es viejo y jugoso. Newton dividió el espectro en siete ' +
    'colores por razones musicales, no ópticas: quería que hubiera tantos como notas. Goethe le ' +
    'llevó la contraria con un tratado entero. Y en 1931 la CIE midió por fin la respuesta del ojo ' +
    'humano promediando a diecisiete observadores británicos, cuyos ojos siguen siendo, noventa años ' +
    'después, el patrón con el que tu pantalla decide qué es el rojo.');

  p.trampas([
    { e: 'Mezclar colores promediando los valores', por: 'Rojo y verde a medias dan $(0{,}5, 0{,}5, 0)$, que en luz es un 22 %: caqui. Se pasa a luz con la potencia 2,2, se promedia allí y se vuelve.' },
    { e: 'Creer que el gris medio es 0,5', por: 'A la vista, la mitad entre negro y blanco es 0,73, porque $0{,}73^{2{,}2} \\approx 0{,}5$. Una imagen reducida promediando valores sale más oscura.' },
    { e: 'Calcular el gris como promedio de los tres canales', por: 'El ojo pesa mucho más el verde: la luminancia es $0{,}21 R + 0{,}72 G + 0{,}07 B$. Un azul puro es mucho más oscuro que un verde puro con el mismo valor.' },
    { e: 'Buscar el tono en la amplitud o el centro', por: 'Con las tres fases iguales solo hay grises, por mucho que se muevan $a$ y $b$. El tono está en el desfase entre canales, y en nada más.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Evaluar la paleta',
    level: 'basico',
    gen: function (r) {
      var a = r.pick([0.5, 0.5, 0.6]), b = r.pick([0.5, 0.4, 0.45]);
      var f = r.pick([1, 1, 2]);
      var t = r.real(0, 1, 2);
      var d = [0, r.pick([0.33, 0.25, 0.1]), r.pick([0.67, 0.5, 0.2])];
      var c = d.map(function (dk) { return a + b * Math.cos(2 * Math.PI * (f * t + dk)); });
      return { a: a, b: b, f: f, t: t, d: d, c: c };
    },
    ask: function (d) {
      return 'Con $\\vec{a} = ' + U.fmt(d.a, 2) + '$, $\\vec{b} = ' + U.fmt(d.b, 2) + '$, ' +
        '$\\vec{f} = ' + d.f + '$ y fases $\\vec{d} = (0,\\ ' + U.fmt(d.d[1], 2) + ',\\ ' +
        U.fmt(d.d[2], 2) + ')$, evalúa la paleta en $t = ' + U.fmt(d.t, 2) + '$.<br><br>¿Qué color ' +
        'sale? (cuatro decimales por canal)';
    },
    fields: [
      { name: 'r', label: 'rojo', w: 'tiny' },
      { name: 'g', label: 'verde', w: 'tiny' },
      { name: 'b', label: 'azul', w: 'tiny' }
    ],
    sol: function (d) {
      return { r: U.round(d.c[0], 8), g: U.round(d.c[1], 8), b: U.round(d.c[2], 8) };
    },
    tol: 3e-4,
    hint: function () {
      return 'Cada canal por separado, con la misma fórmula y solo cambiando la fase. Y el coseno en ' +
        '<strong>radianes</strong>: el argumento es $2\\pi$ por lo de dentro.';
    },
    steps: function (d) {
      var s = [];
      ['rojo', 'verde', 'azul'].forEach(function (n, i) {
        s.push('El ' + n + ': $' + U.fmt(d.a, 2) + ' + ' + U.fmt(d.b, 2) + '\\cos(2\\pi(' + d.f +
          '\\cdot' + U.fmt(d.t, 2) + ' + ' + U.fmt(d.d[i], 2) + ')) = ' + U.fmt(d.c[i], 4) + '$');
      });
      s.push('Los tres canales son la misma onda: lo único que los distingue es <strong>cuándo</strong> ' +
        'alcanza cada uno su máximo.');
      return s;
    },
    answer: function (d) {
      return '(' + d.c.map(function (x) { return U.fmt(x, 4); }).join(', ') + ')';
    }
  });

  p.exercise({
    title: 'La mezcla honesta',
    level: 'medio',
    gen: function (r) {
      var v1 = r.real(0.05, 0.45, 2), v2 = r.real(0.55, 0.98, 2);
      var g = 2.2;
      var mal = (v1 + v2) / 2;
      var bien = Math.pow((Math.pow(v1, g) + Math.pow(v2, g)) / 2, 1 / g);
      return { v1: v1, v2: v2, g: g, mal: mal, bien: bien, l1: Math.pow(v1, g), l2: Math.pow(v2, g) };
    },
    ask: function (d) {
      return 'Un canal vale <code>' + U.fmt(d.v1, 2) + '</code> en un color y <code>' + U.fmt(d.v2, 2) +
        '</code> en el otro. Quieres el punto medio exacto entre ambos, con gamma 2,2.<br><br>' +
        'Calcula el promedio <strong>tal cual</strong> y el promedio <strong>hecho en luz</strong> ' +
        '(pasar a luz, promediar, volver). (cuatro decimales)';
    },
    fields: [
      { name: 'm', label: 'promedio directo', w: 'tiny' },
      { name: 'b', label: 'promedio en luz', w: 'tiny' }
    ],
    sol: function (d) { return { m: U.round(d.mal, 8), b: U.round(d.bien, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'Para pasar a luz, eleva a 2,2. Promedia allí. Para volver, eleva a $1/2{,}2$, que es ' +
        'aproximadamente $0{,}4545$.';
    },
    steps: function (d) {
      return ['Promedio directo: $\\frac{' + U.fmt(d.v1, 2) + ' + ' + U.fmt(d.v2, 2) + '}{2} = ' +
        U.fmt(d.mal, 4) + '$',
        'En luz: $' + U.fmt(d.v1, 2) + '^{2,2} = ' + U.fmt(d.l1, 4) + '$ y $' + U.fmt(d.v2, 2) +
          '^{2,2} = ' + U.fmt(d.l2, 4) + '$',
        'Promedio en luz: $\\frac{' + U.fmt(d.l1, 4) + ' + ' + U.fmt(d.l2, 4) + '}{2} = ' +
          U.fmt((d.l1 + d.l2) / 2, 4) + '$',
        'De vuelta a valores: $' + U.fmt((d.l1 + d.l2) / 2, 4) + '^{1/2,2} = ' + U.fmt(d.bien, 4) + '$',
        'El honesto sale <strong>más claro</strong> (por ' + U.fmt(d.bien - d.mal, 4) + '), y esa ' +
          'diferencia es exactamente el caqui apagado del ejemplo del rojo y el verde.'];
    },
    answer: function (d) { return 'directo ' + U.fmt(d.mal, 4) + ' · en luz ' + U.fmt(d.bien, 4); }
  });

  p.exercise({
    title: 'Del tono al color',
    level: 'medio',
    gen: function (r) {
      var H = r.pick([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]), S = r.pick([1, 0.5]), V = r.pick([1, 0.8]);
      function onda(h) {
        return [0, 4, 2].map(function (k) { var x = ((h * 6 + k) % 6 + 6) % 6; return Math.max(0, Math.min(1, Math.abs(x - 3) - 1)); });
      }
      function mezcla(base) { return base.map(function (b) { return V * (1 + (b - 1) * S); }); }
      var base = onda(H / 360), rgb = mezcla(base), mal = mezcla(onda(H));
      return { H: H, S: S, V: V, base: base, rgb: rgb, mal: mal };
    },
    ask: function (d) {
      return 'Con la función <code>hsv2rgb</code> del tema, ¿qué color RGB sale para un tono de $' + d.H + '^\\circ$, saturación $' + U.fmt(d.S, 1) + '$ y brillo $' + U.fmt(d.V, 1) +
        '$? (Cada canal entre 0 y 1, tres decimales.)';
    },
    fields: [{ name: 'r', label: 'R', w: 'tiny' }, { name: 'g', label: 'G', w: 'tiny' }, { name: 'b', label: 'B', w: 'tiny' }],
    sol: function (d) { return { r: U.round(d.rgb[0], 6), g: U.round(d.rgb[1], 6), b: U.round(d.rgb[2], 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) {
      var distinto = d.mal.some(function (x, i) { return Math.abs(x - d.rgb[i]) > 2e-3; });
      return distinto && Math.abs(v.r - d.mal[0]) < 5e-4 && Math.abs(v.g - d.mal[1]) < 5e-4 && Math.abs(v.b - d.mal[2]) < 5e-4;
    }, msg: 'En la fórmula el tono va de 0 a 1: hay que dividir los grados entre 360 antes de multiplicar por 6.' }],
    hint: function () { return ['Pasa el tono a fracción de vuelta: $H = \\frac{\\text{grados}}{360}$.', 'Calcula $|\\operatorname{mod}(6H + k, 6) - 3| - 1$ para $k = 0, 4, 2$, recórtalo a $[0, 1]$, mézclalo con 1 según $S$ y multiplica por $V$.']; },
    steps: function (d) {
      var h6 = d.H / 60;
      return ['$H = \\frac{' + d.H + '}{360}$, así que $6H = ' + U.fmt(h6, 1) + '$.',
        'Onda de cada canal (sumando 0, 4 y 2, módulo 6, menos 3, en valor absoluto, menos 1 y recortado): $(' + d.base.map(function (x) { return U.fmt(x, 3); }).join(',\\ ') + ')$',
        'Con $S = ' + U.fmt(d.S, 1) + '$ y $V = ' + U.fmt(d.V, 1) + '$: $(' + d.rgb.map(function (x) { return U.fmt(x, 3); }).join(',\\ ') + ')$'];
    },
    answer: function (d) { return '(' + d.rgb.map(function (x) { return U.fmt(x, 3); }).join(', ') + ')'; }
  });

  p.exercise({
    title: 'Escribe la paleta',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'una <strong>escala de grises</strong> que va de negro a blanco y vuelve a negro mientras $t$ va de 0 a 1 (los tres canales en fase, sin desfase)',
          ref: 'vec3(0.5) + vec3(0.5) * cos(TAU * (vec3(1.0) * t + vec3(0.5)))' },
        { pide: 'un <strong>arcoíris</strong> completo: mismo centro y amplitud 0,5, frecuencia 1, y los canales desfasados en 0, un tercio y dos tercios',
          ref: 'vec3(0.5) + vec3(0.5) * cos(TAU * (vec3(1.0) * t + vec3(0.0, 0.3333, 0.6667)))' },
        { pide: 'un <strong>degradado de fuego</strong>: centro 0,5, amplitud 0,5, frecuencia 1 y fases 0, 0,1 y 0,2',
          ref: 'vec3(0.5) + vec3(0.5) * cos(TAU * (vec3(1.0) * t + vec3(0.0, 0.1, 0.2)))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe la paleta para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec3 paleta(float t)\n{\n    return <strong>???</strong> ;\n}</pre>' +
        'La forma es siempre <code>a + b * cos(TAU * (f * t + d))</code>, con los cuatro como <code>vec3</code>.';
    },
    fields: [{ name: 'v', label: 'la paleta', w: 'wide' }],
    sol: function (d) { return { v: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.v || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'vec3 paleta(float t){ return ' + x + '; }\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  float t = fragCoord.x / iResolution.x;\n' +
          '  color = vec4(paleta(t), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 7 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado tiene que ser un <code>vec3</code>, y ' +
          '<code>TAU</code> ya está definido: vale $2\\pi$.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la rampa no es la pedida. Repasa las fases: son lo ' +
          'único que decide el tono.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Sin desfase entre canales no hay color, solo grises. Un tercio de vuelta entre cada ' +
        'canal da el arcoíris. Y ojo con dónde empieza: una fase global de $0{,}5$ arranca la rampa ' +
        'en el mínimo en vez de en el máximo.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Doce números para una paleta entera, y ningún dato guardado en ninguna parte.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'En HSV el tono es un ángulo: una rueda de colores son las coordenadas polares pintadas, y girarla es sumar al tono.',
    'Una <strong>paleta de cosenos</strong> convierte un número en color con doce parámetros: centro, amplitud, frecuencia y fase por canal.',
    'La <strong>fase</strong> es lo que crea el tono. Sin desfase entre canales solo hay grises.',
    'El valor que guarda una imagen <strong>no es la cantidad de luz</strong>: hay una potencia de 2,2 en medio.',
    'Por eso las mezclas hay que hacerlas <strong>en luz</strong>, elevando a 2,2 antes y a $1/2{,}2$ después. El atajo del oficio es un <code>sqrt</code> al final.',
    'El gris que parece la mitad es 0,73, no 0,5.',
    'Un color es una terna de números que atraviesa funciones: multiplicar es exponer, elevar es contrastar, interpolar contra el gris es saturar.'
  ]);
});
