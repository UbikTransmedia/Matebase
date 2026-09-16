/* Tema: Examen del bloque: geometría avanzada */
Course.topic('geo-examen', function (p) {

  p.puente('Tres temas que ponen en duda las reglas con las que se midió todo el bloque de [[ge-angulos|geometría]]: qué pasa si las paralelas se cortan, cómo se mide lo que se dobla y qué queda de una figura cuando se deja de medir. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 3 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Otra idea de recta', 'Suma de los ángulos de un triángulo en la esfera y en el plano hiperbólico; exceso angular y área; curvatura de una curva y de una superficie; geodésicas y el teorema egregio.',
      '[[av-noeuclidea]] · [[av-geodif]]'],
    ['Lo que sobrevive al estirar', 'Decidir si dos figuras son homeomorfas; contar agujeros; calcular la característica de Euler de un poliedro o de una triangulación y usarla para distinguir superficies.',
      '[[av-topologia]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 3 temas y 5 preguntas, un examen recorre casi el bloque entero: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Pregúntate siempre en qué superficie estás.</strong> Casi todas las respuestas cambian de signo entre la esfera, el plano y el plano hiperbólico; escribir la curvatura al principio evita contestar con la geometría equivocada.',
    '<strong>El exceso angular es área.</strong> En la esfera, lo que le sobra a un triángulo sobre $180°$ es proporcional a su área. Esa única frase resuelve varias preguntas del primer tramo.',
    '<strong>En topología no se mide: se cuenta.</strong> Agujeros, componentes, caras. Si una pregunta parece pedir una longitud, es que hay que buscar el invariante que no depende de ella.',
    '<strong>Comprueba Euler con un caso conocido.</strong> Un cubo da $8 - 12 + 6 = 2$. Si tu recuento de una figura nueva no da lo que debería para su género, el error está en el recuento.'
  ], true);

  p.comprueba('Un triángulo dibujado sobre una esfera tiene tres ángulos rectos. ¿Es posible?', [
    { t: 'Sí: en la esfera los ángulos suman más de $180°$, y este suma $270°$', ok: true, por: 'Es el octante: dos meridianos separados $90°$ y un trozo de ecuador. El exceso de $90°$ mide justo un octavo de la esfera.' },
    { t: 'No: los ángulos de un triángulo suman siempre $180°$', ok: false, por: 'Eso vale en el plano, y solo porque se admite el quinto postulado. En una superficie curva deja de ser cierto, y ese es el asunto del bloque.' },
    { t: 'Sí, pero solo si el triángulo es muy pequeño', ok: false, por: 'Al revés: cuanto más pequeño es un triángulo esférico, más se parece a uno plano y menos le sobra. El de tres ángulos rectos es enorme, un octavo de la esfera.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de geometría avanzada',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Otra idea de recta', temas: ['av-noeuclidea', 'av-geodif'], n: 3, min: 15 },
      { titulo: 'Lo que sobrevive al estirar', temas: ['av-topologia'], n: 2, min: 10 }
    ]
  });

  p.hist('Durante dos mil años, intentar demostrar el quinto postulado de Euclides fue un ejercicio de examen que nadie aprobaba. Saccheri publicó en 1733 un libro entero de consecuencias absurdas de negarlo, convencido de estar reduciéndolo al absurdo; en realidad estaba escribiendo los primeros teoremas de la geometría hiperbólica sin darse cuenta. Lo que aquí se pregunta como ejercicio fue, durante siglos, el problema abierto más famoso de las matemáticas.');
});
