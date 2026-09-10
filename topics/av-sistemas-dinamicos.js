/* Tema: Sistemas dinámicos y espacio de fases */
Course.topic('av-sistemas-dinamicos', function (p) {

  p.text('Un <strong>sistema dinámico</strong> es cualquier cosa que evoluciona con el tiempo según ' +
    'una regla fija: un péndulo, una población, la economía, el clima. Cuando hay <em>varias</em> ' +
    'magnitudes que se influyen entre sí, aparece una idea nueva y muy potente: el ' +
    '<strong>espacio de fases</strong>.');

  p.formula('\\begin{cases} x\' = f(x, y) \\\\ y\' = g(x, y) \\end{cases}', 'sistema de dos ecuaciones acopladas');

  p.text('En vez de dibujar $x$ y $y$ frente al tiempo, se dibuja <strong>$y$ frente a $x$</strong>. ' +
    'Cada estado posible del sistema es un punto de ese plano, y la evolución es una ' +
    '<em>trayectoria</em>. El tiempo desaparece del dibujo, y a cambio se ve de un vistazo el ' +
    'comportamiento de <strong>todos</strong> los estados iniciales a la vez.');

  p.section('Puntos de equilibrio');

  p.text('Son los estados donde el sistema se queda quieto: aquellos en que $x\' = 0$ e $y\' = 0$ a la ' +
    'vez. Lo interesante no es que existan, sino <strong>si son estables</strong>: si al apartarse un ' +
    'poco el sistema vuelve o se aleja.');

  p.list([
    '<strong>Estable (atractor)</strong>: las trayectorias cercanas se acercan. Una canica en el fondo de un cuenco.',
    '<strong>Inestable (repulsor)</strong>: se alejan. Una canica en lo alto de una loma.',
    '<strong>Punto de silla</strong>: se acercan por una dirección y se alejan por otra.',
    '<strong>Centro</strong>: las trayectorias giran alrededor sin acercarse ni alejarse.'
  ]);

  p.demo({
    title: 'Retrato de fases',
    intro: 'Las flechas dicen hacia dónde se mueve el sistema desde cada estado. Haz clic para lanzar una trayectoria y ver a dónde va a parar.',
    build: function (host, d) {
      var tipo = 'atractor';
      var pistas = [];
      var sistemas = {
        atractor: {
          f: function (x, y) { return [-x, -y]; }, t: 'x\' = -x,\\quad y\' = -y',
          txt: '<strong>Nodo estable</strong>: todo cae hacia el origen. El equilibrio atrae.'
        },
        repulsor: {
          f: function (x, y) { return [x, y]; }, t: 'x\' = x,\\quad y\' = y',
          txt: '<strong>Nodo inestable</strong>: todo huye del origen. Basta un empujón mínimo para que el sistema se dispare.'
        },
        silla: {
          f: function (x, y) { return [x, -y]; }, t: 'x\' = x,\\quad y\' = -y',
          txt: '<strong>Punto de silla</strong>: atrae por el eje vertical y repele por el horizontal. Casi todas las trayectorias acaban escapando.'
        },
        centro: {
          f: function (x, y) { return [y, -x]; }, t: 'x\' = y,\\quad y\' = -x',
          txt: '<strong>Centro</strong>: órbitas cerradas. El sistema oscila para siempre sin acercarse ni alejarse. Es el péndulo ideal sin rozamiento.'
        },
        espiral: {
          f: function (x, y) { return [y - 0.35 * x, -x - 0.35 * y]; }, t: 'x\' = y - 0{,}35x,\\quad y\' = -x - 0{,}35y',
          txt: '<strong>Foco estable</strong>: oscila mientras se acerca al equilibrio. Es el péndulo con rozamiento.'
        }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -4, xmax: 4, ymin: -4, ymax: 4, height: 360, equal: true,
        onClick: function (x, y) { pistas.push([x, y]); plot.render(); },
        draw: function (g) {
          var F = sistemas[tipo].f;
          for (var i = 0; i <= 16; i++) {
            for (var j = 0; j <= 16; j++) {
              var x = -4 + 8 * i / 16, y = -4 + 8 * j / 16;
              var v = F(x, y);
              var m = Math.hypot(v[0], v[1]);
              if (m < 1e-6) continue;
              var L = 0.28;
              g.vec(x, y, x + L * v[0] / m, y + L * v[1] / m, { color: 'axis', w: 1.2, alpha: .55 });
            }
          }
          pistas.forEach(function (P, idx) {
            var pts = [], x = P[0], y = P[1], h = 0.02;
            for (var s = 0; s < 1400; s++) {
              var v = F(x, y);
              x += h * v[0]; y += h * v[1];
              if (!isFinite(x) || Math.abs(x) > 8 || Math.abs(y) > 8) break;
              pts.push([x, y]);
            }
            g.path(pts, { color: idx % 6, w: 2.4 });
            g.point(P[0], P[1], { color: idx % 6, r: 5 });
          });
          g.point(0, 0, { color: 2, r: 6, hollow: true });
        }
      });
      function paint() {
        pistas = [];
        out.set('$' + sistemas[tipo].t + '$<br>' + sistemas[tipo].txt +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Haz clic en el plano para soltar ' +
          'el sistema desde ese estado.</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'atractor', value: 'atractor' }, { label: 'repulsor', value: 'repulsor' },
        { label: 'silla', value: 'silla' }, { label: 'centro', value: 'centro' },
        { label: 'espiral', value: 'espiral' }
      ], { value: 'atractor', on: function (v) { tipo = v; paint(); } });
      W.buttons(host, [{ t: '↺ Borrar trayectorias', on: function () { pistas = []; plot.render(); } }]);
      paint();
    }
  });

  p.note('Estos cinco retratos no son ejemplos sueltos: son <strong>toda la casuística posible</strong> ' +
    'de un sistema lineal en el plano. Y se distinguen mirando los <em>autovalores</em> de la matriz ' +
    'del sistema: reales negativos → nodo estable; reales de signo distinto → silla; complejos con ' +
    'parte real negativa → foco estable; imaginarios puros → centro. La geometría queda determinada ' +
    'por dos números.', 'ok', 'La conexión con el álgebra lineal');

  /* ---------------------------------------------------------------- */
  p.util('Distinguir un equilibrio estable de uno inestable es la pregunta central del control ' +
    'automático. Un péndulo colgando es estable y el mismo péndulo invertido no lo es, y sin embargo ' +
    'un patinete eléctrico autoequilibrado mantiene el segundo corrigiendo cien veces por segundo. ' +
    'La misma clasificación decide si un ecosistema se recupera de una perturbación, si un precio ' +
    'vuelve a su nivel tras un sobresalto o si un reactor se estabiliza solo.');

  p.section('Depredador y presa: el modelo de Lotka-Volterra');

  p.text('El ejemplo clásico de dos especies acopladas. Los conejos crecerían solos; los zorros se ' +
    'extinguirían solos. Pero se comen unos a otros:');

  p.formula('\\begin{cases} x\' = \\alpha x - \\beta x y \\\\ y\' = \\delta x y - \\gamma y \\end{cases}',
    'x = presas, y = depredadores');

  p.demo({
    title: 'Conejos y zorros',
    intro: 'Arriba, las dos poblaciones en el tiempo; abajo, la misma historia en el espacio de fases. Las oscilaciones no vienen de fuera: las genera el propio acoplamiento.',
    build: function (host, d) {
      var alfa = 1.1, beta = 0.4, gamma = 0.9, delta = 0.25;
      var x0 = 3, y0 = 2;
      var out = W.readout(host, '');
      function simular(pasos) {
        var pts = [], x = x0, y = y0, h = 0.01;
        for (var s = 0; s < pasos; s++) {
          var dx = alfa * x - beta * x * y;
          var dy = delta * x * y - gamma * y;
          x += h * dx; y += h * dy;
          if (x < 0) x = 0;
          if (y < 0) y = 0;
          pts.push([s * h, x, y]);
        }
        return pts;
      }
      var p1 = W.plot(host, {
        xmin: 0, xmax: 40, ymin: 0, ymax: 12, height: 220,
        xlabel: 'tiempo', ylabel: 'población',
        draw: function (g) {
          var pts = simular(4000);
          g.path(pts.map(function (q) { return [q[0], q[1]]; }), { color: 0, w: 2.2 });
          g.path(pts.map(function (q) { return [q[0], q[2]]; }), { color: 1, w: 2.2 });
        }
      });
      var p2 = W.plot(host, {
        xmin: 0, xmax: 12, ymin: 0, ymax: 8, height: 260,
        xlabel: 'presas', ylabel: 'depredadores',
        draw: function (g) {
          var pts = simular(4000);
          g.path(pts.map(function (q) { return [q[1], q[2]]; }), { color: 2, w: 2 });
          g.point(gamma / delta, alfa / beta, { color: 3, r: 6, label: 'equilibrio', labelDy: -14 });
          g.point(x0, y0, { color: 'ink', r: 5 });
        }
      });
      function paint() {
        out.set('Equilibrio en presas $= \\dfrac{\\gamma}{\\delta} = ' + U.fmt(gamma / delta, 3) +
          '$ y depredadores $= \\dfrac{\\alpha}{\\beta} = ' + U.fmt(alfa / beta, 3) + '$.<br>' +
          '<span style="color:var(--c1)">presas</span> · <span style="color:var(--c2)">depredadores</span> — ' +
          'en el espacio de fases la trayectoria es una <strong>órbita cerrada</strong>: el ciclo se ' +
          'repite indefinidamente.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Fíjate en el desfase: los depredadores ' +
          'alcanzan su máximo <em>después</em> que las presas, porque necesitan comer para reproducirse.</span>');
        p1.render(); p2.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'α (natalidad presas)', min: 0.4, max: 2, step: 0.1, value: 1.1, dec: 2, on: function (v) { alfa = v; paint(); } });
      W.slider(row, { label: 'β (depredación)', min: 0.1, max: 1, step: 0.05, value: 0.4, dec: 2, on: function (v) { beta = v; paint(); } });
      var row2 = W.row(host);
      W.slider(row2, { label: 'γ (mortalidad zorros)', min: 0.3, max: 2, step: 0.1, value: 0.9, dec: 2, on: function (v) { gamma = v; paint(); } });
      W.slider(row2, { label: 'presas iniciales', min: 1, max: 8, step: 0.5, value: 3, dec: 1, on: function (v) { x0 = v; paint(); } });
      paint();
    }
  });

  p.hist('Vito Volterra planteó estas ecuaciones en 1926 por una razón muy concreta: su yerno, biólogo, ' +
    'le contó que durante la Primera Guerra Mundial —cuando bajó la pesca en el Adriático— la ' +
    'proporción de tiburones capturados había <em>aumentado</em>. El modelo lo explica: al pescar ' +
    'menos, se beneficia más al depredador que a la presa. Alfred Lotka había llegado a las mismas ' +
    'ecuaciones estudiando reacciones químicas.');

  /* ================= EJERCICIOS ================= */
  p.util('Este modelo nació de un dato real y desconcertante: durante la Primera Guerra Mundial, con ' +
    'mucha menos pesca en el Adriático, la proporción de tiburones capturados subió en lugar de ' +
    'bajar. Volterra demostró que reducir la pesca beneficia más al depredador que a la presa, algo ' +
    'que ninguna intuición anticipaba. Hoy la misma matemática se usa en gestión pesquera, en ' +
    'control de plagas y, con otros nombres, en modelos de competencia entre empresas.');

  p.section('Practica');

  p.exercise({
    title: 'Punto de equilibrio',
    level: 'medio',
    gen: function (r) {
      var a = r.nz(-4, 4), b = r.nz(-4, 4), c = r.pm(1, 8), e = r.pm(1, 8);
      // x' = a x + c ,  y' = b y + e
      if (a === 0 || b === 0) return null;
      var xe = -c / a, ye = -e / b;
      if (!Number.isInteger(xe) || !Number.isInteger(ye)) return null;
      return { a: a, b: b, c: c, e: e, xe: xe, ye: ye };
    },
    ask: function (d) {
      return 'Halla el punto de equilibrio del sistema $\\begin{cases}' +
        'x\' = ' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.c, '', 0, false) + ' \\\\ ' +
        'y\' = ' + ML.termTex(d.b, 'y', 1, true) + ML.termTex(d.e, '', 0, false) + '\\end{cases}$';
    },
    fields: [{ name: 'x', label: 'x', w: 'tiny' }, { name: 'y', label: 'y', w: 'tiny' }],
    sol: function (d) { return { x: d.xe, y: d.ye }; },
    tol: 1e-6,
    hint: function () { return 'En el equilibrio nada cambia: iguala a cero las dos derivadas.'; },
    steps: function (d) {
      return ['El equilibrio exige $x\' = 0$ e $y\' = 0$ a la vez.',
        '$' + ML.termTex(d.a, 'x', 1, true) + ML.termTex(d.c, '', 0, false) + ' = 0 \\Rightarrow x = ' + d.xe + '$',
        '$' + ML.termTex(d.b, 'y', 1, true) + ML.termTex(d.e, '', 0, false) + ' = 0 \\Rightarrow y = ' + d.ye + '$',
        'Equilibrio en $(' + d.xe + ', ' + d.ye + ')$. Es estable si los coeficientes $' + d.a + '$ y $' +
        d.b + '$ son <strong>negativos</strong>: aquí ' +
        (d.a < 0 && d.b < 0 ? 'lo son, así que es un <strong>atractor</strong>.'
          : (d.a > 0 && d.b > 0 ? 'los dos son positivos: es un <strong>repulsor</strong>.'
            : 'tienen signos distintos: es un <strong>punto de silla</strong>.'))];
    },
    answer: function (d) { return '(' + d.xe + ', ' + d.ye + ')'; }
  });

  p.exercise({
    title: 'Clasifica el equilibrio',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { a: -1, b: -2, t: 1, n: 'nodo estable (atractor)' },
        { a: 2, b: 3, t: 2, n: 'nodo inestable (repulsor)' },
        { a: 1, b: -3, t: 3, n: 'punto de silla' },
        { a: -2, b: 4, t: 3, n: 'punto de silla' },
        { a: -3, b: -1, t: 1, n: 'nodo estable (atractor)' },
        { a: 4, b: 1, t: 2, n: 'nodo inestable (repulsor)' }
      ];
      var c = r.pick(casos);
      return { a: c.a, b: c.b, t: c.t, n: c.n };
    },
    ask: function (d) {
      return 'El sistema $x\' = ' + d.a + 'x$, $y\' = ' + d.b + 'y$ tiene el equilibrio en el origen. ' +
        '¿De qué tipo es?<br><span style="font-size:0.875rem;color:var(--ink-faint)">' +
        '<code>1</code> nodo estable · <code>2</code> nodo inestable · <code>3</code> punto de silla</span>';
    },
    fields: [{ name: 't', label: 'Tipo', w: 'tiny' }],
    sol: function (d) { return { t: d.t }; },
    hint: function () { return 'Mira el signo de los dos coeficientes: negativo significa que esa dirección atrae.'; },
    steps: function (d) {
      return ['En la dirección $x$: el coeficiente es $' + d.a + '$, ' +
        (d.a < 0 ? 'negativo, así que atrae.' : 'positivo, así que repele.'),
        'En la dirección $y$: el coeficiente es $' + d.b + '$, ' +
        (d.b < 0 ? 'negativo, así que atrae.' : 'positivo, así que repele.'),
        d.t === 1 ? 'Las dos atraen: <strong>nodo estable</strong>.'
          : (d.t === 2 ? 'Las dos repelen: <strong>nodo inestable</strong>.'
            : 'Una atrae y otra repele: <strong>punto de silla</strong>.')];
    },
    answer: function (d) { return d.n; }
  });

  p.exercise({
    title: 'Equilibrio de Lotka-Volterra',
    level: 'avanzado',
    gen: function (r) {
      var alfa = r.int(4, 20) / 10, beta = r.int(2, 10) / 10;
      var gamma = r.int(4, 20) / 10, delta = r.int(2, 10) / 10;
      return { alfa: alfa, beta: beta, gamma: gamma, delta: delta, xe: gamma / delta, ye: alfa / beta };
    },
    ask: function (d) {
      return 'En el modelo $x\' = ' + U.fmt(d.alfa, 1) + 'x - ' + U.fmt(d.beta, 1) + 'xy$, ' +
        '$y\' = ' + U.fmt(d.delta, 1) + 'xy - ' + U.fmt(d.gamma, 1) + 'y$, halla el punto de ' +
        'equilibrio distinto del origen (cuatro decimales).';
    },
    fields: [{ name: 'x', label: 'Presas', w: 'wide' }, { name: 'y', label: 'Depredadores', w: 'wide' }],
    sol: function (d) { return { x: U.round(d.xe, 6), y: U.round(d.ye, 6) }; },
    tol: 3e-4,
    hint: function () { return 'Saca factor común en cada ecuación: $x(\\alpha - \\beta y) = 0$ y $y(\\delta x - \\gamma) = 0$.'; },
    steps: function (d) {
      return ['Primera ecuación: $x(' + U.fmt(d.alfa, 1) + ' - ' + U.fmt(d.beta, 1) + 'y) = 0$. ' +
        'Descartando $x=0$, queda $y = \\dfrac{' + U.fmt(d.alfa, 1) + '}{' + U.fmt(d.beta, 1) + '} = ' + U.fmt(d.ye, 4) + '$.',
        'Segunda ecuación: $y(' + U.fmt(d.delta, 1) + 'x - ' + U.fmt(d.gamma, 1) + ') = 0$. ' +
        'Descartando $y=0$, queda $x = \\dfrac{' + U.fmt(d.gamma, 1) + '}{' + U.fmt(d.delta, 1) + '} = ' + U.fmt(d.xe, 4) + '$.',
        'Curiosidad: el número de <em>presas</em> en equilibrio solo depende de los parámetros del ' +
        '<em>depredador</em>, y viceversa.'];
    },
    answer: function (d) { return '(' + U.fmt(d.xe, 4) + ', ' + U.fmt(d.ye, 4) + ')'; }
  });

  p.note('Todo lo que has visto aquí sobre equilibrios estables tiene una lectura que se desarrolla en el bloque de cibernética. Un equilibrio estable no se mantiene solo: se mantiene porque hay algo que <strong>corrige las desviaciones</strong>, y a ese algo se le llama realimentación negativa. Visto así, la condición de estabilidad que aquí sale de los autovalores es exactamente la que estudió Maxwell en 1868 para averiguar por qué algunas máquinas de vapor se ponían nerviosas.', null, 'Lo que sostiene un equilibrio');

  p.keys([
    'El espacio de fases dibuja el estado del sistema, no su evolución temporal: el tiempo se esconde en la trayectoria.',
    'De un vistazo se ve el comportamiento de <strong>todos</strong> los estados iniciales.',
    'Equilibrio: donde todas las derivadas se anulan. Lo importante es si es estable.',
    'Cinco retratos posibles en el plano lineal: nodo estable, nodo inestable, silla, centro y foco.',
    'El tipo lo deciden los autovalores de la matriz del sistema.',
    'Lotka-Volterra: dos especies acopladas generan oscilaciones sin ninguna causa externa.'
  ]);
});
