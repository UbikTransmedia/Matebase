/* Tema: Matrices que giran el mundo */
Course.topic('gfx-matrices', function (p) {

  p.text('Girar una figura en un shader tiene una vuelta de tuerca que descoloca a todo el mundo la ' +
    'primera vez, y que una vez entendida ilumina el bloque entero. Vamos a por ella despacio.');

  p.section('La matriz de rotación, otra vez');

  p.text('Del bloque 7 traes esta matriz, que gira un vector un ángulo $\\alpha$ alrededor del ' +
    'origen:');

  p.formula('R(\\alpha) = \\begin{pmatrix} \\cos\\alpha & -\\operatorname{sen}\\alpha \\\\ \\operatorname{sen}\\alpha & \\cos\\alpha \\end{pmatrix}',
    'rotación en el plano',
    'En GLSL se escribe así:<br><br><code>mat2 rot(float a){ float c = cos(a), s = sin(a); return ' +
      'mat2(c, s, -s, c); }</code><br><br>Ojo al orden: GLSL construye las matrices ' +
      '<strong>por columnas</strong>, no por filas. Por eso el <code>-s</code> aparece en tercer ' +
      'lugar y no en segundo. Es el error tonto que todo el mundo comete una vez.<br><br>' +
      'Y una vez definida, se usa multiplicando: <code>p = rot(0.5) * p;</code>');

  p.section('Y aquí la vuelta de tuerca');

  p.text('En el shader no tienes la figura: tienes un píxel preguntando de qué color es. Así que ' +
    '<strong>no puedes girar la figura, porque no hay ninguna figura que girar</strong>. Lo que ' +
    'giras es la pregunta.');

  p.note('Para que una figura parezca girada un ángulo $\\alpha$, hay que girar la coordenada ' +
    '<strong>$-\\alpha$</strong>, en sentido contrario. El píxel no pregunta «¿dónde estaría yo si ' +
    'girase?», sino «¿qué habría aquí si deshiciera el giro?».', 'ok', 'Se transforma el espacio, no el objeto');

  p.text('Una imagen mental que ayuda: no estás girando el cuadro, estás girando <em>el marco desde ' +
    'el que miras</em>. Si inclinas la cabeza a la derecha, el mundo parece inclinarse a la ' +
    'izquierda. Todas las transformaciones de un shader son así, y por eso van invertidas:');

  p.table(['Para que la figura…', 'Hay que escribir', 'Porque…'], [
    ['gire $\\alpha$', '<code>p = rot(-a) * p;</code>', 'se deshace el giro antes de preguntar'],
    ['se mueva a $c$', '<code>p = p - c;</code>', 'se resta, no se suma'],
    ['sea el doble de grande', '<code>p = p / 2.0;</code>', 'se divide, no se multiplica']
  ]);

  p.text('En la práctica el signo del giro pocas veces importa —una rotación es simétrica— y casi ' +
    'nadie escribe el menos. Pero cuando combines varias transformaciones y algo salga al revés, la ' +
    'explicación es esta.');

  p.demo({
    title: 'Girar, escalar, mover',
    intro: 'Las tres transformaciones sobre un cuadrado. Fíjate en el orden: cambia si mueves antes o después de girar, porque componer transformaciones no es conmutativo. Eso también viene del bloque 7.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-mat-1', alto: 300,
        aria: 'Un cuadrado que se puede girar, escalar y desplazar con tres deslizadores.',
        mandos: [
          { n: 'ang', label: 'giro (rad)', min: -3.14, max: 3.14, step: 0.02, value: 0.5, dec: 2 },
          { n: 'esc', label: 'escala', min: 0.3, max: 2.5, step: 0.05, value: 1.0, dec: 2 },
          { n: 'desp', label: 'desplazamiento', min: -0.4, max: 0.4, step: 0.01, value: 0.0, dec: 2 },
          { n: 'orden', label: 'girar antes ↔ después de mover', min: 0, max: 1, step: 1, value: 0, dec: 0 }
        ],
        codigo:
          'mat2 rot(float a) {\n' +
          '    float c = cos(a), s = sin(a);\n' +
          '    return mat2(c, s, -s, c);   // OJO: por columnas\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    if (orden < 0.5) {\n' +
          '        p -= vec2(desp, 0.0);   // mover\n' +
          '        p  = rot(-ang) * p;     // y luego girar\n' +
          '    } else {\n' +
          '        p  = rot(-ang) * p;     // girar\n' +
          '        p -= vec2(desp, 0.0);   // y luego mover\n' +
          '    }\n' +
          '    p /= esc;                   // escalar\n' +
          '\n' +
          '    vec2 q = abs(p) - 0.18;\n' +
          '    float d = max(q.x, q.y) * esc;\n' +
          '\n' +
          '    float v = 1.0 - smoothstep(0.0, 0.01, d);\n' +
          '    color = vec4(v * vec3(0.55, 0.9, 0.75), 1.0);\n' +
          '}\n',
        nota: 'Pon desplazamiento y giro a la vez y cambia el orden: en un caso el cuadrado gira ' +
          'sobre sí mismo desplazado, en el otro orbita alrededor del centro. Misma matemática, ' +
          'distinto resultado, porque $AB \\ne BA$.'
      });
    }
  });

  p.note('Ese <code>* esc</code> del final tiene su motivo. Al dividir la coordenada entre la ' +
    'escala, las distancias también quedan divididas, y el campo deja de medir distancias reales. ' +
    'Multiplicar al final lo devuelve a su sitio. Si no lo haces, los bordes suaves salen más ' +
    'gruesos o más finos según el zoom.', null, 'Escalar deforma el campo de distancias');

  p.section('Girar el espacio repetido: el caleidoscopio');

  p.text('Combina lo del tema anterior con esto y sale algo que parece muchísimo más difícil de lo ' +
    'que es. Si antes de dibujar giras la coordenada un ángulo que depende de en qué sector estás, ' +
    'obtienes simetría radial: un caleidoscopio.');

  p.demo({
    title: 'Caleidoscopio',
    intro: 'Se pasa a polares, se pliega el ángulo en sectores iguales y se dibuja una sola figura. La simetría no está dibujada: está en el plegado. Sube los sectores y mira lo que pasa.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-mat-2', alto: 320,
        aria: 'Una figura repetida en simetría radial, como un caleidoscopio, con el número de sectores ajustable.',
        mandos: [
          { n: 'sectores', label: 'sectores', min: 2, max: 16, step: 1, value: 6, dec: 0 },
          { n: 'giro', label: 'giro', min: 0.0, max: 1.0, step: 0.02, value: 0.3, dec: 2 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    float r = length(p);\n' +
          '    float a = atan(p.y, p.x) + iTime * giro;\n' +
          '\n' +
          '    // plegar el angulo en sectores iguales\n' +
          '    float sec = TAU / sectores;\n' +
          '    a = mod(a, sec);\n' +
          '    a = abs(a - sec * 0.5);      // y espejo dentro del sector\n' +
          '\n' +
          '    // de vuelta a cartesianas, ya plegado\n' +
          '    vec2 q = vec2(cos(a), sin(a)) * r;\n' +
          '\n' +
          '    // UNA figura, que sale repetida en todos los sectores\n' +
          '    float d = length(q - vec2(0.28, 0.06)) - 0.055;\n' +
          '    d = min(d, abs(q.y - 0.02) - 0.004);\n' +
          '\n' +
          '    float v = 1.0 - smoothstep(0.0, 0.006, d);\n' +
          '    vec3 tono = 0.55 + 0.45 * cos(vec3(0.0, 2.1, 4.2) + r * 9.0 + iTime);\n' +
          '\n' +
          '    color = vec4(v * tono, 1.0);\n' +
          '}\n',
        nota: 'El <code>mod</code> reparte el ángulo en sectores y el <code>abs</code> hace de ' +
          'espejo dentro de cada uno. Con eso, un círculo y una raya se convierten en un copo de nieve.'
      });
    }
  });

  p.util('Este plegado es exactamente lo que hace un caleidoscopio de verdad: dos espejos formando ' +
    'un ángulo, y unos cuantos cristalitos que se reflejan una y otra vez. El aparato lo inventó ' +
    'David Brewster en 1816 estudiando la polarización de la luz, lo patentó mal y no ganó nada, ' +
    'mientras en Londres se vendían doscientos mil ejemplares en tres meses. Que la simetría salga ' +
    'del plegado y no del dibujo lo entendió él con dos espejos; aquí es una línea de código.');

  p.hist('Que una matriz sirva para girar no es evidente y costó siglos. Los griegos hacían ' +
    'geometría con regla y compás, sin coordenadas; Descartes puso los ejes en 1637; y hubo que ' +
    'esperar a Cayley, hacia 1858, para que alguien escribiera las transformaciones como tablas de ' +
    'números que se multiplican. Cuando Cayley definió el producto de matrices lo hizo <em>para ' +
    'que</em> componer transformaciones fuera multiplicar: por eso el producto es como es, y por eso ' +
    'no es conmutativo, porque componer giros y traslaciones tampoco lo es.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Gira un punto',
    level: 'basico',
    gen: function (r) {
      var x = r.real(-1, 1, 2), y = r.real(-1, 1, 2);
      if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) return null;
      var g = r.pick([30, 45, 60, 90, 120, 180]);
      var a = g * Math.PI / 180;
      return { x: x, y: y, g: g, a: a,
        nx: x * Math.cos(a) - y * Math.sin(a), ny: x * Math.sin(a) + y * Math.cos(a) };
    },
    ask: function (d) {
      return 'Gira el punto <code>(' + U.fmt(d.x, 2) + ', ' + U.fmt(d.y, 2) + ')</code> un ángulo ' +
        'de <strong>' + d.g + '°</strong> en sentido positivo alrededor del origen. (cuatro decimales)';
    },
    fields: [
      { name: 'x', label: "x'", w: 'tiny' },
      { name: 'y', label: "y'", w: 'tiny' }
    ],
    sol: function (d) { return { x: U.round(d.nx, 8), y: U.round(d.ny, 8) }; },
    tol: 3e-5,
    hint: function () {
      return '$x\' = x\\cos\\alpha - y\\operatorname{sen}\\alpha$ y ' +
        '$y\' = x\\operatorname{sen}\\alpha + y\\cos\\alpha$. Pasa los grados a radianes.';
    },
    steps: function (d) {
      return ['$\\alpha = ' + d.g + '° = ' + U.fmt(d.a, 4) + '$ rad, con $\\cos\\alpha = ' +
        U.fmt(Math.cos(d.a), 4) + '$ y $\\operatorname{sen}\\alpha = ' + U.fmt(Math.sin(d.a), 4) + '$',
        "$x' = " + U.fmt(d.x, 2) + '\\cdot' + U.fmt(Math.cos(d.a), 4) + ' - ' + U.fmt(d.y, 2) +
        '\\cdot' + U.fmt(Math.sin(d.a), 4) + ' = ' + U.fmt(d.nx, 4) + '$',
        "$y' = " + U.fmt(d.x, 2) + '\\cdot' + U.fmt(Math.sin(d.a), 4) + ' + ' + U.fmt(d.y, 2) +
        '\\cdot' + U.fmt(Math.cos(d.a), 4) + ' = ' + U.fmt(d.ny, 4) + '$',
        'La distancia al origen no cambia: una rotación conserva las longitudes.'];
    },
    answer: function (d) { return "x' = " + U.fmt(d.nx, 4) + ", y' = " + U.fmt(d.ny, 4); }
  });

  p.exercise({
    title: '¿Qué transformación?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { cod: 'p = p - vec2(0.2, 0.0);', q: 'derecha',
          por: 'Restar mueve la coordenada a la izquierda, así que la figura aparece <strong>a la derecha</strong>. Va invertido.' },
        { cod: 'p = p + vec2(0.2, 0.0);', q: 'izquierda',
          por: 'Sumar a la coordenada desplaza la figura hacia la <strong>izquierda</strong>: al revés de lo que dice la intuición.' },
        { cod: 'p = p / 2.0;', q: 'mayor',
          por: 'Encoger la coordenada equivale a <strong>agrandar</strong> la figura: cabe menos mundo en la pantalla.' },
        { cod: 'p = p * 2.0;', q: 'menor',
          por: 'Estirar la coordenada <strong>encoge</strong> la figura: cabe más mundo en la pantalla.' },
        { cod: 'p = p - vec2(0.0, 0.3);', q: 'arriba',
          por: 'Restar en la y sube la figura, porque la y crece hacia arriba y la transformación va invertida.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Antes de dibujar una figura centrada en el origen, el shader hace:<br>' +
        '<pre class="shd__mini">' + d.cod + '</pre>' +
        '¿Qué le pasa a la figura?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Responde: <code>derecha</code>, ' +
        '<code>izquierda</code>, <code>arriba</code>, <code>mayor</code> o <code>menor</code>.</span>';
    },
    fields: [{ name: 'q', label: 'La figura se ve…', w: 'wide' }],
    sol: function (d) { return { q: d.q }; },
    check: function (v, d) {
      var q = U.eligeOpcion(v.raw.q, {
        derecha: /derecha|hacia la derecha/,
        izquierda: /izquierda|hacia la izquierda/,
        arriba: /arriba|hacia arriba|sube/,
        mayor: /mayor|grande|crece|aumenta|zoom/,
        menor: /menor|pequen|encoge|reduce|disminuye/
      });
      if (!q) return { ok: false, msg: 'Responde con una: derecha, izquierda, arriba, mayor o menor.' };
      return { ok: q === d.q };
    },
    hint: function () {
      return 'Todo va al revés: lo que le haces a la coordenada, la figura lo hace en sentido ' +
        'contrario. Restar mueve la figura en la dirección positiva; dividir la agranda.';
    },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return d.q; }
  });

  p.exercise({
    title: 'Escribe la rotación',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'un cuadrado <strong>girado 45°</strong>, es decir, un rombo', ref: 'rot(0.7853981634) * p' },
        { pide: 'un cuadrado <strong>girado 30°</strong>', ref: 'rot(0.5235987756) * p' },
        { pide: 'un cuadrado <strong>sin girar</strong> pero movido a la derecha 0,2', ref: 'p - vec2(0.2, 0.0)' },
        { pide: 'un cuadrado <strong>girado 90°</strong> (que se ve igual, y esa es la gracia)', ref: 'rot(1.5707963268) * p' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,s,-s,c); }\n...\nvec2 q = <strong>???</strong> ;\nvec2 e = abs(q) - 0.2;\nfloat d = max(e.x, e.y);</pre>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Los ángulos, en radianes.</span>';
    },
    fields: [{ name: 'q', label: 'la expresión', w: 'wide' }],
    sol: function (d) { return { q: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.q || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,s,-s,c); }\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  vec2 q = ' + x + ';\n' +
          '  vec2 e = abs(q) - 0.2;\n' +
          '  float d = max(e.x, e.y);\n' +
          '  color = vec4(vec3(1.0 - smoothstep(0.0, 0.01, d)), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 40, tol: 6 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Para girar se multiplica: <code>rot(angulo) * p</code>.' };
      }
      if (!r.ok) return { ok: false, msg: 'Compila, pero no es lo pedido. Recuerda que 45° son ' +
        '$\\pi/4 \\approx 0{,}7854$ radianes, y que se puede escribir <code>PI/4.0</code>.' };
      return { ok: true };
    },
    hint: function () {
      return 'La constante <code>PI</code> está definida, así que puedes escribir <code>rot(PI/4.0) ' +
        '* p</code>. Para mover, se resta un <code>vec2</code>.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>, o su ' +
        'equivalente con <code>PI</code>.',
        'Con 90° el cuadrado se ve idéntico: tiene simetría de orden 4, y girarlo un cuarto de vuelta ' +
        'lo deja igual. Eso es un grupo de simetría del bloque 10, comprobado a ojo.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'La matriz de rotación es la del bloque 7. En GLSL, <code>mat2</code> se construye <strong>por columnas</strong>.',
    'No se transforma la figura: <strong>se transforma la coordenada</strong>, y por eso todo va invertido. Restar mueve en positivo; dividir agranda.',
    'Componer transformaciones no es conmutativo: girar y luego mover no es lo mismo que mover y luego girar.',
    'Al escalar la coordenada hay que reescalar la distancia al final, o los bordes suaves salen mal.',
    'Plegar el <strong>ángulo</strong> en sectores da simetría radial: un caleidoscopio en tres líneas.'
  ]);
});
