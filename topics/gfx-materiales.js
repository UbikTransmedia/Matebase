/* Tema: Texturas sólidas */
Course.topic('gfx-materiales', function (p) {

  var RUIDO3 =
    'float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }\n' +
    '\n' +
    '// ruido de valor en el espacio: las ocho esquinas de un cubo\n' +
    'float ruido(vec3 q)\n' +
    '{\n' +
    '    vec3 i = floor(q), f = fract(q);\n' +
    '    vec3 u = f * f * (3.0 - 2.0 * f);\n' +
    '    float a = mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), u.x);\n' +
    '    float b = mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), u.x);\n' +
    '    float c = mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), u.x);\n' +
    '    float d = mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), u.x);\n' +
    '    return mix(mix(a, b, u.y), mix(c, d, u.y), u.z);\n' +
    '}\n' +
    '\n' +
    'float fbm(vec3 p)\n' +
    '{\n' +
    '    float s = 0.0, a = 0.5;\n' +
    '    for (int i = 0; i < 5; i++) {\n' +
    '        s += a * ruido(p);\n' +
    '        p = 2.03 * p + vec3(1.7, 9.2, 3.1);\n' +
    '        a *= 0.5;\n' +
    '    }\n' +
    '    return s;\n' +
    '}\n';

  p.puente('El [[gfx-ruido|ruido de valor]] interpolaba entre las cuatro esquinas de un cuadrado; en el ' +
    'espacio son las ocho esquinas de un cubo y tres [[gfx-decidir|mezclas]] más. Con él se pintan los ' +
    'objetos por dentro: el [[gfx-warp|espacio torcido]] da vetas de mármol, la distancia a un eje da ' +
    'anillos de madera, y el [[gfx-trazado|choque de un rayo con una esfera]] pone un planeta en pantalla.');

  p.text('Para vestir un objeto 3D lo habitual es pegarle una imagen, como quien envuelve un regalo. Con ' +
    'una caja funciona; con una esfera, no: el papel se arruga en los polos y deja una costura. Es el ' +
    'mismo problema que tienen los mapas del mundo, donde Groenlandia sale enorme. Hay otra forma de ' +
    'hacerlo que evita el problema de raíz: <strong>no pegar nada</strong>, sino decidir el color con ' +
    'las tres coordenadas del punto, como si el objeto estuviera tallado en un bloque de material.');

  /* ---------------------------------------------------------------- */
  p.section('Pintar con el punto, no con la superficie');

  p.formula('\\text{color} = f(x,\\ y,\\ z)',
    'una textura sólida',
    'El color no depende de dónde cae el punto en un papel, sino del punto mismo del espacio. El objeto ' +
    'puede tener cualquier forma: su superficie solo decide qué puntos del bloque quedan a la vista.<br><br>' +
    'Por eso no hay costuras ni estiramientos, y un corte en el objeto enseña la veta que seguiría por dentro.');

  p.text('La pieza básica es el ruido de valor en tres dimensiones. Se sortea un número en cada vértice de ' +
    'una rejilla de cubos, y dentro de cada cubo se interpola: primero a lo largo de $x$ en las cuatro ' +
    'aristas, luego a lo largo de $y$ en las dos caras, y por último a lo largo de $z$. Siete mezclas en ' +
    'total, con los pesos suavizados de siempre, $u = f^2(3 - 2f)$.');

  p.ejemplo({
    title: 'Ocho esquinas, siete mezclas',
    enunciado: 'En un cubo de la rejilla, las esquinas de la cara de delante, $z = 0$, valen $0{,}2$ en $(0,0)$, $0{,}6$ en $(1,0)$, $0{,}4$ en $(0,1)$ y $1$ en $(1,1)$. Las de la cara de detrás, $z = 1$, valen $0$, $0{,}8$, $0{,}2$ y $0{,}6$ en el mismo orden. ¿Cuánto vale el ruido en el punto del cubo con $f = (0{,}5;\\ 0{,}5;\\ 0{,}25)$?',
    pasos: [
      { t: '<strong>Los pesos.</strong> $u(0{,}5) = 0{,}25\\cdot 2 = 0{,}5$, y $u(0{,}25) = 0{,}0625\\cdot 2{,}5 = 0{,}15625$. El suavizado deja igual el centro y acerca los extremos.', antes: '¿Cuánto vale $u = f^2(3 - 2f)$ en $0{,}5$ y en $0{,}25$?' },
      { t: '<strong>En $x$, cuatro mezclas.</strong> Delante: $\\operatorname{mix}(0{,}2;\\ 0{,}6;\\ 0{,}5) = 0{,}4$ abajo y $\\operatorname{mix}(0{,}4;\\ 1;\\ 0{,}5) = 0{,}7$ arriba. Detrás: $0{,}4$ y $0{,}4$.' },
      { t: '<strong>En $y$, dos mezclas.</strong> Delante: $\\operatorname{mix}(0{,}4;\\ 0{,}7;\\ 0{,}5) = 0{,}55$. Detrás: $0{,}4$.', antes: 'Mezcla lo de abajo con lo de arriba en cada cara.' },
      { t: '<strong>En $z$, la última.</strong> $\\operatorname{mix}(0{,}55;\\ 0{,}4;\\ 0{,}15625) = 0{,}55 - 0{,}15\\cdot 0{,}15625 \\approx 0{,}5266$. Con el peso sin suavizar, $0{,}25$, habría salido $0{,}5125$.' }
    ],
    cierre: 'El orden de los ejes no cambia el resultado: la interpolación trilineal es la misma empezando por $z$ que por $x$. En el shader, cada <code>mix</code> es una de estas cuentas.'
  });

  p.comprueba('¿Por qué una textura sólida no deja costura al pintar una esfera?', [
    { t: 'Porque el color depende del punto del espacio, y dos puntos que se tocan en la esfera también se tocan en el bloque', ok: true, por: 'El ruido es continuo en el espacio. No hay un papel que tenga que cerrarse sobre sí mismo, así que no hay ningún borde donde dos trozos se encuentren.' },
    { t: 'Porque el ruido se repite cada 360°', ok: false, por: 'El ruido no es periódico ni sabe de ángulos: se evalúa en $(x, y, z)$. Una imagen pegada sí necesitaría repetirse al dar la vuelta, y ahí aparece la costura.' },
    { t: 'Porque la esfera se dibuja con muchos triángulos pequeños', ok: false, por: 'La esfera de este tema ni siquiera tiene triángulos: es la solución de una ecuación de segundo grado. La costura de una imagen pegada aparecería igual con cualquier número de triángulos.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Mármol y madera');

  p.text('El mármol es roca que se depositó en capas planas y después se retorció con calor y presión. La ' +
    'receta del shader es la misma historia: unas capas, que son las franjas de un seno, y una torsión, ' +
    'que es un [[gfx-warp|desplazamiento con fbm]]. La madera se parece: los anillos son cilindros ' +
    'alrededor del eje del tronco, que tampoco crecen perfectos.');

  p.formulas([
    'm(\\vec q) = \\bigl|\\operatorname{sen}\\bigl(k\\,q_x + A\\,\\text{fbm}(\\vec q)\\bigr)\\bigr|',
    'w(\\vec q) = \\operatorname{fract}\\Bigl(k\\,\\sqrt{q_x^2 + q_z^2} + A\\,\\text{fbm}(\\vec q)\\Bigr)'
  ], 'mármol y madera',
    'En el mármol, sin ruido, las franjas serían los planos $q_x = \\text{constante}$; el fbm los ondula. ' +
    'Las vetas oscuras están donde el seno pasa por cero, dos veces por periodo, y ' +
    '<code>smoothstep(0.0, 0.25, m)</code> las deja finas: solo oscurece lo que está muy cerca de 0.<br><br>' +
    'En la madera, $\\sqrt{q_x^2 + q_z^2}$ es la distancia al eje $y$, así que <code>fract</code> dibuja ' +
    'un anillo por cada $1/k$ de radio. Un corte horizontal enseña círculos; uno a lo largo del tronco, ' +
    'rayas.');

  p.demo({
    title: 'Tallar un bloque',
    intro: 'Un cubo de aristas redondeadas que gira. Fíjate en las aristas: la veta pasa de una cara a otra sin cortarse, porque las caras son solo el sitio por donde el cubo corta el bloque de material.',
    predice: 'Pon la turbulencia a 0. ¿Qué dibujo quedará en el mármol? ¿Y en la madera, en la cara de arriba y en las de los lados?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-materiales-1', alto: 340,
        aria: 'Un cubo de aristas redondeadas que gira, tallado en mármol blanco con vetas oscuras, o en madera con anillos.',
        mandos: [
          { n: 'tipo', label: 'material: 0 mármol · 1 madera', min: 0, max: 1, step: 1, value: 0, dec: 0 },
          { n: 'frecuencia', label: 'frecuencia k', min: 2, max: 16, step: 0.5, value: 6, dec: 1 },
          { n: 'turbulencia', label: 'turbulencia A', min: 0, max: 2, step: 0.05, value: 1, dec: 2 }
        ],
        codigo: RUIDO3 +
          '\n' +
          '// el giro del objeto: se usa para la forma y para el color\n' +
          'vec3 gira(vec3 p)\n' +
          '{\n' +
          '    float a = 0.4 * iTime, b = 0.5;\n' +
          '    p.xz = mat2(cos(a), sin(a), -sin(a), cos(a)) * p.xz;\n' +
          '    p.yz = mat2(cos(b), sin(b), -sin(b), cos(b)) * p.yz;\n' +
          '    return p;\n' +
          '}\n' +
          '\n' +
          'float mapa(vec3 p)\n' +
          '{\n' +
          '    vec3 q = gira(p);\n' +
          '    return length(max(abs(q) - vec3(0.8), 0.0)) - 0.12;   // cubo redondeado\n' +
          '}\n' +
          '\n' +
          '// el material: una funcion del punto, en las coordenadas del bloque\n' +
          'vec3 material(vec3 q)\n' +
          '{\n' +
          '    if (tipo < 0.5) {\n' +
          '        // marmol: las vetas estan donde el seno pasa por cero\n' +
          '        float m = abs(sin(frecuencia * q.x + turbulencia * 5.0 * fbm(1.5 * q)));\n' +
          '        return mix(vec3(0.08, 0.09, 0.12), vec3(0.9, 0.88, 0.84), smoothstep(0.0, 0.25, m));\n' +
          '    }\n' +
          '    float r = length(q.xz) + turbulencia * 0.15 * fbm(vec3(4.0 * q.xz, 0.5 * q.y));\n' +
          '    float w = fract(frecuencia * r);\n' +
          '    return mix(vec3(0.55, 0.3, 0.12), vec3(0.22, 0.09, 0.03), smoothstep(0.55, 1.0, w));\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec3 ojo = vec3(0.0, 0.0, -4.2);\n' +
          '    vec3 dir = normalize(vec3(uv, 1.6));\n' +
          '\n' +
          '    float t = 0.0;\n' +
          '    for (int i = 0; i < 80; i++) {\n' +
          '        float h = mapa(ojo + t * dir);\n' +
          '        if (h < 0.001 || t > 10.0) break;\n' +
          '        t += h;\n' +
          '    }\n' +
          '\n' +
          '    vec3 c = mix(vec3(0.01, 0.01, 0.015), vec3(0.06, 0.06, 0.08), uv.y + 0.5);\n' +
          '    if (t < 10.0) {\n' +
          '        vec3 p = ojo + t * dir;\n' +
          '        vec2 e = vec2(0.002, 0.0);\n' +
          '        vec3 n = normalize(vec3(mapa(p + e.xyy) - mapa(p - e.xyy),\n' +
          '                                mapa(p + e.yxy) - mapa(p - e.yxy),\n' +
          '                                mapa(p + e.yyx) - mapa(p - e.yyx)));\n' +
          '        vec3 base = material(gira(p));        // el color viaja con el objeto\n' +
          '        vec3 luz = normalize(vec3(-0.6, 0.8, -0.5));\n' +
          '        float dif = max(dot(n, luz), 0.0);\n' +
          '        float esp = pow(max(dot(n, normalize(luz - dir)), 0.0), 40.0);\n' +
          '        c = base * (0.2 + 0.9 * dif) + 0.4 * esp * (1.0 - 0.8 * tipo);   // el marmol brilla mas\n' +
          '    }\n' +
          '    color = vec4(sqrt(c), 1.0);\n' +
          '}\n',
        nota: 'Prueba a cambiar <code>material(gira(p))</code> por <code>material(p)</code>: el cubo sigue girando, pero el material se queda quieto y el cubo parece moverse a través de él, como una ventana que se desliza sobre una pared de mármol.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Un planeta entero con una función');

  p.text('Una esfera de radio 1 no necesita raymarching: el [[gfx-trazado|choque del rayo]] es una ' +
    'ecuación de segundo grado. Y en el punto de choque $\\vec p$ la normal es el propio $\\vec p$. Lo ' +
    'demás es una textura sólida con reglas, como en el [[gfx-terreno|terreno]]: el fbm hace de altura, ' +
    'lo que queda por debajo de un nivel es mar, y cerca de los polos hay hielo.');

  p.formula('d_{\\min} = \\sqrt{|\\vec o|^2 - (\\vec o\\cdot\\vec d)^2}',
    'lo cerca que pasa el rayo del centro',
    'Con $\\vec o$ el ojo y $\\vec d$ la dirección unitaria del rayo, $-\\vec o\\cdot\\vec d$ es el $t$ ' +
    'del punto del rayo más cercano al centro, y Pitágoras da la distancia. Si $d_{\\min} &lt; 1$ el rayo ' +
    'choca con el planeta; si pasa un poco por fuera, se pinta el resplandor de la atmósfera, que se ' +
    'apaga con $e^{-18\\,(d_{\\min} - 1)}$.');

  p.table(['Capa', 'Regla', 'Por qué'], [
    ['Mar y tierra', '<code>smoothstep(mar, mar + 0.01, h)</code>', 'la altura $h$ = fbm decide qué asoma'],
    ['Montaña y nieve', 'más umbrales sobre $h$', 'como los materiales del terreno'],
    ['Hielo', 'cuando $|q_y|$ es grande', 'cerca de los polos hace frío'],
    ['Nubes', 'otro fbm que gira más deprisa', 'el viento no va con el suelo'],
    ['Luz', '<code>dot(p, sol)</code> con el $\\vec p$ sin girar', 'el sol no gira con el planeta: hay día y noche']
  ]);

  p.demo({
    title: 'Un planeta que gira',
    intro: 'Todo el planeta, con sus continentes, sus hielos y sus nubes, sale de dos llamadas a fbm sobre el punto de la esfera. El suelo y las nubes giran a distinta velocidad, y el sol se queda quieto.',
    predice: 'Sube el nivel del mar a 0,62. ¿Quedarán unos pocos continentes grandes o un archipiélago? ¿Dónde aparecerán las islas: en las antiguas costas o en el interior de los antiguos continentes?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-materiales-2', alto: 360,
        aria: 'Un planeta azul con continentes verdes y pardos, casquetes polares y nubes, que gira iluminado de lado sobre un fondo negro, con un halo azul de atmósfera.',
        mandos: [
          { n: 'mar', label: 'nivel del mar', min: 0.3, max: 0.7, step: 0.01, value: 0.5, dec: 2 },
          { n: 'nubes', label: 'nubes', min: 0, max: 1, step: 0.05, value: 0.7, dec: 2 },
          { n: 'giro', label: 'velocidad de giro', min: 0, max: 3, step: 0.1, value: 1, dec: 1 }
        ],
        codigo: RUIDO3 +
          '\n' +
          'mat2 rota(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec3 ojo = vec3(0.0, 0.0, -3.2);\n' +
          '    vec3 dir = normalize(vec3(uv, 1.6));\n' +
          '    vec3 sol = normalize(vec3(-1.0, 0.4, -0.6));\n' +
          '\n' +
          '    // rayo y esfera de radio 1: t^2 + 2bt + c = 0\n' +
          '    float b = dot(ojo, dir);\n' +
          '    float c = dot(ojo, ojo) - 1.0;\n' +
          '    float disc = b * b - c;\n' +
          '\n' +
          '    // fuera: el halo de la atmosfera, segun lo cerca que pasa el rayo\n' +
          '    vec3 col = vec3(0.0, 0.0, 0.015);\n' +
          '    float dmin = sqrt(max(dot(ojo, ojo) - b * b, 0.0));\n' +
          '    col += vec3(0.25, 0.5, 1.0) * 0.5 * exp(-18.0 * max(dmin - 1.0, 0.0)) * step(1.0, dmin);\n' +
          '\n' +
          '    if (disc > 0.0) {\n' +
          '        vec3 p = ojo + (-b - sqrt(disc)) * dir;   // el punto, con |p| = 1\n' +
          '\n' +
          '        // el suelo: el punto en las coordenadas del planeta, que gira\n' +
          '        vec3 q = p;\n' +
          '        q.xz = rota(0.12 * giro * iTime) * q.xz;\n' +
          '        float h = fbm(2.0 * q);\n' +
          '        float tierra = smoothstep(mar, mar + 0.01, h);\n' +
          '        vec3 agua = mix(vec3(0.01, 0.05, 0.2), vec3(0.04, 0.22, 0.42), smoothstep(mar - 0.15, mar, h));\n' +
          '        vec3 suelo = mix(vec3(0.18, 0.36, 0.1), vec3(0.45, 0.36, 0.22), smoothstep(mar + 0.04, mar + 0.18, h));\n' +
          '        suelo = mix(suelo, vec3(0.95), smoothstep(mar + 0.22, mar + 0.26, h));\n' +
          '        vec3 base = mix(agua, suelo, tierra);\n' +
          '        base = mix(base, vec3(0.95), smoothstep(0.78, 0.84, abs(q.y) + 0.4 * (h - 0.5)));   // hielo\n' +
          '\n' +
          '        // las nubes: otra capa, que gira mas deprisa\n' +
          '        vec3 qn = p;\n' +
          '        qn.xz = rota(0.16 * giro * iTime) * qn.xz;\n' +
          '        float nube = nubes * smoothstep(0.5, 0.72, fbm(3.0 * qn + vec3(0.0, 0.0, 0.05 * iTime)));\n' +
          '        base = mix(base, vec3(1.0), nube);\n' +
          '\n' +
          '        // la luz, con la normal p sin girar: el sol se queda quieto\n' +
          '        float dif = max(dot(p, sol), 0.0);\n' +
          '        col = base * (0.02 + dif);\n' +
          '        vec3 med = normalize(sol - dir);\n' +
          '        col += (1.0 - tierra) * (1.0 - nube) * 0.5 * pow(max(dot(p, med), 0.0), 60.0);   // el sol en el mar\n' +
          '        float borde = pow(1.0 - max(dot(p, -dir), 0.0), 3.0);\n' +
          '        col += vec3(0.25, 0.5, 1.0) * borde * (0.1 + dif);                               // la atmosfera\n' +
          '    }\n' +
          '    color = vec4(sqrt(col), 1.0);\n' +
          '}\n',
        nota: 'El brillo del sol solo aparece sobre el mar, multiplicado por <code>1.0 - tierra</code>: el agua es lisa y refleja, la tierra no. Con «nubes» a 0 se ve el planeta desnudo.'
      });
    }
  });

  p.util('Las texturas sólidas nacieron para el cine, donde un objeto de mármol tallado tiene que poder ' +
    'romperse y enseñar vetas coherentes por dentro, y siguen en todos los programas de render como ' +
    'nodos de madera, mármol o granito. Los juegos que generan planetas enteros hacen lo que este tema, ' +
    'con más capas: ruido para continentes, reglas por altura y latitud, y nubes aparte. Fuera del ' +
    'entretenimiento, la interpolación trilineal de ocho esquinas es la que usan los visores de ' +
    'escáneres médicos para leer entre los vóxeles de un TAC, y las impresoras 3D en color la usan para ' +
    'decidir el color de cada gota de material dentro de la pieza.');

  p.hist('Las texturas sólidas aparecieron dos veces en el mismo congreso: en SIGGRAPH 1985, Darwyn ' +
    'Peachey publicó <em>Solid Texturing of Complex Surfaces</em> y Ken Perlin <em>An Image ' +
    'Synthesizer</em>, donde presentaba su ruido con ejemplos de mármol, fuego y nubes. Perlin había ' +
    'empezado a pensarlo tras trabajar en <em>Tron</em> (1982), harto del aspecto de plástico de las ' +
    'imágenes por ordenador, y en 1997 recibió un Óscar técnico por el ruido que lleva su nombre.');

  p.trampas([
    { e: 'Evaluar el material con el punto sin girar', por: 'Si el objeto gira pero el color se calcula con <code>p</code>, el material se queda quieto y el objeto parece deslizarse a través de él. El color se pregunta en las coordenadas del objeto: <code>material(gira(p))</code>.' },
    { e: 'Girar también la luz', por: 'La normal para iluminar es la del mundo, <code>p</code> sin girar. Si se ilumina con el punto girado, el sol gira con el planeta y siempre es de día en los mismos continentes.' },
    { e: 'Medir la distancia a un punto en vez de a un eje', por: 'Los anillos de la madera son cilindros: <code>length(q.xz)</code>. Con <code>length(q)</code> salen esferas concéntricas, como una cebolla, y los lados del tronco enseñan círculos en vez de rayas.' },
    { e: 'Usar coordenadas enormes en el hash', por: 'El hash con <code>sin</code> pierde precisión con números grandes: lejos del origen el ruido se vuelve a bloques o se repite. Conviene mantener los puntos cerca del origen y escalar con prudencia.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  var ESQ = ['000', '100', '010', '110', '001', '101', '011', '111'];
  function u(f) { return f * f * (3 - 2 * f); }
  function tri(v, ux, uy, uz) {
    var a = v[0] + (v[1] - v[0]) * ux, b = v[2] + (v[3] - v[2]) * ux;
    var c = v[4] + (v[5] - v[4]) * ux, d = v[6] + (v[7] - v[6]) * ux;
    var ab = a + (b - a) * uy, cd = c + (d - c) * uy;
    return { a: a, b: b, c: c, d: d, ab: ab, cd: cd, n: ab + (cd - ab) * uz };
  }

  p.exercise({
    title: 'Ocho esquinas',
    level: 'basico',
    gen: function (r) {
      var v = [];
      for (var i = 0; i < 8; i++) v.push(r.int(0, 9) / 10);
      var f = [r.pick([0, 0.5]), r.pick([0, 0.5]), r.pick([0, 0.5])];
      f[r.int(0, 2)] = r.pick([0.25, 0.75]);
      var s = tri(v, u(f[0]), u(f[1]), u(f[2])), l = tri(v, f[0], f[1], f[2]);
      var media = v.reduce(function (x, y) { return x + y; }, 0) / 8;
      return { v: v, f: f, s: s, lineal: l.n, media: media };
    },
    ask: function (d) {
      return 'En un cubo de la rejilla del ruido, las ocho esquinas valen: ' +
        ESQ.map(function (k, i) { return '$v_{' + k + '} = ' + U.fmt(d.v[i], 1) + '$'; }).join(', ') +
        ' (los subíndices son $x$, $y$, $z$). ¿Cuánto vale el ruido en el punto con $f = (' + d.f.map(function (x) { return U.fmt(x, 2); }).join(';\\ ') +
        ')$, con los pesos suavizados $u = f^2(3 - 2f)$? (cuatro decimales)';
    },
    fields: [{ name: 'n', label: 'ruido', w: 'tiny' }],
    sol: function (d) { return { n: U.round(d.s.n, 6) }; },
    dec: 4,
    errores: [
      { si: function (v, d) { return Math.abs(d.lineal - d.s.n) > 1e-3 && Math.abs(v.n - d.lineal) < 5e-5; }, msg: 'Así sale con los pesos sin suavizar. En $0{,}25$ y $0{,}75$ el suavizado sí cambia el peso: $u(0{,}25) = 0{,}15625$.' },
      { si: function (v, d) { return Math.abs(d.media - d.s.n) > 1e-3 && Math.abs(v.n - d.media) < 5e-5; }, msg: 'Esa es la media de las ocho esquinas, que solo es el valor en el centro del cubo. Interpola eje por eje con los pesos de cada coordenada.' }
    ],
    hint: function () { return ['Calcula primero los tres pesos: $u(0) = 0$, $u(0{,}5) = 0{,}5$, $u(0{,}25) = 0{,}15625$ y $u(0{,}75) = 0{,}84375$.', 'Mezcla en $x$ las cuatro parejas de esquinas, luego en $y$ las dos caras, y por último en $z$.']; },
    steps: function (d) {
      var ux = u(d.f[0]), uy = u(d.f[1]), uz = u(d.f[2]);
      return ['Pesos: $u_x = ' + U.fmt(ux, 5) + '$, $u_y = ' + U.fmt(uy, 5) + '$, $u_z = ' + U.fmt(uz, 5) + '$.',
        'En $x$: $' + U.fmt(d.s.a, 4) + '$ y $' + U.fmt(d.s.b, 4) + '$ en la cara $z = 0$; $' + U.fmt(d.s.c, 4) + '$ y $' + U.fmt(d.s.d, 4) + '$ en la cara $z = 1$.',
        'En $y$: $' + U.fmt(d.s.ab, 4) + '$ delante y $' + U.fmt(d.s.cd, 4) + '$ detrás.',
        'En $z$: $' + U.fmt(d.s.n, 4) + '$.'];
    },
    answer: function (d) { return U.fmt(d.s.n, 4); }
  });

  p.exercise({
    title: 'Una veta de mármol',
    level: 'medio',
    gen: function (r) {
      var k = r.pick([2, 3, 4, 5, 6]), x = r.int(-10, 10) / 10, A = r.pick([1, 2, 3]), n = r.int(10, 90) / 100;
      var fase = k * x + A * n, m = Math.abs(Math.sin(fase));
      return { k: k, x: x, A: A, n: n, fase: fase, m: m, seno: Math.sin(fase), sinRuido: Math.abs(Math.sin(k * x)),
        grados: Math.abs(Math.sin(fase * Math.PI / 180)) };
    },
    ask: function (d) {
      return 'El mármol del tema es $m = |\\operatorname{sen}(k\\,q_x + A\\,\\text{fbm})|$. Con $k = ' + d.k + '$, $A = ' + d.A + '$, en un punto con $q_x = ' + U.fmt(d.x, 1) +
        '$ donde el fbm vale $' + U.fmt(d.n, 2) + '$, ¿cuánto vale la fase, lo que va dentro del seno, y cuánto vale $m$? (cuatro decimales, ángulos en radianes)';
    },
    fields: [{ name: 'fase', label: 'fase', w: 'tiny' }, { name: 'm', label: '$m$', w: 'tiny' }],
    sol: function (d) { return { fase: U.round(d.fase, 6), m: U.round(d.m, 6) }; },
    dec: 4,
    errores: [
      { si: function (v, d) { return d.seno < -1e-3 && Math.abs(v.m - d.seno) < 5e-5; }, msg: 'Falta el valor absoluto: el seno sale negativo, y $m$ es su distancia a cero.' },
      { si: function (v, d) { return Math.abs(d.grados - d.m) > 1e-3 && Math.abs(v.m - d.grados) < 5e-5; }, msg: 'La calculadora está en grados. En GLSL, <code>sin</code> trabaja en radianes.' },
      { si: function (v, d) { return Math.abs(d.sinRuido - d.m) > 1e-3 && Math.abs(v.m - d.sinRuido) < 5e-5; }, msg: 'Falta la torsión: dentro del seno va también $A\\cdot\\text{fbm}$.' }
    ],
    hint: function () { return ['Fase: $k\\,q_x + A\\cdot\\text{fbm}$.', 'Después, $|\\operatorname{sen}(\\text{fase})|$, en radianes.']; },
    steps: function (d) {
      return ['Fase: $' + d.k + '\\cdot(' + U.fmt(d.x, 1) + ') + ' + d.A + '\\cdot ' + U.fmt(d.n, 2) + ' = ' + U.fmt(d.fase, 4) + '$.',
        '$m = |\\operatorname{sen}(' + U.fmt(d.fase, 4) + ')| = ' + U.fmt(d.m, 4) + '$.',
        d.m < 0.1 ? 'Muy cerca de 0: el punto cae dentro de una veta oscura.' : (d.m >= 0.25 ? 'Por encima de 0,25: con <code>smoothstep(0.0, 0.25, m)</code> sale mármol blanco del todo, lejos de las vetas.' : 'Entre 0,1 y 0,25: el borde de una veta, en gris.')];
    },
    answer: function (d) { return 'fase ' + U.fmt(d.fase, 4) + ' · m ' + U.fmt(d.m, 4); }
  });

  p.exercise({
    title: 'El anillo de la madera',
    level: 'medio',
    gen: function (r) {
      var x = r.int(-9, 9) / 10, y = r.int(-9, 9) / 10, z = r.int(-9, 9) / 10, k = r.pick([4, 5, 6, 8, 10]);
      var rr = Math.sqrt(x * x + z * z), r3 = Math.sqrt(x * x + y * y + z * z);
      if (rr < 0.05 || !y) return null;
      var kr = k * rr;
      if (Math.abs(kr - Math.round(kr)) < 0.02) return null;
      return { x: x, y: y, z: z, k: k, r: rr, kr: kr, anillo: Math.floor(kr), w: kr - Math.floor(kr),
        r3: r3, anillo3: Math.floor(k * r3) };
    },
    ask: function (d) {
      return 'Un tronco tiene su eje en el eje $y$ y la madera es <code>fract(k * length(q.xz))</code>, sin ruido, con $k = ' + d.k + '$. En el punto $\\vec q = (' +
        U.fmt(d.x, 1) + ';\\ ' + U.fmt(d.y, 1) + ';\\ ' + U.fmt(d.z, 1) + ')$, ¿a qué distancia está del eje, en qué anillo está (contando desde 0 en el centro) y cuánto vale <code>fract</code>? (cuatro decimales)';
    },
    fields: [{ name: 'r', label: 'distancia al eje', w: 'tiny' }, { name: 'a', label: 'anillo', w: 'tiny' }, { name: 'w', label: 'fract', w: 'tiny' }],
    sol: function (d) { return { r: U.round(d.r, 6), a: d.anillo, w: U.round(d.w, 6) }; },
    dec: { r: 4, w: 4 },
    errores: [
      { si: function (v, d) { return Math.abs(d.r3 - d.r) > 1e-3 && Math.abs(v.r - d.r3) < 5e-5; }, msg: 'Esa es la distancia al origen, con la $y$ incluida. Los anillos rodean el eje $y$: solo cuentan $x$ y $z$.' }
    ],
    hint: function () { return ['Distancia al eje $y$: $\\sqrt{q_x^2 + q_z^2}$.', 'Multiplica por $k$: la parte entera es el anillo y la decimal es <code>fract</code>.']; },
    steps: function (d) {
      return ['$\\sqrt{' + U.fmt(d.x * d.x, 2) + ' + ' + U.fmt(d.z * d.z, 2) + '} = ' + U.fmt(d.r, 4) + '$. La $y$ no cuenta: todos los puntos de una vertical están en el mismo anillo.',
        '$k\\,r = ' + d.k + '\\cdot ' + U.fmt(d.r, 4) + ' = ' + U.fmt(d.kr, 4) + '$: anillo ' + d.anillo + ', y <code>fract</code> vale $' + U.fmt(d.w, 4) + '$.',
        d.w > 0.55 ? 'Con la regla del tema, <code>smoothstep(0.55, 1.0, w)</code>, el punto cae en la parte oscura del anillo.' : 'Con la regla del tema, <code>smoothstep(0.55, 1.0, w)</code> vale 0: madera clara.'];
    },
    answer: function (d) { return 'r ' + U.fmt(d.r, 4) + ' · anillo ' + d.anillo + ' · fract ' + U.fmt(d.w, 4); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float m = abs(sin(frecuencia * q.x));   // sin fbm',
          o: ['Franjas rectas y paralelas, iguales en todas las caras', 'Vetas retorcidas como antes', 'Anillos concéntricos', 'Un color liso'],
          por: 'Sin la torsión, el seno solo depende de $q_x$: las capas son planos paralelos, y cada cara del cubo los corta en rayas rectas.' },
        { c: 'float w = fract(frecuencia * length(q));   // antes: length(q.xz)',
          o: ['Capas esféricas, como una cebolla: círculos en todas las caras', 'Anillos de tronco: círculos arriba y rayas en los lados', 'Franjas paralelas', 'Madera sin anillos'],
          por: '<code>length(q)</code> es la distancia a un punto, no a un eje: las superficies de igual valor son esferas, y cualquier cara las corta en círculos.' },
        { c: 'vec3 base = material(p);   // antes: material(gira(p))',
          o: ['El cubo gira pero el dibujo se queda quieto: el cubo parece deslizarse a través del material', 'Todo sigue igual', 'El cubo deja de girar', 'El material gira el doble de rápido'],
          por: 'La forma se sigue calculando con el punto girado, pero el color se pregunta en el espacio fijo: el material no viaja con el objeto.' },
        { c: 'float dif = max(dot(q, sol), 0.0);   // antes: dot(p, sol)',
          o: ['La luz gira con el planeta: los mismos continentes están siempre de día', 'El planeta queda a oscuras', 'No cambia nada', 'El sol se mueve más deprisa que el planeta'],
          por: 'La normal girada acompaña al suelo. Iluminando con ella, cada punto del planeta recibe siempre la misma luz: no hay amanecer ni anochecer.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'En los shaders del tema, el del cubo tallado o el del planeta, se cambia esta línea. ¿Qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿La línea toca la torsión, la forma de las capas, las coordenadas en que se pregunta el color o la luz?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe el material',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'un <strong>mármol</strong> con las capas a lo largo de $y$: $|\\operatorname{sen}(8\\,q_y + 4\\,\\text{fbm}(\\vec q))|$, en gris', ref: 'vec3(abs(sin(8.0 * q.y + 4.0 * fbm(q))))' },
        { pide: '<strong>anillos de madera</strong> alrededor del eje $y$, sin ruido: <code>fract</code> de 6 veces la distancia al eje, en gris', ref: 'vec3(fract(6.0 * length(q.xz)))' },
        { pide: '<strong>anillos de madera</strong> alrededor del eje $z$, sin ruido: <code>fract</code> de 6 veces la distancia al eje, en gris', ref: 'vec3(fract(6.0 * length(q.xy)))' },
        { pide: 'un <strong>planeta</strong>: el color <code>tierra</code> donde $\\text{fbm}(2\\vec q) \\ge 0{,}5$ y <code>mar</code> en el resto, con un corte limpio', ref: 'mix(mar, tierra, step(0.5, fbm(2.0 * q)))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Una esfera quieta de radio 1 se pinta con una textura sólida. Escribe el color para tener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">// disponibles: vec3 q, el punto de la esfera; float fbm(vec3)\n//             vec3 mar, tierra, dos colores\nvec3 base = <strong>???</strong> ;</pre>';
    },
    fields: [{ name: 'b', label: 'el color', w: 'wide' }],
    sol: function (d) { return { b: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.b || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return RUIDO3 +
          'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '  vec3 ojo = vec3(0.0, 0.0, -2.6), dir = normalize(vec3(uv, 1.3));\n' +
          '  float b = dot(ojo, dir), disc = b * b - dot(ojo, ojo) + 1.0;\n' +
          '  vec3 c = vec3(0.0);\n' +
          '  if (disc > 0.0) {\n' +
          '    vec3 q = ojo + (-b - sqrt(disc)) * dir;\n' +
          '    q.yz = mat2(0.8, 0.6, -0.6, 0.8) * q.yz;\n' +
          '    vec3 mar = vec3(0.05, 0.15, 0.5), tierra = vec3(0.3, 0.6, 0.15);\n' +
          '    vec3 base = ' + x + ';\n' +
          '    c = base;\n' +
          '  }\n' +
          '  color = vec4(clamp(c, 0.0, 1.0), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 5 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado es un <code>vec3</code>: un número se convierte con <code>vec3(...)</code>, y <code>fbm</code> recibe un <code>vec3</code>.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la esfera no queda como se pedía. Revisa qué coordenadas usas, $q_y$, <code>q.xz</code> o <code>q.xy</code>, y los números de la fórmula.' };
      }
      return { ok: true };
    },
    hint: function () { return 'La distancia al eje $y$ es <code>length(q.xz)</code>, porque ignora la $y$; la distancia al eje $z$ ignora la $z$. Un número se pinta en gris con <code>vec3(numero)</code>.'; },
    steps: function (d) { return ['Se pedía ' + d.pide + '.', 'Una respuesta: <code>' + d.ref + '</code>.', 'El corrector pinta la esfera con tu textura y con la de referencia, un poco inclinada para que se vean los polos, y compara las dos imágenes.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Una <strong>textura sólida</strong> decide el color con las tres coordenadas del punto: no hay papel que pegar, así que no hay costuras ni estiramientos.',
    'El ruido de valor en 3D interpola las ocho esquinas de un cubo con siete mezclas.',
    'El <strong>mármol</strong> son capas de un seno torcidas por un fbm; la <strong>madera</strong>, anillos alrededor de un eje, <code>fract(k * length(q.xz))</code>.',
    'El color se pregunta en las coordenadas del objeto, para que viaje con él; la luz se calcula con la normal del mundo.',
    'Un planeta es una esfera con reglas sobre un fbm: mar, tierra, nieve, hielo por latitud y nubes en otra capa.'
  ]);
});
