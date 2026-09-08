/* Tema: Luz, sombra y aire */
Course.topic('gfx-luz', function (p) {

  p.text('Tienes una escena y sabes dónde choca cada rayo. Lo que separa una maqueta de plástico de ' +
    'una imagen que engaña al ojo no es la geometría: es <strong>cómo se reparte la luz</strong>. Y ' +
    'resulta que casi todo se consigue con cinco términos, cada uno de dos o tres líneas, que se ' +
    'suman uno encima de otro.');

  p.section('El término que ya conoces');

  p.text('La <strong>luz difusa</strong> es el [[ge-vectores|producto escalar]] entre la normal y la ' +
    'dirección hacia la luz. Cuanto más de frente mire la superficie a la luz, más recibe; cuando le ' +
    'da de lado, casi nada; cuando le da por detrás, cero.');

  p.formula('I_{\\text{dif}} = \\max\\bigl(\\vec{n}\\cdot\\vec{l},\\ 0\\bigr)', 'ley de Lambert',
    'El $\\max$ con cero no es un detalle técnico: sin él, las superficies que dan la espalda a la ' +
      'luz recibirían una cantidad <em>negativa</em> y saldrían agujeros negros donde debería haber ' +
      'sombra.');

  p.text('Ese término solo no basta, porque deja las zonas de sombra completamente negras. En el ' +
    'mundo real ninguna sombra es negra: la luz rebota en las paredes y vuelve. Simular esos rebotes ' +
    'de verdad es carísimo, así que se hace trampa y se suma una <strong>luz ambiente</strong> ' +
    'constante. Es una mentira grosera y funciona.');

  p.section('Sombras suaves, y por qué son suaves');

  p.text('En el tema de raymarching viste la sombra dura: se lanza un rayo desde el punto hacia la ' +
    'luz y, si choca con algo, estás en sombra. Da un borde de cuchillo, y en la realidad no existe: ' +
    'las sombras tienen <strong>penumbra</strong>, una franja donde la luz se ve a medias porque el ' +
    'obstáculo la tapa solo en parte.');

  p.text('El truco que usa todo el mundo es de una elegancia que da envidia. Mientras el rayo de ' +
    'sombra avanza, se va guardando el <strong>menor valor de $h/t$</strong>, donde $h$ es lo cerca ' +
    'que ha pasado de un obstáculo y $t$ lo que llevaba recorrido:');

  p.formula('\\text{sombra} = \\min_{t}\\ \\operatorname{clamp}\\!\\left(\\frac{k\\,h(t)}{t},\\ 0,\\ 1\\right)',
    'penumbra por el ángulo');

  p.text('El motivo es geométrico y perfectamente honesto: $h/t$ es aproximadamente el ' +
    '<strong>ángulo</strong> bajo el que el rayo ha visto el obstáculo. Si pasó muy cerca ($h$ ' +
    'pequeña) de algo que estaba muy lejos ($t$ grande), el obstáculo tapaba un pedacito del sol y la ' +
    'sombra es tenue. Si pasó cerca de algo que tenía al lado, lo tapaba casi todo. El $k$ hace de ' +
    'tamaño de la fuente: un $k$ alto es un foco pequeño y sombras duras; un $k$ bajo, un cielo ' +
    'nublado.');

  p.demo({
    title: 'De la sombra de cuchillo al día nublado',
    intro: 'Dos esferas sobre un suelo. El mando k cambia el tamaño aparente de la fuente de luz: bájalo y mira cómo la sombra se despega del objeto y se abre a medida que se aleja, igual que las de verdad.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-luz-1', alto: 360,
        aria: 'Dos esferas sobre un suelo con sombras cuya suavidad se puede ajustar.',
        mandos: [
          { n: 'dureza', label: 'dureza de la fuente (k)', min: 1, max: 64, step: 1, value: 8, dec: 0 },
          { n: 'altura', label: 'altura de la luz', min: 0.3, max: 4, step: 0.1, value: 1.6, dec: 1 },
          { n: 'orbita', label: 'órbita de la luz', min: 0, max: 1, step: 0.05, value: 0.5, dec: 2 }
        ],
        codigo:
          'float mapa(vec3 p)\n' +
          '{\n' +
          '    float e1 = length(p - vec3(-0.9, 0.0, 0.0)) - 0.8;\n' +
          '    float e2 = length(p - vec3( 1.0, -0.4, 0.6)) - 0.45;\n' +
          '    float suelo = p.y + 1.0;\n' +
          '    return min(min(e1, e2), suelo);\n' +
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
          '// LA sombra suave: guardar el menor h/t del camino\n' +
          'float sombra(vec3 o, vec3 l, float k)\n' +
          '{\n' +
          '    float res = 1.0;\n' +
          '    float t = 0.03;\n' +
          '    for (int i = 0; i < 48; i++) {\n' +
          '        float h = mapa(o + l * t);\n' +
          '        if (h < 0.001) return 0.0;         // tapado del todo\n' +
          '        res = min(res, k * h / t);         // que angulo ha visto\n' +
          '        t += h;\n' +
          '        if (t > 12.0) break;\n' +
          '    }\n' +
          '    return clamp(res, 0.0, 1.0);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec3 ojo = vec3(0.0, 1.0, -4.2);\n' +
          '    vec3 dir = normalize(vec3(uv, 1.4));\n' +
          '\n' +
          '    float t = 0.0;\n' +
          '    for (int i = 0; i < 80; i++) {\n' +
          '        float h = mapa(ojo + t * dir);\n' +
          '        if (h < 0.001 || t > 30.0) break;\n' +
          '        t += h;\n' +
          '    }\n' +
          '\n' +
          '    vec3 c = vec3(0.05, 0.07, 0.13);\n' +
          '    if (t < 30.0) {\n' +
          '        vec3 pos = ojo + t * dir;\n' +
          '        vec3 n = normal(pos);\n' +
          '\n' +
          '        float a = iTime * 0.5 * orbita;\n' +
          '        vec3 luz = normalize(vec3(cos(a) * 1.2, altura, sin(a) * 1.2 - 0.4));\n' +
          '\n' +
          '        float dif = max(dot(n, luz), 0.0);\n' +
          '        float som = sombra(pos + n * 0.02, luz, dureza);\n' +
          '\n' +
          '        vec3 base = (pos.y < -0.99) ? vec3(0.55, 0.55, 0.6) : vec3(0.9, 0.6, 0.45);\n' +
          '        c = base * (0.13 + dif * som);\n' +
          '    }\n' +
          '\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'Con <code>k</code> alto la sombra es un recorte de tijera; con <code>k</code> bajo se ' +
          'ensancha con la distancia al objeto que la proyecta. Ese ensanchamiento no se ha ' +
          'programado: sale solo de dividir entre $t$.'
      });
    }
  });

  p.section('Los rincones son oscuros');

  p.text('Mira el rincón entre dos paredes de tu habitación. Está más oscuro que el centro de cada ' +
    'pared, y no porque haya una sombra: es que en un rincón <strong>llega menos cielo</strong>, ' +
    'porque las propias paredes tapan buena parte de él. Ese efecto se llama <strong>oclusión ' +
    'ambiental</strong> y es lo que más ayuda a que una imagen deje de parecer plana.');

  p.text('Con un campo de distancias es casi gratis. Basta con dar unos pasitos ' +
    '<strong>saliendo por la normal</strong> y preguntar la distancia en cada uno. Si a 5 cm de la ' +
    'superficie la escena dice que lo más cercano está a 5 cm, estás en campo abierto. Si dice que ' +
    'está a 1 cm, hay algo pegado: es un rincón.');

  p.formula('\\text{oclusión} = \\sum_{i} \\bigl(h_i - d(p + h_i\\,\\vec{n})\\bigr)\\,w_i',
    'lo que falta hasta el campo abierto');

  p.section('El brillo y el borde');

  p.text('Faltan dos términos que cuestan una línea cada uno y cambian el material por completo:');

  p.table(['Término', 'Se escribe', 'Qué aporta'], [
    ['<strong>Especular</strong>', '<code>pow(max(dot(n, h), 0.0), b)</code> con <code>h = normalize(luz - dir)</code>', 'el reflejo puntual de la fuente: plástico, metal, agua. El exponente $b$ es lo pulida que está la superficie'],
    ['<strong>Fresnel</strong>', '<code>pow(1.0 - max(dot(n, -dir), 0.0), 5.0)</code>', 'los bordes brillan: es real y ocurre en todo, del agua al asfalto']
  ]);

  p.text('El Fresnel es de esos fenómenos que están delante de los ojos todo el rato y no se ven ' +
    'hasta que te los nombran: mira un charco a tus pies —apenas refleja— y luego el mismo charco a ' +
    'veinte metros, que parece un espejo. La reflectividad crece cuando la mirada llega rasante, y ' +
    'esa quinta potencia es la aproximación que usa toda la industria.');

  p.section('El aire también cuenta');

  p.text('Lo último es la <strong>niebla</strong>, y no es un efecto meteorológico: es que el aire ' +
    'existe. Cada metro de aire absorbe una fracción de la luz que lo atraviesa, y eso da una ' +
    '[[fn-exp-log|exponencial]] exactamente igual que la desintegración radiactiva o el interés ' +
    'compuesto:');

  p.formula('c_{\\text{final}} = \\operatorname{mix}\\bigl(c,\\ c_{\\text{aire}},\\ 1 - e^{-\\beta t}\\bigr)',
    'ley de Beer-Lambert');

  p.text('Sin niebla, una escena grande parece un decorado de cartón: no hay ninguna pista de qué ' +
    'está lejos. Con ella, el cerebro reconstruye la profundidad al instante, y por eso los pintores ' +
    'llevan seiscientos años pintando las montañas del fondo más claras y más azules.');

  p.demo({
    title: 'Capa a capa',
    intro: 'La misma escena, con los términos entrando de uno en uno. Sube el mando despacio y fíjate en qué añade cada capa: es lo mismo que hace un director de fotografía al montar una iluminación.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-luz-2', alto: 380,
        aria: 'Una escena que va sumando capas de iluminación: ambiente, difusa, sombra, oclusión, especular, Fresnel y niebla.',
        mandos: [
          { n: 'capas', label: 'capas (1 ambiente … 7 niebla)', min: 1, max: 7, step: 1, value: 7, dec: 0 },
          { n: 'brillo', label: 'pulido (especular)', min: 4, max: 96, step: 2, value: 32, dec: 0 },
          { n: 'densidad', label: 'densidad del aire', min: 0, max: 0.08, step: 0.002, value: 0.02, dec: 3 }
        ],
        codigo:
          'float smin(float a, float b, float k)\n' +
          '{\n' +
          '    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);\n' +
          '    return mix(b, a, h) - k * h * (1.0 - h);\n' +
          '}\n' +
          '\n' +
          'float mapa(vec3 p)\n' +
          '{\n' +
          '    float bola = length(p - vec3(0.0, 0.1, 0.0)) - 0.9;\n' +
          '    float tubo = length(p.xz - vec2(1.5, 1.2)) - 0.35;\n' +
          '    float suelo = p.y + 0.9;\n' +
          '    return smin(smin(bola, tubo, 0.3), suelo, 0.35);\n' +
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
          'float sombra(vec3 o, vec3 l)\n' +
          '{\n' +
          '    float res = 1.0, t = 0.04;\n' +
          '    for (int i = 0; i < 40; i++) {\n' +
          '        float h = mapa(o + l * t);\n' +
          '        if (h < 0.001) return 0.0;\n' +
          '        res = min(res, 10.0 * h / t);\n' +
          '        t += h;\n' +
          '        if (t > 10.0) break;\n' +
          '    }\n' +
          '    return clamp(res, 0.0, 1.0);\n' +
          '}\n' +
          '\n' +
          '// oclusion: dar pasitos saliendo por la normal\n' +
          'float oclusion(vec3 p, vec3 n)\n' +
          '{\n' +
          '    float oc = 0.0, esc = 1.0;\n' +
          '    for (int i = 0; i < 5; i++) {\n' +
          '        float h = 0.02 + 0.12 * float(i);\n' +
          '        oc += (h - mapa(p + n * h)) * esc;\n' +
          '        esc *= 0.75;\n' +
          '    }\n' +
          '    return clamp(1.0 - 2.2 * oc, 0.0, 1.0);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float a = iTime * 0.25;\n' +
          '    vec3 ojo = vec3(4.0 * sin(a), 1.5, 4.0 * cos(a) - 1.0);\n' +
          '    vec3 f = normalize(vec3(0.4, 0.0, 0.4) - ojo);\n' +
          '    vec3 rr = normalize(cross(vec3(0.0, 1.0, 0.0), f));\n' +
          '    vec3 uu = cross(f, rr);\n' +
          '    vec3 dir = normalize(uv.x * rr + uv.y * uu + 1.5 * f);\n' +
          '\n' +
          '    vec3 aire = vec3(0.42, 0.52, 0.68);\n' +
          '\n' +
          '    float t = 0.0;\n' +
          '    for (int i = 0; i < 90; i++) {\n' +
          '        float h = mapa(ojo + t * dir);\n' +
          '        if (h < 0.002 || t > 40.0) break;\n' +
          '        t += h;\n' +
          '    }\n' +
          '\n' +
          '    vec3 c = aire;\n' +
          '    if (t < 40.0) {\n' +
          '        vec3 pos = ojo + t * dir;\n' +
          '        vec3 n = normal(pos);\n' +
          '        vec3 luz = normalize(vec3(0.8, 1.1, -0.5));\n' +
          '        vec3 base = mix(vec3(0.85, 0.75, 0.62), vec3(0.9, 0.45, 0.4),\n' +
          '                        smoothstep(0.0, 1.0, n.y));\n' +
          '\n' +
          '        float amb = 0.20;\n' +
          '        float dif = (capas >= 2.0) ? max(dot(n, luz), 0.0)      : 0.0;\n' +
          '        float som = (capas >= 3.0) ? sombra(pos + n * 0.02, luz) : 1.0;\n' +
          '        float oc  = (capas >= 4.0) ? oclusion(pos, n)            : 1.0;\n' +
          '\n' +
          '        c = base * (amb * oc + dif * som);\n' +
          '\n' +
          '        if (capas >= 5.0) {\n' +
          '            vec3 med = normalize(luz - dir);\n' +
          '            c += vec3(1.0) * pow(max(dot(n, med), 0.0), brillo) * som;\n' +
          '        }\n' +
          '        if (capas >= 6.0) {\n' +
          '            float fr = pow(1.0 - max(dot(n, -dir), 0.0), 5.0);\n' +
          '            c += aire * fr * 0.8;\n' +
          '        }\n' +
          '        if (capas >= 7.0) {\n' +
          '            c = mix(c, aire, 1.0 - exp(-densidad * t * t));\n' +
          '        }\n' +
          '    }\n' +
          '\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'La capa 4, la oclusión, es la que más sorprende: no añade ninguna luz, solo quita, y ' +
          'es la que hace que los objetos parezcan <em>apoyados</em> en el suelo en vez de flotando ' +
          'encima.'
      });
    }
  });

  p.note('El orden de las capas no es arbitrario. La oclusión multiplica <strong>solo</strong> a la ' +
    'luz ambiente, porque es un factor de cuánto cielo llega, no de cuánto foco. Y la niebla va ' +
    '<strong>la última</strong>, después de todo lo demás, porque el aire está entre la escena y el ' +
    'ojo. Meterla antes del especular es un error clásico: los brillos atraviesan la niebla como si ' +
    'nada.', 'warn', 'El orden importa');

  p.util('Esta lista de términos es, a grandes rasgos, la que llevaba cualquier videojuego hasta hace ' +
    'unos años, y sigue siendo el esqueleto de lo que hay ahora debajo de nombres más finos. La ' +
    'oclusión ambiental como truco separado la introdujo Industrial Light &amp; Magic en <em>Pearl ' +
    'Harbor</em> (2001) porque simular la luz rebotada era imposible en el tiempo disponible; hoy es ' +
    'estándar hasta en teléfonos. Y las sombras suaves por el mínimo de $h/t$ son un caso raro de ' +
    'aproximación que sale más barata que la versión dura y además queda mejor.');

  p.hist('El modelo de Lambert es de 1760 y describe cómo refleja una superficie perfectamente mate; ' +
    'el especular que usas aquí es de Jim Blinn (1977), una simplificación del de Phong (1975) que ' +
    'evita calcular el vector reflejado. Fresnel es de 1823 y describe cuánta luz refleja una ' +
    'superficie según el ángulo; la aproximación de la quinta potencia es de Christophe Schlick, ' +
    '1994. Es decir: dos siglos y medio de óptica resumidos en cinco líneas de shader.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuánta luz recibe',
    level: 'basico',
    gen: function (r) {
      var nx = r.real(-1, 1, 2), ny = r.real(0.1, 1, 2), nz = r.real(-1, 1, 2);
      var ln = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= ln; ny /= ln; nz /= ln;
      var lx = r.real(-1, 1, 2), ly = r.real(-0.3, 1, 2), lz = r.real(-1, 1, 2);
      var ll = Math.sqrt(lx * lx + ly * ly + lz * lz);
      lx /= ll; ly /= ll; lz /= ll;
      var dot = nx * lx + ny * ly + nz * lz;
      var amb = r.pick([0.1, 0.15, 0.2]);
      var alb = r.pick([0.6, 0.8, 0.9]);
      return { n: [nx, ny, nz], l: [lx, ly, lz], dot: dot, dif: Math.max(dot, 0),
        amb: amb, alb: alb, c: alb * (amb + Math.max(dot, 0)) };
    },
    ask: function (d) {
      return 'La normal es <code>n = (' + d.n.map(function (x) { return U.fmt(x, 4); }).join(', ') +
        ')</code> y la dirección hacia la luz es <code>l = (' +
        d.l.map(function (x) { return U.fmt(x, 4); }).join(', ') + ')</code>, ambas unitarias.' +
        '<br><br>La superficie tiene color <code>' + U.fmt(d.alb, 1) + '</code> y hay una luz ' +
        'ambiente de <code>' + U.fmt(d.amb, 2) + '</code>.<br><br>Calcula el producto escalar, el ' +
        'término difuso (con el <code>max</code>) y el color final <code>albedo · (ambiente + ' +
        'difusa)</code>. (cuatro decimales)';
    },
    fields: [
      { name: 'd', label: 'n · l', w: 'tiny' },
      { name: 'f', label: 'difusa', w: 'tiny' },
      { name: 'c', label: 'color final', w: 'tiny' }
    ],
    sol: function (d) {
      return { d: U.round(d.dot, 8), f: U.round(d.dif, 8), c: U.round(d.c, 8) };
    },
    tol: 3e-4,
    hint: function () {
      return 'El producto escalar es la suma de los tres productos componente a componente. Si sale ' +
        'negativo, la superficie da la espalda a la luz y el <code>max</code> lo deja en cero.';
    },
    steps: function (d) {
      return ['$\\vec{n}\\cdot\\vec{l} = ' + U.fmt(d.n[0], 4) + '\\cdot' + U.fmt(d.l[0], 4) + ' + ' +
        U.fmt(d.n[1], 4) + '\\cdot' + U.fmt(d.l[1], 4) + ' + ' + U.fmt(d.n[2], 4) + '\\cdot' +
        U.fmt(d.l[2], 4) + ' = ' + U.fmt(d.dot, 4) + '$',
        d.dot < 0
          ? 'Es negativo: la cara mira <strong>al contrario</strong> que la luz, así que el ' +
            '$\\max$ lo deja en $0$ y solo queda el ambiente.'
          : 'Es positivo, así que la difusa vale $' + U.fmt(d.dif, 4) + '$.',
        'Color: $' + U.fmt(d.alb, 1) + '\\,(' + U.fmt(d.amb, 2) + ' + ' + U.fmt(d.dif, 4) + ') = ' +
          U.fmt(d.c, 4) + '$',
        'Como $\\vec{n}$ y $\\vec{l}$ son unitarios, ese producto escalar <strong>es</strong> el ' +
          'coseno del ángulo entre la superficie y la luz.'];
    },
    answer: function (d) {
      return 'n·l = ' + U.fmt(d.dot, 4) + ' · difusa ' + U.fmt(d.dif, 4) + ' · color ' + U.fmt(d.c, 4);
    }
  });

  p.exercise({
    title: 'Cuánto se come el aire',
    level: 'medio',
    gen: function (r) {
      var b = r.pick([0.05, 0.08, 0.12, 0.2]);
      var t1 = r.int(3, 12);
      return { b: b, t1: t1, f1: 1 - Math.exp(-b * t1), mitad: Math.LN2 / b };
    },
    ask: function (d) {
      return 'El aire tiene densidad <code>β = ' + U.fmt(d.b, 2) + '</code> y la niebla se aplica con ' +
        '<code>mix(color, aire, 1 - exp(-β·t))</code>.<br><br>¿Qué fracción de niebla hay a una ' +
        'distancia de <strong>' + d.t1 + '</strong>? ¿Y a qué distancia el objeto está ' +
        '<strong>medio comido</strong> por la niebla, es decir, la mezcla vale exactamente 0,5? ' +
        '(cuatro decimales)';
    },
    fields: function (d) {
      return [
        { name: 'f', label: 'niebla a ' + d.t1, w: 'tiny' },
        { name: 'm', label: 'distancia del 50 %', w: 'tiny' }
      ];
    },
    sol: function (d) { return { f: U.round(d.f1, 8), m: U.round(d.mitad, 8) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'Lo primero es sustituir. Para lo segundo, resuelve $1 - e^{-\\beta t} = 0{,}5$: pasa a ' +
        '$e^{-\\beta t} = 0{,}5$ y toma logaritmos, que es el mismo cálculo de una vida media.';
    },
    steps: function (d) {
      return ['$1 - e^{-' + U.fmt(d.b, 2) + '\\cdot' + d.t1 + '} = 1 - ' +
        U.fmt(Math.exp(-d.b * d.t1), 4) + ' = ' + U.fmt(d.f1, 4) + '$',
        'Para el 50 %: $e^{-\\beta t} = 0{,}5 \\Rightarrow -\\beta t = \\ln 0{,}5 \\Rightarrow t = ' +
          '\\frac{\\ln 2}{\\beta}$',
        '$t = \\dfrac{0{,}6931}{' + U.fmt(d.b, 2) + '} = ' + U.fmt(d.mitad, 4) + '$',
        'Es literalmente una <strong>vida media</strong>: cada $' + U.fmt(d.mitad, 2) + '$ unidades ' +
          'de distancia, la luz que queda se reduce a la mitad. La misma ley que la desintegración ' +
          'radiactiva, escrita para el aire.'];
    },
    answer: function (d) {
      return 'niebla ' + U.fmt(d.f1, 4) + ' · mitad a ' + U.fmt(d.mitad, 4);
    }
  });

  p.exercise({
    title: 'Escribe la iluminación',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'solo <strong>difusa con ambiente 0,15</strong>, sobre el color base',
          ref: 'base * (0.15 + max(dot(n, luz), 0.0))' },
        { pide: 'lo anterior <strong>más un brillo especular</strong> blanco de exponente 32 (con el vector medio <code>normalize(luz - dir)</code>)',
          ref: 'base * (0.15 + max(dot(n, luz), 0.0)) + pow(max(dot(n, normalize(luz - dir)), 0.0), 32.0)' },
        { pide: 'la difusa con ambiente 0,15 <strong>más un borde de Fresnel</strong> de quinta potencia',
          ref: 'base * (0.15 + max(dot(n, luz), 0.0)) + pow(1.0 - max(dot(n, -dir), 0.0), 5.0)' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe el color de la superficie para tener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">// disponibles en este punto:\n//   vec3 n    la normal\n//   vec3 luz  direccion hacia la luz (unitaria)\n//   vec3 dir  direccion del rayo (del ojo hacia la escena)\n//   vec3 base el color del material\nvec3 c = <strong>???</strong> ;</pre>';
    },
    fields: [{ name: 'c', label: 'el color', w: 'wide' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'float mapa(vec3 p){ return min(length(p) - 1.0, p.y + 1.0); }\n' +
          'vec3 normal(vec3 p){\n' +
          '  vec2 e = vec2(0.002, 0.0);\n' +
          '  return normalize(vec3(mapa(p+e.xyy)-mapa(p-e.xyy),\n' +
          '                        mapa(p+e.yxy)-mapa(p-e.yxy),\n' +
          '                        mapa(p+e.yyx)-mapa(p-e.yyx)));\n}\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  vec3 ojo = vec3(0.0, 0.9, -3.4);\n' +
          '  vec3 dir = normalize(vec3(uv, 1.4));\n' +
          '  float t = 0.0;\n' +
          '  for (int i = 0; i < 80; i++) {\n' +
          '    float h = mapa(ojo + t*dir);\n' +
          '    if (h < 0.002 || t > 25.0) break;\n' +
          '    t += h;\n  }\n' +
          '  vec3 c = vec3(0.04, 0.05, 0.1);\n' +
          '  if (t < 25.0) {\n' +
          '    vec3 pos = ojo + t*dir;\n' +
          '    vec3 n = normal(pos);\n' +
          '    vec3 luz = normalize(vec3(0.7, 1.0, -0.5));\n' +
          '    vec3 base = vec3(0.85, 0.6, 0.5);\n' +
          '    c = ' + x + ';\n  }\n' +
          '  color = vec4(sqrt(max(c, 0.0)), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 9 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado tiene que ser un <code>vec3</code>: ' +
          '<code>pow</code> y <code>dot</code> devuelven <code>float</code>, y sumar un ' +
          '<code>float</code> a un <code>vec3</code> sí está permitido.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la iluminación no coincide. Repasa qué multiplica al ' +
          'color base (la difusa y el ambiente) y qué se <em>suma</em> por encima (el brillo y el ' +
          'Fresnel, que no son del material sino de la fuente).' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'El ambiente y la difusa <strong>multiplican</strong> al color del material; el brillo ' +
        'especular y el Fresnel se <strong>suman</strong> aparte, porque son luz reflejada, no color ' +
        'propio. Y todo producto escalar va envuelto en un <code>max(..., 0.0)</code>.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Cinco términos como estos, sumados en el orden correcto, es toda la iluminación que necesita ' +
        'una escena para dejar de parecer de plástico.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'La <strong>difusa</strong> es un producto escalar, y el <code>max</code> con cero no es opcional.',
    'La <strong>sombra suave</strong> sale de guardar el menor $k\\,h/t$ del camino: ese cociente es el ángulo bajo el que el rayo vio el obstáculo.',
    'La <strong>oclusión ambiental</strong> se calcula dando pasitos por la normal y comparando con lo que dice el campo: mide cuánto cielo llega.',
    'El <strong>especular</strong> pone el reflejo de la fuente; el <strong>Fresnel</strong> ilumina los bordes, y es un fenómeno real, no un adorno.',
    'La <strong>niebla</strong> es la ley de Beer-Lambert, una exponencial: sin ella el cerebro no sabe qué está lejos.',
    'La oclusión multiplica solo al ambiente, y la niebla va la última.'
  ]);
});
