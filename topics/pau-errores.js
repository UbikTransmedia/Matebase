/* Tema: Los errores que mas puntos cuestan */
Course.topic('pau-errores', function (p) {

  p.puente('Cada tema del curso termina con una lista de trampas habituales. Este tema las reúne, las ' +
    'clasifica por bloque y añade lo que más importa en un examen y menos se explica: la diferencia ' +
    'entre equivocarse en una cuenta y equivocarse en una idea.');

  p.text('Casi nadie suspende matemáticas por no saber nada. Se pierden puntos, sobre todo, por un ' +
    'puñado de errores que se repiten año tras año y alumno tras alumno: siempre los mismos, en los ' +
    'mismos sitios. La buena noticia es que un error que tiene nombre se reconoce, y un error que se ' +
    'reconoce se evita.');

  p.text('Los criterios de corrección de los exámenes de acceso suelen distinguir dos tipos de fallo. Un ' +
    '<strong>error de cálculo</strong> con un planteamiento correcto resta poco. Un <strong>error de ' +
    'concepto</strong> —aplicar una propiedad que no existe, confundir dos ideas— puede anular el apartado ' +
    'entero, aunque las cuentas estén perfectas. Este tema recoge los errores de concepto más frecuentes, ' +
    'cada uno con su explicación, su versión correcta y un enlace al tema donde se trabaja.');

  p.note('Lee cada fila y pregúntate si alguna vez lo has hecho. Si la respuesta es «sí» o «no estoy ' +
    'seguro», sigue el enlace y haz un par de ejercicios de ese tema: los ejercicios del curso detectan ' +
    'muchos de estos errores y te avisan cuando los cometes.', 'ok', 'Cómo usar el catálogo');

  p.comprueba('Ana plantea bien un área, parte el intervalo en el corte con el eje y se equivoca al restar en la regla de Barrow: da $7/2$ en vez de $9/2$. Bruno integra de un tirón sin partir y obtiene $5/2$, con las cuentas perfectas. ¿Quién pierde más puntos?', [
    { t: 'Ana: su resultado está mal', ok: false, por: 'Es un error de cálculo con un planteamiento correcto: resta poco. Quien corrige ve que sabe qué es un área y cómo se calcula.' },
    { t: 'Bruno: su resultado está mal y el método también', ok: true, por: 'Es un error de concepto: no sabe que la integral resta donde la función es negativa. Puede anular el apartado aunque las cuentas sean impecables.' },
    { t: 'Los dos igual: ninguno ha acertado', ok: false, por: 'Los criterios de corrección distinguen los dos casos. El procedimiento vale más que el número final, y por eso conviene escribirlo entero.' }
  ]);

  p.ejemplo({
    title: 'Un apartado, comprobado en un minuto',
    enunciado: 'Has terminado el apartado «Halla el área encerrada entre $f(x) = x^2 - 4$ y el eje $X$ en $[0, 3]$» y te ha salido $-3$. Antes de pasar al siguiente, pásale la lista de comprobación.',
    pasos: [
      { t: '<strong>¿Tiene sentido?</strong> Un área no puede ser negativa. Algo está mal, y esa señal vale oro: se ha detectado antes de entregar.', antes: 'Mira el signo del resultado. ¿Puede ser?' },
      { t: '<strong>¿Qué se pidió?</strong> Área, no integral. $\\displaystyle\\int_0^3 (x^2 - 4)\\,dx = -3$ es correcto como integral, pero no es lo que preguntan.', antes: 'Relee la pregunta: ¿integral o área?' },
      { t: '<strong>¿Dónde corta el eje?</strong> $x^2 - 4 = 0$ en $x = 2$, que está dentro de $[0, 3]$. Ahí hay que partir: entre 0 y 2 la función es negativa y la integral resta.' },
      { t: '<strong>Rehacer.</strong> $\\displaystyle\\int_0^2 = -\\frac{16}{3}$ y $\\displaystyle\\int_2^3 = \\frac{7}{3}$. Área $= \\frac{16}{3} + \\frac{7}{3} = \\frac{23}{3}$. Y comprobación: $-\\frac{16}{3} + \\frac{7}{3} = -3$, la integral de antes ✓.', antes: 'Calcula cada trozo por separado y suma en valor absoluto.' },
      { t: '<strong>Cerrar.</strong> «El área vale $23/3$ unidades cuadradas.» Con unidades y con una frase.' }
    ],
    cierre: 'Un minuto de comprobación ha convertido un error de concepto, que podía anular el apartado, en la respuesta correcta. La lista es siempre la misma: sentido, pregunta, cortes, rehacer, cerrar.'
  });

  /* ---------------------------------------------------------------- */
  p.section('Álgebra: matrices y sistemas');

  p.table(['El error', 'Por qué falla', 'Lo correcto', 'Tema'], [
    ['$|kA| = k\\,|A|$', 'Multiplicar la matriz por $k$ multiplica <em>todas</em> sus filas, y cada fila aporta un factor.', '$|kA| = k^n|A|$ para una matriz de orden $n$', '[[al-determinantes]]'],
    ['$|A + B| = |A| + |B|$', 'El determinante no es lineal respecto de la matriz entera, solo respecto de cada fila por separado.', 'Sumar primero las matrices y calcular después', '[[al-determinantes]]'],
    ['$(AB)^t = A^tB^t$', 'Al trasponer un producto, el orden de los factores se invierte.', '$(AB)^t = B^tA^t$ y $(AB)^{-1} = B^{-1}A^{-1}$', '[[al-matrices]]'],
    ['De $AX = B$ deducir $X = BA^{-1}$', 'El producto de matrices no es conmutativo: hay que multiplicar por el mismo lado en los dos miembros.', '$X = A^{-1}B$; y de $XA = B$, $X = BA^{-1}$', '[[al-inversa]]'],
    ['De $AB = 0$ deducir $A = 0$ o $B = 0$', 'Hay matrices no nulas cuyo producto es la matriz nula.', 'Solo se puede «simplificar» $A$ si tiene inversa', '[[al-matrices]]'],
    ['$\\operatorname{rg} A = 2 < 3$ incógnitas, luego compatible indeterminado', 'Antes de mirar el número de incógnitas hay que comparar los rangos de $A$ y de $A^*$.', 'Si $\\operatorname{rg} A \\ne \\operatorname{rg} A^*$, el sistema es incompatible', '[[al-discusion]]'],
    ['Discutir solo los valores que anulan el determinante', 'El caso general, «$m$ distinto de esos valores», también es parte de la discusión.', 'Cubrir todos los valores del parámetro', '[[al-discusion]]']
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Geometría y análisis');

  p.table(['El error', 'Por qué falla', 'Lo correcto', 'Tema'], [
    ['Distancia de punto a plano sin dividir', 'Sustituir el punto en la ecuación solo da la distancia si el vector normal es unitario.', '$d(P, \\pi) = \\dfrac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$', '[[ge-metrico]]'],
    ['Ángulo recta-plano con el coseno', 'El ángulo entre $\\vec v$ y $\\vec n$ es el complementario del que se busca.', 'Se usa el seno: $\\operatorname{sen}\\alpha = \\dfrac{|\\vec v\\cdot\\vec n|}{|\\vec v|\\,|\\vec n|}$', '[[ge-metrico]]'],
    ['$1^\\infty = 1$', 'La base se acerca a 1 sin llegar, y el exponente crece sin límite: es una indeterminación.', '$\\lim f^{\\,g} = e^{\\lim g\\,(f - 1)}$', '[[fn-limites]]'],
    ['$\\dfrac{k}{0} = \\infty$ sin más', 'El signo del infinito depende del lado por el que se acerque.', 'Estudiar los límites laterales', '[[fn-limites]]'],
    ['Aplicar L\'Hôpital a cualquier cociente', 'La regla solo vale para $\\frac{0}{0}$ y $\\frac{\\infty}{\\infty}$.', 'Comprobar la indeterminación antes de derivar', '[[fn-lhopital]]'],
    ['Derivar una composición sin la regla de la cadena', 'La derivada de lo de dentro también cuenta.', '$\\bigl(f(g(x))\\bigr)\' = f\'(g(x))\\cdot g\'(x)$', '[[fn-derivadas]]'],
    ['Una función a trozos es derivable si cada trozo lo es', 'En el punto de unión puede no ser continua, o tener derivadas laterales distintas.', 'Continuidad primero; después, derivadas laterales iguales', '[[fn-derivabilidad]]'],
    ['$f\'(a) = 0$, luego hay un extremo', 'La derivada también se anula en puntos de inflexión con tangente horizontal, como $x^3$ en $0$.', 'Mirar el cambio de signo de $f\'$ o el signo de $f\'\'$', '[[fn-aplicaciones]]'],
    ['Área = integral definida, sin más', 'Donde la función es negativa, la integral resta.', 'Partir el intervalo en los cortes con el eje y sumar valores absolutos', '[[fn-integral-def]]'],
    ['$\\int \\frac{1}{x}\\,dx = \\ln x$', 'Faltan el valor absoluto y la constante de integración.', '$\\int \\frac{1}{x}\\,dx = \\ln|x| + C$', '[[fn-integral-indef]]']
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Probabilidad y estadística');

  p.table(['El error', 'Por qué falla', 'Lo correcto', 'Tema'], [
    ['$P(A|B) = P(B|A)$', 'La probabilidad de dar positivo estando enfermo no es la de estar enfermo habiendo dado positivo.', 'Invertir una condicionada exige el teorema de Bayes', '[[pe-condicionada]]'],
    ['Incompatibles, luego independientes', 'Si no pueden ocurrir a la vez, saber que ocurrió uno cambia muchísimo la probabilidad del otro.', 'Incompatibles: $P(A \\cap B) = 0$. Independientes: $P(A \\cap B) = P(A)\\,P(B)$', '[[pe-condicionada]]'],
    ['$P(A \\cup B) = P(A) + P(B)$ siempre', 'Si pueden ocurrir a la vez, la intersección se cuenta dos veces.', '$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$', '[[pe-probabilidad]]'],
    ['Binomial sin los fracasos', 'Cada ordenación exige también que los demás intentos fallen.', '$P(X = k) = \\begin{pmatrix} n \\\\ k \\end{pmatrix} p^k (1 - p)^{n - k}$', '[[pe-binomial]]'],
    ['Leer $P(Z > z)$ directamente en la tabla', 'La tabla da la probabilidad de quedar por debajo.', '$P(Z > z) = 1 - \\Phi(z)$', '[[pe-normal]]'],
    ['En una variable continua, $P(X = a) > 0$', 'Un solo punto no tiene anchura, y la probabilidad es un área.', '$P(X = a) = 0$, así que $P(X \\le a) = P(X < a)$', '[[pe-continuas]]'],
    ['Intervalo con $\\sigma$ en lugar de $\\frac{\\sigma}{\\sqrt{n}}$', 'La media de una muestra varía mucho menos que un dato suelto.', '$\\overline{x} \\pm z_{\\alpha/2}\\,\\dfrac{\\sigma}{\\sqrt{n}}$', '[[pe-inferencia]]'],
    ['Redondear hacia abajo el tamaño de la muestra', 'Con una muestra más pequeña el error supera el pedido.', 'Siempre hacia arriba: $n \\ge 96{,}04$ da $n = 97$', '[[pe-inferencia]]'],
    ['No rechazar $H_0$ es demostrar que es cierta', 'Solo significa que la muestra no da pruebas suficientes contra ella.', 'Decir «no hay evidencia para rechazar $H_0$»', '[[pe-contraste]]']
  ]);

  /* ---------------------------------------------------------------- */
  p.section('Los errores que no son de matemáticas');

  p.list([
    '<strong>No contestar lo que se pide.</strong> Piden el punto y se da solo la $x$; piden el área y se da la integral; piden «justifica» y se da un número. Al terminar un apartado, vuelve a leer la pregunta.',
    '<strong>No justificar.</strong> «Se ve en la gráfica» o un resultado sin cuentas no es una respuesta. Cita el teorema que usas y comprueba sus hipótesis: Bolzano exige continuidad en un intervalo cerrado.',
    '<strong>Saltarse pasos.</strong> Si un paso no está escrito, quien corrige no puede saber si lo sabías. Y un error de cálculo en un desarrollo visible resta mucho menos que un resultado erróneo sin desarrollo.',
    '<strong>No comprobar.</strong> La solución de un sistema se sustituye; un área no puede ser negativa; una probabilidad no puede valer 1,3; un número de personas no puede ser fraccionario.',
    '<strong>Olvidar el contexto.</strong> En un problema con enunciado, el resultado final se da con unidades y con una frase que lo interprete.'
  ]);

  p.note('Esta lista es media herramienta; la otra media es medirse. El ' +
    '[[pau-mapa|mapa del temario de 2.º]] dice de qué vas y de qué no con tu propio progreso; el ' +
    '[[pau-formulario|formulario]] se monta solo con las fórmulas de los temas y se imprime para ' +
    'tenerlo al lado mientras practicas; y los simulacros de ' +
    '[[pau-simulacro-mii|Matemáticas II]] y de [[pau-simulacro-mcs|MACS II]] sacan preguntas de los ' +
    'temas, con cronómetro si quieres y sin soluciones hasta entregar. Leer errores ajenos está bien; ' +
    'cometerlos en un simulacro y no en junio, está mejor.', 'ok', 'Y ahora, medirse');

  p.hist('Los grandes matemáticos también se equivocan, y de sus errores se aprende. Pierre de Fermat ' +
    'estaba convencido de que todos los números de la forma $2^{2^n} + 1$ eran primos; lo son los cinco ' +
    'primeros, y en 1732 Leonhard Euler encontró que el siguiente, $4\\,294\\,967\\,297$, es $641 \\cdot ' +
    '6\\,700\\,417$. En 1879 Alfred Kempe publicó una demostración del teorema de los cuatro colores que ' +
    'todo el mundo dio por buena durante once años, hasta que Percy Heawood encontró el paso que fallaba. ' +
    'El teorema no se demostró de verdad hasta 1976, y con ayuda de un ordenador.');

  p.util('Los oficios en los que un error cuesta caro no confían en la memoria, sino en listas de ' +
    'comprobación. La aviación las adoptó en 1935, después de que un prototipo de bombardero se estrellara ' +
    'en su vuelo de demostración porque sus pilotos, muy expertos, olvidaron quitar un bloqueo de los ' +
    'timones. Los quirófanos las usan desde hace años para confirmar paciente, intervención y material ' +
    'antes de empezar. Tener tu propia lista de «errores que suelo cometer» y repasarla al final de cada ' +
    'examen es exactamente la misma idea.');

  /* ================= EJERCICIOS ================= */
  var OPC = [1, 2, 3, 4].map(function (i) { return { t: 'Paso ' + i, v: String(i) }; });

  /* Ejercicio de analisis de errores: un razonamiento de cuatro pasos con
     un fallo de concepto; se pide el primer paso incorrecto. Cada caso es
     una funcion que recibe el generador y devuelve el razonamiento. */
  function buscaError(titulo, nivel, casos) {
    p.exercise({
      title: titulo,
      level: nivel,
      gen: function (r) { return r.pick(casos)(r); },
      ask: function (d) {
        return d.enun + '<br>' + d.pasos.map(function (s, i) {
          return '<strong>Paso ' + (i + 1) + '.</strong> ' + s;
        }).join('<br>') + '<br>¿Cuál es el <strong>primer</strong> paso incorrecto?';
      },
      fields: [{ name: 't', label: 'Primer paso incorrecto', opts: OPC }],
      sol: function (d) { return { t: String(d.malo + 1) }; },
      hint: function (d) {
        return ['Lee cada paso por separado y pregúntate si se deduce de lo anterior, no si el resultado final «suena bien».',
          'Fíjate en ' + d.pista + '.'];
      },
      steps: function (d) { return ['El primer paso incorrecto es el ' + (d.malo + 1) + '. ' + d.porque, 'Lo correcto: ' + d.bien]; },
      answer: function (d) { return 'Paso ' + (d.malo + 1); }
    });
  }

  buscaError('Encuentra el error: matrices y sistemas', 'medio', [
    function (r) {
      var d = r.pm(1, 6), k = r.pick([2, 3]);
      return {
        enun: 'Se sabe que $A$ es una matriz cuadrada de orden 3 con $|A| = ' + d + '$, y se quiere calcular $|' + k + 'A|$.',
        pasos: ['$A$ tiene 3 filas y su determinante vale $' + d + '$.',
          'La matriz $' + k + 'A$ se obtiene multiplicando por ' + k + ' todos los elementos de $A$.',
          'Por tanto, $|' + k + 'A| = ' + k + '\\cdot|A| = ' + (k * d) + '$.',
          'En consecuencia, $|(' + k + 'A)^{-1}| = ' + ML.F(1, k * d).tex() + '$.'],
        malo: 2, pista: 'cuántas filas quedan multiplicadas por ' + k,
        porque: 'Multiplicar una fila por ' + k + ' multiplica el determinante por ' + k + ', y aquí se multiplican las tres filas.',
        bien: '$|' + k + 'A| = ' + k + '^3\\cdot|A| = ' + (k * k * k * d) + '$.'
      };
    },
    function (r) {
      var d = r.pm(1, 9);
      return {
        enun: 'Se quiere resolver la ecuación matricial $AX = B$, sabiendo que $|A| = ' + d + '$.',
        pasos: ['Como $|A| \\ne 0$, la matriz $A$ tiene inversa.',
          'Se multiplican los dos miembros por $A^{-1}$: $A^{-1}AX = BA^{-1}$.',
          'Como $A^{-1}A = I$, queda $X = BA^{-1}$.',
          'Basta calcular $A^{-1}$ y hacer el producto $BA^{-1}$.'],
        malo: 1, pista: 'por qué lado se multiplica en cada miembro',
        porque: 'El producto de matrices no es conmutativo: hay que multiplicar por $A^{-1}$ por el mismo lado en los dos miembros. En el izquierdo se ha hecho por la izquierda, y en el derecho, por la derecha.',
        bien: '$A^{-1}AX = A^{-1}B$, así que $X = A^{-1}B$.'
      };
    },
    function (r) {
      var a = r.pm(1, 4), b = r.pm(1, 4), c = r.pm(1, 6), e = r.pm(1, 5), f = r.pm(1, 5), g = r.pm(1, 9);
      if (e === 2 * a) return null;
      var izq = ML.termTex(e - 2 * a, 'y', 1, true) + ML.termTex(f - 2 * b, 'z', 1, false);
      return {
        enun: 'Se aplica el método de Gauss al sistema $\\begin{cases} x ' + ML.termTex(a, 'y', 1, false) + ML.termTex(b, 'z', 1, false) + ' = ' + c +
          ' \\\\ 2x ' + ML.termTex(e, 'y', 1, false) + ML.termTex(f, 'z', 1, false) + ' = ' + g + ' \\end{cases}$',
        pasos: ['Para eliminar la $x$ de la segunda ecuación se hace $E_2 \\to E_2 - 2E_1$.',
          'La segunda ecuación queda $' + izq + ' = ' + (g + 2 * c) + '$.',
          'El sistema queda escalonado, con la $x$ solo en la primera ecuación.',
          'Hay dos ecuaciones con pivote y tres incógnitas, así que el sistema es compatible indeterminado.'],
        malo: 1, pista: 'el término independiente de la nueva ecuación',
        porque: 'Al restar el doble de la primera ecuación hay que restar también el doble de su término independiente.',
        bien: '$' + izq + ' = ' + g + ' - 2\\cdot' + (c < 0 ? '(' + c + ')' : c) + ' = ' + (g - 2 * c) + '$.'
      };
    },
    function (r) {
      var m = r.pm(1, 5);
      return {
        enun: 'Se discute un sistema de tres ecuaciones con tres incógnitas que depende de un parámetro $m$, y se estudia el caso $m = ' + m + '$.',
        pasos: ['Para $m = ' + m + '$, el determinante de la matriz de coeficientes vale $|A| = 0$.',
          'Hay un menor de orden 2 de $A$ distinto de cero, así que $\\operatorname{rg} A = 2$.',
          'Orlando ese menor con la columna de los términos independientes sale un menor de orden 3 no nulo, así que $\\operatorname{rg} A^* = 3$.',
          'Como $\\operatorname{rg} A = 2$ es menor que el número de incógnitas, el sistema es compatible indeterminado.'],
        malo: 3, pista: 'qué dice el teorema de Rouché-Fröbenius cuando los dos rangos no coinciden',
        porque: 'Antes de comparar con el número de incógnitas hay que comparar los dos rangos entre sí.',
        bien: 'Como $\\operatorname{rg} A = 2 \\ne 3 = \\operatorname{rg} A^*$, el sistema es <strong>incompatible</strong>. Solo cuando los rangos coinciden se mira el número de incógnitas.'
      };
    }
  ]);

  buscaError('Encuentra el error: análisis y geometría', 'medio', [
    function (r) {
      var a = r.pm(1, 6), b = r.pm(1, 6);
      if (a === b) return null;
      var num = ML.polyTex([1, a]), den = ML.polyTex([1, b]);
      return {
        enun: 'Se quiere estudiar la monotonía de $f(x) = \\dfrac{' + num + '}{' + den + '}$.',
        pasos: ['Por la regla del cociente, $\\left(\\dfrac{u}{v}\\right)\' = \\dfrac{u\'v - uv\'}{v^2}$.',
          '$f\'(x) = \\dfrac{1\\cdot(' + num + ') - (' + den + ')\\cdot 1}{(' + den + ')^2}$.',
          '$f\'(x) = \\dfrac{' + (a - b) + '}{(' + den + ')^2}$.',
          'Como el signo de $f\'$ es el de $' + (a - b) + '$, la función es ' + (a > b ? 'creciente' : 'decreciente') + ' en cada intervalo de su dominio.'],
        malo: 1, pista: 'qué es $u$ y qué es $v$ en la fórmula',
        porque: 'Se han intercambiado los papeles en el numerador: la derivada de $u$ va multiplicada por $v$, que es el denominador.',
        bien: '$f\'(x) = \\dfrac{1\\cdot(' + den + ') - (' + num + ')\\cdot 1}{(' + den + ')^2} = \\dfrac{' + (b - a) + '}{(' + den + ')^2}$, así que la función es ' + (b > a ? 'creciente' : 'decreciente') + '.'
      };
    },
    function (r) {
      var c = r.int(1, 4), t = r.int(1, 5);
      if (t === c) return null;
      var mal = ML.F(t * t - c * c, 2);
      return {
        enun: 'Se pide el área del recinto limitado por la gráfica de $f(x) = x - ' + c + '$, el eje $X$ y las rectas $x = 0$ y $x = ' + (c + t) + '$.',
        pasos: ['La función se anula en $x = ' + c + '$, que está dentro del intervalo.',
          'El área es $\\displaystyle\\int_0^{' + (c + t) + '} (x - ' + c + ')\\,dx$.',
          'Una primitiva es $\\dfrac{x^2}{2} - ' + c + 'x$, y la regla de Barrow da $' + mal.tex() + '$.',
          'Por tanto, el área vale $' + mal.tex() + '$ unidades cuadradas.'],
        malo: 1, pista: 'el signo de la función a cada lado de $x = ' + c + '$',
        porque: 'Entre $0$ y $' + c + '$ la función es negativa, y ahí la integral resta en lugar de sumar. El primer paso avisa del corte: hay que usarlo.',
        bien: 'se parte en $x = ' + c + '$. Entre $0$ y $' + c + '$ la integral vale $-' + ML.F(c * c, 2).tex() + '$, y se toma su valor absoluto; entre $' + c + '$ y $' + (c + t) + '$ vale $' + ML.F(t * t, 2).tex() + '$. Área $= ' + ML.F(c * c + t * t, 2).tex() + '$.'
      };
    },
    function (r) {
      var a = r.int(2, 5);
      return {
        enun: 'Se quiere calcular $\\displaystyle\\lim_{x \\to \\infty}\\left(1 + \\frac{1}{x}\\right)^{' + a + 'x}$.',
        pasos: ['La base, $1 + \\frac{1}{x}$, tiende a $1$.',
          'El exponente, $' + a + 'x$, tiende a infinito.',
          'Como $1$ elevado a cualquier número es $1$, el límite vale $1$.',
          'La función tiene, por tanto, una asíntota horizontal $y = 1$.'],
        malo: 2, pista: 'si $1^\\infty$ es un número o una indeterminación',
        porque: '$1^\\infty$ es una indeterminación: la base se acerca a 1 pero no vale 1, y el exponente crece sin límite. El resultado depende de a qué ritmo ocurre cada cosa.',
        bien: '$\\lim f^{\\,g} = e^{\\lim g\\,(f - 1)} = e^{\\lim ' + a + 'x\\cdot\\frac{1}{x}} = e^{' + a + '}$.'
      };
    },
    function (r) {
      var A = r.pm(1, 4), B = r.pm(0, 4), C = r.pm(1, 4), D = r.pm(0, 9), P = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      var val = A * P[0] + B * P[1] + C * P[2] + D, nn = A * A + B * B + C * C;
      if (!val) return null;
      var plano = ML.termTex(A, 'x', 1, true) + ML.termTex(B, 'y', 1, false) + ML.termTex(C, 'z', 1, false) + ML.termTex(D, '', 0, false) + ' = 0';
      return {
        enun: 'Se quiere hallar la distancia del punto $P(' + P.join(',\\ ') + ')$ al plano $\\pi: ' + plano + '$.',
        pasos: ['Un vector normal al plano es $\\vec n = (' + [A, B, C].join(',\\ ') + ')$.',
          'Al sustituir las coordenadas de $P$ en la ecuación del plano se obtiene $' + val + '$.',
          'La distancia es el valor absoluto de ese número: $d(P, \\pi) = ' + Math.abs(val) + '$.',
          'Así que $P$ está a ' + Math.abs(val) + ' unidades del plano.'],
        malo: 2, pista: 'si el vector normal tiene módulo 1',
        porque: 'El número que sale al sustituir solo es la distancia si el vector normal es unitario. Aquí su módulo es $\\sqrt{' + nn + '}$.',
        bien: '$d(P, \\pi) = \\dfrac{|' + val + '|}{\\sqrt{' + nn + '}} \\approx ' + U.fmt(Math.abs(val) / Math.sqrt(nn), 3) + '$.'
      };
    },
    function (r) {
      var a = r.int(2, 5);
      return {
        enun: 'Se quiere derivar $f(x) = \\operatorname{sen}(' + a + 'x^2)$ y calcular $f\'(1)$.',
        pasos: ['$f$ es una composición: el seno aplicado a $' + a + 'x^2$.',
          'La derivada de $\\operatorname{sen} u$ respecto de $u$ es $\\cos u$.',
          'Por tanto, $f\'(x) = \\cos(' + a + 'x^2)$.',
          'Y $f\'(1) = \\cos ' + a + '$.'],
        malo: 2, pista: 'qué falta al derivar una composición',
        porque: 'Falta la regla de la cadena: la derivada de la función de fuera, evaluada en la de dentro, se multiplica por la derivada de la de dentro.',
        bien: '$f\'(x) = \\cos(' + a + 'x^2)\\cdot ' + (2 * a) + 'x$, así que $f\'(1) = ' + (2 * a) + '\\cos ' + a + '$.'
      };
    }
  ]);

  buscaError('Encuentra el error: probabilidad', 'medio', [
    function (r) {
      var pe = r.pick([1, 2, 5]) / 100, s = r.pick([90, 95, 99]) / 100, f = r.pick([5, 10]) / 100;
      var pos = pe * s + (1 - pe) * f, post = pe * s / pos;
      return {
        enun: 'Una enfermedad afecta al ' + U.fmt(pe * 100, 0) + ' % de la población. Un test da positivo en el ' + U.fmt(s * 100, 0) +
          ' % de los enfermos y en el ' + U.fmt(f * 100, 0) + ' % de los sanos. Se pide la probabilidad de estar enfermo si el test da positivo.',
        pasos: ['Se llama $E$ a estar enfermo y $+$ a dar positivo: se pide $P(E|+)$.',
          'Por la probabilidad total, $P(+) = ' + U.fmt(pe, 2) + '\\cdot ' + U.fmt(s, 2) + ' + ' + U.fmt(1 - pe, 2) + '\\cdot ' + U.fmt(f, 2) + ' = ' + U.fmt(pos, 4) + '$.',
          'Como el test acierta con los enfermos con probabilidad $' + U.fmt(s, 2) + '$, resulta $P(E|+) = ' + U.fmt(s, 2) + '$.',
          'Así que un positivo significa estar enfermo con una probabilidad del ' + U.fmt(s * 100, 0) + ' %.'],
        malo: 2, pista: 'la diferencia entre $P(+|E)$ y $P(E|+)$',
        porque: 'Se ha confundido $P(+|E)$, que es el dato, con $P(E|+)$, que es lo que se pide. Dar la vuelta a una condicionada exige el teorema de Bayes.',
        bien: '$P(E|+) = \\dfrac{P(E)\\,P(+|E)}{P(+)} = \\dfrac{' + U.fmt(pe * s, 4) + '}{' + U.fmt(pos, 4) + '} \\approx ' + U.fmt(post, 3) + '$: mucho menos de lo que parece, porque los sanos son muchísimos más que los enfermos.'
      };
    },
    function (r) {
      var pa = r.int(1, 4) / 10, pb = r.int(1, 5) / 10;
      return {
        enun: 'Los sucesos $A$ y $B$ son incompatibles, con $P(A) = ' + U.fmt(pa, 1) + '$ y $P(B) = ' + U.fmt(pb, 1) + '$. Se pide $P(A \\cup B)$.',
        pasos: ['Incompatibles significa que no pueden ocurrir a la vez.',
          'Por tanto son independientes, y $P(A \\cap B) = P(A)\\cdot P(B) = ' + U.fmt(pa * pb, 2) + '$.',
          '$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$.',
          'Sustituyendo, $P(A \\cup B) = ' + U.fmt(pa + pb - pa * pb, 2) + '$.'],
        malo: 1, pista: 'qué significa que dos sucesos sean independientes',
        porque: 'Incompatibles e independientes son casi lo contrario: si ocurre $A$, $B$ ya no puede ocurrir, así que saber que ha pasado $A$ cambia por completo la probabilidad de $B$.',
        bien: 'al ser incompatibles, $P(A \\cap B) = 0$ y $P(A \\cup B) = ' + U.fmt(pa, 1) + ' + ' + U.fmt(pb, 1) + ' = ' + U.fmt(pa + pb, 1) + '$.'
      };
    },
    function (r) {
      var z = r.pick([0.5, 1, 1.5, 2]), PHI = { 0.5: 0.6915, 1: 0.8413, 1.5: 0.9332, 2: 0.9772 };
      var mu = r.pick([50, 60, 100, 170]), sigma = r.pick([4, 6, 8, 10]), k = mu + z * sigma;
      return {
        enun: 'Una variable $X$ sigue una normal $N(' + mu + ',\\ ' + sigma + ')$. Se pide $P(X > ' + k + ')$.',
        pasos: ['Se tipifica: $z = \\dfrac{' + k + ' - ' + mu + '}{' + sigma + '} = ' + U.fmt(z, 1) + '$.',
          '$P(X > ' + k + ') = P(Z > ' + U.fmt(z, 1) + ')$.',
          'En la tabla aparece $' + U.fmt(PHI[z], 4) + '$ para $z = ' + U.fmt(z, 1) + '$, así que $P(X > ' + k + ') = ' + U.fmt(PHI[z], 4) + '$.',
          'Es decir, más de la mitad de los valores superan ' + k + '.'],
        malo: 2, pista: 'qué probabilidad da exactamente la tabla',
        porque: 'La tabla da $\\Phi(z) = P(Z \\le z)$, la probabilidad de quedar por debajo. El sentido común lo delata: ' + k + ' está por encima de la media, así que menos de la mitad de los valores pueden superarlo.',
        bien: '$P(Z > ' + U.fmt(z, 1) + ') = 1 - \\Phi(' + U.fmt(z, 1) + ') = ' + U.fmt(1 - PHI[z], 4) + '$.'
      };
    },
    function (r) {
      var n = r.int(5, 10), k = r.int(1, 4), pp = r.pick([0.2, 0.3, 0.4, 0.5]);
      var C = ML.comb(n, k), mal = C * Math.pow(pp, k), bien = mal * Math.pow(1 - pp, n - k);
      var base = '(' + U.fmt(pp, 1) + ')', baseF = '(' + U.fmt(1 - pp, 1) + ')';
      return {
        enun: 'Se repite ' + n + ' veces, de forma independiente, un experimento con probabilidad de éxito $' + U.fmt(pp, 1) + '$. Se pide la probabilidad de obtener exactamente ' + k + (k === 1 ? ' éxito.' : ' éxitos.'),
        pasos: ['El número de éxitos sigue una binomial $B(' + n + ',\\ ' + U.fmt(pp, 1) + ')$.',
          'Hay $\\begin{pmatrix} ' + n + ' \\\\ ' + k + ' \\end{pmatrix} = ' + C + '$ maneras de elegir en qué intentos salen los éxitos.',
          'Cada una de ellas tiene probabilidad $' + base + '^{' + k + '}$, así que $P(X = ' + k + ') = ' + C + '\\cdot ' + base + '^{' + k + '}$.',
          'Eso da $P(X = ' + k + ') \\approx ' + U.fmt(mal, 4) + '$.'],
        malo: 2, pista: 'qué tiene que pasar en los intentos que no son éxitos',
        porque: 'Cada manera concreta exige también que los otros ' + (n - k) + ' intentos sean fracasos, y eso tiene probabilidad $' + baseF + '^{' + (n - k) + '}$.',
        bien: '$P(X = ' + k + ') = ' + C + '\\cdot ' + base + '^{' + k + '}\\cdot ' + baseF + '^{' + (n - k) + '} \\approx ' + U.fmt(bien, 4) + '$.'
      };
    }
  ]);

  p.exercise({
    title: 'Sin caer en la trampa',
    level: 'avanzado',
    gen: function (r) {
      var fam = r.int(0, 3), d = { fam: fam };
      if (fam === 0) {
        d.det = r.pm(1, 6); d.k = r.pick([2, 3, -2]);
        d.v = d.k * d.k * d.k * d.det;
        d.ask = '$A$ es una matriz cuadrada de orden 3 con $|A| = ' + d.det + '$. Calcula $|' + d.k + 'A|$.';
        d.pasos = ['Multiplicar $A$ por $' + d.k + '$ multiplica por $' + d.k + '$ cada una de sus 3 filas, y cada fila aporta un factor.',
          '$|' + d.k + 'A| = (' + d.k + ')^3\\cdot ' + (d.det < 0 ? '(' + d.det + ')' : d.det) + ' = ' + d.v + '$'];
      } else if (fam === 1) {
        var a = r.int(20, 60), b = r.int(20, 60), s = r.int(5, Math.min(a, b));
        if (a + b - s > 100) return null;
        d.pa = a / 100; d.pb = b / 100; d.ps = s / 100; d.v = (a + b - s) / 100;
        d.ask = 'Se sabe que $P(A) = ' + U.fmt(d.pa, 2) + '$, $P(B) = ' + U.fmt(d.pb, 2) + '$ y $P(A \\cap B) = ' + U.fmt(d.ps, 2) + '$. Calcula $P(A \\cup B)$.';
        d.pasos = ['$A$ y $B$ pueden ocurrir a la vez: al sumar sus probabilidades, la intersección se cuenta dos veces.',
          '$P(A \\cup B) = ' + U.fmt(d.pa, 2) + ' + ' + U.fmt(d.pb, 2) + ' - ' + U.fmt(d.ps, 2) + ' = ' + U.fmt(d.v, 2) + '$'];
      } else if (fam === 2) {
        var c = r.int(1, 4), t = r.int(1, 5);
        if (t === c) return null;
        d.c = c; d.t = t; d.v = (c * c + t * t) / 2; d.firmado = (t * t - c * c) / 2;
        d.ask = 'Calcula el área del recinto limitado por la gráfica de $f(x) = x - ' + c + '$, el eje $X$ y las rectas $x = 0$ y $x = ' + (c + t) + '$.';
        d.pasos = ['$f$ se anula en $x = ' + c + '$: es negativa antes y positiva después.',
          'Entre $0$ y $' + c + '$ la integral vale $-' + ML.F(c * c, 2).tex() + '$, y se toma su valor absoluto; entre $' + c + '$ y $' + (c + t) + '$ vale $' + ML.F(t * t, 2).tex() + '$.',
          'Área $= ' + ML.F(c * c, 2).tex() + ' + ' + ML.F(t * t, 2).tex() + ' = ' + ML.F(c * c + t * t, 2).tex() + '$'];
      } else {
        var a3 = r.int(2, 5);
        d.a = a3; d.v = a3;
        d.ask = 'Sea $f(x) = \\operatorname{sen}^2(' + a3 + 'x)$. Calcula $f\'\\left(\\frac{\\pi}{' + (4 * a3) + '}\\right)$.';
        d.pasos = ['Regla de la cadena dos veces: $f\'(x) = 2\\operatorname{sen}(' + a3 + 'x)\\cdot\\cos(' + a3 + 'x)\\cdot ' + a3 + '$.',
          'En $x = \\frac{\\pi}{' + (4 * a3) + '}$ el ángulo vale $\\frac{\\pi}{4}$, así que $f\' = 2\\cdot\\frac{\\sqrt{2}}{2}\\cdot\\frac{\\sqrt{2}}{2}\\cdot ' + a3 + ' = ' + a3 + '$'];
      }
      return d;
    },
    ask: function (d) { return d.ask; },
    fields: [{ name: 'v', label: 'resultado', w: 'wide' }],
    sol: function (d) { return { v: d.v }; },
    tol: 1e-9,
    errores: [
      { si: function (v, d) { return d.fam === 0 && v.v === d.k * d.det; }, msg: 'Has multiplicado el determinante por $k$ una sola vez. Cada una de las 3 filas aporta un factor: $|kA| = k^3|A|$.' },
      { si: function (v, d) { return d.fam === 0 && v.v === d.k * d.k * d.det; }, msg: 'Eso sería $k^2|A|$, que es lo que vale para matrices de orden 2. Esta es de orden 3.' },
      { si: function (v, d) { return d.fam === 1 && Math.abs(v.v - (d.pa + d.pb)) < 1e-9; }, msg: 'Sumar sin más solo vale si $A$ y $B$ son incompatibles. Aquí pueden ocurrir a la vez, y la intersección se ha contado dos veces.' },
      { si: function (v, d) { return d.fam === 2 && Math.abs(v.v - d.firmado) < 1e-9; }, msg: 'Eso es la integral de $0$ al extremo, no el área: donde la función es negativa, la integral resta. Parte el intervalo en el corte con el eje.' },
      { si: function (v, d) { return d.fam === 2 && Math.abs(v.v - Math.abs(d.firmado)) < 1e-9; }, msg: 'El valor absoluto de la integral entera no basta: las partes positiva y negativa ya se han compensado. Parte el intervalo en el corte con el eje.' },
      { si: function (v, d) { return d.fam === 3 && v.v === 1; }, msg: 'Falta derivar el argumento del seno: la regla de la cadena multiplica también por la derivada de lo de dentro.' }
    ],
    hint: function (d) {
      var h = ['¿Cuántas filas quedan multiplicadas por $k$?', '¿Pueden ocurrir $A$ y $B$ a la vez?', '¿Cambia de signo la función dentro del intervalo?', 'Hay una composición de tres funciones: el cuadrado, el seno y lo de dentro.'];
      return [h[d.fam], 'Cada una de estas preguntas esconde uno de los errores más frecuentes del examen.'];
    },
    steps: function (d) { return d.pasos; },
    answer: function (d) { return U.fmt(d.v, 4); }
  });

  p.keys([
    'Un error de cálculo resta poco; un error de concepto puede anular el apartado. Los de concepto se repiten siempre en los mismos sitios.',
    'Matrices: $|kA| = k^n|A|$, $(AB)^t = B^tA^t$, $X = A^{-1}B$, y los rangos se comparan entre sí antes que con las incógnitas.',
    'Análisis: $1^\\infty$ es indeterminación, la regla de la cadena no se olvida, $f\' = 0$ no garantiza extremo y un área se parte en los cortes con el eje.',
    'Probabilidad: $P(A|B) \\ne P(B|A)$, incompatibles no es independientes, y la tabla de la normal da la probabilidad de quedar por debajo.',
    'Contesta lo que se pide, justifica, no te saltes pasos y comprueba el resultado.'
  ]);
});
