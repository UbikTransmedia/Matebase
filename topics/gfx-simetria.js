/* Tema: Caleidoscopios */
Course.topic('gfx-simetria', function (p) {

  p.puente('El caleidoscopio del tema de matrices vuelve aquí desmontado en dos piezas: <code>abs</code> ' +
    'es un espejo y <code>mod</code> pliega el ángulo. Detrás están los [[av-grupos|grupos]] cíclico y ' +
    'diédrico, que aquí se cuentan mirando cuántas copias salen.');

  p.text('Un caleidoscopio es un tubo con dos espejos dentro y cuatro cristales rotos en el fondo. ' +
    'Lo que hace que sea hipnótico no son los cristales: es la simetría. Vamos a construir uno, y de ' +
    'paso vas a ver que <strong>toda la simetría de este bloque cabe en dos funciones</strong> que ya ' +
    'conoces: <code>abs</code> y <code>mod</code>.');

  p.section('Un valor absoluto es un espejo');

  p.text('Piensa en qué hace <code>abs</code> con el eje: manda el $-3$ al $3$, el $-0{,}5$ al ' +
    '$0{,}5$. Todo lo que había a la izquierda aparece a la derecha, y lo de la derecha se queda ' +
    'donde estaba. Aplicado a una coordenada, <strong>eso es exactamente un espejo</strong>:');

  p.formula('q = (\\,|p_x|,\\; p_y\\,) \\quad\\Longrightarrow\\quad \\text{simetría respecto del eje vertical}',
    'el espejo más barato del mundo');

  p.text('Y como siempre en este bloque, la figura no se entera: sigues dibujando lo que quieras y el ' +
    'espejo aparece solo. Dibuja algo asimétrico a la derecha y automáticamente hay una copia ' +
    'reflejada a la izquierda, gratis.');

  p.comprueba('Se hace <code>p.x = abs(p.x)</code> y después se dibuja un círculo centrado en $(-0{,}3,\\ 0)$. ¿Qué se ve?', [
    { t: 'Nada: tras el abs ningún píxel pregunta por una $x$ negativa, y el círculo queda donde nadie mira', ok: true, por: 'El espejo copia la mitad derecha en la izquierda. Lo que esté dibujado en $x < 0$ no lo ve ningún píxel. Para que aparezca reflejado hay que dibujarlo en $x > 0$.' },
    { t: 'Dos círculos, en $x = \\pm 0{,}3$', ok: false, por: 'Eso pasaría con el círculo en $(+0{,}3, 0)$. El abs solo pregunta por la mitad positiva del plano.' },
    { t: 'Un círculo a la izquierda, sin reflejo', ok: false, por: 'Los píxeles de la izquierda ya no preguntan por su propia posición: preguntan por la simétrica, que está a la derecha, donde no hay círculo.' }
  ]);

  p.section('Girar y plegar: simetría de orden n');

  p.text('Un espejo da dos copias. Para tener seis, como un copo de nieve, hay que pasarse a las ' +
    '[[gfx-coordenadas|coordenadas polares]] y plegar el <strong>ángulo</strong> igual que en el ' +
    'tema de repetición plegábamos la posición:');

  p.formulas([
    'a = \\operatorname{atan}(p_y,\\ p_x), \\qquad r = |p|',
    'a\' = \\operatorname{mod}\\!\\left(a,\\ \\frac{2\\pi}{n}\\right) - \\frac{\\pi}{n}',
    'q = r\\,(\\cos a\',\\ \\sin a\')'
  ], 'plegar el ángulo');

  p.text('La segunda línea es toda la idea. El círculo completo mide $2\\pi$; si lo partes en $n$ ' +
    'trozos y te quedas con el resto de la división, todos los ángulos caen dentro de un solo trozo. ' +
    'El $-\\pi/n$ del final centra ese trozo alrededor del cero, igual que el $-0{,}5$ centraba la ' +
    'celda en el tema de [[gfx-repetir|repetición]].');

  p.text('Y si además le aplicas <code>abs</code> al ángulo plegado, cada sector se refleja sobre sí ' +
    'mismo y las copias se duplican: pasas de $n$ a $2n$. Eso es un caleidoscopio de verdad, con sus ' +
    'dos espejos.');

  p.ejemplo({
    title: 'Plegar dos ángulos con orden 6',
    enunciado: 'Simetría de orden $n = 6$: sector de $60°$. Plegar los ángulos $150°$ y $-100°$ sin espejo y con espejo, y contar las copias en cada caso.',
    pasos: [
      { t: '<strong>150° sin espejo.</strong> $\\operatorname{mod}(150, 60) = 30$; centrado: $30 - 30 = 0°$. El píxel a $150°$ pregunta como si estuviera a $0°$, sobre el eje del sector.', antes: 'Resto de dividir entre 60 y luego resta medio sector.' },
      { t: '<strong>−100° sin espejo.</strong> El <code>mod</code> de GLSL da resto positivo: $-100 - 60\\cdot\\lfloor -100/60 \\rfloor = -100 + 120 = 20$. Centrado: $20 - 30 = -10°$.', antes: 'Con negativos, $\\lfloor -1{,}67 \\rfloor = -2$. ¿Qué resto sale?' },
      { t: '<strong>Con espejo.</strong> Se aplica <code>abs</code>: $0° \\to 0°$ y $-10° \\to 10°$. Los ángulos negativos del sector se reflejan sobre los positivos: solo se usa media cuña de $30°$.' },
      { t: '<strong>Copias.</strong> Sin espejo, cada sector recibe una copia: 6. Con espejo, cada sector es una copia y su reflejo: 12. El sector fundamental mide $60°$ en el primer caso y $30°$ en el segundo.', antes: '¿Cuántos sectores hay y cuántas copias caben en cada uno?' },
      { t: '<strong>El radio.</strong> En ningún paso se ha tocado: los dos píxeles siguen a la misma distancia del centro. Plegar el ángulo mueve por circunferencias, nunca por radios.' }
    ],
    cierre: 'Dos líneas, <code>mod</code> y <code>abs</code>, y un motivo cualquiera se convierte en el grupo $C_6$ o en el $D_6$. La diferencia entre los dos grupos es un valor absoluto.'
  });

  p.demo({
    title: 'De un garabato a una roseta',
    intro: 'El dibujo del fondo es deliberadamente feo y asimétrico: tres manchas puestas a voluntad. Sube el orden de la simetría y mira lo que pasa. El motivo no cambia ni un píxel; lo único que cambia es desde dónde se pregunta.',
    predice: 'Con orden 6 y espejo, ¿cuántas copias de la mancha grande verás? ¿Y si quitas el espejo?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-sim-1', alto: 340,
        aria: 'Un motivo asimétrico que se convierte en una roseta simétrica al aumentar el orden de la simetría.',
        mandos: [
          { n: 'orden', label: 'orden (n)', min: 1, max: 12, step: 1, value: 6, dec: 0 },
          { n: 'espejo', label: 'espejo dentro del sector', min: 0, max: 1, step: 1, value: 1, dec: 0 },
          { n: 'gira', label: 'girar', min: 0, max: 1, step: 0.05, value: 0.2, dec: 2 }
        ],
        codigo:
          '// el motivo: tres manchas puestas a voluntad, sin ninguna simetria\n' +
          'float motivo(vec2 p)\n' +
          '{\n' +
          '    float d = length(p - vec2(0.42, 0.10)) - 0.13;\n' +
          '    d = min(d, length(p - vec2(0.66, 0.28)) - 0.07);\n' +
          '    d = min(d, abs(p.y - 0.35 * p.x) - 0.015);      // una raya torcida\n' +
          '    return d;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    float a = atan(p.y, p.x) + iTime * gira;\n' +
          '    float r = length(p);\n' +
          '\n' +
          '    // PLEGAR el angulo: todo cae en un solo sector\n' +
          '    float sector = TAU / orden;\n' +
          '    a = mod(a, sector) - 0.5 * sector;\n' +
          '\n' +
          '    // y si hay espejo, cada sector se refleja sobre si mismo\n' +
          '    a = mix(a, abs(a), espejo);\n' +
          '\n' +
          '    vec2 q = r * vec2(cos(a), sin(a));\n' +
          '\n' +
          '    float d = motivo(q);\n' +
          '    float v = 1.0 - smoothstep(-fwidth(d), fwidth(d), d);\n' +
          '\n' +
          '    vec3 tinta = 0.5 + 0.5 * cos(TAU * (r * 1.5 + vec3(0.0, 0.33, 0.67)));\n' +
          '    color = vec4(v * tinta + 0.04, 1.0);\n' +
          '}\n',
        nota: 'Con el orden a 1 y sin espejo ves el garabato original, tal cual se escribió. Todo lo ' +
          'demás sale de dos líneas. Y fíjate en que el número de copias es <strong>n</strong> sin ' +
          'espejo y <strong>2n</strong> con él.'
      });
    }
  });

  p.note('Eso que has construido tiene nombre en matemáticas: el <strong>grupo diédrico</strong> ' +
    '$D_n$, con sus $n$ giros y sus $n$ reflexiones. Sin el <code>abs</code> tendrías solo el ' +
    '<strong>grupo cíclico</strong> $C_n$, que es la mitad. Son los mismos [[av-grupos|grupos]] del bloque de estructuras, y aquí no son una abstracción: son dos líneas de código y se ven.', null,
    'Esto tiene nombre: $C_n$ y $D_n$');

  p.section('El caleidoscopio de verdad');

  p.text('Un caleidoscopio no repite un dibujo: repite <em>lo que haya</em>, y lo que hay cambia ' +
    'mientras giras el tubo. Así que basta con poner debajo una textura viva —el ruido torcido del ' +
    'tema de [[gfx-warp|torsión]], por ejemplo— y dejar que el pliegue haga el resto.');

  p.demo({
    title: 'El tubo, los espejos y los cristales',
    intro: 'Debajo hay humo procedural en movimiento. Encima, el pliegue. El mando de torsión hace que el ángulo del pliegue dependa del radio, que es lo que produce esos brazos en espiral que ningún caleidoscopio real puede hacer.',
    predice: 'Con torsión 0 los brazos son rectos. Con torsión 1,1, ¿se curvarán todos en el mismo sentido o alternarán? ¿Y con torsión negativa?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-sim-2', alto: 380,
        aria: 'Un caleidoscopio de humo procedural en movimiento, con orden de simetría y torsión ajustables.',
        mandos: [
          { n: 'orden', label: 'orden (n)', min: 2, max: 16, step: 1, value: 7, dec: 0 },
          { n: 'torsion', label: 'torsión', min: -3, max: 3, step: 0.05, value: 1.1, dec: 2 },
          { n: 'zoom', label: 'zoom', min: 0.5, max: 4, step: 0.1, value: 1.6, dec: 1 },
          { n: 'velocidad', label: 'velocidad', min: 0, max: 1, step: 0.05, value: 0.35, dec: 2 }
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
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float t = iTime * velocidad;\n' +
          '\n' +
          '    float r = length(p);\n' +
          '    float a = atan(p.y, p.x);\n' +
          '\n' +
          '    // la torsion: el angulo se desvia segun el radio\n' +
          '    a += torsion * log(r + 0.05) + t * 0.3;\n' +
          '\n' +
          '    // plegar y reflejar\n' +
          '    float sector = TAU / orden;\n' +
          '    a = abs(mod(a, sector) - 0.5 * sector);\n' +
          '\n' +
          '    vec2 q = r * zoom * vec2(cos(a), sin(a));\n' +
          '\n' +
          '    // debajo del caleidoscopio, humo\n' +
          '    vec2 w = q + 0.6 * vec2(fbm(q * 2.0 + t), fbm(q * 2.0 + 4.7 - t));\n' +
          '    float n = fbm(w * 3.0);\n' +
          '\n' +
          '    vec3 c = 0.5 + 0.5 * cos(TAU * (n * 1.4 + r * 0.6 + vec3(0.0, 0.25, 0.5)) + 1.5);\n' +
          '    c *= 0.35 + 1.1 * n;\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Ese <code>log(r)</code> de la torsión no es casual: hacer que el ángulo crezca con el ' +
          'logaritmo del radio produce <strong>espirales logarítmicas</strong>, que son las de las ' +
          'conchas y las galaxias. Ponlo a cero y los brazos se enderezan.'
      });
    }
  });

  p.note('Al plegar el ángulo, el pliegue pasa por el origen y allí todas las copias se juntan. Si el ' +
    'motivo tiene algo justo en el centro, saldrá un nudo raro; y si el orden es alto, los sectores ' +
    'se estrechan tanto cerca del centro que la imagen se emborrona. Casi todos los caleidoscopios ' +
    'bonitos tapan el centro con algo, o empujan el motivo hacia fuera.', 'warn', 'El nudo del centro');

  p.section('Solo hay diecisiete maneras');

  p.text('Si en vez de plegar alrededor de un punto repites por traslación —como en el tema de la ' +
    'rejilla— y además añades espejos y giros, aparece la pregunta que se hicieron los matemáticos ' +
    'del siglo XIX: <em>¿cuántos patrones de papel pintado esencialmente distintos existen?</em>');

  p.text('La respuesta es <strong>diecisiete</strong>. Ni uno más. Cualquier mosaico periódico del ' +
    'plano, lo dibuje quien lo dibuje, pertenece a uno de esos diecisiete [[av-grupos|grupos]] de ' +
    'simetría. Es uno de los teoremas de clasificación más bonitos que hay, porque acota algo que ' +
    'parecía infinito.');

  p.util('La simetría es barata y por eso está en todas partes: los rosetones góticos, las celosías ' +
    'árabes, los <em>mandalas</em>, los tatuajes, los logotipos, las portadas de discos y las visuales ' +
    'de cualquier concierto electrónico. En un directo con shaders, un pliegue de estos es el recurso ' +
    'de emergencia: coges cualquier textura que no acaba de funcionar, le metes simetría de orden ' +
    'seis y de repente parece deliberada. El ojo humano perdona casi todo si está bien repetido.');

  p.hist('Los artesanos nazaríes de la Alhambra usaron trece o catorce de los diecisiete grupos ' +
    'cinco siglos antes de que existiera la teoría que los cuenta, y la conjetura de que estaban los ' +
    'diecisiete ha dado siglos de discusión —hoy se acepta que faltan algunos—. M. C. Escher visitó ' +
    'la Alhambra en 1922 y en 1936, copió mosaicos a mano durante días y volvió a casa a inventarse ' +
    'los suyos; no sabía matemáticas, pero derivó por su cuenta la clasificación completa de las ' +
    'maneras de rellenar el plano.');

  p.trampas([
    { e: 'Dibujar el motivo en la zona que el espejo no mira', por: 'Tras <code>p.x = abs(p.x)</code> nadie pregunta por $x < 0$. Un círculo en $(-0{,}3, 0)$ desaparece. El motivo va en la mitad positiva, y el espejo hace el resto.' },
    { e: 'Plegar sin restar medio sector', por: '<code>mod(a, TAU/n)</code> deja el sector de 0 a $2\\pi/n$, con el motivo pegado a un borde. Al añadir el espejo, la reflexión cae en el sitio equivocado. El $-\\pi/n$ centra la cuña.' },
    { e: 'Contar $n$ copias con espejo', por: 'El <code>abs</code> duplica: cada sector contiene una copia y su reflejo. Con orden 6 y espejo hay 12, y el sector fundamental mide $30°$.' },
    { e: 'Poner algo justo en el centro', por: 'El origen es donde se juntan todas las copias: cualquier cosa allí sale como un nudo. Los caleidoscopios buenos empujan el motivo hacia fuera o tapan el centro.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Plegar un ángulo',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([3, 4, 5, 6, 8]);
      var gr = r.int(-179, 179);
      var sec = 360 / n;
      var m = gr - sec * Math.floor(gr / sec);      // mod al estilo GLSL
      var pl = m - sec / 2;
      var rad = r.pick([0.4, 0.6, 0.8]);
      return { n: n, gr: gr, sec: sec, pl: pl, r: rad,
        x: rad * Math.cos(pl * Math.PI / 180), y: rad * Math.sin(pl * Math.PI / 180) };
    },
    ask: function (d) {
      return 'Un píxel está a distancia <strong>' + U.fmt(d.r, 1) + '</strong> del origen y en un ' +
        'ángulo de <strong>' + d.gr + '°</strong>. El shader pliega con simetría de orden ' +
        '<strong>' + d.n + '</strong> (sin espejo).<br><br>¿En qué ángulo queda tras el pliegue, y ' +
        'en qué punto acaba preguntando? (grados y coordenadas, cuatro decimales)';
    },
    fields: [
      { name: 'a', label: 'ángulo plegado (°)', w: 'tiny' },
      { name: 'x', label: 'q.x', w: 'tiny' },
      { name: 'y', label: 'q.y', w: 'tiny' }
    ],
    sol: function (d) {
      return { a: U.round(d.pl, 8), x: U.round(d.x, 8), y: U.round(d.y, 8) };
    },
    tol: 3e-4,
    hint: function (d) {
      return 'El sector mide $360/' + d.n + ' = ' + U.fmt(d.sec, 4) + '$ grados. Haz el resto de la ' +
        'división (que en GLSL sale siempre positivo, también con ángulos negativos) y réstale medio ' +
        'sector.';
    },
    steps: function (d) {
      return ['Sector: $360/' + d.n + ' = ' + U.fmt(d.sec, 4) + '°$',
        '$\\operatorname{mod}(' + d.gr + ',\\ ' + U.fmt(d.sec, 4) + ') = ' + U.fmt(d.pl + d.sec / 2, 4) + '°$',
        'Centrado: $' + U.fmt(d.pl + d.sec / 2, 4) + ' - ' + U.fmt(d.sec / 2, 4) + ' = ' +
          U.fmt(d.pl, 4) + '°$, que ya cae dentro del sector centrado en cero.',
        'Y el punto: $' + U.fmt(d.r, 1) + '\\,(\\cos ' + U.fmt(d.pl, 2) + '°,\\ \\sin ' +
          U.fmt(d.pl, 2) + '°) = (' + U.fmt(d.x, 4) + ',\\ ' + U.fmt(d.y, 4) + ')$',
        'El radio no se toca nunca: plegar el ángulo no acerca ni aleja nada del centro.'];
    },
    answer: function (d) {
      return U.fmt(d.pl, 4) + '° · (' + U.fmt(d.x, 4) + ', ' + U.fmt(d.y, 4) + ')';
    }
  });

  p.exercise({
    title: 'Contar las copias',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([3, 4, 5, 6, 7, 8, 9, 12]);
      var esp = r.pick([true, false]);
      return { n: n, esp: esp, copias: esp ? 2 * n : n,
        ancho: esp ? 180 / n : 360 / n, grupo: esp ? 'D' : 'C' };
    },
    ask: function (d) {
      return 'El shader hace:<br><pre class="shd__mini">float a = atan(p.y, p.x);\nfloat r = length(p);\na = mod(a, TAU/' + d.n + '.0) - PI/' + d.n + '.0;\n' +
        (d.esp ? 'a = abs(a);\n' : '') + 'p = r * vec2(cos(a), sin(a));</pre>' +
        '¿Cuántas <strong>copias</strong> del motivo aparecen en la pantalla, y cuántos grados mide ' +
        'la región que <em>no</em> es copia de ninguna otra (el sector fundamental)?';
    },
    fields: [
      { name: 'c', label: 'copias', w: 'tiny' },
      { name: 'g', label: 'sector (°)', w: 'tiny' }
    ],
    sol: function (d) { return { c: d.copias, g: U.round(d.ancho, 8) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'El <code>mod</code> reparte la vuelta en ' + d.n + ' sectores iguales.' +
        (d.esp ? ' Y el <code>abs</code> refleja cada sector sobre sí mismo, así que dentro de cada ' +
          'uno ya hay dos copias.' : ' Sin <code>abs</code> no hay reflexión: cada sector contiene ' +
          'una sola copia.');
    },
    steps: function (d) {
      return ['El <code>mod</code> parte la circunferencia en $' + d.n + '$ sectores de $' +
        U.fmt(360 / d.n, 4) + '°$.',
        d.esp
          ? 'El <code>abs</code> pliega cada sector por su mitad: dentro de cada uno hay una copia y ' +
            'su reflejo, o sea $2 \\cdot ' + d.n + ' = ' + d.copias + '$ copias en total.'
          : 'Sin reflexión, cada sector muestra una copia: $' + d.copias + '$ en total.',
        'El sector fundamental mide $' + U.fmt(d.ancho, 4) + '°$: todo lo demás de la pantalla se ' +
          'deduce de él.',
        'En el lenguaje de la teoría de grupos, esto es el grupo $' + d.grupo + '_{' + d.n + '}$, de orden $' +
          d.copias + '$.'];
    },
    answer: function (d) { return d.copias + ' copias · sector de ' + U.fmt(d.ancho, 4) + '°'; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'p.x = abs(p.x);\nfloat v = step(length(p - vec2(0.3, 0.0)), 0.1);',
          o: ['Dos círculos iguales, uno a cada lado del centro', 'Un solo círculo a la derecha', 'Un círculo en el centro', 'Cuatro círculos'],
          por: 'Tras el <code>abs</code>, los píxeles de la izquierda preguntan como si estuvieran a la derecha: el círculo de la derecha aparece reflejado en la izquierda.' },
        { c: 'p = abs(p);\nfloat v = step(length(p - vec2(0.3, 0.2)), 0.08);',
          o: ['Cuatro círculos, uno en cada cuadrante, simétricos respecto a los dos ejes', 'Dos círculos', 'Un círculo', 'Ocho círculos'],
          por: 'Dos espejos, uno por eje: cada cuadrante recibe una copia del círculo del primero.' },
        { c: 'float a = mod(atan(p.y, p.x), TAU / 6.0);\nvec2 q = length(p) * vec2(cos(a), sin(a));\nfloat v = step(length(q - vec2(0.3, 0.1)), 0.05);',
          o: ['El mismo círculo repetido seis veces alrededor del centro, girado', 'Seis círculos en fila', 'Un único círculo', 'Doce círculos, en parejas reflejadas'],
          por: 'El ángulo se reduce a un sector de $60^\\circ$: cada sector recibe una copia girada del mismo dibujo, sin espejos.' },
        { c: 'float a = abs(mod(atan(p.y, p.x), TAU / 6.0) - TAU / 12.0);\nvec2 q = length(p) * vec2(cos(a), sin(a));\nfloat v = step(length(q - vec2(0.3, 0.1)), 0.05);',
          o: ['Doce círculos: seis sectores, y en cada uno el círculo reflejado a los dos lados de su eje', 'Seis círculos girados, sin espejos', 'Un único círculo', 'Tres círculos'],
          por: 'Primero se reduce el ángulo a un sector y después se dobla ese sector por la mitad con un <code>abs</code>: cada sector tiene dos copias simétricas.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'Con <code>p</code> centrada y el color final <code>vec3(v)</code>, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['Cada <code>abs</code> es un espejo; cada <code>mod</code> del ángulo, una repetición girada.', 'Cuenta cuántas copias recibe el dibujo.']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe el pliegue',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'simetría de <strong>orden 6</strong> sin espejo (seis copias giradas)',
          ref: 'mod(a, TAU/6.0) - PI/6.0' },
        { pide: 'simetría de <strong>orden 8</strong> sin espejo (ocho copias giradas)',
          ref: 'mod(a, TAU/8.0) - PI/8.0' },
        { pide: 'un <strong>caleidoscopio de orden 5</strong>: cinco sectores, cada uno reflejado sobre sí mismo',
          ref: 'abs(mod(a, TAU/5.0) - PI/5.0)' },
        { pide: 'un <strong>caleidoscopio de orden 4</strong>: cuatro sectores, cada uno reflejado sobre sí mismo',
          ref: 'abs(mod(a, TAU/4.0) - PI/4.0)' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa el pliegue del ángulo para conseguir ' + d.pide + ':<br>' +
        '<pre class="shd__mini">float a = atan(p.y, p.x);\nfloat r = length(p);\nfloat b = <strong>???</strong> ;\nvec2 q = r * vec2(cos(b), sin(b));</pre>' +
        '<code>PI</code> y <code>TAU</code> ya están definidos.';
    },
    fields: [{ name: 'b', label: 'el ángulo plegado', w: 'wide' }],
    sol: function (d) { return { b: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.b || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'float motivo(vec2 p){\n' +
          '  float d = length(p - vec2(0.42, 0.10)) - 0.13;\n' +
          '  d = min(d, length(p - vec2(0.66, 0.28)) - 0.07);\n' +
          '  return min(d, abs(p.y - 0.35 * p.x) - 0.015);\n}\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  float a = atan(p.y, p.x);\n' +
          '  float r = length(p);\n' +
          '  float b = ' + x + ';\n' +
          '  vec2 q = r * vec2(cos(b), sin(b));\n' +
          '  float d = motivo(q);\n' +
          '  color = vec4(vec3(1.0 - step(0.0, d)), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 64, tol: 6 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado tiene que ser un <code>float</code>, y ' +
          'los denominadores llevan punto decimal: <code>TAU/6.0</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la roseta no tiene la simetría pedida. Repasa dos ' +
          'cosas: que el sector sea $2\\pi/n$, y que lo que se resta para centrarlo sea la ' +
          '<em>mitad</em>, o sea $\\pi/n$.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'El molde es <code>mod(a, TAU/n) - PI/n</code>. Para que haya espejo, envuélvelo entero ' +
        'en un <code>abs</code>.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Una línea, y el motivo que hubiera debajo se convierte en una roseta.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    '<code>abs</code> aplicado a una coordenada <strong>es un espejo</strong>. Nada más hace falta para la simetría bilateral.',
    'Para simetría de orden $n$ se pliega el <strong>ángulo</strong>: <code>mod(a, TAU/n) - PI/n</code>, la misma receta de la rejilla pero en polares.',
    'Añadir <code>abs</code> al ángulo plegado <strong>duplica</strong> las copias: se pasa del grupo cíclico $C_n$ al diédrico $D_n$.',
    'El motivo de debajo puede ser cualquier cosa, incluso algo que se mueva: el pliegue no le pregunta qué es.',
    'Hacer que el ángulo dependa del radio (con un logaritmo, por ejemplo) convierte los brazos rectos en <strong>espirales</strong>.',
    'Para mosaicos periódicos del plano solo existen <strong>diecisiete</strong> simetrías esencialmente distintas.'
  ]);
});
