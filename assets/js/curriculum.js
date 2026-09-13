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
   (11), estructuras (12), matematica discreta (13), cibernetica (14),
   sintesis de sonido (16), programacion grafica (17), criptografia (18) e
   inteligencia artificial (19 y 20).

   Los tres ultimos bloques son optativos y tienen piel propia. No se dan
   por sabidos unos a otros: un alumno puede hacer criptografia sin haber
   hecho shaders, y la IA sin haber hecho ninguno de los dos. Por eso en
   `req` solo van requisitos de verdad, y lo que es una pasarela bonita
   entre bloques optativos se escribe como enlace [[id]] en la prosa.

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
        id: 'av-pca', t: 'Componentes principales',
        r: 'Los ejes que mejor resumen una nube de datos son los autovectores de su covarianza.',
        o: ['La matriz de covarianza y lo que mide', 'Los autovectores como ejes de máxima varianza', 'Comprimir perdiendo lo mínimo, y cuánto se pierde'],
        req: ['av-lineal', 'pe-bidimensional']
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
      },
      {
        id: 'av-convolucion', t: 'Convolución: el filtro que se desliza',
        r: 'La media móvil, el desenfoque y la detección de bordes son la misma operación.',
        o: ['Deslizar un núcleo: convolución en una dimensión', 'Núcleos en dos dimensiones sobre una imagen', 'El teorema de convolución: un producto en el dominio de la frecuencia'],
        req: ['fn-integral-def', 'fn-derivadas', 'av-fourier']
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

  /* ================= 15. MAQUINAS Y LENGUAJES =================
     Va justo despues de cibernetica porque necesita su realimentacion y su
     retardo: un biestable es un bucle que se acuerda, y eso alli ya esta
     contado. Dos tramos que se cierran uno sobre otro: el compilador del
     tramo B genera el ensamblador de la CPU del tramo A, asi que al final
     el programa del alumno corre en la maquina del alumno.

     Ojo al orden con programacion grafica: `gfx-decidir` (decidir sin
     bifurcar) es hermano de `maq-decidir`, pero va DESPUES, asi que el
     puente entre los dos se escribe alli y apunta hacia atras. */
  {
    id: 'maq', n: 15, title: 'Máquinas y lenguajes', piel: 'maq', curso: 'AMP',
    desc: 'Un ordenador no entiende nada: son tablas de verdad apiladas. Y un lenguaje de programación no es magia: es un texto que otro programa traduce. Se construyen los dos, de abajo arriba, hasta que el segundo corre sobre el primero.',
    temas: [
      {
        id: 'maq-bits', t: 'Contar con dos símbolos: binario, hexadecimal y complemento a dos',
        r: 'El valor posicional con dos dedos en vez de diez, y cómo se escribe un número negativo sin signo.',
        o: ['Binario y hexadecimal como valor posicional', 'Complemento a dos: el negativo que suma solo', 'Desbordamiento y por qué 0,1 no cabe'],
        req: ['ar-naturales', 'ar-enteros', 'ar-potencias', 'ar-decimales']
      },
      {
        id: 'maq-puertas', t: 'La puerta lógica: una tabla de verdad hecha de cables',
        r: 'Las conectivas de la lógica, ahora con corriente. Y una sola de ellas basta para todas.',
        o: ['Y, O y NO como circuitos', 'La tabla de verdad es el plano', 'NAND lo construye todo'],
        req: ['lg-proposiciones']
      },
      {
        id: 'maq-sumador', t: 'Sumar con cables: semisumador, sumador completo y el acarreo',
        r: 'La suma de toda la vida, cableada. Y por qué el acarreo es lo que frena a un procesador.',
        o: ['Semisumador: suma y acarreo', 'Encadenar sumadores completos', 'Por qué el acarreo es lento'],
        req: ['maq-puertas', 'ar-operaciones']
      },
      {
        id: 'maq-decidir', t: 'El «si» no existe: multiplexor y comparador',
        r: 'Un circuito no bifurca: calcula las dos ramas y elige una con aritmética.',
        o: ['El multiplexor como si-entonces', 'Comparar dos números con puertas', 'Elegir sin bifurcar'],
        req: ['maq-puertas', 'lg-proposiciones']
      },
      {
        id: 'maq-memoria', t: 'Un bit que se acuerda: el biestable es un bucle con retardo',
        r: 'Realimentar una puerta sobre sí misma, y que el retardo del cable se convierta en memoria.',
        o: ['El cerrojo: realimentación que recuerda', 'Por qué puede oscilar', 'Registro y reloj'],
        req: ['maq-puertas', 'cib-realimentacion', 'cib-retardos']
      },
      {
        id: 'maq-normal', t: 'Cualquier tabla se puede construir: forma normal y simplificación',
        r: 'De una tabla de verdad cualquiera a un circuito, y de ahí a uno más barato.',
        o: ['Suma de productos desde la tabla', 'Simplificar agrupando', 'Contar el coste en puertas'],
        req: ['maq-puertas', 'lg-proposiciones']
      },
      {
        id: 'maq-cpu', t: 'La máquina mínima: buscar, decodificar, ejecutar',
        r: 'Un contador, un acumulador, una memoria y un ciclo de tres pasos que no para nunca.',
        o: ['El ciclo de instrucción', 'Registros, memoria y bus', 'La máquina de Turing, con cables'],
        req: ['maq-memoria', 'maq-sumador', 'maq-decidir', 'av-computabilidad']
      },
      {
        id: 'maq-ensamblador', t: 'Hablarle a la máquina: saltos, bucles y pila',
        r: 'Las instrucciones con nombre, las etiquetas que evitan contar direcciones, y una pila.',
        o: ['Etiquetas y saltos', 'Un bucle escrito a mano', 'La pila: guardar para volver'],
        req: ['maq-cpu']
      },
      {
        id: 'len-tokens', t: 'Trocear el texto: el analizador léxico es un autómata',
        r: 'Antes de entender una frase hay que partirla en piezas, y eso lo hace una máquina de estados.',
        o: ['De caracteres a piezas', 'El autómata que reconoce números y nombres', 'Qué hacer con lo que no encaja'],
        req: ['maq-ensamblador', 'av-computabilidad']
      },
      {
        id: 'len-gramatica', t: 'Gramáticas: reglas que generan frases',
        r: 'Unas pocas reglas con flechas describen infinitas frases correctas. Y a veces, dos a la vez.',
        o: ['Reglas, símbolos y derivaciones', 'Recursión: reglas que se nombran a sí mismas', 'Ambigüedad, y por qué importa'],
        req: ['len-tokens', 'lg-demostracion', 'av-grafos']
      },
      {
        id: 'len-arbol', t: 'Del texto al árbol: precedencia, asociatividad y descenso recursivo',
        r: 'El corrector que acepta 120/7 en todos los ejercicios del curso es esto, y lo vas a construir.',
        o: ['Por qué la jerarquía es la forma del árbol', 'Descenso recursivo, una función por nivel', 'Asociatividad y paréntesis'],
        req: ['len-gramatica', 'ar-operaciones']
      },
      {
        id: 'len-pila', t: 'Notación polaca inversa: evaluar es recorrer el árbol',
        r: 'Sin paréntesis y sin precedencia, con una pila y recorriendo el árbol por abajo.',
        o: ['Recorrido en postorden', 'Evaluar con una pila', 'De la pila a las instrucciones'],
        req: ['len-arbol', 'maq-ensamblador']
      },
      {
        id: 'len-variables', t: 'Nombres y ámbito: un entorno es una aplicación de nombres en valores',
        r: 'Dar nombre a un valor es definir una aplicación, y el ámbito dice dónde vale.',
        o: ['El entorno como aplicación', 'Asignar, leer y sombrear', 'Dónde vive cada nombre'],
        req: ['len-arbol', 'lg-conjuntos']
      },
      {
        id: 'len-funciones', t: 'Funciones y recursión: el marco de llamada y la pila que crece',
        r: 'Llamar es apilar. La inducción de las demostraciones y la recursión de los programas son la misma idea.',
        o: ['El marco de llamada', 'Recursión e inducción', 'Cuando la pila se acaba'],
        req: ['len-variables', 'lg-demostracion', 'fn-sucesiones']
      },
      {
        id: 'len-compilar', t: 'Compilar en vez de interpretar: generar el ensamblador del tramo A',
        r: 'El momento en que los dos tramos se tocan: tu programa se convierte en instrucciones de tu máquina.',
        o: ['Interpretar frente a compilar', 'Generar código desde el árbol', 'Comprobar que dan lo mismo'],
        req: ['len-funciones', 'maq-ensamblador']
      },
      {
        id: 'len-optimizar', t: 'Plegar constantes, quitar código muerto y medir la mejora',
        r: 'Lo que se puede calcular antes de ejecutar, y lo que no se va a ejecutar nunca.',
        o: ['Plegado de constantes', 'Código muerto', 'Medir: instrucciones y pasos'],
        req: ['len-compilar']
      },
      {
        id: 'len-autorreferencia', t: 'El programa que se escribe a sí mismo',
        r: 'Un programa que imprime su propio texto, y un intérprete escrito en el lenguaje que interpreta.',
        o: ['La diagonal, otra vez', 'El quine', 'Interpretarse a sí mismo'],
        req: ['len-compilar', 'av-computabilidad', 'av-infinito', 'cib-segundo-orden']
      },
      {
        id: 'len-taller', t: 'Tu propio lenguaje, corriendo en tu propia máquina',
        r: 'Todo junto y a la vista, y qué hace de más un compilador de verdad.',
        o: ['Los cuatro paneles a la vez', 'Del texto a la máquina, sin cortes', 'Qué le falta para ser de verdad'],
        req: ['len-optimizar', 'len-autorreferencia']
      }
    ]
  },

  /* ================= 16. SINTESIS DE SONIDO =================
     Entre las maquinas y la imagen: el sonido. Un sonido es una funcion
     del tiempo, y una formula de tres lineas ya se oye. El bloque va de la
     onda a la nota, de la nota al timbre y del timbre a la musica, con un
     sintetizador que se programa como se programa un shader. Piel propia,
     como los otros bloques optativos, y sin dar por sabido ninguno de
     ellos: los requisitos son del tronco del curso. */
  {
    id: 'son', n: 16, title: 'Síntesis de sonido', piel: 'son', curso: 'AMP',
    desc: 'Un sonido es una función del tiempo, y una fórmula de tres líneas ya suena. De la onda a la nota, de la nota al timbre y del timbre a la música: el seno, el logaritmo, Fourier y las sucesiones recurrentes, escuchándose en un sintetizador que se programa como un shader.',
    temas: [
      {
        id: 'son-onda', t: 'El sonido es una función',
        r: 'Una presión que cambia con el tiempo; un seno que se oye; la primera fórmula que suena.',
        o: ['Qué es un sonido y qué es una onda', 'Amplitud, frecuencia y fase de un seno', 'Escribir y tocar una función del tiempo'],
        req: ['tr-funciones', 'fn-concepto']
      },
      {
        id: 'son-muestras', t: 'Muestrear: de la curva a la lista de números',
        r: 'El sonido digital es una sucesión; cuántas muestras hacen falta y qué pasa si faltan.',
        o: ['Frecuencia de muestreo y bits', 'El teorema de Nyquist y el aliasing', 'Cuantización y ruido de redondeo'],
        req: ['son-onda', 'fn-sucesiones', 'ar-decimales']
      },
      {
        id: 'son-tono', t: 'Tono, escala y logaritmo',
        r: 'Doblar la frecuencia sube una octava: la altura se oye en escala logarítmica, y de ahí salen las notas.',
        o: ['La octava y el semitono: 2 elevado a un doceavo', 'De la nota MIDI a los hercios', 'Temperamento igual y afinación justa'],
        req: ['son-onda', 'fn-exp-log', 'al-radicales-log']
      },
      {
        id: 'son-envolvente', t: 'La envolvente: el sonido en el tiempo',
        r: 'Ataque, caída, sostenido y liberación: una función a trozos que multiplica a la onda.',
        o: ['Producto de una onda por una envolvente', 'La caída exponencial y su constante de tiempo', 'ADSR como función definida a trozos'],
        req: ['son-onda', 'fn-racionales', 'fn-exp-log']
      },
      {
        id: 'son-armonicos', t: 'Armónicos y timbre: sumar senos',
        r: 'La misma nota suena distinta en cada instrumento porque lleva otros senos encima: la serie de Fourier, oída.',
        o: ['La serie armónica', 'Sierra, cuadrada y triángulo como sumas de senos', 'El fenómeno de Gibbs, a la escucha'],
        req: ['son-tono', 'av-fourier']
      },
      {
        id: 'son-cuerda', t: 'La cuerda y el tubo: de dónde salen los armónicos',
        r: 'Una onda que va y otra que vuelve se suman en una que no se mueve: los modos de una cuerda.',
        o: ['Ondas estacionarias como suma de dos viajeras', 'Los modos de una cuerda y de un tubo', 'Por qué la longitud fija la nota'],
        req: ['son-armonicos', 'tr-identidades']
      },
      {
        id: 'son-espectro', t: 'El espectro: ver el sonido',
        r: 'La transformada de Fourier de una lista de números, y el espectrograma que lee un sonido como una partitura.',
        o: ['La transformada discreta de Fourier', 'Leer un espectro: fundamental, armónicos, ruido', 'El espectrograma'],
        req: ['son-armonicos', 'son-muestras']
      },
      {
        id: 'son-batidos', t: 'Batidos, acordes y consonancia',
        r: 'Dos senos casi iguales laten; dos en razón simple consuenan. Las identidades trigonométricas explican la afinación.',
        o: ['La suma de dos senos como producto', 'Afinar por batidos', 'Intervalos consonantes y razones de frecuencias'],
        req: ['son-tono', 'tr-identidades']
      },
      {
        id: 'son-modulacion', t: 'Modular: vibrato, trémolo y FM',
        r: 'Mover la amplitud o la frecuencia con otro seno: del vibrato al sintetizador FM que sonó en toda una década.',
        o: ['Modulación de amplitud y bandas laterales', 'Modulación de frecuencia: índice y espectro', 'Un instrumento FM'],
        req: ['son-armonicos', 'son-batidos']
      },
      {
        id: 'son-filtros', t: 'Filtros: quitar frecuencias',
        r: 'Una media que se acuerda de la muestra anterior es un filtro: la sucesión recurrente que apaga los agudos.',
        o: ['La media móvil y el filtro de un polo', 'La respuesta en frecuencia', 'Síntesis sustractiva'],
        req: ['son-espectro', 'fn-sucesiones']
      },
      {
        id: 'son-ruido', t: 'Ruido, percusión y la cuerda pulsada',
        r: 'Azar filtrado: de una lluvia de números al golpe de un tambor y a una cuerda de guitarra.',
        o: ['Ruido blanco y ruido filtrado', 'Envolventes de percusión', 'Karplus-Strong: un retardo y una media'],
        req: ['son-filtros', 'son-envolvente', 'pe-probabilidad']
      },
      {
        id: 'son-eco', t: 'Eco, retardo y reverberación',
        r: 'Sumar el pasado: una suma geométrica que se oye, y por qué la ganancia tiene que ser menor que uno.',
        o: ['Retardo simple y peine', 'Realimentación y la serie geométrica', 'Reverberación como muchos ecos'],
        req: ['son-filtros', 'fn-series']
      },
      {
        id: 'son-secuencia', t: 'Ritmo y secuencias: la música como función del tiempo',
        r: 'Dividir el tiempo en pulsos con la parte entera y el resto: un secuenciador en tres líneas.',
        o: ['Pulso, compás y BPM', 'floor y mod para saber en qué nota estamos', 'Escribir una melodía como una lista'],
        req: ['son-tono', 'son-envolvente', 'ar-divisibilidad']
      },
      {
        id: 'son-taller', t: 'El taller: tu propio sintetizador',
        r: 'Todo junto y a la vista: osciladores, envolvente, filtro, eco y secuencia, en un instrumento que programas tú.',
        o: ['Montar un instrumento completo', 'Componer con código', 'Dónde seguir: SuperCollider, Sonic Pi, Web Audio'],
        req: ['son-secuencia', 'son-modulacion', 'son-eco', 'son-ruido']
      }
    ]
  },

  /* ================= 17. PROGRAMACION GRAFICA =================
     Piel propia: aqui ya no estamos solo en matematicas. Es la golosina
     del curso, el sitio al que el alumno viene a convertir numeros en
     algo bello. El campo `piel` es lo unico que hace falta para que todo
     el bloque cambie de color. */
  {
    id: 'gfx', n: 17, title: 'Programación gráfica', piel: 'gfx', curso: 'AMP',
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
        id: 'gfx-texto', t: 'Letras sin fuentes: texto con distancias',
        r: 'Un marcador de siete segmentos, letras hechas de trazos, un letrero de LED y los efectos de un título.',
        o: ['Cifras de siete segmentos y el bit de un número', 'Letras como unión de segmentos: contorno, brillo y sombra', 'Una fuente de mapa de bits dentro de un float'],
        req: ['gfx-curvas', 'gfx-repetir', 'ar-naturales']
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
        id: 'gfx-fluidos', t: 'Fluidos: tinta, humo y remolinos',
        r: 'Transportar mirando hacia atrás, corrientes sin divergencia y un chorro de humo en un shader con memoria.',
        o: ['Advección semilagrangiana: mirar hacia atrás', 'Campos sin divergencia con ruido rizado', 'Presión, viscosidad y un fluido de una sola pasada'],
        req: ['gfx-buffers', 'av-vectorial', 'gfx-ruido']
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
        id: 'gfx-terreno', t: 'Terreno: montañas con una función de dos variables',
        r: 'Un paisaje infinito de ruido, un paso seguro sobre las laderas y materiales que leen la pendiente.',
        o: ['Avanzar sobre un campo de alturas sin atravesarlo', 'Octavas giradas: montañas, lomas y piedras', 'La normal del terreno y los materiales por pendiente y altura'],
        req: ['gfx-luz', 'gfx-ruido', 'gfx-derivadas']
      },
      {
        id: 'gfx-materiales', t: 'Texturas sólidas: mármol, madera y planetas',
        r: 'El color como función del punto del espacio: vetas sin costuras y un planeta entero con dos ruidos.',
        o: ['Ruido de valor en tres dimensiones', 'Mármol y madera tallados en un bloque', 'Un planeta: mar, tierra, hielo, nubes y atmósfera'],
        req: ['gfx-terreno', 'gfx-trazado', 'gfx-warp']
      },
      {
        id: 'gfx-nubes', t: 'Nubes y humo: la luz dentro de un volumen',
        r: 'Atravesar el humo en rodajas: transmitancia, una suma de Riemann a lo largo del rayo y un cielo de cúmulos.',
        o: ['Beer-Lambert con densidad variable', 'Acumular luz de delante hacia atrás', 'La luz del sol dentro de la nube'],
        req: ['gfx-materiales', 'gfx-luz', 'fn-integral-def']
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
  },

  /* ================= 17. CRIPTOGRAFÍA ================= */
  {
    id: 'cr', n: 18, title: 'Criptografía', piel: 'cr', curso: 'AMP',
    desc: 'Guardar un secreto delante de quien lo quiere. Del disco de César a las curvas elípticas y a lo que resistirá a un ordenador cuántico, con la aritmética modular, las matrices, la probabilidad y los polinomios del curso trabajando de verdad: cada cifrado se rompe y se repara aquí mismo.',
    temas: [
      {
        id: 'cr-secretos', t: 'Qué es un secreto: mensaje, clave y adversario',
        r: 'El vocabulario y las reglas del juego: quién habla, quién escucha, qué se esconde y qué no.',
        o: ['Cifrar, codificar y esconder no son lo mismo', 'El principio de Kerckhoffs: el secreto está en la clave', 'Contar claves: el espacio de claves'],
        req: ['lg-conjuntos', 'pe-combinatoria']
      },
      {
        id: 'cr-cesar', t: 'El cifrado de César: sumar en un reloj de 26 horas',
        r: 'Desplazar el alfabeto es sumar módulo 26, y romperlo es probar 25 llaves.',
        o: ['Cifrar y descifrar con la aritmética del reloj', 'La fuerza bruta', 'Por qué 26 claves no protegen nada'],
        req: ['cr-secretos', 'av-numeros']
      },
      {
        id: 'cr-frecuencias', t: 'Análisis de frecuencias: el idioma delata la clave',
        r: 'Con 26! alfabetos posibles, la sustitución parecía irrompible. Al-Kindi la rompió contando letras.',
        o: ['Sustitución monoalfabética y su espacio de claves', 'Las frecuencias del castellano', 'Romper un César y una sustitución con estadística'],
        req: ['cr-cesar', 'pe-descriptiva']
      },
      {
        id: 'cr-afin', t: 'El cifrado afín y el inverso modular',
        r: 'Multiplicar y sumar módulo 26, y la condición para poder deshacerlo.',
        o: ['La función $y = ax + b \\bmod 26$', 'Cuándo $a$ tiene inverso: el máximo común divisor', 'Euclides extendido para encontrarlo'],
        req: ['cr-cesar', 'ar-divisibilidad']
      },
      {
        id: 'cr-vigenere', t: 'Vigenère y cómo se rompe: Kasiski y el índice de coincidencia',
        r: 'Una clave que cambia de letra en letra confundió a Europa tres siglos, hasta que se midió la periodicidad.',
        o: ['Cifrado polialfabético con una palabra clave', 'Distancias entre repeticiones y el máximo común divisor', 'El índice de coincidencia como detector de idioma'],
        req: ['cr-frecuencias', 'ar-divisibilidad']
      },
      {
        id: 'cr-transposicion', t: 'Transposición: desordenar en vez de sustituir',
        r: 'La escítala y las columnas: las letras son las mismas, en otro orden. Permutaciones con nombre y apellido.',
        o: ['Transposición por columnas con palabra clave', 'La clave como permutación', 'Cifrados producto: sustituir y transponer'],
        req: ['cr-cesar', 'pe-combinatoria']
      },
      {
        id: 'cr-hill', t: 'El cifrado de Hill: matrices módulo 26',
        r: 'Cifrar de dos en dos letras con una matriz, y por qué el determinante decide si se puede descifrar.',
        o: ['Bloques de letras como vectores', 'La inversa de una matriz módulo 26', 'Difusión: una letra cambia varias'],
        req: ['cr-afin', 'al-inversa']
      },
      {
        id: 'cr-vernam', t: 'La libreta de un solo uso: el único cifrado perfecto',
        r: 'XOR con una clave tan larga como el mensaje, y el teorema de Shannon de que no se puede hacer mejor.',
        o: ['Bits, bytes y la operación XOR', 'Secreto perfecto: el cifrado no dice nada del mensaje', 'Por qué reutilizar la libreta lo arruina todo'],
        req: ['cr-secretos', 'av-informacion']
      },
      {
        id: 'cr-enigma', t: 'Enigma: permutaciones que giran',
        r: 'Tres rotores, un reflector y un tablero de clavijas: la máquina, su matemática y la grieta por la que se rompió.',
        o: ['Un rotor es una permutación; girarlo, conjugarla', 'El reflector: por qué ninguna letra se cifra en sí misma', 'Rejewski, los ciclos y la bomba de Turing'],
        req: ['cr-transposicion', 'av-grupos']
      },
      {
        id: 'cr-entropia', t: 'Aleatoriedad, entropía y contraseñas',
        r: 'Cuánto cuesta adivinar: bits de entropía, generadores de números y por qué «aleatorio» no basta.',
        o: ['El logaritmo en base 2 del número de claves', 'Contraseñas: longitud, alfabeto y diccionarios', 'Generadores pseudoaleatorios y sus patrones'],
        req: ['cr-vernam', 'fn-exp-log']
      },
      {
        id: 'cr-flujo', t: 'Cifrado de flujo: fabricar la libreta con un registro',
        r: 'Un LFSR estira una clave corta en un chorro de bits, y su linealidad es también su talón de Aquiles.',
        o: ['Registros de desplazamiento con realimentación lineal', 'Periodo máximo y polinomios primitivos', 'Cifrar con un flujo y por qué no repetir el nonce'],
        req: ['cr-entropia', 'al-polinomios']
      },
      {
        id: 'cr-bloque', t: 'Cifrado por bloques: confusión y difusión',
        r: 'Cajas de sustitución, permutaciones y rondas: la receta de Shannon para que cada bit dependa de todos.',
        o: ['Redes de sustitución y permutación', 'El efecto avalancha', 'Cuántas rondas hacen falta'],
        req: ['cr-hill', 'cr-vernam']
      },
      {
        id: 'cr-feistel', t: 'Redes de Feistel y DES',
        r: 'Una estructura que se deshace sola aunque su función interna no tenga inversa, y la historia de la clave de 56 bits.',
        o: ['La ronda de Feistel y su inversa', 'DES, 3DES y el ataque del encuentro a medio camino', 'Cuándo una clave se queda corta'],
        req: ['cr-bloque']
      },
      {
        id: 'cr-galois', t: 'Los bytes como polinomios: el cuerpo de 256 elementos',
        r: 'Sumar es XOR y multiplicar es reducir módulo un polinomio: la aritmética que hay dentro de AES y de los códigos QR.',
        o: ['Polinomios con coeficientes 0 y 1', 'Multiplicar módulo $x^8 + x^4 + x^3 + x + 1$', 'Inversos en un cuerpo finito'],
        req: ['cr-bloque', 'al-polinomios']
      },
      {
        id: 'cr-aes', t: 'AES: el cifrado del mundo, paso a paso',
        r: 'Diez rondas de cuatro operaciones sobre una rejilla de 16 bytes. Se ve entera, byte a byte.',
        o: ['SubBytes, ShiftRows, MixColumns y AddRoundKey', 'La expansión de la clave', 'Por qué es rápido y por qué se confía en él'],
        req: ['cr-galois', 'cr-feistel']
      },
      {
        id: 'cr-modos', t: 'Modos de operación: el pingüino que se veía a través del cifrado',
        r: 'Un bloque cifra 16 bytes; un mensaje tiene miles. Cómo encadenarlos decide si el cifrado protege algo.',
        o: ['ECB y por qué delata las imágenes', 'CBC: encadenar con el bloque anterior y el vector inicial', 'CTR: un cifrado de bloque convertido en flujo'],
        req: ['cr-aes']
      },
      {
        id: 'cr-hash', t: 'Funciones hash: la huella digital de los datos',
        r: 'Resumir cualquier cosa en 256 bits sin que nadie pueda fabricar dos cosas con el mismo resumen.',
        o: ['Preimagen, segunda preimagen y colisión', 'La paradoja del cumpleaños y los $2^{n/2}$', 'SHA-256 en directo'],
        req: ['cr-aes', 'pe-probabilidad']
      },
      {
        id: 'cr-mac', t: 'Autenticar: que nadie cambie el mensaje',
        r: 'Cifrar no impide alterar. Los códigos de autenticación y HMAC ponen un sello que solo se puede fabricar con la clave.',
        o: ['Cambiar un cifrado sin descifrarlo', 'MAC y HMAC', 'Cifrar y después sellar: el cifrado autenticado'],
        req: ['cr-hash', 'cr-modos']
      },
      {
        id: 'cr-contrasenas', t: 'Guardar contraseñas: sal y lentitud',
        r: 'Cómo un servidor comprueba tu contraseña sin conocerla, y qué pasa cuando le roban la base de datos.',
        o: ['Hash de contraseñas y ataques de diccionario', 'La sal contra las tablas precalculadas', 'Hashes lentos a propósito: el factor de coste'],
        req: ['cr-hash', 'cr-entropia']
      },
      {
        id: 'cr-modular', t: 'Herramientas modulares: Euclides extendido, potencias y el teorema chino',
        r: 'Los tres algoritmos que hacen posible la clave pública, con la cuenta de cuánto cuesta cada uno.',
        o: ['El inverso modular con la tabla de Euclides', 'Exponenciación por cuadrados sucesivos', 'El teorema chino del resto'],
        req: ['cr-afin', 'av-numeros']
      },
      {
        id: 'cr-primos', t: 'Fabricar primos de 300 cifras',
        r: 'El test de Fermat, los números que lo engañan y Miller-Rabin, que no se deja: primos con probabilidad de error menor que un rayo.',
        o: ['El test de Fermat y los números de Carmichael', 'Miller-Rabin y los testigos', 'Cuántos intentos hacen falta: la densidad de los primos'],
        req: ['cr-modular', 'pe-probabilidad']
      },
      {
        id: 'cr-rsa', t: 'RSA a fondo',
        r: 'Generar las claves, cifrar por bloques, descifrar más deprisa con el teorema chino y ver por qué el RSA de libro no basta.',
        o: ['Claves con $e = 65537$', 'Descifrado con el teorema chino del resto', 'Maleabilidad y relleno: por qué se añade aleatoriedad'],
        req: ['cr-primos', 'av-numeros']
      },
      {
        id: 'cr-factorizar', t: 'Romper RSA: factorizar',
        r: 'De la división por tentativa a Pollard rho: cuánto cuesta cada método y por qué las claves miden 2048 bits.',
        o: ['El método de Fermat y los primos demasiado cercanos', 'Pollard rho: cumpleaños en la factorización', 'Los récords y el tamaño de las claves'],
        req: ['cr-rsa']
      },
      {
        id: 'cr-logdiscreto', t: 'El logaritmo discreto a fondo: ElGamal y el hombre en el medio',
        r: 'Generadores, órdenes, el ataque de paso de bebé y paso de gigante, el cifrado de ElGamal y por qué Diffie-Hellman necesita firmas.',
        o: ['Generadores y primos seguros', 'Paso de bebé, paso de gigante: $\\sqrt{p}$ en vez de $p$', 'ElGamal y el ataque del hombre en el medio'],
        req: ['av-cripto-curvas', 'cr-modular']
      },
      {
        id: 'cr-firmas', t: 'Firmas digitales',
        r: 'Firmar es descifrar: cómo se demuestra la autoría de un mensaje y por qué se firma el hash, no el mensaje.',
        o: ['Firmar con la clave privada y verificar con la pública', 'Por qué se firma el hash', 'Firmas con logaritmo discreto y el desastre del nonce repetido'],
        req: ['cr-rsa', 'cr-hash']
      },
      {
        id: 'cr-curvas', t: 'Curvas elípticas en la práctica',
        r: 'Contar puntos, multiplicar por doblado y suma, y por qué 256 bits de curva valen por 3072 de RSA.',
        o: ['Los puntos de una curva módulo $p$ y el teorema de Hasse', 'Doblar y sumar: $kG$ en $\\log_2 k$ pasos', 'ECDH, las curvas con nombre y los tamaños de clave'],
        req: ['av-cripto-curvas', 'cr-logdiscreto']
      },
      {
        id: 'cr-certificados', t: 'Certificados y el candado del navegador',
        r: 'Qué pasa en los primeros milisegundos de una conexión segura: firmas, cadenas de confianza y claves de sesión.',
        o: ['Un certificado es una firma sobre una clave pública', 'La cadena de confianza y las autoridades', 'El apretón de manos de TLS'],
        req: ['cr-firmas', 'cr-logdiscreto', 'cr-mac']
      },
      {
        id: 'cr-compartir', t: 'Compartir un secreto: el esquema de Shamir',
        r: 'Repartir una clave entre cinco personas de modo que tres cualesquiera la recuperen y dos no sepan nada. Es interpolar un polinomio.',
        o: ['Un polinomio de grado $k - 1$ pasa por $k$ puntos', 'Partes, umbral y recuperación con Lagrange', 'Por qué $k - 1$ partes no dicen nada'],
        req: ['cr-modular', 'al-polinomios']
      },
      {
        id: 'cr-conocimiento-cero', t: 'Pruebas de conocimiento cero y compromisos',
        r: 'Demostrar que sabes un secreto sin revelar nada de él, y comprometerse con una elección antes de enseñarla.',
        o: ['La cueva de Alí Babá y la probabilidad de engañar', 'El protocolo de Schnorr: compromiso, reto y respuesta', 'Compromisos con hash y lanzar una moneda por teléfono'],
        req: ['cr-logdiscreto', 'cr-hash', 'pe-probabilidad']
      },
      {
        id: 'cr-cadena', t: 'Cadenas de bloques y árboles de Merkle',
        r: 'Encadenar hashes para que nadie pueda cambiar el pasado, y demostrar que un dato está en un millón con veinte hashes.',
        o: ['La cadena de hashes y la prueba de trabajo', 'Dificultad y número esperado de intentos', 'Árboles de Merkle y pruebas de pertenencia'],
        req: ['cr-hash', 'cr-conocimiento-cero']
      },
      {
        id: 'cr-canales', t: 'Ataques por canales laterales: cuando el reloj habla',
        r: 'La matemática era perfecta y el sistema cayó igual: el tiempo, los errores y las malas implementaciones.',
        o: ['Comparar contraseñas en tiempo constante', 'El oráculo de relleno', 'Claves repetidas, aleatoriedad rota y otros desastres reales'],
        req: ['cr-mac', 'cr-contrasenas', 'pe-inferencia']
      },
      {
        id: 'cr-homomorfico', t: 'Calcular sobre datos cifrados: cifrado homomórfico',
        r: 'Sumar votos sin abrir ningún sobre: el cifrado de Paillier y la idea del cifrado totalmente homomórfico.',
        o: ['RSA multiplica; Paillier suma', 'Un recuento electoral cifrado', 'Hasta dónde llega hoy el cifrado homomórfico'],
        req: ['cr-rsa', 'cr-modular']
      },
      {
        id: 'cr-cuantico', t: 'El ordenador cuántico y el algoritmo de Shor',
        r: 'Factorizar es encontrar un periodo, y un ordenador cuántico encuentra periodos. Qué rompe, qué no y cuándo.',
        o: ['De la factorización al orden de un número', 'Encontrar el periodo con una transformada de Fourier', 'Grover y las claves simétricas'],
        req: ['cr-factorizar', 'av-fourier']
      },
      {
        id: 'cr-poscuantico', t: 'Criptografía poscuántica: retículos y firmas con hash',
        r: 'Lo que ya sustituye a RSA en los navegadores: aprender con errores, y firmar con una función hash.',
        o: ['Retículos y el vector más cercano', 'Cifrar un bit con aprendizaje con errores', 'Firmas de Lamport'],
        req: ['cr-cuantico', 'av-espacios']
      },
      {
        id: 'cr-bb84', t: 'Distribución cuántica de claves: BB84',
        r: 'Enviar una clave con fotones de modo que espiar se note. Es probabilidad, y se simula entera.',
        o: ['Bases, medidas y el bit que se destruye al mirarlo', 'Cribar la clave: la mitad se tira', 'La espía introduce un 25 % de errores'],
        req: ['cr-poscuantico', 'pe-binomial']
      },
      {
        id: 'cr-bolsillo', t: 'La criptografía en tu bolsillo',
        r: 'Lo que ocurre cuando envías un mensaje: trinquetes, secreto hacia delante, tarjetas, llaves de acceso y las reglas para no meter la pata.',
        o: ['El doble trinquete de la mensajería cifrada', 'Secreto hacia delante', 'Las diez reglas del que no es criptógrafo'],
        req: ['cr-certificados', 'cr-bb84']
      }
    ]
  },

  /* ================= 18. INTELIGENCIA ARTIFICIAL I =================
     La tesis del bloque, que tiene que notarse en cada tema: no hay magia.
     Es el producto escalar, el gradiente y Bayes, repetidos millones de
     veces. Cada tema entra por la idea matematica nueva que aporta, y
     todas estan ya explicadas antes en el curso.

     La neurona NO esta aqui: se explico en cibernetica (cib-neurona), con
     McCulloch-Pitts, la regla del perceptron y XOR. Este bloque la retoma
     en ia-sigmoide -que es lo nuevo: un umbral que se puede derivar- en
     vez de contarla dos veces. */
  {
    id: 'ia1', n: 19, title: 'Inteligencia artificial I: aprender de los datos', piel: 'ia', curso: 'AMP',
    desc: 'Qué significa que una máquina aprenda: un modelo con parámetros, una medida de lo mal que va y un gradiente que los corrige. De clasificar por la distancia a una red entrenada, regularizada y evaluada con honestidad sobre lo que no sabe.',
    temas: [
      {
        id: 'ia-que-es', t: 'Aprender es ajustar números',
        r: 'De las reglas escritas a mano a un modelo con parámetros que se corrigen solos.',
        o: ['Dato, etiqueta, modelo y pérdida', 'Mover una recta a mano y ver bajar el error', 'Por qué aprender es optimizar'],
        req: ['fn-lineales', 'pe-bidimensional', 'av-optimizacion']
      },
      {
        id: 'ia-buscar', t: 'Antes de aprender: buscar',
        r: 'Minimax con poda y A*: resolver un problema razonando, sin haber aprendido nada.',
        o: ['El árbol de un juego y el minimax', 'La poda alfa-beta: por qué se puede no mirar', 'A*: heurística admisible y camino óptimo'],
        req: ['av-juegos', 'av-grafos']
      },
      {
        id: 'ia-distancia', t: 'La primera IA es una distancia',
        r: 'Clasificar por el vecino más cercano y agrupar con k-medias. Sin derivadas y sin entrenamiento.',
        o: ['Vecinos más cercanos y la elección de k', 'La frontera de decisión es un diagrama de Voronoi', 'k-medias: asignar y recolocar hasta que deje de moverse'],
        req: ['ge-pitagoras', 'pe-descriptiva']
      },
      {
        id: 'ia-arboles', t: 'Preguntar lo que más informa',
        r: 'Árboles de decisión por ganancia de información, y el bosque que promedia muchos.',
        o: ['Entropía de un nodo y ganancia de información', 'Construir el árbol eligiendo cada vez la mejor pregunta', 'Por qué un bosque aleatorio reduce la varianza'],
        req: ['av-informacion', 'pe-inferencia']
      },
      {
        id: 'ia-bayes', t: 'Bayes ingenuo: el filtro de spam',
        r: 'Multiplicar probabilidades condicionadas suponiendo independencia, y sumar logaritmos para no perderse.',
        o: ['La suposición ingenua, y por qué funciona aunque sea falsa', 'Sumar logaritmos en vez de multiplicar probabilidades', 'Suavizado: qué hacer con una palabra nunca vista'],
        req: ['pe-condicionada', 'al-radicales-log']
      },
      {
        id: 'ia-margen', t: 'La frontera con más margen',
        r: 'Entre todas las rectas que separan, la que deja el pasillo más ancho.',
        o: ['El margen es una distancia punto-recta', 'Vectores soporte: solo unos pocos datos deciden', 'El truco del núcleo: cambiar un producto escalar por otro'],
        req: ['ge-rectas', 'al-inecuaciones', 'av-espacios']
      },
      {
        id: 'ia-sigmoide', t: 'De decidir a dudar',
        r: 'El escalón del perceptrón no se puede derivar. La sigmoide sí, y además devuelve una probabilidad.',
        o: ['Del umbral a la regresión logística', 'La sigmoide y su derivada', 'Interpretar la salida como probabilidad'],
        req: ['cib-neurona', 'fn-exp-log', 'fn-derivadas']
      },
      {
        id: 'ia-perdida', t: 'Medir el error y bajar la ladera',
        r: 'La entropía cruzada como pérdida, los minilotes como muestreo y Adam como dos medias móviles.',
        o: ['Por qué la entropía cruzada y no el error cuadrático', 'Minilotes: el gradiente como estimación por muestreo', 'Adam: media móvil del gradiente y de su cuadrado'],
        req: ['av-informacion', 'av-optimizacion', 'cib-filtrado']
      },
      {
        id: 'ia-red', t: 'Apilar neuronas',
        r: 'Capas lineales y no linealidad. Sin ella, mil capas colapsan en una sola matriz.',
        o: ['Una capa es una matriz por un vector más una no linealidad', 'Por qué sin activación todo colapsa', 'XOR resuelto, y la aproximación universal como suma de escalones'],
        req: ['al-matrices', 'av-espacios', 'fn-integral-def']
      },
      {
        id: 'ia-retropropagacion', t: 'La regla de la cadena, en cadena',
        r: 'El grafo de cómputo y el gradiente que vuelve hacia atrás, a mano en una red 2-2-1.',
        o: ['El grafo de cómputo y la pasada hacia delante', 'Retropropagar: la regla de la cadena capa a capa', 'Comprobar el gradiente con diferencias finitas'],
        req: ['fn-derivadas', 'av-numerico']
      },
      {
        id: 'ia-generalizar', t: 'Aprenderse los ejemplos no es aprender',
        r: 'Sobreajuste, validación y regularización: la diferencia entre memorizar y aprender.',
        o: ['Un polinomio de grado n pasa por n+1 puntos', 'Entrenamiento, validación y prueba', 'Regularizar, y normalizar, que es tipificar'],
        req: ['al-polinomios', 'pe-inferencia', 'pe-normal']
      },
      {
        id: 'ia-evaluar', t: '¿Funciona?',
        r: 'La exactitud engaña. Matriz de confusión, precisión, sensibilidad y el área bajo la ROC.',
        o: ['Matriz de confusión: los cuatro casos', 'Precisión y sensibilidad, y por qué compiten', 'La curva ROC, su área y los errores por subgrupos'],
        req: ['pe-condicionada', 'fn-integral-def']
      }
    ]
  },

  /* ================= 19. INTELIGENCIA ARTIFICIAL II =================
     Por que cada arquitectura tiene la forma que tiene. Cada tema entra
     por su idea matematica nueva, dicha en una frase que el alumno pueda
     repetir: una CNN comparte pesos porque la imagen no cambia de
     significado al desplazarla.

     Los temas marcados como rama -ia-hopfield- se pueden saltar: nada de
     lo que viene despues depende de ellos. */
  {
    id: 'ia2', n: 20, title: 'Inteligencia artificial II: las arquitecturas', piel: 'ia', curso: 'AMP',
    desc: 'Catorce arquitecturas y la idea matemática que aporta cada una, funcionando en pequeño dentro del navegador. De compartir pesos en una imagen a ponderar con un producto escalar, generar deshaciendo ruido y aprender de un premio que llega tarde.',
    temas: [
      {
        id: 'ia-cnn', t: 'Redes convolucionales',
        r: 'Compartir pesos porque una imagen no cambia de significado al desplazarla.',
        o: ['De la capa densa a la convolución: cuántos parámetros se ahorran', 'Núcleos que se aprenden, agrupación y campo receptivo', 'Dibujar un dígito y ver cómo lo clasifica'],
        req: ['av-convolucion', 'av-grupos']
      },
      {
        id: 'ia-hopfield', t: 'La memoria como un valle',
        r: 'Una función de energía que solo puede bajar, y sus mínimos son los recuerdos.',
        o: ['La regla de Hebb y la matriz de pesos', 'Por qué la energía nunca sube', 'Recuperar un patrón desde una versión con ruido'],
        req: ['av-sistemas-dinamicos', 'av-optimizacion']
      },
      {
        id: 'ia-recurrentes', t: 'Redes con memoria: RNN y LSTM',
        r: 'Un estado que se realimenta, y un gradiente que explota o se desvanece como una potencia.',
        o: ['La red recurrente como bucle realimentado', 'Potencias de una matriz: explotar o desvanecerse', 'Las puertas de la LSTM y por qué lo arreglan'],
        req: ['cib-realimentacion', 'cib-retardos', 'av-lineal']
      },
      {
        id: 'ia-autocodificador', t: 'Comprimir para generar: autocodificadores y VAE',
        r: 'Un cuello de botella obliga a quedarse con lo esencial, y del espacio latente se puede muestrear.',
        o: ['El cuello de botella; si es lineal, aprende el subespacio de PCA', 'El espacio latente y lo que hay entre dos datos', 'VAE: divergencia KL y reparametrizar, que es tipificar al revés'],
        req: ['av-pca', 'av-informacion', 'pe-normal']
      },
      {
        id: 'ia-gan', t: 'Dos redes jugando: GAN',
        r: 'Un juego de suma cero entre quien falsifica y quien detecta, y por qué es tan inestable.',
        o: ['Generador y discriminador; el discriminador óptimo', 'El generador transforma ruido en datos', 'Por qué oscila: el descenso-ascenso simultáneo gira en espiral'],
        req: ['av-juegos', 'pe-continuas', 'av-sistemas-dinamicos', 'al-complejos', 'av-informacion', 'ia-autocodificador']
      },
      {
        id: 'ia-difusion', t: 'Generar quitando ruido: difusión',
        r: 'Añadir ruido normal paso a paso hasta borrarlo todo, y aprender a deshacer el camino.',
        o: ['El paso hacia delante: las varianzas se suman', 'Aprender a quitar ruido: el gradiente del logaritmo de la densidad', 'Parentesco con la ecuación del calor'],
        req: ['pe-normal', 'av-edp', 'av-vectorial', 'av-markov']
      },
      {
        id: 'ia-tokens', t: 'Trocear el texto: tokens',
        r: 'BPE es un algoritmo de compresión: fusionar una y otra vez el par de símbolos más frecuente.',
        o: ['Por qué no se trabaja ni con letras ni con palabras', 'Una fusión de BPE, a mano', 'El tamaño del vocabulario como compromiso'],
        req: ['av-informacion']
      },
      {
        id: 'ia-secuencias', t: 'Predecir el siguiente token',
        r: 'Los n-gramas son una cadena de Markov. Perplejidad, temperatura y el experimento de Shannon.',
        o: ['n-gramas como cadena de Markov', 'Perplejidad: la entropía, exponenciada', 'La temperatura divide los logits antes del softmax'],
        req: ['av-markov', 'av-informacion', 'fn-exp-log']
      },
      {
        id: 'ia-vectores-palabras', t: 'Las palabras como vectores',
        r: 'Contar con quién aparece cada palabra, y descubrir que la dirección significa algo.',
        o: ['Coocurrencia, y el peso IDF de Spärck Jones', 'Similitud coseno', 'Analogías, y proyectar a dos dimensiones con PCA'],
        req: ['ge-vectores', 'av-pca']
      },
      {
        id: 'ia-atencion', t: 'Atención y el transformador',
        r: 'Una media ponderada cuyos pesos salen de un softmax de productos escalares.',
        o: ['Consultas, claves y valores', 'Por qué se divide por la raíz de d', 'Máscara causal, varias cabezas y codificación posicional con senos'],
        req: ['ge-vectores', 'al-matrices', 'tr-funciones', 'pe-normal']
      },
      {
        id: 'ia-llm', t: 'Un LLM, de principio a fin',
        r: 'Un transformador de juguete entrenado en el navegador, y qué cambia al multiplicarlo por mil millones.',
        o: ['Preentrenar: entropía cruzada del siguiente token', 'Ventana de contexto y leyes de escala en ejes log-log', 'Ajuste por preferencias, y por qué genera texto probable'],
        req: ['ia-atencion', 'ia-tokens', 'ia-sigmoide', 'al-radicales-log']
      },
      {
        id: 'ia-refuerzo', t: 'Aprender a base de premios: Bellman y Q-learning',
        r: 'Nadie dice cuál era la jugada buena: solo llega un premio, y a veces mucho después.',
        o: ['La ecuación de Bellman como iteración que converge', 'Q-learning y el factor de descuento', 'AlphaZero: la búsqueda guiada por una red'],
        req: ['av-markov', 'fn-sucesiones', 'ia-buscar', 'cib-refuerzo']
      },
      {
        id: 'ia-limites', t: 'Lo que el modelo no puede saber',
        r: 'Goodhart, el sesgo como variable de confusión y los ejemplos adversarios.',
        o: ['La ley de Goodhart: optimizar la medida estropea la medida', 'Sesgo: lo que había en los datos', 'Ejemplos adversarios: un paso en la dirección del gradiente'],
        req: ['cib-segundo-orden', 'pe-causal', 'av-computabilidad']
      },
      {
        id: 'ia-taller', t: 'El taller',
        r: 'Todos los mandos a la vez, una red entera escrita a la vista, y el mapa de qué idea aporta cada arquitectura.',
        o: ['Un banco de pruebas con datos, arquitectura y optimizador', 'Una red completa, línea a línea', 'El mapa: qué matemática hay debajo de cada arquitectura'],
        req: ['ia-llm', 'ia-cnn', 'ia-red']
      }
    ]
  }
];

/* ===================================================================
   LAS RUTAS DE LA AMPLIACION.
   Los bloques 0 a 7 se recorren en orden y tienen dos itinerarios de
   examen. Los 161 temas que vienen despues no: son optativos, no se
   presuponen entre si, y ahi el orden del temario deja de mandar. Sin
   una ruta, esa mitad del curso es un catalogo.

   Una ruta NO es una particion del temario: es un recorrido que puede
   empezar antes de la ampliacion, que se salta lo que no necesita y en
   el que un mismo tema puede aparecer dos veces. Muchos temas no estan
   en ninguna.

   COMO SE CONSTRUYE UNA. Se escribe a lo que se quiere llegar -el
   `nucleo`- y despues se cierra sobre los requisitos de ampliacion que
   hagan falta, porque mandar a alguien a un tema que da por sabido otro
   que no ha visto es justo lo que este curso no hace. El resultado se
   ordena como el temario, que ya respeta los requisitos, y eso da
   `temas`. `tests.html` comprueba las dos cosas.

   `MIN_POR_TEMA` son 50: lo que cuesta leer un tema y hacer sus
   ejercicios sin prisa. Se dice para que la estimacion de horas sea
   comprobable y no un numero caido del cielo.
   =================================================================== */
var RUTAS = [
  {
    id: 'comp', t: 'Cómo funciona un ordenador',
    r: 'Del bit y la puerta lógica a un lenguaje que compila, y de ahí a lo que ninguna máquina puede hacer.',
    para: 'Si programas y quieres entender lo que hay debajo, o si te interesa dónde están los límites de lo calculable.',
    /* `temas` es el recorrido entero y en orden: la lista de semillas cerrada
       sobre los requisitos de ampliación que hacían falta, y ordenada como el
       temario, que ya respeta los requisitos. `nucleo` es a lo que se venía;
       lo demás es camino. */
    temas: [
      'lg-algoritmos', 'fn-exp-log', 'fn-sucesiones', 'av-espacios', 'av-lineal',
      'av-infinito', 'av-computabilidad', 'av-grafos', 'av-recurrencias', 'av-complejidad',
      'av-numerico', 'av-informacion', 'cib-realimentacion', 'cib-bloques',
      'cib-caja-negra', 'cib-variedad', 'cib-control', 'cib-homeostasis', 'cib-retardos',
      'cib-viable', 'cib-segundo-orden', 'maq-bits', 'maq-puertas', 'maq-sumador',
      'maq-decidir', 'maq-memoria', 'maq-normal', 'maq-cpu', 'maq-ensamblador',
      'len-tokens', 'len-gramatica', 'len-arbol', 'len-pila', 'len-variables',
      'len-funciones', 'len-compilar', 'len-optimizar', 'len-autorreferencia', 'len-taller'
    ],
    nucleo: [
      'lg-algoritmos', 'av-infinito', 'av-computabilidad', 'av-grafos', 'av-recurrencias',
      'av-complejidad', 'av-numerico', 'av-informacion', 'maq-bits', 'maq-puertas',
      'maq-sumador', 'maq-decidir', 'maq-memoria', 'maq-normal', 'maq-cpu',
      'maq-ensamblador', 'len-tokens', 'len-gramatica', 'len-arbol', 'len-pila',
      'len-variables', 'len-funciones', 'len-compilar', 'len-optimizar',
      'len-autorreferencia', 'len-taller'
    ]
  },
  {
    id: 'datos', t: 'Datos y modelos',
    r: 'De ajustar una recta a mirar por dentro un modelo de lenguaje, pasando por todo lo que hay en medio.',
    para: 'Si te interesan los datos, el aprendizaje automático, o la estadística que se usa fuera del examen.',
    /* `temas` es el recorrido entero y en orden: la lista de semillas cerrada
       sobre los requisitos de ampliación que hacían falta, y ordenada como el
       temario, que ya respeta los requisitos. `nucleo` es a lo que se venía;
       lo demás es camino. */
    temas: [
      'fn-exp-log', 'fn-sucesiones', 'fn-series', 'pe-bidimensional', 'pe-condicionada',
      'pe-normal', 'pe-contraste', 'pe-causal', 'av-espacios', 'av-lineal', 'av-pca',
      'av-minimos-cuadrados', 'av-svd', 'av-markov', 'av-vectorial', 'av-optimizacion',
      'av-lagrange', 'av-fourier', 'av-convolucion', 'av-numeros', 'av-grupos',
      'av-infinito', 'av-computabilidad', 'av-numerico', 'av-informacion',
      'cib-realimentacion', 'cib-bloques', 'cib-caja-negra', 'cib-variedad', 'cib-control',
      'cib-homeostasis', 'cib-retardos', 'cib-filtrado', 'cib-kalman', 'cib-neurona',
      'cib-viable', 'cib-segundo-orden', 'ia-que-es', 'ia-distancia', 'ia-arboles',
      'ia-bayes', 'ia-margen', 'ia-sigmoide', 'ia-perdida', 'ia-red',
      'ia-retropropagacion', 'ia-generalizar', 'ia-evaluar', 'ia-cnn', 'ia-recurrentes',
      'ia-tokens', 'ia-atencion', 'ia-llm', 'ia-limites'
    ],
    nucleo: [
      'pe-bidimensional', 'pe-condicionada', 'pe-normal', 'pe-contraste', 'pe-causal',
      'av-espacios', 'av-lineal', 'av-pca', 'av-minimos-cuadrados', 'av-svd', 'av-markov',
      'av-optimizacion', 'av-lagrange', 'av-informacion', 'cib-filtrado', 'cib-kalman',
      'ia-que-es', 'ia-distancia', 'ia-arboles', 'ia-bayes', 'ia-margen', 'ia-sigmoide',
      'ia-perdida', 'ia-red', 'ia-retropropagacion', 'ia-generalizar', 'ia-evaluar',
      'ia-cnn', 'ia-recurrentes', 'ia-tokens', 'ia-atencion', 'ia-llm', 'ia-limites'
    ]
  },
  {
    id: 'pura', t: 'Matemática por dentro',
    r: 'Estructuras, curvatura, infinito y las ecuaciones que describen el mundo.',
    para: 'Si vas a estudiar matemáticas o física, o si quieres ver de qué está hecho lo que diste en Bachillerato.',
    /* `temas` es el recorrido entero y en orden: la lista de semillas cerrada
       sobre los requisitos de ampliación que hacían falta, y ordenada como el
       temario, que ya respeta los requisitos. `nucleo` es a lo que se venía;
       lo demás es camino. */
    temas: [
      'lg-demostracion', 'fn-exp-log', 'fn-sucesiones', 'fn-series', 'fn-taylor',
      'av-espacios', 'av-lineal', 'av-minimos-cuadrados', 'av-svd', 'av-vectorial',
      'av-optimizacion', 'av-lagrange', 'av-integrales-multiples', 'av-edo',
      'av-oscilador', 'av-sistemas-dinamicos', 'av-caos', 'av-edp', 'av-fourier',
      'av-noeuclidea', 'av-geodif', 'av-topologia', 'av-numeros', 'av-grupos',
      'av-cripto-curvas', 'av-reales', 'av-infinito', 'av-computabilidad'
    ],
    nucleo: [
      'lg-demostracion', 'fn-series', 'fn-taylor', 'av-espacios', 'av-lineal', 'av-svd',
      'av-vectorial', 'av-lagrange', 'av-integrales-multiples', 'av-edo', 'av-oscilador',
      'av-sistemas-dinamicos', 'av-caos', 'av-edp', 'av-fourier', 'av-noeuclidea',
      'av-geodif', 'av-topologia', 'av-numeros', 'av-grupos', 'av-cripto-curvas',
      'av-reales', 'av-infinito', 'av-computabilidad'
    ]
  },
  {
    id: 'son', t: 'Hacer sonar las matemáticas',
    r: 'Del seno que suena a un sintetizador que programas tú: la trigonometría, el logaritmo, Fourier y las sucesiones recurrentes, oídos.',
    para: 'Si te gusta la música, si quieres saber qué hay dentro de un sintetizador o si necesitas una razón para que las identidades trigonométricas y las series existan.',
    temas: [
      'fn-exp-log', 'fn-sucesiones', 'fn-series', 'tr-identidades', 'av-fourier',
      'son-onda', 'son-muestras', 'son-tono', 'son-envolvente', 'son-armonicos', 'son-cuerda',
      'son-espectro', 'son-batidos', 'son-modulacion', 'son-filtros', 'son-ruido', 'son-eco',
      'son-secuencia', 'son-taller'
    ],
    nucleo: [
      'son-onda', 'son-tono', 'son-envolvente', 'son-armonicos', 'son-espectro', 'son-batidos',
      'son-modulacion', 'son-filtros', 'son-ruido', 'son-eco', 'son-secuencia', 'son-taller'
    ]
  }
];
RUTAS.MIN_POR_TEMA = 50;
