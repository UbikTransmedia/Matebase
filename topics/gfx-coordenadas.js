/* Tema: El lienzo es un plano cartesiano */
Course.topic('gfx-coordenadas', function (p) {

  p.puente('El tema anterior normalizó la coordenada. Este la centra, corrige el aspecto y la pasa a ' +
    'polares. Las herramientas son las del [[ge-vectores|plano y los vectores]]: el módulo y el ángulo ' +
    'con signo. Nada nuevo, solo dónde se pone el origen y con qué se divide.');

  p.text('En el tema anterior normalizamos la coordenada y salió un cuadrado de 0 a 1. Sirve para ' +
    'empezar, pero tiene dos defectos que hay que arreglar antes de dibujar nada serio: ' +
    '<strong>el origen está en una esquina</strong> y <strong>la imagen se deforma</strong> si la ' +
    'ventana no es cuadrada.');

  p.text('Los dos se arreglan en dos líneas, y esas dos líneas están al principio de prácticamente ' +
    'todos los shaders del mundo. Merece la pena entender por qué.');

  p.section('Poner el origen en el centro');

  p.text('Casi todo lo que vas a dibujar es simétrico respecto a algún sitio: un círculo, una ' +
    'estrella, una espiral. Trabajar con el origen en la esquina obliga a arrastrar un ' +
    '$-0{,}5$ por todas partes. Se mueve una vez y se olvida:');

  p.formula('\\mathbf{p} = \\mathbf{uv} - 0{,}5', 'centrar');

  p.text('Ahora el centro de la pantalla es el $(0,0)$, la izquierda es $-0{,}5$ y la derecha ' +
    '$+0{,}5$. Es el plano cartesiano de [[ge-vectores|geometría]], con el mismo convenio de signos que llevas ' +
    'usando desde entonces.');

  p.section('El problema del aspecto');

  p.text('Aquí está la trampa que descoloca a todo el mundo la primera vez. Si divides la $x$ entre ' +
    'el ancho y la $y$ entre el alto, estás usando <strong>dos escalas distintas</strong>: en una ' +
    'pantalla de 800 × 400, un paso de 0,1 en $x$ son 80 píxeles y en $y$ son 40. Un círculo sale ' +
    'ovalado.');

  p.text('La solución es dividir las dos coordenadas por <strong>el mismo número</strong>, ' +
    'normalmente el alto:');

  p.formula('\\mathbf{p} = \\frac{\\text{fragCoord} - 0{,}5\\,\\text{iResolution.xy}}{\\text{iResolution.y}}',
    'centrada y sin deformar',
    'Se dice: <em>«pe es igual a fragCoord menos cero coma cinco por iResolution punto equis ye, ' +
      'todo partido por iResolution punto ye»</em>.<br><br>Lo de arriba resta media pantalla, que es ' +
      'lo que mueve el origen al centro. Lo de abajo divide <strong>las dos componentes por el ' +
      'alto</strong>, y ahí está la clave: al usar el mismo divisor para las dos, una unidad mide lo ' +
      'mismo en horizontal que en vertical.<br><br>El resultado: la $y$ va de $-0{,}5$ a $+0{,}5$ ' +
      'siempre, y la $x$ se sale de ese rango en las pantallas anchas. Eso no es un fallo: es ' +
      'justamente lo que quieres, porque significa que hay más sitio a los lados.');

  p.comprueba('Pantalla de 1000 × 500 con la normalización buena, la que divide por el alto. ¿Entre qué valores va $p_x$?', [
    { t: 'De $-1$ a $1$', ok: true, por: 'La pantalla es el doble de ancha que alta: $p_x = (x - 500)/500$ va de $-1$ a $1$ mientras $p_y$ va de $-0{,}5$ a $0{,}5$. Hay más sitio a los lados, y eso es lo correcto.' },
    { t: 'De $-0{,}5$ a $0{,}5$, como $p_y$', ok: false, por: 'Eso pasaría dividiendo la $x$ por el ancho, y entonces una unidad horizontal mediría el doble que una vertical: el círculo saldría ovalado.' },
    { t: 'De 0 a 1', ok: false, por: 'Ese es el rango sin centrar. Al restar media pantalla, el origen se va al centro y los valores se reparten a los dos lados.' }
  ]);

  p.ejemplo({
    title: 'Un píxel, centrado y en polares',
    enunciado: 'Ventana de 1000 × 500 y píxel $(900, 100)$. Calcular $\\mathbf{p}$ con la normalización buena, pasarlo a polares y comparar con la normalización mala.',
    pasos: [
      { t: '<strong>Centrar y dividir por el alto.</strong> $p = \\left(\\dfrac{900 - 500}{500},\\ \\dfrac{100 - 250}{500}\\right) = (0{,}8,\\ -0{,}3)$.', antes: 'Resta media pantalla a cada componente y divide las dos entre 500.' },
      { t: '<strong>Dónde cae.</strong> A la derecha del centro y un poco por debajo. Fíjate en que $p_x = 0{,}8$ se sale de $[-0{,}5, 0{,}5]$: la pantalla es el doble de ancha que alta y la $x$ llega hasta $\\pm 1$.' },
      { t: '<strong>Polares.</strong> $r = \\sqrt{0{,}64 + 0{,}09} = \\sqrt{0{,}73} \\approx 0{,}854$. $\\theta = \\operatorname{atan2}(-0{,}3,\\ 0{,}8) \\approx -0{,}359$ rad, unos $-20{,}6°$: cuarto cuadrante.', antes: 'Pitágoras para $r$ y la arcotangente de dos argumentos para el ángulo.' },
      { t: '<strong>Con la normalización mala.</strong> $uv - 0{,}5 = (0{,}9 - 0{,}5,\\ 0{,}2 - 0{,}5) = (0{,}4,\\ -0{,}3)$. La $y$ coincide y la $x$ vale la mitad: en horizontal una unidad son 1000 píxeles y en vertical 500. Un círculo dibujado con esta $p$ se estira al doble de ancho.', antes: 'Divide la $x$ por 1000 y la $y$ por 500. ¿Qué componente cambia?' }
    ],
    cierre: 'La diferencia entre las dos normalizaciones es un solo divisor. Con el bueno, $r$ mide lo mismo en cualquier dirección y el círculo sale redondo.'
  });

  p.demo({
    title: 'El círculo que se deforma',
    intro: 'El mismo shader con las dos maneras de normalizar. Con el deslizador a la izquierda divide cada eje por lo suyo y el círculo sale ovalado; a la derecha divide los dos por el alto y sale redondo. Estira la ventana del navegador para verlo mejor.',
    predice: 'Antes de mover el mando: en una ventana el doble de ancha que alta, ¿cuánto más ancho que alto saldrá el «círculo» con la normalización mala?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-coord-1', alto: 260,
        aria: 'Un círculo que pasa de ovalado a redondo según cómo se normalicen las coordenadas.',
        mandos: [{ n: 'arreglado', label: 'corregir el aspecto', min: 0, max: 1, step: 1, value: 0, dec: 0 }],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    // mal: cada eje con su propia escala\n' +
          '    vec2 malo  = fragCoord / iResolution.xy - 0.5;\n' +
          '\n' +
          '    // bien: los dos ejes divididos por el ALTO\n' +
          '    vec2 bueno = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    vec2 p = mix(malo, bueno, arreglado);\n' +
          '\n' +
          '    float d = length(p);              // distancia al centro\n' +
          '    float dentro = 1.0 - step(0.3, d);\n' +
          '\n' +
          '    color = vec4(vec3(dentro), 1.0);\n' +
          '}\n',
        nota: '<code>length(p)</code> es la distancia al origen, o sea $\\sqrt{x^2+y^2}$: el teorema ' +
          'de Pitágoras, escrito en una palabra. Es la función más importante de todo el bloque.'
      });
    }
  });

  p.note('Ese <code>length(p)</code> merece que te pares. Es literalmente ' +
    '$\\sqrt{p_x^2 + p_y^2}$, el [[ge-vectores|módulo de un vector]]. Y la condición «estoy a menos de ' +
    '0,3 del centro» es la definición de circunferencia que aprendiste allí: el conjunto de puntos ' +
    'que están a una distancia fija de otro. Aquí, esa definición <strong>es</strong> el programa.',
    null, 'La definición de circunferencia, ejecutándose');

  p.section('Coordenadas polares');

  p.text('Para todo lo que gira —espirales, estrellas, rayos, sectores— el sistema cómodo no es el ' +
    'cartesiano sino el <strong>polar</strong>: en vez de «cuánto a la derecha y cuánto arriba», ' +
    '«a qué distancia y en qué ángulo».');

  p.formulas([
    'r = |\\mathbf{p}| = \\sqrt{x^2+y^2}',
    '\\theta = \\operatorname{atan2}(y,\\ x)'
  ], 'de cartesianas a polares',
    'En GLSL se escriben <code>float r = length(p);</code> y <code>float a = atan(p.y, p.x);</code>.' +
      '<br><br>Ojo a un detalle que confunde: <code>atan</code> con <strong>dos</strong> argumentos ' +
      'no es la arcotangente de toda la vida. Es la versión que mira los signos de los dos números ' +
      'para saber en qué cuadrante estás, y por eso devuelve un ángulo completo de $-\\pi$ a $\\pi$ ' +
      'en lugar de medio. Con un solo argumento no podría distinguir el primer cuadrante del ' +
      'tercero.<br><br>El ángulo sale en <strong>radianes</strong>, como en [[tr-circunferencia|trigonometría]].');

  p.demo({
    title: 'Ángulo y distancia, pintados',
    intro: 'A la izquierda se pinta la distancia al centro; a la derecha, el ángulo. Míralos por separado y luego combínalos: con esas dos cantidades se construye casi todo lo que gira.',
    predice: 'Con 5 brazos y espiral 0, ¿cuántas veces se repite la onda alrededor del centro? Y si pones brazos en 1, ¿qué crees que verás?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-coord-2', alto: 280,
        aria: 'Un disco de color donde el tono depende del ángulo y el brillo de la distancia al centro.',
        mandos: [
          { n: 'brazos', label: 'brazos', min: 1, max: 12, step: 1, value: 5, dec: 0 },
          { n: 'giro', label: 'espiral', min: -12, max: 12, step: 0.5, value: 0, dec: 1 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    float r = length(p);        // a qué distancia estoy\n' +
          '    float a = atan(p.y, p.x);   // en qué ángulo estoy\n' +
          '\n' +
          '    // una onda a lo largo del ángulo: eso son los brazos\n' +
          '    float onda = sin(a * brazos + r * giro);\n' +
          '\n' +
          '    float v = smoothstep(0.0, 0.15, onda) * smoothstep(0.5, 0.45, r);\n' +
          '\n' +
          '    color = vec4(vec3(v), 1.0);\n' +
          '}\n',
        nota: 'Sube «espiral» y mira lo que ocurre: al sumarle la distancia al ángulo, cada anillo ' +
          'está un poco más girado que el anterior, y los brazos se enroscan. Una suma, y sale una ' +
          'espiral.'
      });
    }
  });

  p.util('Esa espiral no es un adorno. Sumar al ángulo algo que depende del radio es exactamente lo ' +
    'que hace una <strong>galaxia espiral</strong>: las estrellas de fuera tardan más en dar la ' +
    'vuelta que las de dentro, así que los brazos se van retorciendo. El fenómeno se llama ' +
    '<em>enrollamiento diferencial</em> y el shader lo reproduce con una suma. Es un buen ejemplo de ' +
    'lo que este bloque intenta enseñar: una regla ridícula, un resultado que parece complicadísimo.');

  p.hist('Las coordenadas polares las sistematizó Newton hacia 1671, aunque la idea de situar un ' +
    'punto por distancia y ángulo es mucho más vieja: los astrónomos griegos y árabes llevaban ' +
    'siglos apuntando estrellas así, porque en el cielo no hay ejes pero sí hay un horizonte y un ' +
    'norte. Que hoy sirvan para dibujar una espiral en una tarjeta gráfica es la misma idea, con ' +
    'quince siglos de por medio.');

  p.trampas([
    { e: 'Dividir cada eje por su tamaño', por: 'Sale un cuadrado de 0 a 1 que no es cuadrado: en una pantalla de 800 × 400 una unidad horizontal mide el doble de píxeles que una vertical. El círculo sale ovalado.' },
    { e: 'Olvidar el $-0{,}5$ y dibujar centrado', por: 'Con <code>fragCoord / iResolution.y</code> a secas el origen sigue en la esquina y el círculo aparece abajo a la izquierda, cortado por los bordes.' },
    { e: 'Usar <code>atan(p.y / p.x)</code> con un solo argumento', por: 'Solo devuelve ángulos entre $-\\pi/2$ y $\\pi/2$ y confunde el primer cuadrante con el tercero. Con dos argumentos mira los signos y da la vuelta completa.' },
    { e: 'Pensar en grados', por: 'Todo lo trigonométrico del shader va en radianes. Girar «45» es girar 45 radianes: unas siete vueltas y pico.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Coordenada centrada',
    level: 'basico',
    gen: function (r) {
      var w = r.pick([600, 800, 1000]), h = r.pick([300, 400, 500]);
      var px = r.int(20, w - 20), py = r.int(20, h - 20);
      return { w: w, h: h, px: px, py: py, x: (px - 0.5 * w) / h, y: (py - 0.5 * h) / h };
    },
    ask: function (d) {
      return 'Con la normalización buena, <code>vec2 p = (fragCoord - 0.5*iResolution.xy) / ' +
        'iResolution.y;</code> y una ventana de <strong>' + d.w + ' × ' + d.h + '</strong>, ' +
        '¿cuánto valen <code>p.x</code> y <code>p.y</code> en el píxel <code>(' + d.px + ', ' +
        d.py + ')</code>? (cuatro decimales)';
    },
    fields: [
      { name: 'x', label: 'p.x', w: 'tiny' },
      { name: 'y', label: 'p.y', w: 'tiny' }
    ],
    sol: function (d) { return { x: U.round(d.x, 8), y: U.round(d.y, 8) }; },
    dec: 4,
    hint: function (d) {
      return 'Resta media pantalla a cada componente y divide las dos entre el <strong>alto</strong>, ' +
        'que aquí es ' + d.h + '. El mismo divisor para las dos: eso es lo que evita la deformación.';
    },
    steps: function (d) {
      return ['$p_x = \\dfrac{' + d.px + ' - ' + (d.w / 2) + '}{' + d.h + '} = ' + U.fmt(d.x, 4) + '$',
        '$p_y = \\dfrac{' + d.py + ' - ' + (d.h / 2) + '}{' + d.h + '} = ' + U.fmt(d.y, 4) + '$',
        'Fíjate en que $p_y$ nunca se sale de $[-0{,}5,\\ 0{,}5]$, y $p_x$ sí: la pantalla es más ' +
        'ancha que alta y eso se nota en que hay más sitio a los lados.'];
    },
    answer: function (d) { return 'p.x = ' + U.fmt(d.x, 4) + ', p.y = ' + U.fmt(d.y, 4); }
  });

  p.exercise({
    title: 'A polares',
    level: 'medio',
    gen: function (r) {
      var x = r.real(-0.9, 0.9, 3), y = r.real(-0.9, 0.9, 3);
      if (Math.abs(x) < 0.05 && Math.abs(y) < 0.05) return null;
      return { x: x, y: y, r: Math.sqrt(x * x + y * y), a: Math.atan2(y, x) };
    },
    ask: function (d) {
      return 'Un píxel cae en <code>p = (' + U.fmt(d.x, 3) + ', ' + U.fmt(d.y, 3) + ')</code>. ' +
        'Calcula <code>length(p)</code> y <code>atan(p.y, p.x)</code>, es decir, su distancia al ' +
        'centro y su ángulo en radianes (cuatro decimales).';
    },
    fields: [
      { name: 'r', label: 'r', w: 'tiny' },
      { name: 'a', label: 'ángulo (rad)', w: 'tiny' }
    ],
    sol: function (d) { return { r: U.round(d.r, 8), a: U.round(d.a, 8) }; },
    dec: 4,
    hint: function () {
      return 'La distancia es Pitágoras: $\\sqrt{x^2+y^2}$. El ángulo va de $-\\pi$ a $\\pi$, y el ' +
        'signo de cada componente dice el cuadrante.';
    },
    steps: function (d) {
      var cuad = (d.x >= 0 ? (d.y >= 0 ? 'primero' : 'cuarto') : (d.y >= 0 ? 'segundo' : 'tercero'));
      return ['$r = \\sqrt{' + U.fmt(d.x, 3) + '^2 + ' + U.fmt(d.y, 3) + '^2} = ' + U.fmt(d.r, 4) + '$',
        'El punto está en el cuadrante <strong>' + cuad + '</strong>, así que el ángulo tiene que ' +
        'caer en el tramo correspondiente.',
        '$\\theta = \\operatorname{atan2}(' + U.fmt(d.y, 3) + ',\\ ' + U.fmt(d.x, 3) + ') = ' +
        U.fmt(d.a, 4) + '$ rad $= ' + U.fmt(d.a * 180 / Math.PI, 1) + '°$'];
    },
    answer: function (d) { return 'r = ' + U.fmt(d.r, 4) + ', ángulo = ' + U.fmt(d.a, 4) + ' rad'; }
  });

  p.exercise({
    title: 'Centra tú el lienzo',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { pide: 'centrada y <strong>sin deformar</strong> (el mismo divisor para los dos ejes)',
          ref: '(fragCoord - 0.5 * iResolution.xy) / iResolution.y' },
        { pide: 'centrada pero <strong>sin corregir</strong> el aspecto (cada eje por lo suyo)',
          ref: 'fragCoord / iResolution.xy - 0.5' },
        { pide: 'sin centrar, solo <strong>normalizada</strong> de 0 a 1',
          ref: 'fragCoord / iResolution.xy' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa la línea para obtener una coordenada ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 p = <strong>???</strong> ;\nfloat d = length(p);\ncolor = vec4(vec3(1.0 - step(0.3, d)), 1.0);</pre>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe solo la expresión. Se ' +
        'corrige comparando el dibujo.</span>';
    },
    fields: [{ name: 'e', label: 'la expresión', w: 'wide' }],
    sol: function (d) { return { e: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.e || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión en la casilla.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = ' + x + ';\n' +
          '  float d = length(p);\n' +
          '  color = vec4(vec3(1.0 - step(0.3, d)), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 32, tol: 6 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Repasa los paréntesis y acuérdate del punto en los ' +
          'decimales: <code>0.5</code>, no <code>0,5</code> ni <code>0</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero el círculo no queda donde se pedía. Piensa qué mueve ' +
          'el origen (restar media pantalla) y qué corrige la deformación (un solo divisor).' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Restar <code>0.5 * iResolution.xy</code> mueve el origen al centro. Dividir entre ' +
        '<code>iResolution.y</code> —solo la y, para las dos componentes— iguala las escalas.';
    },
    steps: function (d) {
      return ['Se pedía una coordenada ' + d.pide + '.',
        'La respuesta es <code>' + d.ref + '</code>.',
        'La diferencia entre dividir por <code>iResolution.xy</code> y por <code>iResolution.y</code> ' +
        'es exactamente la diferencia entre un óvalo y un círculo.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\nfloat v = step(length(p), 0.3);',
          o: ['Un círculo blanco centrado, redondo aunque la pantalla sea ancha', 'Un círculo en la esquina inferior izquierda', 'Una elipse estirada a lo ancho', 'Un anillo'],
          por: 'El origen está en el centro y las dos coordenadas se dividen por la altura: la misma unidad en las dos direcciones, así que el círculo sale redondo.' },
        { c: 'vec2 uv = fragCoord / iResolution.xy - 0.5;\nfloat v = step(length(uv), 0.3);',
          o: ['Una elipse centrada, estirada a lo ancho de la pantalla', 'Un círculo perfecto centrado', 'Un círculo en la esquina inferior izquierda', 'Un cuadrado'],
          por: 'Al dividir la x por la anchura y la y por la altura, en una pantalla ancha una unidad horizontal ocupa más píxeles que una vertical: el círculo se estira.' },
        { c: 'vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\nfloat a = atan(p.y, p.x);\nfloat v = 0.5 + 0.5 * sin(8.0 * a);',
          o: ['Ocho sectores claros y ocho oscuros alrededor del centro, como una sombrilla', 'Ocho anillos concéntricos', 'Ocho rayas verticales', 'Un solo sector claro'],
          por: 'El valor solo depende del ángulo, que da una vuelta completa: el seno de $8a$ completa ocho ciclos en esa vuelta.' },
        { c: 'vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\nfloat v = fract(5.0 * length(p));',
          o: ['Anillos concéntricos que se aclaran hacia fuera y vuelven de golpe a negro', 'Sectores alrededor del centro', 'Un círculo relleno', 'Rayas horizontales'],
          por: 'El valor solo depende de la distancia al centro, y <code>fract</code> la hace crecer de 0 a 1 y volver a 0 cada quinto de unidad.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'En una pantalla más ancha que alta, con el color final <code>vec3(v)</code>, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Dónde está el origen? ¿Se divide igual en las dos direcciones?', '¿El valor depende de la distancia, del ángulo o de una sola coordenada?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'Centrar el origen es restar media pantalla; corregir la deformación es dividir <strong>las dos componentes por el mismo número</strong>, normalmente el alto.',
    'Con la normalización buena, $p_y$ va siempre de $-0{,}5$ a $0{,}5$ y $p_x$ se sale en las pantallas anchas: eso es correcto, significa que hay más sitio a los lados.',
    '<code>length(p)</code> es $\\sqrt{x^2+y^2}$: Pitágoras en una palabra, y la función más usada del bloque.',
    '<code>atan(y, x)</code> con dos argumentos mira los signos y devuelve el ángulo completo, de $-\\pi$ a $\\pi$.',
    'Con $r$ y $\\theta$ se construye todo lo que gira. Sumar $r$ al ángulo enrosca los brazos: eso es una espiral.'
  ]);
});
