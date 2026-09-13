/* Tema: Examen del bloque: síntesis de sonido */
Course.topic('son-examen', function (p) {

  p.puente('Catorce temas que van del seno que suena al [[son-taller|sintetizador entero]]. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, para saber si la matemática del sonido —el logaritmo de la escala, la serie de Fourier del timbre, las recurrencias de los filtros y los ecos— se ha quedado.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 14 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['La onda y la nota', 'Periodo, frecuencia y amplitud de un seno; cuántas muestras tiene un sonido y dónde cae el alias; de la nota MIDI a los hercios y vuelta; semitonos y cents.',
      '[[son-onda]] · [[son-muestras]] · [[son-tono]]'],
    ['Envolvente, timbre y espectro', 'Cuánto tarda en apagarse una exponencial; los tramos de una ADSR; la amplitud de un armónico de una sierra o una cuadrada; los modos de una cuerda; la frecuencia de un bin y la resolución de un espectro.',
      '[[son-envolvente]] · [[son-armonicos]] · [[son-cuerda]] · [[son-espectro]]'],
    ['Batidos, modulación y filtros', 'Cuántas veces late la suma de dos tonos; dónde caen las bandas laterales; nota o campana en FM; la media de dos muestras y el filtro de un polo, a mano.',
      '[[son-batidos]] · [[son-modulacion]] · [[son-filtros]]'],
    ['Ruido, eco y secuencia', 'El nivel del ruido; afinar y hacer durar una cuerda de Karplus-Strong; la altura y la suma de los ecos; los dientes del peine; en qué pulso estamos y qué nota toca.',
      '[[son-ruido]] · [[son-eco]] · [[son-secuencia]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 14 temas y 9 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Escribe las unidades.</strong> Hercios, segundos, muestras y cents se mezclan en la misma pregunta, y la mitad de los errores del bloque son un factor de 1000 o un $1/f$ que se quedó sin invertir.',
    '<strong>Para lo logarítmico, logaritmos.</strong> Semitonos, cents y decibelios no se suman ni se restan en hercios: son cocientes. Si una pregunta habla de «subir» una nota, piensa en multiplicar.',
    '<strong>Las recurrencias, a mano y despacio.</strong> Un filtro o un eco se resuelven escribiendo tres o cuatro términos de la sucesión: es lo que hace el sintetizador, muestra a muestra.',
    '<strong>Lo que falles, tócalo.</strong> Cada pregunta enlaza con su tema y allí el sintetizador puede reproducir la fórmula: oír un batido o un filtro cerrado enseña más que releer la definición.'
  ], true);

  p.comprueba('Una pregunta pide la frecuencia de una nota tres semitonos por encima de 440 Hz y te sale 443. ¿Qué ha pasado?', [
    { t: 'Se ha sumado en vez de multiplicar: son $440\\cdot 2^{3/12}$, unos 523 Hz', ok: true, por: 'La escala es logarítmica: cada semitono multiplica por $2^{1/12}$. Sumar hercios funciona con los batidos, no con las notas.' },
    { t: 'Nada: 443 es correcto', ok: false, por: 'Tres hercios de diferencia son un batido lento, no tres semitonos. Tres semitonos son casi un 20 % más de frecuencia.' },
    { t: 'Falta convertir a cents', ok: false, por: 'Los cents miden lo mismo con otra escala (100 por semitono), pero el resultado pedido está en hercios: lo que falta es la potencia de 2.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de síntesis de sonido',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'La onda y la nota', temas: ['son-onda', 'son-muestras', 'son-tono'], n: 2, min: 10 },
      { titulo: 'Envolvente, timbre y espectro', temas: ['son-envolvente', 'son-armonicos', 'son-cuerda', 'son-espectro'], n: 3, min: 15 },
      { titulo: 'Batidos, modulación y filtros', temas: ['son-batidos', 'son-modulacion', 'son-filtros'], n: 2, min: 10 },
      { titulo: 'Ruido, eco y secuencia', temas: ['son-ruido', 'son-eco', 'son-secuencia'], n: 2, min: 10 }
    ]
  });

  p.hist('Los conservatorios examinaron durante siglos con el oído: dictados de intervalos y de ritmos que había que escribir en el pentagrama. El examen de este bloque hace lo mismo con números —cuántos hercios, cuántos batidos, en qué pulso—, porque es lo que el sintetizador de cada tema ha ido enseñando: que detrás de cada cosa que se oye hay una cuenta que se puede hacer.');
});
