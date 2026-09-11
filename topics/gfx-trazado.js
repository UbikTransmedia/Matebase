/* Tema: Trazado de rayos: la geometria de 2.o, dibujando */
Course.topic('gfx-trazado', function (p) {

  p.puente('El túnel fingía la profundidad; este tema la calcula. Cada píxel lanza una ' +
    '[[ge-espacio|recta paramétrica]] desde el ojo, chocar con una esfera es una ' +
    '[[al-ec2|ecuación de segundo grado]] cuyo discriminante decide si se ve, y reflejar es restar dos ' +
    'veces una [[ge-vectores|proyección]].');

  p.text('Hay una manera de fabricar imágenes en tres dimensiones que no necesita triángulos, ni proyecciones ' +
    'complicadas, ni saber nada de tarjetas gráficas. Para cada píxel se lanza un rayo desde el ojo que pasa ' +
    'por ese píxel, se busca el primer objeto con el que choca y se pinta el píxel del color de ese objeto, ' +
    'más o menos iluminado. Se llama <strong>trazado de rayos</strong>, y es la geometría analítica de 2.º de ' +
    'Bachillerato puesta a dibujar.');

  p.text('Un rayo es una [[ge-espacio|recta en forma paramétrica]]. Chocar con una esfera es resolver una ' +
    '[[al-ec2|ecuación de segundo grado]], y el discriminante dice si hay choque. Chocar con un plano es la ' +
    'intersección de una recta y un plano. Y el reflejo en un espejo es el ' +
    '[[ge-metrico|simétrico]] de un vector respecto de la normal.');

  /* ---------------------------------------------------------------- */
  p.section('El rayo como recta paramétrica');

  p.formula('\\vec P(t) = \\vec o + t\\,\\vec d, \\qquad t \\ge 0', 'el rayo',
    '$\\vec o$ es el ojo, el origen del rayo. $\\vec d$ es su dirección, un vector unitario. $t$ es el parámetro: ' +
    'como $\\vec d$ mide 1, $t$ es directamente la distancia recorrida desde el ojo.<br><br>Solo interesan los ' +
    '$t \\ge 0$: lo que queda detrás del ojo no se ve.<br><br>Para el píxel de coordenadas centradas $\\vec p$, con el ' +
    'ojo mirando hacia $-z$: <code>vec3 d = normalize(vec3(p, -foco));</code>. Cuanto mayor es el foco, más estrecho ' +
    'el campo de visión: es un teleobjetivo.');

  /* ---------------------------------------------------------------- */
  p.section('Rayo contra esfera: el discriminante decide');

  p.text('Un punto está en la esfera de centro $\\vec c$ y radio $r$ si su distancia al centro es $r$, es decir, ' +
    'si $|\\vec P - \\vec c|^2 = r^2$. Se sustituye el rayo, se desarrolla el cuadrado con el producto escalar y, ' +
    'como $\\vec d\\cdot\\vec d = 1$, sale una ecuación de segundo grado en $t$:');

  p.formula('t^2 + 2b\\,t + k = 0, \\qquad b = \\vec d\\cdot(\\vec o - \\vec c), \\quad k = |\\vec o - \\vec c|^2 - r^2 \\qquad\\Rightarrow\\qquad t = -b \\pm \\sqrt{b^2 - k}',
    'la intersección de un rayo con una esfera',
    'Es la fórmula de la ecuación de segundo grado con el coeficiente de $t$ par, $2b$, que la simplifica.<br><br>' +
    'El <strong>discriminante</strong> $b^2 - k$ lo decide todo: si es negativo, el rayo pasa de largo y el píxel ' +
    'no ve la esfera; si es positivo, hay dos cortes, la entrada y la salida, y el píxel ve el más cercano, ' +
    '$t = -b - \\sqrt{b^2 - k}$.<br><br>En el punto de choque, la <strong>normal</strong> es $\\vec n = \\frac{\\vec P - \\vec c}{r}$, ' +
    'y la iluminación difusa es $\\max(\\vec n\\cdot\\vec \\ell,\\ 0)$, con $\\vec \\ell$ la dirección hacia la luz.');

  p.comprueba('El discriminante sale positivo, pero las dos soluciones $t$ son negativas. ¿Qué ve el píxel?', [
    { t: 'Nada de la esfera: está detrás del ojo', ok: true, por: 'La recta corta la esfera, pero en la mitad que queda a la espalda. Solo cuentan los $t \\ge 0$: por eso el rayo es media recta y no una recta entera.' },
    { t: 'La esfera, por el corte más cercano', ok: false, por: 'El corte más cercano tiene $t < 0$: habría que retroceder para llegar a él. El ojo no ve hacia atrás.' },
    { t: 'El interior de la esfera', ok: false, por: 'Eso pasa cuando una solución es negativa y la otra positiva: el ojo está dentro. Con las dos negativas, la esfera entera queda detrás.' }
  ]);

  p.ejemplo({
    title: 'Un rayo, una esfera y una luz, con números',
    enunciado: 'Ojo en el origen, rayo $\\vec d = (0, 0, -1)$, esfera de centro $\\vec c = (1, 0, -5)$ y radio 2, luz en la dirección $\\vec \\ell = (-1, 1, 1)/\\sqrt 3$. Decidir si hay choque, dónde, cuánta luz difusa recibe y hacia dónde rebota el rayo.',
    pasos: [
      { t: '<strong>Los coeficientes.</strong> $\\vec o - \\vec c = (-1, 0, 5)$. $b = \\vec d\\cdot(\\vec o - \\vec c) = -5$. $k = |(-1, 0, 5)|^2 - 4 = 26 - 4 = 22$.', antes: 'Calcula $b$ y $k$ con las fórmulas de arriba.' },
      { t: '<strong>El discriminante.</strong> $b^2 - k = 25 - 22 = 3 > 0$: hay choque. $t = -b - \\sqrt 3 = 5 - 1{,}732 = 3{,}268$. El otro corte, $5 + 1{,}732$, es la salida por detrás.' },
      { t: '<strong>El punto y la normal.</strong> $\\vec P = 3{,}268\\,\\vec d = (0, 0, -3{,}268)$. $\\vec n = (\\vec P - \\vec c)/2 = (-1, 0, 1{,}732)/2 = (-0{,}5,\\ 0,\\ 0{,}866)$. Mide 1, como debe.', antes: 'Resta el centro y divide por el radio.' },
      { t: '<strong>La luz.</strong> $\\vec \\ell = (-0{,}577, 0{,}577, 0{,}577)$. $\\vec n\\cdot\\vec \\ell = 0{,}289 + 0 + 0{,}5 = 0{,}789$. Recibe el 79 % de la luz: la cara mira bastante hacia ella.', antes: 'Producto escalar de la normal con la dirección de la luz.' },
      { t: '<strong>El rebote.</strong> $\\vec d\\cdot\\vec n = -0{,}866$. $\\vec R = \\vec d - 2(-0{,}866)\\,\\vec n = (0, 0, -1) + 1{,}732\\,(-0{,}5, 0, 0{,}866) = (-0{,}866,\\ 0,\\ 0{,}5)$. Sigue midiendo 1 y vuelve hacia el ojo, desviado a la izquierda: lo que vería un espejo ahí.' }
    ],
    cierre: 'Segundo grado, un módulo, dos productos escalares y una resta. Con eso se ha decidido qué ve el píxel, cómo de iluminado y qué reflejaría. Es toda la geometría analítica de Bachillerato en un solo píxel.'
  });

  p.demo({
    title: 'El discriminante decide',
    intro: 'Un corte en dos dimensiones: el ojo, un rayo y la esfera, que aquí se ve como un círculo. Gira el rayo y mueve el centro. Con el discriminante negativo el rayo pasa de largo; con él positivo hay dos cortes, y el píxel ve el primero, en rojo.',
    predice: 'Con el centro en $(5,\\ 0{,}8)$ y radio 1,5, ¿a partir de qué ángulo dejará el rayo de tocar la esfera: unos 15°, unos 25° o más de 30°? Estímalo antes de mover el mando.',
    build: function (host) {
      var ang = 8;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1, xmax: 9, ymin: -3.2, ymax: 3.2, height: 300,
        handles: { C: { x: 5, y: 0.8, label: 'centro', color: 1 } },
        draw: function (g) {
          var c = g.h('C'), r = 1.5, a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a);
          var ocx = -c.x, ocy = -c.y, b = dx * ocx + dy * ocy, k = ocx * ocx + ocy * ocy - r * r, disc = b * b - k;
          g.circle(c.x, c.y, r, { color: 1, w: 2.2, fill: true, fillAlpha: 0.12 });
          var tFin = 12, txt;
          if (disc >= 0) {
            var t1 = -b - Math.sqrt(disc), t2 = -b + Math.sqrt(disc);
            if (t2 > 0) g.point(t2 * dx, t2 * dy, { color: 'axis', r: 5, hollow: true });
            if (t1 > 0) { tFin = t1; g.point(t1 * dx, t1 * dy, { color: 'bad', r: 6 }); }
            txt = t1 > 0 ? 'positivo: dos cortes, en $t = ' + U.fmt(t1, 2) + '$ y $t = ' + U.fmt(t2, 2) + '$. El píxel ve el primero.'
              : (t2 > 0 ? 'positivo, pero el primer corte queda detrás: el ojo está dentro de la esfera.' : 'positivo, pero la esfera está detrás del ojo.');
          } else {
            txt = 'negativo: el rayo no toca la esfera.';
          }
          g.vec(0, 0, tFin * dx, tFin * dy, { color: 0, w: 2.4 });
          g.point(0, 0, { color: 'ink', r: 5, label: 'ojo' });
          out.set('$b = ' + U.fmt(b, 2) + '$, $k = ' + U.fmt(k, 2) + '$ &nbsp;·&nbsp; discriminante $b^2 - k = ' + U.fmt(disc, 2) + '$: ' + txt);
        }
      });
      W.slider(W.row(host), { label: 'ángulo del rayo (°)', min: -25, max: 25, step: 0.5, value: ang, on: function (v) { ang = v; plot.render(); } });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Rayo contra plano, sombras y reflejos');

  p.text('Un plano de normal $\\vec n$ es el conjunto de puntos con $\\vec n\\cdot\\vec P = h$. Sustituyendo el rayo, ' +
    'la ecuación ya es de primer grado. Y con las mismas dos intersecciones se consiguen dos efectos más: una ' +
    '<strong>sombra</strong> es un segundo rayo, desde el punto del suelo hacia la luz, que choca con algo por el ' +
    'camino; un <strong>reflejo</strong> es un segundo rayo que sale rebotado.');

  p.formulas([
    't = \\frac{h - \\vec n\\cdot\\vec o}{\\vec n\\cdot\\vec d}',
    '\\vec R = \\vec d - 2\\,(\\vec d\\cdot\\vec n)\\,\\vec n'
  ], 'rayo contra plano y dirección reflejada',
    'La primera solo tiene sentido si $\\vec n\\cdot\\vec d \\ne 0$, es decir, si el rayo no es paralelo al plano, y si ' +
    'sale $t > 0$. Para el suelo $y = -1$ queda $t = \\frac{-1 - o_y}{d_y}$.<br><br>La segunda es la ley de la ' +
    'reflexión: $(\\vec d\\cdot\\vec n)\\,\\vec n$ es la componente de $\\vec d$ en la dirección de la normal, su ' +
    '[[ge-vectores|proyección]]. Restarla dos veces le da la vuelta a esa componente y deja igual la paralela a la ' +
    'superficie, que es exactamente lo que hace un espejo.');

  p.demo({
    title: 'Una esfera, un suelo y una luz',
    intro: 'Cada píxel lanza un rayo: si choca con la esfera, se ilumina con la normal y se mezcla con lo que vería rebotado; si choca con el suelo, se mira si la esfera le tapa la luz. Todo son las dos intersecciones de arriba. Sube el reflejo y cambia el foco.',
    predice: 'Con reflejo 0, ¿qué parte de la esfera será más clara: la de arriba a la izquierda o la de abajo? Y con reflejo 1, ¿qué se verá en la mitad superior de la esfera?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-trazado-1', alto: 320,
        aria: 'Una esfera roja que oscila de lado a lado sobre un suelo de baldosas, con su sombra y un reflejo del cielo.',
        mandos: [
          { n: 'reflejo', label: 'reflejo', min: 0.0, max: 1.0, step: 0.01, value: 0.25, dec: 2 },
          { n: 'foco', label: 'foco', min: 0.8, max: 3.0, step: 0.05, value: 1.5, dec: 2 }
        ],
        codigo:
          'float esfera(vec3 o, vec3 d, vec3 c, float r)\n' +
          '{\n' +
          '    vec3 oc = o - c;\n' +
          '    float b = dot(d, oc);\n' +
          '    float k = dot(oc, oc) - r * r;\n' +
          '    float disc = b * b - k;\n' +
          '    if (disc < 0.0) return -1.0;          // el discriminante decide: no hay choque\n' +
          '    return -b - sqrt(disc);               // el corte mas cercano\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    vec3 o = vec3(0.0, 0.3, 3.0);                      // el ojo\n' +
          '    vec3 d = normalize(vec3(p, -foco));                // el rayo de este pixel\n' +
          '    vec3 c = vec3(0.8 * sin(iTime * 0.7), 0.0, 0.0);   // centro de la esfera\n' +
          '    vec3 luz = normalize(vec3(-0.6, 1.0, 0.5));\n' +
          '    vec3 cielo = vec3(0.55, 0.7, 0.9);\n' +
          '\n' +
          '    vec3 col = cielo - 0.3 * d.y;\n' +
          '    float tE = esfera(o, d, c, 1.0);\n' +
          '    float tS = d.y < 0.0 ? (-1.0 - o.y) / d.y : -1.0;  // el suelo: plano y = -1\n' +
          '\n' +
          '    if (tE > 0.0 && (tS < 0.0 || tE < tS)) {\n' +
          '        vec3 P = o + tE * d;\n' +
          '        vec3 n = P - c;                                // la normal (el radio vale 1)\n' +
          '        vec3 base = vec3(0.9, 0.35, 0.25) * (0.15 + 0.85 * max(dot(n, luz), 0.0));\n' +
          '        vec3 R = d - 2.0 * dot(d, n) * n;              // la direccion reflejada\n' +
          '        vec3 fuera = R.y < 0.0 ? vec3(0.35) : cielo;\n' +
          '        col = mix(base, fuera, reflejo);\n' +
          '    } else if (tS > 0.0) {\n' +
          '        vec3 P = o + tS * d;\n' +
          '        col = mix(vec3(0.25), vec3(0.85), mod(floor(P.x) + floor(P.z), 2.0));\n' +
          '        // sombra: un rayo desde el suelo hacia la luz\n' +
          '        if (esfera(P + 0.001 * luz, luz, c, 1.0) > 0.0) col *= 0.35;\n' +
          '        col = mix(col, cielo, 1.0 - exp(-0.02 * tS * tS));   // niebla a lo lejos\n' +
          '    }\n' +
          '    color = vec4(col, 1.0);\n' +
          '}\n',
        nota: 'Quita la línea de la sombra y la esfera parecerá flotar: la sombra es lo que la apoya en el suelo.'
      });
    }
  });

  p.hist('Arthur Appel, de IBM, propuso en 1968 lanzar un rayo por cada píxel para averiguar qué se ve. En 1980 ' +
    'Turner Whitted, en los Laboratorios Bell, añadió la idea que lo cambió todo: cuando un rayo choca con un ' +
    'espejo o un cristal, se lanzan rayos nuevos rebotados y refractados, y así sucesivamente. Su imagen de dos ' +
    'esferas sobre un tablero tardó horas en calcularse. Durante décadas fue la técnica del cine, calculada ' +
    'fotograma a fotograma en granjas de ordenadores. En 2018 llegaron las primeras tarjetas gráficas de consumo ' +
    'con circuitos dedicados a trazar rayos en tiempo real.');

  p.util('El cine de animación y los efectos visuales usan hoy variantes llamadas <em>path tracing</em>, que lanzan ' +
    'miles de rayos por píxel en direcciones al azar para imitar cómo rebota la luz de verdad. Los arquitectos ' +
    'las usan para ver cómo entrará el sol en un edificio antes de construirlo, y los ingenieros de ópticas, ' +
    'para diseñar lentes.');

  p.trampas([
    { e: 'Quedarse con el segundo corte', por: '$-b + \\sqrt{b^2 - k}$ es por donde el rayo sale de la esfera. El píxel ve por donde entra: $-b - \\sqrt{b^2 - k}$.' },
    { e: 'Llamar distancia a $t$ con $\\vec d$ sin normalizar', por: 'Si $\\vec d$ mide 3, cada unidad de $t$ son 3 de distancia. La fórmula simplificada $t^2 + 2bt + k$ exige $\\vec d\\cdot\\vec d = 1$.' },
    { e: 'Olvidar $t > 0$', por: 'Un plano detrás del ojo da un $t$ negativo perfectamente válido para la recta, pero invisible. Sin la comprobación, el suelo aparece pintado en el cielo.' },
    { e: 'Lanzar el rayo de sombra desde el punto exacto', por: 'El punto está sobre la superficie, y por redondeo la esfera «se choca consigo misma»: sombra moteada. Se despega el origen un pelín, $\\vec P + 0{,}001\\,\\vec \\ell$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Rayo contra el suelo',
    level: 'basico',
    gen: function (r) {
      var oy = r.pick([1, 2, 3]), dx = r.pick([-2, -1, 1, 2]), dy = -r.pick([1, 2]), dz = -r.pick([1, 2, 3]);
      var t = (-1 - oy) / dy;
      return { oy: oy, dv: [dx, dy, dz], t: t, x: t * dx, z: t * dz };
    },
    ask: function (d) {
      return 'Un rayo sale de $\\vec o = (0, ' + d.oy + ', 0)$ en la dirección $\\vec v = (' + d.dv.join(',\\ ') + ')$, sin normalizar, así que aquí $t$ no es una distancia. ' +
        '¿Para qué $t$ corta al suelo $y = -1$, y en qué punto?';
    },
    fields: [{ name: 't', label: '$t$', w: 'tiny' }, { name: 'x', label: '$x$', w: 'tiny' }, { name: 'z', label: '$z$', w: 'tiny' }],
    sol: function (d) { return { t: d.t, x: d.x, z: d.z }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(v.t + d.t) < 1e-6; }, msg: 'Revisa el signo: el rayo baja ($v_y < 0$) desde una altura mayor que $-1$, así que tiene que llegar al suelo con $t > 0$.' }],
    hint: function () { return ['La componente $y$ del rayo es $o_y + t\\,v_y$: iguálala a $-1$.', 'Con ese $t$, calcula $x = t\\,v_x$ y $z = t\\,v_z$.']; },
    steps: function (d) {
      return ['$' + d.oy + ' + t\\cdot(' + d.dv[1] + ') = -1 \\Rightarrow t = \\dfrac{-1 - ' + d.oy + '}{' + d.dv[1] + '} = ' + U.fmt(d.t, 3) + '$',
        'Punto: $(' + U.fmt(d.t, 3) + '\\cdot ' + d.dv[0] + ',\\ -1,\\ ' + U.fmt(d.t, 3) + '\\cdot(' + d.dv[2] + ')) = (' + U.fmt(d.x, 3) + ',\\ -1,\\ ' + U.fmt(d.z, 3) + ')$'];
    },
    answer: function (d) { return 't = ' + U.fmt(d.t, 3) + ', punto (' + U.fmt(d.x, 3) + ', −1, ' + U.fmt(d.z, 3) + ')'; }
  });

  p.exercise({
    title: '¿Choca el rayo con la esfera?',
    level: 'medio',
    gen: function (r) {
      var rad = r.pick([2, 3]), cx = r.int(-3, 3), cy = r.int(-3, 3), cz = -r.int(5, 9);
      var disc = rad * rad - cx * cx - cy * cy;
      if (disc === 0) return null;
      return { rad: rad, cx: cx, cy: cy, cz: cz, disc: disc, b: cz, k: cx * cx + cy * cy + cz * cz - rad * rad, choca: disc > 0 ? 'si' : 'no', t: disc > 0 ? -cz - Math.sqrt(disc) : 0 };
    },
    ask: function (d) {
      return 'Un rayo sale del origen con dirección $\\vec d = (0, 0, -1)$. Hay una esfera de centro $\\vec c = (' + d.cx + ',\\ ' + d.cy + ',\\ ' + d.cz + ')$ y radio $' + d.rad +
        '$. Calcula el discriminante $b^2 - k$, di si el rayo choca y, si choca, a qué distancia $t$ (tres decimales). Si no choca, escribe 0 en $t$.';
    },
    fields: [{ name: 'disc', label: 'discriminante', w: 'tiny' }, { name: 'q', label: '¿Choca?', opts: [{ t: 'Sí', v: 'si' }, { t: 'No', v: 'no' }] }, { name: 't', label: '$t$', w: 'tiny' }],
    sol: function (d) { return { disc: d.disc, q: d.choca, t: U.round(d.t, 6) }; },
    tol: 1e-3,
    errores: [{ si: function (v, d) { return d.disc > 0 && Math.abs(v.t - (-d.cz + Math.sqrt(d.disc))) < 5e-4; }, msg: 'Ese es el segundo corte, por donde el rayo sale de la esfera. El píxel ve el primero: $t = -b - \\sqrt{b^2 - k}$.' }],
    hint: function () { return ['$\\vec o - \\vec c = -\\vec c$. Calcula $b = \\vec d\\cdot(\\vec o - \\vec c)$ y $k = |\\vec o - \\vec c|^2 - r^2$.', 'Si $b^2 - k > 0$, el primer corte es $t = -b - \\sqrt{b^2 - k}$.']; },
    steps: function (d) {
      var l = ['$\\vec o - \\vec c = (' + (-d.cx) + ',\\ ' + (-d.cy) + ',\\ ' + (-d.cz) + ')$, así que $b = (0, 0, -1)\\cdot(\\vec o - \\vec c) = ' + d.b + '$ y $k = ' + (d.k + d.rad * d.rad) + ' - ' + (d.rad * d.rad) + ' = ' + d.k + '$.',
        'Discriminante: $' + d.b + '^2 - ' + d.k + ' = ' + d.disc + '$.'];
      l.push(d.disc > 0 ? 'Es positivo: choca. $t = ' + (-d.b) + ' - \\sqrt{' + d.disc + '} \\approx ' + U.fmt(d.t, 3) + '$.' : 'Es negativo: el rayo pasa de largo.');
      return l;
    },
    answer: function (d) { return d.choca === 'si' ? 'choca en t ≈ ' + U.fmt(d.t, 3) : 'no choca'; }
  });

  p.exercise({
    title: 'La dirección reflejada',
    level: 'medio',
    gen: function (r) {
      var N = r.pick([[0, 1, 0], [1, 0, 0], [0, 0, 1]]), D = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      var dn = D[0] * N[0] + D[1] * N[1] + D[2] * N[2];
      if (dn === 0) return null;
      var R = D.map(function (x, i) { return x - 2 * dn * N[i]; });
      return { N: N, D: D, dn: dn, R: R, suma: D.map(function (x, i) { return x + 2 * dn * N[i]; }), uno: D.map(function (x, i) { return x - dn * N[i]; }) };
    },
    ask: function (d) {
      return 'Un rayo con dirección $\\vec d = (' + d.D.join(',\\ ') + ')$ choca con una superficie cuya normal es $\\vec n = (' + d.N.join(',\\ ') + ')$. ¿Cuál es la dirección reflejada $\\vec R$?';
    },
    fields: [{ name: 'x', label: '$R_x$', w: 'tiny' }, { name: 'y', label: '$R_y$', w: 'tiny' }, { name: 'z', label: '$R_z$', w: 'tiny' }],
    sol: function (d) { return { x: d.R[0], y: d.R[1], z: d.R[2] }; },
    errores: [
      { si: function (v, d) { return v.x === d.suma[0] && v.y === d.suma[1] && v.z === d.suma[2]; }, msg: 'El signo está al revés: se <strong>resta</strong> $2(\\vec d\\cdot\\vec n)\\vec n$. Así se invierte la componente normal.' },
      { si: function (v, d) { return v.x === d.uno[0] && v.y === d.uno[1] && v.z === d.uno[2]; }, msg: 'Restando la proyección una sola vez se anula la componente normal: eso es la proyección sobre la superficie. Para reflejar hay que restarla dos veces.' }
    ],
    hint: function () { return ['Calcula $\\vec d\\cdot\\vec n$.', '$\\vec R = \\vec d - 2(\\vec d\\cdot\\vec n)\\,\\vec n$: solo cambia la componente en la dirección de la normal, y cambia de signo.']; },
    steps: function (d) {
      return ['$\\vec d\\cdot\\vec n = ' + d.dn + '$', '$\\vec R = (' + d.D.join(',\\ ') + ') - 2\\cdot(' + d.dn + ')\\cdot(' + d.N.join(',\\ ') + ') = (' + d.R.join(',\\ ') + ')$',
        'La componente paralela a la superficie no cambia; la perpendicular cambia de signo, como una pelota que rebota.'];
    },
    answer: function (d) { return '(' + d.R.join(', ') + ')'; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec3 oc = o - c;\nfloat b = dot(d, oc);\nfloat disc = b * b - dot(oc, oc) + r * r;\nfloat v = step(0.0, disc);',
          o: ['Un disco blanco sobre fondo negro: la silueta de la esfera', 'Una esfera iluminada con luces y sombras', 'Un anillo fino', 'Toda la pantalla blanca'],
          por: 'Solo se mira si el discriminante es positivo, es decir, si el rayo toca la esfera: sale la silueta, sin ninguna iluminación.' },
        { c: 'vec3 n = normalize(P - c);\nvec3 col = 0.5 + 0.5 * n;',
          o: ['Una esfera cuyos colores cambian suavemente según hacia dónde mira cada punto de su superficie', 'Una esfera de un solo color', 'Una esfera blanca con una sombra negra', 'Un disco con rayas'],
          por: 'La normal cambia de dirección de forma continua sobre la esfera, y cada componente se convierte en un canal de color: es la forma habitual de «ver» las normales.' },
        { c: 'float t = (-1.0 - o.y) / d.y;\nfloat v = step(0.0, t);',
          o: ['La mitad inferior blanca: son los rayos que miran hacia abajo y llegan al suelo', 'La mitad superior blanca', 'Toda la pantalla blanca', 'Una línea horizontal en el centro'],
          por: 'Con el ojo por encima del suelo, $t$ es positivo cuando $d_y < 0$, es decir, en los píxeles de la mitad de abajo.' },
        { c: 'vec3 R = d - 2.0 * dot(d, n) * n;\nvec3 col = R.y > 0.0 ? cielo : suelo;',
          o: ['La esfera se ve como un espejo: arriba refleja el cielo y abajo el suelo', 'La esfera se ve de un color uniforme', 'La esfera desaparece y se ve el fondo', 'La esfera se ve del color del suelo entero'],
          por: 'En la parte alta de la esfera los rayos rebotan hacia arriba y ven cielo; en la baja rebotan hacia abajo y ven suelo.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'En el trazador de rayos del tema, con <code>o</code> el ojo, <code>d</code> el rayo del píxel, <code>c</code> y <code>r</code> la esfera y <code>P</code> el punto de choque, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['¿El resultado depende de si hay choque, de la dirección de la superficie o de hacia dónde va el rayo?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'Un rayo es una recta paramétrica, $\\vec o + t\\,\\vec d$; con $\\vec d$ unitario, $t$ es la distancia.',
    'Rayo contra esfera es una ecuación de segundo grado: si el discriminante $b^2 - k$ es negativo no hay choque, y si es positivo se ve $t = -b - \\sqrt{b^2 - k}$.',
    'Rayo contra plano: $t = \\frac{h - \\vec n\\cdot\\vec o}{\\vec n\\cdot\\vec d}$. Una sombra es un segundo rayo hacia la luz.',
    'La dirección reflejada es $\\vec R = \\vec d - 2(\\vec d\\cdot\\vec n)\\vec n$: se invierte la componente normal.'
  ]);
});
