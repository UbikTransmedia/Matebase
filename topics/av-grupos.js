/* Tema: Teoría de grupos y simetría */
Course.topic('av-grupos', function (p) {

  p.text('Ya has visto la jugada antes: cuando varias cosas distintas obedecen las mismas reglas, el ' +
    'matemático se queda con las reglas y tira los objetos. Así nacieron los espacios vectoriales. ' +
    'Ahora vamos a hacerlo con una estructura todavía más básica y más universal: el ' +
    '<strong>grupo</strong>.');

  p.text('Un grupo es un conjunto con <strong>una sola operación</strong> que cumple cuatro condiciones:');

  p.list([
    '<strong>Cerrada</strong>: al operar dos elementos del conjunto, el resultado sigue dentro.',
    '<strong>Asociativa</strong>: $(a*b)*c = a*(b*c)$.',
    '<strong>Elemento neutro</strong>: existe $e$ tal que $a*e = e*a = a$.',
    '<strong>Inverso</strong>: cada $a$ tiene un $a^{-1}$ con $a*a^{-1} = e$.'
  ], true);

  p.note('Fíjate en lo que <em>no</em> se pide: no hace falta que sea conmutativa. Si además lo es, se ' +
    'llama <em>abeliano</em>. Y muchos de los grupos más interesantes —los de simetrías, los de giros ' +
    'en el espacio— <strong>no lo son</strong>: el orden en que haces dos giros importa.',
    'warn', 'La conmutativa no está en la lista');

  p.table(['Conjunto', 'Operación', '¿Grupo?'],
    [['$\\mathbb{Z}$', 'suma', 'Sí, abeliano. Neutro 0, inverso $-a$'],
     ['$\\mathbb{Z}$', 'producto', 'No: 2 no tiene inverso entero'],
     ['$\\mathbb{Q} - \\{0\\}$', 'producto', 'Sí, abeliano. Neutro 1, inverso $1/a$'],
     ['Matrices $n\\times n$ con $\\det \\ne 0$', 'producto', 'Sí, <strong>no</strong> abeliano'],
     ['Giros de un cuadrado', 'composición', 'Sí, abeliano, con 4 elementos'],
     ['Simetrías de un cuadrado', 'composición', 'Sí, <strong>no</strong> abeliano, con 8 elementos']]);

  /* ---------------------------------------------------------------- */
  p.section('Grupos de simetría');

  p.text('Aquí está la intuición que lo ilumina todo. Una <strong>simetría</strong> de una figura es ' +
    'cualquier movimiento que la deja igual que estaba. Y esas simetrías forman un grupo de forma ' +
    'automática:');

  p.list([
    'Componer dos simetrías da otra simetría (cerrada).',
    'No mover nada es una simetría (neutro).',
    'Toda simetría se puede deshacer (inverso).',
    'Y componer es asociativo.'
  ]);

  p.note('<strong>La simetría no es una propiedad, es un grupo.</strong> Preguntar «cuán simétrica es ' +
    'esta figura» se convierte en «qué grupo tiene», y eso ya es una pregunta con respuesta exacta.',
    'ok');

  p.demo({
    title: 'El grupo de simetrías de un polígono',
    intro: 'Aplica giros y reflexiones a la figura. Fíjate en que componer dos siempre da otra del mismo grupo, y en que el orden importa.',
    build: function (host, d) {
      var n = 4;
      var giro = 0, reflejado = false;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -2.2, xmax: 2.2, ymin: -1.9, ymax: 1.9, height: 320,
        grid: false, axes: false,
        draw: function (g) {
          var pts = [], etiquetas = [];
          for (var i = 0; i < n; i++) {
            var idx = reflejado ? (n - i) % n : i;
            var a = Math.PI / 2 + 2 * Math.PI * ((idx + giro) % n) / n;
            pts.push([Math.cos(a) * 1.4, Math.sin(a) * 1.4]);
            etiquetas.push(String.fromCharCode(65 + i));
          }
          g.poly(pts, { color: 0, fill: 0, fillAlpha: .18, w: 2.4 });
          pts.forEach(function (P, i) {
            g.point(P[0], P[1], { color: i === 0 ? 2 : 0, r: 8 });
            g.text(P[0], P[1], etiquetas[i], { align: 'center', baseline: 'middle', color: 'bg', size: 13, bold: true });
          });
          // ejes de simetria
          for (var k = 0; k < n; k++) {
            var ang = Math.PI / 2 + Math.PI * k / n;
            g.seg(-2 * Math.cos(ang), -2 * Math.sin(ang), 2 * Math.cos(ang), 2 * Math.sin(ang),
              { color: 'axis', w: 1, dash: true, alpha: .45 });
          }
        }
      });
      function paint() {
        out.set('Polígono regular de <strong>' + n + '</strong> lados.<br>' +
          'Estado actual: giro de $' + U.fmt(360 * giro / n, 0) + '^\\circ$' + (reflejado ? ' + reflexión' : '') + '<br>' +
          'Su grupo de simetrías es el <strong>diédrico $D_{' + n + '}$</strong>, con $' + (2 * n) + '$ elementos: ' +
          n + ' giros (incluido no mover nada) y ' + n + ' reflexiones.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Prueba: gira y luego refleja, y después ' +
          'hazlo al revés. No se llega al mismo sitio: el grupo <strong>no es conmutativo</strong>.</span>');
        plot.render();
      }
      W.buttons(host, [
        { t: 'Girar', cls: 'btn--main', on: function () { giro = (giro + 1) % n; paint(); } },
        { t: 'Reflejar', on: function () { reflejado = !reflejado; paint(); } },
        { t: '↺ Volver al inicio', on: function () { giro = 0; reflejado = false; paint(); } }
      ]);
      W.slider(W.row(host), { label: 'lados del polígono', min: 3, max: 8, step: 1, value: 4, dec: 0, on: function (v) { n = v; giro = 0; reflejado = false; paint(); } });
      paint();
    }
  });

  p.formula('|D_n| = 2n', 'orden del grupo diédrico: n giros y n reflexiones');

  /* ---------------------------------------------------------------- */
  p.section('Teselados: solo hay 17');

  p.text('¿De cuántas maneras esencialmente distintas se puede cubrir un plano infinito con un patrón ' +
    'que se repite? Parece una pregunta de diseño, sin respuesta cerrada. Pero es una pregunta sobre ' +
    'grupos, y la respuesta es exacta y sorprendente:');

  p.note('Existen exactamente <strong>17 grupos de papel pintado</strong>. Ni uno más. Cualquier patrón ' +
    'periódico del plano, lo dibuje quien lo dibuje, pertenece a uno de esos 17. Se demostró en 1891 ' +
    '(Fedórov) y los 17 aparecen ya, todos, en los mosaicos de la Alhambra, seis siglos antes de que ' +
    'nadie los clasificara.', 'ok', 'Los 17 grupos de papel pintado');

  p.text('Del mismo modo, solo hay <strong>5 poliedros regulares</strong> y solo hay 3 polígonos ' +
    'regulares que teselan el plano por sí solos (triángulo, cuadrado y hexágono). Todas esas ' +
    'limitaciones tan concretas del mundo físico son, por debajo, teoremas sobre grupos.');

  p.demo({
    title: 'Teselar el plano',
    intro: 'Solo tres polígonos regulares pueden cubrir el plano ellos solos. La razón es aritmética: sus ángulos tienen que sumar exactamente 360° alrededor de cada vértice.',
    build: function (host, d) {
      var n = 6;
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -4, xmax: 4, ymin: -3, ymax: 3, height: 300,
        grid: false, axes: false,
        draw: function (g) {
          var ang = (n - 2) * 180 / n;
          var cabe = 360 / ang;
          // Cada pieza se representa por su ángulo interior visto desde el
          // vértice común: así se ve de un vistazo si llenan los 360°.
          var k = Math.floor(cabe + 1e-9);
          var L = 2.2;
          for (var i = 0; i < k; i++) {
            var a0 = ang * Math.PI / 180 * i;
            var a1 = a0 + ang * Math.PI / 180;
            g.poly([[0, 0], [L * Math.cos(a0), L * Math.sin(a0)], [L * Math.cos(a1), L * Math.sin(a1)]],
              { color: i % 6, fill: i % 6, fillAlpha: .3, w: 1.8 });
          }
          if (Math.abs(cabe - k) > 1e-9) {
            var hueco0 = ang * Math.PI / 180 * k;
            g.poly([[0, 0], [L * Math.cos(hueco0), L * Math.sin(hueco0)], [L, 0]],
              { color: 'bad', fill: 'bad', fillAlpha: .25, w: 2, dash: true });
          }
          g.point(0, 0, { color: 'ink', r: 5 });
        }
      });
      function paint() {
        var ang = (n - 2) * 180 / n;
        var cabe = 360 / ang;
        var exacto = Math.abs(cabe - Math.round(cabe)) < 1e-9;
        var nombres = { 3: 'triángulo', 4: 'cuadrado', 5: 'pentágono', 6: 'hexágono', 7: 'heptágono', 8: 'octógono', 9: 'eneágono', 10: 'decágono', 12: 'dodecágono' };
        out.set('<strong>' + (nombres[n] || n + ' lados') + '</strong>: cada ángulo interior mide $' +
          U.fmt(ang, 4) + '^\\circ$.<br>' +
          '$\\dfrac{360}{' + U.fmt(ang, 4) + '} = ' + U.fmt(cabe, 5) + '$ piezas alrededor de un vértice.<br>' +
          (exacto
            ? '<strong style="color:var(--ok)">Es un número entero: el ' + (nombres[n] || 'polígono') +
              ' <strong>sí</strong> tesela el plano.</strong>'
            : '<strong style="color:var(--bad)">No es entero: quedan huecos (en rojo). No tesela.</strong>') +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Solo tres polígonos regulares dan ' +
          'cociente entero: el triángulo (6 piezas), el cuadrado (4) y el hexágono (3). Y por eso las ' +
          'abejas construyen hexágonos: es la forma que más superficie encierra con menos cera.</span>');
        plot.render();
      }
      W.slider(W.row(host), { label: 'lados del polígono', min: 3, max: 12, step: 1, value: 6, dec: 0, on: function (v) { n = v; paint(); } });
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('Que solo existan 17 formas de repetir un motivo en el plano es un resultado de grupos, y los ' +
    'artesanos de la Alhambra las encontraron todas siglos antes de que nadie lo demostrara. La ' +
    'misma teoría clasifica los 230 grupos cristalográficos del espacio, que es como se identifica ' +
    'un mineral o una proteína por difracción de rayos X: fue así como Rosalind Franklin obtuvo la ' +
    'imagen de la que se dedujo la estructura del ADN.');

  p.section('Por qué no hay fórmula para el grado 5');

  p.text('Y ahora, el resultado que hizo nacer la teoría de grupos. Hay fórmula para las ecuaciones de ' +
    'grado 2 (la conoces), de grado 3 y de grado 4 (Cardano y Ferrari, siglo XVI). Durante 250 años se ' +
    'buscó la de grado 5.');

  p.text('En 1824 Abel demostró que <strong>no existe</strong>. Y poco después Évariste Galois explicó ' +
    '<em>por qué</em>, con una idea genial: a cada ecuación se le asocia un grupo —el de las simetrías ' +
    'entre sus raíces— y la ecuación se puede resolver con radicales <strong>si y solo si ese grupo ' +
    'tiene cierta estructura</strong>. Para el grado 5 el grupo asociado deja de tenerla.');

  p.note('Es un cambio de mentalidad radical: en vez de buscar la fórmula, se estudia la ' +
    '<em>estructura</em> del problema y se demuestra que la fórmula no puede existir. Ese giro define ' +
    'buena parte del álgebra moderna.', 'ok');

  p.hist('Galois murió en un duelo en 1832, a los veinte años. La noche anterior escribió a toda prisa ' +
    'sus ideas en una carta a un amigo, con anotaciones al margen del tipo «no tengo tiempo». Sus ' +
    'manuscritos habían sido rechazados dos veces por la Academia de París (Cauchy perdió uno, Fourier ' +
    'murió con otro encima de la mesa). Tardaron catorce años en publicarse y hoy fundamentan un área ' +
    'entera de las matemáticas.');

  /* ================= EJERCICIOS ================= */
  p.util('Que no exista fórmula general para el grado 5 no es que no se haya encontrado: está ' +
    '<strong>demostrado que no puede existir</strong>, y esa demostración inauguró el álgebra ' +
    'moderna. Galois la escribió con veinte años, la noche anterior a morir en un duelo. Su idea ' +
    '—estudiar las simetrías de las soluciones en lugar de las soluciones— es hoy la herramienta con ' +
    'la que se construyen los códigos correctores de un disco duro y buena parte de la criptografía.');

  p.hist('<strong>Emmy Noether</strong> demostró en 1918 el teorema que une la simetría con la física: a cada simetría ' +
    'de un sistema le corresponde una magnitud que se conserva. Que las leyes no cambien con el tiempo implica que la ' +
    'energía se conserva; que no cambien al desplazarse, que se conserva el momento. Además, fue una de las fundadoras ' +
    'del álgebra abstracta, la manera de estudiar los grupos y otras estructuras por sus propiedades y no por sus ' +
    'elementos. En Gotinga dio clases durante años sin sueldo y anunciadas con el nombre de David Hilbert, porque la ' +
    'universidad no aceptaba profesoras. Cuando murió, en 1935, Einstein escribió que había sido el genio matemático ' +
    'creativo más importante desde que las mujeres tenían acceso a la enseñanza superior.');

  p.section('Practica');

  p.exercise({
    title: '¿Es un grupo?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { c: '$\\mathbb{Z}$ con la suma', ok: 1, por: 'cerrada, asociativa, neutro 0 e inverso $-a$' },
        { c: '$\\mathbb{N}$ con la suma', ok: 0, por: 'no hay inversos: $-3$ no es natural' },
        { c: '$\\mathbb{Z}$ con el producto', ok: 0, por: 'no hay inversos: $1/2$ no es entero' },
        { c: '$\\mathbb{Q} - \\{0\\}$ con el producto', ok: 1, por: 'neutro 1 e inverso $1/a$ para todo elemento' },
        { c: 'los números pares con la suma', ok: 1, por: 'par más par es par, y el opuesto de un par es par' },
        { c: 'los números impares con la suma', ok: 0, por: 'no es cerrada: impar más impar da par' },
        { c: 'los giros de un cuadrado con la composición', ok: 1, por: 'los cuatro giros forman un grupo cíclico' },
        { c: '$\\mathbb{R}$ con la resta', ok: 0, por: 'la resta no es asociativa: $(a-b)-c \\ne a-(b-c)$' }
      ];
      var c = r.pick(casos);
      return { c: c.c, ok: c.ok, por: c.por };
    },
    ask: function (d) {
      return '¿Es un grupo ' + d.c + '?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe <code>si</code> o <code>no</code>.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.ok ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe <code>si</code> o <code>no</code>.' };
      return (t === 'si') === !!d.ok;
    },
    hint: function () { return 'Comprueba las cuatro condiciones por orden: cerrada, asociativa, neutro e inverso. Basta con que falle una.'; },
    steps: function (d) {
      return ['Las cuatro condiciones: cerrada, asociativa, neutro e inverso <em>para todos</em> los elementos.',
        'El fallo más habitual está en los inversos o en que la operación no sea cerrada.',
        'Aquí: ' + d.por + '.',
        '<strong>' + (d.ok ? 'Sí es un grupo.' : 'No es un grupo.') + '</strong>'];
    },
    answer: function (d) { return (d.ok ? 'Sí' : 'No') + ': ' + d.por + '.'; }
  });

  p.exercise({
    title: 'Orden de un grupo de simetrías',
    level: 'basico',
    gen: function (r) {
      var n = r.int(3, 12);
      var soloGiros = r.bool();
      return { n: n, soloGiros: soloGiros, res: soloGiros ? n : 2 * n };
    },
    ask: function (d) {
      var nombres = { 3: 'triángulo equilátero', 4: 'cuadrado', 5: 'pentágono regular', 6: 'hexágono regular' };
      var nom = nombres[d.n] || ('polígono regular de ' + d.n + ' lados');
      return '¿Cuántas ' + (d.soloGiros ? '<strong>rotaciones</strong>' : '<strong>simetrías en total</strong> (giros y reflexiones)') +
        ' tiene un ' + nom + '?';
    },
    fields: [{ name: 'n', label: 'Cantidad', w: 'tiny' }],
    sol: function (d) { return { n: d.res }; },
    hint: function (d) {
      return d.soloGiros ? 'Hay una rotación por cada vértice al que se puede llevar el primero, incluida la de 0°.'
        : 'El grupo diédrico $D_n$ tiene $n$ giros y $n$ reflexiones.';
    },
    steps: function (d) {
      return ['Un polígono regular de $' + d.n + '$ lados admite $' + d.n + '$ giros distintos ' +
        '(de $0^\\circ$, $' + U.fmt(360 / d.n, 2) + '^\\circ$, y así hasta dar la vuelta).',
        'Y además $' + d.n + '$ reflexiones, una por cada eje de simetría.',
        d.soloGiros ? 'Solo rotaciones: <strong>' + d.n + '</strong> (es el grupo cíclico $C_{' + d.n + '}$).'
          : 'En total: $2 \\cdot ' + d.n + ' = ' + d.res + '$ (es el grupo diédrico $D_{' + d.n + '}$).'];
    },
    answer: function (d) { return String(d.res); }
  });

  p.exercise({
    title: '¿Tesela el plano?',
    level: 'medio',
    gen: function (r) {
      var n = r.int(3, 12);
      var ang = (n - 2) * 180 / n;
      var cabe = 360 / ang;
      return { n: n, ang: ang, cabe: cabe, ok: Math.abs(cabe - Math.round(cabe)) < 1e-9 };
    },
    ask: function (d) {
      return '¿Puede un polígono regular de $' + d.n + '$ lados teselar el plano él solo?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe <code>si</code> o <code>no</code>.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.ok ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe <code>si</code> o <code>no</code>.' };
      return (t === 'si') === d.ok;
    },
    hint: function (d) { return 'Calcula el ángulo interior y comprueba si $360$ es múltiplo exacto de él.'; },
    steps: function (d) {
      return ['Ángulo interior: $\\dfrac{(' + d.n + '-2)\\cdot 180}{' + d.n + '} = ' + U.fmt(d.ang, 4) + '^\\circ$.',
        'Alrededor de un vértice deben caber piezas sumando exactamente $360^\\circ$:',
        '$\\dfrac{360}{' + U.fmt(d.ang, 4) + '} = ' + U.fmt(d.cabe, 5) + '$',
        d.ok ? 'Es un entero: <strong>sí tesela</strong>, con ' + Math.round(d.cabe) + ' piezas por vértice.'
          : 'No es entero: <strong>no tesela</strong>, quedarían huecos o solapes.',
        'Solo hay tres casos posibles: triángulo, cuadrado y hexágono.'];
    },
    answer: function (d) { return (d.ok ? 'Sí tesela' : 'No tesela') + ' (' + U.fmt(d.cabe, 4) + ' piezas por vértice)'; }
  });

  p.exercise({
    title: 'Aritmética modular como grupo',
    level: 'avanzado',
    gen: function (r) {
      var n = r.pick([5, 6, 7, 8, 9, 10, 12]);
      var a = r.int(1, n - 1);
      // orden del elemento a en (Z_n, +): n / mcd(a, n)
      var orden = n / ML.gcd(a, n);
      return { n: n, a: a, orden: orden };
    },
    ask: function (d) {
      return 'En el grupo $(\\mathbb{Z}_{' + d.n + '}, +)$, ¿cuántas veces hay que sumar $' + d.a +
        '$ consigo mismo para volver al $0$?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">A eso se le llama el <em>orden</em> del elemento.</span>';
    },
    fields: [{ name: 'o', label: 'Orden', w: 'tiny' }],
    sol: function (d) { return { o: d.orden }; },
    hint: function (d) { return 'Ve sumando: $' + d.a + ', 2\\cdot' + d.a + ', 3\\cdot' + d.a + '\\dots$ módulo ' + d.n + ', hasta que dé 0. Hay un atajo con el m.c.d.'; },
    steps: function (d) {
      var seq = [];
      for (var k = 1; k <= d.orden; k++) seq.push((k * d.a) % d.n);
      return ['Vamos sumando y reduciendo módulo $' + d.n + '$: $' + seq.join(', ') + '$.',
        'Se vuelve al 0 tras <strong>' + d.orden + '</strong> pasos.',
        'El atajo: el orden es $\\dfrac{n}{\\operatorname{mcd}(a,n)} = \\dfrac{' + d.n + '}{' + ML.gcd(d.a, d.n) + '} = ' + d.orden + '$.',
        d.orden === d.n ? 'Como el orden coincide con el del grupo, este elemento es un <strong>generador</strong>: sumándolo se recorre todo el grupo.'
          : 'El elemento genera solo un subgrupo de ' + d.orden + ' elementos, no todo el grupo.',
        'Por el teorema de Lagrange, el orden de cualquier elemento <strong>divide</strong> siempre al orden del grupo.'];
    },
    answer: function (d) { return 'Orden ' + d.orden; }
  });

  p.keys([
    'Grupo = conjunto + una operación cerrada, asociativa, con neutro e inversos. La conmutativa no se exige.',
    'Las simetrías de cualquier figura forman un grupo de manera automática.',
    'Polígono regular de $n$ lados: grupo diédrico $D_n$, con $2n$ elementos.',
    'Solo hay <strong>17</strong> patrones periódicos posibles del plano, y todos están en la Alhambra.',
    'Solo triángulo, cuadrado y hexágono teselan el plano ellos solos.',
    'Galois: una ecuación se resuelve con radicales según cómo sea el grupo de simetrías de sus raíces. Por eso el grado 5 no tiene fórmula.',
    'Teorema de Lagrange: el orden de un elemento divide al orden del grupo.'
  ]);
});
