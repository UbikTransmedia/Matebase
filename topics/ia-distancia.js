/* Tema: La primera IA es una distancia */
Course.topic('ia-distancia', function (p) {

  p.puente('En [[ia-buscar|el tema anterior]] no se aprendía nada: se exploraba. Aquí se aprende lo ' +
    'mínimo imaginable, que es <em>guardar los ejemplos</em>, y aun así sale un clasificador que ' +
    'funciona. Las dos herramientas ya las tienes: de [[ge-pitagoras|Pitágoras]] viene la distancia ' +
    'entre dos puntos, y de [[pe-descriptiva|la estadística descriptiva]], la media, que es lo que ' +
    'hará de centro de un grupo.');

  p.text('Antes de las redes neuronales, y todavía hoy en muchísimos sitios, la respuesta a «¿qué es ' +
    'esto?» se da mirando <strong>a qué se parece</strong>. Parecerse es estar cerca, y estar cerca es ' +
    'una distancia. Con esa sola idea salen dos métodos que siguen en producción en todas partes: uno ' +
    'para clasificar cuando hay etiquetas y otro para agrupar cuando no las hay.');

  /* ---------------------------------------------------------------- */
  p.section('Vecinos más cercanos: el modelo que no entrena');

  p.text('Tienes ejemplos ya clasificados y llega uno nuevo. La regla es tan simple que parece una ' +
    'trampa: <strong>mira los $k$ ejemplos más parecidos y quédate con lo que diga la mayoría</strong>. ' +
    'Eso es todo. Se llama $k$ vecinos más cercanos.');

  p.formula('d(\\vec a, \\vec b) = \\sqrt{(a_1 - b_1)^2 + (a_2 - b_2)^2 + \\dots}',
    'la distancia que decide el parecido',
    'Se lee: <em>«de de a, be, es la raíz de a uno menos be uno al cuadrado, más a dos menos be dos al ' +
    'cuadrado, más…»</em>.<br><br>Es el teorema de Pitágoras, con tantos sumandos como columnas tengan ' +
    'los datos. Con dos, es la distancia del plano de siempre; con quinientas, la fórmula es la misma ' +
    'aunque ya no se pueda dibujar.<br><br>Para comparar distancias no hace falta la raíz: si ' +
    '$d_1 < d_2$, también $d_1^2 < d_2^2$. Por eso los programas suelen trabajar con el cuadrado y se ' +
    'ahorran una raíz por cada comparación.');

  p.note('Fíjate en lo que <strong>no</strong> hay aquí: no hay parámetros, no hay pérdida y no hay ' +
    'descenso de gradiente. «Entrenar» consiste literalmente en guardar los datos en una lista. Todo ' +
    'el trabajo se hace en el momento de responder, y por eso a esta familia se la llama ' +
    '<em>aprendizaje perezoso</em>.', 'ok', 'Un modelo sin parámetros');

  p.demo({
    title: 'Clasificar por los vecinos',
    intro: 'Dos clases entrelazadas. El fondo está pintado con lo que el método contestaría en cada punto, así que lo que ves es la frontera de decisión entera. Haz clic donde quieras para soltar un punto nuevo y ver a qué vecinos pregunta.',
    predice: 'Con $k = 1$ cada punto contesta como su vecino más próximo. ¿Crees que la frontera saldrá suave, o llena de recovecos alrededor de cada ejemplo?',
    build: function (host) {
      var k = 1, consulta = null;
      var D = NN.datos.lunas(U.rng(19), 60, 0.14);
      var out = W.readout(host, '');
      function vecinos(x, y) {
        var lista = D.X.map(function (q, i) {
          var dx = q[0] - x, dy = q[1] - y;
          return { i: i, d2: dx * dx + dy * dy, c: D.y[i] };
        });
        lista.sort(function (a, b) { return a.d2 - b.d2; });
        return lista.slice(0, k);
      }
      function vota(x, y) {
        var v = vecinos(x, y), unos = 0;
        v.forEach(function (q) { if (q.c === 1) unos++; });
        return { clase: unos * 2 > k ? 1 : 0, unos: unos, v: v };
      }
      var plot = W.plot(host, {
        xmin: -1.6, xmax: 2.6, ymin: -1.2, ymax: 1.7, height: 340, equal: true,
        aria: 'Dos nubes de puntos entrelazadas con el fondo coloreado según la clase que predicen los vecinos más cercanos',
        onClick: function (x, y) { consulta = [x, y]; pinta(); },
        draw: function (g) {
          var paso = 0.085, x, y;
          for (x = -1.6; x <= 2.6; x += paso) {
            for (y = -1.2; y <= 1.7; y += paso) {
              var c = vota(x, y).clase;
              g.rect(x, y, paso, paso, { color: c ? 2 : 0, fill: c ? 2 : 0, fillAlpha: 0.13, w: 0 });
            }
          }
          D.X.forEach(function (q, i) {
            g.point(q[0], q[1], { color: D.y[i] ? 2 : 0, r: 4 });
          });
          if (consulta) {
            var r = vota(consulta[0], consulta[1]);
            r.v.forEach(function (q) {
              g.seg(consulta[0], consulta[1], D.X[q.i][0], D.X[q.i][1], { color: 'ink', w: 1.4, dash: [4, 3] });
            });
            g.point(consulta[0], consulta[1], { color: 'ink', r: 7 });
            g.point(consulta[0], consulta[1], { color: r.clase ? 2 : 0, r: 4.5 });
          }
        }
      });
      function pinta() {
        var txt = 'Vecinos consultados: $k = ' + k + '$.';
        if (consulta) {
          var r = vota(consulta[0], consulta[1]);
          txt += ' En el punto marcado, ' + r.unos + ' de los ' + k + ' vecinos son de la clase naranja: ' +
            'gana la <strong style="color:var(--' + (r.clase ? 'c3' : 'c1') + ')">' + (r.clase ? 'naranja' : 'azul') + '</strong>.';
        } else {
          txt += ' Haz clic en el dibujo para soltar un punto y ver a quién le pregunta.';
        }
        txt += '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (k === 1 ? 'Con k = 1 la frontera se retuerce para rodear cada ejemplo suelto: el modelo se cree hasta el ruido.'
            : (k < 12 ? 'Al subir k la frontera se alisa: cada decisión se toma con más testigos y los puntos raros dejan de mandar.'
              : 'Con k muy grande la frontera casi desaparece: se está preguntando a tantos que siempre gana la clase más numerosa.')) +
          '</span>';
        out.set(txt);
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'número de vecinos k', min: 1, max: 25, step: 2, value: 1, dec: 0,
        on: function (v) { k = v; pinta(); }
      });
      W.buttons(host, [{ t: 'Quitar el punto', on: function () { consulta = null; pinta(); } }]);
      pinta();
    }
  });

  p.text('Mueve el mando y mira la frontera. Con $k = 1$ está llena de islas: cada ejemplo suelto, ' +
    'incluso uno mal etiquetado, se construye su propio territorio. Al subir $k$ las islas ' +
    'desaparecen y la frontera se alisa. Ese mando es, en miniatura, el dilema entre memorizar y ' +
    'generalizar que ocupa un tema entero más adelante.');

  p.note('Con $k = 1$ la frontera de decisión es exactamente un <strong>diagrama de Voronoi</strong> de ' +
    'los ejemplos: el plano queda repartido en la región de cada punto, y cada región hereda su ' +
    'etiqueta. Si has hecho el bloque de programación gráfica, es el mismo dibujo de ' +
    '[[gfx-voronoi|las células de Voronoi]], ahora clasificando en vez de decorando.',
    null, 'La frontera es un Voronoi');

  p.text('Y conviene elegir $k$ <strong>impar</strong> cuando hay dos clases, por una razón muy tonta: ' +
    'con $k$ par puede haber empate, y entonces hay que inventarse un desempate. El deslizador de ' +
    'arriba solo ofrece impares por eso.');

  p.ejemplo({
    title: 'Un voto de vecinos, a mano',
    enunciado: 'Los ejemplos son $A(1,1)$ y $B(2,2)$ de clase <em>azul</em>, y $C(4,3)$, $D(5,1)$ y $E(4,5)$ de clase <em>naranja</em>. Clasificar el punto $P(3,2)$ con $k = 1$ y con $k = 3$.',
    pasos: [
      { t: '<strong>Distancias al cuadrado.</strong> A: $(3-1)^2+(2-1)^2 = 4+1 = 5$. B: $1+0 = 1$. C: $1+1 = 2$. D: $4+1 = 5$. E: $1+9 = 10$.', antes: 'Calcula los cinco cuadrados de distancia. No hace falta la raíz: solo se van a comparar.' },
      { t: '<strong>Ordenar.</strong> De más cerca a más lejos: B (1), C (2), A (5), D (5), E (10).', antes: 'Ordena los cinco números de menor a mayor.' },
      { t: '<strong>Con $k = 1$.</strong> El vecino más próximo es B, que es azul. $P$ se clasifica como <strong>azul</strong>.', antes: '¿Cuál es el más cercano, y de qué clase es?' },
      { t: '<strong>Con $k = 3$.</strong> Los tres más próximos son B (azul), C (naranja) y A (azul). Dos azules contra un naranja: $P$ se clasifica como <strong>azul</strong> otra vez.', antes: 'Coge los tres primeros y cuenta los votos.' },
      { t: '<strong>Y si hubiera sido $k = 5$.</strong> Entrarían los cinco: dos azules y tres naranjas. Ganaría el <strong>naranja</strong>. El mismo punto, tres respuestas posibles según el $k$: por eso elegirlo importa.' }
    ],
    cierre: 'Fíjate en que A y D empatan a distancia 5. Con $k = 3$ da igual, porque ninguno de los dos entra en los tres primeros; con $k = 4$ habría que decidir cuál entra, y ahí empiezan los problemas de los $k$ pares.'
  });

  p.comprueba('Una de las columnas de tus datos está en metros y otra en milímetros. ¿Afecta eso a los vecinos más cercanos?', [
    { t: 'Mucho: la columna con números más grandes domina la distancia y las demás casi no cuentan', ok: true, por: 'La distancia suma los cuadrados de las diferencias. Una diferencia de 2000 milímetros aporta un millón; la misma diferencia en metros, 4. Sin tipificar las columnas, el método solo mira la de la escala más grande.' },
    { t: 'No: la distancia es la misma se midan como se midan', ok: false, por: 'La distancia geométrica no cambia si cambias <em>todas</em> las unidades a la vez, pero aquí cada columna lleva la suya. Cambiar una sola columna de unidad cambia qué vecinos salen más cerca.' },
    { t: 'Solo si se usa $k = 1$', ok: false, por: 'Afecta a cualquier $k$, porque afecta al orden en que se ordenan los vecinos, que es lo que usa el método sea cual sea $k$.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Agrupar sin etiquetas: k-medias');

  p.text('Cambiemos el problema. Ahora no hay etiquetas: solo una nube de datos, y la pregunta es si se ' +
    'organizan en grupos. Esto es <strong>aprendizaje no supervisado</strong>: nadie dice cuál es la ' +
    'respuesta correcta, porque no la hay.');

  p.text('El método más usado se llama $k$-medias y tiene dos pasos que se repiten hasta que nada ' +
    'cambia. Se empieza poniendo $k$ centros donde sea.');

  p.list([
    '<strong>Asignar.</strong> Cada punto se apunta al centro que tenga más cerca.',
    '<strong>Recolocar.</strong> Cada centro se mueve a la media de los puntos que se le han apuntado.'
  ], true);

  p.text('Y vuelta a empezar. Lo llamativo es que esto <strong>siempre para</strong>, y se puede ver por ' +
    'qué: hay una cantidad que ninguno de los dos pasos puede aumentar.');

  p.formula('J = \\sum_{i} \\left\\| \\vec x_i - \\vec c_{a(i)} \\right\\|^2',
    'la inercia: lo que k-medias minimiza',
    'Se lee: <em>«jota es el sumatorio, sobre los puntos, de la norma al cuadrado de equis sub i menos ' +
    'ce sub a de i»</em>, donde $a(i)$ es el centro al que está asignado el punto $i$.<br><br>Es la ' +
    'suma de las distancias al cuadrado de cada punto a <em>su</em> centro. Asignar cada punto al ' +
    'centro más cercano solo puede bajarla, porque cada punto se cambia a un sumando menor. Y ' +
    'recolocar el centro en la media también, porque [[pe-descriptiva|la media]] es justo el punto que ' +
    'minimiza la suma de cuadrados de las distancias a un conjunto. Como baja siempre y no puede bajar ' +
    'para siempre, el proceso termina.');

  p.demo({
    title: 'k-medias, paso a paso',
    intro: 'Tres grupos de puntos y unos centros colocados a propósito en mal sitio. Pulsa los pasos por separado para ver qué hace cada uno, y fíjate en que el número de abajo nunca sube. «Hasta que pare» repite hasta que ningún punto cambia de grupo.',
    predice: 'El primer paso asigna y el segundo recoloca. ¿Cuál de los dos crees que hará bajar más la inercia la primera vez, con los centros tan mal puestos?',
    build: function (host) {
      var K = 3, pasos = 0, fase = 'asignar', centros = [], asig = [], puntos = [];
      var out = W.readout(host, '');
      function inicia() {
        var r = U.rng(7), i, j;
        puntos = [];
        var focos = [[-1.6, 1.1], [1.7, 0.9], [0.1, -1.5]];
        for (j = 0; j < 3; j++) {
          for (i = 0; i < 26; i++) {
            puntos.push([focos[j][0] + r.real(-0.75, 0.75, 3) + r.real(-0.3, 0.3, 3),
                         focos[j][1] + r.real(-0.7, 0.7, 3) + r.real(-0.3, 0.3, 3)]);
          }
        }
        centros = [[-2.4, -1.7], [-2.1, -1.4], [-2.6, -1.1]];
        asig = puntos.map(function () { return 0; });
        pasos = 0; fase = 'asignar';
      }
      function asigna() {
        asig = puntos.map(function (q) {
          var mejor = 0, md = Infinity;
          centros.forEach(function (c, j) {
            var dx = q[0] - c[0], dy = q[1] - c[1], d = dx * dx + dy * dy;
            if (d < md) { md = d; mejor = j; }
          });
          return mejor;
        });
      }
      function recoloca() {
        for (var j = 0; j < K; j++) {
          var sx = 0, sy = 0, n = 0;
          puntos.forEach(function (q, i) { if (asig[i] === j) { sx += q[0]; sy += q[1]; n++; } });
          if (n) centros[j] = [sx / n, sy / n];
        }
      }
      function inercia() {
        var s = 0;
        puntos.forEach(function (q, i) {
          var c = centros[asig[i]], dx = q[0] - c[0], dy = q[1] - c[1];
          s += dx * dx + dy * dy;
        });
        return s;
      }
      inicia();
      asigna();
      var plot = W.plot(host, {
        xmin: -3, xmax: 3, ymin: -2.6, ymax: 2.4, height: 330, equal: true,
        aria: 'Una nube de puntos en tres grupos con los centros de k-medias y la asignación de cada punto',
        draw: function (g) {
          puntos.forEach(function (q, i) {
            g.seg(q[0], q[1], centros[asig[i]][0], centros[asig[i]][1], { color: asig[i], w: 0.6, alpha: 0.28 });
            g.point(q[0], q[1], { color: asig[i], r: 3.2 });
          });
          centros.forEach(function (c, j) {
            g.point(c[0], c[1], { color: j, r: 10, hollow: true });
            g.point(c[0], c[1], { color: j, r: 4 });
          });
        }
      });
      function pinta() {
        out.set('Pasos dados: ' + pasos + ' &nbsp;·&nbsp; siguiente: <strong>' +
          (fase === 'asignar' ? 'asignar cada punto a su centro más cercano' : 'mover cada centro a la media de los suyos') + '</strong><br>' +
          '<strong>Inercia $J = ' + U.fmt(inercia(), 3) + '$</strong>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)"> &nbsp;·&nbsp; suma de las distancias al cuadrado de cada punto a su centro.</span><br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Ninguno de los dos pasos puede subir este número, y por eso el método siempre acaba parando.</span>');
        plot.render();
      }
      W.buttons(host, [
        { t: 'Un paso', on: function () {
          if (fase === 'asignar') { asigna(); fase = 'recolocar'; } else { recoloca(); fase = 'asignar'; }
          pasos++; pinta();
        } },
        { t: '▶ Hasta que pare', cls: 'btn--main', on: function () {
          for (var it = 0; it < 40; it++) {
            var antes = asig.join(',');
            asigna(); recoloca(); pasos += 2;
            if (asig.join(',') === antes) break;
          }
          fase = 'asignar'; pinta();
        } },
        { t: '↺ Reiniciar', on: function () { inicia(); asigna(); pinta(); } }
      ]);
      pinta();
    }
  });

  p.note('Los centros de la demo empiezan los tres juntos en una esquina, a propósito. Con otra ' +
    'colocación inicial el método puede acabar en un reparto distinto y peor: <strong>k-medias ' +
    'encuentra un mínimo local, no el mejor reparto posible</strong>. En la práctica se ejecuta varias ' +
    'veces desde sitios distintos y se elige el resultado con menos inercia, que es el mismo truco que ' +
    'con [[av-optimizacion|el descenso de gradiente]] y sus valles.', 'warn', 'Depende de dónde empiece');

  p.text('Y hay otra decisión incómoda: el $k$ hay que decirlo <strong>antes</strong>. El método no ' +
    'descubre cuántos grupos hay; obedece. Si le pides cuatro grupos a unos datos que tienen tres, te ' +
    'partirá uno por la mitad sin avisar, y la inercia bajará igual, porque con más centros siempre ' +
    'baja.');

  p.util('La segmentación de clientes de cualquier empresa es esto: se agrupan los compradores por su ' +
    'comportamiento y se trata a cada grupo distinto. Reducir una foto a dieciséis colores también es ' +
    'k-medias, sobre los píxeles vistos como puntos del espacio de color. Y los vecinos más cercanos ' +
    'siguen siendo la primera opción en sistemas de recomendación por parecido, en identificación de ' +
    'especies a partir de medidas y como referencia con la que comparar: si un modelo complicado no le ' +
    'gana a los vecinos más cercanos, ese modelo sobra.');

  p.hist('Los vecinos más cercanos los describieron Evelyn Fix y Joseph Hodges en 1951, en un informe ' +
    'técnico para la fuerza aérea estadounidense que no llegó a publicarse como artículo; el resultado ' +
    'teórico que los hizo respetables es de Thomas Cover y Peter Hart, en 1967, y dice algo notable: ' +
    'con muchísimos datos, el método del vecino más próximo se equivoca como mucho el doble que el ' +
    'mejor clasificador posible. El algoritmo de $k$-medias lo propuso Stuart Lloyd en los Bell Labs ' +
    'en 1957, aunque no se publicó hasta 1982, y el nombre lo puso James MacQueen en 1967.');

  p.trampas([
    { e: 'No poner las columnas en la misma escala', por: 'Con una columna en milímetros y otra en metros, la primera domina la distancia. Hay que tipificar antes, y es el error más repetido con estos métodos.' },
    { e: 'Usar $k$ par con dos clases', por: 'Con $k = 4$ puede salir un empate a dos, y entonces la respuesta depende de un desempate arbitrario. Con dos clases, $k$ impar.' },
    { e: 'Creer que $k$-medias descubre cuántos grupos hay', por: 'Se le dice antes. Pedirle cuatro a unos datos de tres grupos parte uno en dos, y la inercia bajará igual: con más centros siempre baja.' },
    { e: 'Confundir $k$-medias con $k$ vecinos', por: 'Comparten la letra y nada más. Los vecinos clasifican con etiquetas; las medias agrupan sin ellas. Y el $k$ significa cosas distintas: vecinos consultados en uno, grupos buscados en el otro.' },
    { e: 'Pensar que como no entrena, es gratis', por: 'Es al revés: no cuesta nada guardar los datos, pero cada respuesta obliga a medir la distancia a todos los ejemplos. Con millones de datos, responder es lo caro.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Distancia entre dos datos',
    level: 'basico',
    gen: function (r) {
      var ter = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
      var x1 = r.int(0, 6), y1 = r.int(0, 6);
      var sx = r.sign(), sy = r.sign();
      return { x1: x1, y1: y1, x2: x1 + sx * ter[0], y2: y1 + sy * ter[1], d: ter[2], d2: ter[2] * ter[2] };
    },
    ask: function (d) {
      return 'Dos datos con dos columnas: $A(' + d.x1 + ',\\ ' + d.y1 + ')$ y $B(' + d.x2 + ',\\ ' + d.y2 +
        ')$. Calcula la distancia al cuadrado y la distancia entre ellos.';
    },
    fields: [{ name: 'c', label: 'd²', w: 'tiny' }, { name: 'd', label: 'd', w: 'tiny' }],
    sol: function (d) { return { c: d.d2, d: d.d }; },
    errores: [{ si: function (v, d) { return v.c === Math.abs(d.x2 - d.x1) + Math.abs(d.y2 - d.y1); }, msg: 'Has sumado las diferencias en vez de sumar sus cuadrados. Eso es otra distancia, la de las manzanas, y aquí se pide la de Pitágoras.' }],
    hint: function () { return 'Resta coordenada a coordenada, eleva cada diferencia al cuadrado y suma. La distancia es la raíz de eso.'; },
    steps: function (d) {
      return ['$(' + d.x2 + ' - ' + d.x1 + ')^2 + (' + d.y2 + ' - ' + d.y1 + ')^2 = ' +
        Math.pow(d.x2 - d.x1, 2) + ' + ' + Math.pow(d.y2 - d.y1, 2) + ' = ' + d.d2 + '$',
        '$d = \\sqrt{' + d.d2 + '} = ' + d.d + '$',
        'Para <em>comparar</em> vecinos basta con el cuadrado: ordena igual y ahorra la raíz.'];
    },
    answer: function (d) { return 'd² = ' + d.d2 + ', d = ' + d.d; }
  });

  p.exercise({
    title: 'El voto de los vecinos',
    level: 'basico',
    gen: function (r) {
      var orden = [], i;
      for (i = 0; i < 7; i++) orden.push(r.int(0, 1));
      var k = r.pick([1, 3, 5, 7]);
      var unos = 0;
      for (i = 0; i < k; i++) unos += orden[i];
      return { orden: orden, k: k, unos: unos, ceros: k - unos, clase: unos * 2 > k ? 'naranja' : 'azul' };
    },
    ask: function (d) {
      return 'Los siete vecinos más cercanos a un punto, <strong>ordenados de más cerca a más lejos</strong>, ' +
        'son de estas clases: ' + d.orden.map(function (c) { return c ? 'naranja' : 'azul'; }).join(', ') +
        '. ¿Qué contesta el método con $k = ' + d.k + '$?';
    },
    fields: [{ name: 'q', label: 'Clase', opts: [{ t: 'azul', v: 'azul' }, { t: 'naranja', v: 'naranja' }] }],
    sol: function (d) { return { q: d.clase }; },
    hint: function (d) { return 'Coge solo los ' + d.k + ' primeros de la lista y cuenta de cada clase. Gana la mayoría.'; },
    steps: function (d) {
      return ['Los ' + d.k + ' primeros son: ' + d.orden.slice(0, d.k).map(function (c) { return c ? 'naranja' : 'azul'; }).join(', ') + '.',
        'Azules: ' + d.ceros + ' &nbsp;·&nbsp; naranjas: ' + d.unos + '. Gana el <strong>' + d.clase + '</strong>.',
        'Con $k$ impar y dos clases nunca hay empate: por eso se elige impar.'];
    },
    answer: function (d) { return d.clase; }
  });

  p.exercise({
    title: '¿A qué centro se apunta?',
    level: 'medio',
    gen: function (r) {
      var p0 = [r.int(0, 9), r.int(0, 9)];
      var c1 = [r.int(0, 9), r.int(0, 9)], c2 = [r.int(0, 9), r.int(0, 9)];
      var d1 = Math.pow(p0[0] - c1[0], 2) + Math.pow(p0[1] - c1[1], 2);
      var d2 = Math.pow(p0[0] - c2[0], 2) + Math.pow(p0[1] - c2[1], 2);
      if (d1 === d2) return null;
      return { p: p0, c1: c1, c2: c2, d1: d1, d2: d2, cual: d1 < d2 ? '1' : '2' };
    },
    ask: function (d) {
      return 'En un paso de asignación de $k$-medias, el punto $(' + d.p.join(',\\ ') + ')$ tiene que ' +
        'elegir entre el centro $C_1(' + d.c1.join(',\\ ') + ')$ y el centro $C_2(' + d.c2.join(',\\ ') +
        ')$. Da las dos distancias al cuadrado y di a cuál se apunta.';
    },
    fields: [
      { name: 'a', label: 'd² a C₁', w: 'tiny' }, { name: 'b', label: 'd² a C₂', w: 'tiny' },
      { name: 'q', label: 'Se apunta a', opts: [{ t: 'C₁', v: '1' }, { t: 'C₂', v: '2' }] }
    ],
    sol: function (d) { return { a: d.d1, b: d.d2, q: d.cual }; },
    hint: function () { return 'Dos veces Pitágoras, sin raíz, y gana el número más pequeño.'; },
    steps: function (d) {
      return ['A $C_1$: $(' + (d.p[0] - d.c1[0]) + ')^2 + (' + (d.p[1] - d.c1[1]) + ')^2 = ' + d.d1 + '$.',
        'A $C_2$: $(' + (d.p[0] - d.c2[0]) + ')^2 + (' + (d.p[1] - d.c2[1]) + ')^2 = ' + d.d2 + '$.',
        'Menor es ' + Math.min(d.d1, d.d2) + ': se apunta a <strong>$C_' + d.cual + '$</strong>.'];
    },
    answer: function (d) { return 'C' + d.cual; }
  });

  p.exercise({
    title: 'Recolocar un centro',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([3, 4]), pts = [], i, sx = 0, sy = 0;
      for (i = 0; i < n; i++) {
        var q = [r.int(0, 12), r.int(0, 12)];
        pts.push(q); sx += q[0]; sy += q[1];
      }
      return { pts: pts, n: n, cx: sx / n, cy: sy / n };
    },
    ask: function (d) {
      return 'A un centro de $k$-medias se le han apuntado estos ' + d.n + ' puntos: $' +
        d.pts.map(function (q) { return '(' + q[0] + ',\\,' + q[1] + ')'; }).join('$, $') +
        '$. ¿Dónde se coloca el centro en el paso siguiente? (dos decimales)';
    },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }],
    sol: function (d) { return { x: U.round(d.cx, 6), y: U.round(d.cy, 6) }; },
    dec: 2,
    hint: function () { return 'El centro va a la media de los suyos: la media de las x por un lado y la de las y por otro.'; },
    steps: function (d) {
      return ['$\\overline{x} = \\dfrac{' + d.pts.map(function (q) { return q[0]; }).join(' + ') + '}{' + d.n + '} = ' + U.fmt(d.cx, 2) + '$',
        '$\\overline{y} = \\dfrac{' + d.pts.map(function (q) { return q[1]; }).join(' + ') + '}{' + d.n + '} = ' + U.fmt(d.cy, 2) + '$',
        'La media es justo el punto que minimiza la suma de distancias al cuadrado: por eso este paso nunca sube la inercia.'];
    },
    answer: function (d) { return '(' + U.fmt(d.cx, 2) + ', ' + U.fmt(d.cy, 2) + ')'; }
  });

  p.exercise({
    title: 'Vecinos o medias',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'tienes 5000 fotos ya etiquetadas como «perro» o «gato» y llega una nueva', v: 'vecinos', por: 'Hay etiquetas y hay que decidir la de un dato nuevo: es clasificar, y eso lo hacen los vecinos más cercanos.' },
        { t: 'tienes los hábitos de compra de 20 000 clientes y quieres ver si se organizan en perfiles', v: 'medias', por: 'No hay ninguna etiqueta y se busca estructura: es agrupar, y eso lo hace k-medias.' },
        { t: 'quieres reducir los colores de una imagen a dieciséis', v: 'medias', por: 'Se agrupan los píxeles en dieciséis grupos por parecido de color y cada uno se sustituye por el centro de su grupo. Es k-medias sin etiquetas.' },
        { t: 'un hospital tiene medidas de pacientes con y sin una enfermedad y quiere evaluar a uno nuevo', v: 'vecinos', por: 'Hay etiquetas (con y sin enfermedad) y un dato nuevo que clasificar: vecinos más cercanos.' },
        { t: 'tienes las posiciones de mil antenas y quieres poner cinco centros de mantenimiento bien repartidos', v: 'medias', por: 'No hay etiquetas: se busca dónde poner cinco centros que queden cerca de todo. Es exactamente lo que minimiza la inercia.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return 'Para este problema, ¿qué método de los dos del tema toca? Caso: ' + d.c.t + '.'; },
    fields: [{ name: 'q', label: 'Método', opts: [
      { t: 'k vecinos más cercanos', v: 'vecinos' },
      { t: 'k-medias', v: 'medias' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'La pregunta que lo decide es siempre la misma: ¿hay etiquetas? Si las hay, se clasifica; si no, se agrupa.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'vecinos' ? 'k vecinos' : 'k-medias'; }
  });

  p.keys([
    'Parecerse es estar cerca: con la distancia de Pitágoras salen un clasificador y un agrupador.',
    '$k$ vecinos más cercanos no tiene parámetros ni entrena: guarda los datos y vota en el momento de responder.',
    'Con $k = 1$ la frontera es el diagrama de Voronoi de los ejemplos; al subir $k$ se alisa.',
    '$k$-medias alterna asignar al centro más cercano y recolocar en la media, y para siempre porque la inercia nunca sube.',
    'La inercia baja con cualquier aumento de $k$: no sirve para decidir cuántos grupos hay, y el $k$ se dice antes.',
    'Las dos son sensibles a la escala de las columnas: hay que tipificar antes de medir distancias.'
  ]);
});
