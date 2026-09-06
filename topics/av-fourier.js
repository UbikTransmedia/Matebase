/* Tema: Series y transformada de Fourier */
Course.topic('av-fourier', function (p) {

  p.text('En el tema de trigonometría viste que sumando ondas aparecen formas nuevas. Fourier ' +
    'demostró en 1807 algo mucho más fuerte, y tan chocante que la Academia de Ciencias de París ' +
    'tardó quince años en publicárselo:');

  p.note('<strong>Cualquier</strong> función periódica razonable —incluso una con esquinas o con ' +
    'saltos, como una onda cuadrada— se puede escribir como suma de senos y cosenos. Infinitos, sí, ' +
    'pero solo senos y cosenos.', 'ok', 'El teorema de Fourier');

  p.formula('f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty}\\left[a_n\\cos(nx) + b_n\\operatorname{sen}(nx)\\right]',
    'serie de Fourier');

  p.formulas([
    'a_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\cos(nx)\\,dx',
    'b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\operatorname{sen}(nx)\\,dx'
  ], 'los coeficientes');

  p.text('Esas integrales tienen una interpretación preciosa: miden <strong>cuánto se parece</strong> ' +
    '$f$ a cada onda pura. Es como preguntarle a la señal «¿cuánto hay de esta frecuencia dentro de ' +
    'ti?». Por eso se dice que Fourier <em>descompone</em> una señal en sus ingredientes.');

  p.demo({
    title: 'Construir una onda cuadrada con senos',
    intro: 'Añade armónicos y mira cómo una suma de curvas suavísimas va fabricando esquinas y saltos verticales. Con infinitos términos, la igualdad es exacta.',
    build: function (host, d) {
      var N = 1, forma = 'cuadrada';
      var out = W.readout(host, '');
      var formas = {
        cuadrada: {
          f: function (x) { return Math.sin(x) >= 0 ? 1 : -1; },
          serie: function (x, N) {
            var s = 0;
            for (var k = 1; k <= N; k++) { var n = 2 * k - 1; s += Math.sin(n * x) / n; }
            return 4 / Math.PI * s;
          },
          t: 'onda cuadrada', coef: 'solo armónicos impares, con amplitud $\\frac{4}{\\pi n}$'
        },
        sierra: {
          f: function (x) { var t = ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return t / Math.PI; },
          serie: function (x, N) {
            var s = 0;
            for (var n = 1; n <= N; n++) s += Math.pow(-1, n + 1) * Math.sin(n * x) / n;
            return 2 / Math.PI * s;
          },
          t: 'diente de sierra', coef: 'todos los armónicos, con signos alternos'
        },
        triangular: {
          f: function (x) {
            var t = ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
            return 1 - 2 * Math.abs(t) / Math.PI;
          },
          serie: function (x, N) {
            var s = 0;
            for (var k = 1; k <= N; k++) { var n = 2 * k - 1; s += Math.cos(n * x) / (n * n); }
            return 8 / (Math.PI * Math.PI) * s;
          },
          t: 'onda triangular', coef: 'cosenos impares con amplitud $\\frac{8}{\\pi^2 n^2}$'
        }
      };
      var plot = W.plot(host, {
        xmin: -7, xmax: 7, ymin: -1.7, ymax: 1.7, height: 300,
        xstep: Math.PI, ystep: 0.5,
        xtickLabel: function (v) {
          var k = Math.round(v / Math.PI);
          return k === 0 ? '0' : (k === 1 ? 'π' : (k === -1 ? '−π' : k + 'π'));
        },
        draw: function (g) {
          var F = formas[forma];
          g.fn(F.f, { color: 'axis', w: 2, dash: true, samples: 1500 });
          g.fn(function (x) { return F.serie(x, N); }, { color: 0, w: 2.8, samples: 1500 });
        }
      });
      function paint() {
        var F = formas[forma];
        out.set('<strong>' + F.t + '</strong> con <strong>' + N + '</strong> ' +
          U.plural(N, 'armónico', 'armónicos') + ' — ' + F.coef + '<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">' +
          (N < 4 ? 'Con pocos términos la aproximación es tosca.'
            : (N < 20 ? 'Ya se reconoce la forma, aunque las esquinas se resisten.'
              : 'Fíjate en los picos que quedan junto a los saltos: no desaparecen por muchos armónicos ' +
                'que añadas. Es el <strong>fenómeno de Gibbs</strong>, y es real, no un error del dibujo.')) +
          '</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'cuadrada', value: 'cuadrada' }, { label: 'diente de sierra', value: 'sierra' },
        { label: 'triangular', value: 'triangular' }
      ], { value: 'cuadrada', on: function (v) { forma = v; paint(); } });
      W.slider(W.row(host), { label: 'número de armónicos', min: 1, max: 60, step: 1, value: 1, dec: 0, on: function (v) { N = v; paint(); } });
      W.legend(host, [{ c: 'axis', t: 'función objetivo' }, { c: 0, t: 'suma de armónicos' }]);
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('El espectro');

  p.text('Si en vez de dibujar la señal en el tiempo dibujamos <strong>cuánta amplitud tiene cada ' +
    'frecuencia</strong>, obtenemos el <em>espectro</em>. Es la misma información vista desde otro ' +
    'lado, y para muchísimos problemas es la vista útil.');

  p.demo({
    title: 'La señal y su espectro',
    intro: 'Arriba, la suma de tres ondas puras. Abajo, su espectro: una barra por cada frecuencia presente. Cambia las amplitudes y observa las dos vistas a la vez.',
    build: function (host, d) {
      var A = [1, 0, 0.5], frec = [1, 3, 5];
      var out = W.readout(host, '');
      var p1 = W.plot(host, {
        xmin: 0, xmax: 4 * Math.PI, ymin: -2.4, ymax: 2.4, height: 220,
        xlabel: 'tiempo', ystep: 1,
        draw: function (g) {
          g.fn(function (x) {
            return A[0] * Math.sin(frec[0] * x) + A[1] * Math.sin(frec[1] * x) + A[2] * Math.sin(frec[2] * x);
          }, { color: 0, w: 2.8, samples: 1200 });
        }
      });
      var host2 = U.el('div');
      host.appendChild(host2);
      function pinta() {
        U.clear(host2);
        W.barChart(host2, {
          labels: ['f=1', 'f=2', 'f=3', 'f=4', 'f=5', 'f=6'],
          values: [A[0], 0, A[1], 0, A[2], 0],
          height: 190, color: 1, dec: 2, xlabel: 'frecuencia', ylabel: 'amplitud'
        });
        var activas = [];
        [0, 1, 2].forEach(function (i) { if (A[i] > 0.01) activas.push('f = ' + frec[i]); });
        out.set('La señal contiene ' + (activas.length ? activas.join(', ') : 'nada') + '.<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">La vista temporal y la espectral ' +
          'contienen exactamente la misma información. Comprimir un MP3 consiste en tirar las barras ' +
          'del espectro que el oído no distingue.</span>');
        p1.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'amplitud de f=1', min: 0, max: 1.5, step: 0.1, value: 1, dec: 2, on: function (v) { A[0] = v; pinta(); } });
      W.slider(row, { label: 'amplitud de f=3', min: 0, max: 1.5, step: 0.1, value: 0, dec: 2, on: function (v) { A[1] = v; pinta(); } });
      W.slider(row, { label: 'amplitud de f=5', min: 0, max: 1.5, step: 0.1, value: 0.5, dec: 2, on: function (v) { A[2] = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La transformada de Fourier');

  p.text('La serie sirve para señales <em>periódicas</em>. Para una señal cualquiera hay que dejar que ' +
    'las frecuencias sean continuas, y la suma se convierte en una integral:');

  p.formula('\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)\\,e^{-2\\pi i x \\xi}\\,dx');

  p.text('Ese $e^{-2\\pi i x\\xi}$ no es más que un seno y un coseno juntos, gracias a la fórmula de ' +
    'Euler $e^{i\\theta} = \\cos\\theta + i\\operatorname{sen}\\theta$. Aquí ves para qué servían los ' +
    'números complejos: permiten escribir en un solo símbolo lo que si no serían dos integrales.');

  p.sub('Dónde está esto funcionando ahora mismo');

  p.list([
    '<strong>MP3 y AAC</strong>: se pasa el sonido al espectro y se eliminan las frecuencias que el oído no percibe.',
    '<strong>JPEG</strong>: lo mismo con imágenes, usando la transformada del coseno.',
    '<strong>Wifi, 4G, 5G</strong>: la información se reparte entre muchas frecuencias que no se estorban.',
    '<strong>Resonancia magnética</strong>: la máquina mide directamente el espectro y reconstruye la imagen con la transformada inversa.',
    '<strong>Ecualizadores, autotune, filtros de ruido</strong>: se manipula el espectro y se vuelve al tiempo.'
  ]);

  p.hist('Joseph Fourier llegó a todo esto estudiando cómo se propaga el calor en una barra metálica, ' +
    'un problema de ingeniería bastante prosaico. Lagrange y Laplace rechazaron su memoria de 1807 ' +
    'porque no aceptaban que una serie de funciones continuas pudiera sumar algo con esquinas. Tenían ' +
    'razón en que la demostración era floja; se equivocaban en el resultado. Resolver esa polémica ' +
    'obligó a definir con rigor qué es una función, qué es la convergencia y qué es una integral: ' +
    'buena parte del análisis moderno nació de esta discusión.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Amplitud de un armónico',
    level: 'medio',
    gen: function (r) {
      var k = r.int(1, 8);
      var n = 2 * k - 1;
      return { n: n, val: 4 / (Math.PI * n) };
    },
    ask: function (d) {
      return 'En la serie de Fourier de la onda cuadrada, la amplitud del armónico $n$ es ' +
        '$\\dfrac{4}{\\pi n}$ para los $n$ impares. ¿Cuánto vale la amplitud del armónico $n = ' +
        d.n + '$? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Amplitud', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Sustituye $n = ' + d.n + '$ en $\\frac{4}{\\pi n}$.'; },
    steps: function (d) {
      return ['$\\dfrac{4}{\\pi \\cdot ' + d.n + '} = \\dfrac{4}{' + U.fmt(Math.PI * d.n, 5) + '} = ' + U.fmt(d.val, 4) + '$',
        'Fíjate en que las amplitudes decrecen como $1/n$: los armónicos altos aportan cada vez menos, ' +
        'y por eso con unos pocos ya se reconoce la forma.'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Periodo y frecuencia',
    level: 'basico',
    gen: function (r) {
      var f = r.int(20, 2000);
      return { f: f, T: 1 / f, w: 2 * Math.PI * f };
    },
    ask: function (d) {
      return 'Una onda tiene frecuencia $f = ' + d.f + '$ Hz. Calcula su periodo en segundos y su ' +
        'frecuencia angular $\\omega = 2\\pi f$ (seis y cuatro decimales respectivamente).';
    },
    fields: [{ name: 'T', label: 'Periodo (s)', w: 'wide' }, { name: 'w', label: 'ω (rad/s)', w: 'wide' }],
    sol: function (d) { return { T: U.round(d.T, 8), w: U.round(d.w, 4) }; },
    tol: 3e-4,
    hint: function () { return 'El periodo es el inverso de la frecuencia: $T = 1/f$.'; },
    steps: function (d) {
      return ['$T = \\dfrac{1}{f} = \\dfrac{1}{' + d.f + '} = ' + U.fmt(d.T, 8) + '$ s',
        '$\\omega = 2\\pi f = 2\\pi \\cdot ' + d.f + ' = ' + U.fmt(d.w, 4) + '$ rad/s',
        'La frecuencia angular es la que aparece dentro del seno: $\\operatorname{sen}(\\omega t)$.'];
    },
    answer: function (d) { return 'T = ' + U.fmt(d.T, 6) + ' s, ω = ' + U.fmt(d.w, 4) + ' rad/s'; }
  });

  p.exercise({
    title: 'Suma de armónicos',
    level: 'medio',
    gen: function (r) {
      var N = r.int(1, 6);
      var x = r.pick([Math.PI / 4, Math.PI / 3, Math.PI / 2, 2 * Math.PI / 3]);
      var s = 0;
      for (var k = 1; k <= N; k++) { var n = 2 * k - 1; s += Math.sin(n * x) / n; }
      return { N: N, x: x, val: 4 / Math.PI * s };
    },
    ask: function (d) {
      var nom = { 0.7853981633974483: '\\pi/4', 1.0471975511965976: '\\pi/3', 1.5707963267948966: '\\pi/2', 2.0943951023931953: '2\\pi/3' }[d.x];
      return 'La aproximación de la onda cuadrada con $' + d.N + '$ ' + U.plural(d.N, 'armónico', 'armónicos') +
        ' es $\\dfrac{4}{\\pi}\\sum_{k=1}^{' + d.N + '} \\dfrac{\\operatorname{sen}((2k-1)x)}{2k-1}$. ' +
        'Evalúala en $x = ' + nom + '$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 6) }; },
    tol: 3e-4,
    hint: function (d) { return 'Suma los términos con $n = 1, 3, 5, \\dots$ hasta el ' + d.N + '.º, y multiplica todo por $4/\\pi$.'; },
    steps: function (d) {
      var s = [];
      var acum = 0;
      for (var k = 1; k <= d.N; k++) {
        var n = 2 * k - 1;
        acum += Math.sin(n * d.x) / n;
        s.push('Término $n = ' + n + '$: $\\dfrac{\\operatorname{sen}(' + n + 'x)}{' + n + '} = ' +
          U.fmt(Math.sin(n * d.x) / n, 5) + '$');
      }
      s.push('Suma: $' + U.fmt(acum, 5) + '$');
      s.push('Multiplicando por $\\frac{4}{\\pi}$: $' + U.fmt(d.val, 4) + '$');
      s.push('El valor exacto de la onda cuadrada ahí es $1$: cuantos más armónicos, más cerca.');
      return s;
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Euler y los complejos',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: '\\pi', re: -1, im: 0 }, { t: '\\frac{\\pi}{2}', re: 0, im: 1 },
        { t: '2\\pi', re: 1, im: 0 }, { t: '\\frac{3\\pi}{2}', re: 0, im: -1 },
        { t: '0', re: 1, im: 0 }
      ];
      var c = r.pick(casos);
      return { t: c.t, re: c.re, im: c.im };
    },
    ask: function (d) {
      return 'Usando la fórmula de Euler $e^{i\\theta} = \\cos\\theta + i\\operatorname{sen}\\theta$, ' +
        'calcula la parte real y la parte imaginaria de $e^{i' + d.t + '}$.';
    },
    fields: [{ name: 're', label: 'Parte real', w: 'tiny' }, { name: 'im', label: 'Parte imaginaria', w: 'tiny' }],
    sol: function (d) { return { re: d.re, im: d.im }; },
    tol: 1e-6,
    hint: function (d) { return 'Basta con calcular $\\cos(' + d.t + ')$ y $\\operatorname{sen}(' + d.t + ')$.'; },
    steps: function (d) {
      return ['$e^{i\\theta} = \\cos\\theta + i\\operatorname{sen}\\theta$',
        'Con $\\theta = ' + d.t + '$: $\\cos = ' + d.re + '$ y $\\operatorname{sen} = ' + d.im + '$.',
        'Resultado: $' + d.re + (d.im >= 0 ? ' + ' + d.im : ' - ' + (-d.im)) + 'i$',
        d.re === -1 && d.im === 0
          ? 'Este caso es la <strong>identidad de Euler</strong>: $e^{i\\pi} + 1 = 0$, que reúne en cinco símbolos $e$, $i$, $\\pi$, $1$ y $0$.'
          : 'Fíjate en que $e^{i\\theta}$ recorre la circunferencia unidad: por eso sirve para describir ondas.'];
    },
    answer: function (d) { return d.re + (d.im >= 0 ? ' + ' + d.im : ' - ' + (-d.im)) + 'i'; }
  });

  p.keys([
    'Toda función periódica razonable es una suma de senos y cosenos.',
    'Los coeficientes miden cuánto se parece la señal a cada onda pura.',
    'El espectro es la misma información vista por frecuencias en vez de por tiempo.',
    'El fenómeno de Gibbs: los picos junto a los saltos no desaparecen nunca.',
    'La transformada extiende la idea a señales no periódicas, con frecuencias continuas.',
    'MP3, JPEG, wifi y resonancia magnética son, por dentro, Fourier.',
    '$e^{i\\theta} = \\cos\\theta + i\\operatorname{sen}\\theta$ empaqueta seno y coseno en un solo símbolo.'
  ]);
});
