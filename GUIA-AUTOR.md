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
| `p.formula(tex, 'etiqueta', 'lectura')` | Fórmula centrada en su caja |
| `p.formulas([tex, tex], 'etiqueta', 'lectura')` | Varias fórmulas en una caja |
| `p.util(html, 'título')` | **Cuadro UTILIDAD**: para qué sirve esto fuera del aula |
| `p.table(cabeceras, filas, {num:[0,2]})` | Tabla (`num` alinea esas columnas a la derecha) |
| `p.note(html, tipo, 'título')` | Aviso. `tipo`: `null`, `'warn'`, `'ok'` |
| `p.hist(html)` | Apunte histórico |
| `p.keys([...])` | Caja de ideas clave (va al final del tema) |
| `p.demo({...})` | **Ejemplo interactivo** (azul) |
| `p.exercise({...})` | **Ejercicio práctico** (verde) |
| `p.raw(elemento)` | Insertar un nodo DOM a pelo |

Dentro de cualquier texto, `$...$` se renderiza como matemáticas.

### El tercer argumento: «cómo se lee»

Si a `p.formula` o `p.formulas` les pasas un tercer argumento, la caja gana un
botón **?** en la esquina que, al pasar el ratón o al pulsarlo, despliega la
lectura en voz alta de la fórmula. Se presenta como una nota adhesiva amarilla,
para que se distinga de un vistazo del contenido del tema. Es para el alumno que
reconoce el símbolo pero no sabría pronunciarlo.

Ponlo **siempre que aparezca notación nueva**. Escribe la frase entera y
corrida, como la dirías tú, y añade después el desglose símbolo a símbolo:

```js
p.formula('A = \\{x \\in \\mathbb{N} : x < 5\\}', 'por comprensión',
  'Se dice: <em>«A es el conjunto de los equis que pertenecen a los naturales, ' +
  'tales que equis es menor que 5»</em>.<br><br>' +
  'Símbolo a símbolo: $\\{$ «el conjunto de los» · $\\in$ «pertenece a».');
```

### El cuadro UTILIDAD

`p.util(html)` produce una caja resaltada, con color propio, que cuenta **para
qué sirve de verdad** el concepto que se acaba de explicar. Colócala al final de
la sección, no al principio: primero se entiende la idea, después se ve para qué
vale. Busca aplicaciones concretas y comprobables —el dígito de control del DNI,
el folio A4, la sonda que se perdió por confundir unidades—, no frases genéricas
del tipo «esto se usa mucho en ingeniería».

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

> **Si corriges respuestas escritas con palabras, usa `U.eligeOpcion`.**
> Buscar una palabra suelta con una expresión regular falla de dos maneras, y
> las dos se han visto en este proyecto: rechaza respuestas correctas con tilde
> («se amplía» no contiene «ampli») y acepta respuestas negadas («no esencial»
> contiene «esencial»). El ayudante quita tildes, entiende que «no», «ni»,
> «sin» y «tampoco» niegan lo que viene detrás, y cuando solo hay dos opciones
> deduce que negar una es elegir la otra:
>
> ```js
> var q = U.eligeOpcion(v.raw.q, {
>   esencial:     /esencial|critic|vital/,
>   instrumental: /instrument|medio|palanca/
> });
> if (!q) return { ok: false, msg: 'Responde «esencial» o «instrumental».' };
> return { ok: q === (d.esencial ? 'esencial' : 'instrumental') };
> ```
>
> Las expresiones van **sin tildes y en minúsculas**, porque el texto llega ya
> normalizado.
- `w` del campo: `'tiny'`, `'wide'` o nada.

> **Declara siempre `sol`, incluso si usas `check`.** No estorba (gana `check`)
> y es lo que permite que `tests.html` audite el ejercicio automáticamente.

### Temas de color

El curso trae tres: **claro** (el de por defecto), **oscuro** y **monokai**
(contraste suave), con un botón por tema al pie del índice. Añadir un cuarto es
añadir una entrada a `TEMAS` en `app.js` y su bloque de tokens en `base.css`:
los botones se construyen solos a partir de esa lista. No
escribas nunca un color literal en un tema: usa las variables CSS (`var(--c1)`,
`var(--ink)`, `var(--bad)`, `var(--use)`…) o los nombres que entiende `Plot2D` (`0`-`5`,
`'ink'`, `'axis'`, `'ok'`, `'bad'`, `'bg'`). Así el dibujo se adapta solo, y las
gráficas se repintan al cambiar de tema sin que tengas que hacer nada.

Un aviso sobre el acento: en el tema claro `--accent` es **oscuro** y en los
otros dos es **claro**. Si pones algo con fondo `var(--accent)`, el texto de
encima tiene que ser `var(--on-accent)`, que cambia con el tema; poner blanco
a secas deja el texto ilegible en oscuro y en monokai.

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

## El visor de shaders (`W.shader`)

Solo lo usa el bloque 13, pero está en el núcleo y sirve para cualquier tema que
quiera enseñar algo con una imagen calculada por fórmula.

```js
W.shader(host, {
  id: 'gfx-xxx-1',     // para recordar las ediciones del alumno entre visitas
  alto: 320,           // alto del lienzo
  aria: 'Descripción de lo que se ve, para quien no lo ve.',
  mandos: [            // cada uno se convierte en un `uniform float`
    { n: 'k', label: 'suavidad', min: 0, max: 1, step: 0.01, value: 0.5, dec: 2 }
  ],
  codigo: '...',       // el shader, con la firma de Shadertoy
  nota: 'Qué mirar.'   // aparece debajo, en el cuadro de pista
});
```

Cuatro decisiones que conviene conocer antes de escribir uno:

- **Solo fragment shaders.** La firma es la de Shadertoy —`void mainImage(out
  vec4 color, in vec2 fragCoord)`— y el preámbulo declara `iResolution`,
  `iTime`, `iMouse`, `iFrame`, `PI` y `TAU`. Lo que se escriba aquí se pega en
  Shadertoy y funciona, y al revés.
- **GLSL ES 1.00** (WebGL 1). Los bucles necesitan un límite constante —
  `for (int i = 0; i < 64; i++)`, con `break` dentro si hace falta parar antes—
  y no existe `round`: se usa `floor(x + 0.5)`. Las derivadas (`dFdx`, `dFdy`,
  `fwidth`) sí están: el preámbulo pide la extensión.
- **El contexto se crea al hacerse visible** y se para al salir de pantalla. Los
  navegadores permiten unos dieciséis contextos WebGL vivos, y un bloque de
  veinte temas los agotaría.
- **Los errores se traducen al editor**: el número de línea que da el
  compilador se corrige restando el preámbulo, así que apunta a la línea que el
  alumno ve.

### Corregir un ejercicio de código

`W.glslIguales(respuesta, referencia, { tam, tol, valores, t })` compila los dos
shaders, los pinta fuera de pantalla y compara los píxeles. Devuelve
`{ ok, distancia }`, o `motivo: 'la respuesta no compila'`.

Esto es lo que permite aceptar **cualquier solución equivalente**: da igual que
el alumno escriba `vec3(uv.x)` o `vec3(uv.x, uv.x, uv.x)`, porque se compara lo
que sale, no el texto. El patrón es siempre el mismo: una función `env(x)` que
mete la expresión del alumno en un shader completo, y la misma función con la
respuesta de referencia.

```js
check: function (v, d) {
  var texto = String(v.raw.d || '').trim().replace(/;\s*$/, '');
  if (!texto) return { ok: false, msg: 'Escribe la expresión.' };
  function env(x) { return '... ' + x + ' ...'; }
  var r = W.glslIguales(env(texto), env(d.ref), { tam: 48, tol: 8 });
  if (r.motivo === 'la respuesta no compila') return { ok: false, msg: '...' };
  if (!r.ok) return { ok: false, msg: 'Compila, pero no es lo pedido: ...' };
  return { ok: true };
}
```

Una tolerancia de 6 a 12 va bien: por debajo, dos formas legítimas de escribir
lo mismo pueden diferir por redondeo; por encima, entra cualquier cosa.

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
4. Si el tema lleva shaders, la auditoría también los compila y comprueba que
   ninguno pinta una imagen lisa. Un shader que compila y sale de un solo color
   es un fallo mudo que no se ve de ninguna otra manera.
5. Ningún enlace `[[tema|texto]]` apunta a un tema que no existe.
