/* Tema: Decidir sin bifurcar */
Course.topic('gfx-decidir', function (p) {

  p.puente('Con la distancia en la mano, este tema explica cómo decidir sin <code>if</code>, con la ' +
    'interpolación lineal, y cómo combinar figuras con <code>min</code> y <code>max</code>. Detrás están ' +
    'las [[lg-conjuntos|operaciones de conjuntos]], unión, intersección y diferencia, escritas con dos ' +
    'funciones.');

  p.text('En un programa normal, decidir es fácil: <code>if</code>, y ya está. En un shader ese ' +
    '<code>if</code> es sospechoso, y conviene entender por qué antes de aprender a evitarlo.');

  p.text('Acuérdate de cómo funciona la tarjeta gráfica: miles de píxeles se calculan a la vez, en ' +
    'grupos que ejecutan <strong>la misma instrucción al mismo tiempo</strong>. Si dentro de un ' +
    'grupo unos píxeles entran en el <code>if</code> y otros no, la tarjeta no puede hacer las dos ' +
    'cosas a la vez: ejecuta primero una rama con unos apagados, luego la otra con los otros ' +
    'apagados, y tira la mitad del trabajo. Se llama <em>divergencia</em>, y cuesta caro.');

  p.note('La costumbre del oficio es escribir las decisiones <strong>con aritmética</strong> en vez ' +
    'de con bifurcaciones. No es solo por velocidad: el código sale más corto, se combina mejor y ' +
    'produce bordes suaves de regalo. Un <code>if</code> siempre tiene el borde duro.',
    'ok', 'Por qué se evita el if');

  p.section('mix: la interpolación que lo hace todo');

  p.formula('\\operatorname{mix}(a,\\ b,\\ t) = a(1-t) + b\\,t', 'mezclar dos cosas',
    'Se dice: <em>«mix de a, be, te»</em>.<br><br>Con $t=0$ devuelve $a$; con $t=1$ devuelve $b$; ' +
      'con $t=0{,}5$, la media. Entre medias, va pasando de uno a otro proporcionalmente.<br><br>Es ' +
      'la <strong>interpolación lineal</strong> de toda la vida: la misma cuenta que haces al ' +
      'estimar un valor intermedio en una tabla. Y funciona igual con números, con colores o con ' +
      'posiciones, porque opera componente a componente.');

  p.text('Con <code>mix</code>, «pintar de rojo si está dentro y de azul si está fuera» se escribe ' +
    'sin <code>if</code>:');

  p.formula('\\text{color} = \\operatorname{mix}(\\text{azul},\\ \\text{rojo},\\ \\text{dentro})',
    'elegir sin bifurcar');

  p.text('Y si <code>dentro</code> viene de un <code>smoothstep</code> en vez de un <code>step</code>, ' +
    'el cambio de color es gradual y el borde queda limpio. Esa es la razón de fondo: ' +
    '<strong>una decisión aritmética admite términos medios y un <code>if</code> no</strong>.');

  p.demo({
    title: 'Componer una escena por capas',
    intro: 'Tres figuras apiladas, cada una con un mix. El orden importa: lo último que se mezcla queda encima. Es el modelo mental del bloque entero, y es el mismo que usa cualquier programa de dibujo con capas.',
    predice: 'Si intercambias las líneas del círculo amarillo y el rosa, ¿cuál quedará encima? Y con separación 0, ¿de qué color se verá el único círculo?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-dec-1', alto: 300,
        aria: 'Tres círculos de colores superpuestos sobre un fondo degradado.',
        mandos: [{ n: 'sep', label: 'separación', min: 0.0, max: 0.35, step: 0.01, value: 0.17, dec: 2 }],
        codigo:
          'float circulo(vec2 p, vec2 c, float r) {\n' +
          '    return 1.0 - smoothstep(0.0, 0.008, length(p - c) - r);\n' +
          '}\n' +
          '\n' +
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    // capa 0: el fondo\n' +
          '    vec3 c = mix(vec3(0.08, 0.09, 0.14), vec3(0.16, 0.13, 0.26), p.y + 0.5);\n' +
          '\n' +
          '    // capa 1, 2 y 3: los circulos, uno encima de otro\n' +
          '    c = mix(c, vec3(0.95, 0.30, 0.45), circulo(p, vec2(-sep, -sep * 0.6), 0.16));\n' +
          '    c = mix(c, vec3(0.30, 0.85, 0.75), circulo(p, vec2( sep, -sep * 0.6), 0.16));\n' +
          '    c = mix(c, vec3(0.98, 0.85, 0.30), circulo(p, vec2( 0.0,  sep * 0.9), 0.16));\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Cambia el orden de las tres líneas de los círculos y verás cambiar cuál queda encima. ' +
          'Cada <code>mix</code> es una capa, y se pintan de abajo arriba.'
      });
    }
  });

  p.text('Fíjate en que hemos definido una función, <code>circulo</code>, y la hemos llamado tres ' +
    'veces. GLSL admite funciones como cualquier lenguaje, y en cuanto un shader pasa de veinte ' +
    'líneas conviene usarlas: el código se lee mejor y las figuras se reutilizan.');

  p.note('Esto que parece una rareza de los shaders es, en realidad, cómo decide ' +
    '<em>cualquier</em> circuito. Un procesador tampoco tiene un <code>if</code> por dentro: calcula ' +
    'las dos ramas siempre y deja pasar una con un <strong>multiplexor</strong>, que es exactamente ' +
    'este <code>mix</code> con el mando puesto a 0 o a 1. Se monta con puertas en ' +
    '[[maq-decidir|el bloque de máquinas y lenguajes]], que va antes que éste.',
    null, 'Lo mismo, un piso más abajo');

  p.section('min y max: unir y cortar figuras');

  p.text('Aquí ocurre algo elegante. Si tienes las distancias de dos figuras, las operaciones de ' +
    '[[lg-conjuntos|conjuntos]] salen solas:');

  p.table(['Operación', 'Con distancias', 'Qué hace'], [
    ['Unión $A \\cup B$', '<code>min(dA, dB)</code>', 'la figura resultante son las dos juntas'],
    ['Intersección $A \\cap B$', '<code>max(dA, dB)</code>', 'solo lo que está en las dos a la vez'],
    ['Diferencia $A \\setminus B$', '<code>max(dA, -dB)</code>', 'a A se le hace el agujero de B'],
    ['Complementario', '<code>-d</code>', 'el dentro se vuelve fuera']
  ]);

  p.text('Por qué funciona: estar dentro de la unión significa estar dentro de alguna de las dos, y ' +
    '«dentro» es «distancia negativa», así que basta quedarse con <strong>la más pequeña</strong>. Y ' +
    'estar en la intersección es estar dentro de las dos, o sea, que hasta la más grande sea ' +
    'negativa. Las [[lg-proposiciones|tablas de verdad]] de lógica, escritas con dos funciones.');

  p.comprueba('Dos círculos $A$ y $B$ se solapan. En un píxel de la zona común, $d_A = -0{,}1$ y $d_B = -0{,}04$. ¿Está ese píxel dentro de la diferencia $A \\setminus B$?', [
    { t: 'No: $\\max(d_A, -d_B) = 0{,}04 > 0$', ok: true, por: 'Está en $B$, y la diferencia le quita a $A$ todo lo que es de $B$. El signo cambiado de $d_B$ lo convierte en positivo, y el máximo lo expulsa.' },
    { t: 'Sí: $\\max(d_A, d_B) = -0{,}04 < 0$', ok: false, por: 'Eso es la intersección, sin cambiar el signo. Para la diferencia se niega la segunda distancia.' },
    { t: 'Sí: $\\min(d_A, d_B) = -0{,}1 < 0$', ok: false, por: 'Eso es la unión: dentro de alguna de las dos. La diferencia es más exigente: dentro de $A$ <em>y fuera</em> de $B$.' }
  ]);

  p.ejemplo({
    title: 'Un anillo con min y max',
    enunciado: 'Un anillo es un círculo de radio 0,3 al que se le quita otro de radio 0,2. Escribir su distancia y calcularla en $p = (0{,}25,\\ 0)$, en $(0{,}1,\\ 0)$ y en $(0{,}35,\\ 0)$.',
    pasos: [
      { t: '<strong>Las dos distancias.</strong> $d_A = |p| - 0{,}3$ (el grande) y $d_B = |p| - 0{,}2$ (el hueco). El anillo es $A \\setminus B$: $d = \\max(d_A,\\ -d_B)$.', antes: '¿Qué operación de conjuntos es «A sin B»? ¿Con qué función se escribe?' },
      { t: '<strong>En $(0{,}25,\\ 0)$.</strong> $d_A = -0{,}05$, $d_B = 0{,}05$. $\\max(-0{,}05,\\ -0{,}05) = -0{,}05$: dentro del anillo.' },
      { t: '<strong>En $(0{,}1,\\ 0)$.</strong> $d_A = -0{,}2$, $d_B = -0{,}1$. $\\max(-0{,}2,\\ 0{,}1) = 0{,}1$: fuera. Está dentro del círculo grande, pero también dentro del hueco, y el signo cambiado de $d_B$ lo expulsa.', antes: 'Este píxel está dentro de los dos círculos. ¿Qué signo tiene $-d_B$?' },
      { t: '<strong>En $(0{,}35,\\ 0)$.</strong> $d_A = 0{,}05$, $d_B = 0{,}15$. $\\max(0{,}05,\\ -0{,}15) = 0{,}05$: fuera, por el lado exterior.' },
      { t: '<strong>Al color.</strong> $c = \\operatorname{mix}(\\text{fondo},\\ \\text{tinta},\\ 1 - \\operatorname{smoothstep}(0,\\ 0{,}01,\\ d))$. En el primer píxel el peso es 1, tinta; en los otros dos, 0, fondo. Sin un solo <code>if</code>.' }
    ],
    cierre: 'El mismo píxel puede estar dentro de $A$ y fuera de $A \\setminus B$. Con distancias, esa lógica cabe en un <code>max</code> y un signo, y el borde suave sale gratis.'
  });

  p.demo({
    title: 'Unir, cortar y agujerear',
    intro: 'Dos figuras y las tres operaciones. Mueve el deslizador para acercarlas y fíjate en cómo se funden en la unión y desaparecen en la intersección.',
    predice: 'Con separación 0,4 y la intersección, ¿qué se verá? Y con separación 0 y la intersección, ¿qué forma queda: círculo, cuadrado o algo intermedio?',
    build: function (host) {
      W.shader(host, {
        id: 'gfx-dec-2', alto: 300,
        aria: 'Un círculo y un cuadrado combinados mediante unión, intersección o diferencia.',
        mandos: [
          { n: 'op', label: 'operación (0 unión · 1 intersección · 2 diferencia)', min: 0, max: 2, step: 1, value: 0, dec: 0 },
          { n: 'dx', label: 'separación', min: 0.0, max: 0.4, step: 0.01, value: 0.14, dec: 2 }
        ],
        codigo:
          'void mainImage(out vec4 color, in vec2 fragCoord)\n' +
          '{\n' +
          '    vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;\n' +
          '\n' +
          '    float circ = length(p - vec2(-dx, 0.0)) - 0.2;\n' +
          '    vec2  q    = abs(p - vec2(dx, 0.0)) - 0.17;\n' +
          '    float cuad = max(q.x, q.y);\n' +
          '\n' +
          '    float d = min(circ, cuad);                       // union\n' +
          '    if (op > 0.5 && op < 1.5) d = max(circ, cuad);    // interseccion\n' +
          '    if (op > 1.5)             d = max(circ, -cuad);   // diferencia\n' +
          '\n' +
          '    vec3 c = mix(vec3(0.10, 0.11, 0.16), vec3(0.92, 0.42, 0.78),\n' +
          '                 1.0 - smoothstep(0.0, 0.006, d));\n' +
          '\n' +
          '    color = vec4(c, 1.0);\n' +
          '}\n',
        nota: 'Aquí sí hay <code>if</code>, y a propósito: la condición es la misma para todos los ' +
          'píxeles de la pantalla, así que no hay divergencia. Lo que se evita es bifurcar según la ' +
          '<em>posición</em> del píxel.'
      });
    }
  });

  p.section('clamp y las otras que hay que conocer');

  p.table(['Función', 'Qué hace', 'Para qué se usa'], [
    ['<code>clamp(x, a, b)</code>', 'recorta $x$ al intervalo $[a,b]$', 'evitar colores fuera de rango'],
    ['<code>abs(x)</code>', 'valor absoluto', 'simetría: hace espejo respecto al origen'],
    ['<code>sign(x)</code>', '$-1$, $0$ o $1$', 'quedarse solo con el signo'],
    ['<code>fract(x)</code>', 'parte decimal', 'repetición, en el tema siguiente'],
    ['<code>floor(x)</code>', 'parte entera por abajo', 'contar en qué celda estás'],
    ['<code>dot(a, b)</code>', '[[ge-vectores|producto escalar]]', 'proyecciones y ángulos']
  ]);

  p.note('El <code>abs</code> merece una mirada aparte, porque es el truco de simetría más barato ' +
    'que existe. Escribir <code>p.x = abs(p.x)</code> antes de dibujar cualquier cosa hace que lo ' +
    'que dibujes a la derecha aparezca también a la izquierda, reflejado. Con dos <code>abs</code> ' +
    'tienes simetría en los cuatro cuadrantes. Es lo que se usó en la demostración del tema anterior ' +
    'para pintar dos círculos escribiendo uno.', null, 'abs es un espejo');

  p.util('Toda la interfaz de tu sistema operativo está hecha con estas operaciones. Un botón ' +
    'redondeado es un rectángulo y un círculo combinados; una sombra es la misma figura desplazada, ' +
    'difuminada y mezclada por debajo; el cristal esmerilado de un panel es una mezcla entre lo que ' +
    'hay detrás y un color. Cuando una aplicación se ve «bien hecha», casi siempre es que alguien ha ' +
    'compuesto con cuidado media docena de <code>mix</code>.');

  p.trampas([
    { e: 'Escribir <code>if (length(p) < 0.3)</code> para pintar un círculo', por: 'Funciona, pero bifurca según el píxel, cuesta a la tarjeta y el borde sale duro. Con <code>mix</code> y <code>smoothstep</code> se decide igual y el borde queda limpio.' },
    { e: 'Usar <code>max</code> para unir', por: 'Dentro es negativo. Estar en alguna de las dos figuras es que <em>alguna</em> distancia sea negativa: el mínimo. El máximo exige que lo sean las dos, y eso es la intersección.' },
    { e: 'Olvidar el signo en la diferencia', por: '<code>max(dA, dB)</code> deja la zona común; para quitar $B$ hay que negarla: <code>max(dA, -dB)</code>. El píxel de $d_B = -0{,}04$ pasa a $+0{,}04$ y sale.' },
    { e: 'Dejar que el peso del mix se salga de $[0, 1]$', por: 'Con $t = 1{,}5$ el color se extrapola y sale fuera de rango. <code>step</code>, <code>smoothstep</code> y <code>clamp</code> devuelven pesos válidos; una resta a pelo, no.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.hist('Construir figuras complicadas uniendo, cortando y restando formas sencillas tiene nombre: ' +
    '<em>geometría constructiva de sólidos</em>. Nació en los años sesenta y setenta para el diseño industrial ' +
    'por ordenador, y una de las primeras empresas en usarla para hacer imágenes fue MAGI, en Nueva York, cuyo ' +
    'sistema SynthaVision describía los objetos como combinaciones de esferas, cilindros y cajas. Con él se ' +
    'hicieron buena parte de las secuencias de ordenador de <em>Tron</em> (1982). Las distancias con signo ' +
    'convirtieron esas operaciones en algo tan barato como un <code>min</code> y un <code>max</code>, y por eso ' +
    'la técnica ha vuelto con fuerza a los shaders.');

  p.section('Practica');

  p.exercise({
    title: 'Calcula el mix',
    level: 'basico',
    gen: function (r) {
      var a = r.real(0, 1, 2), b = r.real(0, 1, 2), t = r.real(0, 1, 2);
      return { a: a, b: b, t: t, v: a * (1 - t) + b * t };
    },
    ask: function (d) {
      return '¿Cuánto vale <code>mix(' + U.fmt(d.a, 2) + ', ' + U.fmt(d.b, 2) + ', ' +
        U.fmt(d.t, 2) + ')</code>? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'resultado', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 8) }; },
    dec: 4,
    hint: function () { return '$\\operatorname{mix}(a,b,t) = a(1-t) + bt$. Con $t=0$ sale $a$; con $t=1$, $b$.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.a, 2) + '\\cdot(1-' + U.fmt(d.t, 2) + ') + ' + U.fmt(d.b, 2) + '\\cdot' +
        U.fmt(d.t, 2) + '$',
        '$= ' + U.fmt(d.a * (1 - d.t), 4) + ' + ' + U.fmt(d.b * d.t, 4) + ' = ' + U.fmt(d.v, 4) + '$',
        'El resultado siempre queda entre $a$ y $b$ mientras $t$ esté entre 0 y 1.'];
    },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.exercise({
    title: 'Operaciones entre figuras',
    level: 'medio',
    gen: function (r) {
      var da = r.real(-0.3, 0.3, 3), db = r.real(-0.3, 0.3, 3);
      if (Math.abs(da - db) < 0.02 || Math.abs(da + db) < 0.02) return null;
      var op = r.int(0, 2);
      var d = op === 0 ? Math.min(da, db) : (op === 1 ? Math.max(da, db) : Math.max(da, -db));
      return { da: da, db: db, op: op, d: d,
        nombre: ['unión', 'intersección', 'diferencia'][op],
        expr: ['min(dA, dB)', 'max(dA, dB)', 'max(dA, -dB)'][op] };
    },
    ask: function (d) {
      return 'En un píxel, la distancia a la figura A vale <code>' + U.fmt(d.da, 3) + '</code> y a la ' +
        'figura B vale <code>' + U.fmt(d.db, 3) + '</code>.<br><br>Calcula <code>' + d.expr +
        '</code> —la <strong>' + d.nombre + '</strong>— y di si ese píxel queda dentro o fuera de la ' +
        'figura resultante.';
    },
    fields: [
      { name: 'd', label: 'el valor', w: 'tiny' },
      { name: 'q', label: 'El píxel queda', opts: [{ t: 'dentro', v: 'dentro' }, { t: 'fuera', v: 'fuera' }] }
    ],
    sol: function (d) { return { d: U.round(d.d, 6), q: d.d < 0 ? 'dentro' : 'fuera' }; },
    dec: 3,
    hint: function (d) {
      return 'Unión es <code>min</code>, intersección es <code>max</code>, y la diferencia cambia el ' +
        'signo de la segunda antes del <code>max</code>. Negativo significa dentro.';
    },
    steps: function (d) {
      return ['La <strong>' + d.nombre + '</strong> se calcula con <code>' + d.expr + '</code>.',
        d.op === 2
          ? '$\\max(' + U.fmt(d.da, 3) + ',\\ ' + U.fmt(-d.db, 3) + ') = ' + U.fmt(d.d, 3) + '$'
          : '$\\' + (d.op === 0 ? 'min' : 'max') + '(' + U.fmt(d.da, 3) + ',\\ ' + U.fmt(d.db, 3) +
            ') = ' + U.fmt(d.d, 3) + '$',
        d.d < 0 ? 'Negativo: el píxel está <strong>dentro</strong>.' : 'Positivo: está <strong>fuera</strong>.',
        d.op === 0 ? 'La unión se queda con la distancia menor porque basta estar dentro de una.'
          : (d.op === 1 ? 'La intersección se queda con la mayor porque hay que estar dentro de las dos.'
            : 'La diferencia niega la segunda: estar dentro de A y <em>fuera</em> de B.')];
    },
    answer: function (d) { return U.fmt(d.d, 3) + ' · ' + (d.d < 0 ? 'dentro' : 'fuera'); }
  });

  p.exercise({
    title: 'Predice la imagen',
    level: 'medio',
    gen: function (r) {
      var dos = 'float a = length(p - vec2(-0.15, 0.0)) - 0.25;\nfloat b = length(p - vec2(0.15, 0.0)) - 0.25;\n';
      var casos = [
        { c: dos + 'float v = step(min(a, b), 0.0);',
          o: ['Los dos círculos solapados, unidos en una sola figura', 'Solo la zona común a los dos círculos, con forma de lente', 'El círculo izquierdo con un mordisco', 'Dos círculos separados que no se tocan'],
          por: 'El mínimo de dos distancias es negativo si lo es cualquiera de las dos: es la <strong>unión</strong>.' },
        { c: dos + 'float v = step(max(a, b), 0.0);',
          o: ['Solo la zona común a los dos círculos, con forma de lente', 'Los dos círculos solapados, unidos en una sola figura', 'El círculo izquierdo con un mordisco', 'Un anillo'],
          por: 'El máximo es negativo solo si las dos distancias lo son, es decir, dentro de los dos a la vez: la <strong>intersección</strong>.' },
        { c: dos + 'float v = step(max(a, -b), 0.0);',
          o: ['El círculo izquierdo con un mordisco en forma de arco a la derecha', 'Solo la zona común, con forma de lente', 'Los dos círculos unidos', 'Solo el círculo derecho'],
          por: '$-b$ es negativo fuera del círculo derecho. El máximo pide estar dentro del izquierdo y fuera del derecho: la <strong>diferencia</strong>.' },
        { c: 'vec3 c = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), step(0.0, p.x));',
          o: ['La mitad izquierda roja y la derecha azul, con un corte brusco en el centro', 'Un degradado suave de rojo a azul', 'La mitad izquierda azul y la derecha roja', 'Toda la pantalla morada'],
          por: '<code>step(0.0, p.x)</code> vale 0 a la izquierda y 1 a la derecha, sin términos medios: mix elige uno de los dos colores.' },
        { c: 'vec3 c = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), clamp(p.x + 0.5, 0.0, 1.0));',
          o: ['Un degradado de rojo a azul de izquierda a derecha, con los bordes de color liso', 'Mitad roja y mitad azul con un corte brusco', 'Toda la pantalla morada', 'Rayas rojas y azules'],
          por: 'El peso de mix crece de forma continua con $p_x$ entre $-0{,}5$ y $0{,}5$, y el clamp lo fija a 0 o a 1 fuera de ese tramo.' }
      ];
      var c = r.pick(casos);
      return { codigo: c.c, textos: c.o, orden: r.shuffle([0, 1, 2, 3]), por: c.por };
    },
    ask: function (d) {
      return 'Con <code>p</code> centrada en la pantalla y el resultado pintado en blanco donde valga 1 (o con el color <code>c</code>), ¿qué se ve?<pre class="shd__mini">' + d.codigo + '</pre>';
    },
    fields: function (d) { return [{ name: 'q', label: 'Se ve', opts: d.orden.map(function (i) { return { t: d.textos[i], v: String(i) }; }) }]; },
    sol: function () { return { q: '0' }; },
    hint: function () { return ['Con distancias: <code>min</code> une, <code>max</code> corta, y cambiar el signo es tomar el exterior.', 'Con mix: ¿el peso cambia de golpe o poco a poco?']; },
    steps: function (d) { return [d.por, 'Se ve: <strong>' + d.textos[0] + '</strong>.']; },
    answer: function (d) { return d.textos[0]; }
  });

  p.exercise({
    title: 'Escribe la operación',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { pide: 'la <strong>unión</strong> de las dos figuras', ref: 'min(dA, dB)' },
        { pide: 'la <strong>intersección</strong> de las dos', ref: 'max(dA, dB)' },
        { pide: 'la figura A con <strong>el agujero</strong> de B', ref: 'max(dA, -dB)' },
        { pide: 'la figura B con <strong>el agujero</strong> de A', ref: 'max(dB, -dA)' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Completa para obtener ' + d.pide + ':<br>' +
        '<pre class="shd__mini">float dA = length(p - vec2(-0.12, 0.0)) - 0.2;   // circulo\nfloat dB = length(p - vec2( 0.12, 0.0)) - 0.2;   // otro circulo\nfloat d  = <strong>???</strong> ;</pre>';
    },
    fields: [{ name: 'e', label: 'la expresión', w: 'wide' }],
    sol: function (d) { return { e: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.e || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) {
        return 'void mainImage(out vec4 color, in vec2 fragCoord){\n' +
          '  vec2 p = (fragCoord - 0.5*iResolution.xy) / iResolution.y;\n' +
          '  float dA = length(p - vec2(-0.12, 0.0)) - 0.2;\n' +
          '  float dB = length(p - vec2( 0.12, 0.0)) - 0.2;\n' +
          '  float d = ' + x + ';\n' +
          '  color = vec4(vec3(1.0 - smoothstep(0.0, 0.01, d)), 1.0);\n}';
      }
      var r = W.glslIguales(env(texto), env(d.ref), { tam: 40, tol: 5 });
      if (r.motivo === 'la respuesta no compila') {
        return { ok: false, msg: 'No compila. Las dos distancias se llaman <code>dA</code> y ' +
          '<code>dB</code>, con la A y la B en mayúscula.' };
      }
      if (!r.ok) return { ok: false, msg: 'Compila, pero no es la operación pedida. Recuerda: ' +
        'dentro es negativo, y por eso la unión es el mínimo.' };
      return { ok: true };
    },
    hint: function () {
      return 'Unión: la menor de las dos. Intersección: la mayor. Agujero: la mayor, pero cambiando ' +
        'el signo de la que hace de agujero.';
    },
    steps: function (d) { return ['Se pedía ' + d.pide + '.', 'La respuesta es <code>' + d.ref + '</code>.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Un <code>if</code> que depende de la posición del píxel divide el trabajo de la tarjeta y tira la mitad. Se decide con aritmética.',
    '<code>mix(a, b, t)</code> es la interpolación lineal, y con ella se elige color sin bifurcar —y con bordes suaves de regalo—.',
    'Componer una escena es apilar <code>mix</code>: cada uno es una capa, y el último queda encima.',
    'Con distancias, <code>min</code> es la <strong>unión</strong>, <code>max</code> la <strong>intersección</strong> y <code>max(a, -b)</code> la <strong>diferencia</strong>: las operaciones de conjuntos de lógica.',
    '<code>abs</code> es un espejo: <code>p.x = abs(p.x)</code> duplica simétricamente lo que dibujes.'
  ]);
});
