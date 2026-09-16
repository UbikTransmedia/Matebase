/* Tema: Examen del bloque: estructuras, números e infinito */
Course.topic('est-examen', function (p) {

  p.puente('Seis temas sobre lo que tienen en común los objetos matemáticos y sobre qué significa contar lo que no se puede contar. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, y con la aritmética modular que sostiene todo el bloque de [[cr-rsa|criptografía]].');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 6 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Números y estructuras', 'Aritmética modular, inverso y teorema chino del resto; pequeño teorema de Fermat; comprobar los axiomas de grupo y encontrar el orden de un elemento; sumar puntos de una curva elíptica y usar Diffie-Hellman.',
      '[[av-numeros]] · [[av-grupos]] · [[av-cripto-curvas]]'],
    ['Lo continuo, lo infinito y lo indecidible', 'Supremo e ínfimo de un conjunto; decidir si una sucesión es de Cauchy; construir una biyección para probar que un conjunto es numerable; la diagonal de Cantor; decidir si un problema es computable.',
      '[[av-reales]] · [[av-infinito]] · [[av-computabilidad]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 6 temas y 6 preguntas, un examen recorre casi el bloque entero: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>En modular, reduce en cada paso.</strong> Multiplicar dos números enormes y tomar el resto al final funciona, pero se tarda diez veces más y se falla. Reducir después de cada operación deja siempre números pequeños.',
    '<strong>Para probar que algo es numerable, construye la lista.</strong> No basta con decir que «parece» que caben: hay que dar la biyección, aunque sea el zigzag o la diagonal. Eso es lo que se corrige.',
    '<strong>Un contraejemplo vale tanto como una demostración.</strong> En las preguntas sobre grupos o sobre completitud, encontrar un caso que falla cierra el asunto en una línea.',
    '<strong>«No computable» no significa «difícil».</strong> Significa que ningún algoritmo lo resuelve para todas las entradas. Redactarlo con cuidado es donde está la nota de las últimas preguntas.'
  ], true);

  p.comprueba('Te piden demostrar que el conjunto de los números racionales es numerable. ¿Qué basta con hacer?', [
    { t: 'Dar una forma de listarlos todos sin dejarse ninguno', ok: true, por: 'Numerable significa que existe una biyección con los naturales, y una lista que los alcanza a todos es esa biyección. El recorrido en diagonal, saltando las fracciones equivalentes, es la construcción habitual.' },
    { t: 'Comprobar que entre dos racionales siempre hay otro', ok: false, por: 'Eso es la densidad, y no tiene nada que ver con el cardinal: los reales también son densos y no son numerables.' },
    { t: 'Ver que hay menos racionales que reales', ok: false, por: 'Es cierto, pero no demuestra lo que se pide: hay conjuntos más pequeños que los reales que tampoco son numerables. Hace falta la lista.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de estructuras, números e infinito',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Números y estructuras', temas: ['av-numeros', 'av-grupos', 'av-cripto-curvas'], n: 3, min: 15 },
      { titulo: 'Lo continuo, lo infinito y lo indecidible', temas: ['av-reales', 'av-infinito', 'av-computabilidad'], n: 3, min: 15 }
    ]
  });

  p.hist('Cuando Cantor publicó que había infinitos de distinto tamaño, Kronecker —que había sido su maestro— le bloqueó publicaciones y plazas durante años, y Cantor pasó el resto de su vida entrando y saliendo de sanatorios. Hilbert zanjó la discusión en 1926 con una frase: «Nadie nos expulsará del paraíso que Cantor ha creado para nosotros». Los ejercicios del segundo tramo son las cuentas de aquel paraíso.');
});
