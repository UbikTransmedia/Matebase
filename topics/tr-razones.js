/* Tema: Razones trigonométricas */
Course.topic('tr-razones', function (p) {

  p.text('La trigonometría nace de una observación: si dos triángulos rectángulos tienen el ' +
    '<strong>mismo ángulo agudo</strong>, son semejantes, y entonces las proporciones entre sus lados ' +
    'son idénticas aunque los triángulos sean de tamaños distintos.');

  p.text('Esa proporción, que depende <em>solo del ángulo</em> y no del tamaño, es lo que llamamos ' +
    '<strong>razón trigonométrica</strong>. Hay tres principales:');

  p.formulas([
    '\\operatorname{sen}\\alpha = \\frac{\\text{cateto opuesto}}{\\text{hipotenusa}}',
    '\\cos\\alpha = \\frac{\\text{cateto contiguo}}{\\text{hipotenusa}}',
    '\\operatorname{tg}\\alpha = \\frac{\\text{cateto opuesto}}{\\text{cateto contiguo}} = \\frac{\\operatorname{sen}\\alpha}{\\cos\\alpha}'
  ], 'las tres razones');

  p.note('«Opuesto» y «contiguo» son <em>relativos al ángulo que estás mirando</em>. Si cambias de ' +
    'ángulo agudo, los catetos intercambian sus papeles. La hipotenusa, en cambio, es siempre la misma.',
    'warn', 'El punto que más confunde');

  p.hist('La trigonometría se inventó mirando al cielo. Hiparco de Nicea (siglo II a.C.) construyó la ' +
    'primera tabla de cuerdas para calcular posiciones de astros, y Ptolomeo la perfeccionó en el ' +
    '<em>Almagesto</em>. La palabra <em>seno</em> es un accidente de traducción: los indios lo llamaron ' +
    '<em>jya-ardha</em> (media cuerda), los árabes lo transcribieron como <em>jiba</em>, y al pasar al ' +
    'latín se confundió con <em>jaib</em>, que significa «bahía» o «seno». Así que decimos «seno» por ' +
    'una errata del siglo XII.');

  p.demo({
    title: 'Las razones no dependen del tamaño',
    intro: 'Cambia el ángulo y también el tamaño del triángulo. El tamaño mueve los lados, pero las tres razones no se inmutan.',
    build: function (host, d) {
      var ang = 35, esc = 4;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -1.2, xmax: 9, ymin: -1.4, ymax: 6, height: 320,
        grid: true, axes: false,
        draw: function (g) {
          var a = ang * Math.PI / 180;
          var b = esc, h = esc * Math.tan(a), hip = esc / Math.cos(a);
          g.poly([[0, 0], [b, 0], [b, h]], { color: 0, fill: 0, fillAlpha: .13, w: 2.4 });
          g.rightAngle(b, 0, Math.PI, Math.PI / 2, 0.32, { color: 'axis', w: 1.5 });
          g.arc(0, 0, 1.1, 0, a, { color: 2, w: 2 });
          g.text(1.45, 0.35, U.fmt(ang, 0) + '°', { color: 2, size: 13 });
          g.text(b / 2, -0.35, 'contiguo = ' + U.fmt(b, 2), { align: 'center', size: 12, color: 'ink' });
          g.text(b + 0.2, h / 2, 'opuesto = ' + U.fmt(h, 2), { align: 'left', size: 12, color: 'ink' });
          g.text(b / 2 - 0.5, h / 2 + 0.35, 'hipotenusa = ' + U.fmt(hip, 2),
            { align: 'center', size: 12, color: 0, box: true });
        }
      });
      function paint() {
        var a = ang * Math.PI / 180;
        out.set('$\\operatorname{sen} ' + U.fmt(ang, 0) + '^\\circ = ' + U.fmt(Math.sin(a), 4) + '$ &nbsp;·&nbsp; ' +
          '$\\cos ' + U.fmt(ang, 0) + '^\\circ = ' + U.fmt(Math.cos(a), 4) + '$ &nbsp;·&nbsp; ' +
          '$\\operatorname{tg} ' + U.fmt(ang, 0) + '^\\circ = ' + U.fmt(Math.tan(a), 4) + '$' +
          '<br><span style="font-size:12.5px;color:var(--ink-faint)">Cambia el tamaño: los lados cambian, ' +
          'estos tres números no.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'ángulo α', min: 10, max: 80, step: 1, value: ang, dec: 0, on: function (v) { ang = v; paint(); } });
      W.slider(row, { label: 'tamaño', min: 1.5, max: 6, step: 0.5, value: esc, dec: 1, on: function (v) { esc = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La relación fundamental');

  p.text('Aplica Pitágoras a un triángulo rectángulo de hipotenusa 1 y sale la identidad más usada ' +
    'de toda la trigonometría:');

  p.formula('\\operatorname{sen}^2\\alpha + \\cos^2\\alpha = 1', 'relación fundamental');

  p.text('Sirve para obtener una razón conociendo la otra, sin necesidad de saber el ángulo. Y de ' +
    'ella salen otras dos dividiendo entre $\\cos^2\\alpha$ o entre $\\operatorname{sen}^2\\alpha$.');

  p.formula('1 + \\operatorname{tg}^2\\alpha = \\frac{1}{\\cos^2\\alpha}');

  p.util('Que $\\operatorname{sen}^2\\alpha+\\cos^2\\alpha=1$ no es más que el teorema de Pitágoras en ' +
    'una circunferencia de radio 1, y por eso aparece en cuanto algo se conserva. En un péndulo, la ' +
    'energía se reparte entre cinética y potencial cambiando a cada instante, pero la suma se ' +
    'mantiene: la misma estructura. Cuando veas esa identidad, piensa «esto es Pitágoras ' +
    'disfrazado».');

  p.section('Los ángulos que hay que saberse');

  p.table(['α', '$\\operatorname{sen}\\alpha$', '$\\cos\\alpha$', '$\\operatorname{tg}\\alpha$'],
    [['$0^\\circ$', '$0$', '$1$', '$0$'],
     ['$30^\\circ$', '$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{3}}{2}$', '$\\dfrac{\\sqrt{3}}{3}$'],
     ['$45^\\circ$', '$\\dfrac{\\sqrt{2}}{2}$', '$\\dfrac{\\sqrt{2}}{2}$', '$1$'],
     ['$60^\\circ$', '$\\dfrac{\\sqrt{3}}{2}$', '$\\dfrac{1}{2}$', '$\\sqrt{3}$'],
     ['$90^\\circ$', '$1$', '$0$', 'no existe']]);

  p.text('No hay que memorizarlos a lo bruto: el de $45^\\circ$ sale de un cuadrado partido por la ' +
    'diagonal, y los de $30^\\circ$ y $60^\\circ$ de un triángulo equilátero partido por la mitad.');

  p.section('Resolver un triángulo rectángulo');

  p.text('«Resolver» un triángulo es hallar sus tres lados y sus tres ángulos. En uno rectángulo ' +
    'basta con dos datos (además del ángulo recto). La estrategia:');

  p.list([
    'Dibuja el triángulo y marca lo que sabes.',
    'Elige la razón que <strong>relaciona el dato que tienes con el que buscas</strong>.',
    'Despeja. Si la incógnita está en el denominador, multiplica en cruz.',
    'Para hallar un ángulo a partir de una razón, usa la tecla inversa: $\\arcsin$, $\\arccos$, $\\arctan$.'
  ], true);

  /* ================= EJERCICIOS ================= */
  p.util('Resolver triángulos es cómo se mide lo que no se puede alcanzar. Un topógrafo calcula la altura ' +
    'de una montaña midiendo un ángulo desde dos puntos conocidos; así se levantaron todos los mapas ' +
    'antes de los satélites, encadenando triángulos por un país entero, y así se midió por primera ' +
    'vez el Everest en 1852, con un error de pocos metros y sin pisarlo. Un carpintero que corta una ' +
    'escalera, un instalador que decide la inclinación de unas placas solares y una grúa que calcula ' +
    'su alcance hacen la misma cuenta.');

  p.section('Practica');

  p.exercise({
    title: 'Razones a partir de los lados',
    level: 'basico',
    gen: function (r) {
      var t = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
      var cual = r.int(0, 2);
      return { op: t[0], cont: t[1], hip: t[2], cual: cual };
    },
    ask: function (d) {
      var nom = ['el seno', 'el coseno', 'la tangente'][d.cual];
      return 'En un triángulo rectángulo, el cateto opuesto a $\\alpha$ mide $' + d.op +
        '$, el contiguo $' + d.cont + '$ y la hipotenusa $' + d.hip + '$. Calcula <strong>' + nom +
        '</strong> de $\\alpha$ (cuatro decimales).';
    },
    show: function (d, host) {
      W.board(host, {
        xmin: -1, xmax: d.cont + 2, ymin: -1, ymax: d.op + 1.5, height: 200,
        grid: false, axes: false,
        draw: function (g) {
          g.poly([[0, 0], [d.cont, 0], [d.cont, d.op]], { color: 0, fill: 0, fillAlpha: .12, w: 2.2 });
          g.rightAngle(d.cont, 0, Math.PI, Math.PI / 2, d.cont * 0.09, { color: 'axis', w: 1.4 });
          g.arc(0, 0, d.cont * 0.22, 0, Math.atan2(d.op, d.cont), { color: 2, w: 2 });
          g.text(d.cont * 0.32, d.op * 0.09, 'α', { color: 2, size: 14, italic: true });
          g.text(d.cont / 2, -0.4, String(d.cont), { align: 'center', size: 12, color: 'ink' });
          g.text(d.cont + 0.2, d.op / 2, String(d.op), { align: 'left', size: 12, color: 'ink' });
          g.text(d.cont / 2 - 0.3, d.op / 2 + 0.3, String(d.hip), { align: 'center', size: 12, color: 0, box: true });
        }
      });
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) {
      return { v: U.round([d.op / d.hip, d.cont / d.hip, d.op / d.cont][d.cual], 4) };
    },
    tol: 3e-4,
    hint: function (d) {
      return ['Seno = opuesto / hipotenusa.', 'Coseno = contiguo / hipotenusa.', 'Tangente = opuesto / contiguo.'][d.cual];
    },
    steps: function (d) {
      var f = [[d.op, d.hip, '\\operatorname{sen}'], [d.cont, d.hip, '\\cos'], [d.op, d.cont, '\\operatorname{tg}']][d.cual];
      return ['Aplicamos la definición: $' + f[2] + '\\alpha = \\dfrac{' + f[0] + '}{' + f[1] + '}$.',
        '$= ' + U.fmt(f[0] / f[1], 6) + '$',
        'Redondeado a cuatro decimales: $' + U.fmt(f[0] / f[1], 4) + '$.'];
    },
    answer: function (d) {
      return U.fmt([d.op / d.hip, d.cont / d.hip, d.op / d.cont][d.cual], 4);
    }
  });

  p.exercise({
    title: 'Relación fundamental',
    level: 'medio',
    gen: function (r) {
      var t = r.pick([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17], [15, 17], [7, 25], [24, 25]]);
      var dado = r.bool() ? 'sen' : 'cos';
      var val = t[0] / t[1];
      var otro = Math.sqrt(1 - val * val);
      return { dado: dado, num: t[0], den: t[1], val: val, otro: otro };
    },
    ask: function (d) {
      return 'Sabiendo que $' + (d.dado === 'sen' ? '\\operatorname{sen}' : '\\cos') + '\\alpha = \\dfrac{' +
        d.num + '}{' + d.den + '}$ y que $\\alpha$ es un ángulo <strong>agudo</strong>, calcula $' +
        (d.dado === 'sen' ? '\\cos' : '\\operatorname{sen}') + '\\alpha$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.otro, 4) }; },
    tol: 3e-4,
    hint: function () { return 'Despeja de $\\operatorname{sen}^2\\alpha + \\cos^2\\alpha = 1$. Como el ángulo es agudo, la raíz es positiva.'; },
    steps: function (d) {
      var q = d.num * d.num, dd = d.den * d.den;
      return ['$' + (d.dado === 'sen' ? '\\operatorname{sen}^2' : '\\cos^2') + '\\alpha = \\left(\\dfrac{' + d.num + '}{' + d.den + '}\\right)^2 = \\dfrac{' + q + '}{' + dd + '}$',
        'De la relación fundamental: $' + (d.dado === 'sen' ? '\\cos^2' : '\\operatorname{sen}^2') +
        '\\alpha = 1 - \\dfrac{' + q + '}{' + dd + '} = \\dfrac{' + (dd - q) + '}{' + dd + '}$',
        'Como $\\alpha$ es agudo, tomamos la raíz positiva: $\\dfrac{' + Math.round(Math.sqrt(dd - q)) + '}{' + d.den + '} = ' + U.fmt(d.otro, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.otro, 4); }
  });

  p.exercise({
    title: 'Resuelve el triángulo rectángulo',
    level: 'medio',
    gen: function (r) {
      var ang = r.pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]);
      var lado = r.int(3, 30);
      var caso = r.int(0, 1);
      var a = ang * Math.PI / 180;
      if (caso === 0) return { caso: 0, ang: ang, cont: lado, res: lado * Math.tan(a) };  // busca opuesto
      return { caso: 1, ang: ang, hip: lado, res: lado * Math.sin(a) };                    // busca opuesto
    },
    ask: function (d) {
      if (d.caso === 0) {
        return 'En un triángulo rectángulo, un ángulo agudo mide $' + d.ang + '^\\circ$ y el cateto ' +
          '<strong>contiguo</strong> a él mide $' + d.cont + '$ cm. ¿Cuánto mide el cateto opuesto? ' +
          '(dos decimales)';
      }
      return 'En un triángulo rectángulo, un ángulo agudo mide $' + d.ang + '^\\circ$ y la hipotenusa ' +
        'mide $' + d.hip + '$ cm. ¿Cuánto mide el cateto opuesto a ese ángulo? (dos decimales)';
    },
    fields: [{ name: 'v', label: 'Longitud (cm)', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.res, 2) }; },
    tol: 3e-3,
    hint: function (d) {
      return d.caso === 0 ? 'Opuesto y contiguo → tangente.' : 'Opuesto e hipotenusa → seno.';
    },
    steps: function (d) {
      if (d.caso === 0) {
        return ['Tenemos el contiguo y buscamos el opuesto: la razón que los relaciona es la tangente.',
          '$\\operatorname{tg} ' + d.ang + '^\\circ = \\dfrac{x}{' + d.cont + '}$',
          '$x = ' + d.cont + ' \\cdot \\operatorname{tg} ' + d.ang + '^\\circ = ' + d.cont + ' \\cdot ' +
          U.fmt(Math.tan(d.ang * Math.PI / 180), 4) + ' \\approx ' + U.fmt(d.res, 2) + '$ cm'];
      }
      return ['Tenemos la hipotenusa y buscamos el opuesto: la razón es el seno.',
        '$\\operatorname{sen} ' + d.ang + '^\\circ = \\dfrac{x}{' + d.hip + '}$',
        '$x = ' + d.hip + ' \\cdot \\operatorname{sen} ' + d.ang + '^\\circ \\approx ' + U.fmt(d.res, 2) + '$ cm'];
    },
    answer: function (d) { return U.fmt(d.res, 2) + ' cm'; }
  });

  p.exercise({
    title: 'Halla el ángulo',
    level: 'avanzado',
    gen: function (r) {
      var op = r.int(2, 20), cont = r.int(2, 20);
      return { op: op, cont: cont, ang: Math.atan2(op, cont) * 180 / Math.PI };
    },
    ask: function (d) {
      return 'Una rampa sube $' + d.op + '$ m de altura a lo largo de $' + d.cont + '$ m en horizontal. ' +
        '¿Qué ángulo forma con el suelo? (en grados, un decimal)';
    },
    fields: [{ name: 'a', label: 'Ángulo (°)', w: 'tiny' }],
    sol: function (d) { return { a: U.round(d.ang, 1) }; },
    tol: 3e-3,
    hint: function () { return 'Tienes opuesto y contiguo: usa la tangente y después el arco tangente.'; },
    steps: function (d) {
      return ['$\\operatorname{tg}\\alpha = \\dfrac{' + d.op + '}{' + d.cont + '} = ' + U.fmt(d.op / d.cont, 4) + '$',
        'Ahora invertimos con el arco tangente:',
        '$\\alpha = \\arctan(' + U.fmt(d.op / d.cont, 4) + ') \\approx ' + U.fmt(d.ang, 1) + '^\\circ$'];
    },
    answer: function (d) { return U.fmt(d.ang, 1) + '°'; }
  });

  p.keys([
    'Las razones dependen <strong>solo del ángulo</strong>, no del tamaño del triángulo. Ese es todo el truco.',
    'Seno = opuesto/hipotenusa, coseno = contiguo/hipotenusa, tangente = opuesto/contiguo.',
    '«Opuesto» y «contiguo» dependen de qué ángulo mires.',
    '$\\operatorname{sen}^2\\alpha+\\cos^2\\alpha=1$: Pitágoras disfrazado.',
    'Para pasar de razón a ángulo se usan las funciones inversas ($\\arcsin$, $\\arccos$, $\\arctan$).'
  ]);
});
