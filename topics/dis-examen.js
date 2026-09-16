/* Tema: Examen del bloque: matemática discreta y computacional */
Course.topic('dis-examen', function (p) {

  p.puente('Seis temas sobre lo que se cuenta y sobre lo que un ordenador calcula: redes, recurrencias, algoritmos, información y decisiones. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 6 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Grafos, recurrencias y coste', 'Grados y caminos en un grafo; árbol de recubrimiento mínimo y camino más corto; resolver una recurrencia lineal; ordenar algoritmos por su complejidad y decidir si un problema está en P o en NP.',
      '[[av-grafos]] · [[av-recurrencias]] · [[av-complejidad]]'],
    ['Calcular, medir y decidir', 'Error de un método numérico y cuántas iteraciones hacen falta; entropía de una fuente y longitud media de un código; matriz de pagos, estrategia dominante y equilibrio de Nash.',
      '[[av-numerico]] · [[av-informacion]] · [[av-juegos]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 6 temas y 6 preguntas, un examen recorre casi el bloque entero: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Dibuja el grafo aunque te lo den en una tabla.</strong> Los grados, los ciclos y la conexión se ven en el dibujo y se cuentan mal en la lista de aristas.',
    '<strong>La complejidad se pregunta en el peor caso.</strong> Un algoritmo que casi siempre es rápido puede ser cuadrático, y lo que se corrige es la cota, no la impresión.',
    '<strong>La entropía se mide en bits y es una media.</strong> Sale de sumar $p\\log_2(1/p)$, y compararla con la longitud media del código es lo que dice si el código es bueno.',
    '<strong>Antes de buscar el equilibrio, tacha las estrategias dominadas.</strong> Una matriz de tres por tres suele quedarse en dos por dos y el equilibrio aparece a la vista.'
  ], true);

  p.comprueba('Un problema está en NP. ¿Qué significa exactamente?', [
    { t: 'Que una solución propuesta se puede comprobar en tiempo polinómico', ok: true, por: 'NP es la clase de los problemas cuya respuesta, si te la dan, se verifica rápido. Encontrarla puede ser lentísimo, y si es rápido o no es justamente la pregunta abierta.' },
    { t: 'Que no se puede resolver en tiempo polinómico', ok: false, por: 'Eso no se sabe de ningún problema de NP: es el problema P frente a NP. Además, todo problema de P está también en NP.' },
    { t: 'Que es uno de los problemas más difíciles que existen', ok: false, por: 'Los más difíciles de NP son los NP-completos, que son una parte. Sumar dos números también está en NP y no es difícil.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de matemática discreta y computacional',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Grafos, recurrencias y coste', temas: ['av-grafos', 'av-recurrencias', 'av-complejidad'], n: 3, min: 15 },
      { titulo: 'Calcular, medir y decidir', temas: ['av-numerico', 'av-informacion', 'av-juegos'], n: 3, min: 15 }
    ]
  });

  p.hist('El problema de los siete puentes de Königsberg era, en 1736, un pasatiempo de sobremesa: ¿se pueden cruzar todos una sola vez? Euler contestó que no, y para contestarlo tiró el mapa y se quedó solo con qué estaba unido a qué. Aquel gesto —quedarse con la estructura y tirar la geometría— fundó la teoría de grafos, y es exactamente lo que piden las preguntas del primer tramo.');
});
