/* Tema: El raton entra en la ecuacion */
Course.topic('gfx-raton', function (p) {

  p.puente('Hasta aquí la función del píxel dependía solo de su posición. Este tema le añade una ' +
    'entrada más, la posición del puntero, y todo se reduce a lo que ya sabes: llevar dos puntos al ' +
    'mismo sistema de coordenadas y medir la [[gfx-distancia|distancia]] entre ellos. Al final aparece ' +
    'la [[pe-normal|campana de Gauss]] como peso.');

  p.text('Hasta aquí, el shader contestaba a una sola pregunta: de qué color es este píxel. Con ' +
    '<code>iMouse</code>, la pregunta incluye además <strong>dónde tienes el dedo</strong>. La fórmula no ' +
    'cambia de naturaleza: sigue siendo una función, pero ahora con una entrada que controlas tú en tiempo ' +
    'real. Y la pantalla deja de ser un cuadro para convertirse en un instrumento.');

  p.text('Todo lo que se hace con el ratón en un shader sale de lo que ya sabes: pasar sus coordenadas al ' +
    'mismo sistema que el píxel y medir [[gfx-distancia|distancias]] entre los dos.');

  /* ---------------------------------------------------------------- */
  p.section('Leer la posición del ratón');

  p.text('<code>iMouse</code> es un vector de cuatro números, en píxeles, con el mismo convenio que ' +
    '<code>fragCoord</code>: el origen abajo a la izquierda.');

  p.table(['Componente', 'Qué guarda'], [
    ['<code>iMouse.xy</code>', 'dónde está el puntero mientras arrastras (se queda en el último sitio al soltar)'],
    ['<code>iMouse.zw</code>', 'dónde hiciste el último clic'],
    ['antes del primer clic', 'las cuatro valen 0: el ratón «está» en la esquina inferior izquierda']
  ]);

  p.text('El error más frecuente es usar <code>iMouse.xy</code> tal cual, en píxeles, junto a una ' +
    '<code>p</code> ya centrada y dividida. Son dos sistemas de coordenadas distintos, y hay que llevar el ' +
    'ratón al mismo que el píxel con <strong>la misma transformación</strong>:');

  p.formula('\\vec m = \\frac{\\text{iMouse.xy} - \\frac{1}{2}\\,\\text{iResolution.xy}}{\\text{iResolution.y}}',
    'el ratón en las coordenadas del píxel',
    'Es exactamente la fórmula con la que se centró <code>p</code> en [[gfx-coordenadas]]: se resta la mitad de la ' +
    'resolución para llevar el origen al centro y se divide por la altura para que las dos direcciones usen la ' +
    'misma unidad.<br><br>En GLSL: <code>vec2 m = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;</code><br><br>' +
    'A partir de ahí, <code>length(p - m)</code> es la distancia de cada píxel al ratón.');

  p.comprueba('Ventana de 800 × 400 con el puntero en el centro exacto. ¿Cuánto valen <code>iMouse.xy</code> y $\\vec m$?', [
    { t: '$(400, 200)$ y $(0, 0)$', ok: true, por: '<code>iMouse</code> viene en píxeles desde la esquina inferior izquierda; al restarle media pantalla y dividir por 400 queda el origen, igual que le pasa a la $p$ del píxel central.' },
    { t: '$(0{,}5,\\ 0{,}5)$ y $(0, 0)$', ok: false, por: '<code>iMouse</code> no está normalizado: son píxeles. El $(0{,}5, 0{,}5)$ sería <code>iMouse.xy / iResolution.xy</code>, que aquí no se usa.' },
    { t: '$(400, 200)$ y $(0{,}5,\\ 0{,}5)$', ok: false, por: 'La transformación de $\\vec m$ resta media pantalla antes de dividir: el centro se va al $(0, 0)$, no al $(0{,}5, 0{,}5)$.' }
  ]);

  p.ejemplo({
    title: 'Cuánta luz llega, a mano',
    enunciado: 'Linterna con alcance $a = 0{,}2$ y luz $= a^2 / (d^2 + a^2)$. Calcular la fracción de luz en un píxel desplazado $(0{,}2,\\ 0{,}15)$ respecto del puntero, en uno justo debajo, en uno a distancia 0,2 y en uno a 0,4.',
    pasos: [
      { t: '<strong>La distancia al cuadrado.</strong> $d^2 = 0{,}2^2 + 0{,}15^2 = 0{,}0625$. No hace falta la raíz: la fórmula usa $d^2$.', antes: 'Suma los cuadrados de las dos componentes.' },
      { t: '<strong>La luz.</strong> $\\dfrac{0{,}04}{0{,}0625 + 0{,}04} = \\dfrac{0{,}04}{0{,}1025} \\approx 0{,}39$. Llega algo más de un tercio.', antes: 'Sustituye en $a^2 / (d^2 + a^2)$.' },
      { t: '<strong>Bajo el puntero.</strong> $d = 0$: $0{,}04 / 0{,}04 = 1$. Toda la luz, y sin dividir por cero gracias al $a^2$ del denominador.' },
      { t: '<strong>A una distancia igual al alcance.</strong> $d = 0{,}2$: $0{,}04 / 0{,}08 = 0{,}5$. Exactamente la mitad: eso es lo que significa «alcance».' },
      { t: '<strong>Al doble.</strong> $d = 0{,}4$: $0{,}04 / 0{,}20 = 0{,}2$. Un quinto, no un cuarto de la luz de $d = 0{,}2$: cerca del centro la caída es más suave que un $1/d^2$ puro, y lejos se le parece.', antes: 'Con $d = 0{,}4$, ¿sale un cuarto de lo que salía en $d = 0{,}2$?' }
    ],
    cierre: 'Es la ley del inverso del cuadrado, amansada con un $a^2$ para que no se dispare en el centro. Ese sumando es lo que hace que «alcance» signifique «donde queda la mitad».'
  });

  p.note('Si no puedes usar el ratón o una pantalla táctil, cada ejemplo de este tema trae deslizadores que ' +
    'mueven lo mismo. Mandan ellos hasta que haces el primer clic en la imagen; a partir de ahí, manda el ' +
    'puntero. En el código se ve cómo: se mira si <code>iMouse.zw</code> ha dejado de valer cero.', 'ok', 'Sin ratón también se puede');

  p.demo({
    title: 'Una linterna',
    intro: 'Haz clic y arrastra sobre la imagen: la luz sigue al puntero. La cantidad de luz cae con la distancia al cuadrado, como la de una bombilla de verdad. El alcance decide lo deprisa que se apaga.',
    predice: 'Con alcance 0,18, ¿a qué distancia del puntero llega justo la mitad de la luz? Y al doblar el alcance, ¿la mancha iluminada será el doble de ancha o cuatro veces?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-raton-1', alto: 300,
        aria: 'Un suelo de baldosas a oscuras, iluminado solo alrededor de una linterna que sigue al puntero o a los deslizadores.',
        mandos: [
          { n: 'lx', label: 'luz x (sin ratón)', min: -0.8, max: 0.8, step: 0.01, value: -0.2, dec: 2 },
          { n: 'ly', label: 'luz y (sin ratón)', min: -0.45, max: 0.45, step: 0.01, value: 0.1, dec: 2 },
          { n: 'alcance', label: 'alcance', min: 0.05, max: 0.5, step: 0.01, value: 0.18, dec: 2 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // el raton, con la misma transformacion que el pixel\n' +
          '    vec2 m = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    // antes del primer clic mandan los deslizadores\n' +
          '    m = mix(vec2(lx, ly), m, step(0.5, iMouse.z + iMouse.w));\n' +
          '\n' +
          '    vec2 c = floor(p * 8.0);\n' +
          '    vec3 suelo = mix(vec3(0.25, 0.22, 0.2), vec3(0.75, 0.7, 0.62), mod(c.x + c.y, 2.0));\n' +
          '\n' +
          '    // la luz cae con el cuadrado de la distancia (suavizada para que no se dispare en el centro)\n' +
          '    float d = length(p - m);\n' +
          '    float luz = alcance * alcance / (d * d + alcance * alcance);\n' +
          '\n' +
          '    color = vec4(suelo * luz, 1.0);\n' +
          '}\n',
        nota: 'Cambia <code>d * d</code> por <code>d</code> y compara: la luz se reparte mucho más lejos, y deja de parecer una bombilla.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Deformar alrededor del ratón');

  p.text('La distancia al ratón no solo sirve para cambiar el color: también puede cambiar las ' +
    '<strong>coordenadas</strong> con las que se dibuja. Si cerca del ratón se encogen las coordenadas hacia ' +
    'él, el dibujo de esa zona se ve más grande: es una lupa. El peso de la deformación tiene que ser grande ' +
    'cerca del ratón y desaparecer lejos, y para eso va de maravilla una campana:');

  p.formula('\\text{peso} = e^{-\\frac{|\\vec p - \\vec m|^2}{r^2}}, \\qquad \\vec q = \\vec m + (\\vec p - \\vec m)\\,(1 - k\\cdot\\text{peso})',
    'una lupa con forma de campana',
    'El peso vale 1 justo en el ratón y cae hacia 0 a una distancia del orden de $r$: es la forma de la ' +
    '[[pe-normal|campana de Gauss]] en dos dimensiones.<br><br>$k$ es el aumento: con $k = 0$ no pasa nada; con ' +
    '$k$ cerca de 1, las coordenadas del centro se aprietan mucho y el dibujo se ve muy grande.<br><br>' +
    'El dibujo se hace después con $\\vec q$ en lugar de con $\\vec p$.');

  p.demo({
    title: 'Una lupa',
    intro: 'Arrastra la lupa por encima de la rejilla. Nada del dibujo cambia: lo que cambia son las coordenadas con las que se pregunta a cada píxel. Sube el aumento y el radio para ver cómo se curvan las líneas.',
    predice: 'Un píxel justo en el centro de la lupa, ¿con qué coordenada se dibuja: con la suya o con la del centro? Y uno a tres radios de distancia, ¿se deforma algo?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-raton-2', alto: 300,
        aria: 'Una rejilla fina con anillos de fondo, ampliada dentro de una lupa circular que sigue al puntero.',
        mandos: [
          { n: 'lx', label: 'lupa x (sin ratón)', min: -0.8, max: 0.8, step: 0.01, value: 0.1, dec: 2 },
          { n: 'ly', label: 'lupa y (sin ratón)', min: -0.45, max: 0.45, step: 0.01, value: 0.0, dec: 2 },
          { n: 'radio', label: 'radio', min: 0.08, max: 0.4, step: 0.01, value: 0.2, dec: 2 },
          { n: 'aumento', label: 'aumento', min: 0.0, max: 0.9, step: 0.01, value: 0.6, dec: 2 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec2 m = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    m = mix(vec2(lx, ly), m, step(0.5, iMouse.z + iMouse.w));\n' +
          '\n' +
          '    // cerca del raton las coordenadas se encogen hacia el\n' +
          '    vec2 dp = p - m;\n' +
          '    float peso = exp(-dot(dp, dp) / (radio * radio));\n' +
          '    vec2 q = m + dp * (1.0 - aumento * peso);\n' +
          '\n' +
          '    // el dibujo, hecho con q: una rejilla y unos anillos\n' +
          '    vec2 g = abs(fract(q * 10.0) - 0.5);\n' +
          '    float lineas = 1.0 - smoothstep(0.0, 0.06, min(g.x, g.y));\n' +
          '    float anillos = 0.5 + 0.5 * sin(40.0 * length(q));\n' +
          '    vec3 c = mix(vec3(0.1, 0.12, 0.2) + 0.15 * anillos, vec3(0.9, 0.8, 0.5), lineas);\n' +
          '\n' +
          '    // un aro para ver dónde está la lupa\n' +
          '    c += 0.4 * (1.0 - smoothstep(0.0, 0.006, abs(length(dp) - radio)));\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Pon el aumento en negativo cambiando <code>1.0 - aumento * peso</code> por <code>1.0 + aumento * peso</code>: la lupa se convierte en un ojo de pez que encoge.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Dónde hiciste clic y dónde estás');

  p.text('Con <code>iMouse.zw</code> y <code>iMouse.xy</code> a la vez se tiene un arrastre completo: un ' +
    'punto de partida y uno de llegada. Es lo que hace cualquier programa al seleccionar un rectángulo. Las ' +
    'esquinas del rectángulo son el <code>min</code> y el <code>max</code> de los dos puntos, componente a ' +
    'componente, y un píxel está dentro si queda entre ellas en las dos direcciones.');

  p.demo({
    title: 'Seleccionar un rectángulo',
    intro: 'Haz clic en un punto y arrastra. El punto naranja es donde hiciste clic (iMouse.zw) y el verde, donde estás (iMouse.xy). El color del marco depende de la distancia entre los dos.',
    predice: 'Si arrastras hacia abajo a la izquierda desde el punto de clic, ¿el rectángulo se dibujará igual de bien que hacia arriba a la derecha? Piensa en qué hacen <code>min</code> y <code>max</code>.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-raton-3', alto: 280,
        aria: 'Un rectángulo de selección entre el punto donde se hizo clic y la posición actual del puntero.',
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec2 a = (iMouse.zw - 0.5 * iResolution.xy) / iResolution.y;   // donde hiciste clic\n' +
          '    vec2 b = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;   // donde estas\n' +
          '    float hay = step(0.5, iMouse.z + iMouse.w);\n' +
          '    a = mix(vec2(-0.3, -0.2), a, hay);\n' +
          '    b = mix(vec2(0.35, 0.25), b, hay);\n' +
          '\n' +
          '    vec2 lo = min(a, b), hi = max(a, b);\n' +
          '    float dentro = step(lo.x, p.x) * step(p.x, hi.x) * step(lo.y, p.y) * step(p.y, hi.y);\n' +
          '    float amplio = step(lo.x - 0.006, p.x) * step(p.x, hi.x + 0.006) * step(lo.y - 0.006, p.y) * step(p.y, hi.y + 0.006);\n' +
          '    float marco = amplio - dentro;\n' +
          '\n' +
          '    vec3 c = vec3(0.08, 0.09, 0.13);\n' +
          '    c = mix(c, vec3(0.25, 0.45, 0.8), 0.45 * dentro);\n' +
          '    c = mix(c, 0.5 + 0.5 * cos(TAU * (length(b - a) + vec3(0.0, 0.33, 0.67))), marco);\n' +
          '    c = mix(c, vec3(1.0, 0.55, 0.3), 1.0 - smoothstep(0.012, 0.016, length(p - a)));\n' +
          '    c = mix(c, vec3(0.4, 1.0, 0.6), 1.0 - smoothstep(0.012, 0.016, length(p - b)));\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Antes del primer clic se ve un rectángulo de ejemplo, dibujado entre dos puntos fijos.'
      });
    }
  });

  p.util('Los programas de dibujo, los editores de mapas y los visores médicos hacen exactamente esto: ' +
    'convierten la posición del puntero al sistema de coordenadas de la imagen, y a partir de ahí todo son ' +
    'distancias. La misma cuenta, pasar de píxeles de pantalla a coordenadas del mundo, es la primera línea ' +
    'de cualquier videojuego que responda a un clic.');

  p.hist('La primera vez que alguien dibujó con un puntero en una pantalla fue en 1963: Ivan Sutherland, ' +
    'entonces estudiante de doctorado en el MIT, presentó Sketchpad, un programa en el que se trazaban ' +
    'líneas y círculos con un lápiz óptico apoyado sobre el monitor. El ratón llegó poco después: Douglas ' +
    'Engelbart lo presentó en 1968, en una demostración que se recuerda como «la madre de todas las ' +
    'demostraciones», con una caja de madera con dos ruedas por debajo.');

  p.trampas([
    { e: 'Comparar <code>iMouse.xy</code> en píxeles con la <code>p</code> centrada', por: 'Son dos sistemas distintos: uno va de 0 a 800 y el otro de $-1$ a $1$. La distancia sale de cientos de unidades y no se ve nada.' },
    { e: 'Normalizar el ratón dividiendo cada componente por la suya', por: 'La $p$ del píxel se divide entera por el alto; si el ratón se divide por <code>iResolution.xy</code>, queda en otra escala en horizontal y la linterna se desplaza respecto del puntero.' },
    { e: 'No prever el primer instante', por: 'Antes de cualquier clic <code>iMouse</code> vale cero: la luz aparece en la esquina inferior izquierda. Se comprueba <code>iMouse.zw</code> y se usa un valor por defecto mientras tanto.' },
    { e: 'Iluminar con $1/d$ en vez de $1/d^2$', por: 'Con $1/d$ la luz se reparte muy lejos y deja de parecer una bombilla. Y sin el $a^2$ sumado, en $d = 0$ se divide por cero.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Del píxel del ratón a la coordenada centrada',
    level: 'basico',
    gen: function (r) {
      var W0 = r.pick([800, 960, 1200]), H0 = r.pick([400, 450, 600]), px = r.int(0, W0), py = r.int(0, H0);
      return { W: W0, H: H0, px: px, py: py, mx: (px - W0 / 2) / H0, my: (py - H0 / 2) / H0, malx: (px - W0 / 2) / W0 };
    },
    ask: function (d) {
      return 'El lienzo mide <code>iResolution.xy = (' + d.W + ', ' + d.H + ')</code> y el ratón está en <code>iMouse.xy = (' + d.px + ', ' + d.py +
        ')</code>. ¿Cuánto vale <code>m</code>, con la misma transformación que la <code>p</code> centrada? (Tres decimales.)';
    },
    fields: [{ name: 'x', label: 'm.x', w: 'tiny' }, { name: 'y', label: 'm.y', w: 'tiny' }],
    sol: function (d) { return { x: U.round(d.mx, 6), y: U.round(d.my, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(d.malx - d.mx) > 2e-3 && Math.abs(v.x - d.malx) < 5e-4; }, msg: 'Las dos componentes se dividen por la <strong>altura</strong>, también la x: si no, el ratón queda en otra escala que el píxel y la distancia sale deformada.' }],
    hint: function () { return ['Resta la mitad de la resolución a cada componente.', 'Divide las dos por <code>iResolution.y</code>.']; },
    steps: function (d) {
      return ['$m_x = \\dfrac{' + d.px + ' - ' + (d.W / 2) + '}{' + d.H + '} \\approx ' + U.fmt(d.mx, 3) + '$', '$m_y = \\dfrac{' + d.py + ' - ' + (d.H / 2) + '}{' + d.H + '} \\approx ' + U.fmt(d.my, 3) + '$',
        'La $y$ queda entre $-0{,}5$ y $0{,}5$; la $x$, entre $\\pm' + U.fmt(d.W / d.H / 2, 3) + '$, porque el lienzo es más ancho que alto.'];
    },
    answer: function (d) { return '(' + U.fmt(d.mx, 3) + ', ' + U.fmt(d.my, 3) + ')'; }
  });

  p.exercise({
    title: '¿Cuánta luz llega?',
    level: 'medio',
    gen: function (r) {
      var a = r.pick([0.1, 0.2, 0.25]), dx = r.pick([0, 0.1, 0.2, 0.3]), dy = r.pick([0.1, 0.2, 0.4]);
      var d = Math.hypot(dx, dy);
      return { a: a, dx: dx, dy: dy, d: d, luz: a * a / (d * d + a * a), mal: a * a / (d + a * a) };
    },
    ask: function (d) {
      return 'En la linterna del tema, <code>luz = alcance * alcance / (d * d + alcance * alcance)</code>, con <code>alcance = ' + U.fmt(d.a, 2) +
        '</code>. Un píxel está desplazado $(' + U.fmt(d.dx, 1) + ',\\ ' + U.fmt(d.dy, 1) + ')$ respecto del ratón. ¿Qué fracción de luz le llega? (Tres decimales.)';
    },
    fields: [{ name: 'l', label: 'luz', w: 'wide' }],
    sol: function (d) { return { l: U.round(d.luz, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(d.mal - d.luz) > 2e-3 && Math.abs(v.l - d.mal) < 5e-4; }, msg: 'En el denominador va la distancia <strong>al cuadrado</strong>: $d^2 = ' + '\\Delta x^2 + \\Delta y^2$, sin raíz.' }],
    hint: function () { return ['$d^2 = \\Delta x^2 + \\Delta y^2$: ni siquiera hace falta la raíz.', 'Luego sustituye en la fórmula.']; },
    steps: function (d) {
      return ['$d^2 = ' + U.fmt(d.dx, 1) + '^2 + ' + U.fmt(d.dy, 1) + '^2 = ' + U.fmt(d.d * d.d, 3) + '$',
        '$\\text{luz} = \\dfrac{' + U.fmt(d.a * d.a, 4) + '}{' + U.fmt(d.d * d.d, 3) + ' + ' + U.fmt(d.a * d.a, 4) + '} \\approx ' + U.fmt(d.luz, 3) + '$',
        'Justo a una distancia igual al alcance llega exactamente la mitad de la luz.'];
    },
    answer: function (d) { return U.fmt(d.luz, 3); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec2 m = (iMouse.xy - 0.5 * iResolution.xy) / iResolution.y;\nfloat v = 1.0 - smoothstep(0.1, 0.11, length(p - m));',
          o: ['Un círculo blanco de radio 0,1 que sigue al puntero mientras arrastras', 'Un círculo fijo en el centro de la pantalla', 'Un agujero negro que sigue al puntero sobre fondo blanco', 'Un círculo que se queda donde hiciste clic aunque arrastres'],
          por: '<code>m</code> es la posición actual del puntero en las coordenadas del píxel, y se pinta de blanco lo que está a menos de 0,1 de ella.' },
        { c: 'vec2 m = (iMouse.zw - 0.5 * iResolution.xy) / iResolution.y;\nfloat v = 1.0 - smoothstep(0.1, 0.11, length(p - m));',
          o: ['Un círculo que se queda donde hiciste clic, aunque luego arrastres', 'Un círculo que sigue al puntero mientras arrastras', 'Un círculo fijo en el centro de la pantalla', 'Nada: esas componentes siempre valen cero'],
          por: '<code>iMouse.zw</code> guarda el punto del último clic, que no cambia al arrastrar.' },
        { c: 'float mx = (iMouse.x - 0.5 * iResolution.x) / iResolution.y;\nfloat v = step(p.x, mx);',
          o: ['Blanco a la izquierda del puntero y negro a la derecha: una cortina que se mueve con él', 'Negro a la izquierda del puntero y blanco a la derecha', 'Una línea horizontal a la altura del puntero', 'Toda la pantalla blanca'],
          por: '<code>step(p.x, mx)</code> vale 1 cuando $m_x \\ge p_x$, es decir, en los píxeles que están a la izquierda del puntero.' },
        { c: 'vec2 m = iMouse.xy / iResolution.xy;\nvec3 c = vec3(m, 0.5);',
          o: ['Toda la pantalla de un solo color, que cambia según dónde arrastres', 'Un degradado de izquierda a derecha', 'Un círculo de color bajo el puntero', 'Rayas de colores'],
          por: 'El color no depende del píxel, solo del ratón: todos los píxeles reciben el mismo color, con más rojo cuanto más a la derecha y más verde cuanto más arriba.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'Con <code>p</code> centrada en la pantalla, ¿qué se ve al usar el ratón?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Se usa la posición actual (xy) o la del clic (zw)?', '¿El resultado depende de <code>p</code>, del ratón o de los dos?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Dentro de la lupa',
    level: 'avanzado',
    gen: function (r) {
      var mx = r.pick([-0.2, 0, 0.1]), dx = r.pick([0.05, 0.1, 0.15, 0.2]), rad = r.pick([0.1, 0.2]), k = r.pick([0.5, 0.8]);
      var peso = Math.exp(-dx * dx / (rad * rad));
      return { mx: mx, dx: dx, px: mx + dx, rad: rad, k: k, peso: peso, qx: mx + dx * (1 - k * peso) };
    },
    ask: function (d) {
      return 'Una lupa está en <code>m = (' + U.fmt(d.mx, 1) + ', 0)</code>, con <code>radio = ' + U.fmt(d.rad, 1) + '</code> y <code>aumento = ' + U.fmt(d.k, 1) +
        '</code>. ¿Qué coordenada <code>q.x</code> se usa para dibujar el píxel <code>p = (' + U.fmt(d.px, 2) + ', 0)</code>? (Tres decimales.)';
    },
    fields: [{ name: 'q', label: 'q.x', w: 'wide' }],
    sol: function (d) { return { q: U.round(d.qx, 6) }; },
    tol: 1e-3,
    hint: function () { return ['$\\vec p - \\vec m$ y el peso $e^{-|\\vec p - \\vec m|^2 / r^2}$.', '$q_x = m_x + (p_x - m_x)\\,(1 - k\\cdot\\text{peso})$.']; },
    steps: function (d) {
      return ['$p_x - m_x = ' + U.fmt(d.dx, 2) + '$', '$\\text{peso} = e^{-' + U.fmt(d.dx, 2) + '^2 / ' + U.fmt(d.rad, 1) + '^2} \\approx ' + U.fmt(d.peso, 4) + '$',
        '$q_x = ' + U.fmt(d.mx, 1) + ' + ' + U.fmt(d.dx, 2) + '\\cdot(1 - ' + U.fmt(d.k, 1) + '\\cdot ' + U.fmt(d.peso, 4) + ') \\approx ' + U.fmt(d.qx, 3) + '$',
        '$q_x$ está más cerca de la lupa que $p_x$: se dibuja lo que hay más cerca del centro, y por eso se ve ampliado.'];
    },
    answer: function (d) { return U.fmt(d.qx, 3); }
  });

  p.keys([
    '<code>iMouse.xy</code> es donde está el puntero al arrastrar y <code>iMouse.zw</code>, donde se hizo el último clic; antes del primer clic valen 0.',
    'El ratón se lleva a las coordenadas del píxel con la misma transformación: $\\vec m = (\\text{iMouse.xy} - \\frac{1}{2}\\text{iResolution.xy}) / \\text{iResolution.y}$.',
    'Con <code>length(p - m)</code> se ilumina o se colorea según la distancia al ratón.',
    'Deformar las coordenadas con un peso que decrece con la distancia —una campana— produce lupas y ojos de pez.'
  ]);
});
