/* Tema: Examen del bloque: cálculo en varias variables */
Course.topic('var-examen', function (p) {

  p.puente('Cuatro temas que repiten el análisis de [[fn-derivadas|una variable]] cuando la función depende de varias: derivar en cada dirección, buscar extremos en una superficie, optimizar atado a una condición e integrar sobre una región. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 4 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Derivar y optimizar', 'Derivadas parciales y gradiente; derivada direccional y dirección de máximo crecimiento; puntos críticos y matriz hessiana para clasificarlos; un paso de descenso de gradiente con su tasa de aprendizaje.',
      '[[av-vectorial]] · [[av-optimizacion]]'],
    ['Restricciones e integrales múltiples', 'Plantear el sistema de Lagrange y resolverlo; interpretar el multiplicador; poner los límites de una integral doble y cambiar el orden; pasar a polares o a cilíndricas cuando la región lo pide.',
      '[[av-lagrange]] · [[av-integrales-multiples]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 4 temas y 6 preguntas, un examen recorre casi el bloque entero: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>El gradiente apunta a la subida más rápida y es perpendicular a las curvas de nivel.</strong> Con eso se contestan la mitad de las preguntas del bloque sin calcular nada más.',
    '<strong>Clasificar un punto crítico es mirar el determinante de la hessiana y luego un signo.</strong> Determinante negativo, punto de silla; positivo, hay que mirar $f_{xx}$ para saber si es máximo o mínimo.',
    '<strong>En Lagrange, la restricción es una ecuación más.</strong> El sistema tiene tantas incógnitas como variables más el multiplicador, y olvidar la propia restricción deja el sistema indeterminado.',
    '<strong>Dibuja la región antes de poner los límites.</strong> Casi todos los errores de una integral doble están en los límites, no en la primitiva, y el dibujo también dice si conviene cambiar el orden o pasar a polares.'
  ], true);

  p.comprueba('En un punto crítico la hessiana tiene determinante negativo. ¿Qué es ese punto?', [
    { t: 'Un punto de silla: sube en una dirección y baja en otra', ok: true, por: 'Determinante negativo significa curvaturas de signos opuestos. No hace falta mirar nada más: no es ni máximo ni mínimo.' },
    { t: 'Un máximo, porque el determinante negativo indica curvatura hacia abajo', ok: false, por: 'La curvatura hacia abajo la da el signo de $f_{xx}$, y solo cuando el determinante es positivo. Con determinante negativo hay una dirección de cada tipo.' },
    { t: 'No se puede saber sin calcular la derivada tercera', ok: false, por: 'La derivada tercera hace falta cuando el determinante es cero y el criterio no decide. Con determinante negativo, decide.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de cálculo en varias variables',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Derivar y optimizar', temas: ['av-vectorial', 'av-optimizacion'], n: 3, min: 15 },
      { titulo: 'Restricciones e integrales múltiples', temas: ['av-lagrange', 'av-integrales-multiples'], n: 3, min: 15 }
    ]
  });

  p.hist('El método de los multiplicadores lo publicó Lagrange en 1788 dentro de la <em>Mécanique analytique</em>, un libro del que presumía de que no contenía ni un solo dibujo: toda la mecánica reducida a cálculo. La idea de convertir una restricción en un término más de la función es de las pocas de las matemáticas que se usa igual en física, en economía y en el entrenamiento de una red neuronal.');
});
