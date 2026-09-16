/* Tema: Examen del bloque: cibernética */
Course.topic('cib-examen', function (p) {

  p.puente('Quince temas que juntan la derivada, la entropía, la probabilidad y los sistemas dinámicos para contestar a una sola pregunta: cómo se mantiene algo donde debe estar en un mundo que lo empuja. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 15 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['El bucle y la caja negra', 'Distinguir realimentación negativa de positiva y decir qué hace cada una; reducir un diagrama de bloques y sacar la ganancia del lazo; tabla de transición de estados; contar la variedad de un sistema y aplicar la ley de la variedad requerida.',
      '[[cib-realimentacion]] · [[cib-bloques]] · [[cib-caja-negra]] · [[cib-variedad]]'],
    ['Controlar y estabilizar', 'Efecto de cada término de un PID y el error en régimen permanente; qué es ultraestable y cuándo cambia de organización; cómo un retardo convierte un control estable en oscilante; stocks, flujos y el comportamiento que producen.',
      '[[cib-control]] · [[cib-homeostasis]] · [[cib-retardos]] · [[cib-dinamica]]'],
    ['Estimar y aprender', 'Separar señal de ruido con una media móvil o un filtro exponencial; una iteración del filtro de Kalman en una dimensión; qué separa un perceptrón y qué no; actualizar los pesos de MENACE tras una partida.',
      '[[cib-filtrado]] · [[cib-kalman]] · [[cib-neurona]] · [[cib-refuerzo]]'],
    ['Organizarse y observarse', 'Aplicar la regla de un autómata celular y predecir el patrón; identificar los cinco sistemas del modelo viable y qué falla si falta uno; decidir qué cambia cuando el observador entra en el sistema.',
      '[[cib-autoorganizacion]] · [[cib-viable]] · [[cib-segundo-orden]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 15 temas y 10 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Sigue el signo alrededor del bucle.</strong> Un lazo con un número par de inversiones es realimentación positiva y se desboca; con número impar, negativa y se corrige. Contar signos contesta muchas preguntas sin ninguna cuenta.',
    '<strong>El integral quita el error permanente; el derivativo, el rebote.</strong> Si una pregunta dice «se queda corto para siempre», falta integral; si dice «oscila al llegar», sobra proporcional o falta derivativo.',
    '<strong>Un retardo no cambia la ganancia, cambia la fase.</strong> Es lo que convierte un control que funcionaba en uno que oscila, y es la trampa favorita del bloque.',
    '<strong>La variedad se cuenta, no se estima.</strong> Número de estados del sistema frente a número de estados del regulador: si el regulador tiene menos, hay perturbaciones que no puede compensar, y decirlo así es la respuesta.'
  ], true);

  p.comprueba('Un termostato mantiene la temperatura dos grados por debajo de la consigna, siempre. ¿Qué le falta al control?', [
    { t: 'El término integral, que acumula el error y lo elimina', ok: true, por: 'Un error constante que no desaparece es la firma del control solo proporcional: necesita un error para actuar. El integral suma ese error en el tiempo hasta que la acción basta y el error llega a cero.' },
    { t: 'Más ganancia proporcional, para que empuje más fuerte', ok: false, por: 'Reduce el error pero no lo elimina, y pasado cierto punto hace que el sistema oscile. El error permanente es estructural del proporcional, no cuestión de fuerza.' },
    { t: 'El término derivativo, que anticipa hacia dónde va', ok: false, por: 'El derivativo amortigua el rebote y mejora el transitorio, pero con el error ya estabilizado su aportación es cero: no ve ningún cambio.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de cibernética',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'El bucle y la caja negra', temas: ['cib-realimentacion', 'cib-bloques', 'cib-caja-negra', 'cib-variedad'], n: 3, min: 15 },
      { titulo: 'Controlar y estabilizar', temas: ['cib-control', 'cib-homeostasis', 'cib-retardos', 'cib-dinamica'], n: 3, min: 15 },
      { titulo: 'Estimar y aprender', temas: ['cib-filtrado', 'cib-kalman', 'cib-neurona', 'cib-refuerzo'], n: 2, min: 10 },
      { titulo: 'Organizarse y observarse', temas: ['cib-autoorganizacion', 'cib-viable', 'cib-segundo-orden'], n: 2, min: 10 }
    ]
  });

  p.hist('Las conferencias Macy reunieron entre 1946 y 1953 a matemáticos, ingenieros, psicólogos y antropólogos para encontrar lo que tenían en común un termostato, una neurona y una sociedad. No había libro de texto ni examen: se discutía. De aquellas reuniones salieron la palabra «cibernética» y casi todos los temas de este bloque, y la pregunta que las ordenaba es la que ordena este examen: qué hace falta para que algo se mantenga.');
});
