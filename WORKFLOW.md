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

20 bloques, 246 temas, en progresión estricta. El orden es el contrato pedagógico:
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
15. **Máquinas y lenguajes** (18) — cómo funciona un ordenador y cómo funciona un lenguaje, construyendo los dos de abajo arriba desde `assets/js/core/logica.js`, `maquina.js` y `lenguaje.js`. Va aquí porque necesita la realimentación y el retardo de cibernética: un biestable es un bucle que se acuerda.
16. **Programación gráfica** (33), con piel propia.
17. **Criptografía** (36), con piel propia — de César a lo poscuántico, con la criptografía real (SHA-256, AES, curvas, RSA) ejecutándose en el navegador desde `assets/js/core/cripto.js`.
18. **Inteligencia artificial I: aprender de los datos** (12), con piel propia — de qué significa aprender de ejemplos hasta la red densa, la retropropagación y cómo se evalúa.
19. **Inteligencia artificial II: las arquitecturas** (14), con piel propia — cada arquitectura entra por la idea matemática que aporta, y las redes se entrenan de verdad en el navegador desde `assets/js/core/nn.js`.

> **Los bloques 15, 16, 17, 18 y 19 son optativos y no se presuponen entre sí.** Un
> alumno puede hacer el de criptografía sin el de gráficos, o los de IA sin
> ninguno de los otros dos: por eso sus `req` sólo citan requisitos reales, y
> las herramientas generales que necesitan viven en su bloque natural (`av-pca`
> con el álgebra lineal, `av-convolucion` junto a Fourier) y no dentro del
> bloque que las usa.

Cada tema declara `id`, `t` (título), `r` (resumen), `o` (objetivos) y `req`
(requisitos); los de 2.º, además, `curso: '2B'` e `itin` (`['MII']`, `['MCS']` o
los dos). Se pueden **intercalar temas nuevos** en cualquier punto insertando un
objeto en el array.

> **Por qué «Máquinas y lenguajes» es el bloque 15 y no el 13.** El encargo pedía
> insertarlo entre cibernética y programación gráfica, y daba por hecho que eso lo
> dejaba en el 13 con gráficos pasando al 14. Esa numeración era de un estado
> anterior del temario: cuando se escribió, cibernética ya era el 14 y gráficos el
> 15, porque entre medias habían entrado criptografía y los dos bloques de
> inteligencia artificial. Se respetó **la posición pedida** —entre cibernética y
> gráficos— y se renumeró con los números reales: `maq` al 15, y `gfx`, `cr`, `ia1`
> e `ia2` corridos al 16, 17, 18 y 19. Cambiar el sitio para que cuadrara el número
> habría roto la razón pedagógica de ponerlo ahí, que es tener a mano la
> realimentación y el retardo de cibernética.
>
> El mismo encargo pedía añadir un campo `req` «porque `curriculum.js` no lo tiene».
> Sí lo tiene, en los 228 temas, y `tests.html` ya comprobaba que cada requisito
> exista y vaya antes. No se tocó nada: las fichas nuevas se limitan a declararlo
> como las demás.

> **Decisiones propias del bloque de máquinas**, tomadas sin consultar porque el
> encargo pedía trabajar de principio a fin, y anotadas aquí por eso mismo:
>
> - **La piel del bloque es violeta, no azul.** Se probó el azul, que es el color
>   con el que se piensa un ordenador, y era invisible: el acento por defecto del
>   curso ya es azul en los tres temas, así que el bloque no se habría distinguido
>   de ninguno de los normales. Se midió la distancia de tono a los acentos ya
>   usados y el violeta era el hueco.
> - **El simulador de circuitos avanza por instantes, no en orden topológico.** Un
>   orden topológico resuelve de un tirón cualquier circuito sin ciclos, pero
>   entonces el biestable —que es un ciclo— no tendría solución, y es el tema que
>   hace que el instrumento valga la pena.
> - **El banco de circuitos guarda estado entre pulsaciones** (opción `memoria`).
>   Sin eso, soltar la orden de un cerrojo lo devolvía a cero y oscilaba: el tema
>   de la memoria enseñaba justo lo contrario de lo que decía. La auditoría de
>   temas no puede ver un defecto así, de modo que la regresión mueve los
>   conmutadores de un banco de verdad.
> - **La máquina tiene mnemónicos en castellano, celdas de 8 bits con signo y el
>   programa en la misma memoria que los datos.** Lo primero porque el alumno los
>   lee letra a letra; lo segundo porque convierte `maq-bits` en algo que se toca
>   —el factorial de 5 cabe y el de 6 no—; lo tercero porque «un programa son
>   números en celdas» es la idea de von Neumann y aquí se ve en una tabla.
> - **El lenguaje se llama Pizca** y tiene siete palabras. El encargo pedía «un
>   nombre corto, de una palabra en castellano»; se eligió éste porque dice lo que
>   es —una pizca de lenguaje— sin prometer nada que no cumpla.
> - **Pizca es un lenguaje de ocho bits, y su intérprete desborda igual que la
>   CPU.** Podría haber usado los números de JavaScript y ser más cómodo, pero
>   entonces interpretar y compilar darían resultados distintos en cuanto una
>   cuenta se saliera de rango, y la prueba diferencial —que es lo que sostiene
>   todo el tramo B— no diría nada.
> - **Las funciones compiladas no tienen marco de pila, sino huecos fijos que
>   quien llama salva y restaura.** La máquina no sabe leer una celda cuya
>   dirección esté en otra celda, y añadirle esa instrucción habría sido la
>   alternativa. Se prefirió no tocar la máquina ya escrita: con salvar y
>   restaurar, la recursión funciona igual, la pila crece una vez por llamada
>   —que es lo que hay que ver— y el tope de 64 avisa. Los argumentos van también
>   por la pila, no por celdas temporales; con celdas, `suma(1, suma(2, 3))` se
>   pisaba a sí mismo, y se descubrió probándolo.
> - **Los cuatro paneles del taller se ven por turnos, con fichas**, y no los
>   cuatro a la vez. Cuatro columnas no caben en un móvil, y como los cuatro
>   salen del mismo texto, verlos por turnos no pierde sincronía ninguna.
> - **El Quine-McCluskey de `maq-normal` vive en el tema, no en el núcleo.** No lo
>   usa nadie más, y lo que hace falta allí no es minimizar de verdad —eso es un
>   problema duro— sino poder decir un coste alcanzable sin inventárselo. Por eso
>   los ejercicios dicen «se puede con N» y enseñan el circuito, nunca «el mínimo
>   es N».

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
| `cripto.js` | Criptografía real ejecutándose en el navegador: SHA-256, AES, curvas elípticas, RSA | criptografía |
| `nn.js` | Tensores con cinta y derivación automática, capas, atención, LSTM, optimizadores y el bucle de entrenamiento | los dos bloques de IA |
| `exercise.js` | Motor de **ejercicios y problemas por apartados**: generar → preguntar → corregir → diagnosticar → resolver → regenerar; modo examen | todos los temas |
| `page.js` | Constructor declarativo de páginas y recolector de contenido | todos los temas |
| `repaso.js` | Mapa del temario, simulacros y formulario | bloque de repaso |
| `progress.js` | Progreso, dominio por tipo de ejercicio y repaso espaciado en `localStorage` | índice, portada y ejercicios |
| `app.js` | Índice, buscador con glosario, columna derecha con el glosario y la referencia GLSL, itinerarios, enrutado con semilla y carga perezosa | shell |

## Fase 3 — Contenido, bloque a bloque (cerrada)

Por cada tema: explicación → apunte histórico → ejemplos interactivos → ejercicios
procedimentales → ideas clave. **Los 228 temas están escritos**, y cada tanda se
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

## Fase 6 — Máquinas y lenguajes (cerrada)

Un bloque optativo de 18 temas entre Cibernética y Programación gráfica, con dos
tramos que se cierran uno sobre otro: **el compilador del tramo B genera el
ensamblador de la CPU del tramo A**. Con él, el curso llega a **246 temas
escritos de 246 previstos**.

Tres instrumentos nuevos en el núcleo, con la misma forma de API que `W.shader`:

- **`logica.js`** — el banco de circuitos. Netlist escrita en texto, diagrama
  generado solo, tabla de verdad entera y un simulador que avanza **por
  instantes**, no en orden topológico, porque el biestable es un ciclo.
- **`maquina.js`** — la CPU de juguete. Dieciséis instrucciones con mnemónicos en
  castellano, celdas de ocho bits con signo, programa y datos en la misma
  memoria, ensamblador de dos pasadas y un tope de pasos.
- **`lenguaje.js`** — **Pizca**, siete palabras. Troceador, analizador por
  descenso recursivo, intérprete, compilador a `maquina.js` y optimizador.

La prueba que sostiene el tramo B es **diferencial**: una batería de once
programas —con bucles, funciones, recursión y recursión mutua— se interpreta y se
compila-y-ejecuta en cada pasada de `tests.html`, y las dos salidas se comparan,
también con el optimizador puesto. Cazó un fallo real del compilador que pasaba
la vista perfectamente: los argumentos iban por celdas temporales y
`suma(1, suma(2, 3))` se pisaba a sí mismo.

Las pruebas del bloque suman 462 comprobaciones en total, y varias mueven
botones de widgets de verdad, porque la auditoría de temas no ve un widget roto:
lo aprendimos con el banco de circuitos, que perdía el estado entre pulsaciones
y hacía que el tema de la memoria enseñara lo contrario de lo que decía.

## Fase 7 — Las mejoras del análisis (cerrada)

Un DAFO del curso desde dos lecturas —la de quien lo estudia y la de quien lo
daría en clase— dejó diez mejoras ordenadas por lo que cambian dividido por lo
que cuestan. Lo que ha salido de aplicarlas, con lo que conviene recordar:

- **El progreso sale del navegador.** Exportar e importar como archivo, y una
  vista de clase que lee varios a la vez. Al fundir gana lo más avanzado, nunca
  lo más reciente.
- **Rutas para la ampliación.** Un `nucleo` de temas, cerrado sobre los
  requisitos de ampliación y ordenado como el temario. `tests.html` comprueba que
  ninguna ruta manda a nadie a un tema que dé por sabido otro que no ha visto.
- **La red, cerrada.** 44 temas no recibían ni un enlace; ahora ninguno, y hay
  una prueba que lo impide.
- **Deberes y exámenes sin servidor:** el enlace lleva dentro lo que hace falta.
- **Cualquier tema, imprimible como ficha**, y auditorías reproducibles: la
  semilla se enseña y se puede repetir con `tests.html?seed=<n>`.
- **El bloque de repaso, contenido y no andamio.** Reparte las preguntas por lo
  que flojea y cuenta en qué se fue el tiempo. Probarlo destapó un fallo de
  corrección que llevaba meses dando por buenas respuestas equivocadas: `tol` no
  es una tolerancia absoluta.
- **El árbol y la pila, dibujados.** El tramo del lenguaje se explicaba con
  texto lo que es una forma.
- **Un idioma más, pero solo por fuera.** Interfaz y temario en inglés; la prosa
  sigue en castellano y el tema lo avisa.
- **La instrucción que faltaba.** `CARGAI` y `GUARDAI` cambian lo que la máquina
  *puede* hacer, no lo cómoda que es, y por eso valían un bit de más en el código
  de operación. Con ellas hay listas, y el quine dejó de ser imposible: 26 celdas
  que escriben exactamente esas 26.

> **Por qué el quine merecía romper la cuenta redonda.** El bloque contaba, con
> una demostración de una línea, que en aquella máquina no podía haber un
> programa que se escribiera entero: escribir *k* celdas costaba *3k+1*. La
> demostración era correcta y el tema era bueno. Pero el motivo de fondo no era
> el tamaño, sino que **una dirección no podía ser un dato**, y eso se arregla
> con una instrucción. Ahora el tema cuenta las dos cosas —por qué no se podía y
> por qué ahora sí— y termina con el programa corriendo, que es bastante mejor
> final que una imposibilidad.

> **Por qué la traducción se queda en la puerta.** Traducir la prosa de 246 temas
> es escribir el curso otra vez, y a medias es peor que nada: el alumno no sabe
> qué se va a encontrar al abrir cada tema. Traducir solo lo que sirve para
> orientarse —interfaz, títulos y resúmenes— es útil de inmediato, no miente, y
> deja la puerta abierta: `I18N.trad` ya existe para el día que la prosa se
> traduzca de verdad. El aviso encima del tema dice exactamente qué está
> traducido y qué no.

## Fase 8 — Revisión experta y PAU (cerrada)

Una lectura completa de los 34 temas de 2.º de Bachillerato y del bloque de
repaso con dos preguntas: ¿es correcto? y ¿con esto se prepara la PAU de
Matemáticas II y de MACS II? Se recalculó cada ejemplo resuelto, cada fórmula y
cada generador de ejercicios; se cruzó el temario con el programa LOMLOE de las
dos asignaturas. Lo que salió:

- **Un error de contenido**, y solo uno: la demo de operaciones de fila de
  `al-determinantes` anunciaba determinante −11 para la matriz del ejemplo
  resuelto, cuyo determinante es 6. La auditoría no lo podía ver: era prosa.
- **La cobertura era completa**: Rouché-Frobenius, Cramer, producto mixto,
  perpendicular común, Bolzano, Weierstrass, L'Hôpital, valores intermedios,
  áreas con parámetro, Bayes, la aproximación normal con corrección de
  continuidad, intervalos, tamaño muestral y contrastes están todos, con
  ejercicios. Programación lineal y la inferencia van en el itinerario de MACS;
  la geometría del espacio y la función integral, en el de Mat II.
- **Cuatro huecos respecto a lo que cae en el examen**, cerrados en esta fase:
  la *tasa de variación media* no se nombraba (solo «cociente incremental»),
  y es vocabulario de enunciado en las dos asignaturas; Rolle y el valor medio
  se enunciaban sin hipótesis y sin ejercicio, cuando el examen pide siempre
  comprobarlas; faltaba la optimización con coste, ingreso y beneficio, que es
  *el* problema de análisis de MACS II; y faltaba el simétrico de un punto
  respecto de una recta, que en Mat II cae tanto como el simétrico respecto de
  un plano. Son cuatro ejercicios y un problema por apartados nuevos.

> **Lo que enseña esta fase sobre el método.** La batería de pruebas genera
> cada ejercicio 40 veces y comprueba que la solución declarada pasa su propio
> corrector; por eso los 1097 ejercicios y problemas del curso estaban bien. Lo
> que no puede comprobar una máquina es un número escrito en la prosa de una
> demo, ni que un tema *falte*. Para eso hace falta leerlo como lo leería un
> profesor con el programa de la PAU al lado, y conviene hacerlo cada vez que
> cambie el programa.

## Fase 9 — Ideas pendientes (a petición)

- Más problemas de examen reales, adaptados por comunidades autónomas.
- Un modo profesor para montar simulacros a medida eligiendo temas.
- La prosa traducida de verdad, tema a tema, con `I18N.trad` y `dic.hechos` para
  que el aviso desaparezca solo en los que ya estén.
- La ampliación que propuso el análisis: algoritmos y estructuras de datos,
  inferencia, optimización numérica, verificación formal, concurrencia.

## Versiones

La versión vive en `assets/js/version.js` y se ve en la esquina inferior izquierda
del índice. Sigue el esquema MAYOR.MENOR.PARCHE:

- **MAYOR**: cambios que reorganizan el temario u obligan a reiniciar el progreso guardado.
- **MENOR**: temas, bloques o herramientas nuevas.
- **PARCHE**: correcciones, sin contenido nuevo.

Se sube en el mismo commit que el cambio, y `tests.html` comprueba que tiene ese
formato. La primera versión numerada es la 1.0.0, con 164 temas.

| Versión | Qué trajo |
|---|---|
| 1.0.0 | 164 temas |
| 1.2.0 | los dos bloques de IA y «Máquinas y lenguajes»: 246 temas |
| 1.3.0 | las mejoras del análisis: progreso portátil, rutas, deberes y exámenes por enlace, ficha imprimible, `CARGAI`/`GUARDAI`, el árbol dibujado, el repaso que reparte por lo que flojea y la interfaz en inglés |
| 1.4.0 | revisión experta de 2.º frente al programa de la PAU: un error corregido, tasa de variación media, hipótesis y ejercicios de Rolle y valor medio, optimización con beneficio, simétrico respecto de una recta |

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
