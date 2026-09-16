/* Tema: Examen del bloque: trigonometría */
Course.topic('tr-examen', function (p) {

  p.puente('Cinco temas que convierten ángulos en longitudes y acaban en una onda que se repite. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, porque lo de aquí vuelve en [[fn-derivadas|las derivadas]], en [[av-fourier|Fourier]] y en cada sonido del bloque de síntesis.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 5 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Razones y circunferencia', 'Seno, coseno y tangente en un triángulo rectángulo; pasar de grados a radianes; el signo de cada razón según el cuadrante; reducir un ángulo al primer cuadrante.',
      '[[tr-razones]] · [[tr-circunferencia]]'],
    ['Identidades, teoremas y ondas', 'Usar la identidad fundamental y las del ángulo doble; resolver una ecuación trigonométrica dando todas las soluciones; aplicar el teorema del seno o el del coseno según los datos; leer amplitud, periodo y desfase de una sinusoide.',
      '[[tr-identidades]] · [[tr-teoremas]] · [[tr-funciones]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 5 temas y 6 preguntas, un examen recorre casi el bloque entero: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Dibuja la circunferencia antes de decidir el signo.</strong> Un ángulo situado en su cuadrante contesta solo a si el coseno es negativo o el seno positivo. Memorizar la tabla de signos falla; el dibujo, no.',
    '<strong>Trabaja en radianes si aparece una función.</strong> Las derivadas y las ondas del resto del curso están en radianes, y mezclar unidades a mitad de un problema es el error más caro del bloque.',
    '<strong>Una ecuación trigonométrica tiene infinitas soluciones.</strong> Da la general, con su periodo, y después particulariza al intervalo que pida el enunciado. Dar solo la del primer cuadrante deja medio ejercicio sin hacer.',
    '<strong>Con dos lados y un ángulo, coseno; con dos ángulos y un lado, seno.</strong> Elegir el teorema según los datos y no según la costumbre ahorra la mitad del tiempo en los problemas de triángulos.'
  ], true);

  p.comprueba('Resuelves $\\sin x = 1/2$ y escribes $x = 30°$. ¿Está completa la respuesta?', [
    { t: 'No: falta $150°$ y falta sumar las vueltas enteras', ok: true, por: 'El seno vale lo mismo en dos cuadrantes, y la función se repite cada $360°$. La respuesta completa es $x = 30° + 360°k$ y $x = 150° + 360°k$.' },
    { t: 'Sí: $30°$ es el ángulo cuyo seno es $1/2$', ok: false, por: 'Es <em>un</em> ángulo, no el único. La calculadora devuelve uno porque tiene que devolver algo; la ecuación tiene infinitos.' },
    { t: 'No: falta $-30°$, que también tiene seno $1/2$', ok: false, por: 'El seno de $-30°$ es $-1/2$, no $1/2$: el seno es impar. La segunda solución está en el segundo cuadrante, en $150°$.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de trigonometría',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Razones y circunferencia', temas: ['tr-razones', 'tr-circunferencia'], n: 3, min: 15 },
      { titulo: 'Identidades, teoremas y ondas', temas: ['tr-identidades', 'tr-teoremas', 'tr-funciones'], n: 3, min: 15 }
    ]
  });

  p.hist('Las primeras tablas trigonométricas se hicieron para examinar el cielo, no a los alumnos: Hiparco de Nicea tabuló cuerdas hacia el año 150 antes de nuestra era para predecir posiciones de astros, y Ptolomeo continuó el trabajo. Durante mil quinientos años, saber trigonometría significó saber usar una tabla; hoy la tabla está en la calculadora y lo que se examina es lo que aquella no puede hacer: elegir la razón, el cuadrante y el teorema.');
});
