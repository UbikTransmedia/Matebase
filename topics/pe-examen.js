/* Tema: Examen del bloque: probabilidad y estadística */
Course.topic('pe-examen', function (p) {

  p.puente('Doce temas para lo que no se sabe con certeza: describir datos, medir el azar y decidir a partir de una muestra. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, y con la trampa propia de la estadística: casi todos los fallos son de interpretación, no de cuenta.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 12 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Describir y relacionar', 'Media, mediana y desviación típica a partir de una tabla; decidir cuál resume mejor unos datos con valores extremos; recta de regresión, coeficiente de correlación y qué se puede predecir con ella.',
      '[[pe-descriptiva]] · [[pe-bidimensional]]'],
    ['Contar y calcular probabilidades', 'Elegir entre variación, permutación y combinación; Laplace y el álgebra de sucesos; probabilidad condicionada, árbol, probabilidad total y Bayes.',
      '[[pe-combinatoria]] · [[pe-probabilidad]] · [[pe-condicionada]]'],
    ['Distribuciones', 'Calcular una probabilidad binomial y su media y varianza; tipificar y usar la tabla de la normal; aproximar una binomial por una normal cuando procede; función de densidad y su integral.',
      '[[pe-binomial]] · [[pe-continuas]] · [[pe-normal]]'],
    ['Inferir y decidir', 'Intervalo de confianza para la media y para una proporción; tamaño de muestra para un error dado; plantear las hipótesis de un contraste, decidir y decir qué significa el resultado; distinguir correlación de causa.',
      '[[pe-inferencia]] · [[pe-proporcion]] · [[pe-contraste]] · [[pe-causal]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 12 temas y 10 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Escribe los sucesos con nombre antes de calcular.</strong> «$A$: la pieza es defectuosa», «$B$: viene de la máquina 2». Con los nombres puestos, el árbol y la fórmula de Bayes salen solos; sin ellos se confunde $P(A|B)$ con $P(B|A)$, que es el error clásico.',
    '<strong>Dibuja la campana y sombrea.</strong> Antes de buscar en la tabla, marca en la normal la zona que se pide. Es lo que decide si hay que restar de uno, sumar dos colas o mirar el valor simétrico.',
    '<strong>Un contraste no demuestra la hipótesis nula.</strong> Se rechaza o no se rechaza, y no rechazar no es aceptar. Casi toda la nota de esas preguntas está en redactar bien la conclusión.',
    '<strong>Correlación no es causa, y el examen lo pregunta.</strong> Si dos variables suben juntas, piensa antes en una tercera que mueva a las dos. Decirlo explícitamente es lo que se corrige.'
  ], true);

  p.comprueba('Un contraste da $p = 0{,}08$ con nivel de significación $0{,}05$. ¿Qué se concluye?', [
    { t: 'No se rechaza la hipótesis nula: no hay prueba suficiente en su contra', ok: true, por: 'Con $p$ por encima del nivel, los datos son compatibles con la nula. Eso no la demuestra: solo dice que esta muestra no basta para descartarla.' },
    { t: 'Se acepta la hipótesis nula: queda demostrada', ok: false, por: 'Un contraste nunca demuestra la nula. Con una muestra mayor, ese mismo efecto podría salir significativo: la falta de prueba no es prueba de ausencia.' },
    { t: 'Se rechaza, porque $0{,}08$ está cerca de $0{,}05$', ok: false, por: 'El nivel se fija antes de mirar los datos, justo para no decidir por cercanía. Moverlo después es lo que convierte un contraste en una profecía.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de probabilidad y estadística',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Describir y relacionar', temas: ['pe-descriptiva', 'pe-bidimensional'], n: 3, min: 15 },
      { titulo: 'Contar y calcular probabilidades', temas: ['pe-combinatoria', 'pe-probabilidad', 'pe-condicionada'], n: 3, min: 15 },
      { titulo: 'Distribuciones', temas: ['pe-binomial', 'pe-continuas', 'pe-normal'], n: 2, min: 10 },
      { titulo: 'Inferir y decidir', temas: ['pe-inferencia', 'pe-proporcion', 'pe-contraste', 'pe-causal'], n: 2, min: 10 }
    ]
  });

  p.hist('El contraste de hipótesis nació como un procedimiento de control de calidad: en la cervecera Guinness de Dublín, a principios del siglo XX, William Gosset necesitaba decidir con muestras muy pequeñas si un lote de cebada era mejor que otro, y publicó su distribución bajo el seudónimo «Student» porque la empresa prohibía publicar. Aquel problema —decidir con pocos datos y un criterio fijado de antemano— es exactamente el del último tramo de este examen.');
});
