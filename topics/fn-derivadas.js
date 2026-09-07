/* Tema: Derivadas */
Course.topic('fn-derivadas', function (p) {

  p.text('Ya sabes calcular la pendiente de una recta: $m = \\frac{\\Delta y}{\\Delta x}$. Pero una ' +
    'curva no tiene una pendiente, tiene una <em>distinta en cada punto</em>. La <strong>derivada</strong> ' +
    'es la respuesta a la pregunta: ¿cuál es la pendiente exacta <em>aquí</em>?');

  p.section('De la secante a la tangente');

  p.text('La idea es un truco magnífico. La pendiente entre dos puntos sí sabemos calcularla: es la ' +
    'de la recta <strong>secante</strong>. Si acercamos el segundo punto al primero, la secante se va ' +
    'pareciendo cada vez más a la <strong>tangente</strong>. Y «acercar hasta el límite» es justo lo ' +
    'que sabemos hacer desde el tema anterior.');

  p.formula('f\'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}', 'definición de derivada',
    'Se dice: <em>«efe prima de a es igual al límite, cuando hache tiende a cero, de efe de a más ' +
    'hache, menos efe de a, partido por hache»</em>.<br><br>' +
    'Símbolo a símbolo: $f\'(a)$ «efe prima de a», la derivada · $\\lim$ «el límite» · ' +
    '$h \\to 0$ «cuando hache tiende a cero», es decir, según hache se hace pequeñísima.<br><br>' +
    'Y en cristiano: <em>«la pendiente en el punto a es a lo que se acerca la pendiente entre dos ' +
    'puntos cuando los junto»</em>.');

  p.text('Vale la pena desmontar esa fórmula, porque asusta más de lo que debe. El numerador ' +
    '$f(a+h)-f(a)$ es lo que <em>sube</em> la función entre los dos puntos; el denominador $h$ es lo ' +
    'que <em>avanza</em>. Subida partido por avance es la pendiente de siempre, la de la recta. Todo ' +
    'lo demás —el límite— solo dice qué pasa cuando junto los dos puntos hasta tocarse.');

  p.text('Y hay que hacerlo con un límite y no sustituyendo $h=0$ directamente porque, si lo ' +
    'sustituyes a lo bruto, queda $\\frac{0}{0}$: sin subida y sin avance no hay pendiente que ' +
    'calcular. Esa es exactamente la indeterminación que aprendiste a resolver en el tema anterior, ' +
    'y esta es la razón por la que hacía falta.');

  p.sub('Una vez a mano, para creérselo');

  p.text('Antes de fiarte de ninguna tabla, conviene ver salir una derivada de la definición. Vamos a ' +
    'por $f(x)=x^2$ en un punto cualquiera $a$. Se sustituye, se desarrolla el cuadrado y se simplifica:');

  p.formulas([
    '\\frac{f(a+h)-f(a)}{h} = \\frac{(a+h)^2 - a^2}{h}',
    '= \\frac{a^2 + 2ah + h^2 - a^2}{h} = \\frac{2ah + h^2}{h}',
    '= \\frac{h\\,(2a + h)}{h} = 2a + h'
  ], 'derivada de $x^2$ desde la definición');

  p.text('Fíjate en el paso decisivo: mientras $h$ no sea cero podemos <strong>dividir por $h$</strong> ' +
    'arriba y abajo, y la indeterminación desaparece. Ahora sí se puede hacer $h \\to 0$ sin problemas, ' +
    'y queda $f\'(a) = 2a$. Es decir, la derivada de $x^2$ es $2x$: en $x=3$ la pendiente vale 6, en ' +
    '$x=0$ vale 0 —el vértice, donde la parábola está plana— y a la izquierda sale negativa, que es la ' +
    'parte en la que baja. Todo cuadra con lo que ves.');

  p.note('Las derivadas se escriben de tres maneras y te vas a topar con las tres: $f\'(x)$ es la de ' +
    'Lagrange, la que usaremos aquí; $\\frac{dy}{dx}$ es la de Leibniz y es la que verás en Física, ' +
    'porque recuerda que aquello era una división; y $\\dot{y}$, con un punto encima, es la de Newton ' +
    'y solo se usa cuando se deriva respecto al tiempo. Dicen exactamente lo mismo.',
    null, 'Tres notaciones, una idea');

  p.demo({
    title: 'La secante se convierte en tangente',
    intro: 'Acerca el segundo punto al primero con el deslizador. Mira cómo la recta secante gira hasta apoyarse en la curva.',
    build: function (host, d) {
      var h = 2, a = 1;
      var f = function (x) { return 0.5 * x * x; };
      var fp = function (x) { return x; };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3, xmax: 5, ymin: -1.5, ymax: 8, height: 330,
        draw: function (g) {
          g.fn(f, { color: 0, w: 2.6 });
          var x1 = a, y1 = f(a), x2 = a + h, y2 = f(a + h);
          var msec = (y2 - y1) / h;
          // secante
          g.fn(function (x) { return y1 + msec * (x - x1); }, { color: 1, w: 2, dash: true });
          // tangente
          g.fn(function (x) { return y1 + fp(a) * (x - x1); }, { color: 2, w: 2.2, alpha: .85 });
          // triangulo del cociente incremental
          g.seg(x1, y1, x2, y1, { color: 3, w: 1.8 });
          g.seg(x2, y1, x2, y2, { color: 3, w: 1.8 });
          g.text((x1 + x2) / 2, y1 - 0.35, 'h = ' + U.fmt(h, 3), { align: 'center', color: 3, size: 12, box: true });
          g.text(x2 + 0.15, (y1 + y2) / 2, 'Δy = ' + U.fmt(y2 - y1, 3), { align: 'left', color: 3, size: 12, box: true });
          g.point(x1, y1, { color: 0, r: 6 });
          g.point(x2, y2, { color: 1, r: 5 });
        }
      });
      function paint() {
        var msec = (f(a + h) - f(a)) / h;
        out.set('Pendiente de la <span style="color:var(--c2)">secante</span>: ' +
          '$\\dfrac{f(' + U.fmt(a + h, 3) + ') - f(' + a + ')}{' + U.fmt(h, 3) + '} = ' + U.fmt(msec, 5) + '$<br>' +
          'Pendiente de la <span style="color:var(--c3)">tangente</span> (la derivada): $f\'(' + a + ') = ' + U.fmt(fp(a), 3) + '$<br>' +
          (Math.abs(h) < 0.05 ? '<strong style="color:var(--ok)">Prácticamente iguales: la secante ya es la tangente.</strong>'
            : 'Diferencia: $' + U.fmt(Math.abs(msec - fp(a)), 5) + '$. Sigue acercando $h$ a cero.'));
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'separación h', min: 0.01, max: 3, step: 0.01, value: h, dec: 2, on: function (v) { h = v; paint(); } });
      W.slider(row, { label: 'punto a', min: -2, max: 3, step: 0.25, value: a, dec: 2, on: function (v) { a = v; paint(); } });
      W.legend(host, [{ c: 0, t: '$f(x)=\\frac{1}{2}x^2$' }, { c: 1, t: 'secante' }, { c: 2, t: 'tangente' }]);
      paint();
    }
  });

  p.note('La derivada tiene dos lecturas y las dos importan: geométricamente es la <strong>pendiente ' +
    'de la tangente</strong>; físicamente es el <strong>ritmo instantáneo de cambio</strong>. Si $f$ es ' +
    'la posición, $f\'$ es la velocidad. Si $f$ es el número de contagiados, $f\'$ es la velocidad de ' +
    'contagio. Es la misma operación matemática.', 'ok', 'Dos caras de lo mismo');

  p.hist('Newton y Leibniz llegaron a esto de forma independiente hacia 1670, y se pasaron el resto ' +
    'de sus vidas discutiendo quién había sido primero. Newton lo llamaba <em>fluxiones</em> y pensaba ' +
    'en movimiento; Leibniz lo llamaba <em>cálculo diferencial</em> y pensaba en incrementos infinitamente ' +
    'pequeños. La notación que usamos hoy —$dy/dx$, el signo de integral— es toda de Leibniz, porque ' +
    'era mejor; la de Newton (el puntito encima) solo sobrevive en física.');

  /* ---------------------------------------------------------------- */
  p.section('Reglas de derivación');

  p.text('Acabas de ver que sacar una derivada de la definición se puede, pero es lento. La buena ' +
    'noticia es que solo hay que hacerlo <strong>una vez por cada tipo de función</strong>: alguien ' +
    'ya pasó por ese trabajo, y el resultado es la tabla siguiente. Con $x^2$ ya has hecho tú la ' +
    'tercera fila, así que la tabla no es magia: es trabajo hecho.');

  p.text('Estas son las que hacen falta en Bachillerato. No conviene memorizarlas de golpe; se ' +
    'aprenden solas usándolas, y las tres primeras filas cubren la mitad de los ejercicios:');

  p.table(['Función', 'Derivada'],
    [['$k$ (constante)', '$0$'],
     ['$x$', '$1$'],
     ['$x^n$', '$n\\,x^{n-1}$'],
     ['$\\sqrt{x}$', '$\\dfrac{1}{2\\sqrt{x}}$'],
     ['$e^x$', '$e^x$'],
     ['$a^x$', '$a^x \\ln a$'],
     ['$\\ln x$', '$\\dfrac{1}{x}$'],
     ['$\\operatorname{sen} x$', '$\\cos x$'],
     ['$\\cos x$', '$-\\operatorname{sen} x$'],
     ['$\\operatorname{tg} x$', '$1 + \\operatorname{tg}^2 x = \\dfrac{1}{\\cos^2 x}$']]);

  p.sub('Y las reglas para combinarlas');

  p.text('La tabla sirve para funciones sueltas, pero los ejercicios traen funciones montadas unas ' +
    'sobre otras. Estas cinco reglas dicen qué hacer en cada montaje:');

  p.formulas([
    '(f \\pm g)\' = f\' \\pm g\'',
    '(k\\,f)\' = k\\,f\'',
    '(f\\cdot g)\' = f\'g + fg\'',
    '\\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2}',
    '(f \\circ g)\' = f\'(g(x))\\cdot g\'(x)'
  ], 'suma · constante · producto · cociente · cadena',
    'La comilla se lee «prima» y significa «la derivada de».<br><br>' +
    'Línea a línea: <em>«la derivada de efe más o menos ge es efe prima más o menos ge prima»</em> · ' +
    '<em>«la derivada de una constante por efe es la constante por efe prima»</em> · ' +
    '<em>«la derivada de efe por ge es efe prima por ge, más efe por ge prima»</em> · ' +
    '<em>«la derivada de efe partido ge es efe prima por ge menos efe por ge prima, todo partido por ' +
    'ge al cuadrado»</em> · <em>«la derivada de efe compuesta con ge es efe prima evaluada en ge de ' +
    'equis, por ge prima de equis»</em>.<br><br>' +
    'El círculo $\\circ$ se dice «compuesta con»: $f \\circ g$ es «meter $g$ dentro de $f$».');

  p.text('Las dos primeras son las intuitivas: derivar respeta las sumas y las constantes salen ' +
    'fuera. Las otras tres no lo son, y ahí es donde se pierden los ejercicios.');

  p.note('La derivada de un producto <strong>no</strong> es el producto de las derivadas. Compruébalo ' +
    'con $f=g=x$: $(x\\cdot x)\' = (x^2)\' = 2x$, mientras que $1\\cdot 1 = 1$. La regla del producto ' +
    'tiene esos dos sumandos por una razón.', 'warn');

  p.text('La razón se ve con un rectángulo. Imagina uno cuyos lados miden $f$ y $g$ y que va ' +
    'creciendo con el tiempo; su área es $f\\cdot g$. Si en un instante el lado $f$ se estira un ' +
    'poquito, el área gana una tira de altura $g$; si el que se estira es $g$, gana una tira de ' +
    'anchura $f$. El área crece por los dos sitios a la vez, y por eso hay <strong>dos sumandos</strong>: ' +
    '$f\'g$ es lo que aporta el crecimiento de un lado y $fg\'$ lo que aporta el del otro.');

  p.sub('La regla de la cadena');

  p.text('Esta es la que más cuesta y la que más se usa, así que vamos despacio. Aparece cuando una ' +
    'función está <strong>metida dentro</strong> de otra: en $(3x^2+1)^5$ hay una potencia quinta por ' +
    'fuera y un polinomio por dentro; en $\\operatorname{sen}(2x)$ hay un seno por fuera y un $2x$ por dentro.');

  p.text('La idea es la de los engranajes. Si una rueda gira el triple de rápido que otra, y esa otra ' +
    'gira el doble que una tercera, la primera va seis veces más rápido que la tercera: los ritmos ' +
    '<em>se multiplican</em>. Una función compuesta es eso mismo. Lo de dentro cambia a un ritmo, lo ' +
    'de fuera reacciona a otro, y el ritmo total es el producto de los dos.');

  p.text('En la práctica se aplica en dos tiempos: <strong>deriva lo de fuera dejando lo de dentro ' +
    'intacto, y multiplica por la derivada de lo de dentro</strong>. Ese segundo factor es el que todo ' +
    'el mundo olvida, y es el que distingue un ejercicio bien hecho de uno mal hecho.');

  p.formula('\\left[(3x^2+1)^5\\right]\' = 5(3x^2+1)^4 \\cdot 6x = 30x(3x^2+1)^4',
    'la cadena, paso a paso',
    'Se lee: <em>«la derivada de, abre corchete, tres equis al cuadrado más uno, todo elevado a ' +
    'cinco, cierra corchete, es igual a cinco por tres equis al cuadrado más uno elevado a cuatro, ' +
    'por seis equis»</em>.<br><br>' +
    'De dónde sale cada trozo: el $5(\\ )^4$ es derivar la potencia de fuera <em>sin tocar lo de ' +
    'dentro</em>; el $6x$ es la derivada de lo de dentro, $3x^2+1$. El punto entre los dos es la ' +
    'multiplicación que exige la regla.');

  p.note('Un truco para no olvidar el segundo factor: pregúntate siempre <em>«¿lo de dentro es ' +
    'simplemente $x$?»</em>. Si lo es, su derivada vale 1 y no cambia nada. Si es cualquier otra cosa, ' +
    'hay factor que multiplicar. Por eso $(\\operatorname{sen} x)\' = \\cos x$ pero ' +
    '$(\\operatorname{sen} 2x)\' = 2\\cos 2x$.', 'ok', 'Cómo no olvidarse');

  p.demo({
    title: 'Una función y su derivada, a la vez',
    intro: 'Arriba la función, abajo su derivada. Fíjate en la relación: donde la función tiene un máximo o un mínimo, la derivada vale cero.',
    build: function (host, d) {
      var cual = 'cubica';
      var fns = {
        cubica: { f: function (x) { return 0.15 * x * x * x - 0.9 * x; }, d: function (x) { return 0.45 * x * x - 0.9; }, t: 'f(x)=0{,}15x^3-0{,}9x', dt: 'f\'(x)=0{,}45x^2-0{,}9' },
        seno: { f: Math.sin, d: Math.cos, t: 'f(x)=\\operatorname{sen} x', dt: 'f\'(x)=\\cos x' },
        cuad: { f: function (x) { return 0.4 * x * x - 1; }, d: function (x) { return 0.8 * x; }, t: 'f(x)=0{,}4x^2-1', dt: 'f\'(x)=0{,}8x' },
        exp: { f: function (x) { return Math.exp(0.5 * x) - 2; }, d: function (x) { return 0.5 * Math.exp(0.5 * x); }, t: 'f(x)=e^{0{,}5x}-2', dt: 'f\'(x)=0{,}5\\,e^{0{,}5x}' }
      };
      var out = W.readout(host, '');
      var p1 = W.plot(host, {
        xmin: -5, xmax: 5, ymin: -3.5, ymax: 3.5, height: 210,
        ylabel: 'f',
        handles: { X: { x: 1.5, y: 0, label: '', color: 2, constrain: function (h) { h.y = 0; h.x = U.clamp(h.x, -5, 5); } } },
        draw: function (g) {
          var F = fns[cual];
          g.fn(F.f, { color: 0, w: 2.6 });
          var x = g.h('X').x;
          g.vline(x, { color: 2, dash: true, w: 1.3 });
          g.point(x, F.f(x), { color: 0, r: 5.5 });
          g.fn(function (t) { return F.f(x) + F.d(x) * (t - x); }, { color: 2, w: 1.8, from: x - 2, to: x + 2 });
        }
      });
      var p2 = W.plot(host, {
        xmin: -5, xmax: 5, ymin: -3.5, ymax: 3.5, height: 210,
        ylabel: "f'",
        draw: function (g) {
          var F = fns[cual];
          g.fn(F.d, { color: 1, w: 2.6 });
          var x = p1.h('X').x;
          g.vline(x, { color: 2, dash: true, w: 1.3 });
          g.point(x, F.d(x), { color: 1, r: 5.5 });
          g.hline(0, { color: 'axis', w: 1 });
        }
      });
      p1.o.onDrag = function () { p2.render(); paint(); };
      function paint() {
        var F = fns[cual], x = p1.h('X').x;
        out.set('$' + F.t + '$ &nbsp;·&nbsp; $' + F.dt + '$<br>' +
          'En $x = ' + U.fmt(x, 2) + '$: &nbsp; $f(x) = ' + U.fmt(F.f(x), 3) + '$ &nbsp;·&nbsp; ' +
          '$f\'(x) = ' + U.fmt(F.d(x), 3) + '$ → la curva ' +
          (Math.abs(F.d(x)) < 0.05 ? '<strong>está horizontal</strong> (posible máximo o mínimo)'
            : (F.d(x) > 0 ? '<strong>sube</strong>' : '<strong>baja</strong>')));
      }
      W.chips(host, [
        { label: 'cúbica', value: 'cubica' }, { label: 'parábola', value: 'cuad' },
        { label: 'seno', value: 'seno' }, { label: 'exponencial', value: 'exp' }
      ], { value: 'cubica', on: function (v) { cual = v; p1.render(); p2.render(); paint(); } });
      W.hint(host, 'Arrastra el punto rojo del gráfico de arriba.');
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La recta tangente');

  p.text('Con la derivada ya se puede escribir la ecuación de la tangente en un punto: es una recta ' +
    'que pasa por $(a, f(a))$ con pendiente $f\'(a)$. Es la fórmula punto-pendiente de siempre.');

  p.formula('y = f(a) + f\'(a)\\,(x - a)', 'recta tangente en x = a',
    'Se lee: <em>«y es igual a efe de a, más efe prima de a, por equis menos a»</em>.<br><br>' +
    'Cada trozo tiene un porqué: $f(a)$ es la altura a la que está la curva en ese punto, $f\'(a)$ es ' +
    'la pendiente que lleva allí, y $(x-a)$ es lo que te alejas del punto. Altura de partida más ' +
    'pendiente por distancia recorrida: es la recta de toda la vida.');

  p.util('La derivada es, sin discusión, la herramienta más rentable del Bachillerato, porque ' +
    '<strong>«ritmo de cambio» describe media realidad</strong>. En un coche, la derivada de la ' +
    'posición es la velocidad y la de la velocidad es la aceleración —lo que mide el airbag para ' +
    'decidir si dispara—. En una epidemia, lo que se sigue en las noticias no es el número de ' +
    'contagiados sino su derivada: si la curva «se aplana» es que la derivada baja, aunque el total ' +
    'siga subiendo. En economía, el coste marginal de fabricar una unidad más es una derivada, y en ' +
    'eso se basa fijar un precio.');

  p.util('Y hay un uso que te rodea sin que se vea: buscar máximos y mínimos. Donde una función es ' +
    'máxima o mínima su tangente queda plana, es decir, <strong>su derivada vale cero</strong>, y eso ' +
    'convierte «encontrar lo mejor» en «resolver una ecuación». Un GPS que calcula la ruta más corta, ' +
    'una aerolínea que reparte plazas para ingresar lo máximo, una fábrica que busca el envase que ' +
    'gasta menos cartón y hasta el entrenamiento de una inteligencia artificial hacen esto mismo: ' +
    'derivar, igualar a cero y mirar. Es el tema siguiente, y el motivo de que este importe tanto.',
    'Utilidad: encontrar lo mejor');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Deriva un polinomio',
    level: 'basico',
    gen: function (r) {
      var c = [r.nz(-5, 5), r.nz(-6, 6), r.nz(-6, 6), r.pm(1, 9)];
      var x = r.pm(1, 4);
      var der = [3 * c[0], 2 * c[1], c[2]];
      return { c: c, der: der, x: x, val: ML.polyEval(der, x) };
    },
    ask: function (d) {
      return 'Si $f(x) = ' + ML.polyTex(d.c) + '$, calcula $f\'(' + d.x + ')$.';
    },
    fields: function (d) { return [{ name: 'v', label: "f'(" + d.x + ') =', w: 'tiny' }]; },
    sol: function (d) { return { v: d.val }; },
    hint: function () { return 'Cada $x^n$ pasa a $n\\,x^{n-1}$, y la constante desaparece. Después sustituye.'; },
    steps: function (d) {
      return ['Derivamos término a término: $f\'(x) = ' + ML.polyTex(d.der) + '$.',
        'La constante $' + d.c[3] + '$ desaparece: su derivada es cero.',
        'Sustituimos $x = ' + d.x + '$.',
        '$f\'(' + d.x + ') = ' + d.val + '$'];
    },
    answer: function (d) { return "f'(x) = " + '$' + ML.polyTex(d.der) + '$, y $f\'(' + d.x + ') = ' + d.val + '$'; }
  });

  p.exercise({
    title: 'Regla del producto',
    level: 'medio',
    gen: function (r) {
      // f = (ax+b)(cx+d)  ->  f' = a(cx+d) + c(ax+b)
      var a = r.nz(-5, 5), b = r.pm(1, 7), c = r.nz(-5, 5), e = r.pm(1, 7);
      var x = r.pm(0, 4);
      var val = a * (c * x + e) + c * (a * x + b);
      return { a: a, b: b, c: c, e: e, x: x, val: val };
    },
    ask: function (d) {
      return 'Sea $f(x) = \\left(' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) +
        '\\right)\\left(' + ML.termTex(d.c, 'x', 1, true) + ML.termTex(d.e, '', 0, false) +
        '\\right)$. Calcula $f\'(' + d.x + ')$.';
    },
    fields: function (d) { return [{ name: 'v', label: "f'(" + d.x + ') =', w: 'tiny' }]; },
    sol: function (d) { return { v: d.val }; },
    hint: function () { return '$(u\\cdot v)\' = u\'v + uv\'$. También puedes multiplicar primero y derivar después: sale lo mismo.'; },
    steps: function (d) {
      return ['Llamamos $u = ' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) +
        '$ y $v = ' + ML.termTex(d.c, 'x', 1, true) + ML.termTex(d.e, '', 0, false) + '$.',
        '$u\' = ' + d.a + '$ y $v\' = ' + d.c + '$.',
        '$f\' = u\'v + uv\' = ' + d.a + '\\left(' + ML.termTex(d.c, 'x', 1, true) + ML.termTex(d.e, '', 0, false) +
        '\\right) + ' + d.c + '\\left(' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + '\\right)$',
        'Sustituyendo $x = ' + d.x + '$: $f\'(' + d.x + ') = ' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Regla de la cadena',
    level: 'avanzado',
    gen: function (r) {
      // f = (ax^2 + b)^n  ->  f' = n(ax^2+b)^(n-1) * 2ax
      var a = r.nz(-4, 4), b = r.pm(1, 6), n = r.int(2, 4);
      var x = r.pm(1, 3);
      var inner = a * x * x + b;
      if (inner === 0) return null;
      var val = n * Math.pow(inner, n - 1) * 2 * a * x;
      if (Math.abs(val) > 1e7) return null;
      return { a: a, b: b, n: n, x: x, inner: inner, val: val };
    },
    ask: function (d) {
      return 'Sea $f(x) = \\left(' + ML.termTex(d.a, 'x', 2, true) + ML.termTex(d.b, '', 0, false) +
        '\\right)^{' + d.n + '}$. Calcula $f\'(' + d.x + ')$.';
    },
    fields: function (d) { return [{ name: 'v', label: "f'(" + d.x + ') =', w: 'wide' }]; },
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      return 'Deriva la potencia dejando el paréntesis tal cual, y multiplica por la derivada de dentro, que es $' +
        ML.termTex(2 * d.a, 'x', 1, true) + '$.';
    },
    steps: function (d) {
      var dentro = ML.termTex(d.a, 'x', 2, true) + ML.termTex(d.b, '', 0, false);
      return ['Función de fuera: elevar a $' + d.n + '$. Función de dentro: $' + dentro + '$.',
        'Derivada de fuera dejando lo de dentro quieto: $' + d.n + '\\left(' + dentro + '\\right)^{' + (d.n - 1) + '}$.',
        'Derivada de dentro: $' + ML.termTex(2 * d.a, 'x', 1, true) + '$.',
        'Se multiplican: $f\'(x) = ' + d.n + '\\left(' + dentro + '\\right)^{' + (d.n - 1) + '} \\cdot ' +
        ML.termTex(2 * d.a, 'x', 1, true) + '$.',
        'En $x = ' + d.x + '$: el paréntesis vale $' + d.inner + '$, así que ' +
        '$f\' = ' + d.n + '\\cdot ' + d.inner + '^{' + (d.n - 1) + '} \\cdot ' + (2 * d.a * d.x) + ' = ' + d.val + '$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Recta tangente',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-3, 3), b = r.pm(1, 6), c = r.pm(1, 8);
      var x = r.pm(0, 4);
      var fa = a * x * x + b * x + c;
      var m = 2 * a * x + b;
      return { a: a, b: b, c: c, x: x, fa: fa, m: m, n: fa - m * x };
    },
    ask: function (d) {
      return 'Halla la recta tangente a $f(x) = ' + ML.polyTex([d.a, d.b, d.c]) + '$ en $x = ' + d.x +
        '$. Da su pendiente y su ordenada en el origen.';
    },
    show: function (d, host) {
      W.plot(host, {
        xmin: d.x - 5, xmax: d.x + 5, ymin: d.fa - 12, ymax: d.fa + 12, height: 230,
        draw: function (g) {
          g.fn(function (t) { return d.a * t * t + d.b * t + d.c; }, { color: 0, w: 2.6 });
          g.fn(function (t) { return d.m * t + d.n; }, { color: 2, w: 2 });
          g.point(d.x, d.fa, { color: 1, r: 5.5 });
        }
      });
    },
    fields: [{ name: 'm', label: 'Pendiente', w: 'tiny' }, { name: 'n', label: 'Ordenada', w: 'tiny' }],
    sol: function (d) { return { m: d.m, n: d.n }; },
    hint: function (d) { return 'La pendiente es $f\'(' + d.x + ')$ y el punto de paso es $(' + d.x + ', ' + d.fa + ')$.'; },
    steps: function (d) {
      return ['$f\'(x) = ' + ML.termTex(2 * d.a, 'x', 1, true) + ML.termTex(d.b, '', 0, false) + '$',
        'Pendiente: $f\'(' + d.x + ') = ' + d.m + '$.',
        'Punto de paso: $f(' + d.x + ') = ' + d.fa + '$.',
        'Recta: $y = ' + d.fa + ' + ' + d.m + '(x - (' + d.x + '))$',
        'Desarrollando: $y = ' + ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) + '$.'];
    },
    answer: function (d) { return '$y = ' + ML.termTex(d.m, 'x', 1, true) + ML.termTex(d.n, '', 0, false) + '$'; }
  });

  p.keys([
    'La derivada es el límite del cociente incremental: la pendiente de la tangente.',
    'Dos lecturas de lo mismo: pendiente (geometría) y ritmo de cambio instantáneo (física).',
    '$(x^n)\' = n\\,x^{n-1}$ resuelve casi todo lo polinómico.',
    'Producto: $u\'v + uv\'$. Cociente: $\\frac{u\'v - uv\'}{v^2}$. No son el producto ni el cociente de las derivadas.',
    'Cadena: deriva lo de fuera dejando lo de dentro, y multiplica por la derivada de dentro.',
    'Tangente en $a$: $y = f(a) + f\'(a)(x-a)$.',
    'Donde hay máximo o mínimo, la derivada vale cero.'
  ]);
});
