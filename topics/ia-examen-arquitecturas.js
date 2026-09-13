/* Tema: Examen del bloque: las arquitecturas */
Course.topic('ia-examen-arquitecturas', function (p) {

  p.puente('Catorce arquitecturas, cada una con su idea matemática: la [[ia-cnn|convolución]], el [[ia-hopfield|valle de energía]], la [[ia-atencion|atención]], la [[ia-refuerzo|ecuación de Bellman]]. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, para saber si se ha entendido qué calcula cada arquitectura y no solo cómo se llama.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 14 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Imágenes y memoria', 'El tamaño de la salida de una convolución y cuántos parámetros tiene; la energía de un estado de Hopfield; un paso de una RNN y las puertas de una LSTM.',
      '[[ia-cnn]] · [[ia-hopfield]] · [[ia-recurrentes]]'],
    ['Generar', 'El cuello de botella de un autocodificador y la pérdida de un VAE; el juego de la GAN; cuánto ruido queda tras un paso de difusión.',
      '[[ia-autocodificador]] · [[ia-gan]] · [[ia-difusion]]'],
    ['Lenguaje', 'Trocear con BPE; la probabilidad y la perplejidad de un n-grama; la similitud de dos vectores de palabras; los pesos de atención de una consulta; cuántos parámetros y cuánta memoria tiene un LLM.',
      '[[ia-tokens]] · [[ia-secuencias]] · [[ia-vectores-palabras]] · [[ia-atencion]] · [[ia-llm]]'],
    ['Refuerzo, límites y taller', 'Una actualización de Q-learning con la ecuación de Bellman; qué no puede saber un modelo y por qué; los mandos del taller.',
      '[[ia-refuerzo]] · [[ia-limites]] · [[ia-taller]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 14 temas y 9 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Cuenta parámetros con una fórmula, no a ojo.</strong> Un filtro de $3\\times 3$ con 16 canales de entrada y 32 de salida son $3\\cdot 3\\cdot 16\\cdot 32 + 32$: escríbelo entero.',
    '<strong>El softmax se comprueba sumando.</strong> Si los pesos de atención no suman 1, falta la normalización o sobra una exponencial.',
    '<strong>Bellman lleva un descuento.</strong> El $\\gamma$ multiplica al futuro; olvidarlo es el error más frecuente de las preguntas de refuerzo.',
    '<strong>Lo que falles, ábrelo en el taller.</strong> Cada pregunta enlaza con su tema; en el taller todos los mandos están a la vista y la red se entrena de verdad.'
  ], true);

  p.comprueba('Una pregunta pide los pesos de atención de una consulta sobre tres claves y te salen $0{,}5$, $0{,}3$ y $0{,}4$. ¿Qué ha pasado?', [
    { t: 'Suman 1,2: falta dividir por la suma de las exponenciales', ok: true, por: 'El softmax reparte exactamente uno entre las claves. Si la suma no da 1, la normalización está mal o se ha olvidado.' },
    { t: 'Nada: cada peso está entre 0 y 1', ok: false, por: 'Estar entre 0 y 1 es necesario pero no basta: los pesos de atención son una distribución, y una distribución suma 1.' },
    { t: 'Sobra una clave', ok: false, por: 'El número de pesos es el de claves, tres. Lo que sobra es 0,2 de masa: el problema es la normalización.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de Inteligencia artificial II',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Imágenes y memoria', temas: ['ia-cnn', 'ia-hopfield', 'ia-recurrentes'], n: 2, min: 10 },
      { titulo: 'Generar', temas: ['ia-autocodificador', 'ia-gan', 'ia-difusion'], n: 2, min: 10 },
      { titulo: 'Lenguaje', temas: ['ia-tokens', 'ia-secuencias', 'ia-vectores-palabras', 'ia-atencion', 'ia-llm'], n: 3, min: 15 },
      { titulo: 'Refuerzo, límites y taller', temas: ['ia-refuerzo', 'ia-limites', 'ia-taller'], n: 2, min: 10 }
    ]
  });

  p.hist('Cuando en 2012 una red convolucional ganó el concurso ImageNet por un margen enorme, la prueba era un examen en el sentido más literal: un millón de imágenes etiquetadas, una respuesta por imagen y una nota. Desde entonces cada arquitectura de este bloque se ha medido en pruebas parecidas, y el examen de aquí pregunta lo que hay que saber para leer esos resultados: qué calcula cada una y cuánto cuesta.');
});
