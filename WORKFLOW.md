# Workflow del proyecto «Matebase»

Curso interactivo de matemáticas: hasta 2.º de Bachillerato y la prueba de acceso, y desde ahí
hacia lo que viene después.
Se abre haciendo doble clic en `index.html`. **Sin servidor local, sin internet, sin dependencias.**

---

## Principio rector

> Cada tema nuevo debe costar *un archivo y una entrada en el temario*.
> Todo lo demás (maquetación, fórmulas, gráficas, corrección de ejercicios,
> progreso, navegación, repaso) ya está resuelto en el núcleo y se recicla.

---

## Fase 0 — Restricciones técnicas (cerradas)

| Restricción | Consecuencia de diseño |
|---|---|
| Debe abrirse con `file://` | Prohibido `fetch()`, `XMLHttpRequest` y `<script type="module">` (los bloquea CORS en local). Los temas se cargan inyectando `<script src>` clásicos bajo demanda. |
| Sin internet | Nada de CDN. MathJax/KaTeX quedan descartados → se escribe un **renderizador LaTeX propio y ligero** (`mathx.js`). |
| Sin build ni npm | JavaScript ES5 plano, un namespace global por módulo. |
| Ampliable a mano | El temario vive en un único archivo de datos (`curriculum.js`). Un tema sin archivo no rompe nada: muestra su ficha «en preparación». |

## Fase 1 — Temario (cerrada) → `assets/js/curriculum.js`

17 bloques, 200 temas, en progresión estricta. El orden es el contrato pedagógico:
ningún tema usa una herramienta que no se haya explicado antes, y `tests.html`
comprueba que los requisitos declarados de cada tema van antes que él.

**Hasta 2.º de Bachillerato**

0. **Lógica, demostración y problemas** (5) — proposiciones, conjuntos, inducción, resolución de problemas y algoritmos.
1. **Aritmética y fundamentos** (10) — de los naturales a la recta real.
2. **Álgebra** (15) — del lenguaje algebraico a determinantes, inversa y discusión de sistemas.
3. **Geometría del plano y del espacio** (12) — la geometría de Euclides, hasta rectas, planos y problemas métricos en el espacio.
4. **Trigonometría** (5).
5. **Funciones y análisis** (21) — hasta continuidad, derivabilidad, L'Hôpital, representación, integración y función integral.
6. **Probabilidad y estadística** (12) — hasta la normal, los intervalos de confianza y el contraste de hipótesis.

**La bisagra**

7. **Repaso de 2.º y PAU** (5) — mapa del temario, errores frecuentes, formulario y simulacros de Matemáticas II y MACS II.

**Lo que viene después**

8. **Álgebra lineal** (5) — espacios, autovalores, mínimos cuadrados, SVD y Markov.
9. **Cálculo en varias variables** (4) — gradiente, optimización, Lagrange e integrales múltiples.
10. **Ecuaciones diferenciales y ondas** (7) — EDO, métodos numéricos, oscilador, sistemas dinámicos, caos, EDP y Fourier.
11. **Geometría avanzada: curvatura y forma** (3) — no euclídeas, geometría diferencial y topología.
12. **Estructuras, números e infinito** (6).
13. **Discreta y computacional** (6).
14. **Cibernética** (15).
15. **Programación gráfica** (33), con piel propia.
16. **Criptografía** (36), con piel propia — de César a lo poscuántico, con la criptografía real (SHA-256, AES, curvas, RSA) ejecutándose en el navegador desde `assets/js/core/cripto.js`.

Cada tema declara `id`, `t` (título), `r` (resumen), `o` (objetivos) y `req`
(requisitos); los de 2.º, además, `curso: '2B'` e `itin` (`['MII']`, `['MCS']` o
los dos). Se pueden **intercalar temas nuevos** en cualquier punto insertando un
objeto en el array.

> **Por qué el temario de ampliación está repartido por disciplinas.** Los bloques
> de ampliación empezaron siendo **un solo bloque de 19 temas** llamado «Escalada
> avanzada», y funcionaba mal: su único criterio era negativo —*esto no entra en
> Bachillerato*—, así que un alumno que lo abría no sabía qué estaba empezando.
> Repartirlo por disciplinas no cambió ni una línea de contenido: solo el array de
> `curriculum.js`.
>
> Pasó lo mismo, a menor escala, con un bloque llamado «Varias variables y
> geometría», que mezclaba cálculo multivariable con geometrías no euclídeas y
> topología, y hacía aparecer la palabra «Geometría» en dos bloques sin que se
> entendiera la diferencia. Se partió en **Cálculo en varias variables** y
> **Geometría avanzada: curvatura y forma**, el bloque 3 pasó a llamarse **Geometría
> del plano y del espacio**, y el cálculo en varias variables se colocó antes de las
> ecuaciones diferenciales, porque las ecuaciones en derivadas parciales lo necesitan.
>
> A raíz de aquello se estableció una regla: **los textos no citan bloques por su
> número**. Nombran el bloque o enlazan el tema con `[[id]]`, para que el orden se
> pueda cambiar sin dejar referencias rotas.

## Fase 2 — Núcleo de software (cerrada) → `assets/js/core/`

| Módulo | Responsabilidad | Lo reutilizan |
|---|---|---|
| `util.js` | DOM, RNG con semilla, formato | todos |
| `mathx.js` | Renderizador LaTeX → HTML | todos |
| `mathlib.js` | Fracciones exactas, polinomios, primos, matrices, **parser de expresiones** para corregir respuestas | ejercicios |
| `widgets.js` | **`Plot2D`**, motor gráfico único con sus envoltorios, controles y el **visor 3D** `W.space3d` | ejemplos y ejercicios |
| `shader.js` | Visor de shaders GLSL, comparación píxel a píxel y modo con memoria | programación gráfica y cibernética |
| `exercise.js` | Motor de **ejercicios y problemas por apartados**: generar → preguntar → corregir → diagnosticar → resolver → regenerar; modo examen | todos los temas |
| `page.js` | Constructor declarativo de páginas y recolector de contenido | todos los temas |
| `repaso.js` | Mapa del temario, simulacros y formulario | bloque de repaso |
| `progress.js` | Progreso, dominio por tipo de ejercicio y repaso espaciado en `localStorage` | índice, portada y ejercicios |
| `app.js` | Índice, buscador con glosario, columna derecha con el glosario y la referencia GLSL, itinerarios, enrutado con semilla y carga perezosa | shell |

## Fase 3 — Contenido, bloque a bloque (cerrada)

Por cada tema: explicación → apunte histórico → ejemplos interactivos → ejercicios
procedimentales → ideas clave. **Los 164 temas están escritos**, y cada tanda se
entregó dejando el proyecto funcionando y pasando `tests.html`.

## Fase 4 — Curso de 2.º de Bachillerato y repaso (cerrada)

La revisión con tres miradas —la de un alumno que intenta seguir el curso, la de un
profesor que prepara la prueba de acceso y la de un especialista en usabilidad—
llevó a esto:

- **Completar 2.º**: determinantes, inversa y ecuaciones matriciales, discusión de
  sistemas con parámetros, vectores y problemas métricos en el espacio, continuidad y
  Bolzano, derivabilidad a trozos, L'Hôpital, representación gráfica, integrales
  racionales, función integral, proporciones y contraste de hipótesis.
- **Ampliar** los temas que se quedaban cortos y **añadir problemas por apartados**,
  errores típicos diagnosticados, pistas graduadas y respuestas de elección.
- **Etiquetar** cada tema por curso y asignatura, con itinerarios MII y MCS y el
  cuadro «Antes de empezar».
- **Seguimiento fino**: dominio por tipo de ejercicio, repaso espaciado y «seguir
  por donde ibas».
- **Bloque de repaso y PAU**, con simulacros que reutilizan los generadores de los temas.
- **Ampliar la parte posterior**: mínimos cuadrados, SVD, métodos numéricos,
  oscilaciones, integrales múltiples, Lagrange, criptografía con curvas elípticas,
  recurrencias, complejidad; seis temas nuevos de cibernética y siete de programación
  gráfica.

## Fase 5 — Revisión pedagógica de los 158 temas (cerrada)

Un pase completo por todos los bloques con tres voces: un alumno que lee cada tema
y anota lo que no entiende y dónde el hilo salta; un profesor que compara esas
notas con el curso y propone cambios; y un especialista en usabilidad que los
aplica con lo que se sabe de contenidos interactivos eficaces. El resultado, en
todos los temas:

- **Puente** al principio (`p.puente`): de dónde venimos y qué herramienta del curso
  se reutiliza, con enlaces al tema en vez de «el bloque 5».
- **Ejemplo resuelto** paso a paso con números (`p.ejemplo`), con una pregunta antes
  de destapar cada paso, colocado antes de «Practica».
- **Comprobación rápida** tras la idea clave (`p.comprueba`), con la explicación de
  cada opción, también de las equivocadas.
- **Predicción antes de cada demo** (`predice`): predecir, observar, explicar.
- **Trampas habituales** con contraejemplo (`p.trampas`), justo antes de practicar.
- Ejercicios de texto libre convertidos en **opciones**; ejercicios básicos añadidos
  donde faltaban; niveles ordenados de básico a avanzado; errores de contenido
  corregidos al pasar (la penumbra de las sombras suaves, entre otros).

`tests.html` audita también estas piezas: cuenta ejemplos, resueltos y
comprobaciones por tema y exige una sola opción correcta y explicación en todas.
Cada bloque se entregó en un commit con las pruebas en verde.

## Fase 6 — Ideas pendientes (a petición)

- Más problemas de examen reales, adaptados por comunidades autónomas.
- Un modo profesor para montar simulacros a medida eligiendo temas.
- Exportar e importar el progreso para cambiar de ordenador.

## Versiones

La versión vive en `assets/js/version.js` y se ve en la esquina inferior izquierda
del índice. Sigue el esquema MAYOR.MENOR.PARCHE:

- **MAYOR**: cambios que reorganizan el temario u obligan a reiniciar el progreso guardado.
- **MENOR**: temas, bloques o herramientas nuevas.
- **PARCHE**: correcciones, sin contenido nuevo.

Se sube en el mismo commit que el cambio, y `tests.html` comprueba que tiene ese
formato. La primera versión numerada es la 1.0.0, con 164 temas.

---

## Cómo añadir un tema (receta completa)

1. Crear `topics/<id>.js`:
   ```js
   Course.topic('mi-id', function (p) {
     p.puente('De dónde venimos y qué se reutiliza, con enlaces [[otro-id|así]].');
     p.section('Idea');
     p.text('Texto con matemáticas en línea: $x^2+1$.');
     p.formula('\\int_0^1 x^2\\,dx = \\frac{1}{3}', 'etiqueta', 'cómo se lee');
     p.demo({ title: 'Míralo', predice: '¿Qué crees que pasará si…?', build: function (host) { /* W.plot, W.space3d... */ } });
     p.ejemplo({ title: 'Resuelto', enunciado: '…', pasos: [{ t: 'paso 1', antes: 'pregunta' }, 'paso 2'], cierre: '…' });
     p.comprueba('¿Pregunta?', [{ t: 'opción', ok: true, por: '…' }, { t: 'otra', ok: false, por: '…' }]);
     p.trampas([{ e: 'error habitual', por: 'contraejemplo' }]);
     p.exercise({ /* gen / ask / fields / sol / errores / hint / steps */ });
     p.keys(['idea 1', 'idea 2']);
   });
   ```
2. Añadir una entrada en el array del bloque correspondiente de `assets/js/curriculum.js`.
3. Recargar.
4. Abrir `tests.html`: el tema debe salir en verde y su auditoría limpia.

Detalle de la API en `GUIA-AUTOR.md`.
