/* Tema: Examen del bloque: criptografía */
Course.topic('cr-examen', function (p) {

  p.puente('Treinta y seis temas, del [[cr-cesar|cifrado de César]] a la [[cr-bolsillo|criptografía que llevas en el bolsillo]]. Este tema no enseña nada nuevo: pregunta. Un examen procedimental con ejercicios de todo el bloque —aritmética modular, frecuencias, matrices, potencias, curvas— con reloj y sin pistas, para saber si la matemática de los secretos se ha interiorizado.');

  p.text('Un examen de bloque es un simulacro hecho en casa: con reloj, sin apuntes y sin pistas. Las preguntas salen de los ejercicios de los 36 temas del bloque, repartidas por tramos, y cada vez que empiezas uno los números son distintos y los temas también: haciéndolo varias veces se recorre el bloque entero. Al entregar se corrige todo, se abre la solución paso a paso de cada pregunta y sale la nota por tramos, con enlaces a lo que conviene repasar. La opción «ajustado a lo que llevas hecho» pone delante lo que aún no has resuelto: es la manera de comprobar que no queda ningún tema sin tocar.');

  /* ---------------------------------------------------------------- */
  p.section('Qué entra');

  p.table(['Tramo', 'Lo más habitual', 'Temas'], [
    ['Cifrados clásicos', 'Cifrar y descifrar con César y con el afín (inverso modular incluido); leer una tabla de frecuencias; la longitud de clave de un Vigenère por Kasiski; una transposición; Hill con una matriz módulo 26; por qué la libreta de un solo uso es perfecta; las permutaciones de Enigma.',
      '[[cr-secretos]] · [[cr-cesar]] · [[cr-frecuencias]] · [[cr-afin]] · [[cr-vigenere]] · [[cr-transposicion]] · [[cr-hill]] · [[cr-vernam]] · [[cr-enigma]]'],
    ['Entropía, flujo y bloque', 'Bits de entropía de una contraseña; el periodo de un registro; confusión y difusión; una ronda de Feistel; sumar y multiplicar bytes como polinomios; una operación de AES; qué modo de operación deja ver el pingüino.',
      '[[cr-entropia]] · [[cr-flujo]] · [[cr-bloque]] · [[cr-feistel]] · [[cr-galois]] · [[cr-aes]] · [[cr-modos]]'],
    ['Hash, autenticación y contraseñas', 'Cuántos intentos cuesta una colisión; qué garantiza un MAC y qué no; sal, lentitud y el coste de un ataque por diccionario.',
      '[[cr-hash]] · [[cr-mac]] · [[cr-contrasenas]]'],
    ['Clave pública', 'Euclides extendido y potencias modulares; generar un primo; RSA con números pequeños, de la clave a la firma; factorizar; el logaritmo discreto y ElGamal; sumar puntos de una curva elíptica; qué firma un certificado.',
      '[[cr-modular]] · [[cr-primos]] · [[cr-rsa]] · [[cr-factorizar]] · [[cr-logdiscreto]] · [[cr-firmas]] · [[cr-curvas]] · [[cr-certificados]]'],
    ['Protocolos y lo que viene', 'Reconstruir un secreto de Shamir; un compromiso; un árbol de Merkle; qué filtra un canal lateral; sumar sobre datos cifrados; qué rompe Shor y qué no; retículos; los fotones de BB84; lo que hace tu móvil.',
      '[[cr-compartir]] · [[cr-conocimiento-cero]] · [[cr-cadena]] · [[cr-canales]] · [[cr-homomorfico]] · [[cr-cuantico]] · [[cr-poscuantico]] · [[cr-bb84]] · [[cr-bolsillo]]']
  ]);

  p.note('Cada tramo aporta un número fijo de preguntas, elegidas al azar entre sus temas sin repetir tema mientras se pueda, y evitando los ejercicios más básicos. Con 36 temas y 14 preguntas, un solo examen no los toca todos: por eso el enlace del final reproduce el mismo examen, y «otro examen» saca uno distinto.', 'warn', 'Cómo se reparte');

  /* ---------------------------------------------------------------- */
  p.section('Cómo sacarle partido');

  p.list([
    '<strong>Reduce módulo $n$ en cada paso</strong>, no al final. Es lo que hace que $7^{103} \\bmod 11$ quepa en una hoja, y lo que evita que un número se salga de la calculadora a la tercera multiplicación.',
    '<strong>Comprueba los inversos multiplicando.</strong> Si $a \\cdot a^{-1}$ no da 1 módulo $m$, el afín, Hill o RSA fallarán aguas abajo aunque todo lo demás esté bien.',
    '<strong>Ten el alfabeto numerado a mano</strong>: A = 0 … Z = 25. La mitad de los errores de los cifrados clásicos son un desplazamiento de uno.',
    '<strong>Lo que falles, cífralo.</strong> Cada pregunta enlaza con su tema, y allí la caja de herramientas ejecuta el algoritmo de verdad: comparar tu cuenta con la de la máquina paso a paso localiza el fallo.'
  ], true);

  p.comprueba('Una pregunta pide el inverso de 7 módulo 26 y te sale 4. ¿Cómo lo compruebas en cinco segundos?', [
    { t: 'Multiplicando: $7 \\cdot 4 = 28 = 26 + 2$, así que no es 1: el inverso es otro (15, porque $7\\cdot 15 = 105 = 4\\cdot 26 + 1$)', ok: true, por: 'El inverso se comprueba multiplicando y reduciendo. Cinco segundos que salvan un ejercicio entero de afín o de RSA.' },
    { t: 'Mirando si 4 es primo con 26', ok: false, por: 'Ser primo con el módulo es necesario para tener inverso, pero no dice cuál es. 4 ni siquiera es primo con 26.' },
    { t: 'Dando por bueno el resultado de Euclides', ok: false, por: 'Euclides extendido se equivoca de signo con facilidad: a menudo sale −11 y hay que sumar 26. Sin comprobar, se entrega el error.' }
  ]);

  p.note('El enlace de un examen corregido reproduce las mismas preguntas con los mismos números. Un profesor puede hacer uno, copiar el enlace y pasárselo a la clase: todos harán el mismo examen y podrán comparar resultados y procedimientos.', 'ok', 'Para hacerlo en clase');

  /* ---------------------------------------------------------------- */
  p.section('El examen');

  p.simulacro({
    titulo: 'Examen de criptografía',
    kind: 'Examen del bloque',
    intro: 'Elige los tramos que entran. Las preguntas se sacan al azar de los ejercicios de cada tema del bloque, evitando las más básicas y sin repetir tema mientras se pueda. No hay pistas: la corrección y la solución paso a paso llegan al entregar.',
    partes: [
      { titulo: 'Cifrados clásicos', temas: ['cr-secretos', 'cr-cesar', 'cr-frecuencias', 'cr-afin', 'cr-vigenere', 'cr-transposicion', 'cr-hill', 'cr-vernam', 'cr-enigma'], n: 3, min: 15 },
      { titulo: 'Entropía, flujo y bloque', temas: ['cr-entropia', 'cr-flujo', 'cr-bloque', 'cr-feistel', 'cr-galois', 'cr-aes', 'cr-modos'], n: 3, min: 15 },
      { titulo: 'Hash, autenticación y contraseñas', temas: ['cr-hash', 'cr-mac', 'cr-contrasenas'], n: 2, min: 10 },
      { titulo: 'Clave pública', temas: ['cr-modular', 'cr-primos', 'cr-rsa', 'cr-factorizar', 'cr-logdiscreto', 'cr-firmas', 'cr-curvas', 'cr-certificados'], n: 3, min: 15 },
      { titulo: 'Protocolos y lo que viene', temas: ['cr-compartir', 'cr-conocimiento-cero', 'cr-cadena', 'cr-canales', 'cr-homomorfico', 'cr-cuantico', 'cr-poscuantico', 'cr-bb84', 'cr-bolsillo'], n: 3, min: 15 }
    ]
  });

  p.hist('Los exámenes de criptografía más famosos de la historia fueron los de Bletchley Park en 1941: un crucigrama del <em>Daily Telegraph</em> que había que resolver en doce minutos, y a quien lo conseguía se le invitaba a una entrevista. Buscaban lo mismo que mide este examen: cabeza para el método, cuidado con los detalles y paciencia con la aritmética.');
});
