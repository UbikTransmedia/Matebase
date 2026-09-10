/* Tema: Series numéricas y convergencia */
Course.topic('fn-series', function (p) {

  p.puente('En el tema anterior apareció una frase que merece pararse a mirarla: <em>se pueden sumar ' +
    'infinitos números y obtener un resultado finito</em>. Se dijo, se usó y no se demostró. Este ' +
    'tema va de eso, porque es la idea sobre la que descansan la mitad de las cosas que vienen ' +
    'después: los polinomios de Taylor, las series de Fourier, la compresión de un MP3 y hasta la ' +
    'existencia del número $e$. La herramienta es la que ya tienes: el límite de una sucesión.');

  p.text('Y va también de lo contrario, que es todavía más interesante. Hay sumas infinitas cuyos ' +
    'términos se hacen tan pequeños como se quiera y que, aun así, <strong>no dan un número: se ' +
    'escapan al infinito</strong>. Cuesta creerlo la primera vez. Es probablemente el resultado más ' +
    'contraintuitivo de todo el análisis elemental, y al final del tema lo vas a ver demostrado con ' +
    'un argumento que entendería un niño.');

  p.section('Qué es sumar infinitos números');

  p.text('Empecemos por lo obvio: <strong>nadie suma infinitos números</strong>. No hay tiempo. Lo ' +
    'que se hace es otra cosa, y hay que decirlo con cuidado porque toda la teoría depende de ello.');

  p.text('Dada una sucesión $a_1, a_2, a_3, \\dots$, se construye una <strong>segunda</strong> ' +
    'sucesión sumando los términos de uno en uno:');

  p.formulas([
    'S_1 = a_1',
    'S_2 = a_1 + a_2',
    'S_3 = a_1 + a_2 + a_3',
    'S_n = a_1 + a_2 + \\dots + a_n = \\sum_{k=1}^{n} a_k'
  ], 'sumas parciales',
    'Se dice: <em>«ese sub ene es igual al sumatorio, desde ka igual a uno hasta ene, de a sub ' +
      'ka»</em>.<br><br>Símbolo a símbolo: $\\sum$ es una sigma griega y significa «suma todo esto»; ' +
      'debajo se pone dónde empieza el contador y encima dónde acaba. Así que $\\sum_{k=1}^{4} a_k$ ' +
      'es, sin más misterio, $a_1+a_2+a_3+a_4$.<br><br>A $S_n$ se le llama <strong>suma parcial</strong> ' +
      'porque es lo que llevas sumado hasta la posición $n$: una foto de la suma a medio hacer.');

  p.text('Cada $S_n$ es una suma corriente y moliente, de las de toda la vida, con un número finito ' +
    'de sumandos. Lo infinito no está en ninguna de ellas. Lo infinito está en que hay una $S_n$ ' +
    'para cada $n$, y por tanto las sumas parciales forman <strong>una sucesión</strong> —y a una ' +
    'sucesión ya sabes preguntarle a dónde va.');

  p.note('Una <strong>serie</strong> converge cuando su sucesión de sumas parciales tiene límite ' +
    'finito. Ese límite es, por definición, «la suma de la serie». Si las sumas parciales no tienen ' +
    'límite —porque se disparan o porque no se deciden—, la serie <strong>diverge</strong> y no ' +
    'tiene suma.', 'ok', 'La definición, que es toda la teoría');

  p.formula('\\sum_{n=1}^{\\infty} a_n = \\lim_{n\\to\\infty} S_n', 'la suma de una serie',
    'Se dice: <em>«el sumatorio, desde ene igual a uno hasta infinito, de a sub ene, es el límite ' +
      'cuando ene tiende a infinito de ese sub ene»</em>.<br><br>Fíjate en lo que hace de verdad esta ' +
      'igualdad: el lado izquierdo <strong>no significa nada por sí solo</strong> —nadie ha sumado ' +
      'infinitas cosas— y el lado derecho sí, porque es un límite corriente. La igualdad es la ' +
      'definición del lado izquierdo. Es una manera educada de decir «cuando escriba esto, quiero ' +
      'decir aquello».');

  p.text('Merece la pena insistir en esto porque es donde se atasca casi todo el mundo. La expresión ' +
    '$\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\dots$ no describe un proceso que termine. Describe una ' +
    'sucesión de resultados —$0{,}5$, $0{,}75$, $0{,}875$, $0{,}9375$…— y una pregunta sobre ella: ' +
    '¿se acerca a algún sitio? Cuando decimos que «vale 1» estamos diciendo que esa sucesión tiene ' +
    'límite 1, ni más ni menos.');

  p.comprueba('Para la serie $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\cdots$, ¿cuánto vale la suma parcial $S_3$?', [
    { t: '$\\dfrac{1}{8}$', ok: false, por: 'Ese es el tercer <em>término</em>, $a_3$. La suma parcial acumula: $S_3 = a_1 + a_2 + a_3$.' },
    { t: '$\\dfrac{7}{8}$', ok: true, por: '$\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{4 + 2 + 1}{8} = \\frac{7}{8}$. Le falta $\\frac{1}{8}$ para llegar a 1, justo el siguiente término.' },
    { t: '$1$', ok: false, por: '$1$ es el límite de las sumas parciales, la suma de la serie entera. Con tres términos aún falta $\\frac{1}{8}$.' }
  ]);

  p.demo({
    title: 'La escalera de las sumas parciales',
    intro: 'Cada punto es una suma parcial: lo que llevas sumado. Mueve el número de términos y mira si la escalera se estabiliza a una altura o si sigue subiendo sin techo. Es toda la diferencia entre converger y divergir.',
    predice: 'Antes de elegir «armónica»: sus términos $1, \\frac{1}{2}, \\frac{1}{3}, \\ldots$ se hacen pequeñísimos. ¿Crees que la escalera encontrará techo como la geométrica, o seguirá subiendo?',
    build: function (host) {
      var n = 12, cual = 'geo';
      var series = {
        geo: { t: 'geométrica $\\sum (1/2)^n$', f: function (k) { return Math.pow(0.5, k); }, lim: 1 },
        arm: { t: 'armónica $\\sum 1/n$', f: function (k) { return 1 / k; }, lim: null },
        cua: { t: 'inversos de cuadrados $\\sum 1/n^2$', f: function (k) { return 1 / (k * k); }, lim: Math.PI * Math.PI / 6 },
        alt: { t: 'alternada $\\sum (-1)^{n+1}/n$', f: function (k) { return (k % 2 ? 1 : -1) / k; }, lim: Math.LN2 }
      };
      function parciales(m) {
        var s = 0, out = [];
        for (var k = 1; k <= m; k++) { s += series[cual].f(k); out.push([k, s]); }
        return out;
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 40, ymin: 0, ymax: 2.2, height: 280,
        xlabel: 'n', ylabel: 'Sₙ', xstep: 5,
        draw: function (g) {
          var pts = parciales(n);
          var lim = series[cual].lim;
          if (lim !== null) g.hline(lim, { color: 2, w: 1.6, dash: true });
          g.path(pts, { color: 0, w: 1.6, alpha: .45 });
          for (var i = 0; i < pts.length; i++) g.point(pts[i][0], pts[i][1], { color: 0, r: 3.6 });
        }
      });
      function paint() {
        var pts = parciales(n);
        var s = pts[pts.length - 1][1];
        var lim = series[cual].lim;
        var maxY = Math.max(1.2, s * 1.18);
        plot.view(0, Math.max(12, n * 1.05), 0, maxY);
        var txt = 'Serie: ' + series[cual].t + '<br>' +
          'Suma de los <strong>' + n + '</strong> primeros: $S_{' + n + '} = ' + U.fmt(s, 6) + '$<br>';
        if (lim === null) {
          txt += '<span style="color:var(--bad)">No hay techo.</span> Sigue subiendo para siempre, ' +
            'aunque cada vez más despacio.';
        } else {
          txt += 'Límite: $' + U.fmt(lim, 6) + '$ · le falta $' + U.fmt(Math.abs(lim - s), 8) + '$';
        }
        out.set(txt);
        plot.render();
      }
      W.chips(host, [
        { label: 'geométrica 1/2ⁿ', value: 'geo' },
        { label: 'armónica 1/n', value: 'arm' },
        { label: 'cuadrados 1/n²', value: 'cua' },
        { label: 'alternada', value: 'alt' }
      ], { value: 'geo', on: function (v) { cual = v; paint(); } });
      W.slider(W.row(host), {
        label: 'términos sumados', min: 1, max: 300, step: 1, value: 12, dec: 0,
        on: function (v) { n = v; paint(); }
      });
      W.legend(host, [
        { c: 0, t: 'sumas parciales $S_n$' },
        { c: 2, t: 'el límite, cuando existe' }
      ]);
      W.hint(host, 'La armónica es la única de las cuatro que no se estabiliza. Súbela a 300 términos ' +
        'y compárala con las otras: sigue creciendo cuando las demás llevan mucho rato quietas.');
      paint();
    }
  });

  p.util('Esta distinción no es académica: es lo que decide si un cálculo se puede hacer o no. Cuando ' +
    'una calculadora evalúa $\\operatorname{sen}(0{,}3)$ está sumando los primeros términos de una ' +
    'serie y parando; puede hacerlo porque esa serie converge, y converge tan deprisa que con cinco ' +
    'términos ya tiene más cifras de las que muestra la pantalla. Si la serie divergiera, parar ' +
    'antes no daría una aproximación: daría un número sin ninguna relación con la respuesta.');

  p.section('La primera criba: si los términos no se van a cero, no hay nada que hacer');

  p.text('Antes de estudiar una serie conviene hacerle una pregunta rápida que descarta muchas de ' +
    'golpe. Si vas a sumar infinitas cosas y quieres que el total se quede quieto en un número, los ' +
    'sumandos tienen que acabar siendo despreciables. Si no, cada término nuevo mueve el total y la ' +
    'suma no se estabiliza nunca.');

  p.formula('\\text{Si } \\sum a_n \\text{ converge} \\ \\Longrightarrow\\ \\lim_{n\\to\\infty} a_n = 0',
    'condición necesaria',
    'Se dice: <em>«si el sumatorio de a sub ene converge, entonces el límite cuando ene tiende a ' +
      'infinito de a sub ene es cero»</em>.<br><br>La flecha doble $\\Longrightarrow$ es la ' +
      'implicación de [[lg-proposiciones|la lógica]]: «si pasa lo de la izquierda, entonces pasa lo de la ' +
      'derecha». Y como allí se insistió, <strong>una implicación no se puede dar la vuelta</strong>. ' +
      'Aquí eso importa muchísimo, como se ve enseguida.');

  p.text('Esto se usa siempre en su forma contrarrecíproca, que es la útil: si los términos ' +
    '<strong>no</strong> tienden a cero, la serie <strong>no</strong> converge. Y ahí se acaba el ' +
    'análisis, sin más trabajo.');

  p.list([
    '$\\sum \\frac{n}{n+1}$: los términos tienden a $1$, no a cero. <strong>Diverge.</strong> Estás sumando infinitos números que valen casi 1.',
    '$\\sum (-1)^n$: los términos valen $+1, -1, +1, \\dots$ y no tienden a nada. <strong>Diverge.</strong> Las sumas parciales van $-1, 0, -1, 0, \\dots$ eternamente indecisas.',
    '$\\sum \\frac{1}{n}$: los términos <strong>sí</strong> tienden a cero. Esta criba no dice nada. Hay que mirarla de cerca.'
  ]);

  p.note('El error más repetido de todo este tema es leer la implicación al revés y concluir que si ' +
    'los términos tienden a cero la serie converge. <strong>Es falso</strong>, y el contraejemplo es ' +
    'justo el tercero de la lista. La criba solo sirve para descartar, nunca para aprobar.',
    'warn', 'La trampa de la recíproca');

  p.section('La serie armónica: el contraejemplo que lo cambia todo');

  p.formula('\\sum_{n=1}^{\\infty} \\frac{1}{n} = 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} + \\dots',
    'la serie armónica',
    'Se dice: <em>«el sumatorio, desde ene igual a uno hasta infinito, de uno partido por ene»</em>, ' +
      'y el lado derecho es esa misma suma escrita término a término.<br><br>El $\\infty$ encima ' +
      'del sumatorio no significa que se llegue a sumar infinitas cosas: significa que la lista de ' +
      'sumandos no se acaba nunca, y que lo que preguntamos es a dónde van las sumas parciales. Los ' +
      'puntos suspensivos del final dicen «y así indefinidamente», no «y luego se para».');

  p.text('Se llama armónica porque cada término es la longitud de la cuerda que produce el armónico ' +
    'correspondiente en un instrumento. Sus términos tienden a cero, y bastante deprisa a ojo: el ' +
    'término mil vale una milésima. Parece evidente que la suma se tiene que estabilizar.');

  p.text('No se estabiliza. La suma crece sin límite: dado cualquier número, por grande que sea ' +
    '—un millón, un gúgol—, hay una cantidad de términos a partir de la cual la suma lo supera. Y lo ' +
    'demostró Nicole Oresme hacia 1350 con un truco que cabe en cuatro renglones.');

  p.formulas([
    '1 + \\tfrac{1}{2} + \\underbrace{\\tfrac{1}{3} + \\tfrac{1}{4}}_{>\\ 1/2} + \\underbrace{\\tfrac{1}{5} + \\tfrac{1}{6} + \\tfrac{1}{7} + \\tfrac{1}{8}}_{>\\ 1/2} + \\underbrace{\\tfrac{1}{9} + \\dots + \\tfrac{1}{16}}_{>\\ 1/2} + \\dots'
  ], 'el argumento de Oresme',
    'La idea es agrupar los términos en bloques cuyo tamaño se va doblando: uno, dos, cuatro, ocho, ' +
      'dieciséis…<br><br>En cada bloque, <strong>todos</strong> los términos son mayores o iguales que ' +
      'el último del bloque. Así que el bloque entero vale más que «cuántos términos hay» por «el más ' +
      'pequeño de ellos». En el bloque de cuatro: $\\frac15+\\frac16+\\frac17+\\frac18 > 4\\cdot\\frac18 ' +
      '= \\frac12$.<br><br>Y eso pasa en todos los bloques, siempre. Cada bloque aporta más de medio. ' +
      'Como hay infinitos bloques, la suma supera a $\\frac12+\\frac12+\\frac12+\\dots$, que es ' +
      'claramente infinita.');

  p.text('Fíjate en lo que ha ocurrido. Los términos se hacen pequeños, sí, pero <strong>hay cada vez ' +
    'más de ellos</strong>: para bajar de $\\frac{1}{8}$ a $\\frac{1}{16}$ hacen falta ocho términos, ' +
    'y esos ocho juntos vuelven a sumar medio. La pequeñez de cada término y la abundancia de ' +
    'términos se compensan exactamente, y el empate lo gana la abundancia.');

  p.ejemplo({
    title: 'El bloque de ocho, con las cuentas a la vista',
    enunciado: 'Comprobar que $\\frac{1}{9} + \\frac{1}{10} + \\cdots + \\frac{1}{16}$ suma más de $\\frac{1}{2}$, y deducir por qué la armónica no tiene techo.',
    pasos: [
      { t: '<strong>Cuántos términos hay.</strong> Del 9 al 16 van ocho términos. El más pequeño de todos es el último, $\\frac{1}{16}$.', antes: '¿Cuántos sumandos hay entre $\\frac{1}{9}$ y $\\frac{1}{16}$? ¿Cuál es el menor?' },
      { t: '<strong>Cambiar todos por el menor.</strong> Cada uno de los ocho es mayor o igual que $\\frac{1}{16}$, así que la suma es mayor que $8\\cdot\\frac{1}{16} = \\frac{1}{2}$.', antes: 'Si sustituyes los ocho por $\\frac{1}{16}$, ¿la suma sube o baja? ¿Cuánto da?' },
      { t: '<strong>Comprobar con números.</strong> Sumando de verdad: $0{,}111 + 0{,}100 + 0{,}091 + 0{,}083 + 0{,}077 + 0{,}071 + 0{,}067 + 0{,}063 = 0{,}663$. Más de medio, como se había previsto.' },
      { t: '<strong>Lo que vale para todos los bloques.</strong> El siguiente bloque va del 17 al 32: dieciséis términos, todos mayores o iguales que $\\frac{1}{32}$, suma mayor que $\\frac{16}{32} = \\frac{1}{2}$. Y así siempre: el bloque $k$ tiene $2^{k-1}$ términos y el menor vale $\\frac{1}{2^k}$.', antes: 'El bloque siguiente va del 17 al 32. ¿Cuántos términos tiene y cuál es el menor? ¿Pasa lo mismo?' },
      { t: '<strong>Conclusión.</strong> Cada bloque añade más de $\\frac{1}{2}$, hay infinitos bloques, y $\\frac{1}{2} + \\frac{1}{2} + \\frac{1}{2} + \\cdots$ no tiene techo. La armónica diverge. ∎' }
    ],
    cierre: 'Fíjate en lo lento que es: para pasar de 10 hacen falta más de doce mil términos. Diverge, pero sin ninguna prisa. Eso es lo que engaña a la intuición.'
  });

  p.demo({
    title: 'El truco de Oresme, bloque a bloque',
    intro: 'Cada color es un bloque: 1, luego 2 términos, luego 4, luego 8… Todos los bloques suman más de un medio, por pequeños que sean sus términos. Añade bloques y mira crecer el total sin prisa pero sin pausa.',
    predice: 'Con 4 bloques la cota garantizada es $1 + 3\\cdot\\frac{1}{2} = 2{,}5$. ¿Cuántos bloques hacen falta para garantizar que la suma pasa de 5? ¿Y cuántos términos son eso?',
    build: function (host) {
      var b = 4;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 9, ymin: 0, ymax: 4.2, height: 250,
        xlabel: 'bloque', ylabel: 'suma acumulada', xstep: 1,
        draw: function (g) {
          var acum = 0, k = 1;
          for (var i = 0; i < b; i++) {
            var s = 0, cuantos = (i === 0 ? 1 : Math.pow(2, i - 1));
            if (i === 0) { s = 1; k = 2; }
            else { for (var j = 0; j < cuantos; j++) { s += 1 / k; k++; } }
            g.rect(i + 0.15, acum, 0.7, s, { color: i % 6, fill: i % 6, fillAlpha: .45, w: 1.4 });
            acum += s;
          }
          g.hline(1 + b * 0.5 - 0.5, { color: 'bad', w: 1.6, dash: true });
        }
      });
      function paint() {
        var acum = 0, k = 1, filas = [];
        for (var i = 0; i < b; i++) {
          var s = 0, cuantos = (i === 0 ? 1 : Math.pow(2, i - 1)), desde = k;
          if (i === 0) { s = 1; k = 2; }
          else { for (var j = 0; j < cuantos; j++) { s += 1 / k; k++; } }
          acum += s;
          filas.push('bloque ' + (i + 1) + ' (términos ' + desde + '–' + (k - 1) + '): ' +
            U.fmt(s, 4) + (i > 0 ? ' &gt; 0,5' : ''));
        }
        plot.view(0, Math.max(4, b), 0, Math.max(2, acum * 1.15));
        out.set(filas.slice(-4).join('<br>') +
          '<br><strong>Total tras ' + b + ' bloques: ' + U.fmt(acum, 4) + '</strong>' +
          ' &nbsp;·&nbsp; términos usados: ' + U.miles(k - 1) +
          '<br><span style="font-size:0.8125rem;color:var(--ink-faint)">Cota inferior garantizada: ' +
          U.fmt(1 + (b - 1) * 0.5, 2) + '. Para pasar de 10 harían falta unos 12 000 términos, y para ' +
          'pasar de 20, más de 270 millones. Lento, pero imparable.</span>');
        plot.render();
      }
      W.slider(W.row(host), {
        label: 'bloques', min: 1, max: 9, step: 1, value: 4, dec: 0,
        on: function (v) { b = v; paint(); }
      });
      W.hint(host, 'La línea roja a trazos es la cota mínima garantizada por el argumento: medio por ' +
        'bloque. La suma real va por encima, pero lo que importa es que la cota ya se va al infinito.');
      paint();
    }
  });

  p.hist('Nicole Oresme fue obispo de Lisieux y uno de los pensadores más originales del siglo XIV. ' +
    'Además de esta demostración, dibujó gráficas de magnitudes que cambian con el tiempo tres siglos ' +
    'antes de Descartes, discutió la rotación de la Tierra con argumentos que Galileo repetiría, y ' +
    'tradujo a Aristóteles al francés inventando por el camino buena parte del vocabulario ' +
    'científico de esa lengua. Su prueba de que la serie armónica diverge se perdió y hubo que ' +
    'redescubrirla en el siglo XVII: la volvieron a encontrar Pietro Mengoli y, por su cuenta, los ' +
    'hermanos Bernoulli.');

  p.util('La divergencia de la armónica tiene una consecuencia física que parece un truco de magia: ' +
    '<strong>una pila de ladrillos puede sobresalir del borde de una mesa tanto como se quiera</strong>. ' +
    'Colocando cada ladrillo desplazado $\\frac{1}{2n}$ respecto al de abajo, el voladizo total es ' +
    'media serie armónica, o sea, infinito. Con 50 ladrillos se sobrepasa el largo de dos ladrillos; ' +
    'para llegar a diez ladrillos de voladizo harían falta unos 250 millones. No hay pegamento: solo ' +
    'que la serie diverge, muy despacio.');

  p.section('Las series que conviene reconocer de un vistazo');

  p.text('En la práctica casi nunca se calcula la suma de una serie: se decide si converge y, si hace ' +
    'falta un número, se suman términos hasta tener bastantes cifras. Para decidir basta con ' +
    'reconocer unos pocos patrones y compararse con ellos.');

  p.table(['Serie', 'Converge cuando', 'Suma'], [
    ['Geométrica $\\sum_{n=0}^{\\infty} a r^n$', '$|r| < 1$', '$\\dfrac{a}{1-r}$'],
    ['Armónica $\\sum \\frac{1}{n}$', 'nunca: diverge', '—'],
    ['$p$-serie $\\sum \\frac{1}{n^p}$', '$p > 1$', 'rara vez elemental'],
    ['Alternada $\\sum \\frac{(-1)^{n+1}}{n}$', 'converge', '$\\ln 2$'],
    ['Telescópica $\\sum \\left(\\frac{1}{n}-\\frac{1}{n+1}\\right)$', 'converge', '$1$']
  ]);

  p.text('La <strong>$p$-serie</strong> es la referencia con la que se compara casi todo. El caso ' +
    '$p=1$ es la armónica, que diverge; en cuanto se pasa un poco de 1 —incluso $p = 1{,}01$— la ' +
    'serie converge. La frontera es afiladísima, y saber de qué lado cae un exponente resuelve la ' +
    'mayoría de los ejercicios.');

  p.formula('\\sum_{n=1}^{\\infty}\\frac{1}{n^2} = \\frac{\\pi^2}{6}', 'el problema de Basilea');

  p.hist('Que $\\sum 1/n^2$ converge se sabía desde Mengoli, pero nadie era capaz de decir a qué. El ' +
    'reto se llamó <em>problema de Basilea</em> y resistió noventa años a los mejores matemáticos de ' +
    'Europa, los Bernoulli incluidos. Lo resolvió Euler en 1735, con veintiocho años, obteniendo ' +
    '$\\pi^2/6$ por un camino tan audaz que él mismo tardó años en justificarlo. Que aparezca $\\pi$ ' +
    'en una suma donde no hay ni un círculo es de las cosas más desconcertantes de la matemática, y ' +
    'sigue dando que hablar: esa misma suma, generalizada, es la función zeta de Riemann, y de ella ' +
    'depende el problema abierto más famoso que queda.');

  p.text('Un caso que sí se puede sumar entero, y con las manos, es el <strong>telescópico</strong>. ' +
    'Se llama así porque al escribir las sumas parciales los términos se cancelan por parejas y la ' +
    'suma se pliega como un catalejo:');

  p.formulas([
    'S_n = \\left(1-\\tfrac12\\right)+\\left(\\tfrac12-\\tfrac13\\right)+\\dots+\\left(\\tfrac1n-\\tfrac{1}{n+1}\\right)',
    'S_n = 1 - \\frac{1}{n+1} \\ \\longrightarrow\\ 1'
  ], 'una serie telescópica');

  p.text('Esta es la única familia en la que se ve directamente la sucesión de sumas parciales, sin ' +
    'trucos ni criterios. Por eso merece la pena hacer un par a mano: enseña qué es de verdad la ' +
    'suma de una serie.');

  p.section('Comparar: el criterio que se usa de verdad');

  p.text('El resto de series se estudia comparándolas con las de arriba. La idea es de sentido ' +
    'común y no hace falta memorizar nada:');

  p.list([
    'Si tus términos son <strong>menores</strong> que los de una serie que converge, la tuya también converge. No puedes pasarte de un total que ya es finito.',
    'Si tus términos son <strong>mayores</strong> que los de una serie que diverge, la tuya también diverge. Si ya la de abajo se va al infinito, la de arriba con más razón.'
  ]);

  p.text('En la práctica se mira solo el término dominante y se compara con la $p$-serie ' +
    'correspondiente, igual que en los límites de sucesiones se comparaban los grados:');

  p.formulas([
    '\\sum \\frac{1}{n^2+7n} \\ \\sim\\ \\sum \\frac{1}{n^2} \\quad \\text{converge}',
    '\\sum \\frac{n+3}{n^2+1} \\ \\sim\\ \\sum \\frac{1}{n} \\quad \\text{diverge}'
  ], 'comparar con lo dominante');

  p.note('Cuidado con el segundo: el numerador crece, el denominador crece más, los términos tienden ' +
    'a cero… y sin embargo diverge, porque tiende a cero <em>al ritmo de la armónica</em>. El ritmo ' +
    'al que se hacen pequeños los términos importa más que el hecho de que se hagan pequeños.',
    null, 'Lo que se compara es la velocidad');

  p.comprueba('$\\displaystyle\\sum \\frac{n + 1}{n^3}$: ¿converge o diverge?', [
    { t: 'Diverge: el numerador crece', ok: false, por: 'El numerador crece como $n$, pero el denominador como $n^3$. Lo que importa es el cociente: se comporta como $\\frac{n}{n^3} = \\frac{1}{n^2}$.' },
    { t: 'Converge: se comporta como $\\sum \\frac{1}{n^2}$', ok: true, por: 'Término dominante arriba, $n$; abajo, $n^3$. Es una $p$-serie disfrazada con $p = 2 > 1$.' },
    { t: 'Converge porque los términos tienden a cero', ok: false, por: 'Que tiendan a cero no basta: los de la armónica también. Converge por <em>cómo</em> de deprisa: como $\\frac{1}{n^2}$.' }
  ]);

  p.demo({
    title: 'Dónde está la frontera: la p-serie',
    intro: 'Mueve el exponente p y mira las sumas parciales. Por encima de 1 la escalera se aplana y encuentra techo; en 1 y por debajo, sigue subiendo. La frontera está en un sitio exacto y es sorprendentemente fina.',
    predice: 'Pon $p = 1{,}05$ y luego $p = 0{,}95$. Los términos son casi idénticos. ¿Crees que la escalera se comportará casi igual en los dos casos, o de forma opuesta?',
    build: function (host) {
      var pe = 2, n = 60;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 60, ymin: 0, ymax: 5, height: 260,
        xlabel: 'n', ylabel: 'Sₙ', xstep: 10,
        draw: function (g) {
          var s = 0, pts = [];
          for (var k = 1; k <= n; k++) { s += 1 / Math.pow(k, pe); pts.push([k, s]); }
          g.path(pts, { color: pe > 1 ? 0 : 1, w: 2.4 });
          if (pe > 1) {
            var lim = zeta(pe);
            if (lim && isFinite(lim)) g.hline(lim, { color: 2, w: 1.5, dash: true });
          }
        }
      });
      /* Suma de la p-serie estimada sumando bastantes términos y añadiendo la
         cola con la integral: basta para dibujar la línea de techo. */
      function zeta(q) {
        if (q <= 1) return null;
        var s = 0, N = 4000;
        for (var k = 1; k <= N; k++) s += 1 / Math.pow(k, q);
        return s + Math.pow(N, 1 - q) / (q - 1);
      }
      function paint() {
        var s = 0;
        for (var k = 1; k <= n; k++) s += 1 / Math.pow(k, pe);
        var lim = zeta(pe);
        plot.view(0, n, 0, Math.max(2.5, s * 1.2));
        out.set('$\\displaystyle\\sum_{n=1}^{' + n + '} \\frac{1}{n^{' + U.fmt(pe, 2) + '}} = ' +
          U.fmt(s, 6) + '$<br>' +
          (pe > 1
            ? '<span style="color:var(--ok)"><strong>Converge.</strong></span> El total se acerca a ' +
              U.fmt(lim, 6) + ' y ya no se mueve de ahí.'
            : '<span style="color:var(--bad)"><strong>Diverge.</strong></span> No hay techo: sube sin ' +
              'parar, cada vez más despacio, pero sin parar.') +
          '<br><span style="font-size:0.8125rem;color:var(--ink-faint)">' +
          (Math.abs(pe - 1) < 0.06
            ? 'Estás justo en la frontera. Con p = 1 exacto es la armónica: diverge.'
            : 'Prueba p = 1,05 y p = 0,95: casi el mismo exponente, destinos opuestos.') +
          '</span>');
        plot.render();
      }
      var row = W.row(host);
      W.slider(row, {
        label: 'exponente p', min: 0.5, max: 3, step: 0.05, value: 2, dec: 2,
        on: function (v) { pe = v; paint(); }
      });
      W.slider(row, {
        label: 'términos', min: 10, max: 400, step: 1, value: 60, dec: 0,
        on: function (v) { n = v; paint(); }
      });
      paint();
    }
  });

  p.util('Que la $p$-serie converja para $p>1$ es lo que hace viable internet. Un archivo de audio se ' +
    'guarda como una lista de coeficientes cuyo tamaño decae como una potencia de la frecuencia; ' +
    'como la serie converge, quedarse con los primeros cientos y tirar el resto introduce un error ' +
    'acotado y pequeño. Si esos coeficientes decayeran como la armónica, no habría MP3: la cola que ' +
    'tiras valdría tanto como lo que guardas.');

  p.section('Series alternadas: cuando los signos ayudan');

  p.text('Si los términos van cambiando de signo, la suma parcial se pasa y se queda corta ' +
    'alternativamente, y eso la obliga a encajonarse. Basta con que los valores absolutos decrezcan ' +
    'hasta cero para que la serie converja, aunque la serie de los valores absolutos diverja.');

  p.formula('1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\dots = \\ln 2', 'la armónica alternada');

  p.text('Es el mismo montón de números que la armónica, con signos alternos, y ahora sí converge. ' +
    'Además el error al cortar es cómodo de acotar: <strong>nunca es mayor que el primer término ' +
    'que has dejado fuera</strong>. Si cortas después de $\\frac{1}{100}$, te equivocas en menos de ' +
    'una centésima. Esa propiedad la usarás tal cual en el tema de Taylor.');

  p.note('Una serie alternada convergente puede ser muy quisquillosa: reordenando sus términos se ' +
    'puede hacer que sume <em>cualquier número que se quiera</em>. Suena a broma y es un teorema de ' +
    'Riemann. La propiedad conmutativa de la suma, que parece intocable, deja de valer en cuanto hay ' +
    'infinitos sumandos y no todos son del mismo signo.', 'warn', 'El infinito no respeta la propiedad conmutativa');

  p.trampas([
    { e: '«Los términos tienden a cero, luego la serie converge»', por: 'Es la recíproca de la condición necesaria, y es falsa. La armónica tiene términos que tienden a cero y diverge.' },
    { e: 'Confundir el término $a_n$ con la suma parcial $S_n$', por: '$a_n$ es un sumando; $S_n$ es lo acumulado hasta $n$. La serie converge si $S_n$ tiene límite, no si lo tiene $a_n$.' },
    { e: 'Sumar una geométrica con $|r| \\ge 1$ usando $\\frac{a}{1 - r}$', por: 'La fórmula solo vale si $|r| < 1$. Con $r = 2$ daría $-a$: un disparate que delata el error.' },
    { e: '«$\\sum \\frac{1}{n^{0{,}9}}$ converge porque es casi la de cuadrados»', por: 'La frontera es $p = 1$: por debajo diverge, aunque sea por poco. $0{,}9 < 1$.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Converge o diverge?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { tex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^3}', conv: true, por: 'Es una $p$-serie con $p = 3 > 1$.' },
        { tex: '\\sum_{n=1}^{\\infty} \\frac{1}{\\sqrt{n}}', conv: false, por: 'Es una $p$-serie con $p = \\frac12 \\le 1$.' },
        { tex: '\\sum_{n=1}^{\\infty} \\frac{1}{n}', conv: false, por: 'Es la serie armónica: diverge, aunque sus términos tiendan a cero.' },
        { tex: '\\sum_{n=1}^{\\infty} \\left(\\frac{2}{3}\\right)^n', conv: true, por: 'Es geométrica con $|r| = \\frac23 < 1$.' },
        { tex: '\\sum_{n=1}^{\\infty} \\left(\\frac{5}{4}\\right)^n', conv: false, por: 'Es geométrica con $|r| = \\frac54 \\ge 1$: los términos crecen.' },
        { tex: '\\sum_{n=1}^{\\infty} \\frac{n}{n+5}', conv: false, por: 'Los términos tienden a $1$, no a cero: falla la condición necesaria.' },
        { tex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2+3n}', conv: true, por: 'Se comporta como $\\sum \\frac{1}{n^2}$, que converge.' },
        { tex: '\\sum_{n=1}^{\\infty} \\frac{n+2}{n^2+1}', conv: false, por: 'Se comporta como $\\sum \\frac{1}{n}$: es la armónica disfrazada.' },
        { tex: '\\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n}', conv: true, por: 'Es alternada y los valores absolutos decrecen a cero.' },
        { tex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^{1{,}2}}', conv: true, por: 'Es una $p$-serie con $p = 1{,}2 > 1$: por poco, pero converge.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return '¿Converge o diverge la serie $\\displaystyle ' + d.tex + '$?';
    },
    fields: [{ name: 'q', label: 'La serie', opts: [{ t: 'converge', v: 'converge' }, { t: 'diverge', v: 'diverge' }] }],
    sol: function (d) { return { q: d.conv ? 'converge' : 'diverge' }; },
    hint: function () {
      return 'Mira primero si los términos tienden a cero. Si tienden, compárala con una $p$-serie ' +
        '$\\sum \\frac{1}{n^p}$: converge solo si $p > 1$.';
    },
    steps: function (d) {
      return [d.por,
        d.conv ? 'Por tanto la serie <strong>converge</strong>.'
          : 'Por tanto la serie <strong>diverge</strong>.'];
    },
    answer: function (d) { return d.conv ? 'Converge' : 'Diverge'; }
  });

  p.exercise({
    title: 'Suma de una serie geométrica',
    level: 'basico',
    gen: function (r) {
      var a = r.int(1, 9);
      var den = r.pick([2, 3, 4, 5, 6, 10]);
      var neg = r.bool(0.35);
      var raz = (neg ? -1 : 1) / den;
      return { a: a, den: den, neg: neg, r: raz, S: a / (1 - raz) };
    },
    ask: function (d) {
      var rt = (d.neg ? '-' : '') + '\\dfrac{1}{' + d.den + '}';
      return 'Calcula la suma de la serie geométrica $\\displaystyle\\sum_{n=0}^{\\infty} ' + d.a +
        '\\left(' + rt + '\\right)^n$, es decir, $' + d.a + ' + ' + d.a + '\\cdot\\left(' + rt +
        '\\right) + ' + d.a + '\\cdot\\left(' + rt + '\\right)^2 + \\dots$';
    },
    fields: [{ name: 'S', label: 'Suma', w: 'wide' }],
    sol: function (d) { return { S: U.round(d.S, 8) }; },
    tol: 3e-5,
    hint: function () {
      return 'Comprueba primero que $|r| < 1$; entonces $S = \\dfrac{a}{1-r}$ con $a$ el ' +
        '<strong>primer</strong> término.';
    },
    steps: function (d) {
      var rt = (d.neg ? '-' : '') + '\\frac{1}{' + d.den + '}';
      return ['La razón es $r = ' + rt + '$, y $|r| = \\frac{1}{' + d.den + '} < 1$: la serie converge.',
        'El primer término (el de $n=0$) es $a = ' + d.a + '$.',
        '$S = \\dfrac{a}{1-r} = \\dfrac{' + d.a + '}{1 - \\left(' + rt + '\\right)} = ' +
        U.fmt(d.S, 6) + '$'];
    },
    answer: function (d) { return U.fmt(d.S, 6); }
  });

  p.exercise({
    title: 'Serie telescópica',
    level: 'medio',
    gen: function (r) {
      var c = r.int(1, 4);
      return { c: c, S: 1 / c };
    },
    ask: function (d) {
      return 'Calcula $\\displaystyle\\sum_{n=' + d.c + '}^{\\infty} \\left(\\frac{1}{n} - ' +
        '\\frac{1}{n+1}\\right)$ escribiendo primero la suma parcial $S_N$ y viendo qué se cancela.';
    },
    fields: [{ name: 'S', label: 'Suma', w: 'wide' }],
    sol: function (d) { return { S: U.round(d.S, 8) }; },
    tol: 3e-5,
    hint: function () {
      return 'Escribe los primeros sumandos sin operar. Verás que el segundo trozo de cada paréntesis ' +
        'se cancela con el primero del siguiente.';
    },
    steps: function (d) {
      return ['$S_N = \\left(\\frac{1}{' + d.c + '}-\\frac{1}{' + (d.c + 1) + '}\\right) + ' +
        '\\left(\\frac{1}{' + (d.c + 1) + '}-\\frac{1}{' + (d.c + 2) + '}\\right) + \\dots + ' +
        '\\left(\\frac{1}{N}-\\frac{1}{N+1}\\right)$',
        'Todo lo de en medio se cancela por parejas y solo sobreviven el primero y el último: ' +
        '$S_N = \\frac{1}{' + d.c + '} - \\frac{1}{N+1}$.',
        'Al hacer $N\\to\\infty$, el trozo $\\frac{1}{N+1}$ se va a cero.',
        'La suma es $\\frac{1}{' + d.c + '} = ' + U.fmt(d.S, 6) + '$.'];
    },
    answer: function (d) { return '1/' + d.c + ' = ' + U.fmt(d.S, 6); }
  });

  p.exercise({
    title: 'Cuántos términos hacen falta',
    level: 'avanzado',
    gen: function (r) {
      var den = r.pick([2, 3, 5]);
      var cifras = r.int(3, 6);
      var raz = 1 / den;
      // error tras N terminos de sum r^n (desde n=0) es r^N/(1-r) < 10^-cifras
      var eps = Math.pow(10, -cifras);
      var N = Math.ceil(Math.log(eps * (1 - raz)) / Math.log(raz));
      if (N < 2 || N > 60) return null;
      return { den: den, cifras: cifras, r: raz, N: N };
    },
    ask: function (d) {
      return 'Quieres sumar $\\displaystyle\\sum_{n=0}^{\\infty}\\left(\\frac{1}{' + d.den +
        '}\\right)^n$ con un error menor que $10^{-' + d.cifras + '}$. ¿Cuántos términos ' +
        '(empezando por el de $n=0$) hay que sumar como mínimo?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">La cola que dejas fuera es otra ' +
        'geométrica: vale $\\dfrac{r^N}{1-r}$ si te quedas con $N$ términos.</span>';
    },
    fields: [{ name: 'N', label: 'Términos', w: 'tiny' }],
    sol: function (d) { return { N: d.N }; },
    tol: 1e-9,
    hint: function (d) {
      return 'Despeja $r^N < 10^{-' + d.cifras + '}(1-r)$ y toma logaritmos en los dos lados. ' +
        '<strong>Cuidado con un detalle</strong>: como $r < 1$, su logaritmo es <em>negativo</em>, y ' +
        'al dividir entre un número negativo <strong>la desigualdad se da la vuelta</strong> y el ' +
        '$<$ se convierte en $>$. Después redondea hacia arriba, porque los términos se cuentan de ' +
        'uno en uno. Si prefieres no pelearte con eso, también vale ir probando valores de $N$: la ' +
        'cota baja tan deprisa que enseguida das con el bueno.';
    },
    steps: function (d) {
      return ['La cola desde el término $N$ en adelante vuelve a ser geométrica, de primer término ' +
        '$r^N$: vale $\\dfrac{r^N}{1-r}$.',
        'Hay que exigir $\\dfrac{(1/' + d.den + ')^N}{1 - 1/' + d.den + '} < 10^{-' + d.cifras + '}$.',
        'Tomando logaritmos y despejando sale $N > ' + U.fmt(Math.log(Math.pow(10, -d.cifras) * (1 - d.r)) / Math.log(d.r), 3) + '$.',
        'Como $N$ tiene que ser entero, hacen falta <strong>' + d.N + '</strong> términos.',
        'Fíjate en lo poco que es: la convergencia geométrica es rapidísima. Con la armónica esta ' +
        'pregunta no tendría respuesta, porque no converge.'];
    },
    answer: function (d) { return d.N + ' términos'; }
  });

  p.keys([
    'Una <strong>serie</strong> es el límite de sus sumas parciales $S_n$. Si ese límite existe y es finito, converge; su valor <em>es</em> la suma.',
    'Si $\\sum a_n$ converge entonces $a_n \\to 0$. <strong>La recíproca es falsa</strong>, y el contraejemplo es la armónica.',
    'La armónica $\\sum \\frac{1}{n}$ <strong>diverge</strong> (Oresme, 1350): agrupando en bloques que doblan de tamaño, cada bloque suma más de $\\frac12$.',
    'La $p$-serie $\\sum \\frac{1}{n^p}$ converge exactamente cuando $p > 1$. Es la vara de medir con la que se compara todo lo demás.',
    'Geométrica: converge si $|r|<1$, y entonces vale $\\frac{a}{1-r}$. Es la única familia que se suma cómodamente entera.',
    'Alternada con términos decrecientes a cero: converge, y el error al cortar es menor que el primer término omitido.'
  ]);
});
