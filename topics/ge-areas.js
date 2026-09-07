/* Tema: Perímetros, áreas y el número π */
Course.topic('ge-areas', function (p) {

  p.text('El <strong>perímetro</strong> es lo que mide el contorno; el <strong>área</strong>, la ' +
    'superficie que encierra. Son dos cosas independientes: se puede aumentar una sin tocar la otra.');

  p.section('Las fórmulas, y de dónde salen');

  p.text('Solo hay que entender <em>una</em>: la del rectángulo. Todas las demás se deducen de ella ' +
    'recortando y recolocando.');

  p.table(['Figura', 'Área', 'De dónde sale'],
    [['Rectángulo', '$b \\cdot h$', 'contar cuadraditos: $b$ filas de $h$'],
     ['Triángulo', '$\\dfrac{b \\cdot h}{2}$', 'es medio rectángulo'],
     ['Paralelogramo', '$b \\cdot h$', 'se recorta un triángulo y se pasa al otro lado'],
     ['Trapecio', '$\\dfrac{(B+b)\\cdot h}{2}$', 'dos trapecios iguales forman un paralelogramo'],
     ['Rombo', '$\\dfrac{D \\cdot d}{2}$', 'es medio rectángulo de lados $D$ y $d$'],
     ['Polígono regular', '$\\dfrac{P \\cdot a}{2}$', 'se parte en triángulos desde el centro']]);

  p.note('En el triángulo, la altura es la <strong>perpendicular</strong> desde un vértice al lado ' +
    'opuesto, no un lado cualquiera. En los triángulos obtusángulos incluso cae fuera de la figura. ' +
    'Confundir lado y altura es el error más común del tema.', 'warn');

  p.demo({
    title: 'Todas salen del rectángulo',
    intro: 'Cada figura se transforma en un rectángulo de la misma área. Pulsa para verlo.',
    build: function (host, d) {
      var cual = 'triangulo';
      var out = W.readout(host, '');
      var textos = {
        triangulo: 'Dos triángulos iguales forman un paralelogramo, y un paralelogramo es un rectángulo disfrazado. Por eso el área del triángulo es la mitad: $\\frac{b\\,h}{2}$.',
        paralelogramo: 'Se recorta el triángulo de la izquierda y se pega a la derecha: sale exactamente un rectángulo de base $b$ y altura $h$. Área $= b\\,h$.',
        trapecio: 'Dos trapecios iguales, uno del derecho y otro del revés, forman un paralelogramo de base $B+b$ y altura $h$. Por eso el trapecio mide $\\frac{(B+b)h}{2}$.'
      };
      var plot = W.board(host, {
        xmin: -0.7, xmax: 10, ymin: -0.9, ymax: 5, height: 300,
        grid: true, axes: false,
        draw: function (g) {
          if (cual === 'triangulo') {
            g.poly([[0, 0], [4, 0], [1.4, 3]], { color: 0, fill: 0, fillAlpha: .3, w: 2 });
            g.poly([[4, 0], [4, 3], [1.4, 3]], { color: 1, fill: 1, fillAlpha: .18, w: 1.6, dash: true });
            g.rect(0, 0, 4, 3, { color: 'axis', w: 1.4, stroke: true });
            g.seg(1.4, 0, 1.4, 3, { color: 3, w: 1.6, dash: true });
            g.text(2, -0.45, 'b = 4', { align: 'center', size: 12, color: 'ink' });
            g.text(1.15, 1.5, 'h = 3', { align: 'right', size: 12, color: 3 });
            g.text(6.5, 1.5, 'área = 4·3/2 = 6', { align: 'left', size: 14, color: 0 });
          } else if (cual === 'paralelogramo') {
            g.poly([[0, 0], [4, 0], [5.4, 3], [1.4, 3]], { color: 0, fill: 0, fillAlpha: .3, w: 2 });
            g.poly([[1.4, 3], [1.4, 0], [0, 0]], { color: 1, fill: 1, fillAlpha: .25, w: 1.6, dash: true });
            g.poly([[4, 0], [5.4, 3], [4, 3]], { color: 1, fill: 1, fillAlpha: .25, w: 1.6, dash: true });
            g.rect(1.4, 0, 4, 3, { color: 'axis', w: 1.6, stroke: true });
            g.text(3.4, -0.45, 'b = 4', { align: 'center', size: 12, color: 'ink' });
            g.text(6.5, 1.5, 'área = 4·3 = 12', { align: 'left', size: 14, color: 0 });
          } else {
            g.poly([[0, 0], [5, 0], [3.6, 3], [1.4, 3]], { color: 0, fill: 0, fillAlpha: .3, w: 2 });
            g.poly([[5, 0], [7.2, 3], [3.6, 3]], { color: 1, fill: 1, fillAlpha: .18, w: 1.6, dash: true });
            g.poly([[5, 0], [8.6, 0], [7.2, 3], [3.6, 3]], { color: 1, fill: false, w: 1.4, dash: true });
            g.text(2.5, -0.45, 'B = 5', { align: 'center', size: 12, color: 'ink' });
            g.text(2.5, 3.3, 'b = 2,2', { align: 'center', size: 12, color: 'ink' });
            g.text(9, 1.5, 'área = (5+2,2)·3/2', { align: 'right', size: 13, color: 0 });
          }
        }
      });
      W.chips(host, [
        { label: 'triángulo', value: 'triangulo' },
        { label: 'paralelogramo', value: 'paralelogramo' },
        { label: 'trapecio', value: 'trapecio' }
      ], { value: 'triangulo', on: function (v) { cual = v; out.set(textos[v]); plot.render(); } });
      out.set(textos.triangulo);
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Calcular superficies es lo que decide un presupuesto. Los metros cuadrados de una vivienda, la ' +
    'pintura que hace falta para una fachada, la tela de un toldo o la chapa de una pieza salen de ' +
    'descomponer una forma rara en triángulos y rectángulos, exactamente como aquí. Los programas de ' +
    'catastro y los de diseño hacen lo mismo, solo que con miles de triángulos por segundo.');

  p.section('La circunferencia y el número π');

  p.text('Si mides el contorno de cualquier objeto redondo y lo divides entre su diámetro, siempre ' +
    'sale el mismo número. Da igual que sea una moneda o la órbita de Júpiter. Ese número es $\\pi$.');

  p.formula('\\pi = \\frac{\\text{longitud de la circunferencia}}{\\text{diámetro}} \\approx 3{,}14159265\\dots');

  p.formulas([
    'L = 2\\pi r = \\pi d \\quad\\text{(longitud)}',
    'A = \\pi r^2 \\quad\\text{(área del círculo)}'
  ]);

  p.hist('Arquímedes (siglo III a.C.) acorraló a $\\pi$ encerrando la circunferencia entre dos ' +
    'polígonos regulares, uno inscrito y otro circunscrito, y fue duplicando lados hasta llegar a 96. ' +
    'Así demostró que $\\frac{223}{71} < \\pi < \\frac{22}{7}$, es decir, entre 3,1408 y 3,1429. ' +
    'En 1761 Lambert demostró que $\\pi$ es irracional, y en 1882 Lindemann que es <em>trascendente</em>: ' +
    'no es solución de ninguna ecuación polinómica con coeficientes enteros. Eso cerró de un plumazo ' +
    'el problema de la cuadratura del círculo, que llevaba abierto dos mil años.');

  p.demo({
    title: 'Acorralar a π como Arquímedes',
    intro: 'Aumenta el número de lados de los dos polígonos. Sus perímetros aprietan a la circunferencia por dentro y por fuera, y en medio queda π.',
    build: function (host, d) {
      var n = 6;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1.5, xmax: 1.5, ymin: -1.4, ymax: 1.4, height: 330,
        grid: false, axes: false,
        draw: function (g) {
          g.circle(0, 0, 1, { color: 0, w: 2.4, stroke: true });
          var ins = [], cir = [];
          var R = 1 / Math.cos(Math.PI / n);
          for (var i = 0; i < n; i++) {
            var a = 2 * Math.PI * i / n - Math.PI / 2;
            ins.push([Math.cos(a), Math.sin(a)]);
            cir.push([R * Math.cos(a + Math.PI / n), R * Math.sin(a + Math.PI / n)]);
          }
          g.poly(ins, { color: 2, fill: false, w: 2 });
          g.poly(cir, { color: 1, fill: false, w: 2 });
        }
      });
      function paint() {
        var pi_in = n * Math.sin(Math.PI / n);
        var pi_out = n * Math.tan(Math.PI / n);
        out.set('Con <strong>' + n + ' lados</strong>:<br>' +
          '<span style="color:var(--c3)">inscrito</span>: $' + U.fmt(pi_in, 8) + '$ &nbsp;&lt;&nbsp; ' +
          '$\\pi$ &nbsp;&lt;&nbsp; <span style="color:var(--c2)">circunscrito</span>: $' + U.fmt(pi_out, 8) + '$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Valor real: 3,14159265… · ' +
          'Horquilla de $' + U.fmt(pi_out - pi_in, 8) + '$</span>');
        plot.render();
      }
      W.slider(W.row(host), { label: 'número de lados', min: 3, max: 96, step: 1, value: 6, dec: 0, on: function (v) { n = v; paint(); } });
      W.legend(host, [{ c: 2, t: 'polígono inscrito' }, { c: 0, t: 'circunferencia' }, { c: 1, t: 'polígono circunscrito' }]);
      paint();
    }
  });

  p.sub('Sectores y coronas');

  p.text('Un <strong>sector circular</strong> es un trozo de tarta. Su área es la del círculo entero ' +
    'multiplicada por la fracción de vuelta que abarca:');

  p.formula('A_{\\text{sector}} = \\pi r^2 \\cdot \\frac{n^\\circ}{360^\\circ}');

  /* ================= EJERCICIOS ================= */
  p.util('El número $\\pi$ está en sitios donde no se le espera. Aparece en el periodo de un péndulo, en ' +
    'la fórmula de la distribución normal que gobierna los errores de medida y en cualquier fenómeno ' +
    'que oscile, porque todo lo que da vueltas o se repite acaba pasando por una circunferencia. La ' +
    'NASA calcula las trayectorias interplanetarias con quince decimales de $\\pi$: con eso, el ' +
    'error al medir la órbita de la Tierra es menor que el grosor de un cabello.');

  p.section('Practica');

  p.exercise({
    title: 'Área de una figura plana',
    level: 'basico',
    gen: function (r) {
      var t = r.int(0, 3);
      var b = r.int(3, 20), h = r.int(2, 15), B = b + r.int(2, 10), d2 = r.int(3, 16);
      if (t === 0) return { t: 0, b: b, h: h, res: b * h };
      if (t === 1) return { t: 1, b: b, h: h, res: b * h / 2 };
      if (t === 2) return { t: 2, B: B, b: b, h: h, res: (B + b) * h / 2 };
      return { t: 3, D: B, d: d2, res: B * d2 / 2 };
    },
    ask: function (d) {
      if (d.t === 0) return 'Calcula el área de un rectángulo de base $' + d.b + '$ cm y altura $' + d.h + '$ cm.';
      if (d.t === 1) return 'Calcula el área de un triángulo de base $' + d.b + '$ cm y altura $' + d.h + '$ cm.';
      if (d.t === 2) return 'Calcula el área de un trapecio de bases $' + d.B + '$ y $' + d.b + '$ cm, y altura $' + d.h + '$ cm.';
      return 'Calcula el área de un rombo cuyas diagonales miden $' + d.D + '$ y $' + d.d + '$ cm.';
    },
    fields: [{ name: 'v', label: 'Área (cm²)', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    tol: 1e-6,
    hint: function (d) {
      return ['$A = b\\cdot h$', '$A = \\frac{b\\cdot h}{2}$', '$A = \\frac{(B+b)\\cdot h}{2}$', '$A = \\frac{D\\cdot d}{2}$'][d.t];
    },
    steps: function (d) {
      if (d.t === 0) return ['$A = b \\cdot h = ' + d.b + ' \\cdot ' + d.h + ' = ' + d.res + '$ cm²'];
      if (d.t === 1) return ['$A = \\dfrac{b \\cdot h}{2} = \\dfrac{' + d.b + ' \\cdot ' + d.h + '}{2} = \\dfrac{' + (d.b * d.h) + '}{2} = ' + U.fmt(d.res, 2) + '$ cm²'];
      if (d.t === 2) return ['Sumamos las bases: $' + d.B + ' + ' + d.b + ' = ' + (d.B + d.b) + '$.',
        '$A = \\dfrac{' + (d.B + d.b) + ' \\cdot ' + d.h + '}{2} = ' + U.fmt(d.res, 2) + '$ cm²'];
      return ['$A = \\dfrac{D \\cdot d}{2} = \\dfrac{' + d.D + ' \\cdot ' + d.d + '}{2} = ' + U.fmt(d.res, 2) + '$ cm²'];
    },
    answer: function (d) { return U.fmt(d.res, 2) + ' cm²'; }
  });

  p.exercise({
    title: 'Circunferencia y círculo',
    level: 'basico',
    gen: function (r) {
      var rad = r.int(2, 25);
      var cual = r.bool();
      return { rad: rad, cual: cual, res: cual ? 2 * Math.PI * rad : Math.PI * rad * rad };
    },
    ask: function (d) {
      return 'Un círculo tiene radio $' + d.rad + '$ cm. Calcula su ' +
        (d.cual ? '<strong>longitud</strong> (perímetro) en cm' : '<strong>área</strong> en cm²') +
        ' (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.res, 4) }; },
    tol: 3e-4,
    hint: function (d) { return d.cual ? '$L = 2\\pi r$' : '$A = \\pi r^2$ — el radio va al cuadrado, no el resultado.'; },
    steps: function (d) {
      if (d.cual) return ['$L = 2\\pi r = 2\\pi \\cdot ' + d.rad + '$',
        '$= ' + (2 * d.rad) + '\\pi \\approx ' + U.fmt(d.res, 4) + '$ cm'];
      return ['$A = \\pi r^2 = \\pi \\cdot ' + d.rad + '^2 = ' + (d.rad * d.rad) + '\\pi$',
        '$\\approx ' + U.fmt(d.res, 4) + '$ cm²'];
    },
    answer: function (d) { return U.fmt(d.res, 4) + (d.cual ? ' cm' : ' cm²'); }
  });

  p.exercise({
    title: 'Sector circular',
    level: 'medio',
    gen: function (r) {
      var rad = r.int(2, 20), ang = r.pick([30, 45, 60, 90, 120, 135, 150, 180, 240, 270]);
      return { rad: rad, ang: ang, res: Math.PI * rad * rad * ang / 360 };
    },
    ask: function (d) {
      return 'Calcula el área de un sector circular de radio $' + d.rad + '$ cm y ángulo $' + d.ang +
        '^\\circ$ (cuatro decimales, en cm²).';
    },
    fields: [{ name: 'v', label: 'Área (cm²)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.res, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'El sector es la fracción $\\frac{' + d.ang + '}{360}$ del círculo entero.'; },
    steps: function (d) {
      return ['Área del círculo completo: $\\pi \\cdot ' + d.rad + '^2 = ' + U.fmt(Math.PI * d.rad * d.rad, 4) + '$ cm².',
        'El sector abarca $\\dfrac{' + d.ang + '}{360} = ' + U.fmt(d.ang / 360, 4) + '$ de la vuelta.',
        '$A = ' + U.fmt(Math.PI * d.rad * d.rad, 4) + ' \\cdot ' + U.fmt(d.ang / 360, 4) + ' = ' + U.fmt(d.res, 4) + '$ cm²'];
    },
    answer: function (d) { return U.fmt(d.res, 4) + ' cm²'; }
  });

  p.exercise({
    title: 'Figura compuesta',
    level: 'avanzado',
    gen: function (r) {
      var lado = r.int(4, 20);
      var rad = lado / 2;
      return { lado: lado, rad: rad, res: lado * lado - Math.PI * rad * rad };
    },
    ask: function (d) {
      return 'A un cuadrado de lado $' + d.lado + '$ cm le recortamos el círculo más grande que cabe ' +
        'dentro. ¿Cuánto mide el área que queda? (cuatro decimales)';
    },
    show: function (d, host) {
      W.board(host, {
        xmin: -0.6, xmax: d.lado + 0.6, ymin: -0.6, ymax: d.lado + 0.6, height: 240,
        grid: false, axes: false,
        draw: function (g) {
          g.rect(0, 0, d.lado, d.lado, { color: 0, fill: 0, fillAlpha: .28, w: 2 });
          g.circle(d.rad, d.rad, d.rad, { color: 'bg', fill: 'bg', fillAlpha: 1, w: 2, stroke: false });
          g.circle(d.rad, d.rad, d.rad, { color: 1, w: 2, stroke: true });
        }
      });
    },
    fields: [{ name: 'v', label: 'Área (cm²)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.res, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'El círculo más grande que cabe tiene diámetro igual al lado, así que su radio es $' + U.fmt(d.rad, 2) + '$.'; },
    steps: function (d) {
      return ['Área del cuadrado: $' + d.lado + '^2 = ' + (d.lado * d.lado) + '$ cm².',
        'El círculo inscrito tiene radio $\\frac{' + d.lado + '}{2} = ' + U.fmt(d.rad, 2) + '$ cm.',
        'Área del círculo: $\\pi \\cdot ' + U.fmt(d.rad, 2) + '^2 = ' + U.fmt(Math.PI * d.rad * d.rad, 4) + '$ cm².',
        'Restamos: $' + (d.lado * d.lado) + ' - ' + U.fmt(Math.PI * d.rad * d.rad, 4) + ' = ' + U.fmt(d.res, 4) + '$ cm².',
        'Curiosidad: esa área es siempre el $' + U.fmt((1 - Math.PI / 4) * 100, 2) + '\\%$ del cuadrado, mida lo que mida.'];
    },
    answer: function (d) { return U.fmt(d.res, 4) + ' cm²'; }
  });

  p.keys([
    'Perímetro y área son cosas independientes: una puede crecer sin que la otra cambie.',
    'Todas las fórmulas de área salen de la del rectángulo recortando y recolocando.',
    'La altura de un triángulo es perpendicular a la base, no un lado.',
    '$\\pi$ es el cociente entre longitud y diámetro, y vale lo mismo para toda circunferencia.',
    '$L = 2\\pi r$, &nbsp; $A = \\pi r^2$. Un sector es la fracción $\\frac{n}{360}$ del círculo.',
    'Las figuras compuestas se resuelven sumando y restando figuras conocidas.'
  ]);
});
