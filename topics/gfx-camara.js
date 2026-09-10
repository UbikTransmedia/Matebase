/* Tema: La camara: una base con el producto vectorial */
Course.topic('gfx-camara', function (p) {

  p.text('En el [[gfx-trazado|trazador de rayos]] el ojo miraba siempre en la misma dirección, hacia $-z$, y el ' +
    'rayo de cada píxel se construía con <code>vec3(p, -foco)</code>. Eso sirve para empezar, pero una cámara de ' +
    'verdad mira a donde se le pide: a un objeto, desde arriba, dando vueltas alrededor. Para eso hace falta ' +
    'construir <strong>tres vectores perpendiculares</strong> ligados a la cámara —hacia delante, hacia la derecha y ' +
    'hacia arriba—, y la herramienta para fabricar perpendiculares en el espacio es el ' +
    '[[ge-espacio-vectores|producto vectorial]].');

  /* ---------------------------------------------------------------- */
  p.section('La base de la cámara');

  p.text('Se parte de dos puntos: el ojo $\\vec o$ y el objetivo $\\vec t$ al que mira. La dirección hacia delante ' +
    'es la del vector que va del uno al otro. La derecha tiene que ser perpendicular a esa dirección y ' +
    'horizontal, así que se obtiene con el producto vectorial por la vertical del mundo. Y la arriba de la ' +
    'cámara, perpendicular a las dos, sale de otro producto vectorial.');

  p.formulas([
    '\\vec f = \\frac{\\vec t - \\vec o}{|\\vec t - \\vec o|}, \\qquad \\vec r = \\frac{\\vec f\\times\\vec{a}}{|\\vec f\\times\\vec{a}|}, \\qquad \\vec u = \\vec r\\times\\vec f',
    '\\vec d = \\frac{p_x\\,\\vec r + p_y\\,\\vec u + z\\,\\vec f}{|\\,p_x\\,\\vec r + p_y\\,\\vec u + z\\,\\vec f\\,|}'
  ], 'la base de la cámara y el rayo de cada píxel',
    '$\\vec a = (0, 1, 0)$ es la vertical del mundo. $\\vec f$, $\\vec r$ y $\\vec u$ son unitarios y perpendiculares dos a dos: ' +
    'una <strong>base ortonormal</strong>.<br><br>$\\vec u$ no hace falta normalizarlo: el producto vectorial de dos unitarios ' +
    'perpendiculares ya mide 1.<br><br>El rayo del píxel $\\vec p$ se forma igual que antes, pero con los vectores de la ' +
    'cámara en lugar de los ejes: $p_x$ veces a la derecha, $p_y$ veces hacia arriba y $z$ veces hacia delante. $z$ es ' +
    'el foco.<br><br>El orden de los productos vectoriales importa: $\\vec a\\times\\vec f$ apunta al lado contrario ' +
    'que $\\vec f\\times\\vec a$. Si solo cambiara $\\vec r$, la imagen saldría reflejada como en un espejo; como ' +
    '$\\vec u$ se calcula a partir de $\\vec r$, cambia también, y la imagen sale girada media vuelta.');

  p.note('Si la cámara mira exactamente hacia arriba o hacia abajo, $\\vec f$ es paralelo a la vertical y ' +
    '$\\vec f\\times\\vec a = \\vec 0$: no se puede normalizar y la derecha queda indefinida. Es un caso límite ' +
    'real, y los programas lo evitan inclinando un poco la vertical de referencia o no dejando que la cámara llegue ' +
    'a esa posición.', 'warn', 'Mirar al cielo');

  p.demo({
    title: 'La base de la cámara, vista desde arriba',
    intro: 'Vista cenital: el ojo, el objetivo y los dos vectores horizontales de la base, f hacia delante y r hacia la derecha. El tercero, u, apunta hacia ti, fuera del papel. Da vueltas con el ojo y cambia el foco: las líneas de puntos son los rayos de los bordes de la imagen.',
    build: function (host) {
      var ang = -60, foco = 1.5;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -6, xmax: 6, ymin: -6, ymax: 6, height: 330, xlabel: 'x', ylabel: null,
        aria: 'Vista desde arriba de una cámara que mira hacia el centro, con sus vectores hacia delante y hacia la derecha',
        draw: function (g) {
          // en el dibujo, la z del mundo va hacia abajo: asi, visto desde arriba, la derecha de la camara queda a su derecha
          var a = ang * Math.PI / 180, ox = 4.5 * Math.cos(a), oz = 4.5 * Math.sin(a);
          var fx = -Math.cos(a), fz = -Math.sin(a), rx = -fz, rz = fx;
          [-0.5, 0.5].forEach(function (s) {
            var dx = s * rx + foco * fx, dz = s * rz + foco * fz, L = Math.hypot(dx, dz);
            g.seg(ox, -oz, ox + 8 * dx / L, -(oz + 8 * dz / L), { color: 'axis', w: 1.2, dash: [4, 4] });
          });
          g.point(0, 0, { color: 2, r: 6, label: 'objetivo' });
          g.vec(ox, -oz, ox + 1.8 * fx, -(oz + 1.8 * fz), { color: 0, w: 3, label: 'f' });
          g.vec(ox, -oz, ox + 1.8 * rx, -(oz + 1.8 * rz), { color: 1, w: 3, label: 'r' });
          g.point(ox, -oz, { color: 'ink', r: 5, label: 'ojo' });
          out.set('Ojo en $(' + U.fmt(ox, 2) + ',\\ 0,\\ ' + U.fmt(oz, 2) + ')$ &nbsp;·&nbsp; $\\vec f = (' + U.fmt(fx, 3) + ',\\ 0,\\ ' + U.fmt(fz, 3) + ')$ &nbsp;·&nbsp; $\\vec r = \\vec f\\times\\vec a = (' + U.fmt(rx, 3) + ',\\ 0,\\ ' + U.fmt(rz, 3) +
            ')$ &nbsp;·&nbsp; $\\vec u = (0, 1, 0)$<br>Campo de visión: $2\\operatorname{arctg}\\frac{0{,}5}{' + U.fmt(foco, 2) + '} \\approx ' + U.fmt(2 * Math.atan(0.5 / foco) * 180 / Math.PI, 1) + '^\\circ$');
        }
      });
      var fila = W.row(host);
      W.slider(fila, { label: 'posición del ojo (°)', min: -180, max: 180, step: 1, value: ang, on: function (v) { ang = v; plot.render(); } });
      W.slider(fila, { label: 'foco', min: 0.5, max: 4, step: 0.05, value: foco, on: function (v) { foco = v; plot.render(); } });
      W.hint(host, 'Para que la derecha de la cámara quede a su derecha visto desde arriba, en el dibujo el eje z del mundo apunta hacia abajo.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Campo de visión y perspectiva');

  p.text('El foco $z$ decide cuánto del mundo cabe en la imagen. Los píxeles del borde superior tienen $p_y = 0{,}5$, ' +
    'y su rayo forma con $\\vec f$ un ángulo cuya tangente es $\\frac{0{,}5}{z}$. El doble de ese ángulo es el campo de ' +
    'visión vertical. Un foco pequeño es un gran angular, que deforma los bordes; uno grande es un teleobjetivo, que ' +
    'aplana la profundidad.');

  p.formula('\\text{campo de visión} = 2\\operatorname{arctg}\\frac{0{,}5}{z} \\qquad\\Longleftrightarrow\\qquad z = \\frac{0{,}5}{\\operatorname{tg}(\\text{campo}/2)}',
    'foco y campo de visión',
    'Con $z = 0{,}5$ el campo es de $90^\\circ$; con $z = 1{,}5$, de unos $37^\\circ$, parecido al de un objetivo normal de ' +
    'fotografía en vertical.<br><br>Es la [[tr-razones|tangente]] de un triángulo rectángulo cuyo cateto contiguo es el ' +
    'foco y cuyo opuesto es media altura de la pantalla.');

  p.demo({
    title: 'Una cámara que da vueltas',
    intro: 'Tres esferas sobre un suelo, vistas por una cámara que siempre mira al centro. Mueve la órbita y la altura del ojo, y cambia el foco: con foco corto las esferas de los lados se estiran; con foco largo todo se aplana. Activa el giro para que la cámara orbite sola.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-camara-1', alto: 320,
        aria: 'Tres esferas de colores sobre un suelo de baldosas, vistas por una cámara que orbita alrededor del centro.',
        mandos: [
          { n: 'orbita', label: 'órbita', min: 0.0, max: 6.28, step: 0.01, value: 0.6, dec: 2 },
          { n: 'altura', label: 'altura del ojo', min: -0.5, max: 4.0, step: 0.05, value: 1.5, dec: 2 },
          { n: 'foco', label: 'foco', min: 0.5, max: 4.0, step: 0.05, value: 1.5, dec: 2 },
          { n: 'giro', label: 'giro automático', min: 0.0, max: 1.0, step: 0.05, value: 0.0, dec: 2 }
        ],
        codigo:
          'float esfera(vec3 o, vec3 d, vec3 c, float r)\n' +
          '{\n' +
          '    vec3 oc = o - c;\n' +
          '    float b = dot(d, oc);\n' +
          '    float disc = b * b - dot(oc, oc) + r * r;\n' +
          '    return disc < 0.0 ? -1.0 : -b - sqrt(disc);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // el ojo recorre una circunferencia de radio 5 alrededor del centro\n' +
          '    float ang = orbita + 0.5 * giro * iTime;\n' +
          '    vec3 o = vec3(5.0 * cos(ang), altura, 5.0 * sin(ang));\n' +
          '    vec3 objetivo = vec3(0.0);\n' +
          '\n' +
          '    // la base de la camara\n' +
          '    vec3 f = normalize(objetivo - o);\n' +
          '    vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0)));\n' +
          '    vec3 u = cross(r, f);\n' +
          '    vec3 d = normalize(p.x * r + p.y * u + foco * f);\n' +
          '\n' +
          '    vec3 cielo = vec3(0.6, 0.72, 0.9);\n' +
          '    vec3 col = cielo - 0.3 * d.y;\n' +
          '    vec3 luz = normalize(vec3(0.5, 1.0, 0.3));\n' +
          '    float mejor = 1e9;\n' +
          '\n' +
          '    if (d.y < 0.0) {                                   // el suelo, y = -1\n' +
          '        float t = (-1.0 - o.y) / d.y;\n' +
          '        vec3 P = o + t * d;\n' +
          '        col = mix(vec3(0.3), vec3(0.8), mod(floor(P.x) + floor(P.z), 2.0));\n' +
          '        col = mix(col, cielo, 1.0 - exp(-0.01 * t * t));\n' +
          '        mejor = t;\n' +
          '    }\n' +
          '    for (int i = 0; i < 3; i++) {                      // tres esferas en triangulo\n' +
          '        float k = float(i);\n' +
          '        vec3 c = vec3(2.0 * cos(k * 2.0944), 0.0, 2.0 * sin(k * 2.0944));\n' +
          '        float t = esfera(o, d, c, 1.0);\n' +
          '        if (t > 0.0 && t < mejor) {\n' +
          '            mejor = t;\n' +
          '            vec3 n = o + t * d - c;\n' +
          '            vec3 base = 0.5 + 0.5 * cos(TAU * (k / 3.0 + vec3(0.0, 0.33, 0.67)));\n' +
          '            col = base * (0.2 + 0.8 * max(dot(n, luz), 0.0));\n' +
          '        }\n' +
          '    }\n' +
          '    color = vec4(col, 1.0);\n' +
          '}\n',
        nota: 'Cambia <code>cross(f, vec3(0.0, 1.0, 0.0))</code> por <code>cross(vec3(0.0, 1.0, 0.0), f)</code>: la derecha y la arriba cambian las dos de sentido, y la imagen gira media vuelta.'
      });
    }
  });

  p.hist('La idea de que una imagen es lo que corta una pantalla puesta entre el ojo y el mundo es del ' +
    'Renacimiento. Hacia 1415, Filippo Brunelleschi pintó el baptisterio de Florencia en perspectiva y lo demostró ' +
    'con un espejo y un agujero: mirando por detrás de la tabla, la pintura encajaba con el edificio real. En ' +
    '1435, Leon Battista Alberti lo convirtió en método en su tratado <em>De pictura</em>: una ventana, un ojo y ' +
    'rayos rectos que la atraviesan. Un shader con cámara hace exactamente eso, píxel a píxel.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La base de la cámara',
    level: 'medio',
    gen: function (r) {
      var trip = r.pick([[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6]]), sx = r.pick([1, -1]), sz = r.pick([1, -1]);
      var ox = sx * trip[0], oz = sz * trip[1], L = Math.hypot(ox, oz);
      var fx = -ox / L, fz = -oz / L;
      return { ox: ox, oz: oz, L: L, fx: fx, fz: fz, rx: -fz, rz: fx };
    },
    ask: function (d) {
      return 'Una cámara tiene el ojo en $\\vec o = (' + d.ox + ',\\ 0,\\ ' + d.oz + ')$ y mira al origen. Con la vertical $\\vec a = (0, 1, 0)$, calcula $\\vec f$ y ' +
        '$\\vec r = \\frac{\\vec f\\times\\vec a}{|\\vec f\\times\\vec a|}$. Sus componentes $y$ valen 0; da las demás (tres decimales).';
    },
    fields: [{ name: 'fx', label: '$f_x$', w: 'tiny' }, { name: 'fz', label: '$f_z$', w: 'tiny' }, { name: 'rx', label: '$r_x$', w: 'tiny' }, { name: 'rz', label: '$r_z$', w: 'tiny' }],
    sol: function (d) { return { fx: U.round(d.fx, 6), fz: U.round(d.fz, 6), rx: U.round(d.rx, 6), rz: U.round(d.rz, 6) }; },
    tol: 1e-3,
    errores: [
      { si: function (v, d) { return Math.abs(v.fx + d.fx) < 5e-4 && Math.abs(v.fz + d.fz) < 5e-4; }, msg: '$\\vec f$ va del ojo al objetivo: $\\vec t - \\vec o$, no $\\vec o - \\vec t$.' },
      { si: function (v, d) { return Math.abs(v.fx - d.fx) < 5e-4 && Math.abs(v.fz - d.fz) < 5e-4 && Math.abs(v.rx + d.rx) < 5e-4 && Math.abs(v.rz + d.rz) < 5e-4; }, msg: 'La derecha sale con el sentido contrario: has calculado $\\vec a\\times\\vec f$. El orden del producto vectorial importa.' }
    ],
    hint: function () { return ['$\\vec t - \\vec o = -\\vec o$; divide por su módulo.', '$(f_x, 0, f_z)\\times(0, 1, 0) = (-f_z,\\ 0,\\ f_x)$, que ya es unitario.']; },
    steps: function (d) {
      return ['$|\\vec o| = ' + d.L + '$, así que $\\vec f = \\left(' + U.fmt(d.fx, 3) + ',\\ 0,\\ ' + U.fmt(d.fz, 3) + '\\right)$.',
        '$\\vec f\\times\\vec a = \\begin{vmatrix} \\vec\\imath & \\vec\\jmath & \\vec k \\\\ f_x & 0 & f_z \\\\ 0 & 1 & 0 \\end{vmatrix} = (-f_z,\\ 0,\\ f_x) = (' + U.fmt(d.rx, 3) + ',\\ 0,\\ ' + U.fmt(d.rz, 3) + ')$',
        'Comprobación: $\\vec f\\cdot\\vec r = 0$ y $|\\vec r| = 1$.'];
    },
    answer: function (d) { return 'f = (' + U.fmt(d.fx, 3) + ', 0, ' + U.fmt(d.fz, 3) + '), r = (' + U.fmt(d.rx, 3) + ', 0, ' + U.fmt(d.rz, 3) + ')'; }
  });

  p.exercise({
    title: 'Foco y campo de visión',
    level: 'basico',
    gen: function (r) {
      var modo = r.pick(['campo', 'foco']);
      if (modo === 'campo') { var z = r.pick([0.5, 1, 1.5, 2, 3]); return { modo: modo, z: z, v: 2 * Math.atan(0.5 / z) * 180 / Math.PI, mal: Math.atan(0.5 / z) * 180 / Math.PI }; }
      var c = r.pick([30, 45, 60, 90, 120]);
      return { modo: modo, c: c, v: 0.5 / Math.tan(c * Math.PI / 360), mal: 0.5 / Math.tan(c * Math.PI / 180) };
    },
    ask: function (d) {
      return d.modo === 'campo'
        ? 'Una cámara usa un foco $z = ' + U.fmt(d.z, 1) + '$ y la pantalla va de $p_y = -0{,}5$ a $p_y = 0{,}5$. ¿Cuál es su campo de visión vertical, en grados? (Dos decimales.)'
        : 'Se quiere un campo de visión vertical de $' + d.c + '^\\circ$, con la pantalla de $p_y = -0{,}5$ a $p_y = 0{,}5$. ¿Qué foco $z$ hay que usar? (Tres decimales.)';
    },
    fields: function (d) { return [{ name: 'v', label: d.modo === 'campo' ? 'campo (°)' : 'foco z', w: 'wide' }]; },
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    tol: 0.006,
    errores: [{ si: function (v, d) { return Math.abs(d.mal - d.v) > 0.01 && Math.abs(v.v - d.mal) < 0.006; }, msg: 'La tangente da la mitad del campo, el ángulo entre el rayo del borde y el centro: hay que usar el ángulo mitad.' }],
    hint: function () { return ['El rayo del borde superior forma con el eje de la cámara un ángulo de tangente $\\frac{0{,}5}{z}$.', 'Ese ángulo es la mitad del campo de visión.']; },
    steps: function (d) {
      return d.modo === 'campo'
        ? ['Mitad del campo: $\\operatorname{arctg}\\dfrac{0{,}5}{' + U.fmt(d.z, 1) + '} \\approx ' + U.fmt(d.mal, 2) + '^\\circ$', 'Campo: el doble, $\\approx ' + U.fmt(d.v, 2) + '^\\circ$']
        : ['Mitad del campo: $' + (d.c / 2) + '^\\circ$', '$z = \\dfrac{0{,}5}{\\operatorname{tg} ' + (d.c / 2) + '^\\circ} \\approx ' + U.fmt(d.v, 3) + '$'];
    },
    answer: function (d) { return d.modo === 'campo' ? U.fmt(d.v, 2) + '°' : 'z ≈ ' + U.fmt(d.v, 3); }
  });

  p.exercise({
    title: 'Un ojo en órbita',
    level: 'medio',
    gen: function (r) {
      var R = r.pick([3, 4, 5]), ang = r.pick([30, 45, 60, 120, 150, 210, 240, 300]), h = r.pick([0.5, 1, 2]);
      var a = ang * Math.PI / 180;
      return { R: R, ang: ang, h: h, x: R * Math.cos(a), z: R * Math.sin(a), mx: R * Math.cos(ang), mz: R * Math.sin(ang) };
    },
    ask: function (d) {
      return 'Un shader coloca el ojo en <code>vec3(R * cos(ang), h, R * sin(ang))</code>, con $R = ' + d.R + '$, $h = ' + U.fmt(d.h, 1) + '$ y un ángulo de $' + d.ang +
        '^\\circ$. ¿En qué punto está el ojo? (Tres decimales.)';
    },
    fields: [{ name: 'x', label: '$x$', w: 'tiny' }, { name: 'y', label: '$y$', w: 'tiny' }, { name: 'z', label: '$z$', w: 'tiny' }],
    sol: function (d) { return { x: U.round(d.x, 6), y: d.h, z: U.round(d.z, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return Math.abs(v.x - d.mx) < 5e-4 && Math.abs(v.z - d.mz) < 5e-4; }, msg: 'En GLSL, <code>cos</code> y <code>sin</code> trabajan en <strong>radianes</strong>: hay que pasar los grados antes.' }],
    hint: function () { return ['Pasa el ángulo a radianes: $\\alpha\\cdot\\frac{\\pi}{180}$.', 'Es un punto de una circunferencia de radio $R$ en el plano horizontal, a la altura $h$.']; },
    steps: function (d) {
      return ['$' + d.ang + '^\\circ = ' + U.fmt(d.ang * Math.PI / 180, 4) + '$ rad', '$x = ' + d.R + '\\cos ' + d.ang + '^\\circ \\approx ' + U.fmt(d.x, 3) + '$, $z = ' + d.R + '\\operatorname{sen} ' + d.ang + '^\\circ \\approx ' + U.fmt(d.z, 3) + '$, $y = ' + U.fmt(d.h, 1) + '$'];
    },
    answer: function (d) { return '(' + U.fmt(d.x, 3) + ', ' + U.fmt(d.h, 1) + ', ' + U.fmt(d.z, 3) + ')'; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec3 r = normalize(cross(f, vec3(0.0, -1.0, 0.0)));\nvec3 u = cross(r, f);',
          o: ['La escena se ve cabeza abajo', 'La escena se ve igual que antes', 'La escena se ve reflejada de izquierda a derecha', 'La imagen se queda negra'],
          por: 'Con la vertical de referencia invertida, $\\vec r$ y $\\vec u$ cambian los dos de sentido: la imagen gira media vuelta.' },
        { c: 'vec3 d = normalize(p.x * r + p.y * u + 3.0 * f);   // antes 1.0',
          o: ['Un zoom: los objetos se ven más grandes y con menos deformación en los bordes', 'Un gran angular: cabe más escena y se deforman los bordes', 'La cámara se aleja y todo se ve más pequeño', 'La imagen se ve cabeza abajo'],
          por: 'Un foco mayor estrecha el campo de visión: se ve un trozo más pequeño del mundo ocupando la misma pantalla.' },
        { c: 'vec3 r = normalize(cross(f, vec3(0.0, 1.0, 0.0)));\nvec3 u = vec3(0.0, 1.0, 0.0);\nvec3 d = normalize(-p.x * r + p.y * u + foco * f);',
          o: ['La imagen se ve reflejada de izquierda a derecha, como en un espejo', 'La escena se ve cabeza abajo', 'La escena se ve igual', 'La cámara mira hacia atrás'],
          por: 'Solo cambia el signo de la componente horizontal del rayo: el píxel de la derecha mira a la izquierda y viceversa, y la vertical se queda igual. Eso es un espejo.' },
        { c: 'vec3 o = vec3(3.0 * cos(iTime), 1.0, 3.0 * sin(iTime));\nvec3 f = normalize(vec3(0.0) - o);',
          o: ['La cámara da vueltas alrededor de la escena mirando siempre al centro', 'La cámara está quieta y la escena gira sobre sí misma de forma distinta', 'La cámara sube y baja', 'La cámara se acerca y se aleja'],
          por: 'El ojo recorre una circunferencia horizontal de radio 3 y $\\vec f$ se recalcula en cada fotograma apuntando al origen.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'En la cámara del tema, que funcionaba bien, se cambia esto. ¿Qué pasa con la imagen?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Pasa que', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿Qué vector de la base cambia, y en qué sentido?', 'El foco controla el campo de visión; la vertical de referencia, qué es arriba.']; },
    steps: function (d) { return [d.por, 'Pasa que: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'La base de una cámara: $\\vec f$ hacia el objetivo, $\\vec r = \\vec f\\times\\vec a$ normalizado y $\\vec u = \\vec r\\times\\vec f$.',
    'El rayo de cada píxel es $p_x\\vec r + p_y\\vec u + z\\vec f$, normalizado.',
    'El orden del producto vectorial decide el sentido: cambiarlo refleja o gira la imagen.',
    'Campo de visión vertical: $2\\operatorname{arctg}\\frac{0{,}5}{z}$. Foco corto, gran angular; foco largo, teleobjetivo.'
  ]);
});
