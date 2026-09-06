/* Tema: Conjuntos numéricos y la recta real */
Course.topic('ar-conjuntos', function (p) {

  p.text('Este tema cierra el bloque de aritmética juntando todo lo anterior en una sola historia. ' +
    'Porque los tipos de número no se inventaron por capricho: cada uno apareció cuando el anterior ' +
    'se quedó corto para responder a una pregunta razonable.');

  p.table(['Conjunto', 'Símbolo', 'Apareció porque…', 'Ejemplo'],
    [['Naturales', '$\\mathbb{N}$', 'hacía falta contar', '$0, 1, 2, 3\\dots$'],
     ['Enteros', '$\\mathbb{Z}$', '$3-7$ no tenía respuesta', '$\\dots,-2,-1,0,1,2\\dots$'],
     ['Racionales', '$\\mathbb{Q}$', '$3:4$ no tenía respuesta', '$\\frac{3}{4}$, $-2$, $0{,}\\overline{3}$'],
     ['Irracionales', '$\\mathbb{I}$', '$\\sqrt{2}$ no era ninguna fracción', '$\\sqrt{2}$, $\\pi$, $e$'],
     ['Reales', '$\\mathbb{R}$', 'para llenar la recta sin huecos', 'todos los anteriores']]);

  p.formula('\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}',
    'cada uno contiene al anterior');

  p.note('Un número es <strong>racional</strong> si se puede escribir como fracción de enteros. ' +
    'Equivale a decir que su expresión decimal es exacta o periódica. Es <strong>irracional</strong> ' +
    'si tiene infinitas cifras decimales sin ningún periodo.', null, 'La frontera');

  p.hist('El descubrimiento de los irracionales fue una crisis. La escuela pitagórica creía que todo ' +
    'en el universo era proporción de números enteros, y ellos mismos demostraron que la diagonal de ' +
    'un cuadrado de lado 1 no lo es: $\\sqrt{2}$ no es ninguna fracción. La leyenda cuenta que ' +
    'Hípaso de Metaponto, que divulgó el hallazgo, murió ahogado en el mar. Fuera cierto o no, el ' +
    'problema tardó dos mil años en cerrarse del todo: la construcción rigurosa de $\\mathbb{R}$ es ' +
    'de Dedekind y Cantor, en la década de 1870.');

  /* ---------------------------------------------------------------- */
  p.section('Por qué √2 no es una fracción');

  p.text('Este argumento merece verse entero, porque es el primer ejemplo de una demostración por ' +
    '<em>reducción al absurdo</em>: se supone lo contrario de lo que se quiere probar y se llega a ' +
    'una contradicción.');

  p.list([
    'Supongamos que $\\sqrt{2} = \\frac{a}{b}$, una fracción ya <strong>irreducible</strong>.',
    'Elevando al cuadrado: $2 = \\frac{a^2}{b^2}$, o sea $a^2 = 2b^2$.',
    'Entonces $a^2$ es par, y por tanto $a$ también es par (el cuadrado de un impar es impar).',
    'Si $a = 2k$, entonces $4k^2 = 2b^2$, es decir $b^2 = 2k^2$: también $b$ es par.',
    'Pero si $a$ y $b$ son los dos pares, la fracción <strong>no era irreducible</strong>. Contradicción.',
    'Conclusión: no existe tal fracción. $\\sqrt{2}$ es irracional.'
  ], true);

  /* ---------------------------------------------------------------- */
  p.section('La recta real');

  p.text('A cada punto de una recta le corresponde exactamente un número real, y al revés. Los ' +
    'racionales están densísimos (entre dos cualesquiera siempre hay otro), pero <em>aun así</em> ' +
    'dejan huecos; los irracionales son los que los rellenan.');

  p.demo({
    title: 'Localizar números en la recta',
    intro: 'Arrastra el punto y mira a qué familia pertenece el número más cercano de cada tipo. Fíjate en lo apretados que están los racionales y en que aun así no llegan a llenarlo todo.',
    build: function (host, d) {
      var out = W.readout(host, '');
      var notables = [
        { x: Math.SQRT2, t: '√2', c: 1 }, { x: Math.PI, t: 'π', c: 1 },
        { x: Math.E, t: 'e', c: 1 }, { x: -Math.SQRT2, t: '−√2', c: 1 },
        { x: 1.5, t: '3/2', c: 3 }, { x: -2.5, t: '−5/2', c: 3 }, { x: 0.75, t: '3/4', c: 3 }
      ];
      W.numberLine(host, {
        min: -4.4, max: 4.4, step: 1, height: 150,
        handles: {
          P: { x: 1.4142, y: 0, label: '', color: 0, constrain: function (h) { h.y = 0; h.x = U.clamp(h.x, -4.3, 4.3); } }
        },
        draw: function (g) {
          for (var i = -4; i <= 4; i++) g.point(i, 0, { color: 'ok', r: 4 });
          notables.forEach(function (nn) {
            g.point(nn.x, 0, { color: nn.c, r: 4 });
            g.text(nn.x, 0.42, nn.t, { align: 'center', size: 12, color: nn.c, box: true });
          });
          var x = g.h('P').x;
          g.seg(x, -0.55, x, 0.55, { color: 0, w: 1.6, dash: true });
          var f = ML.F(U.round(x, 4));
          var esEntero = Math.abs(x - Math.round(x)) < 0.02;
          out.set('$x \\approx ' + U.fmt(x, 4) + '$<br>' +
            'Pertenece a $\\mathbb{R}$. ' +
            (esEntero ? 'Está prácticamente sobre el entero $' + Math.round(x) + '$, que es de $\\mathbb{Z}$ (y por tanto de $\\mathbb{Q}$).'
              : 'La fracción más simple que lo aproxima es $' + f.tex() + ' = ' + U.fmt(f.val(), 5) + '$.') +
            '<br><span style="font-size:12.5px;color:var(--ink-faint)">Los puntos verdes son enteros, ' +
            'los naranjas racionales no enteros y los rojos irracionales.</span>');
        }
      });
      W.legend(host, [{ c: 'ok', t: 'enteros' }, { c: 3, t: 'racionales' }, { c: 1, t: 'irracionales' }]);
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Intervalos');

  p.text('Un <strong>intervalo</strong> es un tramo de recta. La notación distingue si los extremos ' +
    'entran o no: corchete si entra, paréntesis si no.');

  p.table(['Notación', 'Significa', 'Con desigualdades'],
    [['$[a, b]$', 'cerrado: entran los dos extremos', '$a \\le x \\le b$'],
     ['$(a, b)$', 'abierto: no entra ninguno', '$a < x < b$'],
     ['$[a, b)$', 'semiabierto', '$a \\le x < b$'],
     ['$[a, +\\infty)$', 'semirrecta', '$x \\ge a$'],
     ['$(-\\infty, b)$', 'semirrecta', '$x < b$']]);

  p.note('Junto al infinito siempre va paréntesis, nunca corchete: $\\infty$ no es un número al que ' +
    'se pueda llegar, así que no puede «entrar» en el intervalo.', 'warn');

  p.sub('Valor absoluto e intervalos');

  p.text('El valor absoluto mide distancias, así que toda condición con $|\\ |$ se traduce en un ' +
    'tramo alrededor de un punto. Esto es la base de los límites, así que conviene tenerlo claro ahora:');

  p.formulas([
    '|x| < r \\iff -r < x < r \\iff x \\in (-r, r)',
    '|x - c| < r \\iff x \\in (c-r,\\ c+r)'
  ]);

  p.text('En palabras: «$|x-c| < r$» significa «$x$ está a menos de $r$ de distancia de $c$».');

  p.demo({
    title: 'Un intervalo como entorno de un punto',
    intro: 'Mueve el centro y el radio. La condición con valor absoluto y el intervalo son la misma cosa dicha de dos maneras.',
    build: function (host, d) {
      var c = 2, r = 1.5;
      var out = W.readout(host, '');
      var plot = W.numberLine(host, {
        min: -6, max: 8, step: 1, height: 130,
        draw: function (g) {
          g.seg(c - r, 0, c + r, 0, { color: 0, w: 7, alpha: .35 });
          g.point(c - r, 0, { color: 0, r: 6, hollow: true });
          g.point(c + r, 0, { color: 0, r: 6, hollow: true });
          g.point(c, 0, { color: 2, r: 5 });
          g.seg(c, 0.3, c + r, 0.3, { color: 2, w: 1.8, dash: true });
          g.text(c + r / 2, 0.55, 'r = ' + U.fmt(r, 2), { align: 'center', color: 2, size: 12, box: true });
          g.text(c, -0.5, 'c = ' + U.fmt(c, 1), { align: 'center', color: 2, size: 12 });
        }
      });
      function paint() {
        out.set('$|x - ' + U.fmt(c, 1) + '| < ' + U.fmt(r, 2) + '$ &nbsp;⟺&nbsp; ' +
          '$x \\in \\left(' + U.fmt(c - r, 2) + ',\\ ' + U.fmt(c + r, 2) + '\\right)$ &nbsp;⟺&nbsp; ' +
          '$' + U.fmt(c - r, 2) + ' < x < ' + U.fmt(c + r, 2) + '$');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'centro c', min: -4, max: 6, step: 0.5, value: c, dec: 1, on: function (v) { c = v; paint(); } });
      W.slider(row, { label: 'radio r', min: 0.25, max: 4, step: 0.25, value: r, dec: 2, on: function (v) { r = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿A qué conjunto pertenece?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: '-7', c: 2 }, { t: '\\dfrac{5}{8}', c: 3 }, { t: '\\sqrt{16}', c: 1 },
        { t: '\\sqrt{5}', c: 4 }, { t: '\\pi', c: 4 }, { t: '0{,}\\overline{6}', c: 3 },
        { t: '-\\dfrac{12}{4}', c: 2 }, { t: '3{,}25', c: 3 }, { t: '\\sqrt{2}+1', c: 4 },
        { t: '0', c: 1 }, { t: '2^5', c: 1 }, { t: '\\sqrt[3]{27}', c: 1 },
        { t: 'e', c: 4 }, { t: '-\\sqrt{9}', c: 2 }, { t: '\\dfrac{22}{7}', c: 3 }
      ];
      var x = r.pick(casos);
      return { t: x.t, c: x.c };
    },
    ask: function (d) {
      return '¿Cuál es el conjunto <strong>más pequeño</strong> al que pertenece $' + d.t + '$?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe <code>1</code> para $\\mathbb{N}$, ' +
        '<code>2</code> para $\\mathbb{Z}$, <code>3</code> para $\\mathbb{Q}$, ' +
        '<code>4</code> para irracional.</span>';
    },
    fields: [{ name: 'c', label: 'Conjunto', w: 'tiny' }],
    sol: function (d) { return { c: d.c }; },
    hint: function () { return 'Opera primero: muchas raíces son enteras disfrazadas. Y toda fracción que se simplifica a entero es entero.'; },
    steps: function (d) {
      var nom = ['', '$\\mathbb{N}$ (natural)', '$\\mathbb{Z}$ (entero negativo)', '$\\mathbb{Q}$ (racional no entero)', 'irracional'][d.c];
      return ['Primero se calcula o simplifica todo lo que se pueda.',
        'Después se busca el conjunto más pequeño que lo contenga: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$.',
        'En este caso: <strong>' + nom + '</strong>.'];
    },
    answer: function (d) {
      return ['', 'Natural (ℕ)', 'Entero (ℤ)', 'Racional (ℚ)', 'Irracional'][d.c];
    }
  });

  p.exercise({
    title: 'Del intervalo a la desigualdad',
    level: 'basico',
    gen: function (r) {
      var a = r.pm(0, 9), b = a + r.int(1, 9);
      var tipo = r.int(0, 3);
      return { a: a, b: b, tipo: tipo };
    },
    ask: function (d) {
      var tex = ['[' + d.a + ', ' + d.b + ']', '(' + d.a + ', ' + d.b + ')',
        '[' + d.a + ', ' + d.b + ')', '(' + d.a + ', ' + d.b + ']'][d.tipo];
      return 'Del intervalo $' + tex + '$, ¿cuántos <strong>números enteros</strong> contiene?';
    },
    fields: [{ name: 'n', label: 'Cantidad', w: 'tiny' }],
    sol: function (d) {
      var lo = (d.tipo === 0 || d.tipo === 2) ? d.a : d.a + 1;
      var hi = (d.tipo === 0 || d.tipo === 3) ? d.b : d.b - 1;
      return { n: hi - lo + 1 };
    },
    hint: function () { return 'Corchete = el extremo entra. Paréntesis = no entra. Cuenta los enteros que quedan dentro.'; },
    steps: function (d) {
      var lo = (d.tipo === 0 || d.tipo === 2) ? d.a : d.a + 1;
      var hi = (d.tipo === 0 || d.tipo === 3) ? d.b : d.b - 1;
      return ['Extremo izquierdo: ' + ((d.tipo === 0 || d.tipo === 2) ? 'cerrado, así que $' + d.a + '$ entra.' : 'abierto, así que $' + d.a + '$ no entra.'),
        'Extremo derecho: ' + ((d.tipo === 0 || d.tipo === 3) ? 'cerrado, así que $' + d.b + '$ entra.' : 'abierto, así que $' + d.b + '$ no entra.'),
        'Los enteros de dentro van del $' + lo + '$ al $' + hi + '$.',
        'Son $' + hi + ' - ' + lo + ' + 1 = ' + (hi - lo + 1) + '$.'];
    },
    answer: function (d) {
      var lo = (d.tipo === 0 || d.tipo === 2) ? d.a : d.a + 1;
      var hi = (d.tipo === 0 || d.tipo === 3) ? d.b : d.b - 1;
      return (hi - lo + 1) + ' enteros (del ' + lo + ' al ' + hi + ').';
    }
  });

  p.exercise({
    title: 'Valor absoluto como intervalo',
    level: 'medio',
    gen: function (r) {
      var c = r.pm(0, 8), rad = r.int(1, 6);
      return { c: c, r: rad, lo: c - rad, hi: c + rad };
    },
    ask: function (d) {
      return 'Escribe la solución de $|x ' + (d.c >= 0 ? '- ' + d.c : '+ ' + (-d.c)) + '| < ' + d.r +
        '$ como intervalo: da sus dos extremos.';
    },
    fields: [{ name: 'a', label: 'Extremo izquierdo', w: 'tiny' }, { name: 'b', label: 'Extremo derecho', w: 'tiny' }],
    sol: function (d) { return { a: d.lo, b: d.hi }; },
    hint: function (d) { return 'Se lee «$x$ está a menos de $' + d.r + '$ de $' + d.c + '$».'; },
    steps: function (d) {
      return ['$|x - c| < r$ significa que $x$ dista de $c$ menos que $r$.',
        'Quitamos el valor absoluto: $-' + d.r + ' < x ' + (d.c >= 0 ? '- ' + d.c : '+ ' + (-d.c)) + ' < ' + d.r + '$.',
        'Sumamos $' + d.c + '$ en los tres miembros: $' + d.lo + ' < x < ' + d.hi + '$.',
        'Es decir, $x \\in (' + d.lo + ', ' + d.hi + ')$.'];
    },
    answer: function (d) { return '$(' + d.lo + ', ' + d.hi + ')$'; }
  });

  p.exercise({
    title: '¿Racional o irracional?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: '\\sqrt{' + r.pick([4, 9, 16, 25, 36, 49, 64, 81, 100]) + '}', irr: false },
        { t: '\\sqrt{' + r.pick([2, 3, 5, 6, 7, 8, 10, 11]) + '}', irr: true },
        { t: '0{,}\\overline{' + r.int(1, 99) + '}', irr: false },
        { t: '\\pi + 1', irr: true },
        { t: '\\dfrac{' + r.int(1, 20) + '}{' + r.int(2, 9) + '}', irr: false },
        { t: '2\\sqrt{' + r.pick([2, 3, 5]) + '}', irr: true },
        { t: '\\sqrt{2}\\cdot\\sqrt{2}', irr: false },
        { t: '\\sqrt[3]{' + r.pick([8, 27, 64, 125]) + '}', irr: false }
      ];
      var x = r.pick(casos);
      return { t: x.t, irr: x.irr };
    },
    ask: function (d) {
      return '¿Es $' + d.t + '$ racional o irracional?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe <code>r</code> si es racional ' +
        'o <code>i</code> si es irracional.</span>';
    },
    fields: [{ name: 'x', label: 'Respuesta', w: 'tiny', ph: 'r / i' }],
    sol: function (d) { return { x: d.irr ? 'i' : 'r' }; },
    check: function (v, d) {
      var t = v.raw.x.trim().toLowerCase();
      if (t !== 'r' && t !== 'i') return { ok: false, msg: 'Escribe <code>r</code> o <code>i</code>.' };
      return (t === 'i') === d.irr;
    },
    hint: function () { return 'Cuidado con las raíces: $\\sqrt{16}$ es 4, un número perfectamente racional. Y todo decimal periódico es racional.'; },
    steps: function (d) {
      return ['Se opera y se simplifica todo lo posible.',
        'Es racional si puede escribirse como fracción de enteros (o, equivalentemente, si su decimal es exacto o periódico).',
        d.irr ? 'Aquí no se puede: es <strong>irracional</strong>.' : 'Aquí sí se puede: es <strong>racional</strong>.'];
    },
    answer: function (d) { return d.irr ? 'Irracional' : 'Racional'; }
  });

  p.keys([
    'Cada conjunto numérico nació al quedarse corto el anterior: restar, dividir, extraer raíces.',
    '$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$.',
    'Racional ⟺ se puede escribir como fracción ⟺ su decimal es exacto o periódico.',
    'Irracional: infinitas cifras sin periodo. $\\sqrt{2}$, $\\pi$, $e$.',
    'La recta real no tiene huecos: a cada punto le corresponde un real y viceversa.',
    '$|x-c| < r$ significa «$x$ está a menos de $r$ de $c$»: es el intervalo $(c-r, c+r)$.'
  ]);
});
