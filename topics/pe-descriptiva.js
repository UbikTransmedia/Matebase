/* Tema: Estadística descriptiva */
Course.topic('pe-descriptiva', function (p) {

  p.text('La estadística descriptiva hace una cosa concreta: coger un montón de datos y resumirlos en ' +
    'unos pocos números que se puedan entender de un vistazo. Nada de adivinar el futuro (eso es ' +
    'inferencia); solo describir lo que hay.');

  p.list([
    '<strong>Población</strong>: todo el conjunto que interesa estudiar.',
    '<strong>Muestra</strong>: la parte que realmente se observa.',
    '<strong>Variable</strong>: lo que se mide. Puede ser <em>cualitativa</em> (color de ojos), ' +
    '<em>cuantitativa discreta</em> (número de hermanos) o <em>cuantitativa continua</em> (altura).'
  ]);

  p.section('Medidas de centralización');
  p.text('Cuando tienes un montón de datos, lo primero que quieres es un número que los represente a ' +
    'todos. Hay tres candidatos y no dicen lo mismo: la <strong>media</strong> reparte el total a ' +
    'partes iguales, la <strong>mediana</strong> es el valor que deja la mitad a cada lado, y la ' +
    '<strong>moda</strong> es el que más se repite. Elegir uno u otro no es indiferente, y en cuanto ' +
    'haya un dato extremo verás que la diferencia es enorme.');


  p.formulas([
    '\\overline{x} = \\frac{\\sum x_i}{N} = \\frac{\\sum f_i\\,x_i}{N}',
    '\\text{mediana} = \\text{el valor que deja la mitad a cada lado}',
    '\\text{moda} = \\text{el valor que más se repite}'
  ], 'media, mediana y moda',
    'El símbolo $\\overline{x}$ se dice «equis barra» o «media de equis». El $\\sum$ es la sigma ' +
      'griega mayúscula y se lee «sumatorio de» o, más llanamente, «suma de todos los».<br><br>Entera: ' +
      '<em>«equis barra es igual a la suma de todos los equis sub i, partido por ene»</em>.<br><br>La ' +
      '$i$ de $x_i$ es solo un contador: $x_1$ es el primer dato, $x_2$ el segundo, y así hasta el ' +
      'último. No es una incógnita ni un número que haya que averiguar.');

  p.note('La media es sensible a los valores extremos y la mediana no. Si en una empresa de diez ' +
    'personas nueve cobran 1500 € y el jefe 50 000, la media dice 6350 € y la mediana dice 1500 €. ' +
    'La mediana describe mucho mejor a esa plantilla. Cuando alguien te dé una media, pregunta ' +
    'siempre por la dispersión.', 'warn', 'Por qué la media a veces miente');

  p.util('La diferencia entre media y mediana es un asunto político. Si diez personas ganan 1000 € y una ' +
    'gana un millón, la media dice que cobran unos 91 000 € y la mediana dice 1000 €: solo una de ' +
    'las dos describe la vida de esa gente. Por eso los informes de salarios y de precios de ' +
    'vivienda serios dan siempre la mediana, y por eso conviene desconfiar cuando alguien elige la ' +
    'media para hablar de rentas.');

  p.section('Medidas de dispersión');

  p.text('El centro no basta. Dos grupos pueden tener la misma media y ser completamente distintos: ' +
    'uno muy homogéneo y otro con datos disparados. Eso lo mide la <strong>desviación típica</strong>.');

  p.formulas([
    '\\sigma^2 = \\frac{\\sum (x_i - \\overline{x})^2}{N} \\quad\\text{(varianza)}',
    '\\sigma = \\sqrt{\\sigma^2} \\quad\\text{(desviación típica)}',
    'CV = \\frac{\\sigma}{\\overline{x}} \\quad\\text{(coeficiente de variación)}'
  ], 'varianza y desviación típica',
    '$\\sigma$ es la letra griega sigma minúscula; $\\sigma^2$ se dice «sigma al cuadrado» y es la ' +
      'varianza, y $\\sigma$ a secas es la desviación típica.<br><br>Se lee: <em>«sigma al cuadrado es ' +
      'igual a la suma de los equis sub i menos equis barra, al cuadrado, partido por ' +
      'ene»</em>.<br><br>Lo que hace, paso a paso: mide cuánto se aleja cada dato de la media, eleva ' +
      'al cuadrado esas distancias para que las de un lado no cancelen a las del otro, y hace el ' +
      'promedio. Como al elevar al cuadrado las unidades quedan raras —euros al cuadrado—, al final se ' +
      'saca la raíz y se vuelve a euros: eso es la desviación típica.');

  p.text('La desviación típica se interpreta como «lo que se aleja un dato típico de la media». ' +
    'Está en las mismas unidades que los datos, y por eso es más legible que la varianza.');

  p.demo({
    title: 'Misma media, distinta dispersión',
    intro: 'Los dos grupos tienen exactamente la misma media. Sube la dispersión del segundo y mira cómo se separan los datos sin que la media se mueva.',
    build: function (host, d) {
      var disp = 1;
      var base = [5, 5, 6, 6, 6, 7, 7];
      var out = W.readout(host, '');
      function grupo2() {
        var m = ML.mean(base);
        return base.map(function (v) { return U.round(m + (v - m) * disp, 3); });
      }
      var plot = W.plot(host, {
        xmin: -1, xmax: 13, ymin: -1.6, ymax: 1.6, height: 220,
        ystep: 1, yticks: false, ylabel: null, xlabel: 'valor',
        draw: function (g) {
          var g2 = grupo2();
          var m = ML.mean(base);
          g.vline(m, { color: 'axis', dash: true, w: 1.6 });
          base.forEach(function (v) { g.point(v, 0.7, { color: 0, r: 6, alpha: .8 }); });
          g2.forEach(function (v) { g.point(v, -0.7, { color: 1, r: 6 }); });
          g.text(m, 1.35, 'media = ' + U.fmt(m, 2), { align: 'center', size: 12, color: 'ink', box: true });
          g.text(-0.8, 0.7, 'A', { align: 'left', size: 14, color: 0, bold: true });
          g.text(-0.8, -0.7, 'B', { align: 'left', size: 14, color: 1, bold: true });
        }
      });
      function paint() {
        var g2 = grupo2();
        out.set('<span style="color:var(--c1)">Grupo A</span>: media $' + U.fmt(ML.mean(base), 3) +
          '$, desviación típica $' + U.fmt(ML.sd(base), 3) + '$<br>' +
          '<span style="color:var(--c2)">Grupo B</span>: media $' + U.fmt(ML.mean(g2), 3) +
          '$, desviación típica $' + U.fmt(ML.sd(g2), 3) + '$<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">La media no distingue los dos grupos; ' +
          'la desviación típica sí.</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'dispersión del grupo B', min: 0, max: 4, step: 0.25, value: 1, dec: 2,
        on: function (v) { disp = v; paint(); }
      });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('La dispersión suele importar más que el promedio. Dos procesos de fabricación con la misma ' +
    'medida media son muy distintos si uno tiene el doble de desviación: ese produce más piezas ' +
    'fuera de tolerancia, y de ahí sale el control de calidad, que vigila la desviación típica y no ' +
    'la media. En una inversión, la desviación es literalmente lo que se llama riesgo. Un río con ' +
    'caudal medio agradable puede inundar el pueblo si su dispersión es grande.');

  p.section('Tablas y gráficos');

  p.text('Con muchos datos se agrupan en una <strong>tabla de frecuencias</strong>:');

  p.table(['Símbolo', 'Nombre', 'Qué es'],
    [['$x_i$', 'valor', 'cada dato distinto'],
     ['$f_i$', 'frecuencia absoluta', 'cuántas veces aparece'],
     ['$h_i$', 'frecuencia relativa', '$f_i/N$, la proporción'],
     ['$F_i$', 'frecuencia acumulada', 'suma de todas las anteriores']]);

  p.demo({
    title: 'De los datos al diagrama de barras',
    intro: 'Estos son los goles marcados en 30 partidos. Cambia el conjunto de datos y observa cómo se mueven la media, la mediana y la moda.',
    build: function (host, d) {
      var datos = [0, 1, 1, 2, 0, 3, 2, 1, 4, 2, 1, 0, 2, 3, 1, 2, 5, 1, 0, 2, 3, 1, 2, 1, 0, 4, 2, 1, 3, 2];
      var host2 = U.el('div');
      host.appendChild(host2);
      var out = W.readout(host, '');
      function pinta() {
        U.clear(host2);
        var f = [0, 0, 0, 0, 0, 0];
        datos.forEach(function (v) { f[v]++; });
        W.barChart(host2, {
          labels: ['0', '1', '2', '3', '4', '5'], values: f,
          xlabel: 'goles', ylabel: 'partidos', height: 250, dec: 0
        });
        var med = ML.mean(datos), mdn = ML.median(datos), mod = ML.mode(datos);
        out.set('$N = ' + datos.length + '$ &nbsp;·&nbsp; ' +
          'media $\\overline{x} = ' + U.fmt(med, 3) + '$ &nbsp;·&nbsp; ' +
          'mediana $= ' + U.fmt(mdn, 2) + '$ &nbsp;·&nbsp; moda $= ' + mod.join(', ') + '$<br>' +
          'desviación típica $\\sigma = ' + U.fmt(ML.sd(datos), 3) + '$ &nbsp;·&nbsp; ' +
          'CV $= ' + U.fmt(ML.sd(datos) / med, 3) + '$');
      }
      W.buttons(host, [
        {
          t: '↻ Otra temporada', cls: 'btn--main', on: function () {
            var r = U.rng();
            datos = [];
            for (var i = 0; i < 30; i++) datos.push(Math.min(5, Math.floor(Math.abs(r.real(-3, 3)) )));
            pinta();
          }
        }
      ]);
      pinta();
    }
  });

  p.section('Cuartiles y diagrama de caja');

  p.text('La mediana parte los datos ordenados en dos mitades. Los <strong>cuartiles</strong> los parten en ' +
    'cuatro cuartos: por debajo de $Q_1$ queda el 25 % de los datos, por debajo de $Q_2$ —que es la ' +
    'mediana— el 50 %, y por debajo de $Q_3$ el 75 %. En general, el <strong>percentil</strong> $P_k$ deja ' +
    'por debajo el $k$ % de los datos: $Q_1 = P_{25}$ y $Q_3 = P_{75}$. Para calcularlos con $N$ datos:');

  p.list([
    'Se ordenan los datos de menor a mayor.',
    'Para $Q_1$ se calcula $\\frac{N}{4}$. Si no es entero, $Q_1$ es el dato de la posición siguiente; si es entero, la media entre ese dato y el siguiente.',
    'Para $Q_3$ se hace lo mismo con $\\frac{3N}{4}$.'
  ], true);

  p.formula('RI = Q_3 - Q_1', 'rango intercuartílico',
    'Se lee «rango intercuartílico»: la anchura del 50 % central de los datos.<br><br>A diferencia del ' +
      'recorrido (el máximo menos el mínimo), no se deja arrastrar por un dato disparatado, igual que la ' +
      'mediana no se deja arrastrar como la media. Por eso sirve para detectar <strong>valores ' +
      'atípicos</strong>: los que quedan a más de $1{,}5\\cdot RI$ por debajo de $Q_1$ o por encima de $Q_3$.');

  p.demo({
    title: 'El diagrama de caja',
    intro: 'La caja va de Q₁ a Q₃, con una raya en la mediana; los bigotes llegan hasta el dato más extremo que no es atípico, y los atípicos se marcan sueltos. Añade un dato disparatado y mira qué se mueve y qué no.',
    build: function (host) {
      var base = [12, 15, 17, 18, 18, 20, 21, 22, 24, 25, 27, 30], extra = 'nada';
      function cuartil(ord, k) {
        var N = ord.length, pos = k * N / 4;
        if (Math.abs(pos - Math.round(pos)) < 1e-9) { pos = Math.round(pos); return (ord[pos - 1] + ord[pos]) / 2; }
        return ord[Math.ceil(pos) - 1];
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 70, ymin: -2, ymax: 2, height: 170, yaxis: false, ylabel: null, xlabel: 'valor',
        aria: 'Diagrama de caja de un conjunto de datos',
        draw: function (g) {
          var datos = base.concat(extra === 'nada' ? [] : [extra === 'alto' ? 60 : 2]).sort(function (a, b) { return a - b; });
          var q1 = cuartil(datos, 1), q2 = cuartil(datos, 2), q3 = cuartil(datos, 3), ri = q3 - q1;
          var lo = q1 - 1.5 * ri, hi = q3 + 1.5 * ri;
          var normales = datos.filter(function (x) { return x >= lo && x <= hi; });
          var bmin = normales[0], bmax = normales[normales.length - 1];
          g.rect(q1, -0.7, q3 - q1, 1.4, { fill: true, fillAlpha: 0.2, color: 0, w: 2 });
          g.seg(q2, -0.7, q2, 0.7, { color: 1, w: 3 });
          g.seg(bmin, 0, q1, 0, { color: 0, w: 2 }); g.seg(q3, 0, bmax, 0, { color: 0, w: 2 });
          g.seg(bmin, -0.35, bmin, 0.35, { color: 0, w: 2 }); g.seg(bmax, -0.35, bmax, 0.35, { color: 0, w: 2 });
          datos.forEach(function (x) { if (x < lo || x > hi) g.point(x, 0, { color: 'bad', r: 5 }); });
        }
      });
      function pinta() {
        var datos = base.concat(extra === 'nada' ? [] : [extra === 'alto' ? 60 : 2]).sort(function (a, b) { return a - b; });
        var q1 = cuartil(datos, 1), q2 = cuartil(datos, 2), q3 = cuartil(datos, 3);
        out.set('$N = ' + datos.length + '$ &nbsp;·&nbsp; $Q_1 = ' + U.fmt(q1, 2) + '$, $Q_2 = ' + U.fmt(q2, 2) + '$, $Q_3 = ' + U.fmt(q3, 2) + '$, $RI = ' + U.fmt(q3 - q1, 2) + '$<br>' +
          'Media: $' + U.fmt(ML.mean(datos), 2) + '$ &nbsp;·&nbsp; recorrido: $' + (datos[datos.length - 1] - datos[0]) + '$' +
          (extra !== 'nada' ? '<br>Un solo dato ha movido mucho la media y el recorrido; los cuartiles, casi nada.' : ''));
        plot.render();
      }
      W.chips(host, [{ label: 'sin datos raros', value: 'nada' }, { label: 'añadir un 60', value: 'alto' }, { label: 'añadir un 2', value: 'bajo' }], { value: extra, on: function (v) { extra = v; pinta(); } });
      pinta();
    }
  });

  /* ================= EJERCICIOS ================= */
  p.hist('Los gráficos estadísticos son un invento sorprendentemente tardío: William Playfair publicó el ' +
    'primer diagrama de barras en 1786 y el primer gráfico de sectores en 1801, y tuvo que ' +
    'defenderse de quienes los consideraban poco serios. Medio siglo después, Florence Nightingale ' +
    'usó un diagrama circular para demostrar al gobierno británico que en Crimea morían muchos más ' +
    'soldados por infecciones que por heridas de guerra. Le hicieron caso, y aquel gráfico salvó ' +
    'miles de vidas.');

  p.section('Practica');

  function datosAleatorios(r, n, lo, hi) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(r.int(lo, hi));
    return a;
  }

  p.exercise({
    title: 'Media, mediana y moda',
    level: 'basico',
    gen: function (r) {
      // Se construyen 10 datos con una moda garantizada (aparece 3 veces
      // y ningún otro valor llega a 3). Con N = 10 la media sale siempre
      // con un solo decimal, que es lo que se le puede pedir al alumno.
      var m = r.int(1, 10), pool = [];
      for (var v = 1; v <= 10; v++) if (v !== m) pool.push(v);
      var datos = [m, m, m], cnt = {}, guard = 0;
      while (datos.length < 10 && guard++ < 200) {
        var x = r.pick(pool);
        if ((cnt[x] || 0) >= 2) continue;
        cnt[x] = (cnt[x] || 0) + 1;
        datos.push(x);
      }
      if (datos.length < 10) return null;
      datos = r.shuffle(datos);
      var mod = ML.mode(datos);
      if (mod.length !== 1) return null;
      return { datos: datos, media: U.round(ML.mean(datos), 4), mediana: ML.median(datos), moda: mod[0] };
    },
    ask: function (d) {
      return 'Con estos datos: $' + d.datos.join(',\\ ') + '$<br>calcula la media (dos decimales), ' +
        'la mediana y la moda.';
    },
    fields: [
      { name: 'me', label: 'Media', w: 'tiny' },
      { name: 'md', label: 'Mediana', w: 'tiny' },
      { name: 'mo', label: 'Moda', w: 'tiny' }
    ],
    sol: function (d) { return { me: d.media, md: d.mediana, mo: d.moda }; },
    tol: 3e-3,
    hint: function (d) {
      return 'Para la mediana hay que <strong>ordenar</strong> primero. Hay ' + d.datos.length +
        ' datos (par), así que la mediana es la media de los dos centrales.';
    },
    steps: function (d) {
      var ord = d.datos.slice().sort(function (a, b) { return a - b; });
      var n = ord.length;
      return ['Media: sumamos todo y dividimos entre $' + n + '$. La suma es $' +
        U.sum(d.datos) + '$, así que $\\overline{x} = \\dfrac{' + U.sum(d.datos) + '}{' + n + '} = ' + U.fmt(d.media, 4) + '$.',
        'Ordenamos: $' + ord.join(',\\ ') + '$.',
        'Como hay un número par de datos, la mediana es la media de los dos centrales: ' +
        '$\\dfrac{' + ord[n / 2 - 1] + ' + ' + ord[n / 2] + '}{2} = ' + U.fmt(d.mediana, 2) + '$.',
        'Moda: el valor que más se repite → $' + d.moda + '$ (aparece 3 veces).'];
    },
    answer: function (d) {
      return 'Media ' + U.fmt(d.media, 2) + ', mediana ' + d.mediana + ', moda ' + d.moda + '.';
    }
  });

  p.exercise({
    title: 'Desviación típica',
    level: 'medio',
    gen: function (r) {
      var n = r.pick([5, 6]);
      var datos = datosAleatorios(r, n, 2, 12);
      var m = ML.mean(datos);
      if (!Number.isInteger(m)) return null;
      return { datos: datos, media: m, sd: ML.sd(datos), va: ML.variance(datos) };
    },
    ask: function (d) {
      return 'Calcula la varianza y la desviación típica de: $' + d.datos.join(',\\ ') + '$ ' +
        '(cuatro decimales).';
    },
    fields: [{ name: 'v', label: 'Varianza', w: 'tiny' }, { name: 's', label: 'Desv. típica', w: 'tiny' }],
    sol: function (d) { return { v: U.round(d.va, 4), s: U.round(d.sd, 4) }; },
    tol: 3e-4,
    hint: function (d) { return 'La media es $' + d.media + '$. Ahora resta la media a cada dato, eleva al cuadrado, suma y divide entre ' + d.datos.length + '.'; },
    steps: function (d) {
      var difs = d.datos.map(function (x) { return x - d.media; });
      return ['Media: $\\overline{x} = ' + d.media + '$.',
        'Desviaciones respecto a la media: $' + difs.join(',\\ ') + '$.',
        'Al cuadrado: $' + difs.map(function (x) { return x * x; }).join(',\\ ') + '$, que suman $' +
        U.sum(difs.map(function (x) { return x * x; })) + '$.',
        '$\\sigma^2 = \\dfrac{' + U.sum(difs.map(function (x) { return x * x; })) + '}{' + d.datos.length + '} = ' + U.fmt(d.va, 4) + '$',
        '$\\sigma = \\sqrt{' + U.fmt(d.va, 4) + '} = ' + U.fmt(d.sd, 4) + '$'];
    },
    answer: function (d) { return 'Varianza ' + U.fmt(d.va, 4) + ', desviación típica ' + U.fmt(d.sd, 4) + '.'; }
  });

  p.exercise({
    title: 'Media con tabla de frecuencias',
    level: 'medio',
    gen: function (r) {
      var vals = [0, 1, 2, 3, 4];
      var f = vals.map(function () { return r.int(1, 12); });
      var N = U.sum(f);
      var suma = 0;
      for (var i = 0; i < vals.length; i++) suma += vals[i] * f[i];
      return { vals: vals, f: f, N: N, suma: suma, media: suma / N };
    },
    ask: function (d) {
      return 'Calcula la media de esta distribución (cuatro decimales):';
    },
    show: function (d, host) {
      var wrap = U.el('div.tbl-wrap');
      var t = U.el('table.tbl');
      t.innerHTML = '<thead><tr><th>' + MathX.render('x_i') + '</th>' +
        d.vals.map(function (v) { return '<th class="num">' + v + '</th>'; }).join('') +
        '<th class="num">Total</th></tr></thead>' +
        '<tbody><tr><td>' + MathX.render('f_i') + '</td>' +
        d.f.map(function (v) { return '<td class="num">' + v + '</td>'; }).join('') +
        '<td class="num"><strong>' + d.N + '</strong></td></tr></tbody>';
      wrap.appendChild(t);
      host.appendChild(wrap);
    },
    fields: [{ name: 'm', label: 'Media', w: 'tiny' }],
    sol: function (d) { return { m: U.round(d.media, 4) }; },
    tol: 3e-4,
    hint: function () { return 'Multiplica cada valor por su frecuencia, suma todo y divide entre el total de datos.'; },
    steps: function (d) {
      var prod = d.vals.map(function (v, i) { return v * d.f[i]; });
      return ['Multiplicamos cada valor por su frecuencia: $' + prod.join(' + ') + '$',
        'La suma $\\sum f_i x_i$ vale $' + d.suma + '$.',
        'El total de datos es $N = ' + d.N + '$.',
        '$\\overline{x} = \\dfrac{' + d.suma + '}{' + d.N + '} = ' + U.fmt(d.media, 4) + '$'];
    },
    answer: function (d) { return U.fmt(d.media, 4); }
  });

  p.exercise({
    title: 'Comparar dispersiones',
    level: 'avanzado',
    gen: function (r) {
      // Los rangos fijos hacian que B saliera casi siempre mas disperso en
      // terminos relativos, y el alumno podia acertar respondiendo B a ciegas.
      // Ahora el nivel y la amplitud de cada grupo se sortean por separado.
      var a = [], b = [];
      var baseA = r.int(8, 60), ampA = r.int(2, 14);
      var baseB = r.int(8, 60), ampB = r.int(2, 14);
      for (var i = 0; i < 6; i++) {
        a.push(Math.max(1, baseA + r.pm(0, ampA)));
        b.push(Math.max(1, baseB + r.pm(0, ampB)));
      }
      var cvA = ML.sd(a) / ML.mean(a), cvB = ML.sd(b) / ML.mean(b);
      if (Math.abs(cvA - cvB) < 0.02) return null;
      return { a: a, b: b, cvA: cvA, cvB: cvB, mayor: cvA > cvB ? 'A' : 'B' };
    },
    ask: function (d) {
      return 'Grupo A: $' + d.a.join(',\\ ') + '$<br>Grupo B: $' + d.b.join(',\\ ') + '$<br>' +
        '¿Cuál de los dos es <strong>relativamente</strong> más disperso? Escribe <code>A</code> o <code>B</code>.';
    },
    fields: [{ name: 'g', label: 'Grupo', w: 'tiny' }],
    sol: function (d) { return { g: d.mayor }; },
    check: function (v, d) {
      var t = v.raw.g.trim().toUpperCase();
      if (t !== 'A' && t !== 'B') return { ok: false, msg: 'Escribe <code>A</code> o <code>B</code>.' };
      return t === d.mayor;
    },
    hint: function () { return 'Las medias son muy distintas, así que comparar desviaciones típicas a pelo engaña. Usa el coeficiente de variación $CV = \\sigma/\\overline{x}$.'; },
    steps: function (d) {
      return ['Grupo A: media $' + U.fmt(ML.mean(d.a), 3) + '$, $\\sigma = ' + U.fmt(ML.sd(d.a), 3) + '$, ' +
        '$CV = ' + U.fmt(d.cvA, 4) + '$.',
        'Grupo B: media $' + U.fmt(ML.mean(d.b), 3) + '$, $\\sigma = ' + U.fmt(ML.sd(d.b), 3) + '$, ' +
        '$CV = ' + U.fmt(d.cvB, 4) + '$.',
        'El coeficiente de variación no tiene unidades, así que permite comparar magnitudes distintas.',
        'Gana el grupo <strong>' + d.mayor + '</strong>, con el CV más alto.'];
    },
    answer: function (d) { return 'El grupo ' + d.mayor + '.'; }
  });

  p.exercise({
    title: 'Cuartiles',
    level: 'medio',
    gen: function (r) {
      var N = r.int(8, 13), datos = datosAleatorios(r, N, 1, 50).sort(function (a, b) { return a - b; });
      function cuartil(ord, k) {
        var M = ord.length, pos = k * M / 4;
        if (Math.abs(pos - Math.round(pos)) < 1e-9) { pos = Math.round(pos); return (ord[pos - 1] + ord[pos]) / 2; }
        return ord[Math.ceil(pos) - 1];
      }
      var mezcla = r.shuffle(datos);
      return { N: N, ord: datos, mezcla: mezcla, q1: cuartil(datos, 1), q3: cuartil(datos, 3) };
    },
    ask: function (d) { return 'Calcula el primer y el tercer cuartil de estos $' + d.N + '$ datos: $' + d.mezcla.join(',\\ ') + '$'; },
    fields: [{ name: 'a', label: '$Q_1$', w: 'tiny' }, { name: 'b', label: '$Q_3$', w: 'tiny' }],
    sol: function (d) { return { a: d.q1, b: d.q3 }; },
    hint: function (d) {
      return ['Ordena los datos primero.', '$\\frac{N}{4} = ' + U.fmt(d.N / 4, 2) + '$ y $\\frac{3N}{4} = ' + U.fmt(3 * d.N / 4, 2) + '$. Si no es entero, se toma la posición siguiente; si lo es, la media con el siguiente.'];
    },
    steps: function (d) {
      var t = function (k) { var pos = k * d.N / 4; return Math.abs(pos - Math.round(pos)) < 1e-9 ? 'entero: media de las posiciones ' + pos + ' y ' + (pos + 1) : 'no entero: posición ' + Math.ceil(pos); };
      return ['Ordenados: $' + d.ord.join(',\\ ') + '$', '$\\frac{N}{4} = ' + U.fmt(d.N / 4, 2) + '$, ' + t(1) + ' → $Q_1 = ' + U.fmt(d.q1, 2) + '$',
        '$\\frac{3N}{4} = ' + U.fmt(3 * d.N / 4, 2) + '$, ' + t(3) + ' → $Q_3 = ' + U.fmt(d.q3, 2) + '$'];
    },
    answer: function (d) { return 'Q₁ = ' + U.fmt(d.q1, 2) + ', Q₃ = ' + U.fmt(d.q3, 2); }
  });

  p.exercise({
    title: '¿Es un valor atípico?',
    level: 'basico',
    gen: function (r) {
      var q1 = r.int(10, 40), ri = r.pick([4, 6, 8, 10, 12]), q3 = q1 + ri, lo = q1 - 1.5 * ri, hi = q3 + 1.5 * ri;
      var tipo = r.pick(['arriba', 'abajo', 'no']), x;
      if (tipo === 'arriba') x = Math.ceil(hi) + r.int(1, 6);
      else if (tipo === 'abajo') x = Math.floor(lo) - r.int(1, 6);
      else x = r.int(Math.ceil(lo) + 1, Math.floor(hi) - 1);
      return { q1: q1, q3: q3, ri: ri, lo: lo, hi: hi, x: x, tipo: tipo };
    },
    ask: function (d) { return 'Un conjunto de datos tiene $Q_1 = ' + d.q1 + '$ y $Q_3 = ' + d.q3 + '$. ¿Es atípico el valor $' + d.x + '$?'; },
    fields: [{ name: 't', label: 'El valor', opts: [{ t: 'es atípico por arriba', v: 'arriba' }, { t: 'es atípico por abajo', v: 'abajo' }, { t: 'no es atípico', v: 'no' }] }],
    sol: function (d) { return { t: d.tipo }; },
    hint: function () { return ['Calcula $RI = Q_3 - Q_1$.', 'Son atípicos los valores por debajo de $Q_1 - 1{,}5\\cdot RI$ o por encima de $Q_3 + 1{,}5\\cdot RI$.']; },
    steps: function (d) { return ['$RI = ' + d.ri + '$. Límites: $' + d.q1 + ' - 1{,}5\\cdot' + d.ri + ' = ' + U.fmt(d.lo, 1) + '$ y $' + d.q3 + ' + 1{,}5\\cdot' + d.ri + ' = ' + U.fmt(d.hi, 1) + '$.', { arriba: '$' + d.x + '$ supera el límite superior: atípico por arriba.', abajo: '$' + d.x + '$ queda por debajo del límite inferior: atípico por abajo.', no: '$' + d.x + '$ está entre los dos límites: no es atípico.' }[d.tipo]]; },
    answer: function (d) { return { arriba: 'Atípico por arriba', abajo: 'Atípico por abajo', no: 'No es atípico' }[d.tipo]; }
  });

  p.keys([
    'Los cuartiles parten los datos ordenados en cuatro cuartos; $RI = Q_3 - Q_1$ mide el 50 % central y no se deja arrastrar por los atípicos.',
    'La estadística descriptiva resume; no predice.',
    'Media, mediana y moda son tres centros distintos y responden a preguntas distintas.',
    'La media se deja arrastrar por los valores extremos; la mediana, no.',
    'Sin una medida de dispersión, un promedio no dice casi nada.',
    '$\\sigma$ está en las mismas unidades que los datos; el $CV = \\sigma/\\overline{x}$ no tiene unidades y sirve para comparar grupos distintos.'
  ]);
});
