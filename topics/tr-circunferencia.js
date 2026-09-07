/* Tema: Circunferencia goniométrica */
Course.topic('tr-circunferencia', function (p) {

  p.text('Con el triángulo rectángulo solo se pueden definir razones de ángulos entre $0^\\circ$ y ' +
    '$90^\\circ$. Pero un ángulo puede valer $150^\\circ$, o $400^\\circ$, o $-30^\\circ$. Para eso se ' +
    'cambia de escenario: la <strong>circunferencia goniométrica</strong>, de radio 1 y centro en el origen.');

  p.text('Se coloca el ángulo con el vértice en el centro y el primer lado sobre el eje X positivo. ' +
    'El segundo lado corta a la circunferencia en un punto $P$. Y entonces, sencillamente:');

  p.formula('P = (\\cos\\alpha,\\ \\operatorname{sen}\\alpha)', 'el coseno es la x y el seno es la y');

  p.text('Es la misma definición de antes (la hipotenusa vale 1, así que $\\operatorname{sen}\\alpha = ' +
    '\\frac{y}{1} = y$), pero ahora vale para cualquier ángulo, porque $x$ e $y$ pueden ser negativas.');

  p.demo({
    title: 'La circunferencia goniométrica',
    intro: 'Arrastra el punto por la circunferencia. Abajo se va dibujando el seno: la onda es literalmente la altura del punto según gira.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.plot(host, {
        xmin: -1.6, xmax: 8.2, ymin: -1.5, ymax: 1.5, height: 300,
        xstep: 1, ystep: 0.5,
        handles: {
          P: {
            x: Math.cos(1), y: Math.sin(1), label: 'P', color: 0,
            constrain: function (h) {
              var m = Math.hypot(h.x, h.y) || 1;
              h.x /= m; h.y /= m;
            }
          }
        },
        draw: function (g) {
          var P = g.h('P');
          var a = Math.atan2(P.y, P.x);
          var ang = a < 0 ? a + 2 * Math.PI : a;

          g.circle(0, 0, 1, { color: 'axis', w: 1.6, stroke: true });
          g.arc(0, 0, 0.26, 0, ang, { color: 2, w: 2, fill: 2, fillAlpha: .2 });
          g.seg(0, 0, P.x, P.y, { color: 'ink', w: 1.6 });
          g.seg(P.x, 0, P.x, P.y, { color: 1, w: 2.6 });
          g.seg(0, 0, P.x, 0, { color: 3, w: 2.6 });
          g.text(P.x / 2, -0.12, 'cos', { align: 'center', color: 3, size: 11.5, box: true });
          g.text(P.x + 0.06, P.y / 2, 'sen', { align: 'left', color: 1, size: 11.5, box: true });

          // la onda del seno, a la derecha
          g.fn(function (x) { return Math.sin(x - 1.9); }, { from: 1.9, to: 1.9 + ang, color: 1, w: 2.4 });
          g.seg(1.9, -1.35, 1.9, 1.35, { color: 'axis', w: 1, dash: true });
          g.seg(P.x, P.y, 1.9 + ang, P.y, { color: 1, w: 1, dash: true, alpha: .5 });
          g.point(1.9 + ang, P.y, { color: 1, r: 4.5 });

          var gr = ang * 180 / Math.PI;
          var cuad = gr < 90 ? 1 : (gr < 180 ? 2 : (gr < 270 ? 3 : 4));
          out.set('$\\alpha = ' + U.fmt(gr, 1) + '^\\circ = ' + U.fmt(ang, 4) + '$ rad &nbsp;·&nbsp; ' +
            'cuadrante <strong>' + ['', 'I', 'II', 'III', 'IV'][cuad] + '</strong><br>' +
            '$\\cos\\alpha = ' + U.fmt(P.x, 4) + '$ &nbsp;·&nbsp; $\\operatorname{sen}\\alpha = ' + U.fmt(P.y, 4) + '$' +
            ' &nbsp;·&nbsp; $\\operatorname{tg}\\alpha = ' + (Math.abs(P.x) < 1e-6 ? 'no existe' : U.fmt(P.y / P.x, 4)) + '$');
        }
      });
      W.hint(host, 'Arrastra el punto azul alrededor del círculo. Da la vuelta entera.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Radianes: la unidad natural');

  p.text('Los grados son un invento babilónico (dividieron la vuelta en 360 partes porque 360 tiene ' +
    'muchísimos divisores y porque el año dura aproximadamente eso). Pero para las matemáticas hay una ' +
    'unidad mejor: el <strong>radián</strong>, el ángulo cuyo arco mide exactamente lo mismo que el radio.');

  p.formula('2\\pi \\ \\text{rad} = 360^\\circ \\qquad \\pi \\ \\text{rad} = 180^\\circ');

  p.formula('\\text{radianes} = \\text{grados}\\cdot\\frac{\\pi}{180} \\qquad \\text{grados} = \\text{radianes}\\cdot\\frac{180}{\\pi}',
    'conversión');

  p.table(['Grados', '$0^\\circ$', '$30^\\circ$', '$45^\\circ$', '$60^\\circ$', '$90^\\circ$', '$180^\\circ$', '$270^\\circ$', '$360^\\circ$'],
    [['Radianes', '$0$', '$\\dfrac{\\pi}{6}$', '$\\dfrac{\\pi}{4}$', '$\\dfrac{\\pi}{3}$', '$\\dfrac{\\pi}{2}$', '$\\pi$', '$\\dfrac{3\\pi}{2}$', '$2\\pi$']]);

  p.note('En cálculo se usan <em>siempre</em> radianes. La razón se verá en el tema de derivadas: la ' +
    'derivada del seno solo vale $\\cos x$ si $x$ está en radianes. Con grados aparecerían factores ' +
    'de conversión por todas partes.', null, 'Por qué los matemáticos no usan grados');

  /* ---------------------------------------------------------------- */
  p.util('El grado es una herencia babilónica —dividieron la vuelta en 360 partes porque su sistema ' +
    'contaba de 60 en 60—, pero el radián no es un convenio: es la medida que hace que las fórmulas ' +
    'salgan limpias. La longitud de un arco es simplemente radio por ángulo, y la derivada del seno ' +
    'es el coseno <em>solo</em> si trabajas en radianes; en grados aparece un factor feísimo. Por ' +
    'eso toda calculadora científica tiene el modo RAD y por eso conviene comprobarlo antes de un ' +
    'examen: la mitad de los resultados absurdos en trigonometría vienen de tener la calculadora en ' +
    'el modo equivocado.');

  p.hist('Los 360 grados vienen de Babilonia, que contaba en base 60 y usaba un calendario de 360 días; ' +
    'de ahí salen también los 60 minutos y los 60 segundos. El radián es muy posterior: lo propuso ' +
    'Roger Cotes hacia 1714 y el nombre no se acuñó hasta 1873, en un examen del Queen\'s College de ' +
    'Belfast. Es decir, la unidad «natural» del ángulo tardó más de tres mil años en aparecer.');

  p.section('Signos por cuadrante');

  p.text('Como el seno es la $y$ y el coseno es la $x$, sus signos son los del punto en el plano. ' +
    'No hay que memorizarlo: basta con imaginar dónde cae el punto.');

  p.table(['Cuadrante', 'Ángulos', '$\\operatorname{sen}$', '$\\cos$', '$\\operatorname{tg}$'],
    [['I', '$0^\\circ - 90^\\circ$', '$+$', '$+$', '$+$'],
     ['II', '$90^\\circ - 180^\\circ$', '$+$', '$-$', '$-$'],
     ['III', '$180^\\circ - 270^\\circ$', '$-$', '$-$', '$+$'],
     ['IV', '$270^\\circ - 360^\\circ$', '$-$', '$+$', '$-$']]);

  p.sub('Ángulos relacionados');

  p.text('Todos los ángulos se pueden reducir al primer cuadrante, porque la circunferencia es simétrica:');

  p.formulas([
    '\\operatorname{sen}(180^\\circ - \\alpha) = \\operatorname{sen}\\alpha \\qquad \\cos(180^\\circ-\\alpha) = -\\cos\\alpha',
    '\\operatorname{sen}(180^\\circ + \\alpha) = -\\operatorname{sen}\\alpha \\qquad \\cos(180^\\circ+\\alpha) = -\\cos\\alpha',
    '\\operatorname{sen}(-\\alpha) = -\\operatorname{sen}\\alpha \\qquad \\cos(-\\alpha) = \\cos\\alpha'
  ], 'reducción al primer cuadrante');

  p.text('Y como al dar una vuelta entera se vuelve al mismo punto, las razones son ' +
    '<strong>periódicas</strong>: $\\operatorname{sen}(\\alpha + 360^\\circ) = \\operatorname{sen}\\alpha$. ' +
    'Por eso sirven para describir todo lo que se repite: mareas, sonido, corriente alterna, estaciones.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'De grados a radianes',
    level: 'basico',
    gen: function (r) {
      var g = r.pick([15, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360]);
      return { g: g, rad: g * Math.PI / 180 };
    },
    ask: function (d) {
      return 'Pasa $' + d.g + '^\\circ$ a radianes. ' +
        '<span style="font-size:14px;color:var(--ink-faint)">Puedes escribirlo con <code>pi</code>, ' +
        'por ejemplo <code>3pi/4</code>.</span>';
    },
    fields: [{ name: 'v', label: 'Radianes', w: 'wide' }],
    sol: function (d) { return { v: d.rad }; },
    tol: 1e-6,
    hint: function () { return 'Multiplica por $\\dfrac{\\pi}{180}$ y simplifica la fracción.'; },
    steps: function (d) {
      var f = ML.F(d.g, 180);
      return ['$' + d.g + '^\\circ \\cdot \\dfrac{\\pi}{180}= \\dfrac{' + d.g + '\\pi}{180}$',
        'Simplificamos la fracción: $\\dfrac{' + f.n + '}{' + f.d + '}\\pi$',
        'En decimal: $' + U.fmt(d.rad, 4) + '$ rad'];
    },
    answer: function (d) {
      var f = ML.F(d.g, 180);
      return '$' + (f.d === 1 ? f.n + '\\pi' : '\\frac{' + f.n + '\\pi}{' + f.d + '}') + ' \\approx ' + U.fmt(d.rad, 4) + '$';
    }
  });

  p.exercise({
    title: 'Signo de la razón',
    level: 'basico',
    gen: function (r) {
      var g = r.int(1, 359);
      var razon = r.pick(['sen', 'cos', 'tg']);
      var a = g * Math.PI / 180;
      var v = razon === 'sen' ? Math.sin(a) : (razon === 'cos' ? Math.cos(a) : Math.tan(a));
      if (Math.abs(v) < 1e-6) return null;
      return { g: g, razon: razon, pos: v > 0 };
    },
    ask: function (d) {
      var nom = { sen: '\\operatorname{sen}', cos: '\\cos', tg: '\\operatorname{tg}' }[d.razon];
      return '¿Qué signo tiene $' + nom + ' ' + d.g + '^\\circ$? Escribe <code>+</code> o <code>-</code>.';
    },
    fields: [{ name: 's', label: 'Signo', w: 'tiny', ph: '+ o -' }],
    sol: function (d) { return { s: d.pos ? '+' : '-' }; },
    check: function (v, d) {
      var t = v.raw.s.trim();
      if (t !== '+' && t !== '-') return { ok: false, msg: 'Escribe solo <code>+</code> o <code>-</code>.' };
      return (t === '+') === d.pos;
    },
    hint: function (d) {
      var c = d.g < 90 ? 1 : (d.g < 180 ? 2 : (d.g < 270 ? 3 : 4));
      return 'El ángulo está en el cuadrante ' + ['', 'I', 'II', 'III', 'IV'][c] +
        '. Piensa dónde cae el punto: ¿su $x$ y su $y$ son positivas o negativas?';
    },
    steps: function (d) {
      var c = d.g < 90 ? 1 : (d.g < 180 ? 2 : (d.g < 270 ? 3 : 4));
      var expl = {
        sen: 'El seno es la coordenada $y$ del punto.',
        cos: 'El coseno es la coordenada $x$ del punto.',
        tg: 'La tangente es $y/x$: es positiva cuando $x$ e $y$ tienen el mismo signo.'
      }[d.razon];
      return ['$' + d.g + '^\\circ$ cae en el cuadrante <strong>' + ['', 'I', 'II', 'III', 'IV'][c] + '</strong>.',
        expl,
        'En ese cuadrante el resultado es <strong>' + (d.pos ? 'positivo' : 'negativo') + '</strong>.'];
    },
    answer: function (d) { return d.pos ? 'Positivo (+)' : 'Negativo (−)'; }
  });

  p.exercise({
    title: 'Reduce al primer cuadrante',
    level: 'medio',
    gen: function (r) {
      var base = r.pick([30, 45, 60]);
      var cuad = r.int(2, 4);
      var g = cuad === 2 ? 180 - base : (cuad === 3 ? 180 + base : 360 - base);
      var razon = r.bool() ? 'sen' : 'cos';
      var a = g * Math.PI / 180;
      return {
        g: g, base: base, cuad: cuad, razon: razon,
        val: razon === 'sen' ? Math.sin(a) : Math.cos(a)
      };
    },
    ask: function (d) {
      var nom = d.razon === 'sen' ? '\\operatorname{sen}' : '\\cos';
      return 'Calcula $' + nom + ' ' + d.g + '^\\circ$ reduciéndolo al primer cuadrante ' +
        '(cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.val, 4) }; },
    tol: 3e-4,
    hint: function (d) {
      return 'Su ángulo asociado del primer cuadrante es $' + d.base + '^\\circ$. Solo falta decidir el signo.';
    },
    steps: function (d) {
      var nom = d.razon === 'sen' ? '\\operatorname{sen}' : '\\cos';
      var rel = d.cuad === 2 ? '180^\\circ - ' + d.base : (d.cuad === 3 ? '180^\\circ + ' + d.base : '360^\\circ - ' + d.base);
      var base = d.razon === 'sen' ? Math.sin(d.base * Math.PI / 180) : Math.cos(d.base * Math.PI / 180);
      return ['$' + d.g + '^\\circ = ' + rel + '^\\circ$, así que su ángulo asociado es $' + d.base + '^\\circ$.',
        '$' + nom + ' ' + d.base + '^\\circ = ' + U.fmt(base, 4) + '$',
        'En el cuadrante ' + ['', 'I', 'II', 'III', 'IV'][d.cuad] + ', el ' +
        (d.razon === 'sen' ? 'seno' : 'coseno') + ' es <strong>' + (d.val > 0 ? 'positivo' : 'negativo') + '</strong>.',
        'Resultado: $' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Ángulos coterminales',
    level: 'medio',
    gen: function (r) {
      var base = r.int(0, 359);
      var vueltas = r.pick([-2, -1, 1, 2, 3]);
      return { g: base + 360 * vueltas, base: base };
    },
    ask: function (d) {
      return 'Halla el ángulo entre $0^\\circ$ y $360^\\circ$ que tiene las mismas razones ' +
        'trigonométricas que $' + d.g + '^\\circ$.';
    },
    fields: [{ name: 'v', label: 'Ángulo (°)', w: 'tiny' }],
    sol: function (d) { return { v: d.base }; },
    hint: function () { return 'Suma o resta vueltas completas de $360^\\circ$ hasta caer en el intervalo.'; },
    steps: function (d) {
      var n = Math.round((d.g - d.base) / 360);
      return ['Dar una vuelta entera no cambia el punto de la circunferencia.',
        'Restamos (o sumamos) $360^\\circ$ tantas veces como haga falta: aquí, ' + Math.abs(n) + ' ' +
        U.plural(Math.abs(n), 'vuelta', 'vueltas') + '.',
        '$' + d.g + '^\\circ - ' + (n * 360) + '^\\circ = ' + d.base + '^\\circ$'];
    },
    answer: function (d) { return d.base + '°'; }
  });

  p.keys([
    'En la circunferencia de radio 1: $P = (\\cos\\alpha, \\operatorname{sen}\\alpha)$.',
    'Coseno = coordenada x, seno = coordenada y. De ahí salen todos los signos.',
    '$\\pi$ rad $= 180^\\circ$. En cálculo se usan siempre radianes.',
    'Cualquier ángulo se reduce al primer cuadrante por simetría.',
    'Las razones son periódicas de $360^\\circ$: por eso describen todo lo que se repite.'
  ]);
});
