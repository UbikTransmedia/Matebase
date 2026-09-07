/* Tema: Números naturales y sistema decimal */
Course.topic('ar-naturales', function (p) {

  p.text('Todo empieza aquí. Los <strong>números naturales</strong> son los que sirven para contar ' +
    'objetos: $1, 2, 3, 4, \\dots$ No se acaban nunca: por muy grande que sea uno, siempre puedes ' +
    'sumarle 1 y obtener otro mayor. Ese conjunto infinito se llama $\\mathbb{N}$.');

  p.formula('\\mathbb{N} = \\{0,\\ 1,\\ 2,\\ 3,\\ 4,\\ 5,\\ \\dots\\}', 'el conjunto de los naturales');

  p.text('El $0$ es un caso especial: durante siglos no se consideró un número, porque nadie ' +
    'cuenta «cero ovejas». Hoy se incluye en $\\mathbb{N}$ porque hace falta para escribir ' +
    'cantidades como 105 y porque es el punto de partida natural al contar.');

  p.hist('Contar es más viejo que escribir. El <em>hueso de Ishango</em> (República Democrática del Congo, ' +
    'unos 20 000 años) tiene muescas agrupadas que parecen un recuento. Los babilonios contaban en ' +
    'base 60 (de ahí los 60 minutos y los 360°), los romanos con letras (MCMXLIV) y los mayas en base 20. ' +
    'El sistema que usamos hoy nació en la India hacia el siglo V, viajó al mundo árabe —donde ' +
    'al-Juarismi lo explicó en un libro que dio origen a la palabra <em>algoritmo</em>— y llegó a Europa ' +
    'en 1202 con el <em>Liber Abaci</em> de Fibonacci. Tardó tres siglos en imponerse.');

  /* ---------------------------------------------------------------- */
  p.section('El valor posicional');

  p.text('Nuestro sistema es <strong>decimal</strong> (diez símbolos: 0-9) y <strong>posicional</strong>: ' +
    'una misma cifra vale una cosa u otra según <em>dónde</em> esté escrita. En $333$ los tres treses ' +
    'valen cosas distintas: trescientos, treinta y tres.');

  p.formula('333 = 3\\cdot 100 + 3\\cdot 10 + 3\\cdot 1', 'descomposición');

  p.text('Eso es justo lo que los números romanos no tenían: en <code>XXX</code> las tres equis valen ' +
    'diez cada una. Por eso con romanos es casi imposible multiplicar, y con nuestro sistema lo hace ' +
    'un niño de diez años.');

  p.demo({
    title: 'La máquina de posición',
    intro: 'Mueve cada rueda y observa cómo cada cifra aporta su valor según el sitio que ocupa.',
    build: function (host, d) {
      var dig = [2, 4, 0, 7, 3];                    // DM UM C D U
      var names = ['decenas de millar', 'unidades de millar', 'centenas', 'decenas', 'unidades'];
      var pot = [10000, 1000, 100, 10, 1];
      var out = W.readout(host, '');
      var row = W.row(host);

      function paint() {
        var n = 0, terms = [];
        for (var i = 0; i < 5; i++) {
          n += dig[i] * pot[i];
          if (dig[i]) terms.push(dig[i] + ' \\cdot ' + pot[i]);
        }
        var col = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)'];
        var big = '';
        for (var j = 0; j < 5; j++) {
          big += '<span style="color:' + col[j] + ';font-size:30px;font-weight:600">' + dig[j] + '</span>';
        }
        out.innerHTML = '<div style="text-align:center;letter-spacing:3px;margin-bottom:6px">' + big + '</div>' +
          MathX.inline('$' + n + ' = ' + (terms.join(' + ') || '0') + '$') +
          '<div style="margin-top:6px;font-size:13px;color:var(--ink-faint)">' +
          'se lee: ' + leer(n) + '</div>';
      }
      for (var i = 0; i < 5; i++) (function (i) {
        W.slider(row, {
          label: names[i], min: 0, max: 9, step: 1, value: dig[i], dec: 0,
          on: function (v) { dig[i] = v; paint(); }
        });
      })(i);
      paint();
    }
  });

  /* ---------------------------------------------------------------- */
  p.util('El valor posicional es lo que hace que un ordenador funcione. La máquina solo distingue dos ' +
    'estados, así que cuenta en base 2: con 8 posiciones (un byte) llega hasta $2^8 = 256$ valores ' +
    'distintos, y de ahí salen los números del 0 al 255 de una dirección IP, los 256 tonos de cada ' +
    'color en una pantalla y el famoso límite de 255 caracteres de tantos formularios. Cambia la ' +
    'base, pero la idea —cada posición vale una potencia— es la misma que estás usando con las ' +
    'unidades, decenas y centenas.');

  p.section('Ordenar: la recta numérica');

  p.text('Los naturales están <strong>ordenados</strong>: dados dos, siempre se puede decir cuál es mayor. ' +
    'La forma más útil de imaginarlos es colocados sobre una recta, a intervalos iguales. Cuanto ' +
    'más a la derecha, más grande.');

  p.text('Para comparar dos números escritos en cifras hay una regla infalible: <strong>primero cuenta ' +
    'cuántas cifras tiene cada uno</strong> (el que tenga más, es mayor); si tienen las mismas, ' +
    'compara cifra a cifra empezando por la izquierda.');

  p.demo({
    title: 'La recta numérica',
    intro: 'Arrastra el punto azul. Fíjate en que entre dos naturales consecutivos no hay ningún otro natural: los naturales son un rosario de cuentas separadas.',
    build: function (host, d) {
      var out = W.readout(host, '');
      W.numberLine(host, {
        min: -0.5, max: 10.5, step: 1, height: 120,
        handles: {
          n: {
            x: 4, y: 0, label: 'n', color: 0,
            constrain: function (h) { h.y = 0; h.x = U.clamp(Math.round(h.x), 0, 10); }
          }
        },
        draw: function (g) {
          for (var i = 0; i <= 10; i++) g.point(i, 0, { color: 'axis', r: 3.5 });
          var n = Math.round(g.h('n').x);
          g.seg(0, 0, n, 0, { color: 0, w: 5, alpha: .35 });
          out.innerHTML = MathX.inline('Estás en $' + n + '$. &nbsp; Anterior: $' +
            (n > 0 ? n - 1 : '—') + '$ &nbsp; Siguiente: $' + (n + 1) + '$');
        }
      });
      W.hint(host, 'El punto solo puede posarse sobre los enteros: no existe «el natural que hay entre 3 y 4».');
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Aproximar');

  p.text('Cuando un número es grande y no necesitamos precisión total, lo <strong>redondeamos</strong>. ' +
    'La regla: se mira la cifra siguiente al orden que queremos conservar; si es $5$ o más, se sube ' +
    'una unidad; si es $4$ o menos, se deja como está. El resto se rellena con ceros.');

  p.table(['Número', 'A la decena', 'A la centena', 'Al millar'],
    [['4 372', '4 370', '4 400', '4 000'],
     ['8 651', '8 650', '8 700', '9 000'],
     ['2 950', '2 950', '3 000', '3 000']], { num: [0, 1, 2, 3] });

  /* ================= EJERCICIOS ================= */
  p.util('Redondear no es «hacer trampa»: es una decisión con consecuencias. Un supermercado que redondea ' +
    'cada línea del ticket y otro que redondea solo el total pueden cobrarte céntimos distintos por ' +
    'la misma compra, y por eso la normativa fija cuándo se redondea. En una nómina o en un reparto ' +
    'de dividendos, el céntimo que sobra al redondear tiene que ir a alguna parte, y decidir a dónde ' +
    'es parte del diseño del sistema.');

  p.section('Practica');

  p.exercise({
    title: 'Valor de una cifra',
    level: 'basico',
    gen: function (r) {
      var n = r.int(100000, 999999);
      var k = r.int(0, 4);                       // 0=unidades ... 4=decenas de millar
      var pot = Math.pow(10, k);
      var dig = Math.floor(n / pot) % 10;
      return { n: n, k: k, pot: pot, dig: dig };
    },
    ask: function (d) {
      var nom = ['las unidades', 'las decenas', 'las centenas', 'las unidades de millar', 'las decenas de millar'];
      return 'En el número $' + U.miles(d.n) + '$, ¿qué <strong>valor</strong> aporta la cifra que ocupa el lugar de ' +
        nom[d.k] + '?';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'tiny' }],
    sol: function (d) { return { v: d.dig * d.pot }; },
    hint: function (d) { return 'La cifra que buscas es el $' + d.dig + '$. Ahora multiplícala por $' + d.pot + '$.'; },
    steps: function (d) {
      return ['Localiza la cifra: es el $' + d.dig + '$.',
        'Su posición vale $' + d.pot + '$ unidades.',
        'Por tanto aporta $' + d.dig + ' \\cdot ' + d.pot + ' = ' + (d.dig * d.pot) + '$.'];
    },
    answer: function (d) { return 'Aporta ' + (d.dig * d.pot) + ' unidades.'; }
  });

  p.exercise({
    title: 'De la descomposición al número',
    level: 'basico',
    gen: function (r) {
      var d = [r.int(1, 9), r.int(0, 9), r.int(0, 9), r.int(0, 9)];
      return { d: d, n: d[0] * 1000 + d[1] * 100 + d[2] * 10 + d[3] };
    },
    ask: function (d) {
      return '¿Qué número es $' + d.d[0] + '\\cdot 1000 + ' + d.d[1] + '\\cdot 100 + ' +
        d.d[2] + '\\cdot 10 + ' + d.d[3] + '$?';
    },
    fields: [{ name: 'n', label: 'Número', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    hint: function () { return 'Cada sumando ocupa una posición distinta: solo tienes que colocar las cifras en orden.'; },
    steps: function (d) {
      return ['Millares: $' + d.d[0] + '$', 'Centenas: $' + d.d[1] + '$',
        'Decenas: $' + d.d[2] + '$', 'Unidades: $' + d.d[3] + '$',
        'Se escriben seguidas: $' + d.n + '$.'];
    },
    answer: function (d) { return 'El número es ' + d.n + '.'; }
  });

  p.exercise({
    title: 'Comparar números grandes',
    level: 'basico',
    gen: function (r) {
      var a = r.int(10000, 99999);
      var b;
      if (r.bool(0.55)) {                       // parecidos: obliga a comparar cifra a cifra
        b = a + r.pm(1, 900);
      } else {
        b = r.int(1000, 999999);
      }
      if (a === b) b = a + 7;
      return { a: a, b: b, max: Math.max(a, b) };
    },
    ask: function (d) { return 'Escribe el mayor de los dos: $' + U.miles(d.a) + '$ &nbsp; y &nbsp; $' + U.miles(d.b) + '$.'; },
    fields: [{ name: 'm', label: 'El mayor es', w: 'tiny' }],
    sol: function (d) { return { m: d.max }; },
    hint: function () { return 'Cuenta primero las cifras de cada uno. Si empatan, compara de izquierda a derecha.'; },
    steps: function (d) {
      var na = String(d.a).length, nb = String(d.b).length;
      if (na !== nb) return ['$' + d.a + '$ tiene ' + na + ' cifras y $' + d.b + '$ tiene ' + nb + '.',
        'Gana el que más cifras tiene: $' + d.max + '$.'];
      return ['Los dos tienen ' + na + ' cifras, así que hay que comparar de izquierda a derecha.',
        'En la primera posición en que se diferencian, gana la cifra mayor.',
        'Resultado: $' + d.max + ' > ' + Math.min(d.a, d.b) + '$.'];
    },
    answer: function (d) { return 'El mayor es ' + d.max + '.'; }
  });

  p.exercise({
    title: 'Redondear',
    level: 'medio',
    gen: function (r) {
      var n = r.int(1000, 99999);
      var k = r.pick([1, 2, 3]);
      var pot = Math.pow(10, k);
      return { n: n, k: k, pot: pot, res: Math.round(n / pot) * pot };
    },
    ask: function (d) {
      var nom = { 1: 'la decena', 2: 'la centena', 3: 'el millar' }[d.k];
      return 'Redondea $' + U.miles(d.n) + '$ a ' + nom + ' más próxima.';
    },
    fields: [{ name: 'r', label: 'Redondeo', w: 'tiny' }],
    sol: function (d) { return { r: d.res }; },
    hint: function (d) {
      return 'Mira la cifra que hay justo a la derecha del orden que conservas: si es $\\ge 5$ subes, si no, bajas.';
    },
    steps: function (d) {
      var sig = Math.floor(d.n / (d.pot / 10)) % 10;
      return ['El orden que conservamos vale $' + d.pot + '$.',
        'La cifra siguiente es $' + sig + '$.',
        sig >= 5 ? 'Como $' + sig + ' \\ge 5$, subimos una unidad de ese orden.'
          : 'Como $' + sig + ' < 5$, dejamos el orden como está.',
        'Resultado: $' + d.res + '$.'];
    },
    answer: function (d) { return String(d.res); }
  });

  p.keys([
    '$\\mathbb{N}$ es infinito: todo natural tiene un siguiente.',
    'Nuestro sistema es <strong>decimal</strong> (diez símbolos) y <strong>posicional</strong> (el sitio da el valor).',
    'El cero no vale «nada»: vale como <em>marcador de posición</em>, y por eso podemos escribir 105.',
    'Para comparar: primero el número de cifras; si empatan, de izquierda a derecha.',
    'Redondear: se mira la cifra siguiente; $\\ge 5$ sube, $< 5$ se queda.'
  ]);
});

/* Lectura en castellano de números hasta 99 999, para la demo. */
function leer(n) {
  if (n === 0) return 'cero';
  var U1 = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
    'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
    'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis',
    'veintisiete', 'veintiocho', 'veintinueve'];
  var D = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  var C = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos',
    'setecientos', 'ochocientos', 'novecientos'];
  function bajo(x) {
    if (x < 30) return U1[x];
    var d = Math.floor(x / 10), u = x % 10;
    return D[d] + (u ? ' y ' + U1[u] : '');
  }
  function ciento(x) {
    if (x === 0) return '';
    if (x === 100) return 'cien';
    var c = Math.floor(x / 100), rest = x % 100;
    return (C[c] + ' ' + bajo(rest)).trim();
  }
  var mil = Math.floor(n / 1000), rest = n % 1000;
  var s = '';
  if (mil === 1) s = 'mil';
  else if (mil > 1) s = ciento(mil) + ' mil';
  if (rest) s += (s ? ' ' : '') + ciento(rest);
  return s;
}
