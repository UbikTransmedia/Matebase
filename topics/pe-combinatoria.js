/* Tema: Combinatoria */
Course.topic('pe-combinatoria', function (p) {

  p.text('La combinatoria responde a una pregunta engañosamente simple: <strong>¿de cuántas maneras ' +
    'se puede hacer algo?</strong> Es imprescindible para la probabilidad, porque la regla de Laplace ' +
    'exige contar casos favorables y casos posibles.');

  p.section('El principio de multiplicación');

  p.text('Todo sale de aquí. Si una tarea se hace en varias etapas independientes, el número total de ' +
    'formas es el <strong>producto</strong> de las formas de cada etapa.');

  p.formula('N = n_1 \\cdot n_2 \\cdot \\dots \\cdot n_k');

  p.text('Con 3 camisetas y 4 pantalones hay $3\\cdot4 = 12$ conjuntos posibles. Nada más. Todas las ' +
    'fórmulas que vienen ahora no son más que casos particulares de esto.');

  /* ---------------------------------------------------------------- */
  p.section('Las tres preguntas que lo deciden todo');

  p.text('Ante cualquier problema de combinatoria hay que responder a tres preguntas, y las respuestas ' +
    'llevan directamente a la fórmula:');

  p.list([
    '<strong>¿Importa el orden?</strong> ¿Es distinto ABC de CBA?',
    '<strong>¿Se pueden repetir</strong> los elementos?',
    '<strong>¿Entran todos</strong> los elementos o solo algunos?'
  ], true);

  p.table(['¿Orden?', '¿Repetición?', '¿Todos?', 'Se llama', 'Fórmula'],
    [['Sí', 'No', 'No', 'Variaciones', '$V_{m,n} = \\dfrac{m!}{(m-n)!}$'],
     ['Sí', 'Sí', 'No', 'Variaciones con repetición', '$VR_{m,n} = m^n$'],
     ['Sí', 'No', 'Sí', 'Permutaciones', '$P_m = m!$'],
     ['No', 'No', 'No', 'Combinaciones', '$C_{m,n} = \\dbinom{m}{n} = \\dfrac{m!}{n!\\,(m-n)!}$']]);

  p.note('La pregunta clave, y la que más se falla, es la <strong>primera</strong>. Una carrera de ' +
    'caballos (importa quién llega primero) son variaciones; una mano de cartas (da igual el orden en ' +
    'que te las repartan) son combinaciones. Un «código PIN» son variaciones con repetición; una ' +
    'quiniela de 6 números, combinaciones.', 'ok', 'La pregunta que decide');

  p.demo({
    title: 'Contar de verdad los casos',
    intro: 'Con pocos elementos se pueden enumerar todos. Compara lo que sale al contar a mano con lo que dice la fórmula.',
    build: function (host, d) {
      var m = 4, n = 2, tipo = 'V';
      var letras = ['A', 'B', 'C', 'D', 'E', 'F'];
      var out = W.readout(host, '');
      var lista = U.el('div', { style: { fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: '1.9', marginTop: '10px' } });
      host.appendChild(lista);
      function generar() {
        var base = letras.slice(0, m);
        var res = [];
        function rec(actual, restantes) {
          if (actual.length === n) { res.push(actual.join('')); return; }
          for (var i = 0; i < restantes.length; i++) {
            if (tipo === 'VR') rec(actual.concat(restantes[i]), restantes);
            else if (tipo === 'C') {
              if (actual.length === 0 || restantes[i] > actual[actual.length - 1]) {
                rec(actual.concat(restantes[i]), restantes);
              }
            } else {
              rec(actual.concat(restantes[i]), restantes.filter(function (x) { return x !== restantes[i]; }));
            }
          }
        }
        rec([], base);
        return res;
      }
      function paint() {
        var res = generar();
        var formula = tipo === 'V' ? ML.perm(m, n) : (tipo === 'VR' ? Math.pow(m, n) : ML.comb(m, n));
        var nom = { V: 'Variaciones (importa el orden, sin repetir)', VR: 'Variaciones con repetición', C: 'Combinaciones (no importa el orden)' }[tipo];
        var f = { V: 'V_{' + m + ',' + n + '} = \\dfrac{' + m + '!}{' + (m - n) + '!}',
          VR: 'VR_{' + m + ',' + n + '} = ' + m + '^{' + n + '}',
          C: 'C_{' + m + ',' + n + '} = \\dbinom{' + m + '}{' + n + '}' }[tipo];
        out.set('<strong>' + nom + '</strong><br>$' + f + ' = ' + formula + '$<br>' +
          'Enumerando a mano salen <strong>' + res.length + '</strong> casos ' +
          (res.length === formula ? '✓' : '✗'));
        lista.innerHTML = res.map(function (s) {
          return '<span style="display:inline-block;padding:2px 8px;margin:2px;border:1px solid var(--line);' +
            'border-radius:6px;background:var(--panel)">' + s + '</span>';
        }).join('');
      }
      W.chips(host, [
        { label: 'variaciones', value: 'V' }, { label: 'con repetición', value: 'VR' },
        { label: 'combinaciones', value: 'C' }
      ], { value: 'V', on: function (v) { tipo = v; paint(); } });
      var row = W.row(host);
      W.slider(row, { label: 'elementos disponibles (m)', min: 2, max: 6, step: 1, value: 4, dec: 0, on: function (v) { m = v; n = Math.min(n, v); paint(); } });
      W.slider(row, { label: 'elementos que se cogen (n)', min: 1, max: 4, step: 1, value: 2, dec: 0, on: function (v) { n = Math.min(v, m); paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('La combinatoria es la que mide de verdad si algo es seguro. Una contraseña de 8 caracteres ' +
    'entre 94 símbolos da unas $6\\cdot10^{15}$ combinaciones; añadir dos caracteres la multiplica ' +
    'por casi 9000. Es también la que dice que la probabilidad de acertar una lotería de 6 números ' +
    'entre 49 es una entre casi 14 millones, y la que permite a un laboratorio calcular cuántas ' +
    'pruebas necesita para cubrir todas las combinaciones de un fármaco.');

  p.section('El factorial y los números combinatorios');
  p.text('Para contar de golpe hacen falta dos herramientas con nombre propio. El ' +
    '<strong>factorial</strong> cuenta de cuántas maneras se pueden ordenar unos objetos: el primer ' +
    'puesto admite $n$ candidatos, el segundo ya solo $n-1$, y así hasta agotarlos. El ' +
    '<strong>número combinatorio</strong> cuenta de cuántas maneras se pueden elegir unos cuantos ' +
    'sin importar el orden, y se obtiene contando las ordenaciones y dividiendo después por las que ' +
    'sobran por haber contado lo mismo varias veces.');


  p.formula('m! = m\\cdot(m-1)\\cdot\\dots\\cdot 2\\cdot 1, \\qquad 0! = 1');

  p.text('$0! = 1$ no es un capricho: es lo que hace que las fórmulas funcionen en los casos extremos. ' +
    'Hay exactamente una forma de no coger nada.');

  p.formula('\\binom{m}{n} = \\binom{m}{m-n}', 'propiedad de simetría');

  p.text('Elegir 3 personas de 10 para que vayan es lo mismo que elegir 7 para que se queden. Por eso ' +
    '$\\binom{10}{3} = \\binom{10}{7}$, y por eso el triángulo de Pascal es simétrico.');

  p.demo({
    title: 'El triángulo de Pascal',
    intro: 'Cada número es la suma de los dos de encima. Y cada fila son los números combinatorios: la fila n contiene todos los C(n,k).',
    build: function (host, d) {
      var filas = 8;
      var caja = U.el('div', { style: { textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '13px', margin: '8px 0' } });
      host.appendChild(caja);
      var out = W.readout(host, '');
      function paint() {
        var h = '';
        for (var n = 0; n < filas; n++) {
          h += '<div style="margin:3px 0">';
          for (var k = 0; k <= n; k++) {
            var v = ML.comb(n, k);
            h += '<span title="C(' + n + ',' + k + ')" style="display:inline-block;min-width:' +
              (filas > 9 ? 38 : 44) + 'px;padding:3px 4px;margin:1px;border-radius:6px;' +
              'background:var(--accent-soft);color:var(--accent-ink)">' + v + '</span>';
          }
          h += '</div>';
        }
        caja.innerHTML = h;
        out.set('La fila $n$ contiene $\\binom{n}{0}, \\binom{n}{1}, \\dots, \\binom{n}{n}$.<br>' +
          'Cada número es la suma de los dos que tiene encima: $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Y la suma de toda la fila $n$ vale $2^n$: ' +
          'son todos los subconjuntos posibles de un conjunto de $n$ elementos.</span>');
      }
      W.slider(W.row(host), { label: 'filas', min: 3, max: 12, step: 1, value: 8, dec: 0, on: function (v) { filas = v; paint(); } });
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.hist('El triángulo que en Europa lleva el nombre de Pascal aparece en un tratado chino de Yang Hui de ' +
    '1261, y ya entonces se citaba como conocido desde hacía dos siglos. También lo estudiaron ' +
    'al-Karaji en Bagdad y Tartaglia en Italia, y en cada país se llama de una manera distinta. Es ' +
    'un buen recordatorio de que los nombres de los teoremas dicen más sobre quién escribió la ' +
    'historia que sobre quién descubrió qué.');

  p.section('Practica');

  p.exercise({
    title: '¿Cuántas maneras hay?',
    level: 'medio',
    gen: function (r) {
      var m = r.int(5, 12), n = r.int(2, Math.min(5, m - 1));
      var tipo = r.int(0, 2);
      var val = [ML.perm(m, n), Math.pow(m, n), ML.comb(m, n)][tipo];
      if (val > 1e9) return null;
      return { m: m, n: n, tipo: tipo, val: val };
    },
    ask: function (d) {
      var enun = [
        'En una carrera con $' + d.m + '$ participantes, ¿de cuántas formas se puede formar el podio ' +
        'de los $' + d.n + '$ primeros puestos? <em>(importa el orden, nadie repite)</em>',
        '¿Cuántos códigos de $' + d.n + '$ caracteres se pueden formar con $' + d.m + '$ símbolos ' +
        'distintos, si se pueden repetir?',
        'De un grupo de $' + d.m + '$ personas hay que elegir un equipo de $' + d.n + '$. ' +
        '¿Cuántos equipos distintos se pueden formar? <em>(el orden no importa)</em>'
      ][d.tipo];
      return enun;
    },
    fields: [{ name: 'v', label: 'Número de casos', w: 'wide' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      return ['Importa el orden y no hay repetición: variaciones, $V_{m,n} = \\frac{m!}{(m-n)!}$.',
        'Importa el orden y sí hay repetición: $VR_{m,n} = m^n$.',
        'No importa el orden: combinaciones, $\\binom{m}{n}$.'][d.tipo];
    },
    steps: function (d) {
      if (d.tipo === 0) return ['El primer puesto puede ocuparlo cualquiera de los $' + d.m + '$.',
        'El segundo, cualquiera de los $' + (d.m - 1) + '$ restantes, y así sucesivamente.',
        '$V_{' + d.m + ',' + d.n + '} = \\dfrac{' + d.m + '!}{' + (d.m - d.n) + '!} = ' + d.val + '$'];
      if (d.tipo === 1) return ['Cada una de las $' + d.n + '$ posiciones puede ser cualquiera de los $' + d.m + '$ símbolos.',
        'Por el principio de multiplicación: $' + d.m + '^{' + d.n + '} = ' + d.val + '$'];
      return ['Como el orden no importa, cada equipo se cuenta una sola vez.',
        '$\\dbinom{' + d.m + '}{' + d.n + '} = \\dfrac{' + d.m + '!}{' + d.n + '!\\,' + (d.m - d.n) + '!} = ' + d.val + '$',
        'Fíjate: si importara el orden saldrían $' + ML.perm(d.m, d.n) + '$, que es $' + d.n + '!$ veces más.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Número combinatorio',
    level: 'basico',
    gen: function (r) {
      var m = r.int(4, 14), n = r.int(1, m - 1);
      return { m: m, n: n, val: ML.comb(m, n) };
    },
    ask: function (d) { return 'Calcula $\\dbinom{' + d.m + '}{' + d.n + '}$'; },
    fields: [{ name: 'v', label: 'Valor', w: 'wide' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      return '$\\binom{m}{n} = \\frac{m!}{n!(m-n)!}$. Y recuerda que $\\binom{' + d.m + '}{' + d.n +
        '} = \\binom{' + d.m + '}{' + (d.m - d.n) + '}$: usa el que tenga el número más pequeño abajo.';
    },
    steps: function (d) {
      var k = Math.min(d.n, d.m - d.n);
      var nums = [], dens = [];
      for (var i = 0; i < k; i++) { nums.push(d.m - i); dens.push(i + 1); }
      return ['Usamos la simetría para simplificar: $\\dbinom{' + d.m + '}{' + d.n + '} = \\dbinom{' + d.m + '}{' + k + '}$.',
        '$= \\dfrac{' + nums.join(' \\cdot ') + '}{' + dens.join(' \\cdot ') + '}$',
        '$= ' + d.val + '$'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Permutaciones',
    level: 'medio',
    gen: function (r) {
      var n = r.int(3, 9);
      var conRestriccion = r.bool();
      return {
        n: n, conRestriccion: conRestriccion,
        val: conRestriccion ? ML.factorial(n - 1) * 2 : ML.factorial(n)
      };
    },
    ask: function (d) {
      if (!d.conRestriccion) {
        return '¿De cuántas formas distintas se pueden sentar $' + d.n + '$ personas en una fila de $' +
          d.n + '$ sillas?';
      }
      return '¿De cuántas formas se pueden sentar $' + d.n + '$ personas en fila si dos de ellas, ' +
        'Ana y Bruno, quieren estar <strong>juntos</strong>?';
    },
    fields: [{ name: 'v', label: 'Número de formas', w: 'wide' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) {
      return d.conRestriccion
        ? 'Trata a Ana y Bruno como un único bloque: entonces hay $' + (d.n - 1) + '$ elementos que ordenar. Y dentro del bloque, ellos dos pueden colocarse de 2 formas.'
        : 'Entran todos y el orden importa: son permutaciones, $P_n = n!$.';
    },
    steps: function (d) {
      if (!d.conRestriccion) {
        return ['La primera silla la puede ocupar cualquiera de las $' + d.n + '$ personas.',
          'La segunda, cualquiera de las $' + (d.n - 1) + '$ restantes… y así hasta el final.',
          '$P_{' + d.n + '} = ' + d.n + '! = ' + d.val + '$'];
      }
      return ['Pegamos a Ana y Bruno formando un solo bloque.',
        'Ahora hay $' + (d.n - 1) + '$ elementos que ordenar: $' + (d.n - 1) + '! = ' + ML.factorial(d.n - 1) + '$ formas.',
        'Pero dentro del bloque Ana y Bruno pueden ir en 2 órdenes distintos.',
        'Total: $' + ML.factorial(d.n - 1) + ' \\cdot 2 = ' + d.val + '$'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Identifica el tipo',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Sacar 3 cartas de una baraja y mirar cuáles son.', ok: 3 },
        { t: 'Formar un número de 4 cifras con los dígitos del 1 al 9, sin repetir.', ok: 1 },
        { t: 'Elegir la contraseña de 4 dígitos de un móvil.', ok: 2 },
        { t: 'Ordenar 6 libros en una estantería.', ok: 4 },
        { t: 'Elegir 2 delegados de una clase de 25 alumnos.', ok: 3 },
        { t: 'Repartir los puestos de presidente y secretario entre 10 socios.', ok: 1 },
        { t: 'Lanzar una moneda 5 veces y anotar la secuencia.', ok: 2 },
        { t: 'Colocar a 8 personas en fila para una foto.', ok: 4 }
      ];
      var c = r.pick(casos);
      return { t: c.t, ok: c.ok };
    },
    ask: function (d) {
      return '<em>' + d.t + '</em><br>¿Qué tipo de problema combinatorio es?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)"><code>1</code> variaciones · ' +
        '<code>2</code> variaciones con repetición · <code>3</code> combinaciones · ' +
        '<code>4</code> permutaciones.</span>';
    },
    fields: [{ name: 't', label: 'Tipo', w: 'tiny' }],
    sol: function (d) { return { t: d.ok }; },
    hint: function () { return 'Pregúntate: ¿importa el orden? ¿se repiten elementos? ¿entran todos?'; },
    steps: function (d) {
      return ['¿Importa el orden? Si no importa, son <strong>combinaciones</strong>.',
        'Si importa: ¿entran todos los elementos? Entonces son <strong>permutaciones</strong>.',
        'Si importa el orden pero solo se cogen algunos: <strong>variaciones</strong>, con o sin repetición según se puedan repetir.',
        'Aquí la respuesta es <strong>' +
        ['', 'variaciones', 'variaciones con repetición', 'combinaciones', 'permutaciones'][d.ok] + '</strong>.'];
    },
    answer: function (d) {
      return ['', 'Variaciones', 'Variaciones con repetición', 'Combinaciones', 'Permutaciones'][d.ok];
    }
  });

  p.keys([
    'Todo sale del principio de multiplicación: etapas independientes se multiplican.',
    'Tres preguntas: ¿importa el orden? ¿hay repetición? ¿entran todos?',
    'Orden sí, repetición no → variaciones. Orden sí, repetición sí → $m^n$.',
    'Orden sí y entran todos → permutaciones, $n!$. Orden no → combinaciones, $\\binom{m}{n}$.',
    '$\\binom{m}{n} = \\binom{m}{m-n}$: elegir quién entra es lo mismo que elegir quién se queda fuera.',
    'El triángulo de Pascal contiene todos los números combinatorios, y cada fila suma $2^n$.'
  ]);
});
