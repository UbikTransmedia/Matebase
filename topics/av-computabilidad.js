/* Tema: Computabilidad: Turing y Gödel */
Course.topic('av-computabilidad', function (p) {

  p.text('El bloque 0 de este curso empezaba preguntando qué significa que algo sea verdadero, y ' +
    'construyendo la maquinaria para demostrarlo. Este tema cierra ese arco con las dos preguntas ' +
    'que quedaron abiertas: <strong>¿se puede demostrar todo lo que es verdad?</strong> y ' +
    '<strong>¿se puede calcular todo lo que está bien definido?</strong>');

  p.text('Las dos respuestas son que no, las dos se obtuvieron en los años treinta y las dos usan ' +
    'el mismo truco: <strong>el argumento diagonal de Cantor</strong>, que ya conoces d[[av-infinito|el tema del ' +
    'infinito]]. Allí sirvió para demostrar que hay más números reales que naturales. Aquí va a servir ' +
    'para demostrar que hay más problemas que programas, que es la misma idea vestida de otra manera ' +
    'y con consecuencias mucho más incómodas.');

  p.note('Si el argumento diagonal no está fresco, merece la pena volver al tema del infinito antes ' +
    'de seguir. Todo lo demás de este tema es vocabulario nuevo alrededor de esa única idea; sin ' +
    'ella, las demostraciones parecen trucos.', null, 'Lo que hay que traer de antes');

  p.section('Qué significa «calcular»');

  p.text('Antes de 1936 nadie había definido con precisión qué es un cálculo. Se sabía calcular ' +
    '—llevábamos milenios haciéndolo— pero no había una definición que permitiera demostrar que ' +
    'algo <em>no</em> se puede calcular. Es difícil probar que una tarea es imposible si no has ' +
    'delimitado qué herramientas se admiten.');

  p.text('Alan Turing, con veintitrés años, propuso una definición asombrosamente pobre y por eso ' +
    'mismo convincente. Imaginó a una persona calculando con lápiz y papel, y fue quitando todo lo ' +
    'que no era imprescindible hasta quedarse con esto:');

  p.list([
    'una <strong>cinta</strong> infinita dividida en casillas, cada una con un símbolo de un alfabeto finito;',
    'un <strong>cabezal</strong> que lee una casilla, puede escribir en ella y moverse una posición a izquierda o derecha;',
    'un <strong>estado</strong> interno, de entre un número finito de estados posibles;',
    'una <strong>tabla</strong> finita de reglas: «si estoy en el estado $q$ y leo el símbolo $s$, escribo $s\'$, me muevo a un lado y paso al estado $q\'$».'
  ]);

  p.text('Eso es todo. No hay memoria de acceso aleatorio, ni aritmética, ni bucles: solo una tabla ' +
    'de reglas y una cinta. Y sin embargo <strong>no se conoce nada calculable que una máquina así no ' +
    'pueda calcular</strong>. Tu portátil no puede hacer nada que no pueda hacer esta cosa: puede ' +
    'hacerlo muchísimo más deprisa, que no es lo mismo.');

  p.demo({
    title: 'Una máquina de Turing en marcha',
    intro: 'Esta máquina suma uno a un número escrito en binario. Cuatro reglas, una cinta y un cabezal: no hay nada más dentro. Dale a los pasos y sigue el cabezal.',
    build: function (host) {
      var inicial = '1011';
      var paso = 0;
      /* Reglas: estado, lee -> escribe, mueve, nuevo estado
         q0: ir al final. q1: sumar 1 propagando el acarreo. qf: parar. */
      var reglas = {
        'q0,0': ['0', 1, 'q0'], 'q0,1': ['1', 1, 'q0'], 'q0,_': ['_', -1, 'q1'],
        'q1,0': ['1', -1, 'qf'], 'q1,1': ['0', -1, 'q1'], 'q1,_': ['1', -1, 'qf']
      };
      function estadoEn(k) {
        var cinta = ('_' + inicial + '_').split('');
        var pos = 1, q = 'q0';
        for (var i = 0; i < k && q !== 'qf'; i++) {
          var s = cinta[pos] === undefined ? '_' : cinta[pos];
          var r = reglas[q + ',' + s];
          if (!r) break;
          cinta[pos] = r[0];
          pos += r[1];
          if (pos < 0) { cinta.unshift('_'); pos = 0; }
          if (pos >= cinta.length) cinta.push('_');
          q = r[2];
        }
        return { cinta: cinta, pos: pos, q: q };
      }
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.5, xmax: 8.5, ymin: -1.6, ymax: 1.6, height: 190,
        grid: false, axes: false, xlabel: null, ylabel: null,
        draw: function (g) {
          var e = estadoEn(paso);
          for (var i = 0; i < e.cinta.length && i < 9; i++) {
            var act = (i === e.pos);
            g.rect(i - 0.42, -0.45, 0.84, 0.9,
              { color: act ? 2 : 'axis', fill: act ? 2 : null, fillAlpha: .2, w: act ? 2.4 : 1.3 });
            g.text(i, 0, e.cinta[i] === '_' ? '␣' : e.cinta[i],
              { align: 'center', baseline: 'middle', size: 17, bold: true, color: 'ink' });
          }
          if (e.pos < 9) {
            g.vec(e.pos, 1.25, e.pos, 0.55, { color: 2, w: 2.4 });
            g.text(e.pos, 1.45, e.q, { align: 'center', size: 13, bold: true, color: 2 });
          }
        }
      });
      function paint() {
        var e = estadoEn(paso);
        var bits = e.cinta.join('').replace(/_/g, '');
        out.set('Paso <strong>' + paso + '</strong> · estado <strong>' + e.q + '</strong>' +
          (e.q === 'qf' ? ' <span style="color:var(--ok)">(parada)</span>' : '') + '<br>' +
          'Cinta: <code>' + e.cinta.join('') + '</code><br>' +
          'Valor: ' + inicial + '₂ = ' + parseInt(inicial, 2) + ' &nbsp;→&nbsp; ' + bits + '₂ = ' +
          (parseInt(bits, 2) || 0) +
          '<br><span style="font-size:0.8125rem;color:var(--ink-faint)">Seis reglas y ninguna idea ' +
          'de qué es sumar. La suma <em>emerge</em> de mover el cabezal y cambiar símbolos.</span>');
        plot.render();
      }
      // El ejercicio de mas abajo pide contar pasos para cualquier numero
      // entre 3 y 30: la demostracion tiene que dejar probarlos todos, o el
      // alumno no tiene con que comprobarse.
      W.slider(W.row(host), {
        label: 'número de entrada', min: 3, max: 30, step: 1, value: 11, dec: 0,
        on: function (v) { inicial = v.toString(2); paso = 0; paint(); }
      });
      W.buttons(host, [
        { t: 'Siguiente paso →', cls: 'btn--main', on: function () { paso++; paint(); } },
        { t: 'Hasta el final', on: function () { paso = 20; paint(); } },
        { t: '↺ Reiniciar', on: function () { paso = 0; paint(); } }
      ]);
      W.hint(host, 'El estado q0 recorre el número hasta el final. El q1 vuelve sumando 1 y ' +
        'arrastrando el acarreo. Prueba con el 7 (111 en binario) y verás propagarse el acarreo tres ' +
        'casillas seguidas; con el 8 (1000) el acarreo se para en la primera. El contador de pasos de ' +
        'arriba es el mismo que te pide el ejercicio.');
      paint();
    }
  });

  p.hist('La definición de Turing no fue la única. Alonzo Church había propuesto meses antes el ' +
    '<em>cálculo lambda</em>, Gödel y Herbrand las <em>funciones recursivas</em>, y Post un modelo ' +
    'parecido al de Turing. Lo llamativo es que se demostró que <strong>los cuatro definen ' +
    'exactamente la misma clase de funciones</strong>, siendo formalismos que no se parecen en nada. ' +
    'Esa coincidencia es la base de la <em>tesis de Church-Turing</em>: la convicción de que estos ' +
    'modelos capturan la noción intuitiva de «calculable». No es un teorema, porque «calculable a ' +
    'mano» no es un concepto matemático; es una hipótesis que lleva noventa años sin un solo ' +
    'contraejemplo.');

  p.section('Hay más problemas que programas');

  p.text('Aquí es donde vuelve Cantor. Vamos a contar dos cosas y a comparar sus tamaños, ' +
    'exactamente igual que se hizo con $\\mathbb{N}$ y $\\mathbb{R}$.');

  p.sub('Los programas son numerables');

  p.text('Un programa es un texto finito escrito con un alfabeto finito. Se pueden ordenar: primero ' +
    'los de una letra, después los de dos, después los de tres, y dentro de cada grupo por orden ' +
    'alfabético. Esa lista los alcanza a todos, y por tanto <strong>hay tantos programas como números ' +
    'naturales</strong>. Puede parecer poco intuitivo —son infinitos y larguísimos— pero es el mismo ' +
    'argumento con el que se numeraron los racionales.');

  p.sub('Los problemas no lo son');

  p.text('Llamemos «problema» a una función que a cada número natural le asigna un sí o un no. Por ' +
    'ejemplo, «¿es $n$ primo?». Un problema así es una lista infinita de ceros y unos.');

  p.text('¿Cuántos hay? Exactamente los mismos que números reales entre 0 y 1 escritos en binario, ' +
    'y de esos ya sabes por la diagonal de Cantor que hay más que naturales. Por tanto:');

  p.formula('\\#\\{\\text{programas}\\} = \\aleph_0 \\ < \\ \\#\\{\\text{problemas}\\} = 2^{\\aleph_0}',
    'el recuento demoledor',
    'Se dice: <em>«el cardinal del conjunto de los programas es alef sub cero, estrictamente menor ' +
      'que el cardinal del conjunto de los problemas, que es dos elevado a alef sub ' +
      'cero»</em>.<br><br>$\\aleph$ es la primera letra del alfabeto hebreo, <em>alef</em>, y ' +
      '$\\aleph_0$ es el nombre que Cantor le dio al tamaño del infinito de los naturales. El ' +
      'símbolo $\\#$ delante de un conjunto significa «cuántos elementos tiene».');

  p.note('La conclusión es brutal y no ha costado nada: como hay muchísimos más problemas que ' +
    'programas, <strong>casi todos los problemas no tienen programa que los resuelva</strong>. Y ' +
    '«casi todos» aquí es literal en el sentido más fuerte: los computables son una porción tan ' +
    'pequeña del total que, si se pudiera elegir un problema al azar, la probabilidad de que fuera ' +
    'computable sería cero.', 'warn', 'Casi nada se puede calcular');

  p.text('Este argumento tiene, eso sí, una debilidad: demuestra que los problemas incomputables ' +
    'existen a montones, pero <strong>no señala ninguno</strong>. Es una demostración de existencia ' +
    'pura, de las que a un ingeniero no le sirven de mucho. Turing hizo lo difícil: dar un problema ' +
    'concreto, natural y de interés práctico que ningún programa resuelve.');

  p.section('El problema de la parada');

  p.text('El problema es este, y merece la pena leerlo dos veces porque parece perfectamente ' +
    'razonable:');

  p.note('<strong>Dado un programa $P$ y una entrada $x$, decidir si $P(x)$ acaba alguna vez o se ' +
    'queda dando vueltas para siempre.</strong>', null, 'El problema de la parada');

  p.text('No se pide ejecutarlo —eso no sirve: si lleva una hora corriendo, no sabes si acabará en ' +
    'un minuto o nunca—. Se pide un programa <code>PARA(P, x)</code> que analice el código y ' +
    'responda sí o no, siempre, en tiempo finito.');

  p.text('Turing demostró en 1936 que ese programa no puede existir. La demostración es corta y usa ' +
    'la diagonal:');

  p.list([
    'Supón que existe <code>PARA(P, x)</code>, que siempre acierta y siempre responde.',
    'Con él construyo este programa, al que llamo <code>REBELDE</code>: <em>«dado un programa P, si <code>PARA(P, P)</code> dice que sí, entra en un bucle infinito; si dice que no, acaba inmediatamente».</em>',
    '<code>REBELDE</code> es un programa perfectamente escribible: solo llama a <code>PARA</code> y hace lo contrario de lo que le diga.',
    'Y ahora la pregunta envenenada: <strong>¿qué hace <code>REBELDE(REBELDE)</code>?</strong>'
  ], true);

  p.text('Si para, es porque <code>PARA</code> dijo que no paraba. Si no para, es porque ' +
    '<code>PARA</code> dijo que sí paraba. En los dos casos <code>PARA</code> se equivoca, y habíamos ' +
    'supuesto que nunca se equivoca. La única hipótesis que se puede retirar es la existencia de ' +
    '<code>PARA</code>. Por reducción al absurdo —la misma técnica del bloque 0—, no existe.');

  p.demo({
    title: 'La contradicción de REBELDE',
    intro: 'Elige qué responde el oráculo PARA cuando se le pregunta por REBELDE consigo mismo, y sigue la cadena de consecuencias. Las dos ramas acaban en el mismo sitio.',
    build: function (host) {
      var resp = 'si';
      var out = W.readout(host, '');
      function paint() {
        if (resp === 'si') {
          out.set('<strong>PARA(REBELDE, REBELDE) responde: «sí, para».</strong><br><br>' +
            '→ Entonces, por su propia definición, REBELDE entra en un bucle infinito.<br>' +
            '→ Así que REBELDE(REBELDE) <strong>no para</strong>.<br>' +
            '→ Pero PARA había dicho que sí paraba.<br><br>' +
            '<strong style="color:var(--bad)">Contradicción.</strong>');
        } else {
          out.set('<strong>PARA(REBELDE, REBELDE) responde: «no, no para».</strong><br><br>' +
            '→ Entonces, por su propia definición, REBELDE termina inmediatamente.<br>' +
            '→ Así que REBELDE(REBELDE) <strong>sí para</strong>.<br>' +
            '→ Pero PARA había dicho que no paraba.<br><br>' +
            '<strong style="color:var(--bad)">Contradicción.</strong>');
        }
      }
      W.chips(host, [
        { label: 'PARA dice «sí para»', value: 'si' },
        { label: 'PARA dice «no para»', value: 'no' }
      ], { value: 'si', on: function (v) { resp = v; paint(); } });
      W.hint(host, 'No hay tercera opción: PARA tenía que responder siempre una de las dos. Como las ' +
        'dos llevan a contradicción, lo que no puede existir es PARA.');
      paint();
    }
  });

  p.text('Fíjate en el parentesco con la diagonal de Cantor. Allí se construía un número que ' +
    'difería del $n$-ésimo de la lista en la cifra $n$; aquí se construye un programa que hace lo ' +
    'contrario de lo que el oráculo predice de él mismo. En los dos casos, la clave es ' +
    '<strong>aplicar el objeto a sí mismo</strong>, y en los dos casos la lista se muerde la cola.');

  p.util('Esto no es una curiosidad de lógicos: es la razón de que ningún antivirus pueda garantizar ' +
    'que un archivo es inofensivo, de que ningún compilador pueda avisarte con seguridad de todos ' +
    'los bucles infinitos de tu programa, y de que las herramientas de verificación de software sean ' +
    'siempre conservadoras —dan falsos positivos a propósito, porque la alternativa es dar falsos ' +
    'negativos—. Cuando un analizador estático dice «posible fuga de memoria» en vez de «hay fuga de ' +
    'memoria», está reconociendo el teorema de Turing.');

  p.text('Y no se salva casi nada. El <strong>teorema de Rice</strong>, de 1951, generaliza el ' +
    'resultado de la peor manera posible: <em>cualquier</em> propiedad no trivial sobre lo que hace ' +
    'un programa —no sobre cómo está escrito, sino sobre su comportamiento— es indecidible. Saber si ' +
    'dos programas hacen lo mismo, si alguno devuelve siempre un número positivo, si alguna vez ' +
    'accede a un fichero: nada de eso se puede decidir en general.');

  p.section('Gödel: verdadero pero indemostrable');

  p.text('Cinco años antes que Turing, en 1931, Kurt Gödel había demolido un edificio parecido en ' +
    'lógica. Para entender qué demolió hay que saber qué se estaba construyendo.');

  p.text('David Hilbert había propuesto un programa para poner las matemáticas a salvo de ' +
    'paradojas: encontrar un sistema de axiomas que fuera <strong>completo</strong> —que toda ' +
    'afirmación verdadera se pudiera demostrar en él— y <strong>consistente</strong> —que no se ' +
    'pudiera demostrar una cosa y su contraria—, y demostrar esas dos propiedades con métodos ' +
    'incontestables. En 1930, en Königsberg, Hilbert cerró un discurso con su lema: <em>«debemos ' +
    'saber, sabremos»</em>. Al día siguiente, en la misma ciudad y en una sesión menor, un joven de ' +
    'veinticuatro años presentó el resultado que lo hacía imposible.');

  p.note('<strong>Primer teorema de incompletitud.</strong> En cualquier sistema de axiomas ' +
    'consistente y lo bastante rico para hablar de aritmética, existen afirmaciones que son ' +
    'verdaderas y que <em>no se pueden demostrar dentro del sistema</em>.', 'warn', 'Gödel, 1931');

  p.text('La idea de la demostración vuelve a ser la misma. Gödel encontró la manera de que las ' +
    'afirmaciones matemáticas hablaran de sí mismas: asignó a cada fórmula y a cada demostración un ' +
    'número —la <em>numeración de Gödel</em>— de forma que enunciados sobre números se pudieran leer ' +
    'como enunciados sobre demostraciones. Con esa herramienta construyó una fórmula que dice, en ' +
    'esencia:');

  p.formula('G \\equiv \\text{«esta afirmación no tiene demostración»}', 'la sentencia de Gödel',
    'Se dice: <em>«ge es, por definición, la afirmación esta afirmación no tiene ' +
      'demostración»</em>.<br><br>El símbolo $\\equiv$ —tres rayas en vez de dos— significa aquí ' +
      '«es, por definición»: no se está calculando nada, se le está poniendo nombre a un ' +
      'enunciado.<br><br>Lo difícil de creer no es la frase, que suena a juego de palabras, sino que ' +
      'Gödel consiguiera <strong>escribirla en el lenguaje de la aritmética</strong>, hablando solo ' +
      'de números. Ese fue el trabajo: la numeración de Gödel convierte «tener demostración» en una ' +
      'propiedad aritmética de un número.');

  p.text('Si $G$ fuera demostrable, sería falsa —porque afirma que no lo es— y el sistema estaría ' +
    'demostrando falsedades. Si el sistema es consistente, $G$ no es demostrable; y entonces lo que ' +
    '$G$ dice es exactamente lo que ocurre, o sea que $G$ es verdadera. Hay una verdad aritmética ' +
    'fuera del alcance de los axiomas.');

  p.text('Y añadir $G$ como axioma nuevo no arregla nada: el sistema ampliado tiene su propia ' +
    'sentencia indemostrable, y así para siempre. El <strong>segundo teorema</strong> remata: entre ' +
    'las cosas que un sistema no puede demostrar sobre sí mismo está su propia consistencia.');

  p.table(['Pregunta', 'Respuesta', 'Quién y cuándo'], [
    ['¿Se puede demostrar toda verdad aritmética?', 'No', 'Gödel, 1931'],
    ['¿Puede un sistema demostrar que él mismo es consistente?', 'No', 'Gödel, 1931'],
    ['¿Existe un método para decidir si una fórmula es demostrable?', 'No', 'Church y Turing, 1936'],
    ['¿Se puede decidir si un programa para?', 'No', 'Turing, 1936'],
    ['¿Alguna propiedad no trivial del comportamiento es decidible?', 'Ninguna', 'Rice, 1951']
  ]);

  p.hist('El programa de Hilbert no fue una ingenuidad: era la respuesta razonable a una crisis ' +
    'real. La paradoja de Russell —el conjunto de todos los conjuntos que no se contienen a sí ' +
    'mismos— había hecho saltar por los aires la teoría de conjuntos ingenua en 1901, y hacía falta ' +
    'un suelo firme. Gödel demostró que el suelo firme absoluto no existe, pero conviene no ' +
    'exagerar la conclusión: las matemáticas siguieron funcionando exactamente igual al día ' +
    'siguiente. Lo que se perdió no fue la fiabilidad, sino la aspiración a una garantía mecánica y ' +
    'definitiva. Y de las ruinas salió algo enorme: para demostrar que no hay un método que decida ' +
    'todo, Turing tuvo que definir con precisión qué es un método, y en esa definición está el ' +
    'ordenador.');

  p.util('El resultado de Turing es, literalmente, el acta de nacimiento de la informática. El ' +
    'artículo de 1936 no iba de construir máquinas: iba de demostrar un teorema negativo. Pero por ' +
    'el camino define la máquina universal —una máquina capaz de simular a cualquier otra leyendo su ' +
    'descripción de la cinta—, que es exactamente la idea de <strong>ordenador de programa ' +
    'almacenado</strong>: un aparato cuyo comportamiento no está en el hardware sino en unos datos ' +
    'que se le suministran. Todo lo que ejecutas hoy es un caso particular de esa construcción, ' +
    'inventada para probar que algo era imposible.');

  p.section('Qué queda en pie');

  p.text('Conviene terminar recolocando las piezas, porque estos teoremas se citan mucho y mal.');

  p.list([
    '<strong>No dicen que las matemáticas sean inconsistentes.</strong> Dicen que la consistencia no se puede demostrar desde dentro.',
    '<strong>No dicen que haya verdades incognoscibles.</strong> $G$ se puede demostrar en un sistema más fuerte; lo que no hay es un sistema que lo demuestre todo.',
    '<strong>No dicen que los humanos superen a las máquinas.</strong> Ese salto se ha propuesto muchas veces y ningún argumento ha resistido: nada garantiza que un cerebro sea consistente, ni que pueda ver la verdad de su propia sentencia de Gödel.',
    '<strong>No impiden verificar programas concretos.</strong> Lo indecidible es el caso general; en un programa dado, con sus bucles a la vista, muchas veces sí se puede demostrar que termina.'
  ]);

  p.text('Lo que sí queda, y es bastante: hay un límite, no está donde uno esperaría, y se puede ' +
    'localizar con precisión. Saber exactamente dónde termina lo que se puede calcular es, en sí ' +
    'mismo, una de las cosas que se pueden calcular.');

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: '¿Numerable o no?',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: 'los programas de ordenador escritos en Python', num: true,
          por: 'Cada programa es un texto finito sobre un alfabeto finito: se pueden ordenar por longitud y luego alfabéticamente.' },
        { t: 'las funciones de $\\mathbb{N}$ en $\\{0,1\\}$', num: false,
          por: 'Cada una es una sucesión infinita de ceros y unos: el argumento diagonal de Cantor demuestra que no caben en una lista.' },
        { t: 'los números racionales', num: true,
          por: 'Se numeran recorriendo en zigzag la tabla de fracciones, como viste en [[av-infinito|el tema del infinito]].' },
        { t: 'los subconjuntos de $\\mathbb{N}$', num: false,
          por: 'Un subconjunto equivale a una sucesión de síes y noes: hay $2^{\\aleph_0}$, estrictamente más que $\\aleph_0$.' },
        { t: 'las máquinas de Turing', num: true,
          por: 'Una máquina queda descrita por una tabla finita de reglas, o sea, por un texto finito.' },
        { t: 'los números reales del intervalo $[0,1]$', num: false,
          por: 'Es el resultado original de Cantor, demostrado con la diagonal.' },
        { t: 'los polinomios con coeficientes enteros', num: true,
          por: 'Cada uno se describe con una lista finita de enteros, y esas listas se pueden numerar.' },
        { t: 'los problemas de decisión sobre los naturales', num: false,
          por: 'Un problema de decisión es una función de $\\mathbb{N}$ en $\\{$sí, no$\\}$: hay tantos como reales.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return '¿Es numerable el conjunto de <strong>' + d.t + '</strong>?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Numerable = se puede poner en una ' +
        'lista infinita indexada por los naturales. Escribe <code>sí</code> o <code>no</code>.</span>';
    },
    fields: [{ name: 'q', label: 'Respuesta', w: 'wide', ph: 'sí / no' }],
    sol: function (d) { return { q: d.num ? 'si' : 'no' }; },
    check: function (v, d) {
      var q = U.eligeOpcion(v.raw.q, {
        si: /^s|si\b|numerable|contable|se puede/,
        no: /^n|no\b|no numerable|incontable|no se puede/
      });
      if (!q) return { ok: false, msg: 'Responde <strong>sí</strong> o <strong>no</strong>.' };
      return { ok: (q === 'si') === d.num };
    },
    hint: function () {
      return 'Pregúntate si cada elemento se puede describir con un <strong>texto finito</strong>. Si ' +
        'sí, es numerable. Si hace falta una cantidad infinita de información, casi seguro que no.';
    },
    steps: function (d) {
      return [d.por, d.num ? 'Es <strong>numerable</strong>.' : '<strong>No</strong> es numerable.'];
    },
    answer: function (d) { return d.num ? 'Sí, numerable' : 'No es numerable'; }
  });

  p.exercise({
    title: 'La máquina de sumar uno',
    level: 'medio',
    gen: function (r) {
      var n = r.int(3, 30);
      var bin = n.toString(2);
      // pasos: recorrer los bits (bin.length) + leer el blanco (1) + propagar acarreo
      var unosFinales = 0;
      for (var i = bin.length - 1; i >= 0 && bin[i] === '1'; i--) unosFinales++;
      var pasos = bin.length + 1 + unosFinales + 1;
      return { n: n, bin: bin, pasos: pasos, res: n + 1, resBin: (n + 1).toString(2) };
    },
    ask: function (d) {
      return 'La máquina del ejemplo suma 1 en binario: el estado $q_0$ avanza hasta pasarse del ' +
        'número, y el estado $q_1$ vuelve convirtiendo unos en ceros hasta encontrar un cero (o el ' +
        'blanco), que convierte en uno y para.<br><br>Con la entrada $' + d.bin + '_2 = ' + d.n +
        '$, ¿cuál es la cinta al parar (en binario) y cuántos pasos ha dado?<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Cuenta un paso por cada regla ' +
        'aplicada, incluida la que lleva al estado de parada.</span>';
    },
    fields: [
      { name: 'b', label: 'resultado binario', w: 'wide' },
      { name: 'p', label: 'pasos', w: 'tiny' }
    ],
    sol: function (d) { return { b: d.resBin, p: d.pasos }; },
    check: function (v, d) {
      var b = String(v.raw.b).replace(/\s/g, '').replace(/^0+(?=\d)/, '');
      var ob = (b === d.resBin);
      var op = Ex.same(v.p, d.pasos, 1e-9);
      return { ok: ob && op, fields: { b: ob, p: op } };
    },
    hint: function (d) {
      return 'El resultado es $' + d.n + ' + 1 = ' + d.res + '$ pasado a binario. Para los pasos: ' +
        d.bin.length + ' para recorrer el número, 1 para leer el blanco del final, y luego uno por ' +
        'cada 1 final que hay que convertir en 0, más el último.';
    },
    steps: function (d) {
      var unos = 0;
      for (var i = d.bin.length - 1; i >= 0 && d.bin[i] === '1'; i--) unos++;
      return ['$' + d.n + ' + 1 = ' + d.res + '$, que en binario es $' + d.resBin + '_2$.',
        'Pasos en $q_0$: ' + d.bin.length + ' (uno por cifra) más 1 al leer el blanco y girar.',
        'Pasos en $q_1$: ' + unos + ' unos finales que se vuelven ceros, más 1 para escribir el uno ' +
        'que cierra el acarreo.',
        'Total: $' + d.bin.length + ' + 1 + ' + unos + ' + 1 = ' + d.pasos + '$ pasos.'];
    },
    answer: function (d) { return d.resBin + '₂ en ' + d.pasos + ' pasos'; }
  });

  p.exercise({
    title: '¿Decidible o indecidible?',
    level: 'avanzado',
    gen: function (r) {
      var casos = [
        { t: '¿Este programa tiene más de 100 líneas?', dec: true,
          por: 'Es una propiedad del <strong>texto</strong> del programa, no de su comportamiento: se cuenta y ya está.' },
        { t: '¿Este programa termina con la entrada 7?', dec: false,
          por: 'Es el problema de la parada, restringido a una entrada. Sigue siendo indecidible.' },
        { t: '¿Este programa contiene la palabra <code>while</code>?', dec: true,
          por: 'Otra propiedad sintáctica: se busca en el texto.' },
        { t: '¿Estos dos programas devuelven siempre lo mismo?', dec: false,
          por: 'Es una propiedad no trivial del comportamiento: el teorema de Rice la declara indecidible.' },
        { t: '¿Este número $n$ es primo?', dec: true,
          por: 'Hay algoritmos que lo deciden siempre, en tiempo finito. Que sean lentos para números enormes es otra cuestión.' },
        { t: '¿Este programa devuelve alguna vez un número negativo?', dec: false,
          por: 'Propiedad no trivial del comportamiento: indecidible por Rice.' },
        { t: '¿Esta lista de números está ordenada?', dec: true,
          por: 'Se recorre comparando parejas consecutivas: termina siempre.' },
        { t: '¿Existe algún programa más corto que este que haga lo mismo?', dec: false,
          por: 'Es la complejidad de Kolmogórov, y es incomputable: se demuestra con un argumento diagonal muy parecido.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return '¿Es <strong>decidible</strong> la siguiente pregunta?<br><br>«' + d.t + '»<br>' +
        '<span style="font-size:0.875rem;color:var(--ink-faint)">Decidible = existe un algoritmo que ' +
        'siempre responde bien y siempre termina. Escribe <code>sí</code> o <code>no</code>.</span>';
    },
    fields: [{ name: 'q', label: 'Respuesta', w: 'wide', ph: 'sí / no' }],
    sol: function (d) { return { q: d.dec ? 'si' : 'no' }; },
    check: function (v, d) {
      var q = U.eligeOpcion(v.raw.q, {
        si: /^s|si\b|decidible|hay algoritmo|se puede/,
        no: /^n|no\b|indecidible|no se puede|imposible/
      });
      if (!q) return { ok: false, msg: 'Responde <strong>sí</strong> o <strong>no</strong>.' };
      return { ok: (q === 'si') === d.dec };
    },
    hint: function () {
      return 'La regla práctica del teorema de Rice: si la pregunta es sobre <em>cómo está escrito</em> ' +
        'el programa, suele ser decidible. Si es sobre <em>qué hace al ejecutarse</em>, casi nunca lo es.';
    },
    steps: function (d) {
      return [d.por, d.dec ? 'Es <strong>decidible</strong>.' : 'Es <strong>indecidible</strong>.'];
    },
    answer: function (d) { return d.dec ? 'Decidible' : 'Indecidible'; }
  });

  p.keys([
    'Una <strong>máquina de Turing</strong> —cinta, cabezal, estados y una tabla finita de reglas— captura todo lo que se puede calcular. Nada conocido la supera.',
    'Los programas son <strong>numerables</strong>; los problemas, no. Por puro recuento, casi ningún problema tiene solución algorítmica.',
    'El <strong>problema de la parada</strong> es indecidible: no hay programa que diga, en general, si otro programa termina.',
    'La demostración es el <strong>argumento diagonal</strong> de Cantor: se construye un programa que hace lo contrario de lo que el oráculo predice de él mismo.',
    '<strong>Gödel</strong>: en todo sistema consistente que hable de aritmética hay verdades indemostrables, y su propia consistencia es una de ellas.',
    'El teorema de <strong>Rice</strong> extiende la mala noticia: ninguna propiedad no trivial del comportamiento de un programa es decidible.',
    'De esta demostración imposible salió la <strong>máquina universal</strong>, que es la idea de ordenador.'
  ]);
});
