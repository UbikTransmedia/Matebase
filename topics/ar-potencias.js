/* Tema: Potencias, raíces y notación científica */
Course.topic('ar-potencias', function (p) {

  p.text('Una <strong>potencia</strong> es una multiplicación abreviada: multiplicar un número por sí ' +
    'mismo varias veces. La <em>base</em> es lo que se repite y el <em>exponente</em>, cuántas veces.');

  p.formula('a^n = \\underbrace{a \\cdot a \\cdot \\dots \\cdot a}_{n \\text{ veces}} \\qquad 2^5 = 32');

  p.note('$2^5$ no es $2\\cdot 5$. Es $2\\cdot2\\cdot2\\cdot2\\cdot2$. Parece una tontería decirlo, pero es ' +
    'el error número uno con potencias.', 'warn');

  p.demo({
    title: 'Lo que significa realmente un exponente',
    intro: 'Compara cómo crece una multiplicación normal frente a una potencia. El eje vertical está en escala normal: por eso la potencia se sale de la pantalla enseguida.',
    build: function (host, d) {
      var base = 2;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 8, ymin: 0, ymax: 70, height: 280,
        xlabel: 'n', ylabel: null,
        draw: function (g) {
          g.fn(function (x) { return base * x; }, { color: 3, w: 2.2, dash: true });
          g.fn(function (x) { return Math.pow(base, x); }, { color: 0, w: 2.6 });
          for (var n = 0; n <= 7; n++) {
            var y = Math.pow(base, n);
            if (y <= 70) g.point(n, y, { color: 0, r: 4 });
          }
          g.text(6.6, base * 6.6 + 4, base + '·n', { color: 3, size: 13, align: 'center' });
          var xr = Math.log(65) / Math.log(base);
          g.text(Math.min(xr, 7.2), 62, base + '^n', { color: 0, size: 14, align: 'right' });
        }
      });
      function paint() {
        var l = [];
        for (var n = 1; n <= 8; n++) l.push(Math.pow(base, n));
        out.set('$' + base + '^1, ' + base + '^2, \\dots, ' + base + '^8$ &nbsp;=&nbsp; ' + l.join(', ') +
          '<br><span style="font-size:12.5px;color:var(--ink-faint)">Frente a la multiplicación ' +
          base + '·n, que solo llega a ' + (base * 8) + '.</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'base', min: 2, max: 5, step: 1, value: 2, dec: 0,
        on: function (v) { base = v; paint(); }
      });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Propiedades de las potencias');

  p.text('Todas salen de contar factores. No hay que aprendérselas de memoria: hay que entender de ' +
    'dónde vienen y entonces no se olvidan.');

  p.formulas([
    'a^m \\cdot a^n = a^{m+n}',
    '\\frac{a^m}{a^n} = a^{m-n}',
    '(a^m)^n = a^{m\\cdot n}',
    '(a\\cdot b)^n = a^n\\cdot b^n \\qquad \\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}'
  ], 'las cinco que hay que saber');

  p.text('Por ejemplo, $a^3\\cdot a^2 = (aaa)(aa) = aaaaa = a^5$: los exponentes se suman porque ' +
    'simplemente estás juntando factores.');

  p.sub('Los dos casos raros');

  p.formulas(['a^0 = 1 \\quad (a \\ne 0)', 'a^{-n} = \\frac{1}{a^n}']);

  p.text('No son convenios caprichosos. Si $\\frac{a^m}{a^n} = a^{m-n}$ tiene que seguir valiendo cuando ' +
    '$m=n$, entonces $\\frac{a^3}{a^3} = a^0$, y esa división vale $1$. Y si $m<n$: ' +
    '$\\frac{a^2}{a^5} = \\frac{1}{a^3} = a^{-3}$. Las reglas obligan.');

  p.note('Ojo con el signo: $(-2)^4 = 16$ (par: positivo), pero $-2^4 = -16$ (aquí el menos no está ' +
    'elevado). Y $(-2)^3 = -8$ (impar: negativo).', 'warn', 'Bases negativas');

  /* ---------------------------------------------------------------- */
  p.util('Cuando una magnitud abarca rangos gigantescos se mide con exponentes, y las propiedades que ' +
    'acabas de ver se convierten en las reglas de esas escalas: el decibelio, la magnitud de un ' +
    'terremoto y el pH funcionan así. Que la escala Richter sea de potencias significa que un ' +
    'terremoto de 7 no es «un poco peor» que uno de 6, sino que libera unas 30 veces más energía. Y ' +
    'la fuerza de una contraseña es lo mismo: con 8 caracteres de un alfabeto de 94 símbolos hay ' +
    '$94^8$ combinaciones, y añadir un solo carácter las multiplica por 94.');

  p.section('Raíces');

  p.text('La <strong>raíz</strong> deshace la potencia: $\\sqrt[n]{a}$ es el número que elevado a $n$ da $a$.');

  p.formula('\\sqrt[3]{125} = 5 \\quad \\text{porque} \\quad 5^3 = 125');

  p.text('Toda raíz se puede escribir como potencia de exponente fraccionario, y esto unifica los dos ' +
    'mundos: a partir de aquí, raíces y potencias son lo mismo y comparten propiedades.');

  p.formula('\\sqrt[n]{a^m} = a^{\\frac{m}{n}}', 'la traducción clave');

  p.text('Para simplificar una raíz cuadrada se descompone el radicando y se sacan los factores que ' +
    'estén repetidos dos veces:');

  p.formula('\\sqrt{72} = \\sqrt{2^3\\cdot 3^2} = \\sqrt{2^2\\cdot 3^2\\cdot 2} = 6\\sqrt{2}');

  /* ---------------------------------------------------------------- */
  p.section('Notación científica');

  p.text('Para manejar números absurdamente grandes o pequeños se escriben como ' +
    '<strong>un número entre 1 y 10 multiplicado por una potencia de 10</strong>.');

  p.formulas([
    '299\\,792\\,458 \\ \\text{m/s} = 2{,}99792458 \\cdot 10^{8}',
    '0{,}000\\,000\\,000\\,53\\ \\text{m} = 5{,}3\\cdot 10^{-10}'
  ]);

  p.text('El exponente cuenta cuántos lugares hay que mover la coma: a la derecha si es positivo ' +
    '(número grande), a la izquierda si es negativo (número pequeño).');

  p.demo({
    title: 'Mover la coma',
    intro: 'Cambia el exponente y mira cómo se desplaza la coma. Es literalmente lo único que hace la notación científica.',
    build: function (host, d) {
      var mant = 5.3, ex = 8;
      var out = W.readout(host, '');
      function paint() {
        var v = mant * Math.pow(10, ex);
        var plano;
        if (ex >= 0 && ex <= 15) plano = v.toLocaleString('es-ES', { maximumFractionDigits: 15 });
        else if (ex < 0 && ex >= -12) plano = v.toFixed(Math.min(15, -ex + 2)).replace('.', ',');
        else plano = '(demasiado ' + (ex > 0 ? 'grande' : 'pequeño') + ' para escribirlo entero)';
        out.set('$' + U.fmt(mant, 2) + ' \\cdot 10^{' + ex + '} = $ <strong>' + plano + '</strong>' +
          '<br><span style="font-size:12.5px;color:var(--ink-faint)">' +
          (ex >= 0 ? 'La coma se mueve ' + ex + ' lugares a la derecha.'
            : 'La coma se mueve ' + (-ex) + ' lugares a la izquierda.') + '</span>');
      }
      var row = W.row(host);
      W.slider(row, { label: 'mantisa', min: 1, max: 9.9, step: 0.1, value: mant, dec: 1, on: function (v) { mant = v; paint(); } });
      W.slider(row, { label: 'exponente', min: -12, max: 15, step: 1, value: ex, dec: 0, on: function (v) { ex = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Sin notación científica no se puede trabajar en ciencia: el radio de un átomo es $10^{-10}$ m y ' +
    'la distancia a la galaxia de Andrómeda $10^{22}$ m, y son cifras que ninguna calculadora ' +
    'escribiría entera. Su verdadero uso no es ahorrar ceros, sino permitir comparaciones de un ' +
    'vistazo: basta mirar el exponente para saber que algo es mil veces mayor que otra cosa, que es ' +
    'la manera en que un ingeniero decide si un efecto le importa o puede despreciarlo.');

  p.section('Practica');

  p.exercise({
    title: 'Aplica las propiedades',
    level: 'medio',
    gen: function (r) {
      var a = r.pick(['a', 'x', 'b']);
      var m = r.int(2, 9), n = r.int(2, 7), k = r.int(2, 4);
      var t = r.int(0, 3), tex, exp;
      if (t === 0) { tex = a + '^{' + m + '} \\cdot ' + a + '^{' + n + '}'; exp = m + n; }
      else if (t === 1) { tex = '\\dfrac{' + a + '^{' + (m + n) + '}}{' + a + '^{' + n + '}}'; exp = m; }
      else if (t === 2) { tex = '\\left(' + a + '^{' + m + '}\\right)^{' + k + '}'; exp = m * k; }
      else {
        tex = '\\dfrac{' + a + '^{' + m + '} \\cdot ' + a + '^{' + n + '}}{' + a + '^{' + k + '}}';
        exp = m + n - k;
      }
      return { a: a, tex: tex, exp: exp };
    },
    ask: function (d) {
      return 'Simplifica $' + d.tex + '$ como una sola potencia de $' + d.a + '$. ¿Cuánto vale el exponente?';
    },
    fields: [{ name: 'e', label: 'Exponente', w: 'tiny' }],
    sol: function (d) { return { e: d.exp }; },
    hint: function () { return 'Al multiplicar se suman exponentes; al dividir se restan; al elevar una potencia se multiplican.'; },
    steps: function (d) {
      return ['Recuerda: $a^m\\cdot a^n = a^{m+n}$, &nbsp; $a^m : a^n = a^{m-n}$, &nbsp; $(a^m)^n = a^{mn}$.',
        'Aplicando la propiedad que toca queda $' + d.a + '^{' + d.exp + '}$.'];
    },
    answer: function (d) { return '$' + d.a + '^{' + d.exp + '}$, exponente ' + d.exp + '.'; }
  });

  p.exercise({
    title: 'Potencias con signo y exponente cero o negativo',
    level: 'medio',
    gen: function (r) {
      var base = r.pick([-4, -3, -2, 2, 3, 5, 10]);
      var e = r.pick([-3, -2, -1, 0, 2, 3, 4]);
      var val = Math.pow(base, e);
      if (!isFinite(val) || Math.abs(val) > 10000 || (Math.abs(val) < 0.001 && val !== 0)) return null;
      return { base: base, e: e, val: val };
    },
    ask: function (d) {
      return 'Calcula $\\left(' + d.base + '\\right)^{' + d.e + '}$. ' +
        (d.e < 0 ? '<span style="font-size:14px;color:var(--ink-faint)">Puedes responder con fracción, por ejemplo <code>1/8</code>.</span>' : '');
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'tiny' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      if (d.e === 0) return 'Cualquier número distinto de cero elevado a 0 vale 1.';
      if (d.e < 0) return 'Exponente negativo: dale la vuelta. $a^{-n} = 1/a^{n}$.';
      return 'Exponente par → positivo; impar → conserva el signo de la base.';
    },
    steps: function (d) {
      var s = [];
      if (d.e === 0) s.push('Exponente cero: el resultado es $1$.');
      else if (d.e < 0) {
        s.push('$\\left(' + d.base + '\\right)^{' + d.e + '} = \\dfrac{1}{\\left(' + d.base + '\\right)^{' + (-d.e) + '}}$');
        s.push('$\\left(' + d.base + '\\right)^{' + (-d.e) + '} = ' + Math.pow(d.base, -d.e) + '$');
        s.push('Así que vale $' + ML.F(d.val).tex() + '$.');
      } else {
        s.push('Multiplicamos la base por sí misma ' + d.e + ' veces.');
        s.push('El signo: exponente ' + (d.e % 2 === 0 ? 'par → resultado positivo' : 'impar → conserva el signo de la base') + '.');
        s.push('Resultado: $' + d.val + '$.');
      }
      return s;
    },
    answer: function (d) { return '$' + (Number.isInteger(d.val) ? d.val : ML.F(d.val).tex()) + '$'; }
  });

  p.exercise({
    title: 'Simplificar una raíz cuadrada',
    level: 'medio',
    gen: function (r) {
      var fuera = r.int(2, 7), dentro = r.pick([2, 3, 5, 6, 7, 10, 11, 13, 15]);
      return { n: fuera * fuera * dentro, fuera: fuera, dentro: dentro };
    },
    ask: function (d) {
      return 'Simplifica $\\sqrt{' + d.n + '}$ dejándola en la forma $a\\sqrt{b}$ con $b$ lo menor posible.';
    },
    fields: [{ name: 'a', label: 'a (fuera)', w: 'tiny' }, { name: 'b', label: 'b (dentro)', w: 'tiny' }],
    sol: function (d) { return { a: d.fuera, b: d.dentro }; },
    hint: function (d) { return 'Descompón $' + d.n + ' = ' + ML.factorTex(d.n) + '$ y saca las parejas.'; },
    steps: function (d) {
      return ['$' + d.n + ' = ' + ML.factorTex(d.n) + '$',
        'Cada pareja de factores iguales sale de la raíz como uno solo.',
        '$\\sqrt{' + d.n + '} = \\sqrt{' + (d.fuera * d.fuera) + '\\cdot' + d.dentro + '} = ' +
        d.fuera + '\\sqrt{' + d.dentro + '}$',
        'Comprobación: $' + d.fuera + '\\sqrt{' + d.dentro + '} \\approx ' + U.fmt(Math.sqrt(d.n), 4) + '$.'];
    },
    answer: function (d) { return '$' + ML.sqrtTex(d.n) + '$'; }
  });

  p.exercise({
    title: 'Notación científica',
    level: 'medio',
    gen: function (r) {
      var mant = r.int(10, 999) / 100;
      var ex = r.pm(1, 9);
      var plano = mant * Math.pow(10, ex);
      var norm = mant, ne = ex;
      while (norm >= 10) { norm /= 10; ne++; }
      while (norm < 1) { norm *= 10; ne--; }
      return { mant: mant, ex: ex, ne: ne, norm: U.round(norm, 6) };
    },
    ask: function (d) {
      return 'Escribe $' + U.fmt(d.mant, 2) + ' \\cdot 10^{' + d.ex + '}$ en notación científica ' +
        'correcta (con la mantisa entre 1 y 10). ¿Qué exponente queda?';
    },
    fields: [{ name: 'e', label: 'Exponente', w: 'tiny' }],
    sol: function (d) { return { e: d.ne }; },
    hint: function () { return 'Mueve la coma hasta dejar una sola cifra delante y compensa con el exponente.'; },
    steps: function (d) {
      return ['La mantisa $' + U.fmt(d.mant, 2) + '$ ' +
        (d.mant >= 10 ? 'es mayor que 10: hay que moverla a la izquierda y subir el exponente.'
          : (d.mant < 1 ? 'es menor que 1: hay que moverla a la derecha y bajar el exponente.'
            : 'ya está entre 1 y 10.')),
        'Queda $' + U.fmt(d.norm, 4) + '\\cdot 10^{' + d.ne + '}$.'];
    },
    answer: function (d) { return '$' + U.fmt(d.norm, 4) + '\\cdot 10^{' + d.ne + '}$'; }
  });

  p.keys([
    'Potencia = multiplicación repetida. El exponente cuenta factores, no es un factor más.',
    'Multiplicar potencias de igual base suma exponentes; dividir, resta; elevar una potencia, multiplica.',
    '$a^0=1$ y $a^{-n}=\\frac{1}{a^n}$ no son caprichos: se deducen de las propiedades anteriores.',
    'Base negativa: exponente par → positivo; impar → negativo. Y $-2^4 \\ne (-2)^4$.',
    'Raíz y potencia son lo mismo: $\\sqrt[n]{a^m}=a^{m/n}$.',
    'Notación científica: mantisa entre 1 y 10, y el exponente cuenta los saltos de la coma.'
  ]);
});
