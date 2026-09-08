/* Tema: Topología */
Course.topic('av-topologia', function (p) {

  p.text('Imagina una geometría en la que no existen las distancias, ni los ángulos, ni las áreas. ' +
    'Una geometría hecha de goma, donde puedes estirar, encoger y retorcer cuanto quieras —pero no ' +
    'romper ni pegar—. Lo que sobrevive a esas deformaciones es la <strong>topología</strong>.');

  p.note('El chiste clásico: para un topólogo, una taza y un donut son <strong>el mismo objeto</strong>. ' +
    'Los dos son un trozo de material con exactamente un agujero, y se puede deformar uno en el otro ' +
    'sin romper nada. Lo único que importa es el agujero.', 'ok', 'La taza y el donut');

  p.text('Dos figuras que se pueden deformar una en la otra se llaman <strong>homeomorfas</strong>. ' +
    'La topología clasifica las figuras por lo que se conserva en esas deformaciones: cuántas piezas ' +
    'tiene, cuántos agujeros, si tiene borde, si tiene dos caras o una sola.');

  p.demo({
    title: 'La misma figura, deformada',
    intro: 'Estira y retuerce el contorno. Por mucho que lo deformes sigue siendo una curva cerrada sin autointersecciones: para la topología, siempre una circunferencia.',
    build: function (host, d) {
      var def = 0, lobulos = 3;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -3.5, xmax: 3.5, ymin: -3, ymax: 3, height: 320,
        grid: false, axes: false,
        draw: function (g) {
          g.param(
            function (t) { return (2 + def * Math.sin(lobulos * t)) * Math.cos(t); },
            function (t) { return (2 + def * Math.sin(lobulos * t)) * Math.sin(t); },
            0, 6.2832, { color: 0, w: 3, fill: 0, fillAlpha: .15, close: true, samples: 800 });
          g.circle(0, 0, 2, { color: 'axis', w: 1.4, dash: true, stroke: true });
        }
      });
      function paint() {
        out.set('Curva deformada con ' + lobulos + ' lóbulos y amplitud $' + U.fmt(def, 2) + '$.<br>' +
          '<strong>Topológicamente sigue siendo una circunferencia</strong>: una sola pieza, ' +
          'un solo «agujero» encerrado, sin cortes ni empalmes.<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Lo que ha cambiado (longitud, área, ' +
          'curvatura) es justo lo que a la topología no le importa.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'deformación', min: 0, max: 1.2, step: 0.05, value: 0, dec: 2, on: function (v) { def = v; paint(); } });
      W.slider(row, { label: 'lóbulos', min: 2, max: 9, step: 1, value: 3, dec: 0, on: function (v) { lobulos = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El género: contar agujeros');

  p.text('El invariante más intuitivo de una superficie es su <strong>género</strong>: el número de ' +
    'agujeros. Y no es una idea vaga: se puede calcular con la fórmula que ya viste en poliedros.');

  p.formula('\\chi = C - A + V = 2 - 2g', 'característica de Euler y género');

  p.table(['Superficie', 'Género $g$', '$\\chi$'],
    [['Esfera, cubo, tetraedro…', '0', '2'],
     ['Toro (donut), taza', '1', '0'],
     ['Toro de dos agujeros', '2', '−2'],
     ['Toro de $g$ agujeros', '$g$', '$2-2g$']]);

  p.text('La <strong>característica de Euler</strong> $\\chi$ es un número que no cambia por más que ' +
    'deformes la figura ni por cómo la dividas en caras. Cualquier poliedro que puedas inflar hasta ' +
    'convertirlo en una esfera cumple $C - A + V = 2$, sea un cubo, una pirámide o un balón de fútbol. ' +
    'Es el primer <em>invariante topológico</em> de la historia.');

  p.demo({
    title: 'Euler no depende de cómo dividas',
    intro: 'Cambia el número de caras en que partes la esfera. La característica sale siempre 2.',
    build: function (host, d) {
      var poliedros = [
        { n: 'tetraedro', C: 4, V: 4, A: 6 },
        { n: 'cubo', C: 6, V: 8, A: 12 },
        { n: 'octaedro', C: 8, V: 6, A: 12 },
        { n: 'dodecaedro', C: 12, V: 20, A: 30 },
        { n: 'icosaedro', C: 20, V: 12, A: 30 },
        { n: 'prisma pentagonal', C: 7, V: 10, A: 15 },
        { n: 'pirámide hexagonal', C: 7, V: 7, A: 12 },
        { n: 'balón de fútbol', C: 32, V: 60, A: 90 },
        { n: 'toro (donut)', C: 16, V: 16, A: 32, toro: true }
      ];
      var idx = 1;
      var out = W.readout(host, '');
      var host2 = U.el('div');
      host.appendChild(host2);
      function pinta() {
        var s = poliedros[idx];
        var chi = s.C - s.A + s.V;
        U.clear(host2);
        W.barChart(host2, {
          labels: ['caras', 'aristas', 'vértices'],
          values: [s.C, s.A, s.V], height: 210, color: 0, dec: 0
        });
        out.set('<strong>' + s.n + '</strong>: $C = ' + s.C + '$, $A = ' + s.A + '$, $V = ' + s.V + '$<br>' +
          '$\\chi = C - A + V = ' + s.C + ' - ' + s.A + ' + ' + s.V + ' = ' + chi + '$<br>' +
          (chi === 2
            ? '<strong style="color:var(--ok)">χ = 2: es topológicamente una esfera.</strong>'
            : '<strong style="color:var(--c5)">χ = ' + chi + ': no es una esfera. Con $\\chi = 2-2g$ sale género ' +
              ((2 - chi) / 2) + ', o sea ' + ((2 - chi) / 2) + ' agujero(s).</strong>'));
      }
      W.chips(host, poliedros.map(function (s, i) { return { label: s.n, value: i }; }),
        { value: 1, on: function (v) { idx = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Superficies con una sola cara');

  p.text('La <strong>banda de Möbius</strong> se construye en diez segundos: coge una tira de papel, ' +
    'dale media vuelta a un extremo y pega los dos. El resultado es asombroso.');

  p.list([
    'Tiene <strong>una sola cara</strong>: si recorres la superficie con un lápiz sin levantarlo, vuelves al punto de partida habiendo pintado «los dos lados».',
    'Tiene <strong>un solo borde</strong>: una única curva cerrada.',
    'Es <strong>no orientable</strong>: si paseas una figura por ella y vuelves al inicio, aparece reflejada.',
    'Si la cortas por la mitad a lo largo, <strong>no se separa en dos</strong>: sale una única banda más larga y con dos vueltas.'
  ]);

  p.demo({
    title: 'Recorrer la banda de Möbius',
    intro: 'La banda vista de perfil, con el giro señalado. Avanza el recorrido y observa que después de una vuelta completa estás en la «otra cara» sin haber cruzado ningún borde.',
    build: function (host, d) {
      var t = 0;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -3.4, xmax: 3.4, ymin: -2.6, ymax: 2.6, height: 330,
        grid: false, axes: false,
        draw: function (g) {
          // proyeccion sencilla de la banda: dos bordes que se cruzan
          function borde(signo) {
            var pts = [];
            for (var i = 0; i <= 300; i++) {
              var u = 2 * Math.PI * i / 300;
              var v = signo * 0.5;
              var R = 2 + v * Math.cos(u / 2);
              pts.push([R * Math.cos(u), R * Math.sin(u) * 0.55 + v * Math.sin(u / 2) * 0.9]);
            }
            return pts;
          }
          g.path(borde(1), { color: 0, w: 2.4, close: true });
          g.path(borde(-1), { color: 0, w: 2.4, close: true });
          // marcador que recorre la linea central
          var u = t;
          var Rm = 2;
          var P = [Rm * Math.cos(u), Rm * Math.sin(u) * 0.55];
          g.point(P[0], P[1], { color: 2, r: 7 });
          // "normal" que se va dando la vuelta
          var nx = 0.55 * Math.cos(u / 2) * Math.cos(u);
          var ny = 0.55 * Math.sin(u / 2) * 0.9;
          g.vec(P[0], P[1], P[0] + nx, P[1] + ny, { color: 1, w: 2.6 });
        }
      });
      function paint() {
        var vueltas = t / (2 * Math.PI);
        out.set('Recorrido: <strong>' + U.fmt(vueltas * 100, 0) + ' %</strong> de una vuelta.<br>' +
          (vueltas > 0.98
            ? '<strong style="color:var(--c5)">Has vuelto al punto de partida, pero la flecha apunta al lado contrario.</strong> ' +
              'Hace falta dar <em>dos</em> vueltas para recuperar la orientación original: por eso la banda tiene una sola cara.'
            : 'Fíjate en la flecha roja: va girando lentamente mientras avanzas.'));
        plot.render();
      }
      W.slider(W.row(host), { label: 'avance', min: 0, max: 6.28, step: 0.05, value: 0, dec: 2, on: function (v) { t = v; paint(); } });
      paint();
    }
  });

  p.hist('La banda la describieron a la vez y por separado Möbius y Listing en 1858. Listing fue quien ' +
    'acuñó el término <em>topología</em>. Pero el acta de nacimiento de la disciplina es anterior: en ' +
    '1736 Euler resolvió el problema de los puentes de Königsberg demostrando que la respuesta no ' +
    'depende de distancias ni de formas, solo de las conexiones. Ese problema lo verás en el tema de grafos.');

  /* ---------------------------------------------------------------- */
  p.section('Dos teoremas con consecuencias sorprendentes');

  p.sub('Teorema del punto fijo de Brouwer');

  p.text('Toda función continua de un disco en sí mismo tiene al menos un punto que no se mueve.');

  p.note('Consecuencia práctica: si coges un mapa de España, lo arrugas como quieras y lo dejas encima ' +
    'de otro mapa idéntico sin arrugar, <strong>hay al menos un punto del mapa arrugado que está ' +
    'exactamente encima de su lugar real</strong>. Siempre. Y otra: en cualquier momento hay dos ' +
    'puntos antípodas de la Tierra con exactamente la misma temperatura y presión.',
    'ok', 'El mapa arrugado');

  p.sub('Teorema de la bola peluda');

  p.text('No se puede peinar una esfera peluda sin dejar al menos un remolino. Formalmente: no existe ' +
    'un campo vectorial continuo y no nulo sobre la esfera.');

  p.text('Por eso <strong>siempre hay al menos un punto en la Tierra donde no sopla el viento</strong>, ' +
    'y por eso todo ciclón tiene un ojo. En cambio, un toro sí se puede peinar entero: la topología ' +
    'decide qué es posible y qué no, sin hacer una sola cuenta.');

  /* ================= EJERCICIOS ================= */
  p.util('La topología parece la más abstracta y ha resultado ser de las más aplicadas. El análisis ' +
    'topológico de datos encuentra la «forma» de conjuntos enormes de información y se usa para ' +
    'clasificar tumores y detectar fraude. En robótica, el espacio de configuraciones de un brazo ' +
    'articulado es una superficie con agujeros, y planificar un movimiento es encontrar un camino en ' +
    'ella. Y el Nobel de Física de 2016 se concedió por fases topológicas de la materia, que son la ' +
    'base de una de las vías hacia el ordenador cuántico.');

  p.section('Practica');

  p.exercise({
    title: 'Característica de Euler',
    level: 'basico',
    gen: function (r) {
      // Con solo cuerpos convexos la respuesta seria SIEMPRE 2 y el ejercicio
      // no ensenaria nada tras el primer intento. Se mezclan cuerpos con
      // agujeros, que es justamente lo que el tema quiere que se descubra.
      var solidos = [
        { n: 'tetraedro', C: 4, V: 4, A: 6, g: 0 },
        { n: 'cubo', C: 6, V: 8, A: 12, g: 0 },
        { n: 'octaedro', C: 8, V: 6, A: 12, g: 0 },
        { n: 'dodecaedro', C: 12, V: 20, A: 30, g: 0 },
        { n: 'icosaedro', C: 20, V: 12, A: 30, g: 0 },
        { n: 'prisma hexagonal', C: 8, V: 12, A: 18, g: 0 },
        { n: 'pirámide cuadrangular', C: 5, V: 5, A: 8, g: 0 },
        { n: 'balón de fútbol', C: 32, V: 60, A: 90, g: 0 },
        { n: 'marco de cuadro, con su hueco central', C: 16, V: 16, A: 32, g: 1 },
        { n: 'prisma hexagonal con un agujero hexagonal de lado a lado', C: 24, V: 24, A: 48, g: 1 }
      ];
      // se sortea antes si toca un cuerpo con agujero o sin el, para que las
      // dos respuestas salgan por igual y no se pueda contestar 2 a ciegas
      var conAgujero = r.bool(0.5);
      var elegibles = solidos.filter(function (x) {
        return conAgujero ? x.g > 0 : x.g === 0;
      });
      var s = r.pick(elegibles);
      return { s: s, chi: s.C - s.A + s.V };
    },
    ask: function (d) {
      return 'Un ' + d.s.n + ' tiene $' + d.s.C + '$ caras, $' + d.s.A + '$ aristas y $' + d.s.V +
        '$ vértices. Calcula su característica de Euler $\\chi = C - A + V$.';
    },
    fields: [{ name: 'v', label: 'χ', w: 'tiny' }],
    sol: function (d) { return { v: d.chi }; },
    hint: function () {
      return 'Caras menos aristas más vértices, sin más. Cuidado con dar por hecho el resultado: ' +
        'solo vale 2 si el cuerpo se puede inflar hasta ser una esfera, y aquí no todos pueden.';
    },
    steps: function (d) {
      return ['$\\chi = C - A + V = ' + d.s.C + ' - ' + d.s.A + ' + ' + d.s.V + ' = ' + d.chi + '$',
        d.s.g === 0
          ? 'Sale $2$, como en cualquier cuerpo sin agujeros: todos son topológicamente una esfera.'
          : 'Sale $0$, no $2$. Y no es un error de cuentas: este cuerpo <strong>tiene un agujero</strong>, así que no se puede deformar hasta convertirlo en una esfera.',
        'Por $\\chi = 2 - 2g$, el género es $' + d.s.g + '$: ' +
          (d.s.g === 0 ? 'ningún agujero.' : d.s.g + ' agujero. La característica de Euler lo ha detectado sin mirar la forma, solo contando piezas.')];
    },
    answer: function (d) { return String(d.chi); }
  });

  p.exercise({
    title: 'Género de una superficie',
    level: 'medio',
    gen: function (r) {
      var g = r.int(0, 5);
      return { g: g, chi: 2 - 2 * g };
    },
    ask: function (d) {
      return 'Una superficie cerrada y orientable tiene característica de Euler $\\chi = ' + d.chi +
        '$. ¿Cuántos agujeros tiene (su género $g$)?';
    },
    fields: [{ name: 'g', label: 'Género', w: 'tiny' }],
    sol: function (d) { return { g: d.g }; },
    hint: function () { return 'Despeja $g$ de $\\chi = 2 - 2g$.'; },
    steps: function (d) {
      return ['$\\chi = 2 - 2g \\Rightarrow g = \\dfrac{2 - \\chi}{2}$',
        '$g = \\dfrac{2 - (' + d.chi + ')}{2} = ' + d.g + '$',
        d.g === 0 ? 'Género 0: es una esfera (o cualquier cosa deformable en una esfera).'
          : (d.g === 1 ? 'Género 1: es un toro, es decir un donut o una taza.'
            : 'Género ' + d.g + ': una superficie con ' + d.g + ' agujeros.')];
    },
    answer: function (d) { return 'g = ' + d.g; }
  });

  p.exercise({
    title: '¿Son homeomorfos?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { a: 'una taza con asa', b: 'un donut', ok: 1, por: 'los dos tienen exactamente un agujero' },
        { a: 'una esfera', b: 'un cubo', ok: 1, por: 'los dos tienen género 0 y se deforman uno en otro' },
        { a: 'una esfera', b: 'un donut', ok: 0, por: 'la esfera no tiene agujeros y el donut sí, y no se puede crear un agujero sin romper' },
        { a: 'la letra O', b: 'la letra D', ok: 1, por: 'las dos son una curva cerrada con un agujero' },
        { a: 'la letra O', b: 'la letra B', ok: 0, por: 'la O tiene un agujero y la B tiene dos' },
        { a: 'la letra L', b: 'la letra I', ok: 1, por: 'las dos son un trazo simple sin agujeros: basta con estirar' },
        { a: 'un vaso sin asa', b: 'un plato', ok: 1, por: 'ninguno tiene agujeros: se aplasta el vaso y sale el plato' },
        { a: 'unos pantalones', b: 'una esfera', ok: 0, por: 'los pantalones tienen agujeros (cintura y dos perneras) y la esfera no' }
      ];
      var c = r.pick(casos);
      return { a: c.a, b: c.b, ok: c.ok, por: c.por };
    },
    ask: function (d) {
      return '¿Son topológicamente equivalentes <strong>' + d.a + '</strong> y <strong>' + d.b +
        '</strong>?<br><span style="font-size:14px;color:var(--ink-faint)">Escribe <code>si</code> ' +
        'o <code>no</code>.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.ok ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe <code>si</code> o <code>no</code>.' };
      return (t === 'si') === !!d.ok;
    },
    hint: function () { return 'Cuenta los agujeros y las piezas. Se vale estirar y encoger; no se vale romper ni pegar.'; },
    steps: function (d) {
      return ['La pregunta es si uno se puede deformar en el otro sin romper ni pegar.',
        'Lo único que hay que comparar es el número de piezas y el número de agujeros.',
        (d.ok ? '<strong>Sí</strong> son homeomorfos: ' : '<strong>No</strong> lo son: ') + d.por + '.'];
    },
    answer: function (d) { return (d.ok ? 'Sí' : 'No') + ': ' + d.por + '.'; }
  });

  p.exercise({
    title: 'Propiedades de la banda de Möbius',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: '¿Cuántas caras tiene una banda de Möbius?', v: 1 },
        { t: '¿Cuántos bordes tiene una banda de Möbius?', v: 1 },
        { t: '¿Cuántas caras tiene una banda cilíndrica normal (sin giro)?', v: 2 },
        { t: '¿Cuántos bordes tiene una banda cilíndrica normal?', v: 2 },
        { t: 'Al cortar una banda de Möbius por su línea central, ¿en cuántos trozos queda?', v: 1 },
        { t: 'Al cortar una banda cilíndrica normal por su línea central, ¿en cuántos trozos queda?', v: 2 }
      ];
      var c = r.pick(casos);
      return { t: c.t, v: c.v };
    },
    ask: function (d) { return d.t; },
    fields: [{ name: 'v', label: 'Número', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    hint: function () { return 'Si puedes, hazlo con una tira de papel: es el experimento matemático más barato que existe.'; },
    steps: function (d) {
      return ['La media vuelta al pegar cambia todo: une lo que en un cilindro serían dos caras y dos bordes distintos.',
        'La banda de Möbius tiene <strong>una</strong> cara y <strong>un</strong> borde; el cilindro tiene dos de cada.',
        'Y al cortar por la mitad: el cilindro da dos anillos, pero la Möbius sigue siendo una sola pieza (más larga y con dos giros).',
        'Respuesta: <strong>' + d.v + '</strong>.'];
    },
    answer: function (d) { return String(d.v); }
  });

  p.keys([
    'La topología es geometría sin distancias: solo importa lo que sobrevive al estirar y retorcer.',
    'Homeomorfo = deformable uno en otro sin romper ni pegar. Taza y donut lo son.',
    'La característica de Euler $\\chi = C - A + V$ no cambia por más que subdividas la figura.',
    '$\\chi = 2-2g$: la característica cuenta agujeros.',
    'La banda de Möbius tiene una sola cara y un solo borde, y no es orientable.',
    'Brouwer: toda función continua del disco en sí mismo deja un punto fijo.',
    'Bola peluda: siempre hay un punto de la Tierra sin viento.'
  ]);
});
