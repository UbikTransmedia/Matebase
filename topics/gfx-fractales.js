/* Tema: Fractales: iterar en el plano complejo */
Course.topic('gfx-fractales', function (p) {

  p.text('Este tema es la demostración más limpia que conozco de la idea que atraviesa el bloque ' +
    'entero: <strong>una regla ridículamente simple puede producir una complejidad sin fondo</strong>. ' +
    'La regla que vas a usar es <em>eleva al cuadrado y suma</em>. No hay más. Y lo que sale de ahí ' +
    'lleva cuarenta años sin agotarse.');

  p.section('La regla');

  p.text('Coge un [[al-complejos|número complejo]] $c$ y repite esto una y otra vez, empezando en cero:');

  p.formula('z_0 = 0, \\qquad z_{n+1} = z_n^2 + c', 'la iteración',
    'Se lee: <em>«zeta sub ene más uno es igual a zeta sub ene al cuadrado, más ce»</em>.<br><br>' +
      'Es una [[fn-sucesiones|sucesión]] definida por recurrencia: cada término sale del anterior. ' +
      'La única diferencia con las del bloque 6 es que los términos son puntos del plano, no números ' +
      'de la recta.');

  p.text('Solo pueden pasar dos cosas. O la sucesión <strong>se dispara</strong> hacia el infinito, o ' +
    '<strong>se queda dando vueltas</strong> para siempre en una región acotada. El ' +
    '<strong>conjunto de Mandelbrot</strong> es, sencillamente, el conjunto de los $c$ para los que ' +
    'no se dispara.');

  p.text('Y aquí está lo que lo hace dibujable: un shader tiene un $c$ distinto por píxel —su propia ' +
    'coordenada— y puede iterar por su cuenta sin saber nada de los demás. Es el trabajo perfecto ' +
    'para esta máquina.');

  p.note('Hay un criterio de parada exacto y muy fácil de comprobar: <strong>si en algún momento ' +
    '$|z| > 2$, la sucesión se dispara seguro</strong> y no hace falta seguir. Se demuestra en dos ' +
    'líneas, y es lo que convierte un problema sobre el infinito en un bucle que termina.', null,
    'El radio de escape');

  p.section('Multiplicar complejos en un shader');

  p.text('GLSL no conoce los números complejos, pero un <code>vec2</code> es exactamente un par de ' +
    'números, y la regla de multiplicar del bloque 3 se escribe en una línea:');

  p.formula('(a + bi)(c + di) = (ac - bd) + (ad + bc)\\,i', 'el producto complejo');

  p.text('Elevar al cuadrado es aún más corto: $z^2 = (x^2 - y^2) + 2xy\\,i$. Dos multiplicaciones y ' +
    'una resta, y con eso ya tienes todo el fractal.');

  p.demo({
    title: 'Mandelbrot',
    intro: 'Cada píxel es un valor de c, y su color dice cuántas vueltas aguantó antes de dispararse. Sube las iteraciones y mira crecer el detalle del borde: nunca se acaba. Con el zoom alto hará falta subirlas mucho.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-fra-1', alto: 360,
        aria: 'El conjunto de Mandelbrot, con zoom y número de iteraciones ajustables.',
        mandos: [
          { n: 'iter', label: 'iteraciones', min: 8, max: 300, step: 1, value: 90, dec: 0 },
          { n: 'zoom', label: 'zoom', min: 0.4, max: 60, step: 0.1, value: 1.4, dec: 1 },
          { n: 'cx', label: 'centro x', min: -2, max: 0.6, step: 0.005, value: -0.6, dec: 3 },
          { n: 'cy', label: 'centro y', min: -1.2, max: 1.2, step: 0.005, value: 0, dec: 3 },
          { n: 'suave', label: 'coloreado suave', min: 0, max: 1, step: 1, value: 1, dec: 0 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    vec2 c = vec2(cx, cy) + uv * 2.5 / zoom;   // cada pixel, un valor de c\n' +
          '\n' +
          '    vec2 z = vec2(0.0);\n' +
          '    float n = 0.0;\n' +
          '    bool escapa = false;\n' +
          '\n' +
          '    for (int i = 0; i < 300; i++) {\n' +
          '        if (float(i) >= iter) break;\n' +
          '\n' +
          '        // z = z*z + c, con vec2 haciendo de complejo\n' +
          '        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;\n' +
          '        n += 1.0;\n' +
          '\n' +
          '        if (dot(z, z) > 256.0) { escapa = true; break; }\n' +
          '    }\n' +
          '\n' +
          '    vec3 c1 = vec3(0.02, 0.02, 0.06);      // dentro: negro\n' +
          '    if (escapa) {\n' +
          '        // el truco del coloreado continuo\n' +
          '        float m = n - log2(log2(dot(z, z))) + 4.0;\n' +
          '        float v = mix(n, m, suave) * 0.08;\n' +
          '        c1 = 0.5 + 0.5 * cos(6.2831 * (v + vec3(0.0, 0.15, 0.3)) + vec3(3.0, 3.5, 4.0));\n' +
          '    }\n' +
          '\n' +
          '    color = vec4(c1, 1.0);\n' +
          '}\n',
        nota: 'Apaga el coloreado suave y verás <strong>bandas</strong>: los píxeles que escapan en ' +
          'la vuelta 30 y los que escapan en la 31 salen de colores distintos, sin transición. La ' +
          'corrección logarítmica interpola entre ambas y las funde.'
      });
    }
  });

  p.section('Por qué ese logaritmo tan raro');

  p.text('El número de vueltas es un <strong>entero</strong>, y por eso el coloreado sin corregir ' +
    'sale a bandas. Para suavizarlo hay que preguntarse: <em>¿en qué punto de la vuelta se salió?</em> ' +
    'Como cada iteración eleva al cuadrado, el módulo crece doblando su logaritmo cada vez, y de ahí ' +
    'sale la corrección:');

  p.formula('\\mu = n - \\log_2\\bigl(\\log_2 |z_n|\\bigr)', 'iteración continua');

  p.text('Con eso, dos píxeles vecinos que escapan en vueltas distintas reciben valores casi iguales, ' +
    'y la banda desaparece. Es un ejemplo bonito de algo del bloque 6 —el crecimiento ' +
    '[[fn-exp-log|exponencial y su logaritmo]]— resolviendo un problema puramente visual.');

  p.section('Julia: el mismo motor, cambiando quién es quién');

  p.text('En Mandelbrot, $c$ es el píxel y $z$ empieza en cero. Dale la vuelta: que $z$ empiece en el ' +
    'píxel y que $c$ sea un número fijo, el mismo para toda la pantalla. Sale un ' +
    '<strong>conjunto de Julia</strong>, y hay uno distinto por cada valor de $c$.');

  p.text('La relación entre ambos es preciosa y perfectamente concreta: <strong>si $c$ está dentro ' +
    'del conjunto de Mandelbrot, su Julia es de una pieza; si está fuera, se desmigaja en polvo</strong>. ' +
    'Dicho de otro modo, el Mandelbrot es un catálogo de todos los Julia posibles, un mapa donde ' +
    'cada punto vale por una figura entera.');

  p.demo({
    title: 'Julia, con c en tus manos',
    intro: 'Mueve c por el plano y mira cómo se transforma la figura. Acércalo al borde del Mandelbrot (por ejemplo, a −0,74 + 0,15 i) y aparecen las formas más retorcidas; aléjalo y todo se deshace en polvo.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-fra-2', alto: 360,
        aria: 'Un conjunto de Julia cuyo parámetro c se puede mover por el plano complejo.',
        mandos: [
          { n: 'jx', label: 'c real', min: -1, max: 0.5, step: 0.005, value: -0.74, dec: 3 },
          { n: 'jy', label: 'c imaginario', min: -0.8, max: 0.8, step: 0.005, value: 0.15, dec: 3 },
          { n: 'iter', label: 'iteraciones', min: 8, max: 250, step: 1, value: 110, dec: 0 },
          { n: 'animar', label: 'animar c', min: 0, max: 1, step: 1, value: 0, dec: 0 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    vec2 z = uv * 2.6;                 // AHORA el pixel es z\n' +
          '    vec2 c = vec2(jx, jy);             // y c es el mismo para todos\n' +
          '\n' +
          '    // si se anima, c recorre una circunferencia\n' +
          '    float a = iTime * 0.25;\n' +
          '    c = mix(c, 0.7885 * vec2(cos(a), sin(a)), animar);\n' +
          '\n' +
          '    float n = 0.0;\n' +
          '    bool escapa = false;\n' +
          '\n' +
          '    for (int i = 0; i < 250; i++) {\n' +
          '        if (float(i) >= iter) break;\n' +
          '        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;\n' +
          '        n += 1.0;\n' +
          '        if (dot(z, z) > 256.0) { escapa = true; break; }\n' +
          '    }\n' +
          '\n' +
          '    vec3 col = vec3(0.03, 0.01, 0.05);\n' +
          '    if (escapa) {\n' +
          '        float m = (n - log2(log2(dot(z, z))) + 4.0) * 0.06;\n' +
          '        col = 0.5 + 0.5 * cos(6.2831 * (m + vec3(0.0, 0.33, 0.67)));\n' +
          '        col *= smoothstep(0.0, 3.0, m);\n' +
          '    }\n' +
          '\n' +
          '    color = vec4(col, 1.0);\n' +
          '}\n',
        nota: 'Enciende «animar c» y déjalo correr: $c$ da una vuelta a una circunferencia de radio ' +
          '$0{,}7885$, que entra y sale del Mandelbrot, y la figura se hace y se deshace. Es uno de ' +
          'los planos más repetidos de la historia de las visuales en directo.'
      });
    }
  });

  p.note('Al hacer mucho zoom la imagen se vuelve blocosa y luego se rompe. No es un fallo del ' +
    'programa: los <code>float</code> de la tarjeta tienen unos siete dígitos decimales, y a partir ' +
    'de ahí dos píxeles vecinos <em>reciben el mismo número</em>. Es el [[av-numerico|error de ' +
    'redondeo]] del bloque 12, visible a simple vista. Los programas que hacen zooms profundos usan ' +
    'aritmética de precisión extendida, y por eso van despacio.', 'warn', 'El fondo del zoom');

  p.util('Más allá de la belleza, la geometría fractal se usa para medir cosas que las figuras ' +
    'clásicas no describen: la rugosidad de una superficie, la ramificación de los bronquios y de las ' +
    'raíces, el trazado de una costa, la distribución de las grietas, la turbulencia. En gráficos por ' +
    'ordenador, las montañas y los rayos de casi cualquier película son fractales, y las antenas ' +
    'fractales —las de tu móvil— caben en un centímetro cuadrado porque una curva que se pliega ' +
    'infinitamente tiene mucha más longitud de la que aparenta.');

  p.hist('Benoît Mandelbrot vio la figura por primera vez en 1980, en la impresora de línea de un ' +
    'centro de IBM, y creyó que las manchas alrededor del cuerpo principal eran polvo del papel. Eran ' +
    'islas reales, conectadas al conjunto por filamentos demasiado finos para aquella impresora. La ' +
    'idea de fondo —iterar una función y estudiar qué se escapa— es de Gaston Julia y Pierre Fatou, ' +
    'que la desarrollaron hacia 1918 <em>sin haber visto jamás un dibujo</em>: pasaron sesenta años ' +
    'entre la teoría y la primera imagen.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Tres vueltas a mano',
    level: 'basico',
    gen: function (r) {
      var a = r.real(-1.2, 0.4, 2), b = r.real(-0.9, 0.9, 2);
      var zx = 0, zy = 0, pasos = [];
      for (var i = 0; i < 3; i++) {
        var nx = zx * zx - zy * zy + a, ny = 2 * zx * zy + b;
        zx = nx; zy = ny;
        pasos.push({ x: zx, y: zy });
      }
      return { a: a, b: b, pasos: pasos, mod: Math.sqrt(zx * zx + zy * zy) };
    },
    ask: function (d) {
      return 'Con $c = ' + U.fmt(d.a, 2) + (d.b < 0 ? ' - ' + U.fmt(-d.b, 2) : ' + ' + U.fmt(d.b, 2)) +
        'i$ y $z_0 = 0$, aplica $z \\to z^2 + c$ <strong>tres veces</strong>.<br><br>¿Cuánto vale ' +
        '$z_3$ y cuál es su módulo? (cuatro decimales)';
    },
    fields: [
      { name: 'x', label: 'parte real', w: 'tiny' },
      { name: 'y', label: 'parte imaginaria', w: 'tiny' },
      { name: 'm', label: 'módulo', w: 'tiny' }
    ],
    sol: function (d) {
      return { x: U.round(d.pasos[2].x, 8), y: U.round(d.pasos[2].y, 8), m: U.round(d.mod, 8) };
    },
    tol: 3e-4,
    hint: function () {
      return 'Al cuadrado: $(x + yi)^2 = (x^2 - y^2) + 2xy\\,i$. Súmale $c$ componente a componente y ' +
        'repite. El módulo es $\\sqrt{x^2 + y^2}$.';
    },
    steps: function (d) {
      var s = ['$z_1 = 0^2 + c = ' + U.fmt(d.a, 2) + ' + ' + U.fmt(d.b, 2) + 'i$'];
      for (var i = 1; i < 3; i++) {
        var pr = d.pasos[i - 1];
        s.push('$z_' + (i + 1) + ' = (' + U.fmt(pr.x, 4) + ')^2 - (' + U.fmt(pr.y, 4) + ')^2 + ' +
          U.fmt(d.a, 2) + '$ y $2\\cdot(' + U.fmt(pr.x, 4) + ')(' + U.fmt(pr.y, 4) + ') + ' +
          U.fmt(d.b, 2) + '$, o sea $' + U.fmt(d.pasos[i].x, 4) + ' + ' + U.fmt(d.pasos[i].y, 4) + 'i$');
      }
      s.push('$|z_3| = ' + U.fmt(d.mod, 4) + '$' + (d.mod > 2
        ? ': pasa de 2, así que este $c$ <strong>no</strong> pertenece al conjunto.'
        : ': aún no pasa de 2, así que de momento sigue en carrera.'));
      return s;
    },
    answer: function (d) {
      return U.fmt(d.pasos[2].x, 4) + ' + ' + U.fmt(d.pasos[2].y, 4) + 'i · módulo ' + U.fmt(d.mod, 4);
    }
  });

  p.exercise({
    title: '¿Escapa o no escapa?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { a: 0, b: 0 }, { a: -1, b: 0 }, { a: 0.3, b: 0 }, { a: 1, b: 0 },
        { a: -0.5, b: 0.5 }, { a: 0.4, b: 0.4 }, { a: -2, b: 0 }, { a: 0.5, b: 0.5 }
      ];
      var c = r.pick(casos);
      var zx = 0, zy = 0, n = 0, esc = false;
      for (var i = 0; i < 40; i++) {
        var nx = zx * zx - zy * zy + c.a, ny = 2 * zx * zy + c.b;
        zx = nx; zy = ny; n++;
        if (zx * zx + zy * zy > 4) { esc = true; break; }
      }
      return { a: c.a, b: c.b, n: n, esc: esc, mod: Math.sqrt(zx * zx + zy * zy) };
    },
    ask: function (d) {
      return 'Toma $c = ' + U.fmt(d.a, 2) + (d.b < 0 ? ' - ' + U.fmt(-d.b, 2) : ' + ' + U.fmt(d.b, 2)) +
        'i$ e itera desde $z_0 = 0$ hasta un máximo de 40 vueltas.<br><br>¿<strong>Escapa</strong> ' +
        '(el módulo pasa de 2) o se queda dentro? Escribe <em>escapa</em> o <em>dentro</em>. Y si ' +
        'escapa, ¿en qué vuelta lo hace? (si no escapa, pon 40)';
    },
    fields: [
      { name: 'q', label: 'escapa / dentro', w: 'small' },
      { name: 'n', label: 'vuelta', w: 'tiny' }
    ],
    sol: function (d) { return { q: d.esc ? 'escapa' : 'dentro', n: d.n }; },
    check: function (v, d) {
      var q = U.eligeOpcion(v.raw.q, {
        escapa: /escap|fuera|se dispara|diverg|explota|se va/,
        dentro: /dentro|acotad|converg|se queda|atrapad|preso/
      });
      if (q === null) return { ok: false, msg: 'Contesta <em>escapa</em> o <em>dentro</em>.' };
      var n = parseFloat(String(v.raw.n).replace(',', '.'));
      if (q !== (d.esc ? 'escapa' : 'dentro')) {
        return { ok: false, msg: 'La otra. Itera un par de vueltas más y mira el módulo.' };
      }
      if (!(Math.abs(n - d.n) < 0.5)) {
        return { ok: false, msg: 'La respuesta de escape o no escape es correcta, pero la vuelta no. ' +
          'Cuenta desde 1: la primera aplicación de la regla es la vuelta 1.' };
      }
      return { ok: true };
    },
    hint: function () {
      return 'Basta con ir calculando y mirar el módulo al cuadrado, que es $x^2 + y^2$: si pasa de ' +
        '4, ya ha escapado. Algunos valores se quedan quietos para siempre (mira qué pasa con $c = 0$ ' +
        'o con $c = -1$).';
    },
    steps: function (d) {
      return [d.esc
        ? 'La sucesión pasa de módulo 2 en la vuelta ' + d.n + ', así que $c$ está <strong>fuera</strong> ' +
          'del conjunto de Mandelbrot. En la pantalla, este píxel se pintaría de color.'
        : 'Tras 40 vueltas el módulo sigue en $' + U.fmt(d.mod, 4) + '$, sin acercarse a 2: $c$ ' +
          'está (casi con seguridad) <strong>dentro</strong>. En la pantalla, este píxel se pintaría ' +
          'de negro.',
        'Fíjate en que «dentro» nunca se demuestra iterando: solo se comprueba que no ha escapado ' +
          '<em>todavía</em>. Subir las iteraciones puede cambiar la respuesta, y por eso el borde ' +
          'del dibujo se afina cuando subes ese mando.',
        'Ese es exactamente el problema de decidir algo con un ordenador que estudiaste en ' +
          '[[av-computabilidad|computabilidad]]: hay preguntas que un bucle no cierra.'];
    },
    answer: function (d) { return (d.esc ? 'escapa' : 'dentro') + ' · vuelta ' + d.n; }
  });

  p.exercise({
    title: 'Escribe la iteración',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'un <strong>Mandelbrot</strong>: $z$ empieza en cero y $c$ es el píxel',
          ini: 'vec2 z = vec2(0.0); vec2 c = uv;',
          ref: 'vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c' },
        { pide: 'un <strong>Julia</strong> con $c = -0{,}8 + 0{,}156\\,i$: $z$ empieza en el píxel',
          ini: 'vec2 z = uv; vec2 c = vec2(-0.8, 0.156);',
          ref: 'vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c' },
        { pide: 'un <strong>«burning ship»</strong>: como el Mandelbrot pero tomando el valor absoluto de las dos componentes de $z$ antes de elevar al cuadrado',
          ini: 'vec2 z = vec2(0.0); vec2 c = uv;',
          ref: 'vec2(abs(z.x)*abs(z.x) - abs(z.y)*abs(z.y), 2.0*abs(z.x)*abs(z.y)) + c' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Escribe el paso de la iteración para ' + d.pide + ':<br>' +
        '<pre class="shd__mini">' + d.ini.replace(/; /g, ';\n') + '\nfor (int i = 0; i &lt; 60; i++) {\n    z = <strong>???</strong> ;\n    if (dot(z, z) &gt; 4.0) break;\n    n += 1.0;\n}</pre>' +
        'Recuerda que el cuadrado de un complejo es $(x^2 - y^2,\\ 2xy)$.';
    },
    fields: [{ name: 'z', label: 'el nuevo z', w: 'wide' }],
    sol: function (d) { return { z: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.z || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 uv = 1.6 * (fragCoord - 0.5*iResolution.xy) / iResolution.y - vec2(0.4, 0.0);\n' +
          '  ' + d.ini + '\n' +
          '  float n = 0.0;\n' +
          '  for (int i = 0; i < 60; i++) {\n' +
          '    z = ' + x + ';\n' +
          '    if (dot(z, z) > 4.0) break;\n' +
          '    n += 1.0;\n  }\n' +
          '  color = vec4(vec3(n / 60.0), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 8 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. El resultado tiene que ser un <code>vec2</code>, y ' +
          'todos los números llevan punto decimal.' };
      }
      if (!r.ok) {
        return { ok: false, msg: 'Compila, pero la figura no coincide. Revisa el producto complejo: ' +
          'la parte real lleva una <strong>resta</strong> y la imaginaria un factor 2.' };
      }
      return { ok: true };
    },
    hint: function (d) {
      return 'El esqueleto es siempre <code>vec2(x*x - y*y, 2.0*x*y) + c</code>. Lo único que cambia ' +
        'entre unos fractales y otros es quién es $z$ al principio, quién es $c$, y si se toca algo ' +
        'antes de elevar al cuadrado.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Cambiar dos caracteres —un valor absoluto, una potencia, un signo— da una familia entera de ' +
        'figuras nuevas. Ahí es donde merece la pena perder una tarde.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Una regla de cuatro símbolos, $z \\to z^2 + c$, y un criterio de parada, $|z| > 2$: eso es todo el fractal.',
    'El <strong>Mandelbrot</strong> pone el píxel en $c$ y arranca $z$ en cero; el <strong>Julia</strong> hace lo contrario. Mismo bucle, otra figura.',
    'El coloreado a bandas se funde con la <strong>iteración continua</strong>, $n - \\log_2(\\log_2|z|)$.',
    'Un shader es la máquina ideal para esto: cada píxel itera por su cuenta y no necesita saber nada de los demás.',
    'El zoom tiene fondo, y es el <strong>redondeo</strong> de los números de la tarjeta, no la figura.',
    'Complejidad infinita a partir de una regla trivial: la idea que sostiene todo este bloque.'
  ]);
});
