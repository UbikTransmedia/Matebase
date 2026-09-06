# Matebase

Curso interactivo de matemáticas, desde contar hasta los sistemas dinámicos.

**Se abre haciendo doble clic en `index.html`.** No hace falta servidor, ni
internet, ni instalar nada. Puedes copiar la carpeta en un lápiz de memoria y
abrirla en cualquier ordenador con un navegador.

---

## Qué hay dentro

A la izquierda, un índice desplegable con los ocho bloques del curso. A la
derecha, el tema abierto. Cada tema tiene explicación, historia, ejemplos que se
tocan y ejercicios que se pueden repetir infinitas veces.

**Dos tipos de material interactivo, y conviene no confundirlos:**

- 🔵 **Ejemplo interactivo** — un escenario fijo con mandos que mover. Está para
  *ver* el concepto. No se corrige ni puntúa.
- 🟢 **Ejercicio práctico** — el enunciado se **genera al azar**. El botón
  «Otro ejercicio» rebaraja los números, así que se puede practicar el mismo
  tipo las veces que haga falta. Corrige, da pistas y enseña la solución paso a paso.

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
| 5. Funciones y análisis | 12 | del concepto de función a la integral definida, con programación lineal |
| 6. Probabilidad y estadística | 8 | de la media a la inferencia |
| 7. Escalada avanzada | 19 | espacios vectoriales, Markov, EDO y EDP, caos, Fourier, grupos, topología, el infinito de Cantor, juegos, información… |

**79 temas escritos**, en progresión estricta: ninguno usa una herramienta que no
se haya explicado antes. En total, **147 ejemplos interactivos**, **312 ejercicios
procedimentales** y **139 gráficas**.

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
├── assets/
│   ├── css/              base · layout · components · math
│   └── js/
│       ├── curriculum.js ← EL TEMARIO (el único sitio donde se decide qué hay)
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
- Tema claro y oscuro, y diseño adaptado a móvil.
- `tests.html` comprueba el núcleo (98 verificaciones) y **audita los 312
  ejercicios**: genera cada uno 40 veces y verifica que la solución declarada
  pasa su propio corrector, que nada lanza excepciones, que no queda ninguna
  fórmula con comandos LaTeX inexistentes y que todos los temas del temario
  se construyen sin errores.

---

*Los apuntes históricos de cada tema no son adorno: entender de dónde salió cada
idea, y qué problema vino a resolver, es la mitad de entenderla.*
