/* Tema: Funciones y recursión: el marco de llamada y la pila que crece */
Course.topic('len-funciones', function (p) {

  p.puente('Con [[len-variables|entornos encadenados]] ya está casi todo lo que hace falta para las ' +
    'funciones. Falta contar qué ocurre exactamente en una llamada, y sobre todo qué ocurre cuando una ' +
    'función <strong>se llama a sí misma</strong>, que es donde el mecanismo enseña de qué está hecho.');

  /* ---------------------------------------------------------------- */
  p.section('Qué pasa en una llamada');

  p.text('Llamar a una función son cuatro cosas, siempre las mismas:');

  p.list([
    '<strong>Evaluar los argumentos</strong>, en el entorno de quien llama.',
    '<strong>Crear un entorno nuevo</strong> donde cada parámetro vale su argumento.',
    '<strong>Ejecutar el cuerpo</strong> en ese entorno; el <code>vuelve</code> dice qué valor sale.',
    '<strong>Tirar el entorno</strong> y seguir donde se había quedado quien llamaba.'
  ], true);

  p.text('A ese entorno con sus parámetros, sus variables locales y la dirección a la que hay que volver ' +
    'se le llama <strong>marco de llamada</strong>. Es lo que una función necesita para existir, y ' +
    'muere con ella.');

  p.note('Los dos primeros pasos tienen un orden que importa. Los argumentos se evalúan ' +
    '<strong>antes</strong> de crear el entorno nuevo, y por tanto en el de fuera. Si fuera al revés, ' +
    'llamar a <code>f(n)</code> desde dentro de la propia <code>f</code> evaluaría <code>n</code> en un ' +
    'entorno que todavía no tiene valor, y la recursión no podría funcionar. Es un detalle de una línea ' +
    'del que depende todo el tema.',
    'warn', 'Primero los argumentos, después el entorno');

  /* ---------------------------------------------------------------- */
  p.section('Recursión: varias copias vivas a la vez');

  p.text('Una función que se llama a sí misma no tiene nada de especial para el mecanismo de arriba. La ' +
    'segunda llamada crea su propio entorno, distinto del primero, y ahí está todo el truco: ' +
    '<strong>hay varias copias de la misma función vivas al mismo tiempo, cada una con su ' +
    '<code>n</code></strong>.');

  p.text('<pre class="shd__mini">fun fact(n) {\n  si n < 2 { vuelve 1; }\n  vuelve n * fact(n - 1);\n}\nmuestra fact(5);</pre>');

  p.text('Cuando se está calculando <code>fact(2)</code>, siguen esperando <code>fact(3)</code>, ' +
    '<code>fact(4)</code> y <code>fact(5)</code>, cada una con su <code>n</code> guardada y su ' +
    'multiplicación a medias. Son cinco marcos apilados, y se deshacen en orden inverso al que se ' +
    'crearon.');

  p.note('Esa estructura ya la conoces con otro nombre. Una sucesión definida por recurrencia ' +
    '—[[fn-sucesiones|como las que viste]]— dice un caso base y una regla que da un término a partir de ' +
    'los anteriores; una función recursiva dice exactamente lo mismo, y la demostración de que hace lo ' +
    'que dice es una [[lg-demostracion|inducción]]. Lo único que añade el ordenador es que hay que ' +
    '<em>guardar en algún sitio</em> los términos a medio calcular, y ese sitio es la pila.',
    'ok', 'Lo mismo que una recurrencia');

  p.demo({
    title: 'El factorial, hasta el fondo y de vuelta',
    intro: 'Mira el panel de la máquina: cuántas instrucciones genera y cuántos pasos tarda. Sube el número poco a poco y observa cómo crece el trabajo. Con n = 6 pasa algo interesante, y no es un fallo del programa.',
    predice: 'El factorial de 5 vale 120 y cabe en ocho bits. ¿Qué crees que pasará con el de 6, que vale 720?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'fun-fact', tope: 60000,
        texto: MAQ && LEN ? LEN.EJEMPLOS.recursion.texto : '',
        nota: 'Con <code>n = 6</code> el resultado da la vuelta: 720 no cabe en ocho bits, y las dos ejecuciones —la interpretada y la compilada— dan el mismo número equivocado, porque <strong>Pizca desborda igual que su máquina</strong>. Que coincidan hasta en el error es lo que hace que compararlas sirva de algo.'
      });
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La pila que crece');

  p.text('Cada llamada ocupa sitio, y ese sitio no se libera hasta que la llamada termina. Como una ' +
    'recursión no termina hasta llegar al caso base, <strong>la pila crece tanto como hondo llegue la ' +
    'recursión</strong>, y no tanto como grande sea el cálculo.');

  p.text('Eso tiene dos consecuencias. La primera es que una recursión profunda gasta memoria aunque ' +
    'calcule poco. La segunda es lo que pasa cuando no hay caso base, o cuando está mal escrito y nunca ' +
    'se alcanza: la pila crece sin parar hasta que se acaba el sitio.');

  p.demo({
    title: 'Una recursión que no vuelve',
    intro: 'A esta función le falta el caso base. Mira qué dice la máquina cuando se le acaba la pila: son 64 sitios, y no hace falta ninguna recursión muy exótica para agotarlos. Después arréglala añadiendo un «si n < 1 { vuelve 0; }» al principio.',
    predice: '¿Qué crees que hará la máquina cuando se le acabe el sitio: dar un resultado raro, pararse avisando, o quedarse colgada para siempre?',
    build: function (host) {
      W.lenguaje(host, {
        id: 'fun-sinfondo', tope: 6000, paneles: ['maquina', 'asm'],
        texto: 'fun baja(n) {\n  vuelve baja(n - 1) + 1;\n}\nmuestra baja(5);',
        nota: 'Mira el panel de la máquina: los dos caminos se estrellan, pero contra paredes distintas. El intérprete se queda sin pasos; la máquina, sin pila, porque son 64 sitios y cada llamada ocupa uno. Ninguno de los dos se cuelga: los dos topes están puestos a propósito para que un programa mal escrito se pare y lo cuente.'
      });
    }
  });

  p.note('En un ordenador de verdad esto se llama <em>desbordamiento de pila</em>, y es uno de los ' +
    'errores más comunes que existen. El límite suele estar en unos miles o decenas de miles de ' +
    'llamadas anidadas; aquí son 64 porque la máquina es de juguete, pero el fenómeno es idéntico. Y ' +
    'una parte importante de la seguridad informática consiste, precisamente, en que ese tipo de ' +
    'desbordamiento no deje escribir donde no debe.',
    null, 'Desbordamiento de pila');

  /* ---------------------------------------------------------------- */
  p.section('Cómo se compila una llamada');

  p.text('Aquí hay una limitación honesta que conviene contar. [[maq-cpu|La máquina]] no sabe leer una ' +
    'celda cuya dirección esté guardada en otra celda, y sin eso no se pueden hacer marcos de llamada ' +
    'de verdad: no hay forma de decir «la <code>n</code> de <em>esta</em> llamada».');

  p.text('Lo que hace el compilador de este curso es otra cosa, más simple y suficiente: cada función ' +
    'tiene sus huecos fijos, y <strong>quien llama guarda en la pila lo que había en esos huecos ' +
    'antes de llamar, y lo devuelve a su sitio al volver</strong>.');

  p.text('<pre class="shd__mini">CARGA fact_n    ; lo que vale ahora mismo\nMETE            ; a la pila, por si acaso\n' +
    '...             ; calcular el argumento y dejarlo en fact_n\nLLAMA f_fact\n' +
    'GUARDA ret      ; el resultado, a salvo un momento\nSACA            ; recuperar lo de antes\n' +
    'GUARDA fact_n   ; y a su sitio\nCARGA ret       ; seguir con el resultado</pre>');

  p.text('Con eso la recursión funciona exactamente igual, la pila crece una vez por llamada —que es lo ' +
    'que había que ver— y se paga un precio pequeño en instrucciones. Los compiladores de verdad usan ' +
    'un registro que apunta al marco actual, que es más elegante y necesita esa instrucción que aquí no ' +
    'existe.');

  p.ejemplo({
    title: 'Seguir fact(4) marco a marco',
    enunciado: 'Escribir qué marcos hay vivos en cada momento al calcular <code>fact(4)</code>, y cuántos como máximo.',
    pasos: [
      { t: '<strong>Bajando.</strong> <code>fact(4)</code> no cumple el caso base, así que llama a <code>fact(3)</code> y se queda esperando con $n = 4$ y una multiplicación a medias. Marcos vivos: 1.', antes: 'El marco de quien llama no se va: se queda esperando el resultado.' },
      { t: '<strong>Y sigue bajando.</strong> Lo mismo con 3, con 2 y con 1. Al llegar a <code>fact(1)</code> hay cuatro marcos vivos, cada uno con su <code>n</code>: 4, 3, 2 y 1.' },
      { t: '<strong>El caso base.</strong> <code>fact(1)</code> sí cumple $n < 2$: devuelve 1 sin llamar a nadie y su marco desaparece. Quedan 3.' },
      { t: '<strong>Subiendo.</strong> <code>fact(2)</code> recibe ese 1, lo multiplica por su $n = 2$ y devuelve 2; su marco muere. <code>fact(3)</code> recibe el 2, lo multiplica por 3 y devuelve 6. <code>fact(4)</code> recibe el 6, lo multiplica por 4 y devuelve 24.', antes: 'Cada marco recupera su propia n, la que guardó al bajar.' },
      { t: '<strong>El recuento.</strong> Cuatro marcos como máximo, uno por cada valor de $n$ desde 4 hasta 1. La profundidad es $n$, y por eso una recursión sobre un número grande gasta pila aunque el resultado sea pequeño.' }
    ],
    cierre: 'Fíjate en que la multiplicación de cada marco se hace <em>al volver</em>, no al bajar. Bajando solo se apilan promesas; subiendo se cumplen.'
  });

  p.comprueba('¿Por qué una recursión sin caso base agota la pila en vez de dar un resultado equivocado?', [
    { t: 'Porque cada llamada apila un marco que no se libera hasta volver, y sin caso base no vuelve ninguna', ok: true, por: 'Los marcos se van acumulando: la primera llamada espera a la segunda, que espera a la tercera… Como nadie llega a devolver nada, ninguno se libera y el sitio se acaba.' },
    { t: 'Porque el resultado se hace tan grande que no cabe', ok: false, por: 'Eso es el desbordamiento de los números, que es otra cosa. Aquí lo que se llena es el sitio donde se guardan las llamadas a medias, y pasa igual aunque todos los valores sean pequeños.' },
    { t: 'Porque la función se sobrescribe a sí misma', ok: false, por: 'El código de la función es uno solo y no se toca. Lo que hay varias veces son los <em>datos</em> de cada llamada.' }
  ]);

  p.util('Que la pila crezca con la profundidad tiene consecuencias muy prácticas. Recorrer una lista de ' +
    'un millón de elementos con un bucle no gasta nada, y hacerlo con una recursión de un millón de ' +
    'niveles revienta: por eso hay algoritmos que se escriben recursivos en la pizarra y iterativos en ' +
    'el código. Algunos lenguajes se ahorran el problema cuando la llamada recursiva es <em>lo último ' +
    'que hace</em> la función, porque entonces el marco de quien llama ya no hace falta y se puede ' +
    'reutilizar; a eso se le llama <em>llamada final</em>, y quien programa en esos lenguajes escribe ' +
    'las funciones adrede para que la recursión caiga al final.');

  p.hist('Que una función pudiera llamarse a sí misma no fue evidente. En el comité de ALGOL 60 hubo ' +
    'discusión, y el resultado es célebre: la recursión acabó en el lenguaje casi de tapadillo, en una ' +
    'frase que <strong>Edsger Dijkstra</strong> y <strong>Klaus Samelson</strong> colaron en la ' +
    'definición mientras el comité debatía otras cosas. La objeción no era filosófica sino práctica ' +
    '—nadie sabía implementarlo con eficiencia—, y la solución fue justamente la pila de marcos. Al ' +
    'lado de allá, FORTRAN prohibió la recursión hasta 1990: sus funciones tenían un único sitio fijo ' +
    'para sus variables, exactamente el problema que aquí se resuelve salvando y restaurando huecos.');

  p.trampas([
    { e: 'Escribir la recursión sin caso base', por: 'La pila crece hasta que se acaba. El caso base no es un adorno: es la única forma de que alguna llamada devuelva algo.' },
    { e: 'Poner el caso base después de la llamada recursiva', por: 'Nunca se llega a él: la llamada ocurre antes. El caso base va siempre al principio.' },
    { e: 'Creer que hay una sola n', por: 'Hay una por marco vivo. Cuando se está en <code>fact(2)</code>, las <code>n</code> de las llamadas de fuera siguen existiendo con sus valores.' },
    { e: 'Pensar que la pila crece con el tamaño del resultado', por: 'Crece con la <strong>profundidad</strong> de la recursión. <code>fact(20)</code> tiene veinte marcos aunque el resultado quepa o no.' },
    { e: 'Esperar que la multiplicación se haga al bajar', por: 'Se hace al volver. Bajando solo se apilan llamadas a medias.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Cuántos marcos llega a haber',
    level: 'basico',
    gen: function (r) {
      var n = r.int(3, 8);
      return { n: n, marcos: n };
    },
    ask: function (d) {
      return 'Con <code>fun fact(n) { si n &lt; 2 { vuelve 1; } vuelve n * fact(n - 1); }</code>, al ' +
        'calcular <code>fact(' + d.n + ')</code>, ¿cuántos marcos de llamada llega a haber vivos a la vez?';
    },
    fields: [{ name: 'm', label: 'marcos', w: 'tiny' }],
    sol: function (d) { return { m: d.marcos }; },
    tol: 0.5,
    hint: function (d) { return 'La recursión baja de ' + d.n + ' en ' + d.n + ' hasta llegar al caso base, que es el 1. Cuenta cuántos valores distintos de <code>n</code> hay esperando.'; },
    steps: function (d) {
      var lista = [];
      for (var k = d.n; k >= 1; k--) lista.push(k);
      return ['Los marcos se abren con $n = ' + lista.join(', ') + '$.',
        'Ninguno se cierra hasta que el del fondo, el de $n = 1$, devuelve su 1.',
        'Son <strong>' + d.marcos + '</strong> marcos vivos a la vez, que es exactamente $n$.'];
    },
    answer: function (d) { return String(d.marcos); }
  });

  p.exercise({
    title: 'Qué devuelve',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { f: 'fun f(n) { si n < 1 { vuelve 0; } vuelve n + f(n - 1); }', t: 'suma de 1 a n', n: r.int(3, 6), fn: function (n) { var s = 0; for (var i = 1; i <= n; i++) s += i; return s; } },
        { f: 'fun f(n) { si n < 1 { vuelve 0; } vuelve 2 + f(n - 1); }', t: 'dos por n', n: r.int(3, 8), fn: function (n) { return 2 * n; } },
        { f: 'fun f(n) { si n < 2 { vuelve 1; } vuelve n * f(n - 1); }', t: 'factorial', n: r.int(2, 5), fn: function (n) { var s = 1; for (var i = 2; i <= n; i++) s *= i; return s; } }
      ];
      var c = r.pick(casos);
      return { f: c.f, n: c.n, v: LEN.ocho(c.fn(c.n)) };
    },
    ask: function (d) {
      return '¿Qué devuelve <code>f(' + d.n + ')</code>?<pre class="shd__mini">' +
        d.f.replace(/</g, '&lt;') + '</pre>';
    },
    fields: [{ name: 'v', label: 'devuelve', w: 'tiny' }],
    sol: function (d) { return { v: d.v }; },
    tol: 0.5,
    hint: function () { return 'Baja hasta el caso base anotando lo que queda pendiente en cada marco, y después sube resolviendo las cuentas al revés.'; },
    steps: function (d) {
      var r = LEN.corre(d.f + '\nmuestra f(' + d.n + ');');
      return ['Bajando se abren marcos hasta llegar al caso base.',
        'Subiendo, cada marco hace su cuenta con el resultado que le devuelve el de abajo.',
        'Sale <strong>' + r.salida[0] + '</strong>.'];
    },
    answer: function (d) { return String(d.v); }
  });

  p.exercise({
    title: 'Qué le pasa a esta función',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { f: 'fun f(n) { vuelve f(n - 1) + 1; }', v: 'pila', por: 'No hay caso base: ninguna llamada devuelve nunca, los marcos se acumulan y la pila se llena. La máquina se para y lo dice.' },
        { f: 'fun f(n) { si n == 0 { vuelve 0; } vuelve f(n - 2); }', v: 'pila', por: 'El caso base existe y la llamada baja hacia él, pero baja <strong>de dos en dos</strong>: si <code>n</code> es impar, pasa de largo por el 0 y no lo pisa nunca. Tener caso base no basta: hay que asegurarse de caer justo en él.' },
        { f: 'fun f(n) { vuelve f(n - 1); si n < 1 { vuelve 0; } }', v: 'pila', por: 'El caso base está <em>después</em> de la llamada recursiva, así que no se alcanza jamás. Por eso el caso base va siempre al principio.' },
        { f: 'fun f(n) { si n < 1 { vuelve 0; } vuelve f(n - 1) + 1; }', v: 'bien', por: 'Caso base al principio y llamada que se acerca a él restando uno. Termina, y devuelve <code>n</code>.' }
      ];
      return { c: r.pick(casos) };
    },
    ask: function (d) { return '¿Qué le pasa a esta función al llamarla con un número positivo impar?<pre class="shd__mini">' + d.c.f.replace(/</g, '&lt;') + '</pre>'; },
    fields: [{ name: 'q', label: 'Le pasa que', opts: [
      { t: 'no termina nunca, y se para al llegar al tope', v: 'pila' },
      { t: 'funciona bien y termina', v: 'bien' }
    ] }],
    sol: function (d) { return { q: d.c.v }; },
    hint: function () { return 'Pregúntate dos cosas: ¿hay caso base?, y ¿la llamada recursiva <strong>se acerca</strong> a él? Las dos tienen que cumplirse, y el caso base tiene que estar antes de la llamada.'; },
    steps: function (d) { return [d.c.por]; },
    answer: function (d) { return d.c.v === 'pila' ? 'no termina' : 'funciona bien'; }
  });

  p.exercise({
    title: 'Escribirla tú',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'una función <code>f(n)</code> recursiva que devuelva la suma de todos los números de 1 a <code>n</code>, y con <code>n = 0</code> devuelva 0',
          ref: 'fun f(n) {\n  si n < 1 { vuelve 0; }\n  vuelve n + f(n - 1);\n}',
          casos: [{ antes: '', salida: [] }] },
        { t: 'una función <code>f(n)</code> recursiva que devuelva <code>n</code> multiplicado por 3, sin usar el <code>*</code>',
          ref: 'fun f(n) {\n  si n < 1 { vuelve 0; }\n  vuelve 3 + f(n - 1);\n}',
          casos: [{ antes: '', salida: [] }] },
        { t: 'una función <code>f(n)</code> recursiva que devuelva 2 elevado a <code>n</code>',
          ref: 'fun f(n) {\n  si n < 1 { vuelve 1; }\n  vuelve 2 * f(n - 1);\n}',
          casos: [{ antes: '', salida: [] }] }
      ];
      var c = r.pick(casos);
      /* Los casos se arman con el propio programa de referencia: se le pide al
         alumno lo mismo que hace la referencia, con cuatro entradas. */
      var pruebas = [0, 1, 3, 5].map(function (n) {
        return { antes: '', n: n, salida: LEN.corre(c.ref + '\nmuestra f(' + n + ');').salida };
      });
      return { t: c.t, ref: c.ref, pruebas: pruebas };
    },
    ask: function (d) {
      return 'Escribe ' + d.t + '.<br><span style="font-size:0.875rem;color:var(--ink-faint)">Se corrige ' +
        'llamándola con 0, 1, 3 y 5: vale cualquier función que devuelva lo mismo. Escribe solo la ' +
        'función, sin el <code>muestra</code>.</span>';
    },
    fields: [{ name: 'n', label: 'la función', w: 'wide' }],
    sol: function (d) { return { n: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.n || '').trim();
      if (!texto) return { ok: false, msg: 'Escribe la función, empezando por <code>fun f(n) {</code>.' };
      if (texto.indexOf('fun f(') < 0) return { ok: false, msg: 'La función tiene que llamarse <code>f</code> y recibir un solo dato: <code>fun f(n) { ... }</code>.' };
      for (var i = 0; i < d.pruebas.length; i++) {
        var pr = d.pruebas[i];
        var res = LEN.corre(texto + '\nmuestra f(' + pr.n + ');', { tope: 30000 });
        if (res.errores.length) return { ok: false, msg: 'Línea ' + res.errores[0].linea + ': ' + res.errores[0].msg };
        if (res.porQue && res.porQue.indexOf('terminado') < 0) {
          return { ok: false, msg: 'Con <code>n = ' + pr.n + '</code> no termina: ' + res.porQue + '. Revisa el caso base y que la llamada se acerque a él.' };
        }
        if (String(res.salida) !== String(pr.salida)) {
          return { ok: false, msg: 'Con <code>n = ' + pr.n + '</code> esperaba ' + pr.salida.join(', ') + ' y ha devuelto ' + (res.salida.length ? res.salida.join(', ') : 'nada') + '.' };
        }
      }
      return { ok: true, msg: 'Correcto, y con los cuatro valores, incluido el 0.' };
    },
    hint: function () {
      return ['Toda función recursiva tiene la misma forma: un <code>si</code> con el caso base al principio, y debajo el <code>vuelve</code> que se llama a sí misma con un valor más pequeño.',
        'El caso base es el valor de <code>n</code> para el que la respuesta se sabe sin pensar. Empieza por decidir cuál es y qué devuelve.'];
    },
    steps: function (d) {
      return ['Una solución:<pre class="shd__mini">' + d.ref.replace(/</g, '&lt;') + '</pre>',
        'El caso base va <strong>antes</strong> de la llamada, o no se alcanzaría nunca.',
        'Y la llamada usa <code>n - 1</code>, que se acerca al caso base: con <code>n + 1</code> se alejaría y la pila se llenaría.'];
    },
    answer: function (d) { return d.ref.replace(/\n/g, ' '); }
  });

  p.keys([
    'Una llamada son cuatro pasos: evaluar los argumentos, crear un entorno nuevo, ejecutar el cuerpo y tirar el entorno.',
    'Los argumentos se evalúan <strong>antes</strong> de crear el entorno nuevo, y en el de fuera. Sin eso la recursión no podría funcionar.',
    'Al entorno con sus parámetros, sus locales y la dirección de vuelta se le llama <strong>marco de llamada</strong>.',
    'En una recursión hay <strong>varias copias vivas a la vez</strong>, cada una con su propio valor del parámetro.',
    'La pila crece con la <strong>profundidad</strong> de la recursión, no con el tamaño del resultado.',
    'Sin caso base —o con uno al que la llamada no se acerque— la pila se llena: eso es el desbordamiento de pila.',
    'Una función recursiva es una <strong>recurrencia</strong>: caso base y regla, igual que una sucesión, y se demuestra por inducción.'
  ]);
});
