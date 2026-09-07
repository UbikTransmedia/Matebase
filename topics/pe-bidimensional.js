/* Tema: Regresión y correlación */
Course.topic('pe-bidimensional', function (p) {

  p.text('Hasta ahora describíamos <em>una</em> variable. Ahora medimos <strong>dos cosas de cada ' +
    'individuo</strong> —altura y peso, horas de estudio y nota, publicidad y ventas— y preguntamos: ' +
    '¿van juntas? ¿Cuánto? ¿Se puede predecir una a partir de la otra?');

  p.section('La nube de puntos');

  p.text('Lo primero, siempre, es <strong>dibujar</strong>. Cada individuo es un punto $(x_i, y_i)$, y ' +
    'la forma de la nube ya cuenta casi toda la historia.');

  p.demo({
    title: 'Nube de puntos y recta de regresión',
    intro: 'Cambia la dispersión y la pendiente. Observa cómo el coeficiente de correlación responde a la forma de la nube.',
    build: function (host, d) {
      var pend = 1, ruido = 1, n = 40;
      var datos = [];
      var out = W.readout(host, '');
      function generar() {
        var r = U.rng(12345);
        datos = [];
        for (var i = 0; i < n; i++) {
          var x = r.real(1, 9);
          var y = 2 + pend * x + r.real(-ruido, ruido) + r.real(-ruido, ruido);
          datos.push([x, y]);
        }
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 10, ymin: -4, ymax: 16, height: 320,
        draw: function (g) {
          datos.forEach(function (P) { g.point(P[0], P[1], { color: 0, r: 4 }); });
          var xs = datos.map(function (P) { return P[0]; });
          var ys = datos.map(function (P) { return P[1]; });
          var mx = ML.mean(xs), my = ML.mean(ys);
          var b = ML.cov(xs, ys) / ML.variance(xs);
          g.fn(function (x) { return my + b * (x - mx); }, { color: 2, w: 2.8 });
          g.point(mx, my, { color: 1, r: 6, label: 'centro', labelDy: -14 });
        }
      });
      function paint() {
        generar();
        var xs = datos.map(function (P) { return P[0]; });
        var ys = datos.map(function (P) { return P[1]; });
        var rr = ML.corr(xs, ys);
        var b = ML.cov(xs, ys) / ML.variance(xs);
        var a = ML.mean(ys) - b * ML.mean(xs);
        var fuerza = Math.abs(rr) > 0.9 ? 'muy fuerte' : (Math.abs(rr) > 0.7 ? 'fuerte'
          : (Math.abs(rr) > 0.4 ? 'moderada' : (Math.abs(rr) > 0.2 ? 'débil' : 'prácticamente nula')));
        out.set('Recta de regresión: $y = ' + U.fmt(b, 3) + 'x ' + (a >= 0 ? '+ ' : '- ') + U.fmt(Math.abs(a), 3) + '$<br>' +
          'Coeficiente de correlación: $r = ' + U.fmt(rr, 4) + '$ → correlación <strong>' + fuerza + '</strong> ' +
          (rr > 0 ? 'y positiva' : 'y negativa') + '<br>' +
          'Coeficiente de determinación: $r^2 = ' + U.fmt(rr * rr, 4) + '$ → la recta explica el <strong>' +
          U.fmt(rr * rr * 100, 1) + '%</strong> de la variabilidad.');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'pendiente real', min: -1.5, max: 1.5, step: 0.1, value: 1, dec: 2, on: function (v) { pend = v; paint(); } });
      W.slider(row, { label: 'ruido', min: 0.1, max: 5, step: 0.1, value: 1, dec: 1, on: function (v) { ruido = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Covarianza y correlación');
  p.text('Ver una nube de puntos está bien, pero hace falta un número que diga <em>cuánto</em> se parecen ' +
    'esas dos variables. La <strong>covarianza</strong> es el primer intento: mide si cuando una ' +
    'está por encima de su media la otra también lo está. Tiene un defecto grave para comparar ' +
    '—depende de las unidades, y en centímetros sale cien veces mayor que en metros—, y el ' +
    '<strong>coeficiente de correlación</strong> lo arregla dividiendo por las desviaciones típicas, ' +
    'con lo que siempre queda entre $-1$ y $1$.');


  p.formulas([
    '\\sigma_{xy} = \\frac{\\sum (x_i - \\overline{x})(y_i - \\overline{y})}{N}',
    'r = \\frac{\\sigma_{xy}}{\\sigma_x\\,\\sigma_y}'
  ], 'covarianza y coeficiente de correlación de Pearson',
    '$\\sigma_{xy}$ se dice «sigma sub equis i griega» y es la covarianza; $r$ a secas es el ' +
      'coeficiente de correlación.<br><br>Se leen: <em>«sigma equis i griega es la suma de los ' +
      'productos de equis sub i menos equis barra por i griega sub i menos i griega barra, partido por ' +
      'ene»</em> y <em>«erre es sigma equis i griega partido por sigma de equis por sigma de i ' +
      'griega»</em>.<br><br>Lo que hace el numerador: multiplica lo que se desvía cada dato en una ' +
      'variable por lo que se desvía en la otra. Si suelen desviarse hacia el mismo lado, los ' +
      'productos salen positivos y la suma es grande.');

  p.table(['Valor de r', 'Significa'],
    [['$r = 1$', 'todos los puntos en una recta creciente'],
     ['$r \\approx 0{,}8$', 'correlación positiva fuerte'],
     ['$r \\approx 0$', 'no hay relación <em>lineal</em>'],
     ['$r \\approx -0{,}8$', 'correlación negativa fuerte'],
     ['$r = -1$', 'todos los puntos en una recta decreciente']]);

  p.note('«No hay relación lineal» <strong>no</strong> es lo mismo que «no hay relación». Los puntos de ' +
    'una parábola perfecta tienen $r \\approx 0$ y sin embargo están perfectamente relacionados. ' +
    'Por eso hay que dibujar siempre la nube antes de fiarse de $r$.', 'warn');

  p.util('El coeficiente de correlación se usa a diario para decidir dónde poner el dinero. Un fondo de ' +
    'inversión no busca los activos que más suben, sino activos <strong>poco correlacionados entre ' +
    'sí</strong>: si todo lo que tienes sube y baja a la vez, no has diversificado nada, solo has ' +
    'comprado lo mismo con nombres distintos. El susto de 2008 vino en buena parte de que ' +
    'correlaciones que se creían pequeñas se dispararon a la vez.');

  p.util('En medicina y en industria sirve para otra cosa: descartar mediciones que sobran. Si dos ' +
    'sensores de una máquina dan lecturas con correlación 0,99, uno de los dos es prescindible; si un ' +
    'análisis clínico correlaciona casi perfectamente con otro más barato, se pide el barato. Buscar ' +
    'qué variables aportan información nueva y cuáles solo repiten lo que ya sabes es el primer paso ' +
    'de cualquier trabajo con datos.', 'Utilidad: qué medir y qué no');

  p.section('La recta de regresión');
  p.text('Si los puntos se alinean, lo natural es trazar la recta que mejor los representa y usarla para ' +
    'predecir. Pero «la que mejor los representa» hay que definirlo con precisión, y la definición ' +
    'aceptada es esta: la recta que hace <strong>mínima la suma de los cuadrados</strong> de las ' +
    'distancias verticales a los puntos. Se elevan al cuadrado para que los errores por arriba no ' +
    'cancelen a los de por abajo, y de esa condición sale una fórmula cerrada.');


  p.formula('y - \\overline{y} = \\frac{\\sigma_{xy}}{\\sigma_x^2}\\,(x - \\overline{x})',
    'recta de regresión de Y sobre X');

  p.text('A ese procedimiento se le llama <em>método de mínimos cuadrados</em>, y tiene una ' +
    'propiedad que conviene recordar porque sirve de comprobación: la recta pasa siempre por el ' +
    'punto medio de la nube, $(\\overline{x}, \\overline{y})$.');

  p.text('Sirve para <strong>predecir</strong>: dado un valor de $x$, estimar el $y$ correspondiente. ' +
    'Pero la predicción solo es fiable si $|r|$ es alto y si $x$ está dentro del rango observado.');

  p.note('<strong>Correlación no implica causalidad.</strong> El consumo de helados y los ahogamientos ' +
    'están altísimamente correlacionados, y no es que el helado ahogue: los dos dependen de una ' +
    'tercera variable, el calor. Esta frase es la más importante de todo el bloque de estadística y ' +
    'la que más se ignora en los periódicos.', 'warn', 'La advertencia fundamental');

  /* ================= EJERCICIOS ================= */
  p.util('La recta de regresión es el modelo predictivo más sencillo que existe y sigue siendo de los más ' +
    'usados: estimar ventas según la inversión en publicidad, el consumo eléctrico según la ' +
    'temperatura, el precio de un piso según los metros. Toda la ciencia de datos empieza aquí, y ' +
    'también su principal peligro: extrapolar fuera del rango con el que se ajustó la recta, que es ' +
    'como usar el crecimiento de un niño para predecir su altura a los cuarenta años.');

  p.hist('La palabra <em>regresión</em> viene de un hallazgo incómodo. Francis Galton midió en 1886 la ' +
    'estatura de padres e hijos y descubrió que los hijos de los muy altos tendían a ser algo más ' +
    'bajos que sus padres, y los de los muy bajos algo más altos: había una «regresión hacia la ' +
    'media». Galton lo interpretó en clave hereditaria y eugenésica, cosa que hoy resulta ' +
    'impresentable, pero el fenómeno es real y sigue explicando por qué el mejor equipo de una ' +
    'temporada casi nunca repite al año siguiente.');

  p.section('Practica');

  function tablaHTML(d, host) {
    var wrap = U.el('div.tbl-wrap');
    var t = U.el('table.tbl');
    t.innerHTML = '<thead><tr><th>' + MathX.render('x_i') + '</th>' +
      d.x.map(function (v) { return '<th class="num">' + U.fmt(v, 2) + '</th>'; }).join('') +
      '</tr></thead><tbody><tr><td>' + MathX.render('y_i') + '</td>' +
      d.y.map(function (v) { return '<td class="num">' + U.fmt(v, 2) + '</td>'; }).join('') +
      '</tr></tbody>';
    wrap.appendChild(t);
    host.appendChild(wrap);
  }

  p.exercise({
    title: 'Covarianza',
    level: 'medio',
    gen: function (r) {
      // Se eligen cuatro valores al azar y el quinto se ajusta para que la
      // media salga entera: así los pasos intermedios son limpios.
      function serie() {
        var a = [], s = 0;
        for (var i = 0; i < 4; i++) { var v = r.int(1, 10); a.push(v); s += v; }
        var resto = s % 5;
        var ultimo = resto === 0 ? 5 : 10 - resto;   // siempre entre 1 y 10
        a.push(ultimo);
        return a;
      }
      var x = serie(), y = serie();
      if (!Number.isInteger(ML.mean(x)) || !Number.isInteger(ML.mean(y))) return null;
      return { x: x, y: y, cov: ML.cov(x, y) };
    },
    ask: function () { return 'Calcula la covarianza de esta distribución (cuatro decimales):'; },
    show: tablaHTML,
    fields: [{ name: 'c', label: 'Covarianza', w: 'wide' }],
    sol: function (d) { return { c: U.round(d.cov, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Medias: $\\overline{x} = ' + ML.mean(d.x) + '$ y $\\overline{y} = ' + ML.mean(d.y) + '$. Ahora suma los productos de las desviaciones y divide entre ' + d.x.length + '.'; },
    steps: function (d) {
      var mx = ML.mean(d.x), my = ML.mean(d.y);
      var prods = d.x.map(function (v, i) { return (v - mx) * (d.y[i] - my); });
      return ['$\\overline{x} = ' + mx + '$ y $\\overline{y} = ' + my + '$.',
        'Productos $(x_i-\\overline{x})(y_i-\\overline{y})$: $' + prods.join(',\\ ') + '$.',
        'Suman $' + U.sum(prods) + '$.',
        '$\\sigma_{xy} = \\dfrac{' + U.sum(prods) + '}{' + d.x.length + '} = ' + U.fmt(d.cov, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.cov, 4); }
  });

  p.exercise({
    title: 'Coeficiente de correlación',
    level: 'medio',
    gen: function (r) {
      var n = 5, x = [], y = [];
      var b = r.pick([-2, -1, 1, 2, 3]);
      for (var i = 0; i < n; i++) {
        x.push(i + 1);
        y.push(b * (i + 1) + r.int(-2, 2) + 5);
      }
      var rr = ML.corr(x, y);
      if (!isFinite(rr)) return null;
      return { x: x, y: y, r: rr };
    },
    ask: function () {
      return 'Calcula el coeficiente de correlación de esta distribución (cuatro decimales) e ' +
        'interpreta su signo:';
    },
    show: tablaHTML,
    fields: [{ name: 'r', label: 'r', w: 'wide' }],
    sol: function (d) { return { r: U.round(d.r, 6) }; },
    tol: 3e-4,
    hint: function () { return '$r = \\dfrac{\\sigma_{xy}}{\\sigma_x \\sigma_y}$. Calcula primero la covarianza y las dos desviaciones típicas.'; },
    steps: function (d) {
      return ['$\\sigma_{xy} = ' + U.fmt(ML.cov(d.x, d.y), 4) + '$',
        '$\\sigma_x = ' + U.fmt(ML.sd(d.x), 4) + '$ y $\\sigma_y = ' + U.fmt(ML.sd(d.y), 4) + '$',
        '$r = \\dfrac{' + U.fmt(ML.cov(d.x, d.y), 4) + '}{' + U.fmt(ML.sd(d.x) * ML.sd(d.y), 4) + '} = ' + U.fmt(d.r, 4) + '$',
        'Correlación ' + (d.r > 0 ? 'positiva: al crecer $x$, crece $y$.' : 'negativa: al crecer $x$, decrece $y$.') +
        ' Es ' + (Math.abs(d.r) > 0.8 ? 'fuerte' : (Math.abs(d.r) > 0.5 ? 'moderada' : 'débil')) + '.'];
    },
    answer: function (d) { return U.fmt(d.r, 4); }
  });

  p.exercise({
    title: 'Recta de regresión y predicción',
    level: 'avanzado',
    gen: function (r) {
      var n = 5, x = [], y = [];
      var b = r.pick([2, 3, -2, 4]);
      var a = r.int(1, 10);
      for (var i = 0; i < n; i++) { x.push(i + 1); y.push(a + b * (i + 1) + r.int(-1, 1)); }
      var pend = ML.cov(x, y) / ML.variance(x);
      var ord = ML.mean(y) - pend * ML.mean(x);
      var xp = r.int(6, 10);
      return { x: x, y: y, b: pend, a: ord, xp: xp, pred: pend * xp + ord };
    },
    ask: function (d) {
      return 'Halla la recta de regresión de $Y$ sobre $X$ y úsala para predecir el valor de $y$ ' +
        'cuando $x = ' + d.xp + '$ (cuatro decimales):';
    },
    show: tablaHTML,
    fields: [
      { name: 'b', label: 'Pendiente', w: 'wide' },
      { name: 'a', label: 'Ordenada', w: 'wide' },
      { name: 'p', label: 'Predicción', w: 'wide' }
    ],
    sol: function (d) { return { b: U.round(d.b, 6), a: U.round(d.a, 6), p: U.round(d.pred, 6) }; },
    tol: 3e-4,
    hint: function () { return 'La pendiente es $\\frac{\\sigma_{xy}}{\\sigma_x^2}$, y la recta pasa por $(\\overline{x}, \\overline{y})$.'; },
    steps: function (d) {
      return ['$\\overline{x} = ' + U.fmt(ML.mean(d.x), 3) + '$, $\\overline{y} = ' + U.fmt(ML.mean(d.y), 3) + '$.',
        'Pendiente: $\\dfrac{\\sigma_{xy}}{\\sigma_x^2} = \\dfrac{' + U.fmt(ML.cov(d.x, d.y), 4) + '}{' +
        U.fmt(ML.variance(d.x), 4) + '} = ' + U.fmt(d.b, 4) + '$.',
        'Como pasa por el centro: $' + U.fmt(ML.mean(d.y), 3) + ' = ' + U.fmt(d.b, 4) + ' \\cdot ' +
        U.fmt(ML.mean(d.x), 3) + ' + a \\Rightarrow a = ' + U.fmt(d.a, 4) + '$.',
        'Recta: $y = ' + U.fmt(d.b, 4) + 'x ' + (d.a >= 0 ? '+ ' : '- ') + U.fmt(Math.abs(d.a), 4) + '$.',
        'Predicción para $x = ' + d.xp + '$: $' + U.fmt(d.pred, 4) + '$.',
        'Ojo: $x = ' + d.xp + '$ está fuera del rango observado, así que la predicción es arriesgada.'];
    },
    answer: function (d) {
      return 'y = ' + U.fmt(d.b, 4) + 'x + ' + U.fmt(d.a, 4) + '; predicción ' + U.fmt(d.pred, 4);
    }
  });

  p.exercise({
    title: '¿Qué se puede concluir?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'El número de bomberos enviados a un incendio y los daños causados están fuertemente correlacionados.', ok: 3 },
        { t: 'Las horas de estudio y la nota del examen tienen $r = 0{,}85$.', ok: 1 },
        { t: 'La talla de zapato y la nota en lengua de los niños de un colegio tienen $r = 0{,}7$.', ok: 3 },
        { t: 'Los datos de una parábola perfecta $y = x^2$ dan $r \\approx 0$.', ok: 2 },
        { t: 'El precio de un producto y su demanda tienen $r = -0{,}9$.', ok: 1 }
      ];
      var c = r.pick(casos);
      return { t: c.t, ok: c.ok };
    },
    ask: function (d) {
      return d.t + '<br><span style="font-size:14px;color:var(--ink-faint)">¿Qué conclusión es la ' +
        'correcta? <code>1</code>: hay relación lineal fuerte y tiene sentido usar la regresión. ' +
        '<code>2</code>: hay relación, pero no lineal, así que $r$ engaña. ' +
        '<code>3</code>: hay correlación pero seguramente por una tercera variable oculta.</span>';
    },
    fields: [{ name: 'c', label: 'Conclusión', w: 'tiny' }],
    sol: function (d) { return { c: d.ok }; },
    hint: function () { return 'Pregúntate siempre: ¿tiene sentido que una cause la otra, o hay algo detrás que explique las dos?'; },
    steps: function (d) {
      return ['La correlación mide asociación <strong>lineal</strong>, nada más.',
        'Que dos cosas vayan juntas puede deberse a causalidad, a azar o a una <em>variable de confusión</em> que afecta a las dos.',
        d.ok === 1 ? 'Aquí la relación lineal es fuerte y la explicación causal es razonable.'
          : (d.ok === 2 ? 'Aquí sí hay relación, pero no lineal: $r$ no la detecta.'
            : 'Aquí hay una tercera variable detrás (el tamaño del incendio, la edad…): correlación sin causalidad directa.')];
    },
    answer: function (d) {
      return ['', 'Relación lineal fuerte y regresión razonable',
        'Hay relación pero no lineal', 'Tercera variable oculta'][d.ok];
    }
  });

  p.keys([
    'Lo primero es <strong>dibujar la nube</strong>: la forma cuenta más que cualquier número.',
    '$r$ va de $-1$ a $1$ y mide la fuerza de la relación <strong>lineal</strong>.',
    '$r \\approx 0$ no significa «no hay relación», sino «no hay relación lineal».',
    'La recta de regresión minimiza los cuadrados de los errores y pasa por $(\\overline{x},\\overline{y})$.',
    '$r^2$ dice qué porcentaje de la variabilidad explica la recta.',
    '<strong>Correlación no implica causalidad.</strong> Nunca.'
  ]);
});
