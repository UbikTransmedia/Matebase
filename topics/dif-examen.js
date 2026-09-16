/* Tema: Examen del bloque: ecuaciones diferenciales y ondas */
Course.topic('dif-examen', function (p) {

  p.puente('Ocho temas cuya incógnita no es un número sino una función. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque, con reloj y sin pistas, para saber si se distingue ya qué método pide cada ecuación y qué dice la solución sobre lo que la ecuación describe.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 8 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Resolver ecuaciones diferenciales', 'Separar variables y resolver una lineal de primer orden; imponer la condición inicial; dar un paso de Euler o de Runge-Kutta y decir cómo crece el error con el paso.',
      '[[av-edo]] · [[av-edo-numerico]]'],
    ['Oscilar, estabilizar y desbocarse', 'Clasificar un oscilador por su amortiguamiento; frecuencia propia y resonancia; puntos de equilibrio de un sistema y su estabilidad; el diagrama de bifurcación y cuándo aparece el caos.',
      '[[av-oscilador]] · [[av-sistemas-dinamicos]] · [[av-caos]]'],
    ['Ondas, Fourier y convolución', 'Reconocer la ecuación del calor o la de ondas y qué hace cada una; coeficientes de una serie de Fourier; qué frecuencias tiene una señal; convolucionar dos señales cortas a mano.',
      '[[av-edp]] · [[av-fourier]] · [[av-convolucion]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 8 temas y 8 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Clasifica antes de resolver.</strong> Separable, lineal, exacta: cada una tiene su método y probar el equivocado cuesta diez minutos. Mirar la forma de la ecuación es el primer paso, no el segundo.',
    '<strong>La condición inicial va al final, pero no se olvida.</strong> Una solución general con la constante sin determinar responde a la mitad de la pregunta, y es el descuido más común del bloque.',
    '<strong>Los equilibrios se encuentran igualando a cero y se clasifican derivando.</strong> Sin resolver la ecuación se puede decir a dónde va el sistema, y muchas preguntas piden exactamente eso.',
    '<strong>En Fourier, mira primero la simetría.</strong> Una función impar no tiene cosenos y una par no tiene senos: la mitad de los coeficientes se anulan sin integrar nada.'
  ], true);

  p.comprueba('Un oscilador tiene amortiguamiento crítico. ¿Qué hace al soltarlo fuera del equilibrio?', [
    { t: 'Vuelve al equilibrio lo más rápido posible sin pasarse', ok: true, por: 'Es la frontera entre oscilar y arrastrarse: cualquier amortiguamiento menor produce rebote y cualquiera mayor tarda más. Por eso se diseñan así los cierrapuertas.' },
    { t: 'Oscila con amplitud decreciente hasta pararse', ok: false, por: 'Eso es el amortiguamiento débil, por debajo del crítico. En el crítico no llega a cruzar el equilibrio ni una vez.' },
    { t: 'Se queda quieto: el amortiguamiento crítico bloquea el movimiento', ok: false, por: 'Se mueve, y además es el caso que vuelve antes. Lo que no hace es pasarse de largo.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de ecuaciones diferenciales y ondas',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Resolver ecuaciones diferenciales', temas: ['av-edo', 'av-edo-numerico'], n: 3, min: 15 },
      { titulo: 'Oscilar, estabilizar y desbocarse', temas: ['av-oscilador', 'av-sistemas-dinamicos', 'av-caos'], n: 3, min: 15 },
      { titulo: 'Ondas, Fourier y convolución', temas: ['av-edp', 'av-fourier', 'av-convolucion'], n: 2, min: 10 }
    ]
  });

  p.hist('La ecuación del calor la escribió Fourier en 1807 y la academia de París se la rechazó: Lagrange no aceptaba que una función cualquiera pudiera escribirse como suma de senos. Fourier tenía razón y la objeción también tenía parte de razón, y de aclarar cuál fue exactamente salió buena parte del análisis del siglo XIX. Las preguntas de este tramo son las cuentas de aquella discusión.');
});
