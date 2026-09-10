/* Tema: Derivadas */
Course.topic('fn-derivadas', function (p) {

  p.puente('Ya sabes calcular la pendiente de una recta: $m = \\frac{\\Delta y}{\\Delta x}$. Y sabes ' +
    'resolver la indeterminación $\\frac{0}{0}$ simplificando un factor. Las dos cosas se juntan ' +
    'aquí: una curva no tiene una pendiente, tiene una <em>distinta en cada punto</em>, y para ' +
    'calcularla hay que hacer un cociente de incrementos con los dos incrementos tendiendo a cero. La ' +
    '<strong>derivada</strong> es la respuesta a la pregunta: ¿cuál es la pendiente exacta <em>aquí</em>?');

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
    predice: 'Con $f(x) = \\frac{1}{2}x^2$, $a = 1$ y $h = 2$: la secante une $(1, 0{,}5)$ con $(3, 4{,}5)$. Calcula su pendiente. Al reducir $h$, ¿bajará hacia 1 o subirá?',
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
     ['$\\operatorname{tg} x$', '$1 + \\operatorname{tg}^2 x = \\dfrac{1}{\\cos^2 x}$'],
     ['$\\operatorname{arcsen} x$', '$\\dfrac{1}{\\sqrt{1 - x^2}}$'],
     ['$\\arccos x$', '$\\dfrac{-1}{\\sqrt{1 - x^2}}$'],
     ['$\\operatorname{arctg} x$', '$\\dfrac{1}{1 + x^2}$']]);

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

  p.comprueba('¿Cuál es la derivada de $f(x) = x^2\\cdot e^x$?', [
    { t: '$2x\\cdot e^x$', ok: false, por: 'Es el producto de las derivadas, y eso no vale. Faltan los dos sumandos de la regla del producto.' },
    { t: '$2x\\,e^x + x^2 e^x$', ok: true, por: '$u\'v + uv\'$ con $u = x^2$ y $v = e^x$: $2x\\cdot e^x + x^2\\cdot e^x$. Se puede sacar factor común: $e^x(2x + x^2)$.' },
    { t: '$2x + e^x$', ok: false, por: 'Eso sería derivar una <em>suma</em>. Aquí hay un producto: cada factor aporta un sumando en el que solo él está derivado.' }
  ]);

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

  p.ejemplo({
    title: 'Una derivada con tres reglas a la vez',
    enunciado: 'Derivar $f(x) = \\dfrac{\\operatorname{sen}(3x)}{x^2 + 1}$.',
    pasos: [
      { t: '<strong>Ver la estructura.</strong> Por fuera es un <em>cociente</em>: $u = \\operatorname{sen}(3x)$ arriba y $v = x^2 + 1$ abajo. Y $u$ es a su vez una composición: seno de algo que no es $x$.', antes: '¿Qué es lo último que se hace al calcular $f(x)$: una suma, un producto, un cociente?' },
      { t: '<strong>Derivar las piezas.</strong> $u\' = \\cos(3x)\\cdot 3$ por la regla de la cadena (lo de dentro es $3x$, no $x$). $v\' = 2x$.', antes: 'Deriva $\\operatorname{sen}(3x)$. ¿Por qué factor hay que multiplicar?' },
      { t: '<strong>Regla del cociente.</strong> $f\' = \\dfrac{u\'v - uv\'}{v^2} = \\dfrac{3\\cos(3x)\\,(x^2 + 1) - \\operatorname{sen}(3x)\\cdot 2x}{(x^2 + 1)^2}$.', antes: 'Monta $\\frac{u\'v - uv\'}{v^2}$: ¿qué va restando a qué?' },
      { t: '<strong>Comprobar en un punto.</strong> En $x = 0$: $f\'(0) = \\dfrac{3\\cdot 1\\cdot 1 - 0}{1} = 3$. Tiene sentido: cerca de 0, $\\operatorname{sen}(3x) \\approx 3x$ y el denominador vale casi 1, así que $f$ se parece a $3x$, de pendiente 3.' }
    ],
    cierre: 'Se trabaja de fuera hacia dentro: primero se reconoce la operación exterior (aquí el cociente), y cada pieza se deriva con su propia regla. No hay que hacerlo todo de golpe.'
  });

  p.demo({
    title: 'Una función y su derivada, a la vez',
    intro: 'Arriba la función, abajo su derivada. Fíjate en la relación: donde la función tiene un máximo o un mínimo, la derivada vale cero.',
    predice: 'Elige «parábola», $f(x) = 0{,}4x^2 - 1$. Antes de arrastrar: ¿en qué $x$ estará plana? ¿Y a la izquierda de ese punto, la derivada será positiva o negativa?',
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
  p.sub('Derivación logarítmica');

  p.text('Hay funciones que no encajan en ninguna regla: $x^x$ no es una potencia, porque el exponente no ' +
    'es fijo, ni una exponencial, porque la base tampoco lo es. El truco es tomar logaritmos antes de ' +
    'derivar: el logaritmo baja el exponente y convierte la potencia en un producto, que sí se sabe derivar.');

  p.formula('y = f(x)^{g(x)} \\ \\Rightarrow\\ \\ln y = g(x)\\ln f(x) \\ \\Rightarrow\\ \\frac{y\'}{y} = g\'(x)\\ln f(x) + g(x)\\,\\frac{f\'(x)}{f(x)}',
    'derivación logarítmica',
    'Se toman logaritmos a los dos lados, se deriva cada uno —el izquierdo, con la regla de la cadena, ' +
      'da $\\frac{y\'}{y}$— y al final se despeja $y\'$ multiplicando por $y$.<br><br>Con $y = x^x$: ' +
      '$\\ln y = x\\ln x$, así que $\\frac{y\'}{y} = \\ln x + 1$ e $y\' = x^x(\\ln x + 1)$.');

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

  p.section('Rolle y el valor medio');

  p.text('Hay dos teoremas que parecen una obviedad dibujada y que sostienen buena parte de lo que ' +
    'viene después. Conviene verlos ahora, porque son la garantía de que las cuentas con derivadas ' +
    'dicen algo sobre la función y no solo sobre un punto suelto.');

  p.sub('El teorema de Rolle');

  p.text('Si una función continua sale de una altura y vuelve a la misma altura, en algún momento ' +
    'tuvo que dejar de subir para empezar a bajar (o al revés). En ese momento la tangente está ' +
    'horizontal.');

  p.formula('f(a) = f(b) \\ \\Longrightarrow\\ \\exists\\,c \\in (a,b) : f\'(c) = 0',
    'teorema de Rolle',
    'Se dice: <em>«si efe de a es igual a efe de be, entonces existe un ce, perteneciente al ' +
      'intervalo abierto a be, tal que efe prima de ce es igual a cero»</em>.<br><br>El símbolo ' +
      '$\\exists$ es el cuantificador existencial de [[lg-proposiciones|la lógica]]: «existe al menos un». Los dos puntos ' +
      'se leen «tal que».<br><br>Fíjate en lo que <strong>no</strong> dice: no dice cuántos hay, ni ' +
      'dónde están, ni cómo encontrarlos. Solo que hay al menos uno. Es un teorema de existencia, y ' +
      'aun así resuelve muchas cosas.');

  p.text('Hacen falta las tres condiciones —continua en $[a,b]$, derivable en $(a,b)$ y con los ' +
    'extremos a la misma altura— y ninguna sobra. La función $|x|$ en $[-1,1]$ empieza y acaba en 1, ' +
    'es continua, y su derivada no se anula en ningún punto: falla porque en el cero tiene un pico y ' +
    'no es derivable.');

  p.sub('El teorema del valor medio');

  p.text('Es Rolle, pero inclinado. Si en un viaje de dos horas has recorrido 180 km, tu velocidad ' +
    'media ha sido 90 km/h; y por muchos frenazos y acelerones que hayas dado, <strong>en algún ' +
    'instante concreto el velocímetro marcaba exactamente 90</strong>. No puedes haber ido siempre ' +
    'por encima ni siempre por debajo de tu propia media.');

  p.formula('\\exists\\,c \\in (a,b) : f\'(c) = \\frac{f(b) - f(a)}{b - a}',
    'teorema del valor medio (Lagrange)',
    'Se dice: <em>«existe un ce en el intervalo abierto a be tal que efe prima de ce es igual a efe ' +
      'de be menos efe de a, partido por be menos a»</em>.<br><br>El lado derecho es la pendiente de ' +
      'la recta que une los dos extremos de la curva: la <strong>media</strong>. El lado izquierdo es ' +
      'una pendiente <strong>instantánea</strong>. El teorema dice que en algún punto coinciden, o ' +
      'sea, que la tangente en ese punto es paralela a la cuerda.');

  p.demo({
    title: 'La tangente paralela a la cuerda',
    intro: 'La recta gris une los dos extremos. Mueve los extremos y busca dónde la tangente (en color) queda paralela a ella: el teorema garantiza que ese punto existe siempre.',
    predice: 'Si colocas los dos extremos a la misma altura, la cuerda queda horizontal. ¿Qué pendiente tendrá entonces la tangente paralela? ¿De qué teorema es eso?',
    build: function (host, d) {
      var f = function (x) { return 0.35 * x * x * x - 1.6 * x + 0.5; };
      var fp = function (x) { return 1.05 * x * x - 1.6; };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3, xmax: 3, ymin: -4, ymax: 4, height: 280,
        handles: {
          A: { x: -2, y: 0, label: 'a', color: 2, constrain: function (h) { h.y = f(h.x); h.x = U.clamp(h.x, -2.8, 2.8); } },
          B: { x: 2, y: 0, label: 'b', color: 2, constrain: function (h) { h.y = f(h.x); h.x = U.clamp(h.x, -2.8, 2.8); } }
        },
        draw: function (g) {
          var a = g.h('A').x, b = g.h('B').x;
          if (b < a) { var t = a; a = b; b = t; }
          g.fn(f, { color: 0, w: 2.6 });
          g.seg(a, f(a), b, f(b), { color: 'axis', w: 2, dash: true });
          if (b - a > 0.05) {
            var m = (f(b) - f(a)) / (b - a);
            // resolver 1.05 c^2 - 1.6 = m  dentro de (a,b)
            var arg = (m + 1.6) / 1.05;
            if (arg >= 0) {
              var raiz = Math.sqrt(arg);
              [raiz, -raiz].forEach(function (c) {
                if (c > a && c < b) {
                  g.fn(function (x) { return f(c) + m * (x - c); },
                    { color: 1, w: 2, from: c - 1.2, to: c + 1.2 });
                  g.point(c, f(c), { color: 1, r: 6 });
                }
              });
            }
          }
        },
        onDrag: function () { paint(); }
      });
      function paint() {
        var a = plot.h('A').x, b = plot.h('B').x;
        if (b < a) { var t = a; a = b; b = t; }
        var m = (b - a > 0.05) ? (f(b) - f(a)) / (b - a) : 0;
        var arg = (m + 1.6) / 1.05, cs = [];
        if (arg >= 0) {
          var raiz = Math.sqrt(arg);
          [raiz, -raiz].forEach(function (c) { if (c > a && c < b) cs.push(U.fmt(c, 4)); });
        }
        out.set('Intervalo: $[' + U.fmt(a, 2) + ',\\ ' + U.fmt(b, 2) + ']$<br>' +
          'Pendiente media (la cuerda): $' + U.fmt(m, 4) + '$<br>' +
          'Punto' + (cs.length === 1 ? '' : 's') + ' donde la tangente vale eso: $c = ' +
          (cs.length ? cs.join(',\\ ') : '—') + '$<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">Por estrecho o ancho que hagas el ' +
          'intervalo, siempre hay al menos uno. Eso es exactamente lo que afirma el teorema.</span>');
        plot.render();
      }
      W.legend(host, [
        { c: 0, t: 'la función' },
        { c: 'axis', t: 'la cuerda entre los extremos' },
        { c: 1, t: 'la tangente paralela a ella' }
      ]);
      paint();
    }
  });

  p.util('El teorema del valor medio es la base legal de los <strong>radares de tramo</strong>. La ' +
    'cámara no mide tu velocidad instantánea: mide cuánto has tardado en recorrer una distancia ' +
    'conocida, o sea, tu velocidad media. Si la media supera el límite, el teorema garantiza que en ' +
    'algún instante concreto ibas exactamente a esa velocidad, y por tanto por encima del límite. La ' +
    'multa se sostiene sobre un teorema de 1797.');

  p.note('Estos dos resultados vuelven en [[fn-taylor|el tema de <em>polinomios de Taylor</em>]], donde el valor ' +
    'medio es lo que produce el punto misterioso $c$ que aparece en la fórmula del error. Si allí te ' +
    'preguntas de dónde sale ese $c$, la respuesta está aquí.', null, 'Dónde se usa esto');

  p.trampas([
    { e: '$(f\\cdot g)\' = f\'\\cdot g\'$', por: 'Con $f = g = x$: $(x^2)\' = 2x$, pero $1\\cdot 1 = 1$. Hacen falta los dos sumandos $f\'g + fg\'$.' },
    { e: '$(\\operatorname{sen} 5x)\' = \\cos 5x$', por: 'Falta la derivada de lo de dentro: $5\\cos 5x$. Lo de dentro no es $x$.' },
    { e: '$(e^{x^2})\' = e^{x^2}$', por: '«La exponencial es su propia derivada» solo si el exponente es $x$. Aquí es $x^2$: $(e^{x^2})\' = 2x\\,e^{x^2}$.' },
    { e: '$(x^n)\' = n\\,x^n$', por: 'El exponente baja <em>y disminuye en uno</em>: $n\\,x^{n-1}$. $(x^3)\' = 3x^2$, no $3x^3$.' }
  ]);

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

  p.exercise({
    title: 'Derivar funciones combinadas',
    level: 'medio',
    gen: function (r) {
      var fam = r.int(0, 3), a = r.int(1, 4), b = r.int(1, 5);
      var C = [
        { tex: 'e^{' + (a === 1 ? '' : a) + 'x}\\operatorname{sen}(' + (b === 1 ? '' : b) + 'x)', en: 0, v: b, pasos: '$f\'(x) = e^{' + a + 'x}\\left(' + a + '\\operatorname{sen}(' + b + 'x) + ' + b + '\\cos(' + b + 'x)\\right)$, y en $0$: $1\\cdot(0 + ' + b + ') = ' + b + '$' },
        { tex: '\\ln(x^2 + ' + a + ')', en: 1, v: 2 / (1 + a), pasos: '$f\'(x) = \\frac{2x}{x^2 + ' + a + '}$, y en $1$: $\\frac{2}{' + (1 + a) + '}$' },
        { tex: '\\operatorname{arctg}(' + (a === 1 ? '' : a) + 'x)', en: 1, v: a / (1 + a * a), pasos: '$f\'(x) = \\frac{' + a + '}{1 + ' + (a * a) + 'x^2}$, y en $1$: $\\frac{' + a + '}{' + (1 + a * a) + '}$' },
        { tex: 'x\\,e^{-' + (a === 1 ? '' : a) + 'x}', en: 1, v: Math.exp(-a) * (1 - a), pasos: '$f\'(x) = e^{-' + a + 'x}(1 - ' + a + 'x)$, y en $1$: $e^{-' + a + '}(1 - ' + a + ')$' }
      ][fam];
      return { fam: fam, c: C };
    },
    ask: function (d) { return 'Sea $f(x) = ' + d.c.tex + '$. Calcula $f\'(' + d.c.en + ')$ (cuatro decimales o fracción).'; },
    fields: [{ name: 'v', label: "f'", w: 'wide' }],
    sol: function (d) { return { v: U.round(d.c.v, 6) }; },
    tol: 3e-4,
    hint: function () { return ['Identifica si es un producto, una composición o las dos cosas.', 'Aplica la regla del producto y la de la cadena por partes, y sustituye al final.']; },
    steps: function (d) { return [d.c.pasos + ' $\\approx ' + U.fmt(d.c.v, 4) + '$']; },
    answer: function (d) { return U.fmt(d.c.v, 4); }
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
    title: 'Derivación logarítmica',
    level: 'avanzado',
    gen: function (r) {
      var fam = r.int(0, 1), a;
      if (fam === 0) { a = r.pick([2, 3]); return { fam: 0, a: a, tex: 'x^x', v: Math.pow(a, a) * (Math.log(a) + 1), malo: Math.pow(a, a) }; }
      a = r.pick([2, Math.E]);
      return { fam: 1, a: a, tex: 'x^{\\ln x}', v: Math.pow(a, Math.log(a)) * 2 * Math.log(a) / a, malo: Math.log(a) * Math.pow(a, Math.log(a) - 1) };
    },
    ask: function (d) { return 'Sea $f(x) = ' + d.tex + '$. Calcula $f\'(' + (d.a === Math.E ? 'e' : d.a) + ')$ (cuatro decimales).'; },
    fields: [{ name: 'v', label: "f'", w: 'wide' }],
    sol: function (d) { return { v: U.round(d.v, 6) }; },
    tol: 3e-4,
    errores: [{ si: function (v, d) { return Math.abs(d.malo - d.v) > 1e-3 && Math.abs(v.v - d.malo) < 1e-3; }, msg: 'Has usado la regla de la potencia como si el exponente fuera fijo. Aquí la variable está arriba y abajo: toma logaritmos.' }],
    hint: function (d) {
      return ['Toma logaritmos: ' + (d.fam === 0 ? '$\\ln y = x\\ln x$.' : '$\\ln y = (\\ln x)^2$.'),
        'Deriva: ' + (d.fam === 0 ? '$\\frac{y\'}{y} = \\ln x + 1$.' : '$\\frac{y\'}{y} = \\frac{2\\ln x}{x}$.') + ' Despeja $y\'$ y sustituye.'];
    },
    steps: function (d) {
      return d.fam === 0
        ? ['$\\ln y = x\\ln x \\Rightarrow \\frac{y\'}{y} = \\ln x + 1 \\Rightarrow y\' = x^x(\\ln x + 1)$', '$f\'(' + d.a + ') = ' + Math.pow(d.a, d.a) + '(\\ln ' + d.a + ' + 1) \\approx ' + U.fmt(d.v, 4) + '$']
        : ['$\\ln y = (\\ln x)^2 \\Rightarrow \\frac{y\'}{y} = \\frac{2\\ln x}{x} \\Rightarrow y\' = x^{\\ln x}\\cdot\\frac{2\\ln x}{x}$', 'Sustituyendo: $\\approx ' + U.fmt(d.v, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.keys([
    'Si la variable está a la vez en la base y en el exponente, se toman logaritmos antes de derivar.',
    'La derivada es el límite del cociente incremental: la pendiente de la tangente.',
    'Dos lecturas de lo mismo: pendiente (geometría) y ritmo de cambio instantáneo (física).',
    '$(x^n)\' = n\\,x^{n-1}$ resuelve casi todo lo polinómico.',
    'Producto: $u\'v + uv\'$. Cociente: $\\frac{u\'v - uv\'}{v^2}$. No son el producto ni el cociente de las derivadas.',
    'Cadena: deriva lo de fuera dejando lo de dentro, y multiplica por la derivada de dentro.',
    'Tangente en $a$: $y = f(a) + f\'(a)(x-a)$.',
    'Donde hay máximo o mínimo, la derivada vale cero.'
  ]);
});
