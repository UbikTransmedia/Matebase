/* Tema: Examen del bloque: lógica, demostración y problemas */
Course.topic('lg-examen', function (p) {

  p.puente('Cinco temas que no enseñan a calcular nada: enseñan a decir con precisión y a comprobar que lo dicho es cierto. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, para saber si el lenguaje con el que está escrito el resto del curso —[[lg-proposiciones|la proposición]], [[lg-conjuntos|el conjunto]] y [[lg-demostracion|la demostración]]— se ha quedado.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 5 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Decir con precisión', 'Negar una proposición con cuantificadores; decidir si una implicación es verdadera y distinguirla de su recíproca; operar con uniones, intersecciones y complementarios; saber si una aplicación es inyectiva, suprayectiva o biyectiva.',
      '[[lg-proposiciones]] · [[lg-conjuntos]]'],
    ['Demostrar y resolver', 'Elegir el método de demostración que conviene; completar el paso de inducción; estimar un orden de magnitud con datos inventados pero razonables; seguir un algoritmo en pseudocódigo y decir qué devuelve y cuántos pasos da.',
      '[[lg-demostracion]] · [[lg-problemas]] · [[lg-algoritmos]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 5 temas y 6 preguntas, un examen recorre casi el bloque entero: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Niega por partes, no de golpe.</strong> Cambia cada cuantificador por el otro y niega solo el final. La negación de «todos los cisnes son blancos» no es «ninguno lo es»: es «hay uno que no lo es», y esa diferencia vale un ejercicio entero.',
    '<strong>Antes de demostrar, di qué método usas.</strong> Directa, contrarrecíproca, reducción al absurdo o inducción. Escribirlo en la primera línea ordena el resto y evita la demostración que da vueltas sin llegar.',
    '<strong>En una estimación, escribe los supuestos.</strong> Lo que se corrige no es el número final, sino que la cadena de supuestos sea razonable y las unidades cuadren. Un resultado bueno con supuestos ocultos no vale nada.',
    '<strong>Sigue el pseudocódigo con una tabla.</strong> Una columna por variable, una fila por vuelta. Es la misma tabla que usarás en el bloque de máquinas, y aquí ya evita el error de contar mal las vueltas.'
  ], true);

  p.comprueba('En una pregunta de inducción compruebas que la fórmula vale para $n = 1$ y se te acaba el tiempo. ¿Qué has demostrado?', [
    { t: 'Nada todavía: falta el paso que va de $n$ a $n + 1$', ok: true, por: 'El caso base sin paso inductivo es una comprobación, no una demostración. Con una sola ficha de dominó caída no se cae la fila: hace falta saber que cada una tira a la siguiente.' },
    { t: 'La fórmula, porque si vale para el primero vale para todos', ok: false, por: 'Eso es justo lo que hay que demostrar, y no se demuestra solo. Hay fórmulas que fallan a partir del cuarto término y aciertan en los tres primeros.' },
    { t: 'Media demostración, que suele puntuar la mitad', ok: false, por: 'El caso base es la parte corta y la barata. Si hay que repartir el tiempo, el paso inductivo es donde está casi toda la nota.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de lógica, demostración y problemas',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Decir con precisión', temas: ['lg-proposiciones', 'lg-conjuntos'], n: 3, min: 15 },
      { titulo: 'Demostrar y resolver', temas: ['lg-demostracion', 'lg-problemas', 'lg-algoritmos'], n: 3, min: 15 }
    ]
  });

  p.hist('Los exámenes orales de las universidades medievales eran <em>disputationes</em>: un estudiante defendía una tesis y otros la atacaban con contraejemplos, y ganaba quien no se dejara coger en contradicción. No se preguntaba el resultado, sino el razonamiento, exactamente como en este bloque. La costumbre sobrevive en la defensa de una tesis doctoral, que sigue llamándose así.');
});
