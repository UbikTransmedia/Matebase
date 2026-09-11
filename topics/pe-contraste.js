/* Tema: Contraste de hipótesis */
Course.topic('pe-contraste', function (p) {

  var ZB = { 10: 1.645, 5: 1.96, 1: 2.575 };   // bilateral: z_{α/2}
  var ZU = { 10: 1.28, 5: 1.645, 1: 2.33 };    // unilateral: z_α

  p.puente('Se apoya en todo lo anterior: la [[pe-normal|normal]], la distribución de la ' +
    '[[pe-inferencia|media muestral]] y la de la [[pe-proporcion|proporción muestral]]. El estadístico ' +
    'que aparece aquí es la misma $z$ de tipificar, y el valor crítico sale de la misma tabla. Lo nuevo ' +
    'es la lógica de la decisión, que se parece más a un juicio que a un cálculo.');

  p.text('Un intervalo de confianza responde a <em>«¿cuánto vale?»</em>. Un contraste de hipótesis ' +
    'responde a otra pregunta, la que se hace cuando alguien afirma algo: <em>«¿es verdad?»</em>. El ' +
    'fabricante dice que sus bombillas duran 1000 horas; el alcalde, que el 60 % de los vecinos apoya ' +
    'su plan; el laboratorio, que su fármaco funciona. Con una muestra no se puede demostrar nada, pero ' +
    'sí se puede decidir si los datos son <strong>compatibles</strong> con la afirmación o si la ' +
    'contradicen, y además saber con qué probabilidad nos equivocamos al decidir.');

  /* ---------------------------------------------------------------- */
  p.section('Las dos hipótesis');

  p.list([
    '<strong>Hipótesis nula $H_0$</strong>: lo que se da por bueno mientras los datos no digan lo contrario. Siempre lleva la igualdad: $=$, $\\le$ o $\\ge$.',
    '<strong>Hipótesis alternativa $H_1$</strong>: lo que se sospecha, lo que habría que demostrar. Lleva $\\ne$, $<$ o $>$.'
  ]);

  p.table(['Si se sospecha que…', '$H_0$', '$H_1$', 'Tipo'],
    [['el valor ha cambiado, en cualquier sentido', '$\\mu = \\mu_0$', '$\\mu \\ne \\mu_0$', 'bilateral'],
     ['el valor es mayor de lo que se dice', '$\\mu \\le \\mu_0$', '$\\mu > \\mu_0$', 'unilateral por la derecha'],
     ['el valor es menor de lo que se dice', '$\\mu \\ge \\mu_0$', '$\\mu < \\mu_0$', 'unilateral por la izquierda']]);

  p.note('La lógica es la de un juicio: $H_0$ es la presunción de inocencia. Si las pruebas son ' +
    'abrumadoras, se rechaza. Si no lo son, <strong>no se rechaza</strong>, que no es lo mismo que ' +
    'demostrar que es cierta: un acusado absuelto por falta de pruebas no queda demostrado inocente.',
    null, 'Nunca se «acepta» del todo');

  p.comprueba('Un contraste al 5 % <em>no rechaza</em> $H_0: \\mu = 500$. ¿Qué se ha demostrado?', [
    { t: 'Que la media vale 500', ok: false, por: 'No rechazar no es demostrar. Los datos son compatibles con 500, pero también con 498 o con 503. Un absuelto por falta de pruebas no queda demostrado inocente.' },
    { t: 'Nada en firme: los datos no bastan para descartar que sea 500', ok: true, por: 'Es exactamente lo que dice el resultado, y no más. Con una muestra mayor podría rechazarse, o no.' },
    { t: 'Que la media no es 500, aunque con poca seguridad', ok: false, por: 'Al revés: la sospecha era que no fuera 500, y esa sospecha no ha encontrado apoyo suficiente en los datos.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Nivel de significación y región de rechazo');

  p.text('Se fija de antemano un <strong>nivel de significación</strong> $\\alpha$, casi siempre el 5 % o ' +
    'el 1 %: la probabilidad que se está dispuesto a asumir de rechazar $H_0$ siendo cierta. Con él se ' +
    'dibuja la <strong>región de rechazo</strong>: los valores tan extremos que, si $H_0$ fuera verdad, ' +
    'solo saldrían con probabilidad $\\alpha$.');

  p.table(['$\\alpha$', 'bilateral: $\\pm z_{\\alpha/2}$', 'unilateral: $z_{\\alpha}$'],
    [['10 %', '1,645', '1,28'], ['5 %', '1,96', '1,645'], ['1 %', '2,575', '2,33']]);

  p.demo({
    title: 'Dónde cae el estadístico',
    intro: 'La campana es la distribución del estadístico si H₀ fuera cierta. Las zonas rojas son la región de rechazo. Mueve el valor observado y cambia el tipo de contraste y el nivel: la misma z puede rechazar en uno y no en otro.',
    predice: 'El $z$ observado es 1,8 y $\\alpha = 5\\,\\%$. Antes de tocar nada: ¿rechazará el contraste bilateral? ¿Y el unilateral por la derecha? Los valores críticos están en la tabla de arriba.',
    build: function (host) {
      var tipo = 'bi', alfa = 5, zobs = 1.8;
      var out = W.readout(host, '');
      var phi = function (x) { return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI); };
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: -0.03, ymax: 0.45, height: 260, ylabel: null, yticks: false, xlabel: 'z',
        draw: function (g) {
          var zc = tipo === 'bi' ? ZB[alfa] : ZU[alfa];
          if (tipo === 'bi' || tipo === 'izq') g.area(phi, -4, tipo === 'bi' ? -zc : -zc, { fill: 'bad', fillAlpha: 0.35 });
          if (tipo === 'bi' || tipo === 'der') g.area(phi, zc, 4, { fill: 'bad', fillAlpha: 0.35 });
          g.fn(phi, { color: 0, w: 2.6 });
          g.vline(zobs, { color: 3, w: 2.4 });
          g.text(zobs, 0.42, 'z observado', { align: 'center', color: 3, size: 12, box: true });
        }
      });
      function pinta() {
        var zc = tipo === 'bi' ? ZB[alfa] : ZU[alfa];
        var rechaza = tipo === 'bi' ? Math.abs(zobs) > zc : (tipo === 'der' ? zobs > zc : zobs < -zc);
        var region = tipo === 'bi' ? '$|z| > ' + zc + '$' : (tipo === 'der' ? '$z > ' + zc + '$' : '$z < -' + zc + '$');
        out.set('Región de rechazo: ' + region + ' &nbsp;·&nbsp; $z$ observado $= ' + U.fmt(zobs, 2) + '$<br>' +
          (rechaza ? '<strong style="color:var(--bad)">Cae en la región de rechazo: se rechaza $H_0$ al ' + alfa + ' %.</strong>'
            : '<strong>Cae fuera: no se rechaza $H_0$ al ' + alfa + ' %.</strong> Los datos son compatibles con ella.'));
        plot.render();
      }
      W.chips(host, [{ label: 'bilateral (≠)', value: 'bi' }, { label: 'unilateral derecha (>)', value: 'der' }, { label: 'unilateral izquierda (<)', value: 'izq' }], { value: tipo, on: function (v) { tipo = v; pinta(); } });
      W.chips(host, [{ label: 'α = 10 %', value: 10 }, { label: 'α = 5 %', value: 5 }, { label: 'α = 1 %', value: 1 }], { value: alfa, on: function (v) { alfa = v; pinta(); } });
      W.slider(W.row(host), { label: 'z observado', min: -3.5, max: 3.5, step: 0.05, value: zobs, on: function (v) { zobs = v; pinta(); } });
      W.hint(host, 'Con z = 1,8: el bilateral al 5 % no rechaza, pero el unilateral por la derecha sí. Por eso las hipótesis se plantean antes de mirar los datos.');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Los contrastes para la media y para la proporción');

  p.formulas([
    'z = \\frac{\\overline{x} - \\mu_0}{\\sigma / \\sqrt{n}} \\quad \\text{(media, con } \\sigma \\text{ conocida o } n \\text{ grande)}',
    'z = \\frac{\\hat{p} - p_0}{\\sqrt{p_0\\,(1 - p_0)/n}} \\quad \\text{(proporción)}'
  ], 'los dos estadísticos de contraste',
    'Los dos miden lo mismo: <em>a cuántas desviaciones típicas está lo observado de lo que dice $H_0$</em>.<br><br>' +
      '$\\mu_0$ y $p_0$ son los valores de la hipótesis nula. Atención a la raíz de la proporción: aquí ' +
      'se usa $p_0$, no $\\hat{p}$, porque se razona <strong>suponiendo que $H_0$ es cierta</strong>. En ' +
      'el intervalo de confianza, en cambio, se usaba $\\hat{p}$.');

  p.list([
    'Plantear $H_0$ y $H_1$, y decidir si el contraste es bilateral o unilateral.',
    'Fijar $\\alpha$ y buscar el valor crítico: la región de rechazo.',
    'Calcular el estadístico con los datos de la muestra.',
    'Decidir: si cae en la región de rechazo, se rechaza $H_0$; si no, no se rechaza.',
    'Escribir la conclusión <strong>en el contexto del problema</strong>, con palabras.'
  ], true);

  p.ejemplo({
    title: 'Un contraste con los cinco pasos',
    enunciado: 'Un fabricante afirma que sus bombillas duran de media 1000 horas, con $\\sigma = 60$. Una asociación de consumidores sospecha que duran menos y prueba 36 bombillas: la media sale 978 horas. ¿Tiene razón la asociación, al 5 %?',
    pasos: [
      { t: '<strong>Hipótesis.</strong> $H_0: \\mu \\ge 1000$ (lo que afirma el fabricante) y $H_1: \\mu < 1000$ (la sospecha). Unilateral por la izquierda.', antes: '¿Qué va en $H_0$ y qué en $H_1$? ¿Bilateral o unilateral?' },
      { t: '<strong>Región de rechazo.</strong> Unilateral al 5 %: $z_\\alpha = 1{,}645$. Se rechaza $H_0$ si $z < -1{,}645$.' },
      { t: '<strong>Estadístico.</strong> $z = \\dfrac{978 - 1000}{60/\\sqrt{36}} = \\dfrac{-22}{10} = -2{,}2$.', antes: 'Ojo al denominador: es $\\sigma/\\sqrt{n}$, la desviación de la media, no $\\sigma$.' },
      { t: '<strong>Decisión.</strong> $-2{,}2 < -1{,}645$: cae en la región de rechazo. Se rechaza $H_0$.' },
      { t: '<strong>Conclusión con palabras.</strong> Con un nivel de significación del 5 %, hay pruebas de que las bombillas duran menos de lo que afirma el fabricante.', antes: 'Escríbelo en el contexto del problema, sin $z$ ni $H_0$.' }
    ],
    cierre: 'Con $\\alpha = 1\\,\\%$ el valor crítico sería 2,33 y $-2{,}2$ no llegaría: no se rechazaría. El mismo dato, otra decisión. Por eso el nivel se fija <em>antes</em> de mirar los datos, no después.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Los dos errores posibles');

  p.table(['', '$H_0$ es cierta', '$H_0$ es falsa'],
    [['Se rechaza $H_0$', '<strong>error de tipo I</strong> (probabilidad $\\alpha$)', 'decisión correcta'],
     ['No se rechaza $H_0$', 'decisión correcta', '<strong>error de tipo II</strong> (probabilidad $\\beta$)']]);

  p.text('Los dos errores tiran en sentidos opuestos: bajar $\\alpha$ para no condenar a un inocente hace ' +
    'más fácil absolver a un culpable. La única manera de reducir los dos a la vez es la de siempre: ' +
    '<strong>una muestra más grande</strong>. La idea de las dos hipótesis y los dos errores la ' +
    'formalizaron Jerzy Neyman y Egon Pearson en 1933.');

  p.note('Muchos estudios dan un <strong>p-valor</strong> en lugar de un sí o un no: la probabilidad de ' +
    'obtener un resultado al menos tan extremo como el observado si $H_0$ fuera cierta. Si el p-valor es ' +
    'menor que $\\alpha$, se rechaza $H_0$. Un p-valor de 0,03 no significa «un 3 % de probabilidad de que ' +
    '$H_0$ sea cierta»: significa que, si lo fuera, un resultado así saldría 3 veces de cada 100.',
    'ok', 'El p-valor, en una frase');

  p.trampas([
    { e: 'Poner la sospecha en $H_0$', por: '$H_0$ es lo que se da por bueno mientras no haya pruebas, y lleva la igualdad. La sospecha es $H_1$: es lo que hay que demostrar.' },
    { e: 'Elegir bilateral o unilateral después de ver los datos', por: 'Con $z = 1{,}8$ al 5 %, el bilateral no rechaza y el unilateral sí. Elegir a posteriori es hacer trampa: el tipo de contraste lo fija la pregunta, antes.' },
    { e: 'Usar $\\sigma$ en lugar de $\\sigma/\\sqrt{n}$', por: 'Con $\\sigma = 60$ y $n = 36$, el estadístico sale $-0{,}37$ en vez de $-2{,}2$: nada se rechazaría nunca.' },
    { e: 'Leer «no se rechaza $H_0$» como «$H_0$ es cierta»', por: 'Solo dice que los datos no bastan para descartarla. Un juicio sin pruebas absuelve; no demuestra inocencia.' },
    { e: 'Poner $\\hat{p}$ en la raíz del contraste de proporción', por: 'Se razona <em>suponiendo $H_0$ cierta</em>, así que va $p_0$. En el intervalo de confianza, que no supone nada, iba $\\hat{p}$.' }
  ]);

  p.hist('El primer contraste de hipótesis de la historia se publicó en 1710. John Arbuthnot, médico de ' +
    'la reina Ana de Inglaterra, revisó los registros de bautismos de Londres de los 82 años anteriores ' +
    'y vio que <em>todos</em> los años habían nacido más niños que niñas. Si nacer niño o niña fuera como ' +
    'lanzar una moneda, la probabilidad de que eso pasara 82 años seguidos sería $(1/2)^{82}$, un número ' +
    'con veinticinco ceros detrás de la coma. Arbuthnot rechazó la hipótesis del puro azar. Su ' +
    'conclusión fue teológica —lo atribuyó a la Providencia—, pero el razonamiento es exactamente el de ' +
    'este tema.');

  p.util('Cada vez que una web cambia el color de un botón, lo enseña a la mitad de sus visitantes y ' +
    'compara cuántos compran, está haciendo un contraste para dos proporciones: el llamado <em>test ' +
    'A/B</em>, que hoy decide buena parte del diseño de internet. Las agencias del medicamento exigen un ' +
    'contraste antes de aprobar un fármaco, y una fábrica lo usa para decidir si una máquina se ha ' +
    'desajustado sin tener que parar la línea. Y conviene saber su límite: si se prueban veinte cosas ' +
    'al 5 %, lo esperable es que una salga «significativa» por pura casualidad.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Plantear las hipótesis',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'Un fabricante asegura que sus pilas duran de media al menos 500 horas. Una asociación de consumidores sospecha que duran menos.', ok: 'b', opts: ['$H_0: \\mu = 500$, $H_1: \\mu \\ne 500$', '$H_0: \\mu \\ge 500$, $H_1: \\mu < 500$', '$H_0: \\mu \\le 500$, $H_1: \\mu > 500$', '$H_0: \\mu < 500$, $H_1: \\mu \\ge 500$'] },
        { t: 'Una máquina debe llenar botellas con 1 litro. Se quiere comprobar si está desajustada.', ok: 'a', opts: ['$H_0: \\mu = 1$, $H_1: \\mu \\ne 1$', '$H_0: \\mu \\ge 1$, $H_1: \\mu < 1$', '$H_0: \\mu \\le 1$, $H_1: \\mu > 1$', '$H_0: \\mu \\ne 1$, $H_1: \\mu = 1$'] },
        { t: 'Hasta ahora el 20 % de los clientes compraba en la web. Tras rediseñarla, se cree que la proporción ha aumentado.', ok: 'c', opts: ['$H_0: p = 0{,}2$, $H_1: p \\ne 0{,}2$', '$H_0: p \\ge 0{,}2$, $H_1: p < 0{,}2$', '$H_0: p \\le 0{,}2$, $H_1: p > 0{,}2$', '$H_0: p > 0{,}2$, $H_1: p \\le 0{,}2$'] },
        { t: 'Un político afirma que como mucho el 30 % de la población está en contra de su propuesta. La oposición cree que son más.', ok: 'c', opts: ['$H_0: p = 0{,}3$, $H_1: p \\ne 0{,}3$', '$H_0: p \\ge 0{,}3$, $H_1: p < 0{,}3$', '$H_0: p \\le 0{,}3$, $H_1: p > 0{,}3$', '$H_0: p < 0{,}3$, $H_1: p \\ge 0{,}3$'] }
      ];
      var c = r.pick(casos);
      return { t: c.t, ok: c.ok, opts: c.opts.map(function (o, i) { return { t: o, v: 'abcd'.charAt(i) }; }) };
    },
    ask: function (d) { return d.t + ' ¿Qué hipótesis se contrastan?'; },
    fields: function (d) { return [{ name: 'h', label: 'Hipótesis', opts: d.opts }]; },
    sol: function (d) { return { h: d.ok }; },
    errores: [{ si: function (v, d) { return d.ok !== 'a' && v.raw.h === 'd'; }, msg: 'La igualdad va siempre en $H_0$: la hipótesis nula nunca lleva $<$, $>$ ni $\\ne$.' }],
    hint: function () { return ['Lo que se sospecha va en $H_1$.', '$H_0$ lleva siempre el igual ($=$, $\\le$ o $\\ge$).']; },
    steps: function (d) { return ['Lo que se quiere probar es la alternativa; la afirmación de partida, con la igualdad, es la nula.', 'Respuesta: ' + d.opts.filter(function (o) { return o.v === d.ok; })[0].t]; },
    answer: function (d) { return d.opts.filter(function (o) { return o.v === d.ok; })[0].t; }
  });

  p.exercise({
    title: 'El valor crítico',
    level: 'basico',
    gen: function (r) {
      var alfa = r.pick([10, 5, 1]), tipo = r.pick(['bi', 'uni']);
      return { alfa: alfa, tipo: tipo, z: tipo === 'bi' ? ZB[alfa] : ZU[alfa] };
    },
    ask: function (d) { return 'Halla el valor crítico $z$ para un contraste ' + (d.tipo === 'bi' ? '<strong>bilateral</strong>' : '<strong>unilateral</strong>') + ' con nivel de significación $\\alpha = ' + (d.alfa / 100).toString().replace('.', '{,}') + '$ (dos decimales; da el valor positivo).'; },
    fields: [{ name: 'z', label: 'z', w: 'tiny' }],
    sol: function (d) { return { z: d.z }; },
    tol: 0.004,
    errores: [{ si: function (v, d) { return d.tipo === 'uni' && Math.abs(v.z - ZB[d.alfa]) < 0.01; }, msg: 'Ese es el de un contraste bilateral. En el unilateral, todo el $\\alpha$ va a una sola cola.' },
      { si: function (v, d) { return d.tipo === 'bi' && Math.abs(v.z - ZU[d.alfa]) < 0.01; }, msg: 'Ese es el de un unilateral. En el bilateral, $\\alpha$ se reparte entre las dos colas: se busca $z_{\\alpha/2}$.' }],
    hint: function (d) { return d.tipo === 'bi' ? 'En el bilateral, $\\alpha$ se reparte en dos colas: busca $z$ con $P(Z \\le z) = 1 - \\frac{\\alpha}{2}$.' : 'En el unilateral, todo $\\alpha$ está en una cola: busca $z$ con $P(Z \\le z) = 1 - \\alpha$.'; },
    steps: function (d) { return [d.tipo === 'bi' ? '$P(Z \\le z) = 1 - ' + (d.alfa / 200) + ' = ' + (1 - d.alfa / 200) + '$, que en la tabla da $z = ' + d.z + '$.' : '$P(Z \\le z) = 1 - ' + (d.alfa / 100) + ' = ' + (1 - d.alfa / 100) + '$, que en la tabla da $z = ' + d.z + '$.']; },
    answer: function (d) { return String(d.z).replace('.', ','); }
  });

  p.exercise({
    title: '¿Qué tipo de error?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Un test concluye que un fármaco funciona, cuando en realidad no tiene ningún efecto.', ok: 'I' },
        { t: 'Un control de calidad no detecta que la máquina está desajustada, y la deja funcionando.', ok: 'II' },
        { t: 'Un juez condena a un acusado que era inocente.', ok: 'I' },
        { t: 'Un análisis no rechaza que la moneda sea legal, y efectivamente lo es.', ok: 'ok' },
        { t: 'Se concluye que una nueva web no vende más que la antigua, cuando en realidad sí vende más.', ok: 'II' },
        { t: 'Se rechaza que el dado esté equilibrado y, en efecto, estaba trucado.', ok: 'ok' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return d.t; },
    fields: [{ name: 't', label: 'Es', opts: [{ t: 'un error de tipo I', v: 'I' }, { t: 'un error de tipo II', v: 'II' }, { t: 'una decisión correcta', v: 'ok' }] }],
    sol: function (d) { return { t: d.ok }; },
    hint: function () { return ['Identifica primero cuál es $H_0$ (lo que se da por bueno: «no funciona», «está bien ajustada», «es inocente»).', 'Tipo I: rechazar $H_0$ siendo cierta. Tipo II: no rechazarla siendo falsa.']; },
    steps: function (d) { return [{ I: 'Se ha rechazado una $H_0$ que era cierta: <strong>error de tipo I</strong>.', II: 'No se ha rechazado una $H_0$ que era falsa: <strong>error de tipo II</strong>.', ok: 'La decisión coincide con la realidad: <strong>no hay error</strong>.' }[d.ok]]; },
    answer: function (d) { return { I: 'Error de tipo I', II: 'Error de tipo II', ok: 'Decisión correcta' }[d.ok]; }
  });

  p.problem({
    title: 'Contraste para la media',
    level: 'avanzado',
    gen: function (r) {
      var mu0 = r.pick([500, 250, 120, 80]), sigma = r.pick([10, 12, 15, 20, 25]), n = r.pick([36, 49, 64, 100]);
      var alfa = r.pick([5, 1]), dir = r.pick(['izq', 'bi']);
      var z0 = r.real(-3.2, 1.2, 2);
      var xbar = Math.round((mu0 + z0 * sigma / Math.sqrt(n)) * 10) / 10;
      var z = (xbar - mu0) / (sigma / Math.sqrt(n));
      var zc = dir === 'bi' ? ZB[alfa] : ZU[alfa];
      var rechaza = dir === 'bi' ? Math.abs(z) > zc : z < -zc;
      if (Math.abs(Math.abs(z) - zc) < 0.03) return null;
      return { mu0: mu0, sigma: sigma, n: n, alfa: alfa, dir: dir, xbar: xbar, z: z, zc: zc, dec: rechaza ? 'rechaza' : 'no' };
    },
    intro: function (d) {
      return (d.dir === 'izq'
        ? 'Un fabricante afirma que la duración media de su producto es de al menos $' + d.mu0 + '$ horas, con $\\sigma = ' + d.sigma + '$. Se sospecha que dura menos.'
        : 'Una máquina está calibrada para una media de $' + d.mu0 + '$ unidades, con $\\sigma = ' + d.sigma + '$. Se quiere saber si se ha desajustado.') +
        ' En una muestra de $' + d.n + '$ elementos se obtiene $\\overline{x} = ' + U.fmt(d.xbar, 1) + '$. Nivel de significación: $' + d.alfa + '\\,\\%$.';
    },
    partes: [
      {
        ask: function () { return 'Calcula el estadístico de contraste $z$ (dos decimales).'; },
        fields: [{ name: 'z', label: 'z', w: 'tiny' }],
        sol: function (d) { return { z: U.round(d.z, 4) }; },
        tol: 0.006,
        errores: [{ si: function (v, d) { var zmal = (d.xbar - d.mu0) / d.sigma; return Math.abs(zmal - d.z) > 0.02 && Math.abs(v.z - zmal) < 0.01; }, msg: 'Falta dividir la desviación típica por $\\sqrt{n}$: el estadístico usa la desviación de la <em>media</em>, $\\sigma/\\sqrt{n}$.' }],
        hint: function () { return '$z = \\frac{\\overline{x} - \\mu_0}{\\sigma/\\sqrt{n}}$.'; },
        steps: function (d) { return ['$z = \\dfrac{' + U.fmt(d.xbar, 1) + ' - ' + d.mu0 + '}{' + d.sigma + '/\\sqrt{' + d.n + '}} = \\dfrac{' + U.fmt(d.xbar - d.mu0, 1) + '}{' + U.fmt(d.sigma / Math.sqrt(d.n), 4) + '} \\approx ' + U.fmt(d.z, 2) + '$']; },
        answer: function (d) { return U.fmt(d.z, 2); }
      },
      {
        ask: function (d) { return '¿Cuál es el valor crítico? (en positivo; ' + (d.dir === 'bi' ? 'el contraste es bilateral' : 'el contraste es unilateral') + ')'; },
        fields: [{ name: 'z', label: 'valor crítico', w: 'tiny' }],
        sol: function (d) { return { z: d.zc }; },
        tol: 0.004,
        hint: function (d) { return d.dir === 'bi' ? 'Bilateral: $z_{\\alpha/2}$.' : 'Unilateral: $z_\\alpha$.'; },
        steps: function (d) { return ['$H_0: \\mu ' + (d.dir === 'bi' ? '=' : '\\ge') + ' ' + d.mu0 + '$, $H_1: \\mu ' + (d.dir === 'bi' ? '\\ne' : '<') + ' ' + d.mu0 + '$.', 'Valor crítico al ' + d.alfa + ' %: $' + d.zc + '$. Región de rechazo: ' + (d.dir === 'bi' ? '$|z| > ' + d.zc + '$' : '$z < -' + d.zc + '$') + '.']; },
        answer: function (d) { return String(d.zc).replace('.', ','); }
      },
      {
        ask: function () { return '¿Qué se decide?'; },
        fields: [{ name: 't', label: 'Decisión', opts: [{ t: 'Se rechaza $H_0$', v: 'rechaza' }, { t: 'No se rechaza $H_0$', v: 'no' }] }],
        sol: function (d) { return { t: d.dec }; },
        errores: [{ si: function (v, d) { return v.raw.t === 'rechaza' && d.dir === 'izq' && d.z > 0; }, msg: 'La media muestral está por encima de $\\mu_0$: eso nunca apoya la sospecha de que la media sea menor.' }],
        hint: function () { return 'Mira si el estadístico cae en la región de rechazo.'; },
        steps: function (d) {
          return [d.dec === 'rechaza'
            ? '$z \\approx ' + U.fmt(d.z, 2) + '$ cae en la región de rechazo: <strong>se rechaza $H_0$</strong>. Con un ' + d.alfa + ' % de significación, los datos contradicen la afirmación.'
            : '$z \\approx ' + U.fmt(d.z, 2) + '$ no cae en la región de rechazo: <strong>no se rechaza $H_0$</strong>. Los datos no bastan para contradecir la afirmación.'];
        },
        answer: function (d) { return d.dec === 'rechaza' ? 'Se rechaza H₀' : 'No se rechaza H₀'; }
      }
    ]
  });

  p.problem({
    title: 'Contraste para una proporción',
    level: 'avanzado',
    gen: function (r) {
      var p0 = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]), n = r.pick([200, 300, 400, 500]);
      var alfa = r.pick([5, 1]);
      var X = r.int(Math.round((p0 - 0.03) * n), Math.round((p0 + 0.12) * n));
      var ph = X / n, z = (ph - p0) / Math.sqrt(p0 * (1 - p0) / n), zc = ZU[alfa];
      if (Math.abs(z - zc) < 0.03) return null;
      return { p0: p0, n: n, alfa: alfa, X: X, ph: ph, z: z, zc: zc, dec: z > zc ? 'rechaza' : 'no' };
    },
    intro: function (d) {
      return 'Hasta ahora, el $' + U.fmt(100 * d.p0, 0) + '\\,\\%$ de los usuarios de una aplicación pagaba la versión completa. Tras un cambio de precio se cree que la proporción ha aumentado. En una muestra de $' + d.n + '$ usuarios nuevos, $' + d.X + '$ la han pagado. Contrasta con $\\alpha = ' + (d.alfa / 100).toString().replace('.', '{,}') + '$.';
    },
    partes: [
      {
        ask: function () { return 'Calcula la proporción muestral $\\hat{p}$ (cuatro decimales).'; },
        fields: [{ name: 'v', label: 'p̂', w: 'wide' }],
        sol: function (d) { return { v: U.round(d.ph, 6) }; },
        tol: 3e-4,
        hint: function () { return '$\\hat{p} = X/n$.'; },
        steps: function (d) { return ['$\\hat{p} = \\frac{' + d.X + '}{' + d.n + '} = ' + U.fmt(d.ph, 4) + '$']; },
        answer: function (d) { return U.fmt(d.ph, 4); }
      },
      {
        ask: function () { return 'Calcula el estadístico de contraste (dos decimales).'; },
        fields: [{ name: 'z', label: 'z', w: 'tiny' }],
        sol: function (d) { return { z: U.round(d.z, 4) }; },
        tol: 0.006,
        errores: [{ si: function (v, d) { var zmal = (d.ph - d.p0) / Math.sqrt(d.ph * (1 - d.ph) / d.n); return Math.abs(zmal - d.z) > 0.02 && Math.abs(v.z - zmal) < 0.005; }, msg: 'En la raíz va $p_0$, el valor de la hipótesis nula, no $\\hat{p}$: se razona suponiendo que $H_0$ es cierta.' }],
        hint: function (d) { return '$z = \\frac{\\hat{p} - p_0}{\\sqrt{p_0(1-p_0)/n}}$ con $p_0 = ' + U.fmt(d.p0, 2) + '$.'; },
        steps: function (d) { return ['$z = \\dfrac{' + U.fmt(d.ph, 4) + ' - ' + U.fmt(d.p0, 2) + '}{\\sqrt{' + U.fmt(d.p0, 2) + '\\cdot' + U.fmt(1 - d.p0, 2) + '/' + d.n + '}} \\approx ' + U.fmt(d.z, 2) + '$']; },
        answer: function (d) { return U.fmt(d.z, 2); }
      },
      {
        ask: function () { return '¿Se puede afirmar que la proporción ha aumentado?'; },
        fields: [{ name: 't', label: 'Decisión', opts: [{ t: 'Sí: se rechaza $H_0: p \\le p_0$', v: 'rechaza' }, { t: 'No: no se rechaza $H_0$', v: 'no' }] }],
        sol: function (d) { return { t: d.dec }; },
        errores: [{ si: function (v, d) { return d.dec === 'no' && d.ph > d.p0 && v.raw.t === 'rechaza'; }, msg: 'Que $\\hat{p}$ sea mayor que $p_0$ no basta: la diferencia tiene que ser mayor que la que produciría el azar.' }],
        hint: function (d) { return 'Unilateral por la derecha: se rechaza si $z > ' + d.zc + '$.'; },
        steps: function (d) {
          return ['$H_0: p \\le ' + U.fmt(d.p0, 2) + '$, $H_1: p > ' + U.fmt(d.p0, 2) + '$. Región de rechazo: $z > ' + d.zc + '$.',
            d.dec === 'rechaza' ? '$' + U.fmt(d.z, 2) + ' > ' + d.zc + '$: se rechaza $H_0$. Hay pruebas de que la proporción ha aumentado.'
              : '$' + U.fmt(d.z, 2) + ' \\le ' + d.zc + '$: no se rechaza $H_0$. Los datos no permiten afirmar que haya aumentado.'];
        },
        answer: function (d) { return d.dec === 'rechaza' ? 'Sí' : 'No'; }
      }
    ]
  });

  p.keys([
    '$H_0$ lleva la igualdad y es lo que se da por bueno; $H_1$ es lo que se sospecha.',
    'Bilateral ($\\ne$): región de rechazo $|z| > z_{\\alpha/2}$. Unilateral ($<$ o $>$): $z < -z_\\alpha$ o $z > z_\\alpha$.',
    'Media: $z = \\frac{\\bar x - \\mu_0}{\\sigma/\\sqrt n}$. Proporción: $z = \\frac{\\hat p - p_0}{\\sqrt{p_0(1-p_0)/n}}$, con $p_0$ en la raíz.',
    'Si el estadístico cae en la región de rechazo, se rechaza $H_0$; si no, no se rechaza (que no es demostrarla).',
    'Error de tipo I: rechazar una $H_0$ cierta (probabilidad $\\alpha$). Tipo II: no rechazar una falsa.',
    'La conclusión se escribe siempre en el contexto del problema, con palabras.'
  ]);
});
