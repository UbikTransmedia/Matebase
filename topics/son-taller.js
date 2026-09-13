/* Tema: El taller: tu propio sintetizador */
Course.topic('son-taller', function (p) {

  p.puente('Trece temas, y cada uno ha dejado una pieza: el [[son-onda|seno]], la [[son-envolvente|envolvente]], ' +
    'los [[son-armonicos|armónicos]], la [[son-modulacion|modulación]], el [[son-filtros|filtro]], el ' +
    '[[son-ruido|ruido]], el [[son-eco|eco]] y el [[son-secuencia|secuenciador]]. Este tema no enseña ' +
    'nada nuevo: las junta todas en un instrumento con todos los mandos a la vista, y te deja el ' +
    'código para que lo hagas tuyo. Después dice dónde seguir.');

  p.section('La cadena de un sintetizador');

  p.text('Casi todos los sintetizadores, de 1970 o de hoy, tienen la misma arquitectura, y ya la ' +
    'conoces entera. Cada caja es un tema de este bloque, y la señal va de izquierda a derecha:');

  p.table(['Etapa', 'Qué hace', 'La matemática', 'Tema'], [
    ['Oscilador', 'la onda cruda: seno, sierra, cuadrada, ruido', 'funciones periódicas, series de Fourier', '[[son-onda]], [[son-armonicos]]'],
    ['Afinación', 'de la nota a los hercios', 'exponencial y logaritmo en base 2', '[[son-tono]]'],
    ['Modulación', 'vibrato, trémolo, FM', 'productos de senos, bandas laterales', '[[son-modulacion]]'],
    ['Filtro', 'quitar agudos, y moverlo con el tiempo', 'sucesiones recurrentes', '[[son-filtros]]'],
    ['Envolvente', 'el ataque y la cola de cada nota', 'función a trozos, exponencial', '[[son-envolvente]]'],
    ['Efectos', 'eco, reverberación, peine', 'series geométricas', '[[son-eco]]'],
    ['Secuenciador', 'qué nota y cuándo', 'parte entera y resto', '[[son-secuencia]]']
  ]);

  p.text('En el sintetizador de abajo cada etapa es una función auxiliar, y <code>sonido</code> las ' +
    'encadena. Los mandos tocan los parámetros más importantes; todo lo demás se cambia en el ' +
    'código. Es largo para lo que suele ser un sintetizador de este bloque, pero cada línea la has ' +
    'visto ya.');

  p.demo({
    title: 'El instrumento completo',
    intro: 'Una secuencia de ocho notas, cada una con oscilador (mezcla de sierra y cuadrada), vibrato, filtro con envolvente propia, envolvente de volumen y un eco. Toca primero como está. Luego cambia una cosa cada vez: la lista de notas, la forma de onda, la velocidad del vibrato, el retardo del eco. Cuando algo te guste, queda guardado en este navegador.',
    predice: 'Con la resonancia del filtro a cero y el eco a cero, ¿qué queda? Una sierra con envolvente, tocando la lista. Súbelo todo después y compara.',
    build: function (host) {
      W.sinte(host, {
        id: 'son-taller-1', dur: 2, loop: true, ventana: 2000, fmax: 5000,
        mandos: [
          { n: 'corte', label: 'filtro: apertura', min: 0.02, max: 1, step: 0.01, value: 0.35, dec: 2 },
          { n: 'vib', label: 'vibrato: profundidad (semitonos)', min: 0, max: 1, step: 0.05, value: 0.2, dec: 2 },
          { n: 'eco', label: 'eco: ganancia', min: 0, max: 0.8, step: 0.05, value: 0.35, dec: 2 },
          { n: 'mezcla', label: 'oscilador: 0 sierra … 1 cuadrada', min: 0, max: 1, step: 0.05, value: 0.3, dec: 2 }
        ],
        codigo:
          '// ---- la partitura ----\n' +
          'var bpm = 120;\n' +
          'var notas = [57, 60, 64, 67, 69, 67, 64, 60];    // corcheas, en bucle\n' +
          '\n' +
          '// ---- las etapas ----\n' +
          'function oscilador(f, u) {\n' +
          '    // vibrato: la frecuencia oscila «vib» semitonos, seis veces por segundo\n' +
          '    var fv = f * pow(2, vib * sin(TAU * 6 * u) / 12);\n' +
          '    return mix(sierra(fv, u), cuadrada(fv, u), mezcla);\n' +
          '}\n' +
          'function envolvente(u, dur) {\n' +
          '    return adsr(u, 0.01, 0.15, 0.5, 0.08, dur - 0.08);\n' +
          '}\n' +
          'function filtro(x, u) {\n' +
          '    // el corte baja con el tiempo dentro de la nota: brillante al atacar\n' +
          '    var a = 0.02 + corte * exp(-u / 0.2);\n' +
          '    return a * x + (1 - a) * anterior();\n' +
          '}\n' +
          '\n' +
          '// ---- la cadena ----\n' +
          'function sonido(t) {\n' +
          '    var Tp = 60 / bpm / 2;                       // corcheas\n' +
          '    var n = floor(t / Tp), u = t - n * Tp;\n' +
          '    var f = nota(notas[n % notas.length]);\n' +
          '    var x = 0.35 * envolvente(u, Tp) * oscilador(f, u);\n' +
          '    var y = filtro(x, u);\n' +
          '    return y + eco * antes(0.375);               // el eco a tres corcheas\n' +
          '}\n',
        nota: 'El eco está a 0,375 s, tres corcheas: cae siempre a contratiempo, y por eso «rellena». ' +
          'Prueba 0,25 (una negra) o 0,5, y verás que el mismo bucle suena a otra cosa. Y el vibrato ' +
          'está en semitonos, no en hercios, porque el oído es logarítmico: así se mueve lo mismo en ' +
          'el grave que en el agudo.'
      });
    }
  });

  p.section('Cinco retos');

  p.text('Cada uno es un cambio pequeño en el código de arriba, y en cada uno hay una idea del ' +
    'bloque que se vuelve a usar. No hay corrección automática: el corrector eres tú, escuchando.');

  p.list([
    '<strong>Una segunda voz.</strong> Añade un bajo en negras, una octava por debajo de la primera nota de cada pareja: <code>nota(notas[(2 * floor(n / 2)) % 8] - 12)</code>. Súmalo con su propia envolvente, y baja los volúmenes para no recortar.',
    '<strong>Karplus-Strong en vez del oscilador.</strong> Sustituye <code>oscilador</code> por la cuerda de [[son-ruido]]: hace falta el índice de muestra <code>i</code> y saber en qué muestra empezó la nota ($n \\cdot T_p \\cdot f_s$).',
    '<strong>Un acorde.</strong> En vez de una nota, tres: la de la lista, una tercera mayor encima (+4 semitonos) y una quinta (+7). Comprueba con [[son-batidos]] por qué +4 y +7 y no +5 y +6.',
    '<strong>Un compás distinto.</strong> Doce notas en vez de ocho, con $T_p$ ajustado para que quepan en los dos segundos: es un compás de 6/8. O siete, para un compás irregular.',
    '<strong>Una campana FM.</strong> Cambia el oscilador por el de [[son-modulacion]] con razón 1,41 y un índice que decae, y quita el filtro: las campanas ya vienen filtradas de fábrica.'
  ]);

  p.section('Lo que has usado del curso');

  p.text('Merece la pena mirarlo escrito, porque es la respuesta a «¿y esto para qué sirve?» que se ' +
    'oye en cada clase de matemáticas: para que un altavoz suene.');

  p.table(['Del curso', 'En el sonido'], [
    ['Funciones periódicas y trigonometría', 'el seno que suena, la sierra, el periodo y la frecuencia'],
    ['Exponencial y logaritmo', 'la escala de notas ($2^{n/12}$), los cents, la envolvente que decae, los decibelios'],
    ['Identidades trigonométricas', 'batidos, consonancia, modulación de amplitud y sus bandas laterales'],
    ['Series de Fourier', 'el timbre como suma de armónicos; el espectro como pregunta a la señal'],
    ['Sucesiones recurrentes y series geométricas', 'filtros, Karplus-Strong, el eco y su convergencia'],
    ['Derivada e integral', 'la frecuencia instantánea como derivada de la fase; el glissando'],
    ['Probabilidad', 'el ruido: una variable uniforme por muestra, con su varianza'],
    ['Divisibilidad', 'el secuenciador: parte entera y resto'],
    ['Ondas estacionarias', 'de dónde salen los armónicos de una cuerda y de un tubo']
  ]);

  p.section('Dónde seguir');

  p.text('El sintetizador de este bloque es una función de $t$ que se calcula entera antes de sonar. ' +
    'Los de verdad calculan muestra a muestra <em>mientras</em> suenan, para reaccionar a un teclado o ' +
    'a un mando en tiempo real, y eso pide otro modelo de programación. Estas son las puertas:');

  p.list([
    '<strong>Web Audio</strong>, en el propio navegador. La API que este bloque usa solo para reproducir tiene osciladores, filtros, retardos y envolventes como nodos que se conectan entre sí, y con un <em>AudioWorklet</em> se escribe la función muestra a muestra en JavaScript, como aquí. No hay que instalar nada.',
    '<strong>Sonic Pi</strong> (sonic-pi.net), gratuito, pensado para enseñar: se escribe <code>play 60</code> y suena, con sintetizadores y efectos ya hechos y bucles que se cambian en directo. Todo lo de [[son-secuencia]] está ahí como lenguaje.',
    '<strong>SuperCollider</strong>, el estándar de la música por ordenador desde 1996: un servidor de síntesis y un lenguaje para controlarlo. Es donde viven las ideas de este bloque a escala profesional, y es gratuito.',
    '<strong>Pure Data</strong> o <strong>Max</strong>: lo mismo, pero dibujando cajas y cables en vez de escribir. La cadena de la tabla de arriba, literalmente conectada con el ratón.',
    '<strong>Faust</strong>, un lenguaje donde un filtro se escribe como una ecuación en diferencias y se compila a cualquier cosa, y el libro <em>The Audio Programming Book</em> o el curso en línea <em>Physical Audio Signal Processing</em> de Julius Smith, para la teoría entera de la que este bloque es la primera página.'
  ]);

  p.hist('La música por ordenador nació en 1957 en los laboratorios Bell, cuando Max Mathews escribió ' +
    'MUSIC I: un programa que calculaba muestras y las escribía en una cinta que después se convertía ' +
    'en sonido, porque el ordenador era mil veces demasiado lento para hacerlo en directo. Exactamente ' +
    'el modelo de este bloque: calcular todo, y luego oír. Su versión MUSIC V de 1968 introdujo los ' +
    '<em>generadores unitarios</em> —oscilador, envolvente, filtro— que se conectan en cadena, la ' +
    'arquitectura de la tabla de arriba y de todo lo que vino después, de Csound a SuperCollider. ' +
    'Mathews decía que el ordenador era el instrumento definitivo: cualquier sonido que se pudiera ' +
    'describir, lo podía producir. La descripción es una función del tiempo, y ese es el bloque entero.');

  p.util('Lo que hace un sintetizador es lo que hace cualquier programa que produce una señal: un ' +
    'generador de vídeo, un simulador de circuitos, un modelo climático o un motor de físicas de un ' +
    'videojuego calculan «el siguiente valor a partir de los anteriores y del tiempo», a miles de ' +
    'veces por segundo. Quien ha escrito un filtro de un polo ha escrito un integrador numérico; quien ' +
    'ha afinado una secuencia ha manejado un reloj de tiempo real. Y el análisis espectral que aquí ' +
    'mira una nota mira, en otros sitios, terremotos, latidos, órbitas y precios.');

  p.comprueba('El sintetizador de este bloque calcula los dos segundos enteros antes de sonar. ¿Qué no puede hacer, por eso, que un sintetizador de verdad sí hace?', [
    { t: 'Reaccionar mientras suena: a una tecla, a un mando, a un micrófono', ok: true, por: 'Todo está decidido antes de la primera muestra. Un instrumento de verdad calcula cada muestra en el momento y puede cambiar de rumbo; para eso hace falta calcular en tiempo real, muestra a muestra, con el modelo de Web Audio o SuperCollider.' },
    { t: 'Usar filtros y ecos', ok: false, por: 'Los usa: <code>anterior</code> y <code>antes</code> leen lo ya calculado. Lo que no puede es responder a algo que ocurra <em>después</em> de calcular.' },
    { t: 'Sonar afinado', ok: false, por: 'Suena tan afinado como la fórmula: el cálculo es el mismo que el de cualquier sintetizador digital.' }
  ]);

  p.trampas([
    { e: 'Cambiar muchas cosas a la vez', por: 'Si tocas cinco líneas y suena mal, no sabes cuál fue. Una cada vez, tocar, decidir.' },
    { e: 'Sumar voces sin escalar', por: 'Cada voz nueva suma amplitud. El aviso de recorte del sintetizador está para eso: cuando salga, baja los volúmenes.' },
    { e: 'Poner el filtro después del eco', por: 'El orden de la cadena importa: filtrar el eco apaga también las repeticiones; poner el eco después del filtro las deja brillantes. Prueba los dos.' },
    { e: 'Creer que esto es «lo fácil» y lo de verdad es otra cosa', por: 'Es lo mismo. Un sintetizador profesional es este código, muestra a muestra, con más etapas y en tiempo real. La matemática no cambia.' }
  ]);

  p.note('Cuando quieras saber si el bloque entero se ha quedado, en [[son-examen]] hay un examen procedimental con preguntas de todos sus temas, con reloj y corregido al entregar.', 'ok', 'Para medirte');

  p.keys([
    'La cadena de un sintetizador: oscilador → modulación → filtro → envolvente → efectos, y un secuenciador que decide qué nota y cuándo. Cada etapa es una función.',
    'Todo el bloque cabe en un instrumento de cuarenta líneas, y cada línea es un tema: senos, logaritmos, Fourier, recurrencias, series, probabilidad, divisibilidad.',
    'Se cambia una cosa cada vez y se escucha: el corrector es el oído.',
    'Para seguir: Web Audio (en el navegador), Sonic Pi (para empezar), SuperCollider y Pure Data (para todo), y la síntesis en tiempo real, muestra a muestra.',
    'Cualquier sonido que se pueda describir como función del tiempo se puede producir. Esa es la idea de Max Mathews en 1957, y la de este bloque.'
  ]);
});
