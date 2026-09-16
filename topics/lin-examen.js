/* Tema: Examen del bloque: álgebra lineal */
Course.topic('lin-examen', function (p) {

  p.puente('Seis temas que cuentan qué es de verdad una matriz: una aplicación que lleva vectores a vectores, con direcciones propias, con una manera de ajustar datos y con un comportamiento a largo plazo. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 6 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Espacios, autovalores y proyecciones', 'Decidir si unos vectores son base; matriz de una aplicación lineal y cambio de base; polinomio característico, autovalores y autovectores; diagonalizar; proyectar sobre un subespacio y ajustar por mínimos cuadrados.',
      '[[av-espacios]] · [[av-lineal]] · [[av-minimos-cuadrados]]'],
    ['Descomponer y evolucionar', 'Centrar datos y sacar la primera componente principal; interpretar los valores singulares y truncar una descomposición; matriz de transición, distribución estacionaria y a dónde llega una cadena a la larga.',
      '[[av-pca]] · [[av-svd]] · [[av-markov]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 6 temas y 6 preguntas, un examen recorre casi el bloque entero: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Comprueba cada autovector.</strong> Multiplicar $Av$ y ver si sale $\\lambda v$ cuesta una línea y detecta el error de signo del polinomio característico, que es el más frecuente del bloque.',
    '<strong>Los autovalores salen de un determinante, y el determinante de una triangular es el producto de la diagonal.</strong> Antes de desarrollar, mira si la matriz ya es triangular o casi: ahorra media pregunta.',
    '<strong>Proyectar es restar lo perpendicular.</strong> Mínimos cuadrados, PCA y la proyección sobre un subespacio son la misma operación vista de tres maneras; reconocerlo evita aprenderse tres fórmulas.',
    '<strong>En una cadena de Markov, comprueba que las columnas suman uno.</strong> Si no suman, hay un error de transcripción y todo lo que venga después estará mal sin que se note.'
  ], true);

  p.comprueba('Una matriz $3 \\times 3$ tiene un autovalor doble y solo un autovector independiente para él. ¿Se puede diagonalizar?', [
    { t: 'No: harían falta tantos autovectores independientes como grados de multiplicidad', ok: true, por: 'Diagonalizar es escribir la matriz en una base de autovectores, y para eso hacen falta tres independientes. Con dos no se llega, y la matriz solo admite la forma de Jordan.' },
    { t: 'Sí: basta con que haya tres autovalores contando multiplicidades', ok: false, por: 'Los autovalores se cuentan siempre con multiplicidad, así que ese criterio no distingue nada. Lo que decide es cuántos autovectores independientes hay.' },
    { t: 'Sí, pero solo sobre los complejos', ok: false, por: 'Pasar a los complejos resuelve los autovalores que no son reales, no la falta de autovectores. Aquí el autovalor ya existe: lo que falta es una dirección propia más.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de álgebra lineal',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Espacios, autovalores y proyecciones', temas: ['av-espacios', 'av-lineal', 'av-minimos-cuadrados'], n: 3, min: 15 },
      { titulo: 'Descomponer y evolucionar', temas: ['av-pca', 'av-svd', 'av-markov'], n: 3, min: 15 }
    ]
  });

  p.hist('Los autovalores se llamaron primero <em>Eigenwerte</em>, «valores propios», en la escuela alemana de Hilbert, y llegaron a la física con la mecánica cuántica: los niveles de energía de un átomo son los autovalores de un operador. La palabra viajó al inglés a medias, sin traducir el primer trozo, y por eso hoy se dice <em>eigenvalue</em> en todo el mundo. Aquí se calculan a mano por la misma razón por la que se calculan a mano las derivadas: para saber qué está haciendo el ordenador cuando los calcula él.');
});
