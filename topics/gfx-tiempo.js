/* Tema: El tiempo entra en la ecuación */
Course.topic('gfx-tiempo', function (p) {

  p.text('Hasta ahora los shaders eran estampas. Con una variable más se ponen en movimiento, y esa ' +
    'variable es <code>iTime</code>: los segundos que llevan corriendo, en decimales.');

  p.text('El shader no anima nada. Sigue siendo la misma función de siempre, contestando de qué ' +
    'color es un píxel; lo único que ha cambiado es que ahora <strong>la pregunta incluye el ' +
    'instante</strong>. Se llama sesenta veces por segundo con un $t$ un poco mayor, y el movimiento ' +
    'lo pone tu ojo.');

  p.note('Esto tiene una consecuencia que conviene asimilar: un shader <strong>no recuerda el ' +
    'fotograma anterior</strong>. No hay «mover la pelota un poco»; hay «calcular dónde está la ' +
    'pelota en el segundo $t$». Todo movimiento es una <em>fórmula del tiempo</em>, no una ' +
    'acumulación.', 'ok', 'No hay memoria: hay función');

  p.section('Todo el movimiento sale de un seno');

  p.text('Y aquí es donde el bloque 4 se cobra la deuda. Para que algo vaya y venga sin salirse ' +
    'nunca, la herramienta es la de siempre:');

  p.formula('y = A\\,\\operatorname{sen}(\\omega t + \\varphi) + k', 'el oscilador',
    'Se dice: <em>«a por seno de omega te más fi, más ka»</em>, y cada letra hace un trabajo ' +
      'distinto:<br><br>· <strong>$A$, la amplitud</strong>: cuánto se aleja del centro.<br>' +
      '· <strong>$\\omega$, la frecuencia angular</strong>: lo deprisa que va. Multiplica al tiempo.<br>' +
      '· <strong>$\\varphi$, la fase</strong>: por dónde empieza. Se suma dentro.<br>' +
      '· <strong>$k$, el desplazamiento</strong>: alrededor de qué valor oscila.<br><br>' +
      'En GLSL: <code>float y = A * sin(w * iTime + fase) + k;</code>');

  p.text('El truco práctico que más se usa: como el seno va de $-1$ a $1$ y los colores van de 0 a 1, ' +
    'casi siempre se escribe <code>0.5 + 0.5 * sin(...)</code>. Eso lo lleva al rango bueno sin ' +
    'pensar.');

  p.demo({
    title: 'Los cuatro mandos de una onda',
    intro: 'Un círculo que late y se mueve. Toca amplitud, frecuencia y fase por separado hasta que veas qué hace cada una: son las mismas cuatro letras de la onda del bloque 4, aquí con consecuencias visibles.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-tiempo-1', alto: 300,
        aria: 'Un círculo que se desplaza de lado a lado mientras su tamaño late.',
        mandos: [
          { n: 'amplitud', label: 'amplitud A', min: 0.0, max: 0.45, step: 0.01, value: 0.28, dec: 2 },
          { n: 'velocidad', label: 'frecuencia ω', min: 0.0, max: 6.0, step: 0.1, value: 1.6, dec: 1 },
          { n: 'fase', label: 'fase φ', min: 0.0, max: 6.28, step: 0.05, value: 0.0, dec: 2 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // el centro va y viene: un seno en la x\n' +
          '    float cx = amplitud * sin(velocidad * iTime + fase);\n' +
          '\n' +
          '    // y el radio late: otro seno, desfasado un cuarto de vuelta\n' +
          '    float radio = 0.10 + 0.03 * sin(velocidad * iTime + fase + PI * 0.5);\n' +
          '\n' +
          '    float d = length(p - vec2(cx, 0.0)) - radio;\n' +
          '    float v = 1.0 - smoothstep(0.0, 0.01, d);\n' +
          '\n' +
          '    color = vec4(vec3(v) * vec3(1.0, 0.45, 0.75), 1.0);\n' +
          '}\n',
        nota: 'Con la frecuencia a 0 el tiempo deja de contar y la imagen se congela: ahí se ve que ' +
          'todo el movimiento estaba en esa multiplicación.'
      });
    }
  });

  p.section('Desfasar el espacio: donde empieza lo bonito');

  p.text('Lo anterior mueve una figura. El paso siguiente es más interesante y es la base de casi ' +
    'toda la animación que verás en Shadertoy: <strong>sumarle al tiempo algo que depende de la ' +
    'posición</strong>.');

  p.formula('\\text{onda} = \\operatorname{sen}(t + k\\,|\\mathbf{p}|)', 'desfase según la distancia');

  p.text('Cada píxel oscila igual, pero <strong>los de fuera van retrasados respecto a los de ' +
    'dentro</strong>. Visto en conjunto, eso no parece un montón de píxeles parpadeando: parece ' +
    'una onda que se propaga hacia fuera. Es exactamente lo que ocurre en el agua cuando cae una ' +
    'piedra, y por el mismo motivo.');

  p.demo({
    title: 'Ondas en el agua',
    intro: 'Nadie ha programado una onda que viaje. Cada píxel oscila en su sitio con un retraso proporcional a su distancia al centro, y el viaje lo pone tu ojo. Cambia entre distancia y coordenada para ver ondas circulares o rectas.',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-tiempo-2', alto: 300,
        aria: 'Ondas concéntricas que se propagan desde el centro, como al tirar una piedra al agua.',
        mandos: [
          { n: 'k', label: 'longitud de onda', min: 4.0, max: 60.0, step: 1.0, value: 22.0, dec: 0 },
          { n: 'vel', label: 'velocidad', min: -6.0, max: 6.0, step: 0.2, value: 3.0, dec: 1 },
          { n: 'recta', label: 'circular ↔ recta', min: 0, max: 1, step: 1, value: 0, dec: 0 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // de que depende el desfase: de la distancia o de la x\n' +
          '    float s = mix(length(p), p.x, recta);\n' +
          '\n' +
          '    // cada pixel oscila, pero con retraso segun donde este\n' +
          '    float onda = sin(k * s - vel * iTime);\n' +
          '\n' +
          '    // de -1..1 a 0..1\n' +
          '    float v = 0.5 + 0.5 * onda;\n' +
          '\n' +
          '    vec3 c = mix(vec3(0.05, 0.12, 0.25), vec3(0.55, 0.85, 1.0), v);\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Pon la velocidad en negativo y las ondas van hacia dentro. Ponla a cero y verás la ' +
          'foto fija: anillos concéntricos, que es lo que hay debajo del movimiento.'
      });
    }
  });

  p.text('Cambiar el signo de <code>vel</code> invierte el sentido; cambiar <code>k</code> aprieta o ' +
    'estira los anillos. Son la frecuencia y la velocidad de propagación de la [[av-edp|ecuación de ondas]], con dos deslizadores.');

  p.util('Este mecanismo —cada elemento hace lo mismo con un retraso— es como se coordinan las cosas ' +
    'sin coordinarse. Una ola en un estadio no la dirige nadie: cada espectador se levanta cuando ' +
    've levantarse a su vecino, y el resultado parece una onda que da la vuelta al campo. Las luces ' +
    'de una pista de aterrizaje, un letrero de neón que «corre», el aleteo de un banco de peces: ' +
    'siempre lo mismo, un desfase proporcional a la posición.');

  p.hist('John Whitney llevaba haciendo esto sin ordenador desde los años cincuenta. Construyó una ' +
    'máquina con piezas de un ordenador analógico de artillería antiaérea de la Segunda Guerra ' +
    'Mundial, y con ella filmaba puntos que giraban a velocidades ligeramente distintas: al ' +
    'desfasarse, dibujaban figuras que nadie había trazado. Su hijo hizo con esa técnica la ' +
    'secuencia del ordenador de <em>2001: una odisea del espacio</em>. Whitney llamó a lo suyo ' +
    '<em>armonía digital</em>, y sostenía que las relaciones que hacen bella una imagen en ' +
    'movimiento son las mismas que hacen consonante un acorde. En este tema estás haciendo lo mismo ' +
    'que él, con una tarjeta gráfica en vez de un motor de guerra.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El valor en un instante',
    level: 'basico',
    gen: function (r) {
      var A = r.pick([0.2, 0.25, 0.3, 0.5]);
      var w = r.pick([1, 2, 3, 4]);
      var t = r.real(0.1, 3, 2);
      return { A: A, w: w, t: t, v: A * Math.sin(w * t), c: 0.5 + 0.5 * Math.sin(w * t) };
    },
    ask: function (d) {
      return 'Un shader calcula <code>float x = ' + U.fmt(d.A, 2) + ' * sin(' + d.w +
        '.0 * iTime);</code> y también <code>float c = 0.5 + 0.5 * sin(' + d.w +
        '.0 * iTime);</code><br><br>En el instante <code>iTime = ' + U.fmt(d.t, 2) +
        '</code>, ¿cuánto valen? (cuatro decimales, ángulos en radianes)';
    },
    fields: [
      { name: 'x', label: 'x', w: 'tiny' },
      { name: 'c', label: 'c', w: 'tiny' }
    ],
    sol: function (d) { return { x: U.round(d.v, 8), c: U.round(d.c, 8) }; },
    tol: 3e-5,
    hint: function () {
      return 'El seno trabaja en radianes. Y fíjate en la segunda: $0{,}5 + 0{,}5\\operatorname{sen}$ ' +
        'siempre cae entre 0 y 1, que es el rango de un color.';
    },
    steps: function (d) {
      var s = Math.sin(d.w * d.t);
      return ['$\\operatorname{sen}(' + d.w + '\\cdot' + U.fmt(d.t, 2) + ') = \\operatorname{sen}(' +
        U.fmt(d.w * d.t, 4) + ') = ' + U.fmt(s, 6) + '$',
        '$x = ' + U.fmt(d.A, 2) + '\\cdot' + U.fmt(s, 4) + ' = ' + U.fmt(d.v, 4) + '$',
        '$c = 0{,}5 + 0{,}5\\cdot' + U.fmt(s, 4) + ' = ' + U.fmt(d.c, 4) + '$',
        'La primera oscila alrededor de 0 y la segunda alrededor de 0,5: por eso la segunda sirve ' +
        'como color y la primera como posición.'];
    },
    answer: function (d) { return 'x = ' + U.fmt(d.v, 4) + ', c = ' + U.fmt(d.c, 4); }
  });

  p.exercise({
    title: 'El periodo',
    level: 'medio',
    gen: function (r) {
      var w = r.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6]);
      return { w: w, T: 2 * Math.PI / w };
    },
    ask: function (d) {
      return 'Un shader anima con <code>sin(' + U.fmt(d.w, 1) + ' * iTime)</code>. ¿Cada cuántos ' +
        'segundos se repite exactamente el movimiento? (cuatro decimales)';
    },
    fields: [{ name: 'T', label: 'periodo (s)', w: 'wide' }],
    sol: function (d) { return { T: U.round(d.T, 8) }; },
    tol: 3e-5,
    hint: function () {
      return 'El seno se repite cada $2\\pi$ radianes. Si el argumento es $\\omega t$, hay que ver ' +
        'qué $t$ hace que el argumento avance $2\\pi$.';
    },
    steps: function (d) {
      return ['El argumento tiene que aumentar $2\\pi$: $\\omega T = 2\\pi$.',
        '$T = \\dfrac{2\\pi}{\\omega} = \\dfrac{2\\pi}{' + U.fmt(d.w, 1) + '} = ' + U.fmt(d.T, 4) + '$ s',
        'Cuanto mayor es $\\omega$, más corto el periodo: va más deprisa.'];
    },
    answer: function (d) { return U.fmt(d.T, 4) + ' s'; }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: 'float v = 0.5 + 0.5 * sin(iTime);',
          o: ['Toda la pantalla parpadea suavemente entre negro y blanco, un ciclo cada 6,28 segundos', 'Toda la pantalla parpadea una vez por segundo', 'Rayas que se desplazan', 'Un círculo que late'],
          por: 'No depende del píxel, así que toda la pantalla tiene el mismo valor; el seno de <code>iTime</code> completa un ciclo cada $2\\pi$ segundos.' },
        { c: 'float v = 0.5 + 0.5 * sin(20.0 * p.x - 3.0 * iTime);',
          o: ['Rayas verticales que se desplazan hacia la derecha', 'Rayas verticales que se desplazan hacia la izquierda', 'Rayas horizontales quietas', 'Anillos que salen del centro'],
          por: 'Una cresta es un valor fijo de $20x - 3t$; para que siga igual al crecer $t$, $x$ tiene que crecer: las rayas avanzan hacia la derecha.' },
        { c: 'float v = step(length(p - vec2(0.3 * sin(iTime), 0.0)), 0.1);',
          o: ['Un círculo que va y viene de izquierda a derecha', 'Un círculo que sube y baja', 'Un círculo que da vueltas', 'Un círculo quieto que late'],
          por: 'El centro del círculo es $(0{,}3\\operatorname{sen} t,\\ 0)$: solo cambia la $x$, que oscila entre $-0{,}3$ y $0{,}3$.' },
        { c: 'float v = 0.5 + 0.5 * sin(20.0 * length(p) + 3.0 * iTime);',
          o: ['Anillos que se mueven hacia el centro', 'Anillos que salen del centro', 'Rayas verticales', 'Sectores que giran'],
          por: 'Para mantener fijo $20r + 3t$ al crecer $t$, el radio $r$ tiene que disminuir: los anillos convergen hacia el centro.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) { return 'Con <code>p</code> centrada y el color final <code>vec3(v)</code>, ¿qué se ve al pasar el tiempo?<pre class="shd__mini">' + d.codigo + '</pre>'; },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['Sigue una cresta: ¿qué tiene que pasarle a la posición para que el argumento del seno no cambie cuando crece el tiempo?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Pon el tiempo en marcha',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'un <strong>parpadeo</strong>: toda la pantalla pasando de negro a blanco y vuelta, entre 0 y 1',
          ref: '0.5 + 0.5 * sin(iTime)' },
        { pide: 'un <strong>parpadeo el doble de rápido</strong>, también entre 0 y 1',
          ref: '0.5 + 0.5 * sin(2.0 * iTime)' },
        { pide: 'unas <strong>ondas verticales</strong> que se mueven: depende de <code>p.x</code> y del tiempo',
          ref: '0.5 + 0.5 * sin(20.0 * p.x - iTime * 3.0)' },
        { pide: 'unos <strong>anillos</strong> que salen del centro: depende de <code>length(p)</code> y del tiempo',
          ref: '0.5 + 0.5 * sin(20.0 * length(p) - iTime * 3.0)' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\nfloat v = <strong>???</strong> ;\ncolor = vec4(vec3(v), 1.0);</pre>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Se compara en el instante ' +
        '<code>iTime = 0</code>, así que lo que importa es que la forma sea la correcta.</span>';
    },
    fields: [{ name: 'v', label: 'la expresión', w: 'wide' }],
    sol: function (d) { return { v: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.v || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      if (d.ref.indexOf('iTime') >= 0 && texto.indexOf('iTime') < 0) {
        return { ok: false, msg: 'Falta <code>iTime</code>: sin él la imagen no se mueve.' };
      }
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  float v = ' + x + ';\n' +
          '  color = vec4(vec3(v), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 40, tol: 7 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Acuérdate del punto: <code>2.0</code>, no <code>2</code>.' };
      }
      if (!r.ok) return { ok: false, msg: 'Compila, pero no da la forma pedida en el instante cero. ' +
        'Comprueba de qué depende el desfase y que el resultado quede entre 0 y 1.' };
      return { ok: true };
    },
    hint: function () {
      return 'El molde es siempre <code>0.5 + 0.5 * sin(algo)</code>. Dentro del seno va lo que ' +
        'depende del espacio, menos lo que depende del tiempo: así la onda avanza.';
    },
    steps: function (d) {
      return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.',
        'El <code>0.5 + 0.5 *</code> de delante lleva el seno del rango $[-1,1]$ al $[0,1]$, que es ' +
        'donde viven los colores.'];
    },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    '<code>iTime</code> son los segundos transcurridos. El shader no anima: <strong>calcula el fotograma del instante $t$</strong>, sin recordar el anterior.',
    'Todo el movimiento sale del oscilador $A\\operatorname{sen}(\\omega t + \\varphi) + k$: amplitud, frecuencia, fase y centro.',
    'Para colores se usa <code>0.5 + 0.5 * sin(...)</code>, que lleva el seno de $[-1,1]$ a $[0,1]$.',
    'Sumar al tiempo algo que depende de la posición produce una <strong>onda que viaja</strong>: cada píxel oscila en su sitio con retraso.',
    'El periodo es $T = 2\\pi/\\omega$: subir la frecuencia acorta el ciclo.'
  ]);
});
