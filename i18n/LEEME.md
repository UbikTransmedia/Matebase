# Traducir la prosa del curso

El curso está escrito en castellano y esa es su lengua. Un diccionario
traduce la interfaz, el temario y —desde la versión 1.8.0— la prosa de los
temas. La clave de cada frase es **la frase española tal cual la escribió el
autor**; lo que no esté traducido sale en castellano y el tema lo avisa
arriba.

## Por qué hay una tubería y no se edita un archivo a mano

Una clave mal copiada —un acento, una comilla, un espacio— no rompe nada:
la frase sale en castellano y nadie se entera. Así que el traductor **nunca
copia claves**. Las extrae un script y el traductor solo escribe el inglés.

```bash
python3 i18n/extraer.py          # topics/ + curriculum.js -> i18n/claves.json
python3 i18n/falta.py            # cuánto falta, por bloque
python3 i18n/falta.py lg-conjuntos   # las frases que faltan de un tema
# ...se escribe i18n/en/lg-conjuntos.json  {"frase española": "english"}
python3 i18n/coser.py            # -> assets/js/i18n/en-txt.js
```

`i18n/claves.json` se regenera y no se versiona. Lo que se guarda es
`i18n/en/*.json`, que es el trabajo de traducción.

## Dónde entra en el curso

`I18N.trad` está enchufado en `MathX.inline` y `MathX.render`, el embudo por
el que pasa toda la prosa: párrafos, notas, pasos de un ejemplo resuelto,
pistas, trampas, ideas clave y fórmulas. Un solo sitio, y funciona en todos.
Los objetivos del temario pasan por ahí desde `app.js`.

`coser.py` marca en `d.hechos` los temas cuya prosa está completa: solo esos
dejan de avisar de que están en castellano.

## Los enunciados, que llevan números dentro

El motor fabrica cada enunciado con números distintos —«Estás en $4$.
Anterior: $3$»— así que la frase entera no puede ser una clave: cambia en
cada tirada. Lo que sí es fijo son los **pedazos** de texto que rodean a esos
números, y esos se traducen y se sustituyen dentro de la frase ya armada.

`extraer.py` los recoge aparte, en `i18n/fragmentos.json`, y los añade al
final de la lista del tema para que el traductor los vea como cualquier otra
frase. `coser.py` los escribe en `d.frag`, ordenados de más largo a más
corto: si no, un pedazo corto se come el principio de otro largo. `I18N.trad`
los aplica **solo** cuando la frase entera no está en el diccionario y el
tema está marcado como traducido; en un tema que sigue en castellano,
sustituir pedazos daría una frase mitad y mitad, peor que la original.

También entran en `d.frag` las frases enteras que **se insertan** en esos
enunciados —«un polígono es un cuadrado», que sale de una lista de casos— y
que tampoco se encuentran buscando la frase completa.

Tres cosas que no se pueden extraer solas y se escriben a mano, en la clave
reservada `"@frag"` del archivo del tema:

- el pegamento de dos letras: `"¿Es $"`, `"$ a "`;
- una palabra suelta que viaja dentro del enunciado y que como pedazo
  general sería peligrosa (`racional` está dentro de `irracional`);
- los arreglos de orden: el inglés no coloca las palabras donde el
  castellano, y a veces hay que repartir el sentido entre el prefijo y el
  dato («Redondea $X$ **a** *el millar* **más próxima**» → «Round $X$ **to**
  *the nearest thousand*»).

`i18n/en/@global.json` guarda los pedazos que valen para todo el curso: la
`y` que une dos fórmulas, por ejemplo, aparece en casi todos los temas.

Los números los formatea `U.fmt`, que pone coma decimal en castellano y
punto en los demás idiomas: por ahí no pasa el diccionario.

## Lo que vigila la batería

- Las fórmulas `$…$`, los enlaces `[[tema]]` y las etiquetas HTML
  sobreviven a la traducción. Una `$` perdida parte una fórmula en dos, y
  eso ya ha pasado: lo cazó esta prueba.
- Un tema marcado como traducido no deja prosa en castellano por detrás.
  Se construye tres veces —los ejercicios eligen caso al azar— y se mira
  lo que sale DESPUÉS de traducir, pedazos incluidos. Lo que quede se
  lista en `window.__SIN_TRAD`.
- Los fallos de interpretación que no se ven leyendo por encima:
  **«billón» no es «billion»** (uno es un millón de millones y el otro mil
  millones: traducirlo por lo que parece multiplica por mil), las comillas
  angulares se cambian por las inglesas, los decimales llevan punto fuera
  de las fórmulas, y `\operatorname{sen}` pasa a `\sin`.

## Estado

`python3 i18n/falta.py` lo dice en una tabla. Al cerrar la versión 1.8.0:
los bloques 0 y 1 completos (Lógica y Aritmética, 26 temas) y los
776 objetivos del temario.
