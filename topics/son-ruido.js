/* Tema: Ruido, percusión y la cuerda pulsada */
Course.topic('son-ruido', function (p) {

  p.puente('Todo lo que ha sonado hasta ahora era periódico: senos, sierras, sumas de armónicos. Pero ' +
    'un tambor, un plato, el viento o una consonante no tienen periodo. Su materia prima es el ' +
    '<strong>ruido</strong>, una lista de números al azar, y con las herramientas de los temas ' +
    'anteriores —una [[son-envolvente|envolvente]] y un [[son-filtros|filtro]]— el azar se convierte ' +
    'en percusión. Y al final del tema, con una idea de 1983, el ruido filtrado y realimentado se ' +
    'convierte en algo que nadie esperaría: una cuerda de guitarra.');

  p.section('Ruido blanco: todas las frecuencias a la vez');

  p.text('En el sintetizador, <code>ruido()</code> devuelve en cada muestra un número al azar entre ' +
    '$-1$ y $1$, uniforme e independiente del anterior (es la [[pe-probabilidad|probabilidad]] del ' +
    'bloque de estadística, muestra a muestra). Su espectro es plano: contiene todas las frecuencias ' +
    'con la misma amplitud media, igual que la luz blanca contiene todos los colores, y de ahí el ' +
    'nombre. Suena como una radio entre emisoras, o como una cascada.');

  p.formulas([
    '\\mu = 0, \\qquad \\sigma^2 = \\frac{1}{3}, \\qquad \\sigma = \\frac{1}{\\sqrt 3} \\approx 0{,}577',
    'A\\,\\text{uniforme en } [-1, 1] \\Rightarrow \\text{nivel eficaz (RMS)} = 0{,}577\\,A'
  ], 'lo que mide el ruido',
    'La media es cero, porque es simétrico. La varianza de una uniforme en $[-1, 1]$ es $\\frac{1}{3}$, y ' +
      'su raíz, la desviación típica, es el <strong>nivel eficaz</strong> del ruido: 0,577. Comparado con ' +
      'un seno de amplitud 1, cuyo nivel eficaz es $1/\\sqrt 2 = 0{,}707$, el ruido de amplitud 1 suena ' +
      'algo más bajo. Es el mismo cálculo de [[pe-descriptiva|varianza]] de siempre, aplicado a una ' +
      'lista de 44 100 números por segundo.');

  p.demo({
    title: 'Colorear el ruido',
    intro: 'Ruido blanco que pasa por el filtro de un polo del tema anterior. Con $a = 1$ es blanco y suena a lluvia fina; cerrando el filtro se vuelve grave, como el viento o el mar. El espectro deja de ser plano y cae desde el corte.',
    predice: 'Con el filtro muy cerrado ($a = 0{,}01$), ¿el ruido sonará a silbido agudo o a rumor grave?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-ruido-1', dur: 1, ventana: 10, fmax: 8000,
        mandos: [{ n: 'a', label: 'filtro: a (1 = ruido blanco)', min: 0.01, max: 1, step: 0.01, value: 1, dec: 2 }],
        codigo:
          'function sonido(t) {\n' +
          '    var x = 0.5 * ruido();                     // un número al azar en cada muestra\n' +
          '    return a * x + (1 - a) * anterior();       // el filtro de un polo\n' +
          '}\n',
        nota: 'El ruido filtrado hacia los graves se llama <strong>ruido rosa</strong> o <strong>marrón</strong> ' +
          'según cuánto caiga el espectro. El oído se cansa menos de él que del blanco, y es el que se ' +
          'usa para dormir o para enmascarar ruido en oficinas.'
      });
    }
  });

  p.section('Percusión: ruido con envolvente');

  p.text('Un golpe de caja es ruido que aparece de repente y se apaga en una décima de segundo: ' +
    'ruido multiplicado por una envolvente que decae. Un bombo es lo contrario: no ruido, sino un ' +
    'seno grave cuya frecuencia <em>cae</em> muy rápido en las primeras milésimas (el «clic» del ' +
    'ataque es esa bajada). Un charles es ruido muy agudo y muy corto. Los tres se escriben en dos ' +
    'líneas cada uno.');

  p.demo({
    title: 'Tres tambores de fórmula',
    intro: 'Bombo, caja y charles, cada uno con su decaimiento. El mando elige cuál suena; los otros dos, cuánto tarda en apagarse y cuánto cae la frecuencia del bombo. Lee el código: las tres son variaciones de «algo por una envolvente».',
    predice: 'Si el decaimiento de la caja pasa de 0,1 a 0,5 segundos, ¿sonará a caja o a un chorro de vapor?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-ruido-2', dur: 0.8, loop: false, ventana: 200, fmax: 8000,
        mandos: [
          { n: 'cual', label: 'cuál: 0 bombo, 1 caja, 2 charles', min: 0, max: 2, step: 1, value: 1, dec: 0 },
          { n: 'tau', label: 'cuánto tarda en apagarse (s)', min: 0.02, max: 0.5, step: 0.01, value: 0.12, dec: 2 },
          { n: 'caida', label: 'bombo: cuánto cae la frecuencia (Hz)', min: 0, max: 200, step: 10, value: 100, dec: 0 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    if (cual == 0) {\n' +
          '        // bombo: un seno grave cuya frecuencia baja muy deprisa\n' +
          '        var f = 50 + caida * exp(-t / 0.03);\n' +
          '        return 0.8 * decae(t, tau) * sin(TAU * f * t);\n' +
          '    }\n' +
          '    if (cual == 1) {\n' +
          '        // caja: ruido más un poco de tono, apagándose\n' +
          '        return decae(t, tau) * (0.5 * ruido() + 0.3 * sin(TAU * 180 * t));\n' +
          '    }\n' +
          '    // charles: ruido agudo (restar la salida anterior quita los graves) y cortísimo\n' +
          '    var y = ruido() - 0.8 * anterior();\n' +
          '    return 0.4 * decae(t, tau / 3) * y;\n' +
          '}\n',
        nota: 'En el charles, restar la salida anterior es un filtro de <strong>paso alto</strong>: lo ' +
          'contrario que la media. Deja pasar lo que cambia deprisa y quita lo que se mantiene. La ' +
          'fórmula del bombo, <code>sin(TAU * f * t)</code> con $f$ cambiando, no es del todo correcta ' +
          '—la fase debería ser la integral de $f$, como en [[son-espectro]]—, pero para tres ' +
          'centésimas de segundo nadie lo nota.'
      });
    }
  });

  p.section('Karplus-Strong: del ruido a la cuerda');

  p.text('Y ahora la sorpresa. Toma un trocito de ruido de $N$ muestras y repítelo una y otra vez. ' +
    'Como es periódico, con periodo $N/f_s$ segundos, <em>es una nota</em> de frecuencia $f_s/N$, ' +
    'con un timbre áspero (todos los armónicos a tamaños aleatorios). Ahora, en cada repetición, ' +
    'sustituye cada muestra por la media de dos vecinas: el filtro de paso bajo. En cada vuelta se ' +
    'pierde un poco de agudos, y la nota, que empezó siendo un chasquido de ruido, se va suavizando ' +
    'hasta ser un tono puro que se apaga. Eso es <strong>exactamente</strong> lo que hace una ' +
    'cuerda pulsada: el pellizco es ruido, los armónicos agudos mueren antes, y queda la fundamental.');

  p.formula('y_n = \\begin{cases} \\text{ruido} & n < N \\\\[4pt] g\\cdot\\dfrac{y_{n-N} + y_{n-N-1}}{2} & n \\ge N \\end{cases}, \\qquad f = \\frac{f_s}{N + \\tfrac{1}{2}}', 'el algoritmo de Karplus-Strong',
    'Se lee: <em>«i sub ene es ruido en las primeras ene muestras y, después, ge por la media de las ' +
      'salidas de hace ene y de hace ene más uno»</em>.<br><br>Las primeras $N$ muestras son el ' +
      'pellizco. Después, cada muestra es la media de las dos que sonaron hace un periodo: repetir ' +
      '(la nota) y suavizar (el filtro) en una sola línea. El factor $g$, algo menor que 1, hace que ' +
      'la nota se apague; con $g = 1$ duraría para siempre. La media de dos retrasa media muestra, y ' +
      'por eso el periodo real es $N + \\frac{1}{2}$: un detalle que importa al afinar.');

  p.demo({
    title: 'Una guitarra de tres líneas',
    intro: 'El código de Karplus-Strong, tal cual. La nota se elige por su número MIDI y de ahí sale $N$. Escucha el ataque: es ruido durante una milésima, y al instante ya es una cuerda. Prueba $g$ cerca de 1 para una nota larga y bajo para una apagada.',
    predice: 'Con MIDI 57 (La de 220 Hz), $N = 44\\,100/220 \\approx 200$. Si bajas a MIDI 45 (una octava), ¿$N$ será 100 o 400?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-ruido-3', dur: 2, loop: false, ventana: 20, fmax: 4000,
        mandos: [
          { n: 'midi', label: 'nota MIDI', min: 40, max: 76, step: 1, value: 57, dec: 0 },
          { n: 'g', label: 'g: cuánto sobrevive en cada vuelta', min: 0.9, max: 1, step: 0.001, value: 0.996, dec: 3 }
        ],
        codigo:
          'function sonido(t, i) {\n' +
          '    var N = round(SR / nota(midi) - 0.5);    // muestras por periodo\n' +
          '    if (i < N) return 0.8 * ruido();           // el pellizco: ruido\n' +
          '    return g * 0.5 * (anterior(N) + anterior(N + 1));\n' +
          '}\n',
        nota: 'Aquí <code>sonido</code> usa su segundo parámetro, <code>i</code>, el número de muestra, ' +
          'porque el algoritmo cuenta muestras y no segundos. Mira el espectro con el tiempo: los ' +
          'armónicos altos desaparecen antes que los bajos, como en una cuerda de verdad. Es una ' +
          '[[son-cuerda|cuerda]] simulada sin ninguna física: solo repetir y promediar.'
      });
    }
  });

  p.ejemplo({
    title: 'Afinar una cuerda de Karplus-Strong',
    enunciado: 'Se quiere un Mi de 329,63 Hz con $f_s = 44\\,100$. Hallar $N$, la frecuencia real que saldrá, el error en cents, y cuántas vueltas del bucle tardará la nota en bajar a la mitad con $g = 0{,}996$.',
    pasos: [
      { t: '<strong>$N$.</strong> $N + \\frac{1}{2} = \\frac{44\\,100}{329{,}63} = 133{,}79$, así que $N = 133$.', antes: 'Despeja $N$ de $f = f_s/(N + 1/2)$ y redondea.' },
      { t: '<strong>La frecuencia real.</strong> $f = \\frac{44\\,100}{133{,}5} = 330{,}34$ Hz.' },
      { t: '<strong>El error.</strong> $1200\\log_2\\frac{330{,}34}{329{,}63} = 1200\\cdot 0{,}00311 = 3{,}7$ cents: inaudible (el umbral está en unos 5). En notas más agudas, $N$ es pequeño y el redondeo pesa más: a 2000 Hz, $N = 22$ y el error puede llegar a 40 cents. Por eso las versiones serias del algoritmo añaden un retardo fraccionario.', antes: 'Usa la fórmula de los cents de [[son-tono]].' },
      { t: '<strong>Cuánto dura.</strong> En cada vuelta la amplitud se multiplica por $g = 0{,}996$ (y por algo menos, porque el filtro también quita). Para bajar a la mitad: $0{,}996^k = 0{,}5 \\Rightarrow k = \\frac{\\ln 0{,}5}{\\ln 0{,}996} = 173$ vueltas, que a 330 vueltas por segundo son 0,52 s. La nota grave de $N = 400$ tardaría 173 vueltas también, pero a 110 por segundo: 1,6 s. Las graves duran más, como en una guitarra.', antes: 'Es una progresión geométrica: ¿cuántos pasos de razón 0,996 hacen falta para llegar a la mitad?' }
    ],
    cierre: 'Un algoritmo de tres líneas, un logaritmo para afinarlo y una progresión geométrica para saber cuánto dura: la cuerda entera cabe en el bachillerato.'
  });

  p.comprueba('En Karplus-Strong, ¿qué pasa si en vez de la media de $y_{n-N}$ e $y_{n-N-1}$ se repite solo $y_{n-N}$ (sin filtro) con $g = 1$?', [
    { t: 'El ruido inicial se repite para siempre sin cambiar: un zumbido áspero eterno', ok: true, por: 'Sin el filtro nada suaviza los armónicos, y sin $g < 1$ nada apaga. Queda un periodo de ruido repetido: una nota, sí, pero con un timbre de sierra rota que no evoluciona. La cuerda está en la media.' },
    { t: 'Silencio: sin filtro no hay sonido', ok: false, por: 'Hay sonido: el trozo de ruido repetido es periódico y suena a la frecuencia $f_s/N$. Lo que falta es que evolucione.' },
    { t: 'Suena igual, una cuerda', ok: false, por: 'Lo que hace que suene a cuerda es que los agudos mueran antes, y eso lo hace la media. Sin ella, todos los armónicos duran lo mismo.' }
  ]);

  p.hist('Kevin Karplus y Alex Strong publicaron el algoritmo en 1983, y lo habían descubierto ' +
    'buscando otra cosa: una manera barata de hacer sonar un ordenador doméstico sin apenas ' +
    'memoria ni multiplicaciones. Un buffer de 200 números y una media era todo lo que podían ' +
    'permitirse, y de ahí salió la cuerda más convincente que se había sintetizado. Julius Smith ' +
    'y David Jaffe explicaron ese mismo año por qué funciona: el bucle es una simulación de la onda ' +
    'que va y vuelve por la cuerda, y el filtro, las pérdidas en cada rebote. Fue el principio de la ' +
    '<em>síntesis por modelado físico</em>, que hoy simula pianos y clarinetes enteros.');

  p.util('Todo lo percusivo de la música electrónica —el bombo de 808, la caja, los platos— nació como ' +
    'ruido y senos con envolventes como los de arriba, porque era lo que los circuitos analógicos ' +
    'podían hacer. El ruido también se usa al revés: para <em>medir</em>. Se hace sonar ruido blanco ' +
    'en una sala y, mirando qué frecuencias vuelven y cuáles se pierden, se conoce su acústica; en un ' +
    'cable de red se hace lo mismo para ver dónde está roto. Y el ruido de fondo de una imagen o de ' +
    'un sensor se quita con el mismo filtro que aquí lo colorea.');

  p.trampas([
    { e: '«El ruido es lo que no tiene información»', por: 'El ruido blanco lleva todas las frecuencias: es lo más rico que hay. Lo que no tiene es periodo. Filtrado y con envolvente es la mitad de una batería.' },
    { e: 'Usar <code>Math.random()</code>', por: 'En el sintetizador se usa <code>ruido()</code>, que es reproducible: cada vez que se calcula sale el mismo ruido. Así los ejercicios y las comparaciones funcionan.' },
    { e: 'Olvidar el $+\\frac{1}{2}$ al afinar Karplus-Strong', por: 'La media de dos muestras retrasa media muestra. En una nota grave no se nota; en una aguda, con $N$ pequeño, son varios cents.' },
    { e: 'Poner $g > 1$ para que dure más', por: 'Con $g > 1$ la progresión geométrica crece y el sonido se desboca. La nota larga está en $g$ muy cerca de 1 por debajo: 0,999.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'El nivel del ruido',
    level: 'basico',
    gen: function (r) {
      var A = r.pick([0.2, 0.3, 0.5, 0.6, 0.8, 1]);
      return { A: A, rms: A / Math.sqrt(3) };
    },
    ask: function (d) { return '<code>' + U.fmt(d.A, 1) + ' * ruido()</code> da números uniformes entre $-' + U.fmt(d.A, 1) + '$ y $' + U.fmt(d.A, 1) + '$. ¿Cuál es su nivel eficaz (desviación típica)? (tres decimales)'; },
    fields: [{ name: 'v', label: 'RMS', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.rms, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.A / Math.sqrt(2)) < 2e-3; }, msg: 'Eso es el nivel de un <em>seno</em> de esa amplitud, $A/\\sqrt 2$. El ruido uniforme tiene $A/\\sqrt 3$.' }],
    hint: function () { return 'La varianza de una uniforme en $[-A, A]$ es $A^2/3$.'; },
    steps: function (d) { return ['$\\sigma = \\dfrac{' + U.fmt(d.A, 1) + '}{\\sqrt 3} = ' + U.fmt(d.rms, 3) + '$.']; },
    answer: function (d) { return U.fmt(d.rms, 3); }
  });

  p.exercise({
    title: 'Cuántas muestras por periodo',
    level: 'basico',
    gen: function (r) {
      var midi = r.int(40, 76), fs = 44100, f = 440 * Math.pow(2, (midi - 69) / 12);
      return { midi: midi, f: f, N: Math.round(fs / f - 0.5) };
    },
    ask: function (d) { return 'Para tocar con Karplus-Strong la nota MIDI $' + d.midi + '$ ($' + U.fmt(d.f, 2) + '$ Hz) a $f_s = 44\\,100$, ¿cuántas muestras $N$ tiene el bucle? (usa $f = f_s/(N + \\frac{1}{2})$ y redondea)'; },
    fields: [{ name: 'N', label: 'N', w: 'tiny' }],
    sol: function (d) { return { N: d.N }; },
    dec: 0,
    errores: [{ si: function (v, d) { return v.N === Math.round(44100 / d.f) && Math.round(44100 / d.f) !== d.N; }, msg: 'Casi: falta restar el medio del retraso del filtro. $N = \\operatorname{round}(f_s/f - \\frac{1}{2})$.' }],
    hint: function () { return '$N = \\operatorname{round}\\!\\left(\\dfrac{f_s}{f} - \\dfrac{1}{2}\\right)$.'; },
    steps: function (d) { return ['$\\dfrac{44\\,100}{' + U.fmt(d.f, 2) + '} - 0{,}5 = ' + U.fmt(44100 / d.f - 0.5, 2) + ' \\Rightarrow N = ' + d.N + '$.']; },
    answer: function (d) { return String(d.N); }
  });

  p.exercise({
    title: 'Cuánto dura la cuerda',
    level: 'medio',
    gen: function (r) {
      var g = r.pick([0.99, 0.995, 0.996, 0.998, 0.999]), f = r.pick([110, 220, 330, 440]);
      var k = Math.log(0.5) / Math.log(g);
      return { g: g, f: f, k: k, s: k / f };
    },
    ask: function (d) { return 'Karplus-Strong con $g = ' + U.fmt(d.g, 3) + '$ tocando $' + d.f + '$ Hz. Sin contar lo que quita el filtro, ¿cuántas vueltas del bucle tarda la amplitud en bajar a la mitad, y cuántos segundos son? (un decimal y dos decimales)'; },
    fields: [{ name: 'k', label: 'vueltas', w: 'wide' }, { name: 's', label: 'segundos', w: 'wide' }],
    sol: function (d) { return { k: U.round(d.k, 4), s: U.round(d.s, 6) }; },
    dec: { k: 1, s: 2 },
    hint: function () { return ['$g^k = 0{,}5 \\Rightarrow k = \\ln 0{,}5 / \\ln g$.', 'Hay $f$ vueltas por segundo.']; },
    steps: function (d) { return ['$k = \\dfrac{\\ln 0{,}5}{\\ln ' + U.fmt(d.g, 3) + '} = ' + U.fmt(d.k, 1) + '$ vueltas.', 'A $' + d.f + '$ vueltas por segundo: $' + U.fmt(d.k, 1) + '/' + d.f + ' = ' + U.fmt(d.s, 2) + '$ s. Las notas graves, con el mismo $g$, duran más.']; },
    answer: function (d) { return U.fmt(d.k, 1) + ' vueltas, ' + U.fmt(d.s, 2) + ' s'; }
  });

  p.exercise({
    title: 'El error de afinación',
    level: 'medio',
    gen: function (r) {
      var f = r.pick([523.25, 659.26, 880, 1046.5, 1318.5, 1760, 2093]), fs = 44100;
      var N = Math.round(fs / f - 0.5), real = fs / (N + 0.5), cents = 1200 * Math.log(real / f) / Math.LN2;
      return { f: f, N: N, real: real, cents: cents };
    },
    ask: function (d) { return 'Se quiere $' + U.fmt(d.f, 2) + '$ Hz con Karplus-Strong a $f_s = 44\\,100$. Da $N$, la frecuencia que sale de verdad y el error en cents (dos decimales, un decimal).'; },
    fields: [{ name: 'N', label: 'N', w: 'tiny' }, { name: 'real', label: 'f real (Hz)', w: 'wide' }, { name: 'c', label: 'cents', w: 'tiny' }],
    sol: function (d) { return { N: d.N, real: U.round(d.real, 6), c: U.round(d.cents, 4) }; },
    dec: { N: 0, real: 2, c: 1 },
    hint: function () { return ['$N = \\operatorname{round}(f_s/f - 0{,}5)$; $f_{\\text{real}} = f_s/(N + 0{,}5)$.', 'Cents: $1200\\log_2(f_{\\text{real}}/f)$.']; },
    steps: function (d) { return ['$N = \\operatorname{round}(' + U.fmt(44100 / d.f - 0.5, 2) + ') = ' + d.N + '$.', '$f_{\\text{real}} = 44\\,100 / ' + (d.N + 0.5) + ' = ' + U.fmt(d.real, 2) + '$ Hz.', '$1200\\log_2(' + U.fmt(d.real, 2) + '/' + U.fmt(d.f, 2) + ') = ' + U.fmt(d.cents, 1) + '$ cents' + (Math.abs(d.cents) > 5 ? ': se oye. Cuanto más aguda la nota, menor $N$ y peor el redondeo.' : ': no se oye.')]; },
    answer: function (d) { return 'N = ' + d.N + ', ' + U.fmt(d.real, 2) + ' Hz, ' + U.fmt(d.cents, 1) + ' cents'; }
  });

  p.exercise({
    title: 'Escribe la caja',
    level: 'avanzado',
    gen: function (r) {
      var tau = r.pick([0.05, 0.08, 0.1, 0.15]), A = r.pick([0.4, 0.5, 0.6]);
      return { tau: tau, A: A, ref: A + ' * ruido() * decae(t, ' + tau + ')' };
    },
    ask: function (d) {
      return 'Escribe un golpe de caja: ruido de amplitud <strong>' + U.fmt(d.A, 1) + '</strong> que se apaga exponencialmente con <strong>$\\tau = ' + U.fmt(d.tau, 2) + '$ s</strong>:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: 'A * ruido() * decae(t, tau)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 0.6, tolEspectro: 0.9 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (!/ruido/.test(texto)) return { ok: false, msg: 'Una caja es ruido: hace falta <code>ruido()</code>.' };
        if (r.envolvente < 0.95) return { ok: false, msg: 'El ruido está, pero no se apaga como se pide: <code>decae(t, ' + d.tau + ')</code> o <code>exp(-t / ' + d.tau + ')</code>.' };
        return { ok: false, msg: 'La amplitud no es ' + U.fmt(d.A, 1) + '.' };
      }
      return { ok: true };
    },
    hint: function (d) { return ['<code>ruido()</code> por una envolvente.', '<code>decae(t, ' + d.tau + ')</code> vale 1 en $t = 0$ y cae exponencialmente.']; },
    steps: function (d) { return ['<code>' + d.ref + '</code>', 'Añadir <code>+ 0.3 * sin(TAU * 180 * t) * decae(t, ' + d.tau + ')</code> le da el «cuerpo» de una caja de verdad.']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'El ruido blanco es una lista de números al azar: todas las frecuencias con la misma amplitud media. Su nivel eficaz es $A/\\sqrt 3$.',
    'Filtrarlo lo colorea (rosa, marrón); ponerle una envolvente lo convierte en percusión. Un bombo es un seno cuya frecuencia cae.',
    'Karplus-Strong: un periodo de ruido repetido y promediado, $y_n = g\\,\\frac{y_{n-N} + y_{n-N-1}}{2}$, suena a cuerda pulsada.',
    'Se afina con $f = f_s/(N + \\frac{1}{2})$; el error en cents es $1200\\log_2$ del cociente, y crece en las notas agudas.',
    'Con $g < 1$ la nota se apaga como una progresión geométrica: $k = \\ln 0{,}5/\\ln g$ vueltas para bajar a la mitad.'
  ]);
});
