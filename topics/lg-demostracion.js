/* Tema: Métodos de demostración e inducción */
Course.topic('lg-demostracion', function (p) {

  p.text('Esto es lo que separa a las matemáticas de todas las demás ciencias. Un físico comprueba una ' +
    'ley en un millón de experimentos y la da por buena hasta que aparezca algo mejor. Un matemático ' +
    'no: o lo <strong>demuestra</strong>, y entonces es cierto para siempre y sin excepciones, o no lo ' +
    'sabe.');

  p.note('<strong>Comprobar casos no demuestra nada.</strong> Por muchos ejemplos que funcionen, ' +
    'siempre puede haber uno más adelante que no. Y ocurre de verdad, como vas a ver ahora mismo.',
    'warn', 'La idea central del tema');

  p.demo({
    title: 'Un patrón que aguanta 40 casos y luego se rompe',
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
          '<br><span style="font-size:12.5px;color:var(--ink-faint)">' +
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
    'si n es par, n² es par');

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

  p.text('Es el método con el que se demostró que $\\sqrt{2}$ es irracional y que los primos son ' +
    'infinitos. Los dos argumentos ya los has visto en el bloque de aritmética; ahora sabes cómo se llaman.');

  p.sub('Y el atajo: el contraejemplo');

  p.text('Para <strong>refutar</strong> una afirmación del tipo «para todo $x$…» no hace falta ningún ' +
    'método elaborado: basta con encontrar <strong>un solo caso</strong> que falle. Eso es lo que dice ' +
    'la negación de un cuantificador universal.');

  p.note('La asimetría es total y conviene tenerla siempre presente: <strong>demostrar</strong> un ' +
    '«para todo» exige un argumento general; <strong>refutarlo</strong> solo exige un ejemplo. Por eso ' +
    'lo primero que hay que hacer ante una conjetura es intentar romperla.', 'ok');

  /* ---------------------------------------------------------------- */
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

  p.sub('Cómo se escribe una demostración por inducción');

  p.text('Vamos con el ejemplo canónico: la suma de los $n$ primeros naturales.');

  p.formula('1 + 2 + 3 + \\dots + n = \\frac{n(n+1)}{2}');

  p.list([
    '<strong>Caso base</strong> ($n=1$): la suma vale $1$, y la fórmula da $\\frac{1\\cdot2}{2}=1$. ✓',
    '<strong>Hipótesis de inducción</strong>: suponemos cierto que $1+\\dots+k = \\frac{k(k+1)}{2}$.',
    '<strong>Paso</strong>: hay que probarlo para $k+1$. Sumamos $k+1$ a los dos lados de la hipótesis:',
    '$1+\\dots+k+(k+1) = \\frac{k(k+1)}{2} + (k+1) = (k+1)\\left(\\frac{k}{2}+1\\right) = \\frac{(k+1)(k+2)}{2}$',
    'Y eso es exactamente la fórmula con $n = k+1$. ∎'
  ], true);

  p.note('El paso clave es <em>usar la hipótesis</em>. Si en tu demostración por inducción no has ' +
    'utilizado en ningún momento que la fórmula vale para $k$, seguramente algo está mal.', null,
    'Dónde se falla');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

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
    ask: function (d) {
      return '<em>' + d.t + '</em><br>¿Qué método es el más adecuado?<br>' +
        '<span style="font-size:14px;color:var(--ink-faint)"><code>1</code> demostración directa · ' +
        '<code>2</code> contrarrecíproco · <code>3</code> reducción al absurdo · ' +
        '<code>4</code> inducción · <code>5</code> contraejemplo</span>';
    },
    fields: [{ name: 'm', label: 'Método', w: 'tiny' }],
    sol: function (d) { return { m: d.m }; },
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
    'Comprobar casos <strong>no es</strong> demostrar: un patrón puede aguantar 40 veces y romperse a la 41.ª.',
    'Directa: de $p$ a $q$. Contrarrecíproco: de $\\neg q$ a $\\neg p$, y equivale.',
    'Absurdo: se supone lo contrario y se busca una contradicción.',
    'Para refutar un «para todo» basta un <strong>contraejemplo</strong>.',
    'Inducción = caso base + paso inductivo. Faltando cualquiera de los dos, no se demuestra nada.',
    'En el paso inductivo hay que <em>usar</em> la hipótesis; si no la usas, sospecha.'
  ]);
});
