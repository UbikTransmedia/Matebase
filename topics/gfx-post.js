/* Tema: La última pasada */
Course.topic('gfx-post', function (p) {

  p.text('Ya tienes la imagen. Está bien construida, bien iluminada, y aun así se nota que sale de ' +
    'un ordenador: demasiado limpia, demasiado uniforme, sin ningún accidente. Lo que falta es la ' +
    '<strong>última pasada</strong>, el puñado de operaciones que se aplican <em>sobre el color ya ' +
    'calculado</em> y que son, casi siempre, la diferencia entre una imagen correcta y una imagen ' +
    'que parece de alguien.');

  p.section('Trabajar sobre el resultado');

  p.text('El post-proceso tiene una característica que lo distingue de todo lo anterior: ' +
    '<strong>no sabe nada de la escena</strong>. No hay geometría, ni luces, ni distancias. Solo hay ' +
    'un color y una posición en pantalla. En un motor de verdad esto es literalmente una segunda ' +
    'pasada sobre la imagen ya dibujada; aquí lo montamos separando el shader en dos funciones:');

  p.formula('\\text{pantalla}(uv) = \\text{post}\\bigl(\\text{escena}(uv),\\ uv\\bigr)',
    'la última capa');

  p.text('Esa separación conviene hacerla siempre, aunque el shader sea pequeño. Deja el efecto ' +
    'aislado, se puede apagar de un mando, y se reutiliza tal cual en la siguiente pieza.');

  p.section('El catálogo del acabado');

  p.table(['Efecto', 'Qué hace', 'De dónde viene'], [
    ['<strong>Viñeta</strong>', 'oscurece las esquinas', 'los objetivos reales dejan pasar menos luz por los bordes'],
    ['<strong>Aberración cromática</strong>', 'separa el rojo del azul en los bordes', 'el vidrio desvía cada color un poco distinto'],
    ['<strong>Grano</strong>', 'ruido finísimo que cambia cada fotograma', 'la película fotográfica tiene cristales de plata'],
    ['<strong>Tramado</strong>', 'ruido ordenado que rompe las bandas de un degradado', 'la pantalla solo tiene 256 niveles por canal'],
    ['<strong>Barrido</strong>', 'líneas horizontales y curvatura de pantalla', 'un televisor de tubo dibujaba línea a línea'],
    ['<strong>Compresión de tono</strong>', 'mete los valores grandes dentro del rango visible', 'la escena tiene más rango que la pantalla']
  ]);

  p.text('Fíjate en la tercera columna: <strong>todos imitan un defecto</strong>. Ese es el chiste ' +
    'del post-proceso, y merece pensarlo un momento. La imagen generada es <em>demasiado</em> ' +
    'perfecta, y lo que la hace creíble es añadirle las limitaciones de un aparato físico. El ojo ' +
    'lleva un siglo aprendiendo qué aspecto tiene una foto, y una imagen sin ninguno de esos ' +
    'defectos le resulta falsa.');

  p.demo({
    title: 'La mesa de mezclas',
    intro: 'Una escena sencilla debajo y seis mandos encima. Empieza con todos a cero, sube el primero, luego el segundo. La última pasada se construye así, un mando cada vez.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-pos-1', alto: 380,
        aria: 'Una escena con controles independientes para viñeta, aberración cromática, grano, tramado y líneas de barrido.',
        mandos: [
          { n: 'vineta', label: 'viñeta', min: 0, max: 1.5, step: 0.05, value: 0.7, dec: 2 },
          { n: 'aberra', label: 'aberración cromática', min: 0, max: 0.03, step: 0.001, value: 0.008, dec: 3 },
          { n: 'grano', label: 'grano', min: 0, max: 0.3, step: 0.01, value: 0.06, dec: 2 },
          { n: 'barrido', label: 'líneas de barrido', min: 0, max: 0.6, step: 0.02, value: 0.2, dec: 2 },
          { n: 'exposicion', label: 'exposición', min: 0.2, max: 4, step: 0.05, value: 1.4, dec: 2 }
        ],
        codigo:
          'float hash(vec2 p)\n' +
          '{\n' +
          '    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          '// LA ESCENA: lo de siempre, encerrado en su funcion\n' +
          'vec3 escena(vec2 uv)\n' +
          '{\n' +
          '    vec2 p = (uv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0) * 2.0;\n' +
          '\n' +
          '    float a = atan(p.y, p.x), r = length(p);\n' +
          '    a = abs(mod(a, TAU / 6.0) - PI / 6.0);\n' +
          '    vec2 q = r * vec2(cos(a), sin(a));\n' +
          '\n' +
          '    float d = length(q - vec2(0.55, 0.12)) - 0.20;\n' +
          '    d = min(d, abs(q.y - 0.12 * q.x) - 0.012);\n' +
          '\n' +
          '    float v = 1.0 - smoothstep(0.0, 0.012, d);\n' +
          '    vec3 tinta = 0.5 + 0.5 * cos(TAU * (r * 0.8 + iTime * 0.1 + vec3(0.0, 0.33, 0.67)));\n' +
          '\n' +
          '    return v * tinta + 0.03;\n' +
          '}\n' +
          '\n' +
          '// LA ULTIMA PASADA: no sabe nada de la escena\n' +
          'vec3 post(vec2 uv, vec2 pix)\n' +
          '{\n' +
          '    // 1. aberracion: cada canal se lee un pelin desplazado\n' +
          '    vec2 hacia = (uv - 0.5) * aberra;\n' +
          '    vec3 c = vec3(escena(uv + hacia).r,\n' +
          '                  escena(uv).g,\n' +
          '                  escena(uv - hacia).b);\n' +
          '\n' +
          '    // 2. exposicion y compresion de tono\n' +
          '    c *= exposicion;\n' +
          '    c = c / (1.0 + c);\n' +
          '\n' +
          '    // 3. vineta: mas oscuro hacia las esquinas\n' +
          '    float v = 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);\n' +
          '    c *= mix(1.0, pow(v, 0.35), vineta);\n' +
          '\n' +
          '    // 4. lineas de barrido\n' +
          '    c *= 1.0 - barrido * 0.5 * (1.0 - cos(pix.y * PI));\n' +
          '\n' +
          '    // 5. grano, que cambia en cada fotograma\n' +
          '    c += grano * (hash(uv * iResolution.xy + fract(iTime) * 100.0) - 0.5);\n' +
          '\n' +
          '    return c;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = fragCoord / iResolution.xy;\n' +
          '    color = vec4(post(uv, fragCoord), 1.0);\n' +
          '}\n',
        nota: 'La aberración cromática se paga cara aquí: hay que <strong>calcular la escena tres ' +
          'veces</strong>, una por canal. En un motor con dos pasadas sería gratis, porque la imagen ' +
          'ya estaría guardada y solo habría que leerla tres veces.'
      });
    }
  });

  p.section('Por qué un degradado sale a rayas');

  p.text('Hay un artefacto que aparece en cuanto pones un degradado suave y oscuro, y que tiene ' +
    'nombre: <strong>bandas</strong>. Se ven escalones donde debería haber una transición continua, y ' +
    'la causa no es el shader: es que la pantalla solo tiene <strong>256 niveles por canal</strong>.');

  p.text('Si tu degradado recorre un intervalo de 0,1 en 400 píxeles, solo hay unos 25 valores ' +
    'distintos disponibles en todo ese recorrido, así que aparecen 25 franjas de 16 píxeles cada una. ' +
    'Es [[av-informacion|cuantización]] pura y dura, la de la teoría de la información.');

  p.text('La solución es preciosa por lo contraintuitiva: <strong>añadir ruido</strong>. Se le suma a ' +
    'cada píxel menos de medio escalón de ruido antes de cuantizar, y eso hace que los píxeles de una ' +
    'misma franja caigan unos a un lado y otros al otro. Vistos a distancia, el ojo promedia y ve el ' +
    'valor intermedio, que la pantalla no sabía representar. Se llama <strong>tramado</strong> ' +
    '(<em>dithering</em>), y cambia una banda visible por un ruido que no se ve.');

  p.demo({
    title: 'Bandas y tramado',
    intro: 'Un degradado oscuro, que es donde peor se porta la cuantización. Baja los niveles a 8 o 16 para exagerar el problema, y luego enciende el tramado: el ruido que se añade es menor que un escalón, y aun así hace desaparecer las franjas.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-pos-2', alto: 300,
        aria: 'Un degradado que muestra bandas de cuantización y cómo el tramado las disuelve.',
        mandos: [
          { n: 'niveles', label: 'niveles por canal', min: 4, max: 64, step: 1, value: 12, dec: 0 },
          { n: 'trama', label: 'tramado', min: 0, max: 1.5, step: 0.05, value: 0, dec: 2 },
          { n: 'ordenado', label: 'ordenado en vez de aleatorio', min: 0, max: 1, step: 1, value: 1, dec: 0 }
        ],
        codigo:
          '// ruido ordenado: parece aleatorio pero se reparte mucho mejor\n' +
          'float trama_ordenada(vec2 p)\n' +
          '{\n' +
          '    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));\n' +
          '}\n' +
          '\n' +
          'float trama_aleatoria(vec2 p)\n' +
          '{\n' +
          '    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = fragCoord / iResolution.xy;\n' +
          '\n' +
          '    // un degradado oscuro: el caso peor\n' +
          '    vec3 c = vec3(0.02, 0.03, 0.05) + uv.x * vec3(0.22, 0.20, 0.30);\n' +
          '    if (uv.y > 0.55) c = vec3(uv.x) * 0.35;\n' +
          '\n' +
          '    float paso = 1.0 / niveles;      // cuanto vale un escalon\n' +
          '\n' +
          '    // el ruido: MENOS de medio escalon\n' +
          '    float n = mix(trama_aleatoria(fragCoord), trama_ordenada(fragCoord), ordenado);\n' +
          '    c += (n - 0.5) * paso * trama;\n' +
          '\n' +
          '    // y ahora se cuantiza, como haria la pantalla\n' +
          '    c = floor(c * niveles + 0.5) / niveles;\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Compara el ruido aleatorio con el ordenado: el segundo es una fórmula de una línea ' +
          'que reparte los valores de forma mucho más pareja, y por eso ensucia menos para el mismo ' +
          'efecto. Se le llama <em>ruido de gradiente entrelazado</em>.'
      });
    }
  });

  p.note('El orden de la última pasada no es libre. La regla es imitar el camino físico de la luz: ' +
    'primero lo que pasa en el <strong>objetivo</strong> (curvatura, aberración), luego lo del ' +
    '<strong>sensor</strong> (exposición, compresión de tono), después el <strong>revelado</strong> ' +
    '(color, viñeta) y por último lo del <strong>soporte</strong> (grano y tramado, que van siempre ' +
    'al final, ya en el espacio de la pantalla).', 'warn', 'El orden de la cadena');

  p.section('Comprimir el tono');

  p.text('Un último detalle que se pasa por alto y estropea muchas imágenes. Cuando sumas luces, ' +
    'brillos especulares y reflejos, es normal acabar con valores mayores que 1. Si los recortas sin ' +
    'más, todo lo que se pasa se convierte en un manchón blanco plano y feo.');

  p.formula('c\' = \\frac{c}{1 + c}', 'compresión de Reinhard',
    'Una función que manda el $[0, \\infty)$ al $[0, 1)$ sin cortar nada: para valores pequeños casi ' +
      'no toca nada, y los grandes los va comprimiendo cada vez más. Es la misma curva de saturación ' +
      'que aparece en química y en biología, y aquí hace de <em>latitud</em> de la película.');

  p.text('Combinada con la exposición —multiplicar por un número antes de comprimir— tienes los dos ' +
    'mandos de una cámara, y son los que deciden si la imagen respira o está reventada.');

  p.util('Todo esto es la capa que el cine añade en la sala de etalonaje, y en los videojuegos es lo ' +
    'que la gente suele desactivar en el menú de opciones. Fuera del entretenimiento, la ' +
    'compresión de tono es la que hace que la foto del móvil se parezca a lo que viste con los ojos, ' +
    'porque el sensor captura un rango de brillos mucho mayor del que la pantalla puede mostrar; y el ' +
    'tramado sigue vivo en la impresión, donde una impresora que solo sabe poner o no poner tinta ' +
    'consigue grises repartiendo puntos.');

  p.hist('El tramado es de los años cincuenta y nació con las primeras pantallas y teletipos, que ' +
    'solo tenían dos niveles. Bayer publicó su matriz ordenada en 1973 y sigue usándose. La ironía es ' +
    'buena: durante cuarenta años se buscó cómo <em>quitarle</em> defectos a las imágenes digitales, ' +
    'y ahora se dedican ciclos de cálculo a devolvérselos, porque una imagen sin grano, sin viñeta y ' +
    'sin aberración le resulta al ojo menos real que una con ellos.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuánto oscurece la viñeta',
    level: 'basico',
    gen: function (r) {
      var x = r.real(0.05, 0.95, 2), y = r.real(0.05, 0.95, 2);
      var e = r.pick([0.25, 0.35, 0.5]);
      var v = 16 * x * y * (1 - x) * (1 - y);
      return { x: x, y: y, e: e, v: v, f: Math.pow(v, e) };
    },
    ask: function (d) {
      return 'La viñeta se calcula como <code>v = 16·uv.x·uv.y·(1-uv.x)·(1-uv.y)</code> y luego se ' +
        'aplica <code>pow(v, ' + U.fmt(d.e, 2) + ')</code>.<br><br>Para el píxel <code>uv = (' +
        U.fmt(d.x, 2) + ', ' + U.fmt(d.y, 2) + ')</code>, ¿cuánto valen <code>v</code> y el factor ' +
        'final? (cuatro decimales)';
    },
    fields: [
      { name: 'v', label: 'v', w: 'tiny' },
      { name: 'f', label: 'factor final', w: 'tiny' }
    ],
    sol: function (d) { return { v: U.round(d.v, 8), f: U.round(d.f, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'Ese 16 está puesto para que en el centro exacto, <code>(0,5, 0,5)</code>, el producto ' +
        'valga justo 1 y la viñeta no toque nada. Y la potencia, al ser menor que 1, ' +
        '<strong>suaviza</strong> el oscurecimiento en lugar de acentuarlo.';
    },
    steps: function (d) {
      return ['$v = 16 \\cdot ' + U.fmt(d.x, 2) + ' \\cdot ' + U.fmt(d.y, 2) + ' \\cdot ' +
        U.fmt(1 - d.x, 2) + ' \\cdot ' + U.fmt(1 - d.y, 2) + ' = ' + U.fmt(d.v, 4) + '$',
        'Factor: $' + U.fmt(d.v, 4) + '^{' + U.fmt(d.e, 2) + '} = ' + U.fmt(d.f, 4) + '$',
        'Como el exponente es menor que 1, la caída es más gradual: con exponente 1 el mismo píxel ' +
          'quedaría en $' + U.fmt(d.v, 4) + '$, bastante más oscuro.',
        'En el centro, $v = 1$ y el factor es 1: la viñeta no toca nada allí, sea cual sea el exponente.'];
    },
    answer: function (d) { return 'v = ' + U.fmt(d.v, 4) + ' · factor = ' + U.fmt(d.f, 4); }
  });

  p.exercise({
    title: 'Las bandas de un degradado',
    level: 'medio',
    gen: function (r) {
      var rango = r.pick([0.08, 0.1, 0.15, 0.2]);
      var ancho = r.pick([300, 400, 600, 800]);
      var niveles = 256;
      var bandas = rango * (niveles - 1);
      return { rango: rango, ancho: ancho, bandas: bandas, px: ancho / bandas,
        paso: 1 / (niveles - 1) };
    },
    ask: function (d) {
      return 'Un degradado va de <code>0.0</code> a <code>' + U.fmt(d.rango, 2) + '</code> a lo ancho ' +
        'de <strong>' + d.ancho + ' píxeles</strong>, en una pantalla de <strong>8 bits por ' +
        'canal</strong> (256 niveles, escalones de $1/255$).<br><br>¿Cuántos <strong>valores ' +
        'distintos</strong> caben en ese recorrido, y cuántos píxeles de ancho mide cada banda? ' +
        '(cuatro decimales)';
    },
    fields: [
      { name: 'b', label: 'valores distintos', w: 'tiny' },
      { name: 'p', label: 'píxeles por banda', w: 'tiny' }
    ],
    sol: function (d) { return { b: U.round(d.bandas, 8), p: U.round(d.px, 8) }; },
    tol: 3e-3,
    hint: function (d) {
      return 'Un escalón vale $1/255 \\approx 0{,}00392$. ¿Cuántos escalones caben en ' +
        U.fmt(d.rango, 2) + '? Y luego reparte los ' + d.ancho + ' píxeles entre ellos.';
    },
    steps: function (d) {
      return ['Escalón: $1/255 = ' + U.fmt(d.paso, 6) + '$',
        'Valores distintos: $' + U.fmt(d.rango, 2) + ' / ' + U.fmt(d.paso, 6) + ' = ' +
          U.fmt(d.bandas, 4) + '$',
        'Anchura de cada banda: $' + d.ancho + ' / ' + U.fmt(d.bandas, 4) + ' = ' + U.fmt(d.px, 4) +
          '$ píxeles',
        d.px > 8
          ? 'Bandas de más de ocho píxeles: se ven a simple vista, y a eso se le llama <em>banding</em>.'
          : 'Bandas de pocos píxeles: molestan menos, pero en una zona oscura y lisa se siguen notando.',
        'El tramado no añade ni un valor nuevo: reparte el error entre píxeles vecinos para que el ' +
          'ojo promedie.'];
    },
    answer: function (d) {
      return U.fmt(d.bandas, 4) + ' valores · ' + U.fmt(d.px, 4) + ' píxeles por banda';
    }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec2 q = uv - 0.5;\ncol *= 1.0 - 1.5 * dot(q, q);',
          o: ['La imagen se oscurece suavemente hacia las esquinas: una viñeta', 'La imagen se aclara hacia las esquinas', 'Se oscurece el centro', 'Aparece un marco negro de borde duro'],
          por: '$|\\vec q|^2$ vale 0 en el centro y crece hacia las esquinas, así que el factor baja de 1 poco a poco al alejarse del centro.' },
        { c: 'col.r = escena(uv + vec2(0.003, 0.0)).r;\ncol.b = escena(uv - vec2(0.003, 0.0)).b;',
          o: ['Los bordes de los objetos aparecen con franjas rojas y azules, como en una lente barata', 'La imagen se ve más nítida', 'La imagen entera se vuelve roja', 'La imagen se desplaza sin cambiar de color'],
          por: 'El rojo y el azul se toman de posiciones un poco desplazadas en sentidos opuestos: donde hay un borde, los canales no coinciden y asoman franjas de color.' },
        { c: 'col += 0.08 * (hash(fragCoord + iTime) - 0.5);',
          o: ['Un grano fino que bulle por toda la imagen, como en una película antigua', 'Rayas horizontales fijas', 'La imagen entera parpadea', 'La imagen se desenfoca'],
          por: 'Cada píxel recibe un pequeño número al azar, distinto en cada instante porque el tiempo entra en el hash: ruido que cambia sin parar.' },
        { c: 'col *= 0.9 + 0.1 * sin(3.14159 * fragCoord.y);',
          o: ['Líneas horizontales finas, como las de un monitor antiguo', 'Líneas verticales', 'Un tablero de ajedrez', 'Grano'],
          por: 'El factor solo depende de la fila de píxeles, <code>fragCoord.y</code>, y alterna a escala de un par de píxeles: líneas de barrido horizontales.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'En la última pasada, con <code>uv</code> de 0 a 1, <code>col</code> el color ya calculado y <code>escena</code> la imagen de partida, ¿qué hace esta línea?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Hace', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿De qué depende el efecto: de la distancia al centro, de la fila del píxel, del azar o de un desplazamiento entre canales?']; },
    steps: function (d) { return [d.por, 'Hace: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe la última pasada',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'una <strong>viñeta</strong>: multiplicar el color por <code>pow(16·uv.x·uv.y·(1-uv.x)·(1-uv.y), 0.35)</code>',
          ref: 'c * pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.35)' },
        { pide: '<strong>compresión de tono</strong> de Reinhard después de doblar la exposición',
          ref: '(c * 2.0) / (1.0 + c * 2.0)' },
        { pide: '<strong>líneas de barrido</strong>: rebajar un 30 % siguiendo <code>1 - 0.3·(1-cos(fragCoord.y·PI))/2</code>',
          ref: 'c * (1.0 - 0.3 * 0.5 * (1.0 - cos(fragCoord.y * PI)))' },
        { pide: 'un <strong>negativo</strong> con la mitad de contraste alrededor del gris medio',
          ref: 'vec3(0.5) + (vec3(1.0) - c - vec3(0.5)) * 0.5' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa la última pasada para aplicar ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 uv = fragCoord / iResolution.xy;\nvec3 c = escena(uv);\nc = <strong>???</strong> ;\ncolor = vec4(c, 1.0);</pre>';
    },
    fields: [{ name: 'c', label: 'el color final', w: 'wide' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'vec3 escena(vec2 uv){\n' +
          '  vec2 p = (uv - 0.5) * 2.0;\n' +
          '  float d = length(p) - 0.6;\n' +
          '  float v = 1.0 - smoothstep(0.0, 0.02, d);\n' +
          '  return v * vec3(0.9, 0.55, 0.35) + 0.12 + 0.5 * uv.x;\n}\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = fragCoord / iResolution.xy;\n' +
          '  vec3 c = escena(uv);\n' +
          '  c = ' + x + ';\n' +
          '  color = vec4(clamp(c, 0.0, 1.0), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 7 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado tiene que ser un <code>vec3</code>, y ' +
          'recuerda que <code>fragCoord</code> y <code>uv</code> están disponibles.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero el acabado no coincide. Fíjate en si el efecto ' +
          '<em>multiplica</em> al color (viñeta, barrido) o lo <em>transforma</em> entero ' +
          '(compresión, negativo).' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Casi todo el post-proceso es multiplicar el color por un número que depende de ' +
        '<code>uv</code>. Solo la compresión de tono y las inversiones cambian el color en sí.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Ni una línea de la escena se ha tocado: la última pasada solo ve un color y una posición.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'El post-proceso trabaja sobre el <strong>color ya calculado</strong> y no sabe nada de la escena. Conviene aislarlo en su propia función.',
    'Casi todos estos efectos <strong>imitan un defecto</strong> de un aparato físico: objetivo, sensor, película o pantalla.',
    'Las <strong>bandas</strong> de un degradado son cuantización: la pantalla solo tiene 256 niveles por canal.',
    'El <strong>tramado</strong> las arregla añadiendo menos de medio escalón de ruido, para que el ojo promedie lo que la pantalla no puede representar.',
    'La <strong>compresión de tono</strong> $c/(1+c)$ mete cualquier valor dentro del rango visible sin recortar nada.',
    'El orden imita el camino de la luz: objetivo, sensor, revelado y soporte. El grano va siempre el último.'
  ]);
});
