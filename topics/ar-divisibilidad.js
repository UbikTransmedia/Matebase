/* Tema: Divisibilidad, primos, m.c.d. y m.c.m. */
Course.topic('ar-divisibilidad', function (p) {

  p.text('Decimos que $12$ es <strong>divisible</strong> entre $3$ porque la división es exacta: ' +
    'el resto vale cero. Se dice también que $3$ es <em>divisor</em> de $12$, y que $12$ es ' +
    '<em>múltiplo</em> de $3$. Son tres formas de decir lo mismo.');

  p.formula('12 = 3 \\cdot 4 \\quad \\Longleftrightarrow \\quad 3 \\mid 12', 'la barra se lee «divide a»');

  p.text('Los divisores de un número son siempre finitos (el mayor es él mismo); los múltiplos, en ' +
    'cambio, son infinitos.');

  /* ---------------------------------------------------------------- */
  p.section('Criterios de divisibilidad');

  p.text('Sirven para saber si una división será exacta <em>sin hacerla</em>. Los importantes:');

  p.table(['Divisible entre', 'Criterio', 'Ejemplo'],
    [['2', 'La última cifra es par (o 0)', '$3\\,74\\underline{6}$'],
     ['3', 'La suma de sus cifras es múltiplo de 3', '$2\\,514 \\to 2+5+1+4=12$'],
     ['4', 'Las dos últimas cifras forman múltiplo de 4', '$7\\,3\\underline{16}$'],
     ['5', 'Acaba en 0 o en 5', '$8\\,29\\underline{5}$'],
     ['6', 'Lo es entre 2 y entre 3 a la vez', '$1\\,026$'],
     ['9', 'La suma de sus cifras es múltiplo de 9', '$4\\,653 \\to 4+6+5+3=18$'],
     ['10', 'Acaba en 0', '$5\\,32\\underline{0}$'],
     ['11', 'Sumas alternas: (impares) − (pares) da 0 u 11', '$9\\,163 \\to (9+6)-(1+3)=11$']]);

  p.note('El criterio del 3 y del 9 funciona porque $10$ deja resto $1$ al dividir entre $3$ y entre $9$. ' +
    'Así, $10^k$ siempre deja resto 1, y el número entero deja el mismo resto que la suma de sus cifras.',
    null, 'Por qué funciona');

  /* ---------------------------------------------------------------- */
  p.util('Los dígitos de control funcionan así. La letra de tu DNI es el resto de dividir el número entre ' +
    '23; el código de una cuenta IBAN se valida con un resto entre 97; el último dígito del código ' +
    'de barras de cualquier producto y el de un ISBN son la misma idea. Sirven para que un número ' +
    'mal tecleado se detecte <em>antes</em> de hacer la transferencia, en lugar de después.');

  p.section('Números primos');

  p.text('Un número es <strong>primo</strong> si tiene exactamente dos divisores: $1$ y él mismo. ' +
    'Si tiene más, es <strong>compuesto</strong>. El $1$ no es ni una cosa ni otra: solo tiene ' +
    'un divisor.');

  p.hist('Euclides demostró hacia el 300 a.C. que los primos son infinitos, con un argumento que ' +
    'sigue siendo de los más elegantes que existen: si solo hubiera una lista finita de primos, ' +
    'multiplícalos todos y súmale 1; el número que sale no es divisible por ninguno de ellos. ' +
    'Contradicción. La criba que verás debajo es de Eratóstenes, bibliotecario de Alejandría, ' +
    'la misma persona que midió el radio de la Tierra con la sombra de un palo.');

  p.demo({
    title: 'La criba de Eratóstenes',
    intro: 'Ve tachando los múltiplos de cada primo. Lo que quede en pie son todos los primos hasta 100.',
    build: function (host, d) {
      var N = 100;
      var estado = new Array(N + 1).fill(0);   // 0 vivo, 1 primo confirmado, 2 tachado
      estado[1] = 2;
      var primos = [2, 3, 5, 7];
      var paso = -1;
      var grid = U.el('div', {
        style: {
          display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: '3px',
          margin: '6px 0', fontFamily: 'var(--mono)', fontSize: '13px'
        }
      });
      var cells = [];
      for (var i = 1; i <= N; i++) {
        var c = U.el('div', {
          text: i,
          style: {
            textAlign: 'center', padding: '5px 0', borderRadius: '6px',
            border: '1px solid var(--line-soft)', transition: '.15s'
          }
        });
        grid.appendChild(c); cells.push(c);
      }
      host.appendChild(grid);
      var out = W.readout(host, '');

      function paint() {
        for (var i = 1; i <= N; i++) {
          var c = cells[i - 1];
          if (estado[i] === 2) {
            c.style.background = 'var(--panel-2)'; c.style.color = 'var(--ink-faint)';
            c.style.textDecoration = 'line-through'; c.style.borderColor = 'transparent';
          } else if (estado[i] === 1) {
            c.style.background = 'var(--ok)'; c.style.color = '#fff';
            c.style.textDecoration = 'none'; c.style.fontWeight = '700'; c.style.borderColor = 'transparent';
          } else {
            c.style.background = 'var(--panel)'; c.style.color = 'var(--ink)';
            c.style.textDecoration = 'none'; c.style.fontWeight = '400';
            c.style.borderColor = 'var(--line-soft)';
          }
        }
        var vivos = [];
        for (var j = 2; j <= N; j++) if (estado[j] !== 2) vivos.push(j);
        if (paso < 0) out.set('Empezamos con todos los números del 1 al 100. El 1 se descarta: no es primo.');
        else if (paso < primos.length) {
          out.set('Paso ' + (paso + 1) + ': el $' + primos[paso] + '$ es primo. Tachamos todos sus múltiplos ' +
            '(el $' + primos[paso] + '$ no, claro). Quedan ' + vivos.length + ' números en pie.');
        } else {
          out.set('Ya está: no hace falta seguir, porque $11^2 = 121 > 100$. Los ' + vivos.length +
            ' números que quedan son <strong>todos los primos menores que 100</strong>.');
        }
      }
      function avanzar() {
        paso++;
        if (paso < primos.length) {
          var q = primos[paso];
          estado[q] = 1;
          for (var m = 2 * q; m <= N; m += q) estado[m] = 2;
        } else if (paso === primos.length) {
          for (var i = 2; i <= N; i++) if (estado[i] !== 2) estado[i] = 1;
        } else paso = primos.length;
        paint();
      }
      W.buttons(host, [
        { t: 'Siguiente paso →', cls: 'btn--main', on: avanzar },
        {
          t: '↺ Reiniciar', on: function () {
            estado = new Array(N + 1).fill(0); estado[1] = 2; paso = -1; paint();
          }
        }
      ]);
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('La seguridad de internet se apoya en un desequilibrio de estos números: multiplicar dos primos ' +
    'enormes es instantáneo, y deshacer esa multiplicación —factorizar el resultado— no lo sabe ' +
    'hacer nadie en un tiempo razonable. Cada vez que aparece el candado en el navegador, hay primos ' +
    'de cientos de cifras trabajando. Que no se conozca un método rápido de factorizar no está ' +
    'demostrado que sea imposible: es, literalmente, el supuesto sobre el que descansa el comercio ' +
    'electrónico.');

  p.section('Descomposición en factores primos');

  p.text('Todo número mayor que 1 se puede escribir como producto de primos <strong>de una única ' +
    'manera</strong> (salvo el orden). Es el <em>teorema fundamental de la aritmética</em>, y es la ' +
    'razón de que los primos sean tan importantes: son los ladrillos con los que están hechos ' +
    'todos los demás números.');

  p.formula('360 = 2^3 \\cdot 3^2 \\cdot 5', 'única descomposición de 360');

  p.demo({
    title: 'Fábrica de descomposiciones',
    intro: 'Elige un número y mira de qué primos está hecho, cuántos divisores tiene y por qué.',
    build: function (host, d) {
      var out = W.readout(host, '');
      function paint(n) {
        var f = ML.factorize(n);
        var nd = f.reduce(function (a, e) { return a * (e[1] + 1); }, 1);
        var ds = ML.divisors(n);
        out.innerHTML = MathX.inline('$' + n + ' = ' + (ML.isPrime(n) ? n + '$ &nbsp;(es primo)' :
          ML.factorTex(n) + '$')) +
          '<br>Divisores (' + nd + '): ' + ds.join(', ') +
          '<br><span style="font-size:12.5px;color:var(--ink-faint)">El número de divisores sale de ' +
          'sumar 1 a cada exponente y multiplicar: ' +
          MathX.inline('$' + (f.map(function (e) { return '(' + e[1] + '+1)'; }).join('\\cdot') || '1') +
            ' = ' + nd + '$') + '</span>';
      }
      var row = W.row(host);
      var sl = W.slider(row, {
        label: 'número', min: 2, max: 300, step: 1, value: 60, dec: 0,
        on: function (v) { paint(v); }
      });
      W.chips(host, [{ label: '$36$', value: 36 }, { label: '$60$', value: 60 },
        { label: '$97$', value: 97 }, { label: '$128$', value: 128 }, { label: '$180$', value: 180 }],
        { toggle: false, on: function (v) { sl.set(v, true); } });
      paint(60);
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('m.c.d. y m.c.m.');

  p.text('Con la descomposición en factores primos, dos cálculos que parecían difíciles se vuelven ' +
    'mecánicos:');

  p.list([
    '<strong>m.c.d.</strong> (máximo común divisor): factores <em>comunes</em> con el <em>menor</em> exponente.',
    '<strong>m.c.m.</strong> (mínimo común múltiplo): factores <em>comunes y no comunes</em> con el <em>mayor</em> exponente.'
  ]);

  p.formulas([
    '72 = 2^3\\cdot 3^2 \\qquad 120 = 2^3\\cdot 3\\cdot 5',
    '\\operatorname{mcd}(72,120) = 2^3\\cdot 3 = 24',
    '\\operatorname{mcm}(72,120) = 2^3\\cdot 3^2\\cdot 5 = 360'
  ], 'descomposición en factores primos',
    'Se lee: <em>«setenta y dos es igual a dos al cubo por tres al cuadrado; ciento veinte es igual ' +
      'a dos al cubo por tres por cinco»</em>.<br><br>Escribir un número así se llama ' +
      '<strong>descomponerlo en factores primos</strong>, y tiene una propiedad notable: solo hay una ' +
      'manera de hacerlo. Da igual por dónde empieces a dividir, siempre acabas con los mismos primos ' +
      'y los mismos exponentes.<br><br>Con las descomposiciones a la vista, el máximo común divisor y ' +
      'el mínimo común múltiplo salen de mirar: los factores comunes con el exponente más pequeño para ' +
      'el uno, y todos con el más grande para el otro.');

  p.note('Truco de comprobación: siempre se cumple $\\operatorname{mcd}(a,b)\\cdot\\operatorname{mcm}(a,b) = a\\cdot b$. ' +
    'Con el ejemplo: $24\\cdot 360 = 8640 = 72\\cdot 120$.', 'ok');

  p.text('¿Cuándo se usa cada uno? Regla práctica: si el problema habla de <em>repartir o cortar en ' +
    'trozos iguales lo más grandes posible</em>, es m.c.d. Si habla de <em>coincidir, repetirse o ' +
    'volver a encontrarse</em>, es m.c.m.');

  /* ================= EJERCICIOS ================= */
  p.util('El mínimo común múltiplo es la respuesta a «¿cuándo volverá a coincidir?»: dos autobuses que ' +
    'salen cada 12 y cada 18 minutos vuelven a coincidir a los 36; dos engranajes de 8 y 12 dientes ' +
    'repiten posición cada 24 dientes, y los relojeros eligen números primos entre sí para que un ' +
    'mismo par de dientes no se encuentre siempre y el desgaste se reparta. El máximo común divisor ' +
    'es la otra cara: el trozo más grande con el que se puede embaldosar sin cortar.');

  p.section('Practica');

  p.exercise({
    title: 'Criterios de divisibilidad',
    level: 'basico',
    gen: function (r) {
      var div = r.pick([2, 3, 4, 5, 9, 11]);
      var n;
      if (r.bool(0.5)) n = div * r.int(20, 400);            // sí lo es
      else { n = div * r.int(20, 400) + r.int(1, div - 1); } // no lo es
      return { n: n, div: div, si: n % div === 0 };
    },
    ask: function (d) {
      return '¿Es $' + U.miles(d.n) + '$ divisible entre $' + d.div + '$? Responde <code>si</code> o <code>no</code>.';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.si ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe exactamente <code>si</code> o <code>no</code>.' };
      return (t === 'si') === d.si;
    },
    hint: function (d) {
      var h = {
        2: 'Mira solo la última cifra.', 5: 'Mira solo la última cifra.',
        4: 'Mira las dos últimas cifras.',
        3: 'Suma todas las cifras.', 9: 'Suma todas las cifras.',
        11: 'Suma las cifras de lugar impar, réstale las de lugar par.'
      };
      return h[d.div];
    },
    steps: function (d) {
      var s = String(d.n).split('').reduce(function (a, c) { return a + Number(c); }, 0);
      if (d.div === 3 || d.div === 9) {
        return ['Sumamos las cifras de $' + d.n + '$: da $' + s + '$.',
          '¿Es $' + s + '$ múltiplo de $' + d.div + '$? ' + (s % d.div === 0 ? 'Sí.' : 'No.'),
          'Conclusión: ' + (d.si ? 'sí es divisible.' : 'no es divisible.')];
      }
      return ['Aplicamos el criterio del $' + d.div + '$.',
        'Comprobación directa: $' + d.n + ' : ' + d.div + '$ da resto $' + (d.n % d.div) + '$.',
        d.si ? 'Resto cero, así que sí es divisible.' : 'El resto no es cero, así que no lo es.'];
    },
    answer: function (d) { return d.si ? 'Sí es divisible.' : 'No es divisible.'; }
  });

  p.exercise({
    title: 'Descomposición en factores primos',
    level: 'medio',
    gen: function (r) {
      var n = 1, k = r.int(2, 4);
      for (var i = 0; i < k; i++) n *= r.pick([2, 2, 2, 3, 3, 5, 7]);
      if (n < 12 || n > 900) return null;
      return { n: n, f: ML.factorize(n) };
    },
    ask: function (d) {
      return 'Descompón $' + d.n + '$ en factores primos y di <strong>cuántos divisores</strong> tiene en total.';
    },
    fields: [{ name: 'nd', label: 'Nº de divisores', w: 'tiny' }],
    sol: function (d) { return { nd: ML.divisors(d.n).length }; },
    hint: function () { return 'Si $n = p^a\\cdot q^b$, el número de divisores es $(a+1)(b+1)$.'; },
    steps: function (d) {
      var nd = d.f.reduce(function (a, e) { return a * (e[1] + 1); }, 1);
      return ['Descomponemos: $' + d.n + ' = ' + ML.factorTex(d.n) + '$.',
        'Cada divisor se forma eligiendo, para cada primo, un exponente entre $0$ y el suyo.',
        'Por tanto hay $' + d.f.map(function (e) { return '(' + e[1] + '+1)'; }).join('\\cdot') + ' = ' + nd + '$ divisores.',
        'Son: ' + ML.divisors(d.n).join(', ') + '.'];
    },
    answer: function (d) {
      return '$' + d.n + ' = ' + ML.factorTex(d.n) + '$, con ' + ML.divisors(d.n).length + ' divisores.';
    }
  });

  p.exercise({
    title: 'Máximo común divisor y mínimo común múltiplo',
    level: 'medio',
    gen: function (r) {
      var g = r.pick([2, 3, 4, 6, 8, 12]);
      var a = g * r.int(2, 15), b = g * r.int(2, 15);
      if (a === b) return null;
      return { a: a, b: b, mcd: ML.gcd(a, b), mcm: ML.lcm(a, b) };
    },
    ask: function (d) { return 'Calcula el m.c.d. y el m.c.m. de $' + d.a + '$ y $' + d.b + '$.'; },
    fields: [{ name: 'mcd', label: 'm.c.d.', w: 'tiny' }, { name: 'mcm', label: 'm.c.m.', w: 'tiny' }],
    sol: function (d) { return { mcd: d.mcd, mcm: d.mcm }; },
    hint: function (d) { return 'Descompón los dos. Y recuerda: $\\operatorname{mcd}\\cdot\\operatorname{mcm} = a\\cdot b$.'; },
    steps: function (d) {
      return ['$' + d.a + ' = ' + ML.factorTex(d.a) + '$',
        '$' + d.b + ' = ' + ML.factorTex(d.b) + '$',
        'm.c.d.: solo los primos comunes, con el exponente más pequeño → $' + d.mcd + '$.',
        'm.c.m.: todos los primos, con el exponente más grande → $' + d.mcm + '$.',
        'Comprobación: $' + d.mcd + '\\cdot' + d.mcm + ' = ' + (d.mcd * d.mcm) + ' = ' + d.a + '\\cdot' + d.b + '$ ✓'];
    },
    answer: function (d) { return 'm.c.d. = ' + d.mcd + ' y m.c.m. = ' + d.mcm + '.'; }
  });

  p.exercise({
    title: 'Problema: ¿mcd o mcm?',
    level: 'avanzado',
    gen: function (r) {
      var tipo = r.int(0, 1);
      if (tipo === 0) {
        var a = r.pick([6, 8, 9, 10, 12, 14, 15]), b = r.pick([4, 6, 8, 10, 12, 18, 20]);
        if (a === b) return null;
        return { tipo: 0, a: a, b: b, res: ML.lcm(a, b) };
      }
      var g = r.pick([4, 6, 8, 12, 15]);
      var x = g * r.int(3, 12), y = g * r.int(3, 12);
      if (x === y || ML.gcd(x, y) !== g) return null;
      return { tipo: 1, a: x, b: y, res: g };
    },
    ask: function (d) {
      if (d.tipo === 0) {
        return 'Dos autobuses salen de la misma parada a las 8:00. Uno pasa cada $' + d.a +
          '$ minutos y el otro cada $' + d.b + '$ minutos. ¿Cuántos minutos tardarán en volver a ' +
          'coincidir en la parada?';
      }
      return 'Queremos cortar dos cuerdas de $' + d.a + '$ cm y $' + d.b + '$ cm en trozos iguales, ' +
        'lo más largos posible y sin que sobre nada. ¿Cuánto medirá cada trozo?';
    },
    fields: function (d) {
      return [{ name: 'r', label: d.tipo === 0 ? 'Minutos' : 'Longitud (cm)', w: 'tiny' }];
    },
    sol: function (d) { return { r: d.res }; },
    hint: function (d) {
      return d.tipo === 0 ? 'Coincidir, repetirse, volver a encontrarse → mínimo común múltiplo.'
        : 'Repartir en trozos iguales lo más grandes posible → máximo común divisor.';
    },
    steps: function (d) {
      if (d.tipo === 0) {
        return ['El primero pasa en los minutos múltiplos de $' + d.a + '$.',
          'El segundo, en los múltiplos de $' + d.b + '$.',
          'Coinciden en los múltiplos comunes; el primero es el m.c.m.',
          '$\\operatorname{mcm}(' + d.a + ',' + d.b + ') = ' + d.res + '$ minutos.'];
      }
      return ['La longitud del trozo tiene que dividir a $' + d.a + '$ y a $' + d.b + '$.',
        'Queremos la mayor posible: el m.c.d.',
        '$\\operatorname{mcd}(' + d.a + ',' + d.b + ') = ' + d.res + '$ cm.',
        'Saldrán $' + (d.a / d.res) + '$ trozos de la primera y $' + (d.b / d.res) + '$ de la segunda.'];
    },
    answer: function (d) { return String(d.res) + (d.tipo === 0 ? ' minutos.' : ' cm.'); }
  });

  p.keys([
    '$a$ es divisible entre $b$ si el resto de la división es $0$.',
    'Primo = exactamente dos divisores. El 1 no es primo.',
    'Teorema fundamental de la aritmética: la descomposición en primos es <strong>única</strong>.',
    'm.c.d.: comunes con el menor exponente. m.c.m.: todos con el mayor exponente.',
    'Repartir en partes iguales → m.c.d. &nbsp;·&nbsp; volver a coincidir → m.c.m.',
    'Siempre: $\\operatorname{mcd}(a,b)\\cdot\\operatorname{mcm}(a,b) = a\\cdot b$.'
  ]);
});
