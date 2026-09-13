/* Tema: Examen del bloque: programación gráfica */
Course.topic('gfx-examen', function (p) {

  p.puente('Treinta y tres temas, del [[gfx-pixel|píxel que se pregunta de qué color es]] a la [[gfx-directo|actuación]]. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque —cálculos de coordenadas y distancias, matrices, ruido, cámaras, luz— con reloj y sin pistas, para saber si la geometría que hay detrás de cada shader se ha interiorizado.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 33 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['El plano del píxel', 'Normalizar coordenadas y corregir la proporción; la distancia a un círculo o a un segmento; un escalón suave; fract y mod para repetir; el tiempo y el ratón como variables.',
      '[[gfx-pixel]] · [[gfx-coordenadas]] · [[gfx-distancia]] · [[gfx-raton]] · [[gfx-decidir]] · [[gfx-tiempo]] · [[gfx-curvas]] · [[gfx-repetir]] · [[gfx-texto]]'],
    ['Transformar y colorear', 'Rotar y escalar con una matriz; mezclar colores; el valor de un ruido interpolado; torcer el espacio; las celdas de Voronoi; las simetrías de un caleidoscopio y los mosaicos; el disco de Poincaré.',
      '[[gfx-matrices]] · [[gfx-color]] · [[gfx-ruido]] · [[gfx-warp]] · [[gfx-voronoi]] · [[gfx-simetria]] · [[gfx-mosaicos]] · [[gfx-hiperbolico]]'],
    ['Derivadas, memoria y fluidos', 'Derivadas numéricas y el antialiasing; qué guarda un shader con memoria entre fotogramas; advección y difusión en un fluido; el túnel.',
      '[[gfx-derivadas]] · [[gfx-buffers]] · [[gfx-fluidos]] · [[gfx-tunel]]'],
    ['La tercera dimensión', 'Intersección de un rayo con una esfera o un plano; la base de una cámara con el producto vectorial; avanzar por una distancia; unir y restar formas; la ley de Lambert; el terreno como función de dos variables; texturas y volúmenes.',
      '[[gfx-trazado]] · [[gfx-camara]] · [[gfx-raymarching]] · [[gfx-escena]] · [[gfx-luz]] · [[gfx-terreno]] · [[gfx-materiales]] · [[gfx-nubes]]'],
    ['Fractales, postproceso y filtros', 'Iterar en el plano complejo; corrección de gamma y viñeta; convoluciones sobre una imagen; qué preparar para una actuación.',
      '[[gfx-fractales]] · [[gfx-post]] · [[gfx-filtros]] · [[gfx-directo]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 33 temas y 13 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Dibuja el plano.</strong> Casi toda pregunta de este bloque es geometría de 4.º o de 2.º disfrazada: un punto, un vector, una distancia. Un croquis con los ejes bien puestos resuelve la mitad del enunciado.',
    '<strong>Vigila el rango.</strong> Las coordenadas van de 0 a 1 o de −1 a 1, los colores de 0 a 1, los ángulos en radianes. Un resultado fuera de rango no es «raro»: es un aviso.',
    '<strong>Las matrices, columna a columna.</strong> Una rotación se comprueba viendo adónde van $(1, 0)$ y $(0, 1)$; si esos dos salen bien, el resto también.',
    '<strong>Lo que falles, píntalo.</strong> Cada pregunta enlaza con su tema y allí el visor ejecuta la fórmula: ver el círculo desplazado o el color equivocado dice enseguida dónde estaba el error.'
  ], true);

  p.comprueba('Una pregunta da un punto en píxeles y una resolución que no es cuadrada, y pide la distancia al centro. ¿Por dónde empiezas?', [
    { t: 'Normalizando a $[0, 1]$, restando $0{,}5$ y multiplicando la $x$ por la proporción de la pantalla', ok: true, por: 'Sin corregir la proporción, «el centro» está bien pero las distancias no: un círculo saldría elipse. Es el primer paso de casi todos los temas del bloque.' },
    { t: 'Restando el centro en píxeles directamente', ok: false, por: 'Vale para esa pregunta, pero el examen pide la distancia en las coordenadas del shader, que son las normalizadas; y a la que la resolución no sea cuadrada, hay que corregir la proporción.' },
    { t: 'Usando la distancia Manhattan', ok: false, por: 'La distancia del bloque es la euclídea, la de <code>length</code>. Manhattan dibuja rombos, no círculos.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de programación gráfica',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'El plano del píxel', temas: ['gfx-pixel', 'gfx-coordenadas', 'gfx-distancia', 'gfx-raton', 'gfx-decidir', 'gfx-tiempo', 'gfx-curvas', 'gfx-repetir', 'gfx-texto'], n: 3, min: 15 },
      { titulo: 'Transformar y colorear', temas: ['gfx-matrices', 'gfx-color', 'gfx-ruido', 'gfx-warp', 'gfx-voronoi', 'gfx-simetria', 'gfx-mosaicos', 'gfx-hiperbolico'], n: 3, min: 15 },
      { titulo: 'Derivadas, memoria y fluidos', temas: ['gfx-derivadas', 'gfx-buffers', 'gfx-fluidos', 'gfx-tunel'], n: 2, min: 10 },
      { titulo: 'La tercera dimensión', temas: ['gfx-trazado', 'gfx-camara', 'gfx-raymarching', 'gfx-escena', 'gfx-luz', 'gfx-terreno', 'gfx-materiales', 'gfx-nubes'], n: 3, min: 15 },
      { titulo: 'Fractales, postproceso y filtros', temas: ['gfx-fractales', 'gfx-post', 'gfx-filtros', 'gfx-directo'], n: 2, min: 10 }
    ]
  });

  p.hist('Los demoscene de los años noventa se examinaban en directo: en un concurso, el programa se proyectaba una sola vez y el público decidía. Muchas de las técnicas de este bloque —el túnel, el raymarching, los fractales en tiempo real— nacieron en esas competiciones, escritas para caber en unos kilobytes. Este examen es más tranquilo, pero pregunta la misma geometría que hacía posible aquello.');
});
