/* Tema: Magnitudes, unidades y análisis dimensional */
Course.topic('ar-magnitudes', function (p) {

  p.text('Una <strong>magnitud</strong> es todo aquello que se puede medir: longitud, masa, tiempo, ' +
    'temperatura. Y medir es comparar con una unidad. Sin unidad, un número no significa nada: ' +
    '«pesa 3» no dice absolutamente nada.');

  p.section('El Sistema Internacional');

  p.text('Hay siete magnitudes <strong>fundamentales</strong>; todas las demás se construyen a partir ' +
    'de ellas y se llaman <em>derivadas</em>.');

  p.table(['Magnitud', 'Unidad', 'Símbolo'],
    [['Longitud', 'metro', 'm'],
     ['Masa', 'kilogramo', 'kg'],
     ['Tiempo', 'segundo', 's'],
     ['Intensidad de corriente', 'amperio', 'A'],
     ['Temperatura', 'kelvin', 'K'],
     ['Cantidad de sustancia', 'mol', 'mol'],
     ['Intensidad luminosa', 'candela', 'cd']]);

  p.formulas([
    '[\\text{velocidad}] = \\frac{L}{T} \\quad (\\text{m/s})',
    '[\\text{aceleración}] = \\frac{L}{T^2} \\quad (\\text{m/s}^2)',
    '[\\text{fuerza}] = \\frac{M \\cdot L}{T^2} \\quad (\\text{newton})',
    '[\\text{energía}] = \\frac{M \\cdot L^2}{T^2} \\quad (\\text{julio})'
  ], 'magnitudes derivadas y su dimensión');

  p.hist('El metro nació de la Revolución Francesa con una idea preciosa: que la unidad no dependiera ' +
    'del pie de ningún rey, sino de la propia Tierra. Se definió como la diezmillonésima parte del ' +
    'cuarto de meridiano terrestre. Dos astrónomos, Delambre y Méchain, tardaron siete años (1792-1799) ' +
    'en medir el arco entre Dunkerque y Barcelona en plena guerra, siendo detenidos varias veces por ' +
    'sospechosos. Hoy el metro se define por la velocidad de la luz, pero su longitud sigue siendo la ' +
    'que ellos midieron.');

  /* ---------------------------------------------------------------- */
  p.section('Cambiar de unidad: el factor de conversión');

  p.text('Cambiar de unidad no es más que <strong>multiplicar por 1</strong>, escrito de forma ' +
    'astuta. Como $1\\ \\text{km} = 1000\\ \\text{m}$, la fracción $\\frac{1000\\ \\text{m}}{1\\ \\text{km}}$ ' +
    'vale exactamente 1, y multiplicar por ella no cambia la cantidad, solo cómo se escribe.');

  p.formula('72\\ \\frac{\\text{km}}{\\text{h}} \\cdot \\frac{1000\\ \\text{m}}{1\\ \\text{km}} \\cdot \\frac{1\\ \\text{h}}{3600\\ \\text{s}} = 20\\ \\frac{\\text{m}}{\\text{s}}',
    'factores de conversión encadenados');

  p.note('La ventaja de escribirlo así es que <strong>las unidades se tachan solas</strong>, igual que ' +
    'los factores de una fracción. Si al final te queda la unidad que buscabas, has montado bien la ' +
    'cadena. Si te queda otra cosa, has puesto algún factor del revés.', 'ok', 'El método que no falla');

  p.demo({
    title: 'Conversor con las unidades a la vista',
    intro: 'Elige de qué unidad a cuál. Fíjate en cómo se cancelan las unidades y en qué queda al final.',
    build: function (host, d) {
      var val = 72, de = 'km/h', a = 'm/s';
      var pares = [
        { de: 'km/h', a: 'm/s', f: 1 / 3.6, cad: '\\cdot \\dfrac{1000\\ \\text{m}}{1\\ \\text{km}} \\cdot \\dfrac{1\\ \\text{h}}{3600\\ \\text{s}}', nota: 'Dividir entre 3,6 es exactamente esto: multiplicar por 1000 y dividir entre 3600.' },
        { de: 'm/s', a: 'km/h', f: 3.6, cad: '\\cdot \\dfrac{1\\ \\text{km}}{1000\\ \\text{m}} \\cdot \\dfrac{3600\\ \\text{s}}{1\\ \\text{h}}', nota: 'El camino de vuelta: multiplicar por 3,6.' },
        { de: 'km', a: 'cm', f: 100000, cad: '\\cdot \\dfrac{1000\\ \\text{m}}{1\\ \\text{km}} \\cdot \\dfrac{100\\ \\text{cm}}{1\\ \\text{m}}', nota: 'Dos saltos encadenados: 1 km son 100 000 cm.' },
        { de: 'm^2', a: 'cm^2', f: 10000, cad: '\\cdot \\left(\\dfrac{100\\ \\text{cm}}{1\\ \\text{m}}\\right)^2', nota: 'Ojo: al ser una superficie, el factor va <strong>al cuadrado</strong>. No son 100, son 10 000.' },
        { de: 'm^3', a: 'l', f: 1000, cad: '\\cdot \\dfrac{1000\\ \\text{l}}{1\\ \\text{m}^3}', nota: 'Un metro cúbico son mil litros, porque 1 litro = 1 dm³.' },
        { de: 'h', a: 's', f: 3600, cad: '\\cdot \\dfrac{60\\ \\text{min}}{1\\ \\text{h}} \\cdot \\dfrac{60\\ \\text{s}}{1\\ \\text{min}}', nota: 'El tiempo es la única magnitud del SI que no es decimal: herencia babilónica.' }
      ];
      var idx = 0;
      var out = W.readout(host, '');
      function paint() {
        var P = pares[idx];
        out.set('$' + U.fmt(val, 4) + '\\ \\text{' + P.de.replace('^2', '}^2\\text{').replace('^3', '}^3\\text{') + '} ' +
          P.cad + ' = ' + U.fmt(val * P.f, 6) + '\\ \\text{' + P.a.replace('^2', '}^2\\text{').replace('^3', '}^3\\text{') + '}$<br>' +
          '<span style="font-size:12.5px;color:var(--ink-faint)">' + P.nota + '</span>');
      }
      W.chips(host, pares.map(function (P, i) {
        return { label: P.de.replace('^2', '²').replace('^3', '³') + ' → ' + P.a.replace('^2', '²').replace('^3', '³'), value: i };
      }), { value: 0, on: function (v) { idx = v; paint(); } });
      W.slider(W.row(host), { label: 'cantidad', min: 0.5, max: 200, step: 0.5, value: 72, dec: 1, on: function (v) { val = v; paint(); } });
      paint();
    }
  });

  p.note('El error más caro de la historia por un cambio de unidades: en 1999 la NASA perdió la sonda ' +
    '<em>Mars Climate Orbiter</em>, de 125 millones de dólares, porque un equipo trabajaba en libras-fuerza ' +
    'y otro en newtons. La nave se acercó demasiado a Marte y se desintegró. Nadie había comprobado ' +
    'las unidades.', 'warn', 'Por qué esto importa de verdad');

  /* ---------------------------------------------------------------- */
  p.section('Cifras significativas');

  p.text('Si mides una mesa con una cinta métrica y dices que mide $1{,}2473859$ m, estás mintiendo: ' +
    'la cinta no da para tanto. Las <strong>cifras significativas</strong> son las que realmente ' +
    'aportan información sobre la medida.');

  p.list([
    'Los ceros a la izquierda <strong>no</strong> cuentan: $0{,}0043$ tiene 2 cifras significativas.',
    'Los ceros entre cifras <strong>sí</strong> cuentan: $1{,}003$ tiene 4.',
    'Al <strong>multiplicar o dividir</strong>, el resultado lleva tantas cifras significativas como el dato que menos tenga.',
    'Al <strong>sumar o restar</strong>, manda el dato con menos decimales.'
  ]);

  p.note('Una calculadora te dará $12$ decimales encantada. Escribirlos todos no es ser preciso: es no ' +
    'saber qué significa una medida. Si mides el radio de una rueda con una regla ($r = 32$ cm, dos ' +
    'cifras) y calculas su longitud, la respuesta honesta es $2{,}0\\cdot10^2$ cm, no $201{,}06192983$.',
    'warn');

  /* ---------------------------------------------------------------- */
  p.section('Análisis dimensional');

  p.text('Y aquí llega la herramienta más útil de todo el tema, la que sirve de red de seguridad: ' +
    '<strong>en una igualdad, los dos lados tienen que tener las mismas dimensiones</strong>. No se ' +
    'pueden sumar metros con segundos ni igualar una energía a una velocidad.');

  p.text('Eso permite <strong>detectar fórmulas mal recordadas sin saber física</strong>. Y a veces ' +
    'incluso deducir la fórmula correcta.');

  p.demo({
    title: 'Cazar fórmulas imposibles',
    intro: 'Todas estas fórmulas parecen razonables. Comprueba sus dimensiones y descubre cuáles no pueden ser correctas.',
    build: function (host, d) {
      var idx = 0;
      var casos = [
        { f: 'v = \\dfrac{e}{t}', izq: 'L\\,T^{-1}', der: 'L\\,T^{-1}', ok: true, n: 'Correcta: espacio entre tiempo da velocidad.' },
        { f: 'e = \\dfrac{1}{2}a\\,t^2', izq: 'L', der: 'L\\,T^{-2}\\cdot T^2 = L', ok: true, n: 'Correcta: la aceleración por tiempo al cuadrado da longitud.' },
        { f: 'e = \\dfrac{1}{2}a\\,t', izq: 'L', der: 'L\\,T^{-2}\\cdot T = L\\,T^{-1}', ok: false, n: '<strong>Imposible</strong>: el lado derecho es una velocidad, no una distancia. Falta un tiempo.' },
        { f: 'E = m\\,c^2', izq: 'M\\,L^2\\,T^{-2}', der: 'M \\cdot (L\\,T^{-1})^2 = M\\,L^2\\,T^{-2}', ok: true, n: 'Correcta dimensionalmente. El análisis no demuestra la fórmula, pero descarta las imposibles.' },
        { f: 'T = 2\\pi\\sqrt{\\dfrac{\\ell}{g}}', izq: 'T', der: '\\sqrt{L / (L\\,T^{-2})} = \\sqrt{T^2} = T', ok: true, n: 'Correcta: el periodo de un péndulo. Fíjate en que la masa <em>no</em> aparece, y efectivamente no influye.' },
        { f: 'T = 2\\pi\\sqrt{\\dfrac{g}{\\ell}}', izq: 'T', der: '\\sqrt{(L\\,T^{-2}) / L} = T^{-1}', ok: false, n: '<strong>Imposible</strong>: sale el inverso de un tiempo. La fracción está del revés.' },
        { f: 'F = m\\,v', izq: 'M\\,L\\,T^{-2}', der: 'M\\,L\\,T^{-1}', ok: false, n: '<strong>Imposible</strong>: eso es una cantidad de movimiento, no una fuerza. Falta dividir por un tiempo.' }
      ];
      var out = W.readout(host, '');
      function paint() {
        var C = casos[idx];
        out.set('$' + C.f + '$<br>' +
          'Dimensiones del lado izquierdo: $' + C.izq + '$<br>' +
          'Dimensiones del lado derecho: $' + C.der + '$<br>' +
          '<strong style="color:' + (C.ok ? 'var(--ok)' : 'var(--bad)') + '">' +
          (C.ok ? '✓ Las dimensiones cuadran' : '✗ Las dimensiones NO cuadran') + '</strong> — ' + C.n);
      }
      W.chips(host, casos.map(function (C, i) { return { label: '$' + C.f + '$', value: i }; }),
        { value: 0, on: function (v) { idx = v; paint(); } });
      paint();
    }
  });

  p.note('Una fórmula dimensionalmente correcta <em>puede</em> estar mal (un factor numérico ' +
    'equivocado no se detecta así). Pero una fórmula dimensionalmente incorrecta está ' +
    '<strong>seguro</strong> mal. Es un filtro que cuesta diez segundos y salva exámenes enteros.',
    'ok');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cambio de unidades',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { de: 'km/h', a: 'm/s', f: 1 / 3.6 },
        { de: 'm/s', a: 'km/h', f: 3.6 },
        { de: 'km', a: 'm', f: 1000 },
        { de: 'cm', a: 'm', f: 0.01 },
        { de: 'g', a: 'kg', f: 0.001 },
        { de: 'h', a: 's', f: 3600 },
        { de: 'min', a: 's', f: 60 },
        { de: 'l', a: 'cm³', f: 1000 }
      ];
      var c = r.pick(casos);
      var v = r.int(1, 200) * (c.f < 1 ? 5 : 1);
      return { de: c.de, a: c.a, f: c.f, v: v, res: v * c.f };
    },
    ask: function (d) {
      return 'Expresa $' + U.miles(d.v) + '\\ \\text{' + d.de + '}$ en $\\text{' + d.a + '}$ ' +
        '(cuatro decimales).';
    },
    fields: function (d) { return [{ name: 'r', label: 'Resultado (' + d.a + ')', w: 'wide' }]; },
    sol: function (d) { return { r: U.round(d.res, 6) }; },
    tol: 3e-5,
    hint: function (d) { return 'Monta el factor de conversión de forma que se tache la unidad de partida.'; },
    steps: function (d) {
      return ['Buscamos el factor que relaciona $\\text{' + d.de + '}$ con $\\text{' + d.a + '}$.',
        'Multiplicamos colocando la unidad vieja en el denominador para que se cancele.',
        '$' + d.v + ' \\cdot ' + U.fmt(d.f, 6) + ' = ' + U.fmt(d.res, 6) + '\\ \\text{' + d.a + '}$'];
    },
    answer: function (d) { return U.fmt(d.res, 4) + ' ' + d.a; }
  });

  p.exercise({
    title: 'Unidades al cuadrado y al cubo',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { de: 'm²', a: 'cm²', f: 10000 }, { de: 'km²', a: 'm²', f: 1000000 },
        { de: 'm³', a: 'cm³', f: 1000000 }, { de: 'm³', a: 'l', f: 1000 },
        { de: 'cm²', a: 'mm²', f: 100 }, { de: 'dm³', a: 'cm³', f: 1000 }
      ];
      var c = r.pick(casos);
      var v = r.int(1, 50) / (r.bool() ? 1 : 2);
      return { de: c.de, a: c.a, f: c.f, v: v, res: v * c.f };
    },
    ask: function (d) {
      return 'Expresa $' + U.fmt(d.v, 2) + '\\ \\text{' + d.de + '}$ en $\\text{' + d.a + '}$.';
    },
    fields: [{ name: 'r', label: 'Resultado', w: 'wide' }],
    sol: function (d) { return { r: d.res }; },
    tol: 1e-6,
    hint: function (d) {
      return 'Cuidado: el factor lineal hay que elevarlo al ' +
        (d.de.indexOf('³') >= 0 ? 'cubo' : 'cuadrado') + ', porque la unidad lo está.';
    },
    steps: function (d) {
      var exp = d.de.indexOf('³') >= 0 ? 3 : 2;
      var lineal = Math.round(Math.pow(d.f, 1 / exp));
      return ['El factor <em>lineal</em> entre las dos unidades es $' + lineal + '$.',
        'Como la magnitud es ' + (exp === 3 ? 'un volumen' : 'una superficie') + ', hay que elevarlo a ' + exp + ':',
        '$' + lineal + '^' + exp + ' = ' + U.miles(d.f) + '$',
        '$' + U.fmt(d.v, 2) + ' \\cdot ' + U.miles(d.f) + ' = ' + U.miles(d.res) + '\\ \\text{' + d.a + '}$',
        'Este es el error más frecuente del tema: usar el factor lineal en superficies o volúmenes.'];
    },
    answer: function (d) { return U.fmt(d.res, 2) + ' ' + d.a; }
  });

  p.exercise({
    title: 'Cifras significativas',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { n: '0{,}0043', c: 2 }, { n: '1{,}003', c: 4 }, { n: '25{,}0', c: 3 },
        { n: '0{,}500', c: 3 }, { n: '3{,}14159', c: 6 }, { n: '100{,}0', c: 4 },
        { n: '0{,}00700', c: 3 }, { n: '45{,}67', c: 4 }, { n: '2{,}0\\cdot10^{3}', c: 2 }
      ];
      var c = r.pick(casos);
      return { n: c.n, c: c.c };
    },
    ask: function (d) {
      return '¿Cuántas cifras significativas tiene $' + d.n + '$?';
    },
    fields: [{ name: 'c', label: 'Cifras', w: 'tiny' }],
    sol: function (d) { return { c: d.c }; },
    hint: function () { return 'Los ceros a la izquierda solo sitúan la coma y no cuentan. Los del final, después de la coma, sí cuentan: indican precisión.'; },
    steps: function (d) {
      return ['Se descartan los ceros de la izquierda: solo colocan la coma.',
        'Se cuentan todas las demás cifras, incluidos los ceros intermedios y los finales tras la coma.',
        'En notación científica solo cuenta la mantisa.',
        '$' + d.n + '$ tiene <strong>' + d.c + '</strong> cifras significativas.'];
    },
    answer: function (d) { return d.c + ' cifras significativas'; }
  });

  p.exercise({
    title: 'Análisis dimensional',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { f: 'v = a\\,t', ok: 1, n: 'aceleración por tiempo da velocidad ✓' },
        { f: 'e = v\\,t^2', ok: 0, n: 'sale $L\\,T$, que no es una longitud' },
        { f: 'F = m\\,a', ok: 1, n: 'es la segunda ley de Newton ✓' },
        { f: 'E = \\dfrac{1}{2}m\\,v^2', ok: 1, n: 'masa por velocidad al cuadrado da energía ✓' },
        { f: 'E = m\\,v', ok: 0, n: 'falta una velocidad: eso es cantidad de movimiento' },
        { f: 'a = \\dfrac{v}{t^2}', ok: 0, n: 'sale $L\\,T^{-3}$: sobra un tiempo' },
        { f: 'P = \\dfrac{E}{t}', ok: 1, n: 'energía entre tiempo es potencia ✓' },
        { f: 'v = \\sqrt{2\\,a\\,e}', ok: 1, n: '$\\sqrt{L\\,T^{-2}\\cdot L} = L\\,T^{-1}$ ✓' }
      ];
      var c = r.pick(casos);
      return { f: c.f, ok: c.ok, n: c.n };
    },
    ask: function (d) {
      return '¿Es dimensionalmente posible la fórmula $' + d.f + '$?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)">Escribe <code>si</code> o <code>no</code>. ' +
        'Recuerda: $[v] = L\\,T^{-1}$, $[a] = L\\,T^{-2}$, $[F] = M\\,L\\,T^{-2}$, $[E] = M\\,L^2\\,T^{-2}$.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.ok ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe <code>si</code> o <code>no</code>.' };
      return (t === 'si') === !!d.ok;
    },
    hint: function () { return 'Sustituye cada símbolo por su dimensión y comprueba que los dos lados coinciden.'; },
    steps: function (d) {
      return ['Se sustituye cada magnitud por su dimensión en función de $M$, $L$ y $T$.',
        'Los dos lados de una igualdad tienen que dar exactamente lo mismo.',
        'Aquí: ' + d.n + '.',
        d.ok ? '<strong>Dimensionalmente posible.</strong> (Que sea correcta del todo ya es otra cuestión: los factores numéricos no se ven así.)'
          : '<strong>Imposible</strong>: la fórmula está mal seguro.'];
    },
    answer: function (d) { return (d.ok ? 'Sí es posible' : 'No es posible') + ': ' + d.n; }
  });

  p.keys([
    'Un número sin unidad no dice nada. El SI tiene siete magnitudes fundamentales.',
    'Cambiar de unidad es multiplicar por 1 bien escrito: las unidades se tachan solas.',
    'En superficies el factor va al cuadrado; en volúmenes, al cubo.',
    'Las cifras significativas dicen hasta dónde llega tu medida: no escribas más de las que tienes.',
    'Los dos lados de una igualdad deben tener las <strong>mismas dimensiones</strong>.',
    'El análisis dimensional no demuestra una fórmula, pero descarta las imposibles en diez segundos.'
  ]);
});
