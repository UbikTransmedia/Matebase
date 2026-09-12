/* Tema: Cálculo vectorial */
Course.topic('av-vectorial', function (p) {

  p.puente('Todo el cálculo que has visto trata funciones de <em>una</em> variable. Este bloque lo lleva a ' +
    'funciones de varias, y lo hace con dos herramientas ya conocidas: la derivada, que aquí se hace ' +
    '«de una variable cada vez», y los vectores del plano y del espacio, que sirven para juntar esas ' +
    'derivadas en un solo objeto. Si la regla de la cadena y el producto escalar están frescos, el ' +
    'bloque entero se sigue sin sobresaltos.', 'Por dónde empezamos');

  p.text('Pero la temperatura de una habitación depende de tres coordenadas, y la velocidad del viento ' +
    'es un vector distinto en cada punto. El <strong>cálculo vectorial</strong> extiende derivadas e ' +
    'integrales a esos casos.');

  p.section('Campos escalares y campos vectoriales');
  p.text('Hasta ahora una función devolvía un número por cada número que le dabas. Aquí damos el salto a ' +
    'funciones que asignan algo <em>a cada punto del espacio</em>, y hay dos sabores según lo que ' +
    'asignen. Si a cada punto le corresponde un número —la temperatura de una habitación, la presión ' +
    'de la atmósfera, la altura de un terreno— se llama campo escalar. Si le corresponde un vector ' +
    '—el viento, la corriente de un río, la fuerza en cada punto— se llama campo vectorial.');


  p.list([
    '<strong>Campo escalar</strong> $f(x,y)$: a cada punto le asigna un <em>número</em>. La temperatura, la altitud, la presión.',
    '<strong>Campo vectorial</strong> $\\vec{F}(x,y)$: a cada punto le asigna un <em>vector</em>. El viento, la corriente de un río, el campo eléctrico.'
  ]);

  p.section('Derivadas parciales y gradiente');

  p.text('Si $f$ depende de dos variables, se puede derivar respecto a cada una <strong>tratando la ' +
    'otra como constante</strong>. Eso es una <em>derivada parcial</em>.');

  p.formula('\\frac{\\partial f}{\\partial x}, \\qquad \\frac{\\partial f}{\\partial y}');

  p.text('Juntando las dos en un vector sale el <strong>gradiente</strong>, que es probablemente el ' +
    'objeto más útil de todo este tema:');

  p.formula('\\nabla f = \\left(\\frac{\\partial f}{\\partial x},\\ \\frac{\\partial f}{\\partial y}\\right)', 'el gradiente',
    'El triángulo invertido $\\nabla$ se llama «nabla» —por un arpa antigua con esa forma— y aquí se ' +
      'lee «gradiente de».<br><br>La $\\partial$ es una de redondeada y se dice «derivada parcial»: ' +
      '$\\frac{\\partial f}{\\partial x}$ es «derivada parcial de efe respecto de equis», y significa ' +
      'derivar tratando a las demás variables como si fueran números fijos.<br><br>Entera: <em>«el ' +
      'gradiente de efe es el vector formado por la derivada parcial de efe respecto de equis y la ' +
      'derivada parcial de efe respecto de i griega»</em>.');

  p.note('El gradiente apunta siempre en la dirección de <strong>máxima pendiente hacia arriba</strong>, ' +
    'y su módulo es esa pendiente. Si estás en una ladera con niebla y quieres subir lo más rápido ' +
    'posible, el gradiente te dice hacia dónde dar el paso. Además, es siempre ' +
    '<strong>perpendicular a las curvas de nivel</strong>.', 'ok', 'Qué significa el gradiente');

  p.text('Esa propiedad es la base del <em>descenso de gradiente</em>, el algoritmo con el que se ' +
    'entrena hoy prácticamente toda la inteligencia artificial: para minimizar una función, se dan ' +
    'pasitos en la dirección contraria al gradiente.');

  p.comprueba('Estás en una ladera donde el gradiente de la altura vale $(3, 0)$: apunta al este. ¿Hacia dónde caminas para no subir ni bajar?', [
    { t: 'Hacia el norte o el sur', ok: true, por: 'Perpendicular al gradiente se recorre la curva de nivel: la altura no cambia. Hacia el este se sube con pendiente 3; hacia el oeste se baja igual.' },
    { t: 'Hacia el oeste, en sentido contrario al gradiente', ok: false, por: 'Contra el gradiente es donde más se <em>baja</em>. Es el sentido del descenso de gradiente, no el de la curva de nivel.' },
    { t: 'En cualquier dirección: el gradiente solo mide la pendiente máxima', ok: false, por: 'Mide la pendiente máxima <em>y</em> su dirección. En dirección $\\vec u$ la pendiente es $\\nabla f\\cdot\\vec u$, que solo se anula si $\\vec u$ es perpendicular al gradiente.' }
  ]);

  p.ejemplo({
    title: 'Un gradiente con números',
    enunciado: 'Para $f(x, y) = x^2 + 3xy - y^2$, calcular el gradiente en $(1, 2)$, la máxima pendiente, la dirección de la curva de nivel y la pendiente en la dirección de $(1, 1)$.',
    pasos: [
      { t: '<strong>Parciales.</strong> Respecto de $x$, con $y$ como constante: $f_x = 2x + 3y$. Respecto de $y$: $f_y = 3x - 2y$. El término $3xy$ aporta a las dos, cada vez con la otra variable como coeficiente.', antes: 'Deriva $3xy$ respecto de $x$ tratando $y$ como un número. ¿Qué queda?' },
      { t: '<strong>En el punto.</strong> $\\nabla f(1, 2) = (2 + 6,\\ 3 - 4) = (8, -1)$.' },
      { t: '<strong>Máxima pendiente.</strong> $|\\nabla f| = \\sqrt{64 + 1} = \\sqrt{65} \\approx 8{,}06$, en la dirección de $(8, -1)$: casi hacia el este, ligeramente al sur.', antes: '¿Qué mide el módulo del gradiente?' },
      { t: '<strong>Curva de nivel.</strong> Perpendicular al gradiente: dirección $(1, 8)$, porque $(8, -1)\\cdot(1, 8) = 8 - 8 = 0$. Caminando por ahí, $f$ no cambia.', antes: 'Busca un vector perpendicular a $(8, -1)$.' },
      { t: '<strong>Pendiente en la dirección de $(1, 1)$.</strong> Se normaliza, $\\vec u = \\frac{1}{\\sqrt 2}(1, 1)$, y se hace el producto escalar: $\\nabla f\\cdot\\vec u = \\frac{8 - 1}{\\sqrt 2} = \\frac{7}{\\sqrt 2} \\approx 4{,}95$. Menor que $8{,}06$, como tiene que ser: la máxima solo se alcanza en la dirección del gradiente.' }
    ],
    cierre: 'Todo sale de dos derivadas de una variable y un producto escalar. El gradiente es la brújula: su dirección, hacia arriba; su módulo, cuánto; su perpendicular, el nivel; y su producto escalar con cualquier dirección, la pendiente en ella.'
  });

  p.demo({
    title: 'Campo escalar, curvas de nivel y gradiente',
    intro: 'El fondo son las curvas de nivel, como en un mapa topográfico. Haz clic en cualquier punto y verás el gradiente: siempre perpendicular al nivel y apuntando cuesta arriba.',
    predice: 'En el cuenco, si haces clic en $(2, 0)$, ¿hacia dónde apuntará la flecha: al centro o hacia fuera? ¿Y en la silla de montar, en el mismo punto?',
    build: function (host, d) {
      var tipo = 'cuenco';
      var puntos = [];
      var campos = {
        cuenco: {
          f: function (x, y) { return 0.2 * (x * x + y * y); },
          gx: function (x, y) { return 0.4 * x; }, gy: function (x, y) { return 0.4 * y; },
          t: 'f(x,y) = 0{,}2(x^2+y^2)', txt: 'Un cuenco. Las curvas de nivel son circunferencias y el gradiente apunta siempre hacia fuera, alejándose del mínimo.'
        },
        silla: {
          f: function (x, y) { return 0.2 * (x * x - y * y); },
          gx: function (x, y) { return 0.4 * x; }, gy: function (x, y) { return -0.4 * y; },
          t: 'f(x,y) = 0{,}2(x^2-y^2)', txt: 'Una silla de montar: sube en una dirección y baja en la otra. Las curvas de nivel son hipérbolas.'
        },
        ondas: {
          f: function (x, y) { return Math.sin(x) * Math.cos(y); },
          gx: function (x, y) { return Math.cos(x) * Math.cos(y); }, gy: function (x, y) { return -Math.sin(x) * Math.sin(y); },
          t: 'f(x,y) = \\operatorname{sen}(x)\\cos(y)', txt: 'Una huevera: montañas y valles alternándose. El gradiente se anula en cada cima y en cada valle.'
        }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: -4, ymax: 4, height: 360, equal: true,
        onClick: function (x, y) { puntos.push([x, y]); plot.render(); },
        draw: function (g) {
          var C = campos[tipo];
          // curvas de nivel por muestreo de la rejilla
          var ctx = g.ctx;
          var niveles = [];
          for (var k = -10; k <= 10; k++) niveles.push(k * 0.35);
          var paso = 3;
          for (var px = 0; px < g.W; px += paso) {
            for (var py = 0; py < g.H; py += paso) {
              var x = g.iX(px), y = g.iY(py);
              var v = C.f(x, y);
              var cercano = niveles.some(function (n) { return Math.abs(v - n) < 0.045; });
              if (cercano) {
                ctx.fillStyle = g.color('axis');
                ctx.globalAlpha = 0.4;
                ctx.fillRect(px, py, paso, paso);
                ctx.globalAlpha = 1;
              }
            }
          }
          puntos.forEach(function (P, i) {
            var gx = C.gx(P[0], P[1]), gy = C.gy(P[0], P[1]);
            var m = Math.hypot(gx, gy);
            if (m > 1e-6) {
              g.vec(P[0], P[1], P[0] + gx / m * 0.9, P[1] + gy / m * 0.9, { color: i % 6, w: 3 });
            }
            g.point(P[0], P[1], { color: i % 6, r: 5 });
          });
        }
      });
      function paint() {
        puntos = [];
        out.set('$' + campos[tipo].t + '$<br>' + campos[tipo].txt +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Haz clic para colocar puntos y ver el gradiente.</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'cuenco', value: 'cuenco' }, { label: 'silla de montar', value: 'silla' },
        { label: 'huevera', value: 'ondas' }
      ], { value: 'cuenco', on: function (v) { tipo = v; paint(); } });
      W.buttons(host, [{ t: '↺ Borrar puntos', on: function () { puntos = []; plot.render(); } }]);
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El gradiente apunta hacia donde algo crece más deprisa, y por eso es la brújula de casi todo lo ' +
    'que se optimiza hoy. En un mapa de temperaturas señala hacia el calor; en un modelo de ' +
    'aprendizaje automático señala hacia el error, y el entrenamiento consiste en caminar en sentido ' +
    'contrario. Entrenar un modelo no es otra cosa que repetir eso millones de veces: calcular el ' +
    'gradiente del error respecto de cada uno de sus parámetros y restarle un poco a cada uno. Está ' +
    'desarrollado en [[ia-que-es|aprender es ajustar números]].');

  p.section('Divergencia y rotacional');

  p.text('Con un campo <em>vectorial</em> hay dos preguntas naturales: ¿de aquí sale o entra materia? ' +
    '¿esto gira? Las responden dos operadores.');

  p.formulas([
    '\\operatorname{div}\\vec{F} = \\nabla\\cdot\\vec{F} = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y}',
    '\\operatorname{rot}\\vec{F} = \\nabla\\times\\vec{F}'
  ], 'divergencia',
    'Se lee: <em>«divergencia de efe es igual a nabla escalar efe»</em>, y el resultado es un número ' +
      'en cada punto, no un vector.<br><br>Qué mide, en una imagen: si pusieras una cajita en ese ' +
      'punto, la divergencia dice cuánto sale menos cuánto entra. Positiva significa que ahí hay una ' +
      '<em>fuente</em> —un grifo, un foco de calor—; negativa, un <em>sumidero</em>, un desagüe. Cero ' +
      'significa que todo lo que entra vuelve a salir.');

  p.list([
    'La <strong>divergencia</strong> es un número: mide cuánto «mana» el campo de cada punto. Positiva = fuente; negativa = sumidero; cero = incompresible.',
    'El <strong>rotacional</strong> es un vector: mide cuánto «gira» el campo alrededor de cada punto. Si es cero, el campo es <em>conservativo</em> y deriva de un potencial.'
  ]);

  p.demo({
    title: 'Fuentes, sumideros y remolinos',
    intro: 'Compara los campos. Fíjate en si las flechas salen de un punto, entran hacia él o giran a su alrededor.',
    predice: 'La cizalla $\\vec F = (y, 0)$ tiene todas las flechas paralelas al eje $x$. ¿Crees que su rotacional será cero? Imagina una ruedecita de palas puesta en el campo.',
    build: function (host, d) {
      var tipo = 'fuente';
      var campos = {
        fuente: { f: function (x, y) { return [x, y]; }, t: '\\vec{F} = (x, y)', div: '2', rot: '0', txt: '<strong>Fuente</strong>: divergencia positiva, todo sale del origen. No gira: rotacional cero.' },
        sumidero: { f: function (x, y) { return [-x, -y]; }, t: '\\vec{F} = (-x, -y)', div: '-2', rot: '0', txt: '<strong>Sumidero</strong>: divergencia negativa, todo converge al origen.' },
        remolino: { f: function (x, y) { return [-y, x]; }, t: '\\vec{F} = (-y, x)', div: '0', rot: '2', txt: '<strong>Remolino</strong>: divergencia cero (no sale ni entra nada) pero rotacional no nulo: gira.' },
        uniforme: { f: function () { return [1, 0.4]; }, t: '\\vec{F} = (1,\\ 0{,}4)', div: '0', rot: '0', txt: 'Campo <strong>uniforme</strong>: ni fuentes ni giro. Divergencia y rotacional nulos.' },
        cizalla: { f: function (x, y) { return [y, 0]; }, t: '\\vec{F} = (y, 0)', div: '0', rot: '-1', txt: '<strong>Cizalla</strong>: las flechas son paralelas y aun así hay rotacional. Una ruedecita puesta ahí giraría, porque el campo es más fuerte arriba que abajo.' }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3, xmax: 3, ymin: -3, ymax: 3, height: 340, equal: true,
        draw: function (g) {
          var F = campos[tipo].f;
          for (var i = 0; i <= 12; i++) {
            for (var j = 0; j <= 12; j++) {
              var x = -3 + 6 * i / 12, y = -3 + 6 * j / 12;
              var v = F(x, y);
              var m = Math.hypot(v[0], v[1]);
              if (m < 1e-6) continue;
              var L = 0.18 + 0.12 * Math.min(2, m);
              g.vec(x, y, x + L * v[0] / m, y + L * v[1] / m, { color: 0, w: 1.8, alpha: .85 });
            }
          }
        }
      });
      function paint() {
        var C = campos[tipo];
        out.set('$' + C.t + '$ &nbsp;·&nbsp; $\\operatorname{div}\\vec{F} = ' + C.div + '$ &nbsp;·&nbsp; ' +
          '$\\operatorname{rot}\\vec{F} = ' + C.rot + '$<br>' + C.txt);
        plot.render();
      }
      W.chips(host, [
        { label: 'fuente', value: 'fuente' }, { label: 'sumidero', value: 'sumidero' },
        { label: 'remolino', value: 'remolino' }, { label: 'uniforme', value: 'uniforme' },
        { label: 'cizalla', value: 'cizalla' }
      ], { value: 'fuente', on: function (v) { tipo = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.note('Esos teoremas relacionan una integral sobre una región con otra sobre su borde, así que hace ' +
    'falta saber integrar sobre una región del plano o del espacio, no solo sobre un intervalo. Eso es ' +
    '[[av-integrales-multiples|las integrales dobles y triples]], y allí aparece la idea que lo hace ' +
    'manejable: integrar dos veces seguidas, una variable cada vez.',
    null, 'Integrar sobre una región');

  p.section('Los grandes teoremas integrales');

  p.text('Los tres resultados que cierran el cálculo vectorial dicen todos <strong>lo mismo con ' +
    'distinto ropaje</strong>: lo que ocurre <em>dentro</em> de una región queda determinado por lo ' +
    'que pasa en su <em>frontera</em>.');

  p.formulas([
    '\\int_a^b F\'(x)\\,dx = F(b) - F(a) \\quad \\text{(Barrow)}',
    '\\oint_C \\vec{F}\\cdot d\\vec{r} = \\iint_D \\operatorname{rot}\\vec{F}\\;dA \\quad \\text{(Green / Stokes)}',
    '\\oiint_S \\vec{F}\\cdot d\\vec{S} = \\iiint_V \\operatorname{div}\\vec{F}\\;dV \\quad \\text{(Gauss)}'
  ], 'el patrón común de los grandes teoremas',
    'Todos los teoremas integrales dicen lo mismo con distinto disfraz, y esta línea es la versión ' +
      'más sencilla: la regla de Barrow.<br><br>Se lee: <em>«la integral entre a y be de efe prima de ' +
      'equis, diferencial de equis, es igual a efe de be menos efe de a»</em>.<br><br>El patrón: ' +
      '<strong>lo que ocurre dentro de una región queda determinado por lo que pasa en su ' +
      'frontera</strong>. Aquí el interior es el intervalo y la frontera son sus dos extremos; en ' +
      'Green y Stokes el interior es una superficie y la frontera, la curva que la rodea.');

  p.text('Barrow relaciona un intervalo con sus dos extremos; Stokes, una superficie con su borde; ' +
    'Gauss, un volumen con su superficie. Los tres son casos particulares de un único teorema general ' +
    'de Stokes, que en notación de formas diferenciales se escribe simplemente $\\int_{\\partial\\Omega}\\omega = \\int_\\Omega d\\omega$.');

  p.hist('Estas herramientas nacieron para la física del siglo XIX. Maxwell reunió en 1865 toda la ' +
    'electricidad y el magnetismo conocidos en cuatro ecuaciones escritas con divergencias y ' +
    'rotacionales, y al combinarlas obtuvo una ecuación de ondas cuya velocidad coincidía con la de la ' +
    'luz medida en laboratorio. De ahí dedujo que la luz <em>es</em> una onda electromagnética. Es ' +
    'probablemente la predicción teórica más espectacular de la historia de la ciencia, y salió de ' +
    'manipular estos operadores.');

  p.trampas([
    { e: 'Derivar respecto de $x$ y «olvidar» que $y$ sigue ahí', por: '$\\partial_x(3xy) = 3y$, no 3. La otra variable se trata como constante, pero una constante que multiplica se queda.' },
    { e: 'Creer que el gradiente apunta hacia el mínimo', por: 'Apunta cuesta <em>arriba</em>. Para bajar se va en contra: por eso el descenso de gradiente lleva un signo menos.' },
    { e: '«Flechas paralelas, luego rotacional cero»', por: 'La cizalla $(y, 0)$ tiene todas las flechas paralelas y rotacional $-1$: el campo es más fuerte arriba que abajo y una ruedecita giraría.' },
    { e: 'Confundir divergencia (número) con rotacional (vector)', por: 'La divergencia responde «¿sale o entra?» y es un escalar. El rotacional responde «¿gira?» y es un vector, aunque en el plano solo importe su componente $z$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('Estos teoremas son las ecuaciones de Maxwell, y las ecuaciones de Maxwell son la razón de que ' +
    'exista la electricidad tal como la usamos, la radio, el wifi y la luz entendida como onda. ' +
    'Maxwell las escribió hacia 1865 y de ellas dedujo, sin haberlas visto nunca, que debían existir ' +
    'ondas electromagnéticas viajando a la velocidad de la luz. Hertz las produjo en un laboratorio ' +
    'veinte años después. Prácticamente toda la tecnología del siglo XX salió de ahí.');

  p.section('Practica');

  p.exercise({
    title: '¿Campo escalar o campo vectorial?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'La temperatura en cada punto de una habitación', ok: 'esc' },
        { t: 'La velocidad del viento en cada punto de la atmósfera', ok: 'vec' },
        { t: 'La altitud de cada punto de un mapa', ok: 'esc' },
        { t: 'La fuerza de la gravedad en cada punto alrededor de la Tierra', ok: 'vec' },
        { t: 'La presión en cada punto del océano', ok: 'esc' },
        { t: 'La corriente de un río en cada punto', ok: 'vec' },
        { t: 'El gradiente de la temperatura en cada punto', ok: 'vec' },
        { t: 'La divergencia del viento en cada punto', ok: 'esc' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return '<em>' + d.t + '</em>. ¿Es un campo escalar o vectorial?'; },
    fields: [{ name: 'q', label: 'Es un campo', opts: [{ t: 'escalar', v: 'esc' }, { t: 'vectorial', v: 'vec' }] }],
    sol: function (d) { return { q: d.ok }; },
    hint: function () { return '¿Lo que se asigna a cada punto es un número o una flecha? Ojo: el gradiente de un escalar es un vector, y la divergencia de un vector es un escalar.'; },
    steps: function (d) { return [d.ok === 'esc' ? 'A cada punto le corresponde un <strong>número</strong>: campo escalar.' : 'A cada punto le corresponde un <strong>vector</strong>, con dirección y módulo: campo vectorial.']; },
    answer: function (d) { return d.ok === 'esc' ? 'Escalar' : 'Vectorial'; }
  });

  p.exercise({
    title: 'Derivadas parciales',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-5, 5), b = r.nz(-5, 5), c = r.nz(-5, 5);
      var x = r.pm(1, 3), y = r.pm(1, 3);
      // f = a x^2 + b x y + c y^2   ->  fx = 2a x + b y ,  fy = b x + 2c y
      return { a: a, b: b, c: c, x: x, y: y, fx: 2 * a * x + b * y, fy: b * x + 2 * c * y };
    },
    ask: function (d) {
      return 'Sea $f(x,y) = ' + ML.termTex(d.a, 'x', 2, true) + ML.termTex(d.b, 'xy', 1, false) +
        ML.termTex(d.c, 'y', 2, false) + '$. Calcula las dos derivadas parciales en el punto $(' +
        d.x + ', ' + d.y + ')$.';
    },
    fields: [{ name: 'fx', label: '∂f/∂x', w: 'tiny' }, { name: 'fy', label: '∂f/∂y', w: 'tiny' }],
    sol: function (d) { return { fx: d.fx, fy: d.fy }; },
    tol: 1e-6,
    hint: function () { return 'Para $\\partial f/\\partial x$, la $y$ se trata como si fuera un número.'; },
    steps: function (d) {
      return ['Derivando respecto a $x$ (con $y$ constante): $\\dfrac{\\partial f}{\\partial x} = ' +
        ML.termTex(2 * d.a, 'x', 1, true) + ML.termTex(d.b, 'y', 1, false) + '$.',
        'Derivando respecto a $y$ (con $x$ constante): $\\dfrac{\\partial f}{\\partial y} = ' +
        ML.termTex(d.b, 'x', 1, true) + ML.termTex(2 * d.c, 'y', 1, false) + '$.',
        'En $(' + d.x + ', ' + d.y + ')$: $\\partial_x f = ' + d.fx + '$ y $\\partial_y f = ' + d.fy + '$.',
        'El gradiente en ese punto es $\\nabla f = (' + d.fx + ', ' + d.fy + ')$, y su módulo $' +
        U.fmt(Math.hypot(d.fx, d.fy), 4) + '$ es la máxima pendiente.'];
    },
    answer: function (d) { return '∇f = (' + d.fx + ', ' + d.fy + ')'; }
  });

  p.exercise({
    title: 'Módulo del gradiente',
    level: 'medio',
    gen: function (r) {
      var pares = [[3, 4], [6, 8], [5, 12], [8, 15], [9, 12]];
      var pr = r.pick(pares);
      var a = pr[0] * r.sign(), b = pr[1] * r.sign();
      return { a: a, b: b, mod: Math.hypot(a, b) };
    },
    ask: function (d) {
      return 'En un punto, el gradiente de un campo escalar vale $\\nabla f = (' + d.a + ', ' + d.b +
        ')$. ¿Cuál es la máxima pendiente que se puede subir desde ahí?';
    },
    fields: [{ name: 'v', label: 'Máxima pendiente', w: 'tiny' }],
    sol: function (d) { return { v: d.mod }; },
    tol: 1e-6,
    hint: function () { return 'La máxima pendiente es el <strong>módulo</strong> del gradiente.'; },
    steps: function (d) {
      return ['El gradiente apunta en la dirección de máxima subida, y su módulo <em>es</em> esa pendiente.',
        '$|\\nabla f| = \\sqrt{' + (d.a * d.a) + ' + ' + (d.b * d.b) + '} = ' + d.mod + '$',
        'Y en la dirección contraria, $-\\nabla f$, se baja lo más deprisa posible: eso es el descenso de gradiente.'];
    },
    answer: function (d) { return String(d.mod); }
  });

  p.exercise({
    title: 'Divergencia',
    level: 'avanzado',
    gen: function (r) {
      var a = r.nz(-5, 5), b = r.nz(-5, 5);
      var x = r.pm(1, 3), y = r.pm(1, 3);
      // F = (a x^2, b y^2)  ->  div = 2a x + 2b y
      return { a: a, b: b, x: x, y: y, div: 2 * a * x + 2 * b * y };
    },
    ask: function (d) {
      return 'Calcula la divergencia del campo $\\vec{F} = \\left(' + ML.termTex(d.a, 'x', 2, true) +
        ',\\ ' + ML.termTex(d.b, 'y', 2, true) + '\\right)$ en el punto $(' + d.x + ', ' + d.y + ')$.';
    },
    fields: [{ name: 'v', label: 'Divergencia', w: 'tiny' }],
    sol: function (d) { return { v: d.div }; },
    tol: 1e-6,
    hint: function () { return '$\\operatorname{div}\\vec F = \\frac{\\partial F_1}{\\partial x} + \\frac{\\partial F_2}{\\partial y}$: cada componente se deriva respecto a su propia variable.'; },
    steps: function (d) {
      return ['$\\dfrac{\\partial F_1}{\\partial x} = ' + ML.termTex(2 * d.a, 'x', 1, true) + '$',
        '$\\dfrac{\\partial F_2}{\\partial y} = ' + ML.termTex(2 * d.b, 'y', 1, true) + '$',
        'Sumando y sustituyendo el punto: $' + (2 * d.a * d.x) + ' + (' + (2 * d.b * d.y) + ') = ' + d.div + '$',
        d.div > 0 ? 'Divergencia positiva: en ese punto el campo actúa como una <strong>fuente</strong>.'
          : (d.div < 0 ? 'Divergencia negativa: es un <strong>sumidero</strong>.'
            : 'Divergencia cero: ahí el campo es incompresible.')];
    },
    answer: function (d) { return String(d.div); }
  });

  p.exercise({
    title: 'Rotacional en el plano',
    level: 'avanzado',
    gen: function (r) {
      var a = r.nz(-5, 5), b = r.nz(-5, 5);
      // F = (a y, b x)  ->  rot_z = dF2/dx - dF1/dy = b - a
      return { a: a, b: b, rot: b - a };
    },
    ask: function (d) {
      return 'Calcula la componente $z$ del rotacional del campo plano ' +
        '$\\vec{F} = \\left(' + ML.termTex(d.a, 'y', 1, true) + ',\\ ' + ML.termTex(d.b, 'x', 1, true) +
        '\\right)$.<br><span style="font-size:0.875rem;color:var(--ink-faint)">Recuerda: ' +
        '$\\operatorname{rot}_z = \\frac{\\partial F_2}{\\partial x} - \\frac{\\partial F_1}{\\partial y}$.</span>';
    },
    fields: [{ name: 'v', label: 'Rotacional', w: 'tiny' }],
    sol: function (d) { return { v: d.rot }; },
    tol: 1e-6,
    hint: function () { return 'Deriva la segunda componente respecto a $x$ y réstale la derivada de la primera respecto a $y$.'; },
    steps: function (d) {
      return ['$\\dfrac{\\partial F_2}{\\partial x} = ' + d.b + '$',
        '$\\dfrac{\\partial F_1}{\\partial y} = ' + d.a + '$',
        '$\\operatorname{rot}_z = ' + d.b + ' - (' + d.a + ') = ' + d.rot + '$',
        d.rot === 0 ? 'Rotacional nulo: el campo es <strong>conservativo</strong> y deriva de un potencial.'
          : 'Rotacional no nulo: el campo tiene giro y <strong>no</strong> es conservativo.'];
    },
    answer: function (d) { return String(d.rot); }
  });

  p.keys([
    'Campo escalar: un número en cada punto. Campo vectorial: un vector en cada punto.',
    'Derivada parcial: se deriva respecto a una variable tratando las demás como constantes.',
    'El <strong>gradiente</strong> apunta a la máxima subida, su módulo es esa pendiente y es perpendicular a las curvas de nivel.',
    'Descenso de gradiente: la base del entrenamiento de casi toda la IA actual.',
    'Divergencia (escalar): fuentes y sumideros. Rotacional (vector): giro.',
    'Rotacional cero ⟹ campo conservativo, deriva de un potencial.',
    'Barrow, Green-Stokes y Gauss dicen lo mismo: el interior queda determinado por la frontera.'
  ]);
});
