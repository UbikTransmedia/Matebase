/* Tema: Lo que el modelo no puede saber */
Course.topic('ia-limites', function (p) {

  p.puente('De [[cib-segundo-orden|los efectos de segundo orden]] viene la idea de que una intervención ' +
    'cambia el sistema sobre el que interviene; de [[pe-causal|la inferencia causal]], la de variable ' +
    'de confusión; y de [[av-computabilidad|la computabilidad]], la de que hay preguntas sin respuesta ' +
    'algorítmica. Los tres límites de este tema salen de ahí, y ninguno se arregla con más datos.');

  p.text('Todo lo anterior ha sido cómo funcionan estas máquinas. Este tema es lo contrario: ' +
    '<strong>qué no pueden hacer, y por qué no es cuestión de esperar</strong>. No son pegas de ' +
    'ingeniería pendientes de resolver: son consecuencias de cómo están planteadas.');

  /* ---------------------------------------------------------------- */
  p.section('La ley de Goodhart');

  p.text('El primer límite ya tiene nombre en este curso: es [[cib-segundo-orden|la ley de Goodhart]], ' +
    'que allí salía como un efecto de segundo orden del propio acto de medir. Conviene traerla aquí ' +
    'porque en un sistema que aprende deja de ser una regularidad de gestión y se convierte en ' +
    '<strong>el mecanismo exacto por el que un modelo empeora mientras su puntuación sube</strong>.');

  p.text('El motivo, recordado en una línea: una medida se elige porque <em>se correlaciona</em> con lo ' +
    'que importa y es fácil de contar, y esa correlación se sostiene mientras nadie intente forzarla. ' +
    'La diferencia es que un optimizador no se cansa. Donde una persona encontraría tres atajos, el ' +
    'descenso de gradiente explora sistemáticamente todos los que caben en sus parámetros, y se queda ' +
    'con el más barato.');

  p.demo({
    title: 'Optimizar la medida y perder lo que importa',
    intro: 'Un sistema reparte su esfuerzo entre mejorar de verdad y subir la medida por la vía barata. La línea azul es lo que importa; la naranja, lo que se mide. Mueve el reparto y mira cómo se separan.',
    predice: 'Al principio las dos suben juntas, porque la medida se eligió precisamente por parecerse a lo que importa. ¿Crees que seguirán juntas si se aprieta mucho la medida?',
    build: function (host) {
      var g = 0;
      /* calidad: el esfuerzo la sube, y lo que se desvia a inflar la medida la baja.
         medida: sube con la calidad y ademas con lo inflado, que es mas barato. */
      function calidad(gg) { return 0.25 + 0.75 * (1 - gg) - 0.1; }
      function medida(gg) { return calidad(gg) + 0.9 * gg; }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 1, ymin: 0, ymax: 1.2, height: 250,
        xlabel: 'parte del esfuerzo dedicada a inflar la medida', ylabel: 'valor',
        aria: 'Dos curvas: la calidad real, que baja, y la medida, que sube, según cuánto esfuerzo se dedica a inflarla',
        draw: function (gg) {
          gg.fn(calidad, { color: 0, w: 2.6 });
          gg.fn(medida, { color: 2, w: 2.6 });
          gg.vline(g, { color: 'axis', w: 1.2, dash: [4, 3] });
          gg.point(g, calidad(g), { color: 0, r: 5 });
          gg.point(g, medida(g), { color: 2, r: 5 });
        }
      });
      W.legend(host, [{ c: 0, t: 'lo que importa' }, { c: 2, t: 'lo que se mide' }]);
      function pinta() {
        var c = calidad(g), m = medida(g);
        out.set('Esfuerzo desviado a inflar la medida: <strong>' + U.fmt(100 * g, 0) + ' %</strong><br>' +
          'Lo que importa: <strong>' + U.fmt(c, 3) + '</strong> &nbsp;·&nbsp; lo que se mide: ' +
          '<strong>' + U.fmt(m, 3) + '</strong> &nbsp;·&nbsp; diferencia ' + U.fmt(m - c, 3) + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (g < 0.05 ? 'Sin presión sobre la medida, las dos van casi juntas: por eso la medida parecía buena.'
            : (g > 0.7 ? 'La medida está en máximos y lo que importa se ha hundido. Quien mire sólo el número dirá que todo va estupendamente.'
              : 'Ya se separan. Y fíjate en que <em>nadie ha hecho trampa</em>: el sistema sólo ha optimizado lo que se le pidió optimizar.')) +
          '</span>');
        plot.render();
      }
      W.slider(host, { label: 'esfuerzo desviado', min: 0, max: 1, step: 0.02, value: 0, dec: 2, on: function (v) { g = v; pinta(); } });
      pinta();
    }
  });

  p.note('Esto es [[cib-segundo-orden|un efecto de segundo orden]] de manual: la intervención cambia el ' +
    'sistema medido. Y aparece en cuanto se ajusta un modelo por preferencias, como viste en ' +
    '[[ia-llm|el tema del LLM]]: si la puntuación premia respuestas que <em>parecen</em> completas, el ' +
    'modelo aprende a producir esa apariencia, que es más barato que ser correcto. No hace falta ' +
    'ninguna mala intención por ninguna parte.', 'warn', 'Nadie tiene que hacer trampa');

  /* ---------------------------------------------------------------- */
  p.section('El sesgo es una variable de confusión');

  p.text('El segundo límite se enuncia mal casi siempre. No es que los modelos «tengan prejuicios», ni ' +
    'que haya que corregirles la ideología: es que <strong>aprenden la estructura estadística de los ' +
    'datos, incluida la que nadie quería</strong>.');

  p.text('Lo que ocurre tiene nombre en [[pe-causal|inferencia causal]]. Si en los datos históricos una ' +
    'variable irrelevante viene correlacionada con lo que se quiere predecir, el modelo la usará, ' +
    'porque su único criterio es acertar. Y no distingue correlación de causa: <strong>no tiene ninguna ' +
    'forma de distinguirlas</strong>, porque esa distinción no está en los datos.');

  p.table(['Lo que pasa', 'Cómo se cuenta mal', 'Qué es en realidad'],
    [['El modelo asocia un barrio a más riesgo', 'el modelo es injusto', 'el barrio estaba correlacionado con la variable que de verdad importaba, y es más fácil de medir'],
     ['Filtra currículums favoreciendo un perfil', 'el modelo discrimina', 'reprodujo qué currículums fueron aceptados antes, que es lo único que se le enseñó'],
     ['Falla más con algunos grupos', 'el algoritmo está mal hecho', 'esos grupos estaban poco representados en los datos y el error en ellos apenas pesaba en la media']]);

  p.note('La consecuencia práctica importa: <strong>quitar la variable sensible de la entrada no resuelve ' +
    'nada</strong>. Si estaba correlacionada con otras que sí quedan —el código postal, el nombre del ' +
    'colegio, la forma de escribir— el modelo la reconstruye sin esfuerzo. Es exactamente el problema ' +
    'de la variable de confusión, y por eso hace falta mirar el resultado por grupos, como en ' +
    '[[ia-evaluar|el tema de evaluar]], y no fiarse de una media global.',
    'warn', 'Borrar la columna no sirve');

  /* ---------------------------------------------------------------- */
  p.section('Ejemplos adversarios: un paso en la dirección del gradiente');

  p.text('El tercer límite es el más concreto de los tres, y sale directamente de ' +
    '[[ia-retropropagacion|la retropropagación]]. Durante el entrenamiento se calcula la derivada de la ' +
    'pérdida respecto de <em>los pesos</em>, para corregirlos. Pero nada impide calcularla respecto de ' +
    '<strong>la entrada</strong>: es el mismo grafo y la misma regla de la cadena.');

  p.formula('\\vec x\' = \\vec x + \\varepsilon\\, \\frac{\\nabla_{\\vec x} L}{\\Vert \\nabla_{\\vec x} L \\Vert}',
    'un ejemplo adversario, en una línea',
    'Se calcula el gradiente de la pérdida respecto de la entrada y se da un pasito en esa dirección. ' +
    'Por definición de gradiente, <strong>esa es la dirección en la que la pérdida sube más deprisa</strong>: ' +
    'ninguna otra dirección estropea tanto la predicción con el mismo tamaño de paso.<br><br>' +
    'No hace falta acceso a nada raro: con el modelo en la mano, el ataque es una sola pasada hacia ' +
    'atrás, más barata que entrenar un solo lote.');

  p.demo({
    title: 'La dirección importa más que el tamaño',
    intro: 'Con un paso del mismo tamaño en todos los casos, se compara cuánto sube la pérdida yendo por el gradiente y yendo en direcciones al azar. Cambia la dimensión del problema y mira la diferencia.',
    predice: 'En el plano, una dirección al azar tiene una probabilidad decente de apuntar hacia donde duele. ¿Crees que seguirá siendo así con sesenta y cuatro dimensiones?',
    build: function (host) {
      var datos = [
        { dim: 2, grad: 0.03608, azar: 0.02954, razon: 1.22, siempre: false },
        { dim: 16, grad: 0.00269, azar: 0.00078, razon: 3.45, siempre: true },
        { dim: 64, grad: 0.00007, azar: 0.00001, razon: 7.00, siempre: true }
      ];
      var sel = 0;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.6, xmax: 2.6, ymin: 0, ymax: 8, height: 230, xstep: 1,
        ylabel: 'ventaja del gradiente', xtickLabel: function (v) { return datos[v] ? datos[v].dim + ' dim' : ''; },
        aria: 'Cuántas veces sube más la pérdida yendo por el gradiente que por la mejor de cinco direcciones al azar, según la dimensión',
        draw: function (g) {
          g.hline(1, { color: 'axis', w: 1.2, dash: [4, 3] });
          g.bars(datos.map(function (d, i) { return { x: i, h: d.razon, color: (i === sel ? 3 : 2), top: '×' + U.fmt(d.razon, 2) }; }), { width: 0.5 });
        }
      });
      function pinta() {
        var d = datos[sel];
        out.set('Con <strong>' + d.dim + '</strong> dimensiones y un paso de $0{,}05$:<br>' +
          'por el gradiente la pérdida sube <strong>' + U.fmt(d.grad, 5) + '</strong>; por la mejor de ' +
          'cinco direcciones al azar, <strong>' + U.fmt(d.azar, 5) + '</strong>. Ventaja: ' +
          '<strong>×' + U.fmt(d.razon, 2) + '</strong>.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (d.siempre ? 'Y el gradiente gana en <strong>los cuarenta puntos probados</strong>, sin una sola excepción.'
            : 'En el plano la ventaja es pequeña y el azar gana a veces: con dos direcciones posibles, acertar no tiene mérito.') +
          ' Medido entrenando un clasificador sobre nubes solapadas y promediando cuarenta puntos.</span>');
        plot.render();
      }
      W.chips(host, datos.map(function (d, i) { return { label: d.dim + ' dimensiones', value: String(i) }; }), {
        value: '0', on: function (v) { sel = parseInt(v, 10); pinta(); }
      });
      pinta();
    }
  });

  p.note('Ahí está la clave, y explica por qué esto es grave de verdad. En dos dimensiones el gradiente ' +
    'apenas gana al azar (×1,22) porque hay pocas direcciones donde equivocarse. Con 64 dimensiones ' +
    'gana <strong>siete veces</strong>, y con los cientos de miles de números de una imagen la ' +
    'diferencia es astronómica: un cambio repartido entre todos los píxeles, imperceptible para una ' +
    'persona en cada píxel por separado, basta para cambiar la respuesta. <strong>No es que el modelo ' +
    'vea mal: es que el espacio donde vive tiene muchísimas más direcciones de las que nuestra ' +
    'intuición maneja.</strong>', 'ok', 'Por qué la dimensión lo cambia todo');

  /* ---------------------------------------------------------------- */
  p.section('Lo que no se puede decidir');

  p.text('Y queda un límite que no depende de los datos ni del tamaño. En ' +
    '[[av-computabilidad|computabilidad]] se demuestra que hay preguntas que ningún algoritmo puede ' +
    'responder siempre bien, como decidir si un programa cualquiera acabará. Eso no cambia porque el ' +
    'algoritmo sea una red enorme: <strong>una red es un algoritmo</strong>.');

  p.text('Conviene no exagerar el argumento en ninguna de las dos direcciones. No demuestra que las redes ' +
    'no puedan hacer cosas útiles, porque las personas tampoco resolvemos el problema de la parada y ' +
    'nos apañamos. Lo que sí dice es que <em>no hay ningún método general</em>, y que cualquier promesa ' +
    'de un sistema que responda correctamente a todo choca con un teorema y no con una limitación ' +
    'temporal.');

  p.ejemplo({
    title: 'Por qué quitar la columna no basta',
    enunciado: 'Un banco quiere que su modelo no use el género. Lo quita de los datos. Sin embargo, entre las variables que quedan hay una —digamos la categoría de la tienda donde más se gasta— que está correlacionada con el género. Razonar qué pasa.',
    pasos: [
      { t: '<strong>Qué busca el modelo.</strong> Su único criterio es acertar. Si una variable ayuda a predecir, la usa; no tiene ninguna noción de si debería.', antes: '¿Qué criterio usa el modelo para decidir qué variables mira?' },
      { t: '<strong>La reconstrucción.</strong> Si la categoría de gasto y el género están correlacionados, la categoría funciona como una medida indirecta del género. El modelo no «sabe» que lo está reconstruyendo: simplemente encuentra que esa columna predice bien.', antes: 'Si A está correlacionada con B, ¿qué información sobre B lleva A?' },
      { t: '<strong>El resultado.</strong> El modelo se comporta parecido a como lo haría con la columna puesta, pero ahora sin que quede rastro en los datos de entrada. Es <em>más difícil de detectar</em>, no menos dañino.' },
      { t: '<strong>Qué sí funciona.</strong> Medir el resultado por grupos, como en [[ia-evaluar|evaluar]]: comparar aciertos y errores en cada uno. La prueba no está en qué columnas entran, sino en qué sale.' },
      { t: '<strong>La lección general.</strong> Esto es una variable de confusión de [[pe-causal|manual]]. Quitar la variable observada no elimina la asociación si queda cualquier otra correlacionada con ella.' }
    ],
    cierre: 'Por eso «el modelo no ve el género» no es una garantía de nada, y sí lo es —parcialmente— publicar el rendimiento desglosado.'
  });

  p.comprueba('Un sistema se ajusta para maximizar la puntuación que da un evaluador aprendido. Con el tiempo la puntuación sube mucho y las personas dicen que las respuestas han empeorado. ¿Qué ha pasado?', [
    { t: 'La ley de Goodhart: al optimizar la medida, se optimizan los rasgos baratos que la suben y no la calidad', ok: true, por: 'El evaluador premiaba rasgos que <em>se correlacionaban</em> con calidad. Optimizarlo con fuerza encuentra las maneras de producir esos rasgos sin la calidad, que suelen ser más baratas. Nadie ha hecho trampa: el sistema ha hecho exactamente lo que se le pidió.' },
    { t: 'El evaluador estaba mal entrenado desde el principio', ok: false, por: 'Puede que además lo estuviera, pero el fenómeno aparece incluso con un evaluador razonable: lo que lo rompe es la presión de optimización sobre él, no un fallo inicial.' },
    { t: 'El modelo se ha sobreajustado a los datos de entrenamiento', ok: false, por: 'El sobreajuste es memorizar ejemplos y fallar en los nuevos. Aquí el modelo generaliza estupendamente… a subir una medida equivocada.' }
  ]);

  p.util('Estos tres límites deciden cuándo conviene usar uno de estos sistemas y cuándo no. La ley de ' +
    'Goodhart avisa de que automatizar una decisión cambia el comportamiento de quien es evaluado: en ' +
    'cuanto se sabe qué mira el modelo, se optimiza para él. El sesgo heredado obliga a medir por ' +
    'grupos y no por media, y a exigir que se publique ese desglose. Y los ejemplos adversarios ' +
    'desaconsejan estos modelos, tal cual, allí donde alguien tenga interés en engañarlos: control de ' +
    'acceso, detección de fraude, moderación. En esos casos hay un adversario de verdad, y el ataque ' +
    'cuesta una pasada hacia atrás.');

  p.hist('El primer límite lo señaló <strong>Ada Lovelace</strong> en 1843, cien años antes de que ' +
    'existiera un ordenador. En sus notas a la máquina analítica de Babbage —notas que son más largas ' +
    'que el artículo que traducía, y que contienen el primer algoritmo publicado para una máquina— ' +
    'escribió que la máquina no tiene pretensión alguna de <em>originar</em> nada: puede hacer aquello ' +
    'que sepamos ordenarle que haga. Es la objeción más citada de la historia de la informática, y sobre ' +
    'ella discutió Alan Turing un siglo después. Sigue siendo un buen punto de partida, con un matiz ' +
    'que Lovelace no podía prever: hoy sabemos ordenarle que <em>aprenda de ejemplos</em>, de modo que ' +
    'el resultado puede sorprender a quien lo programó. Lo que no ha cambiado es de dónde sale todo lo ' +
    'que produce: de los datos y del objetivo que alguien eligió.');

  p.trampas([
    { e: 'Creer que el sesgo se arregla quitando la variable', por: 'Si queda cualquier otra correlacionada con ella, el modelo la reconstruye. Lo que hay que mirar es el resultado por grupos.' },
    { e: 'Confundir la ley de Goodhart con hacer trampa', por: 'No hace falta ninguna intención: basta con optimizar de verdad una medida que sólo se parecía a lo que importaba.' },
    { e: 'Pensar que un ejemplo adversario necesita un cambio grande', por: 'Necesita la <em>dirección</em> correcta. Con la misma magnitud, el gradiente hace siete veces más daño que el azar en 64 dimensiones, y muchísimo más en una imagen.' },
    { e: 'Suponer que más datos arreglan estos tres problemas', por: 'Ninguno viene de tener pocos datos. Goodhart viene de optimizar; el sesgo, de que los datos reflejan el mundo que hubo; y los adversarios, de que la entrada es derivable.' },
    { e: 'Usar la indecidibilidad para negar toda utilidad', por: 'Que no exista un método general no impide que algo funcione casi siempre. Las personas tampoco resolvemos el problema de la parada.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La medida y lo que importa',
    level: 'basico',
    gen: function (r) {
      var g = r.pick([0.2, 0.4, 0.6, 0.8]);
      var cal = 0.15 + 0.75 * (1 - g), med = cal + 0.9 * g;
      return { g: g, cal: cal, med: med, dif: med - cal };
    },
    ask: function (d) {
      return 'Un sistema dedica el $' + U.fmt(100 * d.g, 0) + '\\ \\%$ de su esfuerzo a inflar la medida. ' +
        'La calidad vale $0{,}15 + 0{,}75(1-g)$ y la medida es la calidad más $0{,}9g$. ¿Cuánto valen ' +
        'cada una, y cuánto se separan? (tres decimales)';
    },
    fields: [{ name: 'c', label: 'calidad', w: 'tiny' }, { name: 'm', label: 'medida', w: 'tiny' }],
    sol: function (d) { return { c: U.round(d.cal, 6), m: U.round(d.med, 6) }; },
    dec: 3,
    hint: function (d) { return 'Sustituye $g = ' + U.fmt(d.g, 1) + '$ en las dos fórmulas.'; },
    steps: function (d) {
      return ['Calidad: $0{,}15 + 0{,}75 \\cdot ' + U.fmt(1 - d.g, 2) + ' = ' + U.fmt(d.cal, 3) + '$.',
        'Medida: $' + U.fmt(d.cal, 3) + ' + 0{,}9 \\cdot ' + U.fmt(d.g, 1) + ' = ' + U.fmt(d.med, 3) + '$.',
        'Se separan $' + U.fmt(d.dif, 3) + '$: quien mire sólo la medida verá una mejora donde hay un empeoramiento.'];
    },
    answer: function (d) { return U.fmt(d.cal, 3) + ' y ' + U.fmt(d.med, 3); }
  });

  p.exercise({
    title: 'Reconstruir la columna borrada',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([1000, 2000]), pc = r.pick([70, 80, 90]);
      return { n: n, pc: pc, aciertos: Math.round(n * pc / 100) };
    },
    ask: function (d) {
      return 'Se quita la variable sensible de un conjunto de ' + U.miles(d.n) + ' registros, pero queda ' +
        'otra que permite adivinarla el $' + d.pc + '\\ \\%$ de las veces. ¿En cuántos registros puede ' +
        'el modelo recuperar la variable que se quiso ocultar?';
    },
    fields: [{ name: 'a', label: 'registros', w: 'tiny' }],
    sol: function (d) { return { a: d.aciertos }; },
    tol: 0.5,
    hint: function () { return 'Es un porcentaje del total de registros.'; },
    steps: function (d) {
      return ['$' + U.miles(d.n) + ' \\times ' + d.pc + '\\ \\% = ' + U.miles(d.aciertos) + '$ registros.',
        'Borrar la columna no ha ocultado nada: la información seguía en los datos por otra vía.'];
    },
    answer: function (d) { return U.miles(d.aciertos); }
  });

  p.exercise({
    title: 'El coste de un ataque',
    level: 'medio',
    gen: function (r) {
      var lotes = r.pick([1000, 5000, 20000]), pasadas = r.pick([1, 2, 3]);
      return { lotes: lotes, pasadas: pasadas, razon: lotes * 2 / pasadas };
    },
    ask: function (d) {
      return 'Entrenar el modelo costó ' + U.miles(d.lotes) + ' lotes, y cada lote son una pasada hacia ' +
        'delante y otra hacia atrás. Fabricar un ejemplo adversario cuesta ' + d.pasadas +
        ' ' + U.plural(d.pasadas, 'pasada', 'pasadas') + '. ¿Cuántas veces más barato es atacar que entrenar?';
    },
    fields: [{ name: 'r', label: 'veces más barato', w: 'small' }],
    sol: function (d) { return { r: d.razon }; },
    tol: 0.5,
    hint: function (d) { return 'El entrenamiento fueron $2 \\times ' + U.miles(d.lotes) + '$ pasadas en total.'; },
    steps: function (d) {
      return ['Entrenar: $2 \\times ' + U.miles(d.lotes) + ' = ' + U.miles(2 * d.lotes) + '$ pasadas.',
        'Atacar: $' + d.pasadas + '$.',
        'Razón: $' + U.miles(2 * d.lotes) + ' / ' + d.pasadas + ' = ' + U.miles(d.razon) + '$ veces más barato.',
        'Esa asimetría es el problema: defender cuesta reentrenar, atacar cuesta una derivada.'];
    },
    answer: function (d) { return U.miles(d.razon) + ' veces'; }
  });

  p.exercise({
    title: 'Media global y desglose',
    level: 'medio',
    gen: function (r) {
      var nA = r.pick([900, 950]), nB = 1000 - nA;
      var accA = r.pick([96, 97, 98]), accB = r.pick([60, 65, 70]);
      var global = (nA * accA + nB * accB) / 1000;
      return { nA: nA, nB: nB, accA: accA, accB: accB, global: global };
    },
    ask: function (d) {
      return 'Un modelo acierta el $' + d.accA + '\\ \\%$ en un grupo de ' + U.miles(d.nA) + ' casos y el $' +
        d.accB + '\\ \\%$ en otro de ' + U.miles(d.nB) + '. ¿Cuál es el acierto global, y cuántos puntos ' +
        'separa al grupo peor de esa media? (dos decimales)';
    },
    fields: [{ name: 'g', label: '% global', w: 'tiny' }, { name: 'd', label: 'puntos de diferencia', w: 'tiny' }],
    sol: function (d) { return { g: U.round(d.global, 6), d: U.round(d.global - d.accB, 6) }; },
    dec: 2,
    errores: [{ si: function (v, d) { var simple = (d.accA + d.accB) / 2; return Math.abs(simple - d.global) > 0.005 && Math.abs(v.g - simple) < 0.005; }, msg: 'Es una media <em>ponderada</em>: cada grupo pesa según cuántos casos tiene, y aquí uno es mucho mayor que el otro.' }],
    hint: function () { return 'Pondera cada acierto por el tamaño de su grupo.'; },
    steps: function (d) {
      return ['$(' + U.miles(d.nA) + ' \\cdot ' + d.accA + ' + ' + U.miles(d.nB) + ' \\cdot ' + d.accB + ') / 1000 = ' + U.fmt(d.global, 2) + '\\ \\%$.',
        'El grupo peor queda $' + U.fmt(d.global - d.accB, 2) + '$ puntos por debajo de la media.',
        'La media global esconde el problema porque el grupo pequeño casi no pesa en ella. Por eso hay que publicar el desglose.'];
    },
    answer: function (d) { return U.fmt(d.global, 2) + ' % y ' + U.fmt(d.global - d.accB, 2) + ' puntos'; }
  });

  p.exercise({
    title: 'Cuál de los tres límites',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'un detector de spam empieza a fallar en cuanto los que envían spam descubren qué palabras mira', v: 'goodhart', por: 'La medida se convirtió en objetivo <em>para el otro lado</em>: en cuanto se sabe qué mira, se optimiza contra ello. Es Goodhart con adversario.' },
        { t: 'un modelo de selección de personal reproduce el perfil de quienes fueron contratados antes', v: 'sesgo', por: 'Aprendió la estructura de los datos históricos, que es lo único que se le dio. La asociación estaba en el mundo que produjo esos datos.' },
        { t: 'cambiando unos pocos píxeles imperceptibles, una señal de tráfico se clasifica mal', v: 'adversario', por: 'Es un paso en la dirección del gradiente respecto de la entrada. Con muchas dimensiones, un cambio diminuto por píxel suma un desplazamiento grande en la dirección que más daña.' },
        { t: 'se promete un sistema que decida siempre correctamente si un programa cualquiera termina', v: 'indecidible', por: 'Choca con un teorema, no con una limitación de ingeniería. Ninguna red lo resuelve, porque una red es un algoritmo.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Se observa que ' + d.c.t + '. ¿De cuál de los límites se trata?'; },
    fields: [{ name: 'q', label: 'Límite', opts: [
      { t: 'la ley de Goodhart', v: 'goodhart' },
      { t: 'sesgo heredado de los datos', v: 'sesgo' },
      { t: 'ejemplo adversario', v: 'adversario' },
      { t: 'indecidibilidad', v: 'indecidible' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Pregúntate si el problema aparece por optimizar una medida, por lo que había en los datos, por la derivada respecto de la entrada, o por un teorema.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Ley de Goodhart: cuando una medida se convierte en objetivo, deja de medir lo que medía. No hace falta mala intención, sólo optimizar en serio.',
    'El sesgo no es una opinión del modelo: es la estructura estadística de los datos, incluida la que nadie quería. Y no distingue correlación de causa porque esa distinción no está en los datos.',
    'Quitar la variable sensible no sirve si queda otra correlacionada: hay que mirar el resultado <strong>por grupos</strong>.',
    'Un ejemplo adversario es un paso en la dirección del gradiente <em>respecto de la entrada</em>, y cuesta una pasada hacia atrás.',
    'Lo decisivo es la dirección, no el tamaño: con 64 dimensiones el gradiente hace siete veces más daño que el azar, y en una imagen muchísimo más.',
    'Hay preguntas que ningún algoritmo responde siempre bien, y una red es un algoritmo. Eso no impide que sea útil; impide prometer un método general.'
  ]);
});
