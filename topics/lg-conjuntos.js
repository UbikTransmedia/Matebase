/* Tema: Conjuntos y aplicaciones */
Course.topic('lg-conjuntos', function (p) {

  p.text('En el tema anterior aprendiste a decidir si una afirmación es verdadera o falsa. Ahora vamos ' +
    'a hacer algo que parece mucho más modesto —agrupar cosas— y que resulta ser más potente. Fíjate ' +
    'en que la pregunta <em>«¿es verdad que 3 es impar?»</em> y la pregunta <em>«¿está el 3 en el ' +
    'montón de los impares?»</em> son la misma pregunta escrita de dos maneras. Esa coincidencia no es ' +
    'una casualidad: es el puente por el que la lógica del tema anterior se convierte en matemáticas, ' +
    'y lo vamos a cruzar en este.');

  p.text('Un <strong>conjunto</strong> es una colección de objetos bien determinada. Toda la exigencia ' +
    'está en esas dos últimas palabras: dado cualquier objeto, tiene que estar claro si pertenece o no ' +
    'pertenece, sin discusión posible. No sirve «los números grandes», porque nadie sabría decir dónde ' +
    'está la frontera; sí sirve «los números mayores que mil», porque de cualquier número sabes ' +
    'responder sí o no. No se pide nada más: ni orden, ni cantidad, ni que los elementos se parezcan ' +
    'entre sí.');

  p.text('Cuesta creer cuánto se puede levantar con tan poco. A finales del siglo XIX se descubrió que ' +
    'los números, las funciones, el espacio y prácticamente cualquier objeto matemático se pueden ' +
    'definir como conjuntos hechos de conjuntos. No vamos a hacerlo aquí, pero conviene que sepas que ' +
    'el suelo que vas a pisar durante todo el curso está hecho de esta única idea.');

  p.sub('Dos maneras de decir quién está dentro');

  p.text('Para dar un conjunto hay que dejar claro quiénes son sus elementos, y eso se puede hacer de ' +
    'dos formas. La primera es la más obvia: <strong>enumerarlos</strong> uno a uno entre llaves. Se ' +
    'dice que el conjunto está dado <em>por extensión</em>, y solo resulta práctico cuando son pocos: ' +
    'nadie va a escribir por extensión el conjunto de los números pares.');

  p.text('La segunda es no listar a nadie y dar en su lugar la <strong>regla</strong> que cumplen ' +
    'exactamente sus elementos. Se dice que el conjunto está dado <em>por comprensión</em>, y para ' +
    'escribirla hacen falta tres símbolos que conviene que sepas <em>decir</em>, no solo reconocer:');

  p.list([
    'Las <strong>llaves</strong> $\\{\\ \\}$ se leen «el conjunto de los».',
    'Los <strong>dos puntos</strong> $:$ se leen «tales que». En algunos libros verás una barra $|$ ' +
      'en su lugar; significa lo mismo.',
    'El símbolo $\\in$ se lee «pertenece a», y la letra hueca $\\mathbb{N}$ se dice «ene» y es el ' +
      'nombre de los números naturales: $0, 1, 2, 3, \\dots$'
  ]);

  p.formulas([
    'A = \\{1, 2, 3, 4\\}',
    'A = \\{x \\in \\mathbb{N} : x < 5,\\ x \\ne 0\\}'
  ], 'el mismo conjunto, por extensión y por comprensión',
    'La primera línea se dice: <em>«A es el conjunto formado por el 1, el 2, el 3 y el 4»</em>.<br><br>' +
    'La segunda, entera y de corrido: <em>«A es el conjunto de los equis que pertenecen a los números ' +
    'naturales, tales que equis es menor que 5 y equis es distinto de cero»</em>.<br><br>' +
    'Símbolo a símbolo: $\\{$ «el conjunto de los» · $x$ «equis» · $\\in$ «pertenece a» · ' +
    '$\\mathbb{N}$ «ene, los naturales» · $:$ «tales que» · $\\ne$ «distinto de».');

  p.text('Las dos líneas describen el mismo conjunto, y aquí está la gracia: la de arriba lo enseña y ' +
    'la de abajo lo describe. Si tienes dudas de cómo se pronuncia algo, pulsa el <strong>?</strong> ' +
    'de la esquina de la caja; lo encontrarás en las fórmulas nuevas de todo el curso. Merece la pena ' +
    'leerla en voz alta una vez, porque esta forma de escribir te va a acompañar hasta el último tema.');

  p.sub('El vocabulario mínimo');

  p.text('Con la idea de conjunto vienen cuatro símbolos que conviene tener frescos. Los tres primeros ' +
    'son relaciones —dicen cómo se sitúa algo respecto a un conjunto— y el cuarto es un conjunto muy ' +
    'particular:');

  p.list([
    '$x \\in A$: el elemento $x$ <strong>pertenece</strong> a $A$. Es la pregunta básica que todo ' +
      'conjunto tiene que saber responder.',
    '$A \\subset B$: todo elemento de $A$ está también en $B$; se dice que $A$ es <strong>subconjunto' +
      '</strong> de $B$. Ojo, esto no habla de un elemento sino de dos conjuntos enteros.',
    '$\\emptyset$: el conjunto <strong>vacío</strong>, el que no tiene ningún elemento. Parece inútil y ' +
      'no lo es: es subconjunto de todos los conjuntos, y aparecerá cada vez que dos cosas no tengan ' +
      'nada en común.',
    'No importa el orden ni repetir un elemento: $\\{1,2,2,3\\}$ y $\\{3,1,2\\}$ son el mismo conjunto. ' +
      'Un conjunto solo sabe <em>quién está</em>, no cuántas veces ni en qué orden.'
  ]);

  p.note('Cuidado con dos símbolos que se confunden: $\\in$ relaciona un <em>elemento</em> con un ' +
    'conjunto, y $\\subset$ relaciona dos <em>conjuntos</em>. Si $A=\\{1,2\\}$, entonces $1 \\in A$ ' +
    'y $\\{1\\} \\subset A$, pero $1 \\subset A$ no tiene sentido.', 'warn');

  /* ---------------------------------------------------------------- */
  p.section('Operaciones');

  p.text('Con dos números puedes hacer cosas: sumarlos, restarlos, multiplicarlos. Con dos conjuntos ' +
    'también, y las operaciones que existen no son un invento arbitrario: salen de preguntarse lo ' +
    'único que un conjunto sabe responder. Si tengo dos conjuntos $A$ y $B$ y cojo un objeto ' +
    'cualquiera, hay cuatro respuestas posibles —está en los dos, solo en $A$, solo en $B$, o en ' +
    'ninguno—, y cada operación no es más que quedarse con algunas de esas cuatro zonas.');

  p.text('De ahí salen las cinco de la tabla. Léela despacio fijándote en la última columna, porque en ' +
    'ella está escondida la sorpresa del tema: cada operación se define con una palabra de las que ' +
    'usabas ayer para hablar de verdadero y falso.');

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
  ], 'leyes de De Morgan, versión conjuntista',
    'La rayita de encima se lee «complementario de», o más llanamente «todo lo que NO está en». ' +
    'Así que la primera línea se dice: <em>«el complementario de A intersección B es igual al ' +
    'complementario de A unión el complementario de B»</em>.<br><br>En cristiano: <em>«lo que no ' +
    'está en los dos a la vez es lo mismo que lo que falta en uno o falta en el otro»</em>.<br><br>' +
    'Los dos símbolos: $\\cap$ se dice «intersección» (la zona común) y $\\cup$ se dice ' +
    '«unión» (todo junto).');

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
  p.util('Toda base de datos del mundo funciona con estas operaciones, y hasta con estos nombres: ' +
    '<code>UNION</code>, <code>INTERSECT</code>, <code>EXCEPT</code>. Cuando un hospital cruza ' +
    '«pacientes con esta dolencia» con «pacientes que toman este fármaco», está haciendo una ' +
    'intersección; cuando una tienda busca a quien compró el año pasado pero no este, una ' +
    'diferencia. El diagrama de Venn que dibujas aquí es literalmente lo que ejecuta el servidor.');

  p.section('Cardinal y producto cartesiano');

  p.text('Hasta ahora hemos hablado de <em>quién</em> está en un conjunto. Vamos a preguntarnos ahora ' +
    '<em>cuántos</em>, que es una pregunta distinta y con truco. El <strong>cardinal</strong> de $A$, ' +
    'que se escribe $|A|$, es simplemente su número de elementos.');

  p.text('Contar un conjunto solo es fácil hasta que aparecen dos. Imagina una clase de 30 alumnos ' +
    'donde 18 juegan al fútbol y 15 al baloncesto. ¿Cuántos hacen deporte? La tentación es decir 33, ' +
    'que además es imposible porque solo hay 30. El error está en que quien juega a los dos ha sido ' +
    'contado dos veces, una en cada grupo, así que hay que descontarlo una vez:');

  p.formula('|A \\cup B| = |A| + |B| - |A \\cap B|', 'principio de inclusión-exclusión',
    'Las barras verticales se leen «cardinal de», que es la forma corta de decir «cuántos elementos ' +
    'tiene».<br><br>Entera: <em>«el cardinal de A unión B es igual al cardinal de A, más el cardinal ' +
    'de B, menos el cardinal de A intersección B»</em>.<br><br>Dicho como se piensa: <em>«los que ' +
    'están en A o en B son los de A más los de B, quitando una vez los que estaban en los dos»</em>.');

  p.text('Con 18 y 15 sobre 30, el número de repetidos es $18+15-30=3$. Guarda esta idea de sumar y ' +
    'descontar lo repetido: reaparecerá tal cual cuando calcules la probabilidad de que ocurra una ' +
    'cosa <em>o</em> la otra.');

  p.sub('Combinar dos conjuntos en lugar de mezclarlos');

  p.text('La unión y la intersección meten los elementos de $A$ y $B$ en un mismo saco. Hay otra manera ' +
    'de juntarlos que no los mezcla: <strong>emparejarlos</strong>. Si $A$ son los tamaños de una ' +
    'camiseta y $B$ los colores, lo que le interesa a la tienda no es la unión de ambos sino la lista ' +
    'de combinaciones —talla M en azul, talla L en azul, talla M en rojo…—, que es un objeto nuevo.');

  p.text('Ese objeto es el <strong>producto cartesiano</strong> $A \\times B$: el conjunto de todos los ' +
    'pares ordenados con el primer elemento de $A$ y el segundo de $B$. Aquí, a diferencia de lo que ' +
    'pasaba dentro de un conjunto, el orden <em>sí</em> importa: $(1,2)$ y $(2,1)$ son pares distintos, ' +
    'igual que «talla M en rojo» no es «talla roja en M».');

  p.text('Contarlos es inmediato: por cada elección del primero hay tantas posibilidades como elementos ' +
    'tenga el segundo conjunto, así que se multiplican.');

  p.formula('|A \\times B| = |A| \\cdot |B|', null,
    'Se lee: <em>«el cardinal de A por B es igual al cardinal de A multiplicado por el cardinal de ' +
    'B»</em>.<br><br>Cuidado con el aspa: entre dos conjuntos, $\\times$ no es una multiplicación ' +
    'sino el «producto cartesiano», la lista de todas las parejas posibles. Lo que sí se multiplica ' +
    'son las cantidades, que es lo que dice el lado derecho.');

  p.note('$\\mathbb{R} \\times \\mathbb{R} = \\mathbb{R}^2$ <strong>es el plano</strong>. Cada punto ' +
    'del plano es un par ordenado de reales. Toda la geometría analítica que has estudiado descansa ' +
    'en esta definición.', 'ok');

  /* ---------------------------------------------------------------- */
  p.section('Aplicaciones');

  p.text('Llegamos a la idea más productiva del tema. Hasta aquí los conjuntos han sido montones ' +
    'quietos; ahora vamos a relacionarlos, y para eso sirve una <strong>aplicación</strong> (o ' +
    'función) $f: A \\to B$: una regla que asigna a cada elemento de $A$ exactamente un elemento de ' +
    '$B$. Se llama $A$ el conjunto inicial y $B$ el final.');

  p.text('Las dos palabras que hacen todo el trabajo son <em>«a cada»</em> y <em>«exactamente uno»</em>. ' +
    'La primera prohíbe dejar a alguien sin asignar: si un solo elemento de $A$ se queda sin destino, ' +
    'no hay aplicación. La segunda prohíbe la ambigüedad: un elemento de $A$ no puede ir a dos sitios a ' +
    'la vez. Piensa en el vestuario de un gimnasio —cada socio tiene su taquilla asignada, una y solo ' +
    'una—; en cambio «el número de teléfono de una persona» no sirve como aplicación, porque hay quien ' +
    'tiene dos y quien no tiene ninguno.');

  p.text('Fíjate en que la definición no dice nada sobre $B$. Es perfectamente legal que dos socios ' +
    'compartan taquilla, o que queden taquillas vacías: lo que se exige es sobre quien sale, no sobre ' +
    'quien recibe. Y precisamente por eso, preguntarse qué ocurre en $B$ es lo que da lugar a la ' +
    'clasificación siguiente.');

  p.text('Hay dos cosas que pueden estropearse en $B$: que alguien reciba <em>dos</em> flechas, o que ' +
    'alguien no reciba <em>ninguna</em>. Prohibir la primera da las inyectivas, prohibir la segunda las ' +
    'sobreyectivas, y prohibir las dos a la vez, las biyectivas:');

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
  p.util('Que una aplicación sea inyectiva es lo que hace que un identificador sirva: si dos personas ' +
    'pudieran tener el mismo DNI, el DNI no identificaría a nadie. Que sea biyectiva es lo que hace ' +
    'que algo se pueda <strong>deshacer</strong>: comprimir un archivo y recuperarlo intacto, cifrar ' +
    'un mensaje y descifrarlo. Y las funciones que a propósito <em>no</em> son inyectivas también ' +
    'trabajan: cuando una web guarda tu contraseña resumida, usa una función que aplasta cualquier ' +
    'texto en un código fijo, precisamente para que no se pueda dar marcha atrás.');

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
