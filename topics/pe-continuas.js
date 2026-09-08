/* Tema: Variables aleatorias continuas */
Course.topic('pe-continuas', function (p) {

  p.text('Hasta ahora, todas las variables aleatorias de este bloque se podían contar: cuántas caras ' +
    'en diez tiradas, cuántas piezas defectuosas en un lote, cuántos aciertos en un examen tipo test. ' +
    'Son variables <strong>discretas</strong>: sus valores posibles se pueden listar, y a cada uno se ' +
    'le asigna una probabilidad.');

  p.text('Pero muchísimas cosas que se miden no son así. La estatura de una persona, el tiempo que ' +
    'tarda en fundirse una bombilla, el error de un instrumento: no toman valores sueltos, sino ' +
    'cualquier valor de un intervalo. Y ahí la maquinaria anterior se rompe de una manera que hay que ' +
    'mirar de frente, porque explica todo lo que viene después.');

  p.section('El problema: la probabilidad de un punto es cero');

  p.text('¿Cuál es la probabilidad de que una persona mida <strong>exactamente</strong> 1,75 m? No ' +
    '1,7501 ni 1,74999: exactamente 1,750000… con infinitos ceros.');

  p.text('La respuesta incómoda es <strong>cero</strong>. Y no porque sea imposible —alguien tiene ' +
    'que medir eso— sino porque hay infinitos valores posibles en cualquier tramo, y si a cada uno le ' +
    'diéramos una probabilidad positiva, por pequeña que fuese, al sumarlas todas nos pasaríamos de ' +
    '1. Es el mismo choque con el infinito que apareció en el tema de series: infinitas cantidades ' +
    'positivas iguales no pueden sumar algo finito.');

  p.note('En una variable continua, <strong>los sucesos con probabilidad no nula son los intervalos, ' +
    'no los puntos</strong>. No tiene sentido preguntar «¿cuál es la probabilidad de que mida 1,75?»; ' +
    'sí lo tiene preguntar «¿cuál es la probabilidad de que mida entre 1,74 y 1,76?». Todas las ' +
    'preguntas útiles son de este segundo tipo.', 'ok', 'El cambio de mentalidad');

  p.text('Y como consecuencia cómoda: en una variable continua da exactamente igual poner $<$ o ' +
    '$\\le$, porque los extremos no aportan nada. Esto no vale en las discretas, donde $P(X\\le 3)$ ' +
    'y $P(X<3)$ se diferencian en todo $P(X=3)$.');

  p.section('De un histograma a una curva');

  p.text('¿Cómo se le asigna entonces probabilidad a un intervalo? La pista está en algo que ya ' +
    'sabes hacer: el histograma de la estadística descriptiva.');

  p.text('Toma mil estaturas y agrúpalas en ocho clases. Sale un histograma tosco. Ahora agrúpalas en ' +
    'veinte, en cincuenta, en doscientas, mientras aumentas también el número de datos. Las barras se ' +
    'estrechan, el perfil se afina, y en el límite queda una <strong>curva</strong>. Esa curva es la ' +
    '<strong>función de densidad</strong>.');

  p.demo({
    title: 'El histograma que se convierte en curva',
    intro: 'Aumenta el número de clases y mira cómo el escalonado se suaviza. La curva no es un dibujo decorativo: es el límite del histograma cuando las barras se hacen infinitamente estrechas.',
    build: function (host) {
      var clases = 8, n = 400;
      var r = U.rng(20240501);
      var datos = [];
      for (var k = 0; k < 3000; k++) {
        // suma de tres uniformes: una campana suave sin usar la normal todavia
        datos.push((r.real(-1, 1, 4) + r.real(-1, 1, 4) + r.real(-1, 1, 4)) / 3);
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1.05, xmax: 1.05, ymin: 0, ymax: 2.2, height: 270,
        xlabel: 'valor', ylabel: 'densidad',
        draw: function (g) {
          var ancho = 2 / clases;
          var cont = [];
          for (var i = 0; i < clases; i++) cont.push(0);
          for (var j = 0; j < n; j++) {
            var idx = Math.floor((datos[j] + 1) / ancho);
            if (idx >= 0 && idx < clases) cont[idx]++;
          }
          for (var i2 = 0; i2 < clases; i2++) {
            var alt = cont[i2] / (n * ancho);       // densidad: area total = 1
            g.rect(-1 + i2 * ancho, 0, ancho, alt,
              { color: 0, fill: 0, fillAlpha: .3, w: 1.1 });
          }
          // la densidad teorica de la media de tres uniformes
          g.fn(function (x) {
            var t = x * 3;
            if (Math.abs(t) >= 3) return 0;
            var v;
            if (Math.abs(t) <= 1) v = (3 - t * t) / 8;
            else v = Math.pow(3 - Math.abs(t), 2) / 16;
            return v * 3;
          }, { color: 1, w: 2.8 });
        }
      });
      function paint() {
        out.set('<strong>' + U.miles(n) + '</strong> datos repartidos en <strong>' + clases +
          '</strong> clases<br>' +
          'Anchura de cada barra: ' + U.fmt(2 / clases, 4) + '<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">El área total de las barras es ' +
          'siempre 1, porque la altura no es «cuántos hay» sino «cuántos hay por unidad de anchura». ' +
          'Eso es lo que permite que el histograma y la curva vivan en la misma escala.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'clases', min: 4, max: 60, step: 1, value: 8, dec: 0, on: function (v) { clases = v; paint(); } });
      W.slider(row, { label: 'datos', min: 50, max: 3000, step: 10, value: 400, dec: 0, on: function (v) { n = v; paint(); } });
      W.legend(host, [
        { c: 0, t: 'histograma de los datos' },
        { c: 1, t: 'la densidad: el límite del histograma' }
      ]);
      W.hint(host, 'Sube primero las clases con pocos datos: sale un peine irregular. Sube después ' +
        'los datos: el peine se ordena y se pega a la curva. Hacen falta las dos cosas.');
      paint();
    }
  });

  p.section('La función de densidad');

  p.text('Una <strong>función de densidad</strong> $f$ es cualquier función que cumpla dos ' +
    'condiciones, y no se le pide nada más:');

  p.formulas([
    'f(x) \\ge 0 \\quad \\text{para todo } x',
    '\\int_{-\\infty}^{\\infty} f(x)\\,dx = 1'
  ], 'las dos condiciones de una densidad',
    'La primera dice que la curva nunca baja del eje: no hay probabilidades ' +
      'negativas.<br><br>La segunda se dice: <em>«la integral, desde menos infinito hasta más ' +
      'infinito, de efe de equis diferencial de equis, es igual a uno»</em>. Significa que ' +
      '<strong>el área total encerrada bajo la curva vale exactamente 1</strong>, porque algo tiene ' +
      'que pasar con probabilidad 1.<br><br>Los símbolos $\\pm\\infty$ en los límites de la integral ' +
      'quieren decir «por todo el eje real», sin cortar por ningún lado.');

  p.text('Y entonces la probabilidad de un intervalo es, sencillamente, el área bajo la curva en ese ' +
    'tramo:');

  p.formula('P(a \\le X \\le b) = \\int_a^b f(x)\\,dx', 'probabilidad = área',
    'Se dice: <em>«pe de a menor o igual que equis mayúscula, menor o igual que be, es igual a la ' +
      'integral entre a y be de efe de equis diferencial de equis»</em>.<br><br>Fíjate en la ' +
      'diferencia entre $X$ y $x$: la mayúscula es la <strong>variable aleatoria</strong> (el ' +
      'resultado del experimento, que no sabes cuál será) y la minúscula es la variable de ' +
      'integración (un número cualquiera que recorre el eje). Es una distinción incómoda al principio ' +
      'y se respeta siempre.<br><br>Lo importante: esta es una integral definida <strong>de las que ' +
      'ya sabes calcular</strong>. Aquí es donde la probabilidad y el cálculo se dan la mano.');

  p.note('Cuidado con una tentación: $f(x)$ <strong>no</strong> es la probabilidad de que $X$ valga ' +
    '$x$ —esa es cero, como acabamos de ver—. $f(x)$ es una <em>densidad</em>, y puede valer más de ' +
    '1 sin ningún problema. Lo que nunca pasa de 1 es el área. La palabra correcta es la de la ' +
    'física: densidad es masa por unidad de longitud, no masa.', 'warn', 'Qué es y qué no es f(x)');

  p.demo({
    title: 'El área es la probabilidad',
    intro: 'Arrastra los dos extremos y mira cómo cambia el área sombreada. Ese número es literalmente la probabilidad de caer en ese tramo. Cambia también de densidad: la maquinaria es la misma para todas.',
    build: function (host) {
      var cual = 'uni';
      var dens = {
        uni: { t: 'uniforme en [0, 4]', f: function (x) { return (x >= 0 && x <= 4) ? 0.25 : 0; },
               F: function (x) { return U.clamp(x, 0, 4) / 4; }, xm: -0.6, xM: 4.6, ym: 0.42 },
        exp: { t: 'exponencial de media 2', f: function (x) { return x >= 0 ? 0.5 * Math.exp(-0.5 * x) : 0; },
               F: function (x) { return x <= 0 ? 0 : 1 - Math.exp(-0.5 * x); }, xm: -0.6, xM: 9, ym: 0.62 },
        tri: { t: 'triangular en [0, 4]', f: function (x) { if (x < 0 || x > 4) return 0; return x <= 2 ? x / 4 : (4 - x) / 4; },
               F: function (x) { if (x <= 0) return 0; if (x >= 4) return 1; return x <= 2 ? x * x / 8 : 1 - (4 - x) * (4 - x) / 8; }, xm: -0.6, xM: 4.6, ym: 0.62 }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.6, xmax: 4.6, ymin: -0.09, ymax: 0.42, height: 270,
        xlabel: 'x', ylabel: 'f(x)',
        handles: {
          A: { x: 1, y: 0, label: 'a', color: 2, constrain: function (h) { h.y = 0; h.x = U.clamp(h.x, dens[cual].xm + 0.2, dens[cual].xM - 0.2); } },
          B: { x: 3, y: 0, label: 'b', color: 2, constrain: function (h) { h.y = 0; h.x = U.clamp(h.x, dens[cual].xm + 0.2, dens[cual].xM - 0.2); } }
        },
        draw: function (g) {
          var D = dens[cual];
          var a = Math.min(g.h('A').x, g.h('B').x), b = Math.max(g.h('A').x, g.h('B').x);
          g.area(D.f, a, b, { color: 2, fillAlpha: .32 });
          g.fn(D.f, { color: 0, w: 2.8 });
          g.vline(a, { color: 2, w: 1.4, dash: true });
          g.vline(b, { color: 2, w: 1.4, dash: true });
        },
        onDrag: function () { paint(); }
      });
      function paint() {
        var D = dens[cual];
        var a = Math.min(plot.h('A').x, plot.h('B').x), b = Math.max(plot.h('A').x, plot.h('B').x);
        var pr = D.F(b) - D.F(a);
        out.set('Densidad: ' + D.t + '<br>' +
          '$P(' + U.fmt(a, 2) + ' \\le X \\le ' + U.fmt(b, 2) + ') = \\displaystyle\\int_{' +
          U.fmt(a, 2) + '}^{' + U.fmt(b, 2) + '} f(x)\\,dx = ' + U.fmt(pr, 4) + '$<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">Junta los dos extremos: el área ' +
          'tiende a cero. Eso es que la probabilidad de un punto vale cero.</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'uniforme', value: 'uni' },
        { label: 'exponencial', value: 'exp' },
        { label: 'triangular', value: 'tri' }
      ], { value: 'uni', on: function (v) {
        cual = v;
        var D = dens[v];
        plot.h('A').x = D.xm + 1.2; plot.h('B').x = Math.min(D.xM - 1, D.xm + 3.5);
        plot.view(D.xm, D.xM, -D.ym * 0.22, D.ym);
        paint();
      } });
      W.hint(host, 'Los puntos a y b se arrastran con el ratón, y también con el teclado: pulsa Tab ' +
        'hasta el dibujo y muévelos con las flechas.');
      paint();
    }
  });

  p.section('La función de distribución: el área acumulada');

  p.text('Trabajar siempre con dos límites es incómodo. Se define entonces una función que acumula ' +
    'todo lo que hay a la izquierda:');

  p.formula('F(x) = P(X \\le x) = \\int_{-\\infty}^{x} f(t)\\,dt', 'función de distribución',
    'Se dice: <em>«efe mayúscula de equis es la probabilidad de que equis mayúscula sea menor o igual ' +
      'que equis, o sea, la integral desde menos infinito hasta equis de efe minúscula de te ' +
      'diferencial de te»</em>.<br><br>Se usa $t$ dentro de la integral simplemente porque la letra ' +
      '$x$ ya está ocupada por el límite superior. No significa nada más.<br><br>Convenio importante: ' +
      '$F$ mayúscula acumula, $f$ minúscula es la densidad. Se distinguen solo por el tamaño de la ' +
      'letra, así que hay que fijarse.');

  p.text('Con ella, cualquier probabilidad es una resta, y se acabaron las integrales:');

  p.formula('P(a \\le X \\le b) = F(b) - F(a)', 'la regla de Barrow, otra vez');

  p.text('Esto no es una casualidad ni una fórmula nueva que memorizar: es exactamente la regla de ' +
    'Barrow del tema de la integral definida. $F$ es una primitiva de $f$, y por tanto ' +
    '$F\'(x) = f(x)$: <strong>la densidad es la derivada de la función de distribución</strong>. Toda ' +
    'la probabilidad continua es cálculo con otro vocabulario.');

  p.note('Cuando en el tema siguiente uses las tablas de la normal, lo que estarás consultando es ' +
    'precisamente esta $F$. La normal no tiene primitiva elemental —no hay manera de escribirla con ' +
    'funciones conocidas—, y por eso hace falta una tabla en vez de una fórmula. La tabla no es una ' +
    'muleta escolar: es la única salida.', null, 'Por qué la normal necesita tablas');

  p.section('Esperanza y varianza, ahora como integrales');

  p.text('En las variables discretas, la esperanza era una media ponderada: se sumaba cada valor por ' +
    'su probabilidad. En las continuas se hace lo mismo, con la traducción de siempre: donde había un ' +
    'sumatorio hay una integral, y donde había una probabilidad hay una densidad por $dx$.');

  p.table(['Concepto', 'Variable discreta', 'Variable continua'], [
    ['Total de probabilidad', '$\\sum p_i = 1$', '$\\int f(x)\\,dx = 1$'],
    ['Esperanza $\\mu$', '$\\sum x_i\\,p_i$', '$\\int x\\,f(x)\\,dx$'],
    ['Varianza $\\sigma^2$', '$\\sum (x_i-\\mu)^2 p_i$', '$\\int (x-\\mu)^2 f(x)\\,dx$']
  ]);

  p.text('La correspondencia es tan literal que conviene leerla despacio una vez: cada fila dice lo ' +
    'mismo dos veces, en el idioma de contar y en el idioma de medir.');

  p.formulas([
    '\\mu = E[X] = \\int_{-\\infty}^{\\infty} x\\,f(x)\\,dx',
    '\\sigma^2 = \\int_{-\\infty}^{\\infty} (x-\\mu)^2 f(x)\\,dx = E[X^2] - \\mu^2'
  ], 'esperanza y varianza');

  p.util('La esperanza de una variable continua es el <strong>centro de gravedad</strong> de la ' +
    'curva, en el sentido literal de la física: si recortases la región bajo la densidad en cartón, ' +
    'se sostendría en equilibrio sobre un dedo colocado en $\\mu$. La fórmula $\\int x f(x)dx$ es la ' +
    'misma con la que un ingeniero calcula el centro de masas de una pieza; solo cambia el nombre de ' +
    'las letras. Por eso una densidad con una cola larga a la derecha tiene la media desplazada hacia ' +
    'esa cola, igual que un martillo se equilibra cerca de la cabeza.');

  p.section('Dos densidades que hay que conocer');

  p.sub('La uniforme');

  p.text('Todos los valores del intervalo $[a,b]$ son igual de probables. La densidad es una ' +
    'meseta plana, y su altura no se elige: viene forzada porque el área tiene que valer 1.');

  p.formulas([
    'f(x) = \\frac{1}{b-a} \\quad \\text{en } [a,b]',
    '\\mu = \\frac{a+b}{2}, \\qquad \\sigma^2 = \\frac{(b-a)^2}{12}'
  ], 'uniforme continua');

  p.text('Es la que modela «llego a la parada en un momento cualquiera entre dos autobuses» o el ' +
    'error de redondeo de una máquina. Y es la que genera tu ordenador cada vez que pide un número ' +
    'al azar: todas las demás distribuciones se fabrican transformando uniformes.');

  p.sub('La exponencial');

  p.text('Modela el <strong>tiempo hasta que ocurre algo</strong> cuando ese algo no tiene memoria: ' +
    'la desintegración de un átomo, la avería de un componente electrónico, la llegada de la ' +
    'siguiente llamada a una centralita.');

  p.formulas([
    'f(x) = \\lambda e^{-\\lambda x} \\quad \\text{para } x \\ge 0',
    'F(x) = 1 - e^{-\\lambda x}, \\qquad \\mu = \\frac{1}{\\lambda}'
  ], 'exponencial de parámetro λ',
    'La letra $\\lambda$ es una lambda griega, y aquí significa <strong>la tasa</strong>: cuántos ' +
      'sucesos ocurren por unidad de tiempo. Si a una centralita llegan 3 llamadas por minuto, ' +
      '$\\lambda = 3$ y el tiempo medio entre llamadas es $1/3$ de minuto.<br><br>La fórmula de $F$ se ' +
      'lee: <em>«uno menos e elevado a menos lambda equis»</em>, y es la probabilidad de que el ' +
      'suceso ya haya ocurrido antes del instante $x$.');

  p.note('La exponencial tiene una propiedad que desconcierta: <strong>no tiene memoria</strong>. Si ' +
    'una bombilla exponencial lleva 1000 horas encendida, la probabilidad de que aguante 500 más es ' +
    'la misma que tenía al estrenarla. No se «gasta». Es realista para componentes que fallan por ' +
    'accidente y falso para cosas que se desgastan, como un neumático: por eso en fiabilidad se usan ' +
    'otras distribuciones cuando hay envejecimiento.', 'warn', 'La falta de memoria');

  p.hist('Que la probabilidad continua necesitaba integrales no fue evidente. Durante el siglo XVIII ' +
    'se manejaban «probabilidades geométricas» con argumentos de área ad hoc, y de ahí salió en 1777 ' +
    'la aguja de Buffon, que estima $\\pi$ tirando una aguja sobre un suelo de tablas. Laplace ' +
    'sistematizó el cálculo con densidades, pero la definición rigurosa de probabilidad continua ' +
    'tuvo que esperar a que Lebesgue reconstruyera la integral desde cero a principios del siglo XX y ' +
    'a que Kolmogórov, en 1933, axiomatizara toda la probabilidad en unas pocas páginas. Que un ' +
    'alumno de bachillerato calcule hoy estas áreas con la regla de Barrow es el resultado de ' +
    'doscientos años de aclarar qué se estaba haciendo exactamente.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Es una función de densidad?',
    level: 'basico',
    gen: function (r) {
      var k = r.int(1, 6);
      var b = r.int(2, 5);
      // f(x) = k*x en [0,b]; area = k*b^2/2
      var area = k * b * b / 2;
      var ok = Math.abs(area - 1) < 1e-9;
      // forzamos casos validos la mitad de las veces con k = 2/b^2 racional
      if (r.bool(0.5)) {
        var b2 = r.pick([1, 2]);
        return { k: 2 / (b2 * b2), b: b2, area: 1, ok: true, bonito: true };
      }
      return { k: k, b: b, area: area, ok: ok, bonito: false };
    },
    ask: function (d) {
      return 'Sea $f(x) = ' + U.fmt(d.k, 4) + 'x$ en el intervalo $[0, ' + d.b + ']$ y $f(x)=0$ ' +
        'fuera. ¿Es una función de densidad?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Calcula el área total y escribe ' +
        '<code>sí</code> o <code>no</code>.</span>';
    },
    fields: [
      { name: 'a', label: 'Área total', w: 'tiny' },
      { name: 'q', label: '¿Es densidad?', w: 'tiny', ph: 'sí / no' }
    ],
    sol: function (d) { return { a: U.round(d.area, 6), q: d.ok ? 'si' : 'no' }; },
    check: function (v, d) {
      var areaOk = Ex.same(v.a, d.area, 1e-3);
      var q = U.eligeOpcion(v.raw.q, { si: /^s|si|es densidad|valida|cumple/, no: /^n|no|no es|no cumple/ });
      if (!q) return { ok: false, msg: 'En la segunda casilla escribe <strong>sí</strong> o <strong>no</strong>.', fields: { a: areaOk } };
      var qOk = (q === 'si') === d.ok;
      return { ok: areaOk && qOk, fields: { a: areaOk, q: qOk } };
    },
    hint: function (d) {
      return 'El área bajo una recta que sale del origen es la del triángulo: $\\frac{base \\cdot ' +
        'altura}{2}$. La base es ' + d.b + ' y la altura es $f(' + d.b + ')$.';
    },
    steps: function (d) {
      return ['$\\displaystyle\\int_0^{' + d.b + '} ' + U.fmt(d.k, 4) + 'x\\,dx = ' + U.fmt(d.k, 4) +
        '\\left[\\frac{x^2}{2}\\right]_0^{' + d.b + '} = ' + U.fmt(d.k, 4) + '\\cdot\\frac{' +
        (d.b * d.b) + '}{2} = ' + U.fmt(d.area, 4) + '$',
        d.ok ? 'El área vale 1 y la función no es negativa: <strong>sí</strong> es una densidad.'
             : 'El área vale ' + U.fmt(d.area, 4) + ', que no es 1: <strong>no</strong> es una ' +
               'densidad. Habría que dividirla entre ' + U.fmt(d.area, 4) + ' para normalizarla.'];
    },
    answer: function (d) {
      return 'Área = ' + U.fmt(d.area, 4) + ' · ' + (d.ok ? 'sí es densidad' : 'no es densidad');
    }
  });

  p.exercise({
    title: 'Probabilidad en una uniforme',
    level: 'basico',
    gen: function (r) {
      var a = r.int(0, 10), b = a + r.int(4, 20);
      var x1 = a + r.int(1, b - a - 2), x2 = x1 + r.int(1, b - x1);
      return { a: a, b: b, x1: x1, x2: x2, P: (x2 - x1) / (b - a) };
    },
    ask: function (d) {
      return 'El autobús pasa cada ' + (d.b - d.a) + ' minutos y llegas a la parada en un instante ' +
        'cualquiera: tu espera $X$ es uniforme en $[' + d.a + ', ' + d.b + ']$. Calcula ' +
        '$P(' + d.x1 + ' \\le X \\le ' + d.x2 + ')$ con cuatro decimales.';
    },
    fields: [{ name: 'P', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { P: U.round(d.P, 8) }; },
    tol: 3e-5,
    hint: function (d) {
      return 'La densidad es constante y vale $\\frac{1}{' + (d.b - d.a) + '}$. El área de un ' +
        'rectángulo es base por altura.';
    },
    steps: function (d) {
      return ['La densidad es $f(x) = \\dfrac{1}{' + d.b + ' - ' + d.a + '} = \\dfrac{1}{' +
        (d.b - d.a) + '}$ en todo el intervalo.',
        'El tramo pedido mide $' + d.x2 + ' - ' + d.x1 + ' = ' + (d.x2 - d.x1) + '$ minutos.',
        '$P = \\dfrac{' + (d.x2 - d.x1) + '}{' + (d.b - d.a) + '} = ' + U.fmt(d.P, 4) + '$',
        'En una uniforme la probabilidad es simplemente la proporción de intervalo que ocupa el ' +
        'tramo: no hace falta integrar nada.'];
    },
    answer: function (d) { return U.fmt(d.P, 4); }
  });

  p.exercise({
    title: 'Exponencial: tiempo hasta el fallo',
    level: 'medio',
    gen: function (r) {
      var media = r.pick([2, 3, 4, 5, 8, 10]);
      var lam = 1 / media;
      var t = r.int(1, media * 2);
      var tipo = r.int(0, 1);
      var P = tipo === 0 ? 1 - Math.exp(-lam * t) : Math.exp(-lam * t);
      return { media: media, lam: lam, t: t, tipo: tipo, P: P };
    },
    ask: function (d) {
      return 'La duración de un componente sigue una exponencial de media <strong>' + d.media +
        ' años</strong>. Calcula la probabilidad de que ' +
        (d.tipo === 0 ? 'falle <strong>antes</strong> de ' : 'dure <strong>más</strong> de ') +
        d.t + ' años (cuatro decimales).';
    },
    fields: [{ name: 'P', label: 'Probabilidad', w: 'wide' }],
    sol: function (d) { return { P: U.round(d.P, 8) }; },
    tol: 3e-5,
    hint: function (d) {
      return 'Si la media es ' + d.media + ', entonces $\\lambda = \\frac{1}{' + d.media +
        '}$. Y $F(t) = 1 - e^{-\\lambda t}$ es la probabilidad de que ya haya fallado.';
    },
    steps: function (d) {
      return ['$\\lambda = \\dfrac{1}{' + d.media + '} = ' + U.fmt(d.lam, 6) + '$',
        '$F(' + d.t + ') = 1 - e^{-' + U.fmt(d.lam, 6) + '\\cdot' + d.t + '} = ' +
        U.fmt(1 - Math.exp(-d.lam * d.t), 6) + '$',
        d.tipo === 0
          ? 'Piden justo eso: $P(X \\le ' + d.t + ') = ' + U.fmt(d.P, 4) + '$'
          : 'Piden lo contrario: $P(X > ' + d.t + ') = 1 - F(' + d.t + ') = e^{-\\lambda t} = ' +
            U.fmt(d.P, 4) + '$',
        'Curiosidad: la probabilidad de superar la media es siempre $e^{-1} \\approx 0{,}368$, sea ' +
        'cual sea $\\lambda$. En una exponencial, la mayoría falla antes de la media.'];
    },
    answer: function (d) { return U.fmt(d.P, 4); }
  });

  p.exercise({
    title: 'Esperanza de una densidad',
    level: 'avanzado',
    gen: function (r) {
      var b = r.int(2, 6);
      // f(x) = 2x/b^2 en [0,b];  E[X] = 2b/3
      return { b: b, mu: 2 * b / 3, k: 2 / (b * b) };
    },
    ask: function (d) {
      return 'Sea $f(x) = \\dfrac{2x}{' + (d.b * d.b) + '}$ en $[0, ' + d.b + ']$ (y cero fuera). ' +
        'Comprueba que es una densidad y calcula su esperanza $\\mu = \\displaystyle\\int_0^{' + d.b +
        '} x\\,f(x)\\,dx$, con cuatro decimales.';
    },
    fields: [{ name: 'm', label: 'μ', w: 'wide' }],
    sol: function (d) { return { m: U.round(d.mu, 8) }; },
    tol: 3e-5,
    hint: function (d) {
      return 'Multiplica $x$ por la densidad antes de integrar: te queda $\\int_0^{' + d.b +
        '} \\frac{2x^2}{' + (d.b * d.b) + '}dx$, que es una potencia corriente.';
    },
    steps: function (d) {
      return ['Primero la comprobación: $\\displaystyle\\int_0^{' + d.b + '}\\frac{2x}{' + (d.b * d.b) +
        '}dx = \\frac{2}{' + (d.b * d.b) + '}\\cdot\\frac{' + d.b + '^2}{2} = 1$. Es una densidad.',
        '$\\mu = \\displaystyle\\int_0^{' + d.b + '} x\\cdot\\frac{2x}{' + (d.b * d.b) + '}\\,dx = ' +
        '\\frac{2}{' + (d.b * d.b) + '}\\int_0^{' + d.b + '} x^2\\,dx$',
        '$= \\dfrac{2}{' + (d.b * d.b) + '}\\cdot\\dfrac{' + d.b + '^3}{3} = \\dfrac{2\\cdot' + d.b +
        '}{3} = ' + U.fmt(d.mu, 4) + '$',
        'La media cae a dos tercios del intervalo, no en el centro: la densidad crece, así que hay ' +
        'más masa a la derecha y el punto de equilibrio se desplaza hacia allí.'];
    },
    answer: function (d) { return U.fmt(d.mu, 4); }
  });

  p.keys([
    'En una variable continua $P(X = c) = 0$ para cualquier punto: las preguntas con sentido son sobre <strong>intervalos</strong>.',
    'La <strong>densidad</strong> $f$ cumple $f \\ge 0$ y $\\int f = 1$. No es una probabilidad: puede pasar de 1. Lo que nunca pasa de 1 es el área.',
    '$P(a \\le X \\le b) = \\int_a^b f(x)\\,dx$. La probabilidad continua <strong>es</strong> el área bajo una curva.',
    'La función de distribución $F(x) = P(X \\le x)$ acumula por la izquierda, y $F\' = f$: es la regla de Barrow con otro nombre.',
    'Esperanza y varianza son las mismas de siempre con la integral en lugar del sumatorio: $\\mu = \\int x f(x)dx$.',
    'La <strong>uniforme</strong> reparte por igual; la <strong>exponencial</strong> modela esperas sin memoria y tiene media $1/\\lambda$.'
  ]);
});
