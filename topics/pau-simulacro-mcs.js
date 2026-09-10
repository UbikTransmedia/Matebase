/* Tema: Simulacro de MACS II */
Course.topic('pau-simulacro-mcs', function (p) {

  p.text('Un simulacro es un examen de verdad hecho en casa: con reloj, sin apuntes y sin pistas. Aquí ' +
    'las preguntas salen de los ejercicios de los temas de Matemáticas Aplicadas a las Ciencias Sociales II, ' +
    'repartidas por bloques como en la prueba de acceso, y cada vez que empiezas uno los números son ' +
    'distintos. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y se calcula ' +
    'la nota por bloques, con enlaces a lo que conviene repasar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué suele preguntarse');

  p.table(['Bloque', 'Lo más habitual', 'Temas'], [
    ['Álgebra y programación lineal', 'Plantear y resolver un sistema a partir de un enunciado; ecuaciones y operaciones con matrices; un problema de programación lineal con su región factible y sus vértices.',
      '[[al-matrices]] · [[al-determinantes]] · [[al-inversa]] · [[al-gauss]] · [[al-discusion]] · [[fn-prog-lineal]]'],
    ['Análisis', 'Continuidad de funciones a trozos con parámetros; estudio de una función de costes, ingresos o beneficios; optimización; áreas sencillas.',
      '[[fn-limites]] · [[fn-derivadas]] · [[fn-derivabilidad]] · [[fn-aplicaciones]] · [[fn-representacion]] · [[fn-integral-indef]] · [[fn-integral-def]]'],
    ['Probabilidad', 'Tablas de contingencia, árboles, probabilidad total y teorema de Bayes; distribuciones binomial y normal.',
      '[[pe-condicionada]] · [[pe-binomial]] · [[pe-continuas]] · [[pe-normal]]'],
    ['Inferencia', 'Intervalo de confianza para una media o una proporción; tamaño de muestra necesario para un error dado y, según la comunidad, un contraste de hipótesis.',
      '[[pe-inferencia]] · [[pe-proporcion]] · [[pe-contraste]]']
  ]);

  p.note('El reparto de preguntas y minutos de este simulacro es orientativo: cada comunidad autónoma ' +
    'decide cuántas preguntas pone de cada bloque y cuántas se pueden elegir. Si tu examen es distinto, ' +
    'desmarca los bloques que no te interesen y ajusta el ritmo con el reloj.', 'warn', 'Tu modelo de examen');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Ten papel al lado y escribe el desarrollo completo</strong>, como en el examen. Aquí solo se comprueba el resultado; en la prueba real, el planteamiento y los pasos son la mayor parte de la nota.',
    '<strong>En los problemas con enunciado, escribe primero qué es cada incógnita</strong> («$x$: número de mesas fabricadas»). La mitad de los errores de programación lineal y de sistemas vienen de plantear mal, no de calcular mal.',
    '<strong>Vigila el reloj por bloques.</strong> Si un apartado se atasca más de lo que le corresponde, déjalo y vuelve al final.',
    '<strong>Interpreta los resultados en el contexto</strong>: un número de trabajadores no puede ser 3,4; un beneficio máximo tiene unidades; un intervalo de confianza se explica con una frase.',
    '<strong>Lo importante no es la nota, sino la tabla final.</strong> Cada enlace de «Para repasar» lleva al ejercicio exacto que falló, y lo que falles volverá a salirte en la portada unos días después.'
  ], true);

  p.note('El enlace de un simulacro corregido reproduce las mismas preguntas con los mismos números. Un ' +
    'profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y ' +
    'podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El simulacro');

  p.simulacro({
    titulo: 'Simulacro de MACS II',
    itin: 'MCS',
    partes: [
      { titulo: 'Álgebra y programación lineal', temas: ['al-matrices', 'al-determinantes', 'al-inversa', 'al-gauss', 'al-discusion', 'fn-prog-lineal'], n: 2, min: 25 },
      { titulo: 'Análisis', temas: ['fn-limites', 'fn-derivadas', 'fn-derivabilidad', 'fn-aplicaciones', 'fn-representacion', 'fn-integral-indef', 'fn-integral-def'], n: 2, min: 25 },
      { titulo: 'Probabilidad', temas: ['pe-condicionada', 'pe-binomial', 'pe-continuas', 'pe-normal'], n: 2, min: 20 },
      { titulo: 'Inferencia estadística', temas: ['pe-inferencia', 'pe-proporcion', 'pe-contraste'], n: 2, min: 20 }
    ]
  });

  p.util('Todo lo que entra en este examen se usa a diario fuera de él. Las empresas de logística ' +
    'resuelven problemas de programación lineal con miles de variables para repartir mercancía; las ' +
    'encuestas electorales publican un intervalo de confianza aunque lo llamen «margen de error»; y las ' +
    'pruebas A/B con las que las webs deciden qué botón funciona mejor son contrastes de hipótesis sobre ' +
    'dos proporciones.');
});
