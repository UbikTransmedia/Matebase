/* Tema: La actuación */
Course.topic('gfx-directo', function (p) {

  p.puente('Último tema del curso, y no hay técnica nueva: se apilan las capas con el ' +
    '[[gfx-decidir|mix]] de siempre, se suman cuando son luz, se atan varios parámetros a un solo mando ' +
    'y se fabrica un pulso con <code>fract</code> y una potencia. Es el oficio de juntar lo que ya sabes.');

  p.text('Último tema del bloque y del curso. Aquí no hay técnica nueva: hay ' +
    '<strong>oficio</strong>. Cómo se junta todo lo anterior en una pieza que aguante mirándose diez ' +
    'minutos, cómo se toca en directo delante de gente, y adónde ir cuando esto se quede pequeño.');

  p.section('Una pieza son capas');

  p.text('Nadie escribe un shader bonito de un tirón. Se construye por capas, como un cuadro: un ' +
    'fondo que ocupe la pantalla, un plano medio que dé estructura, y algo delante que dé el detalle. ' +
    'Cada capa devuelve un color y una <strong>máscara</strong>, un número entre 0 y 1 que dice ' +
    'cuánto tapa, y se apilan con la operación de siempre:');

  p.formula('c = \\operatorname{mix}\\bigl(c_{\\text{debajo}},\\ c_{\\text{encima}},\\ \\alpha\\bigr)',
    'apilar una capa sobre otra',
    'Es la operación <em>over</em>, y es la misma que usa cualquier programa de dibujo cuando ' +
      'superpone dos capas. Encadenada, apila tantas como quieras: se empieza por el fondo y se van ' +
      'poniendo cosas encima.');

  p.comprueba('Dos focos iluminan la misma pared. ¿Qué hace la luz del segundo con la del primero?', [
    { t: 'Se suma: la pared queda más iluminada que con uno solo', ok: true, por: 'La luz se acumula. Por eso las capas que representan luz se componen sumando, y por eso una composición aditiva puede pasar de 1 y necesita comprimir el tono al final.' },
    { t: 'La tapa: el foco más cercano gana', ok: false, por: 'Eso es lo que hace la materia: un objeto delante oculta al de detrás. La luz no oculta luz. Tapar es para materia; sumar, para luz.' },
    { t: 'Se promedian: la pared queda a medio camino', ok: false, por: 'Promediar daría menos luz que el foco más fuerte solo, y eso no ocurre. Dos focos son más luz que uno.' }
  ]);

  p.text('Hay una segunda forma de juntar capas que en visuales se usa muchísimo: ' +
    '<strong>sumar</strong> en vez de tapar. Sumar es lo que hace la luz de verdad —dos focos sobre ' +
    'la misma pared dan más luz, no uno de los dos— y da ese aspecto de brillo y de neón que no se ' +
    'consigue tapando. La regla práctica: <em>tapa lo que sea materia, suma lo que sea luz</em>.');

  p.demo({
    title: 'Tres capas y una mesa de luces',
    intro: 'Fondo, plano medio y frente, con un mando de peso para cada uno y un interruptor para pasar de tapar a sumar. Ponlos todos a cero y súbelos de uno en uno para ver qué aporta cada capa.',
    predice: 'Con «sumar» activado y los tres pesos a 1, ¿la roseta ocultará la rejilla o la encenderá? Y al desactivarlo, ¿qué cambia donde se cruzan?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-dir-1', alto: 380,
        aria: 'Una composición de tres capas —fondo de humo, rejilla y roseta— con controles de peso independientes.',
        mandos: [
          { n: 'wFondo', label: 'fondo', min: 0, max: 1, step: 0.05, value: 1, dec: 2 },
          { n: 'wMedio', label: 'plano medio', min: 0, max: 1, step: 0.05, value: 0.7, dec: 2 },
          { n: 'wFrente', label: 'frente', min: 0, max: 1, step: 0.05, value: 0.8, dec: 2 },
          { n: 'aditivo', label: 'sumar en vez de tapar', min: 0, max: 1, step: 1, value: 1, dec: 0 }
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
          'vec3 paleta(float t)\n' +
          '{\n' +
          '    return 0.5 + 0.5 * cos(TAU * (t + vec3(0.0, 0.33, 0.67)));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float t = iTime * 0.25;\n' +
          '\n' +
          '    // ---- CAPA 1: el fondo, humo lento y oscuro\n' +
          '    float n = fbm(p * 1.8 + vec2(t * 0.3, 0.0));\n' +
          '    vec3 fondo = paleta(n * 0.5 + 0.55) * n * 0.55;\n' +
          '\n' +
          '    // ---- CAPA 2: una rejilla que respira\n' +
          '    vec2 q = p * (5.0 + 2.0 * sin(t));\n' +
          '    float dRej = abs(length(fract(q) - 0.5) - 0.34);\n' +
          '    float aMedio = (1.0 - smoothstep(0.0, fwidth(dRej) * 1.5, dRej)) * wMedio;\n' +
          '    vec3 medio = paleta(n + 0.3) * 0.9;\n' +
          '\n' +
          '    // ---- CAPA 3: una roseta delante\n' +
          '    float r = length(p), a = atan(p.y, p.x) + t;\n' +
          '    a = abs(mod(a, TAU / 7.0) - PI / 7.0);\n' +
          '    vec2 s = r * vec2(cos(a), sin(a));\n' +
          '    float dRos = length(s - vec2(0.34, 0.0)) - 0.055;\n' +
          '    float aFrente = (1.0 - smoothstep(0.0, fwidth(dRos) * 2.0, dRos)) * wFrente;\n' +
          '    vec3 frente = vec3(1.0, 0.92, 0.75);\n' +
          '\n' +
          '    // ---- APILAR\n' +
          '    vec3 c = fondo * wFondo;\n' +
          '    c = mix(c, medio,  aMedio * (1.0 - aditivo));\n' +
          '    c += medio  * aMedio  * aditivo * 0.8;\n' +
          '    c = mix(c, frente, aFrente * (1.0 - aditivo));\n' +
          '    c += frente * aFrente * aditivo;\n' +
          '\n' +
          '    // ---- la ultima pasada\n' +
          '    c = c / (1.0 + c);\n' +
          '    float v = 16.0 * (fragCoord.x / iResolution.x) * (fragCoord.y / iResolution.y) *\n' +
          '              (1.0 - fragCoord.x / iResolution.x) * (1.0 - fragCoord.y / iResolution.y);\n' +
          '    c *= pow(v, 0.3);\n' +
          '\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'Compara tapar con sumar poniendo el interruptor. Al sumar, la roseta no oculta la ' +
          'rejilla: la <em>enciende</em>. Casi todas las visuales de concierto están hechas sumando, ' +
          'porque el negro del fondo se convierte en transparencia y todo parece luz.'
      });
    }
  });

  p.section('Los mandos de una actuación');

  p.text('Cuando esto se toca en directo, no se editan números: se mueven mandos. Y ahí hay una ' +
    'lección de diseño que sirve para cualquier cosa que uno construya: ' +
    '<strong>un buen mando mueve varias cosas a la vez</strong>.');

  p.text('Un mando que solo cambia la frecuencia de un ruido es aburrido y no se nota desde la ' +
    'décima fila. Un mando que sube la frecuencia, aumenta el contraste, acelera el giro y desatura ' +
    'el color <em>a la vez</em> produce una sensación de intensidad. En síntesis de sonido a eso se ' +
    'le llama un <strong>macro</strong>, y la técnica es la misma:');

  p.formulas([
    '\\text{frecuencia} = 2 + 6\\,m',
    '\\text{giro} = 0{,}2 + 1{,}5\\,m^{2}',
    '\\text{saturación} = 1 - 0{,}6\\,m'
  ], 'un solo mando, tres efectos');

  p.text('Fíjate en el cuadrado del segundo: los mandos no tienen por qué ser lineales. Elevar al ' +
    'cuadrado hace que el efecto no arranque hasta la mitad del recorrido, y eso da control fino ' +
    'donde hace falta. Es exactamente la razón por la que los potenciómetros de volumen son ' +
    'logarítmicos.');

  p.section('El tiempo, y el golpe');

  p.text('Lo que separa unas visuales que acompañan a la música de unas que van por su cuenta es que ' +
    'las primeras tienen <strong>pulso</strong>. Y no hace falta escuchar nada para tenerlo: basta ' +
    'con conocer el tempo.');

  p.formula('\\text{golpe}(t) = \\bigl(1 - \\operatorname{fract}(t \\cdot \\tfrac{\\text{bpm}}{60})\\bigr)^{k}',
    'la envolvente del golpe',
    'La parte decimal da un diente de sierra que se reinicia en cada pulso; restarla de 1 lo invierte ' +
      'para que empiece alto y caiga; y la potencia $k$ decide lo seca que es la caída. Con $k$ alto, ' +
      'un golpe corto y percusivo; con $k$ bajo, algo más ondulado.');

  p.text('Ese número entre 0 y 1 se enchufa a lo que sea: un destello, un empujón de la escala, un ' +
    'salto de color, un desplazamiento de la cámara. Con dos o tres cosas latiendo a la vez y una ' +
    'sola de ellas latiendo a la mitad de velocidad, ya hay algo que parece compuesto.');

  p.ejemplo({
    title: 'Un pulso, un macro y tres capas, con números',
    enunciado: 'A 120 pulsos por minuto con $k = 6$, calcular la envolvente en $t = 1{,}05$ y en $t = 1{,}3$. Con el macro $m = 0{,}5$, calcular frecuencia, giro y saturación. Y componer un canal: fondo $0{,}2$, capa media $0{,}6$ con máscara $0{,}5$, frente $1$ con máscara $0{,}3$, tapando y sumando.',
    pasos: [
      { t: '<strong>El pulso.</strong> 120 por minuto son 2 por segundo. En $t = 1{,}05$: $2{,}1$ pulsos, parte decimal $0{,}1$, envolvente $0{,}9^6 = 0{,}53$: acaba de sonar el golpe. En $t = 1{,}3$: parte decimal $0{,}6$, envolvente $0{,}4^6 = 0{,}004$: apagado, esperando el siguiente.', antes: 'Multiplica $t$ por 2, quédate con la parte decimal y aplica $(1 - f)^6$.' },
      { t: '<strong>El macro.</strong> Frecuencia $2 + 6\\cdot 0{,}5 = 5$. Giro $0{,}2 + 1{,}5\\cdot 0{,}25 = 0{,}575$. Saturación $1 - 0{,}3 = 0{,}7$. A medio recorrido, el giro no está a medio camino: el cuadrado lo retrasa.' },
      { t: '<strong>Tapando.</strong> $\\operatorname{mix}(0{,}2,\\ 0{,}6,\\ 0{,}5) = 0{,}4$. Luego $\\operatorname{mix}(0{,}4,\\ 1,\\ 0{,}3) = 0{,}58$. Nunca se sale del rango de los valores que entran.', antes: 'Dos mix encadenados: el resultado del primero es lo que va debajo del segundo.' },
      { t: '<strong>Sumando.</strong> $0{,}2 + 0{,}6\\cdot 0{,}5 + 1\\cdot 0{,}3 = 0{,}8$. Con una capa más se pasaría de 1: por eso las composiciones aditivas acaban en $c/(1 + c)$, que aquí daría $0{,}44$.', antes: 'Fondo más cada capa por su máscara.' },
      { t: '<strong>Lo que enseña.</strong> Tapar conserva el rango; sumar lo desborda y hace falta comprimir. Un mando no lineal reparte el control donde hace falta. Y el pulso es una parte decimal y una potencia.' }
    ],
    cierre: 'Ninguna cuenta nueva: interpolaciones, sumas, una potencia y una parte decimal. La diferencia entre un ejercicio y una actuación está en cómo se combinan y en qué mando las mueve.'
  });

  p.demo({
    title: 'El set',
    intro: 'Aquí está casi todo el bloque a la vez: túnel, ruido torcido, simetría, paleta de cosenos, luz y última pasada. El mando de intensidad es un macro: mueve seis parámetros de golpe. Súbelo despacio y déjalo correr.',
    predice: 'Con 120 bpm, ¿cuántos golpes verás por segundo? Y al pasar la intensidad de 0,5 a 1, ¿la torsión será el doble o casi el triple? Piensa en $m^2$.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-dir-2', alto: 420,
        aria: 'Una pieza final que combina túnel, ruido, simetría y post-proceso, con un control macro de intensidad y un pulso rítmico.',
        mandos: [
          { n: 'intensidad', label: 'INTENSIDAD (macro)', min: 0, max: 1, step: 0.01, value: 0.45, dec: 2 },
          { n: 'bpm', label: 'pulso (bpm)', min: 0, max: 180, step: 1, value: 120, dec: 0 },
          { n: 'simetria', label: 'simetría', min: 1, max: 12, step: 1, value: 6, dec: 0 },
          { n: 'avance', label: 'avance', min: 0, max: 1.5, step: 0.05, value: 0.5, dec: 2 }
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
          '// la envolvente del pulso: alto en el golpe, cayendo hasta el siguiente\n' +
          'float golpe(float t, float k)\n' +
          '{\n' +
          '    if (bpm < 1.0) return 0.0;\n' +
          '    return pow(1.0 - fract(t * bpm / 60.0), k);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float t = iTime;\n' +
          '\n' +
          '    // ---- EL MACRO: un mando, seis parametros\n' +
          '    float m   = intensidad;\n' +
          '    float det = 2.0 + 5.0 * m;              // detalle\n' +
          '    float tor = 0.3 + 2.2 * m * m;          // torsion\n' +
          '    float gir = 0.05 + 0.5 * m;             // giro\n' +
          '    float sat = 1.0 - 0.45 * m;             // saturacion\n' +
          '    float exp2 = 0.9 + 1.6 * m;             // exposicion\n' +
          '\n' +
          '    float kick = golpe(t, 6.0);\n' +
          '    float lento = golpe(t * 0.25, 2.0);     // otro pulso, cuatro veces mas lento\n' +
          '\n' +
          '    // ---- TUNEL\n' +
          '    float r = length(p) + 0.05 * kick;\n' +
          '    float a = atan(p.y, p.x) + t * gir;\n' +
          '\n' +
          '    // ---- SIMETRIA\n' +
          '    float sec = TAU / simetria;\n' +
          '    a = abs(mod(a, sec) - 0.5 * sec);\n' +
          '\n' +
          '    vec2 uv = vec2(a / TAU * 3.0, 0.25 / r + t * avance);\n' +
          '\n' +
          '    // ---- TORSION sobre la pared\n' +
          '    vec2 w = uv + tor * 0.25 * vec2(fbm(uv * det), fbm(uv * det + 3.7));\n' +
          '    float n = fbm(w * 2.0);\n' +
          '\n' +
          '    // ---- COLOR\n' +
          '    vec3 c = 0.5 + 0.5 * cos(TAU * (n * 1.3 + uv.y * 0.2 + lento * 0.3 +\n' +
          '                                    vec3(0.0, 0.3, 0.6)));\n' +
          '    c = mix(vec3(dot(c, vec3(0.2126, 0.7152, 0.0722))), c, sat);\n' +
          '    c *= n * (0.7 + 0.9 * kick);\n' +
          '\n' +
          '    // ---- profundidad y ultima pasada\n' +
          '    c *= smoothstep(0.0, 0.45, r);\n' +
          '    c *= exp2;\n' +
          '    c = c / (1.0 + c);\n' +
          '\n' +
          '    vec2 g = fragCoord / iResolution.xy;\n' +
          '    c *= pow(16.0 * g.x * g.y * (1.0 - g.x) * (1.0 - g.y), 0.3);\n' +
          '    c += 0.03 * (hash(fragCoord + fract(t) * 91.0) - 0.5);\n' +
          '\n' +
          '    color = vec4(sqrt(max(c, 0.0)), 1.0);\n' +
          '}\n',
        nota: 'Cuenta las técnicas: perspectiva por división, pliegue del ángulo, ruido fractal, ' +
          'deformación del dominio, paleta de cosenos, luminancia ponderada, compresión de tono, ' +
          'viñeta y grano. Nueve temas de este bloque, y sigue cabiendo en una pantalla de código.'
      });
    }
  });

  p.section('Lo que cuesta y lo que no');

  p.text('En directo hay un límite duro: si no llegas a sesenta imágenes por segundo, se nota, y ' +
    'mucho. Merece la pena tener una idea de dónde se va el tiempo:');

  p.table(['Barato', 'Caro'], [
    ['sumas, productos, <code>mix</code>, <code>clamp</code>, <code>step</code>', 'bucles largos de raymarching'],
    ['<code>sin</code>, <code>cos</code>, <code>sqrt</code> (una unidad especial los hace)', 'el ruido fractal con muchas octavas'],
    ['una capa más de composición', 'llamar a la escena varias veces (aberración, reflejos)'],
    ['resolución baja con un buen suavizado', 'resolución alta con figuras muy finas']
  ]);

  p.text('Y un consejo de oficio: <strong>mide en vez de suponer</strong>. El mapa de coste del tema ' +
    'de [[gfx-raymarching|raymarching]] —pintar de rojo los píxeles que dan más pasos— es la ' +
    'herramienta más útil que hay, y se escribe en tres líneas. Casi siempre el problema está en un ' +
    'sitio que no te esperabas.');

  p.section('Adónde ir ahora');

  p.text('Todo lo de este bloque está escrito en GLSL estándar y se lleva tal cual a otros sitios. ' +
    'Estas son las herramientas y los lugares donde seguir, casi todas libres o gratuitas:');

  p.table(['Sitio o herramienta', 'Qué es'], [
    ['<code>shadertoy.com</code>', 'el archivo público donde está casi todo. Miles de shaders con su código a la vista. Tus <code>mainImage</code>, <code>iTime</code> e <code>iResolution</code> son los suyos: lo que has escrito aquí se pega allí y funciona'],
    ['<code>thebookofshaders.com</code>', 'el libro libre de Patricio González Vivo y Jen Lowe, en español y con editor incorporado. El complemento natural de este bloque'],
    ['<code>iquilezles.org</code>', 'los artículos de Íñigo Quílez: el catálogo de funciones de distancia, las paletas de coseno y las explicaciones de casi todo lo que has visto aquí'],
    ['<strong>Bonzomatic</strong>', 'software libre para programar shaders en directo. Es el que se usa en los <em>shader showdowns</em>, batallas de programación en vivo con público delante'],
    ['<strong>glslViewer</strong>', 'software libre de línea de órdenes: escribes un archivo y lo ves actualizarse solo. Funciona hasta en una Raspberry Pi'],
    ['<strong>Hydra</strong>', 'software libre para vídeo en directo desde el navegador, con un lenguaje propio más sencillo. Muy usado en el <em>live coding</em> audiovisual'],
    ['<strong>Blender</strong>', 'software libre de 3D con un sistema de nodos que es, en el fondo, lo mismo que has hecho aquí, con cables en vez de líneas'],
    ['<code>pouet.net</code>', 'el archivo histórico de la demoscene: cuarenta años de piezas, muchas de 64 o 4 kilobytes, casi todas con el código publicado']
  ]);

  p.note('Ninguna de esas direcciones está enlazada: este curso funciona sin conexión y no quiere ' +
    'depender de que un servidor siga en pie dentro de cinco años. Están escritas para que las ' +
    'copies cuando tengas internet delante.', null, 'Por qué no hay enlaces');

  p.section('La idea que se lleva uno');

  p.text('Si de todo este bloque hubiera que salvar una sola frase, sería esta: ' +
    '<strong>reglas simples, complejidad epatante</strong>.');

  p.text('No ha habido en ningún momento una imagen guardada, ni una lista de vértices, ni un dibujo ' +
    'hecho a mano. Ha habido una función que contesta, para cada punto, de qué color es. Un valor ' +
    'absoluto ha hecho de espejo. Una división ha hecho de perspectiva. Un resto ha hecho infinitas ' +
    'copias. Un coseno ha hecho una paleta. Y una regla de cuatro símbolos, $z \\to z^2 + c$, ha ' +
    'producido una figura que nadie ha terminado de explorar.');

  p.text('Eso es exactamente lo que ha estado haciendo el resto del curso, solo que sin dibujarlo. ' +
    'Las matemáticas van de eso: de encontrar la regla corta que genera lo largo. Aquí simplemente se ' +
    've, a sesenta imágenes por segundo.');

  p.util('Una última cosa práctica, por si quieres enseñar algo de esto: guarda tus shaders en ' +
    'archivos de texto, con la fecha y una línea diciendo qué querías hacer. Pesan un kilobyte, ' +
    'seguirán funcionando dentro de veinte años, y es el archivo más barato que existe. Buena parte ' +
    'de la demoscene se conserva porque su gente hacía justamente eso.');

  p.hist('La demoscene nació a mediados de los ochenta de las presentaciones que los grupos de ' +
    'copia de software añadían a los juegos: unas líneas de saludos con música y un efecto. Los ' +
    'efectos se fueron volviendo más interesantes que los juegos, y la gente empezó a hacerlos por ' +
    'su cuenta. De ahí salió una cultura entera —competiciones, categorías por tamaño, cuarenta años ' +
    'de archivo público— que en 2020 Alemania declaró patrimonio cultural inmaterial, la primera vez ' +
    'que una cultura digital recibe esa consideración.');

  p.trampas([
    { e: 'Sumar capas sin comprimir el tono al final', por: 'Tres capas de luz pasan de 1 con facilidad, y lo que se pasa sale como un manchón blanco. La composición aditiva acaba siempre en $c/(1 + c)$.' },
    { e: 'Tapar lo que es luz', por: 'Una roseta luminosa que <em>oculta</em> la rejilla parece un recorte de cartulina. Sumada, la enciende: es lo que hace la luz de verdad.' },
    { e: 'Hacer todos los mandos lineales', por: 'Un mando lineal gasta la mitad del recorrido donde el efecto apenas se nota. Elevar al cuadrado, o usar un logaritmo, pone el control fino donde hace falta.' },
    { e: 'Suponer dónde se va el tiempo', por: 'Casi nunca está donde uno cree. El mapa de coste, pintar de rojo los píxeles que dan más pasos, se escribe en tres líneas y no falla.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El pulso',
    level: 'basico',
    gen: function (r) {
      var bpm = r.pick([90, 100, 120, 128, 140, 174]);
      var k = r.pick([2, 4, 6]);
      var t = r.real(0.2, 4, 3);
      var f = (t * bpm / 60) % 1, g = Math.pow(1 - f, k);
      if (g < 0.001) return null;      // cuatro decimales no describen una envolvente tan apagada
      return { bpm: bpm, k: k, t: t, periodo: 60 / bpm, f: f, g: g };
    },
    ask: function (d) {
      return 'Las visuales laten a <strong>' + d.bpm + ' pulsos por minuto</strong> con la ' +
        'envolvente <code>pow(1 - fract(t·bpm/60), ' + d.k + '.0)</code>.<br><br>¿Cuánto dura un ' +
        'pulso en segundos, en qué punto del pulso estamos en <code>t = ' + U.fmt(d.t, 3) +
        '</code>, y cuánto vale la envolvente ahí? (cuatro decimales)';
    },
    fields: [
      { name: 'p', label: 'segundos por pulso', w: 'tiny' },
      { name: 'f', label: 'fract', w: 'tiny' },
      { name: 'g', label: 'envolvente', w: 'tiny' }
    ],
    sol: function (d) {
      return { p: U.round(d.periodo, 8), f: U.round(d.f, 8), g: U.round(d.g, 8) };
    },
    dec: { p: 4, f: 4 },      // la envolvente se calcula a partir de f redondeada: tol mas holgada
    tol: 3e-4,
    hint: function (d) {
      return 'Un pulso dura $60/\\text{bpm}$ segundos. Y <code>fract</code> se queda con la parte ' +
        'decimal de $t \\cdot ' + d.bpm + '/60$, que es cuántos pulsos han pasado.';
    },
    steps: function (d) {
      return ['Periodo: $60/' + d.bpm + ' = ' + U.fmt(d.periodo, 4) + '$ segundos',
        'Pulsos transcurridos: $' + U.fmt(d.t, 3) + ' \\cdot ' + d.bpm + '/60 = ' +
          U.fmt(d.t * d.bpm / 60, 4) + '$, cuya parte decimal es $' + U.fmt(d.f, 4) + '$',
        'Envolvente: $(1 - ' + U.fmt(d.f, 4) + ')^{' + d.k + '} = ' + U.fmt(d.g, 4) + '$',
        d.g > 0.5
          ? 'Valor alto: acabamos de pasar por el golpe.'
          : 'Valor bajo: estamos en la parte apagada, esperando el siguiente golpe.',
        'Subir el exponente hace la caída más seca sin cambiar el tempo: el golpe se vuelve más ' +
          'percusivo y menos ondulado.'];
    },
    answer: function (d) {
      return U.fmt(d.periodo, 4) + ' s · fract ' + U.fmt(d.f, 4) + ' · envolvente ' + U.fmt(d.g, 4);
    }
  });

  p.exercise({
    title: 'Apilar capas',
    level: 'medio',
    gen: function (r) {
      var f = r.real(0.05, 0.4, 2);
      var m = r.real(0.3, 0.9, 2), am = r.real(0.1, 0.9, 2);
      var fr = r.real(0.5, 1, 2), af = r.real(0.1, 0.9, 2);
      var tapa = f + (m - f) * am;
      tapa = tapa + (fr - tapa) * af;
      var suma = f + m * am + fr * af;
      return { f: f, m: m, am: am, fr: fr, af: af, tapa: tapa, suma: suma };
    },
    ask: function (d) {
      return 'Tres capas, mirando un solo canal:<br><br>' +
        '· <strong>fondo</strong>: valor <code>' + U.fmt(d.f, 2) + '</code>, opaco<br>' +
        '· <strong>medio</strong>: valor <code>' + U.fmt(d.m, 2) + '</code>, máscara <code>' +
          U.fmt(d.am, 2) + '</code><br>' +
        '· <strong>frente</strong>: valor <code>' + U.fmt(d.fr, 2) + '</code>, máscara <code>' +
          U.fmt(d.af, 2) + '</code><br><br>' +
        'Calcula el resultado <strong>tapando</strong> (dos <code>mix</code> encadenados) y ' +
        '<strong>sumando</strong> (fondo más cada capa por su máscara). (cuatro decimales)';
    },
    fields: [
      { name: 't', label: 'tapando', w: 'tiny' },
      { name: 's', label: 'sumando', w: 'tiny' }
    ],
    sol: function (d) { return { t: U.round(d.tapa, 8), s: U.round(d.suma, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'Al tapar, el orden importa y hay que encadenar: primero el medio sobre el fondo, y el ' +
        'resultado de eso es lo que queda debajo del frente. Al sumar, el orden da igual.';
    },
    steps: function (d) {
      return ['Tapando, paso 1: $\\operatorname{mix}(' + U.fmt(d.f, 2) + ', ' + U.fmt(d.m, 2) + ', ' +
        U.fmt(d.am, 2) + ') = ' + U.fmt(d.f + (d.m - d.f) * d.am, 4) + '$',
        'Tapando, paso 2: $\\operatorname{mix}(' + U.fmt(d.f + (d.m - d.f) * d.am, 4) + ', ' +
          U.fmt(d.fr, 2) + ', ' + U.fmt(d.af, 2) + ') = ' + U.fmt(d.tapa, 4) + '$',
        'Sumando: $' + U.fmt(d.f, 2) + ' + ' + U.fmt(d.m, 2) + '\\cdot' + U.fmt(d.am, 2) + ' + ' +
          U.fmt(d.fr, 2) + '\\cdot' + U.fmt(d.af, 2) + ' = ' + U.fmt(d.suma, 4) + '$',
        (d.suma > 1
          ? 'La suma se ha pasado de 1: ahí es donde hace falta la compresión de tono, o saldría un ' +
            'manchón blanco plano.'
          : 'La suma aún cabe en el rango, pero con una capa más se saldría: por eso las visuales ' +
            'aditivas casi siempre acaban con una compresión de tono.'),
        'Tapando, el resultado nunca se sale del rango de los valores que entran; sumando, sí. Ese es ' +
          'todo el compromiso entre las dos formas.'];
    },
    answer: function (d) { return 'tapando ' + U.fmt(d.tapa, 4) + ' · sumando ' + U.fmt(d.suma, 4); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec3 col = fondo;\ncol = mix(col, colorCapa1, mascara1);\ncol = mix(col, colorCapa2, mascara2);',
          o: ['Donde se solapan, la capa 2 queda encima de la capa 1', 'Donde se solapan, la capa 1 queda encima', 'Los colores de las dos capas se suman', 'Solo se ve el fondo'],
          por: 'Cada <code>mix</code> pinta sobre lo que ya había: la última capa aplicada tapa a las anteriores donde su máscara vale 1.' },
        { c: 'float golpe = exp(-8.0 * fract(iTime * 2.0));\nfloat radio = 0.2 + 0.1 * golpe;',
          o: ['Un círculo que se hincha de golpe dos veces por segundo y se desinfla rápido', 'Un círculo que crece y decrece suavemente, como un seno', 'Un círculo quieto', 'Un círculo que se hincha una vez cada dos segundos'],
          por: '<code>fract(2t)</code> vuelve a 0 dos veces por segundo; en ese instante la exponencial vale 1 y enseguida cae: un latido con ataque brusco, como un bombo.' },
        { c: 'vec3 col = paleta(fract(length(p) - 0.2 * iTime));',
          o: ['Anillos de colores que salen del centro recorriendo la paleta', 'Anillos de colores que se mueven hacia el centro', 'Toda la pantalla cambiando de color a la vez', 'Sectores de colores que giran'],
          por: 'Para mantener fijo $r - 0{,}2t$ al crecer el tiempo, $r$ tiene que crecer: cada color de la paleta se aleja del centro.' },
        { c: 'col = pow(col, vec3(1.0 / 2.2));',
          o: ['La imagen se aclara, sobre todo en los tonos oscuros: es la corrección gamma', 'La imagen se oscurece', 'Cambian los tonos de los colores', 'No cambia nada'],
          por: 'Elevar un número entre 0 y 1 a una potencia menor que 1 lo acerca a 1, y el efecto es mayor en los valores pequeños: se levantan las sombras.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'En un shader para una actuación, con <code>p</code> centrada y <code>paleta</code> como en el tema del color, ¿qué produce este fragmento?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Produce', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['Lee el fragmento como una receta de capas y de ritmos: ¿qué se pinta después, qué se repite y cada cuánto?']; },
    steps: function (d) { return [d.por, 'Produce: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Monta la composición',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'las tres capas <strong>apiladas</strong>, cada una tapando lo de debajo según su máscara',
          ref: 'mix(mix(fondo, medio, aMedio), frente, aFrente)' },
        { pide: 'el medio tapando al fondo, pero el frente <strong>sumado</strong> (mezcla aditiva)',
          ref: 'mix(fondo, medio, aMedio) + frente * aFrente' },
        { pide: 'una <strong>transición</strong>: la pila completa en la mitad izquierda y solo el fondo en la derecha, con el corte en <code>uv.x = 0.5</code>',
          ref: 'mix(mix(mix(fondo, medio, aMedio), frente, aFrente), fondo, step(0.5, uv.x))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe la composición para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">// ya calculados:\n//   vec3 fondo, medio, frente\n//   float aMedio, aFrente   (mascaras, entre 0 y 1)\n//   vec2 uv                 (0 a 1 en pantalla)\nvec3 c = <strong>???</strong> ;</pre>';
    },
    fields: [{ name: 'c', label: 'la composición', w: 'wide' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = fragCoord / iResolution.xy;\n' +
          '  vec2 p = (uv - 0.5) * 2.0;\n' +
          '  vec3 fondo  = vec3(0.10, 0.12, 0.28) + 0.3 * uv.y;\n' +
          '  vec3 medio  = vec3(0.85, 0.35, 0.55);\n' +
          '  vec3 frente = vec3(1.00, 0.92, 0.70);\n' +
          '  float aMedio  = 1.0 - smoothstep(0.34, 0.36, length(p));\n' +
          '  float aFrente = 1.0 - smoothstep(0.14, 0.16, length(p - vec2(0.25, 0.15)));\n' +
          '  vec3 c = ' + x + ';\n' +
          '  color = vec4(clamp(c, 0.0, 1.0), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 64, tol: 7 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. <code>mix</code> con dos <code>vec3</code> y un ' +
          '<code>float</code> devuelve un <code>vec3</code>: encadénalos.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la pila no queda como se pedía. Recuerda que al ' +
          'apilar, el resultado de una mezcla es lo que va <em>debajo</em> de la siguiente.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Se empieza por el fondo y se va poniendo encima: el resultado de cada <code>mix</code> ' +
        'es el primer argumento del siguiente. Para sumar, se suma la capa multiplicada por su ' +
        'máscara. Y <code>step(0.5, uv.x)</code> vale 0 a la izquierda y 1 a la derecha.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Con esta línea y las de los temas anteriores ya tienes todo lo que hace falta para montar ' +
        'una pieza entera.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.note('Cuando quieras saber si el bloque entero se ha quedado, en [[gfx-examen]] hay un examen procedimental con preguntas de todos sus temas, con reloj y corregido al entregar.', 'ok', 'Para medirte');

  p.keys([
    'Una pieza se construye <strong>por capas</strong>: cada una da un color y una máscara, y se apilan con <code>mix</code>.',
    '<strong>Tapar</strong> es para materia y <strong>sumar</strong> para luz. Sumando se sale del rango, y por eso hace falta comprimir el tono.',
    'Un buen mando de directo es un <strong>macro</strong>: mueve varios parámetros a la vez, y no tiene por qué ser lineal.',
    'El <strong>pulso</strong> se fabrica con <code>fract</code> y una potencia. Dos ritmos a la vez, uno más lento, ya parecen composición.',
    'En directo se <strong>mide</strong> el coste, no se supone: el mapa de pasos se escribe en tres líneas.',
    'Todo esto es GLSL estándar: se pega en Shadertoy, en Bonzomatic o en glslViewer y funciona.',
    'Y la idea de fondo, que es la del curso entero: <strong>reglas simples, complejidad epatante</strong>.'
  ]);
});
