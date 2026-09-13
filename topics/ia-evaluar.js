/* Tema: Funciona? */
Course.topic('ia-evaluar', function (p) {

  p.puente('[[ia-generalizar|El tema anterior]] dejó claro que hay que medir sobre datos no vistos. Falta ' +
    'decidir <strong>qué</strong> se mide, porque el número obvio engaña. Las herramientas ya están: de ' +
    '[[pe-condicionada|probabilidad condicionada]] viene la tabla de doble entrada y la distinción ' +
    'entre $P(A|B)$ y $P(B|A)$, y de [[fn-integral-def|la integral definida]], el área bajo una curva.');

  p.text('Este es el último tema del bloque y, en la práctica, el más importante de todos. Un modelo mal ' +
    'medido es peor que no tener modelo, porque da confianza donde no la hay. Y la manera más común de ' +
    'medirlo mal es la más natural: contar qué porcentaje acierta.');

  /* ---------------------------------------------------------------- */
  p.section('La exactitud miente');

  p.text('Imagina una enfermedad que afecta a 1 de cada 1000 personas. Escribo un modelo de una línea: ' +
    '<em>contestar siempre «sano»</em>. Su exactitud es del <strong>99,9 %</strong>, mejor que la de ' +
    'casi cualquier modelo serio. Y no detecta ni un solo enfermo.');

  p.note('El problema aparece siempre que una clase es mucho más frecuente que la otra, que es la ' +
    'situación normal en casi todo lo que importa: fraude, averías, enfermedades raras, accidentes. ' +
    'Cuanto más raro es lo que buscas, más engaña la exactitud, y justamente los casos raros suelen ser ' +
    'los caros.', 'warn', 'Cuanto más raro, más engaña');

  /* ---------------------------------------------------------------- */
  p.section('Los cuatro casos');

  p.text('Hace falta separar los aciertos y los fallos por tipo. Sale una tabla de doble entrada, que ' +
    'aquí se llama <strong>matriz de confusión</strong> y es exactamente la tabla de contingencia de ' +
    '[[pe-condicionada|probabilidad condicionada]], con las clases reales en las filas y lo que dice el ' +
    'modelo en las columnas.');

  p.table(['', 'El modelo dice sí', 'El modelo dice no'], [
    ['<strong>Es que sí</strong>', 'verdadero positivo (VP)<br><em>acierto</em>', 'falso negativo (FN)<br><em>se te escapa</em>'],
    ['<strong>Es que no</strong>', 'falso positivo (FP)<br><em>falsa alarma</em>', 'verdadero negativo (VN)<br><em>acierto</em>']
  ]);

  p.text('Los dos errores <strong>no cuestan lo mismo</strong>, y esa es la razón de separarlos. En un ' +
    'cribado de cáncer, un falso negativo puede costar una vida y un falso positivo, un susto y una ' +
    'prueba más. En un filtro de spam es al revés: perder un correo importante es mucho peor que ' +
    'tragarse publicidad. Ningún número único puede saber cuál te importa a ti.');

  p.formulas([
    '\\text{precisión} = \\frac{VP}{VP + FP}',
    '\\text{sensibilidad} = \\frac{VP}{VP + FN}'
  ], 'las dos medidas que hay que dar juntas',
    'La <strong>precisión</strong> se lee: <em>«de todos a los que he dicho que sí, ¿cuántos lo ' +
    'eran?»</em>. La <strong>sensibilidad</strong>: <em>«de todos los que lo eran, ¿a cuántos he ' +
    'pillado?»</em>.<br><br>Y aquí está lo bonito: son <strong>las dos direcciones de la misma ' +
    'condicionada</strong>. La precisión es $P(\\text{es que sí} \\mid \\text{digo que sí})$ y la ' +
    'sensibilidad es $P(\\text{digo que sí} \\mid \\text{es que sí})$. Confundirlas es exactamente la ' +
    'falacia del fiscal que ya viste con el test médico, y por eso hay que darlas siempre juntas.');

  p.demo({
    title: 'Mover el umbral y ver quién sufre',
    intro: 'Cuarenta casos con la puntuación que les ha dado el modelo: los de arriba son los que de verdad lo son. Mueve el umbral y mira cómo cambian las cuatro casillas. Fíjate en que la precisión y la sensibilidad nunca suben las dos a la vez.',
    predice: 'Si bajas el umbral hasta cero, el modelo dirá que sí a todo el mundo. ¿Cuánto valdrá entonces la sensibilidad, y cuánto la precisión?',
    build: function (host) {
      var umbral = 0.5;
      var casos = [];
      (function () {
        var r = U.rng(37), i;
        for (i = 0; i < 12; i++) casos.push({ s: U.clamp(0.62 + r.real(-0.3, 0.3, 3), 0.02, 0.98), y: 1 });
        for (i = 0; i < 28; i++) casos.push({ s: U.clamp(0.36 + r.real(-0.32, 0.32, 3), 0.02, 0.98), y: 0 });
      })();
      function cuenta(u) {
        var vp = 0, fp = 0, fn = 0, vn = 0;
        casos.forEach(function (c) {
          if (c.s >= u) { if (c.y) vp++; else fp++; } else { if (c.y) fn++; else vn++; }
        });
        return { vp: vp, fp: fp, fn: fn, vn: vn };
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.05, xmax: 1.05, ymin: -0.4, ymax: 1.4, height: 250,
        xlabel: 'puntuación que da el modelo', ylabel: null, grid: false,
        aria: 'Cuarenta casos colocados por su puntuación, separados por clase real, con el umbral de decisión',
        draw: function (g) {
          g.hline(1, { color: 'axis', w: 0.8, dash: [3, 3] });
          g.hline(0, { color: 'axis', w: 0.8, dash: [3, 3] });
          casos.forEach(function (c) {
            var acierta = (c.s >= umbral ? 1 : 0) === c.y;
            g.point(c.s, c.y, { color: c.y ? 2 : 0, r: 5, hollow: !acierta });
          });
          g.vline(umbral, { color: 'ink', w: 2.2, dash: [5, 4] });
          g.text(0.02, 1.22, 'los que sí lo son', { color: 2, size: 12 });
          g.text(0.02, -0.28, 'los que no', { color: 0, size: 12 });
        }
      });
      function pinta() {
        var c = cuenta(umbral);
        var exac = (c.vp + c.vn) / casos.length;
        var marcados = c.vp + c.fp;
        /* Si no marca a NADIE, la precision es 0/0: no vale cero, es que
           no esta definida. Decir «0 %» seria mentir en la direccion
           contraria, porque no se ha equivocado ni una vez. */
        var prec = marcados ? c.vp / marcados : null;
        var sens = c.vp + c.fn ? c.vp / (c.vp + c.fn) : 0;
        out.set('Umbral ' + U.fmt(umbral, 2) + ' &nbsp;·&nbsp; VP ' + c.vp + ' · FP ' + c.fp + ' · FN ' + c.fn + ' · VN ' + c.vn + '<br>' +
          'Exactitud <strong>' + U.fmt(exac * 100, 1) + ' %</strong> &nbsp;·&nbsp; ' +
          'precisión <strong>' + (prec === null ? 'indefinida' : U.fmt(prec * 100, 1) + ' %') + '</strong> &nbsp;·&nbsp; ' +
          'sensibilidad <strong>' + U.fmt(sens * 100, 1) + ' %</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (!marcados ? 'No marca a nadie: la sensibilidad es cero y la precisión ni siquiera se puede calcular, porque su denominador es cero. La exactitud, en cambio, sigue pareciendo buena.'
            : (c.vn === 0 && c.fn === 0 ? 'Dice que sí a todo el mundo: no se le escapa ninguno (sensibilidad del 100 %) pero casi todas sus alarmas son falsas.'
              : (umbral > 0.75 ? 'Marca a muy pocos: cuando avisa suele acertar, pero se le escapan muchos.'
                : 'Los puntos huecos son los que falla. Al mover el umbral, unos fallos se convierten en los otros: no desaparecen.'))) +
          '</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'umbral de decisión', min: 0.02, max: 0.98, step: 0.01, value: 0.5, dec: 2,
        on: function (v) { umbral = v; pinta(); }
      });
      pinta();
    }
  });

  p.text('El umbral no es una propiedad del modelo: es una <strong>decisión</strong>, y se toma sabiendo ' +
    'cuál de los dos errores duele más. Un mismo modelo puede usarse con umbral bajo para cribar —mejor ' +
    'una falsa alarma que un caso perdido— y con umbral alto para confirmar.');

  /* ---------------------------------------------------------------- */
  p.section('La curva ROC y su área');

  p.text('Como el umbral se puede elegir, juzgar un modelo por su comportamiento con <em>un</em> umbral ' +
    'es injusto. La curva ROC los recorre todos: para cada uno se apuntan dos números, qué proporción ' +
    'de los positivos pilla y qué proporción de los negativos marca por error, y se dibuja el ' +
    'resultado.');

  p.formula('\\text{área bajo la ROC} = P\\bigl(\\text{puntuación de un positivo} > \\text{puntuación de un negativo}\\bigr)',
    'qué significa el área',
    'El área tiene una lectura sorprendentemente limpia: es <strong>la probabilidad de que, cogiendo al ' +
    'azar un caso positivo y uno negativo, el modelo le dé más puntuación al positivo</strong>.<br><br>' +
    'Vale $1$ si los separa perfectamente y $0{,}5$ si no distingue nada, porque entonces acertar el ' +
    'orden es como echarlo a cara o cruz. Y como es el área bajo una curva, se calcula sumando ' +
    'trapecios: [[fn-integral-def|una suma de Riemann]] de las de toda la vida.');

  p.demo({
    title: 'Recorrer todos los umbrales',
    intro: 'Cada punto de la curva es un umbral distinto de la demo anterior. El área bajo ella resume el modelo entero sin comprometerse con ningún umbral. La diagonal es lo que haría un modelo que contestase al azar.',
    predice: 'Un modelo que no distingue nada acierta el orden de un par al azar la mitad de las veces. ¿Qué área tendrá su curva, y qué forma?',
    build: function (host) {
      var separacion = 0.26;
      function datos() {
        var r = U.rng(37), cs = [], i;
        for (i = 0; i < 40; i++) cs.push({ s: U.clamp(0.5 + separacion + r.real(-0.3, 0.3, 3), 0.01, 0.99), y: 1 });
        for (i = 0; i < 60; i++) cs.push({ s: U.clamp(0.5 - separacion + r.real(-0.3, 0.3, 3), 0.01, 0.99), y: 0 });
        return cs;
      }
      function roc() {
        var cs = datos(), pos = 0, neg = 0;
        cs.forEach(function (c) { if (c.y) pos++; else neg++; });
        var pts = [], u;
        for (u = 1.02; u >= -0.02; u -= 0.01) {
          var vp = 0, fp = 0;
          cs.forEach(function (c) { if (c.s >= u) { if (c.y) vp++; else fp++; } });
          pts.push([fp / neg, vp / pos]);
        }
        var area = 0, i;
        for (i = 1; i < pts.length; i++) {
          area += (pts[i][0] - pts[i - 1][0]) * (pts[i][1] + pts[i - 1][1]) / 2;
        }
        return { pts: pts, area: area };
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.05, xmax: 1.05, ymin: -0.05, ymax: 1.05, height: 320, equal: true,
        xlabel: 'falsas alarmas (FP / negativos)', ylabel: 'pillados (VP / positivos)',
        aria: 'La curva ROC del modelo, con la diagonal del azar y el área sombreada bajo ella',
        draw: function (g) {
          var R = roc();
          g.seg(0, 0, 1, 1, { color: 'axis', w: 1.4, dash: [5, 4] });
          g.path(R.pts, { color: 2, w: 2.8 });
          R.pts.forEach(function (q, i) {
            if (i % 12 === 0) g.point(q[0], q[1], { color: 2, r: 2.6 });
          });
        }
      });
      function pinta() {
        var R = roc();
        out.set('Separación entre las dos clases: ' + U.fmt(separacion, 2) + ' &nbsp;·&nbsp; ' +
          '<strong>área bajo la curva: ' + U.fmt(R.area, 3) + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (R.area > 0.93 ? 'Casi perfecto: cogiendo un positivo y un negativo al azar, el modelo casi siempre le da más puntuación al positivo.'
            : (R.area < 0.6 ? 'Apenas distingue: la curva se pega a la diagonal, que es lo que haría contestando al azar.'
              : 'Distingue razonablemente. El área es la probabilidad de ordenar bien un par al azar: ' + U.fmt(R.area * 100, 0) + ' de cada 100.')) +
          '</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'cuánto separa el modelo las clases', min: 0, max: 0.45, step: 0.01, value: 0.26, dec: 2,
        on: function (v) { separacion = v; pinta(); }
      });
      pinta();
    }
  });

  p.ejemplo({
    title: 'Una matriz de confusión, número a número',
    enunciado: 'Un cribado se aplica a 1000 personas, de las que 40 tienen la enfermedad. El modelo marca como positivas a 100: entre ellas están 32 de los 40 enfermos. Calcular las cuatro casillas, la exactitud, la precisión y la sensibilidad, y compararlo con el modelo que contesta siempre «sano».',
    pasos: [
      { t: '<strong>Las cuatro casillas.</strong> $VP = 32$. $FP = 100 - 32 = 68$. $FN = 40 - 32 = 8$. $VN = 1000 - 32 - 68 - 8 = 892$.', antes: 'De los 100 marcados, 32 son enfermos. ¿Y los otros 68? ¿Y los enfermos no marcados?' },
      { t: '<strong>Exactitud.</strong> $\\frac{VP + VN}{1000} = \\frac{32 + 892}{1000} = 0{,}924$: un 92,4 %.', antes: 'Suma los dos aciertos y divide por el total.' },
      { t: '<strong>Precisión.</strong> $\\frac{32}{32 + 68} = \\frac{32}{100} = 0{,}32$. De cada tres alarmas, dos son falsas.', antes: 'De los que ha marcado, ¿qué proporción lo era?' },
      { t: '<strong>Sensibilidad.</strong> $\\frac{32}{32 + 8} = \\frac{32}{40} = 0{,}80$. Pilla a cuatro de cada cinco enfermos.', antes: 'De los enfermos que había, ¿a cuántos ha pillado?' },
      { t: '<strong>El modelo tonto.</strong> Contestar siempre «sano» da $VN = 960$, $FN = 40$ y cero en las otras dos. Su exactitud es del <strong>96 %</strong>, mejor que el 92,4 % del modelo de verdad.', antes: 'Calcula la exactitud de decir siempre «sano». ¿Gana o pierde?' },
      { t: '<strong>Y sin embargo es inútil.</strong> Su sensibilidad es $0/40 = 0$: no detecta a nadie. Su precisión ni siquiera se puede calcular, porque nunca dice que sí. La exactitud, ella sola, ha elegido el peor modelo posible.' }
    ],
    cierre: 'Ese 96 % contra 92,4 % es la razón de que este tema exista. La exactitud no está mal calculada: está mal elegida como criterio.'
  });

  p.comprueba('Un modelo de fraude tiene una precisión del 95 % y una sensibilidad del 3 %. ¿Qué está haciendo?', [
    { t: 'Marcar muy pocos casos, casi siempre acertando, y dejar escapar el 97 % del fraude', ok: true, por: 'Precisión alta significa que cuando avisa acierta; sensibilidad baja, que avisa poquísimas veces. Es un modelo tremendamente conservador: útil si cada aviso cuesta una investigación cara, inútil si lo que importa es no perderse fraude.' },
    { t: 'Funcionar muy bien: el 95 % es una nota altísima', ok: false, por: 'La precisión sola no dice nada sobre cuánto se escapa. Con marcar un solo caso y acertar, la precisión sería del 100 %.' },
    { t: 'Estar mal calibrado y haber que reentrenarlo', ok: false, por: 'Puede que el modelo esté bien y solo esté puesto con un umbral altísimo. Bajarlo subiría la sensibilidad y bajaría la precisión, sin reentrenar nada.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Un número para todos no vale para nadie');

  p.text('Falta el error más caro de todos, y no es estadístico sino de planteamiento: dar ' +
    '<strong>un solo número global</strong>. Un modelo con un 95 % de exactitud general puede tener un ' +
    '99 % en el grupo mayoritario y un 70 % en uno pequeño, y el promedio lo esconde, porque el grupo ' +
    'pequeño pesa poco precisamente por ser pequeño.');

  p.note('La comprobación no es complicada: <strong>calcular las mismas medidas por separado en cada ' +
    'grupo</strong> y mirar si se parecen. Lo difícil no es la aritmética, es acordarse de hacerlo y ' +
    'tener los datos para poder hacerlo.', 'ok', 'Desglosar, siempre');

  p.util('El trabajo que puso esto en el mapa es <em>Gender Shades</em>, de Joy Buolamwini y Timnit ' +
    'Gebru, presentado en 2018. Evaluaron sistemas comerciales de clasificación de género en imágenes ' +
    'de cara y, en vez de dar una cifra global, la desglosaron por tono de piel y por sexo. La ' +
    'diferencia entre el grupo con mejor resultado y el que peor salía era enorme, y esa diferencia no ' +
    'aparecía en ninguna de las cifras que publicaban los fabricantes. Cambió la manera de evaluar ' +
    'estos sistemas y llevó a varias empresas a revisarlos.');

  p.hist('Las siglas ROC son de <em>receiver operating characteristic</em>, y vienen de los operadores de ' +
    'radar de la Segunda Guerra Mundial: había que decidir si un punto en la pantalla era un avión o ' +
    'ruido, y ajustar esa sensibilidad era literalmente mover un umbral. La curva se trasladó a la ' +
    'psicología de la percepción en los años cincuenta y a la medicina en los setenta, donde sigue ' +
    'siendo la manera estándar de comparar pruebas diagnósticas. Que el mismo dibujo sirva para un ' +
    'radar, un oculista y un detector de fraude dice bastante de lo general que es el problema.');

  p.trampas([
    { e: 'Dar la exactitud sin decir cómo de frecuente es cada clase', por: 'Con 1 enfermo de cada 1000, contestar siempre «sano» da un 99,9 %. El número es correcto y no significa nada.' },
    { e: 'Confundir precisión con sensibilidad', por: 'Son las dos direcciones de la condicionada: «de los que marco, cuántos lo son» y «de los que lo son, cuántos marco». Es la falacia del fiscal otra vez.' },
    { e: 'Perseguir una sola de las dos', por: 'Marcar a todo el mundo da sensibilidad 1; marcar a uno solo y acertar da precisión 1. Cualquiera de las dos, sola, se consigue con un modelo absurdo.' },
    { e: 'Creer que el umbral viene dado', por: 'Es una decisión, y depende de cuál de los dos errores duele más. El mismo modelo sirve para cribar y para confirmar con umbrales distintos.' },
    { e: 'Quedarse con la cifra global', por: 'Un 95 % de media puede esconder un 70 % en un grupo pequeño. Hay que desglosar, y para eso hay que haber guardado los datos que permiten hacerlo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Leer la matriz de confusión',
    level: 'basico',
    gen: function (r) {
      var vp = r.int(10, 60), fp = r.int(5, 50), fn = r.int(5, 40), vn = r.int(100, 400);
      return { vp: vp, fp: fp, fn: fn, vn: vn, n: vp + fp + fn + vn, exac: (vp + vn) / (vp + fp + fn + vn) };
    },
    ask: function (d) {
      return 'Una matriz de confusión tiene $VP = ' + d.vp + '$, $FP = ' + d.fp + '$, $FN = ' + d.fn +
        '$ y $VN = ' + d.vn + '$. ¿Cuántos casos hay en total y cuál es la exactitud? (cuatro decimales)';
    },
    fields: [{ name: 'n', label: 'total', w: 'tiny' }, { name: 'e', label: 'exactitud', w: 'tiny' }],
    sol: function (d) { return { n: d.n, e: U.round(d.exac, 8) }; },
    dec: { e: 4 },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(v.e - d.vp / d.n) < 0.0005 && d.vn !== 0; }, msg: 'Los aciertos son dos casillas, no una: los verdaderos positivos <em>y</em> los verdaderos negativos.' }],
    hint: function () { return 'El total son las cuatro casillas. La exactitud, las dos de la diagonal entre el total.'; },
    steps: function (d) {
      return ['Total: $' + d.vp + ' + ' + d.fp + ' + ' + d.fn + ' + ' + d.vn + ' = ' + d.n + '$.',
        'Exactitud: $\\dfrac{' + d.vp + ' + ' + d.vn + '}{' + d.n + '} = ' + U.fmt(d.exac, 4) + '$.',
        'Y con tantos verdaderos negativos, ese número va a salir alto casi haga lo que haga el modelo.'];
    },
    answer: function (d) { return d.n + ' casos, exactitud ' + U.fmt(d.exac, 4); }
  });

  p.exercise({
    title: 'Precisión y sensibilidad',
    level: 'basico',
    gen: function (r) {
      var vp = r.int(12, 80), fp = r.int(6, 90), fn = r.int(4, 60);
      return { vp: vp, fp: fp, fn: fn, prec: vp / (vp + fp), sens: vp / (vp + fn) };
    },
    ask: function (d) {
      return 'Con $VP = ' + d.vp + '$, $FP = ' + d.fp + '$ y $FN = ' + d.fn + '$, calcula la precisión y ' +
        'la sensibilidad. (cuatro decimales)';
    },
    fields: [{ name: 'p', label: 'precisión', w: 'tiny' }, { name: 's', label: 'sensibilidad', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.prec, 8), s: U.round(d.sens, 8) }; },
    dec: 4,
    errores: [{ si: function (v, d) { return Math.abs(d.prec - d.sens) > 0.001 && Math.abs(v.p - d.sens) < 0.0005 && Math.abs(v.s - d.prec) < 0.0005; }, msg: 'Las has intercambiado. La precisión divide entre los que el modelo <em>marcó</em>; la sensibilidad, entre los que <em>lo eran</em>.' }],
    hint: function () { return 'Las dos tienen $VP$ arriba. Abajo: en precisión, todo lo que marcó ($VP+FP$); en sensibilidad, todo lo que lo era ($VP+FN$).'; },
    steps: function (d) {
      return ['Precisión: $\\dfrac{' + d.vp + '}{' + d.vp + ' + ' + d.fp + '} = ' + U.fmt(d.prec, 4) + '$.',
        'Sensibilidad: $\\dfrac{' + d.vp + '}{' + d.vp + ' + ' + d.fn + '} = ' + U.fmt(d.sens, 4) + '$.',
        d.prec > d.sens ? 'Precisión mayor que sensibilidad: el modelo es conservador, avisa poco y suele acertar.'
          : 'Sensibilidad mayor que precisión: el modelo es alarmista, se le escapan pocos pero da muchas falsas alarmas.'];
    },
    answer: function (d) { return 'precisión ' + U.fmt(d.prec, 4) + ', sensibilidad ' + U.fmt(d.sens, 4); }
  });

  p.exercise({
    title: 'El modelo que no hace nada',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([1000, 5000, 20000]);
      var tasa = r.pick([0.001, 0.005, 0.01, 0.02]);
      var pos = Math.round(n * tasa);
      return { n: n, tasa: tasa, pos: pos, neg: n - pos, exac: (n - pos) / n };
    },
    ask: function (d) {
      return 'De $' + U.miles(d.n) + '$ casos, solo $' + U.miles(d.pos) + '$ son positivos. Un modelo ' +
        'contesta siempre «no». ¿Cuál es su exactitud y cuál su sensibilidad? (cuatro decimales)';
    },
    fields: [{ name: 'e', label: 'exactitud', w: 'tiny' }, { name: 's', label: 'sensibilidad', w: 'tiny' }],
    sol: function (d) { return { e: U.round(d.exac, 8), s: 0 }; },
    dec: { e: 4 },
    tol: 1e-6,
    hint: function () { return 'Acierta en todos los negativos y falla en todos los positivos. La sensibilidad mira cuántos positivos ha pillado.'; },
    steps: function (d) {
      return ['Acierta los $' + U.miles(d.neg) + '$ negativos: exactitud $= ' + U.fmt(d.exac, 4) + '$, o sea el ' + U.fmt(d.exac * 100, 2) + ' %.',
        'No pilla ningún positivo: sensibilidad $= 0/' + U.miles(d.pos) + ' = 0$.',
        'Cualquier modelo que no supere esa exactitud está, literalmente, por debajo de no hacer nada.'];
    },
    answer: function (d) { return 'exactitud ' + U.fmt(d.exac, 4) + ', sensibilidad 0'; }
  });

  p.exercise({
    title: 'Qué le pasa a cada una al mover el umbral',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'se <strong>baja</strong> el umbral, así que el modelo marca a más gente', s: 'sube', p: 'baja' },
        { t: 'se <strong>sube</strong> el umbral, así que el modelo marca a menos gente', s: 'baja', p: 'sube' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'En un modelo con umbral ajustable, ' + d.c.t + '. ¿Qué le ocurre a cada medida?'; },
    fields: [
      { name: 's', label: 'La sensibilidad', opts: [{ t: 'sube', v: 'sube' }, { t: 'baja', v: 'baja' }] },
      { name: 'p', label: 'La precisión', opts: [{ t: 'sube', v: 'sube' }, { t: 'baja', v: 'baja' }] }
    ],
    sol: function (d) { return { s: d.c.s, p: d.c.p }; },
    hint: function () { return 'Marcar a más gente hace que se te escapen menos (sensibilidad) pero que más alarmas sean falsas (precisión). Y al revés.'; },
    steps: function (d) {
      return [d.c.s === 'sube'
        ? 'Al marcar a más gente, se pillan más positivos: la <strong>sensibilidad sube</strong>. Pero entre los marcados hay más negativos, así que la <strong>precisión baja</strong>.'
        : 'Al marcar a menos gente, solo quedan los casos más claros: la <strong>precisión sube</strong>. Pero se escapan más positivos, así que la <strong>sensibilidad baja</strong>.',
        'Nunca suben las dos: por eso hay que dar las dos, y por eso existe la curva ROC, que recorre todos los umbrales a la vez.'];
    },
    answer: function (d) { return 'sensibilidad ' + d.c.s + ', precisión ' + d.c.p; }
  });

  p.exercise({
    title: 'Leer un área bajo la ROC',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { a: 0.5, v: 'azar', por: 'Media exactamente: acierta el orden de un par al azar la mitad de las veces, que es lo que haría contestando a cara o cruz. No distingue nada.' },
        { a: 0.97, v: 'muy bueno', por: 'Cogiendo un positivo y un negativo al azar, en 97 de cada 100 le da más puntuación al positivo. Separa casi perfectamente.' },
        { a: 0.76, v: 'decente', por: 'Acierta el orden en tres de cada cuatro pares: distingue, pero con solapamiento entre las dos clases.' },
        { a: 0.52, v: 'azar', por: 'Apenas por encima de la mitad: su capacidad de ordenar es prácticamente la del azar.' },
        { a: 0.99, v: 'muy bueno', por: 'Casi perfecto: solo falla el orden en uno de cada cien pares.' },
        { a: 0.68, v: 'decente', por: 'Dos de cada tres pares bien ordenados: sirve para priorizar, pero no para decidir a ciegas.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Un modelo tiene un área bajo la curva ROC de <strong>' + U.fmt(d.c.a, 2) + '</strong>. ' +
        '¿Cómo se interpreta, y en cuántos pares de cada cien ordena bien?';
    },
    fields: [
      { name: 'n', label: 'pares de cada 100', w: 'tiny' },
      { name: 'q', label: 'Valoración', opts: [
        { t: 'prácticamente azar', v: 'azar' }, { t: 'decente', v: 'decente' }, { t: 'muy bueno', v: 'muy bueno' }
      ] }
    ],
    sol: function (d) { return { n: Math.round(d.c.a * 100), q: d.c.v }; },
    hint: function () { return 'El área es directamente la probabilidad de ordenar bien un par al azar. Multiplícala por cien. Y recuerda que 0,5 es el suelo, no el cero.'; },
    steps: function (d) { return [d.c.por, 'El suelo de esta medida es $0{,}5$, no $0$: por debajo bastaría con invertir las respuestas.']; },
    answer: function (d) { return Math.round(d.c.a * 100) + ' de cada 100, ' + d.c.v; }
  });

  p.note('Cuando quieras saber si el bloque entero se ha quedado, en [[ia-examen-datos]] hay un examen procedimental con preguntas de todos sus temas, con reloj y corregido al entregar.', 'ok', 'Para medirte');

  p.keys([
    'La exactitud engaña cuando una clase es rara: contestar siempre «no» puede dar un 99,9 % y no detectar nada.',
    'La matriz de confusión separa los dos errores, que casi nunca cuestan lo mismo.',
    'Precisión y sensibilidad son las dos direcciones de la misma condicionada: confundirlas es la falacia del fiscal.',
    'Nunca suben las dos a la vez: el umbral es una decisión, y depende de cuál de los dos errores duele más.',
    'La curva ROC recorre todos los umbrales, y su área es la probabilidad de ordenar bien un positivo y un negativo al azar.',
    'Una cifra global puede esconder un grupo mal servido: hay que desglosar las mismas medidas por subgrupos.'
  ]);
});
