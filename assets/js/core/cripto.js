/* ===================================================================
   Matebase · cripto.js
   LA CAJA DE HERRAMIENTAS DEL BLOQUE DE CRIPTOGRAFIA. Todo lo que los
   temas necesitan para cifrar, descifrar, romper y firmar con numeros
   pequenos, y lo que necesitan de verdad -SHA-256, HMAC, AES, GF(2^8),
   Enigma, curvas elipticas- implementado entero, sin dependencias, para
   que el alumno vea el resultado real y no una imitacion.

   Igual que shader.js sirve al bloque de programacion grafica, este
   modulo sirve al de criptografia. tests.html comprueba los vectores de
   prueba oficiales: SHA-256, HMAC, AES-128 (FIPS-197), GF(2^8) y Enigma.

   Todo cabe en numeros de coma flotante: las multiplicaciones modulares
   se hacen sumando y doblando cuando el producto no cabe en 2^53, asi que
   los modulos pueden llegar a 2^52 sin perder ni una cifra.
   =================================================================== */
(function (global) {
  'use strict';

  var CR = {};

  /* ================= alfabeto y texto ================= */

  CR.ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /** Deja solo letras A-Z en mayusculas: quita tildes, la enie pasa a N y
      lo que no sea letra desaparece (o queda como espacio, si se pide). */
  CR.limpia = function (texto, espacios) {
    var s = String(texto || '').toUpperCase();
    s = s.replace(/[ÁÀÂÄ]/g, 'A').replace(/[ÉÈÊË]/g, 'E').replace(/[ÍÌÎÏ]/g, 'I')
      .replace(/[ÓÒÔÖ]/g, 'O').replace(/[ÚÙÛÜ]/g, 'U').replace(/Ñ/g, 'N').replace(/Ç/g, 'C');
    if (espacios) return s.replace(/[^A-Z ]+/g, ' ').replace(/ +/g, ' ').replace(/^ | $/g, '');
    return s.replace(/[^A-Z]/g, '');
  };
  CR.num = function (c) { return CR.ABC.indexOf(String(c).toUpperCase()); };
  CR.letra = function (n) { return CR.ABC.charAt(CR.mod(n, 26)); };
  CR.mod = function (a, n) { return ((a % n) + n) % n; };

  /* Frecuencia de cada letra en castellano, en tanto por ciento. La enie va
     sumada a la N, porque el alfabeto de cifrado tiene 26 letras. */
  CR.FREC_ES = [12.53, 1.42, 4.68, 5.86, 13.68, 0.69, 1.01, 0.70, 6.25, 0.44, 0.02, 4.97, 3.15,
    7.02, 8.68, 2.51, 0.88, 6.87, 7.98, 4.63, 3.93, 0.90, 0.01, 0.22, 0.90, 0.52];

  /** Cuantas veces aparece cada letra: un array de 26 cuentas. */
  CR.frecuencias = function (texto) {
    var t = CR.limpia(texto), c = [], i;
    for (i = 0; i < 26; i++) c.push(0);
    for (i = 0; i < t.length; i++) c[CR.num(t.charAt(i))]++;
    return c;
  };

  /** Indice de coincidencia: probabilidad de que dos letras al azar del
      texto sean iguales. Castellano ~0,075; texto aleatorio 1/26 ~0,038. */
  CR.ic = function (texto) {
    var c = CR.frecuencias(texto), n = 0, s = 0, i;
    for (i = 0; i < 26; i++) { n += c[i]; s += c[i] * (c[i] - 1); }
    return n < 2 ? 0 : s / (n * (n - 1));
  };

  /** Chi cuadrado de unas cuentas frente a las frecuencias del castellano:
      cuanto mas bajo, mas se parece a castellano. */
  CR.chi2 = function (cuentas, n) {
    var s = 0, i;
    for (i = 0; i < 26; i++) {
      var esp = n * CR.FREC_ES[i] / 100;
      if (esp > 0) s += (cuentas[i] - esp) * (cuentas[i] - esp) / esp;
    }
    return s;
  };

  /* ---- cifrados clasicos: reciben texto ya limpio o lo limpian ---- */

  CR.cesar = function (texto, k) {
    var t = CR.limpia(texto), s = '';
    for (var i = 0; i < t.length; i++) s += CR.letra(CR.num(t.charAt(i)) + k);
    return s;
  };

  CR.afin = function (texto, a, b) {
    var t = CR.limpia(texto), s = '';
    for (var i = 0; i < t.length; i++) s += CR.letra(a * CR.num(t.charAt(i)) + b);
    return s;
  };

  /** Descifra un afin: x = a^-1 (y - b). Devuelve null si a no tiene inverso. */
  CR.afinInv = function (texto, a, b) {
    var ia = CR.inv(a, 26);
    if (ia === null) return null;
    var t = CR.limpia(texto), s = '';
    for (var i = 0; i < t.length; i++) s += CR.letra(ia * (CR.num(t.charAt(i)) - b));
    return s;
  };

  CR.vigenere = function (texto, clave, descifra) {
    var t = CR.limpia(texto), k = CR.limpia(clave), s = '';
    if (!k) return t;
    for (var i = 0; i < t.length; i++) {
      var d = CR.num(k.charAt(i % k.length));
      s += CR.letra(CR.num(t.charAt(i)) + (descifra ? -d : d));
    }
    return s;
  };

  /** Sustitucion con un alfabeto desordenado de 26 letras. */
  CR.sustituye = function (texto, mapa, descifra) {
    var t = CR.limpia(texto), m = CR.limpia(mapa), s = '';
    for (var i = 0; i < t.length; i++) {
      var c = t.charAt(i);
      s += descifra ? CR.letra(m.indexOf(c)) : m.charAt(CR.num(c));
    }
    return s;
  };

  /** El orden en que se leen las columnas segun una palabra clave: la
      columna de la letra mas pequena primero; a igual letra, la de la
      izquierda antes. Devuelve los indices de columna en orden de lectura. */
  CR.ordenClave = function (clave) {
    var k = CR.limpia(clave), idx = [];
    for (var i = 0; i < k.length; i++) idx.push(i);
    idx.sort(function (a, b) { return k.charAt(a) === k.charAt(b) ? a - b : (k.charAt(a) < k.charAt(b) ? -1 : 1); });
    return idx;
  };

  /** Transposicion por columnas con palabra clave. Se rellena con X. */
  CR.columnas = function (texto, clave, descifra) {
    var t = CR.limpia(texto), orden = CR.ordenClave(clave), c = orden.length, i, j;
    if (!c) return t;
    var filas = Math.ceil(t.length / c);
    while (t.length < filas * c) t += 'X';
    var s = '';
    if (!descifra) {
      for (i = 0; i < c; i++) for (j = 0; j < filas; j++) s += t.charAt(j * c + orden[i]);
      return s;
    }
    var rej = [];
    for (i = 0; i < c; i++) for (j = 0; j < filas; j++) rej[j * c + orden[i]] = t.charAt(i * filas + j);
    for (i = 0; i < rej.length; i++) s += rej[i];
    return s;
  };

  /** Cifrado de Hill con una matriz 2x2 modulo 26. */
  CR.hill = function (texto, M) {
    var t = CR.limpia(texto), s = '';
    if (t.length % 2) t += 'X';
    for (var i = 0; i < t.length; i += 2) {
      var x = CR.num(t.charAt(i)), y = CR.num(t.charAt(i + 1));
      s += CR.letra(M[0][0] * x + M[0][1] * y) + CR.letra(M[1][0] * x + M[1][1] * y);
    }
    return s;
  };
  /** La inversa de una matriz 2x2 modulo 26, o null si el determinante no es invertible. */
  CR.hillInv = function (M) {
    var det = CR.mod(M[0][0] * M[1][1] - M[0][1] * M[1][0], 26), id = CR.inv(det, 26);
    if (id === null) return null;
    return [[CR.mod(id * M[1][1], 26), CR.mod(-id * M[0][1], 26)], [CR.mod(-id * M[1][0], 26), CR.mod(id * M[0][0], 26)]];
  };

  /** Grupos de n letras que se repiten y a que distancia (metodo de Kasiski). */
  CR.kasiski = function (texto, n) {
    var t = CR.limpia(texto), vistos = {}, res = [], i;
    n = n || 3;
    for (i = 0; i + n <= t.length; i++) {
      var g = t.substr(i, n);
      if (vistos[g] === undefined) vistos[g] = [];
      vistos[g].push(i);
    }
    for (var g2 in vistos) {
      if (!Object.prototype.hasOwnProperty.call(vistos, g2) || vistos[g2].length < 2) continue;
      var d = [];
      for (i = 1; i < vistos[g2].length; i++) d.push(vistos[g2][i] - vistos[g2][0]);
      res.push({ grupo: g2, posiciones: vistos[g2], distancias: d });
    }
    res.sort(function (a, b) { return b.posiciones.length - a.posiciones.length; });
    return res;
  };

  /* Un texto de muestra, de dominio publico: el arranque del Quijote. */
  CR.QUIJOTE = 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un ' +
    'hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca ' +
    'que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de ' +
    'añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, ' +
    'calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su ' +
    'vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a ' +
    'los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de ' +
    'nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran ' +
    'madrugador y amigo de la caza.';

  /* ================= enteros ================= */

  /** Euclides extendido: g = mcd(a, b) = x a + y b, con la tabla de pasos. */
  CR.egcd = function (a, b) {
    var r0 = a, r1 = b, x0 = 1, x1 = 0, y0 = 0, y1 = 1, pasos = [];
    while (r1 !== 0) {
      var q = Math.floor(r0 / r1), r2 = r0 - q * r1;
      pasos.push({ a: r0, b: r1, q: q, r: r2, x: x0 - q * x1, y: y0 - q * y1 });
      r0 = r1; r1 = r2;
      var x2 = x0 - q * x1, y2 = y0 - q * y1;
      x0 = x1; x1 = x2; y0 = y1; y1 = y2;
    }
    return { g: r0, x: x0, y: y0, pasos: pasos };
  };

  /** Inverso de a modulo n, o null si no existe. */
  CR.inv = function (a, n) {
    var e = CR.egcd(CR.mod(a, n), n);
    return e.g === 1 ? CR.mod(e.x, n) : null;
  };

  /** a·b mod m sin perder cifras aunque a·b no quepa en 2^53 (m < 2^52). */
  CR.mulMod = function (a, b, m) {
    a = CR.mod(a, m); b = CR.mod(b, m);
    if (a * b <= 9007199254740991) return a * b % m;
    var r = 0;
    while (b > 0) {
      if (b % 2 === 1) r = (r + a) % m;
      a = (a * 2) % m;
      b = Math.floor(b / 2);
    }
    return r;
  };

  /** b^e mod m por cuadrados sucesivos. */
  CR.potMod = function (b, e, m) {
    var r = 1;
    b = CR.mod(b, m);
    while (e > 0) {
      if (e % 2 === 1) r = CR.mulMod(r, b, m);
      b = CR.mulMod(b, b, m);
      e = Math.floor(e / 2);
    }
    return r;
  };

  /** Lo mismo, con la tabla de cada paso: bit del exponente, cuadrado y producto. */
  CR.potModTraza = function (b, e, m) {
    var bits = e.toString(2), r = 1, pasos = [], i;
    b = CR.mod(b, m);
    for (i = 0; i < bits.length; i++) {
      var antes = r;
      r = CR.mulMod(r, r, m);
      var cuad = r;
      if (bits.charAt(i) === '1') r = CR.mulMod(r, b, m);
      pasos.push({ bit: bits.charAt(i), antes: antes, cuadrado: cuad, despues: r });
    }
    return { valor: r, bits: bits, pasos: pasos };
  };

  /** Primalidad por division: para numeros de tamano razonable. */
  CR.esPrimo = function (n) {
    if (n < 2 || n !== Math.floor(n)) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (var i = 5; i * i <= n; i += 6) if (n % i === 0 || n % (i + 2) === 0) return false;
    return true;
  };

  /** n - 1 = 2^s · d con d impar. */
  CR.descompone = function (n) {
    var d = n - 1, s = 0;
    while (d % 2 === 0) { d /= 2; s++; }
    return { s: s, d: d };
  };

  /** Miller-Rabin con una base: dice si la base delata a n como compuesto.
      Devuelve la sucesion a^d, a^2d, ... para poder ensenarla. */
  CR.millerRabin = function (n, a) {
    if (n < 2) return { compuesto: true, cadena: [] };
    if (n % 2 === 0) return { compuesto: n !== 2, cadena: [] };
    var sd = CR.descompone(n), x = CR.potMod(a, sd.d, n), cadena = [x];
    if (x === 1 || x === n - 1) return { compuesto: false, cadena: cadena, s: sd.s, d: sd.d };
    for (var i = 1; i < sd.s; i++) {
      x = CR.mulMod(x, x, n);
      cadena.push(x);
      if (x === n - 1) return { compuesto: false, cadena: cadena, s: sd.s, d: sd.d };
      if (x === 1) break;
    }
    return { compuesto: true, cadena: cadena, s: sd.s, d: sd.d };
  };

  /** Primo probable: Fermat con la base 2 y Miller-Rabin con varias bases. */
  CR.primoProbable = function (n) {
    if (n < 2) return false;
    var bases = [2, 3, 5, 7, 11, 13, 17];
    for (var i = 0; i < bases.length; i++) {
      if (n === bases[i]) return true;
      if (n % bases[i] === 0) return false;
      if (CR.millerRabin(n, bases[i]).compuesto) return false;
    }
    return true;
  };

  /** Un primo al azar entre min y max, con el generador reproducible del curso. */
  CR.primoAleatorio = function (r, min, max) {
    for (var k = 0; k < 5000; k++) {
      var n = r.int(min, max);
      if (n % 2 === 0) n++;
      if (n <= max && CR.primoProbable(n)) return n;
    }
    return null;
  };

  /** Teorema chino del resto para modulos primos entre si. */
  CR.crt = function (restos, modulos) {
    var M = 1, x = 0, i;
    for (i = 0; i < modulos.length; i++) M *= modulos[i];
    for (i = 0; i < modulos.length; i++) {
      var Mi = M / modulos[i], yi = CR.inv(Mi % modulos[i], modulos[i]);
      x = (x + CR.mulMod(CR.mulMod(restos[i], Mi, M), yi, M)) % M;
    }
    return x;
  };

  /** Orden multiplicativo de a modulo n (el menor k > 0 con a^k = 1), o 0. */
  CR.orden = function (a, n) {
    var x = CR.mod(a, n), k = 1, v = x;
    if (CR.egcd(x, n).g !== 1) return 0;
    while (v !== 1 && k <= n) { v = CR.mulMod(v, x, n); k++; }
    return v === 1 ? k : 0;
  };

  /* ================= bits y bytes ================= */

  CR.bits = function (n, len) {
    var s = (n >>> 0).toString(2);
    while (s.length < (len || 8)) s = '0' + s;
    return s;
  };
  CR.deBits = function (s) { return parseInt(String(s).replace(/[^01]/g, ''), 2) || 0; };
  CR.hex = function (bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
    return s;
  };
  CR.deHex = function (h) {
    var s = String(h).replace(/[^0-9a-fA-F]/g, ''), b = [];
    for (var i = 0; i + 1 < s.length; i += 2) b.push(parseInt(s.substr(i, 2), 16));
    return b;
  };
  /** Texto a bytes UTF-8. */
  CR.bytes = function (str) {
    var b = [], s = String(str);
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c >= 0xd800 && c < 0xdc00 && i + 1 < s.length) {
        c = 0x10000 + ((c - 0xd800) << 10) + (s.charCodeAt(i + 1) - 0xdc00); i++;
      }
      if (c < 0x80) b.push(c);
      else if (c < 0x800) b.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) b.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else b.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return b;
  };
  /** Bytes UTF-8 a texto; lo que no sea UTF-8 valido sale como un rombo. */
  CR.texto = function (bytes) {
    var s = '', i = 0;
    while (i < bytes.length) {
      var c = bytes[i++], n = 0, cp = c;
      if (c >= 0xf0) { n = 3; cp = c & 7; } else if (c >= 0xe0) { n = 2; cp = c & 15; } else if (c >= 0xc0) { n = 1; cp = c & 31; } else if (c >= 0x80) { s += '�'; continue; }
      var bien = true;
      for (var k = 0; k < n; k++) {
        var d = bytes[i++];
        if (d === undefined || (d & 0xc0) !== 0x80) { bien = false; break; }
        cp = (cp << 6) | (d & 63);
      }
      if (!bien) { s += '�'; continue; }
      if (cp >= 0x10000) { cp -= 0x10000; s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 1023)); }
      else s += String.fromCharCode(cp);
    }
    return s;
  };
  CR.xor = function (a, b) {
    var r = [];
    for (var i = 0; i < Math.max(a.length, b.length); i++) r.push((a[i] || 0) ^ (b[i % b.length] || 0));
    return r;
  };
  /** Cuantos bits distintos hay entre dos listas de bytes. */
  CR.hamming = function (a, b) {
    var n = 0;
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      var x = (a[i] || 0) ^ (b[i] || 0);
      while (x) { n += x & 1; x >>= 1; }
    }
    return n;
  };

  /* ================= SHA-256 y HMAC ================= */

  var K256 = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

  /** SHA-256 de un texto o de una lista de bytes: devuelve 32 bytes. */
  CR.sha256Bytes = function (msg) {
    var b = (typeof msg === 'string') ? CR.bytes(msg) : msg.slice(), l = b.length;
    b.push(0x80);
    while (b.length % 64 !== 56) b.push(0);
    var bitLen = l * 8, hi = Math.floor(bitLen / 4294967296), lo = bitLen >>> 0;
    b.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255,
      (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var w = new Array(64), i, t;
    for (i = 0; i < b.length; i += 64) {
      for (t = 0; t < 16; t++) w[t] = (b[i + 4 * t] << 24) | (b[i + 4 * t + 1] << 16) | (b[i + 4 * t + 2] << 8) | b[i + 4 * t + 3];
      for (t = 16; t < 64; t++) {
        var s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = H[0], bb = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K256[t] + w[t]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), maj = (a & bb) ^ (a & c) ^ (bb & c);
        var t2 = (S0 + maj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + bb) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    var out = [];
    for (i = 0; i < 8; i++) out.push((H[i] >>> 24) & 255, (H[i] >>> 16) & 255, (H[i] >>> 8) & 255, H[i] & 255);
    return out;
  };
  CR.sha256 = function (msg) { return CR.hex(CR.sha256Bytes(msg)); };

  /** HMAC-SHA256(clave, mensaje), en hexadecimal. */
  CR.hmacBytes = function (clave, msg) {
    var k = (typeof clave === 'string') ? CR.bytes(clave) : clave.slice();
    var m = (typeof msg === 'string') ? CR.bytes(msg) : msg.slice();
    if (k.length > 64) k = CR.sha256Bytes(k);
    while (k.length < 64) k.push(0);
    var ipad = [], opad = [], i;
    for (i = 0; i < 64; i++) { ipad.push(k[i] ^ 0x36); opad.push(k[i] ^ 0x5c); }
    return CR.sha256Bytes(opad.concat(CR.sha256Bytes(ipad.concat(m))));
  };
  CR.hmac = function (clave, msg) { return CR.hex(CR.hmacBytes(clave, msg)); };

  /** Un hash de juguete de n bits (los primeros bits de SHA-256), para
      ensenar colisiones y cumpleanos sin esperar. */
  CR.hashCorto = function (msg, bits) {
    var h = CR.sha256Bytes(msg), v = 0;
    bits = bits || 16;
    for (var i = 0; i < Math.ceil(bits / 8); i++) v = v * 256 + h[i];
    return Math.floor(v / Math.pow(2, Math.ceil(bits / 8) * 8 - bits));
  };

  /* ================= GF(2^8) y AES ================= */

  var gf = {};
  gf.suma = function (a, b) { return a ^ b; };
  gf.xtime = function (a) { a <<= 1; return (a & 0x100) ? (a ^ 0x11b) : a; };
  gf.mul = function (a, b) {
    var r = 0;
    while (b) { if (b & 1) r ^= a; a = gf.xtime(a); b >>= 1; }
    return r;
  };
  /** La multiplicacion paso a paso: que potencias de x suma, y cada xtime. */
  gf.mulTraza = function (a, b) {
    var r = 0, pasos = [], pot = a, k = 0;
    while (b) {
      pasos.push({ k: k, potencia: pot, usa: !!(b & 1) });
      if (b & 1) r ^= pot;
      pot = gf.xtime(pot); b >>= 1; k++;
    }
    return { valor: r, pasos: pasos };
  };
  gf.pot = function (a, e) { var r = 1; while (e > 0) { if (e & 1) r = gf.mul(r, a); a = gf.mul(a, a); e >>= 1; } return r; };
  gf.inv = function (a) { return a ? gf.pot(a, 254) : 0; };
  CR.gf = gf;

  /* La S-box se construye, no se copia: inverso en GF(2^8) seguido de la
     transformacion afin. tests.html la comprueba contra FIPS-197. */
  var SBOX = [], INV_SBOX = [];
  (function () {
    for (var x = 0; x < 256; x++) {
      var b = gf.inv(x), s = b;
      for (var k = 1; k <= 4; k++) s ^= ((b << k) | (b >>> (8 - k))) & 255;
      s ^= 0x63;
      SBOX[x] = s; INV_SBOX[s] = x;
    }
  })();

  var aes = { SBOX: SBOX, INV_SBOX: INV_SBOX };

  aes.expandeClave = function (clave) {
    var w = [], i, rcon = 1;
    for (i = 0; i < 4; i++) w.push([clave[4 * i], clave[4 * i + 1], clave[4 * i + 2], clave[4 * i + 3]]);
    for (i = 4; i < 44; i++) {
      var t = w[i - 1].slice();
      if (i % 4 === 0) {
        t = [SBOX[t[1]] ^ rcon, SBOX[t[2]], SBOX[t[3]], SBOX[t[0]]];
        rcon = gf.xtime(rcon);
      }
      w.push([w[i - 4][0] ^ t[0], w[i - 4][1] ^ t[1], w[i - 4][2] ^ t[2], w[i - 4][3] ^ t[3]]);
    }
    var claves = [];
    for (i = 0; i < 11; i++) claves.push(w[4 * i].concat(w[4 * i + 1], w[4 * i + 2], w[4 * i + 3]));
    return claves;
  };
  /* El estado es una lista de 16 bytes en el orden de entrada: el byte i
     ocupa la fila i mod 4 y la columna floor(i / 4). */
  function subBytes(s, caja) { return s.map(function (b) { return caja[b]; }); }
  function shiftRows(s, inv) {
    var r = s.slice();
    for (var fila = 1; fila < 4; fila++) for (var c = 0; c < 4; c++) {
      var desde = inv ? (c - fila + 4) % 4 : (c + fila) % 4;
      r[fila + 4 * c] = s[fila + 4 * desde];
    }
    return r;
  }
  function mixColumns(s, inv) {
    var r = s.slice(), M = inv ? [14, 11, 13, 9] : [2, 3, 1, 1];
    for (var c = 0; c < 4; c++) for (var fila = 0; fila < 4; fila++) {
      var v = 0;
      for (var k = 0; k < 4; k++) v ^= gf.mul(M[(k - fila + 4) % 4], s[k + 4 * c]);
      r[fila + 4 * c] = v;
    }
    return r;
  }
  function addKey(s, k) { return s.map(function (b, i) { return b ^ k[i]; }); }

  /** AES-128 de un bloque de 16 bytes, con la traza de cada paso. */
  aes.cifra = function (bloque, clave) {
    var ks = aes.expandeClave(clave), s = bloque.slice(), traza = [];
    traza.push({ ronda: 0, paso: 'entrada', estado: s.slice() });
    s = addKey(s, ks[0]); traza.push({ ronda: 0, paso: 'AddRoundKey', estado: s.slice() });
    for (var r = 1; r <= 10; r++) {
      s = subBytes(s, SBOX); traza.push({ ronda: r, paso: 'SubBytes', estado: s.slice() });
      s = shiftRows(s, false); traza.push({ ronda: r, paso: 'ShiftRows', estado: s.slice() });
      if (r < 10) { s = mixColumns(s, false); traza.push({ ronda: r, paso: 'MixColumns', estado: s.slice() }); }
      s = addKey(s, ks[r]); traza.push({ ronda: r, paso: 'AddRoundKey', estado: s.slice() });
    }
    return { salida: s, traza: traza, claves: ks };
  };
  aes.descifra = function (bloque, clave) {
    var ks = aes.expandeClave(clave), s = addKey(bloque.slice(), ks[10]);
    for (var r = 9; r >= 0; r--) {
      s = shiftRows(s, true);
      s = subBytes(s, INV_SBOX);
      s = addKey(s, ks[r]);
      if (r > 0) s = mixColumns(s, true);
    }
    return s;
  };
  aes.mixColumns = function (s, inv) { return mixColumns(s, inv); };
  aes.shiftRows = function (s, inv) { return shiftRows(s, inv); };
  CR.aes = aes;

  /* ---- modos de operacion sobre cualquier cifrador de bloque de 16 bytes ---- */
  CR.rellena = function (bytes, tam) {
    tam = tam || 16;
    var n = tam - (bytes.length % tam), r = bytes.slice();
    for (var i = 0; i < n; i++) r.push(n);
    return r;
  };
  CR.quitaRelleno = function (bytes, tam) {
    tam = tam || 16;
    if (!bytes.length || bytes.length % tam) return null;
    var n = bytes[bytes.length - 1];
    if (n < 1 || n > tam) return null;
    for (var i = bytes.length - n; i < bytes.length; i++) if (bytes[i] !== n) return null;
    return bytes.slice(0, bytes.length - n);
  };
  CR.ecb = function (bytes, clave) {
    var out = [];
    for (var i = 0; i < bytes.length; i += 16) out = out.concat(aes.cifra(bytes.slice(i, i + 16), clave).salida);
    return out;
  };
  CR.cbc = function (bytes, clave, iv) {
    var out = [], prev = iv.slice();
    for (var i = 0; i < bytes.length; i += 16) {
      prev = aes.cifra(CR.xor(bytes.slice(i, i + 16), prev), clave).salida;
      out = out.concat(prev);
    }
    return out;
  };
  CR.cbcDescifra = function (bytes, clave, iv) {
    var out = [], prev = iv.slice();
    for (var i = 0; i < bytes.length; i += 16) {
      var c = bytes.slice(i, i + 16);
      out = out.concat(CR.xor(aes.descifra(c, clave), prev));
      prev = c;
    }
    return out;
  };
  CR.ctr = function (bytes, clave, nonce) {
    var out = [];
    for (var i = 0; i < bytes.length; i += 16) {
      var bloque = nonce.slice(0, 12), n = i / 16;
      bloque.push((n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255);
      var flujo = aes.cifra(bloque, clave).salida, trozo = bytes.slice(i, i + 16);
      for (var k = 0; k < trozo.length; k++) out.push(trozo[k] ^ flujo[k]);
    }
    return out;
  };

  /* ================= cifradores de juguete ================= */

  /* Una red de sustitucion y permutacion de 16 bits: cuatro S-boxes de 4
     bits (la del tutorial de Heys) y una permutacion de bits. */
  var SPN_S = [0xE, 4, 0xD, 1, 2, 0xF, 0xB, 8, 3, 0xA, 6, 0xC, 5, 9, 0, 7];
  var SPN_SI = [];
  for (var si = 0; si < 16; si++) SPN_SI[SPN_S[si]] = si;
  function spnPerm(x) {
    var y = 0;
    for (var i = 0; i < 16; i++) if (x & (1 << i)) y |= 1 << ((i % 4) * 4 + Math.floor(i / 4));
    return y;
  }
  function spnSub(x, caja) {
    var y = 0;
    for (var i = 0; i < 4; i++) y |= caja[(x >> (4 * i)) & 15] << (4 * i);
    return y;
  }
  CR.spn = {
    S: SPN_S, SI: SPN_SI, permuta: spnPerm, sustituye: function (x) { return spnSub(x, SPN_S); },
    clavesDe: function (clave, rondas) {
      var ks = [];
      for (var i = 0; i <= rondas; i++) ks.push(((clave << (3 * i)) | (clave >>> (16 - 3 * i))) & 0xffff ^ (0x9e37 * i & 0xffff));
      return ks;
    },
    cifra: function (bloque, clave, rondas) {
      rondas = rondas || 4;
      var ks = CR.spn.clavesDe(clave, rondas), x = bloque & 0xffff, traza = [{ paso: 'entrada', valor: x }];
      for (var r = 0; r < rondas; r++) {
        x ^= ks[r]; traza.push({ ronda: r + 1, paso: 'clave', valor: x });
        x = spnSub(x, SPN_S); traza.push({ ronda: r + 1, paso: 'S-box', valor: x });
        if (r < rondas - 1) { x = spnPerm(x); traza.push({ ronda: r + 1, paso: 'permutacion', valor: x }); }
      }
      x ^= ks[rondas]; traza.push({ ronda: rondas, paso: 'clave final', valor: x });
      return { salida: x, traza: traza, claves: ks };
    }
  };

  /* Una red de Feistel de 16 bits: mitades de 8, y f(R, K) = S-box de AES
     sobre R xor K, girada tres bits. */
  function feistelF(r, k) { var s = SBOX[(r ^ k) & 255]; return ((s << 3) | (s >>> 5)) & 255; }
  CR.feistel = {
    f: feistelF,
    cifra: function (bloque, claves) {
      var L = (bloque >> 8) & 255, R = bloque & 255, traza = [{ L: L, R: R }];
      for (var i = 0; i < claves.length; i++) {
        var nL = R, nR = L ^ feistelF(R, claves[i]);
        L = nL; R = nR;
        traza.push({ L: L, R: R, f: feistelF(traza[i].R, claves[i]) });
      }
      return { salida: (R << 8) | L, L: L, R: R, traza: traza };   // sin cruzar la ultima
    },
    descifra: function (bloque, claves) {
      return CR.feistel.cifra(bloque, claves.slice().reverse());
    }
  };

  /** Un LFSR de n bits. El estado es una lista de bits: el de la izquierda
      es el mas nuevo y el de la derecha es el que sale. `taps` son los
      exponentes del polinomio de realimentacion sin el termino x^n: para
      x^4 + x^3 + 1 son [3, 0]. El bit nuevo es la suma (XOR) de los bits
      s[n - 1 - k] para cada tap k. Devuelve los bits de salida y los estados. */
  CR.lfsr = function (estado, taps, n) {
    var s = estado.slice(), salida = [], estados = [s.slice()];
    for (var i = 0; i < n; i++) {
      var nuevo = 0;
      for (var t = 0; t < taps.length; t++) nuevo ^= s[s.length - 1 - taps[t]];
      salida.push(s[s.length - 1]);
      s.pop(); s.unshift(nuevo);
      estados.push(s.slice());
    }
    return { bits: salida, estados: estados };
  };

  /** Generador congruencial lineal: x -> (a x + c) mod m. */
  CR.lcg = function (x, a, c, m, n) {
    var l = [];
    for (var i = 0; i < n; i++) { x = CR.mod(CR.mulMod(a, x, m) + c, m); l.push(x); }
    return l;
  };

  /* ================= Enigma ================= */

  var ROTORES = {
    I: { cable: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', muesca: 'Q' },
    II: { cable: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', muesca: 'E' },
    III: { cable: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', muesca: 'V' },
    IV: { cable: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', muesca: 'J' },
    V: { cable: 'VZBRGITYUPSDNHLXAWMJQOFECK', muesca: 'Z' }
  };
  var REFLECTORES = { B: 'YRUHQSLDPXNGOKMIEBFZCWVJAT', C: 'FVPJIAOYEDRZXWGCTKUQSBNMHL' };
  CR.ROTORES = ROTORES;
  CR.REFLECTORES = REFLECTORES;

  /** Una Enigma I de tres rotores. o = { rotores: ['I','II','III'],
      posiciones: 'AAA', anillos: 'AAA', reflector: 'B', clavijas: 'AB CD' } */
  CR.enigma = function (o) {
    o = o || {};
    var nombres = o.rotores || ['I', 'II', 'III'];
    var rot = nombres.map(function (n) {
      var r = ROTORES[n], inv = [];
      for (var i = 0; i < 26; i++) inv[CR.num(r.cable.charAt(i))] = i;
      return { nombre: n, cable: r.cable, inv: inv, muesca: CR.num(r.muesca) };
    });
    var pos = CR.limpia(o.posiciones || 'AAA').split('').map(CR.num);
    var ani = CR.limpia(o.anillos || 'AAA').split('').map(CR.num);
    var refl = REFLECTORES[o.reflector || 'B'];
    var clav = [];
    for (var i = 0; i < 26; i++) clav[i] = i;
    CR.limpia(o.clavijas || '', true).split(' ').forEach(function (par) {
      if (par.length === 2) { var a = CR.num(par.charAt(0)), b = CR.num(par.charAt(1)); clav[a] = b; clav[b] = a; }
    });
    function adelante(k, x) { var d = pos[k] - ani[k]; return CR.mod(CR.num(rot[k].cable.charAt(CR.mod(x + d, 26))) - d, 26); }
    function atras(k, x) { var d = pos[k] - ani[k]; return CR.mod(rot[k].inv[CR.mod(x + d, 26)] - d, 26); }
    function avanza() {
      var medio = (pos[2] === rot[2].muesca) || (pos[1] === rot[1].muesca);
      var izq = pos[1] === rot[1].muesca;
      pos[2] = (pos[2] + 1) % 26;
      if (medio) pos[1] = (pos[1] + 1) % 26;
      if (izq) pos[0] = (pos[0] + 1) % 26;
    }
    var api = {
      posiciones: function () { return pos.map(CR.letra).join(''); },
      letra: function (c) {
        var x = CR.num(c);
        if (x < 0) return null;
        avanza();
        var t = { entrada: c, posiciones: api.posiciones() };
        x = clav[x]; t.clavija1 = CR.letra(x);
        x = adelante(2, x); t.r3 = CR.letra(x);
        x = adelante(1, x); t.r2 = CR.letra(x);
        x = adelante(0, x); t.r1 = CR.letra(x);
        x = CR.num(refl.charAt(x)); t.reflector = CR.letra(x);
        x = atras(0, x); t.r1b = CR.letra(x);
        x = atras(1, x); t.r2b = CR.letra(x);
        x = atras(2, x); t.r3b = CR.letra(x);
        x = clav[x]; t.salida = CR.letra(x);
        return t;
      },
      cifra: function (texto) {
        var t = CR.limpia(texto), s = '', traza = [];
        for (var i = 0; i < t.length; i++) { var r = api.letra(t.charAt(i)); s += r.salida; traza.push(r); }
        return { salida: s, traza: traza };
      }
    };
    return api;
  };

  /* ================= curvas elipticas modulo p ================= */

  /** y^2 = x^3 + a x + b sobre Z_p. Los puntos son [x, y]; null es el infinito. */
  CR.curva = function (a, b, p) {
    function m(v) { return CR.mod(v, p); }
    var C = { a: a, b: b, p: p };
    C.enCurva = function (P) { return P === null || m(P[1] * P[1]) === m(P[0] * P[0] * P[0] + a * P[0] + b); };
    C.puntos = function () {
      var raices = {}, y, x, lista = [];
      for (y = 0; y < p; y++) { var q = m(y * y); if (!raices[q]) raices[q] = []; raices[q].push(y); }
      for (x = 0; x < p; x++) {
        var v = m(x * x * x + a * x + b);
        (raices[v] || []).forEach(function (yy) { lista.push([x, yy]); });
      }
      return lista;
    };
    C.suma = function (P, Q) {
      if (P === null) return Q; if (Q === null) return P;
      if (P[0] === Q[0] && m(P[1] + Q[1]) === 0) return null;
      var l;
      if (P[0] === Q[0] && P[1] === Q[1]) {
        if (P[1] === 0) return null;
        l = m(CR.mulMod(m(3 * P[0] * P[0] + a), CR.inv(2 * P[1], p), p));
      } else l = m(CR.mulMod(m(Q[1] - P[1]), CR.inv(m(Q[0] - P[0]), p), p));
      var x3 = m(l * l - P[0] - Q[0]);
      return [x3, m(l * (P[0] - x3) - P[1])];
    };
    C.mult = function (k, P) {
      var R = null, Q = P, traza = [], bits = k.toString(2);
      for (var i = bits.length - 1; i >= 0; i--) {
        if (bits.charAt(i) === '1') { R = C.suma(R, Q); traza.push({ bit: i, suma: R }); }
        Q = C.suma(Q, Q);
      }
      return R;
    };
    /** Doblar y sumar de izquierda a derecha, con cada paso. */
    C.multTraza = function (k, P) {
      var R = null, bits = k.toString(2), pasos = [];
      for (var i = 0; i < bits.length; i++) {
        var antes = R;
        R = C.suma(R, R);
        var dob = R;
        if (bits.charAt(i) === '1') R = C.suma(R, P);
        pasos.push({ bit: bits.charAt(i), antes: antes, doble: dob, despues: R });
      }
      return { valor: R, bits: bits, pasos: pasos };
    };
    C.orden = function (P) {
      var Q = P, k = 1;
      while (Q !== null && k < 4 * p + 10) { Q = C.suma(Q, P); k++; }
      return Q === null ? k : 0;
    };
    C.txt = function (P) { return P === null ? '∞' : '(' + P[0] + ', ' + P[1] + ')'; };
    return C;
  };

  /* ================= compartir secretos ================= */

  /** Valor en x del polinomio que pasa por los puntos, modulo p (Lagrange). */
  CR.lagrange = function (puntos, x, p) {
    var s = 0;
    for (var i = 0; i < puntos.length; i++) {
      var num = 1, den = 1;
      for (var j = 0; j < puntos.length; j++) {
        if (i === j) continue;
        num = CR.mulMod(num, CR.mod(x - puntos[j][0], p), p);
        den = CR.mulMod(den, CR.mod(puntos[i][0] - puntos[j][0], p), p);
      }
      s = CR.mod(s + CR.mulMod(CR.mulMod(puntos[i][1], num, p), CR.inv(den, p), p), p);
    }
    return s;
  };
  /** Los coeficientes de Lagrange en x = 0: el secreto es la suma de y_i · l_i. */
  CR.coefLagrange = function (xs, p) {
    return xs.map(function (xi, i) {
      var num = 1, den = 1;
      for (var j = 0; j < xs.length; j++) {
        if (i === j) continue;
        num = CR.mulMod(num, CR.mod(-xs[j], p), p);
        den = CR.mulMod(den, CR.mod(xi - xs[j], p), p);
      }
      return CR.mulMod(num, CR.inv(den, p), p);
    });
  };
  CR.polinomioMod = function (coefs, x, p) {
    var v = 0;
    for (var i = coefs.length - 1; i >= 0; i--) v = CR.mod(CR.mulMod(v, x, p) + coefs[i], p);
    return v;
  };

  /* ================= Paillier (aditivo) ================= */

  CR.paillier = function (p, q) {
    var n = p * q, n2 = n * n, lam = (p - 1) * (q - 1) / CR.egcd(p - 1, q - 1).g;
    var mu = CR.inv(lam % n, n);   // con g = n + 1, L(g^lam) = lam mod n
    return {
      n: n, n2: n2, lambda: lam, mu: mu,
      cifra: function (m, r) { return CR.mulMod(CR.mod(1 + m * n, n2), CR.potMod(r, n, n2), n2); },
      descifra: function (c) { var u = CR.potMod(c, lam, n2); return CR.mulMod((u - 1) / n, mu, n); },
      suma: function (c1, c2) { return CR.mulMod(c1, c2, n2); }
    };
  };

  /* ================= controles para los temas ================= */

  var W = global.W;

  /** Un campo de texto con etiqueta, para escribir mensajes y claves. */
  W.texto = function (host, o) {
    o = o || {};
    var box = U.el('div.fld.cr-fld' + (o.corto ? '.cr-fld--corto' : ''));
    var lab = U.el('label', { html: MathX.inline(o.label || '') });
    var inp = U.el(o.multilinea ? 'textarea' : 'input', {
      type: o.multilinea ? null : 'text', spellcheck: 'false', autocomplete: 'off',
      'aria-label': (o.label || '').replace(/<[^>]*>/g, ''), maxlength: o.max || null
    });
    inp.value = o.value === undefined ? '' : o.value;
    lab.appendChild(inp);
    box.appendChild(lab);
    host.appendChild(box);
    var api = { el: box, input: inp };
    api.get = function () { return inp.value; };
    api.set = function (v, fire) { inp.value = v; if (fire && o.on) o.on(v); };
    inp.addEventListener('input', function () { if (o.on) o.on(inp.value); });
    return api;
  };

  /** Un panel monoespaciado que respeta los saltos de linea. .set(html)
      pinta HTML tal cual; .texto(str) escapa. */
  W.mono = function (host, html) {
    var d = U.el('div.readout.cr-mono', { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
    d.innerHTML = html || '';
    host.appendChild(d);
    d.set = function (h) { d.innerHTML = h; };
    d.texto = function (s) { d.textContent = s; };
    return d;
  };

  /** Bits como HTML coloreado: los unos resaltados. */
  CR.bitsHtml = function (s, marca) {
    var h = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i), dif = marca && marca.charAt(i) !== c;
      h += '<span class="' + (c === '1' ? 'b1' : 'b0') + (dif ? ' cr-dif' : '') + '">' + c + '</span>';
    }
    return '<span class="cr-bits">' + h + '</span>';
  };

  /** Hex como HTML, marcando los bytes distintos de otro. */
  CR.hexHtml = function (bytes, otros) {
    var h = '';
    for (var i = 0; i < bytes.length; i++) {
      var s = (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16);
      var dif = otros && otros[i] !== bytes[i];
      h += (dif ? '<span class="cr-dif">' + s + '</span>' : s) + (i % 4 === 3 ? ' ' : '');
    }
    return h;
  };

  global.CR = CR;
})(window);
