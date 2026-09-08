/* Tema: La caja negra: sistemas, estados y transiciones */
Course.topic('cib-caja-negra', function (p) {

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
    'exactamente una aplicación de las del bloque 0: a cada estado le corresponde uno y solo uno. Lo ' +
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

  p.demo({
    title: 'Una caja negra que puedes sondear',
    intro: 'Dentro hay una máquina con cuatro estados y dos mandos. No puedes ver su tabla, pero sí pulsar los mandos y observar en qué estado queda. Púlsalos hasta que creas saber cómo funciona; el botón de abajo te descubre la tabla para comprobarlo.',
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
    fields: [{ name: 'fin', label: 'estado final', w: 'tiny' }],
    sol: function (d) {
      var s = d.ini;
      for (var i = 0; i < d.pasos; i++) s = d.destino[s];
      return { fin: d.NOM[s] };
    },
    check: function (v, d) {
      var s = d.ini;
      for (var i = 0; i < d.pasos; i++) s = d.destino[s];
      return { ok: String(v.raw.fin || '').trim().toUpperCase() === d.NOM[s] };
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

  p.keys([
    'El <strong>estado</strong> de un sistema es lo que hay que conocer para saber qué hará a continuación.',
    'Una <strong>transformación</strong> asigna a cada estado el siguiente; es una aplicación del conjunto de estados en sí mismo.',
    'Un sistema está <strong>determinado por su estado</strong> si desde el mismo estado hace siempre lo mismo.',
    'Si parece caprichoso, casi siempre falta una variable por incluir en el estado, no es que sea aleatorio.',
    'Con $n$ estados y $m$ mandos hacen falta $n\\cdot m$ observaciones para reconstruir la tabla entera.',
    'Dos cajas que responden igual a todo experimento posible son, para quien mira desde fuera, la misma caja.'
  ]);

});
