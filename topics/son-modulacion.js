/* Tema: Modular: vibrato, trémolo y FM */
Course.topic('son-modulacion', function (p) {

  p.puente('Hasta ahora los parámetros de un seno —amplitud y frecuencia— eran números fijos, o una ' +
    'envolvente que cambiaba despacio. <strong>Modular</strong> es mover uno de ellos con otro seno. ' +
    'Si se mueve la amplitud, hay trémolo; si se mueve la frecuencia, vibrato. Y si el seno que ' +
    'mueve va tan rápido como el que suena, aparecen frecuencias nuevas: la identidad del ' +
    '[[son-batidos|tema de los batidos]] las predice, y los [[son-armonicos|armónicos]] las explican. ' +
    'De ahí salió el sintetizador que sonó en toda una década.');

  p.section('Modular la amplitud: el trémolo');

  p.text('Un cantante que hace trémolo sube y baja el volumen unas cinco veces por segundo. En fórmula, ' +
    'la amplitud deja de ser un número y pasa a ser $1 + m\\operatorname{sen}(2\\pi f_m t)$: un uno más ' +
    'un vaivén de tamaño $m$, la <strong>profundidad</strong>, a la frecuencia $f_m$ del ' +
    '<strong>modulador</strong>. El seno que suena es la <strong>portadora</strong>, a $f_c$.');

  p.formula('y(t) = \\bigl(1 + m\\,\\operatorname{sen}(2\\pi f_m t)\\bigr)\\,\\operatorname{sen}(2\\pi f_c t)', 'modulación de amplitud',
    'Se lee: <em>«uno más eme por seno de dos pi efe sub eme te, todo por seno de dos pi efe sub ce ' +
      'te»</em>. Con $f_m$ de unos pocos hercios es un trémolo y se oye como un volumen que tiembla. ' +
      'Con $f_m$ de cientos de hercios ya no se oye temblar: se oye <em>otro sonido</em>, y para saber ' +
      'cuál hay que multiplicar.');

  p.formula('\\operatorname{sen}(2\\pi f_m t)\\operatorname{sen}(2\\pi f_c t) = \\tfrac{1}{2}\\cos\\bigl(2\\pi(f_c - f_m)t\\bigr) - \\tfrac{1}{2}\\cos\\bigl(2\\pi(f_c + f_m)t\\bigr)', 'el producto de dos senos son dos frecuencias nuevas',
    'Es la identidad del producto de senos, la inversa de la del tema anterior. Dice que multiplicar ' +
      'dos senos no da un seno: da <strong>dos</strong>, en la suma y la diferencia de las frecuencias. ' +
      'Así que la señal modulada tiene tres rayas: la portadora $f_c$ (con amplitud 1) y dos ' +
      '<strong>bandas laterales</strong> en $f_c \\pm f_m$, cada una con amplitud $m/2$. El modulador ' +
      'no se oye a su frecuencia: aparece <em>a los lados</em> de la portadora.');

  p.demo({
    title: 'Del trémolo a las bandas laterales',
    intro: 'Una portadora de 440 Hz cuya amplitud mueve un seno de frecuencia fm. Empieza con fm = 4 (temblor) y ve subiendo: hacia 30 Hz deja de temblar y empieza a rascar; hacia 100 se oyen tonos nuevos. Mira el espectro: dos rayas nacen a los lados de la de 440 y se separan de ella.',
    predice: 'Con $f_m = 100$ y $m = 0{,}8$, ¿en qué frecuencias estarán las dos rayas nuevas? ¿Qué altura tendrán respecto a la central?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-modulacion-1', dur: 1, ventana: 50, fmax: 1000,
        mandos: [
          { n: 'fm', label: 'frecuencia del modulador fm (Hz)', min: 1, max: 200, step: 1, value: 4, dec: 0 },
          { n: 'm', label: 'profundidad m', min: 0, max: 1, step: 0.05, value: 0.8, dec: 2 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    var amplitud = 1 + m * sin(TAU * fm * t);   // la amplitud, moviéndose\n' +
          '    return 0.3 * amplitud * sin(TAU * 440 * t);\n' +
          '}\n',
        nota: 'La frontera entre «tiembla» y «suena distinto» está hacia los 20 Hz: por debajo el oído ' +
          'sigue el volumen; por encima ya no puede, y oye el espectro. Es la misma frontera del tema de ' +
          'los batidos.'
      });
    }
  });

  p.section('Modular la frecuencia: el vibrato');

  p.text('Un violinista que hace vibrato mueve el dedo y la frecuencia sube y baja unos pocos hercios, ' +
    'seis o siete veces por segundo. En fórmula, lo que se mueve va <em>dentro</em> del seno:');

  p.formula('y(t) = \\operatorname{sen}\\bigl(2\\pi f_c t + I\\,\\operatorname{sen}(2\\pi f_m t)\\bigr)', 'modulación de frecuencia',
    'Se lee: <em>«seno de dos pi efe sub ce te, más i por seno de dos pi efe sub eme te»</em>. ' +
      'El modulador se suma a la <strong>fase</strong>, y como la frecuencia es lo que crece la fase ' +
      'por segundo, la frecuencia instantánea pasa a ser $f_c + I f_m\\cos(2\\pi f_m t)$: oscila ' +
      'alrededor de $f_c$ con una desviación máxima de $I f_m$ hercios. $I$ es el <strong>índice de ' +
      'modulación</strong>.<br><br>Con $f_m = 6$ e $I = 1$, la nota sube y baja 6 Hz, seis veces por ' +
      'segundo: un vibrato normal. Con $f_m$ en los cientos de hercios, otra vez, aparecen frecuencias ' +
      'nuevas; pero ahora no son dos.');

  p.text('En la modulación de frecuencia las bandas laterales salen a $f_c \\pm f_m$, $f_c \\pm 2f_m$, ' +
    '$f_c \\pm 3f_m$…: una familia entera, y cuántas tienen amplitud apreciable lo decide el índice ' +
    '$I$: aproximadamente $I + 1$ pares. Las amplitudes exactas las dan unas funciones que aquí no ' +
    'hacen falta —las de Bessel—; lo que hace falta es la consecuencia práctica, que es enorme:');

  p.note('Si $f_m = f_c$, las bandas caen en $0$, $f_c$, $2f_c$, $3f_c$…: <strong>múltiplos de la ' +
    'portadora</strong>, es decir, armónicos. Con dos senos y una suma se obtiene un timbre completo, ' +
    'y girando $I$ se controla cuántos armónicos hay. Si $f_m$ es $2f_c$, salen solo los impares; si es ' +
    'un múltiplo raro como $1{,}41 f_c$, salen frecuencias que no son múltiplos: suena a campana o a ' +
    'gong. Es la <strong>síntesis FM</strong>, y con ella se construyeron los pianos eléctricos, los ' +
    'bajos y las campanas de casi toda la música de los años ochenta.', 'ok', 'La idea que valía un instrumento');

  p.demo({
    title: 'Un instrumento FM',
    intro: 'Dos senos: el modulador mueve la fase de la portadora. La razón fm/fc decide si el resultado es una nota (razón entera) o una campana (razón no entera); el índice decide cuántos armónicos. El índice cae con el tiempo, como en un instrumento de verdad: el ataque es brillante y luego se apaga.',
    predice: 'Con razón 1 e índice 3, ¿el espectro tendrá rayas equiespaciadas o desordenadas? Y con razón 1,41, ¿sonará a nota o a campana?',
    build: function (host) {
      W.sinte(host, {
        id: 'son-modulacion-2', dur: 2, loop: false, ventana: 10, fmax: 4000,
        mandos: [
          { n: 'razon', label: 'razón fm / fc', min: 0.5, max: 3, step: 0.01, value: 1, dec: 2 },
          { n: 'I', label: 'índice de modulación I', min: 0, max: 8, step: 0.1, value: 3, dec: 1 }
        ],
        codigo:
          'function sonido(t) {\n' +
          '    var fc = 220;\n' +
          '    var fm = razon * fc;\n' +
          '    var indice = I * exp(-t / 0.6);          // el índice se apaga: el ataque brilla\n' +
          '    var modulador = indice * sin(TAU * fm * t);\n' +
          '    return 0.5 * exp(-t / 1.2) * sin(TAU * fc * t + modulador);\n' +
          '}\n',
        nota: 'Razón 1: un metal o un piano eléctrico. Razón 2: algo a clarinete, solo impares. Razón ' +
          '1,41 o 3,53: campanas, porque las rayas no son múltiplos de nada. Y con $I = 0$ el modulador ' +
          'desaparece y queda un seno puro.'
      });
    }
  });

  p.ejemplo({
    title: 'Las tres rayas de un trémolo rápido',
    enunciado: 'Una portadora de 440 Hz y amplitud 1 se modula en amplitud con $f_m = 100$ Hz y profundidad $m = 0{,}5$. Hallar las frecuencias presentes y sus amplitudes.',
    pasos: [
      { t: '<strong>Desarrollar el producto.</strong> $y = \\operatorname{sen}(2\\pi 440t) + 0{,}5\\operatorname{sen}(2\\pi 100t)\\operatorname{sen}(2\\pi 440t)$. El primer sumando es la portadora tal cual.', antes: 'Multiplica el paréntesis $(1 + m\\operatorname{sen}\\ldots)$ por la portadora.' },
      { t: '<strong>La identidad.</strong> $0{,}5\\operatorname{sen}(2\\pi 100t)\\operatorname{sen}(2\\pi 440t) = 0{,}25\\cos(2\\pi 340t) - 0{,}25\\cos(2\\pi 540t)$.', antes: 'Aplica el producto de senos: semidiferencia y semisuma.' },
      { t: '<strong>Las tres rayas.</strong> 440 Hz con amplitud 1; 340 Hz con amplitud 0,25; 540 Hz con amplitud 0,25. El signo menos y el coseno son fases, y no se oyen.' },
      { t: '<strong>Comprobar en el espectro.</strong> En el primer sintetizador, con $f_m = 100$ y $m = 0{,}5$, la raya central tiene cuatro veces la altura de cada lateral: $1$ frente a $0{,}25$.', antes: '¿Qué proporción de alturas esperas entre la raya central y las laterales?' },
      { t: '<strong>Lo que no hay.</strong> No hay raya en 100 Hz. El modulador no suena: solo deja su huella a los lados de la portadora.' }
    ],
    cierre: 'Modular es multiplicar, y multiplicar senos es sumar y restar frecuencias. La misma identidad que explicaba los batidos explica la radio AM.'
  });

  p.comprueba('Síntesis FM con $f_c = 200$ Hz y $f_m = 200$ Hz. ¿A qué suena?', [
    { t: 'A una nota de 200 Hz con armónicos', ok: true, por: 'Las bandas caen en $200 \\pm 200k$: 0, 200, 400, 600… Todas múltiplos de 200: una nota con timbre, cuya riqueza depende del índice.' },
    { t: 'A dos notas, de 200 y 400 Hz', ok: false, por: 'El modulador no se oye por separado: genera bandas alrededor de la portadora. Y esas bandas son los armónicos de una sola nota.' },
    { t: 'A una campana', ok: false, por: 'Sonaría a campana si la razón $f_m/f_c$ no fuera entera, porque las bandas no serían múltiplos. Con razón 1, son armónicos.' }
  ]);

  p.hist('John Chowning, un compositor que trabajaba en el laboratorio de inteligencia artificial de ' +
    'Stanford, descubrió en 1967 que un vibrato exageradamente rápido dejaba de sonar a vibrato y ' +
    'se convertía en un timbre nuevo. Publicó la síntesis FM en 1973; Stanford la patentó y ninguna ' +
    'empresa estadounidense la quiso. La licenció Yamaha, que en 1983 sacó el DX7: el primer ' +
    'sintetizador digital de gran éxito, doscientos mil vendidos, con el piano eléctrico, el bajo y ' +
    'las campanas que están en casi todos los discos de los años ochenta. La patente fue durante años ' +
    'la más rentable de la universidad, por delante de las de biotecnología.');

  p.util('La radio se llama AM y FM por esto mismo. La emisora tiene una portadora de cientos de ' +
    'kilohercios o de cien megahercios, y la voz es el modulador: en AM mueve la amplitud y en FM la ' +
    'frecuencia, con las mismas fórmulas de este tema. Las bandas laterales son el motivo de que cada ' +
    'emisora necesite un ancho de banda y no una sola frecuencia, y de que no puedan estar pegadas. ' +
    'El wifi, el móvil y la televisión digital modulan también, con senos de fases y amplitudes ' +
    'combinadas; todo empieza en $\\operatorname{sen} a \\cdot \\operatorname{sen} b$.');

  p.trampas([
    { e: '«El trémolo cambia la nota»', por: 'El trémolo mueve la amplitud: el volumen tiembla y la altura no cambia. Lo que cambia la altura es el vibrato, que mueve la frecuencia.' },
    { e: 'Sumar el modulador a la portadora', por: 'Sumar da dos notas. Modular es multiplicar (amplitud) o meter el modulador dentro del seno (frecuencia): así aparecen frecuencias que no estaban.' },
    { e: 'Esperar oír el modulador a su frecuencia', por: 'No hay raya en $f_m$: la huella del modulador son las bandas a $f_c \\pm f_m$.' },
    { e: '«Más índice, más agudo»', por: 'El índice no cambia la nota: cambia cuántas bandas hay. Más índice es más brillante, no más alto.' }
  ]);

  /* ================= EJERCICIOS ================= */
  p.section('Practica');

  p.exercise({
    title: 'Las bandas laterales',
    level: 'basico',
    gen: function (r) {
      var fc = r.pick([300, 440, 500, 800, 1000]), fm = r.pick([50, 80, 100, 120, 150, 200]);
      if (fm >= fc) return null;
      return { fc: fc, fm: fm };
    },
    ask: function (d) { return 'Una portadora de $' + d.fc + '$ Hz se modula en amplitud con un seno de $' + d.fm + '$ Hz. ¿En qué dos frecuencias aparecen las bandas laterales?'; },
    fields: [{ name: 'a', label: 'inferior (Hz)', w: 'tiny' }, { name: 'b', label: 'superior (Hz)', w: 'tiny' }],
    sol: function (d) { return { a: d.fc - d.fm, b: d.fc + d.fm }; },
    dec: 0,
    hint: function () { return 'Multiplicar senos da la diferencia y la suma de las frecuencias.'; },
    steps: function (d) { return ['$' + d.fc + ' - ' + d.fm + ' = ' + (d.fc - d.fm) + '$ Hz y $' + d.fc + ' + ' + d.fm + ' = ' + (d.fc + d.fm) + '$ Hz. La portadora sigue en $' + d.fc + '$, y en $' + d.fm + '$ no hay nada.']; },
    answer: function (d) { return (d.fc - d.fm) + ' y ' + (d.fc + d.fm) + ' Hz'; }
  });

  p.exercise({
    title: 'Trémolo o vibrato',
    level: 'basico',
    gen: function (r) {
      var casos = [
        { t: '<code>return (1 + 0.5 * sin(TAU * 5 * t)) * sin(TAU * 440 * t);</code>', q: 'tremolo', por: 'El seno lento multiplica a la amplitud: el volumen tiembla cinco veces por segundo. Trémolo.' },
        { t: '<code>return sin(TAU * 440 * t + 2 * sin(TAU * 6 * t));</code>', q: 'vibrato', por: 'El seno lento está dentro de la fase: la frecuencia oscila alrededor de 440. Vibrato.' },
        { t: '<code>return sin(TAU * 440 * t) + 0.5 * sin(TAU * 5 * t);</code>', q: 'ninguno', por: 'Está sumado, no multiplicado ni dentro de la fase: es un seno de 440 más una vibración de 5 Hz que no se oye. Ni trémolo ni vibrato.' },
        { t: '<code>return exp(-t / 0.5) * sin(TAU * 440 * t);</code>', q: 'ninguno', por: 'Una envolvente que baja, sin oscilar: la nota se apaga, pero no tiembla. No es una modulación periódica.' },
        { t: '<code>return sin(TAU * (440 + 8 * sin(TAU * 6 * t)) * t);</code>', q: 'vibrato', por: 'La frecuencia dentro del seno oscila entre 432 y 448: vibrato (aunque escribirlo así, multiplicando por $t$, hace que la desviación crezca con el tiempo: la forma correcta es sumar el modulador a la fase).' }
      ];
      return r.pick(casos);
    },
    ask: function (d) { return '¿Qué hace este código?<br>' + d.t; },
    fields: [{ name: 'q', label: 'Es', opts: [{ t: 'un trémolo (modula la amplitud)', v: 'tremolo' }, { t: 'un vibrato (modula la frecuencia)', v: 'vibrato' }, { t: 'ninguna de las dos cosas', v: 'ninguno' }] }],
    sol: function (d) { return { q: d.q }; },
    hint: function () { return '¿El seno lento multiplica a la amplitud, está dentro de la fase, o está sumado aparte?'; },
    steps: function (d) { return [d.por]; },
    answer: function (d) { return d.q; }
  });

  p.exercise({
    title: 'La amplitud de las bandas',
    level: 'medio',
    gen: function (r) {
      var A = r.pick([0.4, 0.5, 0.6, 0.8, 1]), m = r.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]);
      return { A: A, m: m, lado: A * m / 2 };
    },
    ask: function (d) { return 'Una portadora de amplitud $' + U.fmt(d.A, 1) + '$ se modula en amplitud con profundidad $m = ' + U.fmt(d.m, 1) + '$. ¿Qué amplitud tiene cada banda lateral? (tres decimales)'; },
    fields: [{ name: 'v', label: 'amplitud', w: 'wide' }],
    sol: function (d) { return { v: U.round(d.lado, 6) }; },
    dec: 3,
    errores: [{ si: function (v, d) { return Math.abs(v.v - d.A * d.m) < 1e-3; }, msg: 'Falta el $\\frac{1}{2}$ de la identidad: el producto de dos senos reparte la amplitud entre las dos bandas.' }],
    hint: function () { return 'El término $A\\,m\\operatorname{sen}(f_m)\\operatorname{sen}(f_c)$ se convierte en dos cosenos de amplitud $\\frac{Am}{2}$.'; },
    steps: function (d) { return ['$\\dfrac{A\\,m}{2} = \\dfrac{' + U.fmt(d.A, 1) + '\\cdot ' + U.fmt(d.m, 1) + '}{2} = ' + U.fmt(d.lado, 3) + '$ en cada banda; la portadora se queda con $' + U.fmt(d.A, 1) + '$.']; },
    answer: function (d) { return U.fmt(d.lado, 3); }
  });

  p.exercise({
    title: 'Nota o campana',
    level: 'medio',
    gen: function (r) {
      var fc = r.pick([200, 220, 300, 440]), razon = r.pick([1, 2, 3, 0.5, 1.5, 1.41, 2.5, 3.53]);
      var fm = fc * razon, k = r.int(1, 3);
      var armonico = Math.abs(razon - Math.round(razon)) < 1e-9 || razon === 0.5 || razon === 1.5 || razon === 2.5;
      return { fc: fc, razon: razon, fm: fm, k: k, banda: fc + k * fm, armonico: armonico };
    },
    ask: function (d) { return 'Síntesis FM con $f_c = ' + d.fc + '$ Hz y $f_m = ' + U.fmt(d.fm, 1) + '$ Hz. ¿A qué frecuencia está la banda lateral superior número $' + d.k + '$? ¿Y el resultado suena a nota o a campana?'; },
    fields: [{ name: 'f', label: 'banda (Hz)', w: 'wide' }, { name: 'q', label: 'Suena a', opts: [{ t: 'una nota: las bandas son múltiplos de una fundamental', v: 'nota' }, { t: 'una campana: las bandas no son múltiplos', v: 'campana' }] }],
    sol: function (d) { return { f: U.round(d.banda, 4), q: d.armonico ? 'nota' : 'campana' }; },
    dec: 1,
    hint: function () { return ['Bandas en $f_c \\pm k f_m$.', 'Si $f_m/f_c$ es una fracción sencilla (1, 2, 1/2, 3/2…), todas las bandas son múltiplos de una fundamental: nota. Si es $\\sqrt 2$ o parecido, campana.']; },
    steps: function (d) { return ['$f_c + ' + d.k + ' f_m = ' + d.fc + ' + ' + d.k + '\\cdot ' + U.fmt(d.fm, 1) + ' = ' + U.fmt(d.banda, 1) + '$ Hz.', d.armonico ? 'Razón $' + U.fmt(d.razon, 2) + '$: las bandas $f_c \\pm k f_m$ son múltiplos de $' + U.fmt(Math.min(d.fc, d.fm, Math.abs(d.fc - d.fm) || d.fc), 1) + '$ Hz. Suena a <strong>nota</strong>.' : 'Razón $' + U.fmt(d.razon, 2) + '$, que no es una fracción sencilla: las bandas no son múltiplos de nada. Suena a <strong>campana</strong>.']; },
    answer: function (d) { return U.fmt(d.banda, 1) + ' Hz, ' + (d.armonico ? 'nota' : 'campana'); }
  });

  p.exercise({
    title: 'Escribe el trémolo',
    level: 'avanzado',
    gen: function (r) {
      var f = r.pick([330, 440, 550]), fm = r.pick([3, 4, 5, 6]);
      return { f: f, fm: fm, ref: '(1 + 0.5 * sin(TAU * ' + fm + ' * t)) * 0.4 * sin(TAU * ' + f + ' * t)' };
    },
    ask: function (d) {
      return 'Escribe un tono de <strong>' + d.f + ' Hz</strong> y amplitud 0,4 con un <strong>trémolo de ' + d.fm + ' Hz</strong> y profundidad 0,5:<br>' +
        '<pre class="shd__mini">function sonido(t) {\n    return <strong>???</strong>;\n}</pre>';
    },
    fields: [{ name: 'c', label: 'return', w: 'wide', ph: '(1 + m * sin(TAU * fm * t)) * A * sin(TAU * f * t)' }],
    sol: function (d) { return { c: d.ref }; },
    check: function (v, d) {
      var texto = String(v.raw.c || '').trim().replace(/;\s*$/, '');
      if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
      function env(x) { return 'function sonido(t) { return ' + x + '; }'; }
      var r = SON.iguales(env(texto), env(d.ref), { dur: 2, tolEnvolvente: 0.9 });
      if (r.motivo === 'la respuesta no compila') return { ok: false, msg: 'Eso no se entiende: ' + (r.error && r.error.msg ? r.error.msg : 'revisa los paréntesis.') };
      if (!r.ok) {
        if (r.silencio) return { ok: false, msg: 'Eso es silencio.' };
        if (r.espectro < 0.9) return { ok: false, msg: 'La frecuencia no es ' + d.f + ' Hz, o el modulador está sumado en vez de multiplicando.' };
        if (r.envolvente < 0.9) return { ok: false, msg: 'La nota está, pero no tiembla ' + d.fm + ' veces por segundo con esa profundidad.' };
        return { ok: false, msg: 'El nivel no es el pedido: amplitud 0,4.' };
      }
      return { ok: true };
    },
    hint: function () { return ['La amplitud que tiembla es <code>(1 + 0.5 * sin(TAU * fm * t))</code>.', 'Y multiplica a la portadora <code>0.4 * sin(TAU * f * t)</code>.']; },
    steps: function (d) { return ['<code>' + d.ref + '</code>']; },
    answer: function (d) { return d.ref; }
  });

  p.keys([
    'Modular es mover un parámetro con otro seno: la amplitud (trémolo) o la frecuencia (vibrato).',
    'Multiplicar dos senos da la suma y la diferencia de sus frecuencias: en AM, la portadora y dos bandas laterales de amplitud $m/2$.',
    'En FM el modulador va dentro de la fase; las bandas salen a $f_c \\pm k f_m$ y su número lo decide el índice $I$.',
    'Si $f_m/f_c$ es entero, las bandas son armónicos y suena a nota; si no, suena a campana. Es la síntesis FM del DX7.',
    'Por debajo de unos 20 Hz el oído sigue el vaivén; por encima, oye las frecuencias nuevas.'
  ]);
});
