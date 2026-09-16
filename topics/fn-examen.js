/* Tema: Examen del bloque: funciones y análisis */
Course.topic('fn-examen', function (p) {

  p.puente('Veintiún temas, el bloque más largo del curso y el que más pesa en la PAU: del concepto de función al teorema que une la derivada con la integral. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, para saber qué parte del análisis está de verdad hecha.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 21 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Funciones elementales', 'Dominio, recorrido y simetría; recta que pasa por dos puntos; vértice y raíces de una parábola; dominio de una racional o de una raíz; resolver un problema de programación lineal; ecuaciones con exponenciales y logaritmos.',
      '[[fn-concepto]] · [[fn-lineales]] · [[fn-prog-lineal]] · [[fn-cuadraticas]] · [[fn-racionales]] · [[fn-exp-log]]'],
    ['Sucesiones, series y finanzas', 'Término general y suma de una progresión; decidir si una serie converge; calcular una cuota, un capital final o un tanto efectivo.',
      '[[fn-sucesiones]] · [[fn-series]] · [[fn-finanzas]]'],
    ['Límites y continuidad', 'Resolver indeterminaciones; asíntotas verticales, horizontales y oblicuas; estudiar la continuidad de una función a trozos y ajustar el parámetro que la hace continua; aplicar Bolzano para localizar una raíz.',
      '[[fn-limites]] · [[fn-continuidad]]'],
    ['Derivadas y sus aplicaciones', 'Derivar con la regla de la cadena, del producto y del cociente; derivabilidad de una función a trozos; L\'Hôpital; monotonía, extremos, curvatura y puntos de inflexión; optimizar con una restricción; el polinomio de Taylor.',
      '[[fn-derivadas]] · [[fn-derivabilidad]] · [[fn-lhopital]] · [[fn-aplicaciones]] · [[fn-representacion]] · [[fn-taylor]]'],
    ['Integrales', 'Integrar por partes y por cambio de variable; descomponer en fracciones simples; área entre dos curvas, partiendo el intervalo por los cortes; derivar una función definida por una integral.',
      '[[fn-integral-indef]] · [[fn-integral-racional]] · [[fn-integral-def]] · [[fn-funcion-integral]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 21 temas y 12 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>El dominio, lo primero y siempre.</strong> Media docena de preguntas de este bloque se corrigen mal por trabajar fuera del dominio: una asíntota que no existe, un logaritmo de un negativo, una raíz que no está definida donde se evalúa.',
    '<strong>Antes de aplicar L\'Hôpital, comprueba la indeterminación.</strong> Solo vale para $0/0$ y $\\infty/\\infty$. Aplicarla a un límite que ya está determinado da un resultado distinto del verdadero y no hay forma de recuperarlo.',
    '<strong>En optimización, escribe la restricción y redúcelo a una variable.</strong> El error habitual no es derivar mal: es derivar la función equivocada porque no se ha usado la condición del enunciado.',
    '<strong>Para el área, corta el intervalo en los puntos de cruce.</strong> La integral sin cortar resta los trozos de debajo del eje y da un número menor que el área. Si el resultado sale negativo, es que faltó cortar.'
  ], true);

  p.comprueba('Calculas $\\int_{-1}^{1} x^3\\,dx$ para hallar el área entre la curva y el eje y te sale $0$. ¿Qué significa?', [
    { t: 'Que hay que partir en $x = 0$ y sumar los dos trozos en valor absoluto', ok: true, por: 'La integral definida suma con signo: lo de debajo del eje resta. El área es $\\int_{-1}^{0}|x^3| + \\int_{0}^{1}x^3 = 1/2$. El cero es la señal de que faltó cortar.' },
    { t: 'Que el área es cero porque la función es impar', ok: false, por: 'Lo que vale cero es la integral, no el área. Un área nunca es negativa ni nula si la curva se separa del eje; lo que se anulan son los dos trozos entre sí.' },
    { t: 'Que hay un error de cálculo en la primitiva', ok: false, por: 'La primitiva está bien: $x^4/4$ vale lo mismo en $-1$ y en $1$. El problema no es la cuenta, es haber confundido integral con área.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de funciones y análisis',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Funciones elementales', temas: ['fn-concepto', 'fn-lineales', 'fn-prog-lineal', 'fn-cuadraticas', 'fn-racionales', 'fn-exp-log'], n: 2, min: 10 },
      { titulo: 'Sucesiones, series y finanzas', temas: ['fn-sucesiones', 'fn-series', 'fn-finanzas'], n: 2, min: 10 },
      { titulo: 'Límites y continuidad', temas: ['fn-limites', 'fn-continuidad'], n: 3, min: 15 },
      { titulo: 'Derivadas y sus aplicaciones', temas: ['fn-derivadas', 'fn-derivabilidad', 'fn-lhopital', 'fn-aplicaciones', 'fn-representacion', 'fn-taylor'], n: 3, min: 15 },
      { titulo: 'Integrales', temas: ['fn-integral-indef', 'fn-integral-racional', 'fn-integral-def', 'fn-funcion-integral'], n: 2, min: 10 }
    ]
  });

  p.hist('El <em>Mathematical Tripos</em> de Cambridge fue durante el siglo XIX el examen más duro del mundo: ocho días de problemas de análisis, y una clasificación pública en la que el primero recibía el título de <em>senior wrangler</em>. Preparaba tan bien para resolver y tan mal para investigar que acabó reformándose, pero dejó una lección que este examen recoge: la técnica de derivar e integrar se automatiza haciéndola, y solo cuando está automatizada queda cabeza para lo demás.');
});
