/* Tema: Examen del bloque: álgebra */
Course.topic('al-examen', function (p) {

  p.puente('Quince temas que van de poner una letra en lugar de un número a discutir un sistema con parámetro, que es lo último que se pregunta en la PAU. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, para saber si el álgebra se hace ya sin pensar en cada paso.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 15 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Expresiones y polinomios', 'Operar con monomios y sacar factor común; dividir por Ruffini y usar el teorema del resto; factorizar con identidades notables; simplificar una fracción algebraica y decir qué valores prohíbe el denominador.',
      '[[al-lenguaje]] · [[al-polinomios]] · [[al-identidades]] · [[al-fracciones-alg]]'],
    ['Ecuaciones e inecuaciones', 'Resolver de primer y de segundo grado y leer el discriminante; sistemas por sustitución o igualación; inecuaciones con la recta de signos; ecuaciones exponenciales y logarítmicas comprobando el dominio.',
      '[[al-ec1]] · [[al-ec2]] · [[al-sistemas]] · [[al-inecuaciones]] · [[al-radicales-log]]'],
    ['Matrices y determinantes', 'Multiplicar matrices y cuidar el orden; calcular un determinante de orden 3; sacar el rango por menores; invertir una matriz y despejar en una ecuación matricial; complejos en forma binómica y polar.',
      '[[al-complejos]] · [[al-matrices]] · [[al-determinantes]] · [[al-inversa]]'],
    ['Sistemas: Gauss y discusión', 'Triangular por Gauss y leer la solución; clasificar por Rouché-Frobenius; discutir según un parámetro diciendo para qué valores el sistema es compatible determinado, indeterminado o incompatible.',
      '[[al-gauss]] · [[al-discusion]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 15 temas y 10 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Factoriza siempre que puedas.</strong> Una ecuación factorizada se resuelve mirándola, y una fracción algebraica factorizada se simplifica sola. Casi todo el álgebra de este bloque es buscar la forma en la que el problema ya está resuelto.',
    '<strong>Apunta el dominio antes de despejar.</strong> Denominadores que no pueden ser cero, radicandos que no pueden ser negativos, logaritmos de positivos. Las soluciones que sobran no se descubren al final: se evitan al principio.',
    '<strong>En matrices, el orden importa.</strong> $AB$ y $BA$ no son lo mismo y casi ningún ejercicio lo deja pasar. Antes de multiplicar, comprueba que las dimensiones encajan, y al despejar, multiplica por la inversa por el mismo lado en los dos miembros.',
    '<strong>Discutir es clasificar, no resolver.</strong> Primero los valores del parámetro que anulan el determinante, y solo después se resuelve cada caso. Quien empieza resolviendo acaba resolviendo tres veces.'
  ], true);

  p.comprueba('Al resolver una ecuación con raíces obtienes dos soluciones y solo una cumple la ecuación original. ¿Qué ha pasado?', [
    { t: 'Elevar al cuadrado ha añadido una solución que no era', ok: true, por: 'Elevar al cuadrado no es reversible: de $a = b$ se pasa a $a^2 = b^2$, que también la cumple $a = -b$. Por eso toda ecuación con raíces termina comprobando las soluciones en la original.' },
    { t: 'Hay un error de cuenta en algún paso', ok: false, por: 'Puede haberlo, pero la solución de más aparece incluso con las cuentas perfectas: la mete el propio método. Comprobar en la ecuación original no es opcional.' },
    { t: 'La ecuación tiene dos soluciones y una se sale del dominio de los reales', ok: false, por: 'No es cuestión de reales: las dos son números reales perfectamente normales. Lo que falla es que una no cumple la ecuación de partida, solo la elevada al cuadrado.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de álgebra',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Expresiones y polinomios', temas: ['al-lenguaje', 'al-polinomios', 'al-identidades', 'al-fracciones-alg'], n: 2, min: 10 },
      { titulo: 'Ecuaciones e inecuaciones', temas: ['al-ec1', 'al-ec2', 'al-sistemas', 'al-inecuaciones', 'al-radicales-log'], n: 3, min: 15 },
      { titulo: 'Matrices y determinantes', temas: ['al-complejos', 'al-matrices', 'al-determinantes', 'al-inversa'], n: 3, min: 15 },
      { titulo: 'Sistemas: Gauss y discusión', temas: ['al-gauss', 'al-discusion'], n: 2, min: 10 }
    ]
  });

  p.hist('La palabra «álgebra» viene del título del libro que al-Juarismi escribió en Bagdad hacia el año 820: <em>al-yabr</em>, «la reducción», el paso de llevar los términos negativos al otro lado. Aquel libro no tenía símbolos: los problemas y las soluciones iban escritos con palabras, y cada tipo de ecuación era un caso aparte con su receta. Poner una letra donde antes había una frase entera es lo que convirtió catorce recetas en un solo método, y es lo que se pregunta aquí.');
});
