/* Tema: Notación polaca inversa: evaluar es recorrer el árbol */
Course.topic('len-pila', function (p) {

  p.puente('Ya hay [[len-arbol|árbol]]. Ahora hay que <em>hacer</em> lo que dice, y aquí ocurre lo mejor ' +
    'del tramo: resulta que evaluar un árbol y compilarlo <strong>son el mismo recorrido</strong>. ' +
    'Cambia solo qué se hace al pasar por cada nudo.');

  /* ---------------------------------------------------------------- */
  p.section('Recorrer un árbol por abajo');

  p.text('Un árbol se puede recorrer de varias maneras, y una de ellas es la que hace falta aquí: ' +
    '<strong>visitar primero las ramas y el nudo al final</strong>. Tiene sentido, porque una operación ' +
    'no se puede hacer hasta tener sus dos operandos. Se llama recorrido en <strong>postorden</strong>.');

  p.text('<pre class="shd__mini">postorden(nudo) {\n' +
    '  si el nudo es una hoja { escribe el nudo; vuelve; }\n' +
    '  postorden(rama izquierda);\n' +
    '  postorden(rama derecha);\n' +
    '  escribe la operación del nudo;\n' +
    '}</pre>');

  p.text('Aplicado al árbol de <code>2 + 3 * 4</code>, ese recorrido escribe: <code>2 3 4 * +</code>. Y ' +
    'aplicado al de <code>(2 + 3) * 4</code>, escribe <code>2 3 + 4 *</code>. Dos listas distintas para ' +
    'dos árboles distintos, <strong>sin un solo paréntesis</strong>.');

  p.note('Esa forma de escribir se llama <strong>notación polaca inversa</strong>, y tiene una propiedad ' +
    'que parece magia y es pura consecuencia: como el orden ya lo dice todo, no hacen falta paréntesis ' +
    'ni reglas de prioridad. Cualquier expresión, por enredada que sea, se escribe sin ambigüedad. Y ' +
    'sale sola de recorrer el árbol: no hay que «convertir» nada.',
    'ok', 'Sin paréntesis, y sin perder nada');

  /* ---------------------------------------------------------------- */
  p.section('Evaluarla es una pila');

  p.text('Lo bueno es que una lista así se calcula leyéndola de izquierda a derecha con una regla de tres ' +
    'palabras y una [[maq-ensamblador|pila]]:');

  p.list([
    'Si viene un número, <strong>mételo</strong> en la pila.',
    'Si viene una operación, <strong>saca dos</strong>, opéralos y mete el resultado.',
    'Al final queda un solo número en la pila, y ése es el resultado.'
  ], true);

  p.demo({
    title: 'Evaluar en polaca inversa, paso a paso',
    intro: 'Escribe una expresión y mira cómo sube y baja la pila. Cada número la hace crecer; cada operación se come dos y deja uno. La altura máxima que alcanza no es un capricho: es la profundidad del árbol.',
    predice: 'Con «2 3 4 * +», ¿cuántos números llegará a haber en la pila a la vez como máximo: dos, tres o cuatro?',
    build: function (host) {
      var texto = '2 + 3 * 4';
      var out = W.readout(host, '');
      var traza = U.el('pre.shd__mini');
      host.appendChild(traza);

      /* Postorden del arbol que ya sabe montar el analizador del curso:
         aqui no se vuelve a escribir ningun analizador. */
      function rpn(n, salida) {
        if (n.t === 'num') { salida.push(String(n.v)); return; }
        if (n.t === 'var') { salida.push(n.n); return; }
        if (n.t === 'neg') { salida.push('0'); rpn(n.e, salida); salida.push('-'); return; }
        rpn(n.i, salida); rpn(n.d, salida); salida.push(n.op);
      }

      function pinta() {
        var a = LEN.analiza('muestra ' + texto + ';');
        if (a.errores.length) {
          out.set('<span style="color:var(--bad)">' + a.errores[0].msg + '</span>');
          traza.textContent = '';
          return;
        }
        var lista = [];
        rpn(a.ast.ss[0].e, lista);
        var pila = [], lineas = [], alto = 0, roto = '';
        lista.forEach(function (tk) {
          if (/^-?\d+$/.test(tk)) { pila.push(parseInt(tk, 10)); }
          else {
            if (pila.length < 2) { roto = 'faltan operandos'; return; }
            var b = pila.pop(), x = pila.pop();
            var v = tk === '+' ? x + b : tk === '-' ? x - b : tk === '*' ? x * b
              : tk === '/' ? (b === 0 ? 0 : Math.trunc(x / b)) : (tk === '<' ? (x < b ? 1 : 0) : 0);
            pila.push(LEN.ocho(v));
          }
          alto = Math.max(alto, pila.length);
          lineas.push(tk + '   →   pila: ' + (pila.length ? pila.join(' · ') : '(vacía)'));
        });
        traza.textContent = lineas.join('\n');
        out.set('En polaca inversa: <strong style="font-family:var(--mono)">' + lista.join(' ') + '</strong>' +
          '<br>Resultado: <strong>' + (roto ? roto : pila[0]) + '</strong> · altura máxima de la pila: <strong>' + alto + '</strong>');
      }

      var ed = U.el('input.card__url', { type: 'text', value: texto, 'aria-label': 'expresión a evaluar' });
      host.appendChild(ed);
      ed.addEventListener('input', function () { texto = ed.value; pinta(); });
      W.hint(host, 'Prueba «(2 + 3) * 4» y compara la lista con la de «2 + 3 * 4»: las mismas piezas, otro orden, otro resultado.');
      pinta();
    }
  });

  p.text('Fíjate en la <strong>altura máxima</strong> que alcanza la pila. No es un dato curioso: es ' +
    'cuántos resultados intermedios hay que recordar a la vez, y por tanto cuántos sitios necesita la ' +
    'máquina. Un árbol profundo pide una pila alta, y por eso un compilador se fija en eso.');

  /* ---------------------------------------------------------------- */
  p.section('Y ahora la sorpresa: eso ya es el ensamblador');

  p.text('Vuelve a leer las dos reglas de la evaluación y compáralas con las instrucciones de ' +
    '[[maq-cpu|la máquina]]. «Mete un número en la pila» es <code>NUM</code> y <code>METE</code>. «Saca ' +
    'dos, opéralos y mete el resultado» es <code>SUMA</code>, que saca de la pila y le suma el ' +
    'acumulador. La máquina del tramo A <strong>está construida para ejecutar polaca inversa ' +
    'directamente</strong>.');

  p.text('Por eso compilar una expresión es exactamente el mismo recorrido, escribiendo instrucciones en ' +
    'vez de evaluando:');

  p.text('<pre class="shd__mini">compila(nudo) {\n' +
    '  si el nudo es un número { escribe "NUM n"; vuelve; }\n' +
    '  compila(rama izquierda);\n' +
    '  escribe "METE";\n' +
    '  compila(rama derecha);\n' +
    '  escribe la instrucción de la operación;\n' +
    '}</pre>');

  p.demo({
    title: 'El árbol y su ensamblador, a la vez',
    intro: 'Cambia la expresión y mira los dos paneles: el árbol y las instrucciones. Léelas de arriba abajo con el árbol al lado y verás que son el mismo recorrido, hoja por hoja y nudo por nudo.',
    predice: 'El árbol de «2 + 3 * 4» tiene tres hojas y dos nudos. ¿Cuántas instrucciones crees que harán falta, sin contar el PARA?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'pila-asm', paneles: ['arbol', 'asm'],
        texto: 'muestra 2 + 3 * 4;',
        nota: 'Cada hoja del árbol da una instrucción que carga algo; cada nudo da un <code>METE</code> antes de la rama derecha y una operación al final. No hay más regla que ésa.'
      });
    }
  });

  p.note('Esto explica por qué la máquina del tramo A se diseñó como se diseñó. Un acumulador y una pila, ' +
    'con las operaciones sacando el operando izquierdo de la pila, no es una elección arbitraria: es ' +
    '<strong>la forma de máquina para la que compilar es un recorrido en postorden y nada más</strong>. ' +
    'Las máquinas de verdad no son exactamente así —tienen muchos registros y el compilador tiene que ' +
    'decidir cuál usa para cada cosa, que es un problema serio—, pero varias importantes sí lo han sido, ' +
    'empezando por la que ejecuta Java.',
    'ok', 'Por qué la máquina es así');

  p.ejemplo({
    title: 'De la expresión a la pila, contando la altura',
    enunciado: 'Escribir <code>(2 + 3) * (4 + 5)</code> en polaca inversa, evaluarla con la pila y decir qué altura máxima alcanza.',
    pasos: [
      { t: '<strong>El árbol.</strong> Arriba el <code>*</code>, y colgando de él dos nudos <code>+</code>. Cuatro hojas y tres nudos.', antes: 'Los paréntesis obligan a que las dos sumas queden debajo del producto.' },
      { t: '<strong>El postorden.</strong> Rama izquierda entera: <code>2 3 +</code>. Rama derecha entera: <code>4 5 +</code>. Y al final el nudo de arriba: <code>*</code>. Queda <code>2 3 + 4 5 + *</code>.' },
      { t: '<strong>La pila, pieza a pieza.</strong> 2 → [2]. 3 → [2, 3]. <code>+</code> saca las dos y mete 5 → [5]. 4 → [5, 4]. 5 → [5, 4, 5]. <code>+</code> saca 4 y 5 y mete 9 → [5, 9]. <code>*</code> saca las dos y mete 45 → [45].', antes: 'Lleva la cuenta de cuántos números hay a la vez.' },
      { t: '<strong>La altura.</strong> El momento más lleno fue cuando había tres: <code>[5, 4, 5]</code>. La altura máxima es <strong>3</strong>.' },
      { t: '<strong>Y compárala con el árbol.</strong> Ese 3 es la profundidad del árbol contando hojas: hay que guardar el resultado de la rama izquierda mientras se calcula entera la derecha. Un árbol más profundo por la derecha pide más pila.' }
    ],
    cierre: 'Cuarenta y cinco, que es lo que vale. Y de paso ha quedado dicho cuántos sitios necesita la máquina para ejecutarla: tres, ni uno más.'
  });

  p.comprueba('¿Por qué la notación polaca inversa no necesita paréntesis?', [
    { t: 'Porque el orden en que aparecen las piezas ya dice qué se hace con qué, sin dejar ninguna duda', ok: true, por: 'Sale de recorrer un árbol, y el árbol ya no tenía paréntesis: la agrupación está en la forma. Cada operación se aplica a los dos valores que estén encima de la pila en ese momento, y eso no admite dos lecturas.' },
    { t: 'Porque solo sirve para expresiones sencillas', ok: false, por: 'Sirve para cualquiera, por enredada que sea. Cuanto más enredada, más se nota la ventaja.' },
    { t: 'Porque las operaciones se hacen de izquierda a derecha', ok: false, por: 'No es eso: en <code>2 3 4 * +</code> la primera operación que se hace es el <code>*</code>, que está el penúltimo. Lo que manda es la pila, no la posición.' }
  ]);

  p.util('La polaca inversa tuvo su momento de gloria fuera de los compiladores: las calculadoras ' +
    'Hewlett-Packard de los años setenta se usaban así, sin tecla de igual y sin paréntesis, y sus ' +
    'usuarios las defendían con pasión porque para cálculos largos se tecleaba menos y no había que ' +
    'planificar los paréntesis por adelantado. Todavía se fabrican. Y en sitios donde no se ve, sigue ' +
    'siendo lo normal: el código que ejecuta una máquina virtual de Java o de Python es, en buena ' +
    'parte, esto mismo.');

  p.hist('La notación la inventó <strong>Jan Łukasiewicz</strong> hacia 1924, y no era inversa ni tenía ' +
    'nada que ver con máquinas: era lógico, y buscaba escribir fórmulas lógicas sin paréntesis. Como era ' +
    'polaco, se la llamó notación polaca. Le dieron la vuelta —operadores detrás en vez de delante— en ' +
    'los años cincuenta, cuando se vio que así se podía evaluar con una pila sobre la marcha; el que lo ' +
    'llevó a la práctica en los compiladores fue el australiano <strong>Charles Hamblin</strong> en ' +
    '1957. Una notación inventada para escribir lógica en papel resultó ser la forma natural de hablarle ' +
    'a una máquina que todavía no existía.');

  p.trampas([
    { e: 'Confundir el postorden con leer el texto al revés', por: 'No tiene nada que ver. <code>2 + 3 * 4</code> da <code>2 3 4 * +</code>, que no es el texto al revés ni de lejos.' },
    { e: 'Sacar los dos operandos en el orden equivocado', por: 'El primero que sale de la pila es el <strong>derecho</strong>, porque entró el último. Con la resta y la división eso cambia el resultado.' },
    { e: 'Creer que hace falta convertir la expresión', por: 'No hay conversión: la polaca inversa es lo que sale de recorrer el árbol, y el árbol ya estaba hecho.' },
    { e: 'Pensar que la pila crece con el tamaño de la expresión', por: 'Crece con la <strong>profundidad</strong> del árbol, no con su tamaño. Una suma de veinte números solo necesita dos sitios.' },
    { e: 'Dejar más de un valor en la pila al final', por: 'Si al acabar queda más de uno, la expresión estaba mal formada. Es, de hecho, una manera de detectarlo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Escribirlo en polaca inversa',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: '2 + 3', v: '2 3 +' },
        { t: '2 + 3 * 4', v: '2 3 4 * +' },
        { t: '(2 + 3) * 4', v: '2 3 + 4 *' },
        { t: '2 * 3 + 4', v: '2 3 * 4 +' },
        { t: '(1 + 2) * (3 + 4)', v: '1 2 + 3 4 + *' },
        { t: '10 - 3 - 2', v: '10 3 - 2 -' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Escribe <code>' + d.c.t + '</code> en notación polaca inversa, separando las piezas con ' +
        'espacios.';
    },
    fields: [{ name: 'r', label: 'polaca inversa', w: 'wide' }],
    sol: function (d) { return { r: d.c.v }; },
    check: function (v, d) {
      var dado = String(v.raw.r || '').replace(/\s+/g, ' ').trim();
      return dado === d.c.v
        ? { ok: true, msg: 'Correcto.' }
        : { ok: false, msg: 'No es eso. Recorre el árbol por abajo: primero la rama izquierda entera, después la derecha entera, y la operación al final.' };
    },
    hint: function () { return 'Monta primero el árbol mentalmente. Después escribe: rama izquierda completa, rama derecha completa, operación del nudo. Y repite dentro de cada rama.'; },
    steps: function (d) {
      var a = LEN.analiza('muestra ' + d.c.t + ';').ast.ss[0].e;
      return ['El árbol es:<pre class="shd__mini">' + LEN.arbolTexto(a) + '</pre>',
        'Recorriéndolo en postorden —ramas antes que nudo— sale <code>' + d.c.v + '</code>.',
        'Fíjate en que no hay ningún paréntesis y en que se puede leer sin dudar.'];
    },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Evaluar con la pila',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: '3 4 +', v: 7 }, { t: '3 4 *', v: 12 }, { t: '10 3 -', v: 7 },
        { t: '2 3 4 * +', v: 14 }, { t: '2 3 + 4 *', v: 20 },
        { t: '10 3 - 2 -', v: 5 }, { t: '1 2 + 3 4 + *', v: 21 }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Cuánto vale <code>' + d.c.t + '</code>?'; },
    fields: [{ name: 'v', label: 'vale', w: 'tiny' }],
    sol: function (d) { return { v: d.c.v }; },
    tol: 0.5,
    hint: function () { return 'Ve de izquierda a derecha: los números se meten en la pila, y cada operación saca dos y mete el resultado. Cuidado con el orden: el primero que sale es el de la derecha.'; },
    steps: function (d) {
      var pila = [], lineas = [];
      d.c.t.split(' ').forEach(function (tk) {
        if (/^-?\d+$/.test(tk)) pila.push(parseInt(tk, 10));
        else {
          var b = pila.pop(), a = pila.pop();
          pila.push(tk === '+' ? a + b : tk === '-' ? a - b : tk === '*' ? a * b : Math.trunc(a / b));
        }
        lineas.push(tk + ' → [' + pila.join(', ') + ']');
      });
      return ['La pila, paso a paso:<pre class="shd__mini">' + lineas.join('\n') + '</pre>',
        'Al final queda un solo número: <strong>' + d.c.v + '</strong>.'];
    },
    answer: function (d) { return String(d.c.v); }
  });

  p.exercise({
    title: 'Cuánta pila hace falta',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: '2 + 3', n: 2 }, { t: '2 + 3 + 4', n: 2 }, { t: '2 + 3 * 4', n: 3 },
        { t: '(1 + 2) * (3 + 4)', n: 3 }, { t: '1 + (2 * (3 + 4))', n: 4 },
        { t: '1 + 2 + 3 + 4 + 5', n: 2 }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Evaluando <code>' + d.c.t + '</code> en polaca inversa, ¿cuántos números llega a haber a la ' +
        'vez en la pila, como máximo?';
    },
    fields: [{ name: 'n', label: 'altura', w: 'tiny' }],
    sol: function (d) { return { n: d.c.n }; },
    tol: 0.5,
    errores: [{ si: function (v, d) { return Math.abs(v.n - d.c.t.replace(/[^0-9]/g, '').length) < 0.5 && d.c.n !== d.c.t.replace(/[^0-9]/g, '').length; },
      msg: 'Has contado los números de la expresión. La pila no llega a tenerlos todos a la vez: cada operación se come dos y deja uno, así que va vaciándose por el camino.' }],
    hint: function () { return 'Escríbela primero en polaca inversa y ve anotando la altura después de cada pieza. La altura depende de la <strong>forma</strong> del árbol, no de cuántos números haya.'; },
    steps: function (d) {
      return ['Una suma encadenada como <code>1 + 2 + 3</code> no acumula: cada operación se hace en cuanto puede, así que bastan 2.',
        'Lo que hace crecer la pila es tener que guardar un resultado <strong>mientras</strong> se calcula entera la otra rama, que es lo que pasa cuando la rama derecha no es una hoja.',
        'Aquí la altura máxima es <strong>' + d.c.n + '</strong>.'];
    },
    answer: function (d) { return String(d.c.n); }
  });

  p.exercise({
    title: 'El recorrido y las instrucciones',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: '2 + 3', n: 4 }, { t: '2 + 3 * 4', n: 7 },
        { t: '(2 + 3) * 4', n: 7 }, { t: '1 + 2 + 3', n: 7 }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) {
      return 'Compilando la expresión <code>' + d.c.t + '</code> con el recorrido en postorden, ¿cuántas ' +
        'instrucciones de máquina salen? Cuenta solo la expresión: ni el <code>MUESTRA</code> ni el ' +
        '<code>PARA</code>.';
    },
    fields: [{ name: 'n', label: 'instrucciones', w: 'tiny' }],
    sol: function (d) { return { n: d.c.n }; },
    tol: 0.5,
    hint: function () { return 'Cada hoja da <strong>una</strong> instrucción, y cada nudo da <strong>dos</strong>: el <code>METE</code> de antes de la rama derecha y la operación del final.'; },
    steps: function (d) {
      var asm = LEN.compila(LEN.analiza('muestra ' + d.c.t + ';').ast).texto;
      var lineas = asm.split('\n').filter(function (l) { return l.indexOf('MUESTRA') < 0 && l.indexOf('PARA') < 0; });
      return ['El ensamblador de la expresión es:<pre class="shd__mini">' + lineas.join('\n') + '</pre>',
        'Son <strong>' + d.c.n + '</strong>: una por hoja y dos por nudo.',
        'Esa cuenta vale para cualquier expresión, y por eso se sabe de antemano cuánto va a ocupar un programa antes de compilarlo.'];
    },
    answer: function (d) { return String(d.c.n); }
  });

  p.keys([
    'Recorrer un árbol <strong>en postorden</strong> —ramas antes que nudo— es lo que hace falta, porque una operación necesita sus operandos ya resueltos.',
    'Ese recorrido escrito es la <strong>notación polaca inversa</strong>, que no necesita paréntesis ni prioridades porque el orden ya lo dice todo.',
    'Se evalúa con una <strong>pila</strong>: los números se meten, y cada operación saca dos y mete el resultado.',
    'Al sacar, el primero que sale es el operando <strong>derecho</strong>, porque fue el último en entrar.',
    'La <strong>altura máxima</strong> de la pila es la profundidad del árbol, no la cantidad de números: una suma de veinte necesita dos sitios.',
    'Compilar es <strong>el mismo recorrido</strong>, escribiendo instrucciones en vez de calculando.',
    'La máquina del tramo A está hecha justamente para eso: un acumulador y una pila es la forma para la que compilar es un postorden y nada más.'
  ]);
});
