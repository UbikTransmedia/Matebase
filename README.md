# Matebase

Curso interactivo de matemáticas, desde contar hasta los sistemas dinámicos.

**Se abre haciendo doble clic en `index.html`.** No hace falta servidor, ni
internet, ni instalar nada. Puedes copiar la carpeta en un lápiz de memoria y
abrirla en cualquier ordenador con un navegador.

---

## Qué hay dentro

A la izquierda, un índice desplegable con los siete bloques del curso. A la
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
| 1. Aritmética y fundamentos | 9 | de contar a la recta real |
| 2. Álgebra | 12 | del lenguaje algebraico a los complejos |
| 3. Geometría | 10 | de los ángulos a la geometría del espacio |
| 4. Trigonometría | 5 | del triángulo rectángulo a las ondas |
| 5. Funciones y análisis | 11 | del concepto de función a la integral definida |
| 6. Probabilidad y estadística | 8 | de la media a la inferencia |
| 7. Escalada avanzada | 10 | EDO, sistemas dinámicos, caos, cálculo vectorial, Fourier, topología, grafos… |

**65 temas** en total, en progresión estricta: ninguno usa una herramienta que no
se haya explicado antes.

El temario completo está en `assets/js/curriculum.js`. Los temas que todavía no
se han escrito aparecen en el índice marcados como «en preparación» y muestran
sus objetivos: el recorrido está reservado de principio a fin.

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
- `tests.html` comprueba el núcleo (98 verificaciones) y **audita todos los
  ejercicios**: los genera 40 veces cada uno y comprueba que la solución
  declarada pasa su propio corrector.

---

*Los apuntes históricos de cada tema no son adorno: entender de dónde salió cada
idea, y qué problema vino a resolver, es la mitad de entenderla.*
