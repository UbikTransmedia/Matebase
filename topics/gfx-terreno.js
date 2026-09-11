/* Tema: Terreno */
Course.topic('gfx-terreno', function (p) {

  var RUIDO2 =
    'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n' +
    '\n' +
    'float ruido(vec2 q)\n' +
    '{\n' +
    '    vec2 i = floor(q), f = fract(q);\n' +
    '    vec2 u = f * f * (3.0 - 2.0 * f);\n' +
    '    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),\n' +
    '               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);\n' +
    '}\n';

  p.puente('[[gfx-derivadas|Derivar dentro del shader]] ya convertía un fbm en relieve visto desde arriba. ' +
    'Aquí la cámara entra en el paisaje: el [[gfx-raymarching|avance del rayo]] funciona con una altura en ' +
    'vez de una distancia si se respeta una cota de la [[fn-derivadas|derivada]], la normal sale del ' +
    '[[av-vectorial|gradiente]] de una función de dos variables, y [[gfx-luz|la luz y el aire]] hacen el resto.');

  p.text('Las montañas de un simulador de vuelo, los continentes de un videojuego de exploración y muchos ' +
    'paisajes de fondo del cine no los ha modelado nadie: salen de una función. Una sola fórmula ' +
    '$y = h(x, z)$ da una altura para cada punto del suelo, y como no se guarda nada, el paisaje ' +
    '<strong>no se acaba nunca</strong>. Este tema lo construye con tres piezas: una forma segura de ' +
    'avanzar sobre una altura, un ruido con octavas para las montañas, y unas reglas que leen la ' +
    'pendiente para decidir dónde hay roca, hierba o nieve.');

  /* ---------------------------------------------------------------- */
  p.section('Una función de dos variables, vista desde dentro');

  p.text('Un punto $\\vec p$ del espacio está en el aire si queda por encima del suelo que tiene justo ' +
    'debajo, y la diferencia de alturas dice cuánto le sobra:');

  p.formula('\\text{sobre}(\\vec p) = p_y - h(p_x,\\ p_z)',
    'la altura sobre el suelo',
    'Positiva en el aire, cero en el suelo y negativa dentro de la montaña. En el shader: ' +
    '<code>p.y - altura(p.xz)</code>.');

  p.text('Parece una distancia, y el [[gfx-raymarching|raymarching]] pide una distancia. Pero no lo es: ' +
    'mide solo en vertical. Sobre una ladera, el suelo está mucho más cerca <em>de lado</em> que ' +
    '<em>debajo</em>, y un rayo que avanzase todo lo que marca $\\text{sobre}$ podría atravesar la ' +
    'montaña. La salida es saber cuánto puede empinarse el terreno. Si su pendiente nunca pasa de $L$, ' +
    'el suelo queda siempre por debajo de un cono de pendiente $L$, y la distancia a ese cono se calcula:');

  p.formula('d(\\vec p) \\;\\ge\\; \\frac{p_y - h(p_x, p_z)}{\\sqrt{1 + L^2}}',
    'un paso seguro sobre un terreno de pendiente L',
    'Es la distancia del punto a la recta $y = h + L\\,r$, la ladera más empinada posible. Con $L = 1$ ' +
    'se puede avanzar un 71 % de la altura sobre el suelo; con $L = 2$, un 45 %. Por eso el código ' +
    'avanza <code>t += 0.45 * sobre</code>.<br><br>' +
    'A una cota así de la pendiente se le llama <strong>constante de Lipschitz</strong>: dice que la ' +
    'función no puede cambiar más de $L$ por cada unidad que te mueves.');

  p.ejemplo({
    title: 'Un paso seguro sobre una ladera',
    enunciado: 'Un rayo está a altura $3$ y el suelo justo debajo está a $1{,}2$. La pendiente del terreno nunca pasa de $L = 2$. ¿Cuánto puede avanzar el rayo? ¿Qué pasaría si avanzase en horizontal toda la altura sobre el suelo?',
    pasos: [
      { t: '<strong>Lo que sobra.</strong> $\\text{sobre} = 3 - 1{,}2 = 1{,}8$.', antes: '¿Cuánto le sobra al punto por encima del suelo?' },
      { t: '<strong>El factor.</strong> $1/\\sqrt{1 + 2^2} = 1/\\sqrt 5 \\approx 0{,}447$. El paso seguro es $1{,}8 \\cdot 0{,}447 \\approx 0{,}805$.', antes: '¿Qué factor da la fórmula con $L = 2$?' },
      { t: '<strong>El paso entero, en horizontal.</strong> En el peor caso, la ladera sube desde $1{,}2$ con pendiente 2: a distancia $r$ está a $1{,}2 + 2r$. Llega a la altura del rayo, 3, en $r = 0{,}9$. Un paso de $1{,}8$ en horizontal acabaría con el suelo a $4{,}8$, dentro de la montaña.' },
      { t: '<strong>El paso seguro, en horizontal.</strong> Con $r = 0{,}805$ el suelo estaría como mucho a $1{,}2 + 1{,}61 = 2{,}81$, por debajo del rayo. Se vuelve a medir y se da otro paso, más corto: el rayo se acerca a la ladera sin cruzarla.' }
    ],
    cierre: 'El factor cuesta pasos: con 0,45 hacen falta más del doble que con 1. Muchos shaders se arriesgan con 0,5 o 0,6 y aceptan algún defecto en las paredes más empinadas.'
  });

  p.comprueba('El terreno de una escena tiene pendiente máxima 3. ¿Qué fracción de la altura sobre el suelo puede avanzar el rayo sin riesgo?', [
    { t: '$1/\\sqrt{10} \\approx 0{,}32$', ok: true, por: 'Con $L = 3$ el factor es $1/\\sqrt{1 + 9}$. Cuanto más empinado puede ser el terreno, más corto hay que dar el paso.' },
    { t: '$1/3$', ok: false, por: 'Se parece, pero no es la distancia al cono: esa lleva la raíz, $1/\\sqrt{1 + L^2}$. Con pendientes grandes las dos se parecen mucho; con $L = 1$, $1/L$ daría 1, que ya no es seguro.' },
    { t: 'Toda la altura, porque el suelo está debajo', ok: false, por: 'El suelo más cercano puede estar de lado, en una ladera. Medir en vertical solo es seguro si el terreno es plano.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Octavas: montañas, lomas y piedras');

  p.text('La altura es el [[gfx-ruido|fbm]] de siempre: una capa de ruido para las montañas, otra con el ' +
    'doble de frecuencia y la mitad de altura para las lomas, otra para los peñascos, y así. Las ' +
    'amplitudes forman una [[fn-series|serie geométrica]], así que la montaña nunca pasa de una altura ' +
    'fija por muchas octavas que se sumen. Solo hay un detalle nuevo: entre octava y octava, además de ' +
    'doblar la frecuencia, se <strong>gira</strong> el plano.');

  p.formula('h(\\vec x) = A\\sum_{k=0}^{n-1} \\frac{1}{2^{k+1}}\\ \\text{ruido}\\bigl(M^k\\, 0{,}3\\,\\vec x\\bigr),' +
    '\\qquad M = \\begin{pmatrix} 1{,}6 & -1{,}2 \\\\ 1{,}2 & 1{,}6 \\end{pmatrix}',
    'el terreno',
    '$M$ es un giro de unos 37° multiplicado por 2: su determinante es $1{,}6^2 + 1{,}2^2 = 4$, así que ' +
    'estira las longitudes al doble. En GLSL se escribe <code>mat2(1.6, 1.2, -1.2, 1.6)</code>, por ' +
    'columnas.<br><br>' +
    'El ruido de valor se construye sobre una rejilla, y sus defectos quedan alineados con ella. Sin el ' +
    'giro, las rejillas de todas las octavas coincidirían y el paisaje tendría crestas rectas en las ' +
    'direcciones de los ejes; girando, cada octava tapa los defectos de las demás.');

  p.demo({
    title: 'Volar sobre el ruido',
    intro: 'Una cámara que vuela hacia delante sobre un paisaje que no existe hasta que se mira. Todo lo que se ve sale de la función altura. El agua es un plano, y la cámara sube cuando tiene una montaña delante.',
    predice: 'Baja las octavas a 1. ¿Seguirá pareciendo un paisaje de montañas, o unas lomas lisas como de plastilina? Piensa también en qué le pasará a la nieve.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-terreno-1', alto: 340,
        aria: 'Un vuelo rasante sobre montañas con nieve en las cumbres, laderas de hierba y roca, lagos en los valles y bruma en el horizonte.',
        mandos: [
          { n: 'octavas', label: 'octavas', min: 1, max: 7, step: 1, value: 6, dec: 0 },
          { n: 'relieve', label: 'relieve A', min: 0.5, max: 5, step: 0.1, value: 3, dec: 1 },
          { n: 'agua', label: 'nivel del agua (fracción de A)', min: 0, max: 0.6, step: 0.01, value: 0.3, dec: 2 }
        ],
        codigo: RUIDO2 +
          '\n' +
          '// el paisaje entero: una altura para cada punto (x, z) del suelo\n' +
          'float altura(vec2 p)\n' +
          '{\n' +
          '    float h = 0.0, a = 0.5;\n' +
          '    vec2 q = 0.3 * p;\n' +
          '    for (int i = 0; i < 7; i++) {\n' +
          '        if (float(i) >= octavas) break;\n' +
          '        h += a * ruido(q);\n' +
          '        q = mat2(1.6, 1.2, -1.2, 1.6) * q;   // el doble de frecuencia, y girada\n' +
          '        a *= 0.5;                             // la mitad de altura\n' +
          '    }\n' +
          '    return relieve * h;\n' +
          '}\n' +
          '\n' +
          '// avanzar solo una fraccion de lo que sobra: la pendiente manda\n' +
          'float avanza(vec3 o, vec3 d)\n' +
          '{\n' +
          '    float t = 0.1;\n' +
          '    for (int i = 0; i < 150; i++) {\n' +
          '        vec3 p = o + t * d;\n' +
          '        float sobre = p.y - altura(p.xz);\n' +
          '        if (sobre < 0.002 * t || t > 60.0) break;\n' +
          '        t += 0.45 * sobre;\n' +
          '    }\n' +
          '    return t;\n' +
          '}\n' +
          '\n' +
          '// la normal de y = h(x, z) es (-h_x, 1, -h_z), normalizada\n' +
          'vec3 normal(vec2 p)\n' +
          '{\n' +
          '    float e = 0.01;\n' +
          '    return normalize(vec3(altura(p - vec2(e, 0.0)) - altura(p + vec2(e, 0.0)),\n' +
          '                          2.0 * e,\n' +
          '                          altura(p - vec2(0.0, e)) - altura(p + vec2(0.0, e))));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // la camara vuela hacia delante, por encima de lo que tiene cerca\n' +
          '    float z = 1.5 * iTime;\n' +
          '    float nivel = agua * relieve;\n' +
          '    float cerca = max(max(altura(vec2(0.0, z)), altura(vec2(0.0, z + 3.0))), altura(vec2(0.0, z + 6.0)));\n' +
          '    vec3 ojo = vec3(0.0, max(cerca, nivel) + 1.2, z);\n' +
          '    vec3 f = normalize(vec3(0.0, -0.22, 1.0));\n' +
          '    vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));\n' +
          '    vec3 u = cross(f, r);\n' +
          '    vec3 dir = normalize(uv.x * r + uv.y * u + 1.5 * f);\n' +
          '\n' +
          '    vec3 sol = normalize(vec3(-0.6, 0.35, 0.7));\n' +
          '    vec3 cielo = mix(vec3(0.78, 0.84, 0.9), vec3(0.3, 0.5, 0.82), clamp(2.0 * dir.y, 0.0, 1.0));\n' +
          '    vec3 c = cielo + vec3(1.0, 0.75, 0.45) * pow(max(dot(dir, sol), 0.0), 48.0);\n' +
          '\n' +
          '    float t = avanza(ojo, dir);\n' +
          '    float tAgua = dir.y < 0.0 ? (nivel - ojo.y) / dir.y : 1e9;\n' +
          '\n' +
          '    if (tAgua < t && tAgua < 60.0) {\n' +
          '        // el agua es un plano que refleja mas cielo cuanto mas rasante se mira\n' +
          '        t = tAgua;\n' +
          '        float fr = 0.1 + 0.9 * pow(1.0 - max(-dir.y, 0.0), 5.0);\n' +
          '        vec3 refl = reflect(dir, vec3(0.0, 1.0, 0.0));\n' +
          '        vec3 reflejo = cielo + vec3(1.0, 0.8, 0.5) * pow(max(dot(refl, sol), 0.0), 200.0);\n' +
          '        c = mix(vec3(0.03, 0.12, 0.18), reflejo, fr);\n' +
          '        c = mix(c, cielo, 1.0 - exp(-0.0012 * t * t));\n' +
          '    } else if (t < 60.0) {\n' +
          '        vec3 p = ojo + t * dir;\n' +
          '        vec3 n = normal(p.xz);\n' +
          '        // roca en lo empinado, hierba en lo llano, nieve arriba y arena en la orilla\n' +
          '        vec3 base = mix(vec3(0.33, 0.29, 0.26), vec3(0.24, 0.38, 0.14), smoothstep(0.75, 0.9, n.y));\n' +
          '        base = mix(base, vec3(0.92, 0.94, 1.0), smoothstep(0.62, 0.7, p.y / relieve) * smoothstep(0.55, 0.75, n.y));\n' +
          '        base = mix(base, vec3(0.6, 0.55, 0.4), 1.0 - smoothstep(nivel, nivel + 0.08, p.y));\n' +
          '        float dif = max(dot(n, sol), 0.0);\n' +
          '        c = base * (vec3(0.18, 0.22, 0.3) * (0.5 + 0.5 * n.y) + vec3(1.3, 1.15, 0.95) * dif);\n' +
          '        c = mix(c, cielo, 1.0 - exp(-0.0012 * t * t));   // el aire\n' +
          '    }\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'Cada píxel evalúa la altura hasta 150 veces, y cada altura suma hasta siete ruidos: son cientos de ruidos por píxel, sesenta veces por segundo. Si va a saltos, baja las octavas.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La pendiente decide el material');

  p.text('Para iluminar hace falta la normal, y con una altura sale directa. El suelo es la superficie ' +
    '$F(x, y, z) = y - h(x, z) = 0$, y la normal de una superficie así es el ' +
    '[[av-vectorial|gradiente]] de $F$:');

  p.formula('\\vec n = \\frac{(-h_x,\\ 1,\\ -h_z)}{\\sqrt{1 + h_x^2 + h_z^2}}, \\qquad n_y = \\cos\\theta',
    'la normal de un campo de alturas',
    '$h_x$ y $h_z$ son las derivadas parciales de la altura, que el shader calcula con diferencias ' +
    'centradas. El 1 del medio es la derivada de $y$ respecto de $y$.<br><br>' +
    'La componente vertical, $n_y = 1/\\sqrt{1 + h_x^2 + h_z^2}$, es el coseno del ángulo $\\theta$ ' +
    'entre la ladera y la horizontal: vale 1 en lo llano, $0{,}71$ a 45° y 0 en una pared vertical.');

  p.text('Y ese número es justo lo que hace falta para vestir el paisaje. La naturaleza sigue reglas ' +
    'parecidas: en una pared no se sostiene la tierra y aflora la roca, la nieve se acumula arriba pero ' +
    'resbala por lo empinado, y junto al agua hay arena.');

  p.table(['Material', 'Dónde', 'En el shader'], [
    ['Roca', 'lo empinado', 'lo que queda cuando no toca otra cosa'],
    ['Hierba', 'lo llano', '<code>mix(roca, hierba, smoothstep(0.75, 0.9, n.y))</code>'],
    ['Nieve', 'lo alto, si no es muy empinado', '<code>smoothstep(cota - 0.1, cota + 0.1, p.y) * smoothstep(0.55, 0.75, n.y)</code>'],
    ['Arena', 'justo por encima del agua', '<code>1.0 - smoothstep(nivel, nivel + 0.1, p.y)</code>'],
    ['Agua', 'un plano horizontal', 'el más cercano de los dos choques, con Fresnel']
  ]);

  p.demo({
    title: 'Pendiente, altura y orilla',
    intro: 'Un valle visto desde fuera, girando despacio. Con «ver» en 1, la imagen muestra la pendiente en falso color, verde en lo llano y rojo en lo empinado, con una línea blanca donde $n_y$ vale el umbral de la hierba y una azul a la altura de la nieve.',
    predice: 'Con «ver» en 1, sube el umbral de la hierba a 0,95. ¿La línea blanca se irá hacia las cumbres, hacia el fondo de los valles, o se cerrará alrededor de los rellanos más planos, estén a la altura que estén?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-terreno-2', alto: 340,
        aria: 'Un valle con lago, laderas de roca y hierba y cumbres nevadas que gira despacio; se puede cambiar a una vista de la pendiente en falso color.',
        mandos: [
          { n: 'ver', label: 'ver: 0 materiales · 1 pendiente', min: 0, max: 1, step: 1, value: 0, dec: 0 },
          { n: 'pendiente', label: 'umbral de la hierba (n_y)', min: 0.5, max: 0.98, step: 0.01, value: 0.8, dec: 2 },
          { n: 'cota', label: 'altura de la nieve', min: 1, max: 3, step: 0.05, value: 2, dec: 2 }
        ],
        codigo: RUIDO2 +
          '\n' +
          'float altura(vec2 p)\n' +
          '{\n' +
          '    float h = 0.0, a = 0.5;\n' +
          '    vec2 q = 0.3 * p;\n' +
          '    for (int i = 0; i < 6; i++) {\n' +
          '        h += a * ruido(q);\n' +
          '        q = mat2(1.6, 1.2, -1.2, 1.6) * q;\n' +
          '        a *= 0.5;\n' +
          '    }\n' +
          '    return 3.0 * h;\n' +
          '}\n' +
          '\n' +
          'float avanza(vec3 o, vec3 d)\n' +
          '{\n' +
          '    float t = 0.1;\n' +
          '    for (int i = 0; i < 150; i++) {\n' +
          '        vec3 p = o + t * d;\n' +
          '        float sobre = p.y - altura(p.xz);\n' +
          '        if (sobre < 0.002 * t || t > 40.0) break;\n' +
          '        t += 0.45 * sobre;\n' +
          '    }\n' +
          '    return t;\n' +
          '}\n' +
          '\n' +
          'vec3 normal(vec2 p)\n' +
          '{\n' +
          '    float e = 0.01;\n' +
          '    return normalize(vec3(altura(p - vec2(e, 0.0)) - altura(p + vec2(e, 0.0)),\n' +
          '                          2.0 * e,\n' +
          '                          altura(p - vec2(0.0, e)) - altura(p + vec2(0.0, e))));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    float a = 0.08 * iTime;\n' +
          '    vec3 centro = vec3(0.0, 1.0, 0.0);\n' +
          '    vec3 ojo = centro + vec3(7.0 * sin(a), 3.8, -7.0 * cos(a));\n' +
          '    vec3 f = normalize(centro - ojo);\n' +
          '    vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f));\n' +
          '    vec3 u = cross(f, r);\n' +
          '    vec3 dir = normalize(uv.x * r + uv.y * u + 1.6 * f);\n' +
          '\n' +
          '    vec3 sol = normalize(vec3(-0.6, 0.5, 0.6));\n' +
          '    vec3 cielo = mix(vec3(0.78, 0.84, 0.9), vec3(0.3, 0.5, 0.82), clamp(2.0 * dir.y, 0.0, 1.0));\n' +
          '    vec3 c = cielo;\n' +
          '    float nivel = 0.5;\n' +
          '\n' +
          '    float t = avanza(ojo, dir);\n' +
          '    float tAgua = dir.y < 0.0 ? (nivel - ojo.y) / dir.y : 1e9;\n' +
          '    if (min(t, tAgua) < 40.0) {\n' +
          '        float agua = step(tAgua, t);          // 1 si el agua esta mas cerca\n' +
          '        t = min(t, tAgua);\n' +
          '        vec3 p = ojo + t * dir;\n' +
          '        vec3 n = mix(normal(p.xz), vec3(0.0, 1.0, 0.0), agua);\n' +
          '\n' +
          '        // las reglas: pendiente, altura y orilla\n' +
          '        vec3 roca = vec3(0.33, 0.29, 0.26), hierba = vec3(0.24, 0.38, 0.14);\n' +
          '        vec3 nieve = vec3(0.92, 0.94, 1.0), arena = vec3(0.6, 0.55, 0.4);\n' +
          '        vec3 base = mix(roca, hierba, smoothstep(pendiente - 0.05, pendiente + 0.05, n.y));\n' +
          '        base = mix(base, nieve, smoothstep(cota - 0.1, cota + 0.1, p.y) * smoothstep(0.55, 0.75, n.y));\n' +
          '        base = mix(base, arena, 1.0 - smoothstep(nivel, nivel + 0.1, p.y));\n' +
          '        base = mix(base, vec3(0.04, 0.14, 0.2), agua);\n' +
          '        float dif = max(dot(n, sol), 0.0);\n' +
          '        vec3 luz = base * (vec3(0.18, 0.22, 0.3) + vec3(1.3, 1.15, 0.95) * dif);\n' +
          '\n' +
          '        // la pendiente en falso color: verde llano, rojo empinado\n' +
          '        vec3 falso = mix(vec3(0.85, 0.25, 0.15), vec3(0.2, 0.75, 0.35), smoothstep(0.5, 1.0, n.y));\n' +
          '        falso *= 0.45 + 0.55 * dif;\n' +
          '        falso = mix(falso, vec3(1.0), 1.0 - smoothstep(0.0, 0.02, abs(n.y - pendiente)));\n' +
          '        falso = mix(falso, vec3(0.2, 0.45, 1.0), 1.0 - smoothstep(0.0, 0.04, abs(p.y - cota)));\n' +
          '\n' +
          '        c = mix(luz, falso, ver * (1.0 - agua));\n' +
          '        c = mix(c, cielo, 1.0 - exp(-0.002 * t * t));\n' +
          '    }\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'Las reglas no saben nada de geología: son tres <code>smoothstep</code> sobre dos números, la altura y $n_y$. Con el rango de cada uno se decide lo ancha que es la transición entre materiales.'
      });
    }
  });

  p.comprueba('En un punto de la ladera, la normal tiene $n_y = 0{,}5$. ¿Qué material le toca con las reglas de la tabla?', [
    { t: 'Roca: $n_y = 0{,}5$ es una ladera de 60°', ok: true, por: '$\\cos\\theta = 0{,}5$ da $\\theta = 60°$. Queda por debajo del umbral de la hierba y del de la nieve: la roca aflora.' },
    { t: 'Hierba, porque la mitad de la normal apunta hacia arriba', ok: false, por: 'La hierba necesita $n_y$ por encima de 0,75, es decir, laderas de menos de unos 41°. Una normal a medias es una pendiente muy fuerte.' },
    { t: 'Depende solo de la altura del punto', ok: false, por: 'La altura decide la nieve y la arena, pero con $n_y = 0{,}5$ ni la nieve se sostiene. La pendiente manda aquí.' }
  ]);

  p.util('Los paisajes infinitos de los juegos de mundo abierto se generan así, por trozos, a medida que ' +
    'el jugador avanza, y los simuladores de vuelo mezclan alturas reales de satélite con octavas de ' +
    'ruido para inventar el detalle que el satélite no ve. Fuera de la pantalla, un campo de alturas es ' +
    'la forma normal de guardar el relieve en cartografía: los modelos digitales de elevación son una ' +
    'rejilla de alturas, y las sombras de relieve de un mapa topográfico se calculan con la misma ' +
    'normal de este tema. En 2009, Íñigo Quílez y su grupo ganaron un concurso de demos con ' +
    '<em>Elevated</em>, un vuelo sobre montañas como estas que cabía en 4 kilobytes.');

  p.hist('Benoît Mandelbrot propuso en <em>La geometría fractal de la naturaleza</em> (1982) que las ' +
    'montañas se parecen a superficies brownianas fraccionarias, y ese mismo año Alain Fournier, Don ' +
    'Fussell y Loren Carpenter publicaron cómo generarlas por subdivisión. Carpenter ya había ' +
    'sorprendido al público del congreso SIGGRAPH en 1980 con <em>Vol Libre</em>, un vuelo entre montañas ' +
    'fractales, y firmó el planeta que se forma en <em>Star Trek II</em> (1982). El ruido de Ken Perlin ' +
    '(1985) y las variantes de Kenton Musgrave en los noventa hicieron el resto.');

  p.trampas([
    { e: 'Avanzar toda la altura sobre el suelo', por: 'Es distancia vertical, no distancia: las laderas empinadas quedan más cerca de lado y el rayo las atraviesa, con cortes y agujeros en las paredes. Se avanza $1/\\sqrt{1 + L^2}$ de ella.' },
    { e: 'Restar las alturas al revés en la normal', por: 'La normal es $(-h_x, 1, -h_z)$: <code>altura(p - e) - altura(p + e)</code>. Con el orden cambiado la luz parece venir del lado contrario y las laderas al sol salen oscuras.' },
    { e: 'Pintar el agua encima del terreno sin comparar distancias', por: 'El rayo choca con dos cosas, el suelo y el plano del agua, y se ve la más cercana. Si se pinta siempre el agua donde está por encima del suelo, aparece agua delante de montañas que la tapan.' },
    { e: 'Usar la misma tolerancia de choque cerca y lejos', por: 'Un píxel lejano cubre mucho terreno, y exigir una precisión de milésimas allí gasta pasos para nada. La tolerancia crece con la distancia: <code>sobre &lt; 0.002 * t</code>.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La normal del terreno',
    level: 'basico',
    gen: function (r) {
      var h0 = r.int(5, 25) / 10, g0 = r.int(5, 25) / 10;
      var dx = r.int(-4, 4) / 10, dz = r.int(-4, 4) / 10;
      if (!dx && !dz) return null;
      var hx = dx / 0.5, hz = dz / 0.5;
      var ny = 1 / Math.sqrt(1 + hx * hx + hz * hz);
      if (Math.abs(ny - 0.9) < 0.01 || Math.abs(ny - 0.75) < 0.01) return null;
      return { hL: h0, hR: U.round(h0 + dx, 1), hB: g0, hF: U.round(g0 + dz, 1), hx: hx, hz: hz, ny: ny,
        sinDividir: 1 / Math.sqrt(1 + dx * dx + dz * dz),
        ang: Math.acos(ny) * 180 / Math.PI,
        m: ny >= 0.9 ? 'hierba' : (ny < 0.75 ? 'roca' : 'mezcla') };
    },
    ask: function (d) {
      return 'Para calcular la normal de un terreno en un punto se mide la altura a $0{,}25$ a cada lado. En $x$: $' + U.fmt(d.hL, 1) + '$ a la izquierda y $' + U.fmt(d.hR, 1) +
        '$ a la derecha. En $z$: $' + U.fmt(d.hB, 1) + '$ detrás y $' + U.fmt(d.hF, 1) + '$ delante. Con diferencias centradas, ¿cuánto vale $n_y$? ' +
        '¿Qué material le toca, si la hierba pide $n_y \\ge 0{,}9$ y la roca $n_y &lt; 0{,}75$? (cuatro decimales)';
    },
    fields: [
      { name: 'ny', label: '$n_y$', w: 'tiny' },
      { name: 'm', label: 'material', opts: [{ t: 'hierba', v: 'hierba' }, { t: 'mezcla de hierba y roca', v: 'mezcla' }, { t: 'roca', v: 'roca' }] }
    ],
    sol: function (d) { return { ny: U.round(d.ny, 6), m: d.m }; },
    dec: { ny: 4 },
    errores: [
      { si: function (v, d) { return Math.abs(d.sinDividir - d.ny) > 1e-3 && Math.abs(v.ny - d.sinDividir) < 5e-5; }, msg: 'Falta dividir cada diferencia entre $2e = 0{,}5$: la derivada es cuánto sube por unidad, no por medio metro.' },
      { si: function (v) { return Math.abs(v.ny - 1) < 1e-9; }, msg: 'Ese 1 es la componente vertical antes de normalizar. Hay que dividir entre la longitud del vector $(-h_x, 1, -h_z)$.' }
    ],
    hint: function () { return ['$h_x \\approx \\frac{h_{der} - h_{izq}}{0{,}5}$, y lo mismo en $z$.', '$n_y = 1/\\sqrt{1 + h_x^2 + h_z^2}$.']; },
    steps: function (d) {
      return ['$h_x \\approx \\frac{' + U.fmt(d.hR, 1) + ' - ' + U.fmt(d.hL, 1) + '}{0{,}5} = ' + U.fmt(d.hx, 1) + '$ y $h_z \\approx \\frac{' + U.fmt(d.hF, 1) + ' - ' + U.fmt(d.hB, 1) + '}{0{,}5} = ' + U.fmt(d.hz, 1) + '$.',
        '$n_y = \\frac{1}{\\sqrt{1 + ' + U.fmt(d.hx * d.hx, 2) + ' + ' + U.fmt(d.hz * d.hz, 2) + '}} = ' + U.fmt(d.ny, 4) + '$.',
        'Es el coseno de la inclinación: la ladera forma unos ' + U.fmt(d.ang, 0) + '° con la horizontal, así que toca <strong>' + (d.m === 'mezcla' ? 'una mezcla de hierba y roca' : d.m) + '</strong>.'];
    },
    answer: function (d) { return U.fmt(d.ny, 4) + ' · ' + d.m; }
  });

  p.exercise({
    title: 'Un paso seguro',
    level: 'medio',
    gen: function (r) {
      var py = r.int(20, 60) / 10, h = r.int(0, Math.round(py * 10) - 5) / 10, L = r.pick([0.5, 1, 1.5, 2, 3]);
      var s = U.round(py - h, 1), k = 1 / Math.sqrt(1 + L * L);
      return { py: py, h: h, L: L, s: s, k: k, paso: s * k, entreL: s / L };
    },
    ask: function (d) {
      return 'Un rayo está a altura $' + U.fmt(d.py, 1) + '$, y el terreno justo debajo está a $' + U.fmt(d.h, 1) + '$. Se sabe que la pendiente del terreno nunca pasa de $L = ' + U.fmt(d.L, 1) +
        '$. ¿Qué factor hay que aplicar a la altura sobre el suelo, y cuánto puede avanzar el rayo, en cualquier dirección, sin atravesar el suelo? (cuatro decimales)';
    },
    fields: [{ name: 'k', label: 'factor', w: 'tiny' }, { name: 'paso', label: 'paso seguro', w: 'tiny' }],
    sol: function (d) { return { k: U.round(d.k, 6), paso: U.round(d.paso, 6) }; },
    dec: 4,
    errores: [
      { si: function (v, d) { return Math.abs(v.paso - d.s) < 5e-5; }, msg: 'Esa es toda la altura sobre el suelo: solo sería seguro si el terreno fuese plano. Una ladera puede estar más cerca de lado.' },
      { si: function (v, d) { return d.L !== 1 && Math.abs(d.entreL - d.paso) > 1e-3 && Math.abs(v.paso - d.entreL) < 5e-5; }, msg: 'Dividir entre $L$ no es la distancia a la ladera. La distancia de un punto a la recta de pendiente $L$ lleva una raíz: $1/\\sqrt{1 + L^2}$.' }
    ],
    hint: function () { return ['Primero, lo que sobra: $p_y - h$.', 'El factor es $1/\\sqrt{1 + L^2}$.']; },
    steps: function (d) {
      return ['Lo que sobra: $' + U.fmt(d.py, 1) + ' - ' + U.fmt(d.h, 1) + ' = ' + U.fmt(d.s, 1) + '$.',
        'Factor: $1/\\sqrt{1 + ' + U.fmt(d.L * d.L, 2) + '} = ' + U.fmt(d.k, 4) + '$.',
        'Paso: $' + U.fmt(d.s, 1) + '\\cdot ' + U.fmt(d.k, 4) + ' = ' + U.fmt(d.paso, 4) + '$. Tras avanzarlo se vuelve a medir, y el siguiente paso será más corto si el rayo se acerca a una ladera.'];
    },
    answer: function (d) { return 'factor ' + U.fmt(d.k, 4) + ' · paso ' + U.fmt(d.paso, 4); }
  });

  p.exercise({
    title: 'Hasta dónde sube la montaña',
    level: 'medio',
    gen: function (r) {
      var n = r.int(2, 8), A = r.pick([1, 2, 2.5, 3, 4, 5]);
      return { n: n, A: A, max: A * (1 - Math.pow(2, -n)), ultima: A / Math.pow(2, n), antes: A / Math.pow(2, n - 1) };
    },
    ask: function (d) {
      return 'El terreno suma ' + d.n + ' octavas de un ruido que vale entre 0 y 1, con amplitudes $\\tfrac12, \\tfrac14, \\tfrac18, \\ldots$, y multiplica el total por el relieve $A = ' + U.fmt(d.A, 1) +
        '$. ¿Qué altura máxima puede alcanzar? ¿Y cuánto aporta, como mucho, la última octava? (cuatro decimales)';
    },
    fields: [{ name: 'max', label: 'altura máxima', w: 'tiny' }, { name: 'u', label: 'la última octava', w: 'tiny' }],
    sol: function (d) { return { max: U.round(d.max, 6), u: U.round(d.ultima, 6) }; },
    dec: 4,
    errores: [
      { si: function (v, d) { return Math.abs(v.max - d.A) < 5e-5; }, msg: 'La serie completa, con infinitas octavas, sumaría 1. Con ' + 'un número finito se queda corta: le falta justo lo que aportaría la última octava.' },
      { si: function (v, d) { return Math.abs(v.u - d.antes) < 5e-5; }, msg: 'La primera octava ya lleva amplitud $\\tfrac12$: la octava número $n$ lleva $1/2^n$, no $1/2^{n-1}$.' }
    ],
    hint: function () { return ['Es una serie geométrica de razón $\\tfrac12$: $\\tfrac12 + \\tfrac14 + \\cdots + \\tfrac1{2^n} = 1 - \\tfrac1{2^n}$.']; },
    steps: function (d) {
      return ['Suma de amplitudes: $1 - 1/2^{' + d.n + '} = ' + U.fmt(1 - Math.pow(2, -d.n), 4) + '$.',
        'Altura máxima: $' + U.fmt(d.A, 1) + '\\cdot ' + U.fmt(1 - Math.pow(2, -d.n), 4) + ' = ' + U.fmt(d.max, 4) + '$.',
        'Última octava: $' + U.fmt(d.A, 1) + '/2^{' + d.n + '} = ' + U.fmt(d.ultima, 4) + '$. Por eso llega un momento en que más octavas no se notan: añaden piedras más pequeñas que un píxel.'];
    },
    answer: function (d) { return U.fmt(d.max, 4) + ' · ' + U.fmt(d.ultima, 4); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 't += 1.0 * sobre;     // antes: t += 0.45 * sobre;',
          o: ['Cortes y agujeros en las laderas empinadas: el rayo las atraviesa', 'El mismo paisaje, dibujado más deprisa y sin defectos', 'Las montañas se ven el doble de altas', 'Todo el paisaje desaparece'],
          por: 'La altura sobre el suelo no es una distancia: en una ladera empinada, el suelo está más cerca de lado. Avanzándola entera, el rayo se mete en la montaña y dibuja lo que hay detrás.' },
        { c: 'float h = relieve * ruido(0.3 * p);   // una sola octava',
          o: ['Lomas suaves y redondeadas, sin rocas ni detalle', 'Montañas más altas y escarpadas', 'Un terreno completamente plano', 'Picos afilados en cuadrícula'],
          por: 'Una octava de ruido de valor es una superficie suave con una ondulación de unas tres unidades: todo el detalle pequeño lo ponían las octavas siguientes.' },
        { c: 'vec3 n = normalize(vec3(altura(p + vec2(e, 0.0)) - altura(p - vec2(e, 0.0)), 2.0 * e,\n                      altura(p + vec2(0.0, e)) - altura(p - vec2(0.0, e))));',
          o: ['La luz parece venir del lado contrario: las laderas que miran al sol salen oscuras', 'Todo el terreno sale negro', 'No cambia nada', 'El terreno se ve boca abajo'],
          por: 'La normal es $(-h_x, 1, -h_z)$. Con las restas cambiadas, las componentes horizontales cambian de signo y la normal apunta hacia el lado contrario de la ladera.' },
        { c: 'base = mix(roca, hierba, smoothstep(0.75, 0.9, p.y));   // antes: n.y',
          o: ['Hierba en casi todo lo que está alto, también en las paredes, y roca solo en el fondo de los valles', 'Roca en lo empinado y hierba en lo llano, como antes', 'Todo de roca', 'Hierba solo en las cumbres más planas'],
          por: 'La regla mira ahora la altura, no la pendiente: por encima de 0,9 todo es hierba, sea pared o rellano, y solo lo más bajo se queda en roca.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'En el vuelo sobre el terreno del tema, se cambia esta línea. ¿Qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿La línea toca el avance del rayo, la forma del terreno, la normal o el material?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe el material',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: '<strong>hierba</strong> donde $n_y \\ge 0{,}8$ y <strong>roca</strong> en el resto, con un corte limpio', ref: 'mix(roca, hierba, step(0.8, n.y))' },
        { pide: 'una transición <strong>suave</strong> de roca a hierba mientras $n_y$ pasa de 0,7 a 0,9', ref: 'mix(roca, hierba, smoothstep(0.7, 0.9, n.y))' },
        { pide: '<strong>nieve</strong> por encima de la altura 1,5 y <strong>roca</strong> por debajo, con un corte limpio', ref: 'mix(roca, nieve, step(1.5, p.y))' },
        { pide: '<strong>nieve</strong> solo donde a la vez es alto, por encima de 1,5, y llano, con $n_y \\ge 0{,}8$; <strong>roca</strong> en el resto', ref: 'mix(roca, nieve, step(1.5, p.y) * step(0.8, n.y))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe el color del material para tener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">// disponibles en el punto donde choca el rayo:\n//   vec3 p   el punto          vec3 n   la normal\n//   vec3 roca, hierba, nieve   los tres colores\nvec3 base = <strong>???</strong> ;</pre>';
    },
    fields: [{ name: 'b', label: 'el material', w: 'wide' }],
    sol: function (d) { return { b: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.b || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      // El corrector mira el paisaje desde arriba, con un relieve empinado,
      // colores puros y sin luz: asi cada regla ocupa muchos pixeles. Con la
      // vista del tema, iluminada y casi toda llana, un umbral de 0,7 pasaba
      // por uno de 0,8, y la nieve solo alta no se distinguia de alta y llana.
      function env(x) {
        return RUIDO2 +
          'float altura(vec2 q){ float h = 0.0, a = 0.5; q *= 0.3;\n' +
          '  for (int i = 0; i < 4; i++) { h += a * ruido(q); q = mat2(1.6, 1.2, -1.2, 1.6) * q; a *= 0.5; }\n' +
          '  return 4.0 * h; }\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '  vec3 ojo = vec3(0.0, 10.0, -4.0);\n' +
          '  vec3 f = normalize(vec3(0.0, 1.5, 0.0) - ojo);\n' +
          '  vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f)), u = cross(f, r);\n' +
          '  vec3 dir = normalize(uv.x * r + uv.y * u + 1.5 * f);\n' +
          '  float t = 0.1;\n' +
          '  for (int i = 0; i < 160; i++) { vec3 q = ojo + t * dir; float s = q.y - altura(q.xz); if (s < 0.002 * t || t > 40.0) break; t += 0.35 * s; }\n' +
          '  vec3 c = vec3(0.0);\n' +
          '  if (t < 40.0) {\n' +
          '    vec3 p = ojo + t * dir; float e = 0.01;\n' +
          '    vec3 n = normalize(vec3(altura(p.xz - vec2(e, 0.0)) - altura(p.xz + vec2(e, 0.0)), 2.0 * e,\n' +
          '                            altura(p.xz - vec2(0.0, e)) - altura(p.xz + vec2(0.0, e))));\n' +
          '    vec3 roca = vec3(1.0, 0.0, 0.0), hierba = vec3(0.0, 1.0, 0.0), nieve = vec3(0.0, 0.0, 1.0);\n' +
          '    c = ' + x + ';\n' +
          '  }\n' +
          '  color = vec4(c, 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 8 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado es un <code>vec3</code>, y <code>step</code> y <code>smoothstep</code> reciben primero el umbral y después el valor: <code>step(0.8, n.y)</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero el paisaje no queda como se pedía. Revisa qué número mira cada regla, $n_y$ o la altura, los umbrales y el orden de los colores en <code>mix</code>.' };
      }
      return { ok: true };
    },
    hint: function () { return '<code>mix(a, b, s)</code> da <code>a</code> con <code>s = 0</code> y <code>b</code> con <code>s = 1</code>. Un corte limpio es <code>step(umbral, valor)</code>; uno suave, <code>smoothstep(desde, hasta, valor)</code>; y dos condiciones a la vez se multiplican.'; },
    steps: function (d) { return ['Se pedía ' + d.pide + '.', 'Una respuesta: <code>' + d.ref + '</code>.', 'El corrector dibuja el paisaje con tu material y con el de referencia y compara las dos imágenes.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Un terreno es una función de dos variables, $y = h(x, z)$: no se guarda, así que no se acaba.',
    'La altura sobre el suelo, $p_y - h$, no es una distancia. Si la pendiente no pasa de $L$, avanzar $1/\\sqrt{1 + L^2}$ de ella es seguro.',
    'Las montañas son un fbm: cada octava dobla la frecuencia, reduce la altura a la mitad y se gira para que las rejillas no se alineen.',
    'La normal de un campo de alturas es $(-h_x, 1, -h_z)$ normalizada, y su componente vertical es el coseno de la pendiente.',
    'Los materiales salen de reglas sobre dos números, la altura y $n_y$: roca en lo empinado, hierba en lo llano, nieve arriba.'
  ]);
});
