/* Tema: El shader que recuerda */
Course.topic('gfx-buffers', function (p) {

  p.puente('Este tema rompe la regla de [[gfx-tiempo|tiempo]]: con memoria, el shader se convierte en ' +
    'un bucle de [[cib-realimentacion|realimentación]] y calcula cada fotograma a partir del anterior. ' +
    'Vuelven la Vida de [[cib-autoorganizacion|autoorganización]], la [[av-edp|ecuación del calor]] y ' +
    'la estabilidad del [[av-edo-numerico|método de Euler]], ahora en paralelo en cada píxel.');

  p.text('En [[gfx-tiempo]] quedó escrita una regla: un shader <strong>no recuerda el fotograma anterior</strong>. ' +
    'Todo movimiento es una fórmula del tiempo. Este tema rompe esa regla. Con un truco sencillo —pintar en una ' +
    'imagen invisible y leerla en el fotograma siguiente—, el shader puede calcular cada fotograma <em>a partir ' +
    'del anterior</em>.');

  p.text('Eso cambia la naturaleza de lo que se programa. Ya no es una fórmula: es una ' +
    '<strong>simulación</strong>, un estado que evoluciona paso a paso. Es un bucle de ' +
    '[[cib-realimentacion|realimentación]] literal, y con él la tarjeta gráfica ejecuta en paralelo, en cada ' +
    'píxel a la vez, los [[cib-autoorganizacion|autómatas celulares]] y las ' +
    '[[av-edp|ecuaciones en derivadas parciales]] que en otros temas se calculaban celda a celda.');

  /* ---------------------------------------------------------------- */
  p.section('Realimentación entre fotogramas');

  p.formula('\\text{estado}_{n+1}(\\text{píxel}) = F\\bigl(\\text{estado}_n(\\text{píxel}),\\ \\text{estado}_n(\\text{vecinos})\\bigr)',
    'un paso de simulación en el shader',
    'El estado del paso anterior llega como una textura, <code>iChannel0</code>. Para leer lo que había en este ' +
    'mismo píxel: <code>texture2D(iChannel0, fragCoord / iResolution.xy)</code>. Para el vecino de la derecha, se ' +
    'suma un píxel: <code>(fragCoord + vec2(1.0, 0.0)) / iResolution.xy</code>.<br><br>Lo que el shader devuelve en ' +
    '<code>color</code> es el estado nuevo, que en el paso siguiente volverá a entrar. Los cuatro canales se pueden ' +
    'usar como cuatro números de estado, no necesariamente como colores.');

  p.list([
    '<strong>Hay que sembrar.</strong> En el primer fotograma la memoria está vacía, a cero. <code>iFrame</code> cuenta los fotogramas desde 0, y con él se escribe un estado inicial: <code>step(iFrame, 0.5)</code> vale 1 solo en el primer paso.',
    '<strong>El estado no es la imagen.</strong> Aquí cada visor lleva una función <code>vista</code> aparte, fuera del editor, que decide cómo se pinta el estado en pantalla. Así el estado puede guardar concentraciones o temperaturas, y la vista, traducirlas a colores.',
    '<strong>«Volver al original» vuelve a sembrar.</strong> Reinicia el contador de fotogramas, y la simulación empieza de nuevo.'
  ]);

  p.ejemplo({
    title: 'Cuánto dura una estela',
    enunciado: 'Cada fotograma multiplica lo que había por la memoria $m$ y dibuja la bola encima. ¿Cuántos fotogramas tarda un punto de la estela en bajar del 10 % de su brillo con $m = 0{,}96$? ¿Y con $m = 0{,}8$? A 60 fotogramas por segundo, ¿cuánto es eso en tiempo?',
    pasos: [
      { t: '<strong>La ley.</strong> Tras $n$ fotogramas queda $m^n$ del brillo: una progresión geométrica de razón $m$, un fotograma por término.' },
      { t: '<strong>Con $m = 0{,}96$.</strong> $0{,}96^n = 0{,}1 \\Rightarrow n = \\frac{\\ln 0{,}1}{\\ln 0{,}96} = \\frac{-2{,}303}{-0{,}0408} \\approx 56$ fotogramas. Casi un segundo.', antes: 'Despeja $n$ con logaritmos.' },
      { t: '<strong>Con $m = 0{,}8$.</strong> $n = \\frac{-2{,}303}{-0{,}223} \\approx 10$ fotogramas: una sexta parte de segundo. La estela apenas se ve.', antes: 'Repite con 0,8. ¿Cuántas veces más corta?' },
      { t: '<strong>Con $m = 1$.</strong> $\\ln 1 = 0$: no hay solución. Nunca baja: la estela se queda para siempre, y si en vez de <code>max</code> se suma, la luz se acumula sin límite.' },
      { t: '<strong>La misma cuenta, al revés.</strong> Para que la estela dure 2 segundos, 120 fotogramas: $m = 0{,}1^{1/120} \\approx 0{,}981$. Así se elige la memoria a partir de lo que se quiere ver.', antes: 'Si quieres que dure 120 fotogramas, ¿qué $m$ hace falta?' }
    ],
    cierre: 'La memoria es la razón de una progresión geométrica, y su logaritmo decide la duración. Es la misma cuenta de la desintegración radiactiva, con fotogramas en vez de años.'
  });

  p.demo({
    title: 'Estelas',
    intro: 'En cada fotograma se lee lo que había, se oscurece un poco y se dibuja la bola encima. Lo que queda detrás es la memoria desvaneciéndose: una estela. Con memoria 1 la estela no se borraría nunca; con 0,8 dura unos pocos fotogramas.',
    predice: 'Con memoria 0,96, ¿la estela durará medio segundo, un segundo o cinco? Según el ejemplo, ¿en cuántos fotogramas baja del 10 %?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-buffers-1', alto: 300, buffer: true, escala: 0.5,
        aria: 'Una bola de color que recorre la pantalla dejando una estela que se desvanece.',
        mandos: [{ n: 'memoria', label: 'memoria', min: 0.8, max: 0.995, step: 0.005, value: 0.96, dec: 3 }],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = fragCoord / iResolution.xy;\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // lo que habia en este pixel en el fotograma anterior\n' +
          '    vec3 antes = texture2D(iChannel0, uv).rgb;\n' +
          '\n' +
          '    // lo nuevo: una bola que sigue una curva de Lissajous\n' +
          '    vec2 c = 0.35 * vec2(sin(iTime * 1.3), sin(iTime * 2.1));\n' +
          '    float bola = 1.0 - smoothstep(0.03, 0.04, length(p - c));\n' +
          '    vec3 nuevo = bola * (0.5 + 0.5 * cos(iTime + vec3(0.0, 2.0, 4.0)));\n' +
          '\n' +
          '    // siembra: en el primer fotograma se parte de un poco de ruido\n' +
          '    float h = fract(sin(dot(fragCoord, vec2(12.9898, 78.233))) * 43758.5453);\n' +
          '    antes = mix(antes, vec3(0.2 * h), step(iFrame, 0.5));\n' +
          '\n' +
          '    color = vec4(max(antes * memoria, nuevo), 1.0);\n' +
          '}\n',
        nota: 'Cambia <code>max</code> por <code>+</code>: la luz se acumula donde la bola pasa muchas veces, como en una fotografía de larga exposición.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Un autómata celular en la GPU');

  p.text('El [[cib-autoorganizacion|Juego de la Vida]] es el ejemplo perfecto: cada celda mira a sus ocho vecinas y ' +
    'decide si vive. En un programa normal se recorre la cuadrícula celda a celda; en un shader, cada píxel es una ' +
    'celda y todas deciden a la vez. Las reglas se escriben sin <code>if</code>, con la aritmética de ' +
    '[[gfx-decidir]]:');

  p.formula('\\text{nace} = [\\,n = 3\\,], \\qquad \\text{sobrevive} = [\\,\\text{viva}\\,]\\cdot[\\,n = 2\\,], \\qquad \\text{siguiente} = \\max(\\text{nace},\\ \\text{sobrevive})',
    'las reglas de Conway como aritmética',
    '$[\\,n = 3\\,]$ vale 1 si hay exactamente 3 vecinas vivas y 0 si no. En GLSL: <code>1.0 - step(0.5, abs(n - 3.0))</code>: ' +
    'la diferencia con 3 es menor que medio solo si $n$ vale 3.<br><br>Con 3 vecinas se está viva al paso siguiente, ' +
    'estuviera la celda viva o no; con 2, solo si ya lo estaba. El máximo hace de «o».');

  p.comprueba('Se borra la línea de siembra del shader de la Vida. ¿Qué se ve?', [
    { t: 'Nada, nunca: la memoria empieza a cero, ninguna celda tiene 3 vecinas vivas y nada nace', ok: true, por: 'Sin estado inicial no hay de qué partir: la regla de Conway aplicada a un tablero vacío devuelve un tablero vacío, fotograma tras fotograma. Por eso <code>iFrame</code> y la siembra son imprescindibles.' },
    { t: 'Ruido, porque la memoria empieza con basura', ok: false, por: 'La memoria empieza a cero, no con basura. Y aunque fuera basura, sería un estado inicial: precisamente lo que la siembra pone a propósito.' },
    { t: 'Lo mismo, porque la densidad ya está en el mando', ok: false, por: 'El mando solo se lee en la línea de siembra. Sin ella, la densidad no entra en ningún cálculo.' }
  ]);

  p.demo({
    title: 'La Vida en la tarjeta gráfica',
    intro: 'Cada píxel del estado es una celda. En verde vivo, las celdas vivas; en azul oscuro, el rastro de por dónde ha habido vida. La densidad solo cuenta al sembrar: cámbiala y pulsa «Volver al original» para otra partida.',
    predice: 'Con densidad 0,3, ¿al cabo de unos segundos quedará la pantalla llena, vacía, o con restos quietos y osciladores? ¿Y con densidad 0,8?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-buffers-vida', alto: 320, buffer: true, escala: 0.25,
        aria: 'El Juego de la Vida de Conway ejecutándose en la tarjeta gráfica, con celdas vivas en verde y un rastro azul.',
        mandos: [{ n: 'densidad', label: 'densidad inicial', min: 0.05, max: 0.8, step: 0.01, value: 0.3, dec: 2 }],
        vista: 'vec3 vista(vec4 s) { return mix(vec3(0.03, 0.04, 0.08) + vec3(0.05, 0.12, 0.35) * s.g, vec3(0.35, 0.95, 0.5), step(0.5, s.r)); }',
        codigo:
          'float viva(vec2 fc, vec2 desplazamiento)\n' +
          '{\n' +
          '    return step(0.5, texture2D(iChannel0, (fc + desplazamiento) / iResolution.xy).r);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    float n = viva(fragCoord, vec2(-1.0, -1.0)) + viva(fragCoord, vec2(0.0, -1.0)) + viva(fragCoord, vec2(1.0, -1.0))\n' +
          '            + viva(fragCoord, vec2(-1.0,  0.0))                                    + viva(fragCoord, vec2(1.0,  0.0))\n' +
          '            + viva(fragCoord, vec2(-1.0,  1.0)) + viva(fragCoord, vec2(0.0,  1.0)) + viva(fragCoord, vec2(1.0,  1.0));\n' +
          '    float yo = viva(fragCoord, vec2(0.0));\n' +
          '\n' +
          '    // Conway sin if: nace con 3, sobrevive con 2 si ya estaba viva\n' +
          '    float tres = 1.0 - step(0.5, abs(n - 3.0));\n' +
          '    float dos = 1.0 - step(0.5, abs(n - 2.0));\n' +
          '    float siguiente = max(tres, yo * dos);\n' +
          '\n' +
          '    // siembra al azar en el primer fotograma\n' +
          '    float h = fract(sin(dot(fragCoord, vec2(12.9898, 78.233))) * 43758.5453);\n' +
          '    siguiente = mix(siguiente, step(1.0 - densidad, h), step(iFrame, 0.5));\n' +
          '\n' +
          '    // el canal verde guarda un rastro que se apaga despacio\n' +
          '    float rastro = texture2D(iChannel0, fragCoord / iResolution.xy).g;\n' +
          '    color = vec4(siguiente, max(siguiente, rastro * 0.97), 0.0, 1.0);\n' +
          '}\n',
        nota: 'Cada fotograma calcula a la vez todas las celdas de la pantalla: con la escala de este visor son decenas de miles de celdas en paralelo.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La ecuación del calor, paso a paso');

  p.text('La [[av-edp|ecuación del calor]] dice que la temperatura en un punto cambia según lo distinta que sea de ' +
    'la media de sus alrededores: si los vecinos están más calientes, sube; si están más fríos, baja. Discretizada ' +
    'en una cuadrícula, es una regla local de las que un shader ejecuta sin esfuerzo.');

  p.formula('u_{n+1} = u_n + \\alpha\\,\\bigl(u_{\\text{der}} + u_{\\text{izq}} + u_{\\text{arr}} + u_{\\text{ab}} - 4\\,u_n\\bigr)',
    'un paso de la ecuación del calor (método explícito)',
    'El paréntesis es el <strong>laplaciano discreto</strong>: cuatro veces la diferencia entre la media de los cuatro ' +
    'vecinos y el propio valor.<br><br>$\\alpha$ agrupa la conductividad, el paso de tiempo y el tamaño de la celda.<br><br>' +
    'El método solo es <strong>estable</strong> si $\\alpha \\le \\frac{1}{4}$. Con un valor mayor, el patrón más fino ' +
    'posible, un tablero de ajedrez de calor y frío, se multiplica en cada paso por $1 - 8\\alpha$, que es menor que ' +
    '$-1$, y crece sin control. Es la misma estabilidad del [[av-edo-numerico|método de Euler]].');

  p.demo({
    title: 'Calor que se reparte',
    intro: 'Unas manchas de calor iniciales y una fuente que se pasea. El calor se difunde y las manchas se suavizan. Sube α por encima de 0,25 y mira qué pasa: aparece un tablero de puntos que se descontrola. No es un fallo del shader; es la inestabilidad del método.',
    predice: 'Sube α a 0,3: ¿qué patrón aparecerá y por qué justo ese? Calcula $1 - 8\\cdot 0{,}3$.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-buffers-calor', alto: 300, buffer: true, escala: 0.5, pasos: 4,
        aria: 'Manchas de calor que se difunden y se suavizan, con una fuente de calor que se desplaza por la pantalla.',
        mandos: [{ n: 'alfa', label: 'α', min: 0.05, max: 0.35, step: 0.005, value: 0.2, dec: 3 }],
        vista: 'vec3 vista(vec4 s) { float t = clamp(s.r, 0.0, 1.0); return vec3(smoothstep(0.0, 0.4, t), smoothstep(0.3, 0.8, t), smoothstep(0.7, 1.0, t)) + vec3(0.0, 0.0, clamp(-s.r, 0.0, 1.0)); }',
        codigo:
          'float u(vec2 fc) { return texture2D(iChannel0, fc / iResolution.xy).r; }\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    float c = u(fragCoord);\n' +
          '    float laplaciano = u(fragCoord + vec2(1.0, 0.0)) + u(fragCoord - vec2(1.0, 0.0))\n' +
          '                     + u(fragCoord + vec2(0.0, 1.0)) + u(fragCoord - vec2(0.0, 1.0)) - 4.0 * c;\n' +
          '    float nuevo = c + alfa * laplaciano;\n' +
          '\n' +
          '    // una fuente de calor que se pasea\n' +
          '    vec2 fuente = iResolution.xy * (0.5 + 0.35 * vec2(cos(iTime * 0.6), sin(iTime * 0.9)));\n' +
          '    nuevo = max(nuevo, 1.0 - smoothstep(3.0, 6.0, length(fragCoord - fuente)));\n' +
          '\n' +
          '    // siembra: bloques de calor al azar\n' +
          '    float h = fract(sin(dot(floor(fragCoord / 8.0), vec2(12.9898, 78.233))) * 43758.5453);\n' +
          '    nuevo = mix(nuevo, step(0.8, h), step(iFrame, 0.5));\n' +
          '\n' +
          '    color = vec4(nuevo, 0.0, 0.0, 1.0);\n' +
          '}\n',
        nota: 'Con α = 0,25 exacto, cada celda pasa a valer justo la media de sus cuatro vecinas.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Reacción-difusión en la GPU');

  p.text('El modelo de Gray-Scott del tema de [[cib-autoorganizacion|autoorganización]] se calculaba allí en el ' +
    'procesador, sobre una cuadrícula pequeña. En el shader es la misma regla, con dos canales del estado para ' +
    'las dos sustancias, y a la resolución de la pantalla. Cambiando dos números, $F$ y $k$, salen laberintos, ' +
    'manchas o células que se dividen.');

  p.demo({
    title: 'Manchas de Turing a pantalla completa',
    intro: 'Cada píxel guarda dos concentraciones en sus canales rojo y verde. Cada fotograma da ocho pasos de reacción y difusión. Prueba F = 0,0367 y k = 0,0649 para ver manchas que se dividen, y vuelve al original para sembrar de nuevo.',
    predice: 'Con la receta por defecto salen laberintos. Al pasar a F = 0,0367 y k = 0,0649, ¿las manchas se unirán en corales o se dividirán como células?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-buffers-turing', alto: 320, buffer: true, escala: 0.5, pasos: 8,
        aria: 'Un patrón de reacción-difusión que crece a partir de unas gotas y forma laberintos o manchas.',
        mandos: [
          { n: 'F', label: 'F (reposición)', min: 0.02, max: 0.07, step: 0.0005, value: 0.0545, dec: 4 },
          { n: 'K', label: 'k (retirada)', min: 0.05, max: 0.07, step: 0.0005, value: 0.062, dec: 4 }
        ],
        vista: 'vec3 vista(vec4 s) { float t = clamp(s.r - s.g, 0.0, 1.0); return mix(vec3(0.05, 0.08, 0.2), vec3(0.95, 0.9, 0.75), t); }',
        codigo:
          'vec2 S(vec2 fc) { return texture2D(iChannel0, fc / iResolution.xy).rg; }\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 s = S(fragCoord);\n' +
          '    vec2 lap = 0.2 * (S(fragCoord + vec2(1.0, 0.0)) + S(fragCoord - vec2(1.0, 0.0))\n' +
          '                    + S(fragCoord + vec2(0.0, 1.0)) + S(fragCoord - vec2(0.0, 1.0)))\n' +
          '             + 0.05 * (S(fragCoord + vec2(1.0, 1.0)) + S(fragCoord + vec2(-1.0, 1.0))\n' +
          '                    + S(fragCoord + vec2(1.0, -1.0)) + S(fragCoord - vec2(1.0, 1.0)))\n' +
          '             - s;\n' +
          '\n' +
          '    float u = s.r, v = s.g;\n' +
          '    float reaccion = u * v * v;\n' +
          '    float nu = u + (lap.r - reaccion + F * (1.0 - u));\n' +
          '    float nv = v + (0.5 * lap.g + reaccion - (F + K) * v);\n' +
          '\n' +
          '    // siembra: u = 1 en todas partes y gotas de v, una siempre en el centro\n' +
          '    float h = fract(sin(dot(floor(fragCoord / 6.0), vec2(12.9898, 78.233))) * 43758.5453);\n' +
          '    float gota = max(step(0.93, h), 1.0 - step(4.0, length(fragCoord - 0.5 * iResolution.xy)));\n' +
          '    nu = mix(nu, 1.0 - 0.5 * gota, step(iFrame, 0.5));\n' +
          '    nv = mix(nv, 0.25 * gota, step(iFrame, 0.5));\n' +
          '\n' +
          '    color = vec4(clamp(nu, 0.0, 1.0), clamp(nv, 0.0, 1.0), 0.0, 1.0);\n' +
          '}\n',
        nota: 'Si tu navegador no guarda números con decimales en las texturas, la reacción se estanca pronto: cada concentración solo tendría 256 niveles.'
      });
    }
  });

  p.hist('La idea de simular física en la tarjeta gráfica nació casi como un truco. A principios de los años ' +
    '2000, cuando los shaders empezaron a ser programables, varios investigadores se dieron cuenta de que pintar ' +
    'en una textura y releerla era una forma de hacer cálculo en paralelo con un aparato pensado para videojuegos. ' +
    'Así se simularon fluidos, humo y reacciones químicas mucho más deprisa que en el procesador. De esa costumbre ' +
    'nació la computación de propósito general en tarjetas gráficas, que hoy sostiene buena parte de la ' +
    'simulación científica y el entrenamiento de las redes neuronales.');

  p.trampas([
    { e: 'No sembrar', por: 'La memoria empieza a cero. Sin un estado inicial escrito con <code>iFrame</code>, la Vida no nace y el calor no se reparte: no hay nada que evolucionar.' },
    { e: 'Leer al vecino sumando 1 a <code>uv</code>', por: '<code>uv</code> va de 0 a 1: sumar 1 se sale de la textura. El vecino está a un píxel, <code>(fragCoord + vec2(1.0, 0.0)) / iResolution.xy</code>.' },
    { e: 'Subir $\\alpha$ para que el calor se reparta antes', por: 'Con $\\alpha > \\frac{1}{4}$ el tablero de ajedrez se multiplica por $|1 - 8\\alpha| > 1$ y crece sin control. Es la inestabilidad de Euler, en dos dimensiones.' },
    { e: 'Usar el estado directamente como color', por: 'El estado son concentraciones o temperaturas, con valores que pueden ser negativos o mayores que 1. La función <code>vista</code> los traduce a color; sin ella se ve recortado y engaña.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La Vida sin if',
    level: 'basico',
    gen: function (r) {
      var n = r.int(0, 6), yo = r.int(0, 1);
      var tres = n === 3 ? 1 : 0, dos = n === 2 ? 1 : 0;
      return { n: n, yo: yo, tres: tres, dos: dos, sig: Math.max(tres, yo * dos) };
    },
    ask: function (d) {
      return 'En el shader de la Vida, una celda con <code>yo = ' + d.yo + '.0</code> tiene <code>n = ' + d.n + '.0</code> vecinas vivas. ¿Qué valen <code>tres</code>, <code>dos</code> y <code>siguiente</code>?' +
        '<pre class="shd__mini">float tres = 1.0 - step(0.5, abs(n - 3.0));\nfloat dos = 1.0 - step(0.5, abs(n - 2.0));\nfloat siguiente = max(tres, yo * dos);</pre>';
    },
    fields: [{ name: 'a', label: 'tres', w: 'tiny' }, { name: 'b', label: 'dos', w: 'tiny' }, { name: 'c', label: 'siguiente', w: 'tiny' }],
    sol: function (d) { return { a: d.tres, b: d.dos, c: d.sig }; },
    hint: function () { return ['<code>step(0.5, x)</code> vale 0 si $x < 0{,}5$ y 1 si no.', '<code>abs(n - 3.0)</code> es menor que 0,5 solo si $n = 3$.']; },
    steps: function (d) {
      return ['$|' + d.n + ' - 3| = ' + Math.abs(d.n - 3) + '$, así que <code>tres</code> $= ' + d.tres + '$.', '$|' + d.n + ' - 2| = ' + Math.abs(d.n - 2) + '$, así que <code>dos</code> $= ' + d.dos + '$.',
        '<code>siguiente</code> $= \\max(' + d.tres + ',\\ ' + d.yo + '\\cdot ' + d.dos + ') = ' + d.sig + '$: la celda ' + (d.sig ? 'estará viva' : 'estará muerta') + '.'];
    },
    answer: function (d) { return d.tres + ', ' + d.dos + ', ' + d.sig; }
  });

  p.exercise({
    title: 'Un paso de la ecuación del calor',
    level: 'medio',
    gen: function (r) {
      var c = r.int(0, 10) / 10, v = [r.int(0, 10) / 10, r.int(0, 10) / 10, r.int(0, 10) / 10, r.int(0, 10) / 10], a = r.pick([0.1, 0.2, 0.25]);
      var suma = v[0] + v[1] + v[2] + v[3], lap = suma - 4 * c;
      if (Math.abs(lap) < 1e-9) return null;
      return { c: c, v: v, a: a, suma: suma, lap: lap, nuevo: c + a * lap, sinCuatro: c + a * suma };
    },
    ask: function (d) {
      return 'Un píxel tiene temperatura $' + U.fmt(d.c, 1) + '$ y sus cuatro vecinos, $' + d.v.map(function (x) { return U.fmt(x, 1); }).join(',\\ ') + '$. Con $\\alpha = ' + U.fmt(d.a, 2) +
        '$, ¿cuánto vale el laplaciano discreto y cuál es la temperatura del píxel en el paso siguiente? (Tres decimales.)';
    },
    fields: [{ name: 'l', label: 'laplaciano', w: 'tiny' }, { name: 'u', label: 'temperatura nueva', w: 'tiny' }],
    sol: function (d) { return { l: U.round(d.lap, 6), u: U.round(d.nuevo, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(d.suma - d.lap) > 1e-3 && Math.abs(v.l - d.suma) < 5e-4; }, msg: 'Falta restar $4u_n$: el laplaciano mide la diferencia entre los vecinos y el propio píxel, no la suma de los vecinos.' }],
    hint: function () { return ['Laplaciano: suma de los cuatro vecinos menos cuatro veces el valor del píxel.', 'Nueva temperatura: $u_n + \\alpha\\cdot$laplaciano.']; },
    steps: function (d) {
      return ['Laplaciano: $' + U.fmt(d.suma, 1) + ' - 4\\cdot ' + U.fmt(d.c, 1) + ' = ' + U.fmt(d.lap, 2) + '$',
        '$u_{n+1} = ' + U.fmt(d.c, 1) + ' + ' + U.fmt(d.a, 2) + '\\cdot(' + U.fmt(d.lap, 2) + ') = ' + U.fmt(d.nuevo, 3) + '$',
        d.lap > 0 ? 'Los vecinos están, en media, más calientes: el píxel se calienta.' : 'Los vecinos están, en media, más fríos: el píxel se enfría.'];
    },
    answer: function (d) { return 'laplaciano ' + U.fmt(d.lap, 2) + ', nueva ' + U.fmt(d.nuevo, 3); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec3 antes = texture2D(iChannel0, fragCoord / iResolution.xy).rgb;\ncolor = vec4(antes * 0.99, 1.0);',
          o: ['La imagen del primer fotograma se va oscureciendo poco a poco hasta quedar negra', 'La imagen se queda igual para siempre', 'La imagen se aclara hasta quedar blanca', 'La imagen se desplaza hacia un lado'],
          por: 'Cada fotograma multiplica por 0,99 lo que había: después de $n$ fotogramas queda $0{,}99^n$ del brillo inicial, que tiende a 0.' },
        { c: 'vec3 antes = texture2D(iChannel0, (fragCoord - vec2(1.0, 0.0)) / iResolution.xy).rgb;\ncolor = vec4(antes, 1.0);',
          o: ['La imagen se desplaza hacia la derecha un píxel en cada fotograma', 'La imagen se desplaza hacia la izquierda', 'La imagen se queda quieta', 'La imagen se difumina'],
          por: 'Cada píxel copia lo que tenía su vecino de la izquierda: todo el contenido avanza un píxel hacia la derecha.' },
        { c: 'vec3 antes = texture2D(iChannel0, uv).rgb;\ncolor = vec4(max(antes * 0.95, vec3(bola)), 1.0);',
          o: ['Una bola que deja detrás una estela que se desvanece', 'Una bola sin estela', 'Una estela que no se borra nunca', 'La pantalla se llena de blanco'],
          por: 'La bola se dibuja nueva en cada fotograma, y lo anterior se conserva multiplicado por 0,95: el camino recorrido se va apagando.' },
        { c: 'float nuevo = c + 0.1 * laplaciano;\ncolor = vec4(nuevo, 0.0, 0.0, 1.0);',
          o: ['Las manchas se difuminan y se extienden poco a poco hasta igualarse', 'Las manchas se hacen cada vez más nítidas', 'Aparece un tablero que crece sin control', 'La imagen se queda quieta'],
          por: 'Con $\\alpha = 0{,}1 \\le \\frac{1}{4}$ el método es estable y cada píxel se acerca a la media de sus vecinos: es difusión.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'En un visor con memoria, a partir de una imagen inicial cualquiera, ¿qué se ve con el paso de los fotogramas?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['Piensa qué le pasa a un píxel después de muchos pasos: ¿qué lee y qué escribe?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: '¿Estable o inestable?',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.5]);
      return { a: a, f: 1 - 8 * a, est: Math.abs(1 - 8 * a) <= 1 + 1e-12 ? 'si' : 'no' };
    },
    ask: function (d) {
      return 'En el método explícito de la ecuación del calor, el patrón de tablero de ajedrez —valores $+1$ y $-1$ alternados— se multiplica en cada paso por un factor. ' +
        'Con $\\alpha = ' + U.fmt(d.a, 2) + '$, ¿cuánto vale ese factor? ¿Es estable el método?';
    },
    fields: [{ name: 'f', label: 'factor', w: 'tiny' }, { name: 't', label: '¿Estable?', opts: [{ t: 'Sí: el tablero se apaga o se mantiene', v: 'si' }, { t: 'No: el tablero crece sin control', v: 'no' }] }],
    sol: function (d) { return { f: U.round(d.f, 6), t: d.est }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(v.f - (1 - 4 * d.a)) < 1e-6; }, msg: 'En un tablero, cada uno de los cuatro vecinos vale lo contrario que el píxel: su suma es $-4u$, y el laplaciano, $-4u - 4u = -8u$.' }],
    hint: function () { return ['Si el píxel vale $u$, sus cuatro vecinos valen $-u$.', 'Laplaciano: $-4u - 4u$. El factor es $1 + \\alpha\\cdot(-8)$; es estable si su valor absoluto no pasa de 1.']; },
    steps: function (d) {
      return ['Laplaciano del tablero: $4\\cdot(-u) - 4u = -8u$, así que $u_{n+1} = (1 - 8\\alpha)\\,u_n$.',
        'Factor: $1 - 8\\cdot ' + U.fmt(d.a, 2) + ' = ' + U.fmt(d.f, 2) + '$.',
        d.est === 'si' ? '$|' + U.fmt(d.f, 2) + '| \\le 1$: <strong>estable</strong>.' : '$|' + U.fmt(d.f, 2) + '| > 1$: el tablero crece en cada paso. <strong>Inestable</strong>. La condición es $\\alpha \\le \\frac{1}{4}$.'];
    },
    answer: function (d) { return 'factor ' + U.fmt(d.f, 2) + ', ' + (d.est === 'si' ? 'estable' : 'inestable'); }
  });

  p.keys([
    'Con memoria, el shader lee el fotograma anterior en <code>iChannel0</code> y calcula el siguiente: deja de ser una fórmula y se convierte en una simulación.',
    'Hay que sembrar el estado en el primer fotograma, con <code>iFrame</code>.',
    'Los autómatas celulares y las ecuaciones de difusión son reglas locales: cada píxel se actualiza a la vez que todos los demás.',
    'El método explícito del calor, $u + \\alpha\\,\\Delta u$, solo es estable con $\\alpha \\le \\frac{1}{4}$: si no, el patrón más fino crece por $|1 - 8\\alpha| > 1$.'
  ]);
});
