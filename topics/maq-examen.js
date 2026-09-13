/* Tema: Examen del bloque: máquinas y lenguajes */
Course.topic('maq-examen', function (p) {

  p.puente('Dieciocho temas, dos tramos que se cierran uno sobre otro: el compilador de [[len-compilar]] genera el ensamblador de la CPU de [[maq-cpu]]. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, para saber si de verdad se ha interiorizado lo que hay entre el bit y el lenguaje.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 18 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Bits, puertas y circuitos', 'Pasar de binario a hexadecimal y a complemento a dos; escribir la tabla de verdad de una puerta o de un circuito; el acarreo de un sumador; simplificar una forma normal.',
      '[[maq-bits]] · [[maq-puertas]] · [[maq-sumador]] · [[maq-decidir]] · [[maq-normal]]'],
    ['Memoria, CPU y ensamblador', 'Qué guarda un biestable y por qué es un bucle; el ciclo buscar-decodificar-ejecutar; seguir un programa en ensamblador paso a paso, con saltos y pila.',
      '[[maq-memoria]] · [[maq-cpu]] · [[maq-ensamblador]]'],
    ['Del texto al árbol', 'Trocear una línea en tokens; decidir si una gramática genera una frase; dibujar el árbol de una expresión respetando la precedencia; evaluar en notación polaca inversa.',
      '[[len-tokens]] · [[len-gramatica]] · [[len-arbol]] · [[len-pila]]'],
    ['Ejecutar, compilar y optimizar', 'Resolver un nombre en su ámbito; contar los marcos que crea una recursión; traducir una expresión a ensamblador; plegar constantes y quitar código muerto; el programa que se imprime a sí mismo.',
      '[[len-variables]] · [[len-funciones]] · [[len-compilar]] · [[len-optimizar]] · [[len-autorreferencia]] · [[len-taller]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 18 temas y 10 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Convierte con método, no de memoria.</strong> Para pasar de base, divide y apunta los restos; para el complemento a dos, invierte y suma uno. Las prisas en binario cuestan más puntos que en cualquier otra parte del curso.',
    '<strong>Sigue los programas con una tabla.</strong> Una columna por registro y otra para el contador de programa, una fila por instrucción ejecutada. Es lo que hace la máquina, y lo que evita perderse en un salto.',
    '<strong>Dibuja el árbol antes de evaluar.</strong> Con la precedencia bien puesta, la notación polaca y el ensamblador salen solos; sin árbol, salen «casi» bien, que es mal.',
    '<strong>Lo que falles, ábrelo en el banco o en la máquina.</strong> Cada pregunta enlaza con su tema, y allí el circuito, la CPU o el lenguaje se pueden ejecutar de verdad: es la corrección que más enseña.'
  ], true);

  p.comprueba('En una pregunta de ensamblador el programa salta hacia atrás y no ves cuándo termina. ¿Qué haces?', [
    { t: 'Seguir la tabla de registros hasta que la condición del salto deje de cumplirse', ok: true, por: 'Un bucle termina cuando su condición cambia, y eso se ve en la tabla: el registro que se compara va cambiando en cada vuelta. Tres o cuatro vueltas bastan para ver el patrón.' },
    { t: 'Suponer que es un bucle infinito y pasar a otra pregunta', ok: false, por: 'Casi ningún ejercicio pide un bucle infinito. Antes de rendirse, mira qué registro decide el salto y cómo cambia en cada vuelta.' },
    { t: 'Ejecutarlo mentalmente sin apuntar nada', ok: false, por: 'A la tercera vuelta ya no se recuerda qué valía cada registro. La tabla no es opcional: es la máquina en papel.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de máquinas y lenguajes',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Bits, puertas y circuitos', temas: ['maq-bits', 'maq-puertas', 'maq-sumador', 'maq-decidir', 'maq-normal'], n: 3, min: 15 },
      { titulo: 'Memoria, CPU y ensamblador', temas: ['maq-memoria', 'maq-cpu', 'maq-ensamblador'], n: 2, min: 10 },
      { titulo: 'Del texto al árbol', temas: ['len-tokens', 'len-gramatica', 'len-arbol', 'len-pila'], n: 2, min: 10 },
      { titulo: 'Ejecutar, compilar y optimizar', temas: ['len-variables', 'len-funciones', 'len-compilar', 'len-optimizar', 'len-autorreferencia', 'len-taller'], n: 3, min: 15 }
    ]
  });

  p.hist('Los primeros exámenes de «programación» de la historia se hacían sin ordenador: en la Universidad de Cambridge, a finales de los años cuarenta, los alumnos del EDSAC entregaban el programa en papel y otro estudiante hacía de máquina, siguiendo las instrucciones una a una con lápiz. Seguir un programa con una tabla de registros, como en este examen, es exactamente aquel ejercicio, y sigue siendo la manera más segura de entender qué hace una máquina.');
});
