/* Tema: Examen del bloque: geometría del plano y del espacio */
Course.topic('ge-examen', function (p) {

  p.puente('Doce temas que empiezan midiendo un triángulo y terminan cortando dos planos en el espacio. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, para saber si la traducción entre el dibujo y la ecuación —que es de lo que va este bloque— se hace ya en los dos sentidos.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 12 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Medir figuras', 'Ángulos en triángulos y paralelas; aplicar Pitágoras y decidir cuándo se puede; razones de semejanza y el teorema de Tales; perímetros, áreas y el área o el volumen de un cuerpo a partir de sus medidas.',
      '[[ge-angulos]] · [[ge-pitagoras]] · [[ge-semejanza]] · [[ge-areas]] · [[ge-cuerpos]]'],
    ['El plano con coordenadas', 'Operar con vectores y calcular su módulo; pasar de la ecuación vectorial a la general de una recta; posición relativa de dos rectas; identificar una cónica y sacar sus elementos a partir de la ecuación.',
      '[[ge-vectores]] · [[ge-rectas]] · [[ge-conicas]]'],
    ['Rectas y planos en el espacio', 'Producto escalar, vectorial y mixto; ecuaciones de una recta y de un plano; decidir si dos rectas se cruzan, se cortan o son paralelas; la recta que sale de cortar dos planos.',
      '[[ge-espacio-vectores]] · [[ge-espacio]]'],
    ['Distancias y movimientos', 'Distancia de un punto a una recta y a un plano; ángulo entre rectas o entre planos; el punto simétrico y la proyección; identificar un movimiento y componer dos.',
      '[[ge-metrico]] · [[ge-transformaciones]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 12 temas y 10 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Dibuja siempre, aunque sea mal.</strong> Un croquis a mano alzada con los datos puestos encima descarta la mitad de los errores de signo y enseña qué fórmula hace falta. En el espacio, dibujar los ejes y el vector director basta.',
    '<strong>Elige la ecuación que menos trabajo dé.</strong> Para cortar con un plano, la paramétrica de la recta; para ver si un punto pertenece, la general. Cambiar de forma cuesta dos líneas y ahorra media hoja.',
    '<strong>El producto escalar contesta a casi todo.</strong> Perpendicularidad, ángulo y proyección salen de él. Si un enunciado pregunta por un ángulo o por una distancia, empieza por ahí antes de buscar una fórmula específica.',
    '<strong>Comprueba con un punto.</strong> Sustituir un punto conocido en la ecuación que acabas de obtener cuesta diez segundos y detecta casi cualquier error de despeje.'
  ], true);

  p.comprueba('Te piden la distancia de un punto a una recta en el espacio y te sabes la fórmula del plano. ¿Qué haces?', [
    { t: 'Proyecto el punto sobre la recta y mido, o uso el producto vectorial', ok: true, por: 'Las dos salidas son buenas y ninguna necesita recordar una fórmula nueva: la proyección con el producto escalar, o el área del paralelogramo dividida por el módulo del director.' },
    { t: 'Uso la fórmula del plano con el vector director como normal', ok: false, por: 'Eso da la distancia a un plano perpendicular a la recta, que no es lo mismo: pasa por cualquier punto de ella y la distancia sale casi siempre distinta.' },
    { t: 'Dejo la pregunta: sin la fórmula exacta no se puede', ok: false, por: 'Casi ninguna distancia de este bloque necesita una fórmula propia. Con el producto escalar y el vectorial se deducen todas, y deducirla puntúa igual que recordarla.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de geometría del plano y del espacio',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Medir figuras', temas: ['ge-angulos', 'ge-pitagoras', 'ge-semejanza', 'ge-areas', 'ge-cuerpos'], n: 3, min: 15 },
      { titulo: 'El plano con coordenadas', temas: ['ge-vectores', 'ge-rectas', 'ge-conicas'], n: 2, min: 10 },
      { titulo: 'Rectas y planos en el espacio', temas: ['ge-espacio-vectores', 'ge-espacio'], n: 3, min: 15 },
      { titulo: 'Distancias y movimientos', temas: ['ge-metrico', 'ge-transformaciones'], n: 2, min: 10 }
    ]
  });

  p.hist('Sobre la puerta de la Academia de Platón estaba escrito, según la tradición, que no entrara nadie que no supiera geometría. No era una prueba de cálculo: se pedía saber demostrar, y los <em>Elementos</em> de Euclides se usaron como manual durante más de dos mil años, más que cualquier otro libro de texto. La costumbre de exigir la construcción y no solo el número sigue viva en los ejercicios de este bloque.');
});
