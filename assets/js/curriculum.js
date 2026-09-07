/* ===================================================================
   Matebase · curriculum.js
   EL TEMARIO. Este es el unico sitio donde se decide que hay y en que
   orden. Para intercalar un tema nuevo basta con insertar un objeto
   en el array del bloque correspondiente.

   Campos de un tema:
     id : identificador y nombre del archivo -> topics/<id>.js
     t  : titulo
     r  : resumen de una linea (subtitulo de la pagina)
     o  : objetivos (se muestran si el tema aun no esta escrito)
   =================================================================== */
window.CURRICULUM = [

  /* ================= 0. LOGICA Y DEMOSTRACION ================= */
  {
    id: 'lg', n: 0, title: 'Lógica, conjuntos y demostración',
    desc: 'La base de verdad no son los números: es qué significa que algo sea cierto y cómo se comprueba.',
    temas: [
      {
        id: 'lg-proposiciones', t: 'Proposiciones y cuantificadores',
        r: 'El lenguaje con el que se escriben las matemáticas.',
        o: ['Conectivas y tablas de verdad', 'Implicación, recíproco y contrarrecíproco', 'Cuantificadores y su negación']
      },
      {
        id: 'lg-conjuntos', t: 'Conjuntos y aplicaciones',
        r: 'Agrupar objetos y relacionar unos conjuntos con otros.',
        o: ['Operaciones y diagramas de Venn', 'Producto cartesiano', 'Aplicaciones inyectivas, sobreyectivas y biyectivas']
      },
      {
        id: 'lg-demostracion', t: 'Métodos de demostración e inducción',
        r: 'Por qué una comprobación no es una demostración.',
        o: ['Demostración directa, por contrarrecíproco y por reducción al absurdo', 'Contraejemplos', 'El principio de inducción']
      }
    ]
  },

  /* ================= 1. ARITMETICA ================= */
  {
    id: 'ar', n: 1, title: 'Aritmética y fundamentos',
    desc: 'El suelo sobre el que se apoya todo lo demás: contar, operar y entender qué es un número.',
    temas: [
      {
        id: 'ar-naturales', t: 'Números naturales y sistema decimal',
        r: 'Contar, ordenar y escribir cantidades con diez símbolos.',
        o: ['Entender el valor posicional', 'Comparar y ordenar naturales', 'Leer y escribir números grandes']
      },
      {
        id: 'ar-operaciones', t: 'Operaciones y jerarquía',
        r: 'Sumar, restar, multiplicar, dividir y saber en qué orden.',
        o: ['Propiedades de las operaciones', 'Jerarquía y paréntesis', 'Cálculo mental razonado']
      },
      {
        id: 'ar-divisibilidad', t: 'Divisibilidad, primos, m.c.d. y m.c.m.',
        r: 'La estructura oculta de los números enteros.',
        o: ['Criterios de divisibilidad', 'Factorización en primos', 'Calcular m.c.d. y m.c.m. y usarlos']
      },
      {
        id: 'ar-fracciones', t: 'Fracciones',
        r: 'Partir la unidad: la primera ampliación seria del número.',
        o: ['Fracciones equivalentes', 'Suma, resta, producto y cociente', 'Comparar fracciones']
      },
      {
        id: 'ar-decimales', t: 'Números decimales y aproximación',
        r: 'Decimales exactos, periódicos y el arte de redondear.',
        o: ['Pasar de fracción a decimal y al revés', 'Redondeo y truncamiento', 'Error absoluto y relativo']
      },
      {
        id: 'ar-enteros', t: 'Números enteros',
        r: 'El cero y los negativos: la recta se extiende a la izquierda.',
        o: ['Valor absoluto y orden', 'Regla de los signos', 'Operar con paréntesis y signos']
      },
      {
        id: 'ar-potencias', t: 'Potencias, raíces y notación científica',
        r: 'Multiplicar muchas veces, y deshacerlo.',
        o: ['Propiedades de las potencias', 'Exponente negativo y fraccionario', 'Notación científica']
      },
      {
        id: 'ar-proporcionalidad', t: 'Proporcionalidad y porcentajes',
        r: 'Razones, reglas de tres, aumentos y descuentos.',
        o: ['Magnitudes directa e inversamente proporcionales', 'Porcentajes encadenados', 'Interés simple y compuesto']
      },
      {
        id: 'ar-magnitudes', t: 'Magnitudes, unidades y análisis dimensional',
        r: 'Medir el mundo y comprobar que una fórmula puede ser cierta.',
        o: ['Sistema Internacional y cambios de unidad', 'Cifras significativas', 'Análisis dimensional como red de seguridad']
      },
      {
        id: 'ar-conjuntos', t: 'Conjuntos numéricos y la recta real',
        r: 'De ℕ a ℝ: por qué hizo falta inventar cada tipo de número.',
        o: ['Jerarquía ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ', 'Irracionales', 'Intervalos y valor absoluto']
      }
    ]
  },

  /* ================= 2. ALGEBRA ================= */
  {
    id: 'al', n: 2, title: 'Álgebra',
    desc: 'Cuando la letra sustituye al número, se puede razonar sobre todos los casos a la vez.',
    temas: [
      {
        id: 'al-lenguaje', t: 'Lenguaje algebraico y monomios',
        r: 'Traducir enunciados a símbolos.',
        o: ['Expresiones algebraicas', 'Valor numérico', 'Monomios semejantes']
      },
      {
        id: 'al-polinomios', t: 'Polinomios: operaciones y Ruffini',
        r: 'Sumar, multiplicar y dividir polinomios.',
        o: ['División de polinomios', 'Regla de Ruffini', 'Teorema del resto']
      },
      {
        id: 'al-identidades', t: 'Identidades notables y factorización',
        r: 'Los tres productos que hay que reconocer de un vistazo.',
        o: ['Cuadrado de una suma y de una diferencia', 'Suma por diferencia', 'Sacar factor común y factorizar']
      },
      {
        id: 'al-fracciones-alg', t: 'Fracciones algebraicas',
        r: 'Fracciones cuyo numerador y denominador son polinomios.',
        o: ['Simplificar', 'Operar', 'Detectar valores prohibidos']
      },
      {
        id: 'al-ec1', t: 'Ecuaciones de primer grado',
        r: 'La balanza: lo que hagas a un lado, hazlo al otro.',
        o: ['Transposición de términos', 'Ecuaciones con denominadores', 'Problemas con enunciado']
      },
      {
        id: 'al-ec2', t: 'Ecuaciones de segundo grado',
        r: 'La fórmula general y lo que significa el discriminante.',
        o: ['Resolver completas e incompletas', 'Interpretar el discriminante', 'Suma y producto de raíces']
      },
      {
        id: 'al-sistemas', t: 'Sistemas de ecuaciones lineales',
        r: 'Dos condiciones a la vez: dos rectas que se cortan.',
        o: ['Sustitución, igualación y reducción', 'Interpretación gráfica', 'Compatibles e incompatibles']
      },
      {
        id: 'al-inecuaciones', t: 'Inecuaciones',
        r: 'Cuando la respuesta no es un número sino un tramo.',
        o: ['Inecuaciones de primer y segundo grado', 'Sistemas de inecuaciones', 'Expresar la solución con intervalos']
      },
      {
        id: 'al-radicales-log', t: 'Ecuaciones exponenciales y logarítmicas',
        r: 'La incógnita en el exponente.',
        o: ['Definición y propiedades del logaritmo', 'Cambio de base', 'Resolver ecuaciones']
      },
      {
        id: 'al-matrices', t: 'Matrices y determinantes',
        r: 'Tablas de números que se multiplican entre sí.',
        o: ['Operaciones con matrices', 'Determinante y rango', 'Matriz inversa']
      },
      {
        id: 'al-gauss', t: 'Sistemas por el método de Gauss',
        r: 'Escalonar para resolver sistemas de cualquier tamaño.',
        o: ['Matriz ampliada', 'Discusión de sistemas', 'Teorema de Rouché-Frobenius']
      },
      {
        id: 'al-complejos', t: 'Números complejos',
        r: 'Inventar √−1 y descubrir que el plano entero es un número.',
        o: ['Forma binómica, polar y trigonométrica', 'Operaciones y fórmula de De Moivre', 'Raíces n-ésimas']
      }
    ]
  },

  /* ================= 3. GEOMETRIA ================= */
  {
    id: 'ge', n: 3, title: 'Geometría',
    desc: 'Medir la tierra: figuras, distancias y la traducción entre dibujo y ecuación.',
    temas: [
      {
        id: 'ge-angulos', t: 'Ángulos, rectas y triángulos',
        r: 'Los elementos primitivos y sus relaciones.',
        o: ['Tipos de ángulos', 'Rectas paralelas cortadas por una secante', 'Suma de ángulos de un polígono']
      },
      {
        id: 'ge-pitagoras', t: 'El teorema de Pitágoras',
        r: 'La relación más famosa de las matemáticas.',
        o: ['Enunciado y demostración visual', 'Calcular lados', 'Aplicaciones y ternas pitagóricas']
      },
      {
        id: 'ge-semejanza', t: 'Semejanza y teorema de Tales',
        r: 'Misma forma, distinto tamaño.',
        o: ['Razón de semejanza', 'Teorema de Tales', 'Escalas, áreas y volúmenes']
      },
      {
        id: 'ge-areas', t: 'Perímetros, áreas y el número π',
        r: 'Medir el contorno y la superficie.',
        o: ['Áreas de polígonos', 'Longitud de la circunferencia y área del círculo', 'Figuras compuestas']
      },
      {
        id: 'ge-cuerpos', t: 'Cuerpos geométricos y volúmenes',
        r: 'Prismas, pirámides, cilindros, conos y esferas.',
        o: ['Poliedros regulares', 'Áreas y volúmenes', 'Principio de Cavalieri']
      },
      {
        id: 'ge-vectores', t: 'Vectores en el plano',
        r: 'Flechas que se suman: la herramienta que une álgebra y geometría.',
        o: ['Componentes, módulo y argumento', 'Suma y producto por un escalar', 'Producto escalar y ángulos']
      },
      {
        id: 'ge-rectas', t: 'La recta en el plano',
        r: 'Todas las formas de escribir una recta.',
        o: ['Ecuación vectorial, paramétrica, continua y general', 'Posiciones relativas', 'Distancias']
      },
      {
        id: 'ge-conicas', t: 'Cónicas',
        r: 'Cortar un cono y obtener elipse, parábola e hipérbola.',
        o: ['Definiciones como lugar geométrico', 'Ecuaciones reducidas', 'Excentricidad']
      },
      {
        id: 'ge-espacio', t: 'Geometría en el espacio',
        r: 'Rectas y planos en tres dimensiones.',
        o: ['Producto vectorial y mixto', 'Ecuaciones del plano', 'Distancias y ángulos en el espacio']
      },
      {
        id: 'ge-transformaciones', t: 'Movimientos y transformaciones',
        r: 'Trasladar, girar, reflejar y escalar.',
        o: ['Isometrías del plano', 'Simetrías y grupos', 'Homotecias']
      }
    ]
  },

  /* ================= 4. TRIGONOMETRIA ================= */
  {
    id: 'tr', n: 4, title: 'Trigonometría',
    desc: 'La máquina que convierte ángulos en longitudes. Nació midiendo estrellas.',
    temas: [
      {
        id: 'tr-razones', t: 'Razones trigonométricas',
        r: 'Seno, coseno y tangente en el triángulo rectángulo.',
        o: ['Definición de las razones', 'Relación fundamental', 'Resolver triángulos rectángulos']
      },
      {
        id: 'tr-circunferencia', t: 'Circunferencia goniométrica',
        r: 'Extender el ángulo más allá de 90°: radianes y signos.',
        o: ['Radianes', 'Signo por cuadrantes', 'Ángulos relacionados']
      },
      {
        id: 'tr-identidades', t: 'Identidades y ecuaciones trigonométricas',
        r: 'Sumas de ángulos, ángulo doble y cómo despejar.',
        o: ['Fórmulas de adición', 'Ángulo doble y mitad', 'Resolver ecuaciones trigonométricas']
      },
      {
        id: 'tr-teoremas', t: 'Teoremas del seno y del coseno',
        r: 'Resolver triángulos cualesquiera.',
        o: ['Teorema del seno', 'Teorema del coseno', 'Área de un triángulo']
      },
      {
        id: 'tr-funciones', t: 'Funciones trigonométricas y ondas',
        r: 'Amplitud, periodo y fase: la forma de casi todo lo que oscila.',
        o: ['Gráficas de seno, coseno y tangente', 'Transformaciones', 'Suma de ondas']
      }
    ]
  },

  /* ================= 5. ANALISIS ================= */
  {
    id: 'fn', n: 5, title: 'Funciones y análisis',
    desc: 'El estudio del cambio. De la gráfica al límite, del límite a la derivada y a la integral.',
    temas: [
      {
        id: 'fn-concepto', t: 'Concepto de función',
        r: 'Una máquina que transforma números en números.',
        o: ['Dominio y recorrido', 'Lectura de gráficas', 'Crecimiento, extremos y simetrías']
      },
      {
        id: 'fn-lineales', t: 'Funciones lineales y afines',
        r: 'La recta: pendiente y ordenada en el origen.',
        o: ['Interpretar la pendiente', 'Recta que pasa por dos puntos', 'Modelos lineales']
      },
      {
        id: 'fn-prog-lineal', t: 'Programación lineal',
        r: 'Optimizar cuando hay restricciones: el problema de todas las empresas.',
        o: ['Región factible a partir de inecuaciones', 'Función objetivo y rectas de nivel', 'El óptimo está siempre en un vértice']
      },
      {
        id: 'fn-cuadraticas', t: 'Funciones cuadráticas',
        r: 'La parábola y sus elementos.',
        o: ['Vértice y eje de simetría', 'Cortes con los ejes', 'Problemas de máximos y mínimos']
      },
      {
        id: 'fn-racionales', t: 'Racionales, radicales y a trozos',
        r: 'Funciones con agujeros, asíntotas y saltos.',
        o: ['Asíntotas', 'Dominio de radicales', 'Funciones definidas a trozos']
      },
      {
        id: 'fn-exp-log', t: 'Funciones exponenciales y logarítmicas',
        r: 'Crecimiento explosivo y su inverso.',
        o: ['Propiedades de la exponencial', 'El número e', 'Modelos de crecimiento y decaimiento']
      },
      {
        id: 'fn-sucesiones', t: 'Sucesiones y series',
        r: 'Listas infinitas de números y sus sumas.',
        o: ['Progresiones aritmética y geométrica', 'Límite de una sucesión', 'Suma de series geométricas']
      },
      {
        id: 'fn-limites', t: 'Límites y continuidad',
        r: 'Acercarse infinitamente sin llegar.',
        o: ['Idea intuitiva y definición', 'Indeterminaciones', 'Continuidad y tipos de discontinuidad']
      },
      {
        id: 'fn-derivadas', t: 'Derivadas',
        r: 'La pendiente instantánea: el ritmo de cambio.',
        o: ['Definición por el límite del cociente incremental', 'Reglas de derivación', 'Recta tangente']
      },
      {
        id: 'fn-aplicaciones', t: 'Estudio de funciones y optimización',
        r: 'Usar la derivada para dibujar y para decidir.',
        o: ['Monotonía y extremos', 'Curvatura y puntos de inflexión', 'Problemas de optimización']
      },
      {
        id: 'fn-integral-indef', t: 'Integral indefinida',
        r: 'Deshacer la derivada.',
        o: ['Primitivas inmediatas', 'Cambio de variable', 'Integración por partes']
      },
      {
        id: 'fn-integral-def', t: 'Integral definida y áreas',
        r: 'Sumar infinitos rectángulos infinitamente finos.',
        o: ['Sumas de Riemann', 'Regla de Barrow', 'Área entre curvas']
      }
    ]
  },

  /* ================= 6. PROBABILIDAD Y ESTADISTICA ================= */
  {
    id: 'pe', n: 6, title: 'Probabilidad y estadística',
    desc: 'Matemáticas para lo que no se sabe con certeza: describir datos y medir el azar.',
    temas: [
      {
        id: 'pe-descriptiva', t: 'Estadística descriptiva',
        r: 'Resumir un montón de datos en unos pocos números.',
        o: ['Tablas de frecuencias', 'Media, mediana y moda', 'Desviación típica y dispersión']
      },
      {
        id: 'pe-bidimensional', t: 'Regresión y correlación',
        r: 'Dos variables a la vez: ¿van juntas?',
        o: ['Nube de puntos y covarianza', 'Coeficiente de correlación', 'Recta de regresión y predicción']
      },
      {
        id: 'pe-combinatoria', t: 'Combinatoria',
        r: 'Contar sin enumerar.',
        o: ['Variaciones, permutaciones y combinaciones', 'Con y sin repetición', 'Números combinatorios']
      },
      {
        id: 'pe-probabilidad', t: 'Probabilidad',
        r: 'Regla de Laplace y álgebra de sucesos.',
        o: ['Espacio muestral y sucesos', 'Regla de Laplace', 'Unión, intersección y complementario']
      },
      {
        id: 'pe-condicionada', t: 'Probabilidad condicionada y Bayes',
        r: 'Cómo cambia una probabilidad cuando te dan información.',
        o: ['Probabilidad condicionada e independencia', 'Teorema de la probabilidad total', 'Teorema de Bayes']
      },
      {
        id: 'pe-binomial', t: 'Distribución binomial',
        r: 'Repetir un experimento con dos resultados.',
        o: ['Variable aleatoria discreta', 'Función de probabilidad binomial', 'Media y desviación típica']
      },
      {
        id: 'pe-normal', t: 'Distribución normal',
        r: 'La campana que aparece por todas partes.',
        o: ['Densidad y tipificación', 'Uso de la tabla N(0,1)', 'Aproximación de la binomial']
      },
      {
        id: 'pe-inferencia', t: 'Muestreo e inferencia',
        r: 'Deducir cómo es el todo mirando una parte.',
        o: ['Distribución de la media muestral', 'Intervalos de confianza', 'Contraste de hipótesis']
      }
    ]
  },

  /* ================= 7. ESCALADA AVANZADA ================= */
  /* ================= 7. ÁLGEBRA LINEAL ================= */
  {
    id: 'lin', n: 7, title: 'Álgebra lineal',
    desc: 'La continuación natural de las matrices: qué son de verdad, qué hacen y cómo se comportan a largo plazo.',
    temas: [
      {
        id: 'av-espacios', t: 'Espacios vectoriales y aplicaciones lineales',
        r: 'Qué es de verdad una matriz: una transformación, no una tabla.',
        o: ['Espacio vectorial, base y dimensión', 'Aplicaciones lineales y su matriz', 'Núcleo, imagen y el teorema del rango']
      },
      {
        id: 'av-lineal', t: 'Álgebra lineal: autovalores',
        r: 'Las direcciones que una transformación no tuerce.',
        o: ['Autovalores y autovectores', 'Ecuación característica', 'Diagonalización y potencias']
      },
      {
        id: 'av-markov', t: 'Cadenas de Markov y procesos estocásticos',
        r: 'Azar con memoria de un solo paso: del tiempo al PageRank.',
        o: ['Matriz de transición', 'Evolución del estado y distribución estacionaria', 'Estados absorbentes']
      }
    ]
  },

  /* ================= 8. ECUACIONES DIFERENCIALES Y ONDAS ================= */
  {
    id: 'dif', n: 8, title: 'Ecuaciones diferenciales y ondas',
    desc: 'Las matemáticas del cambio: ecuaciones cuya incógnita es una función. Con ellas está escrita casi toda la física.',
    temas: [
      {
        id: 'av-edo', t: 'Ecuaciones diferenciales ordinarias',
        r: 'Ecuaciones cuya incógnita es una función entera.',
        o: ['Campo de pendientes', 'Variables separables y lineales de primer orden', 'Modelos: enfriamiento, población']
      },
      {
        id: 'av-sistemas-dinamicos', t: 'Sistemas dinámicos y espacio de fases',
        r: 'Ver la evolución de un sistema como una trayectoria.',
        o: ['Puntos de equilibrio y estabilidad', 'Retrato de fases', 'Sistemas depredador-presa']
      },
      {
        id: 'av-caos', t: 'Teoría del caos y fractales',
        r: 'Reglas simples, comportamiento impredecible.',
        o: ['Mapa logístico y duplicación de periodo', 'Dependencia sensible', 'Dimensión fractal']
      },
      {
        id: 'av-edp', t: 'Ecuaciones en derivadas parciales',
        r: 'Las ecuaciones del calor, la onda y el potencial.',
        o: ['De la EDO a la EDP', 'Separación de variables', 'Ecuación del calor y de ondas']
      },
      {
        id: 'av-fourier', t: 'Series y transformada de Fourier',
        r: 'Toda señal es una suma de ondas puras.',
        o: ['Serie de Fourier', 'Espectro', 'Idea de la transformada']
      }
    ]
  },

  /* ================= 9. VARIAS VARIABLES Y GEOMETRÍA ================= */
  {
    id: 'var', n: 9, title: 'Varias variables y geometría',
    desc: 'Cuando el escenario deja de ser una recta: campos, superficies curvas y formas que se estudian sin medirlas.',
    temas: [
      {
        id: 'av-vectorial', t: 'Cálculo vectorial',
        r: 'Derivar e integrar campos en varias dimensiones.',
        o: ['Derivadas parciales y gradiente', 'Divergencia y rotacional', 'Integrales de línea y teoremas integrales']
      },
      {
        id: 'av-optimizacion', t: 'Optimización y descenso de gradiente',
        r: 'Cómo aprende una máquina: bajando la ladera a pasitos.',
        o: ['Extremos con varias variables', 'El algoritmo del descenso de gradiente', 'Tasa de aprendizaje y mínimos locales']
      },
      {
        id: 'av-geodif', t: 'Geometría diferencial: curvatura',
        r: 'Medir cuánto se dobla una curva o una superficie.',
        o: ['Curvatura de una curva plana', 'Curvatura de Gauss', 'Geodésicas y el teorema egregio']
      },
      {
        id: 'av-topologia', t: 'Topología',
        r: 'Geometría sin distancias: lo que sobrevive al estirar.',
        o: ['Espacios topológicos y continuidad', 'Homeomorfismo y género', 'Característica de Euler']
      }
    ]
  },

  /* ================= 10. ESTRUCTURAS, NÚMEROS E INFINITO ================= */
  {
    id: 'est', n: 10, title: 'Estructuras, números e infinito',
    desc: 'La cara más abstracta, y la que sostiene la criptografía: qué tienen en común los objetos matemáticos y qué significa contar lo incontable.',
    temas: [
      {
        id: 'av-numeros', t: 'Teoría de números',
        r: 'La reina de las matemáticas: los enteros y sus misterios.',
        o: ['Aritmética modular', 'Teorema fundamental de la aritmética', 'Criptografía RSA']
      },
      {
        id: 'av-grupos', t: 'Teoría de grupos y simetría',
        r: 'La estructura matemática de la simetría.',
        o: ['Definición de grupo y ejemplos', 'Grupos de simetría y teselados', 'Por qué no hay fórmula para el grado 5']
      },
      {
        id: 'av-infinito', t: 'El infinito: cardinalidad y Cantor',
        r: 'Hay infinitos más grandes que otros, y se puede demostrar.',
        o: ['Biyecciones y conjuntos numerables', 'La diagonal de Cantor', 'Hipótesis del continuo']
      }
    ]
  },

  /* ================= 11. DISCRETA Y COMPUTACIONAL ================= */
  {
    id: 'dis', n: 11, title: 'Discreta y computacional',
    desc: 'Las matemáticas de lo que se cuenta y de lo que calcula un ordenador: redes, algoritmos, información y decisiones.',
    temas: [
      {
        id: 'av-grafos', t: 'Teoría de grafos',
        r: 'Puntos y conexiones: redes, mapas y rutas.',
        o: ['Grafos, caminos y ciclos', 'Puentes de Königsberg', 'Árboles y algoritmos de camino mínimo']
      },
      {
        id: 'av-numerico', t: 'Análisis numérico',
        r: 'Cuando no hay fórmula exacta, se calcula aproximando.',
        o: ['Bisección y Newton-Raphson', 'Integración numérica', 'Errores y estabilidad']
      },
      {
        id: 'av-informacion', t: 'Teoría de la información y entropía',
        r: 'Cuánta información cabe en un mensaje, medida en bits.',
        o: ['Cantidad de información y entropía de Shannon', 'Codificación óptima', 'Redundancia y compresión']
      },
      {
        id: 'av-juegos', t: 'Teoría de juegos',
        r: 'Matemáticas para decidir cuando el otro también decide.',
        o: ['Matriz de pagos y estrategias dominantes', 'Equilibrio de Nash', 'El dilema del prisionero']
      }
    ]
  }
];
