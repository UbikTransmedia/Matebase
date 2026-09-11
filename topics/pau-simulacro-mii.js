/* Tema: Simulacro de Matematicas II */
Course.topic('pau-simulacro-mii', function (p) {

  p.puente('Los temas anteriores de este bloque dicen qué entra y qué se falla. El simulacro junta las ' +
    'dos cosas con un reloj delante: preguntas de los temas de tu asignatura, repartidas como en la ' +
    'prueba, y una corrección que dice qué repasar.');

  p.text('Un simulacro es un examen de verdad hecho en casa: con reloj, sin apuntes y sin pistas. Aquí ' +
    'las preguntas salen de los ejercicios de los temas de Matemáticas II, repartidas por bloques como en ' +
    'la prueba de acceso, y cada vez que empiezas uno los números son distintos. Al entregar se corrige ' +
    'todo, se abre la solución paso a paso de cada pregunta y se calcula la nota por bloques, con enlaces ' +
    'a lo que conviene repasar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué suele preguntarse');

  p.table(['Bloque', 'Lo más habitual', 'Temas'], [
    ['Álgebra', 'Discutir un sistema con un parámetro y resolverlo en algún caso; ecuaciones matriciales, inversa y potencias de una matriz; propiedades de los determinantes.',
      '[[al-matrices]] · [[al-determinantes]] · [[al-inversa]] · [[al-gauss]] · [[al-discusion]]'],
    ['Geometría', 'Posición relativa de rectas y planos; hallar una recta o un plano que cumpla unas condiciones; distancias, ángulos, proyecciones y puntos simétricos.',
      '[[ge-espacio-vectores]] · [[ge-espacio]] · [[ge-metrico]]'],
    ['Análisis', 'Continuidad y derivabilidad con parámetros; límites e indeterminaciones; teoremas de Bolzano y del valor medio; estudio de una función y optimización; áreas con integrales.',
      '[[fn-limites]] · [[fn-continuidad]] · [[fn-derivadas]] · [[fn-derivabilidad]] · [[fn-lhopital]] · [[fn-aplicaciones]] · [[fn-representacion]] · [[fn-integral-indef]] · [[fn-integral-racional]] · [[fn-integral-def]] · [[fn-funcion-integral]]'],
    ['Probabilidad', 'Probabilidad total y teorema de Bayes con un árbol o una tabla; distribución binomial; distribución normal y tipificación.',
      '[[pe-condicionada]] · [[pe-binomial]] · [[pe-continuas]] · [[pe-normal]]']
  ]);

  p.note('El reparto de preguntas y minutos de este simulacro es orientativo: cada comunidad autónoma ' +
    'decide cuántas preguntas pone de cada bloque y cuántas se pueden elegir. Si tu examen es distinto, ' +
    'desmarca los bloques que no te interesen y ajusta el ritmo con el reloj.', 'warn', 'Tu modelo de examen');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Ten papel al lado y escribe el desarrollo completo</strong>, como en el examen. Aquí solo se comprueba el resultado; en la prueba real, el planteamiento y los pasos son la mayor parte de la nota, y un error de cálculo con buen procedimiento resta poco.',
    '<strong>Lee todas las preguntas antes de empezar</strong> y empieza por las que mejor dominas: se aseguran puntos y se calman los nervios.',
    '<strong>Vigila el reloj por bloques.</strong> Si un apartado se atasca más de lo que le corresponde, déjalo y vuelve al final. Un apartado en blanco cuesta menos que dos preguntas sin tiempo.',
    '<strong>Comprueba antes de entregar</strong>: sustituye la solución del sistema, mira que un área sea positiva, que una probabilidad esté entre 0 y 1, que un punto esté de verdad en el plano.',
    '<strong>Lo importante no es la nota, sino la tabla final.</strong> Cada enlace de «Para repasar» lleva al ejercicio exacto que falló, y lo que falles volverá a salirte en la portada unos días después.'
  ], true);

  p.comprueba('Llevas quince minutos en un apartado al que corresponden diez y no sale. ¿Qué haces?', [
    { t: 'Seguir hasta que salga: ya casi está', ok: false, por: '«Ya casi está» es lo que se piensa siempre. Cada minuto de más aquí es un minuto menos para una pregunta que sí sabes.' },
    { t: 'Dejar escrito lo que hay, pasar al siguiente y volver al final', ok: true, por: 'El planteamiento escrito ya puntúa. Con la cabeza en otro problema, al volver suele verse el fallo; y si no, se han asegurado los puntos del resto.' },
    { t: 'Tacharlo todo y empezar otro bloque', ok: false, por: 'Tachar borra lo que valía. Un planteamiento correcto sin terminar vale más que una hoja en blanco.' }
  ]);

  p.trampas([
    { e: 'Discutir el sistema solo en los valores que anulan el determinante', por: 'El caso general, «$m$ distinto de esos valores», también hay que escribirlo: es compatible determinado, y sin decirlo la discusión está incompleta.' },
    { e: 'Citar Bolzano sin comprobar la continuidad', por: 'El teorema exige función continua en un intervalo cerrado y signos distintos en los extremos. Sin las hipótesis escritas, la justificación no vale.' },
    { e: 'Dar la distancia a un plano sin dividir por el módulo de la normal', por: 'Sustituir el punto en la ecuación solo da la distancia si la normal es unitaria. Casi nunca lo es.' },
    { e: 'Dar un área negativa', por: 'Señal segura de que faltó partir en los cortes con el eje. Un área es siempre positiva; si sale negativa, no se entrega: se revisa.' }
  ], 'Trampas del día del examen');

  p.note('El enlace de un simulacro corregido reproduce las mismas preguntas con los mismos números. Un ' +
    'profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y ' +
    'podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El simulacro');

  p.simulacro({
    titulo: 'Simulacro de Matemáticas II',
    itin: 'MII',
    partes: [
      { titulo: 'Álgebra', temas: ['al-matrices', 'al-determinantes', 'al-inversa', 'al-gauss', 'al-discusion'], n: 2, min: 20 },
      { titulo: 'Geometría', temas: ['ge-espacio-vectores', 'ge-espacio', 'ge-metrico'], n: 2, min: 20 },
      {
        titulo: 'Análisis',
        temas: ['fn-limites', 'fn-continuidad', 'fn-derivadas', 'fn-derivabilidad', 'fn-lhopital', 'fn-aplicaciones',
          'fn-representacion', 'fn-integral-indef', 'fn-integral-racional', 'fn-integral-def', 'fn-funcion-integral'],
        n: 3, min: 30
      },
      { titulo: 'Probabilidad', temas: ['pe-condicionada', 'pe-binomial', 'pe-continuas', 'pe-normal'], n: 2, min: 20 }
    ]
  });

  p.hist('Los exámenes de acceso a la universidad en España tienen casi un siglo y muchos nombres. La ' +
    'Selectividad, con ese nombre, se implantó en 1974; en 2010 pasó a llamarse PAU, después EBAU o EvAU ' +
    'según la comunidad, y desde 2025 vuelve a llamarse PAU, con exámenes que piden más razonar y ' +
    'aplicar y menos repetir procedimientos. Lo que no ha cambiado es lo que se evalúa en matemáticas: ' +
    'plantear bien, calcular con cuidado y explicar lo que se hace.');
});
