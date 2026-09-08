# Matebase

Curso interactivo de matemáticas, desde contar hasta programar imágenes con una fórmula.

**Se abre haciendo doble clic en `index.html`.** No hace falta servidor, ni
internet, ni instalar nada. Puedes copiar la carpeta en un lápiz de memoria y
abrirla en cualquier ordenador con un navegador.

---

## Qué hay dentro

A la izquierda, un índice desplegable con los catorce bloques del curso. A la
derecha, el tema abierto. Cada tema tiene explicación, historia, ejemplos que se
tocan y ejercicios que se pueden repetir infinitas veces.

**Dos tipos de material interactivo, y conviene no confundirlos:**

- 🔵 **Ejemplo interactivo** — un escenario fijo con mandos que mover. Está para
  *ver* el concepto. No se corrige ni puntúa.
- 🟢 **Ejercicio práctico** — el enunciado se **genera al azar**. El botón
  «Otro ejercicio» rebaraja los números, así que se puede practicar el mismo
  tipo las veces que haga falta. Corrige, da pistas y enseña la solución paso a paso.

A la derecha, un **glosario** que se abre y se cierra con el botón de la barra
superior. Tiene buscador —que mira también dentro de las definiciones, y no
distingue tildes— y cada término se despliega en su sitio, sin tocar el
contenido central. Incluye los casos en que una misma palabra significa cosas
distintas: «módulo» aparece tres veces, para el vector, el complejo y la
aritmética modular.

El progreso (temas visitados y aciertos) se guarda en el propio navegador.
El botón «Reiniciar» de abajo a la izquierda lo borra.

---

## El temario

| Bloque | Temas | De qué va |
|---|---|---|
| 0. Lógica, conjuntos y demostración | 3 | qué significa que algo sea cierto, y la inducción |
| 1. Aritmética y fundamentos | 10 | de contar a la recta real, con unidades y análisis dimensional |
| 2. Álgebra | 12 | del lenguaje algebraico a los complejos |
| 3. Geometría | 10 | de los ángulos a la geometría del espacio |
| 4. Trigonometría | 5 | del triángulo rectángulo a las ondas |
| 5. Funciones y análisis | 15 | del concepto de función a la integral definida, con series, Taylor y matemática financiera |
| 6. Probabilidad y estadística | 10 | de la media a la inferencia causal, pasando por las variables continuas |
| 7. Álgebra lineal | 3 | espacios vectoriales, autovalores y cadenas de Markov |
| 8. Ecuaciones diferenciales y ondas | 5 | EDO, sistemas dinámicos, caos, EDP y Fourier |
| 9. Varias variables y geometría | 5 | cálculo vectorial, optimización, geometrías no euclídeas, curvatura y topología |
| 10. Estructuras, números e infinito | 5 | teoría de números y RSA, grupos, la completitud de ℝ, Cantor, Turing y Gödel |
| 11. Discreta y computacional | 4 | grafos, cálculo numérico, información, teoría de juegos |
| 12. Cibernética | 9 | realimentación, caja negra, variedad requerida, PID, homeostasis, retardos, filtrado, autómatas, segundo orden |
| 13. Programación gráfica | 20 | shaders GLSL: del píxel que se pregunta de qué color es al raymarching, los fractales y una actuación en directo |

**116 temas escritos**, en progresión estricta: ninguno usa una herramienta que no
se haya explicado antes, y cada tema avisa de cuáles necesita para que se pueda
retroceder si falta alguna. Los bloques 7 a 11 recogen lo que queda más allá del
Bachillerato, agrupado por disciplina y no en un cajón común. El **bloque 12,
Cibernética**, reutiliza todo lo anterior a la vez —la derivada y la integral como
anticipación y memoria de un controlador, la entropía como variedad, los
autovalores como criterio de estabilidad— para responder a una sola pregunta: cómo
se mantiene algo en su sitio en un mundo que lo empuja.

El **bloque 13, Programación gráfica**, es la golosina del curso y tiene piel
propia —cambia de color entero— porque ahí ya no estamos solo en matemáticas: es
programación y es arte. Enseña shaders GLSL desde cero, con un visor tipo
Shadertoy en cada tema donde el código se edita y se recompila al vuelo, y donde
los ejercicios se corrigen **comparando lo que pinta tu shader con lo que pinta la
solución**, así que se acepta cualquier respuesta equivalente. Va del píxel que se
pregunta de qué color es hasta el raymarching, el ruido fractal, Voronoi, los
caleidoscopios, Mandelbrot y el post-proceso, y termina en cómo se toca todo eso
en directo y adónde ir después. La idea que lo sostiene, que es la del curso
entero: **reglas simples, complejidad epatante**.

En total, **219 ejemplos interactivos**, **422 ejercicios procedimentales** y
**210 gráficas**, más **203 cuadros de utilidad**, **123 apuntes históricos** y un
glosario de **221 términos**.

El temario vive en `assets/js/curriculum.js`. Si en el futuro se añade un tema
nuevo al índice sin su archivo, aparece marcado como «en preparación» con sus
objetivos, sin romper nada.

---

## Estructura del proyecto

```
matebase/
├── index.html            ← el curso (ábrelo con doble clic)
├── tests.html            ← comprobaciones del núcleo (para desarrollo)
├── WORKFLOW.md           ← plan de trabajo y decisiones de diseño
├── GUIA-AUTOR.md         ← cómo añadir o modificar un tema
├── AUTORIA.md            ← autoría y qué permite la licencia
├── LICENSE               ← texto completo de la GPLv3
├── assets/
│   ├── css/              base · layout · components · math
│   └── js/
│       ├── curriculum.js ← EL TEMARIO (el único sitio donde se decide qué hay)
│       ├── glosario.js   ← EL VOCABULARIO (un término por entrada)
│       └── core/         ← el motor, compartido por todos los temas
└── topics/               ← un archivo por tema
```

El núcleo (`assets/js/core/`) es lo que evita repetir código:

| Módulo | Responsabilidad |
|---|---|
| `util.js` | DOM, generador aleatorio con semilla, formato con coma decimal |
| `mathx.js` | renderizador de LaTeX escrito a medida (sin CDN, funciona sin internet) |
| `mathlib.js` | fracciones exactas, polinomios, matrices, estadística y el evaluador de las respuestas del alumno |
| `widgets.js` | **un solo motor gráfico** (`Plot2D`) del que cuelgan recta real, geometría, vectores, barras, campos y retratos de fase |
| `exercise.js` | motor de ejercicios procedimentales |
| `page.js` | constructor declarativo de páginas |
| `progress.js` | progreso en `localStorage` |
| `shader.js` | visor de shaders GLSL: editor, recompilación al vuelo, errores con su número de línea y comparación de dos shaders píxel a píxel |
| `app.js` | índice desplegable, buscador, enrutado y carga perezosa de temas |

Un tema de trigonometría y uno de geometría usan exactamente el mismo código de
dibujo; lo único que cambia es lo que se le pide dibujar.

---

## Añadir un tema

Dos pasos: crear `topics/<id>.js` y añadir una línea a `assets/js/curriculum.js`.
Los detalles están en **`GUIA-AUTOR.md`**.

---

## Notas técnicas

- Sin dependencias, sin `npm`, sin compilación. JavaScript plano.
- No se usa `fetch` ni módulos ES porque el navegador los bloquea en `file://`;
  los temas se cargan inyectando etiquetas `<script>` clásicas bajo demanda.
- Tres temas de color —**claro** por defecto, oscuro y **monokai** de contraste
  suave—, con un botón para cada uno al pie del índice: el activo se distingue a
  simple vista, y la elección se recuerda entre sesiones.
- Diseño adaptado a móvil, y botón de inicio junto al nombre, en la cabecera del índice.
- **Accesible de verdad, no de boquilla**: acierto y fallo se distinguen por
  forma además de por color; las 26 gráficas con puntos móviles se manejan
  también con el teclado; los tamaños de letra están en `rem` y hay un control
  propio de tamaño de lectura; los marcadores y veredictos se anuncian por
  `aria-live`; hay enlace para saltarse el índice; se respeta
  `prefers-reduced-motion`; y las 48 combinaciones de color de los tres temas
  pasan el contraste AA, comprobado en cada ejecución de las pruebas.
- El bloque 13 usa **WebGL 1.0**, que llevan todos los navegadores desde hace más
  de una década. Si falta, el visor lo dice y el código sigue leyéndose. Las
  texturas se generan por fórmula y no se carga ninguna imagen, que es
  precisamente lo que permite que funcione desde `file://`.
- `tests.html` comprueba el núcleo (147 verificaciones) y **audita los 422
  ejercicios**: genera cada uno 40 veces y verifica que la solución declarada
  pasa su propio corrector, que nada lanza excepciones, que no queda ninguna
  fórmula con comandos LaTeX inexistentes, que ninguna gráfica de escala 1:1
  recorta su encuadre, que ninguna fórmula se sale de su caja, que ninguna
  gráfica se queda sin nombre accesible ni fuera del alcance del teclado, que
  ningún enlace entre capítulos apunta a un tema inexistente, que el glosario
  carga y apunta a temas que existen, que **los 41 shaders del curso compilan y
  no pintan una imagen lisa**, y que todos los temas del temario se construyen
  sin errores.

---

*Los apuntes históricos de cada tema no son adorno: entender de dónde salió cada
idea, y qué problema vino a resolver, es la mitad de entenderla.*

---

## Autoría y licencia

Diseñado por **Guillem Carbonell** — [gcarbonell.com](https://gcarbonell.com)

Se distribuye bajo la **Licencia Pública General GNU, versión 3 (GPLv3)** o, a
tu elección, cualquier versión posterior:
puedes usarlo, copiarlo, modificarlo y repartirlo, también en clase y también
comercialmente, siempre que lo que publiques a partir de él conserve esta misma
libertad y su código fuente. El texto completo está en [`LICENSE`](LICENSE), y
el resumen de lo que implica en [`AUTORIA.md`](AUTORIA.md).
