/* Tema: Examen del bloque: aprender de los datos */
Course.topic('ia-examen-datos', function (p) {

  p.puente('Doce temas, de [[ia-que-es|qué significa aprender de ejemplos]] a [[ia-evaluar|cómo se sabe si funciona]]. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque —distancias, entropías, probabilidades, gradientes— con reloj y sin pistas, para saber si la matemática del aprendizaje se ha interiorizado.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 12 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Buscar, medir y decidir', 'Cuántos nodos explora una búsqueda y qué poda alfa-beta; la distancia entre dos ejemplos y el voto de los vecinos; la ganancia de información de una pregunta; Bayes ingenuo con una tabla de frecuencias.',
      '[[ia-que-es]] · [[ia-buscar]] · [[ia-distancia]] · [[ia-arboles]] · [[ia-bayes]]'],
    ['Margen, sigmoide y descenso', 'El margen de una recta separadora; el valor de la sigmoide y su derivada; una pérdida y un paso de descenso por el gradiente con una tasa dada.',
      '[[ia-margen]] · [[ia-sigmoide]] · [[ia-perdida]]'],
    ['La red y su evaluación', 'La pasada hacia delante de una red pequeña; la regla de la cadena en dos capas; cuándo se está memorizando; precisión, exhaustividad y la matriz de confusión.',
      '[[ia-red]] · [[ia-retropropagacion]] · [[ia-generalizar]] · [[ia-evaluar]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 12 temas y 8 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Escribe las dimensiones.</strong> Una matriz de $2\\times 12$ por un vector de 2: si no cuadran, la cuenta está mal antes de empezar. Es la comprobación más barata del bloque.',
    '<strong>Las probabilidades suman uno.</strong> En Bayes y en la sigmoide, si la suma no da 1 o un valor sale fuera de $[0, 1]$, hay un error de cálculo seguro.',
    '<strong>El gradiente apunta cuesta arriba</strong>: el paso va con signo menos. Es el despiste más habitual en las preguntas de descenso.',
    '<strong>Lo que falles, entrénalo.</strong> Cada pregunta enlaza con su tema, y allí las demos entrenan de verdad el modelo del que se pregunta: ver bajar la pérdida aclara qué hace cada número.'
  ], true);

  p.comprueba('Una pregunta de descenso por el gradiente da $w = 2$, gradiente $4$ y tasa $0{,}1$, y te sale $w = 2{,}4$. ¿Qué ha pasado?', [
    { t: 'Se ha sumado el paso: es $w - 0{,}1 \\cdot 4 = 1{,}6$', ok: true, por: 'El gradiente señala hacia donde crece la pérdida; para bajar se resta. El signo es la mitad del algoritmo.' },
    { t: 'La tasa es demasiado grande', ok: false, por: 'Con tasa 0,1 el paso es de 0,4: pequeño. El problema no es el tamaño, es la dirección.' },
    { t: 'Nada: 2,4 es correcto', ok: false, por: 'Sumar el gradiente sube la pérdida. Si el ejercicio dijera «ascenso», valdría; en aprendizaje siempre se baja.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de Inteligencia artificial I',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Buscar, medir y decidir', temas: ['ia-que-es', 'ia-buscar', 'ia-distancia', 'ia-arboles', 'ia-bayes'], n: 3, min: 15 },
      { titulo: 'Margen, sigmoide y descenso', temas: ['ia-margen', 'ia-sigmoide', 'ia-perdida'], n: 2, min: 10 },
      { titulo: 'La red y su evaluación', temas: ['ia-red', 'ia-retropropagacion', 'ia-generalizar', 'ia-evaluar'], n: 3, min: 15 }
    ]
  });

  p.hist('El primer «examen» de una inteligencia artificial lo propuso Alan Turing en 1950: una conversación por escrito en la que un juez tenía que decidir si hablaba con una persona o con una máquina. Este examen es más modesto y más honesto: no pregunta si un modelo parece listo, sino si quien lo estudia sabe hacer las cuentas que lo hacen funcionar.');
});
