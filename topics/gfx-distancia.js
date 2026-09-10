/* Tema: Distancia: dibujar sin dibujar */
Course.topic('gfx-distancia', function (p) {

  p.text('Este es el tema central del bloque. Si solo te llevas una idea de aquí, que sea esta, ' +
    'porque de ella cuelgan los ocho temas siguientes y buena parte de los gráficos por ordenador ' +
    'de los últimos veinte años.');

  p.note('En vez de preguntar «¿qué píxeles hay que pintar?», se calcula <strong>a qué distancia ' +
    'está cada píxel de la figura</strong>. Con ese número en la mano, dibujar es trivial: pintas de ' +
    'un color los que están cerca y de otro los que están lejos.', 'ok', 'El giro que lo cambia todo');

  p.text('A esa función que devuelve la distancia se la llama <strong>función de distancia con ' +
    'signo</strong> —SDF, por sus siglas en inglés—. Negativa dentro de la figura, cero justo en el ' +
    'borde, positiva fuera. Y aquí está lo bonito: la de un círculo la sabes escribir desde el ' +
    'bloque 3.');

  p.formula('d(\\mathbf{p}) = |\\mathbf{p}| - r', 'distancia con signo a un círculo de radio r',
    'Se dice: <em>«de de pe es igual al módulo de pe, menos erre»</em>.<br><br>Léela despacio, ' +
      'porque es más de lo que parece. $|\\mathbf{p}|$ es lo lejos que estás del centro; restarle el ' +
      'radio te dice lo lejos que estás <strong>del borde</strong>.<br><br>Si estás a 0,7 del centro ' +
      'y el radio es 0,3, sale $0{,}4$: estás cuatro décimas fuera. Si estás a 0,1, sale $-0{,}2$: ' +
      'estás dos décimas dentro. Y si sale exactamente 0, estás en la circunferencia.<br><br>En GLSL ' +
      'es una línea: <code>float d = length(p) - 0.3;</code>');

  p.demo({
    title: 'El campo de distancias, a la vista',
    intro: 'Antes de dibujar el círculo, mira el número con el que se dibuja. Cada píxel muestra su distancia al borde: azul dentro, naranja fuera, y una línea donde vale cero. Ese mapa es lo que hay debajo de todas las figuras del bloque.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-dist-1', alto: 300,
        aria: 'Un mapa de colores donde el tono indica la distancia a una circunferencia: frío dentro, cálido fuera, con anillos concéntricos.',
        mandos: [
          { n: 'radio', label: 'radio', min: 0.05, max: 0.45, step: 0.01, value: 0.28, dec: 2 },
          { n: 'anillos', label: 'ver los anillos', min: 0, max: 1, step: 1, value: 1, dec: 0 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // LA LINEA: distancia con signo al borde del circulo\n' +
          '    float d = length(p) - radio;\n' +
          '\n' +
          '    // dentro azul, fuera naranja\n' +
          '    vec3 c = (d < 0.0) ? vec3(0.15, 0.45, 0.85) : vec3(0.95, 0.6, 0.2);\n' +
          '\n' +
          '    // anillos cada 0.05 para ver el campo\n' +
          '    c *= 1.0 - anillos * 0.35 * smoothstep(0.9, 1.0, cos(d * 125.0));\n' +
          '\n' +
          '    // la linea del borde, donde d vale cero\n' +
          '    c = mix(vec3(1.0), c, smoothstep(0.0, 0.006, abs(d)));\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Los anillos son curvas de nivel: todos los píxeles de un anillo están a la misma ' +
          'distancia del borde. Es el mismo dibujo que un mapa topográfico, y por la misma razón.'
      });
    }
  });

  p.text('Fíjate en que <strong>el campo existe en toda la pantalla</strong>, no solo donde está la ' +
    'figura. Cada píxel del universo sabe a qué distancia está del círculo. Esa información de más ' +
    '—que a primera vista parece un desperdicio— es la que permite hacer bordes suaves, sombras, ' +
    'contornos, uniones de figuras y, en el tema 10, geometría tridimensional entera.');

  p.section('De la distancia al color: step');

  p.text('Para convertir la distancia en un dibujo hace falta una función que corte: que valga una ' +
    'cosa antes de cierto valor y otra después. Es <code>step</code>:');

  p.formula('\\operatorname{step}(borde,\\ x) = \\begin{cases} 0 & \\text{si } x < borde \\\\ 1 & \\text{si } x \\ge borde \\end{cases}',
    'la función escalón',
    'Se dice: <em>«step de borde, equis»</em>, y se lee como una función definida a trozos de las ' +
      'del bloque 5.<br><br>Cuidado con el orden de los argumentos, que es el que menos se espera: ' +
      '<strong>primero el umbral y después el valor</strong>. <code>step(0.3, d)</code> significa ' +
      '«¿es <code>d</code> mayor o igual que 0,3?».<br><br>Devuelve un número, 0 o 1, no un ' +
      'booleano. Y eso es a propósito: al ser un número se puede multiplicar, sumar y mezclar, que es ' +
      'como se decide en un shader.');

  p.text('Con <code>step</code> el círculo sale en una línea: <code>float dentro = 1.0 - step(0.0, ' +
    'd);</code> vale 1 donde la distancia es negativa —dentro— y 0 donde es positiva.');

  p.section('El problema del borde, y por qué importa tanto');

  p.text('Ese círculo tiene un defecto que se ve enseguida si lo miras de cerca: el borde es una ' +
    'escalera. Cada píxel está o dentro o fuera, sin término medio, y el resultado son dientes de ' +
    'sierra. Es el mismo problema que tiene cualquier dibujo hecho con píxeles cuadrados.');

  p.text('La solución es no decidir de golpe, sino <strong>pasar suavemente de un color al otro en ' +
    'el ancho de un píxel</strong>. Para eso está <code>smoothstep</code>:');

  p.formula('\\operatorname{smoothstep}(a,\\ b,\\ x) = t^2(3-2t), \\quad t = \\operatorname{clamp}\\!\\left(\\frac{x-a}{b-a},\\,0,\\,1\\right)',
    'el escalón suave',
    'Se dice: <em>«smoothstep de a, be, equis»</em>.<br><br>Vale 0 hasta $a$, vale 1 a partir de $b$ ' +
      'y en medio sube suavemente. Lo importante no es la fórmula concreta, sino la propiedad: ' +
      '<strong>llega a los extremos con pendiente cero</strong>, así que la transición no tiene ' +
      'esquinas ni por arriba ni por abajo.<br><br>Ese polinomio $3t^2-2t^3$ es el más simple que ' +
      'cumple las cuatro condiciones que se le piden: valer 0 en 0, valer 1 en 1, y tener derivada ' +
      'nula en los dos sitios. Cuatro condiciones, cuatro coeficientes, grado 3. Es exactamente el ' +
      'razonamiento del tema de Taylor, resuelto al revés.');

  p.demo({
    title: 'Duro contra suave',
    intro: 'El mismo círculo con las dos funciones. Acerca el borde con el deslizador de anchura y mira los dientes de sierra aparecer y desaparecer. En movimiento la diferencia es todavía más brutal que parada.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-dist-2', alto: 280,
        aria: 'Dos mitades: a la izquierda un círculo con el borde escalonado, a la derecha el mismo con el borde suave.',
        mandos: [{ n: 'suave', label: 'anchura del borde', min: 0.0, max: 0.06, step: 0.002, value: 0.0, dec: 3 }],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    p.x = abs(p.x) - 0.22;          // dos copias, izquierda y derecha\n' +
          '\n' +
          '    float d = length(p) - 0.16;\n' +
          '\n' +
          '    float v;\n' +
          '    if (fragCoord.x < iResolution.x * 0.5)\n' +
          '        v = 1.0 - step(0.0, d);                 // duro\n' +
          '    else\n' +
          '        v = 1.0 - smoothstep(0.0, suave, d);    // suave\n' +
          '\n' +
          '    color = vec4(vec3(v), 1.0);\n' +
          '}\n',
        nota: 'Sube la anchura y compara los dos bordes. Con anchura 0 son idénticos, porque ' +
          '<code>smoothstep</code> con los dos extremos iguales se comporta como <code>step</code>.'
      });
    }
  });

  p.util('Este truco es la razón de que las letras se lean bien en cualquier pantalla. Las fuentes ' +
    'de los videojuegos y de muchas aplicaciones no se guardan como imágenes, sino como campos de ' +
    'distancia: una textura pequeña donde cada píxel dice a qué distancia está del contorno de la ' +
    'letra. Al dibujarla, un <code>smoothstep</code> reconstruye el borde perfecto <strong>a ' +
    'cualquier tamaño</strong>, sin pixelarse. La técnica la publicó Chris Green, de Valve, en 2007, ' +
    'y hoy la usa medio mundo: es por lo que el rótulo de un juego se puede ampliar diez veces y ' +
    'sigue teniendo el filo limpio.');

  p.section('Otras figuras, la misma idea');

  p.text('Cambiando la fórmula de la distancia cambias la figura, y el resto del código no se entera. ' +
    'Estas son las tres que hay que saberse:');

  p.table(['Figura', 'Distancia con signo', 'De dónde sale'], [
    ['Círculo de radio $r$', '<code>length(p) - r</code>', 'la definición de circunferencia'],
    ['Franja horizontal', '<code>abs(p.y) - h</code>', 'valor absoluto: distancia a una recta'],
    ['Cuadrado de lado $2a$', '<code>max(abs(p.x), abs(p.y)) - a</code>', 'la distancia del máximo, una de las normas del álgebra lineal'],
    ['Segmento, rectángulo…', 'combinaciones de las anteriores', '—']
  ]);

  p.text('El cuadrado es especialmente instructivo. <code>max(|x|, |y|)</code> es una manera ' +
    'distinta de medir distancias —la <em>distancia del máximo</em>— y su «circunferencia» es un ' +
    'cuadrado. Es la misma idea que viste en topología: cambiando lo que significa «distancia», ' +
    'cambia la forma de las bolas.');

  p.hist('La geometría por distancias se usaba en simulación desde los años ochenta, pero como ' +
    'herramienta de artistas la popularizó la <strong>demoscene</strong>, esa comunidad que compite ' +
    'por meter animaciones enteras en programas de 4 o 64 kilobytes. Con ese tamaño no caben ni ' +
    'modelos ni texturas: todo tiene que caber en fórmulas. De ahí salieron técnicas que luego ' +
    'adoptó la industria. La producción <em>Elevated</em> (2009), de Íñigo Quílez y Reinder ' +
    'Nijhoff, genera un paisaje montañoso con nieve, agua y niebla en 4096 bytes —menos de lo que ' +
    'ocupa este párrafo repetido veinte veces—. Quílez cofundó después Shadertoy y publicó las ' +
    'fórmulas de distancia que usa hoy todo el mundo.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Dentro o fuera?',
    level: 'basico',
    gen: function (r) {
      var x = r.real(-0.45, 0.45, 3), y = r.real(-0.45, 0.45, 3);
      var rad = r.pick([0.15, 0.2, 0.25, 0.3, 0.35]);
      var dist = Math.sqrt(x * x + y * y);
      if (Math.abs(dist - rad) < 0.02) return null;
      return { x: x, y: y, r: rad, d: dist - rad };
    },
    ask: function (d) {
      return 'El shader calcula <code>float d = length(p) - ' + U.fmt(d.r, 2) + ';</code><br><br>' +
        'En el píxel <code>p = (' + U.fmt(d.x, 3) + ', ' + U.fmt(d.y, 3) + ')</code>, ¿cuánto vale ' +
        '<code>d</code> (cuatro decimales) y el píxel está dentro o fuera?';
    },
    fields: [
      { name: 'd', label: 'd', w: 'tiny' },
      { name: 'q', label: 'dentro / fuera', w: 'tiny', ph: 'dentro / fuera' }
    ],
    sol: function (d) { return { d: U.round(d.d, 8), q: d.d < 0 ? 'dentro' : 'fuera' }; },
    check: function (v, d) {
      var okD = Ex.same(v.d, d.d, 3e-4);
      var q = U.eligeOpcion(v.raw.q, { dentro: /dentro|interior|negativ/, fuera: /fuera|exterior|positiv/ });
      if (!q) {
        return { ok: false, msg: 'En la segunda casilla escribe <strong>dentro</strong> o ' +
          '<strong>fuera</strong>.', fields: { d: okD } };
      }
      var okQ = (q === 'dentro') === (d.d < 0);
      return { ok: okD && okQ, fields: { d: okD, q: okQ } };
    },
    hint: function () {
      return 'Primero la distancia al centro con Pitágoras, y después le restas el radio. El signo ' +
        'del resultado es la respuesta: negativo es dentro.';
    },
    steps: function (d) {
      return ['$|p| = \\sqrt{' + U.fmt(d.x, 3) + '^2 + ' + U.fmt(d.y, 3) + '^2} = ' +
        U.fmt(Math.sqrt(d.x * d.x + d.y * d.y), 4) + '$',
        '$d = ' + U.fmt(Math.sqrt(d.x * d.x + d.y * d.y), 4) + ' - ' + U.fmt(d.r, 2) + ' = ' +
        U.fmt(d.d, 4) + '$',
        d.d < 0 ? 'Negativo, así que el píxel está <strong>dentro</strong>.'
                : 'Positivo, así que el píxel está <strong>fuera</strong>.'];
    },
    answer: function (d) { return 'd = ' + U.fmt(d.d, 4) + ' · ' + (d.d < 0 ? 'dentro' : 'fuera'); }
  });

  p.exercise({
    title: 'Escribe la distancia',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { pide: 'un <strong>círculo</strong> de radio 0,3 centrado en el origen', ref: 'length(p) - 0.3' },
        { pide: 'un <strong>círculo</strong> de radio 0,15 centrado en el origen', ref: 'length(p) - 0.15' },
        { pide: 'una <strong>franja horizontal</strong> de medio grosor 0,2', ref: 'abs(p.y) - 0.2' },
        { pide: 'una <strong>franja vertical</strong> de medio grosor 0,1', ref: 'abs(p.x) - 0.1' },
        { pide: 'un <strong>cuadrado</strong> de medio lado 0,25', ref: 'max(abs(p.x), abs(p.y)) - 0.25' },
        { pide: 'un <strong>círculo</strong> de radio 0,2 centrado en el punto (0,2, 0)', ref: 'length(p - vec2(0.2, 0.0)) - 0.2' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe la distancia con signo de ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\nfloat d = <strong>???</strong> ;\ncolor = vec4(vec3(1.0 - smoothstep(0.0, 0.01, d)), 1.0);</pre>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige comparando el dibujo: ' +
        'vale cualquier forma equivalente de escribirlo.</span>';
    },
    fields: [{ name: 'd', label: 'la distancia', w: 'wide' }],
    sol: function (d) { return { d: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.d || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión de la distancia.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  float d = ' + x + ';\n' +
          '  color = vec4(vec3(1.0 - smoothstep(0.0, 0.01, d)), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 40, tol: 5 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Revisa paréntesis y decimales: <code>0.3</code>, no ' +
          '<code>.3</code> ni <code>0,3</code>.' };
      }
      if (!r.ok) return { ok: false, msg: 'Compila, pero no sale la figura pedida. Recuerda: la ' +
        'distancia vale <strong>cero justo en el borde</strong> y negativa dentro.' };
      return { ok: true };
    },
    hint: function () {
      return 'Círculo: <code>length(p) - radio</code>. Franja: <code>abs(</code>la componente que ' +
        'cruzas<code>) - grosor</code>. Cuadrado: <code>max</code> de los dos valores absolutos. Y ' +
        'para mover una figura, se le resta el centro a <code>p</code>.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'La regla general: la expresión tiene que valer <strong>0 en el borde</strong>, negativo ' +
        'dentro y positivo fuera. Si lo cumple, dibuja.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.exercise({
    title: 'step y smoothstep',
    level: 'medio',
    gen: function (r) {
      var a = r.real(0, 0.4, 2), b = a + r.real(0.1, 0.4, 2);
      var x = r.real(-0.1, 0.9, 3);
      var t = U.clamp((x - a) / (b - a), 0, 1);
      return { a: a, b: b, x: x, st: (x >= b ? 1 : 0), ss: t * t * (3 - 2 * t) };
    },
    ask: function (d) {
      return 'Calcula, con cuatro decimales:<br><code>step(' + U.fmt(d.b, 2) + ', ' + U.fmt(d.x, 3) +
        ')</code> y <code>smoothstep(' + U.fmt(d.a, 2) + ', ' + U.fmt(d.b, 2) + ', ' +
        U.fmt(d.x, 3) + ')</code>';
    },
    fields: [
      { name: 's', label: 'step', w: 'tiny' },
      { name: 'm', label: 'smoothstep', w: 'tiny' }
    ],
    sol: function (d) { return { s: d.st, m: U.round(d.ss, 8) }; },
    tol: 3e-5,
    hint: function () {
      return '<code>step(borde, x)</code> vale 1 si $x \\ge$ borde y 0 si no. Para ' +
        '<code>smoothstep</code>, primero $t = \\frac{x-a}{b-a}$ recortado a $[0,1]$, y después ' +
        '$t^2(3-2t)$.';
    },
    steps: function (d) {
      var t = U.clamp((d.x - d.a) / (d.b - d.a), 0, 1);
      return ['$' + U.fmt(d.x, 3) + (d.x >= d.b ? ' \\ge ' : ' < ') + U.fmt(d.b, 2) + '$, así que ' +
        '$\\operatorname{step} = ' + d.st + '$.',
        '$t = \\dfrac{' + U.fmt(d.x, 3) + ' - ' + U.fmt(d.a, 2) + '}{' + U.fmt(d.b, 2) + ' - ' +
        U.fmt(d.a, 2) + '} = ' + U.fmt(t, 4) + '$ (recortado a $[0,1]$)',
        '$\\operatorname{smoothstep} = t^2(3-2t) = ' + U.fmt(d.ss, 4) + '$',
        'Fíjate en que en los extremos las dos coinciden; la diferencia está en medio, y esa ' +
        'diferencia es todo el antialiasing.'];
    },
    answer: function (d) { return 'step = ' + d.st + ', smoothstep = ' + U.fmt(d.ss, 4); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float d = length(p) - 0.3;\nfloat v = step(d, 0.0);',
          o: ['Un círculo blanco de radio 0,3 con el borde duro, en escalones de píxel', 'Un círculo blanco de radio 0,3 con el borde suave', 'Un anillo de radio 0,3', 'Todo blanco salvo un círculo negro'],
          por: '<code>step(d, 0.0)</code> vale 1 donde $d \\le 0$, dentro del círculo, y cambia de golpe en el borde: sin transición, se ven los píxeles.' },
        { c: 'float d = length(p) - 0.3;\nfloat v = 1.0 - smoothstep(0.0, 0.01, d);',
          o: ['Un círculo blanco de radio 0,3 con el borde suavizado', 'Un círculo con el borde duro', 'Todo blanco salvo un círculo negro', 'Un degradado radial muy amplio'],
          por: '<code>smoothstep</code> hace la transición a lo largo de 0,01 unidades, apenas unos píxeles: el borde queda suave pero nítido.' },
        { c: 'float d = length(p) - 0.3;\nfloat v = abs(d);',
          o: ['Negro justo sobre la circunferencia y más claro al alejarse de ella, por dentro y por fuera', 'Un círculo blanco', 'Blanco sobre la circunferencia y negro lejos de ella', 'Negro dentro del círculo y blanco fuera'],
          por: '$|d|$ es la distancia sin signo a la circunferencia: vale 0 sobre ella y crece al alejarse en cualquier sentido.' },
        { c: 'vec2 q = abs(p) - vec2(0.3, 0.2);\nfloat d = max(q.x, q.y);\nfloat v = step(d, 0.0);',
          o: ['Un rectángulo blanco centrado, más ancho que alto', 'Un rombo', 'Un círculo', 'Un rectángulo más alto que ancho'],
          por: 'Es negativo solo si $|p_x| < 0{,}3$ y $|p_y| < 0{,}2$ a la vez: un rectángulo de $0{,}6$ por $0{,}4$.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'Con <code>p</code> centrada y el color final <code>vec3(v)</code>, ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['La distancia con signo es negativa dentro, cero en el borde y positiva fuera.', '¿La transición es brusca o gradual?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.keys([
    'No se pinta la figura: se calcula <strong>a qué distancia está cada píxel de ella</strong>. Ese campo existe en toda la pantalla.',
    'La distancia con signo es negativa dentro, cero en el borde y positiva fuera. Círculo: <code>length(p) - r</code>.',
    '<code>step(borde, x)</code> corta de golpe y produce dientes de sierra; <code>smoothstep(a, b, x)</code> transiciona suavemente y los quita.',
    'El polinomio de <code>smoothstep</code> es $3t^2-2t^3$: el de grado más bajo que vale 0 y 1 en los extremos <strong>con derivada nula</strong> en los dos.',
    'Cambiando la fórmula de la distancia cambia la figura y el resto del código no se entera. Ahí está la potencia.',
    'Las fuentes de los videojuegos se guardan así: un campo de distancias se puede ampliar sin pixelarse.'
  ]);
});
