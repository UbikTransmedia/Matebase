/* Tema: Plegar constantes, quitar código muerto y medir la mejora */
Course.topic('len-optimizar', function (p) {

  p.puente('El [[len-compilar|compilador]] ya funciona, y genera código honrado y tonto: traduce lo que ' +
    'hay, pieza por pieza, sin mirar si algo se podría haber ahorrado. Este tema añade el paso que ' +
    'falta, que es el que separa un traductor de un compilador de verdad.');

  p.text('Optimizar es <strong>cambiar el programa por otro que hace exactamente lo mismo y cuesta ' +
    'menos</strong>. Las dos mitades de esa frase importan igual, y la primera más: una transformación ' +
    'que cambia lo que hace el programa no es una optimización, es un fallo. Por eso todas las ' +
    'optimizaciones de este tema se prueban corriendo el programa antes y después.');

  /* ---------------------------------------------------------------- */
  p.section('Plegar lo que ya se sabe');

  p.text('La más sencilla salta a la vista en cuanto se mira el árbol. Si un nudo tiene dos hojas que son ' +
    'números, <strong>el resultado ya se sabe</strong>: no hace falta que la máquina lo calcule cada vez ' +
    'que pase por ahí, se puede calcular ahora y dejar el número puesto.');

  p.text('<pre class="shd__mini">   +                +\n' +
    '     2      →    14\n' +
    '     *\n' +
    '       3\n' +
    '       4\n\n' +
    'de seis instrucciones a una</pre>');

  p.text('Se llama <strong>plegar constantes</strong>, y se hace de abajo arriba: al plegar ' +
    '<code>3 * 4</code> en un 12, el nudo de arriba se encuentra con dos números y se puede plegar ' +
    'también. Una expresión entera de constantes se derrite hasta quedar en un solo número.');

  p.note('¿Y por qué escribiría nadie <code>2 + 3 * 4</code> en vez de 14? Casi nunca lo escribe una ' +
    'persona: sale solo. Aparece al usar nombres con valor fijo —<code>segundos_por_hora</code>, ' +
    '<code>ancho * alto</code> con los dos conocidos—, al sustituir el cuerpo de una función pequeña en ' +
    'el sitio donde se la llama, y sobre todo al aplicar <em>otras</em> optimizaciones, que dejan ' +
    'constantes a su paso. Por eso los compiladores dan varias pasadas: cada una destapa trabajo para ' +
    'la siguiente.',
    'ok', 'Quién escribe ese código');

  /* ---------------------------------------------------------------- */
  p.section('Tirar lo que no se ejecuta');

  p.text('La segunda es consecuencia de la primera. Si al plegar constantes la condición de un ' +
    '<code>si</code> se convierte en un número, ya está decidido <strong>antes de ejecutar</strong> qué ' +
    'rama se va a tomar, y la otra se puede tirar entera:');

  p.text('<pre class="shd__mini">si 1 > 2 { muestra 1; } sino { muestra 9; }\n\n' +
    '  la condición se pliega a 0, y queda\n\n' +
    'muestra 9;</pre>');

  p.text('Lo mismo con un <code>mientras</code> cuya condición sea cero: no da ni una vuelta, así que el ' +
    'bucle entero desaparece. A eso se le llama quitar <strong>código muerto</strong>: código que está ' +
    'escrito y no se ejecuta nunca.');

  p.demo({
    title: 'Optimizando, con las cuentas a la vista',
    intro: 'Este taller optimiza antes de compilar. En el panel de la máquina se ve cuántas cuentas ha plegado y cuántos trozos muertos ha quitado. Escribe programas con cuentas de números y con condiciones que se sepan de antemano.',
    predice: 'En «sea x = 2 + 3 * 4; si 1 > 2 { muestra 1; } sino { muestra 9; } muestra x;», ¿cuántas cuentas crees que se pueden plegar?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'opt-uno', optimiza: true, paneles: ['maquina', 'asm', 'arbol'],
        texto: 'sea x = 2 + 3 * 4;\nsi 1 > 2 { muestra 1; } sino { muestra 9; }\nmientras 0 { muestra 5; }\nmuestra x;',
        nota: 'Mira el árbol después de optimizar: la multiplicación ha desaparecido, el <code>si</code> se ha quedado en una sola rama y el <code>mientras</code> no está. El programa que llega al compilador ya no es el que escribiste.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Medir, que es lo único que vale');

  p.text('Decir que algo va más rápido sin medirlo no significa nada. Aquí hay dos números fáciles de ' +
    'contar y honrados: cuántas <strong>instrucciones</strong> ocupa el programa compilado, y cuántos ' +
    '<strong>pasos</strong> da la máquina al ejecutarlo. El primero es el tamaño; el segundo, el tiempo.');

  p.demo({
    title: 'Antes y después, en números',
    intro: 'Elige un programa y mira las dos columnas: lo que ocupa y lo que tarda, sin optimizar y optimizado. Fíjate en que no siempre se gana lo mismo, y en uno de los cuatro no se gana nada.',
    predice: 'Un bucle que da muchas vueltas con una cuenta de constantes dentro, ¿crees que mejorará más en tamaño o en tiempo?',
    build: function (host) {
      var PROGS = [
        { value: 'cuentas', label: 'cuentas fijas', texto: 'muestra 2 + 3 * 4;\nmuestra (10 - 4) * 2;\nmuestra 100 / 5;' },
        { value: 'rama', label: 'una rama muerta', texto: 'si 1 > 2 { muestra 1; } sino { muestra 9; }\nmientras 0 { muestra 5; }\nmuestra 7;' },
        { value: 'bucle', label: 'un bucle con cuenta fija dentro', texto: 'sea i = 0;\nmientras i < 10 {\n  muestra 2 * 3;\n  i = i + 1;\n}' },
        { value: 'nada', label: 'nada que plegar', texto: 'sea i = 0;\nmientras i < 5 {\n  muestra i * i;\n  i = i + 1;\n}' }
      ];
      var elegido = PROGS[0];
      var out = W.readout(host, '');
      var caja = U.el('pre.shd__mini');

      function mide(texto, optimiza) {
        var a = LEN.analiza(texto);
        if (a.errores.length) return null;
        var arbol = optimiza ? LEN.optimiza(LEN.copia(a.ast)) : a.ast;
        var asm = LEN.compila(arbol).texto;
        var r = MAQ.ejecuta(asm, null, 40000);
        return { instr: MAQ.ensambla(asm).instrucciones, pasos: r.pasos, salida: r.salida.join(', ') };
      }

      function pinta() {
        var antes = mide(elegido.texto, false), desp = mide(elegido.texto, true);
        var cuenta = { plegadas: 0, muertas: 0 };
        LEN.optimiza(LEN.copia(LEN.analiza(elegido.texto).ast), cuenta);
        function pct(a, b) { return a === b ? 'igual' : ('−' + Math.round(100 * (a - b) / a) + ' %'); }
        out.set('<strong>' + elegido.label + '</strong> · escribe ' + (antes.salida || 'nada') +
          ' &nbsp;·&nbsp; ' + (antes.salida === desp.salida
            ? '<span style="color:var(--ok)">y optimizado escribe lo mismo ✓</span>'
            : '<span style="color:var(--bad)">¡optimizado escribe otra cosa!</span>') +
          '<br>Instrucciones: <strong>' + antes.instr + ' → ' + desp.instr + '</strong> (' + pct(antes.instr, desp.instr) + ')' +
          ' &nbsp;·&nbsp; pasos al ejecutar: <strong>' + antes.pasos + ' → ' + desp.pasos + '</strong> (' + pct(antes.pasos, desp.pasos) + ')' +
          '<br>Cuentas plegadas: ' + cuenta.plegadas + ' · trozos muertos quitados: ' + cuenta.muertas);
        caja.textContent = elegido.texto;
      }

      W.chips(W.row(host), PROGS, {
        value: PROGS[0].value,
        on: function (v) {
          PROGS.forEach(function (x) { if (x.value === v) elegido = x; });
          pinta();
        }
      });
      host.appendChild(caja);
      W.hint(host, 'El último no tiene nada que plegar: la cuenta de dentro del bucle usa una variable, así que su valor no se sabe hasta ejecutar. Ahí la mejora es cero, y está bien que lo sea.');
      pinta();
    }
  });

  p.note('Fíjate en el caso del bucle, que es el más instructivo. Plegar <code>2 * 3</code> convierte ' +
    'cuatro instrucciones en una: se ahorran <strong>tres</strong>, y el programa pasa de 19 a 16. Pero ' +
    'esas tres estaban <em>dentro</em> de un bucle que da diez vueltas, así que en tiempo se ahorran ' +
    'treinta pasos, de 168 a 138. La misma mejora vale diez veces más por estar donde está, y ésa es la ' +
    'razón de que los compiladores se esfuercen tanto en lo que hay dentro de los bucles y casi nada en ' +
    'lo que hay fuera.',
    'ok', 'Dentro de un bucle todo cuenta más');

  /* ---------------------------------------------------------------- */
  p.section('Lo que no se puede plegar');

  p.text('Hay un caso que parece plegable y no lo es, y conviene verlo porque enseña la regla general. ' +
    '¿Qué debería hacer el optimizador con <code>muestra 6 / 0;</code>?');

  p.text('La tentación es calcularlo y dejar el resultado. Pero no hay resultado: dividir entre cero es ' +
    'un error. Si el optimizador lo plegara, tendría que decidir entre inventarse un número —y entonces ' +
    'el programa optimizado y el original harían cosas distintas— o dar un error al compilar un programa ' +
    'que quizá nunca llegue a ejecutar esa línea.');

  p.note('La regla es la misma siempre: <strong>ante la duda, no tocar</strong>. Un optimizador que no ' +
    'optimiza algo deja el programa más lento; uno que lo optimiza mal deja el programa ' +
    '<em>equivocado</em>, y las dos cosas no se parecen en nada. El de este curso, cuando encuentra una ' +
    'división entre cero, la deja tal cual y que falle al ejecutar, como habría fallado sin optimizar.',
    'warn', 'Ante la duda, no tocar');

  p.text('Lo mismo pasa, a mayor escala, con casi todo lo que un compilador querría hacer y no puede: ' +
    'mover una cuenta fuera de un bucle solo vale si nada de lo que usa cambia dentro; reordenar dos ' +
    'operaciones solo vale si ninguna afecta a la otra. Cada optimización tiene una condición, y ' +
    'comprobarla es la mayor parte del trabajo.');

  p.ejemplo({
    title: 'Optimizar un programa a mano y contar',
    enunciado: 'Optimizar <code>sea x = 4 * 5; si x > 0 { muestra x; } mientras 0 { muestra 1; }</code> y decir qué se puede plegar, qué se puede tirar y qué no.',
    pasos: [
      { t: '<strong>Plegar lo obvio.</strong> <code>4 * 5</code> son dos hojas numéricas: se pliega a 20. El programa pasa a ser <code>sea x = 20;</code>.', antes: 'Se va de abajo arriba: primero los nudos con las dos ramas ya resueltas.' },
      { t: '<strong>La condición del si.</strong> <code>x > 0</code> tiene una variable, así que <strong>no</strong> se pliega. Aunque se vea a simple vista que <code>x</code> vale 20, este optimizador no sigue la pista de los valores de las variables: solo mira el árbol.', antes: '¿Se podría plegar? ¿Qué haría falta saber para poder hacerlo con seguridad?' },
      { t: '<strong>El bucle.</strong> <code>mientras 0</code> tiene condición constante y falsa: no da ni una vuelta. El bucle entero se tira, y con él el <code>muestra 1</code> de dentro.' },
      { t: '<strong>El recuento.</strong> Una cuenta plegada, un trozo muerto quitado, y un <code>si</code> intacto. El programa queda en <code>sea x = 20; si x > 0 { muestra x; }</code>.' },
      { t: '<strong>Lo que se podría haber hecho y no se hizo.</strong> Un optimizador que sí llevara la cuenta de qué vale cada variable habría sustituido <code>x</code> por 20 y plegado también la condición, dejando el programa en <code>muestra 20;</code>. Eso se llama propagación de constantes y es el paso siguiente natural.' }
    ],
    cierre: 'Fíjate en el patrón: cada optimización destapa trabajo para otra. Plegar dejó un <code>mientras 0</code> visible; propagar habría dejado un <code>si</code> plegable. Por eso los compiladores dan pasadas hasta que una no cambia nada.'
  });

  p.comprueba('¿Por qué el optimizador NO pliega <code>6 / 0</code> aunque los dos son números?', [
    { t: 'Porque no hay ningún número que poner en su sitio, y cualquier cosa que hiciera cambiaría lo que hace el programa', ok: true, por: 'Dividir entre cero es un error, no un valor. Inventarse un número haría que el programa optimizado y el original se portaran distinto, y eso es exactamente lo que una optimización no puede hacer.' },
    { t: 'Porque plegar divisiones es demasiado lento', ok: false, por: 'La velocidad del compilador no tiene nada que ver: una división más o menos al compilar no se nota.' },
    { t: 'Porque las divisiones nunca se pliegan', ok: false, por: 'Sí se pliegan: <code>20 / 4</code> se convierte en 5 sin ningún problema. Lo que no se pliega es el caso concreto en que no hay resultado.' }
  ]);

  p.util('Los compiladores de verdad aplican decenas de estas transformaciones, y algunas cambian el ' +
    'código hasta hacerlo irreconocible: sacan cuentas fuera de los bucles, desenrollan bucles cortos ' +
    'para ahorrarse las comprobaciones, sustituyen el cuerpo de las funciones pequeñas allí donde se las ' +
    'llama, eliminan variables que solo hacen de puente. Eso tiene una consecuencia práctica incómoda: ' +
    'cuando se depura un programa optimizado, el depurador salta de una línea a otra en desorden y hay ' +
    'variables que «no existen», porque el código que se está ejecutando ya no se parece al que se ' +
    'escribió. Por eso se compila sin optimizar mientras se desarrolla, y con todo puesto al publicar.');

  p.hist('Que un compilador tuviera que optimizar no fue una mejora posterior: fue la condición para que ' +
    'lo aceptaran. Cuando el equipo de <strong>John Backus</strong> empezó FORTRAN en 1954, el ' +
    'argumento en contra era unánime: un programa traducido automáticamente sería más lento que uno ' +
    'escrito a mano, y el tiempo de máquina costaba una fortuna. Así que se fijaron como objetivo que el ' +
    'código generado fuera <em>comparable</em> al de un buen programador de ensamblador, y buena parte ' +
    'de los dos años y medio del proyecto se fue en el optimizador. Lo consiguieron, y ése es el motivo ' +
    'de que hoy casi nadie escriba ensamblador a mano: no porque no se pueda, sino porque el compilador ' +
    'suele hacerlo mejor.');

  p.trampas([
    { e: 'Llamar optimización a algo que cambia el resultado', por: 'Entonces no es una optimización, es un fallo. La prueba es correr el programa antes y después y comparar lo que escribe.' },
    { e: 'Plegar una división entre cero', por: 'No hay número que poner. Ante la duda, no tocar.' },
    { e: 'Esperar mejora donde no hay nada constante', por: 'Si las cuentas dependen de variables, no se pueden hacer al compilar. Una mejora del 0 % es un resultado correcto.' },
    { e: 'Medir el tamaño y creer que es el tiempo', por: 'Son dos cosas distintas. Una instrucción ahorrada dentro de un bucle de mil vueltas ahorra mil pasos; la misma fuera del bucle ahorra uno.' },
    { e: 'Optimizar antes de que funcione', por: 'Un programa optimizado y equivocado no vale nada. Primero correcto, después rápido, y midiendo.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántas cuentas se pliegan',
    level: 'basico',
    gen: function (r) {
      var casos = [
        'muestra 2 + 3;', 'muestra 2 + 3 * 4;', 'muestra (1 + 2) * (3 + 4);',
        'sea x = 5;\nmuestra x + 1;', 'muestra 2 * 3 + 4 * 5;', 'sea x = 2 + 3;\nmuestra x * 2;'
      ];
      var t = r.pick(casos);
      var c = { plegadas: 0, muertas: 0 };
      LEN.optimiza(LEN.copia(LEN.analiza(t).ast), c);
      return { t: t, n: c.plegadas };
    },
    ask: function (d) {
      return '¿Cuántas cuentas puede plegar el optimizador en este programa?<pre class="shd__mini">' +
        d.t + '</pre>';
    },
    fields: [{ name: 'n', label: 'cuentas', w: 'tiny' }],
    sol: function (d) { return { n: d.n }; },
    tol: 0.5,
    hint: function () { return 'Se pliega un nudo cuando sus <strong>dos</strong> ramas son números. Y al plegar uno, el de arriba puede quedarse con dos números y plegarse también: cuenta también ésos.'; },
    steps: function (d) {
      return ['Se va de abajo arriba, plegando cada nudo cuyas dos ramas sean ya números.',
        'Cualquier nudo que tenga una variable debajo no se puede plegar: su valor no se sabe hasta ejecutar.',
        'Aquí se pliegan <strong>' + d.n + '</strong>.'];
    },
    answer: function (d) { return String(d.n); }
  });

  p.exercise({
    title: '¿Está muerto?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'si 1 > 2 { muestra 1; }', v: 'muerto', por: 'La condición se pliega a 0: la rama no se ejecuta nunca y desaparece entera.' },
        { t: 'mientras 0 { muestra 1; }', v: 'muerto', por: 'Condición constante y falsa: el bucle no da ni una vuelta, así que se tira.' },
        { t: 'si 2 > 1 { muestra 1; } sino { muestra 9; }', v: 'medio', por: 'La condición se pliega a 1: el <code>si</code> desaparece, pero no el programa. Se queda la rama del «sí» y se tira la del «sino».' },
        { t: 'si x > 2 { muestra 1; }', v: 'vivo', por: 'La condición depende de una variable y no se puede saber al compilar. No se toca nada.' },
        { t: 'mientras i < 5 { muestra i; }', v: 'vivo', por: 'La condición depende de variables. El optimizador la deja tal cual.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Qué hace el optimizador con esto?<pre class="shd__mini">' + d.c.t.replace(/</g, '&lt;') + '</pre>'; },
    fields: [{ name: 'q', label: 'Hace', opts: [
      { t: 'tirarlo entero: no se ejecuta nunca', v: 'muerto' },
      { t: 'quedarse con una rama y tirar la otra', v: 'medio' },
      { t: 'dejarlo como está', v: 'vivo' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Primero mira si la condición se puede plegar a un número. Si no, no hay nada que decidir de antemano.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v; }
  });

  p.exercise({
    title: 'Cuánto se ahorra',
    level: 'medio',
    gen: function (r) {
      var casos = [
        'muestra 2 + 3 * 4;',
        'muestra (10 - 4) * 2;',
        'si 1 > 2 { muestra 1; } sino { muestra 9; }',
        'mientras 0 { muestra 5; }\nmuestra 7;',
        'sea x = 2 * 3;\nmuestra x;'
      ];
      var t = r.pick(casos);
      function instr(opt) {
        var a = LEN.analiza(t);
        var arbol = opt ? LEN.optimiza(LEN.copia(a.ast)) : a.ast;
        return MAQ.ensambla(LEN.compila(arbol).texto).instrucciones;
      }
      return { t: t, antes: instr(false), desp: instr(true) };
    },
    ask: function (d) {
      return 'Este programa ocupa <strong>' + d.antes + '</strong> instrucciones de máquina sin ' +
        'optimizar. ¿Cuántas ocupa optimizado?<pre class="shd__mini">' + d.t.replace(/</g, '&lt;') + '</pre>';
    },
    fields: [{ name: 'n', label: 'instrucciones', w: 'tiny' }],
    sol: function (d) { return { n: d.desp }; },
    tol: 0.5,
    hint: function () { return 'Optimiza primero el programa mentalmente y compila después lo que queda. Un número suelto son dos instrucciones si hay que mostrarlo, más el <code>PARA</code> del final.'; },
    steps: function (d) {
      var a = LEN.analiza(d.t);
      var opt = LEN.optimiza(LEN.copia(a.ast));
      return ['Optimizado, el programa se queda en esto:<pre class="shd__mini">' + LEN.arbolTexto(opt) + '</pre>',
        'Y su ensamblador:<pre class="shd__mini">' + LEN.compila(opt).texto + '</pre>',
        'Son <strong>' + d.desp + '</strong> instrucciones, frente a las ' + d.antes + ' de antes.'];
    },
    answer: function (d) { return String(d.desp); }
  });

  p.exercise({
    title: 'Esta transformación, ¿vale?',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'cambiar <code>x * 1</code> por <code>x</code>', v: 'vale', por: 'Multiplicar por uno no cambia nada, valga lo que valga <code>x</code>. Es correcta siempre y ahorra una operación.' },
        { t: 'cambiar <code>x * 0</code> por <code>0</code>', v: 'vale', por: 'Con números enteros como los de Pizca, cualquier cosa por cero da cero. (En un lenguaje con decimales especiales habría que mirarlo con más cuidado, que es una historia larga.)' },
        { t: 'cambiar <code>6 / 0</code> por <code>0</code>', v: 'no', por: 'No hay resultado que poner. El programa original fallaba al llegar ahí, y el cambiado escribiría un cero tan tranquilo: hacen cosas distintas.' },
        { t: 'sacar <code>a * b</code> fuera de un bucle en el que ni <code>a</code> ni <code>b</code> cambian', v: 'vale', por: 'Si nada de lo que usa cambia dentro, la cuenta da lo mismo en todas las vueltas y basta hacerla una vez. La condición —que no cambien— es justamente lo que hay que comprobar.' },
        { t: 'sacar <code>a * b</code> fuera de un bucle en el que <code>a</code> se modifica dentro', v: 'no', por: 'Cada vuelta daría un valor distinto, y sacándola fuera se calcularía una sola vez con el valor inicial. Es la misma optimización que la anterior, sin su condición: por eso comprobarla es la mayor parte del trabajo.' },
        { t: 'quitar un <code>mientras</code> cuya condición es <code>0</code>', v: 'vale', por: 'No da ni una vuelta, así que quitarlo no cambia nada de lo que hace el programa.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Es correcta esta optimización, o sea, deja el programa haciendo exactamente lo mismo?<br><strong>' + d.c.t + '</strong>'; },
    fields: [{ name: 'q', label: 'Es', opts: [
      { t: 'correcta', v: 'vale' }, { t: 'incorrecta: cambia lo que hace el programa', v: 'no' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Busca un caso —un valor, una situación— en el que el programa de antes y el de después hagan cosas distintas. Si lo encuentras, no vale. Y fíjate siempre en si la transformación lleva una condición escondida.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'vale' ? 'correcta' : 'incorrecta'; }
  });

  p.keys([
    'Optimizar es cambiar el programa por otro que hace <strong>exactamente lo mismo</strong> y cuesta menos. Si cambia lo que hace, no es una optimización: es un fallo.',
    '<strong>Plegar constantes</strong>: un nudo con dos hojas numéricas se calcula al compilar y se sustituye por el número. Se hace de abajo arriba.',
    '<strong>Código muerto</strong>: si la condición de un <code>si</code> o un <code>mientras</code> se pliega a un número, la rama que no se ejecuta desaparece.',
    'Cada optimización destapa trabajo para la siguiente, y por eso los compiladores dan <strong>varias pasadas</strong>.',
    'Se mide en dos cosas distintas: <strong>instrucciones</strong> —el tamaño— y <strong>pasos</strong> —el tiempo—. Una mejora dentro de un bucle se multiplica por las vueltas.',
    'Casi toda optimización lleva una <strong>condición</strong> escondida, y comprobarla es la mayor parte del trabajo.',
    'Ante la duda, <strong>no tocar</strong>: un programa más lento es un inconveniente y un programa equivocado es otra cosa.'
  ]);
});
