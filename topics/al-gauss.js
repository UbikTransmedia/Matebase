/* Tema: Sistemas por el método de Gauss */
Course.topic('al-gauss', function (p) {

  p.text('Con dos ecuaciones y dos incógnitas, sustitución o reducción bastan. Con tres, cuatro o ' +
    'cien, hace falta un método <strong>sistemático</strong>: algo que se pueda seguir mecánicamente ' +
    'sin pensar, y que además pueda programarse. Ese método es el de Gauss.');

  p.text('La idea es escribir el sistema como una tabla de números (la <strong>matriz ampliada</strong>) ' +
    'y transformarla, con operaciones que no cambian las soluciones, hasta dejarla <em>escalonada</em>: ' +
    'con ceros debajo de la diagonal.');

  p.formula('\\left(\\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\\\ 2 & -1 & 1 & 1 \\\\ 3 & 1 & 2 & 10 \\end{array}\\right)',
    'matriz ampliada del sistema');

  p.sub('Las tres operaciones permitidas');
  p.text('El método de Gauss consiste en ir simplificando el sistema hasta que se lea solo, y para eso ' +
    'hay tres jugadas legales. Lo importante no es memorizarlas sino entender por qué son legales: ' +
    'ninguna de las tres cambia las soluciones, solo cambian la forma de escribirlas. Es la misma ' +
    'licencia que tenías con la balanza, ahora aplicada a varias ecuaciones a la vez.');


  p.list([
    'Intercambiar dos filas.',
    'Multiplicar una fila por un número distinto de cero.',
    'Sumar a una fila un múltiplo de otra.'
  ], true);

  p.text('Ninguna de las tres cambia el conjunto de soluciones, porque las tres son reversibles. Por ' +
    'eso se puede transformar el sistema con total libertad.');

  p.demo({
    title: 'Escalonar paso a paso',
    intro: 'Pulsa para ir haciendo ceros debajo de la diagonal. Cuando la matriz esté escalonada, se despeja de abajo arriba.',
    build: function (host, d) {
      var orig = [[1, 2, -1, 3], [2, -1, 1, 1], [3, 1, 2, 10]];
      var M, paso, notas;
      var caja = U.el('div');
      host.appendChild(caja);
      var out = W.readout(host, '');

      function reset() {
        M = orig.map(function (f) { return f.slice(); });
        paso = 0;
        notas = 'Sistema de partida. El objetivo es hacer ceros bajo la diagonal.';
        pinta();
      }
      function pinta() {
        var h = '<div class="tbl-wrap"><table class="tbl"><tbody>';
        for (var i = 0; i < 3; i++) {
          h += '<tr>';
          for (var j = 0; j < 4; j++) {
            var esCero = (j < i);
            h += '<td class="num" style="font-family:var(--mono)' +
              (j === 3 ? ';border-left:2px solid var(--line);font-weight:600' : '') +
              (esCero && M[i][j] === 0 ? ';color:var(--ok)' : '') + '">' +
              U.fmt(M[i][j], 3) + '</td>';
          }
          h += '</tr>';
        }
        h += '</tbody></table></div>';
        caja.innerHTML = h;
        out.set(notas);
      }
      function op(dest, src, k, texto) {
        for (var j = 0; j < 4; j++) M[dest][j] = M[dest][j] + k * M[src][j];
        notas = texto;
        pinta();
      }
      function avanzar() {
        paso++;
        if (paso === 1) op(1, 0, -M[1][0] / M[0][0], 'Fila 2 menos ' + U.fmt(M[1][0] / M[0][0], 2) + ' veces la fila 1: ya hay un cero en la primera columna.');
        else if (paso === 2) op(2, 0, -M[2][0] / M[0][0], 'Fila 3 menos ' + U.fmt(M[2][0] / M[0][0], 2) + ' veces la fila 1: otro cero.');
        else if (paso === 3) op(2, 1, -M[2][1] / M[1][1], 'Fila 3 menos ' + U.fmt(M[2][1] / M[1][1], 2) + ' veces la fila 2: la matriz ya está escalonada.');
        else if (paso === 4) {
          var z = M[2][3] / M[2][2];
          var y = (M[1][3] - M[1][2] * z) / M[1][1];
          var x = (M[0][3] - M[0][1] * y - M[0][2] * z) / M[0][0];
          notas = 'Ahora se despeja de abajo arriba:<br>' +
            'De la última fila: $z = ' + U.fmt(z, 3) + '$.<br>' +
            'Sustituyendo en la segunda: $y = ' + U.fmt(y, 3) + '$.<br>' +
            'Y en la primera: $x = ' + U.fmt(x, 3) + '$.';
          pinta();
        } else { paso = 4; }
      }
      W.buttons(host, [
        { t: 'Siguiente paso →', cls: 'btn--main', on: avanzar },
        { t: '↺ Reiniciar', on: reset }
      ]);
      reset();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Discusión: los tres finales posibles');

  p.text('Una vez escalonada la matriz, mirando la última fila ya se sabe todo:');

  p.table(['Última fila', 'Significa', 'Tipo de sistema'],
    [['$0\\ 0\\ a \\mid b$ con $a \\ne 0$', 'da un valor para $z$', 'compatible <strong>determinado</strong>'],
     ['$0\\ 0\\ 0 \\mid 0$', 'la ecuación sobraba', 'compatible <strong>indeterminado</strong>'],
     ['$0\\ 0\\ 0 \\mid b$ con $b \\ne 0$', '«$0 = b$», imposible', '<strong>incompatible</strong>']]);

  p.note('Esa última fila $0\\ 0\\ 0 \\mid 5$ dice literalmente «cero igual a cinco». No hay ningún ' +
    'trío de números que lo cumpla: el sistema no tiene solución. Es la manera más limpia de ' +
    'descubrirlo.', null, 'La fila delatora');

  p.hist('Gauss desarrolló su método hacia 1809 por una necesidad muy concreta: acababa de aparecer y ' +
    'perderse el asteroide Ceres, del que solo existían unas pocas observaciones antes de que se ' +
    'ocultara tras el Sol. Gauss ajustó su órbita resolviendo un sistema enorme por eliminación, ' +
    'predijo dónde reaparecería y acertó. Tenía veinticuatro años y aquello lo hizo célebre en toda ' +
    'Europa.');

  p.sub('Rouché-Frobenius, en una línea');

  p.text('El teorema que formaliza todo esto compara el <strong>rango</strong> de la matriz de ' +
    'coeficientes con el de la ampliada. El rango es el número de filas no nulas que quedan al escalonar:');

  p.formulas([
    '\\operatorname{rg}(A) \\ne \\operatorname{rg}(A^*) \\Rightarrow \\text{incompatible}',
    '\\operatorname{rg}(A) = \\operatorname{rg}(A^*) = n \\Rightarrow \\text{compatible determinado}',
    '\\operatorname{rg}(A) = \\operatorname{rg}(A^*) < n \\Rightarrow \\text{compatible indeterminado}'
  ], 'n es el número de incógnitas',
    '$\\operatorname{rg}(A)$ se dice «rango de A»: el número de filas que quedan sin anularse al ' +
      'escalonar. $A^*$ se dice «A ampliada» y es la matriz con la columna de los términos ' +
      'independientes pegada.<br><br>Se lee: <em>«si el rango de A es distinto del rango de A ' +
      'ampliada, el sistema es incompatible»</em>.<br><br>En cristiano: si al escalonar aparece una ' +
      'fila que dice «cero igual a algo distinto de cero», el sistema se contradice a sí mismo y no ' +
      'hay solución posible.');

  /* ================= EJERCICIOS ================= */
  p.util('El método de Gauss es probablemente el algoritmo más ejecutado de la ingeniería. Calcular las ' +
    'tensiones de una estructura, la corriente de cada rama de un circuito, cómo se reparte el ' +
    'caudal en una red de tuberías o cómo se distribuye el calor en una pieza acaba siempre en un ' +
    'sistema de muchas ecuaciones que se resuelve así. Con miles de incógnitas nadie lo hace a mano, ' +
    'pero el ordenador ejecuta exactamente los pasos que estás aprendiendo.');

  p.section('Practica');

  p.exercise({
    title: 'Sistema 3×3 con solución única',
    level: 'medio',
    gen: function (r) {
      var x = r.pm(1, 5), y = r.pm(1, 5), z = r.pm(1, 5);
      var A = [];
      for (var i = 0; i < 3; i++) A.push([r.nz(-3, 3), r.nz(-3, 3), r.nz(-3, 3)]);
      if (Math.abs(ML.det3(A)) < 1e-9) return null;
      var b = A.map(function (f) { return f[0] * x + f[1] * y + f[2] * z; });
      return { A: A, b: b, x: x, y: y, z: z };
    },
    ask: function (d) {
      var eq = function (f, c) {
        return ML.termTex(f[0], 'x', 1, true) + ML.termTex(f[1], 'y', 1, false) +
          ML.termTex(f[2], 'z', 1, false) + ' = ' + c;
      };
      return 'Resuelve por Gauss: $\\begin{cases}' +
        eq(d.A[0], d.b[0]) + ' \\\\ ' + eq(d.A[1], d.b[1]) + ' \\\\ ' + eq(d.A[2], d.b[2]) +
        '\\end{cases}$';
    },
    fields: [
      { name: 'x', label: 'x =', w: 'tiny' }, { name: 'y', label: 'y =', w: 'tiny' },
      { name: 'z', label: 'z =', w: 'tiny' }
    ],
    sol: function (d) { return { x: d.x, y: d.y, z: d.z }; },
    tol: 1e-6,
    hint: function () { return 'Escribe la matriz ampliada, haz ceros bajo la diagonal y despeja de abajo arriba.'; },
    steps: function (d) {
      return ['Se escribe la matriz ampliada con los coeficientes y los términos independientes.',
        'Con la primera fila se hacen ceros en la primera columna de las otras dos.',
        'Con la segunda fila se hace cero en la segunda columna de la tercera.',
        'De la última ecuación sale $z = ' + d.z + '$.',
        'Sustituyendo hacia arriba: $y = ' + d.y + '$ y $x = ' + d.x + '$.',
        'Comprobación en la primera ecuación: $' + d.A[0][0] + '\\cdot(' + d.x + ') + ' +
        d.A[0][1] + '\\cdot(' + d.y + ') + ' + d.A[0][2] + '\\cdot(' + d.z + ') = ' + d.b[0] + '$ ✓'];
    },
    answer: function (d) { return 'x = ' + d.x + ', y = ' + d.y + ', z = ' + d.z; }
  });

  p.exercise({
    title: 'Clasifica el sistema',
    level: 'medio',
    gen: function (r) {
      var tipo = r.int(0, 2);
      var f1 = [r.nz(-3, 3), r.nz(-3, 3), r.pm(1, 6)];
      var k = r.pick([2, 3, -2]);
      if (tipo === 0) {                             // determinado
        var f2 = [r.nz(-3, 3), r.nz(-3, 3), r.pm(1, 6)];
        if (Math.abs(f1[0] * f2[1] - f2[0] * f1[1]) < 1e-9) return null;
        return { f1: f1, f2: f2, tipo: 0 };
      }
      if (tipo === 1) return { f1: f1, f2: [k * f1[0], k * f1[1], k * f1[2]], tipo: 1 };
      return { f1: f1, f2: [k * f1[0], k * f1[1], k * f1[2] + r.nz(1, 5)], tipo: 2 };
    },
    ask: function (d) {
      var eq = function (f) {
        return ML.termTex(f[0], 'x', 1, true) + ML.termTex(f[1], 'y', 1, false) + ' = ' + f[2];
      };
      return 'Escalona y clasifica: $\\begin{cases}' + eq(d.f1) + ' \\\\ ' + eq(d.f2) + '\\end{cases}$<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe <code>1</code> determinado, ' +
        '<code>2</code> indeterminado, <code>3</code> incompatible.</span>';
    },
    fields: [{ name: 't', label: 'Tipo', w: 'tiny' }],
    sol: function (d) { return { t: d.tipo + 1 }; },
    hint: function () { return 'Haz un cero en la primera columna de la segunda fila y mira qué queda.'; },
    steps: function (d) {
      var k = d.f2[0] / d.f1[0];
      var resto = [0, d.f2[1] - k * d.f1[1], d.f2[2] - k * d.f1[2]];
      return ['Restamos a la segunda fila $' + U.fmt(k, 3) + '$ veces la primera.',
        'Queda la fila $\\left(0 \\ \\ ' + U.fmt(resto[1], 3) + ' \\mid ' + U.fmt(resto[2], 3) + '\\right)$.',
        d.tipo === 0 ? 'El coeficiente de $y$ no es cero: se puede despejar. <strong>Compatible determinado</strong>.'
          : (d.tipo === 1 ? 'Toda la fila es cero: la segunda ecuación no aportaba nada. <strong>Compatible indeterminado</strong>.'
            : 'Los coeficientes son cero pero el término independiente no: sale «$0 = ' + U.fmt(resto[2], 3) +
            '$», que es imposible. <strong>Incompatible</strong>.')];
    },
    answer: function (d) {
      return ['Compatible determinado', 'Compatible indeterminado', 'Incompatible'][d.tipo];
    }
  });

  p.exercise({
    title: 'Problema con tres incógnitas',
    level: 'avanzado',
    gen: function (r) {
      var a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9);
      var p1 = r.int(2, 6), p2 = r.int(2, 6), p3 = r.int(2, 6);
      if (p1 === p2 || p2 === p3 || p1 === p3) return null;
      return {
        a: a, b: b, c: c, p1: p1, p2: p2, p3: p3,
        total: a + b + c, coste: a * p1 + b * p2 + c * p3, dif: a - b
      };
    },
    ask: function (d) {
      return 'En una tienda he comprado $' + d.total + '$ artículos entre bolígrafos ($' + d.p1 +
        '$ €), cuadernos ($' + d.p2 + '$ €) y gomas ($' + d.p3 + '$ €), y he pagado $' + d.coste +
        '$ €. Además, he comprado $' + Math.abs(d.dif) + '$ ' +
        (d.dif >= 0 ? 'bolígrafos más que cuadernos' : 'cuadernos más que bolígrafos') +
        '. ¿Cuántos <strong>bolígrafos</strong> he comprado?';
    },
    fields: [{ name: 'v', label: 'Bolígrafos', w: 'tiny' }],
    sol: function (d) { return { v: d.a }; },
    hint: function (d) {
      return 'Llama $x$, $y$, $z$ a las tres cantidades: $x+y+z = ' + d.total + '$, ' +
        '$' + d.p1 + 'x + ' + d.p2 + 'y + ' + d.p3 + 'z = ' + d.coste + '$ y $x - y = ' + d.dif + '$.';
    },
    steps: function (d) {
      return ['Incógnitas: $x$ bolígrafos, $y$ cuadernos, $z$ gomas.',
        'Cantidad total: $x + y + z = ' + d.total + '$.',
        'Dinero: $' + d.p1 + 'x + ' + d.p2 + 'y + ' + d.p3 + 'z = ' + d.coste + '$.',
        'Diferencia: $x - y = ' + d.dif + '$.',
        'Escalonando el sistema se obtiene $x = ' + d.a + '$, $y = ' + d.b + '$, $z = ' + d.c + '$.',
        'Comprobación: $' + d.a + '+' + d.b + '+' + d.c + ' = ' + d.total + '$ ✓'];
    },
    answer: function (d) { return d.a + ' bolígrafos (y ' + d.b + ' cuadernos, ' + d.c + ' gomas).'; }
  });

  p.keys([
    'Gauss es un método <strong>mecánico</strong>: por eso sirve para sistemas grandes y para programarlo.',
    'Tres operaciones legales: intercambiar filas, multiplicar una fila, sumar a una fila un múltiplo de otra.',
    'El objetivo es la forma escalonada: ceros debajo de la diagonal.',
    'Después se despeja de abajo arriba.',
    'La última fila lo dice todo: $0=b$ imposible → incompatible; $0=0$ → indeterminado.',
    'Rouché-Frobenius compara $\\operatorname{rg}(A)$ y $\\operatorname{rg}(A^*)$ con el número de incógnitas.'
  ]);
});
