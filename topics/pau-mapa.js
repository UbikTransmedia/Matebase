/* Tema: Mapa del temario de 2.º */
Course.topic('pau-mapa', function (p) {

  p.text('Este bloque no enseña nada nuevo: ordena lo que ya has visto. Llegar al examen de acceso a la ' +
    'universidad no depende tanto de haber estudiado mucho como de saber <strong>qué</strong> entra, ' +
    '<strong>cómo vas</strong> en cada parte y <strong>qué necesita</strong> cada tema para entenderse. ' +
    'Eso es lo que recoge el mapa de abajo.');

  p.text('En 2.º de Bachillerato hay dos asignaturas de matemáticas con examen propio. ' +
    '<strong>Matemáticas II</strong>, del Bachillerato de Ciencias y Tecnología, pone el peso en el álgebra ' +
    'de matrices, la geometría del espacio y el análisis completo, con integrales. <strong>Matemáticas ' +
    'Aplicadas a las Ciencias Sociales II</strong> comparte con ella las matrices, los sistemas, las ' +
    'derivadas y la probabilidad, pero cambia la geometría del espacio por la programación lineal y añade ' +
    'la inferencia estadística: estimar y contrastar a partir de una muestra.');

  p.note('Cada comunidad autónoma redacta su propio examen, y los modelos cambian de un año a otro: ' +
    'número de preguntas, optatividad, puntuación de cada apartado. El temario del mapa es el común del ' +
    'currículo estatal; antes de las últimas semanas, busca los exámenes de los años anteriores de tu ' +
    'universidad y compáralos con él.', 'warn', 'Tu examen concreto');

  /* ---------------------------------------------------------------- */
  p.section('Tu temario y tu estado');

  p.text('Elige la asignatura. Cada tema aparece con tu estado —«sin empezar», «visto» o «dominado»— y con ' +
    'los temas que da por sabidos. Si uno se te atasca, la última columna dice por dónde empezar a ' +
    'tirar del hilo: casi nunca falla el tema en sí, sino algo que da por supuesto.');

  p.mapa();

  /* ---------------------------------------------------------------- */
  p.section('Cómo repasar');

  p.list([
    '<strong>Primero el mapa, después los temas.</strong> Empieza por los temas que tienen más temas detrás: las matrices sostienen los determinantes, la inversa y la discusión de sistemas; las derivadas sostienen la representación, la optimización y las integrales.',
    '<strong>Repasar es resolver, no releer.</strong> Releer da la sensación de que todo está claro. Resolver un ejercicio sin mirar la teoría es lo único que dice si lo sabes. Usa los ejercicios de cada tema con «Otro» hasta que salgan a la primera.',
    '<strong>Espacia el repaso.</strong> La portada guarda lo que fallas y te lo vuelve a proponer al cabo de uno, tres y siete días, en «Para repasar hoy». Volver a un tema cuando ya se ha empezado a olvidar fija mucho más que machacarlo el mismo día.',
    '<strong>Haz simulacros con reloj.</strong> Un examen no solo mide lo que sabes: mide si lo sabes hacer en noventa minutos y sin pistas. Los simulacros de este bloque sacan preguntas de los temas y te dicen al final qué repasar.',
    '<strong>Estudia tus errores, no solo los aciertos.</strong> El tema de los errores que más puntos cuestan recoge los de siempre. Reconocerlos en un examen ajeno es el primer paso para no cometerlos en el tuyo.'
  ], true);

  p.util('Planificar un repaso es un problema de dependencias, igual que planificar una obra o compilar un ' +
    'programa: no se puede poner el tejado antes que las paredes. La columna «Lo que da por sabido» es un ' +
    '[[av-grafos|grafo dirigido]] de temas, y el orden sensato para estudiarlos es una ordenación ' +
    'topológica de ese grafo, la misma que usa un gestor de paquetes para instalar las dependencias antes ' +
    'que el programa que las necesita.');

  p.keys([
    'Matemáticas II y MACS II comparten matrices, sistemas, derivadas y probabilidad; la primera añade geometría del espacio e integrales, la segunda programación lineal e inferencia.',
    'Cuando un tema se atasca, suele fallar algo que da por sabido: mira sus requisitos.',
    'Repasar es resolver sin mirar, con el repaso espaciado y con simulacros cronometrados.'
  ]);
});
