/* Tema: Torcer el espacio */
Course.topic('gfx-warp', function (p) {

  p.text('En el tema de [[gfx-matrices|matrices]] apareció la idea que descoloca a todo el mundo: ' +
    'para mover una figura no se toca la figura, se toca la coordenada. Ahí lo hicimos con giros y ' +
    'escalados, que son transformaciones rígidas y previsibles. Ahora vamos a hacerlo ' +
    '<strong>con cualquier cosa</strong>, y es donde el bloque se pone verdaderamente interesante.');

  p.section('La idea, en un renglón');

  p.text('Tienes una función que dibuja algo, $F(p)$. En vez de evaluarla en $p$, la evalúas en otro ' +
    'sitio:');

  p.formula('F_{\\text{torcido}}(p) = F\\bigl(p + g(p)\\bigr)', 'deformar el dominio',
    'Donde $g$ es cualquier función que devuelva un desplazamiento. Es una ' +
      '[[fn-concepto|composición de funciones]] de las de toda la vida, $F \\circ (\\text{id} + g)$, ' +
      'y todo el efecto está en que $g$ dice, para cada punto, «tú mira un poquito más allá».');

  p.text('Lo notable es que <strong>$F$ no se entera de nada</strong>. Sigues dibujando un círculo ' +
    'perfecto, una rejilla perfecta, un ruido cualquiera: lo que has cambiado es el suelo sobre el ' +
    'que se dibujan. Y como $g$ puede ser cualquier función, la lista de efectos que salen de esta ' +
    'línea es prácticamente infinita.');

  p.demo({
    title: 'Una rejilla que se retuerce',
    intro: 'La rejilla del tema de repetición, sin tocar. Lo único que cambia es dónde se pregunta: cada punto se desplaza un poco según un seno de su otra coordenada. Sube la amplitud despacio.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-war-1', alto: 320,
        aria: 'Una rejilla de círculos que se deforma en ondas al aumentar la amplitud del desplazamiento.',
        mandos: [
          { n: 'amplitud', label: 'amplitud', min: 0, max: 0.6, step: 0.01, value: 0.18, dec: 2 },
          { n: 'frecuencia', label: 'frecuencia', min: 0.5, max: 8, step: 0.1, value: 3, dec: 1 },
          { n: 'anima', label: 'animar', min: 0, max: 1, step: 1, value: 1, dec: 0 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    p *= 5.0;\n' +
          '\n' +
          '    float t = iTime * anima;\n' +
          '\n' +
          '    // g(p): cuanto se desplaza cada punto\n' +
          '    vec2 g = amplitud * vec2(sin(frecuencia * p.y + t),\n' +
          '                             sin(frecuencia * p.x + t * 1.3));\n' +
          '\n' +
          '    // y AQUI esta todo el efecto: preguntar en otro sitio\n' +
          '    vec2 q = p + g * 5.0;\n' +
          '\n' +
          '    // a partir de aqui, la rejilla de siempre, sin enterarse de nada\n' +
          '    float d = length(fract(q) - 0.5) - 0.34;\n' +
          '    float v = 1.0 - smoothstep(-fwidth(d), fwidth(d), d);\n' +
          '\n' +
          '    vec3 tono = 0.5 + 0.5 * cos(TAU * (0.15 * (q.x + q.y) + vec3(0.0, 0.33, 0.67)));\n' +
          '    color = vec4(v * tono, 1.0);\n' +
          '}\n',
        nota: 'Con la amplitud a cero está la rejilla original, intacta. Todo lo que ves al subirla ' +
          'sale de <strong>dos senos</strong>: es el efecto de agua más barato que existe y sigue ' +
          'apareciendo en pantallas de todo el mundo.'
      });
    }
  });

  p.note('Una cosa que sorprende siempre: el desplazamiento va <strong>al revés</strong>. Si le ' +
    'sumas $(0{,}3,\\ 0)$ a la coordenada, la figura aparece desplazada $0{,}3$ hacia la ' +
    '<em>izquierda</em>, no hacia la derecha. Es la misma inversión de las matrices: no mueves la ' +
    'figura, mueves el sitio desde el que preguntas.', 'warn', 'Otra vez al revés');

  p.section('Ruido dentro del ruido');

  p.text('Ahora sustituye ese seno por el ruido fractal del tema del [[gfx-ruido|ruido]]. El ' +
    'desplazamiento pasa a ser irregular, orgánico, y el resultado deja de parecer un efecto de ' +
    'ordenador para parecer humo, mármol, o una fotografía de Júpiter.');

  p.formula('F(p) \\;\\longrightarrow\\; F\\bigl(p + k\\,\\text{fbm}(p)\\bigr) \\;\\longrightarrow\\; F\\bigl(p + k\\,\\text{fbm}(p + k\\,\\text{fbm}(p))\\bigr)',
    'una vuelta, dos vueltas');

  p.text('Y se puede volver a aplicar. Torcer el espacio con el que se tuerce el espacio. Dos ' +
    'vueltas bastan para que la imagen deje de tener nada que recuerde a una fórmula, y esa es la ' +
    'técnica que Íñigo Quílez bautizó <em>domain warping</em> y que ha comido buena parte del arte ' +
    'generativo de la última década.');

  p.demo({
    title: 'Cero, una, dos vueltas',
    intro: 'El mismo fbm de las nubes, deformado por sí mismo. El mando de vueltas es el importante: con cero es la mancha de siempre; con una aparecen las corrientes; con dos, los remolinos que ningún ruido produce por su cuenta.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-war-2', alto: 360,
        aria: 'Nubes de humo con remolinos, generadas metiendo ruido dentro del ruido.',
        mandos: [
          { n: 'vueltas', label: 'vueltas de torsión', min: 0, max: 2, step: 1, value: 2, dec: 0 },
          { n: 'fuerza', label: 'fuerza', min: 0, max: 3, step: 0.05, value: 1.4, dec: 2 },
          { n: 'escala', label: 'escala', min: 0.5, max: 5, step: 0.1, value: 2, dec: 1 },
          { n: 'anima', label: 'animar', min: 0, max: 1, step: 1, value: 1, dec: 0 }
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
          '// dos ruidos independientes: uno para cada componente del desplazamiento\n' +
          'vec2 desplaza(vec2 p)\n' +
          '{\n' +
          '    return vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = escala * fragCoord / iResolution.y;\n' +
          '    p += iTime * 0.03 * anima;\n' +
          '\n' +
          '    vec2 q = p;\n' +
          '    if (vueltas > 0.5) q = p + fuerza * desplaza(p);\n' +
          '    if (vueltas > 1.5) q = p + fuerza * desplaza(q);   // otra vez, sobre lo ya torcido\n' +
          '\n' +
          '    float n = fbm(q);\n' +
          '\n' +
          '    // el color tambien mira cuanto se ha torcido: los remolinos se ven mejor\n' +
          '    float torsion = length(q - p) * 0.5;\n' +
          '    vec3 c = 0.5 + 0.5 * cos(TAU * (n + torsion + vec3(0.0, 0.25, 0.5)) + 2.0);\n' +
          '\n' +
          '    color = vec4(c * (0.3 + 0.9 * n), 1.0);\n' +
          '}\n',
        nota: 'Fíjate en la línea que importa: <code>q = p + fuerza * desplaza(q)</code>. El ' +
          '<code>q</code> a la derecha, no <code>p</code>. Ese único carácter es la diferencia entre ' +
          'una vuelta y dos, y entre unas nubes normales y unos remolinos.'
      });
    }
  });

  p.section('Qué se puede meter ahí dentro');

  p.text('$g$ no tiene por qué ser ruido. Cualquier función vale, y cada una tiene su firma visual:');

  p.table(['Desplazamiento', 'Efecto'], [
    ['<code>A * sin(k * p.yx)</code>', 'ondas de agua, cortina, bandera'],
    ['<code>A * fbm(p)</code>', 'humo, mármol, corriente'],
    ['<code>normalize(p) * A</code>', 'un empujón radial: infla o vacía desde el centro'],
    ['<code>vec2(-p.y, p.x) * A</code>', 'un giro proporcional al radio: <strong>remolino</strong>'],
    ['<code>A / length(p)</code>', 'una lente: aumenta cerca del centro y comprime lejos']
  ]);

  p.text('Esa columna de la izquierda es, en realidad, un [[av-vectorial|campo vectorial]]: una ' +
    'flecha en cada punto del plano. Torcer el espacio es dibujar sobre un plano al que se le han ' +
    'aplicado esas flechas, y las mismas ideas del [[av-vectorial|cálculo vectorial]] —divergencia, rotacional— describen qué ' +
    'va a pasarle a la imagen: donde el campo diverge la imagen se estira, donde converge se ' +
    'apelmaza, y donde rota se hace un remolino.');

  p.note('Si el desplazamiento es muy grande, dos puntos distintos pueden acabar preguntando en el ' +
    'mismo sitio: la deformación deja de ser invertible y aparecen <strong>pliegues</strong>, ' +
    'imágenes espejadas y costuras. A veces es feísimo y a veces es justo lo que quieres. La ' +
    'frontera es el jacobiano de la transformación, y cuando su determinante cambia de signo, ahí ' +
    'está el pliegue.', 'warn', 'Cuando se pliega');

  p.util('Además del arte, la deformación de dominios es la base de varias cosas serias. El ' +
    '<em>morphing</em> entre dos caras es un campo de desplazamiento interpolado. Las lentes de ' +
    'corrección de las cámaras de móvil deshacen la distorsión del objetivo con exactamente esta ' +
    'operación. Los mapas de proyección cartográfica son deformaciones del dominio de la esfera. Y ' +
    'en imagen médica, el <em>registro deformable</em> alinea dos resonancias del mismo paciente ' +
    'tomadas con meses de diferencia buscando el campo $g$ que hace que una encaje sobre la otra.');

  p.hist('Es difícil no ver aquí a Hokusai y a Turner, que pintaron el agua sabiendo que el ojo ' +
    'reconoce la turbulencia sin necesidad de que sea correcta. Pero la genealogía técnica pasa por ' +
    'Ken Perlin otra vez: en su artículo de 1985 ya proponía usar el ruido para desplazar las ' +
    'coordenadas de una textura de mármol, y dejó escrita en dos líneas la técnica que treinta años ' +
    'después seguiría dando de comer a media demoscene.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Dónde acaba preguntando el píxel',
    level: 'basico',
    gen: function (r) {
      var px = r.real(-1.5, 1.5, 2), py = r.real(-1.5, 1.5, 2);
      var a = r.pick([0.2, 0.3, 0.5]), k = r.pick([1, 2, 3]);
      var qx = px + a * Math.sin(k * py), qy = py + a * Math.sin(k * px);
      return { px: px, py: py, a: a, k: k, qx: qx, qy: qy };
    },
    ask: function (d) {
      return 'El shader hace:<br><pre class="shd__mini">vec2 q = p + ' + U.fmt(d.a, 1) + ' * vec2(sin(' +
        d.k + '.0 * p.y), sin(' + d.k + '.0 * p.x));</pre>' +
        'Si <code>p = (' + U.fmt(d.px, 2) + ', ' + U.fmt(d.py, 2) + ')</code>, ¿cuánto vale ' +
        '<code>q</code>? (cuatro decimales, y el seno en radianes)';
    },
    fields: [
      { name: 'x', label: 'q.x', w: 'tiny' },
      { name: 'y', label: 'q.y', w: 'tiny' }
    ],
    sol: function (d) { return { x: U.round(d.qx, 8), y: U.round(d.qy, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'Ojo al cruce: la componente <code>x</code> del desplazamiento depende de <code>p.y</code>, ' +
        'y la <code>y</code> de <code>p.x</code>. Ese cruce es lo que produce la ondulación en las ' +
        'dos direcciones a la vez.';
    },
    steps: function (d) {
      return ['$q_x = ' + U.fmt(d.px, 2) + ' + ' + U.fmt(d.a, 1) + '\\sin(' + d.k + '\\cdot' +
        U.fmt(d.py, 2) + ') = ' + U.fmt(d.px, 2) + ' + ' + U.fmt(d.a, 1) + '\\cdot' +
        U.fmt(Math.sin(d.k * d.py), 4) + ' = ' + U.fmt(d.qx, 4) + '$',
        '$q_y = ' + U.fmt(d.py, 2) + ' + ' + U.fmt(d.a, 1) + '\\sin(' + d.k + '\\cdot' +
          U.fmt(d.px, 2) + ') = ' + U.fmt(d.qy, 4) + '$',
        'Y a partir de ahí el dibujo se hace en $q$ como si nada hubiera pasado.'];
    },
    answer: function (d) { return '(' + U.fmt(d.qx, 4) + ', ' + U.fmt(d.qy, 4) + ')'; }
  });

  p.exercise({
    title: 'Hacia dónde se va la figura',
    level: 'medio',
    gen: function (r) {
      var k = r.real(0.2, 0.8, 2);
      var esc = r.pick([2, 3, 4, 0.5]);
      var rad = r.pick([0.2, 0.3, 0.4]);
      return { k: k, esc: esc, r: rad };
    },
    ask: function (d) {
      return 'Un shader dibuja un círculo de radio <strong>' + U.fmt(d.r, 1) + '</strong> centrado en ' +
        'el origen, pero antes toca la coordenada:<br>' +
        '<pre class="shd__mini">p *= ' + U.fmt(d.esc, 1) + ';\np += vec2(' + U.fmt(d.k, 2) + ', 0.0);\nfloat d = length(p) - ' + U.fmt(d.r, 1) + ';</pre>' +
        '¿En qué <strong>x</strong> de la pantalla se ve el centro del círculo, y con qué ' +
        '<strong>radio</strong> aparente? (cuatro decimales)';
    },
    fields: [
      { name: 'x', label: 'centro visible en x', w: 'tiny' },
      { name: 'r', label: 'radio aparente', w: 'tiny' }
    ],
    sol: function (d) { return { x: U.round(-d.k / d.esc, 8), r: U.round(d.r / d.esc, 8) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'Despeja. El círculo se dibuja donde la coordenada <em>ya transformada</em> tiene módulo ' +
        U.fmt(d.r, 1) + '. Si esa coordenada es $' + U.fmt(d.esc, 1) + 'x + ' + U.fmt(d.k, 2) + '$, ' +
        '¿qué $x$ de pantalla la deja en cero?';
    },
    steps: function (d) {
      return ['La coordenada que llega al dibujo es $q = ' + U.fmt(d.esc, 1) + '\\,p + (' +
        U.fmt(d.k, 2) + ',\\ 0)$.',
        'El centro del círculo está donde $q = 0$: $' + U.fmt(d.esc, 1) + 'x + ' + U.fmt(d.k, 2) +
          ' = 0 \\Rightarrow x = -' + U.fmt(d.k, 2) + '/' + U.fmt(d.esc, 1) + ' = ' +
          U.fmt(-d.k / d.esc, 4) + '$',
        'El borde está donde $|q| = ' + U.fmt(d.r, 1) + '$, o sea a $' + U.fmt(d.r, 1) + '/' +
          U.fmt(d.esc, 1) + ' = ' + U.fmt(d.r / d.esc, 4) + '$ del centro: la figura ha salido ' +
          (d.esc > 1 ? 'más pequeña' : 'más grande') + '.',
        'Regla práctica: <strong>lo que le haces a la coordenada, la figura lo sufre al revés</strong>. ' +
          'Multiplicar por ' + U.fmt(d.esc, 1) + ' divide el tamaño, y el desplazamiento sumado ' +
          'después de la escala también aparece dividido.'];
    },
    answer: function (d) {
      return 'centro en ' + U.fmt(-d.k / d.esc, 4) + ' · radio ' + U.fmt(d.r / d.esc, 4);
    }
  });

  p.exercise({
    title: 'Escribe la torsión',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'una <strong>vuelta</strong> de torsión: preguntar el ruido en <code>p</code> desplazado por el propio ruido, con fuerza 1',
          ref: 'fbm(p + 1.0 * desplaza(p))' },
        { pide: 'un <strong>remolino</strong>: desplazar cada punto perpendicularmente a su propio radio, con fuerza 0,5',
          ref: 'fbm(p + 0.5 * vec2(-p.y, p.x))' },
        { pide: 'un <strong>empujón radial</strong>: alejar cada punto del centro una cantidad fija de 0,4',
          ref: 'fbm(p + 0.4 * normalize(p))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa para conseguir ' + d.pide + ':<br>' +
        '<pre class="shd__mini">// disponibles: fbm(vec2) y desplaza(vec2), que devuelve un vec2\nfloat n = <strong>???</strong> ;\ncolor = vec4(vec3(n), 1.0);</pre>';
    },
    fields: [{ name: 'n', label: 'el valor del ruido', w: 'wide' }],
    sol: function (d) { return { n: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'float hash(vec2 q){ return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }\n' +
          'float ruido(vec2 q){\n' +
          '  vec2 i = floor(q), f = fract(q);\n' +
          '  vec2 u = f * f * (3.0 - 2.0 * f);\n' +
          '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),\n' +
          '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);\n}\n' +
          'float fbm(vec2 q){\n' +
          '  float s = 0.0, a = 0.5;\n' +
          '  for (int k = 0; k < 4; k++) { s += a * ruido(q); q *= 2.0; a *= 0.5; }\n' +
          '  return s;\n}\n' +
          'vec2 desplaza(vec2 q){ return vec2(fbm(q), fbm(q + vec2(5.2, 1.3))); }\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = 3.0 * (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  float n = ' + x + ';\n' +
          '  color = vec4(vec3(n), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 8 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. <code>fbm</code> recibe un <code>vec2</code> y ' +
          'devuelve un <code>float</code>; <code>desplaza</code> devuelve un <code>vec2</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero no es la deformación pedida. Recuerda que lo que se ' +
          'suma va <em>dentro</em> del paréntesis del ruido, no fuera.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Todo va dentro: <code>fbm(p + algo)</code>. Lo único que cambia entre unos efectos y ' +
        'otros es qué es ese «algo». Para girar, el perpendicular de $(x, y)$ es $(-y, x)$.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Ni una línea de la función que dibuja ha cambiado: solo el sitio donde se le pregunta.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'p.x += 0.1 * sin(10.0 * p.y);\nfloat v = step(abs(p.x), 0.05);',
          o: ['Una línea vertical ondulada, como una serpiente', 'Una línea horizontal ondulada', 'Una línea vertical recta', 'Rayas horizontales'],
          por: 'Se dibuja la franja $|x| < 0{,}05$, pero después de desplazar la $x$ una cantidad que depende de la altura: la franja se curva de un lado a otro al subir.' },
        { c: 'p += 0.2 * vec2(ruido(p * 3.0), ruido(p * 3.0 + 7.0));\nfloat v = step(0.5, fract(p.x * 6.0));',
          o: ['Rayas verticales deformadas de forma irregular, como las vetas de la madera', 'Rayas verticales perfectamente rectas', 'Nubes suaves sin rayas', 'Anillos concéntricos'],
          por: 'El dibujo son rayas verticales, pero cada punto se pregunta en una posición desplazada un poco al azar, de forma suave: las rayas se tuercen.' },
        { c: 'float v = ruido(p * 3.0 + ruido(p * 3.0));',
          o: ['Nubes retorcidas, con remolinos que no tiene el ruido corriente', 'Nubes normales, iguales a las del ruido sin torcer', 'Rayas regulares', 'Estática'],
          por: 'Meter ruido dentro del ruido desplaza cada punto según el propio ruido: las formas se estiran y se enroscan.' },
        { c: 'p *= 1.0 + 0.3 * sin(iTime);\nfloat v = step(length(p), 0.3);',
          o: ['Un círculo que se encoge y se agranda periódicamente', 'Un círculo que se desplaza', 'Un círculo quieto', 'Un círculo que se aplasta en elipse'],
          por: 'Se escala la coordenada por un factor que oscila: cuando el factor crece la figura se encoge, y cuando baja, se agranda.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'Con <code>p</code> centrada, <code>ruido</code> como en el tema y el color final <code>vec3(v)</code>, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['Primero imagina el dibujo sin la deformación.', 'Después piensa cómo se mueve cada punto antes de preguntar por su color.']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'Torcer el dominio es evaluar la misma función <strong>en otro sitio</strong>: $F(p + g(p))$. La función que dibuja no se entera.',
    'El desplazamiento actúa <strong>al revés</strong>, igual que en las matrices: sumas a la coordenada y la figura se va en sentido contrario.',
    'Con un seno salen ondas; con ruido, humo; con un perpendicular, un remolino; con una división, una lente.',
    'Aplicarlo <strong>dos veces</strong> —torcer con lo ya torcido— es la receta que produce esos remolinos que ningún ruido da por su cuenta.',
    'Es un [[av-vectorial|campo vectorial]] actuando sobre el plano: donde diverge estira, donde converge apelmaza, donde rota hace remolino.'
  ]);
});
