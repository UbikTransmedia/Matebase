/* Tema: Examen del bloque: aritmética y fundamentos */
Course.topic('ar-examen', function (p) {

  p.puente('Diez temas que son el suelo de todo lo demás: contar, operar y saber qué es un número. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, porque un hueco aquí se paga en [[al-lenguaje|álgebra]] y se sigue pagando hasta la última integral.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 10 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Contar y operar', 'Descomponer un número en su valor posicional; resolver una operación combinada respetando la jerarquía y los paréntesis; factorizar en primos y sacar el máximo común divisor y el mínimo común múltiplo.',
      '[[ar-naturales]] · [[ar-operaciones]] · [[ar-divisibilidad]]'],
    ['Fracciones, decimales y enteros', 'Sumar y simplificar fracciones; decidir si un decimal es exacto o periódico mirando el denominador; pasar de periódico a fracción; redondear a las cifras significativas que se piden; operar con signos y con potencias de exponente negativo.',
      '[[ar-fracciones]] · [[ar-decimales]] · [[ar-enteros]] · [[ar-potencias]]'],
    ['Proporción, magnitudes y conjuntos', 'Repartos directa e inversamente proporcionales; aumentos y descuentos encadenados, y el porcentaje que deshace otro; comprobar una fórmula por análisis dimensional; situar un número en la recta real y decir a qué conjunto pertenece.',
      '[[ar-proporcionalidad]] · [[ar-magnitudes]] · [[ar-conjuntos]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 10 temas y 8 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Simplifica antes de operar, no después.</strong> En fracciones y en potencias, cancelar primero deja números pequeños y quita casi todos los errores de cuenta. El resultado sin simplificar suele valer menos que el simplificado.',
    '<strong>Los porcentajes encadenados se multiplican, no se suman.</strong> Subir un 10 % y bajar un 10 % deja en el 99 %, no en el 100 %. Escribe cada cambio como un factor y multiplícalos: es más corto y no falla.',
    '<strong>Comprueba con las unidades.</strong> Si el resultado tiene que ser una velocidad y te sale un tiempo, hay un error y se ve sin repasar la cuenta. El análisis dimensional es la corrección más barata que existe.',
    '<strong>Redondea al final.</strong> Arrastrar decimales y redondear solo al escribir la respuesta evita el error acumulado, que en un problema de varios pasos cambia la última cifra y con ella la nota.'
  ], true);

  p.comprueba('Un problema pide el resultado «con dos decimales» y en un paso intermedio te sale $1/3$. ¿Qué escribes en ese paso?', [
    { t: '$1/3$, y redondeo solo al final', ok: true, por: 'Redondear en medio mete un error que los pasos siguientes multiplican. La fracción es exacta y no ocupa más: se arrastra hasta el final y allí se redondea una sola vez.' },
    { t: '$0{,}33$, que es lo que pide el enunciado', ok: false, por: 'Lo que pide el enunciado es el <em>resultado</em> con dos decimales, no cada paso. Con $0{,}33$ arrastrado, el final puede salir mal en la segunda cifra.' },
    { t: '$0{,}333333$, con muchos decimales para no perder precisión', ok: false, por: 'Mejor que redondear pronto, pero sigue siendo aproximado y además es más largo de escribir. La fracción exacta no tiene ninguna desventaja.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de aritmética y fundamentos',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Contar y operar', temas: ['ar-naturales', 'ar-operaciones', 'ar-divisibilidad'], n: 3, min: 15 },
      { titulo: 'Fracciones, decimales y enteros', temas: ['ar-fracciones', 'ar-decimales', 'ar-enteros', 'ar-potencias'], n: 3, min: 15 },
      { titulo: 'Proporción, magnitudes y conjuntos', temas: ['ar-proporcionalidad', 'ar-magnitudes', 'ar-conjuntos'], n: 2, min: 10 }
    ]
  });

  p.hist('Los exámenes de aritmética más antiguos que se conservan son tablillas de arcilla babilónicas de hace casi cuatro mil años: un enunciado, sitio para la cuenta y el resultado esperado al pie, para que el aprendiz de escriba pudiera comprobarse solo. La estructura es la de este examen, y el motivo también: la aritmética se aprende haciéndola muchas veces con números distintos.');
});
