# Guía del autor

Todo lo que hace falta para añadir o modificar un tema de Matebase.

---

## Añadir un tema en dos pasos

**1. Crear `topics/<id>.js`**

```js
Course.topic('mi-id', function (p) {
  p.section('Idea principal');
  p.text('Texto con matemáticas en línea: $x^2+1$.');
  p.formula('\\int_0^1 x^2\\,dx = \\frac{1}{3}');
  p.demo({ title: 'Míralo', build: function (host, d) { /* ... */ } });
  p.exercise({ /* gen / ask / sol / steps */ });
  p.keys(['idea 1', 'idea 2']);
});
```

**2. Añadir una entrada en `assets/js/curriculum.js`**, dentro del bloque que le toque:

```js
{ id: 'mi-id', t: 'Título del tema', r: 'Resumen de una línea.',
  o: ['objetivo 1', 'objetivo 2'] }
```

Recarga y ya está. El archivo se carga solo la primera vez que se abre el tema.
Un tema que figura en el temario pero no tiene archivo **no rompe nada**: muestra
su ficha con los objetivos y la etiqueta «en preparación».

Para **intercalar** un tema entre otros dos, basta con insertar el objeto en la
posición que corresponda del array. El orden del array es el orden del curso.

---

## El constructor de páginas (`p`)

| Llamada | Qué hace |
|---|---|
| `p.section('Título')` | Encabezado de sección con la barra de color |
| `p.sub('Título')` | Subapartado |
| `p.text('...')` | Párrafos. Admite HTML y `$latex$`. Dos saltos de línea = párrafo nuevo |
| `p.list([...], ordenada)` | Lista con viñetas o numerada |
| `p.formula(tex, 'etiqueta')` | Fórmula centrada en su caja |
| `p.formulas([tex, tex], 'etiqueta')` | Varias fórmulas en una caja |
| `p.table(cabeceras, filas, {num:[0,2]})` | Tabla (`num` alinea esas columnas a la derecha) |
| `p.note(html, tipo, 'título')` | Aviso. `tipo`: `null`, `'warn'`, `'ok'` |
| `p.hist(html)` | Apunte histórico |
| `p.keys([...])` | Caja de ideas clave (va al final del tema) |
| `p.demo({...})` | **Ejemplo interactivo** (azul) |
| `p.exercise({...})` | **Ejercicio práctico** (verde) |
| `p.raw(elemento)` | Insertar un nodo DOM a pelo |

Dentro de cualquier texto, `$...$` se renderiza como matemáticas.

---

## Las dos categorías de material interactivo

### Ejemplo interactivo — `p.demo`

Escenario **fijo** para entender un concepto. No se corrige ni puntúa.

```js
p.demo({
  title: 'Título',
  intro: 'Qué tiene que mirar el alumno.',
  build: function (host, d) {
    var out = W.readout(host, '');
    var plot = W.plot(host, {
      xmin: -6, xmax: 6, ymin: -4, ymax: 4, height: 300,
      draw: function (g) { g.fn(Math.sin, { color: 0 }); }
    });
    W.slider(W.row(host), {
      label: 'parámetro a', min: 0, max: 5, step: 0.1, value: 1,
      on: function (v) { a = v; plot.render(); }
    });
  }
});
```

### Ejercicio práctico — `p.exercise`

Enunciado **generado proceduralmente**. El botón «Otro ejercicio» vuelve a
llamar a `gen` con una semilla nueva.

```js
p.exercise({
  title: 'Resuelve la ecuación',
  level: 'basico' | 'medio' | 'avanzado',

  gen:    function (r) { ... return datos; },   // r es el RNG; devolver null descarta y reintenta
  ask:    function (d) { return 'enunciado con $latex$'; },
  show:   function (d, host) { ... },           // opcional: dibujo dentro del ejercicio
  fields: [{ name: 'x', label: 'x =', w: 'tiny' }],   // o function(d){...}
  sol:    function (d) { return { x: 3 }; },    // corrección automática
  check:  function (v, d) { ... },              // opcional: corrección a medida
  tol:    1e-6,
  hint:   function (d) { return 'pista'; },
  steps:  function (d) { return ['paso 1', 'paso 2']; },
  answer: function (d) { return 'x = 3'; }
});
```

- `v[nombre]` es el valor **numérico** que ha tecleado el alumno (ya evaluado:
  acepta `3/4`, `2^10`, `pi/6`, `sqrt(2)`, `-2,5`, `5!`…).
- `v.raw[nombre]` es la cadena tal cual, para respuestas de texto.
- `check` devuelve `true`/`false` o `{ ok, msg, fields }`.
- `w` del campo: `'tiny'`, `'wide'` o nada.

> **Declara siempre `sol`, incluso si usas `check`.** No estorba (gana `check`)
> y es lo que permite que `tests.html` audite el ejercicio automáticamente.

### Temas de color

El curso trae tres: **claro**, **oscuro** y **monokai** (contraste suave). No
escribas nunca un color literal en un tema: usa las variables CSS (`var(--c1)`,
`var(--ink)`, `var(--bad)`…) o los nombres que entiende `Plot2D` (`0`-`5`,
`'ink'`, `'axis'`, `'ok'`, `'bad'`, `'bg'`). Así el dibujo se adapta solo, y las
gráficas se repintan al cambiar de tema sin que tengas que hacer nada.

---

## El motor gráfico (`W`)

Todo lo que se dibuja sale de `W.plot`. Los demás son envoltorios suyos.

```js
var plot = W.plot(host, {
  xmin, xmax, ymin, ymax,   // ventana
  height: 320,              // alto en píxeles
  equal: true,              // misma escala en los dos ejes (geometría)
  grid: false, axes: false, // quitar rejilla o ejes
  xlabel: 'x', ylabel: 'y', // null para ocultar
  xstep, ystep,             // separación de las marcas
  xtickLabel: function (i) { return '...'; },
  handles: { A: { x: 1, y: 2, label: 'A', color: 0, constrain: fn } },
  draw: function (g) { ... },
  onDrag: function (h, g) { ... },
  onClick: function (x, y, g) { ... }
});
plot.render();               // repintar
plot.view(x0, x1, y0, y1);   // cambiar la ventana
plot.h('A');                 // punto arrastrable por su nombre
```

**Primitivas de dibujo** (todas en coordenadas matemáticas):

`g.fn(f, o)` · `g.param(fx, fy, t0, t1, o)` · `g.path(pts, o)` · `g.poly(pts, o)` ·
`g.seg(x1,y1,x2,y2,o)` · `g.hline(y,o)` · `g.vline(x,o)` · `g.vec(x1,y1,x2,y2,o)` ·
`g.point(x,y,o)` · `g.circle(cx,cy,r,o)` · `g.arc(cx,cy,r,a0,a1,o)` ·
`g.rightAngle(vx,vy,a1,a2,tam,o)` · `g.area(f,a,b,o)` · `g.rect(x,y,w,h,o)` ·
`g.text(x,y,txt,o)` · `g.bars(datos,o)`

Opciones comunes: `color` (número 0-5 de la paleta, o `'ink'`/`'axis'`/`'ok'`/`'bad'`),
`w` (grosor), `dash`, `alpha`, `fill`, `fillAlpha`, `label`.

**Envoltorios:**

- `W.board(host, o)` — lienzo con la misma escala en los dos ejes (geometría).
  La ventana que pidas (`xmin…ymax`) **cabe entera, garantizado**: el motor elige
  la escala que la hace caber y ensancha el eje que sobre. Encuádrala con holgura
  y olvídate de la proporción del contenedor.
- `W.numberLine(host, {min, max, step, ...})` — recta real.
- `W.barChart(host, {labels, values, ...})` — diagrama de barras / histograma.

**Controles:**

- `W.row(host)` — fila contenedora para los deslizadores.
- `W.slider(fila, {label, min, max, step, value, dec, format, on})` — si el `step`
  **no es entero**, el deslizador mide una magnitud continua: se afina solo hasta
  unas 400 posiciones y muestra al menos dos decimales. Un `step` entero se
  respeta tal cual, porque ahí se está contando (lados, términos, cifras).
- `W.chips(host, items, {value, toggle, on})`
- `W.buttons(host, [{t, cls, on}])`
- `W.readout(host, html)` → objeto con `.set(html)`
- `W.legend(host, [{c, t}])` · `W.hint(host, texto)`

---

## Matemáticas de apoyo (`ML`) y utilidades (`U`)

`ML.gcd` `ML.lcm` `ML.isPrime` `ML.factorize` `ML.factorTex` `ML.divisors`
`ML.primesUpTo` `ML.factorial` `ML.comb` `ML.perm` · `ML.F(n,d)` (fracciones
exactas: `.add .sub .mul .div .pow .val .tex .toString`) · `ML.polyTex`
`ML.polyEval` `ML.polyMul` `ML.polyAdd` `ML.ruffini` `ML.intRoots` `ML.quadratic`
`ML.termTex` `ML.sqrtTex` `ML.simplifySqrt` · `ML.det2` `ML.det3` `ML.matTex`
`ML.solve2` · `ML.mean` `ML.median` `ML.mode` `ML.variance` `ML.sd` `ML.quantile`
`ML.corr` `ML.normalCdf` · `ML.evalExpr` `ML.tryEval` `ML.equivalent`

`U.rng(semilla)` → `.int(a,b) .nz(a,b) .pm(a,b) .sign() .real(a,b,dec) .pick(arr)
.bool(p) .shuffle(arr) .sample(arr,n)` · `U.fmt(x,dec)` (coma decimal) ·
`U.fmts` (con signo) · `U.miles(n)` · `U.round` `U.clamp` `U.sum` `U.plural` ·
`U.el` `U.add` `U.clear` `U.$` `U.$$`

---

## El renderizador de fórmulas (MathX)

Subconjunto de LaTeX implementado a mano (`assets/js/core/mathx.js`), porque el
curso tiene que funcionar sin internet.

Soportado: `\frac` `\dfrac` `\sqrt[n]{}` `^` `_` `\left...\right` (con paréntesis
que crecen solos) `\sum` `\prod` `\int` `\lim` `\begin{pmatrix|bmatrix|vmatrix|
cases|aligned|array}` `\vec` `\overline` `\hat` `\text` `\mathbb` `\binom`
`\pmod`, todo el alfabeto griego y los símbolos habituales de relación y operación.

Convenciones del curso:

- Decimales con **coma**: `0{,}75` (las llaves evitan que se lea como separador).
- Seno en español: `\operatorname{sen}`.
- Si escribes un comando que no existe, sale en rojo en la página **y**
  `tests.html` lo detecta.

---

## Antes de dar un tema por bueno

Abre **`tests.html`**. Comprueba:

1. Las comprobaciones del núcleo siguen en verde.
2. Tu tema aparece con un ✓ en la lista de temas.
3. La auditoría no se queja: genera cada ejercicio 40 veces y verifica que la
   solución declarada pasa su propio corrector, que nada lanza excepciones, que
   no hay fórmulas mal escritas, que ninguna gráfica 1:1 recorta su encuadre y
   que ninguna fórmula se sale de su caja.
