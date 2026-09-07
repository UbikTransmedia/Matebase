/* Tema: Ángulos, rectas y triángulos */
Course.topic('ge-angulos', function (p) {

  p.text('La geometría empieza con tres cosas que no se definen porque son el punto de partida: el ' +
    '<strong>punto</strong>, la <strong>recta</strong> y el <strong>plano</strong>. Todo lo demás se ' +
    'construye a partir de ellas.');

  p.text('Un <strong>ángulo</strong> es la región del plano entre dos semirrectas que salen del mismo ' +
    'punto. Se mide en grados: la vuelta completa son $360^\\circ$, herencia babilónica.');

  p.table(['Nombre', 'Medida', ''],
    [['Agudo', 'menos de $90^\\circ$', ''],
     ['Recto', 'exactamente $90^\\circ$', 'las rectas son perpendiculares'],
     ['Obtuso', 'entre $90^\\circ$ y $180^\\circ$', ''],
     ['Llano', 'exactamente $180^\\circ$', 'las semirrectas forman una recta'],
     ['Completo', '$360^\\circ$', 'la vuelta entera']]);

  p.sub('Parejas de ángulos con nombre');

  p.list([
    '<strong>Complementarios</strong>: suman $90^\\circ$.',
    '<strong>Suplementarios</strong>: suman $180^\\circ$.',
    '<strong>Opuestos por el vértice</strong>: los que quedan enfrentados al cruzarse dos rectas. Son <em>iguales</em>.'
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Dos paralelas cortadas por una secante');

  p.text('Esta configuración aparece constantemente. Al cortar dos rectas paralelas con una tercera ' +
    'se forman ocho ángulos, pero solo hay <strong>dos valores distintos</strong>, y además son ' +
    'suplementarios entre sí.');

  p.demo({
    title: 'Los ocho ángulos que solo son dos',
    intro: 'Gira la secante y separa las paralelas. Los ángulos verdes son todos iguales entre sí, y los naranjas también. Cada verde y cada naranja suman 180°.',
    build: function (host, d) {
      var ang = 55, sep = 2.2;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -6, xmax: 6, ymin: -4, ymax: 4, height: 340,
        grid: false, axes: false,
        draw: function (g) {
          var a = ang * Math.PI / 180;
          var m = Math.tan(a);
          // paralelas horizontales
          g.seg(-6, sep / 2, 6, sep / 2, { color: 'axis', w: 2 });
          g.seg(-6, -sep / 2, 6, -sep / 2, { color: 'axis', w: 2 });
          // secante
          var t = 6 / Math.abs(m || 0.01);
          g.seg(-Math.min(6, t), -Math.min(6, t) * m, Math.min(6, t), Math.min(6, t) * m,
            { color: 0, w: 2.4 });
          // cortes
          var y1 = sep / 2, y2 = -sep / 2;
          var x1 = y1 / m, x2 = y2 / m;
          [[x1, y1], [x2, y2]].forEach(function (P) {
            g.point(P[0], P[1], { color: 'ink', r: 4 });
            // cuatro angulos en cada corte
            g.arc(P[0], P[1], 0.62, 0, a, { color: 2, w: 2.2, fill: 2, fillAlpha: .2 });
            g.arc(P[0], P[1], 0.62, a, Math.PI, { color: 3, w: 2.2, fill: 3, fillAlpha: .2 });
            g.arc(P[0], P[1], 0.62, Math.PI, Math.PI + a, { color: 2, w: 2.2, fill: 2, fillAlpha: .2 });
            g.arc(P[0], P[1], 0.62, Math.PI + a, 2 * Math.PI, { color: 3, w: 2.2, fill: 3, fillAlpha: .2 });
          });
        }
      });
      function paint() {
        out.set('Ángulo <span style="color:var(--c3)">verde</span>: $' + ang + '^\\circ$ &nbsp;·&nbsp; ' +
          'ángulo <span style="color:var(--c4)">naranja</span>: $' + (180 - ang) + '^\\circ$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">Los cuatro verdes son iguales ' +
          '(correspondientes y alternos); cada verde con cada naranja suma $180^\\circ$. ' +
          'Separar las paralelas no cambia ningún ángulo.</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'inclinación de la secante', min: 20, max: 160, step: 5, value: ang, dec: 0, on: function (v) { ang = v; paint(); } });
      W.slider(row, { label: 'separación', min: 1, max: 5, step: 0.5, value: sep, dec: 1, on: function (v) { sep = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Con estos ángulos midió Eratóstenes la Tierra hacia el año 240 a. C. Sabía que a mediodía del ' +
    'solsticio el Sol caía a plomo en Asuán, y midió que en Alejandría formaba un ángulo de unos 7°. ' +
    'Suponiendo los rayos paralelos, ese ángulo es el mismo que separa las dos ciudades vistas desde ' +
    'el centro, es decir, la cincuentava parte de una vuelta. Multiplicó la distancia entre ambas ' +
    'por 50 y acertó el tamaño del planeta con un error de pocos puntos porcentuales, sin salir de ' +
    'Egipto.');

  p.section('Los ángulos de un triángulo');

  p.formula('A + B + C = 180^\\circ', 'suma de los ángulos de cualquier triángulo');

  p.text('Y esto no es una casualidad comprobada en unos cuantos triángulos: se <em>demuestra</em> ' +
    'con lo que acabas de ver. Traza por un vértice una paralela al lado opuesto. Los tres ángulos ' +
    'del triángulo se reagrupan sobre esa recta formando un ángulo llano. Fin de la demostración.');

  p.demo({
    title: 'Los tres ángulos siempre suman 180°',
    intro: 'Arrastra los vértices y comprueba que la suma no se mueve, por raro que sea el triángulo.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -6, xmax: 6, ymin: -4, ymax: 4.5, height: 340,
        grid: true, axes: false,
        handles: {
          A: { x: -3, y: -2, label: 'A', color: 0, constrain: snap },
          B: { x: 3.5, y: -2, label: 'B', color: 1, constrain: snap },
          C: { x: 0, y: 2.5, label: 'C', color: 2, constrain: snap }
        },
        draw: function (g) {
          var A = g.h('A'), B = g.h('B'), C = g.h('C');
          g.poly([[A.x, A.y], [B.x, B.y], [C.x, C.y]], { color: 'ink', fill: 0, fillAlpha: .1, w: 2.2 });
          var angs = [];
          [[A, B, C, 0], [B, C, A, 1], [C, A, B, 2]].forEach(function (t) {
            var V = t[0], P = t[1], Q = t[2];
            var a1 = Math.atan2(P.y - V.y, P.x - V.x);
            var a2 = Math.atan2(Q.y - V.y, Q.x - V.x);
            var diff = a2 - a1;
            while (diff <= -Math.PI) diff += 2 * Math.PI;
            while (diff > Math.PI) diff -= 2 * Math.PI;
            g.arc(V.x, V.y, 0.7, a1, a1 + diff, { color: t[3], w: 2, fill: t[3], fillAlpha: .22 });
            var med = a1 + diff / 2;
            var gr = Math.abs(diff) * 180 / Math.PI;
            angs.push(gr);
            g.text(V.x + 1.1 * Math.cos(med), V.y + 1.1 * Math.sin(med), U.fmt(gr, 1) + '°',
              { align: 'center', color: t[3], size: 12, box: true });
          });
          out.set('$A = ' + U.fmt(angs[0], 1) + '^\\circ$, &nbsp; $B = ' + U.fmt(angs[1], 1) +
            '^\\circ$, &nbsp; $C = ' + U.fmt(angs[2], 1) + '^\\circ$<br>' +
            '<strong>Suma: $' + U.fmt(angs[0] + angs[1] + angs[2], 1) + '^\\circ$</strong>');
        }
      });
      function snap(h) { h.x = Math.round(h.x * 2) / 2; h.y = Math.round(h.y * 2) / 2; }
    }
  });

  p.sub('Clasificar triángulos');

  p.table(['Por sus lados', '', 'Por sus ángulos', ''],
    [['Equilátero', 'tres lados iguales', 'Acutángulo', 'los tres ángulos agudos'],
     ['Isósceles', 'dos lados iguales', 'Rectángulo', 'uno recto'],
     ['Escaleno', 'todos distintos', 'Obtusángulo', 'uno obtuso']]);

  p.note('Un triángulo solo existe si <strong>cada lado es menor que la suma de los otros dos</strong>. ' +
    'Es la <em>desigualdad triangular</em>: con palos de 2, 3 y 9 cm no se puede montar ningún ' +
    'triángulo, porque $2+3 < 9$.', null, 'Cuándo se puede construir');

  /* ---------------------------------------------------------------- */
  p.section('Polígonos');

  p.text('La suma de los ángulos interiores de un polígono sale de partirlo en triángulos desde un ' +
    'vértice: un polígono de $n$ lados se parte en $n-2$ triángulos.');

  p.formulas([
    'S_n = (n-2)\\cdot 180^\\circ',
    '\\text{regular:}\\quad \\text{cada ángulo} = \\frac{(n-2)\\cdot 180^\\circ}{n}'
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('Que solo el triángulo, el cuadrado y el hexágono llenen el plano sin dejar huecos no es una ' +
    'curiosidad: es la razón de que las baldosas, los panales y las mallas metálicas tengan las ' +
    'formas que tienen. Las abejas eligieron el hexágono porque es el que encierra más superficie ' +
    'con menos cera, y los ingenieros lo copian en los paneles de nido de abeja de los aviones, que ' +
    'aguantan mucho pesando poquísimo.');

  p.section('Practica');

  p.exercise({
    title: 'El tercer ángulo',
    level: 'basico',
    gen: function (r) {
      var a = r.int(20, 100), b = r.int(20, 170 - a);
      return { a: a, b: b, c: 180 - a - b };
    },
    ask: function (d) {
      return 'Dos ángulos de un triángulo miden $' + d.a + '^\\circ$ y $' + d.b + '^\\circ$. ' +
        '¿Cuánto mide el tercero?';
    },
    fields: [{ name: 'c', label: 'Ángulo (°)', w: 'tiny' }],
    sol: function (d) { return { c: d.c }; },
    hint: function () { return 'Los tres tienen que sumar $180^\\circ$.'; },
    steps: function (d) {
      return ['$A + B + C = 180^\\circ$',
        '$' + d.a + ' + ' + d.b + ' + C = 180$',
        '$C = 180 - ' + (d.a + d.b) + ' = ' + d.c + '^\\circ$',
        'El triángulo es ' + (d.c === 90 || d.a === 90 || d.b === 90 ? 'rectángulo'
          : (Math.max(d.a, d.b, d.c) > 90 ? 'obtusángulo' : 'acutángulo')) + '.'];
    },
    answer: function (d) { return d.c + '°'; }
  });

  p.exercise({
    title: 'Paralelas cortadas por una secante',
    level: 'medio',
    gen: function (r) {
      var a = r.int(25, 155);
      if (a === 90) return null;
      var tipo = r.int(0, 2);
      return { a: a, tipo: tipo, res: tipo === 0 ? a : (tipo === 1 ? a : 180 - a) };
    },
    ask: function (d) {
      var nom = ['<strong>correspondiente</strong>', '<strong>alterno interno</strong>',
        '<strong>conjugado</strong> (del mismo lado de la secante)'][d.tipo];
      return 'Dos rectas paralelas son cortadas por una secante. Uno de los ángulos mide $' + d.a +
        '^\\circ$. ¿Cuánto mide su ángulo ' + nom + '?';
    },
    fields: [{ name: 'v', label: 'Ángulo (°)', w: 'tiny' }],
    sol: function (d) { return { v: d.res }; },
    hint: function (d) {
      return d.tipo === 2 ? 'Los conjugados son suplementarios: suman $180^\\circ$.'
        : 'Correspondientes y alternos internos son <em>iguales</em>.';
    },
    steps: function (d) {
      if (d.tipo === 2) return ['Los ángulos conjugados están al mismo lado de la secante, uno dentro y otro fuera.',
        'Son suplementarios: suman $180^\\circ$.',
        '$180 - ' + d.a + ' = ' + d.res + '^\\circ$'];
      return ['Al cortar dos paralelas solo hay dos valores de ángulo distintos.',
        'Los correspondientes y los alternos internos son iguales entre sí.',
        'Por tanto mide también $' + d.res + '^\\circ$.'];
    },
    answer: function (d) { return d.res + '°'; }
  });

  p.exercise({
    title: 'Ángulos de un polígono regular',
    level: 'medio',
    gen: function (r) {
      var n = r.int(3, 20);
      return { n: n, suma: (n - 2) * 180, cada: (n - 2) * 180 / n };
    },
    ask: function (d) {
      var nombres = { 3: 'triángulo', 4: 'cuadrado', 5: 'pentágono', 6: 'hexágono', 7: 'heptágono', 8: 'octógono', 9: 'eneágono', 10: 'decágono', 12: 'dodecágono' };
      var nom = nombres[d.n] || ('polígono de ' + d.n + ' lados');
      return 'En un ' + nom + ' <strong>regular</strong>, ¿cuánto suman todos sus ángulos interiores ' +
        'y cuánto mide cada uno? (dos decimales)';
    },
    fields: [{ name: 's', label: 'Suma (°)', w: 'tiny' }, { name: 'c', label: 'Cada uno (°)', w: 'tiny' }],
    sol: function (d) { return { s: d.suma, c: U.round(d.cada, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'Se parte en $' + d.n + ' - 2 = ' + (d.n - 2) + '$ triángulos desde un vértice.'; },
    steps: function (d) {
      return ['Desde un vértice se trazan diagonales que parten el polígono en $n-2 = ' + (d.n - 2) + '$ triángulos.',
        'Cada triángulo aporta $180^\\circ$: $S = ' + (d.n - 2) + ' \\cdot 180 = ' + d.suma + '^\\circ$.',
        'Como es regular, los $' + d.n + '$ ángulos son iguales: $' + d.suma + ' : ' + d.n + ' = ' +
        U.fmt(d.cada, 4) + '^\\circ$.'];
    },
    answer: function (d) { return 'Suman ' + d.suma + '° y cada uno mide ' + U.fmt(d.cada, 2) + '°.'; }
  });

  p.exercise({
    title: '¿Se puede construir el triángulo?',
    level: 'basico',
    gen: function (r) {
      var a = r.int(2, 15), b = r.int(2, 15);
      var c = r.bool() ? r.int(Math.abs(a - b) + 1, a + b - 1) : r.int(a + b, a + b + 8);
      if (c <= 0) return null;
      var lados = [a, b, c].sort(function (x, y) { return x - y; });
      return { a: a, b: b, c: c, ok: lados[0] + lados[1] > lados[2], l: lados };
    },
    ask: function (d) {
      return '¿Existe un triángulo con lados $' + d.a + '$, $' + d.b + '$ y $' + d.c + '$?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe <code>si</code> o <code>no</code>.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.ok ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe <code>si</code> o <code>no</code>.' };
      return (t === 'si') === d.ok;
    },
    hint: function () { return 'Desigualdad triangular: el lado mayor tiene que ser menor que la suma de los otros dos.'; },
    steps: function (d) {
      return ['Ordenamos los lados: $' + d.l.join(' \\le ') + '$.',
        'Basta comprobar el caso peor: ¿es el mayor menor que la suma de los otros dos?',
        '$' + d.l[0] + ' + ' + d.l[1] + ' = ' + (d.l[0] + d.l[1]) + (d.ok ? ' > ' : ' \\le ') + d.l[2] + '$',
        d.ok ? 'Sí se cumple: el triángulo <strong>existe</strong>.'
          : 'No se cumple: los dos lados cortos no llegan a juntarse. <strong>No existe</strong>.'];
    },
    answer: function (d) { return d.ok ? 'Sí existe.' : 'No existe.'; }
  });

  p.keys([
    'Opuestos por el vértice: iguales. Complementarios: suman $90^\\circ$. Suplementarios: $180^\\circ$.',
    'Dos paralelas cortadas por una secante generan solo dos valores de ángulo, suplementarios entre sí.',
    'Los ángulos de todo triángulo suman $180^\\circ$, y eso se demuestra con la propiedad anterior.',
    'Desigualdad triangular: cada lado es menor que la suma de los otros dos.',
    'Polígono de $n$ lados: los ángulos interiores suman $(n-2)\\cdot 180^\\circ$.'
  ]);
});
