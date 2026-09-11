/* Tema: Números decimales y aproximación */
Course.topic('ar-decimales', function (p) {

  p.puente('Una fracción es una división sin terminar. Este tema la termina: al dividir salen los ' +
    'decimales, y resulta que solo pueden salir de tres formas. Después se hace el camino de vuelta, ' +
    'del decimal a la fracción, y se aprende a decir cuánto se pierde al redondear.');

  p.text('Un número decimal es lo que se obtiene al extender el valor posicional <em>hacia la ' +
    'derecha</em>: después de las unidades vienen las décimas, las centésimas, las milésimas… ' +
    'cada posición vale diez veces menos que la anterior.');

  p.formula('3{,}47 = 3 + \\frac{4}{10} + \\frac{7}{100}', 'valor posicional decimal');

  p.text('La coma no es una frontera entre dos números: es solo la marca de dónde están las unidades. ' +
    'Por eso las reglas de operar son las mismas que con enteros, con la única precaución de ' +
    'colocar bien las comas.');

  p.hist('Los decimales tal y como los usamos los popularizó Simon Stevin en 1585 con un folleto ' +
    'titulado <em>De Thiende</em> («La décima»), donde defendía que con ellos cualquiera podría hacer ' +
    'cuentas de comerciante «sin fracciones». Curiosamente proponía escribir 3,47 como 3⓪4①7②. ' +
    'La coma decimal se impuso poco después; el punto es la convención inglesa, y por eso las ' +
    'calculadoras y los programas lo usan.');

  /* ---------------------------------------------------------------- */
  p.section('Tipos de decimales');

  p.text('Al dividir dos enteros solo pueden pasar tres cosas, y solo tres:');

  p.table(['Tipo', 'Ejemplo', 'Cuándo ocurre'],
    [['Exacto', '$\\frac{3}{8} = 0{,}375$', 'el denominador irreducible solo tiene factores 2 y 5'],
     ['Periódico puro', '$\\frac{4}{11} = 0{,}\\overline{36}$', 'el denominador no tiene ni 2 ni 5'],
     ['Periódico mixto', '$\\frac{7}{30} = 0{,}2\\overline{3}$', 'el denominador tiene 2 o 5 <em>y</em> algún otro factor']]);

  p.note('La división de dos enteros <strong>nunca</strong> da un decimal infinito no periódico. ' +
    'Los restos posibles son finitos, así que antes o después uno se repite y a partir de ahí todo ' +
    'se repite. Los números con decimales infinitos sin periodo existen —$\\pi$, $\\sqrt{2}$— pero ' +
    'no salen de ninguna fracción: son los <strong>irracionales</strong>.', 'ok', 'Un argumento que merece la pena');

  p.demo({
    title: 'La división que se muerde la cola',
    intro: 'Elige una fracción y mira los restos que van saliendo. En cuanto un resto se repite, el periodo queda cerrado.',
    predice: 'Al dividir entre 7 solo hay 6 restos posibles distintos de cero. ¿Cuántas cifras como mucho puede tener el periodo de $\\frac{1}{7}$? Apuesta antes de pulsar.',
    build: function (host, d) {
      var n = 4, den = 11;
      var out = W.readout(host, '');
      function paint() {
        var entera = Math.floor(n / den);
        var resto = n % den;
        var vistos = {}, dig = [], pos = 0, inicioPeriodo = -1;
        while (resto !== 0 && pos < 40) {
          if (vistos[resto] !== undefined) { inicioPeriodo = vistos[resto]; break; }
          vistos[resto] = pos;
          resto *= 10;
          dig.push({ d: Math.floor(resto / den), r: resto % den, ant: resto / 10 });
          resto = resto % den;
          pos++;
        }
        var texto;
        if (resto === 0) {
          texto = '<strong>Decimal exacto</strong>: la división termina.';
        } else if (inicioPeriodo === 0) {
          texto = '<strong>Periódico puro</strong>: el periodo empieza justo después de la coma y mide ' +
            dig.length + ' ' + U.plural(dig.length, 'cifra', 'cifras') + '.';
        } else {
          texto = '<strong>Periódico mixto</strong>: hay ' + inicioPeriodo + ' ' +
            U.plural(inicioPeriodo, 'cifra', 'cifras') + ' de anteperiodo y luego se repite un periodo de ' +
            (dig.length - inicioPeriodo) + '.';
        }
        var cifras = dig.map(function (x, i) {
          var col = (inicioPeriodo >= 0 && i >= inicioPeriodo) ? 'var(--c2)' : 'var(--ink)';
          return '<span style="color:' + col + '">' + x.d + '</span>';
        }).join('');
        var restos = dig.map(function (x, i) {
          var col = (inicioPeriodo >= 0 && i >= inicioPeriodo) ? 'var(--c2)' : 'var(--ink-faint)';
          return '<span style="color:' + col + '">' + x.r + '</span>';
        }).join(' → ');
        out.innerHTML = MathX.inline('$\\dfrac{' + n + '}{' + den + '} = ' + entera + '{,}$') +
          '<span style="font-size:1.25rem">' + cifras + '</span>…<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">restos: ' + restos + '</span><br>' +
          MathX.inline(texto) +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">' + den + ' = ' + ML.factorTex(den) +
          '</span>';
      }
      var row = W.row(host);
      W.slider(row, { label: 'numerador', min: 1, max: 30, step: 1, value: n, dec: 0, on: function (v) { n = v; paint(); } });
      W.slider(row, { label: 'denominador', min: 2, max: 40, step: 1, value: den, dec: 0, on: function (v) { den = v; paint(); } });
      W.chips(host, [{ label: '$3/8$ exacto', value: [3, 8] }, { label: '$4/11$ puro', value: [4, 11] },
        { label: '$7/30$ mixto', value: [7, 30] }, { label: '$1/7$', value: [1, 7] }],
        { toggle: false, on: function (v) { n = v[0]; den = v[1]; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Que $1/3$ sea periódico en base 10 depende de la base, y esto tiene una consecuencia diaria: en ' +
    'base 2, que es la del ordenador, <strong>$0{,}1$ es periódico</strong>. Por eso en casi ' +
    'cualquier lenguaje de programación $0{,}1 + 0{,}2$ no da exactamente $0{,}3$. No es un fallo ' +
    'del ordenador: es el mismo fenómeno que impide escribir $1/3$ con decimales exactos. La ' +
    'solución que usa la banca es no guardar euros con decimales, sino contar en céntimos enteros.');

  p.section('De decimal a fracción: la fracción generatriz');

  p.text('Todo decimal exacto o periódico se puede convertir en fracción. El truco es siempre el ' +
    'mismo: multiplicar por potencias de 10 para que las partes decimales infinitas coincidan, y restar.');

  p.formulas([
    '\\text{exacto:}\\quad 0{,}375 = \\frac{375}{1000} = \\frac{3}{8}',
    '\\text{puro:}\\quad 0{,}\\overline{36} = \\frac{36}{99} = \\frac{4}{11}',
    '\\text{mixto:}\\quad 0{,}2\\overline{3} = \\frac{23-2}{90} = \\frac{21}{90} = \\frac{7}{30}'
  ], 'reglas de la fracción generatriz');

  p.text('Merece la pena ver de dónde sale la del periódico puro, porque es un razonamiento precioso. ' +
    'Sea $x = 0{,}\\overline{36}$. Entonces $100x = 36{,}\\overline{36}$. Restando, las colas infinitas ' +
    'se cancelan: $99x = 36$, luego $x = \\frac{36}{99}$.');

  p.ejemplo({
    title: 'La generatriz de un periódico mixto, desde cero',
    enunciado: 'Escribir $x = 0{,}2\\overline{3} = 0{,}2333\\ldots$ como fracción, sin usar la regla de memoria.',
    pasos: [
      { t: 'Primero se aparta el anteperiodo multiplicando por 10: $10x = 2{,}\\overline{3} = 2{,}333\\ldots$ Ahora la cola infinita empieza justo después de la coma.', antes: 'El 2 no se repite. ¿Por cuánto hay que multiplicar para que lo que queda tras la coma sea solo periodo?' },
      { t: 'Se multiplica otra vez por 10, una posición por cada cifra del periodo: $100x = 23{,}\\overline{3} = 23{,}333\\ldots$', antes: '¿Cuánto hay que desplazar la coma para que las dos colas infinitas queden alineadas?' },
      { t: 'Se restan las dos: $100x - 10x = 23{,}333\\ldots - 2{,}333\\ldots$. Las colas son idénticas y se cancelan: $90x = 21$.', antes: '¿Qué pasa con los infinitos treses al restar?' },
      { t: '$x = \\dfrac{21}{90} = \\dfrac{7}{30}$, simplificando entre 3.' }
    ],
    cierre: 'La regla «periodo con anteperiodo, menos anteperiodo, partido por nueves y ceros» es exactamente este cálculo: $\\frac{23 - 2}{90}$. Si entiendes de dónde sale, no hace falta memorizarla.'
  });

  p.note('De ahí sale el famoso $0{,}\\overline{9} = 1$. Si $x = 0{,}\\overline{9}$, entonces ' +
    '$10x = 9{,}\\overline{9}$ y restando $9x = 9$, o sea $x = 1$. No es una aproximación ni una ' +
    'trampa: son dos formas de escribir el mismo número.', 'warn', 'El resultado que nadie se cree');

  p.comprueba('Sin dividir: ¿qué tipo de decimal da $\\frac{7}{12}$?', [
    { t: 'Exacto', ok: false, por: '$12 = 2^2\\cdot 3$: ese 3 impide que la división termine.' },
    { t: 'Periódico puro', ok: false, por: 'Hay un factor 2 en el denominador, y eso produce cifras antes del periodo.' },
    { t: 'Periódico mixto', ok: true, por: '$12 = 2^2\\cdot 3$ mezcla un 2 con otro factor: $\\frac{7}{12} = 0{,}58\\overline{3}$.' }
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Aproximar y medir el error');

  p.text('Al redondear se comete un error. Distinguir sus dos formas es lo que separa una medida ' +
    'con sentido de un número escrito a lo tonto:');

  p.formulas([
    'E_a = |\\text{valor real} - \\text{aproximación}| \\quad\\text{(error absoluto)}',
    'E_r = \\frac{E_a}{|\\text{valor real}|} \\quad\\text{(error relativo)}'
  ]);

  p.text('Equivocarse en 1 cm midiendo un lápiz es un desastre; equivocarse en 1 cm midiendo un ' +
    'campo de fútbol da igual. El error absoluto es el mismo; el relativo, no. Por eso el relativo ' +
    'es el que informa de verdad, y se suele dar en porcentaje.');

  p.comprueba('Una báscula se equivoca en 2 kg al pesar un coche de 1500 kg, y otra en 200 g al pesar un bebé de 4 kg. ¿Cuál es peor?', [
    { t: 'La del coche: 2 kg es más que 200 g', ok: false, por: 'Ese es el error absoluto, que no tiene en cuenta el tamaño de lo que se mide. 2 kg sobre 1500 kg es un 0,13 %.' },
    { t: 'La del bebé: 200 g sobre 4 kg es un 5 %', ok: true, por: 'El error relativo del bebé es $\\frac{0{,}2}{4} = 5\\,\\%$, casi cuarenta veces mayor que el del coche. Es el que dice si la medida sirve.' }
  ]);

  p.trampas([
    { e: 'Dar $0{,}3$ por igual a $\\frac{1}{3}$', por: '$\\frac{1}{3} = 0{,}333\\ldots$, periódico. $0{,}3$ es $\\frac{3}{10}$, otro número. La diferencia es pequeña, pero al multiplicar por 3 se nota: 0,9 frente a 1.' },
    { e: 'Comparar decimales por el número de cifras', por: '$0{,}45$ tiene más cifras que $0{,}5$ y es menor. Se comparan cifra a cifra desde la izquierda, rellenando con ceros: 0,45 frente a 0,50.' },
    { e: 'Fracción generatriz sin restar el anteperiodo', por: '$0{,}2\\overline{3} = \\frac{23 - 2}{90} = \\frac{21}{90} = \\frac{7}{30}$. Poner $\\frac{23}{99}$ es tratarlo como si el periodo empezara en la primera cifra.' },
    { e: 'Pensar que $0{,}\\overline{9}$ es un poco menos que 1', por: 'Su generatriz es $\\frac{9}{9} = 1$. Son el mismo número escrito de dos maneras, igual que $\\frac{1}{2}$ y $0{,}5$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.util('El error relativo es lo que decide si una medida sirve. Equivocarse en un centímetro midiendo ' +
    'una habitación es irrelevante; el mismo centímetro en la pieza de un motor la convierte en ' +
    'chatarra. Por eso los planos industriales no dan una medida sino una <em>tolerancia</em> ' +
    '—$40{,}00 \\pm 0{,}05$ mm—, y por eso una analítica clínica se acompaña siempre de su margen: ' +
    'un valor sin su error no es un dato, es una impresión.');

  p.section('Practica');

  p.exercise({
    title: '¿Qué tipo de decimal es?',
    level: 'basico',
    gen: function (r) {
      var den = r.pick([2, 4, 5, 8, 10, 16, 20, 25, 3, 7, 9, 11, 13, 6, 12, 15, 30, 22, 45]);
      var n = r.int(1, den - 1);
      if (ML.gcd(n, den) !== 1) return null;
      var d2 = den;
      while (d2 % 2 === 0) d2 /= 2;
      while (d2 % 5 === 0) d2 /= 5;
      var tipo = (d2 === 1) ? 1 : (den === d2 ? 2 : 3);
      return { n: n, den: den, tipo: tipo };
    },
    ask: function (d) { return '¿Qué tipo de número decimal es $\\dfrac{' + d.n + '}{' + d.den + '}$? Decídelo mirando el denominador.'; },
    fields: [{ name: 't', label: 'Es', opts: [{ t: 'exacto', v: '1' }, { t: 'periódico puro', v: '2' }, { t: 'periódico mixto', v: '3' }] }],
    sol: function (d) { return { t: String(d.tipo) }; },
    hint: function (d) { return 'Factoriza el denominador: $' + d.den + ' = ' + ML.factorTex(d.den) + '$. ¿Solo hay doses y cincos?'; },
    steps: function (d) {
      return ['La fracción ya es irreducible, así que miramos el denominador: $' + d.den + ' = ' + ML.factorTex(d.den) + '$.',
        d.tipo === 1 ? 'Solo tiene factores 2 y 5, así que el decimal es <strong>exacto</strong>.'
          : (d.tipo === 2 ? 'No tiene ni 2 ni 5, así que es <strong>periódico puro</strong>.'
            : 'Tiene 2 o 5 mezclado con otros factores: es <strong>periódico mixto</strong>.'),
        'Comprobación: $\\dfrac{' + d.n + '}{' + d.den + '} = ' + U.fmt(d.n / d.den, 8) + '\\dots$'];
    },
    answer: function (d) { return ['', 'Exacto', 'Periódico puro', 'Periódico mixto'][d.tipo]; }
  });

  p.exercise({
    title: 'Operar con decimales',
    level: 'basico',
    gen: function (r) {
      var a = r.int(100, 9999) / 100, b = r.int(10, 999) / 100;
      var op = r.pick(['+', '-', '\\cdot']);
      var val = op === '+' ? a + b : (op === '-' ? a - b : a * b);
      return { a: a, b: b, op: op, val: U.round(val, 4) };
    },
    ask: function (d) {
      return 'Calcula $' + U.fmt(d.a, 2) + ' ' + d.op + ' ' + U.fmt(d.b, 2) + '$';
    },
    fields: [{ name: 'v', label: 'Resultado', w: 'wide' }],
    sol: function (d) { return { v: d.val }; },
    tol: 1e-5,
    hint: function (d) {
      return d.op === '\\cdot'
        ? 'Multiplica como si no hubiera comas y después coloca tantos decimales como sumen los dos factores.'
        : 'Coloca las comas una debajo de otra y opera como con enteros.';
    },
    steps: function (d) {
      if (d.op === '\\cdot') {
        return ['Quitamos las comas: $' + Math.round(d.a * 100) + ' \\cdot ' + Math.round(d.b * 100) + ' = ' +
          Math.round(d.a * 100) * Math.round(d.b * 100) + '$.',
          'Los dos factores tenían 2 decimales cada uno, así que el resultado lleva 4.',
          'Resultado: $' + U.fmt(d.val, 4) + '$'];
      }
      return ['Alineamos las comas y operamos cifra a cifra como si fueran enteros.',
        'La coma del resultado va en la misma columna.',
        'Resultado: $' + U.fmt(d.val, 2) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Fracción generatriz de un periódico puro',
    level: 'medio',
    gen: function (r) {
      var cifras = r.int(1, 2);
      var per = cifras === 1 ? r.int(1, 8) : r.int(10, 98);
      var nueves = cifras === 1 ? 9 : 99;
      var f = ML.F(per, nueves);
      if (f.d === 1) return null;
      return { per: per, cifras: cifras, nueves: nueves, f: f };
    },
    ask: function (d) {
      return 'Escribe $0{,}\\overline{' + d.per + '}$ como fracción irreducible.';
    },
    fields: [{ name: 'n', label: 'Numerador', w: 'tiny' }, { name: 'd', label: 'Denominador', w: 'tiny' }],
    sol: function (d) { return { n: d.f.n, d: d.f.d }; },
    check: function (v, d) {
      if (isNaN(v.n) || isNaN(v.d)) return { ok: false, msg: 'Escribe numerador y denominador.' };
      if (v.d === 0) return { ok: false, msg: 'El denominador no puede ser cero.' };
      if (Math.abs(v.n / v.d - d.f.val()) > 1e-9) return false;
      if (ML.gcd(v.n, v.d) !== 1) return { ok: false, msg: 'El valor es correcto, pero <strong>falta simplificar</strong>.' };
      return true;
    },
    hint: function (d) { return 'Periodo arriba, tantos nueves como cifras tenga el periodo abajo. Y después simplifica.'; },
    steps: function (d) {
      return ['Llamamos $x = 0{,}\\overline{' + d.per + '}$.',
        'Multiplicamos por $10^{' + d.cifras + '} = ' + (d.nueves + 1) + '$: $' + (d.nueves + 1) + 'x = ' + d.per + '{,}\\overline{' + d.per + '}$.',
        'Restamos la primera de la segunda: las colas infinitas se cancelan y queda $' + d.nueves + 'x = ' + d.per + '$.',
        '$x = \\dfrac{' + d.per + '}{' + d.nueves + '} = ' + d.f.tex() + '$'];
    },
    answer: function (d) { return '$' + d.f.tex() + '$'; }
  });

  p.exercise({
    title: 'Redondeo y error',
    level: 'medio',
    gen: function (r) {
      var n = r.int(2, 40), den = r.pick([3, 6, 7, 9, 11, 13]);
      if (n % den === 0) return null;
      var val = n / den;
      var dec = r.int(1, 3);
      var apr = U.round(val, dec);
      var ea = Math.abs(val - apr);
      return { n: n, den: den, val: val, dec: dec, apr: apr, ea: ea, er: ea / Math.abs(val) };
    },
    ask: function (d) {
      return 'Aproxima $\\dfrac{' + d.n + '}{' + d.den + '}$ redondeando a ' + d.dec + ' ' +
        U.plural(d.dec, 'decimal', 'decimales') + ' y calcula el <strong>error absoluto</strong> ' +
        'cometido (cinco decimales).';
    },
    fields: [
      { name: 'a', label: 'Aproximación', w: 'tiny' },
      { name: 'e', label: 'Error absoluto', w: 'tiny' }
    ],
    sol: function (d) { return { a: d.apr, e: U.round(d.ea, 5) }; },
    tol: 2e-4,
    hint: function (d) { return 'El valor exacto es $' + U.fmt(d.val, 8) + '\\dots$; el error es la diferencia en valor absoluto.'; },
    steps: function (d) {
      return ['Valor exacto: $' + U.fmt(d.val, 8) + '\\dots$',
        'Redondeado a ' + d.dec + ' ' + U.plural(d.dec, 'decimal', 'decimales') + ': $' + U.fmt(d.apr, d.dec) + '$',
        '$E_a = |' + U.fmt(d.val, 6) + ' - ' + U.fmt(d.apr, d.dec) + '| = ' + U.fmt(d.ea, 5) + '$',
        'Y el error relativo sería $E_r = ' + U.fmt(d.er, 5) + ' = ' + U.fmt(d.er * 100, 3) + '\\%$.'];
    },
    answer: function (d) { return 'Aproximación ' + U.fmt(d.apr, d.dec) + ', error absoluto ' + U.fmt(d.ea, 5) + '.'; }
  });

  p.keys([
    'Los decimales son el valor posicional extendido hacia la derecha.',
    'Una fracción solo puede dar decimal exacto, periódico puro o periódico mixto. Lo decide el denominador.',
    'Todo decimal exacto o periódico procede de una fracción; los irracionales no.',
    'La generatriz sale de multiplicar por potencias de 10 y restar para cancelar la cola infinita.',
    '$0{,}\\overline{9} = 1$ es una igualdad exacta, no una aproximación.',
    'El error relativo informa mejor que el absoluto porque tiene en cuenta el tamaño de lo medido.'
  ]);
});
