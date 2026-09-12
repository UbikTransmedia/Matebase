/* Tema: Métodos de demostración e inducción */
Course.topic('lg-demostracion', function (p) {

  p.puente('Con proposiciones y [[lg-conjuntos|conjuntos]] ya se puede afirmar; este tema enseña a ' +
    'saber si una afirmación es cierta sin comprobarla en todos los casos. Las herramientas son las ' +
    'conectivas de [[lg-proposiciones|lógica]], en especial la implicación y su contrarrecíproca, y una ' +
    'idea nueva: el dominó de la inducción.');

  p.text('Esto es lo que separa a las matemáticas de todas las demás ciencias. Un físico comprueba una ' +
    'ley en un millón de experimentos y la da por buena hasta que aparezca algo mejor. Un matemático ' +
    'no: o lo <strong>demuestra</strong>, y entonces es cierto para siempre y sin excepciones, o no lo ' +
    'sabe.');

  p.note('<strong>Comprobar casos no demuestra nada.</strong> Por muchos ejemplos que funcionen, ' +
    'siempre puede haber uno más adelante que no. Y ocurre de verdad, como vas a ver ahora mismo.',
    'warn', 'La idea central del tema');

  p.demo({
    title: 'Un patrón que aguanta 40 casos y luego se rompe',
    predice: 'Antes de subir $n$: ¿en qué $n$ crees que fallará $n^2 + n + 41$? Pista: prueba a factorizar el resultado cuando $n = 40$.',
    intro: 'La fórmula n² + n + 41 da números primos una y otra vez. Ve subiendo n. ¿Cuántos casos harían falta para convencerte?',
    build: function (host, d) {
      var n = 0;
      var out = W.readout(host, '');
      var caja = U.el('div', {
        style: {
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(64px,1fr))',
          gap: '4px', margin: '8px 0', fontFamily: 'var(--mono)', fontSize: '12px'
        }
      });
      host.appendChild(caja);
      function pinta() {
        var h = '';
        for (var k = 0; k <= n; k++) {
          var v = k * k + k + 41;
          var pr = ML.isPrime(v);
          h += '<div style="text-align:center;padding:4px 2px;border-radius:6px;' +
            'background:' + (pr ? 'var(--ok-soft)' : 'var(--bad)') + ';' +
            'color:' + (pr ? 'var(--ok)' : '#fff') + ';font-weight:' + (pr ? '400' : '700') + '">' +
            v + '</div>';
        }
        caja.innerHTML = h;
        var val = n * n + n + 41;
        var esPrimo = ML.isPrime(val);
        out.set('$n = ' + n + '$ → $' + n + '^2 + ' + n + ' + 41 = ' + U.miles(val) + '$ → ' +
          (esPrimo ? '<strong style="color:var(--ok)">primo</strong>' :
            '<strong style="color:var(--bad)">NO es primo</strong>: $' + val + ' = ' + ML.factorTex(val) + '$') +
          '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">' +
          (n < 40 ? 'Llevamos ' + (n + 1) + ' aciertos seguidos. Sigue subiendo…'
            : 'Falla en $n = 40$, porque $40^2+40+41 = 40\\cdot41+41 = 41^2$. Cuarenta comprobaciones ' +
              'correctas no valían absolutamente nada como demostración.') + '</span>');
      }
      W.slider(W.row(host), { label: 'n', min: 0, max: 45, step: 1, value: 0, dec: 0, on: function (v) { n = v; pinta(); } });
      W.hint(host, 'Esta fórmula es de Euler. Prueba a llegar hasta n = 40.');
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('Los tres métodos básicos');

  p.text('Casi todo lo que se demuestra tiene la forma «si $p$, entonces $q$». Hay tres maneras ' +
    'estándar de atacarlo.');

  p.sub('1. Demostración directa');

  p.text('Se supone $p$ y se razona hasta llegar a $q$. Es el camino natural.');

  p.formula('\\begin{aligned} &n \\text{ par} \\Rightarrow n = 2k \\\\ &n^2 = 4k^2 = 2(2k^2) \\\\ &\\Rightarrow n^2 \\text{ es par} \\end{aligned}',
    'si n es par, n² es par',
    'La flecha $\\Rightarrow$ se lee «implica» o «entonces». Cada línea es un paso, y cada paso ' +
      'tiene que seguirse del anterior sin hacer trampa.<br><br>Se lee, encadenando: <em>«ene par ' +
      'implica que ene es dos ka, implica que ene al cuadrado es cuatro ka al cuadrado, implica que ' +
      'ene al cuadrado es par»</em>.<br><br>Eso es una demostración directa: partir de la hipótesis y ' +
      'llegar a la conclusión por una cadena de implicaciones, sin saltos.');

  p.sub('2. Por contrarrecíproco');

  p.text('En vez de $p \\to q$ se demuestra $\\neg q \\to \\neg p$, que —como viste— es exactamente ' +
    'equivalente. A veces el camino de vuelta es muchísimo más fácil.');

  p.formula('n^2 \\text{ par} \\Rightarrow n \\text{ par}', 'difícil de atacar de frente');

  p.text('Directamente cuesta: de «$n^2$ es par» no se saca gran cosa. Pero el contrarrecíproco es ' +
    'inmediato: si $n$ es impar, $n = 2k+1$, entonces $n^2 = 4k^2+4k+1$, que es impar. Y ya está.');

  p.sub('3. Por reducción al absurdo');

  p.text('Se supone que la conclusión es <strong>falsa</strong> y se razona hasta llegar a una ' +
    'contradicción. Como no puede haber contradicciones, la suposición era imposible y la conclusión ' +
    'tenía que ser cierta.');

  p.text('Es el método con el que se demostraron dos de los resultados más célebres de las matemáticas ' +
    'griegas: que <strong>los números primos son infinitos</strong> y que <strong>$\\sqrt{2}$ no se ' +
    'puede escribir como fracción</strong>. Los dos los verás con todo detalle en el bloque de ' +
    'aritmética, que viene justo después; aquí interesa solo la forma del razonamiento.');

  p.note('Por si esa segunda frase te suena rara: decir que $\\sqrt{2}$ no se puede escribir como ' +
    'fracción significa que no hay <em>ningún</em> par de números enteros cuyo cociente dé exactamente ' +
    'ese valor, por mucho que se busque. A esos números se les llama <strong>irracionales</strong>, y ' +
    'tienen su tema propio más adelante. Lo asombroso —y lo que hace falta demostrar— es que sea ' +
    'imposible, no simplemente que nadie lo haya conseguido.', null, 'Qué significa «irracional»');

  p.ejemplo({
    title: 'Una reducción al absurdo entera: no hay un número natural mayor que todos',
    enunciado: 'Queremos demostrar que <em>no existe un número natural que sea mayor o igual que todos los demás</em>. Es una afirmación negativa —«no existe»—, y esas son las favoritas del absurdo.',
    pasos: [
      { t: '<strong>Suponemos lo contrario</strong>: que sí existe un natural $M$ mayor o igual que todos los naturales.', antes: 'Para razonar por absurdo, ¿qué es exactamente lo que hay que suponer?' },
      { t: 'Razonamos a partir de esa suposición: $M$ es natural, así que $M + 1$ también lo es, y es un número natural <strong>mayor</strong> que $M$.', antes: 'Si $M$ es natural, ¿qué otro natural puedes fabricar a partir de él?' },
      { t: '<strong>Contradicción</strong>: $M$ tenía que ser mayor o igual que todos, y acabamos de encontrar uno mayor. Las dos cosas no pueden ser ciertas a la vez.' },
      { t: 'Como la suposición lleva a un imposible, la suposición era falsa: no existe ese $M$. ∎', antes: '¿Qué se concluye cuando una suposición lleva a una contradicción?' }
    ],
    cierre: 'La estructura es siempre la misma: suponer lo contrario, razonar con normalidad, chocar con algo imposible, y concluir. Con $\\sqrt{2}$ el choque tarda unas líneas más en llegar, pero el esqueleto es este.'
  });

  p.sub('Y el atajo: el contraejemplo');

  p.text('Para <strong>refutar</strong> una afirmación del tipo «para todo $x$…» no hace falta ningún ' +
    'método elaborado: basta con encontrar <strong>un solo caso</strong> que falle. Eso es lo que dice ' +
    'la negación de un cuantificador universal.');

  p.note('La asimetría es total y conviene tenerla siempre presente: <strong>demostrar</strong> un ' +
    '«para todo» exige un argumento general; <strong>refutarlo</strong> solo exige un ejemplo. Por eso ' +
    'lo primero que hay que hacer ante una conjetura es intentar romperla.', 'ok');

  /* ---------------------------------------------------------------- */
  p.util('La reducción al absurdo es cómo se depura un programa o se localiza una avería: <em>«supongamos ' +
    'que el fallo está en la red»</em>; si de ahí se sigue algo que no cuadra con lo que ves, el ' +
    'fallo no está en la red. Y la contrarrecíproca es el arte del que prueba: en lugar de comprobar ' +
    'que todo lo bueno pasa, busca que ningún caso malo se cuele, que es la misma afirmación mirada ' +
    'del revés.');

  p.section('El principio de inducción');

  p.text('¿Cómo se demuestra algo para <em>infinitos</em> casos? No comprobándolos uno a uno, ' +
    'evidentemente. La inducción da una forma de hacerlo en dos pasos.');

  p.formulas([
    '\\text{1. Caso base: } P(1) \\text{ es cierto}',
    '\\text{2. Paso inductivo: } P(k) \\Rightarrow P(k+1) \\text{ para todo } k',
    '\\Longrightarrow P(n) \\text{ es cierto para todo } n'
  ], 'principio de inducción');

  p.text('La imagen clásica es una fila infinita de fichas de dominó. El caso base dice que ' +
    '<em>la primera cae</em>. El paso inductivo dice que <em>si una cae, tira a la siguiente</em>. ' +
    'Con esas dos cosas, caen todas — y no hace falta empujarlas una por una.');

  p.demo({
    title: 'El dominó de la inducción',
    predice: 'Si quitas el caso base pero dejas el paso inductivo, ¿caerá alguna ficha? Y si rompes el paso en la ficha 5, ¿cuántas caen: ninguna, cinco o todas menos la quinta?',
    intro: 'Quita el caso base o rompe el paso inductivo y mira qué pasa. Hacen falta los dos: ninguno sobra.',
    build: function (host, d) {
      var base = true, paso = true, roto = 7;
      var t = 0, animando = false;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 15, ymin: -0.5, ymax: 4, height: 220,
        grid: false, axes: false,
        draw: function (g) {
          // Sin caso base no cae ninguna; con el paso roto, solo hasta esa ficha.
          function caida(i) {
            if (!base) return false;
            if (paso === 'roto') return i <= Math.min(t, roto);
            return i <= t;
          }
          for (var i = 0; i < 14; i++) {
            var ang = caida(i) ? Math.PI / 2.4 : 0;
            var alto = 1.6;
            var x = 0.6 + i * 1.05;
            g.seg(x, 0, x + Math.sin(ang) * alto, Math.cos(ang) * alto,
              { color: caida(i) ? 3 : 0, w: 9, alpha: caida(i) ? .6 : 1 });
            if (paso === 'roto' && i === roto + 1) {
              g.text(x, 2.6, 'aquí falla', { align: 'center', size: 11.5, color: 'bad' });
            }
          }
          g.seg(-0.4, 0, 15, 0, { color: 'axis', w: 2 });
          if (!base) g.text(0.6, 2.6, 'nadie empuja', { align: 'center', size: 11.5, color: 'bad' });
        }
      });
      function paint() {
        var txt;
        if (!base) txt = '<strong style="color:var(--bad)">Sin caso base</strong>: aunque cada ficha ' +
          'tire a la siguiente, si nadie empuja la primera <strong>no cae ninguna</strong>. ' +
          'El paso inductivo solo no demuestra nada.';
        else if (paso === 'roto') txt = '<strong style="color:var(--bad)">Paso inductivo roto en el ' +
          (roto + 1) + '.º</strong>: caen las primeras y ahí se para. Por eso el paso tiene que valer ' +
          'para <strong>todo</strong> $k$, no solo para unos cuantos.';
        else txt = '<strong style="color:var(--ok)">Con las dos condiciones caen todas</strong>, ' +
          'hasta el infinito, y solo hemos comprobado dos cosas.';
        out.set(txt);
        plot.render();
      }
      function animar() {
        if (animando) return;
        // Si el sistema pide menos movimiento, se enseña el resultado sin
        // la caída ficha a ficha: lo que importa es que caen todas.
        if (U.pocoMovimiento()) { t = 14; plot.render(); return; }
        animando = true; t = -1;
        var id = setInterval(function () {
          t++;
          plot.render();
          if (t > 14) { clearInterval(id); animando = false; }
        }, 130);
      }
      W.chips(host, [
        { label: 'todo correcto', value: 'ok' },
        { label: 'sin caso base', value: 'nobase' },
        { label: 'paso roto a mitad', value: 'roto' }
      ], {
        value: 'ok', on: function (v) {
          base = (v !== 'nobase');
          paso = (v === 'roto') ? 'roto' : true;
          t = 14; paint();
        }
      });
      W.buttons(host, [{ t: '▶ Tirar la primera', cls: 'btn--main', on: function () { animar(); } }]);
      t = 14;
      paint();
    }
  });

  p.note('La inducción no se queda en los números. Cualquier cosa definida con reglas que se nombran a sí ' +
    'mismas admite el mismo razonamiento, y de ahí salen demostraciones sobre objetos que no se pueden ' +
    'numerar. El caso más útil son los <strong>programas</strong>: en ' +
    '[[len-gramatica|el bloque de máquinas y lenguajes]] se define un lenguaje con diecisiete reglas, ' +
    'unas cuantas de ellas recursivas, y demostrar que todo programa se traduce bien es exactamente ' +
    'esto: comprobarlo en los casos base y suponerlo cierto en las partes al demostrarlo para el todo. ' +
    'Se llama <strong>inducción estructural</strong>, y es la inducción de siempre con los objetos ' +
    'ordenados por tamaño en vez de los naturales.', null, 'Inducción sin números');

  p.hist('La inducción se usaba de forma intuitiva desde antiguo, pero fue Blaise Pascal quien la formuló ' +
    'con claridad hacia 1654, estudiando su triángulo. Curiosamente, llegó a las matemáticas por una ' +
    'apuesta: un jugador profesional le preguntó cómo repartir el dinero de una partida ' +
    'interrumpida, y de esa correspondencia entre Pascal y Fermat nació también el cálculo de ' +
    'probabilidades. Dos ramas enteras de las matemáticas salieron de una pregunta de casino.');

  p.sub('Cómo se escribe una demostración por inducción');

  p.text('Vamos con el ejemplo canónico: la suma de los $n$ primeros naturales.');

  p.formula('1 + 2 + 3 + \\dots + n = \\frac{n(n+1)}{2}');

  p.ejemplo({
    title: 'La demostración, paso a paso',
    enunciado: 'Demostrar por inducción que $1 + 2 + \\dots + n = \\frac{n(n+1)}{2}$ para todo natural $n \\ge 1$.',
    pasos: [
      { t: '<strong>Caso base</strong> ($n = 1$): la suma vale $1$, y la fórmula da $\\frac{1\\cdot 2}{2} = 1$. ✓', antes: '¿Cuál es el primer valor de $n$ que hay que comprobar, y cuánto vale la suma ahí?' },
      { t: '<strong>Hipótesis de inducción</strong>: suponemos que la fórmula vale para un $k$ cualquiera, $1 + \\dots + k = \\frac{k(k+1)}{2}$.', antes: '¿Qué se supone cierto en el paso inductivo?' },
      { t: '<strong>Paso</strong>: queremos la suma hasta $k + 1$. Es la suma hasta $k$ más el término nuevo, así que sumamos $k + 1$ a los dos lados de la hipótesis: $1 + \\dots + k + (k + 1) = \\frac{k(k+1)}{2} + (k + 1)$.', antes: '¿Qué hay que añadir a la suma hasta $k$ para tener la suma hasta $k + 1$?' },
      { t: 'Operamos sacando factor común $(k + 1)$: $\\frac{k(k+1)}{2} + (k + 1) = (k + 1)\\left(\\frac{k}{2} + 1\\right) = \\frac{(k+1)(k+2)}{2}$.', antes: 'Los dos sumandos tienen algo en común. ¿Qué factor puedes sacar?' },
      { t: 'Y eso es exactamente la fórmula con $n = k + 1$, porque $\\frac{(k+1)((k+1)+1)}{2} = \\frac{(k+1)(k+2)}{2}$. ∎' }
    ],
    cierre: 'Fíjate en el paso 3: es el único sitio donde se <em>usa</em> la hipótesis. Sin ese uso, no hay inducción.'
  });

  p.note('El paso clave es <em>usar la hipótesis</em>. Si en tu demostración por inducción no has ' +
    'utilizado en ningún momento que la fórmula vale para $k$, seguramente algo está mal.', null,
    'Dónde se falla');

  p.comprueba('Alguien comprueba con el ordenador que una fórmula se cumple para $n = 1, 2, 3, \\dots, 1\\,000\\,000$. ¿Qué ha demostrado?', [
    { t: 'Que la fórmula es cierta para todo $n$', ok: false, por: 'Un millón de casos siguen siendo casos. El patrón $n^2 + n + 41$ aguantaba 40 y se rompía; otros aguantan miles de millones.' },
    { t: 'Solo que es cierta para esos valores', ok: true, por: 'Exacto. Para pasar de «muchos casos» a «todos» hace falta un argumento general, como el paso inductivo.' },
    { t: 'Que es cierta para todo $n$ menor que un millón, y por tanto en general', ok: false, por: 'La primera parte sí; la segunda no se sigue. Un contraejemplo puede estar en el millón uno.' }
  ]);

  p.sub('Inducción más allá de las sumas');

  p.text('La inducción no sirve solo para fórmulas de sumas. Funciona con cualquier afirmación que dependa ' +
    'de un número natural, y en 2.º de Bachillerato aparece sobre todo en dos sitios: al calcular ' +
    '<strong>potencias de una matriz</strong>, donde se adivina el patrón con $A^2$ y $A^3$ y se demuestra ' +
    'por inducción, y al probar <strong>desigualdades</strong>.');

  p.formula('A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix} \\ \\Rightarrow\\ A^n = \\begin{pmatrix} 1 & n \\\\ 0 & 1 \\end{pmatrix}',
    'una conjetura que se demuestra por inducción',
    'Caso base: para $n = 1$ es la propia $A$. ✓<br><br>Paso: si $A^k = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$, ' +
      'entonces $A^{k+1} = A^k\\cdot A = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix} = ' +
      '\\begin{pmatrix} 1 & k + 1 \\\\ 0 & 1 \\end{pmatrix}$, que es la fórmula con $n = k + 1$. ∎<br><br>' +
      'Lo verás aplicado en [[al-inversa]].');

  p.text('Con desigualdades, el paso inductivo tiene un truco: no se busca una igualdad sino encadenar ' +
    'estimaciones. Para probar que $2^n > n$: si $2^k > k$, entonces $2^{k+1} = 2\\cdot 2^k > 2k = k + k \\ge ' +
    'k + 1$. Cada desigualdad del camino tiene que ser cierta, y la última usa que $k \\ge 1$.');

  /* ================= EJERCICIOS ================= */
  p.util('La inducción es la recursión de los programadores puesta por escrito: un caso base y una regla ' +
    'que reduce el problema al anterior. Y es lo que permite fiarse de un programa que nadie puede ' +
    'probar entero: el metro automático de la línea 14 de París o el software de vuelo de Airbus no ' +
    'se validan probando todos los casos —son infinitos—, sino <strong>demostrando</strong> que la ' +
    'propiedad se conserva paso a paso. Un test encuentra errores; una demostración por inducción ' +
    'garantiza que no los hay.');

  p.trampas([
    { e: 'Dar por demostrado lo que solo se ha comprobado.', por: 'Cien casos que funcionan no son una demostración; un solo caso que falla sí es una refutación.' },
    { e: 'Olvidar el caso base.', por: 'Sin él, el paso inductivo es una cadena de fichas que nadie empuja: no cae ninguna.' },
    { e: 'No usar la hipótesis en el paso inductivo.', por: 'Si demuestras $P(k + 1)$ sin apoyarte en $P(k)$, o la fórmula era obvia o algo se ha colado.' },
    { e: 'Negar mal al empezar un absurdo.', por: 'Lo contrario de «para todo $x$ pasa $P$» es «existe un $x$ para el que no pasa $P$», no «para ningún $x$ pasa $P$».' }
  ]);

  p.section('Practica');

  p.exercise({
    title: 'Verifica una fórmula de inducción',
    level: 'basico',
    gen: function (r) {
      var tipo = r.int(0, 2);
      var n = r.int(3, 15);
      var suma, tex;
      if (tipo === 0) { suma = n * (n + 1) / 2; tex = '1+2+3+\\dots+n = \\dfrac{n(n+1)}{2}'; }
      else if (tipo === 1) { suma = n * n; tex = '1+3+5+\\dots+(2n-1) = n^2'; }
      else { suma = n * (n + 1) * (2 * n + 1) / 6; tex = '1^2+2^2+\\dots+n^2 = \\dfrac{n(n+1)(2n+1)}{6}'; }
      return { tipo: tipo, n: n, suma: suma, tex: tex };
    },
    ask: function (d) {
      var desc = ['la suma de los $' + d.n + '$ primeros números naturales',
        'la suma de los $' + d.n + '$ primeros números impares',
        'la suma de los cuadrados de los $' + d.n + '$ primeros naturales'][d.tipo];
      return 'Se demuestra por inducción que $' + d.tex + '$. Usa la fórmula para calcular ' + desc + '.';
    },
    fields: [{ name: 's', label: 'Suma', w: 'wide' }],
    sol: function (d) { return { s: d.suma }; },
    hint: function (d) { return 'Sustituye $n = ' + d.n + '$ en la fórmula. Es mucho más rápido que sumar término a término.'; },
    steps: function (d) {
      if (d.tipo === 0) return ['$\\dfrac{n(n+1)}{2} = \\dfrac{' + d.n + ' \\cdot ' + (d.n + 1) + '}{2} = ' + d.suma + '$',
        'Es la fórmula que descubrió Gauss con nueve años emparejando 1+100, 2+99…'];
      if (d.tipo === 1) return ['$n^2 = ' + d.n + '^2 = ' + d.suma + '$',
        'Resultado precioso: la suma de los primeros impares es siempre un cuadrado perfecto. ' +
        'Se ve dibujando cuadrados que crecen en forma de L.'];
      return ['$\\dfrac{n(n+1)(2n+1)}{6} = \\dfrac{' + d.n + ' \\cdot ' + (d.n + 1) + ' \\cdot ' + (2 * d.n + 1) + '}{6}$',
        '$= \\dfrac{' + (d.n * (d.n + 1) * (2 * d.n + 1)) + '}{6} = ' + d.suma + '$'];
    },
    answer: function (d) { return String(d.suma); }
  });

  p.exercise({
    title: 'Encuentra el contraejemplo',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Todo número primo es impar', f: function (n) { return !(ML.isPrime(n) && n % 2 === 0); }, res: 2, dom: 'número primo' },
        { t: 'Si $n$ es primo, entonces $2^n - 1$ también lo es', f: function (n) { return !(ML.isPrime(n) && !ML.isPrime(Math.pow(2, n) - 1)); }, res: 11, dom: 'número primo' },
        { t: 'Todo número impar mayor que 1 es primo', f: function (n) { return !(n % 2 === 1 && n > 1 && !ML.isPrime(n)); }, res: 9, dom: 'número natural' },
        { t: '$n^2 + n + 41$ es primo para todo natural $n$', f: function (n) { return ML.isPrime(n * n + n + 41); }, res: 40, dom: 'número natural' },
        { t: 'Para todo $n \\ge 1$, el número $n^2 + n + 1$ es primo', f: null, res: 4, dom: 'número natural mayor o igual que 1' }
      ];
      var c = r.pick(casos);
      return { t: c.t, res: c.res, dom: c.dom };
    },
    ask: function (d) {
      return 'La afirmación «<em>' + d.t + '</em>» es <strong>falsa</strong>. Escribe el ' +
        '<strong>menor</strong> ' + d.dom + ' que sirve de contraejemplo.';
    },
    fields: [{ name: 'n', label: 'Contraejemplo', w: 'tiny' }],
    sol: function (d) { return { n: d.res }; },
    hint: function () { return 'Ve probando valores pequeños uno a uno hasta que alguno rompa la afirmación. Un solo caso basta.'; },
    steps: function (d) {
      return ['Para refutar un «para todo» basta con <strong>un</strong> caso que falle.',
        'Probando valores pequeños, el primero que rompe la afirmación es $' + d.res + '$.',
        'Con ese único contraejemplo, la afirmación queda descartada definitivamente.',
        'Fíjate en que no hace falta explicar <em>por qué</em> falla en general: basta con exhibir el caso.'];
    },
    answer: function (d) { return String(d.res); }
  });

  p.exercise({
    title: 'El paso inductivo',
    level: 'medio',
    gen: function (r) {
      var k = r.int(2, 12);
      var tipo = r.int(0, 1);
      // partiendo de la hipotesis para k, ¿cuanto vale el miembro derecho para k+1?
      var val = tipo === 0 ? (k + 1) * (k + 2) / 2 : (k + 1) * (k + 1);
      return { k: k, tipo: tipo, val: val };
    },
    ask: function (d) {
      var f = d.tipo === 0 ? '\\dfrac{n(n+1)}{2}' : 'n^2';
      var s = d.tipo === 0 ? '1+2+\\dots+n' : '1+3+\\dots+(2n-1)';
      return 'Estamos demostrando por inducción que $' + s + ' = ' + f + '$. Suponemos cierto el caso ' +
        '$n = ' + d.k + '$ y queremos probarlo para $n = ' + (d.k + 1) + '$. ' +
        '¿Qué valor debe alcanzar la suma en ese paso?';
    },
    fields: [{ name: 'v', label: 'Valor', w: 'wide' }],
    sol: function (d) { return { v: d.val }; },
    hint: function (d) { return 'Sustituye $n = ' + (d.k + 1) + '$ en el miembro de la derecha de la fórmula.'; },
    steps: function (d) {
      var hip = d.tipo === 0 ? d.k * (d.k + 1) / 2 : d.k * d.k;
      var nuevo = d.tipo === 0 ? (d.k + 1) : (2 * (d.k + 1) - 1);
      return ['Hipótesis de inducción: para $n = ' + d.k + '$ la suma vale $' + hip + '$.',
        'Al pasar a $n = ' + (d.k + 1) + '$ se añade el término $' + nuevo + '$.',
        '$' + hip + ' + ' + nuevo + ' = ' + d.val + '$',
        'Y la fórmula con $n = ' + (d.k + 1) + '$ da también $' + d.val + '$ ✓',
        'Ahí está el paso inductivo: partiendo de que vale para $k$, hemos <em>deducido</em> que vale para $k+1$.'];
    },
    answer: function (d) { return String(d.val); }
  });

  p.exercise({
    title: 'Ordena la demostración',
    level: 'medio',
    gen: function (r) {
      var casos = [
        {
          enun: 'Demostrar por inducción que $1 + 3 + 5 + \\dots + (2n - 1) = n^2$.',
          pasos: ['Caso base: para $n = 1$ la suma vale $1 = 1^2$.', 'Hipótesis: se supone que $1 + 3 + \\dots + (2k - 1) = k^2$.',
            'Paso: se suma $2k + 1$ a los dos lados y queda $k^2 + 2k + 1$.', 'Se reconoce $(k + 1)^2$, que es la fórmula para $n = k + 1$. ∎']
        },
        {
          enun: 'Demostrar por inducción que $2^n > n$ para todo natural $n \\ge 1$.',
          pasos: ['Caso base: $2^1 = 2 > 1$.', 'Hipótesis: se supone que $2^k > k$.',
            'Paso: $2^{k+1} = 2\\cdot 2^k > 2k$, usando la hipótesis.', 'Como $k \\ge 1$, $2k = k + k \\ge k + 1$, así que $2^{k+1} > k + 1$. ∎']
        },
        {
          enun: 'Demostrar por inducción que $A^n = \\begin{pmatrix} 1 & n \\\\ 0 & 1 \\end{pmatrix}$ para $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$.',
          pasos: ['Caso base: $A^1 = A$, que coincide con la fórmula para $n = 1$.', 'Hipótesis: se supone que $A^k = \\begin{pmatrix} 1 & k \\\\ 0 & 1 \\end{pmatrix}$.',
            'Paso: se calcula $A^{k+1} = A^k\\cdot A$ usando la hipótesis.', 'El producto da $\\begin{pmatrix} 1 & k + 1 \\\\ 0 & 1 \\end{pmatrix}$, la fórmula para $n = k + 1$. ∎']
        }
      ];
      var c = r.pick(casos), letras = ['A', 'B', 'C', 'D'];
      var orden = r.shuffle([0, 1, 2, 3]);               // orden[i]: paso que aparece con la letra i
      var bien = [0, 1, 2, 3].map(function (paso) { return letras[orden.indexOf(paso)]; }).join('');
      var opciones = [bien], guard = 0;
      while (opciones.length < 4 && guard++ < 60) {
        var otra = r.shuffle(letras).join('');
        if (opciones.indexOf(otra) < 0) opciones.push(otra);
      }
      return { c: c, letras: letras, orden: orden, bien: bien, opciones: r.shuffle(opciones) };
    },
    ask: function (d) {
      return d.c.enun + ' Estos son los pasos, desordenados:<br>' + d.orden.map(function (paso, i) {
        return '<strong>' + d.letras[i] + '.</strong> ' + d.c.pasos[paso];
      }).join('<br>') + '<br>¿En qué orden van?';
    },
    fields: function (d) { return [{ name: 'o', label: 'Orden', opts: d.opciones.map(function (o) { return { t: o.split('').join(' → '), v: o }; }) }]; },
    sol: function (d) { return { o: d.bien }; },
    hint: function () { return ['Una demostración por inducción empieza siempre por el caso base.', 'Después viene la hipótesis, y el paso la usa para llegar al caso siguiente.']; },
    steps: function (d) { return ['Orden correcto: ' + d.bien.split('').join(' → ') + '.', 'Caso base, hipótesis de inducción, uso de la hipótesis y conclusión para $k + 1$.']; },
    answer: function (d) { return d.bien.split('').join(' → '); }
  });

  p.exercise({
    title: '¿Qué método conviene?',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: 'Demostrar que $\\sqrt{3}$ es irracional', m: 3, por: 'no se puede construir la irracionalidad de frente: se supone que sí es fracción y se busca la contradicción' },
        { t: 'Demostrar que $1+2+\\dots+n = \\frac{n(n+1)}{2}$ para todo $n$', m: 4, por: 'es una afirmación sobre todos los naturales encadenados: inducción' },
        { t: 'Demostrar que si $n$ es par, $n^2$ también lo es', m: 1, por: 'de la hipótesis se llega directo a la conclusión escribiendo $n = 2k$' },
        { t: 'Demostrar que si $n^2$ es impar, $n$ es impar', m: 2, por: 'de frente es incómodo, pero el contrarrecíproco («si $n$ es par, $n^2$ es par») sale en una línea' },
        { t: 'Refutar que «todo número impar es primo»', m: 5, por: 'basta con exhibir el 9' },
        { t: 'Demostrar que hay infinitos números primos', m: 3, por: 'se supone que son finitos y se construye uno nuevo: contradicción' },
        { t: 'Demostrar que $2^n > n$ para todo natural $n$', m: 4, por: 'afirmación para todos los naturales, con el caso $n+1$ apoyado en el $n$' },
        { t: 'Refutar que «$n^2+n+41$ siempre es primo»', m: 5, por: 'con $n = 40$ se rompe' }
      ];
      var c = r.pick(casos);
      return { t: c.t, m: c.m, por: c.por };
    },
    ask: function (d) { return '<em>' + d.t + '</em><br>¿Qué método es el más adecuado?'; },
    fields: [{ name: 'm', label: 'Método', opts: [{ t: 'demostración directa', v: '1' }, { t: 'contrarrecíproco', v: '2' }, { t: 'reducción al absurdo', v: '3' }, { t: 'inducción', v: '4' }, { t: 'contraejemplo', v: '5' }] }],
    sol: function (d) { return { m: String(d.m) }; },
    hint: function () { return 'Si hay que <em>refutar</em>, contraejemplo. Si es «para todo n natural», inducción. Si la negación da más juego que la hipótesis, absurdo o contrarrecíproco.'; },
    steps: function (d) {
      return ['Primero: ¿hay que demostrar o refutar? Refutar un «para todo» se hace con un contraejemplo.',
        'Si es una afirmación encadenada sobre los naturales, casi siempre es inducción.',
        'Si la hipótesis directa no da juego, se prueba con el contrarrecíproco o con el absurdo.',
        'Aquí: ' + d.por + '.',
        'Método: <strong>' + ['', 'demostración directa', 'contrarrecíproco', 'reducción al absurdo',
          'inducción', 'contraejemplo'][d.m] + '</strong>.'];
    },
    answer: function (d) {
      return ['', 'Demostración directa', 'Contrarrecíproco', 'Reducción al absurdo', 'Inducción', 'Contraejemplo'][d.m];
    }
  });

  p.keys([
    'La inducción demuestra también desigualdades y patrones de potencias de matrices, no solo sumas.',
    'Comprobar casos <strong>no es</strong> demostrar: un patrón puede aguantar 40 veces y romperse a la 41.ª.',
    'Directa: de $p$ a $q$. Contrarrecíproco: de $\\neg q$ a $\\neg p$, y equivale.',
    'Absurdo: se supone lo contrario y se busca una contradicción.',
    'Para refutar un «para todo» basta un <strong>contraejemplo</strong>.',
    'Inducción = caso base + paso inductivo. Faltando cualquiera de los dos, no se demuestra nada.',
    'En el paso inductivo hay que <em>usar</em> la hipótesis; si no la usas, sospecha.'
  ]);
});
