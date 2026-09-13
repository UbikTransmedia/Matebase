/* ===================================================================
   Matebase · javascript.js
   REFERENCIA DE JAVASCRIPT. Lo que muestra el panel lateral al pulsar
   «JavaScript»: el lenguaje en que se escribe el sonido en el bloque de
   síntesis, tal como lo ve el código del alumno dentro del sintetizador.

   Por que existe. El sintetizador de `core/sonido.js` no inventa un
   lenguaje: ejecuta JavaScript de verdad, con un preambulo que deja a
   mano `sin`, `TAU`, `sierra`, `nota`, `anterior`... Quien escribe ahi
   esta programando, y merece la misma referencia al lado que quien
   escribe un shader. Ademas, JavaScript es la lengua en la que esta
   escrito el curso entero: los dos ultimos grupos recogen los usos que
   NO estan en sintesis de sonido -el taller de IA y el propio curso-,
   para que quien llegue por el sonido vea adonde lleva.

   Cada entrada, igual que en glsl.js:
     t   nombre, tal como se escribe (o una descripcion corta si p: true)
     g   grupo (uno de JSREF.grupos)
     s   firma o forma de uso (codigo, se colorea)
     d   explicacion (HTML y $latex$)
     e   ejemplo (codigo, se colorea)
     x   como ejecuta el ejemplo tests.html:
         nada     = son sentencias, van dentro de sonido(t, i)
         'solo'   = es un programa entero, con su propia function sonido
         'no'     = no se ejecuta (no vive dentro del sintetizador)
     v   variantes para la busqueda
     i   tema donde se explica
     p   true si el titulo es prosa y no codigo

   Criterios, los del glosario y los de glsl.js: frase entera, primero
   que ES y despues para que sirve. Y uno propio: **decir la verdad
   sobre el cajon de arena**. Aqui no hay `use strict`, se puede llamar
   a `Math.random` y a `console.log`, y eso no se oculta: se explica por
   que no conviene. Un manual que miente se nota a la primera.
   =================================================================== */
window.JSREF = {

intro: 'Referencia del <strong>JavaScript</strong> que entiende el sintetizador del bloque de ' +
  '[[son-onda|síntesis de sonido]]. Tu código define una función, ' +
  '<code>sonido(t, i)</code>, que devuelve un número entre −1 y 1: la presión del aire en el ' +
  'instante $t$. Se la llama 44 100 veces por cada segundo de sonido, y <strong>todo se calcula ' +
  'antes de sonar</strong>.<br><br>No es un lenguaje de juguete: es JavaScript entero, el mismo con ' +
  'el que está escrito este curso. Lo único que cambia es que ya tienes a mano, sin escribir ' +
  '<code>Math.</code> delante, las funciones de los dos últimos grupos.',

/* t: titulo del grupo; c: etiqueta corta, la que acompaña a cada entrada
   en los resultados de una busqueda, donde ya no se ve el grupo. */
grupos: [
  { id: 'forma', t: 'La forma de un sonido', c: 'la forma' },
  { id: 'valores', t: 'Valores y variables', c: 'valor' },
  { id: 'oper', t: 'Operadores', c: 'operador' },
  { id: 'control', t: 'Control de flujo', c: 'control' },
  { id: 'listas', t: 'Listas y objetos', c: 'lista' },
  { id: 'math', t: 'Matemáticas', c: 'matemáticas' },
  { id: 'comunes', t: 'Funciones comunes', c: 'común' },
  { id: 'ondas', t: 'Formas de onda y envolventes', c: 'onda' },
  { id: 'memoria', t: 'Memoria: filtros, ecos y cuerdas', c: 'memoria' },
  { id: 'visor', t: 'El sintetizador del curso', c: 'sintetizador' },
  { id: 'recetas', t: 'Recetas del curso (no son del lenguaje)', c: 'receta del curso' },
  { id: 'fuera', t: 'JavaScript fuera del sintetizador', c: 'fuera del sonido' },
  { id: 'cuidado', t: 'Lo que aquí no conviene hacer', c: 'con cuidado' }
],

entradas: [

/* ---------------- la forma de un sonido ---------------- */
{ t: 'function sonido(t, i)', g: 'forma', s: 'function sonido(t, i) {\n    return 0.5 * sin(TAU * 440 * t);\n}',
  d: 'La función que tiene que existir: es lo único que el sintetizador busca en tu código. Recibe el instante <code>t</code> en segundos y el número de muestra <code>i</code>, y <strong>devuelve un número</strong> entre −1 y 1. Si no está, o no devuelve un número, el sintetizador lo dice en vez de callarse. El segundo parámetro se puede omitir: <code>function sonido(t)</code> vale igual.',
  e: 'function sonido(t) {\n    return 0.5 * sin(TAU * 440 * t);\n}', x: 'solo',
  v: 'sonido funcion principal main entrada punto de entrada', i: 'son-onda' },
{ t: 'return', g: 'forma', s: 'return expresión;',
  d: 'Devuelve el valor y termina la función ahí mismo: lo que venga detrás no se ejecuta. En <code>sonido</code> es obligatorio, y por eso el error más común del bloque —una función que calcula mucho y no devuelve nada— se avisa con estas palabras: «¿Falta el <code>return</code>?».',
  e: 'if (t < 0.5) return 0.5 * sin(TAU * 440 * t);\nreturn 0;          // después de medio segundo, silencio',
  v: 'return devolver devuelve salida', i: 'son-onda' },
{ t: 'Amplitud: por qué 0.5 y no 5', g: 'forma', p: true,
  d: 'Lo que devuelves es la posición del altavoz, y su recorrido va de −1 a 1. Un valor fuera de ese rango <strong>recorta</strong>: la onda se queda plana en el tope y aparecen armónicos ásperos que no habías pedido. El sintetizador cuenta cuántas muestras recortan y avisa. Al sumar voces, baja la amplitud de cada una: tres senos de 0,5 suman 1,5.',
  e: 'return 0.3 * sin(TAU * 220 * t) + 0.3 * sin(TAU * 330 * t);',
  v: 'amplitud volumen recorte clip saturar rango', i: 'son-onda' },
{ t: '// comentarios', g: 'forma', s: '// hasta el final de la línea\n/* varias líneas */',
  d: 'Texto que el ordenador ignora y las personas no. En un sintetizador vale su peso en oro: una fórmula de tres líneas puede ser indescifrable dentro de una semana, y un comentario que diga «esto es la envolvente» la salva.',
  e: '// la portadora, a 440 Hz\nvar y = 0.5 * sin(TAU * 440 * t);',
  v: 'comentario comentarios barra asterisco', i: 'son-onda' },

/* ---------------- valores y variables ---------------- */
{ t: 'var', g: 'valores', s: 'var nombre = valor;',
  d: 'Declara una variable. En este curso es la forma normal de hacerlo, porque el código está escrito en <strong>ES5</strong> y funciona en cualquier navegador. Una variable declarada dentro de <code>sonido</code> nace y muere en cada muestra; una declarada fuera se crea una vez y dura todo el cálculo.',
  e: 'var f = 220;\nvar y = 0.5 * sin(TAU * f * t);\nreturn y;',
  v: 'var variable declarar', i: 'son-onda' },
{ t: 'let y const', g: 'valores', s: 'let x = 1;\nconst LIMITE = 0.8;',
  d: 'Las formas modernas de declarar: <code>let</code> es como <code>var</code> pero solo vive dentro de las llaves donde se escribe, y <code>const</code> además prohíbe cambiar el valor después. Los dos <strong>funcionan aquí</strong> y el editor los colorea. El curso usa <code>var</code> por costumbre y por compatibilidad, pero puedes escribir como prefieras.',
  e: 'const A = 0.4;\nlet z = A * sin(TAU * 440 * t);\nreturn z;',
  v: 'let const constante ambito bloque scope', i: 'son-onda' },
{ t: 'Los números', g: 'valores', p: true, s: '0.5    440    1e-3    -2',
  d: 'En JavaScript solo hay un tipo de número y lleva decimales siempre: <code>1</code> y <code>1.0</code> son el mismo valor, y <code>1 / 2</code> vale <code>0.5</code> (no como en los enteros de otros lenguajes, ni como en [[gfx-pixel|GLSL]], donde un literal <code>float</code> necesita su punto). Se pueden escribir en notación científica: <code>1e-3</code> es $10^{-3}$.',
  e: 'return 1 / 2 * sin(TAU * 440 * t);   // 0.5, no 0',
  v: 'numero numeros decimal float entero notacion cientifica', i: 'son-muestras' },
{ t: 'true y false', g: 'valores', s: 'var suena = true;',
  d: 'Los dos valores lógicos, los de las [[lg-proposiciones|tablas de verdad]]. Salen de cualquier comparación y se usan en los <code>if</code>. Ojo con el resto de valores: en una condición, <code>0</code> y <code>NaN</code> cuentan como falso y cualquier otro número como verdadero, así que <code>if (f)</code> es «si f no vale cero».',
  e: 'var grave = f < 200;\nreturn grave ? 0.5 * sin(TAU * f * t) : 0.3 * sierra(f, t);',
  v: 'true false booleano logico verdadero falso', i: 'lg-proposiciones' },
{ t: 'new', g: 'valores', s: 'new Array(8)',
  d: 'Crea un objeto de un tipo dado. En un sintetizador casi nunca hace falta: las listas se escriben con corchetes, <code>[60, 64, 67]</code>, y los objetos con llaves. Se documenta porque el editor lo colorea como palabra del lenguaje y porque aparece al leer código de fuera.',
  e: 'var ceros = new Array(4);\nreturn 0.4 * sin(TAU * 440 * t) * (ceros.length / 4);',
  v: 'new instanciar crear objeto', i: 'son-secuencia' },

/* ---------------- operadores ---------------- */
{ t: '+ - * /', g: 'oper', s: 'a + b    a - b    a * b    a / b',
  d: 'Las cuatro de siempre, con la precedencia de siempre: primero <code>*</code> y <code>/</code>, después <code>+</code> y <code>−</code>, y los paréntesis mandan sobre todo. En el sonido, <strong>sumar es mezclar</strong> dos voces y <strong>multiplicar es modular</strong>: una envolvente multiplica, un segundo instrumento suma.',
  e: 'return 0.3 * sin(TAU * 220 * t) * decae(t, 0.5);',
  v: 'suma resta producto division aritmetica operadores', i: 'son-envolvente' },
{ t: '%', g: 'oper', s: 'a % b',
  d: 'El <strong>resto</strong> de dividir. Es la herramienta del secuenciador: <code>n % 8</code> recorre 0, 1, 2… 7, 0, 1… y hace que una lista de ocho notas se repita sin fin. Cuidado con los negativos: <code>-1 % 8</code> vale <code>-1</code> en JavaScript, no 7; si puede haber negativos, usa <code>mod(a, b)</code>, que siempre devuelve un valor del signo de <code>b</code>.',
  e: 'var n = floor(t * 4);\nreturn (n % 2 === 0) ? 0.4 * sin(TAU * 440 * t) : 0;',
  v: 'resto modulo porcentaje modulo negativo', i: 'son-secuencia' },
{ t: 'Comparar: < > <= >= === !==', g: 'oper', p: true, s: 'if (t >= 1) ...',
  d: 'Devuelven <code>true</code> o <code>false</code>. Los tres iguales, <code>===</code>, comparan valor <em>y</em> tipo y son los recomendables; <code>==</code> con dos iguales convierte antes de comparar y da sorpresas (<code>"1" == 1</code> es cierto). En los sintetizadores del curso verás <code>==</code> para comparar un mando con un número, donde los dos son números y da igual.',
  e: 'if (t < 0.25) return 0.5 * sin(TAU * 880 * t);\nreturn 0.5 * sin(TAU * 440 * t);',
  v: 'comparar igual distinto mayor menor igualdad estricta', i: 'son-envolvente' },
{ t: '&& || !', g: 'oper', s: 'a && b     a || b     !a',
  d: 'La <strong>y</strong>, la <strong>o</strong> y la negación de la [[lg-proposiciones|lógica]], con la misma tabla de verdad. Se usan para encadenar condiciones: «si ya ha pasado el ataque <em>y</em> todavía no ha terminado la nota». Evalúan de izquierda a derecha y paran en cuanto saben el resultado.',
  e: 'var dentro = t > 0.1 && t < 0.5;\nreturn dentro ? 0.5 * sin(TAU * 440 * t) : 0;',
  v: 'y o no and or not logicos conjuncion disyuncion', i: 'lg-proposiciones' },
{ t: '? : (el ternario)', g: 'oper', s: 'condición ? siEsCierto : siNo',
  d: 'Un <code>if</code> que cabe en una expresión y devuelve un valor. Es comodísimo dentro de un <code>return</code>, y en el curso aparece para elegir entre dos frecuencias o dos formas de onda sin partir la fórmula en cuatro líneas.',
  e: 'return 0.4 * ((i % 200 < 100) ? sin(TAU * 440 * t) : sierra(440, t));',
  v: 'ternario condicional interrogacion dos puntos', i: 'son-secuencia' },
{ t: '+= y ++', g: 'oper', s: 'y += 0.1;\nk++;',
  d: 'Atajos para acumular. <code>y += x</code> es <code>y = y + x</code>, y <code>k++</code> es <code>k = k + 1</code>. El primero es la forma natural de sumar armónicos dentro de un bucle; el segundo, de contar vueltas. También existen <code>-=</code>, <code>*=</code> y <code>/=</code>.',
  e: 'var suma = 0;\nfor (var k = 1; k <= 5; k++) suma += sin(TAU * k * 220 * t) / k;\nreturn 0.3 * suma;',
  v: 'incremento acumular mas igual sumar a', i: 'son-armonicos' },

/* ---------------- control de flujo ---------------- */
{ t: 'if … else', g: 'control', s: 'if (condición) {\n    ...\n} else {\n    ...\n}',
  d: 'Ejecuta unas líneas u otras según una condición. Es lo que convierte una fórmula en una función <strong>a trozos</strong>: una envolvente ADSR, un tambor distinto según el mando, un silencio en mitad de un compás. La rama <code>else</code> es opcional, y se pueden encadenar con <code>else if</code>.',
  e: 'if (t < 0.05) {\n    return t / 0.05 * sin(TAU * 440 * t);    // el ataque\n} else {\n    return decae(t - 0.05, 0.3) * sin(TAU * 440 * t);\n}',
  v: 'if else si entonces condicional a trozos', i: 'son-envolvente' },
{ t: 'for', g: 'control', s: 'for (var k = 1; k <= 8; k++) { ... }',
  d: 'Repite un bloque contando. Las tres partes son: con qué empieza, hasta cuándo sigue y qué hace en cada vuelta. En el sonido es <strong>la serie de Fourier hecha código</strong>: sumar ocho senos son tres líneas. Ten en cuenta que el bucle se ejecuta una vez por muestra, así que un bucle de 50 vueltas son dos millones de senos por segundo de sonido.',
  e: 'var y = 0;\nfor (var k = 1; k <= 8; k++) {\n    y += sin(TAU * k * 110 * t) / k;\n}\nreturn 0.3 * y;',
  v: 'for bucle repetir iterar sumatorio', i: 'son-armonicos' },
{ t: 'while y do', g: 'control', s: 'while (condición) { ... }\ndo { ... } while (condición);',
  d: 'Repiten mientras se cumpla una condición, sin contador. <code>while</code> comprueba antes de entrar y <code>do</code> después, así que este último da al menos una vuelta. Aquí se usan poco, y hay un motivo serio: una condición que nunca se hace falsa <strong>cuelga la página</strong>, porque el sonido se calcula de golpe. Con <code>for</code> el final está a la vista.',
  e: 'var k = 1, y = 0;\nwhile (k <= 4) { y += sin(TAU * k * 220 * t) / k; k++; }\nreturn 0.3 * y;',
  v: 'while do mientras bucle infinito', i: 'son-armonicos' },
{ t: 'break y continue', g: 'control', s: 'break;      // salir del bucle\ncontinue;   // saltar a la vuelta siguiente',
  d: '<code>break</code> abandona el bucle del todo y <code>continue</code> se salta lo que queda de esta vuelta. Sirven para «suma armónicos hasta pasarte de 20 000 Hz, que ya no se oyen» sin tener que calcular de antemano cuántos caben.',
  e: 'var y = 0;\nfor (var k = 1; k < 60; k++) {\n    if (k * 110 > 18000) break;      // por encima no se oye\n    if (k % 2 === 0) continue;       // solo los impares\n    y += sin(TAU * k * 110 * t) / k;\n}\nreturn 0.3 * y;',
  v: 'break continue romper saltar salir del bucle', i: 'son-armonicos' },
{ t: 'function (auxiliares)', g: 'control', s: 'function cuerda(f, u) {\n    return decae(u, 0.4) * sierra(f, u);\n}',
  d: 'Puedes definir todas las funciones que quieras además de <code>sonido</code>, y llamarlas desde ella. Es lo que convierte un sintetizador de cuarenta líneas en algo legible: una función por etapa —oscilador, envolvente, filtro— con su nombre. Se declaran fuera de <code>sonido</code>, al mismo nivel.',
  e: 'function voz(f, u) {\n    return decae(u, 0.3) * triangulo(f, u);\n}\nfunction sonido(t) {\n    return 0.4 * voz(330, t);\n}', x: 'solo',
  v: 'function funcion auxiliar definir subrutina', i: 'son-taller' },

/* ---------------- listas y objetos ---------------- */
{ t: '[ ] listas', g: 'listas', s: 'var notas = [60, 64, 67, 72];\nnotas[0]   // 60',
  d: 'Una lista de valores en orden, numerados <strong>desde cero</strong>. Es como se escribe una melodía: una lista de números MIDI, y el pulso decide cuál suena. Se declara fuera de <code>sonido</code>, para crearla una sola vez y no 88 200.',
  e: 'var m = [60, 64, 67, 72];\nfunction sonido(t) {\n    var n = floor(t * 4) % m.length;\n    return 0.4 * sin(TAU * nota(m[n]) * t);\n}', x: 'solo',
  v: 'lista array vector corchetes indice melodia', i: 'son-secuencia' },
{ t: '.length', g: 'listas', s: 'notas.length',
  d: 'Cuántos elementos tiene una lista. Combinado con el resto, <code>n % notas.length</code>, hace que la melodía vuelva a empezar sea cual sea su longitud: cambias la lista y no tienes que tocar nada más. Sin él, al pasar del último elemento se lee fuera de la lista y sale <code>undefined</code>, que no es un número.',
  e: 'var m = [57, 60, 64];\nfunction sonido(t) {\n    return 0.4 * sin(TAU * nota(m[floor(t * 4) % m.length]) * t);\n}', x: 'solo',
  v: 'length longitud tamaño cuantos elementos', i: 'son-secuencia' },
{ t: '{ } objetos', g: 'listas', s: 'var voz = { f: 440, amp: 0.3 };\nvoz.f   // 440',
  d: 'Un grupo de valores con nombre. En el sintetizador se usan poco —una lista basta para una melodía—, pero son cómodos para guardar los ajustes de un instrumento juntos, y son la forma en la que está escrito el curso entero: cada tema, cada ejercicio y cada gráfica se declara como un objeto con sus campos.',
  e: 'var v = { f: 220, amp: 0.4 };\nfunction sonido(t) {\n    return v.amp * sin(TAU * v.f * t);\n}', x: 'solo',
  v: 'objeto objetos llaves campos propiedades diccionario', i: 'son-taller' },

/* ---------------- matematicas ---------------- */
{ t: 'sin, cos, tan', g: 'math', s: 'sin(x)   cos(x)   tan(x)',
  d: 'Las [[tr-funciones|razones trigonométricas]], <strong>en radianes</strong>. <code>sin</code> es la que suena: un tono puro de frecuencia $f$ es <code>sin(TAU * f * t)</code>. <code>cos</code> es el mismo sonido desplazado un cuarto de vuelta, y suena idéntico, porque el oído no oye la fase. <code>tan</code> no se usa para sonar: se dispara a infinito.',
  e: 'return 0.5 * sin(TAU * 440 * t);',
  v: 'seno coseno tangente trigonometria radianes', i: 'son-onda' },
{ t: 'atan', g: 'math', s: 'atan(y, x)',
  d: 'El ángulo cuya tangente es $y/x$, teniendo en cuenta el cuadrante: va de $-\\pi$ a $\\pi$. Es el <code>Math.atan2</code> de JavaScript, con el nombre corto. Con un solo argumento, <code>atan(x, 1)</code>, hace de arcotangente de toda la vida, y sirve para <strong>saturar suavemente</strong> una señal que se pasa de 1 en vez de recortarla a cuchillo.',
  e: 'var y = 3 * sin(TAU * 220 * t);\nreturn 0.5 * atan(y, 1) / (PI / 2);   // saturación suave',
  v: 'atan atan2 arcotangente angulo saturacion', i: 'tr-funciones' },
{ t: 'abs', g: 'math', s: 'abs(x)',
  d: 'El valor absoluto: quita el signo. Doblar una onda por su valor absoluto <strong>dobla su frecuencia</strong> y le añade armónicos, que es un truco de síntesis clásico; y el valor absoluto de un coseno lento es lo que hace que dos tonos casi iguales batan el doble de veces que su semidiferencia.',
  e: 'return 0.5 * (2 * abs(sin(TAU * 220 * t)) - 1);   // suena a 440',
  v: 'abs valor absoluto modulo sin signo', i: 'son-batidos' },
{ t: 'floor, ceil, round', g: 'math', s: 'floor(2.7) // 2\nceil(2.1)  // 3\nround(2.5) // 3',
  d: 'Redondear hacia abajo, hacia arriba y al más cercano. <code>floor</code> es el que manda en el sonido: es la <strong>parte entera</strong> que dice en qué pulso del compás estamos, y también la que convierte una rampa en escalones (cuantizar). <code>floor</code> de un negativo baja: <code>floor(-0.5)</code> es −1.',
  e: 'var n = floor(t / 0.25);          // el número de pulso\nreturn (n % 4 === 0) ? 0.5 * sin(TAU * 660 * t) : 0.2 * sin(TAU * 440 * t);',
  v: 'floor ceil round redondear parte entera suelo techo', i: 'son-secuencia' },
{ t: 'sqrt', g: 'math', s: 'sqrt(x)',
  d: 'La raíz cuadrada. En sonido aparece en la velocidad de una onda en una cuerda, $v = \\sqrt{T/\\mu}$, y en el nivel eficaz: un seno de amplitud $A$ tiene nivel $A/\\sqrt2$ y el ruido uniforme, $A/\\sqrt3$. De un número negativo devuelve <code>NaN</code>, que el sintetizador trata como cero.',
  e: 'return 0.5 / sqrt(2) * sin(TAU * 440 * t);',
  v: 'sqrt raiz cuadrada', i: 'son-cuerda' },
{ t: 'exp', g: 'math', s: 'exp(x)   // e^x',
  d: 'La [[fn-exp-log|exponencial]], $e^x$. Con exponente negativo es <strong>la envolvente</strong>: <code>exp(-t / tau)</code> vale 1 al empezar y cae a $1/e$ en $\\tau$ segundos, que es exactamente cómo se apaga una cuerda, un filtro o un eco. En el curso tiene además un nombre propio, <code>decae(t, tau)</code>, que es lo mismo pero se lee mejor.',
  e: 'return 0.6 * exp(-t / 0.4) * sin(TAU * 330 * t);',
  v: 'exp exponencial e elevado decaimiento', i: 'son-envolvente' },
{ t: 'log', g: 'math', s: 'log(x)   // logaritmo natural',
  d: 'El [[fn-exp-log|logaritmo natural]], en base $e$. Es la función del <strong>oído</strong>: la altura de una nota es el logaritmo de su frecuencia, y por eso los cents se calculan con <code>1200 * log(f2 / f1) / log(2)</code>. Para cambiar de base se divide por el logaritmo de la base, porque aquí no hay <code>log2</code>.',
  e: 'var cents = 1200 * log(660 / 440) / log(2);   // 702: una quinta\nreturn 0.4 * sin(TAU * (440 + cents * 0) * t);',
  v: 'log logaritmo neperiano natural base cents', i: 'son-tono' },
{ t: 'pow', g: 'math', s: 'pow(base, exponente)',
  d: 'Elevar a una potencia. Es la fórmula de la escala temperada: subir $n$ semitonos es multiplicar por <code>pow(2, n / 12)</code>. También sirve para dar forma a una envolvente (<code>pow(x, 2)</code> la hace más abrupta) o para repartir los armónicos de un timbre, <code>1 / pow(k, brillo)</code>.',
  e: 'var f = 440 * pow(2, 3 / 12);   // tres semitonos más agudo\nreturn 0.4 * sin(TAU * f * t);',
  v: 'pow potencia elevar exponente semitono', i: 'son-tono' },
{ t: 'min, max', g: 'math', s: 'min(a, b)   max(a, b)',
  d: 'El menor y el mayor de los valores que se le den (admiten más de dos). <code>max(x, 0)</code> es la forma corta de «si es negativo, cero», que es la mitad de una envolvente; y los dos juntos son <code>clamp</code>, que es la forma corta de «no te salgas de aquí».',
  e: 'var e = max(0, 1 - t / 0.5);     // rampa que baja y se queda en cero\nreturn 0.5 * e * sin(TAU * 440 * t);',
  v: 'min max minimo maximo mayor menor', i: 'son-envolvente' },
{ t: 'PI, TAU', g: 'math', s: 'PI  = 3.14159…\nTAU = 2 * PI',
  d: 'La media vuelta y <strong>la vuelta entera</strong> en radianes. Casi todo el sonido usa <code>TAU</code>, porque un ciclo completo de un seno son $2\\pi$ radianes y así la fórmula se lee sola: <code>sin(TAU * f * t)</code> es «$f$ vueltas por segundo». Con <code>PI</code> habría que escribir <code>sin(2 * PI * f * t)</code>, que es lo mismo y se lee peor.',
  e: 'return 0.5 * sin(TAU * 440 * t);   // = sin(2 * PI * 440 * t)',
  v: 'pi tau dos pi vuelta radianes constante', i: 'son-onda' },
{ t: 'Math', g: 'math', s: 'Math.sin(x)   Math.PI   Math.cbrt(x)',
  d: 'El objeto de JavaScript donde vive la biblioteca matemática. El sintetizador ya te da las funciones de este grupo sin él —<code>sin</code> es <code>Math.sin</code>—, pero <code>Math</code> sigue estando a mano para lo que no tiene nombre corto: <code>Math.log2</code>, <code>Math.hypot</code>, <code>Math.sinh</code>, <code>Math.cbrt</code>… La única que conviene evitar es <code>Math.random</code>.',
  e: 'return 0.4 * sin(TAU * 440 * t) * Math.cos(TAU * 3 * t);',
  v: 'Math biblioteca matematica objeto global log2 hypot', i: 'son-onda' },

/* ---------------- funciones comunes ---------------- */
{ t: 'fract', g: 'comunes', s: 'fract(x)   // x - floor(x)',
  d: 'La parte decimal: siempre entre 0 y 1, y vuelve a cero cada vez que <code>x</code> pasa por un entero. Es <strong>el motor de toda onda periódica</strong>: <code>fract(f * t)</code> es una rampa que sube de 0 a 1 exactamente $f$ veces por segundo, y de ahí salen la sierra, la cuadrada y el triángulo.',
  e: 'return 0.5 * (2 * fract(220 * t) - 1);   // una sierra a mano',
  v: 'fract parte decimal fraccionaria rampa diente', i: 'son-onda' },
{ t: 'clamp', g: 'comunes', s: 'clamp(x, a, b)',
  d: 'Recorta <code>x</code> para que no salga del intervalo $[a, b]$: es <code>min(b, max(a, x))</code>. Se usa para que una envolvente no se pase de 1, para que un mando calculado no dé un valor imposible y, en general, para que una fórmula que casi siempre está bien no estropee las tres muestras en que no lo está.',
  e: 'var e = clamp(1 - t / 0.6, 0, 1);\nreturn 0.5 * e * sin(TAU * 440 * t);',
  v: 'clamp acotar limitar recortar saturar', i: 'son-envolvente' },
{ t: 'mix', g: 'comunes', s: 'mix(a, b, x)   // a + (b - a) * x',
  d: 'Mezcla lineal entre dos valores: con <code>x</code> igual a 0 devuelve <code>a</code>, con 1 devuelve <code>b</code> y en medio, lo de en medio. Es el mando de «cruce» de un sintetizador: pasar poco a poco de una sierra a una cuadrada, o de un sonido seco a uno con eco, es una sola línea.',
  e: 'return 0.4 * mix(sierra(220, t), cuadrada(220, t), 0.3);',
  v: 'mix mezclar interpolar lerp cruce crossfade', i: 'son-taller' },
{ t: 'step', g: 'comunes', s: 'step(borde, x)   // 0 antes, 1 después',
  d: 'Un escalón: vale 0 mientras <code>x</code> no llegue a <code>borde</code> y 1 a partir de ahí. Es un <code>if</code> escrito como número, y sirve para encender o apagar una voz sin partir la fórmula. Un escalón de golpe en el sonido produce un chasquido: para que no se oiga, <code>smoothstep</code>.',
  e: 'return 0.4 * step(0.5, t) * sin(TAU * 440 * t);   // entra a la mitad',
  v: 'step escalon umbral encender', i: 'son-envolvente' },
{ t: 'smoothstep', g: 'comunes', s: 'smoothstep(a, b, x)',
  d: 'Un escalón suave: 0 antes de <code>a</code>, 1 después de <code>b</code> y una transición con forma de ese entre los dos, sin esquinas. Como el oído oye las esquinas en forma de chasquido, esta es la manera limpia de que una nota entre o salga: una rampa de cinco milésimas basta.',
  e: 'var e = smoothstep(0, 0.01, t) * (1 - smoothstep(0.4, 0.5, t));\nreturn 0.5 * e * sin(TAU * 440 * t);',
  v: 'smoothstep escalon suave transicion fundido', i: 'son-envolvente' },
{ t: 'mod', g: 'comunes', s: 'mod(a, b)',
  d: 'El resto <strong>bien hecho</strong>: a diferencia de <code>%</code>, con un primer argumento negativo devuelve un valor positivo (<code>mod(-1, 8)</code> es 7). Es el que conviene usar para el reloj de un secuenciador, porque <code>mod(t, Tp)</code> siempre da el tiempo dentro del pulso aunque el tiempo se desplace hacia atrás.',
  e: 'var u = mod(t, 0.25);            // el tiempo dentro del pulso\nreturn 0.5 * decae(u, 0.03) * sin(TAU * 880 * u);',
  v: 'mod modulo resto positivo euclideo', i: 'son-secuencia' },
{ t: 'sign', g: 'comunes', s: 'sign(x)   // -1, 0 o 1',
  d: 'El signo de un número. Aplicado a un seno lo convierte en una <strong>onda cuadrada</strong> de la misma frecuencia, que es la definición más corta que hay de cuadrada, y aplicado a una señal cualquiera es la distorsión más brutal posible: todo a tope, arriba o abajo.',
  e: 'return 0.4 * sign(sin(TAU * 220 * t));   // una cuadrada',
  v: 'sign signo signum cuadrada distorsion', i: 'son-armonicos' },

/* ---------------- formas de onda y envolventes ---------------- */
{ t: 'sierra', g: 'ondas', s: 'sierra(f, t)   // de -1 a 1',
  d: 'Diente de sierra: sube en rampa y cae de golpe, $f$ veces por segundo. Tiene <strong>todos</strong> los armónicos, con amplitud $2/(\\pi k)$, y por eso es el material de partida de la síntesis sustractiva: un filtro va quitando de ahí lo que sobre. Es la onda del violín y de los metales.',
  e: 'return 0.4 * sierra(110, t);',
  v: 'sierra diente de sierra sawtooth rampa', i: 'son-armonicos' },
{ t: 'cuadrada', g: 'ondas', s: 'cuadrada(f, t)   // +1 media vuelta, -1 la otra',
  d: 'Onda cuadrada. Solo tiene los armónicos <strong>impares</strong>, con amplitud $4/(\\pi k)$, y de ahí su color hueco, el del clarinete y el de los videojuegos de los ochenta. Es también la señal digital por excelencia: dos valores y nada en medio.',
  e: 'return 0.35 * cuadrada(220, t);',
  v: 'cuadrada square onda cuadrada impares', i: 'son-armonicos' },
{ t: 'triangulo', g: 'ondas', s: 'triangulo(f, t)',
  d: 'Onda triangular: sube y baja en línea recta. Tiene los armónicos impares como la cuadrada, pero cayendo como $1/k^2$ en vez de $1/k$, así que suena mucho más suave, casi como un seno con un punto de aspereza. Es la onda del bajo sintético clásico.',
  e: 'return 0.5 * triangulo(165, t);',
  v: 'triangulo triangular onda', i: 'son-armonicos' },
{ t: 'pulso', g: 'ondas', s: 'pulso(f, t, ancho)   // ancho entre 0 y 1',
  d: 'Como la cuadrada, pero eligiendo qué fracción del periodo pasa arriba. Con <code>ancho</code> igual a 0,5 <em>es</em> la cuadrada; al estrecharla, el espectro se llena de armónicos y el sonido se vuelve nasal. Moverla lentamente es el efecto <em>PWM</em>, uno de los sonidos característicos de los sintetizadores analógicos.',
  e: 'var w = 0.5 + 0.4 * sin(TAU * 0.5 * t);   // el ancho se mueve\nreturn 0.35 * pulso(110, t, w);',
  v: 'pulso pwm ancho de pulso rectangular', i: 'son-armonicos' },
{ t: 'nota', g: 'ondas', s: 'nota(n)   // n = número MIDI',
  d: 'Convierte un número de nota MIDI en hercios: <code>nota(69)</code> es el La de 440 y cada 12 unidades dobla la frecuencia, porque calcula $440\\cdot 2^{(n-69)/12}$. Es lo que permite escribir una melodía como una lista de enteros, que es como se escribe la música en cualquier programa desde 1983.',
  e: 'return 0.4 * sin(TAU * nota(60) * t);   // Do central, 261,63 Hz',
  v: 'nota midi frecuencia altura afinacion', i: 'son-tono' },
{ t: 'decae', g: 'ondas', s: 'decae(t, tau)   // e^(-t/tau), y 0 si t < 0',
  d: 'La envolvente exponencial con el nombre puesto: vale 1 en el instante cero y cae a un 37 % a los <code>tau</code> segundos, y a la mitad a los $\\tau\\ln 2$. Es cómo se apaga todo lo que se golpea o se pulsa: una cuerda, una campana, un tambor.',
  e: 'return 0.6 * decae(t, 0.25) * sin(TAU * 330 * t);',
  v: 'decae decaimiento exponencial apagar envolvente tau', i: 'son-envolvente' },
{ t: 'adsr', g: 'ondas', s: 'adsr(t, a, d, s, r, dur)',
  d: 'La envolvente de cuatro tramos: <strong>a</strong>taque (sube de 0 a 1 en <code>a</code> segundos), <strong>d</strong>ecaimiento (baja hasta el nivel <code>s</code> en <code>d</code>), <strong>s</strong>ostenido (se queda ahí hasta <code>dur</code>) y <strong>r</strong>elajación (baja a cero en <code>r</code>). Es la función a trozos que distingue un órgano de un piano con el mismo timbre.',
  e: 'return 0.5 * adsr(t, 0.01, 0.1, 0.6, 0.1, 0.6) * sierra(220, t);',
  v: 'adsr envolvente ataque decaimiento sostenido relajacion', i: 'son-envolvente' },
{ t: 'ruido', g: 'ondas', s: 'ruido()   // un número al azar entre -1 y 1',
  d: 'Ruido blanco: un valor distinto y sin relación con el anterior en cada muestra, uniforme entre −1 y 1. Contiene todas las frecuencias por igual, y con una envolvente encima es una caja o un charles. <strong>Es reproducible</strong>: cada vez que se calcula el mismo código sale el mismo ruido, para que la auditoría y tú oigáis lo mismo.',
  e: 'return 0.5 * ruido() * decae(t, 0.1);   // un golpe de caja',
  v: 'ruido azar aleatorio blanco percusion reproducible', i: 'son-ruido' },

/* ---------------- memoria ---------------- */
{ t: 'anterior', g: 'memoria', s: 'anterior(k)   // la salida de hace k muestras',
  d: 'Devuelve lo que <code>sonido</code> ya ha devuelto: <code>anterior()</code> es la muestra justo anterior y <code>anterior(3)</code> la de tres atrás. Antes del principio vale cero. Con esto una fórmula deja de ser una función del tiempo y pasa a ser una [[fn-sucesiones|sucesión recurrente]], y ahí es donde aparecen los filtros.',
  e: 'var x = 0.4 * sierra(110, t);\nreturn 0.08 * x + 0.92 * anterior();   // filtro de paso bajo',
  v: 'anterior memoria realimentacion recurrencia filtro salida previa', i: 'son-filtros' },
{ t: 'antes', g: 'memoria', s: 'antes(s)   // la salida de hace s segundos',
  d: 'Lo mismo que <code>anterior</code>, pero contando en segundos: <code>antes(0.25)</code> es <code>anterior(round(0.25 * SR))</code>. Es la forma natural de escribir un eco, porque un eco se piensa en tiempo y no en muestras. Con retardos por debajo de 30 ms deja de oírse como eco y se convierte en un filtro de peine.',
  e: 'var x = 0.5 * decae(t, 0.03) * sin(TAU * 660 * t);\nreturn x + 0.5 * antes(0.25);   // eco cada cuarto de segundo',
  v: 'antes eco retardo delay segundos realimentacion', i: 'son-eco' },
{ t: 'Realimentación: por qué se recorta', g: 'memoria', p: true,
  d: 'Si la ganancia de una realimentación llega a 1, la serie geométrica no converge y el sonido crece sin parar. El sintetizador <strong>recorta a ±8</strong> para que una errata no se lleve por delante el navegador ni los oídos, y avisa de que hay recorte. No es una tolerancia: es un tope de seguridad, y significa que la fórmula está mal.',
  e: 'var x = 0.3 * decae(t, 0.02) * sin(TAU * 440 * t);\nreturn x + 0.7 * antes(0.2);   // 0.7 < 1: converge',
  v: 'realimentacion feedback desbocado acople recorte estabilidad', i: 'son-eco' },
{ t: 'i (el número de muestra)', g: 'memoria', s: 'function sonido(t, i) { ... }',
  d: 'El segundo parámetro: cuántas muestras se han calculado ya, empezando en 0. Cumple <code>t = i / SR</code>, así que para casi todo da igual cuál uses; hace falta cuando el algoritmo <strong>cuenta muestras</strong> en vez de segundos, como Karplus-Strong, donde las primeras $N$ muestras son el pellizco de ruido.',
  e: 'var N = 200;\nif (i < N) return 0.6 * ruido();\nreturn 0.996 * 0.5 * (anterior(N) + anterior(N + 1));',
  v: 'i indice muestra numero de muestra contador', i: 'son-ruido' },

/* ---------------- el sintetizador del curso ---------------- */
{ t: 't (el tiempo)', g: 'visor', s: 'function sonido(t) { ... }',
  d: 'El primer parámetro: el instante en segundos, con decimales. Empieza en 0 y avanza $1/44100$ en cada llamada. Todo el bloque se apoya en una idea que cabe aquí: <strong>un sonido es una función del tiempo</strong>, y programarlo es escribir esa función.',
  e: 'return 0.5 * sin(TAU * 200 * t * t);   // la frecuencia sube con t',
  v: 't tiempo segundos instante parametro', i: 'son-onda' },
{ t: 'SR', g: 'visor', s: 'SR   // 44100',
  d: 'La frecuencia de muestreo: cuántas muestras hay en un segundo. Sirve para pasar de segundos a muestras y al revés, y aparece siempre que un algoritmo cuenta muestras: el largo del bucle de una cuerda es <code>SR / frecuencia</code>. Por encima de <code>SR / 2</code> no se puede guardar ninguna frecuencia: es el límite de Nyquist.',
  e: 'var N = round(SR / 220 - 0.5);   // muestras por periodo de un La\nreturn 0.4 * sin(TAU * (SR / N) * t);',
  v: 'SR frecuencia de muestreo sample rate nyquist 44100', i: 'son-muestras' },
{ t: 'Los mandos', g: 'visor', p: true, s: 'mandos: [{ n: \'f\', min: 50, max: 2000, value: 440 }]',
  d: 'Los deslizadores que hay debajo de cada sintetizador son <strong>variables ya declaradas</strong> en tu código: si el mando se llama <code>f</code>, escribes <code>f</code> y ya está. El editor los colorea distinto, para que se vea de un vistazo qué viene de fuera. Al moverlos, el sonido se vuelve a calcular entero.',
  e: 'return 0.4 * sin(TAU * f * t);   // f es un mando',
  v: 'mandos deslizador slider parametro control variable externa', i: 'son-onda' },
{ t: 'Se calcula antes de sonar', g: 'visor', p: true,
  d: 'Al escribir, el sintetizador calcula los dos segundos enteros y los dibuja como onda y como espectro; el altavoz no entra hasta que pulsas «Tocar». Tiene tres consecuencias: los errores se ven sin oír nada, se puede leer el pasado con <code>anterior</code> porque ya está calculado, y <strong>nada puede reaccionar en tiempo real</strong> a una tecla o a un micrófono.',
  e: 'return 0.4 * sin(TAU * 440 * t) * decae(t, 1);',
  v: 'calcular sin sonar tiempo real diferido tocar audio', i: 'son-taller' },
{ t: 'Los errores, en castellano', g: 'visor', p: true,
  d: 'Si el código no compila o falla al ejecutarse, debajo del editor aparece el motivo <strong>con su número de línea</strong>, traducido: «sobra un paréntesis», «<em>fq</em> no existe», «la función no devuelve un número. ¿Falta el <code>return</code>?». Un <code>NaN</code> en la primera muestra se avisa; a partir de la segunda se toma como cero y sigue.',
  e: 'return 0.4 * sin(TAU * 440 * t);',
  v: 'error errores linea mensaje compilar NaN', i: 'son-onda' },
{ t: 'Lo que se guarda', g: 'visor', p: true,
  d: 'Lo que edites en un sintetizador se guarda en este navegador con el identificador del visor, y sigue ahí cuando vuelvas al tema. El botón <strong>Reiniciar</strong> devuelve el código original y borra lo guardado. No sale de tu ordenador: el curso no tiene servidor.',
  e: 'return 0.4 * triangulo(220, t);',
  v: 'guardar ediciones localStorage reiniciar progreso', i: 'son-taller' },

/* ---------------- recetas ---------------- */
{ t: 'Receta · una nota con envolvente', g: 'recetas', p: true,
  d: 'El esqueleto de cualquier instrumento: una forma de onda multiplicada por una envolvente. Cambiando <code>sierra</code> por <code>cuadrada</code>, <code>triangulo</code> o <code>sin</code> se recorre medio catálogo de timbres sin tocar nada más.',
  e: 'function sonido(t) {\n    var e = adsr(t, 0.01, 0.12, 0.55, 0.1, 1.2);\n    return 0.4 * e * sierra(220, t);\n}', x: 'solo',
  v: 'receta nota instrumento envolvente basico', i: 'son-envolvente' },
{ t: 'Receta · sumar armónicos', g: 'recetas', p: true,
  d: 'La [[av-fourier|serie de Fourier]] en cuatro líneas: el timbre se construye eligiendo cuánto pesa cada armónico. Con <code>1 / k</code> sale una sierra; con solo los impares, una cuadrada; con <code>1 / (k * k)</code>, un triángulo.',
  e: 'function sonido(t) {\n    var y = 0;\n    for (var k = 1; k <= 10; k++) y += sin(TAU * k * 110 * t) / k;\n    return 0.25 * y;\n}', x: 'solo',
  v: 'receta armonicos fourier aditiva timbre', i: 'son-armonicos' },
{ t: 'Receta · filtro de un polo', g: 'recetas', p: true,
  d: 'Quitar agudos con una [[fn-sucesiones|sucesión recurrente]]: la salida se mueve una fracción <code>a</code> hacia cada entrada nueva. Cuanto menor es <code>a</code>, más cerrado el filtro; el corte cae hacia $a\\,f_s/2\\pi$ hercios. Con <code>a</code> variable en el tiempo es la síntesis sustractiva entera.',
  e: 'function sonido(t) {\n    var x = 0.5 * sierra(55, t) * decae(t, 1.2);\n    var a = 0.02 + 0.5 * exp(-t / 0.25);       // el filtro se cierra\n    return a * x + (1 - a) * anterior();\n}', x: 'solo',
  v: 'receta filtro paso bajo sustractiva bajo corte', i: 'son-filtros' },
{ t: 'Receta · eco', g: 'recetas', p: true,
  d: 'Sumar el pasado. Cada repetición vale <code>g</code> veces la anterior, así que la cola es una [[fn-series|progresión geométrica]] y se apaga solo si <code>g</code> es menor que 1. Con retardos cortos y varios caminos «feos» (que no sean múltiplos entre sí) se convierte en reverberación.',
  e: 'function sonido(t) {\n    var x = 0.5 * decae(t, 0.03) * sin(TAU * 550 * t);\n    return x + 0.45 * antes(0.3);\n}', x: 'solo',
  v: 'receta eco delay reverberacion geometrica', i: 'son-eco' },
{ t: 'Receta · vibrato y FM', g: 'recetas', p: true,
  d: 'Un seno dentro de la fase de otro. Con el modulador lento es un vibrato; subiéndolo hasta la frecuencia de la portadora aparecen bandas laterales en $f_c \\pm k f_m$ y nace un timbre nuevo: es la [[son-modulacion|síntesis FM]]. Si la razón es entera suena a nota; si no, a campana.',
  e: 'function sonido(t) {\n    var indice = 4 * exp(-t / 0.5);\n    return 0.5 * exp(-t / 1.2) * sin(TAU * 220 * t + indice * sin(TAU * 220 * t));\n}', x: 'solo',
  v: 'receta fm vibrato modulacion campana dx7', i: 'son-modulacion' },
{ t: 'Receta · cuerda pulsada (Karplus-Strong)', g: 'recetas', p: true,
  d: 'Un periodo de ruido, repetido y promediado en cada vuelta: el ruido se convierte en una nota que se apaga por los agudos, igual que una cuerda de verdad. Tres líneas, ninguna física, y suena a guitarra. La frecuencia sale de $f_s/(N + \\frac12)$.',
  e: 'function sonido(t, i) {\n    var N = round(SR / nota(57) - 0.5);\n    if (i < N) return 0.8 * ruido();\n    return 0.996 * 0.5 * (anterior(N) + anterior(N + 1));\n}', x: 'solo',
  v: 'receta karplus strong cuerda guitarra pulsada', i: 'son-ruido' },
{ t: 'Receta · secuenciador', g: 'recetas', p: true,
  d: 'Parte entera y resto: <code>floor(t / Tp)</code> dice en qué pulso estamos y <code>t - n * Tp</code> cuánto llevamos dentro. La melodía es una lista leída con <code>% length</code>, y la envolvente se calcula con el reloj local <code>u</code>, nunca con <code>t</code>, o las notas no vuelven a atacar.',
  e: 'var m = [60, 64, 67, 72, 71, 67, 64, 0];\nfunction sonido(t) {\n    var Tp = 0.25, n = floor(t / Tp), u = t - n * Tp;\n    var k = m[n % m.length];\n    if (k === 0) return 0;\n    return 0.4 * adsr(u, 0.01, 0.08, 0.6, 0.05, Tp - 0.05) * sierra(nota(k), u);\n}', x: 'solo',
  v: 'receta secuenciador melodia ritmo bpm compas', i: 'son-secuencia' },
{ t: 'Receta · varias voces', g: 'recetas', p: true,
  d: 'Sumar. Dos instrumentos a la vez son dos funciones sumadas, cada uno con su reloj y su envolvente, y el conjunto escalado para no recortar. Es el principio de superposición de las ondas, que en el aire ocurre solo y aquí se escribe con un <code>+</code>.',
  e: 'function bajo(u) { return decae(u, 0.4) * sin(TAU * 110 * u); }\nfunction voz(u) { return decae(u, 0.2) * triangulo(440, u); }\nfunction sonido(t) {\n    return 0.35 * bajo(mod(t, 0.5)) + 0.25 * voz(mod(t, 0.25));\n}', x: 'solo',
  v: 'receta voces polifonia mezcla sumar capas', i: 'son-taller' },

/* ---------------- fuera del sintetizador ----------------
   Lo que el usuario pidio: si el lenguaje se usa en otros sitios, que la
   referencia los recoja. No se ejecutan (x: 'no'): estos objetos no
   existen dentro del cajon de arena del sintetizador. */
{ t: 'El curso está escrito en este lenguaje', g: 'fuera', p: true,
  d: 'Matebase entero —los 260 temas, las gráficas, el corrector de ejercicios, este mismo panel— son archivos <code>.js</code> en <strong>ES5 sin dependencias</strong>, que se abren desde <code>file://</code> sin instalar nada ni compilar nada. Si has escrito un sintetizador, ya sabes leer el código del curso: está en el repositorio, y lo que sigue es su mapa.',
  x: 'no', v: 'curso codigo fuente es5 sin dependencias repositorio', i: 'son-taller' },
{ t: 'Course.topic', g: 'fuera', s: 'Course.topic(\'mi-id\', function (p) { ... });',
  d: 'Así se escribe un tema. Un archivo <code>topics/&lt;id&gt;.js</code> con esa llamada, más una entrada en <code>curriculum.js</code>, y el tema aparece en el índice. Un tema que figura en el temario sin archivo no rompe nada: muestra su ficha con la etiqueta «en preparación».',
  e: 'Course.topic(\'mi-tema\', function (p) {\n    p.section(\'Idea principal\');\n    p.text(\'Texto con matemáticas en línea: $x^2 + 1$.\');\n    p.keys([\'lo que hay que recordar\']);\n});', x: 'no',
  v: 'Course topic tema escribir contribuir curriculum', i: 'son-taller' },
{ t: 'p (el constructor de páginas)', g: 'fuera', s: 'p.text(...)   p.formula(...)   p.exercise({...})',
  d: 'El objeto que recibe cada tema y con el que se construye la página: <code>p.puente</code>, <code>p.section</code>, <code>p.text</code>, <code>p.formula</code>, <code>p.table</code>, <code>p.demo</code>, <code>p.ejemplo</code>, <code>p.comprueba</code>, <code>p.exercise</code>, <code>p.trampas</code>, <code>p.keys</code>. Cada uno recibe un objeto con sus campos: el contenido del curso <strong>se declara, no se maqueta</strong>.',
  e: 'p.formula(\'y(t) = A\\\\operatorname{sen}(2\\\\pi f t)\', \'un tono puro\');\np.demo({\n    title: \'Míralo\',\n    predice: \'¿Qué pasará al subir la frecuencia?\',\n    build: function (host) { W.sinte(host, { codigo: \'...\' }); }\n});', x: 'no',
  v: 'p page constructor pagina declarativo text formula exercise', i: 'son-taller' },
{ t: 'W (el motor gráfico)', g: 'fuera', s: 'W.plot(host, {...})   W.sinte(host, {...})   W.shader(host, {...})',
  d: 'Todo lo que se mueve en el curso sale de aquí: <code>W.plot</code> dibuja funciones, <code>W.slider</code> pone un mando, <code>W.space3d</code> gira una escena, <code>W.shader</code> abre un editor de GLSL y <code>W.sinte</code> es <strong>el sintetizador de este bloque</strong>. Todos reciben un elemento donde meterse y un objeto de opciones.',
  e: 'W.sinte(host, {\n    id: \'mi-visor-1\',\n    mandos: [{ n: \'f\', label: \'frecuencia (Hz)\', min: 50, max: 2000, value: 440 }],\n    codigo: \'function sonido(t) {\\n    return 0.5 * sin(TAU * f * t);\\n}\\n\'\n});', x: 'no',
  v: 'W widgets plot slider sinte shader grafica motor', i: 'son-taller' },
{ t: 'SON (el motor del sonido)', g: 'fuera', s: 'SON.render(codigo, {dur: 2})   SON.espectro(muestras)   SON.iguales(a, b)',
  d: 'Lo que hay debajo del sintetizador, en <code>core/sonido.js</code>: <code>SON.compila</code> convierte tu texto en una función, <code>SON.render</code> devuelve las muestras con su pico y su nivel, <code>SON.espectro</code> hace la FFT y <code>SON.iguales</code> compara dos códigos por <strong>espectro, envolvente y nivel</strong>. Eso último es lo que permite que un ejercicio de código acepte cualquier solución que suene igual.',
  e: 'var r = SON.render(\'function sonido(t) { return sin(TAU * 440 * t); }\');\n// r.pico === 1, r.rms ≈ 0.707\nvar c = SON.iguales(codigoDelAlumno, codigoDeReferencia, { dur: 0.6 });\n// c.ok, c.espectro, c.envolvente, c.nivel', x: 'no',
  v: 'SON render espectro iguales fft motor corregir ejercicio', i: 'son-espectro' },
{ t: 'NN (el taller de redes neuronales)', g: 'fuera', s: 'NN.param([2, 12], r)   NN.mm(x, W)   NN.atras(L, params)',
  d: 'El otro sitio del curso donde se lee JavaScript: el [[ia-taller|taller de inteligencia artificial]] enseña, sin omitir nada, el código que hay dentro del botón «Entrenar». <code>NN.param</code> crea una matriz de pesos, <code>NN.mm</code> multiplica matrices, <code>NN.atras</code> calcula todas las derivadas de una vez y <code>opt.paso()</code> corrige los pesos. Las mismas reglas de este panel, otro dominio.',
  e: 'var W1 = NN.param([2, 12], r), b1 = NN.param([1, 12], r, 0.01);\nvar opt = NN.Adam([W1, b1], { lr: 0.03 });\nfor (var paso = 0; paso < 1000; paso++) {\n    NN.limpia();\n    var L = NN.entropiaCruzadaBinaria(NN.sigmoide(NN.mm(X, W1)), Y);\n    NN.atras(L, [W1, b1]);\n    opt.paso();\n}', x: 'no',
  v: 'NN red neuronal tensores derivacion automatica entrenar ia', i: 'ia-taller' },
{ t: 'Otros lenguajes del curso', g: 'fuera', p: true,
  d: 'JavaScript no es el único que se escribe aquí. En [[gfx-pixel|programación gráfica]] se escribe <strong>GLSL</strong>, que tiene su propio panel (el botón <code>{}</code>); en [[maq-ensamblador|máquinas]], el <strong>ensamblador</strong> de una CPU de juguete; en [[maq-puertas|circuitos]], una <strong>netlist</strong>; y en [[len-taller|lenguajes]], <strong>Pizca</strong>, un lenguaje de siete palabras que se compila a esa misma CPU.',
  x: 'no', v: 'glsl ensamblador netlist pizca lenguajes otros', i: 'len-taller' },

/* ---------------- lo que aqui no conviene ---------------- */
{ t: 'Math.random', g: 'cuidado', s: 'Math.random()   // funciona, pero no lo uses aquí',
  d: 'Funciona, y precisamente por eso hay que avisar: cada cálculo daría un sonido distinto, el espectro bailaría al mover un mando y <strong>los ejercicios de código dejarían de poder corregirse</strong>, porque comparan dos cálculos. Para azar, <code>ruido()</code>, que es reproducible.',
  e: 'return 0.4 * ruido();   // así, no con Math.random()',
  v: 'random azar aleatorio reproducible semilla', i: 'son-ruido' },
{ t: 'console.log', g: 'cuidado', s: 'console.log(x)   // 88 200 veces por segundo',
  d: 'También funciona, y también conviene pensarlo dos veces: <code>sonido</code> se llama 44 100 veces por segundo de sonido, así que un <code>console.log</code> suelto escribe decenas de miles de líneas y bloquea el navegador. Si hace falta mirar un valor, ponlo dentro de un <code>if (i === 0)</code>.',
  e: 'if (i === 0) console.log(\'SR =\', SR);\nreturn 0.4 * sin(TAU * 440 * t);',
  v: 'console log depurar imprimir consola', i: 'son-onda' },
{ t: 'NaN', g: 'cuidado', s: 'sqrt(-1)   0 / 0   log(-1)',
  d: '«No es un número», lo que devuelven las operaciones imposibles. Tiene una peculiaridad famosa: <strong>no es igual a sí mismo</strong>, y por eso se detecta con <code>x !== x</code>. Si tu función devuelve <code>NaN</code> en la primera muestra, el sintetizador lo dice; a partir de ahí lo toma como cero, así que un sonido con huecos raros suele ser un <code>NaN</code> escondido.',
  e: 'var y = sqrt(t - 0.5);           // NaN durante medio segundo\nreturn (y !== y) ? 0 : 0.4 * y * sin(TAU * 440 * t);',
  v: 'NaN no es un numero indefinido infinito imposible', i: 'son-onda' },
{ t: 'Bucles caros', g: 'cuidado', p: true,
  d: 'Un bucle dentro de <code>sonido</code> se ejecuta entero <em>en cada muestra</em>: sumar 50 armónicos son más de cuatro millones de senos por segundo de sonido, y el cálculo tarda. No está prohibido —el curso lo hace con diez o doce—, pero si el sintetizador se queda pensando, ahí está la razón.',
  e: 'var y = 0;\nfor (var k = 1; k <= 12; k++) y += sin(TAU * k * 110 * t) / k;\nreturn 0.25 * y;',
  v: 'rendimiento lento bucle coste optimizar', i: 'son-armonicos' },
{ t: 'Variables sin declarar', g: 'cuidado', s: 'x = 3;    // sin var: funciona y es mala idea',
  d: 'Aquí no hay <code>use strict</code>, así que asignar a un nombre no declarado crea una variable global en vez de dar error. Es cómodo y traicionero: un nombre mal escrito no se queja, y la variable se queda viva entre muestras sin que lo hayas pedido. Declara siempre con <code>var</code>, <code>let</code> o <code>const</code>.',
  e: 'var suma = 0;                    // con var: nace y muere en cada muestra\nsuma += sin(TAU * 440 * t);\nreturn 0.4 * suma;',
  v: 'global sin declarar strict errata variable fugada', i: 'son-taller' },
{ t: 'Esperar tiempo real', g: 'cuidado', p: true,
  d: 'No hay teclado, ni micrófono, ni <code>setTimeout</code> que valga: cuando suena, el sonido ya está calculado entero. Lo que sí se puede hacer es mover un mando, que recalcula y sigue sonando. Para sonido que reacciona en el momento hacen falta otras herramientas, y el [[son-taller|taller]] dice cuáles.',
  e: 'return 0.4 * sin(TAU * f * t);   // f cambia al mover el mando',
  v: 'tiempo real interactivo teclado midi setTimeout audio', i: 'son-taller' }

]
};
