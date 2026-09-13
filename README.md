# Matebase

Curso interactivo de matemáticas: desde contar hasta las matemáticas de 2.º de Bachillerato y la
prueba de acceso a la universidad, y desde ahí hacia lo que viene después, hasta programar imágenes
con una fórmula.

**Se abre haciendo doble clic en `index.html`.** No hace falta servidor, ni
internet, ni instalar nada. Puedes copiar la carpeta en un lápiz de memoria y
abrirla en cualquier ordenador con un navegador.

---

## Qué hay dentro

A la izquierda, un índice desplegable con los veintiún bloques del curso. A la
derecha, el tema abierto. Cada tema empieza con un **puente** desde lo anterior
—de dónde venimos y qué herramienta del curso se reutiliza— y tiene explicación,
historia, ejemplos que se tocan (con una **predicción** que hacer antes de
tocarlos), un **ejemplo resuelto** paso a paso, **comprobaciones rápidas** con la
explicación de cada opción, una lista de **trampas habituales** con su
contraejemplo, y ejercicios que se pueden repetir infinitas veces.

**Dos tipos de material interactivo, y conviene no confundirlos:**

- 🔵 **Ejemplo interactivo** — un escenario fijo con mandos que mover. Está para
  *ver* el concepto. No se corrige ni puntúa.
- 🟢 **Ejercicio práctico** — el enunciado se **genera al azar**. El botón
  «Otro ejercicio» rebaraja los números, así que se puede practicar el mismo
  tipo las veces que haga falta. Corrige, da pistas y enseña la solución paso a paso.

Los ejercicios hacen más que decir «bien» o «mal»:

- **Pistas graduadas**: la primera orienta y la segunda casi resuelve.
- **Errores típicos con nombre**: si la respuesta coincide con un error
  frecuente —olvidar la raíz en la distancia de un punto a un plano, confundir
  $P(A|B)$ con $P(B|A)$—, el corrector lo dice y explica por qué.
- **Problemas por apartados**, como los de la prueba de acceso, donde cada apartado se
  corrige por separado.
- **Respuestas de elección** además de numéricas.
- **Enlaces con semilla**: copiar el enlace de un ejercicio reproduce exactamente
  los mismos números, para que un profesor pase el mismo a toda la clase.

A la derecha, una columna con tres documentos, cada uno con su botón en la barra
superior: el **glosario**, la **referencia GLSL** —los tipos, las palabras y las
funciones del lenguaje de los shaders, con su firma, un ejemplo que compila en
WebGL 1 y el tema donde se explican— y la **referencia de JavaScript**, que es el
lenguaje del sintetizador: la forma de `sonido(t, i)`, los operadores, el control
de flujo, las funciones del preámbulo, las recetas del curso, lo que **no**
conviene hacer ahí dentro (empezando por `Math.random`, que rompe la
reproducibilidad) y los usos de JavaScript que están fuera del sonido —el taller
de redes neuronales y el propio código del curso—. Pulsar otro botón cambia de
documento sin cerrar la columna; pulsar el mismo la cierra. Los tres buscadores
miran también dentro de las explicaciones y no distinguen tildes, y el buscador
del índice encuentra términos de los tres.

**El progreso se guarda en el propio navegador**, y va más allá de «visto»:

- un tema cuenta como **dominado** cuando se ha resuelto al menos una vez cada tipo de ejercicio;
- lo que se falla vuelve a proponerse al cabo de uno, tres y siete días en
  **«Para repasar hoy»**, en la portada;
- la portada ofrece **seguir por donde ibas**;
- y el progreso **sale del navegador**: se guarda como archivo y se vuelve a
  cargar en otro ordenador. Al fundir dos progresos gana lo más avanzado, nunca
  lo más reciente, así que abrir el curso en el móvil no borra lo del portátil.

**Para quien da clase**, y sin servidor ninguno: una vista que lee varios
progresos a la vez y los resume por bloques; **deberes** que viajan dentro de un
enlace —los ejercicios elegidos, con sus números ya fijados—; un **examen** de
cualquier bloque; y cualquier tema **imprimible como ficha**.

Los 161 temas de ampliación son optativos y no se presuponen entre sí, así que
además del temario hay **rutas**: recorridos con un destino —cómo funciona un
ordenador, datos y modelos, matemática pura— cerrados sobre sus requisitos y
ordenados para que nada llegue antes de lo que necesita.

La **interfaz y el temario** se pueden leer también **en inglés**. La prosa de
los temas sigue en castellano, y el tema lo avisa antes de empezar: traducir a
medias sin decirlo sería peor que no traducir.

Cada tema de 2.º lleva su etiqueta de curso y de asignatura, y un cuadro
**«Antes de empezar»** con los temas que da por sabidos y el estado de cada uno.
Arriba del índice se elige el itinerario —**Matemáticas II** o **Matemáticas
Aplicadas a las Ciencias Sociales II**— y el índice resalta lo que entra en esa
asignatura.

---

## El temario

| Bloque | Temas | De qué va |
|---|---|---|
| 0. Lógica, demostración y problemas | 5 | qué significa que algo sea cierto, la inducción, cómo atacar un problema y qué es un algoritmo |
| 1. Aritmética y fundamentos | 10 | de contar a la recta real, con unidades y análisis dimensional |
| 2. Álgebra | 15 | del lenguaje algebraico a los complejos, las matrices, los determinantes y la discusión de sistemas |
| 3. Geometría del plano y del espacio | 12 | la geometría de Euclides, de los ángulos a rectas, planos, distancias y ángulos en el espacio |
| 4. Trigonometría | 5 | del triángulo rectángulo a las ondas |
| 5. Funciones y análisis | 21 | de la función a la función integral: límites, continuidad, derivabilidad, L'Hôpital, representación e integración |
| 6. Probabilidad y estadística | 12 | de la media a la inferencia: normal, intervalos para medias y proporciones, contraste de hipótesis |
| 7. Repaso de 2.º y PAU | 5 | mapa del temario con tu estado, los errores que más puntos cuestan, formulario imprimible y simulacros |
| 8. Álgebra lineal | 5 | espacios vectoriales, autovalores, mínimos cuadrados, valores singulares y cadenas de Markov |
| 9. Cálculo en varias variables | 4 | gradiente, optimización, multiplicadores de Lagrange e integrales múltiples |
| 10. Ecuaciones diferenciales y ondas | 7 | EDO, métodos numéricos, oscilaciones, sistemas dinámicos, caos, EDP y Fourier |
| 11. Geometría avanzada: curvatura y forma | 3 | geometrías no euclídeas, curvatura y topología |
| 12. Estructuras, números e infinito | 6 | números y RSA, grupos, Diffie-Hellman y curvas elípticas, completitud, Cantor, Turing y Gödel |
| 13. Discreta y computacional | 6 | grafos, recurrencias, complejidad y P frente a NP, cálculo numérico, información, teoría de juegos |
| 14. Cibernética | 15 | realimentación y bloques, PID, dinámica de sistemas, Kalman, perceptrón, refuerzo, autoorganización, sistema viable, segundo orden |
| 15. Máquinas y lenguajes | 19 | cómo funciona un ordenador y cómo funciona un lenguaje: del bit y la puerta lógica a una CPU que ejecuta, y de ahí a un lenguaje propio que compila para ella |
| 16. Síntesis de sonido | 15 | un sonido es una función del tiempo: de la onda a la nota, de la nota al timbre y del timbre a la música, con un sintetizador que se programa como un shader: muestreo, escala y logaritmo, envolventes, armónicos y Fourier, la cuerda, el espectro, batidos, FM, filtros, ruido y Karplus-Strong, eco, secuenciador y taller |
| 17. Programación gráfica | 34 | shaders GLSL: del píxel al raymarching, con ratón, curvas, texto, mosaicos, disco de Poincaré, trazado de rayos, cámara, shaders con memoria y fluidos, terreno, texturas sólidas, nubes y filtros de cámara |
| 18. Criptografía | 37 | del cifrado de César a lo poscuántico: frecuencias, Vigenère, Enigma, la libreta de un solo uso, AES paso a paso, hash, RSA, curvas elípticas, firmas, conocimiento cero, cadenas de bloques, Shor y BB84, con la criptografía real ejecutándose en el navegador |
| 19. Inteligencia artificial I: aprender de los datos | 13 | qué es aprender de los datos, búsqueda y poda alfa-beta, vecinos próximos, árboles y bosques, Bayes ingenuo, margen máximo, sigmoide, pérdidas y optimizadores, la red densa, retropropagación, generalizar y evaluar |
| 20. Inteligencia artificial II: las arquitecturas | 15 | convolucionales, Hopfield, recurrentes y LSTM, autocodificadores y VAE, GAN, difusión, tokens y BPE, n-gramas y perplejidad, vectores de palabras, atención y transformador, un LLM entero, Bellman y Q-learning, los límites, y un taller con todos los mandos |

**Los 266 temas están escritos**, en progresión estricta: ninguno usa una
herramienta que no se haya explicado antes, y cada tema declara cuáles necesita;
`tests.html` comprueba que todos esos requisitos van antes en el temario.

**Los bloques 0 a 6 cubren el temario de matemáticas hasta 2.º de Bachillerato**,
con los contenidos de Matemáticas II y de MACS II. El **bloque 7** es la bisagra:
no enseña nada nuevo, ordena lo aprendido para el examen, con un mapa del temario
de cada asignatura, un catálogo de errores frecuentes con ejercicios para
cazarlos, un formulario que se monta solo a partir de los temas y se imprime, y
dos **simulacros** —uno por asignatura— que sacan preguntas de los temas, sin pistas
ni soluciones hasta entregar, con cronómetro opcional y nota por bloques con
enlaces a lo que conviene repasar. Cada bloque de la ampliación, del 15 en
adelante, termina con un **examen del bloque** hecho de la misma manera: preguntas
de todos sus temas, repartidas por tramos, para saber si se ha interiorizado.

A partir de ahí el curso **pivota hacia lo que viene después**, agrupado por
disciplina. La **Cibernética** reutiliza todo lo anterior a la vez —la derivada y la integral como
anticipación y memoria de un controlador, la entropía como variedad, los
autovalores como criterio de estabilidad— para responder a una sola pregunta: cómo
se mantiene algo en su sitio en un mundo que lo empuja.

La **Síntesis de sonido** es el puente entre las matemáticas, la música y la programación:
un sonido es una función del tiempo, y una fórmula de tres líneas ya suena. Cada tema
lleva un **sintetizador** donde el código —JavaScript llano, `function sonido(t)`— se
edita, se calcula entero antes de sonar y se ve como onda y como espectro; el seno, el
logaritmo de la escala, la serie de Fourier del timbre, las sucesiones recurrentes de
los filtros y la serie geométrica del eco se oyen, y los ejercicios de código se
corrigen **comparando el espectro y la envolvente de lo que suena** con la solución.

La **Programación gráfica** tiene piel propia —cambia de color entero— porque ahí ya no
estamos solo en matemáticas: es programación y es arte. Enseña shaders GLSL desde
cero, con un visor tipo Shadertoy en cada tema donde el código se edita y se
recompila al vuelo, y donde los ejercicios de código se corrigen **comparando lo que
pinta tu shader con lo que pinta la solución**. La idea que lo sostiene, que es la
del curso entero: **reglas simples, complejidad epatante**.

En total, **551 ejemplos interactivos**, **1143 ejercicios procedimentales**,
**22 problemas por apartados** con 70 apartados, **257 ejemplos resueltos paso a
paso**, **285 comprobaciones rápidas**, **343 cuadros de utilidad**, **279 apuntes
históricos** —con las matemáticas de Hipatia, Sophie Germain, Sofia Kovalévskaya,
Ada Lovelace, Emmy Noether, Mary Cartwright, Katherine Johnson, Karen Spärck Jones,
Grace Hopper, Kathleen Booth, Donella Meadows o Maryam Mirzakhani—, **73 visores de
shaders**, **29 sintetizadores programables**, **13 bancos de circuitos**, **7 consolas de la máquina**, **11 talleres
del lenguaje** con **4 árboles de sintaxis** que se recorren paso a paso, **14
escenas en tres dimensiones** que se giran con el ratón o el teclado, y un
glosario de **468 términos**.

El temario vive en `assets/js/curriculum.js`. Si en el futuro se añade un tema
nuevo al índice sin su archivo, aparece marcado como «en preparación» con sus
objetivos, sin romper nada.

---

## Estructura del proyecto

```
matebase/
├── index.html            ← el curso (ábrelo con doble clic)
├── tests.html            ← comprobaciones del núcleo y auditoría de los temas
├── WORKFLOW.md           ← plan de trabajo y decisiones de diseño
├── GUIA-AUTOR.md         ← cómo añadir o modificar un tema
├── AUTORIA.md            ← autoría y qué permite la licencia
├── LICENSE               ← texto completo de la GPLv3
├── assets/
│   ├── css/              base · layout · components · math
│   └── js/
│       ├── curriculum.js ← EL TEMARIO (el único sitio donde se decide qué hay)
│       ├── glosario.js   ← EL VOCABULARIO (un término por entrada)
│       ├── glsl.js       ← LA REFERENCIA DEL LENGUAJE DE LOS SHADERS
│       ├── javascript.js ← LA REFERENCIA DEL LENGUAJE DEL SINTETIZADOR
│       ├── version.js    ← LA VERSIÓN (se cambia aquí y sale en el pie del índice)
│       ├── i18n/         ← un archivo por idioma (interfaz y temario)
│       └── core/         ← el motor, compartido por todos los temas
└── topics/               ← un archivo por tema
```

El núcleo (`assets/js/core/`) es lo que evita repetir código:

| Módulo | Responsabilidad |
|---|---|
| `util.js` | DOM, generador aleatorio con semilla, formato con coma decimal |
| `mathx.js` | renderizador de LaTeX escrito a medida (sin CDN, funciona sin internet) |
| `mathlib.js` | fracciones exactas, polinomios, matrices, estadística y el evaluador de las respuestas del alumno |
| `widgets.js` | **un solo motor gráfico** (`Plot2D`) del que cuelgan recta real, geometría, vectores, barras y campos, y un **visor 3D** (`W.space3d`) para rectas, planos y vectores del espacio |
| `exercise.js` | motor de ejercicios y de problemas por apartados: generar, preguntar, corregir, diagnosticar errores típicos, dar pistas graduadas y resolver |
| `page.js` | constructor declarativo de páginas |
| `repaso.js` | las páginas de repaso: mapa del temario, simulacros y formulario, montadas con el contenido de los demás temas |
| `progress.js` | progreso en `localStorage`: dominio por tipo de ejercicio y repaso espaciado |
| `shader.js` | visor de shaders GLSL: editor, recompilación al vuelo, errores con su número de línea, comparación de dos shaders píxel a píxel y modo con memoria entre fotogramas |
| `sonido.js` | el sintetizador: compila `function sonido(t, i)`, calcula el sonido entero antes de sonar (con memoria de lo ya calculado para filtros y ecos), lo dibuja como onda, espectro o espectrograma, lo reproduce con Web Audio y compara dos códigos por espectro y envolvente para corregir ejercicios |
| `cripto.js` | la criptografía de verdad ejecutándose en el navegador: SHA-256, AES, RSA y curvas elípticas |
| `nn.js` | redes neuronales de verdad: tensores y diferenciación automática, para que las demos de IA entrenen lo que el texto explica |
| `logica.js` | el banco de circuitos: netlist escrita en texto, diagrama generado solo, tabla de verdad y un simulador que **avanza por instantes**, porque el biestable es un ciclo y no tendría solución de otro modo |
| `maquina.js` | la CPU de juguete: dieciocho instrucciones, celdas de 8 bits con signo, programa y datos en la misma memoria, su ensamblador de dos pasadas y un tope de pasos para que nada se cuelgue |
| `lenguaje.js` | **Pizca**: troceador, analizador por descenso recursivo, intérprete, compilador a la CPU de `maquina.js`, optimizador y el dibujo del árbol de sintaxis con su pila |
| `app.js` | índice desplegable, buscador con glosario, columna derecha con el glosario y las dos referencias de lenguaje, itinerarios, enrutado y carga perezosa de temas |
| `i18n.js` | el idioma de la interfaz y del temario: cada idioma es un diccionario, y lo que no esté traducido sale en castellano |

Un tema de trigonometría y uno de geometría usan exactamente el mismo código de
dibujo; lo único que cambia es lo que se le pide dibujar.

---

## Añadir un tema

Dos pasos: crear `topics/<id>.js` y añadir una entrada a `assets/js/curriculum.js`.
Los detalles están en **`GUIA-AUTOR.md`**.

---

## Notas técnicas

- Sin dependencias, sin `npm`, sin compilación. JavaScript plano.
- No se usa `fetch` ni módulos ES porque el navegador los bloquea en `file://`;
  los temas se cargan inyectando etiquetas `<script>` clásicas bajo demanda.
- Tres temas de color —**claro** por defecto, oscuro y **monokai** de contraste
  suave—, con un botón para cada uno al pie del índice; la elección se recuerda.
- Diseño adaptado a móvil, y los simulacros y el formulario tienen **versión para
  imprimir**.
- **Accesible de verdad, no de boquilla**: acierto y fallo se distinguen por
  forma además de por color; las 30 gráficas con puntos móviles y las escenas 3D se
  manejan también con el teclado; las simulaciones animadas respetan
  `prefers-reduced-motion` y arrancan en pausa si se pide menos movimiento; los
  tamaños de letra están en `rem` y hay un control propio de tamaño de lectura; los
  marcadores y veredictos se anuncian por `aria-live`; los ejemplos con ratón
  traen deslizadores equivalentes; y las combinaciones de color de los tres temas
  pasan el contraste AA, comprobado en cada ejecución de las pruebas.
- El código sale **coloreado**, con un esquema propio por tema de color y los mismos
  ocho papeles en los cinco lenguajes que se escriben en el curso: GLSL, JavaScript,
  el ensamblador, la netlist de circuitos y Pizca.
- La programación gráfica usa **WebGL 1.0**. Si falta, el visor lo dice y el código
  sigue leyéndose. Las texturas se generan por fórmula y no se carga ninguna imagen,
  que es precisamente lo que permite que funcione desde `file://`.
- La síntesis de sonido usa **Web Audio** solo para reproducir: el sonido se calcula
  entero, sin sonar, y el audio se abre al pulsar «Tocar». Sin audio, el sintetizador
  sigue calculando y dibujando.
- `tests.html` hace 575 comprobaciones del núcleo y **audita todos los ejercicios y
  problemas**: genera cada uno 40 veces y verifica que la solución declarada pasa su
  propio corrector, que ningún «error típico» salta con la respuesta correcta, que
  nada lanza excepciones, que no queda ninguna fórmula con comandos LaTeX
  inexistentes, que ninguna gráfica de escala 1:1 recorta su encuadre, que ninguna
  gráfica se queda sin nombre accesible ni fuera del alcance del teclado, que ningún
  enlace entre temas apunta a un tema inexistente, que los requisitos de cada tema
  van antes en el temario, que el glosario apunta a temas que existen, que **cada
  ejemplo de la referencia GLSL compila y cada ejemplo de la referencia de JavaScript
  se ejecuta y suena**, que **todos
  los shaders compilan y ninguno pinta una imagen lisa**, que **todos los sintetizadores
  calculan y ninguno da silencio ni recorta**, y que todos los temas del
  temario se construyen sin errores.

---

*Los apuntes históricos de cada tema no son adorno: entender de dónde salió cada
idea, qué problema vino a resolver y quién la pensó, es la mitad de entenderla.*

---

## Autoría y licencia

Diseñado por **Guillem Carbonell** — [gcarbonell.com](https://gcarbonell.com)

Se distribuye bajo la **Licencia Pública General GNU, versión 3 (GPLv3)** o, a
tu elección, cualquier versión posterior:
puedes usarlo, copiarlo, modificarlo y repartirlo, también en clase y también
comercialmente, siempre que lo que publiques a partir de él conserve esta misma
libertad y su código fuente. El texto completo está en [`LICENSE`](LICENSE), y
el resumen de lo que implica en [`AUTORIA.md`](AUTORIA.md).
