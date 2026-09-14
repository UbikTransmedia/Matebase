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

## Lo que esta tubería NO puede traducir

**Los enunciados de los ejercicios.** El motor los fabrica con números
distintos en cada generación, así que no hay una frase fija que sirva de
clave. Un tema traducido lo dice arriba en vez de callárselo, y
`tests.html` separa las dos cosas: exige que la prosa esté entera y deja
fuera lo que fabrica el motor de ejercicios.

Algunas demos arman su texto al vuelo con literales. Esas frases sí se
pueden traducir, pero el extractor estático no las ve: aparecen al ejecutar
la batería (`window.__SIN_TRAD` en la consola) y se añaden a mano al archivo
del tema. `coser.py` las acepta aunque no estén en `claves.json`.

## Lo que vigila la batería

- Las fórmulas `$…$`, los enlaces `[[tema]]` y las etiquetas HTML
  sobreviven a la traducción. Una `$` perdida parte una fórmula en dos, y
  eso ya ha pasado: lo cazó esta prueba.
- Un tema marcado como traducido no deja prosa en castellano por detrás.
- Los fallos de interpretación que no se ven leyendo por encima:
  **«billón» no es «billion»** (uno es un millón de millones y el otro mil
  millones: traducirlo por lo que parece multiplica por mil), las comillas
  angulares se cambian por las inglesas, los decimales llevan punto fuera
  de las fórmulas, y `\operatorname{sen}` pasa a `\sin`.

## Estado

`python3 i18n/falta.py` lo dice en una tabla. Al cerrar la versión 1.8.0:
el bloque 0 completo y los 776 objetivos del temario.
