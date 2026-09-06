/* Tema: Conjuntos y aplicaciones */
Course.topic('lg-conjuntos', function (p) {

  p.text('Un <strong>conjunto</strong> es una colección de objetos bien determinada: dado cualquier ' +
    'objeto, tiene que estar claro si pertenece o no. Nada más. Y con esa idea tan pobre se puede ' +
    'construir literalmente toda la matemática.');

  p.formulas([
    'A = \\{1, 2, 3, 4\\} \\quad \\text{(por extensión)}',
    'A = \\{x \\in \\mathbb{N} : x < 5,\\ x \\ne 0\\} \\quad \\text{(por comprensión)}'
  ]);

  p.list([
    '$x \\in A$: el elemento $x$ <strong>pertenece</strong> a $A$.',
    '$A \\subset B$: todo elemento de $A$ está en $B$ ($A$ es <strong>subconjunto</strong>).',
    '$\\emptyset$: el conjunto <strong>vacío</strong>, sin ningún elemento. Es subconjunto de todos.',
    'No importa el orden ni repetir: $\\{1,2,2,3\\} = \\{3,1,2\\}$.'
  ]);

  p.note('Cuidado con dos símbolos que se confunden: $\\in$ relaciona un <em>elemento</em> con un ' +
    'conjunto, y $\\subset$ relaciona dos <em>conjuntos</em>. Si $A=\\{1,2\\}$, entonces $1 \\in A$ ' +
    'y $\\{1\\} \\subset A$, pero $1 \\subset A$ no tiene sentido.', 'warn');

  /* ---------------------------------------------------------------- */
  p.section('Operaciones');

  p.table(['Operación', 'Símbolo', 'Es el conjunto de los que…'],
    [['Unión', '$A \\cup B$', 'están en $A$ <strong>o</strong> en $B$'],
     ['Intersección', '$A \\cap B$', 'están en $A$ <strong>y</strong> en $B$'],
     ['Diferencia', '$A - B$', 'están en $A$ pero <strong>no</strong> en $B$'],
     ['Complementario', '$\\overline{A}$', '<strong>no</strong> están en $A$'],
     ['Producto cartesiano', '$A \\times B$', 'pares $(a,b)$ con $a\\in A$ y $b\\in B$']]);

  p.note('Compara esta tabla con la de las conectivas del tema anterior. La unión es el «o», la ' +
    'intersección es la «y», el complementario es el «no». <strong>Los conjuntos son la lógica ' +
    'dibujada</strong>: por eso De Morgan vale igual aquí.', 'ok', 'La misma estructura');

  p.formulas([
    '\\overline{A \\cap B} = \\overline{A} \\cup \\overline{B}',
    '\\overline{A \\cup B} = \\overline{A} \\cap \\overline{B}'
  ], 'leyes de De Morgan, versión conjuntista');

  p.demo({
    title: 'Diagramas de Venn',
    intro: 'Elige una operación y mira qué región queda sombreada. Compara la última pareja: son la misma región, y eso es De Morgan.',
    build: function (host, d) {
      var op = 'union';
      var ops = {
        union: { t: 'A \\cup B', f: function (a, b) { return a || b; }, n: 'Todo lo que esté en A, en B o en las dos.' },
        inter: { t: 'A \\cap B', f: function (a, b) { return a && b; }, n: 'Solo la zona común.' },
        difA: { t: 'A - B', f: function (a, b) { return a && !b; }, n: 'Lo que está en A quitando lo que comparte con B.' },
        compl: { t: '\\overline{A}', f: function (a) { return !a; }, n: 'Todo lo que queda fuera de A, dentro del universo.' },
        simetrica: { t: 'A \\triangle B', f: function (a, b) { return a !== b; }, n: 'Diferencia simétrica: lo que está en uno pero no en los dos.' },
        dm1: { t: '\\overline{A \\cap B}', f: function (a, b) { return !(a && b); }, n: 'Todo menos la zona común.' },
        dm2: { t: '\\overline{A} \\cup \\overline{B}', f: function (a, b) { return !a || !b; }, n: 'Idéntica a la anterior: esto es la ley de De Morgan, vista.' }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -3.4, xmax: 3.4, ymin: -2.2, ymax: 2.2, height: 300, equal: true,
        grid: false, axes: false,
        draw: function (g) {
          var F = ops[op].f;
          var cA = [-0.75, 0], cB = [0.75, 0], R = 1.45;
          // relleno por muestreo
          var ctx = g.ctx;
          ctx.fillStyle = g.color(0);
          ctx.globalAlpha = 0.32;
          for (var px = 0; px < g.W; px += 2) {
            for (var py = 0; py < g.H; py += 2) {
              var x = g.iX(px), y = g.iY(py);
              if (Math.abs(x) > 3.2 || Math.abs(y) > 2) continue;
              var enA = Math.hypot(x - cA[0], y - cA[1]) < R;
              var enB = Math.hypot(x - cB[0], y - cB[1]) < R;
              if (F(enA, enB)) ctx.fillRect(px, py, 2, 2);
            }
          }
          ctx.globalAlpha = 1;
          g.rect(-3.2, -2, 6.4, 4, { color: 'axis', w: 1.6, stroke: true });
          g.circle(cA[0], cA[1], R, { color: 1, w: 2.4, stroke: true });
          g.circle(cB[0], cB[1], R, { color: 2, w: 2.4, stroke: true });
          g.text(-2, 1.5, 'A', { color: 1, size: 18, bold: true });
          g.text(2, 1.5, 'B', { color: 2, size: 18, bold: true });
          g.text(3.05, -1.8, 'U', { color: 'axis', size: 14, align: 'right' });
        }
      });
      function paint() {
        out.set('$' + ops[op].t + '$ — ' + ops[op].n);
        plot.render();
      }
      W.chips(host, [
        { label: '$A \\cup B$', value: 'union' }, { label: '$A \\cap B$', value: 'inter' },
        { label: '$A - B$', value: 'difA' }, { label: '$\\overline{A}$', value: 'compl' },
        { label: '$A \\triangle B$', value: 'simetrica' },
        { label: '$\\overline{A \\cap B}$', value: 'dm1' }, { label: '$\\overline{A} \\cup \\overline{B}$', value: 'dm2' }
      ], { value: 'union', on: function (v) { op = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Cardinal y producto cartesiano');

  p.text('El <strong>cardinal</strong> $|A|$ es el número de elementos. Para contar uniones hay que ' +
    'tener cuidado de no contar dos veces lo común, exactamente igual que con probabilidades:');

  p.formula('|A \\cup B| = |A| + |B| - |A \\cap B|', 'principio de inclusión-exclusión');

  p.text('El <strong>producto cartesiano</strong> $A \\times B$ es el conjunto de todos los pares ' +
    'ordenados. Aquí el orden <em>sí</em> importa: $(1,2) \\ne (2,1)$.');

  p.formula('|A \\times B| = |A| \\cdot |B|');

  p.note('$\\mathbb{R} \\times \\mathbb{R} = \\mathbb{R}^2$ <strong>es el plano</strong>. Cada punto ' +
    'del plano es un par ordenado de reales. Toda la geometría analítica que has estudiado descansa ' +
    'en esta definición.', 'ok');

  /* ---------------------------------------------------------------- */
  p.section('Aplicaciones');

  p.text('Una <strong>aplicación</strong> (o función) $f: A \\to B$ asigna a cada elemento de $A$ ' +
    'exactamente un elemento de $B$. $A$ es el conjunto inicial, $B$ el final.');

  p.text('Según cómo reparta, se clasifican en tres tipos que hay que distinguir bien:');

  p.table(['Tipo', 'Condición', 'En palabras'],
    [['<strong>Inyectiva</strong>', '$f(x)=f(y) \\Rightarrow x=y$', 'elementos distintos van a imágenes distintas: nadie comparte destino'],
     ['<strong>Sobreyectiva</strong>', '$\\operatorname{Im}f = B$', 'no sobra ningún elemento en el conjunto final: todos reciben algo'],
     ['<strong>Biyectiva</strong>', 'las dos cosas', 'emparejamiento perfecto, uno a uno']]);

  p.demo({
    title: 'Los cuatro casos posibles',
    intro: 'Cada flecha lleva un elemento de A a uno de B. Fíjate en si hay destinos compartidos (no inyectiva) o destinos vacíos (no sobreyectiva).',
    build: function (host, d) {
      var tipo = 'bi';
      var casos = {
        bi: { m: [0, 1, 2], nB: 3, n: '<strong>Biyectiva</strong>: cada elemento de B recibe exactamente una flecha. Se puede deshacer: existe la inversa.' },
        iny: { m: [0, 2, 3], nB: 4, n: '<strong>Inyectiva pero no sobreyectiva</strong>: nadie comparte destino, pero sobra un elemento en B.' },
        sob: { m: [0, 0, 1], nB: 2, n: '<strong>Sobreyectiva pero no inyectiva</strong>: todos en B reciben algo, pero dos elementos comparten destino.' },
        ni: { m: [0, 0, 1], nB: 3, n: '<strong>Ni inyectiva ni sobreyectiva</strong>: hay destino compartido y además sobra un elemento en B.' }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 10, ymin: 0, ymax: 5.5, height: 300,
        grid: false, axes: false,
        draw: function (g) {
          var C = casos[tipo];
          var nA = C.m.length;
          function yA(i) { return 4.6 - i * 1.5; }
          function yB(i) { return 4.6 - i * (C.nB > 3 ? 1.15 : 1.5); }
          g.rect(1.2, 0.3, 1.6, 4.9, { color: 1, fill: 1, fillAlpha: .08, w: 1.6 });
          g.rect(7.2, 0.3, 1.6, 4.9, { color: 2, fill: 2, fillAlpha: .08, w: 1.6 });
          g.text(2, 5.3, 'A', { align: 'center', color: 1, size: 15, bold: true });
          g.text(8, 5.3, 'B', { align: 'center', color: 2, size: 15, bold: true });
          var recibidos = {};
          C.m.forEach(function (dest) { recibidos[dest] = (recibidos[dest] || 0) + 1; });
          for (var j = 0; j < C.nB; j++) {
            var vacio = !recibidos[j];
            g.point(8, yB(j), { color: vacio ? 'bad' : 2, r: 8 });
            if (vacio) g.text(8.9, yB(j), 'sin origen', { size: 11.5, color: 'bad' });
            else if (recibidos[j] > 1) g.text(8.9, yB(j), 'x' + recibidos[j], { size: 11.5, color: 'bad' });
          }
          C.m.forEach(function (dest, i) {
            g.point(2, yA(i), { color: 1, r: 8 });
            g.vec(2.25, yA(i), 7.75, yB(dest), { color: recibidos[dest] > 1 ? 'bad' : 0, w: 2 });
          });
        }
      });
      function paint() { out.set(casos[tipo].n); plot.render(); }
      W.chips(host, [
        { label: 'biyectiva', value: 'bi' }, { label: 'solo inyectiva', value: 'iny' },
        { label: 'solo sobreyectiva', value: 'sob' }, { label: 'ninguna de las dos', value: 'ni' }
      ], { value: 'bi', on: function (v) { tipo = v; paint(); } });
      paint();
    }
  });

  p.note('Las <strong>biyecciones</strong> van a ser importantísimas más adelante: son la herramienta ' +
    'con la que Cantor comparó tamaños de conjuntos infinitos. Si existe una biyección entre dos ' +
    'conjuntos, «tienen los mismos elementos», aunque sean infinitos.', null, 'Adelanto');

  p.hist('La teoría de conjuntos la creó Georg Cantor entre 1874 y 1897, y fue recibida con hostilidad: ' +
    'Kronecker la llamó «charlatanería matemática». En 1901 Russell descubrió una paradoja demoledora ' +
    'en su versión ingenua: si consideramos «el conjunto de todos los conjuntos que no se contienen a ' +
    'sí mismos», ¿se contiene a sí mismo? Cualquier respuesta lleva a contradicción. Fue necesario ' +
    'refundar la teoría con axiomas más cuidadosos, y de esa crisis salió la lógica matemática moderna.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Operaciones con conjuntos',
    level: 'basico',
    gen: function (r) {
      var A = [], B = [];
      for (var i = 1; i <= 10; i++) {
        if (r.bool(0.5)) A.push(i);
        if (r.bool(0.5)) B.push(i);
      }
      if (!A.length || !B.length) return null;
      var op = r.int(0, 3);
      var res;
      if (op === 0) res = A.filter(function (x) { return B.indexOf(x) >= 0; });                  // interseccion
      else if (op === 1) {                                                                       // union
        res = A.slice();
        B.forEach(function (x) { if (res.indexOf(x) < 0) res.push(x); });
        res.sort(function (a, b) { return a - b; });
      } else if (op === 2) res = A.filter(function (x) { return B.indexOf(x) < 0; });            // A - B
      else {                                                                                     // complementario de A
        res = [];
        for (var j = 1; j <= 10; j++) if (A.indexOf(j) < 0) res.push(j);
      }
      return { A: A, B: B, op: op, n: res.length, res: res };
    },
    ask: function (d) {
      var nom = ['$A \\cap B$', '$A \\cup B$', '$A - B$', '$\\overline{A}$'][d.op];
      return 'Sea el universo $U = \\{1,2,\\dots,10\\}$, con<br>' +
        '$A = \\{' + d.A.join(', ') + '\\}$ y $B = \\{' + d.B.join(', ') + '\\}$.<br>' +
        '¿Cuántos elementos tiene ' + nom + '?';
    },
    fields: [{ name: 'n', label: 'Nº de elementos', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    hint: function (d) {
      return ['La intersección son los que están en los dos.', 'La unión son todos, sin repetir.',
        'Los de $A$ quitando los que también estén en $B$.',
        'Los del universo que no están en $A$.'][d.op];
    },
    steps: function (d) {
      var nom = ['$A \\cap B$', '$A \\cup B$', '$A - B$', '$\\overline{A}$'][d.op];
      return ['Recorremos los elementos aplicando la definición de la operación.',
        nom + ' $= \\{' + (d.res.length ? d.res.join(', ') : '\\ ') + '\\}$',
        'Tiene <strong>' + d.n + '</strong> ' + U.plural(d.n, 'elemento', 'elementos') + '.',
        d.op === 1 ? 'Comprobación con inclusión-exclusión: $|A| + |B| - |A\\cap B| = ' + d.A.length +
          ' + ' + d.B.length + ' - ' + d.A.filter(function (x) { return d.B.indexOf(x) >= 0; }).length +
          ' = ' + d.n + '$ ✓' : ''].filter(function (x) { return x; });
    },
    answer: function (d) { return d.n + ' elementos: {' + d.res.join(', ') + '}'; }
  });

  p.exercise({
    title: 'Inclusión-exclusión',
    level: 'medio',
    gen: function (r) {
      var comun = r.int(2, 15);
      var soloA = r.int(3, 25), soloB = r.int(3, 25);
      return {
        A: soloA + comun, B: soloB + comun, inter: comun,
        union: soloA + soloB + comun
      };
    },
    ask: function (d) {
      return 'En una clase, $' + d.A + '$ alumnos estudian inglés, $' + d.B + '$ estudian francés y $' +
        d.inter + '$ estudian los dos idiomas. ¿Cuántos estudian <strong>al menos uno</strong> de los dos?';
    },
    fields: [{ name: 'n', label: 'Alumnos', w: 'tiny' }],
    sol: function (d) { return { n: d.union }; },
    hint: function () { return 'Si sumas los dos grupos, los que estudian ambos idiomas se cuentan dos veces.'; },
    steps: function (d) {
      return ['$|A \\cup B| = |A| + |B| - |A \\cap B|$',
        '$= ' + d.A + ' + ' + d.B + ' - ' + d.inter + ' = ' + d.union + '$',
        'Si simplemente sumáramos $' + d.A + ' + ' + d.B + ' = ' + (d.A + d.B) + '$, estaríamos ' +
        'contando dos veces a los $' + d.inter + '$ que estudian los dos.',
        'Solo inglés: $' + (d.A - d.inter) + '$; solo francés: $' + (d.B - d.inter) + '$; los dos: $' + d.inter + '$.'];
    },
    answer: function (d) { return d.union + ' alumnos'; }
  });

  p.exercise({
    title: 'Producto cartesiano y subconjuntos',
    level: 'medio',
    gen: function (r) {
      var a = r.int(2, 7), b = r.int(2, 7);
      var cual = r.bool();
      return { a: a, b: b, cual: cual, res: cual ? a * b : Math.pow(2, a) };
    },
    ask: function (d) {
      if (d.cual) {
        return 'Si $|A| = ' + d.a + '$ y $|B| = ' + d.b + '$, ¿cuántos elementos tiene $A \\times B$?';
      }
      return 'Si $|A| = ' + d.a + '$, ¿cuántos <strong>subconjuntos</strong> distintos tiene $A$? ' +
        '<span style="font-size:14px;color:var(--ink-faint)">(contando el vacío y el propio $A$)</span>';
    },
    fields: [{ name: 'n', label: 'Cantidad', w: 'tiny' }],
    sol: function (d) { return { n: d.res }; },
    hint: function (d) {
      return d.cual ? 'Cada par se forma eligiendo un elemento de $A$ y uno de $B$: principio de multiplicación.'
        : 'Para cada elemento hay dos opciones: entra en el subconjunto o no entra.';
    },
    steps: function (d) {
      if (d.cual) return ['Cada par ordenado se construye eligiendo primero un elemento de $A$ y después uno de $B$.',
        '$|A \\times B| = |A| \\cdot |B| = ' + d.a + ' \\cdot ' + d.b + ' = ' + d.res + '$'];
      return ['Para construir un subconjunto, se decide para cada elemento si entra o no: dos opciones cada uno.',
        'Con $' + d.a + '$ elementos independientes: $2^{' + d.a + '} = ' + d.res + '$.',
        'Coincide con la suma de una fila del triángulo de Pascal: $\\sum_k \\binom{' + d.a + '}{k} = 2^{' + d.a + '}$.'];
    },
    answer: function (d) { return String(d.res); }
  });

  p.exercise({
    title: 'Clasifica la aplicación',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { f: 'f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=2x+3', t: 3, por: 'una recta no horizontal alcanza todos los valores y nunca repite: es biyectiva' },
        { f: 'f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=x^2', t: 0, por: '$f(2)=f(-2)$, así que no es inyectiva; y nunca da valores negativos, así que tampoco sobreyectiva' },
        { f: 'f:\\mathbb{R}\\to[0,+\\infty),\\ f(x)=x^2', t: 2, por: 'alcanza todos los no negativos, pero sigue repitiendo imágenes' },
        { f: 'f:[0,+\\infty)\\to\\mathbb{R},\\ f(x)=x^2', t: 1, por: 'ya no repite, pero deja fuera los negativos' },
        { f: 'f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=x^3', t: 3, por: 'es estrictamente creciente y llega a todo: biyectiva' },
        { f: 'f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=e^x', t: 1, por: 'nunca repite, pero nunca da valores negativos ni el cero' },
        { f: 'f:\\mathbb{R}\\to\\mathbb{R},\\ f(x)=5', t: 0, por: 'todos van al mismo sitio y el resto de valores se quedan sin origen' },
        { f: 'f:\\mathbb{Z}\\to\\mathbb{Z},\\ f(n)=n+1', t: 3, por: 'desplazar los enteros es un emparejamiento perfecto' }
      ];
      var c = r.pick(casos);
      return { f: c.f, t: c.t, por: c.por };
    },
    ask: function (d) {
      return 'Clasifica la aplicación $' + d.f + '$.<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)"><code>0</code> ninguna de las dos · ' +
        '<code>1</code> solo inyectiva · <code>2</code> solo sobreyectiva · <code>3</code> biyectiva</span>';
    },
    fields: [{ name: 't', label: 'Tipo', w: 'tiny' }],
    sol: function (d) { return { t: d.t }; },
    hint: function () { return 'Inyectiva: ¿dos valores distintos pueden dar la misma imagen? Sobreyectiva: ¿se alcanzan todos los valores del conjunto final?'; },
    steps: function (d) {
      return ['<strong>Inyectiva</strong> significa que no hay dos originales con la misma imagen.',
        '<strong>Sobreyectiva</strong> significa que no sobra ningún elemento del conjunto final.',
        'Fíjate en que <em>cambiar el conjunto final</em> puede convertir una aplicación en sobreyectiva sin tocar la fórmula.',
        'Aquí: ' + d.por + '.',
        'Respuesta: <strong>' + ['ninguna de las dos', 'solo inyectiva', 'solo sobreyectiva', 'biyectiva'][d.t] + '</strong>.'];
    },
    answer: function (d) { return ['Ninguna de las dos', 'Solo inyectiva', 'Solo sobreyectiva', 'Biyectiva'][d.t]; }
  });

  p.keys([
    'Conjunto: colección bien determinada. $\\in$ es para elementos, $\\subset$ para conjuntos.',
    'Unión = «o», intersección = «y», complementario = «no»: los conjuntos son la lógica dibujada.',
    'De Morgan vale igual aquí: $\\overline{A\\cap B} = \\overline{A}\\cup\\overline{B}$.',
    '$|A\\cup B| = |A|+|B|-|A\\cap B|$: no contar dos veces lo común.',
    '$A\\times B$ son los pares ordenados, y $\\mathbb{R}^2$ <strong>es</strong> el plano.',
    'Un conjunto de $n$ elementos tiene $2^n$ subconjuntos.',
    'Inyectiva: no repite imágenes. Sobreyectiva: no sobran destinos. Biyectiva: las dos.'
  ]);
});
