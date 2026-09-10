/* Tema: Matrices y determinantes */
Course.topic('al-matrices', function (p) {

  p.text('Una <strong>matriz</strong> es una tabla rectangular de números. Suena a poco y es una de ' +
    'las herramientas más potentes que existen: sirve para resolver sistemas enormes, para describir ' +
    'transformaciones geométricas, para el buscador de Google y para casi toda la inteligencia artificial.');

  p.formula('A = \\begin{pmatrix} 2 & -1 & 0 \\\\ 3 & 5 & 4 \\end{pmatrix}',
    'matriz de dimensión 2×3 (filas × columnas)',
    'Se lee <strong>«a es la matriz dos por tres»</strong>, y ese orden importa: <em>primero las ' +
      'filas y después las columnas</em>, siempre. Una matriz «tres por dos» sería otra ' +
      'cosa.<br><br>Los paréntesis grandes que la envuelven no son una multiplicación: solo indican ' +
      'que todo eso es un único objeto. Algunos libros usan corchetes, y significa lo ' +
      'mismo.<br><br>Para nombrar una casilla se usan dos subíndices con el mismo convenio: $a_{23}$ ' +
      'se dice «a sub dos tres» y es el elemento de la <strong>fila 2, columna 3</strong>.');

  p.text('Se nombra $a_{ij}$ al elemento de la fila $i$ y la columna $j$. Siempre en ese orden: ' +
    'primero fila, después columna.');

  p.section('Tipos de matrices y la traspuesta');

  p.text('Algunas formas aparecen tanto que tienen nombre propio. Conviene reconocerlas de un vistazo, ' +
    'porque cada una se comporta de una manera especial al operar y muchas preguntas de examen dan por ' +
    'sabido su nombre:');

  p.table(['Nombre', 'Qué la caracteriza', 'Ejemplo'],
    [['cuadrada', 'tantas filas como columnas', '$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$'],
     ['diagonal', 'cuadrada, con ceros fuera de la diagonal principal', '$\\begin{pmatrix} 3 & 0 \\\\ 0 & -1 \\end{pmatrix}$'],
     ['identidad $I$', 'diagonal con unos: hace de «uno» en el producto, $AI = IA = A$', '$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$'],
     ['triangular', 'ceros por debajo (o por encima) de la diagonal', '$\\begin{pmatrix} 2 & 5 \\\\ 0 & 7 \\end{pmatrix}$'],
     ['nula $O$', 'todos sus elementos son cero', '$\\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$'],
     ['simétrica', 'coincide con su traspuesta: $a_{ij} = a_{ji}$', '$\\begin{pmatrix} 1 & 4 \\\\ 4 & 9 \\end{pmatrix}$']]);

  p.formula('A = \\begin{pmatrix} 2 & -1 & 0 \\\\ 3 & 5 & 4 \\end{pmatrix} \\ \\Longrightarrow\\ A^t = \\begin{pmatrix} 2 & 3 \\\\ -1 & 5 \\\\ 0 & 4 \\end{pmatrix}',
    'la traspuesta: filas por columnas',
    'La $t$ de arriba se lee «traspuesta»: <em>«a traspuesta»</em>. La primera fila de $A$ pasa a ser ' +
      'la primera columna de $A^t$, la segunda fila la segunda columna, y así. Una matriz de dimensión ' +
      '$m\\times n$ se convierte en una $n\\times m$.<br><br>Dos propiedades que se usan mucho: ' +
      '$(A^t)^t = A$ y $(A\\cdot B)^t = B^t\\cdot A^t$, <strong>con el orden cambiado</strong>.');

  p.section('Suma y producto por un número');

  p.text('Fáciles: se hacen elemento a elemento. Para sumar, las dos matrices tienen que tener ' +
    'exactamente la misma dimensión.');

  p.section('El producto de matrices');

  p.text('Aquí está la sorpresa. No se multiplica elemento a elemento, como cabría esperar: el elemento ' +
    'que ocupa la fila $i$ y la columna $j$ del producto se obtiene combinando <strong>la fila $i$ de ' +
    'la primera matriz con la columna $j$ de la segunda</strong>, multiplicando término a término y ' +
    'sumando todo.');

  p.text('Antes de ver la fórmula conviene tener claro el gesto, porque la fórmula solo es ese gesto ' +
    'escrito. Para calcular el elemento de la <em>fila 2, columna 3</em> del resultado: tapa todo ' +
    'menos la segunda fila de la primera matriz y la tercera columna de la segunda; ponlas una encima ' +
    'de otra, multiplica el primero con el primero, el segundo con el segundo, y suma. Ese número va ' +
    'en la fila 2, columna 3. Repite para cada casilla.');

  p.formula('c_{ij} = \\sum_k a_{ik}\\,b_{kj}', 'fila por columna',
    'Se dice: <em>«ce sub i jota es igual al sumatorio, en ka, de a sub i ka por be sub ka jota»</em>.' +
    '<br><br>Qué es cada letra, que es lo que de verdad atasca aquí: <strong>$i$ y $j$ están ' +
    'quietas</strong> —dicen en qué casilla del resultado estás trabajando— y <strong>$k$ es la que ' +
    'se mueve</strong>, recorriendo la fila y la columna a la vez. Por eso $k$ aparece dos veces en el ' +
    'producto: como segundo índice de $a$ (avanza por la fila) y como primero de $b$ (baja por la ' +
    'columna).<br><br>El sumatorio no dice hasta dónde llega porque va implícito: hasta que se acabe ' +
    'la fila, que mide lo mismo que la columna. Justamente por eso las dimensiones tienen que encajar.');

  p.text('Y queda la pregunta buena: <em>¿por qué demonios se define así?</em> Multiplicar casilla a ' +
    'casilla sería más fácil de escribir, pero no serviría para nada. Una matriz no es una tabla de ' +
    'números cualquiera: es una <strong>transformación</strong> —un giro, un estiramiento, una ' +
    'proyección—, y multiplicar dos matrices significa <strong>aplicar una transformación después de ' +
    'la otra</strong>. Si haces las cuentas de encadenar dos transformaciones, lo que sale es ' +
    'exactamente esta regla de fila por columna. No la eligió nadie: salió.');

  p.text('Esa idea explica de paso lo que viene ahora. Encadenar un giro y luego un estiramiento no da ' +
    'lo mismo que estirar y luego girar, y por eso el producto de matrices <em>no</em> es conmutativo. ' +
    'Con números eso no pasa nunca; con transformaciones, casi siempre.');

  p.note('Para poder multiplicar, el número de <strong>columnas</strong> de la primera tiene que ' +
    'coincidir con el número de <strong>filas</strong> de la segunda. Y el producto ' +
    '<strong>no es conmutativo</strong>: en general $A\\cdot B \\ne B\\cdot A$. A veces uno de los dos ' +
    'productos ni siquiera se puede hacer.', 'warn', 'Dos cosas que rompen la intuición');

  p.demo({
    title: 'Fila por columna, paso a paso',
    intro: 'Pulsa una casilla del resultado y verás qué fila y qué columna se han combinado para obtenerla.',
    build: function (host, d) {
      var A = [[2, -1], [3, 5]], B = [[1, 4], [-2, 0]];
      var sel = [0, 0];
      var caja = U.el('div');
      host.appendChild(caja);
      var out = W.readout(host, '');
      function prod() {
        var C = [[0, 0], [0, 0]];
        for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
          C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j];
        }
        return C;
      }
      function tabla(M, nombre, resaltarFila, resaltarCol) {
        var h = '<div style="display:inline-block;margin:0 10px;text-align:center">' +
          '<div style="font-family:var(--serif);font-style:italic;font-size:0.9375rem;margin-bottom:4px">' + nombre + '</div>' +
          '<table style="border-collapse:collapse;font-family:var(--mono);font-size:0.9375rem">';
        for (var i = 0; i < 2; i++) {
          h += '<tr>';
          for (var j = 0; j < 2; j++) {
            var on = (resaltarFila === i) || (resaltarCol === j);
            h += '<td style="padding:6px 12px;border:1px solid var(--line);' +
              (on ? 'background:var(--accent-soft);color:var(--accent-ink);font-weight:700' : '') + '">' +
              M[i][j] + '</td>';
          }
          h += '</tr>';
        }
        return h + '</table></div>';
      }
      function pinta() {
        var C = prod();
        var h = '<div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap">' +
          tabla(A, 'A', sel[0], null) +
          '<span style="font-size:1.25rem">·</span>' +
          tabla(B, 'B', null, sel[1]) +
          '<span style="font-size:1.25rem">=</span>' +
          '<div style="display:inline-block;margin:0 10px;text-align:center">' +
          '<div style="font-family:var(--serif);font-style:italic;font-size:0.9375rem;margin-bottom:4px">A·B</div>' +
          '<table style="border-collapse:collapse;font-family:var(--mono);font-size:0.9375rem">';
        for (var i = 0; i < 2; i++) {
          h += '<tr>';
          for (var j = 0; j < 2; j++) {
            var on = (sel[0] === i && sel[1] === j);
            h += '<td data-i="' + i + '" data-j="' + j + '" style="padding:6px 12px;cursor:pointer;' +
              'border:1px solid var(--line);' +
              (on ? 'background:var(--ok);color:#fff;font-weight:700' : '') + '">' + C[i][j] + '</td>';
          }
          h += '</tr>';
        }
        h += '</table></div></div>';
        caja.innerHTML = h;
        U.$$('td[data-i]', caja).forEach(function (td) {
          td.addEventListener('click', function () {
            sel = [Number(td.getAttribute('data-i')), Number(td.getAttribute('data-j'))];
            pinta();
          });
        });
        var i0 = sel[0], j0 = sel[1];
        out.set('$c_{' + (i0 + 1) + (j0 + 1) + '} = ' +
          A[i0][0] + '\\cdot' + (B[0][j0] < 0 ? '(' + B[0][j0] + ')' : B[0][j0]) + ' + ' +
          A[i0][1] + '\\cdot' + (B[1][j0] < 0 ? '(' + B[1][j0] + ')' : B[1][j0]) + ' = ' + C[i0][j0] + '$' +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Fila ' + (i0 + 1) + ' de A por columna ' +
          (j0 + 1) + ' de B.</span>');
      }
      W.buttons(host, [{
        t: '↻ Otras matrices', cls: 'btn--main', on: function () {
          var r = U.rng();
          A = [[r.pm(0, 5), r.pm(0, 5)], [r.pm(0, 5), r.pm(0, 5)]];
          B = [[r.pm(0, 5), r.pm(0, 5)], [r.pm(0, 5), r.pm(0, 5)]];
          pinta();
        }
      }]);
      W.hint(host, 'Haz clic en cualquier casilla verde del resultado.');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El producto de matrices es la operación más ejecutada del planeta. Cada fotograma de un ' +
    'videojuego mueve, gira y proyecta miles de puntos multiplicando matrices; las tarjetas gráficas ' +
    'existen para hacer justamente eso a toda velocidad. Y las redes neuronales que están detrás de ' +
    'cualquier inteligencia artificial son, por dentro, cadenas de productos de matrices: entrenar ' +
    'un modelo consiste en repetir esta operación billones de veces.');

  p.demo({
    title: 'Girar y luego estirar no es estirar y luego girar',
    intro: 'A es un giro de 90° y B estira el eje horizontal al doble. El cuadrado azul se transforma con el producto elegido. Cambia el orden y compara: el resultado no es el mismo, y por eso A·B ≠ B·A.',
    build: function (host) {
      var orden = 'AB';
      var A = [[0, -1], [1, 0]], B = [[2, 0], [0, 1]];
      function aplica(M, v) { return [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]]; }
      function prod(M, N) {
        return [[M[0][0] * N[0][0] + M[0][1] * N[1][0], M[0][0] * N[0][1] + M[0][1] * N[1][1]],
          [M[1][0] * N[0][0] + M[1][1] * N[1][0], M[1][0] * N[0][1] + M[1][1] * N[1][1]]];
      }
      var cuadrado = [[0, 0], [1, 0], [1, 1], [0, 1]];
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -2.6, xmax: 2.6, ymin: -2.2, ymax: 2.2, height: 290,
        draw: function (g) {
          var P = orden === 'AB' ? prod(A, B) : prod(B, A);
          g.poly(cuadrado, { color: 0, fillAlpha: 0.15, w: 1.4 });
          g.poly(cuadrado.map(function (q) { return aplica(P, q); }), { color: 1, fillAlpha: 0.3, w: 2.2 });
          var e = aplica(P, [1, 0]);
          g.point(1, 0, { color: 0, r: 4 });
          g.point(e[0], e[1], { color: 1, r: 5, label: 'imagen de (1, 0)' });
        }
      });
      function pinta() {
        var P = orden === 'AB' ? prod(A, B) : prod(B, A);
        out.set('$' + (orden === 'AB' ? 'A\\cdot B' : 'B\\cdot A') + ' = ' + ML.matTex(P) + '$<br>' +
          (orden === 'AB' ? 'En $A\\cdot B$ se aplica <strong>primero $B$</strong> (estirar) y después $A$ (girar): los productos se leen de derecha a izquierda, como una composición de funciones.'
            : 'En $B\\cdot A$ se aplica primero $A$ (girar) y después $B$ (estirar). El cuadrado acaba estirado en otra dirección.'));
        plot.render();
      }
      W.chips(host, [{ label: 'A · B', value: 'AB' }, { label: 'B · A', value: 'BA' }], { value: orden, on: function (v) { orden = v; pinta(); } });
      pinta();
    }
  });

  p.section('El determinante');

  p.text('El <strong>determinante</strong> es un número que se asocia a toda matriz cuadrada y que ' +
    'concentra muchísima información sobre ella.');

  p.formulas([
    '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc',
    '\\begin{vmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{vmatrix} = aei + bfg + cdh - ceg - bdi - afh'
  ], 'orden 2 y regla de Sarrus para orden 3',
    'Las barras verticales rectas se leen «determinante de», y no son lo mismo que los paréntesis: ' +
    'con paréntesis es una matriz, con barras es un número.<br><br>El de orden 2 se dice: <em>«a por ' +
    'de, menos be por ce»</em>, y es la diagonal principal menos la otra.<br><br>Los seis términos del ' +
    'de orden 3 <strong>no hay que memorizarlos</strong>: salen de un dibujo. Ese dibujo, y la razón ' +
    'de que los signos vayan así, está en el párrafo siguiente.');

  p.text('Los seis sumandos del determinante de orden 3 asustan hasta que se ve de dónde salen. La ' +
    'regla de Sarrus consiste en <strong>copiar las dos primeras columnas a la derecha</strong> de la ' +
    'tabla, dejando una parrilla de tres por cinco. Entonces se trazan las tres diagonales que bajan ' +
    'hacia la derecha y se suman sus productos, y luego las tres que bajan hacia la izquierda y se ' +
    'restan. Nada más. Los seis términos son esas seis diagonales, y los signos dependen solo de hacia ' +
    'dónde baja cada una.');

  p.note('La regla de Sarrus sirve <strong>únicamente</strong> para matrices de tres por tres. Con ' +
    'cuatro por cuatro no funciona, por mucho que la parrilla parezca prometer lo mismo: ahí hacen ' +
    'falta 24 términos y hay que recurrir al desarrollo por adjuntos. Es uno de los errores más ' +
    'castigados en un examen.', 'warn', 'Solo para 3×3');

  p.text('Su significado geométrico es precioso: en el plano, $|\\det A|$ es el <strong>área</strong> ' +
    'del paralelogramo que forman los vectores fila de $A$. En el espacio, el volumen del ' +
    'paralelepípedo. Y el signo indica si la transformación conserva la orientación o la invierte.');

  p.demo({
    title: 'El determinante es un área',
    intro: 'Arrastra los dos vectores. El área del paralelogramo que forman es exactamente el valor absoluto del determinante.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.board(host, {
        xmin: -7, xmax: 7, ymin: -5, ymax: 5, height: 330,
        handles: {
          U: { x: 3, y: 1, label: 'u', color: 0, constrain: snap },
          V: { x: 1, y: 3, label: 'v', color: 1, constrain: snap }
        },
        draw: function (g) {
          var u = g.h('U'), v = g.h('V');
          g.poly([[0, 0], [u.x, u.y], [u.x + v.x, u.y + v.y], [v.x, v.y]],
            { color: 2, fill: 2, fillAlpha: .22, w: 1.6 });
          g.vec(0, 0, u.x, u.y, { color: 0, w: 3 });
          g.vec(0, 0, v.x, v.y, { color: 1, w: 3 });
          var det = u.x * v.y - u.y * v.x;
          out.set('$\\det\\begin{pmatrix}' + u.x + ' & ' + u.y + ' \\\\ ' + v.x + ' & ' + v.y +
            '\\end{pmatrix} = ' + u.x + '\\cdot' + v.y + ' - ' + u.y + '\\cdot' + v.x + ' = ' + det + '$<br>' +
            'Área del paralelogramo: $|' + det + '| = ' + Math.abs(det) + '$' +
            (det === 0 ? '<br><strong style="color:var(--bad)">Determinante cero: los vectores están alineados ' +
              'y el paralelogramo se ha aplastado. La matriz no tiene inversa.</strong>' : ''));
        }
      });
      function snap(h) { h.x = Math.round(h.x); h.y = Math.round(h.y); }
      W.hint(host, 'Prueba a poner los dos vectores en la misma dirección: el determinante se anula.');
    }
  });

  p.hist('Los determinantes son más antiguos que las matrices, que es lo contrario de lo que parece al ' +
    'estudiarlos. Se usaban para resolver sistemas desde el siglo XVII —Seki en Japón y Leibniz en ' +
    'Europa, casi a la vez— y solo en 1858 Cayley se dio cuenta de que la tabla de números en sí ' +
    'misma era un objeto interesante, con sus propias operaciones. Es decir, primero se inventó el ' +
    'cálculo y después el objeto sobre el que se calcula.');

  p.section('Matriz inversa');

  p.text('La <strong>inversa</strong> $A^{-1}$ es la matriz que deshace lo que hace $A$:');

  p.formula('A\\cdot A^{-1} = A^{-1}\\cdot A = I', 'I es la matriz identidad');

  p.text('Y no todas las matrices tienen inversa. La condición es exactamente esta:');

  p.formula('\\exists A^{-1} \\iff \\det A \\ne 0', 'matriz regular (o inversible)',
    'El símbolo $\\exists$ es una E del revés y se lee <strong>«existe»</strong>; $A^{-1}$ se dice ' +
      '«a inversa» —no «a elevado a menos uno»— y $\\det A$ es «determinante de a».<br><br>Entera: ' +
      '<em>«existe la matriz inversa de a si y solo si el determinante de a es distinto de ' +
      'cero»</em>.<br><br>Y lo que significa: el determinante es el examen que decide si la ' +
      'transformación se puede deshacer. Si vale cero, aplastó el espacio y no hay vuelta atrás.');

  p.text('Tiene todo el sentido con la interpretación del área: si el determinante es cero, la ' +
    'transformación aplasta el plano sobre una recta, y una vez aplastado no hay forma de volver atrás.');

  p.formula('\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}',
    'inversa de una matriz 2×2');

  /* ================= EJERCICIOS ================= */
  p.util('La inversa es el «deshacer». Si una matriz codifica una transformación —girar una imagen, ' +
    'mezclar unas señales, cifrar un mensaje—, su inversa la revierte. Por eso el hecho de que una ' +
    'matriz con determinante cero no tenga inversa no es una curiosidad: significa que esa ' +
    'transformación <strong>ha perdido información</strong> y ya no se puede volver atrás, igual que ' +
    'no se puede reconstruir una foto a partir de su sombra.');

  p.section('Practica');

  p.exercise({
    title: 'Determinante de orden 2',
    level: 'basico',
    gen: function (r) {
      var m = [[r.pm(0, 9), r.pm(0, 9)], [r.pm(0, 9), r.pm(0, 9)]];
      return { m: m, det: ML.det2(m) };
    },
    ask: function (d) { return 'Calcula $\\det ' + ML.matTex(d.m) + '$'; },
    fields: [{ name: 'v', label: 'Determinante', w: 'tiny' }],
    sol: function (d) { return { v: d.det }; },
    hint: function () { return 'Producto de la diagonal principal menos producto de la secundaria.'; },
    steps: function (d) {
      return ['$\\det = ad - bc$',
        '$= ' + d.m[0][0] + '\\cdot(' + d.m[1][1] + ') - (' + d.m[0][1] + ')\\cdot(' + d.m[1][0] + ')$',
        '$= ' + (d.m[0][0] * d.m[1][1]) + ' - (' + (d.m[0][1] * d.m[1][0]) + ') = ' + d.det + '$',
        d.det === 0 ? 'Es cero: la matriz <strong>no tiene inversa</strong>.'
          : 'No es cero, así que la matriz sí tiene inversa.'];
    },
    answer: function (d) { return String(d.det); }
  });

  p.exercise({
    title: 'Un elemento del producto',
    level: 'medio',
    gen: function (r) {
      var A = [[r.pm(0, 6), r.pm(0, 6)], [r.pm(0, 6), r.pm(0, 6)]];
      var B = [[r.pm(0, 6), r.pm(0, 6)], [r.pm(0, 6), r.pm(0, 6)]];
      var i = r.int(0, 1), j = r.int(0, 1);
      return { A: A, B: B, i: i, j: j, val: A[i][0] * B[0][j] + A[i][1] * B[1][j] };
    },
    ask: function (d) {
      return 'Sean $A = ' + ML.matTex(d.A) + '$ y $B = ' + ML.matTex(d.B) + '$. ' +
        'Calcula el elemento $c_{' + (d.i + 1) + (d.j + 1) + '}$ de $A\\cdot B$.';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) { return 'Fila ' + (d.i + 1) + ' de $A$ por columna ' + (d.j + 1) + ' de $B$: multiplica término a término y suma.'; },
    steps: function (d) {
      return ['Fila ' + (d.i + 1) + ' de $A$: $(' + d.A[d.i].join(', ') + ')$.',
        'Columna ' + (d.j + 1) + ' de $B$: $(' + d.B[0][d.j] + ', ' + d.B[1][d.j] + ')$.',
        '$c_{' + (d.i + 1) + (d.j + 1) + '} = ' + d.A[d.i][0] + '\\cdot(' + d.B[0][d.j] + ') + ' +
        d.A[d.i][1] + '\\cdot(' + d.B[1][d.j] + ') = ' + d.val + '$'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Determinante de orden 3 (Sarrus)',
    level: 'medio',
    gen: function (r) {
      var m = [];
      for (var i = 0; i < 3; i++) m.push([r.pm(0, 5), r.pm(0, 5), r.pm(0, 5)]);
      return { m: m, det: ML.det3(m) };
    },
    ask: function (d) { return 'Calcula $\\det ' + ML.matTex(d.m) + '$ por la regla de Sarrus.'; },
    fields: [{ name: 'v', label: 'Determinante', w: 'tiny' }],
    sol: function (d) { return { v: d.det }; },
    hint: function () { return 'Tres productos «hacia abajo a la derecha» que suman, y tres «hacia abajo a la izquierda» que restan.'; },
    steps: function (d) {
      var m = d.m;
      var pos = m[0][0] * m[1][1] * m[2][2] + m[0][1] * m[1][2] * m[2][0] + m[0][2] * m[1][0] * m[2][1];
      var neg = m[0][2] * m[1][1] * m[2][0] + m[0][1] * m[1][0] * m[2][2] + m[0][0] * m[1][2] * m[2][1];
      return ['Diagonales que <strong>suman</strong>: $' +
        m[0][0] + '\\cdot' + m[1][1] + '\\cdot' + m[2][2] + ' + ' +
        m[0][1] + '\\cdot' + m[1][2] + '\\cdot' + m[2][0] + ' + ' +
        m[0][2] + '\\cdot' + m[1][0] + '\\cdot' + m[2][1] + ' = ' + pos + '$',
        'Diagonales que <strong>restan</strong>: $' +
        m[0][2] + '\\cdot' + m[1][1] + '\\cdot' + m[2][0] + ' + ' +
        m[0][1] + '\\cdot' + m[1][0] + '\\cdot' + m[2][2] + ' + ' +
        m[0][0] + '\\cdot' + m[1][2] + '\\cdot' + m[2][1] + ' = ' + neg + '$',
        '$\\det = ' + pos + ' - (' + neg + ') = ' + d.det + '$'];
    },
    answer: function (d) { return String(d.det); }
  });

  p.exercise({
    title: 'Un producto completo',
    level: 'medio',
    gen: function (r) {
      var A = [[r.pm(0, 4), r.pm(0, 4), r.pm(0, 4)], [r.pm(0, 4), r.pm(0, 4), r.pm(0, 4)]];
      var B = [[r.pm(0, 3), r.pm(0, 3)], [r.pm(0, 3), r.pm(0, 3)], [r.pm(0, 3), r.pm(0, 3)]];
      var C = A.map(function (f) { return [0, 1].map(function (j) { return f[0] * B[0][j] + f[1] * B[1][j] + f[2] * B[2][j]; }); });
      return { A: A, B: B, C: C };
    },
    ask: function (d) {
      return 'Calcula $A\\cdot B$ siendo $A = ' + ML.matTex(d.A) + '$ y $B = ' + ML.matTex(d.B) + '$. ¿Qué dimensión tiene el resultado?';
    },
    fields: [{ name: 'a', label: '$c_{11}$', w: 'tiny' }, { name: 'b', label: '$c_{12}$', w: 'tiny' }, { name: 'c', label: '$c_{21}$', w: 'tiny' }, { name: 'd', label: '$c_{22}$', w: 'tiny' }],
    sol: function (d) { return { a: d.C[0][0], b: d.C[0][1], c: d.C[1][0], d: d.C[1][1] }; },
    hint: function () {
      return ['$A$ es 2×3 y $B$ es 3×2: se pueden multiplicar (3 = 3) y el resultado es 2×2.',
        'Cada casilla $c_{ij}$ es la fila $i$ de $A$ por la columna $j$ de $B$: tres productos sumados.'];
    },
    steps: function (d) {
      var s = ['Dimensiones: $(2\\times 3)\\cdot(3\\times 2) = 2\\times 2$.'];
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
        s.push('$c_{' + (i + 1) + (j + 1) + '} = ' + [0, 1, 2].map(function (k) { return d.A[i][k] + '\\cdot' + (d.B[k][j] < 0 ? '(' + d.B[k][j] + ')' : d.B[k][j]); }).join(' + ') + ' = ' + d.C[i][j] + '$');
      }
      return s;
    },
    answer: function (d) { return '$' + ML.matTex(d.C) + '$'; }
  });

  p.exercise({
    title: 'Matriz inversa 2×2',
    level: 'avanzado',
    gen: function (r) {
      var m;
      var guard = 0;
      do {
        m = [[r.pm(1, 5), r.pm(0, 5)], [r.pm(0, 5), r.pm(1, 5)]];
      } while (ML.det2(m) === 0 && ++guard < 30);
      var det = ML.det2(m);
      if (det === 0) return null;
      return { m: m, det: det, inv: [[m[1][1] / det, -m[0][1] / det], [-m[1][0] / det, m[0][0] / det]] };
    },
    ask: function (d) {
      return 'Calcula la inversa de $A = ' + ML.matTex(d.m) + '$ y da sus cuatro elementos ' +
        '(cuatro decimales).';
    },
    fields: [
      { name: 'a', label: '$a_{11}$', w: 'tiny' }, { name: 'b', label: '$a_{12}$', w: 'tiny' },
      { name: 'c', label: '$a_{21}$', w: 'tiny' }, { name: 'd', label: '$a_{22}$', w: 'tiny' }
    ],
    sol: function (d) {
      return {
        a: U.round(d.inv[0][0], 6), b: U.round(d.inv[0][1], 6),
        c: U.round(d.inv[1][0], 6), d: U.round(d.inv[1][1], 6)
      };
    },
    tol: 3e-4,
    hint: function (d) { return 'Intercambia la diagonal principal, cambia el signo de la otra y divide todo entre $\\det A = ' + d.det + '$.'; },
    steps: function (d) {
      return ['Determinante: $\\det A = ' + d.det + '$. Como no es cero, la inversa existe.',
        'Se intercambian $a$ y $d$, y se cambian de signo $b$ y $c$: $\\begin{pmatrix}' +
        d.m[1][1] + ' & ' + (-d.m[0][1]) + ' \\\\ ' + (-d.m[1][0]) + ' & ' + d.m[0][0] + '\\end{pmatrix}$',
        'Se divide todo entre el determinante: $A^{-1} = \\dfrac{1}{' + d.det + '}\\begin{pmatrix}' +
        d.m[1][1] + ' & ' + (-d.m[0][1]) + ' \\\\ ' + (-d.m[1][0]) + ' & ' + d.m[0][0] + '\\end{pmatrix}$',
        'Comprobación: al multiplicar $A\\cdot A^{-1}$ tiene que salir la identidad.'];
    },
    answer: function (d) {
      return '$A^{-1} = ' + ML.matTex([[U.fmt(d.inv[0][0], 4), U.fmt(d.inv[0][1], 4)],
        [U.fmt(d.inv[1][0], 4), U.fmt(d.inv[1][1], 4)]]) + '$';
    }
  });

  p.exercise({
    title: 'La traspuesta de un producto',
    level: 'avanzado',
    gen: function (r) {
      var A = [[r.pm(0, 4), r.pm(0, 4)], [r.pm(0, 4), r.pm(0, 4)]], B = [[r.pm(0, 4), r.pm(0, 4)], [r.pm(0, 4), r.pm(0, 4)]];
      function pr(M, N) { return [[M[0][0] * N[0][0] + M[0][1] * N[1][0], M[0][0] * N[0][1] + M[0][1] * N[1][1]], [M[1][0] * N[0][0] + M[1][1] * N[1][0], M[1][0] * N[0][1] + M[1][1] * N[1][1]]]; }
      function tr(M) { return [[M[0][0], M[1][0]], [M[0][1], M[1][1]]]; }
      var bien = tr(pr(A, B)), mal = pr(tr(A), tr(B));
      return { A: A, B: B, bien: bien, mal: mal, i: r.int(0, 1), j: r.int(0, 1) };
    },
    ask: function (d) {
      return 'Con $A = ' + ML.matTex(d.A) + '$ y $B = ' + ML.matTex(d.B) + '$, calcula el elemento de la fila ' + (d.i + 1) + ' y columna ' + (d.j + 1) + ' de $(A\\cdot B)^t$.';
    },
    fields: [{ name: 'v', label: 'elemento', w: 'tiny' }],
    sol: function (d) { return { v: d.bien[d.i][d.j] }; },
    errores: [{
      si: function (v, d) { return d.mal[d.i][d.j] !== d.bien[d.i][d.j] && v.v === d.mal[d.i][d.j]; },
      msg: 'Has calculado $A^t\\cdot B^t$. La traspuesta de un producto cambia el orden: $(AB)^t = B^t A^t$.'
    }],
    hint: function () { return ['Calcula primero $A\\cdot B$ y después trasponlo.', 'O usa la propiedad $(AB)^t = B^t\\cdot A^t$, con el orden cambiado.']; },
    steps: function (d) {
      var AB = [[d.bien[0][0], d.bien[1][0]], [d.bien[0][1], d.bien[1][1]]];
      return ['$A\\cdot B = ' + ML.matTex(AB) + '$', '$(A\\cdot B)^t = ' + ML.matTex(d.bien) + '$', 'El elemento pedido vale $' + d.bien[d.i][d.j] + '$.'];
    },
    answer: function (d) { return String(d.bien[d.i][d.j]); }
  });

  p.keys([
    'Matriz = tabla de números. $a_{ij}$: primero fila, después columna.',
    'La traspuesta cambia filas por columnas; es simétrica si $A^t = A$, y $(AB)^t = B^tA^t$.',
    'Multiplicar matrices es encadenar transformaciones: $AB$ aplica primero $B$ y después $A$.',
    'El producto es fila por columna, y exige que las columnas de la primera igualen las filas de la segunda.',
    'El producto de matrices <strong>no es conmutativo</strong>.',
    'El determinante de orden 2 es $ad-bc$; el de orden 3, por Sarrus.',
    'Geométricamente, $|\\det|$ es el área (o el volumen) que generan los vectores de la matriz.',
    'Existe inversa ⟺ el determinante no es cero.'
  ]);
});
