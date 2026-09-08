/* Tema: Modelar con distancias */
Course.topic('gfx-escena', function (p) {

  p.text('En el tema de [[gfx-raymarching|raymarching]] montaste una esfera y un suelo. Con eso ya ' +
    'se ve en tres dimensiones, pero no se <em>modela</em>: para construir algo que merezca mirarse ' +
    'hacen falta unas cuantas herramientas más, y todas son de la misma familia. Este tema es el ' +
    'taller, y conviene volver a él cuando estés haciendo tus propias cosas.');

  p.section('Fundir en vez de unir');

  p.text('La unión de dos cuerpos es <code>min(a, b)</code>, y funciona: pero el resultado tiene una ' +
    'arista dura donde se cruzan las dos superficies, como dos piedras pegadas. La naturaleza casi ' +
    'nunca hace eso. Dos gotas que se juntan forman un cuello suave, y una rama sale del tronco con ' +
    'un ensanchamiento.');

  p.text('La solución es una versión suavizada del mínimo:');

  p.formulas([
    'h = \\operatorname{clamp}\\!\\left(\\tfrac{1}{2} + \\tfrac{b - a}{2k},\\ 0,\\ 1\\right)',
    '\\operatorname{smin}(a, b, k) = \\operatorname{mix}(b,\\ a,\\ h) \\;-\\; k\\,h\\,(1 - h)'
  ], 'mínimo suave');

  p.text('La primera línea es un $h$ que vale 1 cuando $a$ gana claramente, 0 cuando gana $b$, y algo ' +
    'intermedio en la franja de anchura $k$ donde están empatando. La segunda interpola entre los dos ' +
    'valores <strong>y además resta un pellizco</strong>: ese $-k\\,h(1-h)$ es una parábola que vale ' +
    'cero en los extremos y $k/4$ en el centro, y es exactamente lo que crea el cuello.');

  p.demo({
    title: 'Dos gotas que se buscan',
    intro: 'Dos esferas que se acercan y se separan. El mando k es la anchura de la fusión: con cero es un min normal y se cruzan como dos piedras; súbelo y se comportan como mercurio.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-esc-1', alto: 340,
        aria: 'Dos esferas que se acercan y se funden con un cuello suave cuya anchura se puede ajustar.',
        mandos: [
          { n: 'k', label: 'suavidad (k)', min: 0, max: 1.2, step: 0.02, value: 0.5, dec: 2 },
          { n: 'separa', label: 'separación', min: 0, max: 2.2, step: 0.05, value: 1.1, dec: 2 },
          { n: 'anima', label: 'animar', min: 0, max: 1, step: 1, value: 1, dec: 0 }
        ],
        codigo:
          '// el minimo suave: la herramienta mas util del oficio\n' +
          'float smin(float a, float b, float k)\n' +
          '{\n' +
          '    if (k <= 0.0) return min(a, b);\n' +
          '    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);\n' +
          '    return mix(b, a, h) - k * h * (1.0 - h);\n' +
          '}\n' +
          '\n' +
          'float mapa(vec3 p)\n' +
          '{\n' +
          '    float s = separa;\n' +
          '    if (anima > 0.5) s = 1.1 + 0.9 * sin(iTime * 0.8);\n' +
          '\n' +
          '    float a = length(p - vec3(-0.5 * s, 0.0, 0.0)) - 0.7;\n' +
          '    float b = length(p - vec3( 0.5 * s, 0.0, 0.0)) - 0.55;\n' +
          '\n' +
          '    return smin(a, b, k);\n' +
          '}\n' +
          '\n' +
          'vec3 normal(vec3 p)\n' +
          '{\n' +
          '    vec2 e = vec2(0.002, 0.0);\n' +
          '    return normalize(vec3(mapa(p + e.xyy) - mapa(p - e.xyy),\n' +
          '                          mapa(p + e.yxy) - mapa(p - e.yxy),\n' +
          '                          mapa(p + e.yyx) - mapa(p - e.yyx)));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec3 ojo = vec3(0.0, 0.5, -4.0);\n' +
          '    vec3 dir = normalize(vec3(uv, 1.3));\n' +
          '\n' +
          '    float t = 0.0;\n' +
          '    for (int i = 0; i < 70; i++) {\n' +
          '        float h = mapa(ojo + t * dir);\n' +
          '        if (h < 0.001 || t > 20.0) break;\n' +
          '        t += h;\n' +
          '    }\n' +
          '\n' +
          '    vec3 c = vec3(0.04, 0.04, 0.09);\n' +
          '    if (t < 20.0) {\n' +
          '        vec3 pos = ojo + t * dir;\n' +
          '        vec3 n = normal(pos);\n' +
          '        vec3 luz = normalize(vec3(0.8, 1.0, -0.6));\n' +
          '        float dif = max(dot(n, luz), 0.0);\n' +
          '        vec3 base = 0.5 + 0.5 * cos(TAU * (0.15 * pos.x + vec3(0.0, 0.33, 0.67)));\n' +
          '        c = base * (0.12 + dif);\n' +
          '    }\n' +
          '\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'Con <code>k = 0</code> las dos esferas se atraviesan y se ve la arista del cruce. Con ' +
          '<code>k</code> alto empiezan a «notarse» antes de tocarse: el cuello aparece cuando aún ' +
          'están separadas, porque la fusión actúa en toda la franja de anchura $k$.'
      });
    }
  });

  p.note('El <code>smin</code> tiene un precio: el resultado <strong>ya no es una distancia ' +
    'exacta</strong>, sino una cota que a veces se pasa de optimista. En la práctica se nota poco, ' +
    'pero si subes mucho la $k$ empiezan a aparecer artefactos, y la solución es avanzar con ' +
    'prudencia: <code>t += h * 0.7</code> en vez de <code>t += h</code>.', 'warn', 'Lo que cuesta suavizar');

  p.section('El catálogo de operaciones');

  p.text('Con el mínimo suave y sus parientes, la lista de operaciones que sirven para modelar es ' +
    'corta y se aprende de memoria:');

  p.table(['Operación', 'Se escribe', 'Qué hace'], [
    ['Unión', '<code>min(a, b)</code>', 'los dos cuerpos'],
    ['Intersección', '<code>max(a, b)</code>', 'solo lo que comparten'],
    ['Diferencia', '<code>max(a, -b)</code>', 'vaciar $b$ de $a$'],
    ['Unión suave', '<code>smin(a, b, k)</code>', 'fundir'],
    ['Redondear', '<code>d - r</code>', 'inflar el cuerpo $r$ en todas direcciones: esquinas redondas'],
    ['Cáscara', '<code>abs(d) - t</code>', 'quedarse solo con una capa de grosor $2t$ alrededor de la superficie'],
    ['Relieve', '<code>d + a*sin(...)</code>', 'rugosidad, ondas, escamas']
  ]);

  p.text('Las dos últimas líneas son las que más juego dan. <code>abs(d) - t</code> convierte ' +
    'cualquier cuerpo en su propia cáscara hueca, porque <code>abs</code> hace que el interior ' +
    'vuelva a ser «lejos». Y sumarle un seno a la distancia empuja la superficie hacia dentro y hacia ' +
    'fuera, que es <strong>relieve de verdad</strong>, no el falso del tema de las derivadas: aquí la ' +
    'silueta también cambia.');

  p.section('Un bosque infinito con una línea');

  p.text('La repetición del tema de la [[gfx-repetir|rejilla]] funciona igual en tres dimensiones, y ' +
    'ahí sí que impresiona: una sola columna, y de repente hay infinitas.');

  p.formula('q = \\operatorname{mod}(p,\\ c) - \\tfrac{c}{2}', 'repetición infinita en el espacio');

  p.text('Con el mismo aviso de siempre, ahora más grave: la figura tiene que caber holgadamente en ' +
    'su celda. Si se sale, el rayo la corta, porque nunca mira a la celda vecina. Y si quieres un ' +
    'número <em>finito</em> de copias, se limita el índice de la celda en vez del espacio:');

  p.formula('q = p - c\\,\\operatorname{clamp}\\left(\\left\\lfloor \\tfrac{p}{c} + \\tfrac{1}{2} \\right\\rfloor,\\ -L,\\ L\\right)',
    'repetición limitada');

  p.demo({
    title: 'El bosque',
    intro: 'Una columna, un suelo, una repetición y una torsión. Todo lo que ves cabe en quince líneas y no hay ni un objeto guardado en memoria. Mueve la torsión despacio.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-esc-2', alto: 380,
        aria: 'Un bosque infinito de columnas torcidas con un suelo, recorrido lentamente.',
        mandos: [
          { n: 'paso', label: 'separación', min: 1.4, max: 5, step: 0.1, value: 2.6, dec: 1 },
          { n: 'grosor', label: 'grosor', min: 0.1, max: 0.7, step: 0.02, value: 0.32, dec: 2 },
          { n: 'torsion', label: 'torsión', min: -0.8, max: 0.8, step: 0.02, value: 0.3, dec: 2 },
          { n: 'avance', label: 'avance', min: 0, max: 1.5, step: 0.05, value: 0.5, dec: 2 }
        ],
        codigo:
          'mat2 giro(float a)\n' +
          '{\n' +
          '    float c = cos(a), s = sin(a);\n' +
          '    return mat2(c, -s, s, c);\n' +
          '}\n' +
          '\n' +
          'float smin(float a, float b, float k)\n' +
          '{\n' +
          '    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);\n' +
          '    return mix(b, a, h) - k * h * (1.0 - h);\n' +
          '}\n' +
          '\n' +
          'float mapa(vec3 p)\n' +
          '{\n' +
          '    float suelo = p.y + 1.0;\n' +
          '\n' +
          '    // TORCER: girar el plano horizontal segun la altura\n' +
          '    vec3 q = p;\n' +
          '    q.xz = giro(torsion * q.y) * q.xz;\n' +
          '\n' +
          '    // REPETIR: una columna, infinitas columnas\n' +
          '    q.x = mod(q.x, paso) - 0.5 * paso;\n' +
          '    q.z = mod(q.z + iTime * avance, paso) - 0.5 * paso;\n' +
          '\n' +
          '    // la columna: un cilindro con relieve\n' +
          '    float col = length(q.xz) - grosor;\n' +
          '    col += 0.03 * sin(20.0 * q.y) * sin(8.0 * atan(q.z, q.x));\n' +
          '\n' +
          '    return smin(col, suelo, 0.4);\n' +
          '}\n' +
          '\n' +
          'vec3 normal(vec3 p)\n' +
          '{\n' +
          '    vec2 e = vec2(0.003, 0.0);\n' +
          '    return normalize(vec3(mapa(p + e.xyy) - mapa(p - e.xyy),\n' +
          '                          mapa(p + e.yxy) - mapa(p - e.yxy),\n' +
          '                          mapa(p + e.yyx) - mapa(p - e.yyx)));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec3 ojo = vec3(0.0, 0.3, 0.0);\n' +
          '    vec3 dir = normalize(vec3(uv, 1.2));\n' +
          '\n' +
          '    float t = 0.0;\n' +
          '    for (int i = 0; i < 90; i++) {\n' +
          '        float h = mapa(ojo + t * dir);\n' +
          '        if (h < 0.002 || t > 30.0) break;\n' +
          '        t += h * 0.7;      // con prudencia: hay torsion y relieve\n' +
          '    }\n' +
          '\n' +
          '    vec3 c = vec3(0.05, 0.07, 0.11);\n' +
          '    if (t < 30.0) {\n' +
          '        vec3 pos = ojo + t * dir;\n' +
          '        vec3 n = normal(pos);\n' +
          '        vec3 luz = normalize(vec3(0.6, 0.8, -0.3));\n' +
          '        float dif = max(dot(n, luz), 0.0);\n' +
          '        vec3 base = mix(vec3(0.85, 0.6, 0.45), vec3(0.4, 0.55, 0.75),\n' +
          '                        smoothstep(-1.0, 1.0, n.y));\n' +
          '        c = base * (0.15 + dif);\n' +
          '        c = mix(c, vec3(0.05, 0.07, 0.11), 1.0 - exp(-0.006 * t * t));   // niebla\n' +
          '    }\n' +
          '\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'La línea de la torsión, <code>q.xz = giro(torsion * q.y) * q.xz</code>, es un giro ' +
          'cuyo ángulo <strong>depende de la altura</strong>. Con eso una columna recta se convierte ' +
          'en una columna salomónica, y no ha habido que modelar nada.'
      });
    }
  });

  p.note('Al torcer, escalar de forma desigual o sumar relieve, la función deja de devolver la ' +
    'distancia verdadera y devuelve algo <em>mayor</em> en algunos sitios. Ahí es donde los rayos se ' +
    'saltan la superficie y aparecen agujeros. Regla práctica: <strong>si has torcido o deformado, ' +
    'multiplica el paso por 0,5 o 0,7</strong>. Es la manera barata de recuperar la garantía.',
    'warn', 'Después de deformar, pasos más cortos');

  p.util('Esta forma de modelar —describir un sólido con una función en vez de con una malla— se ' +
    'llama modelado implícito y no es solo de artistas. En impresión 3D permite generar estructuras ' +
    'internas (celosías, espumas, gradientes de densidad) que sería imposible dibujar vértice a ' +
    'vértice. En diseño industrial, cambiar un parámetro rehace la pieza entera sin arreglar mallas ' +
    'rotas. En medicina, las superficies extraídas de un TAC son campos escalares con un umbral, que ' +
    'es exactamente esto. Y hay programas libres, como <em>Fragmentarium</em> o el propio Blender con ' +
    'sus nodos, que trabajan así.');

  p.hist('Jim Blinn describió las «gotas» (<em>blobby models</em>) en 1982 buscando cómo dibujar ' +
    'moléculas sin que parecieran bolas de billar pegadas, y de ahí salió toda la familia de ' +
    'superficies implícitas. El <code>smin</code> concreto que estás usando, la versión polinómica, ' +
    'lo popularizó Íñigo Quílez cuarenta años después, y su gracia es que no tiene ni una raíz ni una ' +
    'exponencial: dos productos y una interpolación.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El mínimo suave a mano',
    level: 'basico',
    gen: function (r) {
      var a = r.real(-0.5, 1.2, 2), b = r.real(-0.5, 1.2, 2), k = r.pick([0.2, 0.4, 0.6, 0.8]);
      var h = Math.max(0, Math.min(1, 0.5 + 0.5 * (b - a) / k));
      var s = b + (a - b) * h - k * h * (1 - h);
      return { a: a, b: b, k: k, h: h, s: s, m: Math.min(a, b) };
    },
    ask: function (d) {
      return 'Con <code>a = ' + U.fmt(d.a, 2) + '</code>, <code>b = ' + U.fmt(d.b, 2) + '</code> y ' +
        '<code>k = ' + U.fmt(d.k, 1) + '</code>, calcula <code>h</code> y luego ' +
        '<code>smin(a, b, k)</code>. Da también el <code>min</code> normal para comparar. ' +
        '(cuatro decimales)';
    },
    fields: [
      { name: 'h', label: 'h', w: 'tiny' },
      { name: 's', label: 'smin', w: 'tiny' },
      { name: 'm', label: 'min normal', w: 'tiny' }
    ],
    sol: function (d) { return { h: U.round(d.h, 8), s: U.round(d.s, 8), m: U.round(d.m, 8) }; },
    tol: 3e-4,
    hint: function () {
      return 'Primero $h = \\operatorname{clamp}(0{,}5 + (b-a)/2k,\\ 0,\\ 1)$, que se queda entre 0 ' +
        'y 1 sí o sí. Luego $\\operatorname{mix}(b, a, h) = b + (a-b)h$, y por último réstale ' +
        '$k\\,h(1-h)$.';
    },
    steps: function (d) {
      return ['$h = \\operatorname{clamp}\\left(0{,}5 + \\frac{' + U.fmt(d.b, 2) + ' - ' +
        U.fmt(d.a, 2) + '}{2 \\cdot ' + U.fmt(d.k, 1) + '},\\ 0,\\ 1\\right) = ' + U.fmt(d.h, 4) + '$',
        'Interpolación: $' + U.fmt(d.b, 2) + ' + (' + U.fmt(d.a, 2) + ' - ' + U.fmt(d.b, 2) + ')\\cdot' +
          U.fmt(d.h, 4) + ' = ' + U.fmt(d.b + (d.a - d.b) * d.h, 4) + '$',
        'El pellizco: $' + U.fmt(d.k, 1) + '\\cdot' + U.fmt(d.h, 4) + '\\cdot(1 - ' + U.fmt(d.h, 4) +
          ') = ' + U.fmt(d.k * d.h * (1 - d.h), 4) + '$',
        'Resultado: $' + U.fmt(d.s, 4) + '$, frente al $\\min$ normal, que da $' + U.fmt(d.m, 4) + '$.',
        (d.h > 0.001 && d.h < 0.999)
          ? 'Como $h$ está entre 0 y 1, estamos <strong>dentro de la zona de fusión</strong>: ahí es ' +
            'donde se forma el cuello, y por eso el resultado es menor que el mínimo.'
          : 'Como $h$ ha tocado un extremo, uno de los dos cuerpos gana con claridad y el resultado ' +
            'coincide con el mínimo normal: la fusión no llega hasta aquí.'];
    },
    answer: function (d) {
      return 'h = ' + U.fmt(d.h, 4) + ' · smin = ' + U.fmt(d.s, 4) + ' · min = ' + U.fmt(d.m, 4);
    }
  });

  p.exercise({
    title: 'Un bosque de una columna',
    level: 'medio',
    gen: function (r) {
      var c = r.pick([2, 2.5, 3, 4]);
      var px = r.real(-6, 6, 2), pz = r.real(-6, 6, 2);
      var g = r.pick([0.3, 0.4, 0.5]);
      function m(x) { return x - c * Math.floor(x / c) - 0.5 * c; }
      var qx = m(px), qz = m(pz);
      return { c: c, px: px, pz: pz, g: g, qx: qx, qz: qz,
        d: Math.sqrt(qx * qx + qz * qz) - g };
    },
    ask: function (d) {
      return 'La escena repite columnas con <code>q.x = mod(p.x, ' + U.fmt(d.c, 1) + ') - ' +
        U.fmt(d.c / 2, 2) + ';</code> y lo mismo en <code>z</code>, y luego dibuja un cilindro ' +
        '<code>length(q.xz) - ' + U.fmt(d.g, 1) + '</code>.<br><br>Para <code>p.x = ' + U.fmt(d.px, 2) +
        '</code> y <code>p.z = ' + U.fmt(d.pz, 2) + '</code>, ¿cuánto valen <code>q.x</code>, ' +
        '<code>q.z</code> y la distancia? (cuatro decimales)';
    },
    fields: [
      { name: 'x', label: 'q.x', w: 'tiny' },
      { name: 'z', label: 'q.z', w: 'tiny' },
      { name: 'd', label: 'distancia', w: 'tiny' }
    ],
    sol: function (d) { return { x: U.round(d.qx, 8), z: U.round(d.qz, 8), d: U.round(d.d, 8) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'El <code>mod</code> de GLSL devuelve siempre algo entre 0 y ' + U.fmt(d.c, 1) +
        ', también con negativos. Al restarle la mitad, queda centrado entre $-' + U.fmt(d.c / 2, 2) +
        '$ y $' + U.fmt(d.c / 2, 2) + '$.';
    },
    steps: function (d) {
      return ['$q_x = \\operatorname{mod}(' + U.fmt(d.px, 2) + ',\\ ' + U.fmt(d.c, 1) + ') - ' +
        U.fmt(d.c / 2, 2) + ' = ' + U.fmt(d.qx, 4) + '$',
        '$q_z = \\operatorname{mod}(' + U.fmt(d.pz, 2) + ',\\ ' + U.fmt(d.c, 1) + ') - ' +
          U.fmt(d.c / 2, 2) + ' = ' + U.fmt(d.qz, 4) + '$',
        'Distancia: $\\sqrt{' + U.fmt(d.qx, 4) + '^2 + ' + U.fmt(d.qz, 4) + '^2} - ' + U.fmt(d.g, 1) +
          ' = ' + U.fmt(d.d, 4) + '$',
        'La columna cabe holgadamente en su celda (' + U.fmt(d.g, 1) + ' de radio en una celda de ' +
          U.fmt(d.c, 1) + '), y por eso la repetición no la corta.'];
    },
    answer: function (d) {
      return 'q = (' + U.fmt(d.qx, 4) + ', ' + U.fmt(d.qz, 4) + ') · d = ' + U.fmt(d.d, 4);
    }
  });

  p.exercise({
    title: 'Construye la pieza',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'una <strong>caja redondeada</strong>: la caja de semilado 0,6 inflada 0,25',
          ref: 'sdCaja(p, vec3(0.6)) - 0.25' },
        { pide: 'la <strong>fusión suave</strong> (con $k = 0{,}4$) de la esfera de radio 0,9 y la caja de semilado 0,6',
          ref: 'smin(sdEsfera(p, 0.9), sdCaja(p, vec3(0.6)), 0.4)' },
        { pide: 'una <strong>cáscara hueca</strong> de 0,06 de grosor a partir de la esfera de radio 1',
          ref: 'abs(sdEsfera(p, 1.0)) - 0.06' },
        { pide: 'la esfera de radio 1 con la <strong>caja vaciada</strong> por dentro (semilado 0,75)',
          ref: 'max(sdEsfera(p, 1.0), -sdCaja(p, vec3(0.75)))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe la escena para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">// disponibles:\n//   sdEsfera(vec3 p, float r)\n//   sdCaja(vec3 p, vec3 semilados)\n//   smin(float a, float b, float k)\nfloat mapa(vec3 p)\n{\n    return <strong>???</strong> ;\n}</pre>';
    },
    fields: [{ name: 'm', label: 'la escena', w: 'wide' }],
    sol: function (d) { return { m: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.m || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'float sdEsfera(vec3 p, float r){ return length(p) - r; }\n' +
          'float sdCaja(vec3 p, vec3 b){\n' +
          '  vec3 q = abs(p) - b;\n' +
          '  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);\n}\n' +
          'float smin(float a, float b, float k){\n' +
          '  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);\n' +
          '  return mix(b, a, h) - k * h * (1.0 - h);\n}\n' +
          'float mapa(vec3 p){ return ' + x + '; }\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  vec3 o = vec3(1.1, 1.3, -3.2), f = normalize(-o);\n' +
          '  vec3 r = normalize(cross(vec3(0.0,1.0,0.0), f)), u = cross(f, r);\n' +
          '  vec3 dir = normalize(uv.x*r + uv.y*u + 1.5*f);\n' +
          '  float t = 0.0;\n' +
          '  for (int i = 0; i < 80; i++) {\n' +
          '    float h = mapa(o + t*dir);\n' +
          '    if (h < 0.002 || t > 20.0) break;\n' +
          '    t += h * 0.7;\n  }\n' +
          '  vec3 c = vec3(0.0);\n' +
          '  if (t < 20.0) {\n' +
          '    vec3 q = o + t*dir; vec2 e = vec2(0.003, 0.0);\n' +
          '    vec3 n = normalize(vec3(mapa(q+e.xyy)-mapa(q-e.xyy),\n' +
          '                            mapa(q+e.yxy)-mapa(q-e.yxy),\n' +
          '                            mapa(q+e.yyx)-mapa(q-e.yyx)));\n' +
          '    c = vec3(0.5) + 0.5*n;\n  }\n' +
          '  color = vec4(c, 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 12 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Comprueba los argumentos: <code>sdCaja</code> recibe ' +
          'un <code>vec3</code> de semilados, no un número suelto.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la pieza no es la pedida. Recuerda el catálogo: ' +
          'restar infla, <code>abs</code> ahueca, <code>max</code> con un menos vacía.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Cuatro operaciones y ya está: <code>- r</code> redondea, <code>abs(d) - t</code> hace ' +
        'cáscara, <code>max(a, -b)</code> vacía y <code>smin</code> funde.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Ninguna de estas piezas existe en memoria: cada una es una expresión que se evalúa unas ' +
        'cuantas veces por píxel.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    '<code>smin</code> funde dos cuerpos en vez de pegarlos: interpola y además <strong>resta un pellizco</strong>, que es lo que forma el cuello.',
    'El catálogo entero cabe en siete líneas: unir, cortar, vaciar, fundir, redondear, ahuecar y añadir relieve.',
    '<code>abs(d) - t</code> convierte cualquier cuerpo en una <strong>cáscara hueca</strong>.',
    '<code>mod</code> sobre la posición da <strong>infinitas copias</strong> por el precio de una; limitar el índice de celda da un número finito.',
    'Girar con un ángulo que depende de la altura <strong>tuerce</strong> el objeto sin modelar nada.',
    'Toda deformación estropea la garantía de la distancia: después de torcer o añadir relieve, <strong>acorta el paso</strong>.'
  ]);
});
