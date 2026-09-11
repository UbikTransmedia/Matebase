/* Tema: Inferencia causal */
Course.topic('pe-causal', function (p) {

  p.puente('En [[pe-bidimensional|el tema de regresión]] apareció una advertencia en mayúsculas: <strong>correlación no ' +
    'implica causalidad</strong>. Es cierta, es importante y se repite en todas partes. También es, ' +
    'tal como suele contarse, profundamente insatisfactoria, porque deja al alumno con el ' +
    'escepticismo y sin la herramienta. Este tema pone la herramienta, y para ello usa dos cosas ya ' +
    'vistas: la tabla de contingencia y el muestreo aleatorio.');

  p.text('Si dos cosas van juntas y eso no basta para decir que una causa la otra, ¿entonces qué? ' +
    'Porque alguna manera habrá de averiguarlo: los médicos deciden qué fármaco recetar, los ' +
    'ingenieros deciden qué pieza cambiar, y no lo hacen a ciegas. Este tema va de eso: de los ' +
    'métodos que convierten una sospecha en una conclusión, y de por qué un ensayo clínico reparte ' +
    'a los pacientes echándolo a suertes.');

  p.text('Es, probablemente, el contenido más directamente aprovechable de todo el bloque. No para ' +
    'aprobar un examen: para leer un periódico.');

  p.section('Ver no es lo mismo que intervenir');

  p.text('La idea central cabe en una distinción que parece de perogrullo y que resuelve la mitad de ' +
    'las confusiones:');

  p.list([
    '<strong>Observar</strong>: mirar lo que pasa y anotarlo. «Entre quienes toman vitaminas hay menos infartos.»',
    '<strong>Intervenir</strong>: cambiar algo a propósito y ver qué ocurre. «Si a este grupo le doy vitaminas, ¿tendrá menos infartos que aquel?»'
  ]);

  p.text('Los datos observacionales responden a la primera pregunta y la gente los usa para contestar ' +
    'la segunda. Ahí está el error, y no es un error de cálculo: es que <strong>son preguntas ' +
    'distintas</strong>. Quien toma vitaminas por su cuenta es también quien hace deporte, quien va ' +
    'al médico y quien tiene dinero para comprarlas. La correlación mide el paquete entero.');

  p.note('Esta distinción ya salió en [[cib-caja-negra|el tema de la caja negra]]: allí se decía que ' +
    'un economista no abre el mercado, sino que sube un tipo de interés y observa. Eso es exactamente ' +
    'intervenir. La inferencia causal es la teoría de qué se puede concluir cuando <em>no</em> puedes ' +
    'intervenir y solo tienes lo que ya ha pasado.', null, 'Un eco de la cibernética');

  p.section('La variable de confusión');

  p.text('El helado y los ahogamientos, que ya conoces, son el ejemplo de manual. Vale la pena ' +
    'dibujar la estructura, porque una vez vista se reconoce en todas partes:');

  p.demo({
    title: 'El esquema de una confusión',
    intro: 'Tres formas distintas de que dos variables aparezcan correlacionadas. Solo una de ellas es causalidad. Cambia de esquema y fíjate en la dirección de las flechas: ahí está toda la diferencia.',
    build: function (host) {
      var cual = 'conf';
      var casos = {
        causa: {
          t: 'Causalidad directa',
          d: '<strong>Fumar → cáncer de pulmón.</strong> Aquí la flecha existe de verdad: si ' +
            'intervienes sobre la causa, el efecto cambia. Dejar de fumar reduce el riesgo.',
          nodos: [[-2.4, 0, 'X', 0], [2.4, 0, 'Y', 1]],
          flechas: [[-2.4, 0, 2.4, 0]]
        },
        conf: {
          t: 'Variable de confusión',
          d: '<strong>Helados ↔ ahogamientos, con el calor detrás.</strong> No hay flecha entre X e ' +
            'Y, pero ambas dependen de Z. Correlacionan perfectamente y no se causan nada. Si ' +
            'prohíbes los helados, no se ahoga menos gente.',
          nodos: [[-2.4, -1.2, 'X', 0], [2.4, -1.2, 'Y', 1], [0, 1.5, 'Z', 3]],
          flechas: [[0, 1.5, -2.4, -1.2], [0, 1.5, 2.4, -1.2]]
        },
        inversa: {
          t: 'Causalidad inversa',
          d: '<strong>«Los hospitales matan»:</strong> hay más muertes entre quienes ingresan en un ' +
            'hospital. La flecha va al revés de lo que sugiere el titular: es estar grave lo que te ' +
            'lleva al hospital, no el hospital lo que te agrava.',
          nodos: [[-2.4, 0, 'X', 0], [2.4, 0, 'Y', 1]],
          flechas: [[2.4, 0, -2.4, 0]]
        },
        seleccion: {
          t: 'Sesgo de selección',
          d: '<strong>Solo miras una parte de los datos, y esa parte miente.</strong> Entre los ' +
            'aviones que vuelven del combate, los agujeros están en las alas; no porque las alas ' +
            'sean lo vulnerable, sino porque los que recibían en el motor no volvían.',
          nodos: [[-2.4, 0, 'X', 0], [2.4, 0, 'Y', 1], [0, -1.6, 'S', 'bad']],
          flechas: [[-2.4, 0, 0, -1.6], [2.4, 0, 0, -1.6]]
        }
      };
      var out = W.readout(host, '');
      var plot = W.board(host, {
        xmin: -4, xmax: 4, ymin: -2.6, ymax: 2.6, height: 250,
        grid: false, axes: false, xlabel: null, ylabel: null,
        draw: function (g) {
          var C = casos[cual];
          C.flechas.forEach(function (f) {
            var dx = f[2] - f[0], dy = f[3] - f[1];
            var L = Math.sqrt(dx * dx + dy * dy);
            var k = 0.42 / L;
            g.vec(f[0] + dx * k, f[1] + dy * k, f[2] - dx * k, f[3] - dy * k,
              { color: 'ink', w: 2.2 });
          });
          C.nodos.forEach(function (nd) {
            g.circle(nd[0], nd[1], 0.42, { color: nd[3], fill: nd[3], fillAlpha: .22, w: 2.2 });
            g.text(nd[0], nd[1], nd[2], { align: 'center', baseline: 'middle', size: 16, bold: true, color: 'ink' });
          });
        }
      });
      function paint() {
        var C = casos[cual];
        out.set('<strong>' + C.t + '</strong><br>' + C.d);
        plot.render();
      }
      W.chips(host, [
        { label: 'confusión', value: 'conf' },
        { label: 'causa real', value: 'causa' },
        { label: 'causa inversa', value: 'inversa' },
        { label: 'selección', value: 'seleccion' }
      ], { value: 'conf', on: function (v) { cual = v; paint(); } });
      W.hint(host, 'X e Y son las dos variables que ves correlacionadas. Z es una causa común que ' +
        'quizá no has medido. S es el filtro por el que han pasado los datos que tienes.');
      paint();
    }
  });

  p.text('Una <strong>variable de confusión</strong> es una tercera variable que influye a la vez ' +
    'sobre la supuesta causa y sobre el supuesto efecto. Su firma es inconfundible: la correlación ' +
    'es real, los datos son correctos, y la conclusión es falsa.');

  p.comprueba('En los meses en que se venden más helados hay más ahogamientos. Si un ayuntamiento prohibiera los helados, ¿bajarían los ahogamientos?', [
    { t: 'No: los dos dependen del calor, y quitar uno no toca al otro', ok: true, por: 'El calor lleva a la gente al agua y a comprar helados. Intervenir sobre los helados no cambia el calor ni los baños: la correlación desaparecería y los ahogamientos, no.' },
    { t: 'Algo sí: la correlación es muy fuerte', ok: false, por: 'La fuerza de la correlación no dice nada sobre la dirección de las flechas. Aquí no hay flecha entre helados y ahogamientos; las dos salen del calor.' },
    { t: 'No se puede saber sin más datos', ok: false, por: 'Sí se puede, con lo que ya se sabe del mundo: el calor explica las dos cosas. Identificar la variable de confusión es lo que zanja la pregunta, no más datos de lo mismo.' }
  ]);

  p.util('El caso con más consecuencias de la historia reciente: durante décadas se observó que las ' +
    'mujeres que tomaban terapia hormonal sustitutiva tenían menos enfermedad coronaria, y se recetó ' +
    'masivamente por esa razón. En 2002, un ensayo aleatorizado con más de 16 000 participantes ' +
    'encontró lo contrario: el riesgo <em>subía</em>. La confusión era el nivel socioeconómico: las ' +
    'mujeres que recibían la terapia iban más al médico, hacían más ejercicio y fumaban menos. ' +
    'Millones de recetas basadas en una correlación bien medida y mal interpretada.');

  p.section('La paradoja de Simpson');

  p.text('Hay un caso extremo de confusión que merece nombre propio, porque no se limita a exagerar ' +
    'un efecto: <strong>le da la vuelta</strong>. Un tratamiento puede ser mejor para los hombres, ' +
    'mejor para las mujeres, y peor para el total.');

  p.text('Suena imposible. No lo es, y con números pequeños se ve enseguida.');

  p.demo({
    title: 'El mismo dato, dos conclusiones opuestas',
    intro: 'Dos tratamientos para una piedra en el riñón. Mira primero el total y decide cuál es mejor. Después separa por tamaño de la piedra y vuelve a decidir. Los datos son reales, del estudio de Charig de 1986.',
    predice: 'Antes de separar: si A gana en piedras pequeñas y también en piedras grandes, ¿puede perder en el total? Apuesta sí o no, y luego pulsa «separar por tamaño».',
    build: function (host) {
      var separado = false;
      var datos = {
        A: { peq: [81, 87], gra: [192, 263] },
        B: { peq: [234, 270], gra: [55, 80] }
      };
      var out = W.readout(host, '');
      var plot = W.plot(host, {
        xmin: -0.7, xmax: 3.2, ymin: 0, ymax: 100, height: 250,
        ylabel: '% de éxito', xlabel: null, grid: true, xticks: false,
        draw: function (g) {
          function pct(v) { return v[0] / v[1] * 100; }
          if (!separado) {
            var tA = (datos.A.peq[0] + datos.A.gra[0]) / (datos.A.peq[1] + datos.A.gra[1]) * 100;
            var tB = (datos.B.peq[0] + datos.B.gra[0]) / (datos.B.peq[1] + datos.B.gra[1]) * 100;
            g.rect(0.2, 0, 0.8, tA, { color: 0, fill: 0, fillAlpha: .45, w: 1.6 });
            g.rect(1.6, 0, 0.8, tB, { color: 1, fill: 1, fillAlpha: .45, w: 1.6 });
            g.text(0.6, tA + 4, 'A: ' + U.fmt(tA, 1) + ' %', { align: 'center', size: 13, color: 'ink' });
            g.text(2.0, tB + 4, 'B: ' + U.fmt(tB, 1) + ' %', { align: 'center', size: 13, color: 'ink' });
          } else {
            var xs = [0.05, 0.5, 1.6, 2.05];
            var vals = [pct(datos.A.peq), pct(datos.B.peq), pct(datos.A.gra), pct(datos.B.gra)];
            var cols = [0, 1, 0, 1];
            var etq = ['A', 'B', 'A', 'B'];
            for (var i = 0; i < 4; i++) {
              g.rect(xs[i], 0, 0.42, vals[i], { color: cols[i], fill: cols[i], fillAlpha: .45, w: 1.6 });
              g.text(xs[i] + 0.21, vals[i] + 4, etq[i] + ': ' + U.fmt(vals[i], 1) + ' %',
                { align: 'center', size: 12, color: 'ink' });
            }
            g.text(0.5, -7, 'piedras pequeñas', { align: 'center', size: 12.5, color: 'ink' });
            g.text(2.05, -7, 'piedras grandes', { align: 'center', size: 12.5, color: 'ink' });
          }
        }
      });
      function paint() {
        var tA = (datos.A.peq[0] + datos.A.gra[0]) / (datos.A.peq[1] + datos.A.gra[1]) * 100;
        var tB = (datos.B.peq[0] + datos.B.gra[0]) / (datos.B.peq[1] + datos.B.gra[1]) * 100;
        plot.view(-0.7, 3.2, separado ? -14 : 0, 100);
        if (!separado) {
          out.set('<strong>Mirando el total:</strong> A cura el ' + U.fmt(tA, 1) + ' % y B el ' +
            U.fmt(tB, 1) + ' %.<br>Conclusión aparente: <strong>B es mejor</strong>.');
        } else {
          out.set('<strong>Separando por tamaño de piedra:</strong><br>' +
            'Piedras pequeñas — A: ' + U.fmt(datos.A.peq[0] / datos.A.peq[1] * 100, 1) + ' % · B: ' +
            U.fmt(datos.B.peq[0] / datos.B.peq[1] * 100, 1) + ' %<br>' +
            'Piedras grandes — A: ' + U.fmt(datos.A.gra[0] / datos.A.gra[1] * 100, 1) + ' % · B: ' +
            U.fmt(datos.B.gra[0] / datos.B.gra[1] * 100, 1) + ' %<br>' +
            '<strong style="color:var(--bad)">A gana en los dos grupos.</strong> Y sin embargo pierde ' +
            'en el total.');
        }
        plot.render();
      }
      W.chips(host, [
        { label: 'ver el total', value: 'no' },
        { label: 'separar por tamaño', value: 'si' }
      ], { value: 'no', on: function (v) { separado = (v === 'si'); paint(); } });
      W.legend(host, [{ c: 0, t: 'tratamiento A (cirugía abierta)' }, { c: 1, t: 'tratamiento B (menos invasiva)' }]);
      paint();
    }
  });

  p.text('¿Dónde está el truco? En que los grupos no son comparables. A los pacientes con piedras ' +
    'grandes —los casos difíciles— se les aplicaba sobre todo el tratamiento A; a los de piedras ' +
    'pequeñas, sobre todo el B. Así que el promedio de A está lastrado por estar cargado de casos ' +
    'difíciles.');

  p.table(['Grupo', 'Tratamiento A', 'Tratamiento B'], [
    ['Piedras pequeñas', '81 / 87 = 93,1 %', '234 / 270 = 86,7 %'],
    ['Piedras grandes', '192 / 263 = 73,0 %', '55 / 80 = 68,8 %'],
    ['<strong>Total</strong>', '<strong>273 / 350 = 78,0 %</strong>', '<strong>289 / 350 = 82,6 %</strong>']
  ]);

  p.note('Y ahora la pregunta que de verdad importa: ¿cuál es la conclusión correcta? La ' +
    '<strong>separada</strong>, porque el tamaño de la piedra es una causa del éxito <em>y</em> ' +
    'condicionó qué tratamiento se aplicaba: es una variable de confusión de manual. Pero cuidado, ' +
    'porque no siempre es así: si la tercera variable fuera una <em>consecuencia</em> del ' +
    'tratamiento y no una causa previa, separar por ella sería precisamente el error. <strong>Los ' +
    'números no deciden esto</strong>: lo decide saber cómo funciona el asunto.',
    'warn', 'Los datos no bastan');

  p.text('Este es probablemente el punto más importante del tema. La estadística puede decirte que ' +
    'hay una asociación y puede decirte cuánto vale. No puede decirte, ella sola, qué causa qué: para ' +
    'eso hacen falta suposiciones sobre el mundo, y esas suposiciones hay que ponerlas encima de la ' +
    'mesa y discutirlas.');

  p.section('Aleatorizar: por qué se echa a suertes');

  p.text('Existe, sin embargo, una manera de eliminar <strong>todas</strong> las variables de ' +
    'confusión de un plumazo, incluidas las que no se te han ocurrido y las que no sabes medir. Es ' +
    'una de las ideas más bonitas de la ciencia y consiste en algo aparentemente frívolo: decidir a ' +
    'suertes quién recibe el tratamiento.');

  p.text('El razonamiento es este. Si el paciente, el médico o el azar sesgado deciden quién va a ' +
    'cada grupo, los grupos se diferenciarán en el tratamiento <em>y en otras cosas</em>. Si lo ' +
    'decide una moneda, los grupos se diferencian en el tratamiento y en <strong>nada más, salvo ' +
    'ruido</strong>: la edad, la dieta, el nivel de renta, la genética y los cien factores que ni ' +
    'siquiera has pensado se reparten por igual entre los dos, porque la moneda no sabe nada de ' +
    'ellos.');

  p.note('Aleatorizar no hace los grupos <em>idénticos</em>; los hace <strong>comparables</strong>. ' +
    'Siempre quedará algo de desequilibrio por azar, pero es un desequilibrio de tamaño conocido y ' +
    'calculable: exactamente el que estudiaste en muestreo e inferencia. Por eso un ensayo ' +
    'aleatorizado puede acompañar su conclusión de un intervalo de confianza, y un estudio ' +
    'observacional no.', 'ok', 'Qué garantiza el sorteo');

  p.demo({
    title: 'Repartir a suertes equilibra lo que no has medido',
    intro: 'Hay una variable oculta que influye en el resultado y que nadie ha medido. Compara qué pasa cuando los grupos se forman por elección propia y cuando se forman por sorteo. Genera muestras nuevas y mira la diferencia de comportamiento.',
    predice: 'Con «cada uno elige», ¿la diferencia entre grupos en la variable oculta será grande o pequeña? Y con el sorteo, ¿se hará exactamente cero o solo pequeña? ¿Qué pasará al subir los participantes?',
    build: function (host) {
      var n = 100, modo = 'auto', semilla = 1;
      var out = W.readout(host, '');
      function simular() {
        var r = U.rng(semilla);
        var g1 = [], g2 = [];
        for (var i = 0; i < n; i++) {
          var oculta = r.real(0, 1, 4);        // p. ej. «lleva vida sana»
          var grupo;
          if (modo === 'auto') grupo = (oculta > 0.5) ? 1 : 2;   // se autoselecciona
          else grupo = r.bool(0.5) ? 1 : 2;                       // sorteo
          (grupo === 1 ? g1 : g2).push(oculta);
        }
        return [g1, g2];
      }
      var plot = W.plot(host, {
        xmin: 0, xmax: 1, ymin: 0, ymax: 1.1, height: 230,
        xlabel: 'variable oculta (0 = mala salud previa, 1 = buena)', ylabel: null, yticks: false,
        draw: function (g) {
          var gs = simular();
          [0, 1].forEach(function (k) {
            var arr = gs[k], y = k === 0 ? 0.75 : 0.3;
            for (var i = 0; i < arr.length; i++) {
              g.point(arr[i], y + (i % 7) * 0.022 - 0.07, { color: k, r: 3.2, alpha: .75 });
            }
            if (arr.length) {
              g.vline(ML.mean(arr), { color: k, w: 2.2 });
            }
          });
        }
      });
      function paint() {
        var gs = simular();
        var m1 = gs[0].length ? ML.mean(gs[0]) : 0, m2 = gs[1].length ? ML.mean(gs[1]) : 0;
        out.set('<strong>' + (modo === 'auto' ? 'Cada uno elige su grupo' : 'Grupo asignado por sorteo') +
          '</strong><br>' +
          'Media de la variable oculta — grupo 1: ' + U.fmt(m1, 3) + ' · grupo 2: ' + U.fmt(m2, 3) +
          '<br>Diferencia: <strong style="color:' + (Math.abs(m1 - m2) > 0.15 ? 'var(--bad)' : 'var(--ok)') +
          '">' + U.fmt(Math.abs(m1 - m2), 3) + '</strong><br>' +
          '<span style="font-size:0.8125rem;color:var(--ink-faint)">' +
          (modo === 'auto'
            ? 'Los grupos son distintos de partida en algo que nadie ha medido. Cualquier diferencia ' +
              'de resultado se confundirá con el efecto del tratamiento.'
            : 'Los grupos salen parecidos en una variable que el sorteo ni siquiera conocía. Eso es lo ' +
              'que compra la aleatorización: comparabilidad en todo, incluso en lo desconocido.') +
          '</span>');
        plot.render();
      }
      W.chips(host, [
        { label: 'cada uno elige', value: 'auto' },
        { label: 'sorteo', value: 'rand' }
      ], { value: 'auto', on: function (v) { modo = v; paint(); } });
      W.slider(W.row(host), {
        label: 'participantes', min: 20, max: 400, step: 10, value: 100, dec: 0,
        on: function (v) { n = v; paint(); }
      });
      W.buttons(host, [{ t: '↺ Otra muestra', cls: 'btn--main', on: function () { semilla++; paint(); } }]);
      W.legend(host, [{ c: 0, t: 'grupo 1' }, { c: 1, t: 'grupo 2' }]);
      paint();
    }
  });

  p.section('La arquitectura de un ensayo clínico');

  p.text('Un ensayo bien hecho apila varias precauciones, y cada una tapa un agujero distinto:');

  p.table(['Precaución', 'Qué problema evita'], [
    ['<strong>Grupo de control</strong>', 'Sin él no sabes qué habría pasado igualmente. Mucha gente mejora sola.'],
    ['<strong>Aleatorización</strong>', 'Elimina las variables de confusión, incluidas las no medidas.'],
    ['<strong>Placebo</strong>', 'Aísla el efecto del fármaco del efecto de creer que te tratan, que es real y medible.'],
    ['<strong>Ciego</strong>', 'El paciente no sabe qué recibe, así que no informa distinto según lo que espere.'],
    ['<strong>Doble ciego</strong>', 'Tampoco lo sabe quien evalúa: no puede sesgar la medición sin querer.'],
    ['<strong>Registro previo</strong>', 'Se declara qué se va a medir antes de mirar. Impide buscar a posteriori el resultado que salga bien.']
  ]);

  p.text('El último merece un comentario, porque es el más reciente y el menos conocido. Si mides ' +
    'veinte variables y publicas la que ha salido significativa, has fabricado un hallazgo de la ' +
    'nada: con veinte pruebas al 5 %, una sale «significativa» por puro azar. Declarar de antemano ' +
    'qué se va a medir es lo que impide ese juego, y su ausencia explica buena parte de los ' +
    'resultados científicos que luego no se han podido reproducir.');

  p.hist('El primer ensayo clínico controlado documentado lo hizo James Lind en 1747, a bordo del ' +
    'HMS Salisbury. Cogió doce marineros con escorbuto en estado parecido, los repartió en seis ' +
    'parejas y dio a cada pareja un remedio distinto: sidra, vitriolo, vinagre, agua de mar, una ' +
    'pasta de hierbas y dos naranjas con un limón. Los cítricos curaron. Lo notable no es el ' +
    'resultado —ya se sospechaba— sino el diseño: mismo barco, misma comida, mismo estado inicial, ' +
    'seis tratamientos en paralelo. Lo que faltaba, y tardaría dos siglos en llegar, era el sorteo: ' +
    'la aleatorización la introdujo Ronald Fisher en los años veinte, y no en medicina sino en ' +
    'agricultura, repartiendo al azar los fertilizantes entre parcelas de un campo.');

  p.section('Cuando no se puede aleatorizar');

  p.text('No siempre se puede sortear. No se puede asignar al azar a quién se le obliga a fumar, ni ' +
    'qué países entran en una guerra, ni quién nace en una familia pobre. Y sin embargo sabemos que ' +
    'el tabaco causa cáncer. ¿Cómo?');

  p.list([
    '<strong>Experimento natural</strong>: buscar una situación en la que algo parecido a un sorteo ha ocurrido solo. Una ley que entra en vigor en una comunidad y no en la vecina; una lotería que decide quién va al servicio militar.',
    '<strong>Controlar por las confusiones conocidas</strong>: comparar solo entre personas iguales en edad, renta y hábitos. Tapa las confusiones que se te han ocurrido, no las demás.',
    '<strong>Buscar el mecanismo</strong>: si además de la asociación entiendes <em>cómo</em> se produce el daño, la explicación causal se refuerza. Con el tabaco, se identificaron los carcinógenos concretos.',
    '<strong>Dosis-respuesta</strong>: si a más exposición hay más efecto, y de forma ordenada, la casualidad se vuelve menos creíble.',
    '<strong>Consistencia</strong>: el mismo resultado en poblaciones, países y décadas distintas, con confusiones distintas cada vez.'
  ]);

  p.text('Ninguno de estos criterios es una demostración. Juntos son un caso muy fuerte, y así es ' +
    'como se estableció la relación entre el tabaco y el cáncer de pulmón sin un solo ensayo ' +
    'aleatorizado. Conviene saber que el debate fue largo y que uno de los escépticos más tenaces ' +
    'fue Ronald Fisher, el inventor de la aleatorización, que sostuvo hasta el final que podía haber ' +
    'una predisposición genética confundiendo las dos cosas. Estaba equivocado, y su objeción era, ' +
    'formalmente, impecable.');

  p.util('Cada vez que leas un titular de salud o de economía, tienes ya las tres preguntas que lo ' +
    'desmontan o lo sostienen: <strong>¿es un experimento o una observación? ¿Con qué se compara? ' +
    '¿Qué tercera variable podría explicar las dos cosas a la vez?</strong> Con eso basta para ' +
    'clasificar correctamente la mayoría de las noticias, y para no cambiar de dieta cada seis meses.');

  p.ejemplo({
    title: 'Un titular pasado por las tres preguntas',
    enunciado: '«Los adolescentes que desayunan sacan mejores notas», dice un estudio con 5000 alumnos. ¿Hay que obligar a desayunar para subir las notas?',
    pasos: [
      { t: '<strong>¿Experimento u observación?</strong> Observación: nadie decidió quién desayunaba. Cada familia hace lo que hace, y el estudio ha anotado el resultado. Lo que se ha medido es una correlación.', antes: '¿Alguien asignó quién desayunaba y quién no, o se limitaron a mirar?' },
      { t: '<strong>¿Comparado con qué?</strong> Con los alumnos que no desayunan. La pregunta es si esos dos grupos son comparables en todo lo demás, y probablemente no lo son.', antes: '¿Los que desayunan y los que no se diferencian solo en el desayuno?' },
      { t: '<strong>¿Qué tercera variable?</strong> El entorno familiar. En una casa con horarios, dinero y atención hay desayuno y hay apoyo al estudio. Las dos cosas salen de lo mismo: es la estructura del helado y los ahogamientos.', antes: 'Piensa qué tipo de casa produce a la vez desayunos y buenas notas.' },
      { t: '<strong>Lo que no se puede descartar.</strong> Que el desayuno ayude algo, de verdad, por sí mismo. Los datos observacionales no lo confirman ni lo niegan: miden el paquete entero.' },
      { t: '<strong>Cómo se zanjaría.</strong> Con un ensayo aleatorizado: se sortean colegios que reciben desayuno gratuito y se comparan las notas con los que no. Se han hecho ensayos así con programas de desayuno escolar, y los efectos encontrados son mucho más modestos que la correlación de los estudios observacionales.', antes: '¿Qué diseño respondería a la pregunta de verdad?' }
    ],
    cierre: 'Tres preguntas, dos minutos, y el titular pasa de «causa» a «asociación con una confusión evidente». Ni descartarlo del todo ni creérselo: pedir el experimento.'
  });

  p.trampas([
    { e: '«Correlación no implica causalidad», y ahí se queda', por: 'Es el principio, no el final. Hay herramientas: aleatorizar, buscar la confusión, el mecanismo, la dosis-respuesta. El tabaco causa cáncer y nunca hubo un ensayo aleatorizado.' },
    { e: 'Creer que aleatorizar hace los grupos idénticos', por: 'Los hace <em>comparables</em>: quedan diferencias por azar, pero de tamaño conocido y calculable. Por eso un ensayo puede dar un intervalo de confianza.' },
    { e: 'Separar siempre por la tercera variable', por: 'Solo si es una causa previa, como el tamaño de la piedra. Si es una consecuencia del tratamiento, separar por ella es justamente el error. Lo deciden las flechas, no los números.' },
    { e: 'Fiarse de «controlado por edad y renta»', por: 'Tapa las confusiones que se le ocurrieron al autor. Las que no midió siguen ahí. Solo el sorteo las equilibra todas, incluidas las desconocidas.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Diagnostica la correlación',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { txt: 'Los niños con los pies más grandes leen mejor.', tipo: 'conf',
          por: 'La edad explica las dos cosas: los mayores tienen los pies más grandes y leen mejor.' },
        { txt: 'Las ciudades con más policías tienen más delitos.', tipo: 'inversa',
          por: 'Es al revés: donde hay más delincuencia se destinan más policías.' },
        { txt: 'Los pueblos con más cigüeñas tienen más nacimientos.', tipo: 'conf',
          por: 'El tamaño y el carácter rural del pueblo explican las dos cosas: más tejados donde anidar y más natalidad que en la ciudad.' },
        { txt: 'Fumar aumenta el riesgo de cáncer de pulmón.', tipo: 'causa',
          por: 'Hay mecanismo biológico identificado, relación dosis-respuesta y consistencia en decenas de poblaciones.' },
        { txt: 'Los aviones que vuelven tienen los impactos en las alas, no en el motor.', tipo: 'seleccion',
          por: 'Solo estás mirando los que volvieron. Los alcanzados en el motor no están en la muestra.' },
        { txt: 'Las startups de éxito tenían fundadores que abandonaron la carrera.', tipo: 'seleccion',
          por: 'Solo miras las que triunfaron. Nadie escribe artículos sobre los miles que abandonaron y fracasaron.' },
        { txt: 'Los países con más consumo de chocolate ganan más premios Nobel.', tipo: 'conf',
          por: 'La riqueza del país explica el chocolate y la inversión en investigación.' },
        { txt: 'Los pacientes de la UCI mueren más que los de planta.', tipo: 'inversa',
          por: 'Estar más grave es lo que te lleva a la UCI, no la UCI lo que te agrava.' },
        { txt: 'Lavarse las manos antes de operar reduce las muertes por infección.', tipo: 'causa',
          por: 'Semmelweis lo comprobó interviniendo: impuso el lavado y la mortalidad cayó del 18 % al 2 %.' },
        { txt: 'Los alumnos de las academias caras sacan mejor nota.', tipo: 'conf',
          por: 'La renta familiar influye en poder pagar la academia y en muchas otras ventajas educativas.' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return '«' + d.txt + '»<br><br>¿Qué explica mejor esta asociación?';
    },
    fields: [{ name: 'q', label: 'Diagnóstico', opts: [
      { t: 'causalidad real', v: 'causa' },
      { t: 'una variable de confusión', v: 'conf' },
      { t: 'causalidad inversa', v: 'inversa' },
      { t: 'sesgo de selección', v: 'seleccion' }
    ] }],
    sol: function (d) { return { q: d.tipo }; },
    hint: function () {
      return 'Pregúntate: ¿hay algo que cause las dos cosas a la vez? ¿Podría la flecha ir al revés? ' +
        '¿Estoy viendo todos los casos o solo los que superaron un filtro?';
    },
    steps: function (d) {
      var nombre = { conf: 'variable de confusión', causa: 'causalidad real',
        inversa: 'causalidad inversa', seleccion: 'sesgo de selección' }[d.tipo];
      return ['Se trata de <strong>' + nombre + '</strong>.', d.por];
    },
    answer: function (d) {
      return { conf: 'Confusión', causa: 'Causa real', inversa: 'Inversa', seleccion: 'Selección' }[d.tipo];
    }
  });

  p.exercise({
    title: '¿Qué le falta a este estudio?',
    level: 'medio',
    gen: function (r) {
      var casos = [
        { txt: 'Se da un jarabe a 200 niños con tos y a los diez días el 90 % está mejor. Se concluye que el jarabe funciona.',
          falta: 'control', por: 'Falta el <strong>grupo de control</strong>: casi toda la tos se cura sola en diez días. Sin comparación no hay conclusión.' },
        { txt: 'Se compara un fármaco con no dar nada. Los que lo reciben mejoran más y saben que lo están recibiendo.',
          falta: 'placebo', por: 'Falta el <strong>placebo</strong>: parte de la mejora puede venir de creerse tratado, que es un efecto real y medible.' },
        { txt: 'Los pacientes reciben el fármaco o el placebo al azar, pero el médico que evalúa la mejoría sabe quién ha recibido qué.',
          falta: 'ciego', por: 'Falta el <strong>doble ciego</strong>: quien evalúa puede sesgar la medición sin ninguna mala intención.' },
        { txt: 'Se miden 30 variables de salud y se publica la única en la que hubo diferencia significativa.',
          falta: 'registro', por: 'Falta el <strong>registro previo</strong>: con 30 pruebas al 5 %, una o dos salen significativas por puro azar.' },
        { txt: 'Los pacientes eligen si quieren el tratamiento nuevo o el de siempre, y luego se comparan los dos grupos.',
          falta: 'azar', por: 'Falta la <strong>aleatorización</strong>: quien elige lo nuevo puede ser sistemáticamente distinto (más joven, más informado, más grave).' }
      ];
      return r.pick(casos);
    },
    ask: function (d) {
      return d.txt + '<br><br>¿Qué precaución falta?';
    },
    fields: [{ name: 'q', label: 'Falta…', opts: [
      { t: 'el grupo de control', v: 'control' },
      { t: 'la aleatorización', v: 'azar' },
      { t: 'el placebo', v: 'placebo' },
      { t: 'el doble ciego', v: 'ciego' },
      { t: 'el registro previo', v: 'registro' }
    ] }],
    sol: function (d) { return { q: d.falta }; },
    hint: function () {
      return 'Pregúntate qué habría pasado sin hacer nada, si los grupos son comparables, si alguien ' +
        'sabe qué está recibiendo, y si se decidió antes qué se iba a medir.';
    },
    steps: function (d) { return [d.por]; },
    answer: function (d) {
      return { control: 'Grupo de control', azar: 'Aleatorización', placebo: 'Placebo',
        ciego: 'Doble ciego', registro: 'Registro previo' }[d.falta];
    }
  });

  p.exercise({
    title: 'Simpson con números nuevos',
    level: 'avanzado',
    gen: function (r) {
      // construir un caso donde A gana en ambos estratos y pierde en total
      for (var intento = 0; intento < 60; intento++) {
        var nAf = r.int(15, 40), nAd = r.int(140, 260);      // A: pocos faciles, muchos dificiles
        var nBf = r.int(140, 260), nBd = r.int(15, 40);      // B: al reves
        var pAf = r.int(88, 96) / 100, pBf = pAf - r.int(4, 10) / 100;
        var pAd = r.int(60, 76) / 100, pBd = pAd - r.int(4, 10) / 100;
        var eAf = Math.round(nAf * pAf), eAd = Math.round(nAd * pAd);
        var eBf = Math.round(nBf * pBf), eBd = Math.round(nBd * pBd);
        var tA = (eAf + eAd) / (nAf + nAd), tB = (eBf + eBd) / (nBf + nBd);
        if (tB - tA > 0.02 && eAf / nAf > eBf / nBf && eAd / nAd > eBd / nBd) {
          return { nAf: nAf, nAd: nAd, nBf: nBf, nBd: nBd, eAf: eAf, eAd: eAd, eBf: eBf, eBd: eBd,
            tA: tA * 100, tB: tB * 100 };
        }
      }
      return null;
    },
    ask: function (d) {
      return 'Dos tratamientos, casos fáciles y difíciles:<br>' +
        '<table class="tbl" style="margin:10px 0"><tr><th></th><th>A</th><th>B</th></tr>' +
        '<tr><td>fáciles</td><td>' + d.eAf + ' de ' + d.nAf + '</td><td>' + d.eBf + ' de ' + d.nBf + '</td></tr>' +
        '<tr><td>difíciles</td><td>' + d.eAd + ' de ' + d.nAd + '</td><td>' + d.eBd + ' de ' + d.nBd + '</td></tr>' +
        '</table>' +
        'Calcula el porcentaje de éxito <strong>total</strong> de cada tratamiento (un decimal).';
    },
    fields: [
      { name: 'a', label: 'Total A (%)', w: 'tiny' },
      { name: 'b', label: 'Total B (%)', w: 'tiny' }
    ],
    sol: function (d) { return { a: U.round(d.tA, 4), b: U.round(d.tB, 4) }; },
    tol: 2e-3,
    hint: function () {
      return 'Suma los éxitos de cada tratamiento y divide entre el total de casos que ha tratado. ' +
        'No promedies los dos porcentajes: los grupos no tienen el mismo tamaño.';
    },
    steps: function (d) {
      return ['A: $\\dfrac{' + d.eAf + ' + ' + d.eAd + '}{' + d.nAf + ' + ' + d.nAd + '} = \\dfrac{' +
        (d.eAf + d.eAd) + '}{' + (d.nAf + d.nAd) + '} = ' + U.fmt(d.tA, 1) + '\\%$',
        'B: $\\dfrac{' + d.eBf + ' + ' + d.eBd + '}{' + d.nBf + ' + ' + d.nBd + '} = \\dfrac{' +
        (d.eBf + d.eBd) + '}{' + (d.nBf + d.nBd) + '} = ' + U.fmt(d.tB, 1) + '\\%$',
        'Pero por separado A gana en fáciles (' + U.fmt(d.eAf / d.nAf * 100, 1) + ' % frente a ' +
        U.fmt(d.eBf / d.nBf * 100, 1) + ' %) <strong>y</strong> en difíciles (' +
        U.fmt(d.eAd / d.nAd * 100, 1) + ' % frente a ' + U.fmt(d.eBd / d.nBd * 100, 1) + ' %).',
        'Simpson otra vez: A trata sobre todo casos difíciles, y eso hunde su promedio global. La ' +
        'conclusión honrada es que <strong>A es mejor</strong>.'];
    },
    answer: function (d) { return 'A: ' + U.fmt(d.tA, 1) + ' % · B: ' + U.fmt(d.tB, 1) + ' %'; }
  });

  p.keys([
    '<strong>Observar no es intervenir.</strong> La correlación responde a una pregunta distinta de la que casi siempre se le hace.',
    'Una <strong>variable de confusión</strong> influye a la vez en la causa supuesta y en el efecto: los datos son correctos y la conclusión falsa.',
    'La <strong>paradoja de Simpson</strong> es el caso extremo: una asociación puede invertirse al separar por una tercera variable.',
    '<strong>Aleatorizar</strong> equilibra todas las variables de confusión, incluidas las no medidas. Es lo único que lo consigue.',
    'Un ensayo serio apila control, azar, placebo, doble ciego y registro previo. Cada pieza tapa un agujero distinto.',
    'Sin poder aleatorizar quedan los experimentos naturales, el mecanismo, la dosis-respuesta y la consistencia: no demuestran, pero convencen.',
    'Tres preguntas para cualquier titular: ¿experimento u observación? ¿comparado con qué? ¿qué tercera variable falta?'
  ]);
});
