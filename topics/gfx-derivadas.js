/* Tema: Derivar dentro del shader */
Course.topic('gfx-derivadas', function (p) {

  p.text('Hasta ahora hemos puesto los bordes suaves a mano: <code>smoothstep(0.0, 0.02, d)</code>, ' +
    'y ese <code>0.02</code> salió de probar hasta que quedó bien. Funciona en un tamaño y falla en ' +
    'todos los demás. Si haces zoom, el borde se vuelve una nube; si te alejas, vuelve a ser una ' +
    'escalera. Este tema arregla eso de una vez, y de paso mete la [[fn-derivadas|derivada]] dentro del ' +
    'shader.');

  p.section('El píxel sí sabe algo de sus vecinos');

  p.text('Te dije al principio que cada píxel se calcula solo, sin saber nada de los demás. Era ' +
    'casi verdad. La tarjeta gráfica no procesa los píxeles de uno en uno: los agrupa en ' +
    '<strong>cuadraditos de dos por dos</strong> y ejecuta el mismo programa para los cuatro a la ' +
    'vez, paso por paso. Eso significa que, en cualquier punto del programa, un píxel puede ' +
    'preguntar cuánto vale una variable <em>en el píxel de al lado</em>, porque su compañero de ' +
    'cuadro va exactamente por la misma línea.');

  p.text('De ahí salen tres funciones:');

  p.table(['Función', 'Qué devuelve'], [
    ['<code>dFdx(v)</code>', 'cuánto cambia <code>v</code> al moverse <strong>un píxel a la derecha</strong>'],
    ['<code>dFdy(v)</code>', 'cuánto cambia <code>v</code> al moverse <strong>un píxel hacia arriba</strong>'],
    ['<code>fwidth(v)</code>', '<code>abs(dFdx(v)) + abs(dFdy(v))</code>: cuánto cambia en total al moverse un píxel en diagonal']
  ]);

  p.text('Eso es una <strong>derivada</strong>, y es exactamente la que estudiaste en ' +
    '[[fn-derivadas|derivadas]], pero calculada como se calcula en la práctica y no en el papel: ' +
    'por <strong>diferencias finitas</strong>, restando dos valores vecinos, sin límite y sin ' +
    'álgebra. Es el mismo método del tema de [[av-numerico|cálculo numérico]], con la ventaja ' +
    'insólita de que aquí el paso $h$ vale exactamente un píxel y no hay que elegirlo.');

  p.formula('\\frac{\\partial v}{\\partial x} \\approx v(x+1,\\,y) - v(x,\\,y)',
    'la derivada del hardware',
    'Y como <code>v</code> puede ser cualquier cosa —una coordenada, una distancia, un color— lo ' +
      'que estás derivando es <em>tu propio programa</em>, sin haberlo escrito en ninguna parte. ' +
      'La tarjeta no sabe qué fórmula usaste: solo resta.');

  p.note('El precio de esa magia es que la respuesta es la misma para los cuatro píxeles del ' +
    'cuadro, así que las derivadas tienen la resolución de dos píxeles, no de uno. Y hay una regla ' +
    'que muerde: <strong>no llames a <code>dFdx</code> dentro de un <code>if</code></strong> del que ' +
    'unos píxeles del cuadro entren y otros no. Si un compañero no llegó a esa línea, no hay nada ' +
    'que restar y el resultado es basura.', 'warn', 'La regla del cuadro');

  p.section('El borde que se ajusta solo');

  p.text('Ahora el arreglo. Si <code>d</code> es la distancia con signo a la figura, ' +
    '<code>fwidth(d)</code> te dice <strong>cuánta distancia hay en un píxel</strong>. Y esa es ' +
    'justo la anchura que debe tener la transición para ocupar un píxel y ni uno más:');

  p.formula('\\text{máscara} = 1 - \\operatorname{smoothstep}\\bigl(-w,\\ w,\\ d\\bigr), \\qquad w = \\operatorname{fwidth}(d)',
    'antialiasing exacto');

  p.text('Si el objeto se acerca, la distancia cambia despacio de píxel a píxel, $w$ se hace ' +
    'pequeña y el borde se estrecha. Si se aleja, pasa lo contrario. El número mágico ha ' +
    'desaparecido: el borde mide un píxel a cualquier escala, para siempre.');

  p.demo({
    title: 'A mano contra automático',
    intro: 'La misma rejilla de círculos, con el zoom en tus manos. La mitad izquierda usa una anchura fija escrita a mano; la derecha, fwidth. Aleja el zoom y mira cuál de las dos se rompe.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-der-1', alto: 320,
        aria: 'Comparación entre un borde de anchura fija y uno calculado con fwidth, con zoom variable.',
        mandos: [
          { n: 'zoom', label: 'zoom', min: 1, max: 40, step: 0.5, value: 6, dec: 1 },
          { n: 'anchoFijo', label: 'ancho a mano', min: 0.002, max: 0.1, step: 0.002, value: 0.02, dec: 3 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    bool derecha = fragCoord.x > 0.5 * iResolution.x;\n' +
          '\n' +
          '    vec2 q = fract(p * zoom) - 0.5;\n' +
          '    float d = length(q) - 0.32;\n' +
          '\n' +
          '    // el ancho del borde, de las dos maneras\n' +
          '    float w = derecha ? fwidth(d) : anchoFijo;\n' +
          '\n' +
          '    float v = 1.0 - smoothstep(-w, w, d);\n' +
          '\n' +
          '    vec3 tinta = derecha ? vec3(0.4, 0.95, 0.8) : vec3(1.0, 0.6, 0.45);\n' +
          '    color = vec4(v * tinta, 1.0);\n' +
          '\n' +
          '    // la linea divisoria\n' +
          '    float sep = abs(fragCoord.x - 0.5 * iResolution.x);\n' +
          '    color.rgb = mix(vec3(0.5), color.rgb, step(1.0, sep));\n' +
          '}\n',
        nota: 'Fíjate en que <code>fwidth</code> se calcula <em>fuera</em> del <code>if</code>: se ' +
          'llama siempre y luego se elige. Con el zoom alto, el lado de la izquierda se convierte en ' +
          'un enrejado gris y el de la derecha sigue siendo nítido.'
      });
    }
  });

  p.section('Un relieve a partir de un número');

  p.text('La segunda cosa que abren las derivadas es más espectacular. Toma cualquier función que ' +
    'dé un número por punto —el ruido del tema anterior, por ejemplo— y trátala como un ' +
    '<strong>mapa de alturas</strong>: donde vale mucho, hay una montaña. Su ' +
    '[[av-vectorial|gradiente]] apunta hacia la subida, y con él se puede fabricar la ' +
    '<strong>normal</strong> de la superficie, que es la dirección hacia donde mira cada trocito ' +
    'de terreno.');

  p.formula('\\vec{n} = \\text{normalizar}\\left(-\\frac{\\partial h}{\\partial x},\\ -\\frac{\\partial h}{\\partial y},\\ 1\\right)',
    'la normal de un relieve');

  p.text('Y con la normal se ilumina: cuanto más de frente mire un trozo hacia la luz, más brilla. ' +
    'Ese producto escalar entre la normal y la dirección de la luz es toda la iluminación difusa ' +
    'que necesitas, y es el mismo [[ge-vectores|producto escalar]] de la geometría del plano.');

  p.demo({
    title: 'Iluminar el ruido',
    intro: 'El mismo fbm de nubes del tema anterior, pero ahora leído como altura y alumbrado con una luz que gira. Deja de parecer una mancha y pasa a parecer terreno.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-der-2', alto: 330,
        aria: 'Un relieve rocoso generado por ruido, iluminado por una luz que gira alrededor.',
        mandos: [
          { n: 'relieve', label: 'relieve', min: 0.1, max: 4, step: 0.1, value: 1.6, dec: 1 },
          { n: 'escala', label: 'escala', min: 1, max: 12, step: 0.5, value: 5, dec: 1 },
          { n: 'giro', label: 'giro de la luz', min: 0, max: 1, step: 0.01, value: 1, dec: 2 }
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
          'float altura(vec2 p)\n' +
          '{\n' +
          '    float s = 0.0, a = 0.5;\n' +
          '    for (int k = 0; k < 5; k++) { s += a * ruido(p); p *= 2.0; a *= 0.5; }\n' +
          '    return s;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = fragCoord / iResolution.y;\n' +
          '    float h = altura(p * escala) * relieve;\n' +
          '\n' +
          '    // la normal, calculada por la tarjeta sin que yo derive nada\n' +
          '    vec3 n = normalize(vec3(-dFdx(h) * iResolution.y * 0.02,\n' +
          '                            -dFdy(h) * iResolution.y * 0.02,\n' +
          '                             1.0));\n' +
          '\n' +
          '    // una luz que da vueltas\n' +
          '    float ang = iTime * 0.6 * giro;\n' +
          '    vec3 luz = normalize(vec3(cos(ang), sin(ang), 0.55));\n' +
          '\n' +
          '    float dif = max(dot(n, luz), 0.0);      // iluminacion difusa\n' +
          '    float amb = 0.18;                        // luz de relleno\n' +
          '\n' +
          '    vec3 roca = mix(vec3(0.25, 0.18, 0.22), vec3(0.95, 0.80, 0.62), h);\n' +
          '    color = vec4(roca * (amb + dif), 1.0);\n' +
          '}\n',
        nota: 'Ese <code>iResolution.y * 0.02</code> es solo un factor de escala: convierte «cuánto ' +
          'cambia la altura por píxel» en algo comparable con el 1 de la tercera componente. Súbelo ' +
          'y el terreno se vuelve escarpado; bájalo y se aplana.'
      });
    }
  });

  p.note('Este truco se llama <em>bump mapping</em> y es una mentira preciosa: la superficie es ' +
    'plana como una tabla, no hay ni un bulto en ninguna parte. Lo único que se ha cambiado es ' +
    '<strong>hacia dónde dice cada punto que mira</strong>, y el ojo se traga el relieve entero. Si ' +
    'miras el borde de la figura, la mentira se cae: sigue siendo recto.', null, 'Relieve de mentira');

  p.util('Las derivadas del hardware están detrás de tres cosas que ves constantemente. La primera, ' +
    'el antialiasing de los bordes en cualquier interfaz moderna. La segunda, el ' +
    '<em>bump mapping</em>: la rugosidad de casi todas las superficies de un videojuego es esto. Y ' +
    'la tercera, invisible: cuando una textura se ve de lejos, la tarjeta usa <code>fwidth</code> ' +
    'para decidir qué versión reducida de la imagen coger, y por eso las carreteras lejanas no ' +
    'centellean.');

  p.hist('El truco del relieve falso lo publicó James Blinn en 1978, y su elegancia está en darse ' +
    'cuenta de que el ojo no juzga la forma de una superficie por su silueta sino por cómo reparte ' +
    'la luz. Diez años después, las tarjetas empezaron a agrupar píxeles en cuadros de dos por dos ' +
    'por razones de eficiencia, sin pensar en derivadas, y alguien se dio cuenta de que aquella ' +
    'decisión de ingeniería regalaba gratis un operador diferencial.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Derivar restando vecinos',
    level: 'basico',
    gen: function (r) {
      var v = r.real(0.1, 0.9, 4);
      var dx = r.real(-0.06, 0.06, 4), dy = r.real(-0.06, 0.06, 4);
      return { v: v, vx: v + dx, vy: v + dy, dx: dx, dy: dy, fw: Math.abs(dx) + Math.abs(dy) };
    },
    ask: function (d) {
      return 'En un cuadro de dos por dos, la variable <code>d</code> vale <code>' + U.fmt(d.v, 4) +
        '</code> en tu píxel, <code>' + U.fmt(d.vx, 4) + '</code> en el de tu derecha y <code>' +
        U.fmt(d.vy, 4) + '</code> en el de arriba.<br><br>¿Cuánto valen <code>dFdx(d)</code>, ' +
        '<code>dFdy(d)</code> y <code>fwidth(d)</code>? (cuatro decimales)';
    },
    fields: [
      { name: 'x', label: 'dFdx', w: 'tiny' },
      { name: 'y', label: 'dFdy', w: 'tiny' },
      { name: 'w', label: 'fwidth', w: 'tiny' }
    ],
    sol: function (d) { return { x: U.round(d.dx, 8), y: U.round(d.dy, 8), w: U.round(d.fw, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'Son restas, nada más: el vecino menos tú. Y <code>fwidth</code> es la suma de los dos ' +
        '<strong>valores absolutos</strong>, no la suma a secas: mide cuánto cambia la cosa, no ' +
        'hacia dónde.';
    },
    steps: function (d) {
      return ['$\\operatorname{dFdx} = ' + U.fmt(d.vx, 4) + ' - ' + U.fmt(d.v, 4) + ' = ' + U.fmt(d.dx, 4) + '$',
        '$\\operatorname{dFdy} = ' + U.fmt(d.vy, 4) + ' - ' + U.fmt(d.v, 4) + ' = ' + U.fmt(d.dy, 4) + '$',
        '$\\operatorname{fwidth} = |' + U.fmt(d.dx, 4) + '| + |' + U.fmt(d.dy, 4) + '| = ' + U.fmt(d.fw, 4) + '$',
        'Ese último número es «cuánta distancia cabe en un píxel», y por eso sirve como anchura del borde.'];
    },
    answer: function (d) {
      return 'dFdx ' + U.fmt(d.dx, 4) + ' · dFdy ' + U.fmt(d.dy, 4) + ' · fwidth ' + U.fmt(d.fw, 4);
    }
  });

  p.exercise({
    title: 'El ancho correcto del borde',
    level: 'medio',
    gen: function (r) {
      var alto = r.pick([360, 480, 600, 720, 1080]);
      var zoom = r.pick([2, 4, 6, 8, 12]);
      return { alto: alto, zoom: zoom, w: zoom / alto, fijo: 0.02 };
    },
    ask: function (d) {
      return 'El shader hace <code>vec2 p = ' + d.zoom + '.0 * fragCoord / iResolution.y;</code> en ' +
        'una ventana de <strong>' + d.alto + ' píxeles de alto</strong>, y luego dibuja con una ' +
        'distancia <code>d</code> medida en las unidades de <code>p</code>.<br><br>¿Cuánto vale ' +
        '<code>dFdx(p.x)</code>, es decir, cuántas unidades de <code>p</code> hay en un ' +
        'píxel?<br><br>Y si el borde se hubiera escrito a mano con <code>0.02</code>, ¿cuántos ' +
        'píxeles de ancho tendría? (cuatro decimales)';
    },
    fields: [
      { name: 'u', label: 'unidades por píxel', w: 'tiny' },
      { name: 'n', label: 'píxeles de borde', w: 'tiny' }
    ],
    sol: function (d) { return { u: U.round(d.w, 8), n: U.round(d.fijo / d.w, 8) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'Un píxel de <code>fragCoord</code> se convierte en <code>' + d.zoom + '/' + d.alto +
        '</code> unidades de <code>p</code>. Para lo segundo: si un píxel mide esa cantidad, ' +
        '¿cuántos píxeles caben en 0,02?';
    },
    steps: function (d) {
      return ['Cada píxel avanza $\\frac{' + d.zoom + '}{' + d.alto + '} = ' + U.fmt(d.w, 6) +
        '$ unidades de $p$.',
        'Un borde de $0{,}02$ ocupa entonces $\\frac{0{,}02}{' + U.fmt(d.w, 6) + '} = ' +
          U.fmt(d.fijo / d.w, 4) + '$ píxeles.',
        (d.fijo / d.w > 3 ? 'Más de tres píxeles: el borde se ve borroso, como si estuviera desenfocado.'
          : (d.fijo / d.w < 0.7 ? 'Menos de un píxel: el suavizado no llega a notarse y vuelve la escalera.'
            : 'Casualmente cerca de un píxel: aquí el número escrito a mano acierta, pero solo aquí.')),
        'Con <code>fwidth</code> el resultado es un píxel en todos los casos, sin tocar nada.'];
    },
    answer: function (d) {
      return U.fmt(d.w, 6) + ' unidades por píxel · borde de ' + U.fmt(d.fijo / d.w, 4) + ' píxeles';
    }
  });

  p.exercise({
    title: 'Escribe el borde que se ajusta solo',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'la <strong>máscara del interior</strong> del círculo, con el borde de un píxel',
          ref: '1.0 - smoothstep(-fwidth(d), fwidth(d), d)' },
        { pide: 'la <strong>máscara del exterior</strong> del círculo, con el borde de un píxel',
          ref: 'smoothstep(-fwidth(d), fwidth(d), d)' },
        { pide: 'una <strong>línea de contorno</strong> de un píxel sobre el borde del círculo, blanca sobre negro',
          ref: '1.0 - smoothstep(0.0, fwidth(d), abs(d))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 p = 8.0 * (fragCoord - 0.5*iResolution.xy) / iResolution.y;\nfloat d = length(fract(p) - 0.5) - 0.3;\nfloat v = <strong>???</strong> ;\ncolor = vec4(vec3(v), 1.0);</pre>';
    },
    fields: [{ name: 'v', label: 'la máscara', w: 'wide' }],
    sol: function (d) { return { v: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.v || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = 8.0 * (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  float d = length(fract(p) - 0.5) - 0.3;\n' +
          '  float v = ' + x + ';\n' +
          '  color = vec4(vec3(v), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 10 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Comprueba los paréntesis y que los números lleven ' +
          'punto decimal.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero no es lo que se pedía. Recuerda: dentro de la figura ' +
          '<code>d</code> es negativa, fuera es positiva, y en el borde vale cero.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'La transición va de $-w$ a $+w$ con $w = $ <code>fwidth(d)</code>, centrada en el ' +
        'cero, que es donde está el borde. Para un contorno, lo que interesa es que ' +
        '<code>abs(d)</code> sea pequeño.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Ni un número escogido a ojo: la anchura la pone la propia imagen.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { c: 'float d = length(p) - 0.3;\nfloat w = fwidth(d);\nfloat v = 1.0 - smoothstep(-w, w, d);',
          o: ['Un círculo con el borde suavizado justo lo que ocupa un píxel, sea cual sea el zoom', 'Un círculo con el borde duro, en escalones', 'Un círculo muy borroso', 'Un anillo'],
          por: '<code>fwidth(d)</code> es cuánto cambia la distancia de un píxel al siguiente: la transición del <code>smoothstep</code> ocupa siempre alrededor de un píxel.' },
        { c: 'vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\nfloat v = fwidth(p.x) * iResolution.y;',
          o: ['Toda la pantalla blanca, uniforme', 'Un degradado de izquierda a derecha', 'Toda la pantalla negra', 'Rayas verticales'],
          por: 'De un píxel al vecino, <code>p.x</code> cambia exactamente $\\frac{1}{\\text{alto}}$ en horizontal y nada en vertical: al multiplicar por la altura sale 1 en todas partes.' },
        { c: 'float h = ruido(p * 5.0);\nvec3 n = normalize(vec3(-dFdx(h), -dFdy(h), 0.01));\nfloat v = max(dot(n, normalize(vec3(1.0, 1.0, 1.0))), 0.0);',
          o: ['Un relieve iluminado de lado, como un terreno visto desde arriba con el sol bajo', 'Las mismas nubes, planas y sin relieve', 'Estática', 'Un color liso'],
          por: 'Las derivadas del ruido entre píxeles vecinos dan la inclinación del terreno, y con ella una normal: las laderas que miran a la luz se aclaran.' },
        { c: 'float v = step(0.5, fract(p.x * 200.0));',
          o: ['Rayas tan finas que se confunden y forman un muaré que parpadea', 'Rayas anchas y limpias', 'Toda la pantalla gris uniforme', 'Un degradado suave'],
          por: 'Hay unas 200 rayas por unidad, cada una de un par de píxeles: el muestreo de un píxel por raya no alcanza y aparecen patrones falsos. Por eso hace falta suavizar con la derivada.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'Con <code>p</code> centrada, <code>ruido</code> como en el tema y el color final <code>vec3(v)</code>, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['<code>dFdx</code> y <code>dFdy</code> son lo que cambia una expresión al pasar al píxel vecino; <code>fwidth</code>, la suma de sus valores absolutos.']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'La tarjeta procesa los píxeles en <strong>cuadros de 2×2</strong>, y por eso un píxel puede restarle a otro: eso es <code>dFdx</code>.',
    'Es la derivada por <strong>diferencias finitas</strong> del [[av-numerico|cálculo numérico]], con el paso fijado en un píxel.',
    '<code>fwidth(d)</code> mide cuánta distancia cabe en un píxel: usarla como anchura del <code>smoothstep</code> da un borde perfecto <strong>a cualquier escala</strong>.',
    'Derivando un campo leído como altura sale la <strong>normal</strong>, y con la normal se ilumina: relieve sobre una superficie plana.',
    'No llames a estas funciones dentro de un <code>if</code> que separe a los píxeles de un mismo cuadro.'
  ]);
});
