/* Tema: La caja negra: sistemas, estados y transiciones */
Course.topic('cib-caja-negra', function (p) {

  p.puente('Los dos temas anteriores describían bucles conociendo sus ecuaciones. Este pregunta qué se ' +
    'puede saber de un sistema cuando no se conocen: solo se puede tocar y mirar. Las herramientas son ' +
    'las [[lg-conjuntos|aplicaciones]] de lógica, la aritmética del reloj y, al final, la recta de ' +
    'regresión de estadística.');

  p.text('Tienes delante un aparato cerrado. No puedes abrirlo —está soldado, o es un organismo vivo, ' +
    'o es la economía de un país— y necesitas saber cómo funciona. Solo se te permite hacer dos ' +
    'cosas: <strong>tocar sus mandos y mirar qué hace</strong>. ¿Se puede aprender algo así?');

  p.text('Ross Ashby dedicó un capítulo entero a esta pregunta y la respuesta es que sí, muchísimo, y ' +
    'que además es la situación <em>normal</em>. Casi nunca podemos abrir lo que estudiamos. Un médico ' +
    'no destapa a su paciente para ver qué hace el páncreas: le da glucosa y mide la respuesta. Un ' +
    'economista no abre el mercado: sube un tipo de interés y observa. Esa manera de trabajar tiene ' +
    'nombre —el <strong>problema de la caja negra</strong>— y este tema va de cómo se hace bien.');

  p.hist('W. Ross Ashby era psiquiatra, no ingeniero, y esa es la clave de todo lo que escribió. ' +
    'Trabajaba en un hospital mental inglés en los años treinta y cuarenta, y su pregunta de partida ' +
    'no era cómo construir una máquina sino <em>cómo consigue un cerebro adaptarse</em> a un mundo ' +
    'que no ha visto nunca. De ahí salieron dos libros —<em>Design for a Brain</em> (1952) e ' +
    '<em>Introduction to Cybernetics</em> (1956)— escritos con una claridad que sigue siendo rara. El ' +
    'segundo se lee hoy sin esfuerzo y está lleno de frases que se han hecho célebres, casi todas ' +
    'incómodas.');

  /* ---------------------------------------------------------------- */
  p.section('Estado y transformación');

  p.text('Para hablar de un sistema hace falta antes decidir qué es «cómo está» en un momento dado. ' +
    'Eso es su <strong>estado</strong>: el conjunto de datos que hay que conocer para saber qué hará a ' +
    'continuación. En un semáforo, el estado es el color. En un ascensor, la planta y si sube o baja. ' +
    'En una partida de ajedrez, la posición de las piezas y a quién le toca.');

  p.text('Y lo que hace el sistema es <strong>pasar de un estado a otro</strong>. Ashby llamó ' +
    '<em>transformación</em> a la regla que dice a dónde va cada estado. Fíjate en que eso es ' +
    'exactamente una [[lg-conjuntos|aplicación]]: a cada estado le corresponde uno y solo uno. Lo ' +
    'único nuevo es que ahora el conjunto de partida y el de llegada son el mismo, de modo que la ' +
    'transformación se puede aplicar una y otra vez.');

  p.formulas([
    'T: \\ A \\to B \\to C \\to A',
    'T^2 = T \\circ T, \\qquad T^n = \\underbrace{T \\circ \\dots \\circ T}_{n \\text{ veces}}'
  ], 'una transformación y sus repeticiones',
    'La flecha $\\to$ aquí se lee «va a»: la transformación manda el estado A al B, el B al C y el C ' +
    'de vuelta al A.<br><br>$T^2$ se dice «te al cuadrado» pero no es una multiplicación: significa ' +
    '<strong>aplicar T dos veces seguidas</strong>. El círculo $\\circ$ se lee «compuesta con».<br><br>' +
    'En esta transformación de ejemplo, $T^3$ devuelve cada estado a donde estaba: da la vuelta ' +
    'completa. Se dice que tiene <em>periodo</em> 3.');

  p.text('Ese <em>periodo</em> no es una curiosidad: es una herramienta de cálculo. Si aplicar la ' +
    'transformación tres veces devuelve todo a su sitio, entonces aplicarla 300 veces también, y ' +
    'aplicarla 302 equivale a aplicarla 2. <strong>Basta con quedarse con el resto de dividir entre ' +
    'el periodo</strong>, que es exactamente la aritmética del reloj que viste en teoría de números.');

  p.text('Conviene tenerlo presente porque es la diferencia entre un cálculo de tres pasos y uno de ' +
    'trescientos. Eso sí, hay un detalle: no toda transformación tiene periodo. Si alguna cadena de ' +
    'estados desemboca en un ciclo sin poder salir de él —o se queda atrapada en un estado que se ' +
    'transforma en sí mismo— el sistema deja de dar la vuelta completa, y entonces hay que seguir el ' +
    'camino paso a paso hasta entrar en el ciclo.');

  p.text('Un sistema cuyo estado siguiente queda determinado por el actual se llama <strong>determinado ' +
    'por su estado</strong>. Es una condición fuerte y muy útil: significa que no hace falta conocer ' +
    'la historia, basta con saber dónde está ahora. Si dos veces desde el mismo estado ocurren cosas ' +
    'distintas, es que te falta algo por incluir en la descripción del estado — no que el sistema sea ' +
    'caprichoso.');

  p.note('Esa última frase es una herramienta de diagnóstico de primera. Cuando un aparato «unas veces ' +
    'hace una cosa y otras veces otra», la conclusión correcta casi nunca es que sea aleatorio: es que ' +
    'hay una variable escondida que no estás mirando —la temperatura, un contador interno, la humedad— ' +
    'y que forma parte del estado sin que lo sepas.', 'ok', 'Cuando el sistema parece caprichoso');

  p.comprueba('La transformación $A \\to B \\to C \\to A$ tiene periodo 3. Si se aplica 302 veces partiendo de $A$, ¿dónde acaba?', [
    { t: 'En $C$: 302 dividido entre 3 da resto 2, y dos pasos desde $A$ llevan a $C$', ok: true, por: 'Cada tres aplicaciones se vuelve al principio, así que 300 no cambian nada y solo cuentan las 2 que sobran. Es la aritmética del reloj.' },
    { t: 'En $B$: 302 es par', ok: false, por: 'La paridad no tiene que ver: el ciclo es de 3, no de 2. Lo que importa es el resto de dividir entre 3.' },
    { t: 'Hay que aplicarla 302 veces para saberlo', ok: false, por: 'Con periodo conocido basta el resto. Solo hay que seguir paso a paso cuando la transformación no vuelve al principio, por ejemplo si un estado se queda atrapado.' }
  ]);

  p.ejemplo({
    title: 'Una transformación con ciclo y con trampa',
    enunciado: 'Cinco estados con la regla $A \\to B$, $B \\to C$, $C \\to A$, $D \\to E$, $E \\to E$. Calcular $T^{100}(A)$, $T^{100}(D)$ y decidir si la transformación entera tiene periodo.',
    pasos: [
      { t: '<strong>Desde $A$.</strong> $A, B, C$ forman un ciclo de 3. $100 = 3\\cdot 33 + 1$: 99 aplicaciones devuelven a $A$ y la que sobra lleva a $B$. $T^{100}(A) = B$.', antes: '¿Cuál es el resto de dividir 100 entre 3? ¿Cuántos pasos cuentan de verdad?' },
      { t: '<strong>Desde $D$.</strong> $D \\to E$, y $E$ se transforma en sí mismo: es un estado <em>absorbente</em>. Después del primer paso ya no hay más movimiento. $T^{100}(D) = E$.', antes: 'Sigue $D$ dos o tres pasos. ¿Qué pasa?' },
      { t: '<strong>¿Periodo?</strong> Para tener periodo, alguna potencia de $T$ tendría que devolver <em>todos</em> los estados a su sitio. Pero $D$ nunca vuelve: una vez en $E$, se queda. La transformación entera no tiene periodo, aunque una parte de ella sí.', antes: '¿Existe un $n$ con $T^n(D) = D$?' },
      { t: '<strong>Lo que enseña.</strong> Antes de usar el resto hay que comprobar que el estado de partida está en un ciclo. Si cae en un absorbente, el resto no sirve; se sigue el camino hasta que se detiene.' }
    ],
    cierre: 'Ciclos y estados absorbentes son las dos cosas que le pueden pasar a una transformación finita: tarde o temprano todo estado o bien gira o bien se para. Es lo mismo que en las cadenas de Markov, sin azar.'
  });

  p.demo({
    title: 'Una caja negra que puedes sondear',
    intro: 'Dentro hay una máquina con cuatro estados y dos mandos. No puedes ver su tabla, pero sí pulsar los mandos y observar en qué estado queda. Púlsalos hasta que creas saber cómo funciona; el botón de abajo te descubre la tabla para comprobarlo.',
    predice: 'Pulsa ↻ cuatro veces seguidas desde A y anota la secuencia. ¿Volverás a A? Después prueba ⇢ dos veces: ¿a dónde crees que llegarás?',
    build: function (host, d) {
      // maquina fija (es un ejemplo explicativo, no un ejercicio)
      var NOM = ['A', 'B', 'C', 'D'];
      var TA = [1, 2, 3, 0];        // mando ↻ : A→B→C→D→A
      var TB = [2, 3, 0, 1];        // mando ⇢ : salta dos
      var s = 0, hist = [], visto = { a: {}, b: {} }, revelado = false;

      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5, height: 300, equal: true,
        grid: false, axes: false,
        draw: function (g) {
          for (var i = 0; i < 4; i++) {
            var a = Math.PI / 2 - i * Math.PI / 2;
            var x = Math.cos(a), y = Math.sin(a);
            var act = (i === s);
            g.circle(x, y, 0.3, {
              color: act ? 2 : 'axis', w: act ? 3 : 1.6,
              fill: act ? 2 : null, fillAlpha: act ? .22 : 0
            });
            g.text(x, y - 0.07, NOM[i], {
              align: 'center', color: act ? 2 : 'ink', size: act ? 20 : 17, bold: act
            });
          }
          if (revelado) {
            for (var k = 0; k < 4; k++) {
              var a1 = Math.PI / 2 - k * Math.PI / 2;
              var a2 = Math.PI / 2 - TA[k] * Math.PI / 2;
              g.vec(Math.cos(a1) * 0.72, Math.sin(a1) * 0.72,
                    Math.cos(a2) * 0.72, Math.sin(a2) * 0.72,
                    { color: 0, w: 1.6, alpha: .75 });
            }
          }
        }
      });

      function paint() {
        var lineas = 'Estado actual: <strong>' + NOM[s] + '</strong>';
        if (hist.length) {
          lineas += '<br>Lo que llevas pulsado: ' + hist.slice(-14).join(' ') +
            (hist.length > 14 ? ' <span style="color:var(--ink-faint)">(' + hist.length + ' en total)</span>' : '');
        }
        var na = Object.keys(visto.a).length, nb = Object.keys(visto.b).length;
        lineas += '<br><span style="font-size:0.7812rem;color:var(--ink-faint)">Transiciones distintas que has observado: ' +
          na + ' de 4 con el primer mando, ' + nb + ' de 4 con el segundo.</span>';
        if (na === 4 && nb === 4 && !revelado) {
          lineas += '<br><strong style="color:var(--ok)">Ya has visto la caja entera: con esas ocho observaciones puedes reconstruir la tabla sin abrirla.</strong>';
        }
        if (revelado) {
          lineas += '<br><br><strong>La tabla que había dentro:</strong><br>' +
            'Mando ↻ : ' + NOM.map(function (n, i) { return n + '→' + NOM[TA[i]]; }).join(', ') + '<br>' +
            'Mando ⇢ : ' + NOM.map(function (n, i) { return n + '→' + NOM[TB[i]]; }).join(', ');
        }
        out.set(lineas);
        plot.render();
      }

      var fila = W.row(host);
      W.buttons(fila, [
        { t: 'Pulsar ↻', cls: 'btn--main', on: function () {
          visto.a[s] = 1; hist.push(NOM[s] + '→' + NOM[TA[s]]); s = TA[s]; paint();
        } },
        { t: 'Pulsar ⇢', cls: 'btn--main', on: function () {
          visto.b[s] = 1; hist.push(NOM[s] + '⇢' + NOM[TB[s]]); s = TB[s]; paint();
        } },
        { t: 'Abrir la caja', on: function () { revelado = true; paint(); } },
        { t: 'Empezar de nuevo', cls: 'btn--ghost', on: function () {
          s = 0; hist = []; visto = { a: {}, b: {} }; revelado = false; paint();
        } }
      ]);
      W.hint(host, 'Con cuatro estados y dos mandos hay ocho transiciones posibles. Ocho observaciones bien elegidas bastan; con menos, te faltará información.');
      paint();
    }
  });

  p.util('Sondear una caja negra es lo que hace un técnico ante una avería, y también lo que hace la ' +
    'medicina cuando no puede mirar dentro. La prueba de tolerancia a la glucosa consiste exactamente ' +
    'en eso: se administra una cantidad conocida y se mide la respuesta a lo largo de dos horas, ' +
    'porque el páncreas no se puede abrir. En informática se llama <em>fuzzing</em>: bombardear un ' +
    'programa con entradas raras para descubrir qué hace, y es una de las técnicas que más fallos de ' +
    'seguridad encuentra.');

  /* ---------------------------------------------------------------- */
  p.section('Deducir el interior desde fuera');

  p.text('Cuando se sondea una caja negra aparece enseguida un límite incómodo: <strong>puede haber ' +
    'varias máquinas distintas que se comporten igual</strong> en todo lo que has probado. Si dos ' +
    'cajas responden lo mismo a cada experimento que sabes hacer, ninguna cantidad de experimentos ' +
    'los distinguirá.');

  p.text('Eso no es un fracaso del método, es un resultado sobre el mundo, y se parece mucho a lo que ' +
    'ocurre con los datos: para el que mira desde fuera, dos explicaciones que predicen lo mismo son ' +
    '<em>la misma explicación</em>. La consecuencia práctica es que uno nunca descubre «cómo es ' +
    'realmente» la caja, sino un modelo que la imita en el rango de cosas que ha probado.');

  p.note('De ahí sale un aviso muy útil: cuando alguien afirma haber entendido un sistema, la pregunta ' +
    'que hay que hacerle no es «¿cómo lo sabes?» sino <strong>«¿qué experimento distinguiría tu ' +
    'explicación de otra distinta?»</strong>. Si no hay ninguno, no ha entendido más que el vecino.',
    null, 'La pregunta que hay que hacer');

  p.text('Hay un caso especialmente traicionero: las cajas con <strong>estado interno oculto</strong>. ' +
    'Imagina un pulsador que unas veces enciende la luz y otras la apaga. Parece caprichoso, pero es ' +
    'perfectamente determinista: lo que pasa es que su estado no es solo «la luz», sino «la luz y lo ' +
    'que se pulsó antes». Al ampliar la descripción del estado, el capricho desaparece.');

  p.util('Ese fenómeno explica una parte enorme de los errores de software difíciles de reproducir. ' +
    'Un fallo que «solo pasa a veces» casi siempre depende de un estado interno que nadie está ' +
    'mirando: una caché, un contador, el orden en que llegaron dos mensajes. Por eso la primera ' +
    'pregunta de un buen depurador no es «¿qué hiciste?» sino «¿qué había pasado antes?».');

  p.sub('Cuando la caja da números: ajustar un modelo');

  p.text('Muchas cajas negras no tienen unos pocos estados, sino una entrada y una salida numéricas: una ' +
    'resistencia a la que se aplica una tensión, un muelle del que se cuelga un peso, un mercado en el que ' +
    'se cambia un precio. Sondearlas es anotar pares (entrada, salida). Y como toda medida tiene ruido, los ' +
    'puntos nunca caen exactamente sobre una curva: hay que elegir el modelo que <strong>mejor los ' +
    'imita</strong>.');

  p.text('Si se propone un modelo lineal, $y = a\\,x + b$, cada punto medido queda a una distancia vertical ' +
    'del modelo: su <strong>residuo</strong>. El criterio más usado desde hace dos siglos es elegir $a$ y $b$ ' +
    'para que la suma de los cuadrados de los residuos sea lo más pequeña posible. Es el método de ' +
    '<strong>mínimos cuadrados</strong>, el mismo de la [[pe-bidimensional|recta de regresión]].');

  p.formula('a = \\frac{\\sum (x_i - \\overline{x})(y_i - \\overline{y})}{\\sum (x_i - \\overline{x})^2}, \\qquad b = \\overline{y} - a\\,\\overline{x}',
    'la recta de mínimos cuadrados',
    'Se lee: <em>«a es la suma de los productos de las desviaciones de equis y de i griega, partida por la ' +
    'suma de los cuadrados de las desviaciones de equis»</em>.<br><br>La recta pasa siempre por el punto ' +
    'medio de los datos, $(\\overline{x}, \\overline{y})$.<br><br>Sale de derivar la suma de cuadrados respecto ' +
    'de $a$ y de $b$ e igualar a cero. Su versión con muchas variables, escrita con matrices, está en ' +
    '[[av-minimos-cuadrados]].');

  p.demo({
    title: 'Ajusta a mano una caja ruidosa',
    intro: 'Estos puntos son medidas de una caja negra: entrada en horizontal, salida en vertical. Mueve la pendiente y la ordenada hasta que la suma de los cuadrados de los residuos —los segmentos rojos— sea lo más pequeña que puedas. Después pide el ajuste óptimo y compara.',
    predice: 'Intenta primero a ojo: ¿qué pendiente crees que tienen los puntos, alrededor de 0,5, de 1,5 o de 3? Anota tu mejor suma de cuadrados antes de pedir el óptimo.',
    build: function (host) {
      var xs = [], ys = [], rng = U.rng(2024);
      for (var i = 0; i < 12; i++) {
        var x0 = 0.5 + i * 0.8;
        xs.push(x0);
        ys.push(1.4 * x0 + 1.5 + (rng.real(0, 1) - 0.5) * 3.2);
      }
      var mx = ML.mean(xs), my = ML.mean(ys), sxy = 0, sxx = 0;
      xs.forEach(function (x, j) { sxy += (x - mx) * (ys[j] - my); sxx += (x - mx) * (x - mx); });
      var aOpt = sxy / sxx, bOpt = my - aOpt * mx;
      function sse(a1, b1) { var s = 0; xs.forEach(function (x, j) { var e = ys[j] - (a1 * x + b1); s += e * e; }); return s; }
      var a = 0.5, b = 4;
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: 0, xmax: 10, ymin: 0, ymax: 18, height: 300, xlabel: 'entrada', ylabel: 'salida',
        draw: function (g) {
          xs.forEach(function (x, j) { g.seg(x, ys[j], x, a * x + b, { color: 'bad', w: 1.4 }); });
          g.fn(function (x) { return a * x + b; }, { color: 0, w: 2.6 });
          xs.forEach(function (x, j) { g.point(x, ys[j], { color: 1, r: 4 }); });
        }
      });
      function pinta() {
        var s = sse(a, b), sOpt = sse(aOpt, bOpt);
        out.set('Tu recta: $y = ' + U.fmt(a, 2) + 'x ' + (b < 0 ? '- ' + U.fmt(-b, 2) : '+ ' + U.fmt(b, 2)) + '$ &nbsp;·&nbsp; suma de cuadrados: <strong>' + U.fmt(s, 2) +
          '</strong> &nbsp;·&nbsp; la mínima posible: ' + U.fmt(sOpt, 2) + (s - sOpt < 0.05 ? ' &nbsp;<strong style="color:var(--ok)">¡clavado!</strong>' : ''));
        plot.render();
      }
      var fila = W.row(host);
      var sa = W.slider(fila, { label: 'pendiente a', min: -1, max: 3, step: 0.01, value: a, on: function (v) { a = v; pinta(); } });
      var sb = W.slider(fila, { label: 'ordenada b', min: -4, max: 8, step: 0.01, value: b, on: function (v) { b = v; pinta(); } });
      W.buttons(host, [{ t: 'Mostrar el ajuste óptimo', on: function () { a = aOpt; b = bOpt; sa.set(U.round(aOpt, 2)); sb.set(U.round(bOpt, 2)); pinta(); } }]);
      pinta();
    }
  });

  p.hist('El método de mínimos cuadrados lo publicó Adrien-Marie Legendre en 1805, para calcular órbitas de ' +
    'cometas. Carl Friedrich Gauss lo publicó en 1809 y aseguró que lo usaba desde 1795; con él había ' +
    'predicho en 1801 dónde reaparecería Ceres, un planeta enano que se había perdido tras el Sol después de ' +
    'observarse solo unas semanas. Los astrónomos lo encontraron donde Gauss dijo. La disputa por la ' +
    'prioridad entre los dos fue agria; el método, en cambio, no ha dejado de usarse.');

  p.trampas([
    { e: 'Llamar «aleatorio» a lo que no se entiende', por: 'Un pulsador que unas veces enciende y otras apaga es perfectamente determinista: le falta al estado «cómo estaba la luz». Casi siempre falta una variable, no sobra azar.' },
    { e: 'Usar el resto módulo el periodo sin comprobar que hay ciclo', por: 'Si el estado cae en uno absorbente, no vuelve nunca y el resto no significa nada. Primero se mira a dónde va; el atajo solo vale dentro de un ciclo.' },
    { e: 'Creer que se ha descubierto «cómo es» la caja', por: 'Solo se ha encontrado un modelo que la imita en lo probado. Otra máquina distinta podría responder igual a todos esos experimentos.' },
    { e: 'Ajustar la recta con el primer punto y el último', por: 'Ignora los demás y el ruido de esos dos manda. Mínimos cuadrados usa todas las medidas y reparte el error.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Sigue la transformación',
    level: 'basico',
    gen: function (r) {
      var n = 4, NOM = ['A', 'B', 'C', 'D'];
      var destino = r.shuffle([0, 1, 2, 3]);
      // evita que sea la identidad, que no enseña nada
      var identidad = destino.every(function (v, i) { return v === i; });
      if (identidad) return null;
      var ini = r.int(0, n - 1);
      var pasos = r.int(2, 5);
      return { NOM: NOM, destino: destino, ini: ini, pasos: pasos };
    },
    ask: function (d) {
      var tabla = d.NOM.map(function (x, i) { return x + ' \\to ' + d.NOM[d.destino[i]]; }).join(', \\quad ');
      return 'Una caja negra tiene cuatro estados y esta transformación:<br><br>' +
        '$' + tabla + '$<br><br>' +
        'Si parte del estado <strong>' + d.NOM[d.ini] + '</strong> y la aplicas <strong>' + d.pasos +
        ' veces</strong>, ¿en qué estado acaba?';
    },
    fields: [{ name: 'fin', label: 'estado final', opts: [{ t: 'A', v: 'A' }, { t: 'B', v: 'B' }, { t: 'C', v: 'C' }, { t: 'D', v: 'D' }] }],
    sol: function (d) {
      var s = d.ini;
      for (var i = 0; i < d.pasos; i++) s = d.destino[s];
      return { fin: d.NOM[s] };
    },
    hint: function () {
      return 'Con tan pocos pasos, ir anotando dónde estás después de cada aplicación es lo más ' +
        'rápido. Si te pidieran cien aplicaciones sí compensaría buscar antes el periodo del ciclo.';
    },
    steps: function (d) {
      var s = d.ini, l = ['Partimos de <strong>' + d.NOM[s] + '</strong>.'];
      for (var i = 0; i < d.pasos; i++) {
        var sig = d.destino[s];
        l.push('Paso ' + (i + 1) + ': ' + d.NOM[s] + ' → <strong>' + d.NOM[sig] + '</strong>.');
        s = sig;
      }
      l.push('Tras ' + d.pasos + ' aplicaciones queda en <strong>' + d.NOM[s] + '</strong>.');
      return l;
    }
  });

  p.exercise({
    title: 'Cuántos experimentos hacen falta',
    level: 'medio',
    gen: function (r) {
      var estados = r.int(3, 6);
      var mandos = r.int(2, 4);
      return { e: estados, m: mandos };
    },
    ask: function (d) {
      return 'Una caja negra tiene <strong>' + d.e + ' estados</strong> posibles y ' +
        '<strong>' + d.m + ' mandos</strong> distintos que puedes pulsar. La caja está determinada por ' +
        'su estado.<br><br>¿Cuántas transiciones distintas hay que observar, como mínimo, para ' +
        'reconstruir su tabla completa?';
    },
    fields: [{ name: 'n', label: 'observaciones', w: 'tiny' }],
    sol: function (d) { return { n: d.e * d.m }; },
    hint: function () { return 'Para cada estado en el que te puedas encontrar, hay que probar cada uno de los mandos.'; },
    steps: function (d) {
      return [
        'Para saber qué hace un mando, hay que probarlo <em>desde cada estado</em>: lo que hace desde A no dice nada de lo que hará desde B.',
        'Con ' + d.e + ' estados, cada mando exige ' + d.e + ' observaciones.',
        'Y hay ' + d.m + ' mandos, así que en total: $' + d.e + ' \\cdot ' + d.m + ' = ' + (d.e * d.m) + '$ observaciones.',
        'Esto crece deprisa, y es la primera pista de un problema serio: una caja con muchos estados es inabarcable a base de probar. Ese es el asunto del tema siguiente.'
      ];
    }
  });

  p.exercise({
    title: 'El estado que falta',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { t: 'Un pulsador de una lámpara: a veces la enciende y a veces la apaga.',
          v: 'si la luz estaba encendida o apagada' },
        { t: 'Una máquina de café: con el mismo botón, unas veces da café solo y otras con leche.',
          v: 'la opción seleccionada antes de pulsar' },
        { t: 'Un ascensor: al pulsar el 3 unas veces sube y otras baja.',
          v: 'la planta en la que está el ascensor' },
        { t: 'Un programa que unas veces tarda un instante y otras varios segundos en dar el mismo resultado.',
          v: 'si el resultado estaba guardado en la caché' },
        { t: 'Un termostato que a 21 grados unas veces enciende la caldera y otras no.',
          v: 'si la temperatura venía subiendo o bajando' },
        { t: 'Un semáforo con pulsador: a veces cambia enseguida y a veces no cambia.',
          v: 'cuánto tiempo lleva en el estado actual' }
      ];
      var c = r.pick(casos);
      return { texto: c.t, variable: c.v };
    },
    ask: function (d) {
      return 'Este sistema parece caprichoso, pero está determinado por su estado: lo que ocurre es ' +
        'que la descripción del estado está incompleta.<br><br><em>«' + d.texto + '»</em><br><br>' +
        '¿Qué variable falta por incluir en el estado?';
    },
    fields: [{ name: 'v', label: 'falta saber…', w: 'wide' }],
    sol: function (d) { return { v: d.variable }; },
    check: function (v, d) {
      // se acepta cualquier respuesta que mencione la idea clave
      var s = String(v.raw.v || '').toLowerCase();
      if (s.length < 4) return { ok: false, msg: 'Descríbelo con unas palabras.' };
      var claves = {
        'si la luz estaba encendida o apagada': /luz|encendid|apagad|estado anterior|antes/,
        'la opción seleccionada antes de pulsar': /opci|selecc|elegid|configur|leche|antes/,
        'la planta en la que está el ascensor': /planta|piso|d[oó]nde|posici|est[aá]|altura/,
        'si el resultado estaba guardado en la caché': /cach|guardad|memoria|calculad|antes|repetid/,
        'si la temperatura venía subiendo o bajando': /sub|baj|tendencia|ven[ií]a|direcci|hist/,
        'cuánto tiempo lleva en el estado actual': /tiempo|cu[aá]nto lleva|temporiz|ciclo|espera/
      };
      var re = claves[d.variable];
      return { ok: !!(re && re.test(s)) };
    },
    hint: function () { return 'Pregúntate qué tendrías que saber, además de lo que se ve, para predecir con seguridad qué va a pasar.'; },
    steps: function (d) {
      return [
        'El sistema no es aleatorio: desde el mismo estado hace siempre lo mismo.',
        'Si observas dos respuestas distintas, es que los dos casos <em>no partían del mismo estado</em>, aunque lo parecieran.',
        'Aquí falta por incluir: <strong>' + d.variable + '</strong>.',
        'Al añadirlo a la descripción del estado, el comportamiento vuelve a ser perfectamente predecible.'
      ];
    },
    answer: function (d) { return d.variable; }
  });

  p.exercise({
    title: 'Ajusta una recta a cinco medidas',
    level: 'avanzado',
    gen: function (r) {
      var a = r.pm(1, 3), b = r.int(-3, 5), k = r.int(1, 2);
      var patron = r.pick([[1, -1, 0, -1, 1], [-1, 2, 0, -2, 1], [2, -1, -2, -1, 2], [1, -2, 0, 2, -1]]);
      var xs = [1, 2, 3, 4, 5], ys = xs.map(function (x, i) { return a * x + b + k * patron[i]; });
      return { a: a, b: b, xs: xs, ys: ys, extremos: (ys[4] - ys[0]) / 4 };
    },
    ask: function (d) {
      return 'Al sondear una caja negra con las entradas $x = 1, 2, 3, 4, 5$ se obtienen las salidas $y = ' + d.ys.join(',\\ ') +
        '$. Calcula la recta de mínimos cuadrados $y = ax + b$.';
    },
    fields: [{ name: 'a', label: 'a =', w: 'tiny' }, { name: 'b', label: 'b =', w: 'tiny' }],
    sol: function (d) { return { a: d.a, b: d.b }; },
    tol: 1e-6,
    errores: [{ si: function (v, d) { return Math.abs(d.extremos - d.a) > 1e-9 && Math.abs(v.a - d.extremos) < 1e-6; }, msg: 'Esa es la pendiente entre el primer punto y el último: ignora los otros tres. Mínimos cuadrados usa todas las medidas.' }],
    hint: function () { return ['Calcula las medias: $\\overline{x} = 3$ e $\\overline{y}$.', 'Con $x = 1, \\dots, 5$, las desviaciones de $x$ son $-2, -1, 0, 1, 2$ y la suma de sus cuadrados es 10.']; },
    steps: function (d) {
      var my = ML.mean(d.ys), dev = d.ys.map(function (y) { return y - my; });
      var prods = dev.map(function (e, i) { return (d.xs[i] - 3) * e; }), S = prods.reduce(function (s, t) { return s + t; }, 0);
      return ['$\\overline{x} = 3$, $\\overline{y} = ' + U.fmt(my, 2) + '$',
        'Productos $(x_i - \\overline{x})(y_i - \\overline{y})$: $' + prods.map(function (t) { return U.fmt(t, 2); }).join(',\\ ') + '$, que suman $' + U.fmt(S, 2) + '$.',
        '$a = \\dfrac{' + U.fmt(S, 2) + '}{10} = ' + d.a + '$',
        '$b = ' + U.fmt(my, 2) + ' - ' + (d.a < 0 ? '(' + d.a + ')' : d.a) + '\\cdot 3 = ' + d.b + '$'];
    },
    answer: function (d) { return 'y = ' + d.a + 'x ' + (d.b < 0 ? '− ' + (-d.b) : '+ ' + d.b); }
  });

  p.keys([
    'Con entradas y salidas numéricas y ruido, la caja se imita con un modelo ajustado: la recta de mínimos cuadrados minimiza la suma de los cuadrados de los residuos.',
    'El <strong>estado</strong> de un sistema es lo que hay que conocer para saber qué hará a continuación.',
    'Una <strong>transformación</strong> asigna a cada estado el siguiente; es una aplicación del conjunto de estados en sí mismo.',
    'Un sistema está <strong>determinado por su estado</strong> si desde el mismo estado hace siempre lo mismo.',
    'Si parece caprichoso, casi siempre falta una variable por incluir en el estado, no es que sea aleatorio.',
    'Con $n$ estados y $m$ mandos hacen falta $n\\cdot m$ observaciones para reconstruir la tabla entera.',
    'Dos cajas que responden igual a todo experimento posible son, para quien mira desde fuera, la misma caja.'
  ]);

});
