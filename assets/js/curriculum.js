/* ===================================================================
   Matebase · curriculum.js
   EL TEMARIO. Este es el unico sitio donde se decide que hay y en que
   orden. Para intercalar un tema nuevo basta con insertar un objeto
   en el array del bloque correspondiente.

   Campos de un bloque:
     id, n, title, desc
     curso : curso por defecto de sus temas (ver abajo)
     piel  : cambia el color del bloque entero (programacion grafica)

   Campos de un tema:
     id    : identificador y nombre del archivo -> topics/<id>.js
     t     : titulo
     r     : resumen de una linea (subtitulo de la pagina)
     o     : objetivos (se muestran si el tema aun no esta escrito)
     curso : 'ESO' | '1B' | '2B' | 'AMP' (ampliacion, mas alla del Bachillerato)
     itin  : si es de 2.º, de que asignatura: ['MII'] Matemáticas II,
             ['MCS'] Matemáticas Aplicadas a las CCSS II, o las dos
     req   : temas que da por sabidos. Tienen que ir ANTES en el temario:
             tests.html lo comprueba, porque esa es la promesa del curso.

   El curso va de contar a los contenidos de 2.º de Bachillerato (bloques
   0 a 6) y a su repaso para la PAU (bloque 7). A partir de ahi pivota hacia
   lo que viene despues, agrupado por disciplina: algebra lineal (8), calculo
   en varias variables (9), ecuaciones diferenciales (10), geometria avanzada
   (11), estructuras (12), matematica discreta (13), cibernetica (14) y
   programacion grafica (15).

   Los textos de los temas no citan bloques por su numero: nombran el bloque
   o enlazan el tema con [[id]]. Asi el orden se puede cambiar aqui sin dejar
   referencias rotas por el camino.
   =================================================================== */
window.CURRICULUM = [

  /* ================= 0. LOGICA Y DEMOSTRACION ================= */
  {
    id: 'lg', n: 0, title: 'Lógica, demostración y problemas', curso: '1B',
    desc: 'La base de verdad no son los números: es qué significa que algo sea cierto, cómo se comprueba y qué se hace delante de un problema que no se parece a ninguno.',
    temas: [
      {
        id: 'lg-proposiciones', t: 'Proposiciones y cuantificadores',
        r: 'El lenguaje con el que se escriben las matemáticas.',
        o: ['Conectivas y tablas de verdad', 'Implicación, recíproco y contrarrecíproco', 'Cuantificadores y su negación'],
        req: []
      },
      {
        id: 'lg-conjuntos', t: 'Conjuntos y aplicaciones',
        r: 'Agrupar objetos y relacionar unos conjuntos con otros.',
        o: ['Operaciones y diagramas de Venn', 'Producto cartesiano', 'Aplicaciones inyectivas, sobreyectivas y biyectivas'],
        req: ['lg-proposiciones']
      },
      {
        id: 'lg-demostracion', t: 'Métodos de demostración e inducción',
        r: 'Por qué una comprobación no es una demostración.',
        o: ['Demostración directa, por contrarrecíproco y por reducción al absurdo', 'Contraejemplos', 'El principio de inducción, también con matrices y desigualdades'],
        req: ['lg-proposiciones']
      },
      {
        id: 'lg-problemas', t: 'Resolver problemas y modelizar', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Qué hacer delante de un problema que no se parece a ninguno de los que has visto.',
        o: ['Las cuatro fases de Pólya', 'Heurísticas: caso particular, dibujo, trabajar hacia atrás, invariantes', 'Del enunciado al modelo, y comprobar que el resultado tiene sentido'],
        req: ['lg-demostracion']
      },
      {
        id: 'lg-algoritmos', t: 'Pensamiento computacional y algoritmos', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Una receta tan precisa que la puede seguir una máquina, y por qué eso es una idea matemática.',
        o: ['Qué es un algoritmo: entrada, pasos y parada', 'Seguir una traza y escribir pseudocódigo', 'Euclides, búsqueda binaria y el coste de un algoritmo'],
        req: ['lg-problemas']
      }
    ]
  },

  /* ================= 1. ARITMETICA ================= */
  {
    id: 'ar', n: 1, title: 'Aritmética y fundamentos', curso: 'ESO',
    desc: 'El suelo sobre el que se apoya todo lo demás: contar, operar y entender qué es un número.',
    temas: [
      {
        id: 'ar-naturales', t: 'Números naturales y sistema decimal',
        r: 'Contar, ordenar y escribir cantidades con diez símbolos.',
        o: ['Entender el valor posicional', 'Comparar y ordenar naturales', 'Leer y escribir números grandes'],
        req: []
      },
      {
        id: 'ar-operaciones', t: 'Operaciones y jerarquía',
        r: 'Sumar, restar, multiplicar, dividir y saber en qué orden.',
        o: ['Propiedades de las operaciones', 'Jerarquía y paréntesis', 'Cálculo mental razonado'],
        req: ['ar-naturales']
      },
      {
        id: 'ar-divisibilidad', t: 'Divisibilidad, primos, m.c.d. y m.c.m.',
        r: 'La estructura oculta de los números enteros.',
        o: ['Criterios de divisibilidad', 'Factorización en primos', 'Calcular m.c.d. y m.c.m. y usarlos'],
        req: ['ar-operaciones']
      },
      {
        id: 'ar-fracciones', t: 'Fracciones',
        r: 'Partir la unidad: la primera ampliación seria del número.',
        o: ['Fracciones equivalentes', 'Suma, resta, producto y cociente', 'Comparar fracciones'],
        req: ['ar-divisibilidad']
      },
      {
        id: 'ar-decimales', t: 'Números decimales y aproximación',
        r: 'Decimales exactos, periódicos y el arte de redondear.',
        o: ['Pasar de fracción a decimal y al revés', 'Redondeo y truncamiento', 'Error absoluto y relativo'],
        req: ['ar-fracciones']
      },
      {
        id: 'ar-enteros', t: 'Números enteros',
        r: 'El cero y los negativos: la recta se extiende a la izquierda.',
        o: ['Valor absoluto y orden', 'Regla de los signos', 'Operar con paréntesis y signos'],
        req: ['ar-operaciones']
      },
      {
        id: 'ar-potencias', t: 'Potencias, raíces y notación científica',
        r: 'Multiplicar muchas veces, y deshacerlo.',
        o: ['Propiedades de las potencias', 'Exponente negativo y fraccionario', 'Notación científica'],
        req: ['ar-enteros', 'ar-fracciones']
      },
      {
        id: 'ar-proporcionalidad', t: 'Proporcionalidad y porcentajes',
        r: 'Razones, reglas de tres, aumentos y descuentos.',
        o: ['Magnitudes directa e inversamente proporcionales', 'Porcentajes encadenados', 'Interés simple y compuesto'],
        req: ['ar-fracciones', 'ar-decimales']
      },
      {
        id: 'ar-magnitudes', t: 'Magnitudes, unidades y análisis dimensional',
        r: 'Medir el mundo y comprobar que una fórmula puede ser cierta.',
        o: ['Sistema Internacional y cambios de unidad', 'Cifras significativas', 'Análisis dimensional como red de seguridad'],
        req: ['ar-potencias']
      },
      {
        id: 'ar-conjuntos', t: 'Conjuntos numéricos y la recta real',
        r: 'De ℕ a ℝ: por qué hizo falta inventar cada tipo de número.',
        o: ['Jerarquía ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ', 'Irracionales', 'Intervalos y valor absoluto'],
        req: ['ar-decimales', 'lg-conjuntos']
      }
    ]
  },

  /* ================= 2. ALGEBRA ================= */
  {
    id: 'al', n: 2, title: 'Álgebra', curso: 'ESO',
    desc: 'Cuando la letra sustituye al número, se puede razonar sobre todos los casos a la vez. Termina en las matrices y los sistemas de 2.º de Bachillerato.',
    temas: [
      {
        id: 'al-lenguaje', t: 'Lenguaje algebraico y monomios',
        r: 'Traducir enunciados a símbolos.',
        o: ['Expresiones algebraicas', 'Valor numérico', 'Monomios semejantes'],
        req: ['ar-operaciones']
      },
      {
        id: 'al-polinomios', t: 'Polinomios: operaciones y Ruffini',
        r: 'Sumar, multiplicar y dividir polinomios.',
        o: ['División de polinomios', 'Regla de Ruffini', 'Teorema del resto'],
        req: ['al-lenguaje']
      },
      {
        id: 'al-identidades', t: 'Identidades notables y factorización',
        r: 'Los tres productos que hay que reconocer de un vistazo.',
        o: ['Cuadrado de una suma y de una diferencia', 'Suma por diferencia', 'Sacar factor común y factorizar'],
        req: ['al-polinomios']
      },
      {
        id: 'al-fracciones-alg', t: 'Fracciones algebraicas',
        r: 'Fracciones cuyo numerador y denominador son polinomios.',
        o: ['Simplificar', 'Operar', 'Detectar valores prohibidos'],
        req: ['al-identidades', 'ar-fracciones']
      },
      {
        id: 'al-ec1', t: 'Ecuaciones de primer grado',
        r: 'La balanza: lo que hagas a un lado, hazlo al otro.',
        o: ['Transposición de términos', 'Ecuaciones con denominadores', 'Problemas con enunciado'],
        req: ['al-lenguaje']
      },
      {
        id: 'al-ec2', t: 'Ecuaciones de segundo grado',
        r: 'La fórmula general y lo que significa el discriminante.',
        o: ['Resolver completas e incompletas', 'Interpretar el discriminante', 'Suma y producto de raíces'],
        req: ['al-ec1', 'al-identidades']
      },
      {
        id: 'al-sistemas', t: 'Sistemas de ecuaciones lineales',
        r: 'Dos condiciones a la vez: dos rectas que se cortan.',
        o: ['Sustitución, igualación y reducción', 'Interpretación gráfica', 'Compatibles e incompatibles'],
        req: ['al-ec1']
      },
      {
        id: 'al-inecuaciones', t: 'Inecuaciones',
        r: 'Cuando la respuesta no es un número sino un tramo.',
        o: ['Inecuaciones de primer y segundo grado', 'Sistemas de inecuaciones', 'Expresar la solución con intervalos'],
        req: ['al-ec2', 'ar-conjuntos']
      },
      {
        id: 'al-radicales-log', t: 'Ecuaciones exponenciales y logarítmicas', curso: '1B',
        r: 'La incógnita en el exponente.',
        o: ['Definición y propiedades del logaritmo', 'Cambio de base', 'Resolver ecuaciones'],
        req: ['ar-potencias', 'al-ec2']
      },
      {
        id: 'al-complejos', t: 'Números complejos', curso: '1B',
        r: 'Inventar √−1 y descubrir que el plano entero es un número.',
        o: ['Forma binómica, polar y trigonométrica', 'Operaciones y fórmula de De Moivre', 'Raíces n-ésimas'],
        req: ['al-ec2']
      },
      {
        id: 'al-matrices', t: 'Matrices y determinantes', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Tablas de números que se multiplican entre sí.',
        o: ['Tipos de matrices y traspuesta', 'Operaciones: el producto no es conmutativo', 'Determinantes de orden 2 y 3 e inversa 2×2'],
        req: ['al-sistemas']
      },
      {
        id: 'al-determinantes', t: 'Determinantes: propiedades, adjuntos y rango', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Lo que un solo número dice de una matriz, y cómo calcularlo sin perderse.',
        o: ['Propiedades de los determinantes', 'Desarrollo por adjuntos', 'Rango por menores y por Gauss, también con parámetro'],
        req: ['al-matrices']
      },
      {
        id: 'al-inversa', t: 'Matriz inversa, ecuaciones matriciales y potencias', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Despejar cuando la incógnita es una matriz entera.',
        o: ['Inversa por adjuntos y por Gauss-Jordan', 'Ecuaciones matriciales: el orden importa', 'Potencias de una matriz y el patrón que se repite'],
        req: ['al-determinantes']
      },
      {
        id: 'al-gauss', t: 'Sistemas por el método de Gauss', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Escalonar para resolver sistemas de cualquier tamaño.',
        o: ['Matriz ampliada', 'Discusión de sistemas', 'Interpretación geométrica: tres planos'],
        req: ['al-matrices', 'al-sistemas']
      },
      {
        id: 'al-discusion', t: 'Discusión de sistemas con parámetro', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Rouché, Cramer y la pregunta más típica del examen: ¿para qué valores de k…?',
        o: ['El teorema de Rouché-Frobenius', 'Valores críticos y estudio por casos', 'Regla de Cramer y sistemas homogéneos'],
        req: ['al-gauss', 'al-inversa']
      }
    ]
  },

  /* ================= 3. GEOMETRIA ================= */
  {
    id: 'ge', n: 3, title: 'Geometría del plano y del espacio', curso: 'ESO',
    desc: 'La geometría de Euclides, de la ESO a 2.º de Bachillerato: figuras, distancias y la traducción entre dibujo y ecuación, con coordenadas y vectores en el plano y en el espacio.',
    temas: [
      {
        id: 'ge-angulos', t: 'Ángulos, rectas y triángulos',
        r: 'Los elementos primitivos y sus relaciones.',
        o: ['Tipos de ángulos', 'Rectas paralelas cortadas por una secante', 'Suma de ángulos de un polígono'],
        req: []
      },
      {
        id: 'ge-pitagoras', t: 'El teorema de Pitágoras',
        r: 'La relación más famosa de las matemáticas.',
        o: ['Enunciado y demostración visual', 'Calcular lados', 'Aplicaciones y ternas pitagóricas'],
        req: ['ge-angulos', 'ar-potencias']
      },
      {
        id: 'ge-semejanza', t: 'Semejanza y teorema de Tales',
        r: 'Misma forma, distinto tamaño.',
        o: ['Razón de semejanza', 'Teorema de Tales', 'Escalas, áreas y volúmenes'],
        req: ['ge-angulos', 'ar-proporcionalidad']
      },
      {
        id: 'ge-areas', t: 'Perímetros, áreas y el número π',
        r: 'Medir el contorno y la superficie.',
        o: ['Áreas de polígonos', 'Longitud de la circunferencia y área del círculo', 'Figuras compuestas'],
        req: ['ge-pitagoras']
      },
      {
        id: 'ge-cuerpos', t: 'Cuerpos geométricos y volúmenes',
        r: 'Prismas, pirámides, cilindros, conos y esferas.',
        o: ['Poliedros regulares', 'Áreas y volúmenes', 'Principio de Cavalieri'],
        req: ['ge-areas']
      },
      {
        id: 'ge-vectores', t: 'Vectores en el plano', curso: '1B',
        r: 'Flechas que se suman: la herramienta que une álgebra y geometría.',
        o: ['Componentes, módulo y argumento', 'Combinaciones lineales y bases', 'Producto escalar, ángulos y proyecciones'],
        req: ['ge-pitagoras']
      },
      {
        id: 'ge-rectas', t: 'La recta en el plano', curso: '1B',
        r: 'Todas las formas de escribir una recta.',
        o: ['Ecuación vectorial, paramétrica, continua y general', 'Posiciones relativas', 'Distancias'],
        req: ['ge-vectores', 'al-sistemas']
      },
      {
        id: 'ge-conicas', t: 'Cónicas', curso: '1B',
        r: 'Cortar un cono y obtener elipse, parábola e hipérbola.',
        o: ['Definiciones como lugar geométrico', 'Ecuaciones reducidas', 'Excentricidad'],
        req: ['ge-rectas', 'al-ec2']
      },
      {
        id: 'ge-espacio-vectores', t: 'Vectores en el espacio', curso: '2B', itin: ['MII'],
        r: 'Tres coordenadas, dependencia lineal y los tres productos: escalar, vectorial y mixto.',
        o: ['Dependencia lineal y bases de ℝ³', 'Producto escalar, vectorial y mixto con su significado', 'Áreas de triángulos y volúmenes de tetraedros'],
        req: ['ge-vectores', 'al-determinantes']
      },
      {
        id: 'ge-espacio', t: 'Rectas y planos en el espacio', curso: '2B', itin: ['MII'],
        r: 'Todas las formas de escribirlos y cómo se colocan unos respecto de otros.',
        o: ['Ecuaciones de la recta y del plano', 'Posiciones relativas estudiadas con rangos', 'Haces de planos y tres planos a la vez'],
        req: ['ge-espacio-vectores', 'ge-rectas', 'al-discusion']
      },
      {
        id: 'ge-metrico', t: 'Ángulos, distancias, proyecciones y simétricos', curso: '2B', itin: ['MII'],
        r: 'Medir en el espacio: casi todo se reduce a encontrar la perpendicular.',
        o: ['Ángulos entre rectas y planos', 'Proyecciones ortogonales y puntos simétricos', 'Distancias, perpendicular común y rectas que se cruzan'],
        req: ['ge-espacio']
      },
      {
        id: 'ge-transformaciones', t: 'Movimientos y transformaciones',
        r: 'Trasladar, girar, reflejar y escalar.',
        o: ['Isometrías del plano', 'Simetrías y grupos', 'Homotecias'],
        req: ['ge-vectores']
      }
    ]
  },

  /* ================= 4. TRIGONOMETRIA ================= */
  {
    id: 'tr', n: 4, title: 'Trigonometría', curso: '1B',
    desc: 'La máquina que convierte ángulos en longitudes. Nació midiendo estrellas.',
    temas: [
      {
        id: 'tr-razones', t: 'Razones trigonométricas', curso: 'ESO',
        r: 'Seno, coseno y tangente en el triángulo rectángulo.',
        o: ['Definición de las razones', 'Relación fundamental', 'Resolver triángulos rectángulos'],
        req: ['ge-pitagoras', 'ge-semejanza']
      },
      {
        id: 'tr-circunferencia', t: 'Circunferencia goniométrica',
        r: 'Extender el ángulo más allá de 90°: radianes y signos.',
        o: ['Radianes', 'Signo por cuadrantes', 'Ángulos relacionados'],
        req: ['tr-razones']
      },
      {
        id: 'tr-identidades', t: 'Identidades y ecuaciones trigonométricas',
        r: 'Sumas de ángulos, ángulo doble y cómo despejar.',
        o: ['Fórmulas de adición', 'Ángulo doble y mitad', 'Resolver ecuaciones trigonométricas'],
        req: ['tr-circunferencia']
      },
      {
        id: 'tr-teoremas', t: 'Teoremas del seno y del coseno',
        r: 'Resolver triángulos cualesquiera.',
        o: ['Teorema del seno', 'Teorema del coseno', 'Área de un triángulo'],
        req: ['tr-razones']
      },
      {
        id: 'tr-funciones', t: 'Funciones trigonométricas y ondas',
        r: 'Amplitud, periodo y fase: la forma de casi todo lo que oscila.',
        o: ['Gráficas de seno, coseno y tangente', 'Transformaciones', 'Suma de ondas'],
        req: ['tr-circunferencia']
      }
    ]
  },

  /* ================= 5. ANALISIS ================= */
  {
    id: 'fn', n: 5, title: 'Funciones y análisis', curso: '1B',
    desc: 'El estudio del cambio. De la gráfica al límite, del límite a la derivada y a la integral: el corazón del examen de 2.º.',
    temas: [
      {
        id: 'fn-concepto', t: 'Concepto de función', curso: 'ESO',
        r: 'Una máquina que transforma números en números.',
        o: ['Dominio y recorrido', 'Lectura de gráficas, crecimiento y simetrías', 'Composición de funciones y función inversa'],
        req: ['ar-conjuntos']
      },
      {
        id: 'fn-lineales', t: 'Funciones lineales y afines', curso: 'ESO',
        r: 'La recta: pendiente y ordenada en el origen.',
        o: ['Interpretar la pendiente', 'Recta que pasa por dos puntos', 'Modelos lineales'],
        req: ['fn-concepto']
      },
      {
        id: 'fn-prog-lineal', t: 'Programación lineal', curso: '2B', itin: ['MCS'],
        r: 'Optimizar cuando hay restricciones: el problema de todas las empresas.',
        o: ['Región factible a partir de inecuaciones', 'Función objetivo y rectas de nivel', 'Soluciones múltiples, regiones no acotadas y soluciones enteras'],
        req: ['al-inecuaciones', 'fn-lineales']
      },
      {
        id: 'fn-cuadraticas', t: 'Funciones cuadráticas', curso: 'ESO',
        r: 'La parábola y sus elementos.',
        o: ['Vértice y eje de simetría', 'Cortes con los ejes', 'Problemas de máximos y mínimos'],
        req: ['fn-lineales', 'al-ec2']
      },
      {
        id: 'fn-racionales', t: 'Racionales, radicales y a trozos',
        r: 'Funciones con agujeros, asíntotas y saltos.',
        o: ['Asíntotas', 'Dominio de radicales', 'Funciones definidas a trozos'],
        req: ['fn-cuadraticas', 'al-fracciones-alg']
      },
      {
        id: 'fn-exp-log', t: 'Funciones exponenciales y logarítmicas',
        r: 'Crecimiento explosivo y su inverso.',
        o: ['Propiedades de la exponencial', 'El número e', 'Modelos de crecimiento y decaimiento'],
        req: ['fn-concepto', 'al-radicales-log']
      },
      {
        id: 'fn-sucesiones', t: 'Sucesiones y progresiones',
        r: 'Listas infinitas de números y sus sumas.',
        o: ['Progresiones aritmética y geométrica', 'Límite de una sucesión', 'Suma de series geométricas'],
        req: ['fn-concepto']
      },
      {
        id: 'fn-series', t: 'Series numéricas y convergencia', curso: 'AMP',
        r: 'Qué significa sumar infinitos números, y por qué a veces no se puede.',
        o: ['Sumas parciales y definición de convergencia', 'La serie armónica diverge', 'p-series y criterios de comparación'],
        req: ['fn-sucesiones']
      },
      {
        id: 'fn-finanzas', t: 'Matemática financiera',
        r: 'Valor del dinero en el tiempo, TAE y la cuota de una hipoteca.',
        o: ['Valor actual y descuento', 'TIN frente a TAE', 'Amortización de un préstamo'],
        req: ['fn-sucesiones', 'ar-proporcionalidad']
      },
      {
        id: 'fn-limites', t: 'Límites y continuidad', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Acercarse infinitamente sin llegar.',
        o: ['Idea intuitiva y límites laterales', 'Indeterminaciones, incluidas 1^∞ e ∞ − ∞', 'Continuidad y tipos de discontinuidad'],
        req: ['fn-racionales', 'fn-sucesiones', 'fn-exp-log']
      },
      {
        id: 'fn-continuidad', t: 'Teoremas de las funciones continuas', curso: '2B', itin: ['MII'],
        r: 'Bolzano, Darboux y Weierstrass: lo que se puede asegurar sin calcular nada.',
        o: ['Teorema de Bolzano y existencia de raíces', 'Teorema de los valores intermedios', 'Teorema de Weierstrass: extremos garantizados'],
        req: ['fn-limites']
      },
      {
        id: 'fn-derivadas', t: 'Derivadas', curso: '2B', itin: ['MII', 'MCS'],
        r: 'La pendiente instantánea: el ritmo de cambio.',
        o: ['Definición por el límite del cociente incremental', 'Reglas de derivación y derivación logarítmica', 'Recta tangente, Rolle y valor medio'],
        req: ['fn-limites', 'tr-funciones']
      },
      {
        id: 'fn-derivabilidad', t: 'Derivabilidad y funciones a trozos', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Cuándo existe la derivada, y cómo se consigue que exista eligiendo parámetros.',
        o: ['Derivadas laterales', 'Derivable implica continua, y no al revés', 'Continuidad y derivabilidad de funciones a trozos con parámetros'],
        req: ['fn-derivadas']
      },
      {
        id: 'fn-lhopital', t: 'La regla de L\'Hôpital', curso: '2B', itin: ['MII'],
        r: 'Usar la derivada para deshacer las indeterminaciones que no ceden de otra forma.',
        o: ['Cuándo se puede aplicar y por qué funciona', 'Reducir 0·∞, ∞ − ∞ y las potencias indeterminadas', 'Aplicarla varias veces, y cuándo no ayuda'],
        req: ['fn-derivadas', 'fn-continuidad']
      },
      {
        id: 'fn-aplicaciones', t: 'Estudio de funciones y optimización', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Usar la derivada para dibujar y para decidir.',
        o: ['Monotonía y extremos', 'Curvatura y puntos de inflexión', 'Problemas de optimización'],
        req: ['fn-derivadas']
      },
      {
        id: 'fn-representacion', t: 'Representación gráfica de funciones', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Juntar todo lo aprendido para dibujar una función sin hacer una tabla de valores.',
        o: ['Dominio, simetrías, cortes y asíntotas', 'Monotonía, extremos, curvatura e inflexión', 'Problemas inversos: hallar parámetros a partir de propiedades'],
        req: ['fn-aplicaciones', 'fn-derivabilidad']
      },
      {
        id: 'fn-taylor', t: 'Polinomios de Taylor', curso: 'AMP',
        r: 'Sustituir una función por un polinomio: lo que hay dentro de tu calculadora.',
        o: ['Del polinomio de Taylor a la serie', 'Resto de Lagrange y control del error', 'Desarrollos de e^x, sen x y cos x'],
        req: ['fn-derivadas', 'fn-series']
      },
      {
        id: 'fn-integral-indef', t: 'Integral indefinida', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Deshacer la derivada.',
        o: ['Primitivas inmediatas y de tipo compuesto', 'Cambio de variable', 'Integración por partes'],
        req: ['fn-derivadas']
      },
      {
        id: 'fn-integral-racional', t: 'Integrales racionales y otras técnicas', curso: '2B', itin: ['MII'],
        r: 'Partir una fracción en trozos que se sepan integrar.',
        o: ['Integrales de tipo logarítmico y arcotangente', 'Descomposición en fracciones simples', 'Integración por partes cíclica'],
        req: ['fn-integral-indef', 'al-fracciones-alg']
      },
      {
        id: 'fn-integral-def', t: 'Integral definida y áreas', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Sumar infinitos rectángulos infinitamente finos.',
        o: ['Sumas de Riemann y regla de Barrow', 'Área entre curvas', 'Áreas con parámetro'],
        req: ['fn-integral-indef']
      },
      {
        id: 'fn-funcion-integral', t: 'La función integral y el teorema fundamental', curso: '2B', itin: ['MII'],
        r: 'Una función definida como un área, y por qué su derivada es la función de partida.',
        o: ['La función integral F(x)', 'El teorema fundamental del cálculo y cómo se usa', 'Valor medio integral y volúmenes de revolución'],
        req: ['fn-integral-def', 'fn-continuidad']
      }
    ]
  },

  /* ================= 6. PROBABILIDAD Y ESTADISTICA ================= */
  {
    id: 'pe', n: 6, title: 'Probabilidad y estadística', curso: '1B',
    desc: 'Matemáticas para lo que no se sabe con certeza: describir datos, medir el azar y decidir con una muestra.',
    temas: [
      {
        id: 'pe-descriptiva', t: 'Estadística descriptiva', curso: 'ESO',
        r: 'Resumir un montón de datos en unos pocos números.',
        o: ['Tablas de frecuencias', 'Media, mediana, moda y cuartiles', 'Dispersión y diagrama de caja'],
        req: ['ar-fracciones']
      },
      {
        id: 'pe-bidimensional', t: 'Regresión y correlación',
        r: 'Dos variables a la vez: ¿van juntas?',
        o: ['Nube de puntos y covarianza', 'Coeficiente de correlación', 'Recta de regresión y predicción'],
        req: ['pe-descriptiva', 'fn-lineales']
      },
      {
        id: 'pe-combinatoria', t: 'Combinatoria',
        r: 'Contar sin enumerar.',
        o: ['Variaciones, permutaciones y combinaciones', 'Con y sin repetición', 'Números combinatorios'],
        req: ['ar-operaciones']
      },
      {
        id: 'pe-probabilidad', t: 'Probabilidad',
        r: 'Regla de Laplace y álgebra de sucesos.',
        o: ['Espacio muestral y sucesos', 'Regla de Laplace', 'Unión, intersección y complementario'],
        req: ['pe-combinatoria', 'lg-conjuntos']
      },
      {
        id: 'pe-condicionada', t: 'Probabilidad condicionada y Bayes', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Cómo cambia una probabilidad cuando te dan información.',
        o: ['Probabilidad condicionada e independencia', 'Tablas de contingencia y diagramas de árbol', 'Probabilidad total y teorema de Bayes'],
        req: ['pe-probabilidad']
      },
      {
        id: 'pe-binomial', t: 'Distribución binomial', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Repetir un experimento con dos resultados.',
        o: ['Variable aleatoria discreta', 'Función de probabilidad binomial', 'Media y desviación típica'],
        req: ['pe-condicionada', 'pe-combinatoria']
      },
      {
        id: 'pe-continuas', t: 'Variables aleatorias continuas', curso: '2B', itin: ['MII', 'MCS'],
        r: 'Cuando la probabilidad se mide con áreas: densidad e integrales.',
        o: ['Función de densidad y de distribución', 'Probabilidad como área bajo la curva', 'Esperanza y varianza como integrales'],
        req: ['pe-binomial', 'fn-integral-def']
      },
      {
        id: 'pe-normal', t: 'Distribución normal', curso: '2B', itin: ['MII', 'MCS'],
        r: 'La campana que aparece por todas partes.',
        o: ['Densidad y tipificación', 'Uso de la tabla N(0,1), también al revés', 'Aproximación de la binomial'],
        req: ['pe-continuas']
      },
      {
        id: 'pe-inferencia', t: 'Muestreo e intervalo para la media', curso: '2B', itin: ['MCS'],
        r: 'Deducir cómo es el todo mirando una parte.',
        o: ['Tipos de muestreo', 'Distribución de la media muestral', 'Intervalo de confianza y tamaño de muestra'],
        req: ['pe-normal']
      },
      {
        id: 'pe-proporcion', t: 'Estimar una proporción', curso: '2B', itin: ['MCS'],
        r: 'El margen de error de las encuestas: cuánto se equivoca un porcentaje sacado de una muestra.',
        o: ['Distribución de la proporción muestral', 'Intervalo de confianza para una proporción', 'Tamaño de muestra cuando no se sabe nada de p'],
        req: ['pe-inferencia']
      },
      {
        id: 'pe-contraste', t: 'Contraste de hipótesis', curso: '2B', itin: ['MCS'],
        r: 'Decidir con datos si una afirmación se sostiene, sabiendo cuánto te puedes equivocar.',
        o: ['Hipótesis nula y alternativa, unilateral y bilateral', 'Nivel de significación, región de rechazo y tipos de error', 'Contrastes para la media y para la proporción'],
        req: ['pe-proporcion']
      },
      {
        id: 'pe-causal', t: 'Inferencia causal', curso: 'AMP',
        r: 'Qué se hace cuando la correlación no basta: la respuesta que falta a la advertencia.',
        o: ['Variable de confusión y paradoja de Simpson', 'Por qué se aleatoriza', 'Anatomía de un ensayo clínico'],
        req: ['pe-bidimensional', 'pe-inferencia']
      }
    ]
  },

  /* ================= 7. REPASO DE 2.º Y PAU =================
     No añade contenido: lo ordena. El mapa del temario con el estado de
     cada tema, simulacros montados con los ejercicios de los temas, un
     formulario que se imprime y los errores que mas puntos cuestan. Es la
     bisagra del curso: antes, 2.º de Bachillerato; despues, lo que viene. */
  {
    id: 'pau', n: 7, title: 'Repaso de 2.º y PAU', curso: '2B',
    desc: 'La bisagra del curso. Aquí se ordena lo aprendido para el examen: el mapa del temario con tu estado, los errores que más puntos cuestan, un formulario para imprimir y simulacros corregidos. A partir de aquí, el curso sigue hacia lo que viene después del Bachillerato.',
    temas: [
      {
        id: 'pau-mapa', t: 'Mapa del temario de 2.º', itin: ['MII', 'MCS'],
        r: 'Qué entra en tu asignatura, cómo vas en cada tema y qué necesita cada uno.',
        o: ['Temario de Matemáticas II y de MACS II', 'Tu estado en cada tema', 'Lo que da por sabido cada uno'],
        req: []
      },
      {
        id: 'pau-errores', t: 'Los errores que más puntos cuestan', itin: ['MII', 'MCS'],
        r: 'Los fallos de siempre, con nombre, ejemplo y cura.',
        o: ['Álgebra: matrices y sistemas', 'Geometría y análisis', 'Probabilidad y estadística'],
        req: []
      },
      {
        id: 'pau-formulario', t: 'Formulario de 2.º', itin: ['MII', 'MCS'],
        r: 'Las fórmulas y las ideas clave de tu temario, en una página que se imprime.',
        o: ['Fórmulas por bloque', 'Ideas clave de cada tema', 'Versión para imprimir'],
        req: []
      },
      {
        id: 'pau-simulacro-mii', t: 'Simulacro de Matemáticas II', itin: ['MII'],
        r: 'Un examen con preguntas de todos los bloques, corregido al entregar.',
        o: ['Álgebra, geometría, análisis y probabilidad', 'Con cronómetro', 'Nota por bloques y qué repasar'],
        req: []
      },
      {
        id: 'pau-simulacro-mcs', t: 'Simulacro de MACS II', itin: ['MCS'],
        r: 'Un examen con preguntas de todos los bloques de Ciencias Sociales, corregido al entregar.',
        o: ['Álgebra y programación lineal, análisis, probabilidad e inferencia', 'Con cronómetro', 'Nota por bloques y qué repasar'],
        req: []
      }
    ]
  },

  /* ================= 8. ÁLGEBRA LINEAL ================= */
  {
    id: 'lin', n: 8, title: 'Álgebra lineal', curso: 'AMP',
    desc: 'La continuación natural de las matrices: qué son de verdad, qué hacen, cómo ajustan datos y cómo se comportan a largo plazo.',
    temas: [
      {
        id: 'av-espacios', t: 'Espacios vectoriales y aplicaciones lineales',
        r: 'Qué es de verdad una matriz: una transformación, no una tabla.',
        o: ['Espacio vectorial, base y dimensión', 'Aplicaciones lineales y su matriz', 'Núcleo, imagen y el teorema del rango'],
        req: ['al-inversa', 'ge-espacio-vectores']
      },
      {
        id: 'av-lineal', t: 'Álgebra lineal: autovalores',
        r: 'Las direcciones que una transformación no tuerce.',
        o: ['Autovalores y autovectores', 'Ecuación característica y autovalores complejos', 'Diagonalización y potencias'],
        req: ['av-espacios']
      },
      {
        id: 'av-minimos-cuadrados', t: 'Mínimos cuadrados y proyecciones',
        r: 'De dónde sale de verdad la recta de regresión: proyectar sobre un subespacio.',
        o: ['Proyección ortogonal sobre un subespacio', 'Ecuaciones normales', 'Ajustar rectas y parábolas a datos'],
        req: ['av-espacios', 'pe-bidimensional']
      },
      {
        id: 'av-svd', t: 'Descomposición en valores singulares',
        r: 'Toda matriz es un giro, un estiramiento y otro giro. Y así se comprime una imagen.',
        o: ['Valores y vectores singulares', 'Aproximación de rango bajo', 'Comprimir una imagen'],
        req: ['av-lineal', 'av-minimos-cuadrados']
      },
      {
        id: 'av-markov', t: 'Cadenas de Markov y procesos estocásticos',
        r: 'Azar con memoria de un solo paso: del tiempo al PageRank.',
        o: ['Matriz de transición', 'Evolución del estado y distribución estacionaria', 'Estados absorbentes'],
        req: ['av-lineal', 'pe-condicionada']
      }
    ]
  },

  /* ================= 9. CÁLCULO EN VARIAS VARIABLES ================= */
  {
    id: 'var', n: 9, title: 'Cálculo en varias variables', curso: 'AMP',
    desc: 'El análisis de Bachillerato cuando la función depende de más de un número: derivadas parciales y gradiente, máximos y mínimos sobre una superficie, optimizar con restricciones e integrar sobre regiones del plano y del espacio.',
    temas: [
      {
        id: 'av-vectorial', t: 'Cálculo vectorial',
        r: 'Derivar e integrar campos en varias dimensiones.',
        o: ['Derivadas parciales y gradiente', 'Divergencia y rotacional', 'Integrales de línea y teoremas integrales'],
        req: ['ge-espacio-vectores', 'fn-derivadas']
      },
      {
        id: 'av-optimizacion', t: 'Optimización y descenso de gradiente',
        r: 'Cómo aprende una máquina: bajando la ladera a pasitos.',
        o: ['Extremos con varias variables', 'El algoritmo del descenso de gradiente', 'Tasa de aprendizaje y mínimos locales'],
        req: ['av-vectorial']
      },
      {
        id: 'av-lagrange', t: 'Optimizar con restricciones: multiplicadores de Lagrange',
        r: 'Buscar el máximo sin salirse de una curva: los gradientes tienen que ser paralelos.',
        o: ['Extremos condicionados', 'El método de los multiplicadores', 'Aplicaciones en economía y geometría'],
        req: ['av-optimizacion']
      },
      {
        id: 'av-integrales-multiples', t: 'Integrales dobles y triples',
        r: 'Sumar sobre regiones del plano y del espacio, y cambiar de coordenadas para simplificar.',
        o: ['Integrales iteradas y teorema de Fubini', 'Cambio a polares, cilíndricas y esféricas', 'La integral de Gauss'],
        req: ['av-vectorial', 'fn-integral-def']
      }
    ]
  },

  /* ================= 10. ECUACIONES DIFERENCIALES Y ONDAS ================= */
  {
    id: 'dif', n: 10, title: 'Ecuaciones diferenciales y ondas', curso: 'AMP',
    desc: 'Las matemáticas del cambio: ecuaciones cuya incógnita es una función. Con ellas está escrita casi toda la física.',
    temas: [
      {
        id: 'av-edo', t: 'Ecuaciones diferenciales ordinarias',
        r: 'Ecuaciones cuya incógnita es una función entera.',
        o: ['Campo de pendientes', 'Variables separables y lineales de primer orden', 'Modelos: enfriamiento, población'],
        req: ['fn-integral-indef', 'fn-exp-log']
      },
      {
        id: 'av-edo-numerico', t: 'Resolver ecuaciones diferenciales con el ordenador',
        r: 'Euler y Runge-Kutta: avanzar a pasitos por el campo de pendientes.',
        o: ['El método de Euler', 'Error y tamaño de paso', 'Runge-Kutta de orden 4'],
        req: ['av-edo']
      },
      {
        id: 'av-oscilador', t: 'Oscilaciones: la ecuación de segundo orden',
        r: 'El muelle, el péndulo y el circuito: amortiguamiento y resonancia.',
        o: ['Ecuación lineal de segundo orden', 'Subamortiguado, crítico y sobreamortiguado', 'Oscilaciones forzadas y resonancia'],
        req: ['av-edo', 'al-complejos', 'tr-funciones']
      },
      {
        id: 'av-sistemas-dinamicos', t: 'Sistemas dinámicos y espacio de fases',
        r: 'Ver la evolución de un sistema como una trayectoria.',
        o: ['Puntos de equilibrio y estabilidad', 'Retrato de fases', 'Sistemas depredador-presa'],
        req: ['av-oscilador', 'av-lineal']
      },
      {
        id: 'av-caos', t: 'Teoría del caos y fractales',
        r: 'Reglas simples, comportamiento impredecible.',
        o: ['Mapa logístico y duplicación de periodo', 'Dependencia sensible', 'Dimensión fractal'],
        req: ['av-sistemas-dinamicos']
      },
      {
        id: 'av-edp', t: 'Ecuaciones en derivadas parciales',
        r: 'Las ecuaciones del calor, la onda y el potencial.',
        o: ['De la EDO a la EDP', 'Separación de variables', 'Ecuación del calor y de ondas'],
        req: ['av-edo', 'av-vectorial']
      },
      {
        id: 'av-fourier', t: 'Series y transformada de Fourier',
        r: 'Toda señal es una suma de ondas puras.',
        o: ['Serie de Fourier', 'Espectro', 'Idea de la transformada'],
        req: ['tr-funciones', 'fn-series']
      }
    ]
  },

  /* ================= 11. GEOMETRÍA AVANZADA ================= */
  {
    id: 'geo', n: 11, title: 'Geometría avanzada: curvatura y forma', curso: 'AMP',
    desc: 'En «Geometría del plano y del espacio» se medía con las reglas de Euclides en un mundo plano. Aquí se ponen en duda esas reglas: qué pasa si las paralelas se cortan, cómo se mide cuánto se curva algo y qué queda de una figura cuando se deja de medir.',
    temas: [
      {
        id: 'av-noeuclidea', t: 'Geometrías no euclídeas',
        r: 'Qué pasa si niegas el quinto postulado: dos mil años de historia y la forma del universo.',
        o: ['El quinto postulado y su independencia', 'Geometría elíptica e hiperbólica', 'Exceso esférico y disco de Poincaré'],
        req: ['ge-angulos']
      },
      {
        id: 'av-geodif', t: 'Geometría diferencial: curvatura',
        r: 'Medir cuánto se dobla una curva o una superficie.',
        o: ['Curvatura de una curva plana', 'Curvatura de Gauss', 'Geodésicas y el teorema egregio'],
        req: ['av-vectorial', 'av-noeuclidea']
      },
      {
        id: 'av-topologia', t: 'Topología',
        r: 'Geometría sin distancias: lo que sobrevive al estirar.',
        o: ['Espacios topológicos y continuidad', 'Homeomorfismo y género', 'Característica de Euler'],
        req: ['ge-cuerpos']
      }
    ]
  },

  /* ================= 12. ESTRUCTURAS, NÚMEROS E INFINITO ================= */
  {
    id: 'est', n: 12, title: 'Estructuras, números e infinito', curso: 'AMP',
    desc: 'La cara más abstracta, y la que sostiene la criptografía: qué tienen en común los objetos matemáticos y qué significa contar lo incontable.',
    temas: [
      {
        id: 'av-numeros', t: 'Teoría de números',
        r: 'La reina de las matemáticas: los enteros y sus misterios.',
        o: ['Aritmética modular', 'Teorema fundamental de la aritmética', 'Criptografía RSA'],
        req: ['ar-divisibilidad']
      },
      {
        id: 'av-grupos', t: 'Teoría de grupos y simetría',
        r: 'La estructura matemática de la simetría.',
        o: ['Definición de grupo y ejemplos', 'Grupos de simetría y teselados', 'Por qué no hay fórmula para el grado 5'],
        req: ['ge-transformaciones', 'av-numeros']
      },
      {
        id: 'av-cripto-curvas', t: 'Criptografía moderna: Diffie-Hellman y curvas elípticas',
        r: 'Acordar una clave secreta a la vista de todos, y por qué tu móvil usa curvas.',
        o: ['Intercambio de claves de Diffie-Hellman', 'El problema del logaritmo discreto', 'La suma de puntos de una curva elíptica'],
        req: ['av-numeros', 'av-grupos']
      },
      {
        id: 'av-reales', t: 'La completitud de los reales',
        r: 'El supremo: lo único que de verdad distingue ℝ de ℚ.',
        o: ['Cotas, supremo e ínfimo', 'El agujero de ℚ', 'Qué se cae sin el axioma de completitud'],
        req: ['ar-conjuntos', 'fn-sucesiones']
      },
      {
        id: 'av-infinito', t: 'El infinito: cardinalidad y Cantor',
        r: 'Hay infinitos más grandes que otros, y se puede demostrar.',
        o: ['Biyecciones y conjuntos numerables', 'La diagonal de Cantor', 'Hipótesis del continuo'],
        req: ['lg-conjuntos']
      },
      {
        id: 'av-computabilidad', t: 'Computabilidad: Turing y Gödel',
        r: 'Qué se puede demostrar y qué se puede calcular. Los dos límites, con la misma diagonal.',
        o: ['La máquina de Turing y qué es calcular', 'El problema de la parada', 'Los teoremas de incompletitud de Gödel'],
        req: ['av-infinito', 'lg-algoritmos']
      }
    ]
  },

  /* ================= 13. DISCRETA Y COMPUTACIONAL ================= */
  {
    id: 'dis', n: 13, title: 'Discreta y computacional', curso: 'AMP',
    desc: 'Las matemáticas de lo que se cuenta y de lo que calcula un ordenador: redes, recurrencias, algoritmos, información y decisiones.',
    temas: [
      {
        id: 'av-grafos', t: 'Teoría de grafos',
        r: 'Puntos y conexiones: redes, mapas y rutas.',
        o: ['Grafos, caminos y ciclos', 'Puentes de Königsberg', 'Árboles y algoritmos de camino mínimo'],
        req: ['lg-conjuntos']
      },
      {
        id: 'av-recurrencias', t: 'Recurrencias y funciones generadoras',
        r: 'Ecuaciones que se llaman a sí mismas: de Fibonacci al coste de un algoritmo.',
        o: ['Recurrencias lineales y su ecuación característica', 'Fibonacci y el número de oro', 'Funciones generadoras'],
        req: ['fn-sucesiones', 'av-lineal']
      },
      {
        id: 'av-complejidad', t: 'Complejidad: lo fácil, lo difícil y P frente a NP',
        r: 'Por qué hay problemas que un ordenador resuelve en segundos y otros que no terminaría antes del fin del universo.',
        o: ['El coste de un algoritmo y la notación O', 'Las clases P y NP', 'Problemas NP-completos y lo que está en juego'],
        req: ['av-grafos', 'av-computabilidad']
      },
      {
        id: 'av-numerico', t: 'Análisis numérico',
        r: 'Cuando no hay fórmula exacta, se calcula aproximando.',
        o: ['Bisección y Newton-Raphson', 'Integración numérica', 'Errores y estabilidad'],
        req: ['fn-continuidad', 'fn-integral-def']
      },
      {
        id: 'av-informacion', t: 'Teoría de la información y entropía',
        r: 'Cuánta información cabe en un mensaje, medida en bits.',
        o: ['Cantidad de información y entropía de Shannon', 'Codificación óptima', 'Redundancia y compresión'],
        req: ['pe-probabilidad', 'fn-exp-log']
      },
      {
        id: 'av-juegos', t: 'Teoría de juegos',
        r: 'Matemáticas para decidir cuando el otro también decide.',
        o: ['Matriz de pagos y estrategias dominantes', 'Equilibrio de Nash', 'El dilema del prisionero'],
        req: ['pe-probabilidad']
      }
    ]
  },

  /* ================= 14. CIBERNÉTICA ================= */
  {
    id: 'cib', n: 14, title: 'Cibernética', curso: 'AMP',
    desc: 'La disciplina que junta la derivada, la entropía, la probabilidad y los sistemas dinámicos para responder a una sola pregunta —cómo se mantiene algo en su sitio en un mundo que lo empuja— y de la que nacieron el control automático y la inteligencia artificial.',
    temas: [
      {
        id: 'cib-realimentacion', t: 'Realimentación: el bucle que se corrige solo',
        r: 'La idea madre: un sistema que mide su propio resultado y lo usa para corregirse.',
        o: ['Realimentación negativa y positiva', 'Ganancia y estabilidad', 'Del regulador de Watt al termostato'],
        req: ['fn-sucesiones']
      },
      {
        id: 'cib-bloques', t: 'Diagramas de bloques: el álgebra de los bucles',
        r: 'Dibujar un sistema como cajas y flechas, y reducir el dibujo a una sola fórmula.',
        o: ['Bloques en serie, en paralelo y en bucle', 'La ganancia de un bucle cerrado', 'Sensibilidad: por qué la realimentación hace robusto un sistema'],
        req: ['cib-realimentacion', 'al-ec1']
      },
      {
        id: 'cib-caja-negra', t: 'La caja negra: sistemas, estados y transiciones',
        r: 'Cómo estudiar un aparato sin abrirlo: perturbarlo y anotar qué hace.',
        o: ['Estado y transformación', 'Sistemas determinados por su estado', 'Deducir el interior desde fuera, también ajustando datos'],
        req: ['cib-realimentacion', 'lg-conjuntos']
      },
      {
        id: 'cib-variedad', t: 'Variedad y la ley de la variedad requerida',
        r: 'Solo la variedad puede absorber variedad: por qué un regulador con pocas jugadas pierde siempre.',
        o: ['Medir la variedad', 'La ley de Ashby', 'El teorema del buen regulador'],
        req: ['cib-caja-negra', 'av-informacion']
      },
      {
        id: 'cib-control', t: 'Control por error: proporcional, integral y derivativo',
        r: 'Pilotar con tres términos: el error de ahora, el acumulado y el que viene.',
        o: ['La señal de error', 'Los tres términos del PID', 'Saturación, windup y sintonía de Ziegler-Nichols'],
        req: ['cib-bloques', 'fn-integral-def']
      },
      {
        id: 'cib-homeostasis', t: 'Homeostasis y ultraestabilidad',
        r: 'Variables que deben permanecer dentro de unos límites, y qué hace un sistema cuando se salen.',
        o: ['Variables esenciales', 'El homeostato de Ashby', 'Adaptación por reconfiguración'],
        req: ['cib-control']
      },
      {
        id: 'cib-retardos', t: 'Retardos y oscilación',
        r: 'Por qué la ducha de un hotel es imposible de regular: la información llega tarde.',
        o: ['El retardo en el bucle', 'Sobrecorrección y oscilación', 'El efecto látigo'],
        req: ['cib-control']
      },
      {
        id: 'cib-dinamica', t: 'Dinámica de sistemas: stocks y flujos',
        r: 'Bañeras que se llenan y se vacían: cómo unos pocos acumuladores explican plagas, crisis y atascos.',
        o: ['Stocks, flujos y bucles', 'Simular con el método de Euler', 'Arquetipos: límites al crecimiento y tragedia de los comunes'],
        req: ['cib-retardos', 'av-edo-numerico']
      },
      {
        id: 'cib-filtrado', t: 'Predicción y filtrado: separar la señal del ruido',
        r: 'El problema con el que Wiener llegó a todo esto: adivinar dónde estará algo que se mide mal.',
        o: ['Señal y ruido', 'Suavizado y media móvil', 'El compromiso entre suavidad y retraso'],
        req: ['cib-retardos', 'pe-descriptiva']
      },
      {
        id: 'cib-kalman', t: 'El filtro de Kalman en una dimensión',
        r: 'Fundir lo que predices con lo que mides, cada cosa pesada por lo que te fías de ella.',
        o: ['Predicción y medida como dos campanas', 'La ganancia de Kalman', 'Seguir un objeto que se mide mal'],
        req: ['cib-filtrado', 'pe-normal']
      },
      {
        id: 'cib-neurona', t: 'La neurona de McCulloch-Pitts y el perceptrón',
        r: 'La cibernética inventó la neurona artificial: un producto escalar, un umbral y una regla para aprender del error.',
        o: ['La neurona como puerta lógica', 'El perceptrón y su regla de aprendizaje', 'Lo que un perceptrón no puede aprender'],
        req: ['lg-proposiciones', 'ge-vectores', 'cib-realimentacion']
      },
      {
        id: 'cib-refuerzo', t: 'Aprender jugando: MENACE y el refuerzo',
        r: 'Una máquina de cajas de cerillas que aprende a jugar sin que nadie le explique las reglas.',
        o: ['Premio y castigo como realimentación', 'MENACE, la máquina de Donald Michie', 'Explorar o aprovechar'],
        req: ['cib-neurona', 'pe-probabilidad']
      },
      {
        id: 'cib-autoorganizacion', t: 'Autoorganización: autómatas celulares',
        r: 'Reglas locales simplísimas que producen orden global sin que nadie dirija.',
        o: ['Autómatas de una dimensión', 'El Juego de la Vida', 'Emergencia y patrones de Turing'],
        req: ['cib-variedad']
      },
      {
        id: 'cib-viable', t: 'El modelo de sistema viable',
        r: 'Stafford Beer llevó la variedad requerida a las organizaciones: cinco funciones que necesita todo lo que sobrevive.',
        o: ['Los cinco sistemas del modelo', 'Recursividad: organizaciones dentro de organizaciones', 'Cybersyn: Chile, 1971'],
        req: ['cib-variedad', 'cib-homeostasis']
      },
      {
        id: 'cib-segundo-orden', t: 'Cibernética de segundo orden',
        r: 'Cuando quien estudia el sistema forma parte de él.',
        o: ['El teorema del buen regulador', 'Autorreferencia y observador', 'Del control a la conversación'],
        req: ['cib-viable']
      }
    ]
  },

  /* ================= 15. PROGRAMACION GRAFICA =================
     Piel propia: aqui ya no estamos solo en matematicas. Es la golosina
     del curso, el sitio al que el alumno viene a convertir numeros en
     algo bello. El campo `piel` es lo unico que hace falta para que todo
     el bloque cambie de color. */
  {
    id: 'gfx', n: 15, title: 'Programación gráfica', piel: 'gfx', curso: 'AMP',
    desc: 'Reglas de tres líneas que producen imágenes que no caben en la cabeza. Las matemáticas del curso —la geometría del espacio de 2.º incluida— dibujándose a sesenta imágenes por segundo.',
    temas: [
      {
        id: 'gfx-pixel', t: 'El píxel que se pregunta de qué color es',
        r: 'Un shader no dibuja: contesta. El cambio de mentalidad que lo abre todo.',
        o: ['Qué es un fragment shader', 'Coordenadas normalizadas', 'Tu primer shader en tres líneas'],
        req: ['fn-concepto']
      },
      {
        id: 'gfx-coordenadas', t: 'El lienzo es un plano cartesiano',
        r: 'Centrar el origen, arreglar la deformación de la pantalla y pasarse a polares.',
        o: ['De píxeles a coordenadas', 'Corregir la relación de aspecto', 'Coordenadas polares con atan y length'],
        req: ['gfx-pixel', 'tr-circunferencia']
      },
      {
        id: 'gfx-distancia', t: 'Distancia: dibujar sin dibujar',
        r: 'Un círculo no se traza: se pregunta. Funciones de distancia con signo.',
        o: ['La distancia como campo', 'step y el borde duro', 'smoothstep y el antialiasing'],
        req: ['gfx-coordenadas', 'ge-pitagoras']
      },
      {
        id: 'gfx-raton', t: 'El ratón entra en la ecuación',
        r: 'iMouse: la pantalla deja de ser un cuadro y se vuelve un instrumento.',
        o: ['Leer la posición del ratón', 'Arrastrar una luz y un punto', 'La distancia al ratón: iluminar y deformar'],
        req: ['gfx-distancia']
      },
      {
        id: 'gfx-decidir', t: 'Decidir sin bifurcar',
        r: 'mix, clamp, min y max: la lógica booleana escrita con aritmética.',
        o: ['mix como interpolación', 'min y max como unión e intersección', 'Por qué se evita el if'],
        req: ['gfx-distancia']
      },
      {
        id: 'gfx-tiempo', t: 'El tiempo entra en la ecuación',
        r: 'Todo el movimiento del mundo sale de un seno.',
        o: ['El uniform iTime', 'Amplitud, frecuencia y fase', 'Desfasar el espacio para animar'],
        req: ['gfx-decidir', 'tr-funciones']
      },
      {
        id: 'gfx-curvas', t: 'Curvas: segmentos, Bézier y suavizado',
        r: 'La distancia a un segmento es una proyección y smoothstep es un polinomio: trazos y animaciones suaves.',
        o: ['Distancia a un segmento', 'Curvas de Bézier', 'Funciones de suavizado para animar'],
        req: ['gfx-tiempo', 'ge-vectores']
      },
      {
        id: 'gfx-repetir', t: 'Repetir el espacio: fract y mod',
        r: 'Una rejilla infinita con una sola operación: plegar el dominio.',
        o: ['La parte decimal como repetición', 'Coordenada local y celda', 'Variar cada celda sin bucles'],
        req: ['gfx-tiempo']
      },
      {
        id: 'gfx-matrices', t: 'Matrices que giran el mundo',
        r: 'Rotar, escalar y torcer, y la idea que descoloca: transformas la coordenada, no la figura.',
        o: ['La matriz de rotación 2×2', 'Por qué todo va al revés', 'Componer transformaciones'],
        req: ['gfx-repetir', 'ge-transformaciones']
      },
      {
        id: 'gfx-color', t: 'El color como función',
        r: 'Del gris al arcoíris con una línea de cosenos, y por qué las mezclas suelen salir sucias.',
        o: ['La paleta de cosenos', 'Gamma: mezclar sin ensuciar', 'HSV: el tono es un ángulo'],
        req: ['gfx-matrices', 'tr-funciones']
      },
      {
        id: 'gfx-ruido', t: 'Azar sin azar: ruido',
        r: 'El azar reproducible, que es el único que sirve para dibujar.',
        o: ['Funciones hash deterministas', 'Ruido de valor y ruido de gradiente', 'Ruido fractal (fbm)'],
        req: ['gfx-color']
      },
      {
        id: 'gfx-warp', t: 'Torcer el espacio',
        r: 'Meter ruido dentro del ruido. La receta más rentable del arte generativo.',
        o: ['Desplazar el dominio antes de dibujar', 'Ruido dentro de ruido', 'Dos vueltas de deformación y el humo que sale'],
        req: ['gfx-ruido']
      },
      {
        id: 'gfx-voronoi', t: 'Voronoi: el patrón de las células',
        r: 'Sembrar puntos y preguntar por el más cercano: escamas, cristales, grietas y piel de jirafa.',
        o: ['La distancia al punto sembrado más cercano', 'Mirar solo las nueve celdas vecinas', 'Bordes, células y la segunda distancia'],
        req: ['gfx-repetir', 'gfx-ruido']
      },
      {
        id: 'gfx-simetria', t: 'Caleidoscopios',
        r: 'Un valor absoluto es un espejo. Con dos o tres se construye cualquier roseta.',
        o: ['abs como espejo', 'Simetría de orden n en polares', 'Plegar varias veces: el caleidoscopio'],
        req: ['gfx-matrices', 'gfx-coordenadas']
      },
      {
        id: 'gfx-mosaicos', t: 'Mosaicos: Truchet, hexágonos y teselados',
        r: 'Una pieza, una regla de giro y el plano entero cubierto sin huecos.',
        o: ['Mosaicos de Truchet con una moneda por celda', 'Rejillas hexagonales', 'Teselados y grupos de simetría'],
        req: ['gfx-simetria', 'gfx-ruido']
      },
      {
        id: 'gfx-hiperbolico', t: 'El disco de Poincaré en un shader',
        r: 'Geometría hiperbólica tocable: transformaciones de Möbius y mosaicos que no caben en el plano.',
        o: ['El disco de Poincaré', 'Transformaciones de Möbius con números complejos', 'Teselados hiperbólicos por reflexiones'],
        req: ['gfx-mosaicos', 'av-noeuclidea', 'al-complejos']
      },
      {
        id: 'gfx-derivadas', t: 'Derivar dentro del shader',
        r: 'fwidth y dFdx: el antialiasing que se calcula solo y las normales de un relieve.',
        o: ['Derivadas por diferencias entre píxeles vecinos', 'Antialiasing independiente del zoom', 'Normales a partir de un campo de alturas'],
        req: ['gfx-warp', 'fn-derivadas']
      },
      {
        id: 'gfx-buffers', t: 'El shader que recuerda',
        r: 'Leer el fotograma anterior: el Juego de la Vida y la reacción-difusión, en la tarjeta gráfica.',
        o: ['Realimentación entre fotogramas', 'Un autómata celular en la GPU', 'Reacción-difusión: manchas de Turing'],
        req: ['gfx-derivadas', 'cib-autoorganizacion', 'av-edp']
      },
      {
        id: 'gfx-tunel', t: 'El túnel',
        r: 'El efecto que definió una época: polares, una división y la ilusión de profundidad infinita.',
        o: ['Uno partido por erre es profundidad', 'Vestir la pared sin tener texturas', 'Curvar el túnel y hacerlo respirar'],
        req: ['gfx-coordenadas', 'gfx-tiempo']
      },
      {
        id: 'gfx-trazado', t: 'Trazado de rayos: la geometría de 2.º, dibujando',
        r: 'Un rayo que choca con una esfera es una ecuación de segundo grado; con un plano, la intersección recta-plano.',
        o: ['El rayo como recta paramétrica', 'Rayo-esfera: el discriminante decide si hay choque', 'Rayo-plano y la reflexión con el producto escalar'],
        req: ['gfx-coordenadas', 'ge-metrico', 'al-ec2']
      },
      {
        id: 'gfx-camara', t: 'La cámara: una base con el producto vectorial',
        r: 'Mirar hacia un punto es construir tres vectores perpendiculares.',
        o: ['La base de la cámara con el producto vectorial', 'Campo de visión y perspectiva', 'Mover la cámara alrededor de la escena'],
        req: ['gfx-trazado', 'ge-espacio-vectores']
      },
      {
        id: 'gfx-raymarching', t: 'Raymarching: 3D con una fórmula',
        r: 'Esferas y cajas sin un solo triángulo, avanzando a lo largo de la mirada.',
        o: ['Distancias con signo en 3D', 'El algoritmo de avance por esferas', 'Luz con la normal, que es el gradiente'],
        req: ['gfx-camara', 'gfx-distancia']
      },
      {
        id: 'gfx-escena', t: 'Modelar con distancias',
        r: 'Uniones suaves, repetición infinita y torsiones: un catálogo para construir cualquier cosa.',
        o: ['smin: fundir dos cuerpos', 'Repetir el espacio en tres dimensiones', 'Torcer, doblar y rascar la superficie'],
        req: ['gfx-raymarching']
      },
      {
        id: 'gfx-luz', t: 'Luz, sombra y aire',
        r: 'Sombras suaves, oclusión ambiental, brillo especular y niebla: lo que separa una maqueta de una imagen.',
        o: ['Sombras suaves con la distancia más corta', 'Oclusión ambiental de tres líneas', 'Especular, Fresnel y niebla'],
        req: ['gfx-escena', 'fn-exp-log']
      },
      {
        id: 'gfx-fractales', t: 'Fractales: iterar en el plano complejo',
        r: 'Mandelbrot, Julia y Newton en tiempo real, con zoom. El caos, ahora tocable.',
        o: ['Iterar z² + c en el shader', 'Escape, coloreado y conjuntos de Julia', 'El fractal de Newton'],
        req: ['al-complejos', 'gfx-color']
      },
      {
        id: 'gfx-post', t: 'La última pasada',
        r: 'Viñeta, aberración cromática, grano y trama: el acabado que hace que una imagen parezca de alguien.',
        o: ['Trabajar sobre el color ya calculado', 'Viñeta y aberración cromática', 'Grano, tramado y líneas de barrido'],
        req: ['gfx-color']
      },
      {
        id: 'gfx-filtros', t: 'Filtros de cámara: la imagen como función',
        r: 'Blanco y negro, sepia, desenfoque, bordes y trama de puntos, sobre una foto o sobre tu cámara.',
        o: ['Leer una imagen con texture2D', 'Filtros de un píxel: brillo, contraste y color', 'Convolución: desenfoque, nitidez y bordes'],
        req: ['gfx-post', 'gfx-derivadas', 'cib-filtrado']
      },
      {
        id: 'gfx-directo', t: 'La actuación',
        r: 'Del ejercicio al directo: reglas simples, complejidad epatante, y adónde ir después.',
        o: ['Componer un shader por capas', 'Parámetros como mandos de una actuación', 'Herramientas libres y comunidad'],
        req: ['gfx-post', 'gfx-luz']
      }
    ]
  }
];
