/* Tema: El infinito: cardinalidad y Cantor */
Course.topic('av-infinito', function (p) {

  p.text('¿Hay más números naturales o más números pares? La respuesta intuitiva —«naturales, ' +
    'evidentemente, porque los pares son la mitad»— es <strong>falsa</strong>. Y demostrarlo obliga a ' +
    'repensar qué significa «más».');

  p.section('Contar sin contar');

  p.text('Un pastor que no sepa contar puede saber si le falta alguna oveja: guarda una piedra por ' +
    'cada oveja y las empareja al volver. No necesita números, solo una <strong>biyección</strong>.');

  p.note('Dos conjuntos tienen el <strong>mismo cardinal</strong> si existe una biyección entre ellos. ' +
    'Esa es la definición, y es la única que funciona también para conjuntos infinitos. Cantor la tomó ' +
    'en serio y las consecuencias fueron demoledoras.', 'ok', 'La definición de Cantor');

  p.demo({
    title: 'Emparejar infinitos',
    intro: 'Cada emparejamiento es una biyección entre ℕ y un conjunto aparentemente más pequeño (o más grande). Si existe la biyección, tienen el mismo cardinal.',
    build: function (host, d) {
      var cual = 'pares';
      var casos = {
        pares: { f: function (n) { return 2 * n; }, t: 'n \\mapsto 2n', n: 'Los <strong>pares</strong> parecen la mitad, y sin embargo hay exactamente los mismos: a cada natural le corresponde un par y viceversa.' },
        cuadrados: { f: function (n) { return n * n; }, t: 'n \\mapsto n^2', n: 'Los <strong>cuadrados perfectos</strong> son cada vez más escasos, y aun así hay tantos como naturales. Galileo ya se topó con esto en 1638 y lo dejó por imposible.' },
        enteros: { f: function (n) { return n % 2 === 0 ? n / 2 : -(n + 1) / 2; }, t: 'zigzag entre positivos y negativos', n: 'Los <strong>enteros</strong> parecen el doble (hay negativos), pero yendo en zigzag se recorren todos: mismo cardinal.' },
        potencias: { f: function (n) { return Math.pow(2, n); }, t: 'n \\mapsto 2^n', n: 'Las <strong>potencias de 2</strong> son rarísimas entre los naturales y hay exactamente las mismas.' }
      };
      var caja = U.el('div', { style: { fontFamily: 'var(--mono)', fontSize: '13.5px', lineHeight: '2', margin: '8px 0' } });
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        var F = casos[cual];
        var h = '';
        for (var n = 0; n <= 9; n++) {
          h += '<div style="display:inline-block;margin:2px 6px;padding:3px 9px;border-radius:7px;' +
            'background:var(--panel-2);border:1px solid var(--line-soft)">' +
            '<span style="color:var(--c1)">' + n + '</span>' +
            '<span style="color:var(--ink-faint)"> → </span>' +
            '<span style="color:var(--c3);font-weight:600">' + F.f(n) + '</span></div>';
        }
        caja.innerHTML = h + '<div style="color:var(--ink-faint);margin-top:4px">…y así infinitamente, sin dejarse ninguno ni repetir.</div>';
        out.set('$' + F.t + '$<br>' + F.n);
      }
      W.chips(host, [
        { label: 'números pares', value: 'pares' }, { label: 'cuadrados perfectos', value: 'cuadrados' },
        { label: 'enteros', value: 'enteros' }, { label: 'potencias de 2', value: 'potencias' }
      ], { value: 'pares', on: function (v) { cual = v; pinta(); } });
      pinta();
    }
  });

  p.text('Un conjunto que se puede emparejar con $\\mathbb{N}$ se llama <strong>numerable</strong>, y ' +
    'su cardinal se escribe $\\aleph_0$ («alef sub cero»). Todos los casos de arriba son numerables.');

  p.note('Y eso da la definición formal de infinito, debida a Dedekind: un conjunto es infinito si se ' +
    'puede poner en biyección con una <strong>parte propia de sí mismo</strong>. Con los conjuntos ' +
    'finitos eso es imposible; con los infinitos es la norma. El infinito no es «un número muy grande»: ' +
    'es una cosa cualitativamente distinta.', null, 'Qué es ser infinito');

  /* ---------------------------------------------------------------- */
  p.section('El hotel de Hilbert');

  p.text('Un hotel con infinitas habitaciones, todas ocupadas. Llega un huésped nuevo. ¿Hay sitio?');

  p.list([
    '<strong>Un huésped más</strong>: que cada uno se mueva a la habitación siguiente. La 1 queda libre. ✓',
    '<strong>Infinitos huéspedes más</strong>: que cada uno pase de la $n$ a la $2n$. Quedan libres todas las impares, que son infinitas. ✓',
    '<strong>Infinitos autobuses con infinitos pasajeros cada uno</strong>: también cabe, numerando en diagonal. ✓'
  ]);

  p.text('En un hotel infinito, «completo» no significa «no cabe nadie más». Es un buen aviso de que la ' +
    'intuición sobre lo finito no se puede trasladar sin más.');

  /* ---------------------------------------------------------------- */
  p.section('Los racionales también son numerables');

  p.text('Entre dos racionales cualesquiera hay infinitos racionales más. Parece imposible ordenarlos ' +
    'en una lista. Y sin embargo Cantor lo consiguió recorriéndolos <strong>en diagonal</strong>.');

  p.demo({
    title: 'Recorrer las fracciones en diagonal',
    intro: 'Colocamos todas las fracciones en una tabla infinita y las recorremos por diagonales, saltando las repetidas. Así se numeran todas.',
    build: function (host, d) {
      var pasos = 10;
      var caja = U.el('div');
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        var orden = {};
        var cont = 0, vistos = {};
        // recorrido por diagonales
        for (var s = 2; s <= 12 && cont < pasos; s++) {
          for (var num = 1; num < s && cont < pasos; num++) {
            var den = s - num;
            var f = ML.F(num, den);
            var clave = f.n + '/' + f.d;
            if (vistos[clave]) continue;
            vistos[clave] = true;
            orden[num + ',' + den] = ++cont;
          }
        }
        var h = '<div class="tbl-wrap"><table class="tbl"><tbody>';
        for (var i = 1; i <= 6; i++) {
          h += '<tr>';
          for (var j = 1; j <= 6; j++) {
            var o = orden[i + ',' + j];
            h += '<td class="num" style="font-family:var(--mono);' +
              (o ? 'background:var(--accent-soft);color:var(--accent-ink);font-weight:600' : '') + '">' +
              i + '/' + j + (o ? '<sub style="color:var(--ok)"> ' + o + '</sub>' : '') + '</td>';
          }
          h += '</tr>';
        }
        h += '</tbody></table></div>';
        caja.innerHTML = h;
        out.set('Numeradas <strong>' + Math.min(cont, pasos) + '</strong> fracciones.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Recorriendo por diagonales (donde ' +
          'numerador + denominador es constante) y saltando las equivalentes, <strong>toda</strong> ' +
          'fracción acaba recibiendo un número. Por tanto $|\\mathbb{Q}| = |\\mathbb{N}| = \\aleph_0$: ' +
          'hay tantos racionales como naturales.</span>');
      }
      W.slider(W.row(host), { label: 'fracciones numeradas', min: 1, max: 30, step: 1, value: 10, dec: 0, on: function (v) { pasos = v; pinta(); } });
      pinta();
    }
  });

  /* ---------------------------------------------------------------- */
  p.section('La diagonal de Cantor');

  p.text('Con los racionales pudo. ¿Y con los reales? Aquí Cantor demostró que <strong>no</strong>, y ' +
    'con un argumento que es de los más bellos que existen.');

  p.list([
    'Supongamos que se pudiera hacer una lista con <em>todos</em> los reales entre 0 y 1.',
    'Escribimos la lista: $x_1, x_2, x_3, \\dots$, cada uno con sus infinitos decimales.',
    'Construimos un número nuevo así: su primera cifra decimal distinta de la primera cifra de $x_1$; su segunda, distinta de la segunda de $x_2$; y así siempre.',
    'Ese número está entre 0 y 1, pero <strong>no puede estar en la lista</strong>: se diferencia de $x_n$ en la cifra $n$-ésima, para todo $n$.',
    'Contradicción: la lista no era completa. Y no hay forma de arreglarla, porque el argumento vale para <em>cualquier</em> lista.'
  ], true);

  p.demo({
    title: 'Construir el número que falta',
    intro: 'Una lista cualquiera de reales. El número diagonal se fabrica cambiando la cifra marcada de cada fila, y por construcción no coincide con ninguno.',
    build: function (host, d) {
      var semilla = 1;
      var caja = U.el('div', { style: { fontFamily: 'var(--mono)', fontSize: '14px', lineHeight: '1.9', margin: '8px 0' } });
      host.appendChild(caja);
      var out = W.readout(host, '');
      function pinta() {
        var r = U.rng(semilla);
        var filas = [], diag = '';
        for (var i = 0; i < 8; i++) {
          var cifras = [];
          for (var j = 0; j < 8; j++) cifras.push(r.int(0, 9));
          filas.push(cifras);
          var c = cifras[i];
          diag += (c === 5 ? 3 : 5);   // regla: si es 5 pon 3, si no pon 5
        }
        var h = '';
        filas.forEach(function (cifras, i) {
          h += '<div><span style="color:var(--ink-faint)">x<sub>' + (i + 1) + '</sub> = 0,</span>';
          cifras.forEach(function (c, j) {
            h += '<span style="' + (i === j
              ? 'background:var(--bad-soft);color:var(--bad);font-weight:700;padding:0 3px;border-radius:4px'
              : '') + '">' + c + '</span>';
          });
          h += '…</div>';
        });
        h += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--line)">' +
          '<span style="color:var(--ok);font-weight:700">d &nbsp;= 0,' + diag + '…</span>' +
          ' <span style="font-family:var(--sans);font-size:0.7812rem;color:var(--ink-faint)">← el número que no está en la lista</span></div>';
        caja.innerHTML = h;
        out.set('La regla usada es: <em>si la cifra marcada es un 5, pongo un 3; si no, pongo un 5</em>.<br>' +
          'El número $d$ se diferencia de $x_1$ en la primera cifra, de $x_2$ en la segunda, de $x_3$ en ' +
          'la tercera… <strong>de $x_n$ en la $n$-ésima, para todo $n$</strong>.<br>' +
          '<span style="font-size:0.7812rem;color:var(--ink-faint)">Por tanto $d$ no puede ser ninguno de ' +
          'la lista. Y como la lista era arbitraria, <strong>ninguna lista puede contener todos los ' +
          'reales</strong>: $\\mathbb{R}$ no es numerable.</span>');
      }
      W.buttons(host, [{ t: '↻ Otra lista cualquiera', cls: 'btn--main', on: function () { semilla = Math.floor(Math.random() * 1e6); pinta(); } }]);
      pinta();
    }
  });

  p.formula('|\\mathbb{N}| = |\\mathbb{Z}| = |\\mathbb{Q}| = \\aleph_0 \\ < \\ |\\mathbb{R}| = 2^{\\aleph_0}',
    'hay al menos dos infinitos distintos');

  p.note('Y no se para ahí. Cantor demostró que el conjunto de las partes de un conjunto es siempre ' +
    '<strong>estrictamente mayor</strong> que él: $|P(A)| > |A|$. Aplicándolo una y otra vez se obtiene ' +
    'una torre infinita de infinitos, cada uno mayor que el anterior. No hay un «infinito más grande».',
    'ok', 'Infinitos infinitos');

  p.util('El argumento diagonal parece un juego y resultó ser una herramienta demoledora. Con él demostró ' +
    'Turing en 1936 que hay problemas que ningún ordenador podrá resolver jamás —no por falta de ' +
    'potencia, sino por imposibilidad lógica—, entre ellos decidir si un programa cualquiera acabará ' +
    'o se quedará colgado. Cada vez que un antivirus admite que no puede garantizar que un archivo ' +
    'sea inofensivo, detrás está este razonamiento.');

  p.note('Ese mismo argumento, aplicado a los programas en lugar de a los números, demuestra que hay ' +
    'problemas que ningún ordenador puede resolver. Es el contenido del tema siguiente, ' +
    '[[av-computabilidad|<strong>Computabilidad: Turing y Gödel</strong>]], y no necesita ninguna idea nueva: solo la ' +
    'diagonal que acabas de ver, aplicada a un objeto distinto.',
    null, 'La diagonal vuelve enseguida');

  p.section('La hipótesis del continuo');

  p.text('Cantor se preguntó lo obvio: ¿hay algún infinito <em>entre</em> $\\aleph_0$ y $|\\mathbb{R}|$? ' +
    'Conjeturó que no, y pasó años intentando demostrarlo sin conseguirlo. La respuesta llegó en dos ' +
    'mitades, y es de lo más extraño que ha producido la matemática:');

  p.list([
    'Gödel (1940): <strong>no se puede demostrar que sea falsa</strong> con los axiomas habituales.',
    'Cohen (1963): <strong>tampoco se puede demostrar que sea verdadera</strong>.'
  ]);

  p.text('Es decir: la hipótesis del continuo es <strong>indecidible</strong>. Se puede añadir como ' +
    'axioma, o añadir su negación, y en los dos casos sale una matemática coherente. No es que no ' +
    'sepamos la respuesta: es que la pregunta no tiene respuesta dentro del sistema.');

  p.hist('A Cantor le costó caro. Kronecker, que había sido su maestro, le hizo la vida imposible y ' +
    'bloqueó su carrera; llamó a su trabajo «charlatanería» y a él «corruptor de la juventud». Cantor ' +
    'sufrió depresiones graves y murió en 1918 en un sanatorio. Hilbert lo defendió con una frase que ' +
    'se hizo famosa: «Nadie podrá expulsarnos del paraíso que Cantor ha creado para nosotros».');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Numerable o no?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { s: 'los números pares', t: 1, por: 'la biyección $n \\mapsto 2n$ los recorre todos' },
        { s: 'los números enteros $\\mathbb{Z}$', t: 1, por: 'se recorren en zigzag: 0, 1, −1, 2, −2…' },
        { s: 'los números racionales $\\mathbb{Q}$', t: 1, por: 'el recorrido en diagonal de Cantor los numera todos' },
        { s: 'los números reales $\\mathbb{R}$', t: 2, por: 'el argumento diagonal demuestra que ninguna lista los agota' },
        { s: 'los números primos', t: 1, por: 'son infinitos y se pueden listar en orden creciente' },
        { s: 'los reales del intervalo $(0,1)$', t: 2, por: 'tiene el mismo cardinal que todo $\\mathbb{R}$, y no es numerable' },
        { s: 'los puntos del plano con las dos coordenadas enteras', t: 1, por: 'se recorren en espiral desde el origen' },
        { s: 'los subconjuntos de $\\mathbb{N}$', t: 2, por: 'su cardinal es $2^{\\aleph_0}$, estrictamente mayor' }
      ];
      var c = r.pick(casos);
      return { s: c.s, t: c.t, por: c.por };
    },
    ask: function (d) {
      return '¿Es numerable el conjunto de <strong>' + d.s + '</strong>?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Escribe <code>si</code> o <code>no</code>.</span>';
    },
    fields: [{ name: 'r', label: 'Respuesta', w: 'tiny', ph: 'si / no' }],
    sol: function (d) { return { r: d.t === 1 ? 'si' : 'no' }; },
    check: function (v, d) {
      var t = v.raw.r.trim().toLowerCase().replace(/[íÍ]/g, 'i');
      if (t !== 'si' && t !== 'no') return { ok: false, msg: 'Escribe <code>si</code> o <code>no</code>.' };
      return (t === 'si') === (d.t === 1);
    },
    hint: function () { return 'Numerable significa que se puede poner en una lista infinita sin dejarse ninguno. Los que salen de $\\mathbb{R}$ o de conjuntos de partes no lo son.'; },
    steps: function (d) {
      return ['Un conjunto es numerable si existe una biyección con $\\mathbb{N}$, es decir, si se puede listar.',
        'Los subconjuntos infinitos de $\\mathbb{N}$, $\\mathbb{Z}$, $\\mathbb{Q}$ y los pares ordenados de enteros lo son.',
        '$\\mathbb{R}$, sus intervalos y los conjuntos de partes <strong>no</strong> lo son.',
        'Aquí: ' + d.por + '.',
        '<strong>' + (d.t === 1 ? 'Sí es numerable.' : 'No es numerable.') + '</strong>'];
    },
    answer: function (d) { return (d.t === 1 ? 'Sí' : 'No') + ': ' + d.por + '.'; }
  });

  p.exercise({
    title: 'El hotel de Hilbert',
    level: 'medio',
    gen: function (r) {
      var k = r.int(1, 8);
      return { k: k };
    },
    ask: function (d) {
      return 'El hotel de Hilbert está completo (infinitas habitaciones, todas ocupadas) y llegan $' +
        d.k + '$ huéspedes nuevos. Si cada huésped actual se muda de la habitación $n$ a la $n + ' +
        d.k + '$, ¿en qué habitación acaba el que estaba en la número 1?';
    },
    fields: [{ name: 'h', label: 'Habitación', w: 'tiny' }],
    sol: function (d) { return { h: 1 + d.k }; },
    hint: function (d) { return 'Simplemente hay que sumar ' + d.k + ' al número de habitación.'; },
    steps: function (d) {
      return ['Cada huésped pasa de la habitación $n$ a la $n + ' + d.k + '$.',
        'El de la 1 pasa a la $1 + ' + d.k + ' = ' + (1 + d.k) + '$.',
        'Así quedan libres las habitaciones de la 1 a la ' + d.k + ': exactamente ' + d.k + ' huecos.',
        'Nadie se queda sin habitación, porque para cada $n$ existe $n+' + d.k + '$. En un hotel infinito, ' +
        '«completo» no impide meter más gente.'];
    },
    answer: function (d) { return 'La habitación ' + (1 + d.k); }
  });

  p.exercise({
    title: 'La cifra diagonal',
    level: 'medio',
    gen: function (r) {
      var n = r.int(1, 6);
      var cifras = [];
      for (var i = 0; i < 8; i++) cifras.push(r.int(0, 9));
      // Con cifras al azar, la de la diagonal casi nunca era un 5 y la
      // respuesta salia 5 el 90% de las veces. Se fuerza el empate.
      if (r.bool(0.5)) cifras[n - 1] = 5;
      var c = cifras[n - 1];
      return { n: n, cifras: cifras, c: c, res: c === 5 ? 3 : 5 };
    },
    ask: function (d) {
      return 'En el argumento diagonal, la fila $x_{' + d.n + '}$ de la lista es<br>' +
        '$0{,}' + d.cifras.join('') + '\\dots$<br>' +
        'La regla es: <em>si la cifra en la posición diagonal es un 5, se escribe un 3; si no, un 5</em>. ' +
        '¿Qué cifra ocupará la posición $' + d.n + '$ del número diagonal?';
    },
    fields: [{ name: 'c', label: 'Cifra', w: 'tiny' }],
    sol: function (d) { return { c: d.res }; },
    hint: function (d) { return 'La posición diagonal de la fila ' + d.n + ' es su cifra ' + d.n + '-ésima, que aquí vale ' + d.c + '.'; },
    steps: function (d) {
      return ['La fila $' + d.n + '$ aporta su cifra $' + d.n + '$-ésima, que es un <strong>' + d.c + '</strong>.',
        'Aplicamos la regla: ' + (d.c === 5 ? 'es un 5, así que escribimos un 3.' : 'no es un 5, así que escribimos un 5.'),
        'El número diagonal lleva un <strong>' + d.res + '</strong> en la posición $' + d.n + '$.',
        'Y con eso ya se garantiza que ese número <em>no</em> es $x_{' + d.n + '}$, porque difieren justo ahí.'];
    },
    answer: function (d) { return String(d.res); }
  });

  p.exercise({
    title: 'Cardinal del conjunto de partes',
    level: 'avanzado',
    gen: function (r) {
      var n = r.int(3, 12);
      return { n: n, res: Math.pow(2, n) };
    },
    ask: function (d) {
      return 'Cantor demostró que $|P(A)| = 2^{|A|}$ y que siempre $|P(A)| > |A|$. Si $A$ tiene $' +
        d.n + '$ elementos, ¿cuántos subconjuntos tiene?';
    },
    fields: [{ name: 'p', label: 'Subconjuntos', w: 'wide' }],
    sol: function (d) { return { p: d.res }; },
    hint: function () { return 'Para cada elemento hay dos opciones: pertenece al subconjunto o no.'; },
    steps: function (d) {
      return ['Cada subconjunto se determina decidiendo, elemento a elemento, si entra o no: 2 opciones cada uno.',
        '$2^{' + d.n + '} = ' + U.miles(d.res) + '$ subconjuntos.',
        'Aplicando esto a un conjunto <strong>infinito</strong> numerable sale $2^{\\aleph_0}$, que es ' +
        'exactamente el cardinal de $\\mathbb{R}$.',
        'Y como el teorema garantiza $|P(A)| > |A|$ <em>siempre</em>, repitiendo el proceso se obtiene ' +
        'una sucesión infinita de infinitos cada vez mayores.'];
    },
    answer: function (d) { return U.miles(d.res).replace(/\\,/g, ' ') + ' subconjuntos'; }
  });

  p.keys([
    'Dos conjuntos tienen el mismo cardinal si existe una <strong>biyección</strong> entre ellos.',
    'Un conjunto es infinito si se puede emparejar con una parte propia de sí mismo.',
    '$\\mathbb{N}$, $\\mathbb{Z}$ y $\\mathbb{Q}$ tienen el mismo cardinal: son <strong>numerables</strong>, $\\aleph_0$.',
    'El argumento diagonal demuestra que $\\mathbb{R}$ <strong>no</strong> lo es: hay más de un infinito.',
    '$|P(A)| > |A|$ siempre: hay una torre infinita de infinitos, sin un máximo.',
    'La hipótesis del continuo es <strong>indecidible</strong>: ni demostrable ni refutable con los axiomas habituales.'
  ]);
});
