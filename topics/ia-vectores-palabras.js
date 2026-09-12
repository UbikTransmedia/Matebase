/* Tema: Las palabras como vectores */
Course.topic('ia-vectores-palabras', function (p) {

  p.puente('Ya sabemos [[ia-tokens|trocear el texto]] y [[ia-secuencias|predecir el siguiente trozo]] ' +
    'contando. Falta lo importante: que el modelo sepa que «gato» y «perro» se parecen. De ' +
    '[[ge-vectores|los vectores]] viene la herramienta —el producto escalar y el ángulo— y de ' +
    '[[av-pca|las componentes principales]], la forma de dibujar en un papel algo que vive en muchas ' +
    'dimensiones.');

  p.text('El problema es real. Si a cada palabra se le asigna un número de lista —gato el 4712, perro el ' +
    '9033—, esos números no significan nada: el 4713 no se parece más al gato que el 9033. Y sin ' +
    'parecido no hay generalización posible, porque lo aprendido sobre los gatos no puede trasladarse ' +
    'a nada.');

  /* ---------------------------------------------------------------- */
  p.section('Una palabra es la compañía que tiene');

  p.text('La idea que resuelve esto es de los años cincuenta y se enuncia en una frase: ' +
    '<strong>dos palabras significan algo parecido si aparecen rodeadas de las mismas palabras</strong>. ' +
    'No hace falta saber qué es un gato: basta ver que sale con «come», «duerme» y «caza», igual que ' +
    '«perro».');

  p.text('Así que se cuenta. Para cada palabra se anota cuántas veces aparece cada otra a su lado, y esa ' +
    'lista de cuentas <strong>es</strong> su vector. Una palabra pasa a ser un punto en un espacio con ' +
    'tantas dimensiones como palabras haya.');

  p.demo({
    title: 'Contar vecinos, y mirar si el resultado tiene sentido',
    intro: 'Un corpus de 27 frases. Cada palabra se convierte en el recuento de sus vecinas inmediatas, y se comparan por el ángulo. El interruptor decide si se cuentan también los artículos y preposiciones.',
    predice: 'Los artículos «el» y «la» son las palabras más frecuentes y acompañan a casi todo. ¿Crees que ayudarán a distinguir unas palabras de otras, o que estorbarán?',
    build: function (host) {
      var FRASES = ['el gato come pescado', 'el perro come carne', 'el gato bebe agua', 'el perro bebe agua',
        'el gato duerme en el tejado', 'el perro duerme en la caseta', 'el gato sube al tejado',
        'el perro corre en el jardin', 'la gata come pescado', 'la gata duerme en el sofa',
        'el raton come queso', 'el raton corre por la cocina', 'el gato caza al raton',
        'la casa tiene un tejado', 'la casa tiene un jardin', 'la casa tiene una cocina',
        'el tejado esta sobre la casa', 'el jardin esta junto a la casa', 'la cocina esta dentro de la casa',
        'el nino come pan', 'el nino bebe leche', 'el nino duerme en la cama',
        'la nina come pan', 'la nina bebe leche', 'la nina duerme en la cama',
        'el nino corre por el jardin', 'la nina sube al tejado'];
      var VACIAS = { el: 1, la: 1, en: 1, al: 1, de: 1, un: 1, una: 1, por: 1, a: 1, sobre: 1, junto: 1, dentro: 1, esta: 1, tiene: 1 };
      var quitar = true;
      var M, idx, lista;
      function construye() {
        var docs = FRASES.map(function (f) {
          var w = f.split(/\s+/);
          return quitar ? w.filter(function (x) { return !VACIAS[x]; }) : w;
        });
        var pal = {};
        docs.forEach(function (w) { w.forEach(function (x) { pal[x] = 1; }); });
        lista = Object.keys(pal).sort();
        idx = {};
        lista.forEach(function (w, i) { idx[w] = i; });
        var V = lista.length, i, j;
        M = [];
        for (i = 0; i < V; i++) { M.push(new Array(V)); for (j = 0; j < V; j++) M[i][j] = 0; }
        docs.forEach(function (f) {
          for (var a = 0; a < f.length; a++)
            for (var b = Math.max(0, a - 1); b <= Math.min(f.length - 1, a + 1); b++)
              if (a !== b) M[idx[f[a]]][idx[f[b]]] += 1;
        });
      }
      function cos(a, b) {
        var s = 0, na = 0, nb = 0;
        for (var k = 0; k < a.length; k++) { s += a[k] * b[k]; na += a[k] * a[k]; nb += b[k] * b[k]; }
        return (na && nb) ? s / Math.sqrt(na * nb) : 0;
      }
      function sim(x, y) {
        if (idx[x] === undefined || idx[y] === undefined) return 0;
        return cos(M[idx[x]], M[idx[y]]);
      }
      construye();
      var pares = [['gato', 'perro'], ['gato', 'gata'], ['nino', 'nina'], ['gato', 'tejado'], ['tejado', 'jardin']];
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 4.5, ymin: 0, ymax: 1.05, height: 220, xstep: 1,
        ylabel: 'coseno', xtickLabel: function (v) { return pares[v] ? pares[v][0] + '·' + pares[v][1] : ''; },
        aria: 'Barras con la similitud coseno de cinco pares de palabras',
        draw: function (g) {
          g.bars(pares.map(function (q, i) {
            return { x: i, h: sim(q[0], q[1]), color: (i < 3 ? 0 : 2) };
          }), { width: 0.55 });
        }
      });
      function pinta() {
        var gp = sim('gato', 'perro'), gg = sim('gato', 'gata'), nn = sim('nino', 'nina'), gt = sim('gato', 'tejado');
        out.set('<strong>' + (quitar ? 'Sin' : 'Con') + ' artículos y preposiciones</strong> &nbsp;·&nbsp; ' +
          lista.length + ' palabras<br>' +
          'gato·perro <strong>' + U.fmt(gp, 3) + '</strong> &nbsp; gato·gata <strong>' + U.fmt(gg, 3) + '</strong> &nbsp; ' +
          'nino·nina <strong>' + U.fmt(nn, 3) + '</strong> &nbsp; gato·tejado <strong>' + U.fmt(gt, 3) + '</strong><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (quitar ? 'Los tres primeros pares, que son parecidos de verdad, salen por encima del cuarto, que junta un animal con un sitio. El resultado tiene sentido.'
            : 'Fíjate en el desastre: gato·perro sale altísimo, pero <strong>gato·gata baja a ' + U.fmt(gg, 3) + '</strong> ' +
              'sólo porque uno va con «el» y otra con «la». Las palabras más frecuentes son las que menos distinguen, y aquí mandan ellas.') +
          '</span>');
        plot.render();
      }
      W.chips(host, [{ label: 'sin palabras vacías', value: 'si' }, { label: 'contándolas todas', value: 'no' }], {
        value: 'si',
        on: function (v) { quitar = (v === 'si'); construye(); pinta(); }
      });
      pinta();
    }
  });

  p.note('Contando todo, «gato» y «gata» salen a <strong>0,149</strong> de parecido, que es absurdo: son ' +
    'casi la misma palabra. El culpable es el artículo. Quitando las palabras vacías suben a ' +
    '<strong>0,632</strong>, y «nino»·«nina» pasa de 0,15 a <strong>0,75</strong>. La moraleja es ' +
    'general: <strong>una palabra que aparece en todas partes no distingue nada</strong>.',
    'warn', 'Las palabras más frecuentes son las que menos dicen');

  /* ---------------------------------------------------------------- */
  p.section('El peso de Spärck Jones');

  p.text('Quitar una lista de palabras a mano es un apaño. La versión buena de esa idea se la debemos a ' +
    '<strong>Karen Spärck Jones</strong>, que en 1972 la convirtió en una fórmula: en lugar de decidir ' +
    'qué palabras ignorar, se le da a cada una un peso que baja cuanto más repartida esté.');

  p.formula('\\text{IDF}(t) = \\log \\frac{N}{n_t}',
    'frecuencia inversa de documento',
    'Donde $N$ es el número de documentos y $n_t$ en cuántos de ellos aparece el término $t$.<br><br>' +
    'Si una palabra sale en todos los documentos, $n_t = N$, el cociente es 1 y su peso es ' +
    '$\\log 1 = 0$: <strong>no aporta nada</strong>. Si sale en uno solo de mil, su peso es ' +
    '$\\log 1000$, que es grande. El logaritmo está para que la cosa no se dispare.<br><br>' +
    'Con 27 frases, «el» aparece en 16 y su peso es $0{,}405$; «gato» está en 5 y pesa $1{,}686$; ' +
    '«queso» sale en 1 y pesa $3{,}296$. Ocho veces más que el artículo.');

  p.note('Conviene no mezclar dos cosas. El IDF nació para <strong>buscar documentos</strong>: pesar las ' +
    'palabras de una consulta para decidir qué texto es más relevante, que es la base de cualquier ' +
    'buscador. La idea de fondo —lo frecuente no informa— es la misma que acabas de ver con los ' +
    'artículos, y es también [[av-informacion|la de Shannon]]: la información de un suceso es tanto ' +
    'mayor cuanto menos probable es.', 'ok', 'De dónde viene y para qué se inventó');

  /* ---------------------------------------------------------------- */
  p.section('Medir el parecido: el coseno');

  p.text('Para comparar dos de estos vectores no sirve la distancia de siempre, porque una palabra ' +
    'frecuente tiene un vector largo y una rara lo tiene corto, y eso no debería contar. Lo que ' +
    'importa es <strong>hacia dónde apuntan</strong>.');

  p.formula('\\cos\\theta = \\frac{\\vec u \\cdot \\vec v}{\\Vert \\vec u \\Vert\\, \\Vert \\vec v \\Vert}',
    'similitud coseno',
    'Es [[ge-vectores|el coseno del ángulo]] entre los dos vectores, y aquí no hace falta más ' +
    'geometría que esa.<br><br>Con recuentos, que nunca son negativos, va de 0 —perpendiculares, ' +
    'ningún vecino en común— a 1 —misma dirección, los mismos vecinos en la misma proporción—. ' +
    'Dividir por las dos normas es justamente lo que quita de en medio el que una palabra sea más ' +
    'frecuente que otra.');

  /* ---------------------------------------------------------------- */
  p.section('El mapa en dos dimensiones');

  p.text('Cada palabra vive en tantas dimensiones como palabras hay en el vocabulario, así que no se ' +
    'puede dibujar. Para eso está [[av-pca|PCA]]: buscar las dos direcciones que más varianza ' +
    'conservan y proyectar sobre ellas.');

  p.demo({
    title: 'Las palabras, puestas en un plano',
    intro: 'Los mismos vectores de antes, normalizados y proyectados sobre sus dos primeras componentes principales. Nadie ha dicho qué es un verbo ni qué es un animal: las agrupaciones salen solas de contar vecinos.',
    predice: '«pescado», «carne», «pan» y «queso» aparecen siempre en el mismo sitio de la frase, detrás de «come». ¿Dónde crees que caerán unos respecto de otros?',
    build: function (host) {
      var FRASES = ['el gato come pescado', 'el perro come carne', 'el gato bebe agua', 'el perro bebe agua',
        'el gato duerme en el tejado', 'el perro duerme en la caseta', 'el gato sube al tejado',
        'el perro corre en el jardin', 'la gata come pescado', 'la gata duerme en el sofa',
        'el raton come queso', 'el raton corre por la cocina', 'el gato caza al raton',
        'la casa tiene un tejado', 'la casa tiene un jardin', 'la casa tiene una cocina',
        'el tejado esta sobre la casa', 'el jardin esta junto a la casa', 'la cocina esta dentro de la casa',
        'el nino come pan', 'el nino bebe leche', 'el nino duerme en la cama',
        'la nina come pan', 'la nina bebe leche', 'la nina duerme en la cama',
        'el nino corre por el jardin', 'la nina sube al tejado'];
      var VACIAS = { el: 1, la: 1, en: 1, al: 1, de: 1, un: 1, una: 1, por: 1, a: 1, sobre: 1, junto: 1, dentro: 1, esta: 1, tiene: 1 };
      var docs = FRASES.map(function (f) { return f.split(/\s+/).filter(function (x) { return !VACIAS[x]; }); });
      var pal = {};
      docs.forEach(function (w) { w.forEach(function (x) { pal[x] = 1; }); });
      var lista = Object.keys(pal).sort(), idx = {};
      lista.forEach(function (w, i) { idx[w] = i; });
      var V = lista.length, M = [], i, j;
      for (i = 0; i < V; i++) { M.push(new Array(V)); for (j = 0; j < V; j++) M[i][j] = 0; }
      docs.forEach(function (f) {
        for (var a = 0; a < f.length; a++)
          for (var b = Math.max(0, a - 1); b <= Math.min(f.length - 1, a + 1); b++)
            if (a !== b) M[idx[f[a]]][idx[f[b]]] += 1;
      });
      /* Normalizar cada fila antes de PCA: lo que significa es la direccion,
         no el tamano, que solo dice cuantas veces sale la palabra. */
      var Mn = M.map(function (f) {
        var n = Math.sqrt(f.reduce(function (a, b) { return a + b * b; }, 0)) || 1;
        return f.map(function (v) { return v / n; });
      });
      var med = new Array(V);
      for (j = 0; j < V; j++) { var s = 0; for (i = 0; i < V; i++) s += Mn[i][j]; med[j] = s / V; }
      var X = Mn.map(function (f) { return f.map(function (v, k) { return v - med[k]; }); });
      function mul(A, v) { return A.map(function (f) { var t = 0; for (var k = 0; k < f.length; k++) t += f[k] * v[k]; return t; }); }
      function mulT(A, u) { var r = new Array(V); for (var q = 0; q < V; q++) { var t = 0; for (var z = 0; z < A.length; z++) t += A[z][q] * u[z]; r[q] = t; } return r; }
      function norm(v) { var t = Math.sqrt(v.reduce(function (a, b) { return a + b * b; }, 0)) || 1; return v.map(function (x) { return x / t; }); }
      function comp(A) {
        var v = norm(lista.map(function (_, k) { return Math.sin(k * 1.7 + 0.3); }));
        for (var t = 0; t < 300; t++) v = norm(mulT(A, mul(A, v)));
        return v;
      }
      var e1 = comp(X), p1 = mul(X, e1);
      var X2 = X.map(function (f, r2) { return f.map(function (v, k) { return v - p1[r2] * e1[k]; }); });
      var e2 = comp(X2), p2 = mul(X2, e2);
      var sel = 'gato';
      function cos(a, b) {
        var t = 0, na = 0, nb = 0;
        for (var k = 0; k < a.length; k++) { t += a[k] * b[k]; na += a[k] * a[k]; nb += b[k] * b[k]; }
        return (na && nb) ? t / Math.sqrt(na * nb) : 0;
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.75, xmax: 0.8, ymin: -0.95, ymax: 0.75, height: 340,
        xlabel: 'primera componente', ylabel: 'segunda componente',
        aria: 'Mapa de las palabras proyectadas sobre sus dos primeras componentes principales, con los grupos separados',
        draw: function (g) {
          lista.forEach(function (w, k) {
            var esSel = (w === sel);
            g.point(p1[k], p2[k], { color: esSel ? 3 : 0, r: esSel ? 6 : 3 });
            g.text(p1[k] + 0.02, p2[k] + 0.03, w, { size: esSel ? 13 : 11, bold: esSel, color: 'ink' });
          });
        }
      });
      function pinta() {
        var k = idx[sel];
        var vecinas = [];
        lista.forEach(function (w) { if (w !== sel) vecinas.push({ w: w, s: cos(M[idx[sel]], M[idx[w]]) }); });
        vecinas.sort(function (a, b) { return b.s - a.s; });
        out.set('<strong>' + sel + '</strong> cae en $(' + U.fmt(p1[k], 3) + ',\\ ' + U.fmt(p2[k], 3) + ')$<br>' +
          'Las más parecidas por coseno: ' + vecinas.slice(0, 3).map(function (x) {
            return '<strong>' + x.w + '</strong> ' + U.fmt(x.s, 3);
          }).join(' &nbsp;·&nbsp; ') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Los verbos se agrupan a la ' +
          'izquierda y los seres vivos a la derecha. «pescado», «carne», «pan» y «queso» caen ' +
          '<strong>exactamente en el mismo punto</strong>: aparecen siempre en el mismo contexto, así ' +
          'que sus vectores son idénticos y el método no tiene forma de distinguirlos. Con un corpus de ' +
          'verdad eso deja de pasar, porque cada palabra acaba teniendo su propia compañía. Y no te fíes ' +
          'del <em>orden</em> entre las más próximas: con veintisiete frases, que «gato» salga más cerca ' +
          'de «nina» que de «perro» es casualidad de dos frases compartidas, no un hallazgo.</span>');
        plot.render();
      }
      W.chips(host, ['gato', 'nina', 'tejado', 'come', 'queso'].map(function (w) { return { label: w, value: w }; }), {
        value: 'gato',
        on: function (v) { sel = v; pinta(); }
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Las analogías, y hasta dónde llegan');

  p.text('Lo que hizo famosos a estos vectores fue descubrir que las <strong>direcciones</strong> también ' +
    'significan: que restando «hombre» a «rey» y sumando «mujer» se llegaba cerca de «reina». Como si ' +
    'hubiera una dirección del plural, otra del femenino, otra de capital-de-país.');

  p.formula('\\vec v(\\text{rey}) - \\vec v(\\text{hombre}) + \\vec v(\\text{mujer}) \\approx \\vec v(\\text{reina})',
    'la analogía, como suma de vectores',
    'La idea es que si el paso de «hombre» a «rey» es un desplazamiento concreto del espacio —el de ' +
    '«ser de la realeza»—, ese mismo desplazamiento aplicado a «mujer» debería llevar a «reina».');

  p.note('En nuestro corpus de 27 frases <strong>esto no funciona</strong>, y conviene verlo. Al pedir ' +
    '«gato − gata + nina», las tres palabras más cercanas salen empatadas a 0,603: «agua», «leche» y ' +
    '«nino». Acierta de refilón y con dos disparates al lado. Las analogías necesitan corpus de miles ' +
    'de millones de palabras, porque hacen falta muchísimos ejemplos de cada relación para que la ' +
    'dirección sea estable. Con veintisiete frases no hay dirección del femenino: hay ruido.',
    'warn', 'Aquí no sale, y hay que decirlo');

  p.text('Y aun con corpus enormes, el resultado se ha exagerado: buena parte de las analogías que se ' +
    'citaban funcionan sólo si se prohíbe expresamente que la respuesta sea una de las tres palabras ' +
    'de la pregunta, que es una ayuda considerable. Sirve para ver que la geometría captura algo real; ' +
    'no para sostener que el modelo razona.');

  p.ejemplo({
    title: 'Coseno entre dos palabras, a mano',
    enunciado: 'Con un vocabulario de cuatro vecinas —come, duerme, agua, tejado—, «gato» tiene el vector $(2, 2, 1, 2)$ y «perro» el $(2, 1, 1, 0)$. Calcular su similitud coseno.',
    pasos: [
      { t: '<strong>El producto escalar.</strong> $2\\cdot2 + 2\\cdot1 + 1\\cdot1 + 2\\cdot0 = 4 + 2 + 1 + 0 = 7$.', antes: 'Multiplica componente a componente y suma.' },
      { t: '<strong>Las normas.</strong> $\\Vert\\vec u\\Vert = \\sqrt{4+4+1+4} = \\sqrt{13} = 3{,}606$ y $\\Vert\\vec v\\Vert = \\sqrt{4+1+1+0} = \\sqrt{6} = 2{,}449$.', antes: 'La norma es la raíz de la suma de los cuadrados.' },
      { t: '<strong>El coseno.</strong> $\\dfrac{7}{3{,}606 \\times 2{,}449} = \\dfrac{7}{8{,}832} = 0{,}793$.', antes: 'Divide el producto escalar por el producto de las normas.' },
      { t: '<strong>Qué significa.</strong> Bastante parecido: comparten «come», «duerme» y «agua». Lo que los separa es «tejado», donde el gato tiene 2 y el perro 0.' },
      { t: '<strong>Por qué el coseno y no la distancia.</strong> Si «gato» apareciera el doble de veces, su vector sería $(4,4,2,4)$, el doble de largo. La distancia cambiaría mucho; el coseno, nada en absoluto, porque la dirección es la misma.' }
    ],
    cierre: 'Esa insensibilidad al tamaño es justo lo que se busca: se quiere comparar con quién aparece cada palabra, no cuántas veces aparece.'
  });

  p.comprueba('En un corpus, la palabra «de» aparece en el 98 % de los documentos. ¿Cuánto vale aproximadamente su IDF y qué implica?', [
    { t: 'Casi cero, así que no influye en decidir qué documento es relevante', ok: true, por: '$\\log(N/n_t)$ con $n_t \\approx N$ da $\\log$ de casi 1, o sea casi 0. Una palabra que está en todas partes no ayuda a distinguir ningún documento de otro, y el peso lo refleja automáticamente sin necesidad de listas hechas a mano.' },
    { t: 'Muy alto, porque es una palabra muy frecuente', ok: false, por: 'Es al revés, y ese es el sentido de la <em>inversa</em> del nombre: el peso baja cuando la palabra está muy repartida.' },
    { t: 'Negativo, y por eso resta relevancia', ok: false, por: 'No puede ser negativo mientras $n_t \\le N$, porque el cociente es mayor o igual que 1 y su logaritmo no baja de cero. Lo máximo que hace es no aportar nada.' }
  ]);

  p.util('Estos vectores son la base de casi toda búsqueda por significado. Cuando un buscador encuentra ' +
    'un documento que no contiene ni una de las palabras que escribiste pero habla justo de eso, lo que ' +
    'ha hecho es comparar vectores, no palabras. Lo mismo hacen los sistemas que recomiendan artículos ' +
    'parecidos, los que agrupan noticias sobre un mismo suceso y los que buscan en una base de ' +
    'documentos para dársela a un modelo de lenguaje antes de que conteste. La diferencia con lo que ' +
    'has visto aquí es que esos vectores no salen de contar vecinos sino de entrenar una red, pero la ' +
    'geometría que se usa después —coseno, vecinos más próximos— es exactamente esta.');

  p.hist('<strong>Karen Spärck Jones</strong> (1935-2007) propuso el peso IDF en 1972, en un artículo ' +
    'titulado <em>A Statistical Interpretation of Term Specificity and Its Application in Retrieval</em>. ' +
    'Trabajó en recuperación de información y procesamiento del lenguaje en Cambridge desde los años ' +
    'cincuenta, cuando casi nadie pensaba que los ordenadores tuvieran algo que hacer con las palabras, ' +
    'y su fórmula sigue estando dentro de los buscadores medio siglo después. Suya es una frase que se ' +
    'cita mucho: «la informática es demasiado importante para dejársela a los hombres».');

  p.trampas([
    { e: 'Usar la distancia en vez del coseno', por: 'La distancia mide también el tamaño del vector, que sólo dice cuántas veces sale la palabra. Dos palabras con los mismos vecinos en la misma proporción deben salir idénticas aunque una sea diez veces más frecuente.' },
    { e: 'Creer que el IDF penaliza las palabras «poco importantes»', por: 'Penaliza las <em>repartidas</em>. Una palabra puede ser importantísima en un texto y tener IDF bajo si aparece en todos los demás.' },
    { e: 'Confundir parecido distribucional con sinonimia', por: 'Los antónimos aparecen en contextos casi idénticos: «caliente» y «frío» salen muy próximos. El método mide compañía, no significado.' },
    { e: 'Fiarse de las analogías como prueba de razonamiento', por: 'Funcionan con corpus enormes y con ayudas en la evaluación. Que la geometría capture algo real no significa que haya razonamiento detrás.' },
    { e: 'Olvidar que los vectores heredan lo que hay en los datos', por: 'Si en el corpus las profesiones aparecen asociadas a un género, esa dirección queda dentro del espacio y sale en cuanto se usa. No es un fallo del método: es el corpus.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Similitud coseno',
    level: 'basico',
    gen: function (r) {
      var u = [r.int(0, 3), r.int(1, 3), r.int(0, 3)], v = [r.int(1, 3), r.int(0, 3), r.int(0, 3)];
      var pe = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
      var nu = Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]);
      var nv = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      if (nu === 0 || nv === 0) return null;
      return { u: u, v: v, pe: pe, nu: nu, nv: nv, c: pe / (nu * nv) };
    },
    ask: function (d) {
      return 'Dos palabras con vectores $(' + d.u.join(', ') + ')$ y $(' + d.v.join(', ') + ')$. ' +
        '¿Cuál es su similitud coseno? (tres decimales)';
    },
    fields: [{ name: 'c', label: 'coseno', w: 'tiny' }],
    sol: function (d) { return { c: U.round(d.c, 8) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(d.pe - d.c) > 0.0005 && Math.abs(v.c - d.pe) < 0.0005; }, msg: 'Ese es sólo el producto escalar. Falta dividir por el producto de las dos normas.' }],
    hint: function (d) { return 'Producto escalar $= ' + d.pe + '$; las normas son $' + U.fmt(d.nu, 3) + '$ y $' + U.fmt(d.nv, 3) + '$.'; },
    steps: function (d) {
      return ['Producto escalar: $' + d.u.map(function (x, i) { return x + '\\cdot' + d.v[i]; }).join(' + ') + ' = ' + d.pe + '$.',
        'Normas: $' + U.fmt(d.nu, 3) + '$ y $' + U.fmt(d.nv, 3) + '$.',
        '$\\cos\\theta = ' + d.pe + ' / (' + U.fmt(d.nu, 3) + ' \\times ' + U.fmt(d.nv, 3) + ') = ' + U.fmt(d.c, 3) + '$.'];
    },
    answer: function (d) { return U.fmt(d.c, 3); }
  });

  p.exercise({
    title: 'El peso IDF',
    level: 'basico',
    gen: function (r) {
      var N = r.pick([100, 500, 1000]), n = r.pick([1, 5, 50, 100, 500]);
      if (n > N) n = N;
      return { N: N, n: n, idf: Math.log(N / n) };
    },
    ask: function (d) {
      return 'Una colección de ' + U.miles(d.N) + ' documentos, y un término que aparece en ' + U.miles(d.n) +
        ' de ellos. ¿Cuánto vale su IDF, con logaritmo neperiano? (tres decimales)';
    },
    fields: [{ name: 'i', label: 'IDF', w: 'tiny' }],
    sol: function (d) { return { i: U.round(d.idf, 8) }; },
    dec: 3,
    errores: [{ si: function (v, d) { var alReves = Math.log(d.n / d.N); return Math.abs(alReves - d.idf) > 0.0005 && Math.abs(v.i - alReves) < 0.0005; }, msg: 'Lo has puesto al revés y sale negativo. Arriba van los documentos totales: es la frecuencia <em>inversa</em>.' }],
    hint: function () { return '$\\text{IDF} = \\ln(N/n_t)$.'; },
    steps: function (d) {
      return ['$\\ln(' + U.miles(d.N) + '/' + U.miles(d.n) + ') = \\ln ' + U.fmt(d.N / d.n, 2) + ' = ' + U.fmt(d.idf, 3) + '$.',
        d.n === d.N ? 'Aparece en todos: el peso es exactamente cero y el término no distingue nada.'
          : (d.idf > 4 ? 'Peso alto: es un término muy específico, de los que de verdad identifican un documento.'
            : 'Peso moderado: aparece en una parte apreciable de la colección.')];
    },
    answer: function (d) { return U.fmt(d.idf, 3); }
  });

  p.exercise({
    title: 'El coseno no cambia con la escala',
    level: 'medio',
    gen: function (r) {
      var u = [r.int(1, 4), r.int(1, 4)], k = r.int(2, 5);
      var v = [r.int(1, 4), r.int(1, 4)];
      var pe = u[0] * v[0] + u[1] * v[1];
      var c = pe / (Math.sqrt(u[0] * u[0] + u[1] * u[1]) * Math.sqrt(v[0] * v[0] + v[1] * v[1]));
      return { u: u, v: v, k: k, c: c };
    },
    ask: function (d) {
      return 'La palabra A tiene vector $(' + d.u.join(', ') + ')$ y la B, $(' + d.v.join(', ') + ')$. ' +
        'Si el corpus se ampliara y A apareciera exactamente ' + d.k + ' veces más, su vector sería $(' +
        d.u.map(function (x) { return x * d.k; }).join(', ') + ')$. ¿Cuál es el coseno antes, y cuál después? (tres decimales)';
    },
    fields: [{ name: 'a', label: 'antes', w: 'tiny' }, { name: 'b', label: 'después', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.c, 8), b: U.round(d.c, 8) }; },
    dec: 3,
    hint: function () { return 'Multiplicar un vector por un número positivo no cambia su dirección, y el coseno sólo mira la dirección.'; },
    steps: function (d) {
      return ['Antes: $\\cos\\theta = ' + U.fmt(d.c, 3) + '$.',
        'Después, el numerador se multiplica por $' + d.k + '$ y la norma de A también, así que el $' + d.k + '$ se cancela arriba y abajo.',
        'Después: $' + U.fmt(d.c, 3) + '$, exactamente el mismo.',
        'Esa es la razón de usar el coseno y no la distancia: mide compañía, no frecuencia.'];
    },
    answer: function (d) { return U.fmt(d.c, 3) + ' en los dos casos'; }
  });

  p.exercise({
    title: 'Cuánto ocupa la tabla',
    level: 'medio',
    gen: function (r) {
      var V = r.pick([10000, 32000, 50000]), dim = r.pick([64, 128, 300, 768]);
      return { V: V, dim: dim, n: V * dim, mb: V * dim * 4 / 1048576 };
    },
    ask: function (d) {
      return 'Un vocabulario de ' + U.miles(d.V) + ' tokens, cada uno con un vector de $' + d.dim +
        '$ números. ¿Cuántos números tiene la tabla, y cuántos megabytes ocupa a 4 bytes por número? ' +
        '(un decimal los megabytes)';
    },
    fields: [{ name: 'n', label: 'números', w: 'small' }, { name: 'm', label: 'MB', w: 'tiny' }],
    sol: function (d) { return { n: d.n, m: U.round(d.mb, 6) }; },
    dec: { m: 1, n: 0 },
    hint: function () { return 'Un número por cada dimensión y por cada token. Un megabyte son $1\\,048\\,576$ bytes.'; },
    steps: function (d) {
      return ['$' + U.miles(d.V) + ' \\times ' + d.dim + ' = ' + U.miles(d.n) + '$ números.',
        '$' + U.miles(d.n) + ' \\times 4 = ' + U.miles(d.n * 4) + '$ bytes, o sea $' + U.fmt(d.mb, 1) + '$ MB.',
        'Esa tabla es sólo la entrada del modelo: cada token se sustituye por su fila antes de cualquier otra cuenta.'];
    },
    answer: function (d) { return U.miles(d.n) + ' números, ' + U.fmt(d.mb, 1) + ' MB'; }
  });

  p.exercise({
    title: 'Qué mide y qué no mide',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: '«caliente» y «frío» salen con un coseno altísimo', v: 'contexto', por: 'El método mide con quién aparece cada palabra, no qué significa. Los antónimos comparten casi todos sus contextos —«el agua está…»— así que salen próximos. Es una limitación conocida del parecido distribucional.' },
        { t: 'una palabra que sólo aparece dos veces tiene un vector rarísimo', v: 'pocos', por: 'Su vector se ha estimado con dos observaciones: es puro ruido. Las palabras raras necesitan muchos ejemplos o algún método que las descomponga en trozos más frecuentes.' },
        { t: 'al ampliar el corpus una palabra dobla su frecuencia y su coseno con las demás no cambia', v: 'escala', por: 'Es lo esperado y lo deseable: el coseno sólo mira la dirección, y multiplicar un vector por una constante positiva no la cambia.' },
        { t: 'los vectores asocian ciertas profesiones a un género', v: 'datos', por: 'Esa asociación estaba en el corpus y el método la ha recogido fielmente. No es un error de cálculo; es un espejo de los textos con los que se construyó.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Al construir vectores de palabras contando vecinos se observa que ' + d.c.t + '. ¿Cómo se explica?'; },
    fields: [{ name: 'q', label: 'Explicación', opts: [
      { t: 'mide contexto, no significado: los antónimos comparten contexto', v: 'contexto' },
      { t: 'hay muy pocos ejemplos de esa palabra', v: 'pocos' },
      { t: 'es lo correcto: el coseno no depende de la escala', v: 'escala' },
      { t: 'estaba en los datos y el método lo ha recogido', v: 'datos' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Pregúntate si lo que se observa viene del método, de la cantidad de datos, o de lo que había escrito en el corpus.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.keys([
    'Una palabra se representa por la compañía que tiene: el recuento de sus vecinas <em>es</em> su vector.',
    'Las palabras más frecuentes son las que menos distinguen. Contando los artículos, «gato» y «gata» salen a 0,149; sin ellos, a 0,632.',
    'El IDF de Spärck Jones formaliza esa idea: $\\log(N/n_t)$ vale cero para lo que está en todos los documentos.',
    'El parecido se mide con el coseno, no con la distancia, porque interesa la dirección y no cuántas veces aparece la palabra.',
    'Proyectando con PCA salen grupos que nadie ha marcado: verbos por un lado, seres vivos por otro.',
    'Las analogías por suma de vectores necesitan corpus enormes; con 27 frases no salen, y conviene no exagerar lo que demuestran.'
  ]);
});
