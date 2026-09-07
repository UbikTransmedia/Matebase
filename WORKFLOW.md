# Workflow del proyecto «Matebase»

Curso interactivo de matemáticas, desde contar hasta sistemas dinámicos.
Se abre haciendo doble clic en `index.html`. **Sin servidor local, sin internet, sin dependencias.**

---

## Principio rector

> Cada tema nuevo debe costar *un archivo y una línea*.
> Todo lo demás (maquetación, fórmulas, gráficas, corrección de ejercicios,
> progreso, navegación) ya está resuelto en el núcleo y se recicla.

---

## Fase 0 — Restricciones técnicas (cerradas)

| Restricción | Consecuencia de diseño |
|---|---|
| Debe abrirse con `file://` | Prohibido `fetch()`, `XMLHttpRequest` y `<script type="module">` (los bloquea CORS en local). Los temas se cargan inyectando `<script src>` clásicos bajo demanda. |
| Sin internet | Nada de CDN. MathJax/KaTeX quedan descartados → se escribe un **renderizador LaTeX propio y ligero** (`mathx.js`). |
| Sin build ni npm | JavaScript ES5/ES6 plano, un namespace global por módulo. |
| Ampliable a mano | El temario vive en un único archivo de datos (`curriculum.js`). Un tema sin archivo no rompe nada: muestra su ficha «en preparación». |

## Fase 1 — Temario (cerrada) → `assets/js/curriculum.js`

12 bloques, 79 temas, en progresión estricta. El orden es el contrato pedagógico:
ningún tema usa una herramienta que no se haya explicado antes.

0. **Lógica, conjuntos y demostración** (3) — proposiciones, conjuntos e inducción.
1. **Aritmética y fundamentos** (10) — de los naturales a la recta real, con
   magnitudes y análisis dimensional.
2. **Álgebra** (12) — del lenguaje algebraico a los complejos.
3. **Geometría** (10) — de los ángulos a la geometría del espacio.
4. **Trigonometría** (5) — del triángulo rectángulo a las ondas.
5. **Funciones y análisis** (12) — del concepto de función a la integral definida,
   pasando por programación lineal.
6. **Probabilidad y estadística** (8) — de la media a la inferencia.
7. **Álgebra lineal** (3) — espacios vectoriales, autovalores, cadenas de Markov.
8. **Ecuaciones diferenciales y ondas** (5) — EDO, sistemas dinámicos, caos, EDP
   y Fourier.
9. **Varias variables y geometría** (4) — cálculo vectorial, descenso de
   gradiente, geometría diferencial y topología.
10. **Estructuras, números e infinito** (3) — teoría de números y RSA, grupos y
   simetría, el infinito de Cantor.
11. **Discreta y computacional** (4) — grafos, análisis numérico, teoría de la
   información y teoría de juegos.

> Los cinco últimos empezaron siendo **un solo bloque de 19 temas** llamado
> «Escalada avanzada», y funcionaba mal: su único criterio de agrupación era
> negativo —*esto no entra en Bachillerato*—, así que reunía álgebra lineal,
> análisis, geometría, álgebra abstracta y computación sin más relación entre sí
> que no ser currículo. Un alumno que abría ese bloque no sabía qué estaba
> empezando. Repartirlo por disciplinas no cambió ni una línea de contenido: solo
> el array de `curriculum.js`.

Cada tema declara: `id`, `titulo`, `resumen`, `objetivos[]` y `requisitos[]`.
Se pueden **intercalar temas nuevos** en cualquier punto insertando un objeto en el array.

## Fase 2 — Núcleo de software (cerrada) → `assets/js/core/`

Ocho módulos, cero duplicación. El orden es el de carga:

| Módulo | Responsabilidad | Lo reutilizan |
|---|---|---|
| `util.js` | DOM, RNG con semilla, formato | todos |
| `mathx.js` | Renderizador LaTeX → HTML (fracciones, raíces, matrices, sumatorios…) | todos |
| `mathlib.js` | Fracciones exactas, polinomios, primos, matrices, **parser de expresiones** para corregir respuestas | ejercicios |
| `widgets.js` | **`Plot2D`**: motor gráfico único (ejes, funciones, puntos arrastrables, vectores, áreas, barras). `NumberLine`, `GeoBoard`, `Chart` y el círculo goniométrico son *envoltorios* de `Plot2D`. Controles: sliders, botones, marcadores. | demos y ejercicios |
| `exercise.js` | Motor de **ejercicios procedimentales**: generar → preguntar → corregir → resolver → regenerar | todos los temas |
| `page.js` | Constructor declarativo de páginas (`p.text`, `p.formula`, `p.demo`, `p.exercise`…) | todos los temas |
| `progress.js` | Progreso y aciertos en `localStorage` | índice y ejercicios |
| `app.js` | Índice desplegable, buscador, enrutado por `#/id`, tema claro/oscuro, carga perezosa de temas | shell |

**Dos categorías de material interactivo, visualmente distintas:**

- 🔵 **Ejemplo interactivo** (`p.demo`) — escenario *fijo*, con parámetros que el alumno
  mueve para *ver* el concepto. No se corrige, no puntúa.
- 🟢 **Ejercicio práctico** (`p.exercise`) — enunciado **generado proceduralmente** con
  RNG: botón «Otro ejercicio» que rebaraja los números tantas veces como haga falta,
  corrección automática, pistas y solución paso a paso.

## Fase 3 — Contenido, bloque a bloque (cerrada)

Por cada tema: explicación → apunte histórico → ejemplo interactivo → 3-5
ejercicios procedimentales → ideas clave.

**Los 79 temas están escritos**: 147 ejemplos interactivos, 312 ejercicios
procedimentales y 139 gráficas. Cada tanda se entregó dejando el proyecto
funcionando y pasando `tests.html`.

## Fase 4 — Repaso y ampliación (pendiente, a petición)

Lo que queda por hacer si el curso se quiere llevar más lejos:

- **Profundizar** en los temas que se hayan quedado cortos.
- **Intercalar** temas nuevos donde se detecte un salto (basta con insertar un
  objeto en `curriculum.js` y crear su archivo).
- **Exámenes mezclados** por bloque, reutilizando los generadores que ya existen:
  el motor permite juntar ejercicios de varios temas en una sola página.
- **Seguimiento del progreso** más fino (rachas, temas flojos, repaso espaciado).

---

## Cómo añadir un tema (receta completa)

1. Crear `topics/<id>.js`:
   ```js
   Course.topic('mi-id', function (p) {
     p.section('Idea');
     p.text('Texto con matemáticas en línea: $x^2+1$.');
     p.formula('\\int_0^1 x^2\\,dx = \\frac{1}{3}');   // en JS, barra doble
     p.demo({ title: 'Míralo', build: function (host, d) { /* Plot2D... */ } });
     p.exercise({ /* gen / ask / sol / steps */ });
     p.keys(['idea 1', 'idea 2']);
   });
   ```
2. Añadir una entrada en el array del bloque correspondiente de `assets/js/curriculum.js`.
3. Recargar. No hay paso 3.
4. Abrir `tests.html`: el tema debe salir en verde y su auditoría limpia.

Detalle de la API en `GUIA-AUTOR.md`.
