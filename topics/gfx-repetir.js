/* Tema: Repetir el espacio: fract y mod */
Course.topic('gfx-repetir', function (p) {

  p.text('Quieres dibujar mil círculos. En un programa normal harías un bucle de mil vueltas. En un ' +
    'shader hay un camino mucho mejor, y es de los que cambian la manera de pensar: ' +
    '<strong>no repitas la figura, repite el espacio</strong>.');

  p.text('Dibujas <em>un</em> círculo, y antes de dibujarlo pliegas la coordenada de modo que todo el ' +
    'plano quepa en una celda pequeña. Como el círculo se dibuja en cada celda a la vez —recuerda ' +
    'que cada píxel trabaja por su cuenta—, aparecen mil. Y cuesta exactamente lo mismo que uno.');

  p.section('fract: quedarse con la parte decimal');

  p.formula('\\operatorname{fract}(x) = x - \\lfloor x \\rfloor', 'la parte decimal',
    'Se dice: <em>«fract de equis es equis menos la parte entera de equis»</em>.<br><br>Los corchetes ' +
      'con las esquinas hacia dentro, $\\lfloor\\ \\rfloor$, son la <strong>parte entera por ' +
      'abajo</strong>: el mayor entero que no pasa de $x$. En GLSL es ' +
      '<code>floor</code>.<br><br>Así que <code>fract(3.7)</code> vale 0,7 y <code>fract(12.2)</code> ' +
      'vale 0,2. La gracia es que <strong>el resultado siempre cae entre 0 y 1</strong>, sea cual ' +
      'sea la entrada: es una función en diente de sierra que se repite cada unidad.');

  p.text('Y esa es toda la magia. Si le aplicas <code>fract</code> a la coordenada antes de dibujar, ' +
    'el plano infinito se convierte en infinitas copias del cuadrado unidad.');

  p.demo({
    title: 'Plegar el plano',
    intro: 'Un círculo, uno solo, escrito una vez. Sube el número de repeticiones y mira aparecer una rejilla: no se ha dibujado ni un círculo más, se ha encogido el espacio.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-rep-1', alto: 300,
        aria: 'Una rejilla de círculos idénticos cuyo número se puede aumentar.',
        mandos: [
          { n: 'n', label: 'celdas', min: 1, max: 16, step: 1, value: 4, dec: 0 },
          { n: 'radio', label: 'radio', min: 0.05, max: 0.5, step: 0.01, value: 0.3, dec: 2 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // 1. estirar el espacio: ahora una unidad es una celda\n' +
          '    p *= n;\n' +
          '\n' +
          '    // 2. plegarlo: cada celda vuelve a ir de 0 a 1\n' +
          '    vec2 q = fract(p) - 0.5;     // centrada en la celda\n' +
          '\n' +
          '    // 3. dibujar UN circulo, que sale en todas\n' +
          '    float d = length(q) - radio;\n' +
          '    float v = 1.0 - smoothstep(0.0, 0.02, d);\n' +
          '\n' +
          '    color = vec4(vec3(v) * vec3(0.95, 0.55, 0.85), 1.0);\n' +
          '}\n',
        nota: 'El <code>- 0.5</code> después del <code>fract</code> vuelve a centrar el origen, pero ' +
          'ahora dentro de cada celda. Sin él, los círculos saldrían pegados a la esquina.'
      });
    }
  });

  p.section('Dos coordenadas por el precio de una');

  p.text('Al plegar el espacio se obtienen <strong>dos informaciones distintas</strong>, y saber ' +
    'usar las dos es lo que separa una rejilla aburrida de algo que merezca mirarse:');

  p.table(['Cantidad', 'Qué es', 'Para qué sirve'], [
    ['<code>fract(p)</code>', 'dónde estoy <em>dentro</em> de mi celda', 'dibujar la figura'],
    ['<code>floor(p)</code>', '<em>en qué</em> celda estoy', 'hacer que cada celda sea distinta']
  ]);

  p.text('Con <code>floor</code> se puede dar a cada celda un color, un tamaño o un desfase propios, ' +
    'y la rejilla deja de parecer una rejilla. Es el mismo par de ideas del tablero de ajedrez del ' +
    'primer tema, ahora con intención.');

  p.demo({
    title: 'Cada celda, distinta',
    intro: 'La misma rejilla, pero ahora cada celda consulta su número de fila y columna para decidir su tamaño y su desfase. Un latido que recorre la pantalla en diagonal, sin un solo bucle.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-rep-2', alto: 300,
        aria: 'Una rejilla de círculos que laten con desfase, formando una onda diagonal.',
        mandos: [
          { n: 'n', label: 'celdas', min: 2, max: 20, step: 1, value: 8, dec: 0 },
          { n: 'retardo', label: 'retardo por celda', min: 0.0, max: 1.2, step: 0.05, value: 0.45, dec: 2 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '    p *= n;\n' +
          '\n' +
          '    vec2 celda  = floor(p);        // EN QUE celda estoy\n' +
          '    vec2 dentro = fract(p) - 0.5;  // DONDE dentro de ella\n' +
          '\n' +
          '    // cada celda late con retraso segun su posicion\n' +
          '    float fase = (celda.x + celda.y) * retardo;\n' +
          '    float r = 0.15 + 0.22 * (0.5 + 0.5 * sin(iTime * 2.5 - fase));\n' +
          '\n' +
          '    float v = 1.0 - smoothstep(0.0, 0.03, length(dentro) - r);\n' +
          '\n' +
          '    // y un color que tambien depende de la celda\n' +
          '    vec3 tono = 0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + fase);\n' +
          '\n' +
          '    color = vec4(v * tono, 1.0);\n' +
          '}\n',
        nota: 'El retardo a cero hace que todas laten a la vez y parece un simple parpadeo. Súbelo y ' +
          'aparece la diagonal: es el mismo desfase del tema anterior, ahora por celdas.'
      });
    }
  });

  p.note('Ese <code>0.5 + 0.5 * cos(vec3(0.0, 2.0, 4.0) + fase)</code> es el generador de paletas ' +
    'más usado del oficio. Tres cosenos desfasados entre sí un tercio de vuelta dan rojo, verde y ' +
    'azul recorriendo el arcoíris según avanza la fase. Es la <strong>paleta de coseno</strong> de ' +
    'Íñigo Quílez, y cabe en una línea.', null, 'Colores con tres cosenos');

  p.section('mod, y el aviso de siempre');

  p.text('<code>mod(x, m)</code> es lo mismo que <code>fract</code> pero con el periodo que quieras: ' +
    'devuelve el resto de dividir $x$ entre $m$. Es <strong>la aritmética modular del bloque 10</strong>, ' +
    'la de las horas del reloj, decidiendo píxeles.');

  p.formula('\\operatorname{mod}(x,\\ m) = x - m\\left\\lfloor \\frac{x}{m} \\right\\rfloor', 'el resto');

  p.note('Cuidado con una cosa que muerde: la repetición con <code>fract</code> <strong>rompe el ' +
    'campo de distancias</strong>. Dentro de cada celda la distancia es correcta, pero cerca del ' +
    'borde el píxel no «ve» la figura de la celda vecina, y si la figura se sale de su celda, se ' +
    'corta. Mientras quepa holgadamente, no se nota. Cuando no cabe, hay que mirar también las ' +
    'celdas contiguas: por eso subir mucho el radio en el primer ejemplo empieza a dar recortes ' +
    'raros.', 'warn', 'La costura de las celdas');

  p.util('Casi todo lo que se ve repetido en una pantalla está hecho así. La textura de una pared en ' +
    'un videojuego, la trama de un fondo, las escamas de un dragón, los adoquines de una calle: una ' +
    'celda dibujada una vez y un espacio plegado. Y en la impresión textil y el papel pintado es ' +
    'literalmente el mismo problema con siglos de antigüedad, lo que explica que los diecisiete ' +
    'grupos de simetría del plano —los que estudiaste en el tema de grupos— se catalogaran mirando ' +
    'los mosaicos de la Alhambra.');

  p.hist('La idea de plegar el espacio en vez de repetir el objeto es vieja en matemáticas —es lo ' +
    'que hace un <em>toro</em> al identificar los bordes de un cuadrado, como viste en topología— ' +
    'pero en gráficos se popularizó con la demoscene por pura necesidad: repetir un objeto exige ' +
    'guardarlo muchas veces o recorrerlo con un bucle, y en 4 kilobytes no sobra ni una instrucción. ' +
    'Plegar la coordenada cuesta una línea y da infinitas copias.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'fract, floor y mod',
    level: 'basico',
    gen: function (r) {
      var x = r.real(-4, 8, 3);
      var m = r.pick([2, 3, 5]);
      return { x: x, m: m, f: x - Math.floor(x), fl: Math.floor(x), md: x - m * Math.floor(x / m) };
    },
    ask: function (d) {
      return 'Con <code>x = ' + U.fmt(d.x, 3) + '</code>, calcula (cuatro decimales):<br>' +
        '<code>fract(x)</code>, <code>floor(x)</code> y <code>mod(x, ' + d.m + '.0)</code>';
    },
    fields: [
      { name: 'f', label: 'fract', w: 'tiny' },
      { name: 'l', label: 'floor', w: 'tiny' },
      { name: 'm', label: 'mod', w: 'tiny' }
    ],
    sol: function (d) { return { f: U.round(d.f, 8), l: d.fl, m: U.round(d.md, 8) }; },
    tol: 3e-5,
    hint: function () {
      return 'Con negativos, <code>floor</code> va hacia abajo: <code>floor(-1.3)</code> es $-2$, no ' +
        '$-1$. Por eso <code>fract</code> de un negativo sale positivo.';
    },
    steps: function (d) {
      return ['$\\lfloor ' + U.fmt(d.x, 3) + ' \\rfloor = ' + d.fl + '$ (hacia abajo, también con negativos)',
        '$\\operatorname{fract} = ' + U.fmt(d.x, 3) + ' - (' + d.fl + ') = ' + U.fmt(d.f, 4) + '$',
        '$\\operatorname{mod}(' + U.fmt(d.x, 3) + ', ' + d.m + ') = ' + U.fmt(d.x, 3) + ' - ' + d.m +
        '\\cdot\\lfloor' + U.fmt(d.x / d.m, 4) + '\\rfloor = ' + U.fmt(d.md, 4) + '$',
        'Los dos resultados caen siempre en $[0, 1)$ y $[0, ' + d.m + ')$: por eso sirven para plegar.'];
    },
    answer: function (d) {
      return 'fract ' + U.fmt(d.f, 4) + ' · floor ' + d.fl + ' · mod ' + U.fmt(d.md, 4);
    }
  });

  p.exercise({
    title: '¿En qué celda caigo?',
    level: 'medio',
    gen: function (r) {
      var n = r.int(3, 12);
      var x = r.real(-0.48, 0.48, 3), y = r.real(-0.48, 0.48, 3);
      var px = x * n, py = y * n;
      return { n: n, x: x, y: y, cx: Math.floor(px), cy: Math.floor(py),
        dx: px - Math.floor(px) - 0.5, dy: py - Math.floor(py) - 0.5 };
    },
    ask: function (d) {
      return 'El shader hace <code>p *= ' + d.n + '.0;</code> y luego <code>vec2 celda = ' +
        'floor(p);</code> y <code>vec2 dentro = fract(p) - 0.5;</code><br><br>Si antes de multiplicar ' +
        '<code>p = (' + U.fmt(d.x, 3) + ', ' + U.fmt(d.y, 3) + ')</code>, ¿en qué celda cae y en qué ' +
        'punto de ella? (cuatro decimales)';
    },
    fields: [
      { name: 'cx', label: 'celda.x', w: 'tiny' },
      { name: 'cy', label: 'celda.y', w: 'tiny' },
      { name: 'dx', label: 'dentro.x', w: 'tiny' },
      { name: 'dy', label: 'dentro.y', w: 'tiny' }
    ],
    sol: function (d) {
      return { cx: d.cx, cy: d.cy, dx: U.round(d.dx, 8), dy: U.round(d.dy, 8) };
    },
    tol: 3e-5,
    hint: function (d) {
      return 'Primero multiplica las dos componentes por ' + d.n + '. La parte entera es la celda y ' +
        'la decimal, menos 0,5, es la posición dentro.';
    },
    steps: function (d) {
      return ['Tras multiplicar: $p = (' + U.fmt(d.x * d.n, 4) + ',\\ ' + U.fmt(d.y * d.n, 4) + ')$',
        'Celda: $(\\lfloor' + U.fmt(d.x * d.n, 3) + '\\rfloor,\\ \\lfloor' + U.fmt(d.y * d.n, 3) +
        '\\rfloor) = (' + d.cx + ',\\ ' + d.cy + ')$',
        'Dentro: $(' + U.fmt(d.dx, 4) + ',\\ ' + U.fmt(d.dy, 4) + ')$, que va de $-0{,}5$ a $0{,}5$ ' +
        'porque se ha centrado.',
        'Ese par de valores es todo lo que necesita el shader: uno para saber qué dibujar y otro ' +
        'para saber dónde.'];
    },
    answer: function (d) {
      return 'celda (' + d.cx + ', ' + d.cy + ') · dentro (' + U.fmt(d.dx, 4) + ', ' + U.fmt(d.dy, 4) + ')';
    }
  });

  p.exercise({
    title: 'Construye la rejilla',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'una rejilla de <strong>6 × 6</strong> celdas con un círculo centrado en cada una',
          ref: 'length(fract(p * 6.0) - 0.5) - 0.3' },
        { pide: 'una rejilla de <strong>4 × 4</strong> celdas con un círculo centrado en cada una',
          ref: 'length(fract(p * 4.0) - 0.5) - 0.3' },
        { pide: '<strong>franjas verticales</strong> repetidas 8 veces',
          ref: 'abs(fract(p.x * 8.0) - 0.5) - 0.25' },
        { pide: '<strong>franjas horizontales</strong> repetidas 8 veces',
          ref: 'abs(fract(p.y * 8.0) - 0.5) - 0.25' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\nfloat d = <strong>???</strong> ;\ncolor = vec4(vec3(1.0 - smoothstep(0.0, 0.02, d)), 1.0);</pre>';
    },
    fields: [{ name: 'd', label: 'la distancia', w: 'wide' }],
    sol: function (d) { return { d: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.d || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  float d = ' + x + ';\n' +
          '  color = vec4(vec3(1.0 - smoothstep(0.0, 0.02, d)), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 8 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Repasa paréntesis y decimales.' };
      }
      if (!r.ok) return { ok: false, msg: 'Compila, pero la rejilla no sale como se pedía. El orden ' +
        'es: multiplicar para estirar, <code>fract</code> para plegar, <code>- 0.5</code> para ' +
        'centrar, y entonces la figura.' };
      return { ok: true };
    },
    hint: function () {
      return 'Tres pasos siempre: <code>p * n</code> estira, <code>fract</code> pliega y ' +
        '<code>- 0.5</code> centra dentro de la celda. Después, la distancia de siempre.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'Ningún bucle, ninguna copia: una sola figura y un espacio plegado.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'No se repite la figura: <strong>se pliega el espacio</strong>. Una figura escrita una vez aparece infinitas veces y cuesta lo mismo.',
    'La receta es siempre: multiplicar para estirar, <code>fract</code> para plegar, <code>- 0.5</code> para centrar en la celda.',
    '<code>fract</code> dice <em>dónde</em> estás dentro de la celda; <code>floor</code> dice <em>en cuál</em>. Con la segunda se hace que cada celda sea distinta.',
    '<code>mod(x, m)</code> es la aritmética modular del bloque 10, repitiendo con el periodo que quieras.',
    'Plegar rompe el campo de distancias en las costuras: si la figura se sale de su celda, se corta.'
  ]);
});
