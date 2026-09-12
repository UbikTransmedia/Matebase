/* Tema: Cualquier tabla se puede construir: forma normal y simplificación */
Course.topic('maq-normal', function (p) {

  /* ------------------------------------------------------------------
     Quine-McCluskey pequeño, solo para las demos de este tema. Un
     implicante se escribe como una cadena de '0', '1' y '-', donde el
     guion es «esta variable da igual». No vive en el nucleo porque no lo
     usa nadie mas, y porque lo que aqui interesa no es minimizar de
     verdad -eso es un problema duro- sino ENSEÑAR a fundir filas y poder
     decir un coste alcanzable sin inventarselo.
     ------------------------------------------------------------------ */
  function bits(m, n) {
    var s = '';
    for (var k = n - 1; k >= 0; k--) s += (m >> k) & 1;
    return s;
  }

  /* Dos implicantes se funden si difieren en exactamente una posicion y
     ninguna de las dos es un guion: es la regla xy + xy' = x. */
  function funde(u, v) {
    var d = -1;
    for (var k = 0; k < u.length; k++) {
      if (u[k] === v[k]) continue;
      if (u[k] === '-' || v[k] === '-' || d >= 0) return null;
      d = k;
    }
    return d < 0 ? null : u.slice(0, d) + '-' + u.slice(d + 1);
  }

  function primos(minterms, n) {
    var cur = minterms.map(function (m) { return bits(m, n); });
    var res = {}, vueltas = 0;
    while (cur.length && vueltas++ < 8) {
      var sig = {}, usado = {};
      for (var i = 0; i < cur.length; i++) {
        for (var j = i + 1; j < cur.length; j++) {
          var f = funde(cur[i], cur[j]);
          if (f) { sig[f] = 1; usado[cur[i]] = 1; usado[cur[j]] = 1; }
        }
      }
      cur.forEach(function (x) { if (!usado[x]) res[x] = 1; });
      cur = Object.keys(sig);
    }
    return Object.keys(res);
  }

  function cubre(imp, m) {
    for (var k = 0; k < imp.length; k++) if (imp[k] !== '-' && imp[k] !== m[k]) return false;
    return true;
  }

  /* Primero los esenciales -los unicos que tapan alguna fila- y luego, si
     queda algo por tapar, el que mas tape. No promete el minimo absoluto,
     y por eso el tema dice «se puede con N», que es una promesa que se
     cumple enseñando el circuito, y no «el minimo es N». */
  function cobertura(minterms, n) {
    var ms = minterms.map(function (m) { return bits(m, n); });
    var ps = primos(minterms, n), elegidos = [], falta = ms.slice();
    ps.forEach(function (imp) {
      var solo = falta.filter(function (m) {
        return cubre(imp, m) && ps.filter(function (q) { return cubre(q, m); }).length === 1;
      });
      if (solo.length) elegidos.push(imp);
    });
    falta = falta.filter(function (m) { return !elegidos.some(function (q) { return cubre(q, m); }); });
    while (falta.length) {
      var mejor = null, tapa = -1;
      ps.forEach(function (imp) {
        if (elegidos.indexOf(imp) >= 0) return;
        var t = falta.filter(function (m) { return cubre(imp, m); }).length;
        if (t > tapa) { tapa = t; mejor = imp; }
      });
      if (!mejor || tapa <= 0) break;
      elegidos.push(mejor);
      falta = falta.filter(function (m) { return !cubre(mejor, m); });
    }
    return elegidos;
  }

  /* De una lista de implicantes a netlist. Las negaciones se comparten:
     una sola linea `na = not(a);` sirve para todos los terminos. */
  function netlist(cover, vars) {
    var lineas = [], neg = {};
    cover.forEach(function (imp) {
      imp.split('').forEach(function (ch, k) { if (ch === '0') neg[vars[k]] = 1; });
    });
    vars.forEach(function (v) { if (neg[v]) lineas.push('n' + v + ' = not(' + v + ');'); });
    var terms = cover.map(function (imp, idx) {
      var lits = [];
      imp.split('').forEach(function (ch, k) {
        if (ch === '1') lits.push(vars[k]);
        else if (ch === '0') lits.push('n' + vars[k]);
      });
      if (!lits.length) return '1';
      if (lits.length === 1) return lits[0];
      lineas.push('t' + (idx + 1) + ' = and(' + lits.join(', ') + ');');
      return 't' + (idx + 1);
    });
    if (!terms.length) lineas.push('y = 0;');
    else if (terms.length === 1) lineas.push('y = ' + terms[0] + ';');
    else lineas.push('y = or(' + terms.join(', ') + ');');
    return lineas.join('\n');
  }

  function canonica(minterms, n, vars) {
    return netlist(minterms.map(function (m) { return bits(m, n); }), vars);
  }
  function agrupada(minterms, n, vars) {
    return netlist(cobertura(minterms, n), vars);
  }
  function cuesta(texto) {
    var c = LOG.analiza(texto);
    return c.errores.length ? 0 : c.puertas;
  }

  /* ================================================================== */

  p.puente('Todos los circuitos del bloque han salido de una <strong>idea</strong>: a alguien se le ' +
    'ocurrió que la suma es un [[maq-sumador|xor]], o que elegir es un [[maq-decidir|multiplexor]]. Eso ' +
    'está muy bien, pero no sirve como método: ¿y si la tabla que hay que montar no se parece a nada?');

  p.text('Este tema responde a esa pregunta de la forma más contundente posible: hay una ' +
    '<strong>receta mecánica</strong> que convierte cualquier tabla de verdad en un circuito, sin ' +
    'ingenio y sin suerte. Se aplica igual a una tabla con sentido que a una escrita a cara o cruz. Y ' +
    'después viene la segunda mitad del tema, que es lo que de verdad hace un ingeniero: el circuito ' +
    'que sale de la receta es correcto y es caro, y hay que abaratarlo.');

  /* ---------------------------------------------------------------- */
  p.section('El detector de una fila');

  p.text('La pieza de la que sale todo es pequeñísima. Toma una fila cualquiera de la tabla, por ejemplo ' +
    '$a = 1$, $b = 0$, $c = 1$, y escribe un <code>and</code> con las tres entradas, negando las que en ' +
    'esa fila valen 0:');

  p.formula('d = a \\cdot \\bar b \\cdot c', 'el detector de la fila 101');

  p.text('Ese <code>and</code> vale 1 <strong>exactamente en esa fila y en ninguna otra</strong>. La ' +
    'razón es casi tonta: cualquier otra fila se diferencia de ésta en al menos una entrada, y esa ' +
    'entrada llega al <code>and</code> valiendo 0, así que lo apaga. Un <code>and</code> se apaga con ' +
    'que falle uno solo de sus cables.');

  p.note('Aquí hay un cambio de punto de vista que conviene notar. Hasta ahora las puertas servían para ' +
    '<em>calcular</em>; este <code>and</code> sirve para <em>reconocer</em>. Es un circuito que ' +
    'contesta «sí, ésta es mi fila» y se calla en todas las demás. Con esa pieza, construir una tabla ' +
    'entera es poner un detector en cada fila que tenga que dar 1 y juntarlos todos con un ' +
    '<code>or</code>: basta con que uno diga que sí.',
    'ok', 'De calcular a reconocer');

  p.formula('f = d_1 + d_2 + \\cdots + d_k', 'un or de todos los detectores de las filas que valen 1');

  p.text('A esa forma de escribir una función —un <code>or</code> de <code>and</code>s, y nada más— se ' +
    'le llama <strong>suma de productos</strong> o <strong>forma normal disyuntiva</strong>. Lo de ' +
    '«normal» quiere decir que es una forma <em>canónica</em>: cada tabla tiene exactamente una, y sale ' +
    'sola, sin decisiones que tomar.');

  p.demo({
    title: 'La receta, en marcha',
    intro: 'Enciende y apaga las filas que quieres que valgan 1 y mira el circuito que sale. Comprueba en su tabla de verdad, abajo del todo, que es exactamente la que has pedido. Con el segundo botón se ve la otra versión, la agrupada, que hace lo mismo con menos puertas.',
    predice: 'Piensa una tabla de verdad rara, de esas que no se parecen a ninguna operación conocida. ¿Crees que habrá alguna que no se pueda construir con puertas?',
    build: function (host) {
      var VARS = ['a', 'b', 'c'], N = 3;
      var unos = { 3: 1, 5: 1, 6: 1, 7: 1 };       // la mayoría de tres
      var modo = 'receta';
      var out = W.readout(host, '');

      var banco = W.circuito(host, {
        alto: 300, reinicia: false,
        texto: 'y = 0;',
        aria: 'El circuito generado a partir de las filas encendidas: un and por fila y un or que los junta.',
        nota: 'Ninguna de las dos versiones se ha escrito a mano: las dos salen de la tabla que has pedido. Y las dos tienen la misma tabla de verdad, que es lo que significa que simplificar no cambia lo que hace.'
      });

      function lista() {
        var m = [];
        for (var i = 0; i < 8; i++) if (unos[i]) m.push(i);
        return m;
      }

      function pinta() {
        var m = lista();
        var tR = canonica(m, N, VARS), tA = agrupada(m, N, VARS);
        var cR = cuesta(tR), cA = cuesta(tA);
        banco.pon(modo === 'receta' ? tR : tA);
        out.set('Filas que valen 1: <strong>' + (m.length || 'ninguna') + '</strong> de 8' +
          ' &nbsp;·&nbsp; la receta cuesta <strong>' + cR + '</strong> ' +
          (cR === 1 ? 'puerta' : 'puertas') + ', agrupando bastan <strong>' + cA + '</strong>' +
          (cA === cR ? ' (aquí no hay nada que fundir)' : ''));
      }

      var filas = [];
      for (var i = 0; i < 8; i++) filas.push({ label: bits(i, N), value: i });
      var chips = W.chips(W.row(host), filas, {
        toggle: false,
        on: function (v, i) {
          unos[v] = unos[v] ? 0 : 1;
          chips.items[i].classList.toggle('is-on', !!unos[v]);
          chips.items[i].setAttribute('aria-pressed', unos[v] ? 'true' : 'false');
          pinta();
        }
      });
      chips.items.forEach(function (b, i) {
        b.classList.toggle('is-on', !!unos[i]);
        b.setAttribute('aria-pressed', unos[i] ? 'true' : 'false');
        b.setAttribute('aria-label', 'fila a=' + b.textContent[0] + ' b=' + b.textContent[1] + ' c=' + b.textContent[2]);
      });

      W.chips(W.row(host), [{ label: 'la receta', value: 'receta' }, { label: 'agrupando', value: 'corta' }], {
        value: 'receta',
        on: function (v) { modo = v; pinta(); }
      });

      W.hint(host, 'Apágalas todas y mira qué sale: una tabla que nunca vale 1 se construye con cero puertas.');
      pinta();
    }
  });

  p.note('Lo que acaba de quedar demostrado no es poco. <strong>Cualquier</strong> tabla de verdad, con ' +
    'las entradas que sea, se puede construir con <code>and</code>, <code>or</code> y <code>not</code>. ' +
    'Y como en [[maq-puertas|el tema de las puertas]] se vio que las tres se hacen con <code>nand</code>, ' +
    'la conclusión es que <strong>con una sola clase de puerta se construye cualquier cosa que quepa en ' +
    'una tabla</strong>. Eso es lo que hace posible fabricar un chip: no hay que inventar una pieza por ' +
    'problema, basta repetir la misma.',
    'ok', 'La respuesta a «¿qué se puede construir?»');

  /* ---------------------------------------------------------------- */
  p.section('Lo que cuesta no pensar');

  p.text('La receta tiene un precio, y se ve en cuanto se cuentan las puertas. Una tabla de $n$ entradas ' +
    'con $k$ filas a 1 necesita $k$ detectores, cada uno un <code>and</code>, más un <code>or</code> que ' +
    'los junte, más las negaciones. Y $k$ puede llegar a ser la mitad de $2^n$, que crece muy deprisa.');

  p.text('Peor aún: la receta no reconoce lo que ya sabías hacer. El <code>xor</code>, que es una sola ' +
    'puerta, sale de la receta como esto:');

  p.text('<pre class="shd__mini">na = not(a);\nnb = not(b);\nt1 = and(na, b);\nt2 = and(a, nb);\ny = or(t1, t2);</pre>');

  p.text('Cinco puertas para algo que cuesta una. La receta es correcta y es tonta: no ve parecidos, no ' +
    'reaprovecha nada, trata cada fila como si fuera un caso aparte. Abaratar el circuito es el trabajo ' +
    'que empieza donde acaba la receta.');

  /* ---------------------------------------------------------------- */
  p.section('Fundir dos filas');

  p.text('Toda la simplificación sale de una sola regla, y es una que se puede leer en castellano. Si dos ' +
    'filas <strong>se diferencian en una única entrada</strong> y las dos tienen que dar 1, entonces esa ' +
    'entrada <em>da igual</em>, y se puede tachar:');

  p.formula('x\\,y + x\\,\\bar y = x', 'la regla de fundir: si con y y sin y da 1, y sobra');

  p.text('Dicho en circuito: dos detectores de tres cables se convierten en uno de dos. Y el resultado ' +
    'se puede volver a fundir con otro, y así hasta que no quede ninguna pareja. Lo que queda son los ' +
    '<strong>implicantes primos</strong>: los trozos más grandes que ya no se pueden agrandar más.');

  p.sub('El mapa de Karnaugh');

  p.text('Para encontrar las parejas a ojo hay un truco de colocación. Se dibuja la tabla en una ' +
    'cuadrícula y se ordenan las columnas <strong>de forma que dos casillas vecinas se diferencien ' +
    'siempre en una sola variable</strong>: por eso el orden es 00, 01, 11, 10 y no el de contar. Así, ' +
    'fundir es literalmente <em>rodear casillas pegadas</em>. Ésta es la mayoría de tres entradas, la ' +
    'que vale 1 cuando hay al menos dos unos:');

  p.table(['', 'bc = 00', 'bc = 01', 'bc = 11', 'bc = 10'],
    [['<strong>a = 0</strong>', '0', '0', '<strong>1</strong>', '0'],
     ['<strong>a = 1</strong>', '0', '<strong>1</strong>', '<strong>1</strong>', '<strong>1</strong>']]);

  p.text('Se ven tres parejas, y cada una tacha una variable: la columna $bc = 11$ entera (sobra $a$, ' +
    'queda $bc$), las dos casillas de la derecha de la fila de abajo (sobra $c$, queda $ab$) y las dos ' +
    'del medio de esa misma fila (sobra $b$, queda $ac$). El circuito es la suma de las tres:');

  p.formula('f = ab + ac + bc', 'la mayoría de tres, agrupada');

  p.text('La receta pedía ocho puertas para esta tabla. Agrupando bastan cuatro: tres <code>and</code> y ' +
    'un <code>or</code>. Puedes comprobarlo en la demo de arriba, que arranca precisamente con esta ' +
    'tabla encendida.');

  p.note('Esa función ya la has construido, con otro nombre. El acarreo de salida del ' +
    '[[maq-sumador|sumador completo]] vale 1 cuando al menos dos de sus tres bits valen 1: <strong>es ' +
    'exactamente la mayoría de tres</strong>. Y allí costaba tres puertas, no cuatro, porque reutilizaba ' +
    'el <code>xor</code> que ya estaba hecho para la suma. Agrupar no es la única palanca que hay: ' +
    'compartir piezas entre dos salidas del mismo circuito es otra, y ninguna receta la encuentra sola.',
    null, 'Donde ya la habías visto');

  p.util('Nadie hace esto a mano por encima de cuatro o cinco entradas, y no hace falta: un ingeniero ' +
    'describe el circuito en un lenguaje —Verilog, VHDL— y un programa llamado <em>sintetizador</em> ' +
    'aplica esta misma receta y esta misma simplificación a escala de millones de puertas. Es el mismo ' +
    'salto que verás en la segunda mitad del bloque, cuando un texto se convierta en instrucciones de ' +
    'máquina. Y hay un atajo brutal que se usa mucho: si la tabla es pequeña, en vez de construirla con ' +
    'puertas se <em>guarda</em> entera en memoria y se lee. Eso es una tabla de consulta, y es lo que ' +
    'hay dentro de una FPGA: miles de tablitas de cuatro o seis entradas que el usuario rellena para ' +
    'que el chip haga lo que quiera.');

  p.ejemplo({
    title: 'De una tabla cualquiera a un circuito barato',
    enunciado: 'Construir la función de tres entradas que vale 1 en las filas $000$, $001$, $010$ y $011$, primero con la receta y después agrupando.',
    pasos: [
      { t: '<strong>Un detector por fila.</strong> $000 \\to \\bar a \\bar b \\bar c$, &nbsp; $001 \\to \\bar a \\bar b c$, &nbsp; $010 \\to \\bar a b \\bar c$, &nbsp; $011 \\to \\bar a b c$.', antes: 'Escribe cada fila como un and, negando las entradas que en ella valen 0.' },
      { t: '<strong>El or de los cuatro.</strong> $f = \\bar a \\bar b \\bar c + \\bar a \\bar b c + \\bar a b \\bar c + \\bar a b c$. En puertas: tres <code>not</code>, cuatro <code>and</code> y un <code>or</code>, o sea ocho.' },
      { t: '<strong>Fundir por parejas.</strong> Las dos primeras se diferencian solo en $c$, así que se funden en $\\bar a \\bar b$. Las dos últimas, también solo en $c$: quedan en $\\bar a b$.', antes: 'Busca filas que se diferencien en una sola entrada.' },
      { t: '<strong>Y otra vez.</strong> Ahora $\\bar a \\bar b$ y $\\bar a b$ se diferencian solo en $b$: se funden en $\\bar a$. El circuito entero es $f = \\bar a$.' },
      { t: '<strong>La comprobación.</strong> Y es verdad: las cuatro filas que valen 1 son exactamente las cuatro que empiezan por $a = 0$. La función no dependía de $b$ ni de $c$, y la receta no tenía forma de darse cuenta.' }
    ],
    cierre: 'De ocho puertas a una sola <code>not</code>. El salto es tan grande porque la receta trabaja fila a fila y no ve que las cuatro filas eran, en realidad, una sola condición.'
  });

  p.comprueba('¿Por qué el detector de una fila, por ejemplo <code>and(a, nb, c)</code> para la fila 101, vale 0 en todas las demás filas?', [
    { t: 'Porque cualquier otra fila cambia al menos una entrada, y ese cable llega al and valiendo 0', ok: true, por: 'El <code>and</code> solo saca 1 si todos sus cables valen 1, y el detector está montado justamente para que eso pase en su fila. En cuanto una entrada cambia, el cable correspondiente —directo o negado— entra a 0 y apaga el and entero.' },
    { t: 'Porque hay más filas que valen 0 que filas que valen 1', ok: false, por: 'Cuántas filas valgan 1 depende de la tabla y no tiene nada que ver. El detector apaga por construcción, no por mayoría.' },
    { t: 'Porque el or que viene después lo corrige', ok: false, por: 'El <code>or</code> no corrige nada: si un detector se encendiera donde no debe, el <code>or</code> lo dejaría pasar. La propiedad tiene que cumplirla el detector él solo.' }
  ]);

  p.hist('La receta es de <strong>Claude Shannon</strong>, que en 1937, con veintiún años, entregó una ' +
    'tesis de máster en el MIT donde demostraba que los circuitos de relés y el álgebra de Boole eran la ' +
    'misma cosa, y de paso daba el método para construir cualquiera. Se la ha llamado la tesis de máster ' +
    'más importante del siglo. Lo de abaratar vino después y con nombres propios: el mapa lo publicó ' +
    '<strong>Maurice Karnaugh</strong> en 1953, y el método sistemático lo montaron el filósofo ' +
    '<strong>Willard Quine</strong> —que llegó a esto desde la lógica, no desde la ingeniería— y ' +
    '<strong>Edward McCluskey</strong> a principios de los cincuenta. Encontrar el circuito ' +
    'verdaderamente mínimo sigue siendo un problema duro: los programas de hoy no lo resuelven, lo ' +
    'aproximan muy bien.');

  p.trampas([
    { e: 'Poner un detector también en las filas que valen 0', por: 'Solo se ponen detectores donde la tabla pide 1. Las filas que valen 0 se consiguen solas: si ningún detector se enciende, el <code>or</code> saca 0.' },
    { e: 'Olvidar negar las entradas que valen 0 en la fila', por: 'Sin la negación el detector se enciende en más filas de la cuenta. La fila 101 es <code>and(a, nb, c)</code>, no <code>and(a, b, c)</code>.' },
    { e: 'Intentar fundir dos filas que se diferencian en dos entradas', por: 'La regla exige una sola diferencia. $ab$ y $\\bar a \\bar b$ no se funden: no hay ninguna variable que se pueda tachar.' },
    { e: 'Ordenar el mapa de Karnaugh 00, 01, 10, 11', por: 'Con ese orden las casillas vecinas se diferencian a veces en dos variables y el truco deja de funcionar. El orden es 00, 01, 11, 10, y la última también es vecina de la primera.' },
    { e: 'Creer que agrupar da siempre el circuito mínimo', por: 'Da uno bueno y barato, pero el mínimo de verdad puede estar en otro sitio: compartiendo piezas entre salidas, o usando puertas que la suma de productos no contempla, como el <code>xor</code>.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El detector de una fila',
    level: 'basico',
    gen: function (r) {
      var n = r.int(2, 3);
      var v = [];
      for (var i = 0; i < n; i++) v.push(r.int(0, 1));
      var vars = ['a', 'b', 'c'].slice(0, n);
      return { n: n, v: v, vars: vars, sol: vars.map(function (x, i) { return v[i] ? x : 'n' + x; }) };
    },
    ask: function (d) {
      return 'Escribe el detector de la fila <code>' + d.v.join('') + '</code> de una tabla con entradas ' +
        '<code>' + d.vars.join('</code>, <code>') + '</code>: un <code>and</code> que valga 1 en esa fila ' +
        'y en ninguna otra. Las negaciones ya están hechas y se llaman ' +
        '<code>n' + d.vars.join('</code>, <code>n') + '</code>.';
    },
    fields: [{ name: 'n', label: 'el and', w: 'wide' }],
    sol: function (d) { return { n: 'y = and(' + d.sol.join(', ') + ');' }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe una línea como <code>y = and(a, nb);</code>.' };
      /* Solo se declaran las negaciones que el alumno nombra: si se declaran
         todas, las que no use quedan como cables sueltos y el comparador ve
         mas salidas de las que hay. */
      var previo = d.vars.filter(function (x) { return new RegExp('\\bn' + x + '\\b').test(texto); })
        .map(function (x) { return 'n' + x + ' = not(' + x + ');'; }).join('\n');
      var filas = [];
      for (var i = 0; i < (1 << d.n); i++) {
        var ent = [];
        for (var k = d.n - 1; k >= 0; k--) ent.push((i >> k) & 1);
        filas.push(ent.concat([ent.join('') === d.v.join('') ? 1 : 0]));
      }
      var r = W.circuitoIguales((previo ? previo + '\n' : '') + texto, { entradas: d.vars, salidas: ['y'], filas: filas });
      return r.ok ? { ok: true, msg: 'Correcto: se enciende en su fila y se calla en las demás.' }
        : { ok: false, msg: r.porQue };
    },
    hint: function (d) { return 'Van las ' + d.n + ' entradas, cada una tal cual si en esa fila vale 1 y negada si vale 0.'; },
    steps: function (d) {
      return ['En la fila <code>' + d.v.join('') + '</code>, ' +
        d.vars.map(function (x, i) { return '<code>' + x + '</code> vale ' + d.v[i]; }).join(', ') + '.',
        'Cada entrada entra tal cual si vale 1 y negada si vale 0: <code>' + d.sol.join(', ') + '</code>.',
        'El detector es <code>y = and(' + d.sol.join(', ') + ');</code>.'];
    },
    answer: function (d) { return 'y = and(' + d.sol.join(', ') + ');'; }
  });

  p.exercise({
    title: 'Cuánto cuesta la receta',
    level: 'basico',
    gen: function (r) {
      var n = r.pick([2, 3, 3, 4]);
      var k = r.int(2, Math.min(4, (1 << n) - 1));
      return { n: n, k: k, ands: k, or: 1, tot: k + 1 };
    },
    ask: function (d) {
      return 'Una tabla de <strong>' + d.n + ' entradas</strong> tiene <strong>' + d.k + ' filas</strong> ' +
        'que valen 1. Sin contar las negaciones, ¿cuántos <code>and</code> y cuántos <code>or</code> ' +
        'lleva el circuito que sale de la receta?';
    },
    fields: [{ name: 'a', label: 'and', w: 'tiny' }, { name: 'o', label: 'or', w: 'tiny' }],
    sol: function (d) { return { a: d.ands, o: d.or }; },
    dec: 0,
    errores: [{ si: function (v, d) { return Math.abs(v.a - (1 << d.n)) < 0.5; },
      msg: 'Has contado todas las filas de la tabla. Solo llevan detector las que valen 1, que son ' + '<strong>menos</strong>: las que valen 0 salen solas.' }],
    hint: function () { return 'Un detector por cada fila que vale 1, y un solo <code>or</code> que los junta todos por muchos que sean.'; },
    steps: function (d) {
      return ['Un <code>and</code> por cada fila que vale 1: son $' + d.k + '$.',
        'Y un único <code>or</code> con $' + d.k + '$ entradas para juntarlos.',
        'Total $' + d.tot + '$ puertas, más una <code>not</code> por cada entrada que aparezca negada. ' +
        'El número de entradas de la tabla, $' + d.n + '$, no cambia la cuenta: solo cambia el tamaño de cada and.'];
    },
    answer: function (d) { return d.ands + ' and y ' + d.or + ' or'; }
  });

  p.exercise({
    title: 'Construir una tabla desde cero',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'valga 1 cuando <code>a</code> y <code>b</code> sean iguales', m: [0, 3], min: 1, ref: 'y = xnor(a, b);' },
        { t: 'valga 1 cuando al menos una de las dos valga 1', m: [1, 2, 3], min: 1, ref: 'y = or(a, b);' },
        { t: 'valga 1 solo cuando las dos valgan 0', m: [0], min: 1, ref: 'y = nor(a, b);' },
        { t: 'valga 1 salvo cuando las dos valgan 1', m: [0, 1, 2], min: 1, ref: 'y = nand(a, b);' },
        { t: 'valga 1 solo cuando <code>b</code> valga 1 y <code>a</code> valga 0', m: [1], min: 2, ref: 'na = not(a);\ny = and(na, b);' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      var filas = [];
      for (var i = 0; i < 4; i++) filas.push('<code>' + bits(i, 2) + '</code> → ' + (d.c.m.indexOf(i) >= 0 ? '1' : '0'));
      return 'Escribe una netlist con entradas <code>a</code> y <code>b</code> y salida <code>y</code> que ' +
        d.c.t + '.<br><span style="font-size:0.875rem">La tabla es: ' + filas.join(' &nbsp;·&nbsp; ') + '</span>' +
        '<br><span style="font-size:0.875rem;color:var(--ink-faint)">Puedes aplicar la receta y quedarte ' +
        'tranquilo, o buscar algo más barato: se corrige por la tabla de verdad.</span>';
    },
    fields: [{ name: 'n', label: 'la netlist', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea, como <code>y = and(a, b);</code>.' };
      var filas = [];
      for (var i = 0; i < 4; i++) filas.push([(i >> 1) & 1, i & 1, d.c.m.indexOf(i) >= 0 ? 1 : 0]);
      var r = W.circuitoIguales(texto, { entradas: ['a', 'b'], salidas: ['y'], filas: filas });
      if (!r.ok) return { ok: false, msg: r.porQue };
      return { ok: true, msg: 'Correcto.' + (r.puertas > d.c.min
        ? ' Lo has resuelto con ' + r.puertas + ' ' + U.plural(r.puertas, 'puerta', 'puertas') +
          '; se puede con ' + d.c.min + '.'
        : ' Y con el mínimo conocido: ' + r.puertas + '.') };
    },
    hint: function () { return 'La receta siempre funciona: un <code>and</code> por cada fila que valga 1, negando las entradas que en ella valgan 0, y un <code>or</code> al final. Después mira si dos filas se diferencian en una sola entrada.'; },
    steps: function (d) {
      var rec = canonica(d.c.m, 2, ['a', 'b']), agr = agrupada(d.c.m, 2, ['a', 'b']);
      return ['La receta da <code>' + rec.replace(/\n/g, '</code> <code>') + '</code>, que cuesta ' +
        cuesta(rec) + ' ' + U.plural(cuesta(rec), 'puerta', 'puertas') + '.',
        'Agrupando queda <code>' + agr.replace(/\n/g, '</code> <code>') + '</code>, que cuesta ' +
        cuesta(agr) + ' ' + U.plural(cuesta(agr), 'puerta', 'puertas') + '.',
        'Cualquier circuito con esa misma tabla vale, aunque use otras puertas.'];
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' '); }
  });

  p.exercise({
    title: 'Fundir dos filas',
    level: 'medio',
    gen: function (r) {
      var vars = ['a', 'b', 'c'];
      var base = [r.int(0, 1), r.int(0, 1), r.int(0, 1)];
      var quita = r.int(0, 2);                       // la variable que se tacha
      var otro = base.slice(); otro[quita] = 1 - otro[quita];
      var queda = [];
      vars.forEach(function (x, i) { if (i !== quita) queda.push(base[i] ? x : '\\bar ' + x); });
      return {
        f1: base.join(''), f2: otro.join(''), quita: vars[quita],
        queda: queda.join(''), lit: vars.filter(function (x, i) { return i !== quita; }).join(' y ')
      };
    },
    ask: function (d) {
      return 'Los detectores de las filas <code>' + d.f1 + '</code> y <code>' + d.f2 + '</code> se pueden ' +
        'fundir en uno solo. ¿Qué variable desaparece, y cuántos cables le quedan al <code>and</code> ' +
        'resultante?';
    },
    fields: [
      { name: 'q', label: 'Desaparece', opts: [{ t: 'a', v: 'a' }, { t: 'b', v: 'b' }, { t: 'c', v: 'c' }] },
      { name: 'k', label: 'cables', w: 'tiny' }
    ],
    sol: function (d) { return { q: d.quita, k: 2 }; },
    dec: 0,
    hint: function () { return 'Compara las dos filas posición a posición: la que cambia es la que sobra, porque el resultado es 1 valga lo que valga.'; },
    steps: function (d) {
      return ['Las filas <code>' + d.f1 + '</code> y <code>' + d.f2 + '</code> coinciden en todo menos en ' +
        '<code>' + d.quita + '</code>.',
        'Como valen 1 con <code>' + d.quita + '</code> a 0 y también a 1, esa entrada da igual: es la regla $x\\,y + x\\,\\bar y = x$.',
        'Queda $' + d.queda + '$, un <code>and</code> de 2 cables en vez de dos <code>and</code> de 3.'];
    },
    answer: function (d) { return 'desaparece ' + d.quita + ', quedan 2 cables'; }
  });

  p.exercise({
    title: 'Lo más barato que encuentres',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'la mayoría de tres: 1 cuando al menos dos entradas valen 1', m: [3, 5, 6, 7], min: 4,
          ref: 't1 = and(a, b);\nt2 = and(a, c);\nt3 = and(b, c);\ny = or(t1, t2, t3);' },
        { t: '1 cuando el número de entradas a 1 es impar', m: [1, 2, 4, 7], min: 2,
          ref: 't = xor(a, b);\ny = xor(t, c);' },
        { t: '1 cuando <code>a</code> vale 1 y las otras dos coinciden', m: [4, 7], min: 2,
          ref: 'e = xnor(b, c);\ny = and(a, e);' },
        { t: '1 cuando las tres entradas valen lo mismo', m: [0, 7], min: 3,
          ref: 't = and(a, b, c);\nn = nor(a, b, c);\ny = or(t, n);' },
        { t: '1 siempre que <code>c</code> valga 1, y también en la fila 110', m: [1, 3, 5, 6, 7], min: 2,
          ref: 't = and(a, b);\ny = or(c, t);' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      var filas = [];
      for (var i = 0; i < 8; i++) if (d.c.m.indexOf(i) >= 0) filas.push('<code>' + bits(i, 3) + '</code>');
      return 'Con entradas <code>a</code>, <code>b</code> y <code>c</code>, escribe una netlist que dé ' +
        d.c.t + '.<br><span style="font-size:0.875rem">Las filas que valen 1 son: ' + filas.join(', ') +
        '.</span><br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige por la tabla, y ' +
        'además se te dice cuántas puertas has gastado. Se puede con ' + d.c.min + '.</span>';
    },
    fields: [{ name: 'n', label: 'la netlist', w: 'wide' }],
    sol: function (d) { return { n: d.c.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe al menos una línea.' };
      var filas = [];
      for (var i = 0; i < 8; i++) filas.push([(i >> 2) & 1, (i >> 1) & 1, i & 1, d.c.m.indexOf(i) >= 0 ? 1 : 0]);
      var r = W.circuitoIguales(texto, { entradas: ['a', 'b', 'c'], salidas: ['y'], filas: filas });
      if (!r.ok) return { ok: false, msg: r.porQue };
      return { ok: true, msg: 'Correcto.' + (r.puertas > d.c.min
        ? ' Lo has resuelto con ' + r.puertas + ' ' + U.plural(r.puertas, 'puerta', 'puertas') +
          '; se puede con ' + d.c.min + '. Busca filas que se diferencien en una sola entrada.'
        : (r.puertas < d.c.min
          ? ' Y con ' + r.puertas + ' puertas, menos de las ' + d.c.min + ' que tenía apuntadas. Enhorabuena.'
          : ' Y con las ' + d.c.min + ' que se conocen.')) };
    },
    hint: function () { return 'Empieza por la receta, que siempre sale, y después funde parejas de filas que solo se diferencien en una entrada. Y si la tabla se parece a un <code>xor</code> o a un <code>xnor</code>, úsalos: la suma de productos no los ve.'; },
    steps: function (d) {
      var agr = agrupada(d.c.m, 3, ['a', 'b', 'c']);
      return ['La receta pone un detector en cada una de las ' + d.c.m.length + ' filas que valen 1, y cuesta ' +
        cuesta(canonica(d.c.m, 3, ['a', 'b', 'c'])) + ' puertas.',
        'Agrupando queda <code>' + agr.replace(/\n/g, '</code> <code>') + '</code>, de ' +
        cuesta(agr) + ' ' + U.plural(cuesta(agr), 'puerta', 'puertas') + '.',
        'Y con ingenio se baja a ' + d.c.min + ' ' + U.plural(d.c.min, 'puerta', 'puertas') + ': <code>' +
        d.c.ref.replace(/\n/g, '</code> <code>') + '</code>. Si la tuya es más corta todavía, mejor: ' +
        'el mínimo de verdad es difícil de saber.'];
    },
    answer: function (d) { return d.c.ref.replace(/\n/g, ' '); }
  });

  p.keys([
    'El <strong>detector</strong> de una fila es un <code>and</code> con todas las entradas, negadas las que en esa fila valen 0. Vale 1 en esa fila y en ninguna otra.',
    'La <strong>suma de productos</strong> es un <code>or</code> de los detectores de las filas que valen 1: convierte cualquier tabla en un circuito, mecánicamente.',
    'De ahí sale la respuesta a qué se puede construir con puertas: <strong>cualquier tabla</strong>, y con una sola clase de puerta, porque nand las hace todas.',
    'La receta es correcta y cara: no ve parecidos. El <code>xor</code>, que cuesta una puerta, le sale de cinco.',
    'Toda la simplificación es una regla: $x\\,y + x\\,\\bar y = x$. Si dos filas se diferencian en una sola entrada, esa entrada sobra.',
    'El <strong>mapa de Karnaugh</strong> coloca la tabla —en orden 00, 01, 11, 10— para que las filas que se funden queden pegadas.',
    'Agrupar da un circuito barato, no necesariamente el mínimo: compartir piezas entre salidas es otra palanca, y encontrar el mínimo de verdad es un problema duro.'
  ]);
});
