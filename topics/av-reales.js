/* Tema: La completitud de los reales */
Course.topic('av-reales', function (p) {

  p.puente('En [[ar-conjuntos|conjuntos numéricos]] se demostró que $\\sqrt 2$ no es racional, y en ' +
    '[[fn-continuidad|continuidad]] se usó el teorema de Bolzano como si fuera evidente. Este tema junta ' +
    'las dos cosas: el agujero que deja $\\sqrt 2$ en los racionales es exactamente lo que Bolzano ' +
    'necesita que no exista. Solo hacen falta las desigualdades y la idea de cota.');

  p.text('Todo el bloque de análisis descansa sobre una propiedad de los números reales que nunca se ' +
    'ha enunciado. Cuando dijimos que una función continua que cambia de signo tiene que cortar el ' +
    'eje, o que una sucesión creciente y acotada converge, o que la bisección encuentra la raíz, ' +
    'estábamos usando algo que en $\\mathbb{Q}$ es <strong>falso</strong>. Este tema pone ese algo ' +
    'encima de la mesa.');

  p.text('La pregunta que lo organiza es sencilla de enunciar y sorprendentemente profunda: ' +
    '<strong>¿qué diferencia hay exactamente entre $\\mathbb{Q}$ y $\\mathbb{R}$?</strong> No vale ' +
    'decir «que $\\mathbb{R}$ tiene los irracionales», porque eso es nombrar el resultado, no la ' +
    'causa. La respuesta es una sola propiedad, y de ella se sigue todo lo demás.');

  p.section('Cotas, máximos y el problema de los conjuntos abiertos');

  p.text('Empecemos con vocabulario preciso, porque aquí las palabras parecidas significan cosas ' +
    'distintas y esa es justamente la gracia.');

  p.list([
    'Un número $M$ es <strong>cota superior</strong> de un conjunto $A$ si ningún elemento de $A$ lo supera: $x \\le M$ para todo $x \\in A$. Un conjunto puede tener infinitas cotas, o ninguna.',
    'Un conjunto es <strong>acotado superiormente</strong> si tiene al menos una cota superior.',
    'El <strong>máximo</strong> es una cota superior que además <em>pertenece</em> al conjunto.'
  ]);

  p.text('Y ahora el problema. El intervalo $A = [0,1]$ tiene máximo: el 1, que es cota y está ' +
    'dentro. Pero el intervalo $B = [0,1)$ —el mismo sin el extremo— <strong>no tiene ' +
    'máximo</strong>: sea cual sea el elemento que elijas, siempre hay otro un poco mayor todavía ' +
    'dentro. Y sin embargo es evidente que $B$ «termina» en 1.');

  p.text('Hace falta una palabra para eso: para el borde de un conjunto, pertenezca o no al ' +
    'conjunto.');

  p.formula('\\sup A = \\text{la menor de todas las cotas superiores de } A', 'supremo',
    'Se dice: <em>«supremo de a»</em>, y se escribe $\\sup$ sin punto, como $\\lim$ o ' +
      '$\\max$.<br><br>Es la <strong>menor</strong> de las cotas superiores: la más ajustada, la que ' +
      'ya no se puede bajar sin dejar de ser cota. Por eso también se le llama <em>extremo ' +
      'superior</em>.<br><br>Con $[0,1)$: son cotas el 1, el 2, el 1000… y la más pequeña de todas es ' +
      'el 1. Así que $\\sup[0,1) = 1$, aunque el 1 no esté en el conjunto. Cuando el supremo sí ' +
      'pertenece al conjunto, coincide con el máximo.');

  p.comprueba('El conjunto $A = \\{1, \\frac{1}{2}, \\frac{1}{3}, \\frac{1}{4}, \\dots\\}$. ¿Tiene mínimo?', [
    { t: 'Sí: el 0', ok: false, por: 'El 0 no está en el conjunto: ningún $\\frac{1}{n}$ vale 0. Es el <em>ínfimo</em>, la mayor cota inferior, pero no es mínimo porque no pertenece.' },
    { t: 'No: para cualquier elemento hay otro más pequeño', ok: true, por: 'Dado $\\frac{1}{n}$, el siguiente $\\frac{1}{n+1}$ es menor y está en $A$. No hay elemento mínimo. El ínfimo es 0 y queda fuera.' },
    { t: 'Sí: el último término', ok: false, por: 'No hay último término: la sucesión es infinita. «El más pequeño» tendría que ser un $\\frac{1}{n}$ concreto, y siempre hay otro menor.' }
  ]);

  p.ejemplo({
    title: 'Demostrar un supremo',
    enunciado: 'Probar que $\\sup\\left\\{\\dfrac{n}{n + 1} : n \\in \\mathbb{N}\\right\\} = 1$ y que no es máximo.',
    pasos: [
      { t: '<strong>Ver el conjunto.</strong> $\\frac{0}{1} = 0$, $\\frac{1}{2}$, $\\frac{2}{3}$, $\\frac{3}{4}$, … Crece y se acerca a 1.', antes: 'Escribe los cuatro primeros elementos. ¿Hacia dónde van?' },
      { t: '<strong>1 es cota superior.</strong> $\\frac{n}{n + 1} < 1$ porque el numerador es menor que el denominador. Ningún elemento llega a 1.' },
      { t: '<strong>Ninguna cota es menor que 1.</strong> Si $c < 1$ fuera cota, todo $\\frac{n}{n+1}$ sería $\\le c$. Pero $\\frac{n}{n + 1} > c$ equivale a $n > \\frac{c}{1 - c}$, y siempre hay un natural así de grande. Ese elemento supera a $c$: $c$ no era cota.', antes: 'Toma una cota candidata $c = 0{,}99$. ¿Encuentras un elemento del conjunto que la supere?' },
      { t: '<strong>Conclusión.</strong> 1 es cota y ninguna cota es menor: $\\sup = 1$.' },
      { t: '<strong>No es máximo.</strong> 1 no pertenece al conjunto: $\\frac{n}{n + 1} = 1$ exigiría $n = n + 1$. El borde existe y queda fuera, como en $[0, 1)$.', antes: '¿Hay algún $n$ con $\\frac{n}{n+1} = 1$?' }
    ],
    cierre: 'Demostrar un supremo son siempre dos pasos: es cota, y ninguna cota más pequeña sirve. El segundo se hace encontrando un elemento del conjunto que supere a cualquier candidata menor.'
  });

  p.demo({
    title: 'Cotas, supremo y máximo en la recta',
    intro: 'Arrastra el punto para probar cotas. El conjunto está pintado en la recta: una cota tiene que dejar todo el conjunto a su izquierda. Cambia de conjunto y fíjate en cuándo el supremo pertenece y cuándo no.',
    predice: 'En el tercer conjunto, los racionales con $x^2 < 2$, arrastra la cota hacia la izquierda todo lo que puedas. ¿Podrás parar en una fracción exacta que siga siendo cota? Piensa en qué número está en el borde.',
    build: function (host) {
      var cual = 'cerrado';
      var conj = {
        cerrado: { t: '$A = [0,\\,2]$', a: 0, b: 2, cerrA: true, cerrB: true, sup: 2, tieneMax: true },
        abierto: { t: '$A = [0,\\,2)$', a: 0, b: 2, cerrA: true, cerrB: false, sup: 2, tieneMax: false },
        raiz: { t: '$A = \\{x \\in \\mathbb{Q} : x^2 < 2\\}$', a: -1.4142135, b: 1.4142135, cerrA: false, cerrB: false, sup: Math.SQRT2, tieneMax: false, raro: true }
      };
      var out = W.readout(host, '');
      var plot = W.numberLine(host, {
        min: -2.4, max: 3.4, step: 1, height: 150,
        handles: { M: { x: 2.6, y: 0, label: 'M', color: 2, constrain: function (h) { h.y = 0; h.x = U.clamp(h.x, -2.3, 3.3); } } },
        draw: function (g) {
          var C = conj[cual];
          g.seg(C.a, 0, C.b, 0, { color: 0, w: 7, alpha: .45 });
          g.point(C.a, 0, { color: 0, r: 5.5, hollow: !C.cerrA });
          g.point(C.b, 0, { color: 0, r: 5.5, hollow: !C.cerrB });
          var m = g.h('M').x;
          g.vline(m, { color: m >= C.b - 1e-9 ? 'ok' : 'bad', w: 2, dash: true });
        },
        onDrag: function () { paint(); }
      });
      function paint() {
        var C = conj[cual];
        var m = plot.h('M').x;
        var esCota = m >= C.b - 1e-9;
        out.set('Conjunto: ' + C.t + '<br>' +
          'Tu candidato: $M = ' + U.fmt(m, 4) + '$ — ' +
          (esCota ? '<strong style="color:var(--ok)">sí es cota superior</strong>'
                  : '<strong style="color:var(--bad)">no es cota</strong>: hay elementos a su derecha') +
          '<br>Supremo: $' + (C.raro ? '\\sqrt{2} \\approx ' + U.fmt(C.sup, 6) : U.fmt(C.sup, 2)) +
          '$ &nbsp;·&nbsp; ' + (C.tieneMax ? 'y además es <strong>máximo</strong>, porque pertenece al conjunto'
            : 'pero <strong>no es máximo</strong>: no pertenece al conjunto') +
          (C.raro ? '<br><span style="font-size:0.8125rem;color:var(--ink-faint)">Y aquí está el ' +
            'problema del tema: este conjunto solo tiene números racionales, pero su supremo no es ' +
            'racional. Dentro de $\\mathbb{Q}$, este conjunto acotado <strong>no tiene ' +
            'supremo</strong>.</span>' : ''));
        plot.render();
      }
      W.chips(host, [
        { label: 'A = [0, 2]', value: 'cerrado' },
        { label: 'A = [0, 2)', value: 'abierto' },
        { label: 'x² < 2 racionales', value: 'raiz' }
      ], { value: 'cerrado', on: function (v) { cual = v; paint(); } });
      W.hint(host, 'La cota más pequeña que funciona es el supremo. Acércate a él por la derecha y ' +
        'mira cuándo deja de valer.');
      paint();
    }
  });

  p.section('El agujero de los racionales');

  p.text('Considera este conjunto, formado <strong>solo por números racionales</strong>:');

  p.formula('A = \\{\\,x \\in \\mathbb{Q} : x > 0,\\ x^2 < 2\\,\\}', 'el conjunto que rompe ℚ',
    'Se dice: <em>«a es el conjunto de los equis que pertenecen a los racionales, tales que equis es ' +
      'mayor que cero y equis al cuadrado es menor que dos»</em>.<br><br>Son los racionales positivos ' +
      'cuyo cuadrado no llega a 2: el 1, el 1,4, el 1,41, el 1,414… Todos ellos son fracciones ' +
      'perfectamente respetables.');

  p.text('Este conjunto está acotado: el 2 es cota superior, porque $2^2 = 4 > 2$. Y sin embargo, ' +
    '<strong>dentro de $\\mathbb{Q}$ no tiene supremo</strong>. Ninguna fracción es la menor de las ' +
    'cotas.');

  p.text('El argumento es este. Si $q$ fuera racional y cota, tendría que cumplir $q^2 \\ge 2$. Pero ' +
    'no puede ser $q^2 = 2$, porque en [[ar-conjuntos|el tema de conjuntos numéricos]] se demostró por reducción al ' +
    'absurdo que $\\sqrt2$ no es racional. Así que $q^2 > 2$, y entonces siempre se puede encontrar ' +
    'otro racional un poco más pequeño que siga siendo cota. Ninguna cota es la mínima: hay una ' +
    'sucesión infinita de cotas cada vez más ajustadas, y ninguna gana.');

  p.note('Dicho gráficamente: en la recta racional hay un <strong>agujero</strong> justo donde ' +
    'debería estar $\\sqrt2$. El conjunto $A$ se apretuja contra ese agujero desde la izquierda y no ' +
    'encuentra nada a lo que agarrarse. Los racionales son densos —entre dos cualesquiera hay ' +
    'infinitos— y aun así están llenos de huecos. Densidad y continuidad no son lo mismo.',
    'warn', 'Denso no significa sin huecos');

  p.section('El axioma del supremo');

  p.text('Los números reales se construyen precisamente para tapar esos agujeros, y la propiedad que ' +
    'lo consigue se toma como axioma:');

  p.formula('\\text{Todo subconjunto de } \\mathbb{R} \\text{ no vacío y acotado superiormente tiene supremo en } \\mathbb{R}',
    'axioma de completitud (o del supremo)');

  p.text('Eso es todo. Es la única diferencia esencial entre $\\mathbb{Q}$ y $\\mathbb{R}$: las dos ' +
    'estructuras tienen suma, producto y orden con las mismas propiedades; lo que $\\mathbb{Q}$ no ' +
    'tiene es esta. Se dice que $\\mathbb{R}$ es un <strong>cuerpo ordenado completo</strong>, y se ' +
    'puede demostrar que solo hay uno: cualquier otro es una copia con otros nombres.');

  p.table(['Propiedad', '$\\mathbb{N}$', '$\\mathbb{Z}$', '$\\mathbb{Q}$', '$\\mathbb{R}$'], [
    ['Se puede restar siempre', 'no', 'sí', 'sí', 'sí'],
    ['Se puede dividir (salvo por 0)', 'no', 'no', 'sí', 'sí'],
    ['Es denso (hay uno entre dos)', 'no', 'no', 'sí', 'sí'],
    ['<strong>Es completo</strong>', 'no', 'no', '<strong>no</strong>', '<strong>sí</strong>']
  ]);

  p.hist('Que hiciera falta un axioma así no fue evidente durante dos milenios. El cálculo funcionó ' +
    'ciento cincuenta años sobre una idea vaga de «cantidad continua» heredada de Eudoxo y de ' +
    'Euclides. En 1817 Bolzano publicó una demostración del teorema del valor intermedio y se dio ' +
    'cuenta de que le faltaba una propiedad de los números que nadie había escrito. Y en 1872, en el ' +
    'mismo año, Dedekind y Cantor publicaron dos construcciones distintas de $\\mathbb{R}$: Dedekind ' +
    'con sus <em>cortaduras</em> —definir un real como el corte que produce en los racionales— y ' +
    'Cantor con sucesiones de Cauchy. Dedekind contaba que la idea se le ocurrió el 24 de noviembre ' +
    'de 1858, preparando una clase de cálculo y avergonzado de tener que apelar a la intuición ' +
    'geométrica.');

  p.section('Qué se cae si quitas la completitud');

  p.text('La mejor manera de entender un axioma es ver qué deja de funcionar sin él. Todos estos ' +
    'resultados, que has usado sin pestañear, son <strong>falsos en $\\mathbb{Q}$</strong>:');

  p.table(['Resultado', 'Por qué falla en ℚ'], [
    ['<strong>Bolzano</strong>: si $f$ es continua y cambia de signo, se anula en algún punto',
     '$f(x)=x^2-2$ va de $-1$ a $+2$ entre 1 y 2 y no se anula en ningún racional'],
    ['<strong>Valor intermedio</strong>: una función continua toma todos los valores intermedios',
     'la misma función se salta el valor 0'],
    ['<strong>Monótona acotada converge</strong>: una sucesión creciente y acotada tiene límite',
     '$1,\\ 1{,}4,\\ 1{,}41,\\ 1{,}414\\dots$ crece, está acotada y no converge a ningún racional'],
    ['<strong>La bisección funciona</strong> (tema de análisis numérico)',
     'los intervalos se encajan pero no atrapan ningún racional'],
    ['<strong>Weierstrass</strong>: una función continua en un cerrado alcanza su máximo',
     'sin supremo no hay dónde alcanzarlo']
  ]);

  p.demo({
    title: 'La bisección buscando algo que no está',
    intro: 'Este es exactamente el algoritmo d[[av-numerico|el tema de análisis numérico]], ejecutado sobre x² − 2. Cada paso da dos racionales que encierran la raíz. Fíjate en que los extremos son siempre fracciones y en que nunca llegan: si solo existieran los racionales, este proceso apuntaría a un sitio vacío.',
    predice: 'Tras 10 pasos el intervalo mide $1/2^{10} \\approx 0{,}001$. ¿Alguno de sus extremos será exactamente $\\sqrt 2$ en algún paso? ¿Por qué no?',
    build: function (host) {
      var pasos = 0;
      var out = W.readout(host, '');
      function intervalo(k) {
        var a = 1, b = 2;
        for (var i = 0; i < k; i++) {
          var m = (a + b) / 2;
          if (m * m < 2) a = m; else b = m;
        }
        return [a, b];
      }
      var plot = W.plot(host, {
        xmin: 1, xmax: 2, ymin: -1.2, ymax: 2.2, height: 250,
        draw: function (g) {
          var iv = intervalo(pasos);
          g.rect(iv[0], -1.2, iv[1] - iv[0], 3.4, { color: 2, fill: 2, fillAlpha: .2, stroke: false, w: 0 });
          g.fn(function (x) { return x * x - 2; }, { color: 0, w: 2.6 });
          g.hline(0, { color: 'axis', w: 1.2 });
          g.vline(Math.SQRT2, { color: 'bad', w: 1.6, dash: true });
          g.point(iv[0], iv[0] * iv[0] - 2, { color: 1, r: 5 });
          g.point(iv[1], iv[1] * iv[1] - 2, { color: 1, r: 5 });
        }
      });
      function paint() {
        var iv = intervalo(pasos);
        plot.view(Math.max(1, Math.SQRT2 - (iv[1] - iv[0]) * 2.2), Math.min(2, Math.SQRT2 + (iv[1] - iv[0]) * 2.2), -1.2, 2.2);
        out.set('Paso <strong>' + pasos + '</strong><br>' +
          'Intervalo: $[' + U.fmt(iv[0], 10) + ',\\ ' + U.fmt(iv[1], 10) + ']$<br>' +
          'Anchura: $' + U.fmt(iv[1] - iv[0], 12) + '$<br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">Los dos extremos son fracciones ' +
          'exactas con denominador potencia de 2. Se acercan todo lo que quieras al punto rojo, y ' +
          'ese punto rojo <strong>no es ninguna fracción</strong>. El axioma del supremo es lo que ' +
          'garantiza que ahí hay un número.</span>');
        plot.render();
      }
      W.buttons(host, [
        { t: 'Siguiente paso →', cls: 'btn--main', on: function () { if (pasos < 40) pasos++; paint(); } },
        { t: '+10 pasos', on: function () { pasos = Math.min(40, pasos + 10); paint(); } },
        { t: '↺ Reiniciar', on: function () { pasos = 0; paint(); } }
      ]);
      W.legend(host, [
        { c: 0, t: '$f(x) = x^2-2$' },
        { c: 2, t: 'intervalo que aún contiene la raíz' },
        { c: 'bad', t: '$\\sqrt2$, que no es racional' }
      ]);
      paint();
    }
  });

  p.util('Esto no es filosofía: es la razón de que un ordenador nunca calcule con números reales. Un ' +
    'ordenador maneja fracciones binarias, es decir, un subconjunto de $\\mathbb{Q}$, y por tanto ' +
    'vive en un mundo <em>incompleto</em> y además lleno de agujeros mucho mayores. Por eso ningún ' +
    'algoritmo numérico pregunta «¿es $f(x)$ igual a cero?», sino «¿es $|f(x)|$ menor que una ' +
    'tolerancia?». Toda la disciplina del análisis numérico consiste en trabajar con cuidado en un ' +
    'conjunto que no es completo, sabiendo que el objeto que buscas puede no estar ahí.');

  p.section('Ínfimo: lo mismo por abajo');

  p.text('Todo lo anterior tiene su gemelo por el otro extremo. El <strong>ínfimo</strong> es la ' +
    'mayor de las cotas inferiores, y se comporta igual:');

  p.formulas([
    '\\inf\\,[0,1] = 0 \\quad (\\text{y es mínimo})',
    '\\inf\\,(0,1] = 0 \\quad (\\text{y no es mínimo})',
    '\\inf\\left\\{\\tfrac{1}{n} : n \\in \\mathbb{N}\\right\\} = 0'
  ], 'ínfimos',
    'Se dicen: <em>«ínfimo del intervalo cerrado cero uno», «ínfimo del intervalo abierto por la ' +
      'izquierda cero uno», «ínfimo del conjunto de los uno partido por ene, con ene perteneciente a ' +
      'los naturales»</em>.<br><br>$\\inf$ se escribe así, sin punto y en letra recta, igual que ' +
      '$\\sup$, $\\lim$ o $\\max$: son abreviaturas de palabras, no variables.<br><br>Fíjate en ' +
      'la diferencia entre el corchete $[$ y el paréntesis $($: el corchete <em>incluye</em> el ' +
      'extremo y el paréntesis lo deja fuera. De ahí que el primero tenga mínimo y el segundo no, ' +
      'aunque los dos tengan el mismo ínfimo.');

  p.text('El tercero es interesante: el conjunto $\\{1, \\frac12, \\frac13, \\frac14, \\dots\\}$ tiene ' +
    'ínfimo 0, y el 0 no está en el conjunto. Ningún elemento es el más pequeño, pero el borde ' +
    'existe. Es la misma situación de $[0,1)$ vista desde abajo, y es exactamente lo que significa ' +
    '$\\lim \\frac1n = 0$.');

  p.note('No hace falta un axioma nuevo para el ínfimo: se deduce del anterior dándole la vuelta al ' +
    'conjunto. Si $A$ está acotado inferiormente, el conjunto $-A = \\{-x : x \\in A\\}$ está acotado ' +
    'superiormente, y $\\inf A = -\\sup(-A)$.', null, 'Dos por el precio de uno');

  p.trampas([
    { e: 'Confundir supremo con máximo', por: 'El supremo es el borde; el máximo, el borde <em>cuando pertenece</em>. $[0, 1)$ tiene supremo 1 y no tiene máximo.' },
    { e: '«Entre dos racionales hay infinitos, luego no hay huecos»', por: 'Eso es densidad, no completitud. $\\mathbb{Q}$ es denso y tiene un agujero en $\\sqrt 2$: un conjunto acotado sin supremo.' },
    { e: 'Creer que un conjunto acotado tiene siempre un elemento mayor', por: '$\\{\\frac{n}{n+1}\\}$ está acotado por 1 y ningún elemento es el mayor. Acotado garantiza supremo (en $\\mathbb{R}$), no máximo.' },
    { e: 'Demostrar un supremo comprobando solo que es cota', por: 'El 2 también es cota de $[0, 1)$ y no es el supremo. Hay que ver además que ninguna cota menor sirve.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Supremo, ínfimo, máximo y mínimo',
    level: 'basico',
    gen: function (r) {
      var a = r.int(-5, 3), b = a + r.int(2, 6);
      var tipo = r.int(0, 3);   // 0 [a,b]  1 [a,b)  2 (a,b]  3 (a,b)
      return { a: a, b: b, tipo: tipo,
        izq: (tipo === 0 || tipo === 1), der: (tipo === 0 || tipo === 2) };
    },
    ask: function (d) {
      var abre = d.izq ? '[' : '(', cierra = d.der ? ']' : ')';
      return 'Sea $A = ' + abre + d.a + ',\\ ' + d.b + cierra + '$. Da su ínfimo y su supremo, e ' +
        'indica si son mínimo y máximo.';
    },
    fields: [
      { name: 'i', label: 'ínfimo', w: 'tiny' },
      { name: 's', label: 'supremo', w: 'tiny' },
      { name: 'mi', label: '¿es mínimo?', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] },
      { name: 'ma', label: '¿es máximo?', opts: [{ t: 'sí', v: 'si' }, { t: 'no', v: 'no' }] }
    ],
    sol: function (d) {
      return { i: d.a, s: d.b, mi: d.izq ? 'si' : 'no', ma: d.der ? 'si' : 'no' };
    },
    tol: 1e-9,
    hint: function () {
      return 'El supremo es siempre el extremo derecho, esté o no incluido. Que sea <em>máximo</em> ' +
        'depende únicamente de si el corchete está cerrado.';
    },
    steps: function (d) {
      return ['El ínfimo es el extremo izquierdo: $\\inf A = ' + d.a + '$.',
        'El supremo es el extremo derecho: $\\sup A = ' + d.b + '$.',
        d.izq ? 'El corchete izquierdo está cerrado, así que $' + d.a + ' \\in A$ y <strong>sí</strong> es mínimo.'
              : 'El paréntesis izquierdo deja fuera el $' + d.a + '$, así que <strong>no</strong> hay mínimo.',
        d.der ? 'El corchete derecho está cerrado, así que $' + d.b + ' \\in A$ y <strong>sí</strong> es máximo.'
              : 'El paréntesis derecho deja fuera el $' + d.b + '$, así que <strong>no</strong> hay máximo.'];
    },
    answer: function (d) {
      return 'inf = ' + d.a + (d.izq ? ' (mínimo)' : ' (no mínimo)') +
        ' · sup = ' + d.b + (d.der ? ' (máximo)' : ' (no máximo)');
    }
  });

  p.exercise({
    title: 'Supremo de un conjunto descrito',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: '\\left\\{\\dfrac{1}{n} : n \\in \\mathbb{N},\\ n \\ge 1\\right\\}', sup: 1, inf: 0,
          por: 'El mayor es $\\frac11 = 1$ (y es máximo). Los términos decrecen hacia 0 sin alcanzarlo: el ínfimo es 0 y no es mínimo.' },
        { t: '\\left\\{1 - \\dfrac{1}{n} : n \\in \\mathbb{N},\\ n \\ge 1\\right\\}', sup: 1, inf: 0,
          por: 'Vale $0, \\frac12, \\frac23, \\frac34\\dots$: crece hacia 1 sin llegar, así que $\\sup = 1$ y no es máximo. El menor es $0$, que sí se alcanza.' },
        { t: '\\left\\{\\dfrac{n}{n+1} : n \\in \\mathbb{N},\\ n \\ge 0\\right\\}', sup: 1, inf: 0,
          por: 'Es la misma sucesión que la anterior escrita de otra forma: $0, \\frac12, \\frac23\\dots$' },
        { t: '\\left\\{2 + \\dfrac{(-1)^n}{n} : n \\in \\mathbb{N},\\ n \\ge 1\\right\\}', sup: 2.5, inf: 1,
          por: 'Oscila alrededor de 2. El mayor valor es $2+\\frac12 = 2{,}5$ (en $n=2$) y el menor es $2-1 = 1$ (en $n=1$). Los dos se alcanzan.' },
        { t: '\\{x \\in \\mathbb{R} : x^2 < 9\\}', sup: 3, inf: -3,
          por: 'Es el intervalo abierto $(-3,3)$: los extremos son supremo e ínfimo, y ninguno pertenece.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'Calcula el ínfimo y el supremo de $A = ' + d.t + '$ (cuatro decimales si hacen falta).';
    },
    fields: [
      { name: 'i', label: 'ínfimo', w: 'tiny' },
      { name: 's', label: 'supremo', w: 'tiny' }
    ],
    sol: function (d) { return { i: d.inf, s: d.sup }; },
    tol: 1e-5,
    hint: function () {
      return 'Escribe los primeros elementos del conjunto y mira hacia dónde van. El supremo es el ' +
        'borde por arriba, se alcance o no.';
    },
    steps: function (d) {
      return [d.por,
        '$\\inf A = ' + U.fmt(d.inf, 4) + '$ y $\\sup A = ' + U.fmt(d.sup, 4) + '$.'];
    },
    answer: function (d) { return 'inf = ' + U.fmt(d.inf, 4) + ' · sup = ' + U.fmt(d.sup, 4); }
  });

  p.exercise({
    title: '¿Existe el supremo en ℚ?',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: '\\{x \\in \\mathbb{Q} : x^2 < 2\\}', enQ: false,
          por: 'Su supremo sería $\\sqrt2$, que no es racional. En $\\mathbb{Q}$ este conjunto acotado no tiene supremo: es el contraejemplo que obliga a inventar $\\mathbb{R}$.' },
        { t: '\\{x \\in \\mathbb{Q} : x^2 < 4\\}', enQ: true,
          por: 'Su supremo es 2, que sí es racional. Que un conjunto se defina con racionales no garantiza nada en un sentido ni en otro.' },
        { t: '\\{x \\in \\mathbb{Q} : x < 3\\}', enQ: true,
          por: 'El supremo es 3, racional. Aquí no hay ningún agujero.' },
        { t: '\\{x \\in \\mathbb{Q} : x^3 < 5\\}', enQ: false,
          por: 'El supremo sería $\\sqrt[3]{5}$, que es irracional.' },
        { t: '\\left\\{\\dfrac{n}{n+1} : n \\in \\mathbb{N}\\right\\}', enQ: true,
          por: 'Todos los elementos son racionales y el supremo es 1, también racional.' },
        { t: '\\{x \\in \\mathbb{Q} : 0 < x,\\ x^2 < 3\\}', enQ: false,
          por: 'El supremo sería $\\sqrt3$, irracional.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return 'El conjunto $A = ' + d.t + '$ está acotado superiormente. ¿Tiene supremo ' +
        '<strong>dentro de $\\mathbb{Q}$</strong>?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">En $\\mathbb{R}$ siempre lo tendría: la pregunta es si el ' +
        'supremo resulta ser racional.</span>';
    },
    fields: [{ name: 'q', label: 'En ℚ', opts: [{ t: 'sí tiene supremo: es racional', v: 'si' }, { t: 'no: el supremo sería irracional', v: 'no' }] }],
    sol: function (d) { return { q: d.enQ ? 'si' : 'no' }; },
    hint: function () {
      return 'Averigua cuál sería el supremo en $\\mathbb{R}$ y pregúntate después si ese número ' +
        'concreto es una fracción.';
    },
    steps: function (d) {
      return [d.por,
        d.enQ ? 'Respuesta: <strong>sí</strong>, el supremo existe dentro de $\\mathbb{Q}$.'
              : 'Respuesta: <strong>no</strong>. El axioma del supremo falla en $\\mathbb{Q}$, y por ' +
                'eso hace falta $\\mathbb{R}$.'];
    },
    answer: function (d) { return d.enQ ? 'Sí' : 'No'; }
  });

  p.keys([
    'Una <strong>cota superior</strong> deja todo el conjunto a su izquierda; el <strong>supremo</strong> es la menor de las cotas; el <strong>máximo</strong> es un supremo que además pertenece.',
    '$[0,1)$ no tiene máximo pero sí supremo: 1. La distinción es la que hace falta para hablar de bordes.',
    'El conjunto de racionales con $x^2<2$ está acotado y <strong>no tiene supremo en $\\mathbb{Q}$</strong>: ahí está el agujero.',
    'El <strong>axioma del supremo</strong> —todo conjunto no vacío y acotado tiene supremo— es la única diferencia esencial entre $\\mathbb{Q}$ y $\\mathbb{R}$.',
    'Sin él se caen Bolzano, el valor intermedio, la convergencia de las monótonas acotadas y la bisección: todo el análisis.',
    'Denso no es lo mismo que completo: $\\mathbb{Q}$ es denso y está lleno de huecos.'
  ]);
});
