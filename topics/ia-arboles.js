/* Tema: Preguntar lo que mas informa */
Course.topic('ia-arboles', function (p) {

  p.puente('[[ia-distancia|Los vecinos más cercanos]] contestan bien pero no saben explicar por qué: ' +
    'dicen «se parece a estos». Aquí el modelo es una lista de preguntas que se puede leer en voz ' +
    'alta. La herramienta nueva es la [[av-informacion|entropía]], que por fin va a servir para algo ' +
    'que no es comprimir, y para el bosque del final hará falta [[pe-inferencia|el muestreo]].');

  p.text('Un <strong>árbol de decisión</strong> es un cuestionario: se hace una pregunta, según la ' +
    'respuesta se hace otra, y al final se llega a un veredicto. Es el modelo más transparente que ' +
    'existe: se imprime en un folio y una persona puede seguirlo con el dedo. Un médico de urgencias, ' +
    'un banco que deniega un crédito o una inspección alimentaria pueden usarlo y además ' +
    '<em>justificar</em> la decisión, cosa que con casi ningún otro modelo se puede.');

  p.text('La única pregunta interesante es cuál preguntar primero. Y tiene una respuesta medible: la que ' +
    '<strong>más reduzca la incertidumbre</strong>.');

  /* ---------------------------------------------------------------- */
  p.section('Medir el desorden de un grupo');

  p.text('Si en un nodo del árbol quedan ocho setas y las ocho son tóxicas, no hay ninguna duda: ese ' +
    'nodo ya es una respuesta. Si quedan cuatro y cuatro, la duda es máxima. Entre esos dos extremos ' +
    'hace falta un número, y ese número ya lo tienes: es la entropía.');

  p.formula('H = -\\sum_c p_c \\log_2 p_c',
    'la entropía de un nodo, en bits',
    'Se lee: <em>«hache es menos el sumatorio, sobre las clases, de pe sub ce por el logaritmo en base ' +
    'dos de pe sub ce»</em>, donde $p_c$ es la proporción de la clase $c$ en ese nodo.<br><br>Con dos ' +
    'clases vale entre 0 y 1 bit. Vale <strong>0</strong> cuando todo es de la misma clase —no hay ' +
    'nada que preguntar— y <strong>1</strong> cuando está mitad y mitad, que es la máxima duda ' +
    'posible. Es exactamente la misma fórmula con la que se medía cuánto ocupa un mensaje, aplicada ' +
    'ahora a «cuánta duda queda».');

  p.text('Una pregunta parte el grupo en dos. Cada trozo tiene su propia entropía, y lo que cuenta es la ' +
    '<strong>media de las dos, pesada por cuánta gente cae en cada lado</strong>. Lo que se ha ganado ' +
    'preguntando es lo que ha bajado.');

  p.formula('\\text{ganancia} = H(\\text{padre}) - \\sum_{i} \\frac{n_i}{n}\\,H(\\text{hijo}_i)',
    'ganancia de información',
    'Se lee: <em>«la ganancia es la entropía del padre menos el sumatorio, sobre los hijos, de ene sub ' +
    'i partido por ene, por la entropía del hijo i»</em>.<br><br>El peso $n_i/n$ importa: partir un ' +
    'grupo de cien en uno de noventa y nueve y otro de uno casi no informa, aunque ese uno quede ' +
    'purísimo. La ganancia <strong>nunca es negativa</strong> y nunca supera la entropía del padre; ' +
    'si la iguala, la pregunta ha separado las clases perfectamente y el árbol termina ahí.');

  p.demo({
    title: 'Buscar el mejor corte',
    intro: 'Veinticuatro setas ordenadas por el tamaño de su sombrero, tóxicas arriba y comestibles abajo. Mueve el corte y mira las dos entropías de abajo. La curva naranja es la ganancia en cada posición posible: búscale el máximo a ojo y comprueba que coincide con donde tú lo pondrías.',
    predice: 'Si pones el corte en un extremo, un lado se queda con casi todas las setas y el otro con una o dos. ¿Crees que la ganancia será grande o pequeña ahí?',
    build: function (host) {
      var corte = 3.2;
      var datos = [];
      (function () {
        var r = U.rng(13), i;
        for (i = 0; i < 24; i++) {
          var x = 0.4 + i * 0.36;
          var tox = x < 4.1 ? (r.bool(0.82) ? 1 : 0) : (r.bool(0.18) ? 1 : 0);
          datos.push({ x: x, c: tox });
        }
      })();
      function H(a, b) {
        var n = a + b;
        if (!n) return 0;
        var pa = a / n, pb = b / n, h = 0;
        if (pa > 0) h -= pa * Math.log(pa) / Math.LN2;
        if (pb > 0) h -= pb * Math.log(pb) / Math.LN2;
        return h;
      }
      function reparto(u) {
        var ia = 0, ib = 0, da = 0, db = 0;
        datos.forEach(function (q) {
          if (q.x < u) { if (q.c) ia++; else ib++; } else { if (q.c) da++; else db++; }
        });
        return { ia: ia, ib: ib, da: da, db: db };
      }
      function ganancia(u) {
        var R = reparto(u), n = datos.length;
        var ni = R.ia + R.ib, nd = R.da + R.db;
        var padre = H(R.ia + R.da, R.ib + R.db);
        return padre - (ni / n) * H(R.ia, R.ib) - (nd / n) * H(R.da, R.db);
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 9.2, ymin: -0.25, ymax: 1.55, height: 300,
        xlabel: 'tamaño del sombrero', ylabel: 'ganancia (bits)',
        aria: 'Veinticuatro setas de dos clases ordenadas por tamaño, con el corte elegido y la curva de ganancia de información',
        draw: function (g) {
          g.path(
            (function () {
              var pts = [], u;
              for (u = 0.2; u <= 9; u += 0.06) pts.push([u, ganancia(u)]);
              return pts;
            })(), { color: 2, w: 2.2 });
          datos.forEach(function (q) {
            g.point(q.x, q.c ? 1.38 : 1.2, { color: q.c ? 4 : 0, r: 4.5 });
          });
          g.text(0.1, 1.38, 'tóxicas', { color: 4, size: 11.5 });
          g.text(0.1, 1.2, 'comestibles', { color: 0, size: 11.5 });
          g.vline(corte, { color: 'ink', w: 2.2, dash: [5, 4] });
        }
      });
      function pinta() {
        var R = reparto(corte), n = datos.length;
        var ni = R.ia + R.ib, nd = R.da + R.db;
        var hi = H(R.ia, R.ib), hd = H(R.da, R.db);
        var padre = H(R.ia + R.da, R.ib + R.db);
        var gan = ganancia(corte);
        var mejor = 0, mu = 0, u;
        for (u = 0.2; u <= 9; u += 0.02) { var gg = ganancia(u); if (gg > mejor) { mejor = gg; mu = u; } }
        out.set('<strong>Izquierda</strong> (' + ni + ' setas): ' + R.ia + ' tóxicas, ' + R.ib + ' comestibles, $H = ' + U.fmt(hi, 3) + '$<br>' +
          '<strong>Derecha</strong> (' + nd + ' setas): ' + R.da + ' tóxicas, ' + R.db + ' comestibles, $H = ' + U.fmt(hd, 3) + '$<br>' +
          'Media pesada: $\\frac{' + ni + '}{' + n + '}\\cdot' + U.fmt(hi, 3) + ' + \\frac{' + nd + '}{' + n + '}\\cdot' + U.fmt(hd, 3) + ' = ' + U.fmt(padre - gan, 3) + '$<br>' +
          '<strong>Ganancia = ' + U.fmt(padre, 3) + ' − ' + U.fmt(padre - gan, 3) + ' = ' + U.fmt(gan, 3) + ' bits</strong>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)"> &nbsp;·&nbsp; el máximo posible está en ' + U.fmt(mu, 2) + ', con ' + U.fmt(mejor, 3) + ' bits.</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'dónde cortar', min: 0.2, max: 9, step: 0.05, value: 3.2, dec: 2,
        on: function (v) { corte = v; pinta(); }
      });
      pinta();
    }
  });

  p.text('Fíjate en la curva: en los extremos la ganancia es prácticamente cero, porque un corte que ' +
    'deja una seta a un lado y veintitrés al otro no ha resuelto nada. El máximo está donde las dos ' +
    'clases se separan mejor. <strong>Construir un árbol es repetir esa búsqueda</strong>: en cada ' +
    'nodo se prueban todas las preguntas posibles, se elige la de más ganancia, y se vuelve a empezar ' +
    'en cada trozo.');

  p.ejemplo({
    title: 'Elegir la primera pregunta',
    enunciado: 'Ocho setas, cuatro tóxicas y cuatro comestibles. Con el atributo <em>anillo</em>, las cuatro con anillo son 3 tóxicas y 1 comestible, y las cuatro sin anillo, 1 tóxica y 3 comestibles. Con el atributo <em>color oscuro</em>, las cuatro oscuras son las 4 tóxicas y las cuatro claras, las 4 comestibles. ¿Por cuál se pregunta primero?',
    pasos: [
      { t: '<strong>Entropía del padre.</strong> Cuatro y cuatro: $p = 0{,}5$ en las dos clases, así que $H = -0{,}5\\log_2 0{,}5 - 0{,}5\\log_2 0{,}5 = 1$ bit. Duda máxima.', antes: 'Mitad y mitad. ¿Cuánto vale la entropía?' },
      { t: '<strong>El atributo anillo.</strong> Cada hijo tiene 3 y 1, o sea $H = -0{,}75\\log_2 0{,}75 - 0{,}25\\log_2 0{,}25 = 0{,}311 + 0{,}5 = 0{,}811$ bits. Los dos hijos tienen cuatro setas, así que la media pesada es $0{,}811$.', antes: 'Calcula la entropía de un nodo con 3 de una clase y 1 de la otra.' },
      { t: '<strong>Su ganancia.</strong> $1 - 0{,}811 = 0{,}189$ bits. Ha servido de poco: sigue habiendo mucha duda en los dos lados.', antes: 'Resta a la entropía del padre.' },
      { t: '<strong>El atributo color.</strong> Un hijo con 4 tóxicas y 0 comestibles tiene $H = 0$, y el otro también. La media pesada es $0$, y la ganancia, $1 - 0 = 1$ bit.', antes: 'Un nodo en el que todo es de la misma clase, ¿cuánta entropía tiene?' },
      { t: '<strong>La decisión.</strong> Gana el color, con 1 bit frente a 0,189. Y además su ganancia iguala la entropía del padre, que es el máximo posible: los dos hijos son puros y el árbol termina con una sola pregunta.' }
    ],
    cierre: 'Ese árbol de una pregunta se lee así: «si el sombrero es oscuro, tóxica; si es claro, comestible». Un folio, una línea, y una decisión que cualquiera puede auditar.'
  });

  p.comprueba('Un corte deja a un lado 1 seta (pura) y al otro 99 muy mezcladas. ¿Cómo será la ganancia?', [
    { t: 'Muy pequeña: el trozo puro pesa solo $1/100$ en la media, y el de 99 apenas ha cambiado', ok: true, por: 'La media de las entropías va pesada por el tamaño de cada hijo. Aislar un caso deja el problema casi intacto, y por eso la ganancia apenas sube.' },
    { t: 'Máxima: uno de los hijos ha quedado perfectamente puro', ok: false, por: 'La pureza de un hijo de una sola seta no vale nada si los otros 99 siguen igual de revueltos. Sin el peso, este error llevaría a árboles que separan de uno en uno.' },
    { t: 'Negativa, porque el lado grande ha empeorado', ok: false, por: 'La ganancia nunca es negativa: partir un grupo no puede aumentar la entropía media pesada. Como mucho, se queda en cero.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Dejar crecer el árbol, y saber pararlo');

  p.text('Repitiendo la búsqueda en cada trozo, el árbol va partiendo el espacio en rectángulos, porque ' +
    'cada pregunta es del tipo «¿esta medida pasa de tanto?». Y si se le deja crecer sin límite, ' +
    'acaba con una hoja por cada ejemplo: acierta el <strong>100 %</strong> de lo que ya ha visto y no ' +
    'ha aprendido nada. Ese es el problema que tiene un tema entero más adelante.');

  p.demo({
    title: 'Un árbol, y después un bosque',
    intro: 'Dos clases entrelazadas. El fondo es lo que contesta el modelo en cada punto. Sube la profundidad y verás los escalones del árbol persiguiendo cada punto suelto; después cambia a bosque y compara la misma profundidad con treinta árboles votando.',
    predice: 'Un árbol solo parte con cortes horizontales y verticales. ¿Podrá dibujar una frontera diagonal, o tendrá que hacerla a escalones?',
    build: function (host) {
      var prof = 3, modo = 'arbol', cache = null, claveCache = '';
      var D = NN.datos.lunas(U.rng(5), 90, 0.2);
      var out = W.readout(host, '');

      function H(idx) {
        var a = 0, b = 0;
        idx.forEach(function (i) { if (D.y[i]) a++; else b++; });
        var n = a + b;
        if (!n) return 0;
        var h = 0;
        if (a) h -= (a / n) * Math.log(a / n) / Math.LN2;
        if (b) h -= (b / n) * Math.log(b / n) / Math.LN2;
        return h;
      }
      function mayoria(idx) {
        var a = 0;
        idx.forEach(function (i) { if (D.y[i]) a++; });
        return a * 2 >= idx.length ? 1 : 0;
      }
      /* Arbol codicioso: en cada nodo se prueban cortes en las dos
         columnas y se elige el de mayor ganancia. `cols` limita que
         columnas se miran, que es lo que aleatoriza un bosque. */
      function construye(idx, d, cols, r) {
        if (d >= prof || idx.length < 5 || H(idx) === 0) return { hoja: mayoria(idx) };
        var mejor = null, hPadre = H(idx);
        cols.forEach(function (j) {
          var vals = idx.map(function (i) { return D.X[i][j]; }).sort(function (a, b) { return a - b; });
          for (var k = 2; k < vals.length - 2; k += 2) {
            var u = (vals[k] + vals[k + 1]) / 2;
            var izq = [], der = [];
            idx.forEach(function (i) { (D.X[i][j] < u ? izq : der).push(i); });
            if (!izq.length || !der.length) continue;
            var gan = hPadre - (izq.length / idx.length) * H(izq) - (der.length / idx.length) * H(der);
            if (!mejor || gan > mejor.gan) mejor = { gan: gan, j: j, u: u, izq: izq, der: der };
          }
        });
        if (!mejor || mejor.gan <= 1e-9) return { hoja: mayoria(idx) };
        var sub = r ? [r.int(0, 1)] : [0, 1];
        return {
          j: mejor.j, u: mejor.u,
          izq: construye(mejor.izq, d + 1, r ? sub : [0, 1], r),
          der: construye(mejor.der, d + 1, r ? [r.int(0, 1)] : [0, 1], r)
        };
      }
      function predice(nodo, q) {
        while (nodo.hoja === undefined) nodo = q[nodo.j] < nodo.u ? nodo.izq : nodo.der;
        return nodo.hoja;
      }
      function modelo() {
        var clave = modo + prof;
        if (claveCache === clave) return cache;
        var todos = D.X.map(function (_, i) { return i; });
        if (modo === 'arbol') {
          cache = [construye(todos, 0, [0, 1], null)];
        } else {
          var r = U.rng(3), arboles = [], t, i;
          for (t = 0; t < 30; t++) {
            var muestra = [];
            for (i = 0; i < todos.length; i++) muestra.push(r.int(0, todos.length - 1));
            arboles.push(construye(muestra, 0, [r.int(0, 1)], r));
          }
          cache = arboles;
        }
        claveCache = clave;
        return cache;
      }
      function vota(q) {
        var ms = modelo(), unos = 0;
        ms.forEach(function (m) { if (predice(m, q)) unos++; });
        return unos * 2 >= ms.length ? 1 : 0;
      }
      var plot = W.plot(host, {
        xmin: -1.6, xmax: 2.6, ymin: -1.2, ymax: 1.7, height: 330, equal: true,
        aria: 'Dos nubes entrelazadas con la frontera de decisión de un árbol o de un bosque, dibujada a escalones',
        draw: function (g) {
          var paso = 0.09, x, y;
          for (x = -1.6; x <= 2.6; x += paso) {
            for (y = -1.2; y <= 1.7; y += paso) {
              var c = vota([x, y]);
              g.rect(x, y, paso, paso, { color: c ? 2 : 0, fill: c ? 2 : 0, fillAlpha: 0.14, w: 0 });
            }
          }
          D.X.forEach(function (q, i) { g.point(q[0], q[1], { color: D.y[i] ? 2 : 0, r: 3.6 }); });
        }
      });
      function pinta() {
        var bien = 0;
        D.X.forEach(function (q, i) { if (vota(q) === D.y[i]) bien++; });
        out.set('<strong>' + (modo === 'arbol' ? 'Un árbol' : 'Un bosque de 30 árboles') + '</strong> de profundidad ' + prof +
          ' &nbsp;·&nbsp; acierta el <strong>' + U.fmt(100 * bien / D.X.length, 1) + ' %</strong> de los ejemplos que ha visto<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (modo === 'arbol'
            ? (prof >= 7 ? 'A esta profundidad el árbol ya está dibujando un rectángulo alrededor de casi cada punto: se lo está aprendiendo de memoria.'
              : 'Los cortes son horizontales y verticales, así que una frontera diagonal solo se puede imitar a escalones.')
            : 'Treinta árboles, cada uno entrenado con una muestra distinta y mirando una columna al azar en cada nodo. Al votar, los escalones de cada uno se promedian y la frontera sale mucho más lisa.') +
          '</span>');
        plot.render();
      }
      W.chips(host, [{ label: 'un árbol', value: 'arbol' }, { label: 'un bosque de 30', value: 'bosque' }],
        { value: 'arbol', on: function (v) { modo = v; claveCache = ''; pinta(); } });
      W.slider(W.row(host), {
        label: 'profundidad máxima', min: 1, max: 9, step: 1, value: 3, dec: 0,
        on: function (v) { prof = v; claveCache = ''; pinta(); }
      });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El bosque: muchos árboles mediocres valen más que uno bueno');

  p.text('Un árbol profundo tiene un defecto conocido: es <strong>inestable</strong>. Cambia unos pocos ' +
    'ejemplos y el primer corte sale distinto, y a partir de ahí el árbol entero es otro. Dicho con ' +
    'el vocabulario de la estadística, tiene mucha <em>varianza</em>. Y contra la varianza hay un ' +
    'remedio que ya conoces: <strong>promediar</strong>.');

  p.text('Un <strong>bosque aleatorio</strong> entrena muchos árboles, cada uno sobre una muestra ' +
    'distinta de los datos —sacada con reemplazamiento, como en [[pe-inferencia|el muestreo]]— y ' +
    'mirando en cada nodo solo unas columnas elegidas al azar. Cada árbol por separado es peor que el ' +
    'original. Al votar entre todos, el conjunto es mejor.');

  p.formula('\\operatorname{Var}\\left(\\frac{1}{k}\\sum_{t=1}^{k} f_t\\right) = \\rho\\,\\sigma^2 + \\frac{1-\\rho}{k}\\,\\sigma^2',
    'por qué promediar estabiliza',
    'Se lee: <em>«la varianza de la media de ka funciones es ro por sigma cuadrado, más uno menos ro ' +
    'partido por ka, por sigma cuadrado»</em>.<br><br>$\\sigma^2$ es la varianza de un árbol suelto y ' +
    '$\\rho$ es lo parecidos que son entre sí. Si fueran independientes ($\\rho = 0$) la varianza se ' +
    'dividiría entre $k$ y bastaría con poner muchos. Pero se parecen, y ahí está el truco del ' +
    'método: <strong>las dos dosis de azar —la muestra y las columnas— existen para bajar ' +
    '$\\rho$</strong>, no para mejorar cada árbol. El primer término es el suelo: por muchos árboles ' +
    'que se pongan, no se baja de $\\rho\\sigma^2$.');

  p.note('Merece la pena quedarse con esta idea, porque reaparece: <strong>a un conjunto de modelos le ' +
    'conviene que sus errores sean distintos</strong>. Treinta árboles que se equivocan todos en lo ' +
    'mismo no son mejores que uno. Por eso se les estropea a propósito, dándole a cada uno datos ' +
    'incompletos y vistas parciales.', 'ok', 'Que se equivoquen en cosas distintas');

  p.util('Los bosques aleatorios siguen siendo, en 2026, la primera opción razonable para datos en ' +
    'tabla —filas y columnas, como una hoja de cálculo—, y en esa forma de datos aguantan el tipo ' +
    'frente a modelos mucho más grandes. El Kinect de Microsoft estimaba la postura del cuerpo en ' +
    'tiempo real con un bosque de decisión sobre píxeles de profundidad, y se publicó cómo funcionaba ' +
    'en 2011. Y en medicina y en banca se siguen prefiriendo los árboles poco profundos precisamente ' +
    'por lo que se ve en este tema: porque la decisión se puede leer y discutir.');

  p.hist('Ross Quinlan publicó en 1986 el algoritmo ID3, que es exactamente elegir en cada nodo el ' +
    'atributo de mayor ganancia de información, y después lo amplió en C4.5. Casi a la vez, en 1984, ' +
    'Leo Breiman y sus colaboradores publicaron CART, con otra medida de desorden, el índice de Gini. ' +
    'Tin Kam Ho propuso en 1995 entrenar cada árbol mirando solo unas columnas al azar, y Breiman ' +
    'juntó esa idea con el muestreo con reemplazamiento en 2001 en el artículo que bautizó los ' +
    '<em>random forests</em>. Breiman defendió toda su vida que un modelo que acierta y no se entiende ' +
    'es un problema, y no una solución.');

  p.trampas([
    { e: 'Elegir el corte que deja un hijo puro sin mirar su tamaño', por: 'Aislar una seta pura de cien apenas da ganancia, porque la media va pesada por $n_i/n$. Sin el peso, el árbol separaría de uno en uno.' },
    { e: 'Creer que una ganancia de 0 significa que los datos no sirven', por: 'Significa que <em>esa</em> pregunta no separa nada. Puede haber otra que sí, y en XOR ninguna columna por separado gana nada aunque las dos juntas lo expliquen todo.' },
    { e: 'Dejar crecer el árbol hasta el final', por: 'Con una hoja por ejemplo acierta el 100 % de lo que ya vio y falla en lo nuevo. Hay que limitar la profundidad o exigir un mínimo de ejemplos por hoja.' },
    { e: 'Pensar que un bosque es mejor porque cada árbol es mejor', por: 'Es al contrario: cada árbol es <em>peor</em>, porque se le dan datos incompletos. Lo que mejora es el conjunto, y solo porque se equivocan en cosas distintas.' },
    { e: 'Esperar fronteras diagonales de un árbol', por: 'Cada pregunta compara una columna con un número, así que los cortes son perpendiculares a los ejes. Una diagonal solo sale a escalones.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'La entropía de un nodo',
    level: 'basico',
    gen: function (r) {
      var casos = [[4, 4], [8, 0], [6, 2], [3, 1], [7, 1], [5, 5], [9, 3], [2, 6]];
      var c = r.pick(casos), a = c[0], b = c[1], n = a + b, h = 0;
      if (a) h -= (a / n) * Math.log(a / n) / Math.LN2;
      if (b) h -= (b / n) * Math.log(b / n) / Math.LN2;
      return { a: a, b: b, n: n, h: h };
    },
    ask: function (d) {
      return 'En un nodo de un árbol quedan $' + d.a + '$ setas tóxicas y $' + d.b + '$ comestibles. ' +
        '¿Cuánto vale su entropía, en bits? (tres decimales)';
    },
    fields: [{ name: 'h', label: 'H', w: 'tiny' }],
    sol: function (d) { return { h: U.round(d.h, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return d.b !== 0 && Math.abs(v.h) < 0.0005; }, msg: 'Solo da cero cuando <em>todas</em> son de la misma clase. Aquí hay de las dos, así que queda alguna duda.' }],
    hint: function (d) { return 'Las proporciones son $' + d.a + '/' + d.n + '$ y $' + d.b + '/' + d.n + '$. Si una de las dos es cero, su término no suma nada y la entropía es 0.'; },
    steps: function (d) {
      if (!d.b || !d.a) return ['Todas las setas son de la misma clase: no hay ninguna duda, así que $H = 0$.'];
      var pa = d.a / d.n, pb = d.b / d.n;
      return ['$p_1 = ' + U.fmt(pa, 3) + '$ y $p_2 = ' + U.fmt(pb, 3) + '$.',
        '$H = -' + U.fmt(pa, 3) + '\\log_2 ' + U.fmt(pa, 3) + ' - ' + U.fmt(pb, 3) + '\\log_2 ' + U.fmt(pb, 3) + ' = ' + U.fmt(d.h, 3) + '$ bits.',
        d.a === d.b ? 'Mitad y mitad: es la duda máxima, exactamente 1 bit.' : 'Al estar desequilibrado, baja de 1 bit: ya hay una clase más probable que la otra.'];
    },
    answer: function (d) { return U.fmt(d.h, 3); }
  });

  p.exercise({
    title: '¿Qué pregunta informa más?',
    level: 'basico',
    gen: function (r) {
      var a = r.real(0.1, 0.9, 3), b = r.real(0.1, 0.9, 3);
      if (Math.abs(a - b) < 0.08) return null;
      return { a: a, b: b, mejor: a < b ? 'A' : 'B' };
    },
    ask: function (d) {
      return 'Dos preguntas se aplican al mismo nodo, cuya entropía es $1$ bit. La pregunta ' +
        '<strong>A</strong> deja una entropía media pesada de $' + U.fmt(d.a, 3) + '$ bits, y la ' +
        '<strong>B</strong>, de $' + U.fmt(d.b, 3) + '$ bits. ¿Cuál se elige?';
    },
    fields: [{ name: 'q', label: 'Se elige', opts: [{ t: 'la pregunta A', v: 'A' }, { t: 'la pregunta B', v: 'B' }] }],
    sol: function (d) { return { q: d.mejor }; },
    hint: function () { return 'La ganancia es lo que <em>baja</em> la entropía. Gana la que deje menos duda detrás.'; },
    steps: function (d) {
      return ['Ganancia de A: $1 - ' + U.fmt(d.a, 3) + ' = ' + U.fmt(1 - d.a, 3) + '$ bits.',
        'Ganancia de B: $1 - ' + U.fmt(d.b, 3) + ' = ' + U.fmt(1 - d.b, 3) + '$ bits.',
        'Gana la <strong>' + d.mejor + '</strong>: deja menos entropía, luego informa más.'];
    },
    answer: function (d) { return 'la ' + d.mejor; }
  });

  p.exercise({
    title: 'Calcular una ganancia',
    level: 'medio',
    gen: function (r) {
      var ia = r.int(1, 5), ib = r.int(1, 5), da = r.int(1, 5), db = r.int(1, 5);
      function H(a, b) {
        var n = a + b, h = 0;
        if (a) h -= (a / n) * Math.log(a / n) / Math.LN2;
        if (b) h -= (b / n) * Math.log(b / n) / Math.LN2;
        return h;
      }
      var ni = ia + ib, nd = da + db, n = ni + nd;
      var padre = H(ia + da, ib + db);
      var media = (ni / n) * H(ia, ib) + (nd / n) * H(da, db);
      if (padre - media < 0.01) return null;
      return { ia: ia, ib: ib, da: da, db: db, ni: ni, nd: nd, n: n, hi: H(ia, ib), hd: H(da, db), padre: padre, media: media, gan: padre - media };
    },
    ask: function (d) {
      return 'Un nodo con $' + (d.ia + d.da) + '$ tóxicas y $' + (d.ib + d.db) + '$ comestibles se parte ' +
        'en dos: a la izquierda quedan $' + d.ia + '$ tóxicas y $' + d.ib + '$ comestibles, y a la ' +
        'derecha $' + d.da + '$ y $' + d.db + '$. Calcula la entropía del padre y la ganancia de este ' +
        'corte. (tres decimales)';
    },
    fields: [{ name: 'p', label: 'H del padre', w: 'tiny' }, { name: 'g', label: 'ganancia', w: 'tiny' }],
    sol: function (d) { return { p: U.round(d.padre, 6), g: U.round(d.gan, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(d.media - d.gan) > 0.002 && Math.abs(v.g - d.media) < 0.002; }, msg: 'Eso es la entropía media que queda <em>después</em> de preguntar. La ganancia es lo que ha bajado: hay que restársela a la del padre.' }],
    hint: function (d) { return 'Primero la del padre con los totales. Después, la de cada hijo, pesadas por $' + d.ni + '/' + d.n + '$ y $' + d.nd + '/' + d.n + '$. La ganancia es la resta.'; },
    steps: function (d) {
      return ['Padre: $' + (d.ia + d.da) + '$ y $' + (d.ib + d.db) + '$ de $' + d.n + '$ → $H = ' + U.fmt(d.padre, 3) + '$.',
        'Hijos: $H_{izq} = ' + U.fmt(d.hi, 3) + '$ y $H_{der} = ' + U.fmt(d.hd, 3) + '$.',
        'Media pesada: $\\frac{' + d.ni + '}{' + d.n + '}\\cdot' + U.fmt(d.hi, 3) + ' + \\frac{' + d.nd + '}{' + d.n + '}\\cdot' + U.fmt(d.hd, 3) + ' = ' + U.fmt(d.media, 3) + '$.',
        'Ganancia $= ' + U.fmt(d.padre, 3) + ' - ' + U.fmt(d.media, 3) + ' = ' + U.fmt(d.gan, 3) + '$ bits.'];
    },
    answer: function (d) { return 'H = ' + U.fmt(d.padre, 3) + ', ganancia = ' + U.fmt(d.gan, 3); }
  });

  p.exercise({
    title: 'Seguir el árbol con el dedo',
    level: 'medio',
    gen: function (r) {
      var u1 = r.int(3, 7), u2 = r.int(2, 6);
      var x = r.int(1, 9), y = r.int(1, 9);
      var clase;
      if (x < u1) clase = (y < u2) ? 'comestible' : 'toxica';
      else clase = 'comestible';
      return { u1: u1, u2: u2, x: x, y: y, clase: clase };
    },
    ask: function (d) {
      return 'Un árbol dice: «¿el sombrero mide menos de ' + d.u1 + ' cm? Si <strong>no</strong>, ' +
        'comestible. Si <strong>sí</strong>, ¿el pie mide menos de ' + d.u2 + ' cm? Si sí, comestible; ' +
        'si no, tóxica.» Clasifica una seta con sombrero de ' + d.x + ' cm y pie de ' + d.y + ' cm.';
    },
    fields: [{ name: 'q', label: 'Es', opts: [{ t: 'comestible', v: 'comestible' }, { t: 'tóxica', v: 'toxica' }] }],
    sol: function (d) { return { q: d.clase }; },
    hint: function () { return 'Empieza por la pregunta de arriba y baja según la respuesta. Solo se recorre un camino: las otras ramas no se miran.'; },
    steps: function (d) {
      return [d.x < d.u1
        ? 'Sombrero ' + d.x + ' < ' + d.u1 + ': sí, se baja a la segunda pregunta.'
        : 'Sombrero ' + d.x + ' no es menor que ' + d.u1 + ': se acaba aquí, <strong>comestible</strong>.',
        d.x < d.u1
          ? 'Pie ' + d.y + (d.y < d.u2 ? ' < ' + d.u2 + ': <strong>comestible</strong>.' : ' no es menor que ' + d.u2 + ': <strong>tóxica</strong>.')
          : 'Esta rama del árbol ni se ha mirado.',
        'Un modelo que se puede seguir con el dedo y explicar a quien reciba la decisión: eso es lo que ningún otro del bloque ofrece.'];
    },
    answer: function (d) { return d.clase; }
  });

  p.exercise({
    title: 'Cuántos árboles hacen falta',
    level: 'avanzado',
    gen: function (r) {
      var s2 = r.pick([0.4, 0.6, 0.8, 1.2]), k = r.pick([5, 10, 25, 50]);
      var rho = r.pick([0, 0.2, 0.4]);
      return { s2: s2, k: k, rho: rho, v: rho * s2 + (1 - rho) * s2 / k, suelo: rho * s2 };
    },
    ask: function (d) {
      return 'Cada árbol de un bosque tiene una varianza de $\\sigma^2 = ' + U.fmt(d.s2, 1) + '$, y entre ' +
        'ellos hay una correlación de $\\rho = ' + U.fmt(d.rho, 1) + '$. Con $k = ' + d.k + '$ árboles, ' +
        '¿cuál es la varianza del bosque, y a cuánto tendería con infinitos árboles? (tres decimales)';
    },
    fields: [{ name: 'v', label: 'varianza con k árboles', w: 'tiny' }, { name: 's', label: 'suelo (k → ∞)', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.v, 6), s: U.round(d.suelo, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return d.rho !== 0 && Math.abs(v.v - d.s2 / d.k) < 0.002; }, msg: 'Eso valdría solo si los árboles fueran independientes. Con $\\rho > 0$ hay un término que no se divide entre $k$ y no desaparece nunca.' }],
    hint: function () { return 'Sustituye en $\\rho\\sigma^2 + \\frac{1-\\rho}{k}\\sigma^2$. Para el suelo, haz $k$ enorme: el segundo término se va a cero.'; },
    steps: function (d) {
      return ['$' + U.fmt(d.rho, 1) + '\\cdot' + U.fmt(d.s2, 1) + ' + \\frac{1 - ' + U.fmt(d.rho, 1) + '}{' + d.k + '}\\cdot' + U.fmt(d.s2, 1) + ' = ' + U.fmt(d.v, 3) + '$',
        'Con infinitos árboles el segundo término desaparece y queda $' + U.fmt(d.suelo, 3) + '$.',
        d.rho === 0
          ? 'Con árboles independientes el suelo es cero: bastaría con poner muchos. Por eso interesa que se parezcan lo menos posible.'
          : 'Por muchos árboles que se añadan no se baja de $' + U.fmt(d.suelo, 3) + '$. Para bajar ese suelo hay que bajar $\\rho$, y para eso está el doble azar de la muestra y las columnas.'];
    },
    answer: function (d) { return U.fmt(d.v, 3) + ', suelo ' + U.fmt(d.suelo, 3); }
  });

  p.keys([
    'Un árbol de decisión es un cuestionario, y es el único modelo del bloque que una persona puede leer y discutir.',
    'La entropía mide la duda que queda en un nodo: 0 si es puro, 1 bit si está mitad y mitad.',
    'Se elige en cada nodo la pregunta de mayor <strong>ganancia</strong>: lo que baja la entropía media pesada por el tamaño de cada hijo.',
    'El peso $n_i/n$ es esencial: aislar un ejemplo puro de cien no informa casi nada.',
    'Los cortes son perpendiculares a los ejes, así que una frontera diagonal sale a escalones, y un árbol sin límite se aprende los datos de memoria.',
    'Un bosque promedia muchos árboles peores, y funciona porque el azar de la muestra y de las columnas hace que se equivoquen en cosas distintas.'
  ]);
});
