/* Tema: Cuerpos geométricos y volúmenes */
Course.topic('ge-cuerpos', function (p) {

  p.text('Pasamos del plano al espacio. Un <strong>poliedro</strong> es un cuerpo limitado por caras ' +
    'planas; los <strong>cuerpos de revolución</strong> (cilindro, cono, esfera) se obtienen girando ' +
    'una figura plana alrededor de un eje.');

  p.section('Volúmenes');
  p.text('Las fórmulas de volumen se recuerdan mucho mejor si se agrupan por familias en vez de una a ' +
    'una. Los cuerpos con dos bases iguales —prismas y cilindros— son «área de la base por altura», ' +
    'sin más. Los que acaban en punta —pirámides y conos— son exactamente <strong>un tercio</strong> ' +
    'de lo anterior, y ese tercio no es casualidad: tres pirámides iguales llenan justo un prisma de ' +
    'su misma base y altura. La esfera va aparte y tiene su propia historia.');


  p.table(['Cuerpo', 'Volumen', 'Área total'],
    [['Prisma / ortoedro', '$A_b \\cdot h$', '$2A_b + P_b\\,h$'],
     ['Cilindro', '$\\pi r^2 h$', '$2\\pi r^2 + 2\\pi r h$'],
     ['Pirámide', '$\\dfrac{A_b \\cdot h}{3}$', '$A_b + A_{\\text{lateral}}$'],
     ['Cono', '$\\dfrac{\\pi r^2 h}{3}$', '$\\pi r^2 + \\pi r g$'],
     ['Esfera', '$\\dfrac{4}{3}\\pi r^3$', '$4\\pi r^2$']]);

  p.note('Fíjate en el patrón: <strong>lo que acaba en punta vale un tercio</strong> de lo que tiene ' +
    'la misma base y la misma altura. Pirámide y prisma, cono y cilindro. Ese $\\frac{1}{3}$ no es ' +
    'arbitrario: se demuestra, y Arquímedes ya lo sabía.', 'ok', 'El patrón del tercio');

  p.demo({
    title: 'Tres conos llenan un cilindro',
    intro: 'Compara los volúmenes de un cilindro, un cono y una esfera con el mismo radio. Cambia las medidas y observa las proporciones.',
    build: function (host, d) {
      var rad = 3, h = 6;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.6, xmax: 3.6, ymin: 0, ymax: 1.15, height: 260,
        xstep: 1, ylabel: null, xlabel: null,
        xtickLabel: function (i) { return ['cilindro', 'cono', 'esfera'][Math.round(i)] || ''; },
        yticks: false,
        draw: function (g) {
          var vcil = Math.PI * rad * rad * h;
          var vcon = vcil / 3;
          var vesf = 4 / 3 * Math.PI * rad * rad * rad;
          var mx = Math.max(vcil, vesf);
          g.bars([
            { x: 0, h: vcil / mx, color: 0, top: U.fmt(vcil, 1) },
            { x: 1, h: vcon / mx, color: 1, top: U.fmt(vcon, 1) },
            { x: 2, h: vesf / mx, color: 2, top: U.fmt(vesf, 1) }
          ], { width: 0.5 });
        }
      });
      function paint() {
        var vcil = Math.PI * rad * rad * h;
        out.set('Radio $r = ' + rad + '$, altura $h = ' + h + '$<br>' +
          'Cilindro: $\\pi r^2 h = ' + U.fmt(vcil, 3) + '$ &nbsp;·&nbsp; ' +
          'Cono: $\\frac{1}{3}\\pi r^2 h = ' + U.fmt(vcil / 3, 3) + '$ &nbsp;·&nbsp; ' +
          'Esfera: $\\frac{4}{3}\\pi r^3 = ' + U.fmt(4 / 3 * Math.PI * rad * rad * rad, 3) + '$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">El cono es siempre exactamente un ' +
          'tercio del cilindro que lo envuelve.' +
          (Math.abs(h - 2 * rad) < 0.01 ? ' Y con $h = 2r$, la esfera es dos tercios del cilindro: ' +
            'ese fue el resultado del que Arquímedes se sintió más orgulloso.' : '') + '</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'radio', min: 1, max: 6, step: 0.5, value: rad, dec: 1, on: function (v) { rad = v; paint(); } });
      W.slider(row, { label: 'altura', min: 1, max: 12, step: 0.5, value: h, dec: 1, on: function (v) { h = v; paint(); } });
      W.hint(host, 'Prueba con altura igual al doble del radio.');
      paint();
    }
  });

  p.hist('Arquímedes pidió que grabaran en su tumba una esfera inscrita en un cilindro, con la ' +
    'proporción 2:3 entre sus volúmenes. Le parecía su mejor resultado. Cicerón, siendo cuestor en ' +
    'Sicilia en el año 75 a.C., encontró la tumba abandonada entre zarzas y la reconoció justamente ' +
    'por ese dibujo.');

  /* ---------------------------------------------------------------- */
  p.util('La relación entre el cono y el cilindro —un tercio— es la que hace que un embudo, una copa ' +
    'cónica o un montón de arena tengan la capacidad que tienen, y la usan a diario los que calculan ' +
    'silos, depósitos y áridos de obra. Arquímedes estaba tan orgulloso de haber descubierto la ' +
    'relación análoga entre la esfera y el cilindro que pidió que se la grabaran en la tumba; ' +
    'Cicerón la encontró así, siglo y medio después, abandonada entre matorrales.');

  p.section('Poliedros regulares');

  p.text('Solo existen <strong>cinco</strong> poliedros regulares (todas las caras iguales y ' +
    'regulares, y todos los vértices idénticos). Cinco, ni uno más, y se puede demostrar. Se les ' +
    'llama <em>sólidos platónicos</em>.');

  p.table(['Nombre', 'Caras', 'Vértices', 'Aristas', 'Cara'],
    [['Tetraedro', '4', '4', '6', 'triángulo'],
     ['Cubo', '6', '8', '12', 'cuadrado'],
     ['Octaedro', '8', '6', '12', 'triángulo'],
     ['Dodecaedro', '12', '20', '30', 'pentágono'],
     ['Icosaedro', '20', '12', '30', 'triángulo']], { num: [1, 2, 3] });

  p.sub('La fórmula de Euler');

  p.text('Comprueba en la tabla anterior que en todos ellos se cumple lo mismo. Y no solo en ellos: ' +
    'en <strong>cualquier</strong> poliedro convexo.');

  p.formula('C + V - A = 2', 'caras + vértices − aristas = 2');

  p.note('Esta fórmula no habla de longitudes ni de ángulos: solo de cómo están conectadas las ' +
    'piezas. Es el primer resultado de <em>topología</em> de la historia, y volverá a aparecer con ' +
    'toda su potencia en el bloque 9, donde la topología tiene tema propio.',
    null, 'Un aviso de lo que viene');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Volumen de un cuerpo',
    level: 'basico',
    gen: function (r) {
      var t = r.int(0, 3);
      var rad = r.int(2, 12), h = r.int(3, 20);
      var a = r.int(2, 12), b = r.int(2, 12);
      if (t === 0) return { t: 0, a: a, b: b, h: h, res: a * b * h };
      if (t === 1) return { t: 1, rad: rad, h: h, res: Math.PI * rad * rad * h };
      if (t === 2) return { t: 2, rad: rad, h: h, res: Math.PI * rad * rad * h / 3 };
      return { t: 3, rad: rad, res: 4 / 3 * Math.PI * rad * rad * rad };
    },
    ask: function (d) {
      if (d.t === 0) return 'Calcula el volumen de un ortoedro de aristas $' + d.a + '$, $' + d.b + '$ y $' + d.h + '$ cm.';
      if (d.t === 1) return 'Calcula el volumen de un cilindro de radio $' + d.rad + '$ cm y altura $' + d.h + '$ cm (cuatro decimales).';
      if (d.t === 2) return 'Calcula el volumen de un cono de radio $' + d.rad + '$ cm y altura $' + d.h + '$ cm (cuatro decimales).';
      return 'Calcula el volumen de una esfera de radio $' + d.rad + '$ cm (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Volumen (cm³)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.res, 4) }; },
    tol: 3e-4,
    hint: function (d) {
      return ['$V = a\\cdot b\\cdot c$', '$V = \\pi r^2 h$', '$V = \\frac{1}{3}\\pi r^2 h$', '$V = \\frac{4}{3}\\pi r^3$'][d.t];
    },
    steps: function (d) {
      if (d.t === 0) return ['$V = ' + d.a + ' \\cdot ' + d.b + ' \\cdot ' + d.h + ' = ' + d.res + '$ cm³'];
      if (d.t === 1) return ['$V = \\pi r^2 h = \\pi \\cdot ' + d.rad + '^2 \\cdot ' + d.h + '$',
        '$= ' + (d.rad * d.rad * d.h) + '\\pi \\approx ' + U.fmt(d.res, 4) + '$ cm³'];
      if (d.t === 2) return ['$V = \\dfrac{\\pi r^2 h}{3} = \\dfrac{\\pi \\cdot ' + d.rad + '^2 \\cdot ' + d.h + '}{3}$',
        '$\\approx ' + U.fmt(d.res, 4) + '$ cm³',
        'Es justo un tercio del cilindro correspondiente, que mediría $' + U.fmt(d.res * 3, 4) + '$ cm³.'];
      return ['$V = \\dfrac{4}{3}\\pi r^3 = \\dfrac{4}{3}\\pi \\cdot ' + d.rad + '^3$',
        '$= \\dfrac{4 \\cdot ' + (d.rad * d.rad * d.rad) + '}{3}\\pi \\approx ' + U.fmt(d.res, 4) + '$ cm³'];
    },
    answer: function (d) { return U.fmt(d.res, 4) + ' cm³'; }
  });

  p.exercise({
    title: 'Fórmula de Euler',
    level: 'basico',
    gen: function (r) {
      var solidos = [
        { n: 'tetraedro', C: 4, V: 4, A: 6 }, { n: 'cubo', C: 6, V: 8, A: 12 },
        { n: 'octaedro', C: 8, V: 6, A: 12 }, { n: 'dodecaedro', C: 12, V: 20, A: 30 },
        { n: 'icosaedro', C: 20, V: 12, A: 30 }, { n: 'prisma pentagonal', C: 7, V: 10, A: 15 },
        { n: 'pirámide hexagonal', C: 7, V: 7, A: 12 }, { n: 'prisma triangular', C: 5, V: 6, A: 9 }
      ];
      var s = r.pick(solidos);
      var falta = r.int(0, 2);
      return { s: s, falta: falta };
    },
    ask: function (d) {
      var nom = ['caras', 'vértices', 'aristas'][d.falta];
      var datos = [];
      if (d.falta !== 0) datos.push('$' + d.s.C + '$ caras');
      if (d.falta !== 1) datos.push('$' + d.s.V + '$ vértices');
      if (d.falta !== 2) datos.push('$' + d.s.A + '$ aristas');
      return 'Un poliedro convexo tiene ' + datos.join(' y ') + '. ¿Cuántas <strong>' + nom + '</strong> tiene?';
    },
    fields: [{ name: 'v', label: 'Cantidad', w: 'tiny' }],
    sol: function (d) { return { v: [d.s.C, d.s.V, d.s.A][d.falta] }; },
    hint: function () { return 'Usa $C + V - A = 2$ y despeja lo que falta.'; },
    steps: function (d) {
      var res = [d.s.C, d.s.V, d.s.A][d.falta];
      return ['Fórmula de Euler: $C + V - A = 2$.',
        'Sustituimos lo que sabemos: $' + (d.falta === 0 ? 'C' : d.s.C) + ' + ' +
        (d.falta === 1 ? 'V' : d.s.V) + ' - ' + (d.falta === 2 ? 'A' : d.s.A) + ' = 2$.',
        'Despejando sale $' + res + '$.',
        'Se trata de un ' + d.s.n + '.'];
    },
    answer: function (d) { return String([d.s.C, d.s.V, d.s.A][d.falta]); }
  });

  p.exercise({
    title: 'Área de una superficie',
    level: 'medio',
    gen: function (r) {
      var rad = r.int(2, 15), h = r.int(3, 20);
      var cual = r.int(0, 2);
      if (cual === 0) return { cual: 0, rad: rad, res: 4 * Math.PI * rad * rad };
      if (cual === 1) return { cual: 1, rad: rad, h: h, res: 2 * Math.PI * rad * rad + 2 * Math.PI * rad * h };
      var gen = Math.sqrt(rad * rad + h * h);
      return { cual: 2, rad: rad, h: h, gen: gen, res: Math.PI * rad * rad + Math.PI * rad * gen };
    },
    ask: function (d) {
      if (d.cual === 0) return 'Calcula el área de una esfera de radio $' + d.rad + '$ cm (cuatro decimales).';
      if (d.cual === 1) return 'Calcula el área total de un cilindro de radio $' + d.rad + '$ cm y altura $' + d.h + '$ cm (cuatro decimales).';
      return 'Calcula el área total de un cono de radio $' + d.rad + '$ cm y altura $' + d.h + '$ cm (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Área (cm²)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.res, 4) }; },
    tol: 3e-4,
    hint: function (d) {
      if (d.cual === 0) return '$A = 4\\pi r^2$: cuatro veces el círculo máximo.';
      if (d.cual === 1) return 'Dos tapas ($2\\pi r^2$) más el lateral desenrollado, que es un rectángulo de $2\\pi r$ por $h$.';
      return 'Primero calcula la generatriz con Pitágoras: $g = \\sqrt{r^2+h^2}$.';
    },
    steps: function (d) {
      if (d.cual === 0) return ['$A = 4\\pi r^2 = 4\\pi \\cdot ' + d.rad + '^2 = ' + (4 * d.rad * d.rad) + '\\pi$',
        '$\\approx ' + U.fmt(d.res, 4) + '$ cm²'];
      if (d.cual === 1) return ['Las dos bases: $2\\pi r^2 = ' + (2 * d.rad * d.rad) + '\\pi$.',
        'El lateral, desenrollado, es un rectángulo de base $2\\pi r$ y altura $h$: $2\\pi \\cdot ' + d.rad + ' \\cdot ' + d.h + ' = ' + (2 * d.rad * d.h) + '\\pi$.',
        'Total: $' + (2 * d.rad * d.rad + 2 * d.rad * d.h) + '\\pi \\approx ' + U.fmt(d.res, 4) + '$ cm²'];
      return ['Generatriz: $g = \\sqrt{' + d.rad + '^2 + ' + d.h + '^2} = \\sqrt{' + (d.rad * d.rad + d.h * d.h) + '} = ' + U.fmt(d.gen, 4) + '$ cm.',
        'Base: $\\pi r^2 = ' + (d.rad * d.rad) + '\\pi$.',
        'Lateral: $\\pi r g = \\pi \\cdot ' + d.rad + ' \\cdot ' + U.fmt(d.gen, 4) + '$.',
        'Total $\\approx ' + U.fmt(d.res, 4) + '$ cm²'];
    },
    answer: function (d) { return U.fmt(d.res, 4) + ' cm²'; }
  });

  p.exercise({
    title: 'Problema de capacidad',
    level: 'avanzado',
    gen: function (r) {
      var rad = r.int(3, 15), h = r.int(10, 40);
      var vol = Math.PI * rad * rad * h;   // cm³
      return { rad: rad, h: h, litros: vol / 1000 };
    },
    ask: function (d) {
      return 'Un depósito cilíndrico mide $' + d.rad + '$ cm de radio y $' + d.h + '$ cm de altura. ' +
        '¿Cuántos <strong>litros</strong> caben? (cuatro decimales)<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Recuerda: 1 litro = 1000 cm³.</span>';
    },
    fields: [{ name: 'v', label: 'Litros', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.litros, 4) }; },
    tol: 3e-4,
    hint: function () { return 'Calcula primero el volumen en cm³ y después divide entre 1000.'; },
    steps: function (d) {
      var vol = Math.PI * d.rad * d.rad * d.h;
      return ['$V = \\pi r^2 h = \\pi \\cdot ' + d.rad + '^2 \\cdot ' + d.h + ' = ' + (d.rad * d.rad * d.h) + '\\pi$',
        '$\\approx ' + U.fmt(vol, 3) + '$ cm³',
        'Pasamos a litros: $' + U.fmt(vol, 3) + ' : 1000 = ' + U.fmt(d.litros, 4) + '$ litros.'];
    },
    answer: function (d) { return U.fmt(d.litros, 4) + ' litros'; }
  });

  p.keys([
    'Prisma y cilindro: $V = A_b \\cdot h$. Pirámide y cono: <strong>un tercio</strong> de eso.',
    'Esfera: $V = \\frac{4}{3}\\pi r^3$ y $A = 4\\pi r^2$.',
    'Para el área lateral de un cono hace falta la generatriz: $g = \\sqrt{r^2+h^2}$.',
    'Solo existen cinco poliedros regulares.',
    'Fórmula de Euler: $C + V - A = 2$ en todo poliedro convexo.',
    '1 litro = 1000 cm³ = 1 dm³.'
  ]);
});
