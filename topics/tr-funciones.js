/* Tema: Funciones trigonométricas y ondas */
Course.topic('tr-funciones', function (p) {

  p.text('Si en vez de tratar $\\operatorname{sen}\\alpha$ como «una razón de un triángulo» lo tratamos ' +
    'como una <strong>función</strong> —le metes un número, te devuelve otro— aparece la herramienta ' +
    'con la que se describe todo lo que oscila: el sonido, la luz, las mareas, la corriente eléctrica, ' +
    'los latidos, las estaciones.');

  p.text('Su característica esencial es que son <strong>periódicas</strong>: se repiten idénticas cada ' +
    'cierto intervalo.');

  p.table(['Función', 'Dominio', 'Recorrido', 'Periodo', 'Simetría'],
    [['$\\operatorname{sen} x$', '$\\mathbb{R}$', '$[-1, 1]$', '$2\\pi$', 'impar'],
     ['$\\cos x$', '$\\mathbb{R}$', '$[-1, 1]$', '$2\\pi$', 'par'],
     ['$\\operatorname{tg} x$', '$\\mathbb{R} - \\{\\frac{\\pi}{2}+k\\pi\\}$', '$\\mathbb{R}$', '$\\pi$', 'impar']]);

  p.note('El coseno es el seno adelantado un cuarto de vuelta: $\\cos x = \\operatorname{sen}(x + \\frac{\\pi}{2})$. ' +
    'Son la misma onda desplazada, y por eso comparten todas sus propiedades.', 'ok');

  /* ---------------------------------------------------------------- */
  p.section('Los cuatro mandos de una onda');
  p.text('Cualquier onda que te encuentres —un sonido, la marea, la corriente de un enchufe, las horas de ' +
    'luz a lo largo del año— se puede escribir con la misma plantilla, cambiando solo cuatro ' +
    'números. Merece la pena entender qué hace cada uno, porque a partir de ahí leerás cualquier ' +
    'función trigonométrica de un vistazo en lugar de dibujarla punto a punto.');


  p.formula('y = A\\,\\operatorname{sen}(B x + C) + D', 'la forma general');

  p.table(['Parámetro', 'Nombre', 'Qué hace'],
    [['$A$', 'amplitud', 'estira o encoge en vertical: la onda va de $D-A$ a $D+A$'],
     ['$B$', 'frecuencia angular', 'aprieta o estira en horizontal: el periodo pasa a ser $\\frac{2\\pi}{B}$'],
     ['$C$', 'fase', 'desplaza la onda a la izquierda ($\\frac{C}{B}$ unidades)'],
     ['$D$', 'desplazamiento vertical', 'sube o baja el eje de la onda']]);

  p.demo({
    title: 'Los cuatro mandos',
    intro: 'Mueve cada parámetro por separado y observa qué controla exactamente. La onda gris de fondo es el seno normal, para comparar.',
    build: function (host, d) {
      var A = 1, B = 1, C = 0, D = 0;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -7, xmax: 7, ymin: -4, ymax: 4, height: 320,
        xstep: Math.PI / 2, ystep: 1,
        xtickLabel: function (v) {
          var k = Math.round(v / (Math.PI / 2));
          if (k === 0) return '0';
          if (k % 2 === 0) return (k / 2 === 1 ? 'π' : (k / 2 === -1 ? '−π' : (k / 2) + 'π'));
          return (k === 1 ? 'π/2' : (k === -1 ? '−π/2' : k + 'π/2'));
        },
        draw: function (g) {
          g.fn(Math.sin, { color: 'axis', w: 1.6, dash: true });
          g.fn(function (x) { return A * Math.sin(B * x + C) + D; }, { color: 0, w: 2.8 });
          g.hline(D, { color: 2, w: 1.2, dash: true });
          g.hline(D + A, { color: 3, w: 1, dash: true, alpha: .6 });
          g.hline(D - A, { color: 3, w: 1, dash: true, alpha: .6 });
        }
      });
      function paint() {
        out.set('$y = ' + U.fmt(A, 1) + '\\operatorname{sen}(' + U.fmt(B, 1) + 'x ' +
          (C >= 0 ? '+ ' + U.fmt(C, 2) : '- ' + U.fmt(-C, 2)) + ') ' +
          (D >= 0 ? '+ ' + U.fmt(D, 1) : '- ' + U.fmt(-D, 1)) + '$<br>' +
          'Amplitud: $' + U.fmt(Math.abs(A), 2) + '$ &nbsp;·&nbsp; ' +
          'Periodo: $\\dfrac{2\\pi}{' + U.fmt(Math.abs(B), 2) + '} = ' + U.fmt(2 * Math.PI / Math.abs(B), 4) + '$ &nbsp;·&nbsp; ' +
          'Recorrido: $[' + U.fmt(D - Math.abs(A), 2) + ', ' + U.fmt(D + Math.abs(A), 2) + ']$');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'amplitud A', min: -3, max: 3, step: 0.25, value: 1, dec: 2, on: function (v) { A = v; paint(); } });
      W.slider(row, { label: 'frecuencia B', min: 0.25, max: 4, step: 0.25, value: 1, dec: 2, on: function (v) { B = v; paint(); } });
      var row2 = W.row(host);
      W.slider(row2, { label: 'fase C', min: -3.14, max: 3.14, step: 0.1, value: 0, dec: 2, on: function (v) { C = v; paint(); } });
      W.slider(row2, { label: 'desplazamiento D', min: -2, max: 2, step: 0.25, value: 0, dec: 2, on: function (v) { D = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Amplitud, frecuencia, fase y desplazamiento son los cuatro mandos de casi todo lo que se ' +
    'repite. En un sonido, la amplitud es el volumen y la frecuencia es lo grave o agudo que suena; ' +
    'en la luz, la frecuencia es el color. Un ecualizador manipula amplitudes; el mando del volumen ' +
    'mueve una sola de esas letras. Y las mareas, las horas de sol a lo largo del año o el consumo ' +
    'eléctrico de una ciudad se modelan con estas mismas cuatro cifras.');

  p.section('La tangente es distinta');

  p.text('La tangente es $\\frac{\\operatorname{sen}x}{\\cos x}$, así que se dispara donde el coseno se ' +
    'anula: en $\\frac{\\pi}{2}$, $\\frac{3\\pi}{2}$… Ahí tiene <strong>asíntotas verticales</strong>. ' +
    'Y su periodo es $\\pi$, la mitad que las otras dos.');

  p.demo({
    title: 'Las tres funciones juntas',
    intro: 'Compara las tres. Fíjate en que la tangente se dispara justo donde el coseno cruza el cero.',
    build: function (host, d) {
      var ver = { sen: true, cos: true, tg: false };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -7, xmax: 7, ymin: -3.5, ymax: 3.5, height: 320,
        xstep: Math.PI / 2, ystep: 1,
        xtickLabel: function (v) {
          var k = Math.round(v / (Math.PI / 2));
          if (k === 0) return '0';
          if (k % 2 === 0) return (Math.abs(k / 2) === 1 ? (k > 0 ? 'π' : '−π') : (k / 2) + 'π');
          return (k === 1 ? 'π/2' : (k === -1 ? '−π/2' : k + 'π/2'));
        },
        draw: function (g) {
          if (ver.sen) g.fn(Math.sin, { color: 0, w: 2.6 });
          if (ver.cos) g.fn(Math.cos, { color: 1, w: 2.6 });
          if (ver.tg) {
            g.fn(Math.tan, { color: 2, w: 2.4, samples: 2000 });
            [-3, -1, 1, 3].forEach(function (k) {
              g.vline(k * Math.PI / 2, { color: 2, w: 1.2, dash: true, alpha: .5 });
            });
          }
        }
      });
      W.chips(host, [
        { label: 'seno', value: 'sen' }, { label: 'coseno', value: 'cos' }, { label: 'tangente', value: 'tg' }
      ], {
        toggle: false, on: function (v) {
          ver[v] = !ver[v];
          out.set('Mostrando: ' + Object.keys(ver).filter(function (k) { return ver[k]; }).join(', ') +
            '. &nbsp; La tangente tiene asíntotas en $\\frac{\\pi}{2} + k\\pi$ y periodo $\\pi$.');
          plot.render();
        }
      });
      out.set('Pulsa los botones para mostrar u ocultar cada función.');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Sumar ondas');

  p.text('Al sumar dos ondas de distinta frecuencia aparece una forma nueva que ya no es un seno, ' +
    'pero sigue siendo periódica. Esta idea, llevada al extremo, es una de las más potentes de todas ' +
    'las matemáticas aplicadas:');

  p.note('<strong>Cualquier</strong> señal periódica, por complicada que sea, se puede escribir como ' +
    'suma de senos y cosenos. Es el <em>análisis de Fourier</em>, y es la razón de que existan el MP3, ' +
    'el JPEG, el wifi y la resonancia magnética. Lo verás en [[av-fourier|Series y transformada de Fourier]], con nombre propio.',
    'ok', 'Hacia dónde lleva esto');

  p.demo({
    title: 'Sumar dos ondas',
    intro: 'Ajusta las dos ondas y mira su suma. Con frecuencias parecidas aparecen «pulsaciones»; con frecuencia doble o triple, formas cada vez menos parecidas a un seno.',
    build: function (host, d) {
      var A1 = 1, f1 = 1, A2 = 0.6, f2 = 3;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.2, xmax: 13, ymin: -2.6, ymax: 2.6, height: 300,
        ystep: 1,
        draw: function (g) {
          g.fn(function (x) { return A1 * Math.sin(f1 * x); }, { color: 0, w: 1.6, alpha: .6 });
          g.fn(function (x) { return A2 * Math.sin(f2 * x); }, { color: 1, w: 1.6, alpha: .6 });
          g.fn(function (x) { return A1 * Math.sin(f1 * x) + A2 * Math.sin(f2 * x); }, { color: 2, w: 3 });
        }
      });
      function paint() {
        out.set('$y = ' + U.fmt(A1, 2) + '\\operatorname{sen}(' + U.fmt(f1, 2) + 'x) + ' +
          U.fmt(A2, 2) + '\\operatorname{sen}(' + U.fmt(f2, 2) + 'x)$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (Math.abs(f1 - f2) < 0.35 && Math.abs(f1 - f2) > 0.01
            ? 'Frecuencias muy parecidas: aparecen <strong>pulsaciones</strong>, la envolvente que oyes como un «uau-uau» cuando se afinan dos cuerdas.'
            : 'La suma sigue siendo periódica, pero ya no tiene forma de seno.') + '</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, { label: 'amplitud 1', min: 0, max: 1.5, step: 0.1, value: A1, dec: 2, on: function (v) { A1 = v; paint(); } });
      W.slider(row, { label: 'frecuencia 1', min: 0.5, max: 5, step: 0.1, value: f1, dec: 2, on: function (v) { f1 = v; paint(); } });
      var row2 = W.row(host);
      W.slider(row2, { label: 'amplitud 2', min: 0, max: 1.5, step: 0.1, value: A2, dec: 2, on: function (v) { A2 = v; paint(); } });
      W.slider(row2, { label: 'frecuencia 2', min: 0.5, max: 5, step: 0.1, value: f2, dec: 2, on: function (v) { f2 = v; paint(); } });
      W.legend(host, [{ c: 0, t: 'onda 1' }, { c: 1, t: 'onda 2' }, { c: 2, t: 'suma' }]);
      paint();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.util('Sumar ondas explica dos cosas que se oyen. Una es el batido: dos notas casi iguales producen un ' +
    'temblor lento, y es exactamente lo que escucha un afinador de pianos —cuando el temblor ' +
    'desaparece, la cuerda está afinada—. La otra son los auriculares con cancelación de ruido, que ' +
    'graban el sonido del exterior y emiten esa misma onda invertida para que la suma se anule. ' +
    'Silencio construido a base de sumar.');

  p.hist('Que cualquier vibración se pueda descomponer en senos lo intuyó Daniel Bernoulli en 1753 ' +
    'estudiando cuerdas vibrantes, y la idea provocó una de las grandes broncas del siglo XVIII: ' +
    'Euler y d\'Alembert sostuvieron que no podía ser cierto para funciones con esquinas. Bernoulli ' +
    'tenía razón y no supo demostrarlo. La demostración llegó con Fourier, medio siglo después, y ' +
    'también a él se la rechazaron al principio.');

  p.section('Practica');

  p.exercise({
    title: 'Valor de la función',
    level: 'basico',
    gen: function (r) {
      var A = r.int(1, 5), B = r.pick([1, 2, 3]);
      var grados = r.pick([0, 30, 45, 60, 90, 120, 135, 150, 180]);
      var x = grados * Math.PI / 180;
      var cual = r.bool();
      return { A: A, B: B, grados: grados, cual: cual, val: A * (cual ? Math.sin(B * x) : Math.cos(B * x)) };
    },
    ask: function (d) {
      return 'Calcula $y$ cuando $x = ' + d.grados + '^\\circ$ en la función $y = ' + d.A +
        (d.cual ? '\\operatorname{sen}' : '\\cos') + '(' + d.B + 'x)$ (cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'y', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.val, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'Primero multiplica el ángulo por $' + d.B + '$; después aplica la razón y multiplica por $' + d.A + '$.'; },
    steps: function (d) {
      return ['El argumento es $' + d.B + ' \\cdot ' + d.grados + '^\\circ = ' + (d.B * d.grados) + '^\\circ$.',
        '$' + (d.cual ? '\\operatorname{sen}' : '\\cos') + ' ' + (d.B * d.grados) + '^\\circ = ' +
        U.fmt(d.val / d.A, 4) + '$',
        'Multiplicamos por la amplitud: $' + d.A + ' \\cdot ' + U.fmt(d.val / d.A, 4) + ' = ' + U.fmt(d.val, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.val, 4); }
  });

  p.exercise({
    title: 'Amplitud, periodo y recorrido',
    level: 'medio',
    gen: function (r) {
      var A = r.nz(-5, 5), B = r.pick([1, 2, 3, 4, 0.5]), D = r.pm(0, 5);
      return { A: A, B: B, D: D, per: 2 * Math.PI / B, min: D - Math.abs(A), max: D + Math.abs(A) };
    },
    ask: function (d) {
      return 'Para la función $y = ' + ML.termTex(d.A, '', 0, true) + '\\operatorname{sen}(' +
        U.fmt(d.B, 2) + 'x)' + ML.termTex(d.D, '', 0, false) + '$, halla la amplitud, el periodo ' +
        '(cuatro decimales) y el valor máximo.';
    },
    fields: [
      { name: 'a', label: 'Amplitud', w: 'tiny' },
      { name: 'p', label: 'Periodo', w: 'tiny' },
      { name: 'm', label: 'Máximo', w: 'tiny' }
    ],
    sol: function (d) { return { a: Math.abs(d.A), p: U.round(d.per, 4), m: d.max }; },
    tol: 3e-4,
    hint: function () { return 'Amplitud es $|A|$ (siempre positiva); periodo, $\\frac{2\\pi}{B}$; y el máximo es $D + |A|$.'; },
    steps: function (d) {
      return ['Amplitud: $|A| = |' + d.A + '| = ' + Math.abs(d.A) + '$.',
        'Periodo: $\\dfrac{2\\pi}{' + U.fmt(d.B, 2) + '} = ' + U.fmt(d.per, 4) + '$.',
        'La onda oscila alrededor de $y = ' + d.D + '$, subiendo y bajando $' + Math.abs(d.A) + '$.',
        'Máximo: $' + d.D + ' + ' + Math.abs(d.A) + ' = ' + d.max + '$ (y mínimo $' + d.min + '$).'];
    },
    answer: function (d) {
      return 'Amplitud ' + Math.abs(d.A) + ', periodo ' + U.fmt(d.per, 4) + ', máximo ' + d.max + '.';
    }
  });

  p.exercise({
    title: 'Dominio de la tangente',
    level: 'medio',
    gen: function (r) {
      var k = r.int(-3, 3);
      return { k: k, grados: 90 + 180 * k };
    },
    ask: function (d) {
      return 'La función $\\operatorname{tg} x$ no está definida en ciertos puntos. ' +
        'Escribe en grados el valor prohibido que corresponde a $k = ' + d.k + '$ en la ' +
        'expresión $x = 90^\\circ + 180^\\circ k$.';
    },
    fields: [{ name: 'v', label: 'Grados', w: 'tiny' }],
    sol: function (d) { return { v: d.grados }; },
    hint: function () { return 'La tangente es $\\frac{\\operatorname{sen}x}{\\cos x}$: falla donde el coseno vale cero.'; },
    steps: function (d) {
      return ['La tangente no existe donde $\\cos x = 0$.',
        'Eso ocurre en $90^\\circ$ y cada $180^\\circ$ a partir de ahí.',
        '$90 + 180 \\cdot (' + d.k + ') = ' + d.grados + '^\\circ$',
        'En ese punto la gráfica tiene una <strong>asíntota vertical</strong>.'];
    },
    answer: function (d) { return d.grados + '°'; }
  });

  p.exercise({
    title: 'Modelo de una onda real',
    level: 'avanzado',
    gen: function (r) {
      var media = r.int(10, 25), amp = r.int(3, 12);
      var horas = r.pick([6, 12, 24]);
      var t = r.int(0, horas - 1);
      var val = media + amp * Math.sin(2 * Math.PI * t / horas);
      return { media: media, amp: amp, horas: horas, t: t, val: val };
    },
    ask: function (d) {
      return 'La altura de la marea en un puerto se modela con $h(t) = ' + d.media + ' + ' + d.amp +
        '\\operatorname{sen}\\left(\\dfrac{2\\pi t}{' + d.horas + '}\\right)$ metros, con $t$ en horas. ' +
        '¿Qué altura hay a las $t = ' + d.t + '$ horas? (cuatro decimales)';
    },
    fields: [{ name: 'v', label: 'Altura (m)', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.val, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'Sustituye $t = ' + d.t + '$. El argumento del seno queda en radianes.'; },
    steps: function (d) {
      var arg = 2 * Math.PI * d.t / d.horas;
      return ['Argumento: $\\dfrac{2\\pi \\cdot ' + d.t + '}{' + d.horas + '} = ' + U.fmt(arg, 4) + '$ rad.',
        '$\\operatorname{sen}(' + U.fmt(arg, 4) + ') = ' + U.fmt(Math.sin(arg), 4) + '$',
        '$h = ' + d.media + ' + ' + d.amp + ' \\cdot ' + U.fmt(Math.sin(arg), 4) + ' = ' + U.fmt(d.val, 4) + '$ m',
        'El modelo tiene periodo $' + d.horas + '$ horas: la marea sube y baja entre $' +
        (d.media - d.amp) + '$ y $' + (d.media + d.amp) + '$ metros.'];
    },
    answer: function (d) { return U.fmt(d.val, 4) + ' m'; }
  });

  p.keys([
    'Seno y coseno son periódicas de periodo $2\\pi$ y su recorrido es $[-1,1]$.',
    'La tangente tiene periodo $\\pi$ y asíntotas donde el coseno se anula.',
    'En $y = A\\operatorname{sen}(Bx+C)+D$: $A$ estira en vertical, $B$ cambia el periodo a $\\frac{2\\pi}{B}$, $C$ desplaza y $D$ sube.',
    'El coseno es el seno adelantado $\\frac{\\pi}{2}$.',
    'Sumando senos se construyen formas arbitrarias: esa es la idea de Fourier.'
  ]);
});
