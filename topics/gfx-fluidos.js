/* Tema: Fluidos */
Course.topic('gfx-fluidos', function (p) {

  p.puente('[[gfx-buffers|El shader que recuerda]] ya calculaba cada fotograma a partir del anterior. ' +
    'Este tema lo pone a mover tinta y humo: se reutilizan la [[av-vectorial|divergencia y el ' +
    'rotacional]], el laplaciano de la [[av-edp|ecuación del calor]] y el [[gfx-ruido|ruido]], que aquí ' +
    'se convierte en un campo de corrientes.');

  p.text('El humo de una vela, la leche que se abre en el café, la tinta en el agua: todo lo que fluye ' +
    'obedece unas ecuaciones del siglo XIX que siguen sin estar resueltas del todo. Pero para ' +
    '<em>dibujarlo</em> no hace falta resolverlas con exactitud. Basta con tres ideas que caben en un ' +
    'shader con memoria: <strong>transportar</strong> lo que hay mirando hacia atrás, mover las cosas ' +
    'con un campo que <strong>no crea huecos</strong>, y dejar que el fluido se <strong>empuje a sí ' +
    'mismo</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('Transportar mirando hacia atrás');

  p.text('Un fluido lleva cosas consigo: tinta, calor, su propia velocidad. A ese transporte se le llama ' +
    '<strong>advección</strong>. Si en cada píxel hay una velocidad $\\vec v$, la tinta que habrá dentro ' +
    'de un instante en un punto es la que ahora está un poco más atrás, justo en el sitio desde el que ' +
    'la corriente la trae:');

  p.formula('c(\\vec x,\\ t + \\Delta t) = c(\\vec x - \\vec v\\,\\Delta t,\\ t)',
    'advección semilagrangiana',
    'Se dice: <em>«la tinta en x dentro de un instante es la tinta que ahora hay en x menos v por delta ' +
    'te»</em>. En el shader, con la velocidad en píxeles por paso: ' +
    '<code>texture2D(iChannel0, (fragCoord - v * dt) / iResolution.xy)</code>.<br><br>' +
    'Se llama semilagrangiana porque sigue a la partícula de fluido (el punto de vista de Lagrange) ' +
    'solo durante un paso, y luego vuelve a la rejilla fija (el de Euler).');

  p.text('Lo natural sería lo contrario: coger la tinta de cada píxel y <em>empujarla</em> hacia donde ' +
    'va. En un shader eso es imposible, porque cada píxel solo escribe su propio color. Y mirar hacia ' +
    'atrás tiene además una virtud enorme: la textura interpola entre píxeles, y una interpolación nunca ' +
    'da un valor mayor que el mayor ni menor que el menor. Por grande que sea la velocidad, el método ' +
    '<strong>no se descontrola</strong>, a diferencia del método explícito del calor de ' +
    '[[gfx-buffers]]. El precio es que difumina un poco en cada paso.');

  p.ejemplo({
    title: 'Un píxel que mira atrás',
    enunciado: 'Un visor con memoria transporta tinta con velocidad $\\vec v$, en píxeles por paso. ¿De dónde lee el píxel $(120, 80)$ con $\\vec v = (3, -2)$? ¿Y con $\\vec v = (2{,}5,\\ 0)$, si en la fila 80 la tinta vale $0{,}8$ en la columna 117 y $0{,}2$ en la 118?',
    pasos: [
      { t: '<strong>Mirar atrás.</strong> $(120, 80) - (3, -2) = (117, 82)$: tres píxeles a la izquierda y dos hacia arriba. La corriente va hacia la derecha y hacia abajo, así que lo que llega aquí venía de allí.', antes: '¿Se suma o se resta la velocidad?' },
      { t: '<strong>Entre dos píxeles.</strong> Con $\\vec v = (2{,}5,\\ 0)$ se lee en $(117{,}5,\\ 80)$, a medio camino entre las columnas 117 y 118. La textura interpola: $0{,}5\\cdot 0{,}8 + 0{,}5\\cdot 0{,}2 = 0{,}5$.', antes: '¿Qué devuelve <code>texture2D</code> al leer entre dos píxeles?' },
      { t: '<strong>El precio.</strong> Un borde que era $0{,}8$ junto a $0{,}2$ se ha convertido en un $0{,}5$. Cada paso con un desplazamiento no entero promedia vecinos: es la <strong>difusión numérica</strong>, y por eso la tinta se emborrona con el tiempo aunque el fluido no tenga viscosidad.' },
      { t: '<strong>La garantía.</strong> Ese $0{,}5$ está entre $0{,}2$ y $0{,}8$. Una interpolación no inventa valores fuera de los que ya había: mirando atrás, la tinta no puede crecer sin control, pase lo que pase con la velocidad.' }
    ],
    cierre: 'Jos Stam presentó este método en 1999 con el nombre de «fluidos estables», precisamente por esa garantía, y es la base de muchos simuladores de humo en tiempo real.'
  });

  p.comprueba('¿Por qué la advección se programa mirando hacia atrás y no empujando la tinta hacia delante?', [
    { t: 'Porque cada píxel solo escribe su propio color: sabe de dónde leer, pero no puede escribir en otro sitio', ok: true, por: 'Empujar hacia delante obligaría a escribir en el píxel de destino, y además dos píxeles podrían mandar su tinta al mismo sitio y dejar otro vacío. Mirando atrás, cada píxel recibe exactamente un valor.' },
    { t: 'Porque así el fluido va más deprisa', ok: false, por: 'La velocidad es la misma en los dos casos. Lo que cambia es cómo se calcula, y la versión hacia atrás es la única que cabe en un fragment shader.' },
    { t: 'Porque hacia delante no se puede interpolar', ok: false, por: 'Se podría repartir la tinta entre varios píxeles de destino. El problema es que un fragment shader no puede escribir en ningún píxel que no sea el suyo.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Un campo sin huecos: ruido rizado');

  p.text('Para transportar hace falta una velocidad en cada punto: un <strong>campo vectorial</strong>. ' +
    'Pero no vale cualquiera. El agua y el humo lento son casi incompresibles: lo que entra en una ' +
    'región vuelve a salir. Eso es pedir que el campo tenga ' +
    '[[av-vectorial|divergencia]] cero, y con un campo cualquiera no pasa: la tinta se amontonaría en ' +
    'unos sitios y dejaría huecos en otros.');

  p.text('Hay un truco que da campos sin divergencia gratis. Se toma <strong>cualquier</strong> función ' +
    '$\\psi$ del plano, la <strong>función de corriente</strong>, y en vez de su gradiente se usa el ' +
    'gradiente girado 90°:');

  p.formula('\\vec v = \\left(\\frac{\\partial \\psi}{\\partial y},\\ -\\frac{\\partial \\psi}{\\partial x}\\right)' +
    '\\quad\\Longrightarrow\\quad \\nabla\\cdot\\vec v = \\frac{\\partial^2 \\psi}{\\partial x\\,\\partial y} - \\frac{\\partial^2 \\psi}{\\partial y\\,\\partial x} = 0',
    'el rotacional de una función de corriente',
    'Las dos derivadas cruzadas son iguales, así que se anulan: la divergencia es cero <strong>sea cual ' +
    'sea $\\psi$</strong>.<br><br>' +
    'Además, el gradiente es perpendicular a las curvas de nivel, y girado 90° es tangente a ellas: el ' +
    'fluido circula a lo largo de las curvas de nivel de $\\psi$, que son las <strong>líneas de ' +
    'corriente</strong>. Si $\\psi$ es un [[gfx-ruido|ruido]], salen corrientes y remolinos: a esto se le ' +
    'llama <strong>ruido rizado</strong>.');

  p.demo({
    title: 'Remover una foto',
    intro: 'La foto se siembra en el primer fotograma y a partir de ahí solo se transporta: cada fotograma lee lo que había un poco más atrás a lo largo del campo. Con «rizado» a 1 el campo es el rotacional del ruido; con 0, su gradiente. Pulsa «Volver al original» para empezar otra vez.',
    predice: 'Pon «rizado» a 0: el campo pasa a ser el gradiente del ruido, que sí tiene divergencia. ¿La foto se seguirá mezclando como un mármol, o los colores se amontonarán en unas pocas manchas lisas?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-fluidos-1', alto: 300, buffer: true, imagen: true, escala: 1,
        aria: 'La foto del paisaje se va removiendo como tinta en agua, arrastrada por corrientes que cambian despacio.',
        mandos: [
          { n: 'fuerza', label: 'fuerza de la corriente', min: 0, max: 1.5, step: 0.05, value: 0.35, dec: 2 },
          { n: 'escala', label: 'tamaño de los remolinos', min: 1, max: 6, step: 0.1, value: 2.5, dec: 1 },
          { n: 'rizado', label: 'rizado: 1 rotacional · 0 gradiente', min: 0, max: 1, step: 1, value: 1, dec: 0 }
        ],
        codigo:
          'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n' +
          '\n' +
          'float ruido(vec2 q)\n' +
          '{\n' +
          '    vec2 i = floor(q), f = fract(q);\n' +
          '    vec2 u = f * f * (3.0 - 2.0 * f);\n' +
          '    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),\n' +
          '               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);\n' +
          '}\n' +
          '\n' +
          '// la funcion de corriente: dos capas de ruido que cambian despacio\n' +
          'float psi(vec2 p)\n' +
          '{\n' +
          '    return ruido(p * escala + vec2(0.0, 0.05 * iTime))\n' +
          '         + 0.5 * ruido(2.0 * p * escala - vec2(0.07 * iTime, 0.0));\n' +
          '}\n' +
          '\n' +
          'vec2 cubre(vec2 fc)\n' +
          '{\n' +
          '    vec2 r = iResolution.xy, t = iChannelResolution[1].xy;\n' +
          '    float s = max(r.x / t.x, r.y / t.y);\n' +
          '    return (fc - 0.5 * r) / (s * t) + 0.5;\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = fragCoord / iResolution.y;\n' +
          '    float e = 0.01;\n' +
          '\n' +
          '    // el gradiente de psi, por diferencias centradas\n' +
          '    vec2 grad = vec2(psi(p + vec2(e, 0.0)) - psi(p - vec2(e, 0.0)),\n' +
          '                     psi(p + vec2(0.0, e)) - psi(p - vec2(0.0, e))) / (2.0 * e);\n' +
          '\n' +
          '    // girado 90 grados es el rotacional: (dpsi/dy, -dpsi/dx), sin divergencia\n' +
          '    vec2 v = mix(grad, vec2(grad.y, -grad.x), rizado);\n' +
          '\n' +
          '    // adveccion: lo que habra aqui es lo que ahora hay un poco mas atras\n' +
          '    vec3 c = texture2D(iChannel0, (fragCoord - fuerza * v) / iResolution.xy).rgb;\n' +
          '\n' +
          '    // siembra: la foto, en el primer fotograma\n' +
          '    c = mix(c, texture2D(iChannel1, cubre(fragCoord)).rgb, step(iFrame, 0.5));\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Con la cámara encendida, «Volver al original» siembra con tu imagen. Y fíjate en que, aunque la foto se deforme hasta ser irreconocible, con el campo rotacional ningún color se amontona: el área de cada mancha se conserva, que es lo que significa divergencia cero.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Un fluido que se empuja a sí mismo');

  p.text('En el ejemplo anterior la corriente venía dada. En un fluido de verdad, la velocidad también ' +
    'se transporta a sí misma —un remolino sigue girando aunque nadie lo remueva— y además cambia por ' +
    'tres causas: la <strong>presión</strong> empuja desde donde se amontona el fluido hacia donde ' +
    'escasea, la <strong>viscosidad</strong> iguala la velocidad de cada punto con la de sus vecinos, y ' +
    'las <strong>fuerzas</strong> de fuera, como un chorro, añaden movimiento. Son las ecuaciones de ' +
    'Navier y Stokes.');

  p.formulas([
    '\\frac{\\partial \\rho}{\\partial t} = -\\nabla\\cdot(\\rho\\,\\vec v)',
    '\\frac{\\partial \\vec v}{\\partial t} = -(\\vec v\\cdot\\nabla)\\,\\vec v - K\\,\\nabla\\rho + \\nu\\,\\Delta\\vec v + \\vec f'
  ], 'un fluido compresible sencillo',
    'La primera es la <strong>continuidad</strong>: la densidad $\\rho$ baja donde el flujo diverge y sube ' +
    'donde converge. La segunda dice cómo cambia la velocidad, término a término: se transporta a sí ' +
    'misma, la presión, proporcional al gradiente de la densidad, empuja cuesta abajo, el laplaciano ' +
    '$\\Delta\\vec v$ la suaviza como el calor, con viscosidad $\\nu$, y $\\vec f$ son las fuerzas de ' +
    'fuera.<br><br>' +
    'Un fluido de verdad incompresible exigiría resolver en cada paso una ecuación de Poisson, con muchas ' +
    'pasadas. El truco de Guay, Colin y Egli es dejarlo ligeramente compresible: donde se acumula ' +
    'densidad, la presión la devuelve. Todo cabe en <strong>una sola pasada</strong> por píxel.');

  p.table(['Término', 'En el shader', 'Qué hace'], [
    ['Advección', '<code>S(fragCoord - dt * C.xy)</code>', 'la velocidad y la tinta llegan desde atrás'],
    ['Continuidad', '<code>C.z -= dt * dot(vec3(gradRho, div), C.xyz)</code>', 'la densidad sube donde el fluido converge'],
    ['Presión', '<code>-(presion / dt) * gradRho</code>', 'empuja desde lo denso hacia lo ligero'],
    ['Viscosidad', '<code>viscosidad * (R + L + T + D - 4.0 * C)</code>', 'iguala la velocidad con la de los vecinos'],
    ['Fuerza', 'la boquilla', 'impone la velocidad del chorro cerca de un punto']
  ]);

  p.demo({
    title: 'Un chorro de humo',
    intro: 'Cada píxel del estado guarda cuatro números: la velocidad en los canales rojo y verde, la densidad en el azul y la tinta en el alfa. Haz clic en la imagen para mover la boquilla, y vuelve al original para empezar con el aire en calma.',
    predice: 'Sube la viscosidad al máximo: ¿el humo hará más remolinos o menos? Piensa en lo que hace el laplaciano con las diferencias de velocidad entre vecinos.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-fluidos-2', alto: 340, buffer: true, escala: 0.5, pasos: 2,
        aria: 'Una columna de humo claro que sale de una boquilla, sube ondulando y se deshace en remolinos sobre un fondo oscuro.',
        mandos: [
          { n: 'presion', label: 'presión K', min: 0.05, max: 0.4, step: 0.01, value: 0.2, dec: 2 },
          { n: 'viscosidad', label: 'viscosidad ν', min: 0.02, max: 1, step: 0.01, value: 0.4, dec: 2 },
          { n: 'chorro', label: 'velocidad del chorro', min: 0, max: 12, step: 0.5, value: 5, dec: 1 }
        ],
        vista: 'vec3 vista(vec4 s) { float t = clamp(s.w, 0.0, 1.0); vec3 humo = mix(vec3(0.02, 0.03, 0.07), vec3(1.0, 0.82, 0.62), t); return humo + vec3(0.1, 0.25, 0.6) * clamp(0.15 * length(s.xy), 0.0, 1.0) * (1.0 - t); }',
        codigo:
          '// el estado de cada pixel: velocidad en rg, densidad en b y tinta en a\n' +
          'vec4 S(vec2 fc) { return texture2D(iChannel0, fc / iResolution.xy); }\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    float dt = 0.15;\n' +
          '    vec4 C = S(fragCoord);\n' +
          '    vec4 R = S(fragCoord + vec2(1.0, 0.0)), L = S(fragCoord - vec2(1.0, 0.0));\n' +
          '    vec4 T = S(fragCoord + vec2(0.0, 1.0)), D = S(fragCoord - vec2(0.0, 1.0));\n' +
          '\n' +
          '    // 1. diferencias centradas\n' +
          '    vec3 ddx = 0.5 * (R.xyz - L.xyz), ddy = 0.5 * (T.xyz - D.xyz);\n' +
          '    float div = ddx.x + ddy.y;              // divergencia de la velocidad\n' +
          '    vec2 gradRho = vec2(ddx.z, ddy.z);      // gradiente de la densidad\n' +
          '\n' +
          '    // 2. continuidad: donde el fluido converge, se acumula\n' +
          '    C.z -= dt * dot(vec3(gradRho, div), C.xyz);\n' +
          '    C.z = clamp(C.z, 0.5, 3.0);\n' +
          '\n' +
          '    // 3. presion y viscosidad\n' +
          '    vec2 empuje = -(presion / dt) * gradRho;\n' +
          '    vec2 visc = viscosidad * (R.xy + L.xy + T.xy + D.xy - 4.0 * C.xy);\n' +
          '\n' +
          '    // 4. adveccion: la velocidad y la tinta llegan desde atras\n' +
          '    vec2 atras = clamp(fragCoord - dt * C.xy, vec2(1.0), iResolution.xy - 1.0);\n' +
          '    C.xyw = S(atras).xyw;\n' +
          '    C.xy += dt * (visc + empuje);\n' +
          '\n' +
          '    // siembra: en el primer fotograma, aire quieto, densidad 1 y nada de tinta\n' +
          '    C = mix(C, vec4(0.0, 0.0, 1.0, 0.0), step(iFrame, 0.5));\n' +
          '\n' +
          '    // 5. la boquilla: en el ultimo clic, o abajo en el centro\n' +
          '    vec2 boca = iMouse.z > 0.0 ? iMouse.zw : vec2(0.5 * iResolution.x, 0.15 * iResolution.y);\n' +
          '    vec2 df = fragCoord - boca;\n' +
          '    float cerca = exp(-dot(df, df) / 12.0);\n' +
          '    vec2 dir = vec2(0.6 * sin(1.3 * iTime), 1.0);\n' +
          '    C.xy = mix(C.xy, chorro * dir, cerca);   // impone la velocidad del chorro\n' +
          '    C.w = max(C.w * 0.997, cerca);           // echa tinta, que se apaga despacio\n' +
          '\n' +
          '    // 6. un tope de velocidad, y paredes quietas\n' +
          '    C.xy *= min(1.0, 12.0 / max(length(C.xy), 0.0001));\n' +
          '    if (fragCoord.x < 1.5 || fragCoord.y < 1.5 ||\n' +
          '        fragCoord.x > iResolution.x - 1.5 || fragCoord.y > iResolution.y - 1.5) C.xy = vec2(0.0);\n' +
          '\n' +
          '    color = C;\n' +
          '}\n',
        nota: 'Un mando cambiado se nota en el humo que sale a partir de ese momento: el que ya estaba en el aire conserva su historia. Si tu navegador no guarda decimales en las texturas, el humo apenas se mueve: una velocidad negativa no cabe en un byte, que solo guarda valores entre 0 y 1.'
      });
    }
  });

  p.comprueba('En un píxel, la velocidad horizontal del vecino de la derecha es mayor que la del vecino de la izquierda, y en vertical no cambia nada. ¿Qué le pasa a la densidad en ese píxel?', [
    { t: 'Baja: el fluido se escapa hacia los lados, la divergencia es positiva', ok: true, por: 'Sale más por la derecha de lo que entra por la izquierda: $\\frac{\\partial v_x}{\\partial x} > 0$. La continuidad resta $\\rho\\,\\nabla\\cdot\\vec v$, y la densidad baja. Luego la presión traerá fluido hacia allí.' },
    { t: 'Sube: el fluido se acumula', ok: false, por: 'Se acumularía si la velocidad de la izquierda fuese mayor que la de la derecha: entonces llegaría más de lo que sale.' },
    { t: 'No cambia, porque en vertical no pasa nada', ok: false, por: 'Basta con que cambie una de las dos componentes: la divergencia suma las dos derivadas, y aquí la horizontal es positiva.' }
  ]);

  p.util('Cada nube de humo, explosión, ola y cabellera que se mueve en una película de animación sale ' +
    'de un simulador de fluidos, y los de tiempo real de los videojuegos usan casi siempre la advección ' +
    'hacia atrás de este tema. Pero la aplicación más seria no es visual: los modelos de predicción ' +
    'meteorológica transportan cada día temperatura, humedad y viento sobre una rejilla del planeta con ' +
    'esquemas semilagrangianos, porque permiten pasos de tiempo largos sin que el cálculo se ' +
    'descontrole. Y el ruido rizado se usa para mover partículas de humo y de nieve sin simular nada.');

  p.hist('Claude-Louis Navier escribió en 1822 las ecuaciones del movimiento de un fluido viscoso, y George ' +
    'Stokes las rehízo con más cuidado en 1845. En el año 2000 el Instituto Clay las incluyó entre sus ' +
    'siete Problemas del Milenio: todavía no se sabe si, en tres dimensiones, sus soluciones pueden ' +
    'estallar en un tiempo finito, y quien lo resuelva cobrará un millón de dólares. Mientras tanto, Jos ' +
    'Stam presentó en 1999 sus fluidos estables para el cine, Robert Bridson publicó el ruido rizado en ' +
    '2007, y Martin Guay, Fabrice Colin y Richard Egli describieron en 2011 el fluido de una sola pasada ' +
    'que usa este tema.');

  p.trampas([
    { e: 'Transportar sumando la velocidad', por: 'Leer en <code>fragCoord + v</code> mueve la tinta <em>contra</em> la corriente. Lo que llega a un punto viene de atrás: <code>fragCoord - v * dt</code>.' },
    { e: 'Usar el gradiente del ruido como corriente', por: 'El gradiente tiene divergencia: la tinta se amontona en unas líneas y se vacía en otras. El campo sin huecos es el gradiente girado, $(\\partial_y\\psi,\\ -\\partial_x\\psi)$.' },
    { e: 'Guardar la tinta en el alfa y leer solo <code>.rgb</code> en la vista', por: 'El estado tiene cuatro canales y la función <code>vista</code> recibe los cuatro: si la tinta está en <code>s.w</code>, hay que usar <code>s.w</code>.' },
    { e: 'Esperar que un paso grande sea inestable, como el del calor', por: 'La advección hacia atrás no se descontrola con ningún paso: solo interpola. Lo que sí puede estallar es la presión o una fuerza sin tope; por eso el chorro impone una velocidad en vez de sumarla.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Mirar hacia atrás',
    level: 'basico',
    gen: function (r) {
      var x = r.int(20, 200), y = r.int(20, 150);
      var vx = r.int(-12, 12) / 2, vy = r.int(-12, 12) / 2, dt = r.pick([0.5, 1, 2]);
      if (!vx && !vy) return null;
      return { x: x, y: y, vx: vx, vy: vy, dt: dt, ax: x - vx * dt, ay: y - vy * dt, bx: x + vx * dt, by: y + vy * dt };
    },
    ask: function (d) {
      return 'En un visor con memoria, la tinta se mueve con velocidad $\\vec v = (' + U.fmt(d.vx, 1) + ',\\ ' + U.fmt(d.vy, 1) +
        ')$ píxeles por unidad de tiempo, y cada paso dura $\\Delta t = ' + U.fmt(d.dt, 1) + '$. ¿En qué punto lee el píxel $(' + d.x + ', ' + d.y + ')$ para saber qué tinta le llega?';
    },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }],
    sol: function (d) { return { x: d.ax, y: d.ay }; },
    errores: [{
      si: function (v, d) { return Math.abs(v.x - d.bx) < 1e-6 && Math.abs(v.y - d.by) < 1e-6; },
      msg: 'Ese es el punto hacia el que <em>va</em> la tinta. Lo que llega aquí viene de atrás: se resta $\\vec v\\,\\Delta t$.'
    }],
    hint: function () { return ['$\\vec x - \\vec v\\,\\Delta t$, componente a componente.']; },
    steps: function (d) {
      return ['$\\vec v\\,\\Delta t = (' + U.fmt(d.vx * d.dt, 1) + ',\\ ' + U.fmt(d.vy * d.dt, 1) + ')$.',
        '$(' + d.x + ', ' + d.y + ') - (' + U.fmt(d.vx * d.dt, 1) + ',\\ ' + U.fmt(d.vy * d.dt, 1) + ') = (' + U.fmt(d.ax, 1) + ',\\ ' + U.fmt(d.ay, 1) + ')$.',
        (d.ax % 1 || d.ay % 1) ? 'No cae en un píxel entero: <code>texture2D</code> interpolará entre los vecinos, y ahí está la difusión numérica.' : 'Cae justo en un píxel, y la tinta se copia tal cual.'];
    },
    answer: function (d) { return '(' + U.fmt(d.ax, 1) + ', ' + U.fmt(d.ay, 1) + ')'; }
  });

  p.exercise({
    title: 'La divergencia en un píxel',
    level: 'medio',
    gen: function (r) {
      var rx = r.int(-20, 20) / 10, lx = r.int(-20, 20) / 10, ty = r.int(-20, 20) / 10, dy;
      if (r.bool(0.3)) dy = U.round(ty + (rx - lx), 1);        // a veces, sin divergencia
      else dy = r.int(-20, 20) / 10;
      if (Math.abs(dy) > 2) return null;
      var div = U.round((rx - lx) / 2 + (ty - dy) / 2, 6);
      if (div !== 0 && Math.abs(div) < 0.1) return null;
      return { rx: rx, lx: lx, ty: ty, dy: dy, div: div, doble: U.round(rx - lx + ty - dy, 6),
        tipo: div > 0 ? 'escapa' : (div < 0 ? 'acumula' : 'nada') };
    },
    ask: function (d) {
      return 'Alrededor de un píxel, la componente horizontal de la velocidad vale $' + U.fmt(d.rx, 1) + '$ en el vecino de la derecha y $' + U.fmt(d.lx, 1) +
        '$ en el de la izquierda; la vertical, $' + U.fmt(d.ty, 1) + '$ en el de arriba y $' + U.fmt(d.dy, 1) + '$ en el de abajo. ' +
        'Con diferencias centradas, <code>0.5 * (R.x - L.x) + 0.5 * (T.y - D.y)</code>, ¿cuánto vale la divergencia? ¿Qué le pasa al fluido ahí?';
    },
    fields: [
      { name: 'div', label: 'divergencia', w: 'tiny' },
      { name: 't', label: 'el fluido', opts: [{ t: 'se escapa: la densidad baja', v: 'escapa' }, { t: 'se acumula: la densidad sube', v: 'acumula' }, { t: 'ni se escapa ni se acumula', v: 'nada' }] }
    ],
    sol: function (d) { return { div: d.div, t: d.tipo }; },
    errores: [{
      si: function (v, d) { return d.doble !== d.div && Math.abs(v.div - d.doble) < 1e-6; },
      msg: 'Falta el 0,5: los vecinos están a dos píxeles el uno del otro, así que cada diferencia se divide entre 2.'
    }],
    hint: function () { return ['Resta derecha menos izquierda y arriba menos abajo, y multiplica cada resta por 0,5.', 'Positiva: sale más de lo que entra.']; },
    steps: function (d) {
      return ['$0{,}5\\,(' + U.fmt(d.rx, 1) + ' - (' + U.fmt(d.lx, 1) + ')) + 0{,}5\\,(' + U.fmt(d.ty, 1) + ' - (' + U.fmt(d.dy, 1) + ')) = ' + U.fmt(d.div, 2) + '$.',
        d.tipo === 'escapa' ? 'Positiva: sale más fluido del que entra, y la densidad baja.'
          : (d.tipo === 'acumula' ? 'Negativa: entra más del que sale, y la densidad sube; la presión empujará hacia fuera.' : 'Cero: todo lo que entra vuelve a salir. Es lo que pide un fluido incompresible.')];
    },
    answer: function (d) { return U.fmt(d.div, 2); }
  });

  p.exercise({
    title: 'La velocidad a partir de ψ',
    level: 'medio',
    gen: function (r) {
      var R = r.int(-9, 9), L = r.int(-9, 9), T = r.int(-9, 9), D = r.int(-9, 9);
      if (R === L && T === D) return null;
      var vx = (T - D) / 2, vy = -(R - L) / 2;
      return { R: R, L: L, T: T, D: D, vx: vx, vy: vy, gx: (R - L) / 2, gy: (T - D) / 2 };
    },
    ask: function (d) {
      return 'Una función de corriente vale $\\psi = ' + d.R + '$ en el píxel de la derecha, $' + d.L + '$ en el de la izquierda, $' + d.T +
        '$ en el de arriba y $' + d.D + '$ en el de abajo, a un píxel de distancia cada uno. Con diferencias centradas, ¿qué velocidad ' +
        '$\\vec v = (\\partial_y\\psi,\\ -\\partial_x\\psi)$ tiene el píxel del centro?';
    },
    fields: [{ name: 'vx', label: '$v_x$', w: 'tiny' }, { name: 'vy', label: '$v_y$', w: 'tiny' }],
    sol: function (d) { return { vx: d.vx, vy: d.vy }; },
    errores: [{
      si: function (v, d) { return (d.gx !== d.vx || d.gy !== d.vy) && Math.abs(v.vx - d.gx) < 1e-6 && Math.abs(v.vy - d.gy) < 1e-6; },
      msg: 'Ese es el gradiente de $\\psi$, que sí tiene divergencia. La corriente es el gradiente girado: $v_x$ sale de arriba y abajo, y $v_y$ de derecha e izquierda, con un menos.'
    }],
    hint: function () { return ['$\\partial_y\\psi \\approx \\frac{\\psi_{arriba} - \\psi_{abajo}}{2}$ y $\\partial_x\\psi \\approx \\frac{\\psi_{derecha} - \\psi_{izquierda}}{2}$.', 'No olvides el signo menos de la segunda componente.']; },
    steps: function (d) {
      return ['$v_x = \\partial_y\\psi \\approx \\frac{' + d.T + ' - (' + d.D + ')}{2} = ' + U.fmt(d.vx, 1) + '$.',
        '$v_y = -\\partial_x\\psi \\approx -\\frac{' + d.R + ' - (' + d.L + ')}{2} = ' + U.fmt(d.vy, 1) + '$.',
        'Este vector es tangente a la curva de nivel de $\\psi$ que pasa por el píxel: el fluido circula a lo largo de ella.'];
    },
    answer: function (d) { return '(' + U.fmt(d.vx, 1) + ', ' + U.fmt(d.vy, 1) + ')'; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'vec3 c = texture2D(iChannel0, (fragCoord - vec2(2.0, 0.0)) / iResolution.xy).rgb;',
          o: ['La imagen avanza hacia la derecha dos píxeles por fotograma', 'La imagen avanza hacia la izquierda', 'La imagen se queda quieta', 'La imagen se difumina sin moverse'],
          por: 'Cada píxel copia lo que había dos píxeles a su izquierda: todo el contenido avanza hacia la derecha, en la dirección de la velocidad $(2, 0)$.' },
        { c: 'vec2 q = fragCoord - 0.5 * iResolution.xy;\nvec2 v = 0.01 * vec2(-q.y, q.x);\nvec3 c = texture2D(iChannel0, (fragCoord - v) / iResolution.xy).rgb;',
          o: ['La imagen gira alrededor del centro en sentido contrario a las agujas del reloj', 'La imagen gira en el sentido de las agujas del reloj', 'La imagen se aleja del centro y se estira', 'La imagen se encoge hacia el centro'],
          por: 'El campo $(-q_y,\\ q_x)$ es un remolino antihorario, y la advección hacia atrás mueve el contenido en la dirección de la velocidad.' },
        { c: 'vec2 q = fragCoord - 0.5 * iResolution.xy;\nvec2 v = 0.01 * q;\nvec3 c = texture2D(iChannel0, (fragCoord - v) / iResolution.xy).rgb;',
          o: ['La imagen se estira desde el centro hacia fuera, y lo de los bordes se sale', 'La imagen gira alrededor del centro', 'La imagen se encoge hacia el centro', 'La imagen no cambia'],
          por: 'Cada píxel lee un poco más cerca del centro: el contenido sale hacia fuera. El campo $\\vec q$ tiene divergencia positiva, es una fuente.' },
        { c: 'vec3 c = texture2D(iChannel0, (fragCoord - vec2(0.0, 1.0)) / iResolution.xy).rgb;\nc *= 0.98;',
          o: ['La imagen sube un píxel por fotograma y a la vez se va apagando', 'La imagen baja y se aclara', 'La imagen sube sin cambiar de brillo', 'La imagen se apaga sin moverse'],
          por: 'La lectura desde abajo hace subir el contenido, y el factor 0,98 le quita un 2 % de brillo en cada fotograma.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'En un visor con memoria que empieza con una foto, ¿qué se ve con el paso de los fotogramas?' +
        '<pre class="shd__mini">' + d.codigo + '\ncolor = vec4(c, 1.0);</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['El contenido se mueve en la dirección de la velocidad que se resta a <code>fragCoord</code>.', '¿El campo tiene divergencia? Si la tiene, la imagen se estira o se amontona.']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe el campo',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'un <strong>remolino</strong> antihorario alrededor del centro, $\\vec v = (-q_y,\\ q_x)$', ref: 'vec2(-q.y, q.x)' },
        { pide: 'una <strong>fuente</strong> en el centro, $\\vec v = \\vec q$, que empuja todo hacia fuera', ref: 'q' },
        { pide: 'la corriente <strong>sin divergencia</strong> de $\\psi = \\operatorname{sen}(3q_x)\\operatorname{sen}(3q_y)$, es decir, $\\vec v = (\\partial_y\\psi,\\ -\\partial_x\\psi)$', ref: 'vec2(3.0 * sin(3.0 * q.x) * cos(3.0 * q.y), -3.0 * cos(3.0 * q.x) * sin(3.0 * q.y))' },
        { pide: 'un <strong>viento</strong> hacia la derecha que ondula, $\\vec v = (0{,}5,\\ 0{,}3\\operatorname{sen}(6q_x))$', ref: 'vec2(0.5, 0.3 * sin(6.0 * q.x))' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Un paso de advección lleva la foto a lo largo de un campo <code>v</code>. Completa el campo para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 q = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\nvec2 v = <strong>???</strong> ;\nvec2 atras = q - 0.3 * v;\nvec2 uv = atras * vec2(iResolution.y / iResolution.x, 1.0) + 0.5;\ncolor = vec4(texture2D(iChannel1, uv).rgb, 1.0);</pre>';
    },
    fields: [{ name: 'v', label: 'el campo', w: 'wide' }],
    sol: function (d) { return { v: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.v || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe el campo.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 q = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '  vec2 v = ' + x + ';\n' +
          '  vec2 atras = q - 0.3 * v;\n' +
          '  vec2 uv = atras * vec2(iResolution.y / iResolution.x, 1.0) + 0.5;\n' +
          '  color = vec4(texture2D(iChannel1, uv).rgb, 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 6 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El campo es un <code>vec2</code> escrito con <code>q</code>, y los números llevan punto decimal.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la foto no se mueve como pide ese campo. Revisa los signos y el orden de las componentes.' };
      }
      return { ok: true };
    },
    hint: function () { return 'Escribe cada componente como una expresión de <code>q.x</code> y <code>q.y</code>. Para la corriente de $\\psi$, deriva: $\\partial_y \\operatorname{sen}(3q_y) = 3\\cos(3q_y)$.'; },
    steps: function (d) { return ['Se pedía ' + d.pide + '.', 'Una respuesta: <code>' + d.ref + '</code>.', 'El corrector compara cómo queda la foto tras el paso de advección, así que cualquier forma equivalente vale.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'La <strong>advección</strong> se programa mirando hacia atrás: lo que habrá en $\\vec x$ es lo que hay ahora en $\\vec x - \\vec v\\,\\Delta t$. Solo interpola, así que no se descontrola, pero difumina.',
    'Un campo con divergencia cero no crea huecos ni amontona. El rotacional de cualquier función, $(\\partial_y\\psi,\\ -\\partial_x\\psi)$, la tiene cero siempre: con un ruido, sale el <strong>ruido rizado</strong>.',
    'En un fluido la velocidad se transporta a sí misma, la presión empuja desde lo denso, la viscosidad es un laplaciano y las fuerzas añaden movimiento.',
    'Un fluido ligeramente compresible cabe en una sola pasada: la densidad sube donde el flujo converge y su gradiente hace de presión.',
    'El estado de un visor con memoria tiene cuatro canales: velocidad, densidad y tinta caben en un solo píxel.'
  ]);
});
