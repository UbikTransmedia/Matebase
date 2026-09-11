/* Tema: Formulario de 2.º */
Course.topic('pau-formulario', function (p) {

  p.puente('Cada tema termina con sus ideas clave y sus fórmulas. Esta página las recoge todas, en el ' +
    'orden del mapa, para tenerlas juntas cuando toca repasar. No añade nada: reúne.');

  p.text('Aquí están, juntas y en orden, todas las fórmulas y las ideas clave de los temas de tu ' +
    'asignatura. No están copiadas a mano: salen de los propios temas cada vez que abres esta página, ' +
    'así que si un tema cambia, el formulario cambia con él.');

  p.note('Un formulario no es para aprender: es para <strong>comprobar</strong>. Si al leer una fórmula no ' +
    'recuerdas de dónde sale ni cuándo se usa, el nombre del tema es un enlace; vuelve a él y resuelve un ' +
    'par de ejercicios. Y conviene hacer el tuyo propio a mano: escribir una fórmula obliga a decidir qué ' +
    'es lo importante de ella, y eso ya es estudiar.', 'ok', 'Cómo usarlo');

  p.text('Con el botón de imprimir sale una versión limpia, sin menús ni ejemplos interactivos, que se ' +
    'puede guardar en PDF. Elige antes la asignatura: Matemáticas II y MACS II no tienen el mismo temario.');

  p.comprueba('Ves en el formulario $|kA| = k^n|A|$ y no recuerdas por qué. ¿Qué haces?', [
    { t: 'Memorizarla tal cual', ok: false, por: 'Una fórmula sin su porqué se recuerda mal y se aplica peor: en el examen aparecerá con $n = 3$ y $k = -2$ y habrá que saber qué hacer con cada cosa.' },
    { t: 'Seguir el enlace al tema y hacer un par de ejercicios', ok: true, por: 'Para eso está el enlace. Al multiplicar una matriz por $k$ se multiplican todas sus filas, y cada fila aporta un factor: con eso la fórmula se reconstruye sola.' },
    { t: 'Saltarla, porque seguramente no cae', ok: false, por: 'Cae. Es uno de los errores más frecuentes del examen, y está en el catálogo de errores de este bloque.' }
  ]);

  p.formulario();

  p.hist('Los formularios tienen mala fama en clase, pero los matemáticos siempre los han usado. Las ' +
    'tablas de integrales de Gradshteyn y Ryzhik, publicadas en ruso en 1943 y reeditadas hasta hoy, ' +
    'tienen más de mil páginas, y el <em>Handbook of Mathematical Functions</em> de Abramowitz y Stegun ' +
    '(1964) fue durante décadas uno de los libros más citados de la ciencia. Su sucesor es hoy una web ' +
    'pública del NIST, la <em>Digital Library of Mathematical Functions</em>. Nadie se sabe todas las ' +
    'fórmulas: se sabe cuál buscar y cómo comprobar que es la buena.');
});
