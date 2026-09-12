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
  o: ['objetivo 1', 'objetivo 2'],
  req: ['otro-tema'],          // temas que da por sabidos: tienen que ir ANTES
  curso: '2B',                 // 'ESO' | '1B' | '2B' | 'AMP' (si no, el del bloque)
  itin: ['MII', 'MCS'] }       // solo los de 2.º: Matemáticas II, MACS II o las dos
```

Los requisitos no son decoración: generan el cuadro «Antes de empezar» del tema,
la última columna del mapa del temario, y `tests.html` comprueba que cada uno va
antes en el temario. `itin` decide en qué itinerario, simulacro y formulario entra
el tema.

Recarga y ya está. El archivo se carga solo la primera vez que se abre el tema.
Un tema que figura en el temario pero no tiene archivo **no rompe nada**: muestra
su ficha con los objetivos y la etiqueta «en preparación».

Para **intercalar** un tema entre otros dos, basta con insertar el objeto en la
posición que corresponda del array. El orden del array es el orden del curso.

> **No cites bloques por su número.** Escribir «como viste en el bloque 7» deja la
> referencia rota en cuanto el temario se reordena, y ha pasado. Nombra el bloque
> («en el bloque de álgebra lineal») o, mejor, enlaza el tema concreto con
> `[[av-espacios|álgebra lineal]]`: el enlace lleva al sitio y `tests.html`
> comprueba que existe.

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
| `p.puente(html, 'título')` | **De dónde venimos**: organizador previo, al principio del tema |
| `p.ejemplo({ title, enunciado, pasos, cierre })` | **Ejemplo resuelto** con pasos que se destapan uno a uno |
| `p.comprueba(pregunta, opciones, { title })` | **Comprobación rápida**: una elección con explicación de cada opción |
| `p.trampas([{ e, por }], 'título')` | **Trampas habituales**: errores frecuentes con su contraejemplo |
| `p.demo({...})` | **Ejemplo interactivo** (azul); admite `predice` |
| `p.exercise({...})` | **Ejercicio práctico** (verde) |
| `p.problem({...})` | **Problema por apartados**, como los de examen |
| `p.mapa()` | Mapa del temario de 2.º con el estado del alumno (bloque de repaso) |
| `p.simulacro({ titulo, itin, partes })` | Examen con preguntas sacadas de los temas (bloque de repaso) |
| `p.formulario()` | Fórmulas e ideas clave del temario, para imprimir (bloque de repaso) |
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

## Los componentes pedagógicos

Además de explicar, cada tema tiene que **enganchar con lo anterior, enseñar a
hacer, comprobar y avisar**. Para eso hay cinco piezas, cada una con evidencia
detrás, y un orden que conviene respetar:

> puente → idea con un caso concreto → fórmula y su lectura → demo (con
> predicción) → ejemplo resuelto → comprobación → trampas → Practica (básico →
> medio → avanzado) → ideas clave.

No todos los temas necesitan todo en cada sección, pero **todos los temas de
contenido llevan al menos un puente, un ejemplo resuelto, una comprobación, una
predicción por demo y una lista de trampas** (el bloque de repaso tiene su propia
estructura: mapa, simulacros, formulario y catálogo de errores). La línea de cada
tema en `tests.html` cuenta ejemplos, resueltos y comprobaciones: si alguno está a
cero, falta algo.

### El puente — `p.puente`

```js
p.puente('El tema anterior dejó el bucle escrito como una sucesión. Este lo ' +
  'escribe como un dibujo de cajas, y para leerlo hace falta la ' +
  '[[fn-derivadas|derivada]] de un cociente.');
```

Va **el primero**, antes de cualquier texto: dos o tres frases que dicen de dónde
venimos y qué herramienta del curso se va a reutilizar, con enlaces
`[[tema|texto]]` a los temas que se retoman. Es el organizador previo de Ausubel:
el alumno sabe dónde colgar lo que viene. El título por defecto es «De dónde
venimos»; en el primer tema de un bloque se pasa `'Por dónde empezamos'` como
segundo argumento. Nunca se escribe «el bloque 5» ni «el tema 10» en la prosa:
se enlaza al tema por su id.

### El ejemplo resuelto — `p.ejemplo`

```js
p.ejemplo({
  title: 'Tres ganancias, a mano',
  enunciado: 'Con $y_{n+1} = y_n + K(21 - y_n)$ y $y_0 = 12$, calcular dos pasos con $K = 0{,}5$.',
  pasos: [
    { t: 'Error $9$, corrección $4{,}5$: $y_1 = 16{,}5$.', antes: '¿Cuánto corrige con $K = 0{,}5$?' },
    { t: 'Error $4{,}5$: $y_2 = 18{,}75$.' },
    'Cada paso recorre la mitad de lo que falta: se acerca sin pasarse.'
  ],
  cierre: 'Con $K = 1{,}5$ la misma cuenta oscila. Se ve en la sección siguiente.'
});
```

Los pasos se destapan uno a uno. Si un paso lleva `antes`, esa pregunta se enseña
**antes** de destaparlo, para que el alumno lo intente él: es el ejemplo resuelto
con autoexplicación (Sweller, Renkl). Un paso puede ser una cadena suelta. Hacen
falta **al menos dos pasos**, con números de verdad, y el ejemplo va antes de
«Practica», porque es lo que enseña el procedimiento que los ejercicios piden.

### La comprobación rápida — `p.comprueba`

```js
p.comprueba('Un termostato tarda mucho en llegar a 21°. ¿Qué pasa si se duplica $K$?', [
  { t: 'Llega antes, y cuanto más se suba $K$, mejor', ok: false, por: 'Pasado un punto oscila, y más allá se descontrola.' },
  { t: 'Depende de dónde estaba $K$', ok: true, por: 'La ganancia tiene un punto dulce, no una dirección buena.' },
  { t: 'No cambia nada', ok: false, por: 'Con $K > 1$ la corrección supera al error y se pasa al otro lado.' }
]);
```

Una pregunta de elección justo después de la idea clave, con la explicación de
**cada** opción, también de las equivocadas: es el efecto del test con
retroalimentación elaborada (Roediger). Reglas que `tests.html` comprueba:
exactamente una opción con `ok: true`, al menos dos opciones, y todas con `por`.
Las opciones falsas tienen que ser errores plausibles, no rellenos.

### La predicción en las demos — `predice`

```js
p.demo({
  title: 'Un termostato con el mando de la ganancia',
  intro: 'Sube la ganancia poco a poco y observa el cambio de comportamiento.',
  predice: 'Con $K = 1$, ¿el primer paso se pasará, se quedará corto o llegará justo a 21?',
  build: function (host, d) { /* ... */ }
});
```

Un campo más en `p.demo`: una pregunta que el alumno se hace **antes** de tocar
los mandos, con una respuesta concreta que la demo confirma o desmiente. Es el
ciclo predecir-observar-explicar (White y Gunstone), y convierte una demo que se
mira en una demo que se usa. Ponla en todas las demos.

### Las trampas — `p.trampas`

```js
p.trampas([
  { e: 'Subir la ganancia para corregir más deprisa', por: 'Con $K = 2{,}5$ cada corrección supera al error que arregla: se descontrola.' },
  { e: 'Culpar al operario de una oscilación', por: 'Con retardo nadie decide mal y aun así oscila. Es la estructura, no el juicio.' }
]);
```

Va justo antes de «Practica»: tres o cuatro errores que de verdad cometen los
alumnos, cada uno con **un contraejemplo concreto** en `por`, no con una regla
abstracta. Es el contraste de casos, y es también la lista que el alumno repasa
antes de un examen. El título por defecto es «Trampas habituales».

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
  tol:    1e-6,                                 // error admitido: tol · (1 + |solución|)
  dec:    4,                                    // o bien: el enunciado pide 4 decimales
  rel:    1e-3,                                 // o bien: error relativo (cotas, periodos…)
  hint:   function (d) { return 'pista'; },
  steps:  function (d) { return ['paso 1', 'paso 2']; },
  answer: function (d) { return 'x = 3'; }
});
```

- `v[nombre]` es el valor **numérico** que ha tecleado el alumno (ya evaluado:
  acepta `3/4`, `2^10`, `pi/6`, `sqrt(2)`, `-2,5`, `5!`…).
- `v.raw[nombre]` es la cadena tal cual, para respuestas de texto.
- `check` devuelve `true`/`false` o `{ ok, msg, fields }`.
- **Tolerancia.** Por defecto se acepta un error de `tol · (1 + |solución|)`,
  con `tol = 1e-6`: vale para respuestas exactas (enteros, fracciones). Si el
  enunciado pide «N decimales», declara `dec: N` y se aceptará cualquier
  respuesta a medio decimal de la exacta, sea cual sea su tamaño (con `tol`
  una solución cercana a cero rechazaría la respuesta bien redondeada, y una
  grande aceptaría de más). Si la respuesta puede ser muy pequeña o muy grande
  (una cota de error, un periodo en segundos), declara `rel: 1e-3` y se mide
  el error relativo. Tanto `dec` como `rel` admiten un objeto por campo:
  `dec: { T: 6, w: 4 }`. Si junto a `dec` o `rel` se deja también una `tol`,
  vale cualquiera de los dos criterios: así un cálculo encadenado (un ángulo
  por arco coseno, una exponencial que se redondea por el camino) no se
  rechaza por una milésima. La auditoría de `tests.html` avisa si un
  enunciado pide decimales y el ejercicio no declara `dec` ni `rel`.

> **Si la respuesta es una de pocas palabras, no la pidas como texto: usa un
> grupo `opts`.** Dentro/fuera, positiva/negativa, sí/no, A/B/C/D: se corrige
> sin ambigüedad, se audita, y el alumno no tiene que adivinar el vocabulario
> que espera el corrector. `U.eligeOpcion` queda para respuestas realmente
> abiertas, en las que se describe algo con una frase.

> **Si aun así corriges respuestas escritas con palabras, usa `U.eligeOpcion`.**
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

### Respuestas de elección, errores típicos y pistas graduadas

```js
fields: [
  { name: 'x', label: 'x =', w: 'tiny' },
  { name: 't', label: 'El sistema es', opts: [          // grupo de opciones
      { t: 'compatible determinado', v: 'scd' },
      { t: 'incompatible', v: 'si' } ] }
],
sol: function (d) { return { x: 3, t: 'scd' }; },     // la opción, por su valor v

errores: [                                            // se miran si la respuesta está mal
  { si: function (v, d) { return Math.abs(v.x - d.sinRaiz) < 1e-6; },
    msg: 'Falta dividir por el módulo del vector normal.' }
],

hint: function (d) { return ['primera pista, que orienta', 'segunda, que casi resuelve']; }
```

- En `errores`, `si(v, d)` recibe lo mismo que `check`. Cuando devuelve `true`, el
  corrector enseña `msg` en lugar del «no es correcto» genérico. Pon nombre a los
  errores que de verdad cometen los alumnos.
- **Un error típico nunca debe coincidir con la respuesta correcta.** Si para
  ciertos datos el cálculo equivocado da lo mismo que el bueno —$k\\cdot d$ y
  $k^3 d$ cuando $k = 1$—, protege la regla con esa condición. `tests.html` lo
  comprueba generando cada ejercicio 40 veces, y ya ha cazado unos cuantos.
- Si `hint` devuelve un array, el botón de pista las va dando una a una.

### Problemas por apartados — `p.problem`

```js
p.problem({
  title: 'Contraste para una proporción',
  level: 'avanzado',
  gen: function (r) { ... },                 // unos datos para todo el problema
  intro: function (d) { return 'enunciado común'; },
  partes: [
    { ask, fields, sol, tol, errores, hint, steps, answer },   // igual que un ejercicio
    { ... }
  ]
});
```

Cada apartado se corrige por separado y se puede ver su solución sin destapar las
demás. En los simulacros se prefieren los problemas por apartados, porque son los
que más se parecen al examen.

### Enlaces y modo examen

Cada ejercicio tiene un botón para copiar un enlace de la forma
`#/tema?e=2&s=123456`: abre el tema en ese ejercicio con esa semilla, es decir,
con los mismos números. En los simulacros los ejercicios se montan en **modo
examen**: sin pistas ni soluciones hasta entregar, con la nota de cada uno y la
solución paso a paso al corregir.

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

**El visor 3D — `W.space3d`:**

```js
var v = W.space3d(host, {
  rango: 5,                 // se dibuja el cubo [-5, 5]³
  height: 340,
  aria: 'Qué se ve, para quien no lo ve',
  rejilla: true, ejes: true,
  draw: function (v) {      // v es el propio visor
    v.plano([1, 1, 1], -3, { color: 0 });          // x + y + z - 3 = 0, recortado al cubo
    v.linea([0, 0, 0], [1, 2, 0], { color: 1 });   // punto y vector director
    v.punto([1, 1, 1], { label: 'P' });
    v.vec([0, 0, 0], [2, 1, 3], { color: 2, label: 'u' });
    v.seg(a, b, o) · v.poli(pts, o) · v.camino(pts, o) · v.texto(p, 'txt', o)
  }
});
v.render();
```

El eje z apunta hacia arriba y el sistema es dextrógiro, como en los libros. El
alumno lo gira arrastrando o con las flechas, acerca con más y menos, y vuelve a la
vista inicial con R.

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

Lo usa sobre todo el bloque de programación gráfica, pero está en el núcleo y sirve
para cualquier tema que quiera enseñar algo con una imagen calculada por fórmula.

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

### Shaders con memoria

Con `buffer: true`, el shader lee en `iChannel0` lo que pintó en el fotograma
anterior, y lo que devuelve es el estado nuevo. Es lo que convierte una fórmula en
una simulación: autómatas celulares, difusión, reacción-difusión.

```js
W.shader(host, {
  id: 'gfx-vida', buffer: true,
  escala: 0.25,             // resolución del estado respecto a la del lienzo
  pasos: 4,                 // pasos de simulación por fotograma
  vista: 'vec3 vista(vec4 s) { return vec3(s.r); }',   // cómo se pinta el estado
  codigo: '... texture2D(iChannel0, fragCoord / iResolution.xy) ...'
});
```

- En la pasada de simulación, `iResolution` es el tamaño del estado, no el del lienzo.
- El estado guarda los **cuatro canales**, el alfa incluido: en esa pasada el color
  no va a la pantalla, así que un fluido puede llevar velocidad en `rg`, densidad
  en `b` y tinta en `a`. La función `vista` recibe los cuatro.
- **Siembra siempre en el primer fotograma** con `step(iFrame, 0.5)`. El estado
  empieza a cero y, sin siembra, la auditoría lo detecta como imagen lisa.
- «Volver al original» reinicia el contador de fotogramas y vuelve a sembrar.

### Shaders con imagen

Con `imagen: true`, el visor pone en `iChannel1` una foto que pinta el propio
curso —un paisaje de 800 × 400 con un cartel de letras, colores y grises— y
añade el botón **Usar la cámara**, que la cambia por la imagen de la cámara del
alumno, como en un espejo.

```js
W.shader(host, {
  id: 'gfx-filtros-1', imagen: true,
  codigo: '... texture2D(iChannel1, uv) ... iChannelResolution[1].xy ...'
});
```

- `iChannelResolution[1].xy` es el tamaño en píxeles de la imagen: hace falta
  para no deformarla (escalarla hasta cubrir el lienzo) y para leer a un vecino,
  que está a `1.0 / iChannelResolution[1].xy` en coordenadas de 0 a 1.
- La cámara solo se pide al pulsar el botón, se apaga en cuanto el visor sale de
  pantalla y su imagen no sale del ordenador.
- **El contexto auxiliar pone siempre la foto en el canal 1**: la auditoría ve
  los filtros con imagen y `W.glslIguales` corrige ejercicios de filtros
  comparando lo que cada respuesta hace con la foto. Se puede combinar con
  `buffer: true`, y entonces la simulación tiene la foto a mano.

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

### La referencia GLSL de la columna derecha

Junto al botón **Glosario** está el botón **GLSL**. Los dos abren la misma
columna: cada uno muestra su documento, pulsar el otro cambia de documento sin
cerrarla y pulsar otra vez el que ya se ve la cierra. La referencia vive en
`assets/js/glsl.js`, separada del glosario, y cada entrada es así:

```js
{ t: 'smoothstep', g: 'comunes',                       // nombre y grupo
  s: 'genType smoothstep(genType e0, genType e1, genType x)',   // firma
  d: 'Un escalón suave: 0 antes de <code>e0</code>…',   // explicación (HTML y $latex$)
  e: 'float relleno = 1.0 - smoothstep(0.0, 0.01, d);', // ejemplo
  v: 'escalon suave antialiasing',                     // variantes para buscar
  i: 'gfx-distancia' }                                 // tema donde se explica
```

- Solo se documenta lo que **compila en WebGL 1**. Lo que es de GLSL ES 3.00
  (`round`, `texture`, `%`, arrays con inicializador…) va en el grupo «Lo que no
  hay en WebGL 1», diciendo cómo se sustituye.
- `tests.html` **compila cada ejemplo**. Por defecto lo mete dentro de
  `mainImage`, con unas cuantas variables ya declaradas (`p`, `uv`, `col`, `d`,
  `n`, `rd`…); con `x: 'global'` va fuera, con `x: 'solo'` es un shader entero y
  con `x: 'no'` no se compila. Las recetas del curso (`hash`, `ruido`, `fbm`…)
  se compilan juntas y en orden, porque unas usan a otras.
- Cada palabra que el editor colorea como tipo, función o uniform tiene que
  aparecer en el título de alguna entrada: si se añade un uniform al preámbulo
  del visor, la prueba pide su entrada.

---

## La caja de herramientas de criptografía (`CR`)

El bloque de criptografía se apoya en `assets/js/core/cripto.js`, igual que el
gráfico se apoya en `shader.js`. Expone `window.CR` con criptografía **de
verdad**, para que las demos ejecuten lo que explican, no una imitación:

- **Texto y clásicos**: `CR.limpia` `CR.cesar` `CR.afin` `CR.vigenere`
  `CR.columnas` `CR.hill`, `CR.frecuencias` `CR.ic` `CR.chi2` `CR.kasiski`.
- **Enteros**: `CR.egcd` `CR.inv` `CR.potMod` (y `CR.potModTraza`) `CR.mulMod`
  (correcta hasta módulos de $2^{52}$), `CR.millerRabin` `CR.primoProbable`
  `CR.primoAleatorio` `CR.crt` `CR.orden`.
- **Bits y bytes**: `CR.bits` `CR.hex` `CR.bytes` `CR.texto` `CR.xor`
  `CR.hamming`, y para pintarlos `CR.bitsHtml` `CR.hexHtml`.
- **Primitivas reales**: `CR.sha256` `CR.hmac`, la S-box y `CR.aes.cifra`
  (con traza de cada paso), los modos `CR.ecb/cbc/ctr`, `CR.gf` (GF(2⁸)),
  `CR.enigma`, `CR.curva` (elípticas mod p), `CR.lagrange` (Shamir),
  `CR.paillier` (homomórfico), `CR.lfsr`, `CR.spn`, `CR.feistel`.
- **Controles**: `W.texto(host, {label, value, on, multilinea, corto})` para
  escribir mensajes y claves, y `W.mono(host)` (con `.set(html)` y `.texto(str)`)
  para paneles monoespaciados que respetan los saltos de línea.

`tests.html` comprueba `CR` contra vectores oficiales: SHA-256, HMAC (RFC 4231),
AES-128 (FIPS-197), GF(2⁸), Enigma I, curvas, Shamir y Paillier. El bloque usa
la **piel** `cr` (cobre), declarada con `piel: 'cr'` en `curriculum.js` y sus
tokens `--cr*` en `base.css`.

> **Cuidado con los `msg` de `errores`.** Se evalúan al construir la página, así
> que no pueden llevar `d`: `msg: 'texto fijo'`, y si necesitas el dato, va en
> `steps` o en un `check` (que sí reciben `d`). Es el mismo error que en cualquier
> tema, pero aquí, con tantas cadenas largas, es fácil colarlo.

---

## El banco de circuitos (`LOG` y `W.circuito`)

El bloque **Máquinas y lenguajes** se apoya en `assets/js/core/logica.js`, que
expone `window.LOG`. El alumno escribe una **netlist** —una puerta por línea— y
de ahí salen el diagrama, la tabla de verdad y un simulador.

```
s = xor(a, b);      // suma
c = and(a, b);      // acarreo
```

Se admite `nombre = puerta(a, b)`, `nombre = otroCable` y `nombre = 0` o `1`.
Puertas: `not and or xor nand nor xnor`; las binarias aceptan más de dos
entradas. **Entradas** son los nombres que se usan y nunca se definen;
**salidas**, los que se definen y nadie consume (y si todo se consume —un
biestable— son salidas todas).

**Por qué se simula por instantes y no en orden topológico.** Un orden
topológico resolvería cualquier circuito sin ciclos de un tirón, pero entonces
el biestable no tendría solución, y el biestable es lo que hace que el bloque
valga la pena. Aquí **todas las puertas calculan a la vez** a partir de los
valores del instante anterior, que es lo que hace un cable de verdad: tarda. Un
circuito sin ciclos se estabiliza en tantos instantes como capas tenga; uno con
ciclos puede estabilizarse —y entonces recuerda— o no estabilizarse nunca, y
entonces **oscila**, que se anuncia y no se cuelga.

| Función | Qué hace |
|---|---|
| `LOG.analiza(texto)` | `{nodos, orden, entradas, salidas, errores, puertas}`; los errores llevan `linea` y `msg` |
| `LOG.simula(c, entradas, {tope, inicial})` | `{estable, oscila, instantes, valores, historia}`. `inicial` da el estado previo, que es como se enseña que un biestable recuerda |
| `LOG.tabla(c, o)` | la tabla de verdad completa; una fila que oscile trae `sal: null` |
| `LOG.iguales(texto, esperada, o)` | compara **comportamiento**, no texto: acepta cualquier circuito equivalente. Devuelve `{ok, porQue, puertas}` |
| `LOG.esTrivial(tabla)` | si la tabla se resuelve con un cable pelado, su negación o una constante. El equivalente al «shader que pinta liso» |
| `LOG.pinta(texto)` | coloreado de la netlist con los mismos ocho papeles del editor de shaders |

**El widget.** `W.circuito(host, {id, texto, alto, aria, nota, tope, salidas,
memoria, pausa, inicial})`, con la misma forma que `W.shader`: `id` recuerda lo
que escribió el alumno, `aria` describe el dibujo y `nota` dice qué mirar. Debajo
del diagrama va **siempre** la tabla: nada existe solo como dibujo. Los
conmutadores de entrada muestran su estado en el texto (`a = 1`) además de en el
color.

`salidas` declara cuáles mirar. Hace falta cuando todos los cables se consumen
entre sí —un cerrojo, donde cada mitad alimenta a la otra—: allí la regla
automática no encuentra ninguna salida libre y las enseña todas, que es ruido.

Las tres siguientes solo tienen sentido en un circuito con bucles, y por defecto
están apagadas para no tocar lo que ya funciona:

| Opción | Para qué |
|---|---|
| `memoria: true` | el banco empieza cada simulación **donde acabó la anterior**, en vez de poner todos los cables a cero. Sin esto un cerrojo no puede recordar nada: al soltar la orden volvería a arrancar de cero y oscilaría, y el tema de la memoria enseñaría lo contrario de lo que dice. Añade un botón «⏻ Apagar y encender» que borra lo guardado, que es a la vez el modo de volver a ver la oscilación del arranque y la demostración de que esta memoria es **volátil** |
| `inicial: {q: 0, qn: 1}` | con qué estado arranca lo guardado. Un cerrojo recién encendido no viene de ningún sitio y oscila; si lo que se quiere enseñar es otra cosa, se le da un pasado |
| `pausa: true` | mover un conmutador **no** resuelve el circuito: cambia las entradas y deja los cables quietos, esperando a «Un instante». Es la única forma de ver viajar un cambio por dentro del bucle, porque si se estabiliza al soltar el conmutador ya no queda nada que recorrer |

En un circuito sin bucles ninguna hace falta: el estado de partida da igual
porque siempre converge al mismo sitio.

`W.circuito` devuelve el banco, y del banco solo hay una cosa pensada para
usarse desde fuera: `banco.pon(texto)`, que **cambia la netlist** y lo recalcula
todo. Es para las demos que generan el circuito solas —`maq-normal` lo hace a
partir de las filas que el alumno enciende— y a propósito **no guarda** lo que
pone: lo generado no es del alumno, y si se guardara, al volver al tema
aparecería un circuito que él no escribió. Un banco así va **sin `id`**, por lo
mismo.

Para corregir, `W.circuitoIguales` es `LOG.iguales`, y el número de puertas que
devuelve sirve para la puntuación por coste: «lo has resuelto con 9 puertas; se
puede con 5». Informa, no penaliza.

---

## La máquina de juguete (`MAQ` y `W.maquina`)

`assets/js/core/maquina.js` es la CPU donde aterriza todo el bloque: el
compilador del tramo B genera exactamente su ensamblador. **Dieciséis
instrucciones**, que es lo que cabe en cuatro bits, con mnemónicos en castellano
porque el alumno los va a leer letra a letra:

| Sin argumento | Con argumento |
|---|---|
| `PARA` `METE` `SACA` `SUMA` `RESTA` `MULT` `DIV` `MENOR` `VUELVE` `MUESTRA` | `NUM n` `CARGA c` `GUARDA c` `SALTA e` `SICERO e` `LLAMA e` `CARGAI p` `GUARDAI p` |

Más una palabra que **no es una instrucción**: `TABLA nombre tamaño` reserva ese
número de celdas seguidas y les pone nombre. No se ejecuta y no ocupa sitio en el
programa; solo pide memoria continua, que es lo único que distingue una lista de
veinte variables sueltas.

**`CARGAI` y `GUARDAI` leen y escriben en la celda cuya dirección está guardada en
otra celda**, y `NUM x` con un nombre en vez de un número pone en el acumulador
**la dirección** de `x`, no su contenido. Esas tres cosas juntas son lo que
permite calcular una dirección en vez de escribirla, y de ahí salen las listas,
los marcos de llamada de verdad y los programas que se escriben a sí mismos. Con
ellas el juego pasa de dieciséis instrucciones a dieciocho y el código de
operación ya no cabe en cuatro bits: hacen falta cinco. Se rompió esa cuenta
redonda a sabiendas.

Cuatro decisiones mandan sobre todo lo demás, y conviene conocerlas antes de
escribir un programa para una demo:

- **Celdas de 8 bits con signo**, en complemento a dos: de −128 a 127, y lo que
  se sale da la vuelta. No es una limitación que haya que disculpar, es
  `maq-bits` hecho carne. La máquina **avisa** de que ha desbordado, para que se
  vea en lugar de sospecharse. El factorial de 5 cabe justo; el de 6, no.
- **Programa y datos en la misma memoria.** Un programa son números en celdas, y
  la tabla de memoria los enseña todos iguales: en la celda 0 hay un `2` que
  resulta ser un `CARGA`. Las instrucciones ocupan una celda, o dos si llevan
  argumento.
- **Acumulador más pila.** Las operaciones sacan el operando **izquierdo** de la
  pila y toman el **derecho** del acumulador. Con eso, compilar un árbol es un
  recorrido en postorden y nada más: `izquierda, METE, derecha, operación`. El
  tramo B se apoya entero en esa frase.
- **Nada se cuelga.** Todo corre con un tope de pasos y cada final trae su
  explicación: bucle sin fin, división entre cero, pila vacía, pila llena.

| Función | Qué hace |
|---|---|
| `MAQ.ensambla(texto)` | dos pasadas: `{celdas, imagen, etiquetas, vars, fin, libre, errores, instrucciones}`; los errores llevan `linea` y `msg`. Las variables se colocan solas detrás del programa |
| `MAQ.nueva(asm, datos)` | estado inicial; `datos` es `{nombre: valor}` y es como se le dan entradas a un programa sin inventar una instrucción de leer |
| `MAQ.paso(m)` / `MAQ.corre(m, tope)` | un paso (buscar, decodificar, ejecutar) o hasta que pare |
| `MAQ.ejecuta(texto, datos, tope)` | atajo: `{errores, salida, a, mem, pasos, porQue, desbordo}` |
| `MAQ.iguales(texto, casos, o)` | compara **comportamiento**: corre el programa con cada `{datos, salida}` y devuelve `{ok, porQue, instrucciones, pasos}` |
| `MAQ.pinta(texto)` | coloreado del ensamblador con los mismos ocho papeles |
| `MAQ.EJEMPLOS` | la batería de programas de referencia (`suma`, `mayor`, `cuenta`, `fact`, `tabla`, `quine`, `doble`), que además son pruebas: si uno deja de dar lo que da, la CPU está rota |

> **El quine.** `MAQ.EJEMPLOS.quine` ocupa 26 celdas y escribe exactamente esas
> 26. El punto fijo se cierra porque el bucle **no crece con lo que imprime**:
> con las dieciséis instrucciones de antes había que nombrar cada celda en el
> programa, escribir *k* celdas costaba *3k+1* y la ecuación no tenía solución.
> Si tocas una instrucción de sitio, esa prueba se cae, y es a propósito.

**El widget.** `W.maquina(host, {id, texto, datos, alto, aria, nota, tope})`, con
la misma forma que los otros dos: editor de dos capas, aviso con `aria-live` que
dice en castellano qué acaba de hacer, registros a la vista, y debajo **la
memoria entera**, con una flecha en la celda del contador (flecha *y* fondo:
nada se distingue solo por color). Para corregir, `W.programaIguales` es
`MAQ.iguales`, y las instrucciones que devuelve dan la puntuación por coste.

---

## El lenguaje (`LEN` y `W.lenguaje`)

`assets/js/core/lenguaje.js` es **Pizca**, el lenguaje que se construye en el
tramo B. Se llama así porque es lo justo: siete palabras (`sea`, `si`, `sino`,
`mientras`, `fun`, `vuelve`, `muestra`), cuatro operaciones y seis
comparaciones. El camino completo es el índice del tramo:

```
texto  →  tokens  →  árbol  →  ┬→  intérprete  →  salida
                               └→  ensamblador →  MÁQUINA → salida
```

**Las dos salidas tienen que ser la misma**, y eso no es un deseo: es la prueba
diferencial de `tests.html`, que corre la batería entera por los dos caminos —y
además optimizada— y compara. Es la única forma de saber que el compilador no
miente, porque un compilador que genera código plausible y equivocado no se
distingue leyéndolo.

| Función | Qué hace |
|---|---|
| `LEN.tokeniza(texto)` | `{tokens, errores}`; cada token con su `linea` |
| `LEN.analiza(texto)` | descenso recursivo → `{ast, errores, tokens}`. La precedencia sale del orden en que las funciones se llaman unas a otras |
| `LEN.evalua(ast, o)` | el intérprete: `{salida, pasos, porQue}`. El entorno es una cadena de diccionarios, que es todo lo que significa «ámbito» |
| `LEN.compila(ast)` | `{texto, errores, huecos}` en ensamblador de `MAQ` |
| `LEN.optimiza(ast, cuenta)` | pliega constantes y quita código muerto **modificando el árbol**: pásale una `LEN.copia(ast)` si quieres conservar el original |
| `LEN.corre(texto, o)` | atajo; con `o.compilado` va por la máquina, con `o.optimiza` pasa antes por el optimizador |
| `LEN.diferencial(texto, o)` | corre por los dos caminos y devuelve `{interpretado, compilado, iguales, asm}` |
| `LEN.iguales(texto, casos, o)` | corrección por comportamiento; cada caso puede traer un `antes` que pone los datos (`'sea n = 3;\n'`) |
| `LEN.arbolTexto(ast)` | el árbol escrito con sangría, que es lo que se enseña en el panel |
| `LEN.EJEMPLOS` | la batería; si uno deja de coincidir por los dos caminos, algo se ha roto |

Tres decisiones que conviene conocer:

- **Pizca es un lenguaje de ocho bits.** Sus números son los de la máquina: de
  −128 a 127, con vuelta al desbordar, y división entera. El intérprete desborda
  igual que la CPU **a propósito**; si no, las dos ramas del dibujo darían cosas
  distintas y la prueba diferencial no valdría nada.
- **Ni `eval` ni `new Function` con lo que escribe el alumno.** Todo pasa por el
  analizador de este archivo. Es la regla del curso y además es el tema.
- **Las funciones se compilan salvando y restaurando sus huecos.** La máquina no
  sabe leer una celda cuya dirección esté en otra celda, así que no hay marcos de
  pila de verdad: cada función tiene huecos fijos, y quien llama los guarda en la
  pila antes de llamar y los devuelve a su sitio al volver. Con eso la recursión
  funciona —`fib` y `fact` están en la batería—, la pila crece una vez por
  llamada, que es justo lo que hay que ver, y cuando se pasa de 64 la máquina lo
  dice. Los **argumentos también van por la pila**, no por celdas temporales:
  con celdas, `suma(1, suma(2, 3))` se pisaba a sí mismo.

**El widget.** `W.lenguaje(host, {id, texto, nota, tope, paneles, optimiza})`
pone el editor y **cuatro paneles del mismo texto** —tokens, árbol, ensamblador y
máquina— que se eligen con fichas. Cuatro columnas no caben en un móvil, y como
todo sale del mismo sitio, verlas por turnos no pierde nada. El aviso canta
siempre **las dos salidas** y si coinciden; cuando no, el taller se pone en rojo.
`paneles` recorta la lista para una demo que solo quiera enseñar uno o dos.

---

## Imprimir un tema como ficha

Cualquier tema se imprime desde el botón del pie, y sale como **ficha de
trabajo**: los enunciados con sus casillas en blanco y sin nada que solo sirva
con un ratón delante. La hoja de impresión quita el índice, la barra, los
botones de comprobar y de pista, los avisos de los talleres y el propio botón de
imprimir; convierte las casillas en rayas para escribir encima; pone todo en
negro para no gastar tóner; y evita que una tarjeta se parta entre dos páginas.

Dos detalles que conviene conocer al escribir un tema:

- Los **ejemplos resueltos se imprimen enteros**, con sus pasos desplegados: en
  papel no se puede hacer clic.
- La cabecera lleva un `data-ruta` invisible en pantalla que la hoja de
  impresión saca al pie, para que desde el papel se pueda volver al tema.

---

## Un fallo raro, dos veces

La auditoría genera cada ejercicio **40 veces** para ver si su solución pasa su
propio corrector. Antes generaba con `U.rng()` sin semilla, así que un fallo de
uno entre mil aparecía una vez, se iba y no había forma de volver a verlo.

Ahora cada tanda usa una **semilla conocida**, que se enseña en el resumen del
auditor (`seed=…`) y en el propio mensaje de fallo. Para repetir exactamente la
misma tanda, se abre `tests.html?seed=<n>`. Si un fallo solo aparece con una
semilla, esa semilla es el caso que hay que arreglar.

---

## Deberes y exámenes, sin servidor

Dos cosas que necesita quien da clase, resueltas con la misma idea: **que el
enlace lleve dentro lo que hace falta**. No hay cuentas, no hay servidor y no se
recoge nada.

**Deberes.** Cada ejercicio del curso tiene un botón «+ Deberes» que lo aparta
*con los números que tenga en ese momento*. La lista vive en el progreso y se
comparte como `#/__deberes?d=<código>`, donde el código es
`tema:ejercicio:semilla` separados por `~`. `Ex.codificaDeberes(lista)` y
`Ex.leeDeberes(texto)` hacen la conversión, y `Ex.deberes()` lee y escribe la
lista guardada. Quien abre el enlace ve exactamente esos enunciados; el estado
«resuelto» que aparece al lado es del propio navegador y no viaja.

**Examen de cualquier bloque.** `#/__examen` abre la maquinaria de los simulacros
—que existía y solo servía para la PAU— a cualquier selección de bloques. Monta
las `partes` que espera `p.simulacro` con un bloque por parte, y hereda todo lo
suyo: preferencia por los problemas de apartados, un tema distinto por pregunta
mientras se pueda, cronómetro opcional y corrección al entregar.
`#/__examen?b=al,ge&n=2` reproduce la misma configuración, y añadiendo `&s=<n>`
salen además las **mismas preguntas con los mismos números**.

---

## Las rutas de la ampliación

Los bloques 0 a 7 se recorren en orden y tienen itinerario de examen. Los 161
temas de ampliación no: son optativos, no se presuponen entre sí, y ahí el orden
del temario deja de mandar. Sin una ruta, esa mitad del curso es un catálogo.

Las rutas viven en `assets/js/curriculum.js`, al final, en `RUTAS`. Cada una
declara `id`, `t`, `r` (a dónde llega), `para` (para quién es), `nucleo` y
`temas`. **Para escribir una nueva:**

1. Haz la lista de a lo que quieres llegar. Eso es el **`nucleo`**.
2. Ciérrala sobre los requisitos: mientras algún tema de la lista declare un
   `req` de **ampliación** que no esté, añádelo. Los requisitos de ESO, 1.º y 2.º
   se dan por sabidos —la ruta es para quien terminó Bachillerato—; los optativos
   no, porque nadie los ha visto necesariamente.
3. Ordena el resultado **como el temario**, que ya respeta los requisitos. Eso es
   **`temas`**.

`tests.html` comprueba las tres cosas: que los temas existen y no se repiten, que
ningún requisito va detrás de quien lo necesita, y que no falta ningún tema
optativo del que la ruta dependa. Si añades un `req` a un tema y eso rompe una
ruta, las pruebas lo dicen con nombres y apellidos.

La página está en `#/__rutas`, y `#/__rutas?r=<id>` abre el recorrido de una. Los
temas del núcleo salen marcados; los demás se presentan como lo que son: camino.

---

## El progreso, y cómo sale del navegador

`assets/js/core/progress.js` guarda en `localStorage` lo que el alumno lleva
hecho. Eso está bien para quien estudia —no hay que registrarse— y es ciego para
quien enseña, así que el progreso también se puede **sacar como texto**:

| Función | Qué hace |
|---|---|
| `Progress.exporta(nombre)` | devuelve el progreso entero como JSON, con la versión del curso, la fecha y un nombre opcional |
| `Progress.lee(texto)` | valida **sin aplicar**: `{ok, datos}` o `{ok:false, error}` con un mensaje que se puede enseñar tal cual |
| `Progress.importa(texto, modo)` | `'fundir'` conserva lo más avanzado de cada lado; `'reemplazar'` deja exactamente lo del archivo |
| `Progress.resumen(mapa)` | vistos, dominados, aciertos e intentos, repartidos por bloque. Acepta un mapa ajeno, que es lo que hace posible la vista de clase |
| `Progress.estadoEn(t)` · `Progress.dominioEn(t)` | lo mismo que `state` y `dominio`, sobre un progreso que no es el propio |

**Al fundir gana lo más avanzado, nunca lo más reciente.** Abrir el curso en el
móvil no puede borrar lo hecho en el portátil, y esa regla es la única que hay.

La página está en `#/__progreso` y no es un tema: la monta `app.js` como monta la
portada. Carga varios archivos a la vez para la vista de clase, y **no guarda
ninguno**: se leen, se suman en una tabla y desaparecen al recargar.

> Si escribes pruebas que toquen el progreso, saca antes una copia con
> `Progress.exporta()` y devuélvela en un `finally`. `tests.html` corre en el
> mismo navegador que el curso, y nadie debe perder lo suyo por abrir las pruebas.

---

## El motor de redes neuronales (`NN`)

Los dos bloques de inteligencia artificial se apoyan en
`assets/js/core/nn.js`, igual que el gráfico se apoya en `shader.js`. Expone
`window.NN` con una red **de verdad**: tensores sobre `Float32Array` y
diferenciación automática en modo inverso, para que las demos entrenen lo que
el texto explica. Está escrito para leerse, porque `ia-taller` enseña una red
entera hecha con él.

**Tensores y cinta.** `NN.t(forma, valores)` es un dato; `NN.param(forma, r)`
un parámetro que el optimizador mueve, inicializado con `U.rng`;
`NN.constante(forma, valor)` un parámetro que empieza en un valor fijo (sesgos
a cero, escalas a uno). Cada operación se apunta en una cinta, y
`NN.atras(perdida, params)` la recorre al revés: eso es la retropropagación
entera. `NN.limpia()` vacía la cinta antes de cada pasada.

**Operaciones.** `NN.mm` (producto de matrices) · `NN.suma` (con el sesgo
repartido por filas) · `NN.prod` · `NN.escala` · `NN.trans` · `NN.trozo` ·
`NN.reforma` · activaciones `NN.relu` `NN.sigmoide` `NN.tanh` `NN.escalon` ·
`NN.softmax` · `NN.entropiaCruzada(logits, objetivo)` (con el softmax dentro:
su gradiente es «probabilidad menos lo que debería») ·
`NN.entropiaCruzadaBinaria(p, y)` — ojo, esta recibe la probabilidad **ya
pasada por la sigmoide**, no el logit; su derivada lleva $p(1-p)$ en el
denominador justo para que, al encadenarla con la sigmoide, el gradiente que
llega al logit sea exactamente $p - y$ · `NN.ecm` · `NN.media` ·
`NN.conv2d(x, nucleo)` · `NN.agrupa` · `NN.embedding` · `NN.mascaraCausal` ·
`NN.normaliza`. La **atención** (`NN.atencion(q, k, v, causal)`) y la **celda
LSTM** (`NN.lstm`) están *compuestas* a partir de las anteriores: se escriben
como en la pizarra y su vuelta atrás sale sola de las piezas.

**Optimizadores.** `NN.SGD(params, {lr, momento})` y `NN.Adam(params, {lr})`,
los dos con `.paso()` y con `.lr` modificable desde un deslizador.

**El bucle.** `NN.bucle({host, paso, pinta, porFotograma, hasta})` entrena con
`requestAnimationFrame` sin congelar la página y se para al salir de pantalla.
Devuelve `.arranca() .pausa() .para() .reinicia() .activo()`.

> **El bucle nace parado, y tiene que seguir así.** `tests.html` monta todos
> los temas del curso en un contenedor oculto: si una demo arrancara el
> entrenamiento al construirse, la auditoría lanzaría decenas de bucles a la
> vez. Se arranca con un botón. Y **los ejercicios no entrenan nunca**: la
> auditoría genera cada uno 40 veces.

**Datos por fórmula.** `NN.datos.lunas / circulos / espirales / xor / nubes`,
todos a partir de `U.rng` con semilla: nada viene de fuera. `NN.deFilas`
convierte una lista de vectores en tensor, `NN.aciertos` mide la proporción de
aciertos y `NN.compruebaGradiente` compara con diferencias finitas.

`tests.html` audita **cada operación** contra diferencias finitas, porque una
vuelta atrás mal escrita no da error: da una red que entrena mal sin decir por
qué. Los dos bloques usan la **piel** `ia` (verde de fósforo), declarada con
`piel: 'ia'` en `curriculum.js` y sus tokens `--ia*` en `base.css`.

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
`U.fmts` (con signo) · `U.miles(n)` (millares con espacio fino; se ve igual en
prosa y dentro de `$...$`, no hace falta envolverlo) · `U.round` `U.clamp`
`U.sum` `U.plural` ·
`U.el` `U.add` `U.clear` `U.$` `U.$$`

---

## El renderizador de fórmulas (MathX)

Subconjunto de LaTeX implementado a mano (`assets/js/core/mathx.js`), porque el
curso tiene que funcionar sin internet.

Soportado: `\frac` `\dfrac` `\sqrt[n]{}` `^` `_` `\left...\right` (con paréntesis
que crecen solos) `\sum` `\prod` `\int` `\lim` `\begin{pmatrix|bmatrix|vmatrix|
cases|aligned|array}` `\vec` `\overline` `\hat` `\text` `\mathbb` `\binom`
`\pmod` `\overset` `\stackrel`, todo el alfabeto griego y los símbolos habituales
de relación y operación.

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
6. Ningún «error típico» salta con la respuesta correcta.
7. Los requisitos del tema van antes que él en el temario.
8. El tema lleva puente, al menos un ejemplo resuelto, al menos una comprobación,
   una predicción en cada demo y una lista de trampas. En la línea del tema,
   «resueltos» y «comprobaciones» no están a cero. La auditoría exige que cada
   comprobación tenga exactamente una opción correcta y explicación en todas, y
   que cada ejemplo resuelto tenga al menos dos pasos.
9. Ninguna respuesta de pocas palabras se pide como texto libre: va en `opts`.
10. La prosa no dice «bloque 5» ni «tema 10»: enlaza al tema con `[[id|texto]]`.
