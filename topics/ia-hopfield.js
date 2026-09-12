/* Tema: La memoria como un valle */
Course.topic('ia-hopfield', function (p) {

  p.puente('De [[av-sistemas-dinamicos|los sistemas dinámicos]] viene la idea de que una trayectoria ' +
    'acaba cayendo en un atractor, y de [[av-optimizacion|optimización]], la de bajar una función hasta ' +
    'un mínimo. Este tema junta las dos de una manera muy poco habitual: en vez de estudiar qué hace ' +
    'un sistema dado, se <strong>fabrica</strong> uno cuyos valles estén donde nosotros queramos.');

  p.text('Todas las redes del bloque anterior iban en una dirección: entra algo por un lado y sale una ' +
    'respuesta por el otro. Esta no. Aquí no hay capas, ni entrada, ni salida: hay un montón de ' +
    'neuronas conectadas todas con todas, y <strong>el estado de la red es la respuesta</strong>. Se le ' +
    'enseña un recuerdo a medias y la red se reorganiza sola hasta completarlo.');

  /* ---------------------------------------------------------------- */
  p.section('Una red sin capas');

  p.text('Hay $N$ neuronas y cada una vale $+1$ o $-1$. Entre cada par hay un peso $w_{ij}$, y se exige ' +
    'que sea <strong>simétrico</strong>, $w_{ij} = w_{ji}$, y que ninguna neurona se conecte consigo ' +
    'misma. Para actualizar una neurona se mira lo que le llega de todas las demás y se pone del signo ' +
    'de esa suma.');

  p.formula('h_i = \\sum_{j \\ne i} w_{ij}\\,s_j, \\qquad s_i \\leftarrow \\operatorname{signo}(h_i)',
    'la regla de actualización',
    'Se lee: <em>«hache sub i es el sumatorio, sobre las jotas distintas de i, de doble uve sub i jota ' +
    'por ese sub jota; y ese sub i pasa a ser el signo de hache sub i»</em>.<br><br>Es la neurona de ' +
    'McCulloch-Pitts de siempre: una suma ponderada y un umbral. Lo nuevo es que ' +
    '<strong>no hay dirección</strong>: la salida de cada una es entrada de todas las demás. Las ' +
    'neuronas se actualizan de una en una, en orden aleatorio, y el estado va cambiando hasta que deja ' +
    'de cambiar.');

  /* ---------------------------------------------------------------- */
  p.section('La energía solo puede bajar');

  p.text('Lo que convierte esto en algo más que un revoltijo es que se le puede asociar un número que ' +
    '<strong>nunca aumenta</strong>. Se le llama energía, por analogía con la física de la que salió.');

  p.formula('E = -\\sum_{i<j} w_{ij}\\,s_i\\,s_j',
    'la energía del estado',
    'Se lee: <em>«e es menos el sumatorio, sobre los pares i menor que jota, de doble uve sub i jota por ' +
    'ese sub i por ese sub jota»</em>. Se suma una vez por cada <strong>par</strong> de neuronas.<br><br>' +
    'Cada par aporta menos energía cuando las dos neuronas están de acuerdo con lo que dice su peso: si ' +
    '$w_{ij}$ es positivo, el término baja cuando $s_i$ y $s_j$ coinciden.');

  p.text('Y ahora la cuenta que lo demuestra todo, que cabe en tres líneas. Los términos de la energía en ' +
    'los que aparece la neurona $i$ suman $-s_i h_i$. Si esa neurona cambia de signo, la energía varía ' +
    'en:');

  p.formula('\\Delta E = 2\\,s_i\\,h_i',
    'lo que cambia la energía al voltear una neurona',
    'Sale de sustituir $s_i$ por $-s_i$: el término pasa de $-s_ih_i$ a $+s_ih_i$, y la diferencia es ' +
    '$2s_ih_i$.<br><br>Aquí está el truco: la regla <strong>solo voltea</strong> una neurona cuando su ' +
    'signo no coincide con el de $h_i$, es decir, cuando $s_ih_i < 0$. Y entonces $\\Delta E$ es ' +
    '<strong>negativo</strong>.<br><br>Conclusión: cada cambio baja estrictamente la energía. Como los ' +
    'estados posibles son finitos —hay $2^N$— y la energía no puede bajar para siempre, ' +
    '<strong>el proceso tiene que pararse</strong>. Y para cuando llega a un mínimo local.');

  p.note('Esto es exactamente un atractor de [[av-sistemas-dinamicos|los sistemas dinámicos]], visto desde ' +
    'otro lado. Allí se estudiaba a dónde iba a parar un sistema dado; aquí se <em>diseñan</em> los ' +
    'pesos para que los valles caigan donde interesa. Una función que solo puede bajar y garantiza que ' +
    'el sistema se detiene se llama, en general, función de Lyapunov.', 'ok', 'Un atractor a la carta');

  /* ---------------------------------------------------------------- */
  p.section('Cavar los valles: la regla de Hebb');

  p.text('Falta lo esencial: cómo elegir los pesos para que los mínimos sean los recuerdos que queremos. ' +
    'La receta es de una sencillez desconcertante: <strong>por cada patrón que se quiera guardar, se ' +
    'suma el producto de cada par de sus componentes</strong>.');

  p.formula('w_{ij} = \\sum_{p} x_i^{(p)}\\,x_j^{(p)}, \\qquad w_{ii} = 0',
    'la regla de Hebb',
    'Se lee: <em>«doble uve sub i jota es el sumatorio, sobre los patrones pe, de equis sub i del patrón ' +
    'pe por equis sub jota del patrón pe»</em>.<br><br>Con un solo patrón, $w_{ij} = x_ix_j$ vale $+1$ ' +
    'si las dos neuronas valían lo mismo en él y $-1$ si valían distinto. Es decir: ' +
    '<strong>el peso recuerda si las dos coincidían</strong>.<br><br>Es la traducción matemática de la ' +
    'frase de Hebb de 1949: las neuronas que se activan juntas acaban conectadas. Y fíjate en que ' +
    '<em>no hay entrenamiento</em>: no hay pérdida, ni gradiente, ni iteraciones. Los pesos se escriben ' +
    'de una vez, de un solo vistazo a los patrones.');

  p.demo({
    title: 'Recordar una imagen medio borrada',
    intro: 'Tres patrones de 8×8 guardados con la regla de Hebb. Elige uno, estrópealo con el mando, y pulsa para que la red se reorganice neurona a neurona. Abajo, la energía en cada paso: comprueba que nunca sube.',
    predice: 'Cada actualización baja la energía y el estado tiene 64 neuronas, así que hay $2^{64}$ posibles. ¿Crees que la red puede quedarse dando vueltas sin parar nunca?',
    build: function (host) {
      var N = 8, cual = 0, ruido = 20, estado = null, historia = [];
      /* Tres patrones dibujados a mano: una cruz, una te y una ele. */
      var DIB = [
        ['..#..#..', '..#..#..', '########', '..#..#..', '..#..#..', '########', '..#..#..', '..#..#..'],
        ['########', '...##...', '...##...', '...##...', '...##...', '...##...', '...##...', '...##...'],
        ['##......', '##......', '##......', '##......', '##......', '##......', '##......', '########']
      ];
      var NOMBRES = ['una rejilla', 'una te', 'una ele'];
      function aVector(d) {
        var v = [], a, b;
        for (a = 0; a < N; a++) for (b = 0; b < N; b++) v.push(d[a].charAt(b) === '#' ? 1 : -1);
        return v;
      }
      var patrones = DIB.map(aVector);
      /* Pesos de Hebb: una sola pasada, sin entrenamiento. */
      var Wm = [];
      (function () {
        var i, j, k;
        for (i = 0; i < N * N; i++) { Wm.push([]); for (j = 0; j < N * N; j++) Wm[i].push(0); }
        for (k = 0; k < patrones.length; k++) {
          for (i = 0; i < N * N; i++) for (j = 0; j < N * N; j++) {
            if (i !== j) Wm[i][j] += patrones[k][i] * patrones[k][j];
          }
        }
      })();
      function energia(s) {
        var e = 0, i, j;
        for (i = 0; i < N * N; i++) for (j = i + 1; j < N * N; j++) e -= Wm[i][j] * s[i] * s[j];
        return e;
      }
      function ensucia() {
        var r = U.rng(4 + cual * 7 + ruido), s = patrones[cual].slice(), i;
        var cuantas = Math.round(N * N * ruido / 100);
        var orden = r.shuffle((function () { var a = [], k; for (k = 0; k < N * N; k++) a.push(k); return a; })());
        for (i = 0; i < cuantas; i++) s[orden[i]] = -s[orden[i]];
        return s;
      }
      function reinicia() { estado = ensucia(); historia = [energia(estado)]; }
      reinicia();
      function barrido() {
        var r = U.rng(99 + historia.length), i, cambios = 0;
        var orden = r.shuffle((function () { var a = [], k; for (k = 0; k < N * N; k++) a.push(k); return a; })());
        for (i = 0; i < orden.length; i++) {
          var idx = orden[i], h = 0, j;
          for (j = 0; j < N * N; j++) if (j !== idx) h += Wm[idx][j] * estado[j];
          var nuevo = h >= 0 ? 1 : -1;
          if (nuevo !== estado[idx]) { estado[idx] = nuevo; cambios++; }
        }
        historia.push(energia(estado));
        if (historia.length > 40) historia.shift();
        return cambios;
      }
      function iguales(a, b) {
        var i;
        for (i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
        return true;
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 19.5, ymin: -1.5, ymax: 8.5, height: 260, equal: true,
        grid: false, axes: false,
        aria: 'El patrón guardado, el estado actual de la red y las diferencias entre ambos',
        draw: function (g) {
          var a, b;
          for (a = 0; a < N; a++) for (b = 0; b < N; b++) {
            var v = patrones[cual][a * N + b];
            g.rect(b, N - 1 - a, 1, 1, { color: 'ink', fill: 'ink', fillAlpha: v > 0 ? 0.8 : 0.06, w: 0.3, alpha: 0.3 });
          }
          for (a = 0; a < N; a++) for (b = 0; b < N; b++) {
            var idx = a * N + b, s = estado[idx], mal = s !== patrones[cual][idx];
            g.rect(11 + b, N - 1 - a, 1, 1, {
              color: mal ? 'bad' : 2, fill: mal ? 'bad' : 2,
              fillAlpha: s > 0 ? 0.85 : 0.08, w: 0.3, alpha: 0.3
            });
          }
          g.text(0, -1, 'el recuerdo guardado', { color: 'ink', size: 12 });
          g.text(11, -1, 'el estado de la red', { color: 2, size: 12 });
        }
      });
      var plotE = W.plot(host, {
        xmin: 0, xmax: 12, ymin: -1, ymax: 1, height: 170,
        xlabel: 'barridos', ylabel: 'energía',
        aria: 'La energía de la red en cada barrido, que nunca sube',
        draw: function (g) {
          if (historia.length < 2) { g.point(0, historia[0], { color: 2, r: 4 }); return; }
          var min = Math.min.apply(null, historia), max = Math.max.apply(null, historia);
          var pad = (max - min) * 0.15 + 1;
          g.view(0, Math.max(4, historia.length - 1), min - pad, max + pad);
          g.path(historia.map(function (v, i) { return [i, v]; }), { color: 2, w: 2.4 });
          historia.forEach(function (v, i) { g.point(i, v, { color: 2, r: 3 }); });
        }
      });
      function pinta() {
        var difs = 0, i;
        for (i = 0; i < estado.length; i++) if (estado[i] !== patrones[cual][i]) difs++;
        var ok = iguales(estado, patrones[cual]);
        out.set('Patrón: <strong>' + NOMBRES[cual] + '</strong> &nbsp;·&nbsp; píxeles distintos del recuerdo: <strong>' + difs + '</strong> de 64<br>' +
          'Energía: <strong>' + U.fmt(historia[historia.length - 1], 0) + '</strong> tras ' + (historia.length - 1) + ' barrido' + (historia.length === 2 ? '' : 's') + '<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (ok ? 'Recuperado exactamente. La red ha caído en el valle correcto y ya no se mueve: es un mínimo.'
            : (difs < 6 ? 'Casi. Cada barrido baja la energía, y el estado se está deslizando hacia el fondo del valle.'
              : 'Todavía lejos del recuerdo. Dale otro barrido y mira la energía.')) +
          '</span>');
        plot.render();
        plotE.render();
      }
      W.chips(host, [{ label: 'la rejilla', value: 0 }, { label: 'la te', value: 1 }, { label: 'la ele', value: 2 }],
        { value: 0, on: function (v) { cual = v; reinicia(); pinta(); } });
      W.slider(W.row(host), {
        label: 'porcentaje de píxeles estropeados', min: 0, max: 45, step: 5, value: 20, dec: 0,
        on: function (v) { ruido = v; reinicia(); pinta(); }
      });
      W.buttons(host, [
        { t: 'Un barrido', cls: 'btn--main', on: function () { barrido(); pinta(); } },
        { t: 'Hasta que pare', on: function () { var k; for (k = 0; k < 12; k++) if (barrido() === 0) break; pinta(); } },
        { t: '↺ Volver a estropear', on: function () { reinicia(); pinta(); } }
      ]);
      pinta();
    }
  });

  p.ejemplo({
    title: 'Cuatro neuronas, un recuerdo',
    enunciado: 'Guardar en una red de cuatro neuronas el patrón $x = (+1, +1, -1, +1)$. Calcular los pesos, la energía del propio patrón, y qué pasa si la tercera neurona aparece con el signo cambiado.',
    pasos: [
      { t: '<strong>Los pesos.</strong> Con un solo patrón, $w_{ij} = x_ix_j$. Salen $w_{12} = +1$, $w_{13} = -1$, $w_{14} = +1$, $w_{23} = -1$, $w_{24} = +1$ y $w_{34} = -1$.', antes: 'Multiplica las componentes dos a dos. ¿Cuáles salen negativas?' },
      { t: '<strong>La energía del patrón.</strong> $E = -\\sum_{i<j} w_{ij}x_ix_j$. Cada término vale $w_{ij}x_ix_j = (x_ix_j)^2 = 1$, y hay seis pares: $E = -6$.', antes: 'Sustituye. ¿Cuánto vale cada uno de los seis términos?' },
      { t: '<strong>El estado estropeado.</strong> Si la tercera se voltea, el estado es $s = (+1, +1, +1, +1)$. Ahora los términos con la tercera neurona cambian de signo: los tres pares que la incluyen valen $-1$ en vez de $+1$, así que $E = -(3 - 3) = 0$.', antes: 'Tres de los seis términos cambian. ¿Cuánto suma ahora?' },
      { t: '<strong>Lo que ve la tercera neurona.</strong> $h_3 = w_{31}s_1 + w_{32}s_2 + w_{34}s_4 = (-1)(1) + (-1)(1) + (-1)(1) = -3$. Su signo es negativo y ella vale $+1$: no coinciden, así que se voltea.', antes: 'Calcula la suma que le llega a la tercera neurona.' },
      { t: '<strong>Y la energía baja.</strong> $\\Delta E = 2s_3h_3 = 2(+1)(-3) = -6$, así que pasa de $0$ a $-6$: el patrón original. La red lo ha recuperado en un solo cambio.' }
    ],
    cierre: 'Fíjate en que $-6$ es el mínimo posible con estos pesos: los seis términos no pueden valer todos $-1$ a la vez de ninguna otra forma… salvo una. El estado $(-1,-1,+1,-1)$, que es el patrón entero cambiado de signo, da exactamente la misma energía. Toda red de Hopfield guarda cada recuerdo por duplicado, con sus dos polaridades.'
  });

  p.comprueba('¿Por qué la red tiene garantizado que va a parar?', [
    { t: 'Porque cada cambio baja estrictamente la energía y solo hay un número finito de estados', ok: true, por: 'Los dos ingredientes hacen falta. Que baje siempre impide volver a un estado ya visitado, y que los estados sean finitos ($2^N$) impide bajar para siempre. Juntos obligan a que el proceso se detenga.' },
    { t: 'Porque los pesos son simétricos', ok: false, por: 'La simetría es necesaria para que la energía exista y funcione como se ha descrito, pero por sí sola no garantiza nada: hace falta además el argumento de que cada cambio la baja.' },
    { t: 'Porque se actualizan las neuronas en orden aleatorio', ok: false, por: 'El orden no interviene en el argumento: cualquier orden de actualización baja la energía igual. Lo que puede cambiar con el orden es en qué mínimo se acaba, no si se acaba.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Cuántos recuerdos caben');

  p.text('La regla de Hebb suma un término por patrón, así que guardar más es cuestión de seguir sumando. ' +
    'Pero los valles se estorban entre sí: al meter muchos, aparecen mínimos que <strong>no ' +
    'corresponden a ningún patrón guardado</strong> —mezclas de varios— y la red empieza a caer en ' +
    'ellos. Hay un límite, y se conoce con precisión.');

  p.formula('P_{\\max} \\approx 0{,}138\\,N',
    'la capacidad de una red de Hopfield',
    'Se lee: <em>«pe máxima es aproximadamente cero coma ciento treinta y ocho por ene»</em>.<br><br>Con ' +
    '$N$ neuronas solo caben unos $0{,}138N$ patrones antes de que la recuperación se degrade. En la ' +
    'demo hay 64 neuronas, así que el límite está en torno a <strong>ocho o nueve patrones</strong>, y ' +
    'por eso se guardan tres.<br><br>Es un número <em>malo</em>: la red usa $N^2/2$ pesos para guardar ' +
    '$0{,}138N$ patrones de $N$ bits. Gasta del orden de $N^2$ números para almacenar del orden de $N$. ' +
    'Como memoria es un derroche, y esa es la razón honesta de que no se use para almacenar cosas.');

  p.demo({
    title: 'Llenarla hasta que falle',
    intro: 'Se guardan patrones aleatorios en una red de 64 neuronas y se comprueba cuántos se recuperan partiendo de una versión con un 10 % de píxeles cambiados. Sube el número y mira dónde se cae el porcentaje.',
    predice: 'Con 64 neuronas, la fórmula da un límite de unos nueve patrones. ¿Crees que el fallo aparecerá de golpe al pasar de nueve, o poco a poco antes?',
    build: function (host) {
      var P = 2, N2 = 64;
      var out = W.readout(host, '');
      function mide(cuantos) {
        var r = U.rng(50 + cuantos), pats = [], i, j, k;
        for (k = 0; k < cuantos; k++) {
          var v = [];
          for (i = 0; i < N2; i++) v.push(r.bool(0.5) ? 1 : -1);
          pats.push(v);
        }
        var Wm = [];
        for (i = 0; i < N2; i++) { Wm.push([]); for (j = 0; j < N2; j++) Wm[i].push(0); }
        for (k = 0; k < cuantos; k++) {
          for (i = 0; i < N2; i++) for (j = 0; j < N2; j++) if (i !== j) Wm[i][j] += pats[k][i] * pats[k][j];
        }
        var bien = 0;
        for (k = 0; k < cuantos; k++) {
          var s = pats[k].slice();
          for (i = 0; i < Math.round(N2 * 0.1); i++) { var q = r.int(0, N2 - 1); s[q] = -s[q]; }
          var it, cambios;
          for (it = 0; it < 15; it++) {
            cambios = 0;
            for (i = 0; i < N2; i++) {
              var h = 0;
              for (j = 0; j < N2; j++) if (j !== i) h += Wm[i][j] * s[j];
              var nv = h >= 0 ? 1 : -1;
              if (nv !== s[i]) { s[i] = nv; cambios++; }
            }
            if (!cambios) break;
          }
          var difs = 0;
          for (i = 0; i < N2; i++) if (s[i] !== pats[k][i]) difs++;
          if (difs === 0) bien++;
        }
        return 100 * bien / cuantos;
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 21, ymin: -5, ymax: 108, height: 280,
        xlabel: 'patrones guardados', ylabel: '% recuperados',
        aria: 'Porcentaje de patrones recuperados según cuántos se hayan guardado, con el límite teórico marcado',
        draw: function (g) {
          var pts = [], k;
          for (k = 1; k <= 20; k++) pts.push([k, mide(k)]);
          g.path(pts, { color: 2, w: 2.4 });
          pts.forEach(function (q) { g.point(q[0], q[1], { color: 2, r: 3 }); });
          g.vline(0.138 * N2, { color: 1, w: 1.8, dash: [5, 4] });
          g.text(0.138 * N2 + 0.3, 96, '0,138 N ≈ 8,8', { color: 1, size: 11.5 });
          g.point(P, mide(P), { color: 'ink', r: 6, hollow: true });
        }
      });
      function pinta() {
        var v = mide(P);
        out.set('Con <strong>' + P + '</strong> patrones guardados en 64 neuronas se recupera el <strong>' +
          U.fmt(v, 0) + ' %</strong>.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (P <= 6 ? 'Muy por debajo del límite: la recuperación es perfecta o casi.'
            : (P <= 10 ? 'Rondando el límite teórico de 8,8: la degradación ya ha empezado, y no de golpe sino poco a poco.'
              : 'Muy por encima: los valles de los patrones se han fundido en mínimos que no corresponden a ninguno, y la red cae en ellos.')) +
          '</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'patrones guardados', min: 1, max: 20, step: 1, value: 2, dec: 0,
        on: function (v) { P = v; pinta(); }
      });
      pinta();
    }
  });

  p.util('Como almacén de datos no compensa, pero la idea que introduce sí se quedó: una ' +
    '<strong>memoria direccionable por contenido</strong>, en la que no se pide el dato por su ' +
    'dirección sino por un trozo de él mismo. Es lo que hace tu cabeza cuando recuperas una canción ' +
    'entera a partir de dos notas, y lo que hacen los sistemas que buscan por parecido: dar un ' +
    'fragmento y recibir el original completo. La arquitectura concreta apenas se usa; el concepto ' +
    'está en todas partes.');

  p.hist('John Hopfield era físico, y eso explica el tema entero: trasladó a las neuronas las matemáticas ' +
    'de los <em>vidrios de espín</em>, materiales cuyos átomos tienen orientaciones magnéticas que ' +
    'interactúan por pares y buscan minimizar una energía. Su artículo de 1982 tuvo un efecto ' +
    'desproporcionado: llegó en pleno desierto de las redes neuronales, traía una garantía matemática ' +
    'de convergencia —algo muy escaso entonces— y atrajo al campo a una generación de físicos. En 2024 ' +
    'compartió el Nobel de Física con Geoffrey Hinton, por los trabajos que hicieron posible el ' +
    'aprendizaje automático con redes neuronales.');

  p.trampas([
    { e: 'Poner pesos asimétricos', por: 'Con $w_{ij} \\ne w_{ji}$ la energía deja de estar bien definida y el argumento se cae: la red puede entrar en un ciclo y no parar nunca.' },
    { e: 'Olvidar poner a cero la diagonal', por: 'Un peso de una neurona consigo misma la hace inmune a lo que digan las demás: se queda clavada en su valor sea cual sea el estado.' },
    { e: 'Esperar que recupere siempre el patrón más parecido', por: 'Cae en el mínimo <em>cuya cuenca</em> contiene el estado inicial, que no siempre es el patrón más parecido. Y con muchos patrones hay mínimos espurios que no son ninguno.' },
    { e: 'Creer que aquí hay entrenamiento', por: 'Los pesos se escriben de una vez con la regla de Hebb. No hay pérdida, ni gradiente, ni épocas: es un cálculo directo a partir de los patrones.' },
    { e: 'Pensar que es una buena memoria', por: 'Gasta del orden de $N^2$ pesos para guardar del orden de $N$ bits. Lo valioso es el concepto de memoria por contenido, no la eficiencia.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Los pesos de un patrón',
    level: 'basico',
    gen: function (r) {
      var x = [], i;
      for (i = 0; i < 4; i++) x.push(r.bool(0.5) ? 1 : -1);
      return { x: x, w12: x[0] * x[1], w13: x[0] * x[2], w34: x[2] * x[3] };
    },
    ask: function (d) {
      return 'Se guarda el patrón $x = (' + d.x.map(function (v) { return U.fmts(v, 0); }).join(',\\ ') +
        ')$ con la regla de Hebb. Calcula $w_{12}$, $w_{13}$ y $w_{34}$.';
    },
    fields: [
      { name: 'a', label: 'w₁₂', w: 'tiny' }, { name: 'b', label: 'w₁₃', w: 'tiny' }, { name: 'c', label: 'w₃₄', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.w12, b: d.w13, c: d.w34 }; },
    hint: function () { return 'Con un solo patrón, $w_{ij} = x_ix_j$: vale $+1$ si las dos componentes coinciden y $-1$ si no.'; },
    steps: function (d) {
      return ['$w_{12} = (' + U.fmts(d.x[0], 0) + ')(' + U.fmts(d.x[1], 0) + ') = ' + U.fmts(d.w12, 0) + '$',
        '$w_{13} = (' + U.fmts(d.x[0], 0) + ')(' + U.fmts(d.x[2], 0) + ') = ' + U.fmts(d.w13, 0) + '$',
        '$w_{34} = (' + U.fmts(d.x[2], 0) + ')(' + U.fmts(d.x[3], 0) + ') = ' + U.fmts(d.w34, 0) + '$',
        'El peso guarda si las dos neuronas coincidían en el patrón, y nada más.'];
    },
    answer: function (d) { return d.w12 + ', ' + d.w13 + ', ' + d.w34; }
  });

  p.exercise({
    title: 'Lo que le llega a una neurona',
    level: 'basico',
    gen: function (r) {
      var w = [r.nz(-3, 3), r.nz(-3, 3), r.nz(-3, 3)];
      var s = [r.bool(0.5) ? 1 : -1, r.bool(0.5) ? 1 : -1, r.bool(0.5) ? 1 : -1];
      var h = w[0] * s[0] + w[1] * s[1] + w[2] * s[2];
      if (h === 0) return null;
      var actual = r.bool(0.5) ? 1 : -1;
      return { w: w, s: s, h: h, actual: actual, nuevo: h >= 0 ? 1 : -1, voltea: (h >= 0 ? 1 : -1) !== actual };
    },
    ask: function (d) {
      return 'A una neurona que ahora vale $' + U.fmts(d.actual, 0) + '$ le llegan tres vecinas con pesos $' +
        d.w.map(function (v) { return U.fmts(v, 0); }).join('$, $') + '$ y estados $' +
        d.s.map(function (v) { return U.fmts(v, 0); }).join('$, $') + '$. Calcula $h$ y di en qué valor queda.';
    },
    fields: [
      { name: 'h', label: 'h', w: 'tiny' },
      { name: 'v', label: 'Queda en', opts: [{ t: '+1', v: '1' }, { t: '−1', v: '-1' }] }
    ],
    sol: function (d) { return { h: d.h, v: String(d.nuevo) }; },
    errores: [{ si: function (v, d) { return d.nuevo !== d.actual && v.v === String(d.actual); }, msg: 'La regla pone la neurona en el signo de $h$, tenga el valor que tenga ahora: si no coinciden, se voltea.' }],
    hint: function () { return 'Suma cada peso por el estado de su vecina, y después quédate con el signo del resultado.'; },
    steps: function (d) {
      return ['$h = ' + d.w.map(function (v, i) { return '(' + U.fmts(v, 0) + ')(' + U.fmts(d.s[i], 0) + ')'; }).join(' + ') + ' = ' + U.fmts(d.h, 0) + '$',
        'Su signo es ' + (d.h >= 0 ? 'positivo' : 'negativo') + ', así que la neurona queda en $' + U.fmts(d.nuevo, 0) + '$.',
        d.voltea ? 'Como no coincidía con lo que valía, se ha volteado, y eso hace bajar la energía.' : 'Ya valía eso, así que no cambia nada y la energía se queda igual.'];
    },
    answer: function (d) { return 'h = ' + d.h + ', queda en ' + U.fmts(d.nuevo, 0); }
  });

  p.exercise({
    title: 'La energía de un estado',
    level: 'medio',
    gen: function (r) {
      var w12 = r.nz(-2, 2), w13 = r.nz(-2, 2), w23 = r.nz(-2, 2);
      var s = [r.bool(0.5) ? 1 : -1, r.bool(0.5) ? 1 : -1, r.bool(0.5) ? 1 : -1];
      var E = -(w12 * s[0] * s[1] + w13 * s[0] * s[2] + w23 * s[1] * s[2]);
      return { w12: w12, w13: w13, w23: w23, s: s, E: E };
    },
    ask: function (d) {
      return 'Una red de tres neuronas tiene $w_{12} = ' + U.fmts(d.w12, 0) + '$, $w_{13} = ' + U.fmts(d.w13, 0) +
        '$ y $w_{23} = ' + U.fmts(d.w23, 0) + '$. ¿Cuánto vale la energía del estado $s = (' +
        d.s.map(function (v) { return U.fmts(v, 0); }).join(',\\ ') + ')$?';
    },
    fields: [{ name: 'e', label: 'E', w: 'tiny' }],
    sol: function (d) { return { e: d.E }; },
    errores: [{ si: function (v, d) { return d.E !== 0 && v.e === -d.E; }, msg: 'Se te ha ido el signo menos de delante del sumatorio: la energía es <em>menos</em> la suma de los términos.' }],
    hint: function () { return '$E = -\\sum_{i<j} w_{ij}s_is_j$: tres pares, y un signo menos delante de todo.'; },
    steps: function (d) {
      return ['Los tres términos: $' + U.fmts(d.w12, 0) + '\\cdot(' + U.fmts(d.s[0], 0) + ')(' + U.fmts(d.s[1], 0) + ') = ' + U.fmts(d.w12 * d.s[0] * d.s[1], 0) +
        '$, $' + U.fmts(d.w13 * d.s[0] * d.s[2], 0) + '$ y $' + U.fmts(d.w23 * d.s[1] * d.s[2], 0) + '$.',
        'Suman $' + U.fmts(d.w12 * d.s[0] * d.s[1] + d.w13 * d.s[0] * d.s[2] + d.w23 * d.s[1] * d.s[2], 0) + '$, y con el signo menos: $E = ' + U.fmts(d.E, 0) + '$.'];
    },
    answer: function (d) { return String(d.E); }
  });

  p.exercise({
    title: 'Cuántos recuerdos caben',
    level: 'medio',
    gen: function (r) {
      var N = r.pick([64, 100, 256, 1000, 4096]);
      return { N: N, cap: Math.floor(0.138 * N), pesos: N * (N - 1) / 2 };
    },
    ask: function (d) {
      return 'Una red de Hopfield tiene $' + U.miles(d.N) + '$ neuronas. ¿Cuántos patrones puede guardar ' +
        'aproximadamente, y cuántos pesos distintos tiene? (la parte entera de $0{,}138N$)';
    },
    fields: [{ name: 'p', label: 'patrones', w: 'tiny' }, { name: 'w', label: 'pesos', w: 'tiny' }],
    sol: function (d) { return { p: d.cap, w: d.pesos }; },
    errores: [{ si: function (v, d) { return v.w === d.N * d.N; }, msg: 'Los pesos son simétricos y la diagonal es cero, así que los distintos son los pares: $N(N-1)/2$.' }],
    hint: function () { return 'Capacidad: $0{,}138N$. Pesos distintos: uno por cada par de neuronas, o sea $N(N-1)/2$.'; },
    steps: function (d) {
      return ['Capacidad: $0{,}138 \\times ' + U.miles(d.N) + ' \\approx ' + U.miles(d.cap) + '$ patrones.',
        'Pesos: $\\dfrac{' + U.miles(d.N) + ' \\times ' + U.miles(d.N - 1) + '}{2} = ' + U.miles(d.pesos) + '$.',
        'Gasta $' + U.miles(d.pesos) + '$ números para guardar $' + U.miles(d.cap) + '$ patrones de $' + U.miles(d.N) + '$ bits: como memoria, un derroche.'];
    },
    answer: function (d) { return '$' + U.miles(d.cap) + '$ patrones, $' + U.miles(d.pesos) + '$ pesos'; }
  });

  p.exercise({
    title: 'Cuánto baja la energía',
    level: 'avanzado',
    gen: function (r) {
      var h = r.nz(-6, 6);
      var s = (h > 0) ? -1 : 1;       // estado en desacuerdo con el campo: se va a voltear
      var alReves = r.bool(0.4);
      if (alReves) s = -s;            // ahora sí coincide: no se voltea
      return { h: h, s: s, voltea: s * h < 0, dE: s * h < 0 ? 2 * s * h : 0 };
    },
    ask: function (d) {
      return 'Una neurona vale $s_i = ' + U.fmts(d.s, 0) + '$ y le llega $h_i = ' + U.fmts(d.h, 0) +
        '$. ¿Se voltea, y cuánto cambia la energía?';
    },
    fields: [
      { name: 'q', label: 'La neurona', opts: [{ t: 'se voltea', v: 'si' }, { t: 'se queda igual', v: 'no' }] },
      { name: 'd', label: 'ΔE', w: 'tiny' }
    ],
    sol: function (d) { return { q: d.voltea ? 'si' : 'no', d: d.dE }; },
    errores: [{ si: function (v, d) { return d.dE !== 0 && v.d === -d.dE; }, msg: 'El signo está cambiado. Cuando la neurona se voltea, la energía <em>baja</em>: $\\Delta E$ tiene que ser negativo.' }],
    hint: function () { return 'Se voltea solo si $s_i$ y $h_i$ tienen signos distintos, es decir si $s_ih_i < 0$. Y entonces $\\Delta E = 2s_ih_i$. Si no se voltea, no cambia nada.'; },
    steps: function (d) {
      return ['$s_ih_i = (' + U.fmts(d.s, 0) + ')(' + U.fmts(d.h, 0) + ') = ' + U.fmts(d.s * d.h, 0) + '$.',
        d.voltea
          ? 'Es negativo, así que los signos no coinciden y la neurona <strong>se voltea</strong>. $\\Delta E = 2 \\times ' + U.fmts(d.s * d.h, 0) + ' = ' + U.fmts(d.dE, 0) + '$: la energía baja.'
          : 'Es positivo: la neurona ya está de acuerdo con lo que le llega, <strong>no se voltea</strong> y $\\Delta E = 0$.',
        'Como todo cambio baja la energía y los estados son finitos, la red no puede dar vueltas para siempre.'];
    },
    answer: function (d) { return (d.voltea ? 'se voltea, ΔE = ' + d.dE : 'se queda igual, ΔE = 0'); }
  });

  p.keys([
    'No hay capas ni dirección: $N$ neuronas de $\\pm1$ conectadas todas con todas, y el estado <em>es</em> la respuesta.',
    'La energía $E = -\\sum_{i<j} w_{ij}s_is_j$ solo puede bajar, porque una neurona únicamente se voltea cuando $s_ih_i < 0$ y entonces $\\Delta E = 2s_ih_i < 0$.',
    'Como los estados son finitos y la energía siempre baja, el proceso para: cae en un mínimo, que es un atractor.',
    'Los pesos no se entrenan: se escriben de una vez con la regla de Hebb, $w_{ij} = \\sum_p x_i^{(p)}x_j^{(p)}$.',
    'Caben unos $0{,}138N$ patrones; pasado eso aparecen mínimos espurios que no son ninguno de los guardados.',
    'Como memoria es un derroche —$N^2/2$ pesos para $0{,}138N$ patrones—, pero la idea que aporta, recuperar por contenido, se quedó.'
  ]);
});
