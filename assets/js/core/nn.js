/* ===================================================================
   Matebase · nn.js
   EL MOTOR DE REDES NEURONALES. Lo que shader.js es al bloque grafico y
   cripto.js al de criptografia, esto es a los dos bloques de inteligencia
   artificial: la maquinaria de verdad, para que las demos ejecuten lo que
   el texto explica y no una imitacion.

   Tiene que ser LEGIBLE, porque el ultimo tema del bloque (ia-taller)
   enseña una red entera escrita con esto, a la vista del alumno.

   Tres piezas:

     1. TENSORES Y CINTA. Un tensor es una forma y dos Float32Array: los
        valores y el gradiente. Cada operacion apunta en una cinta quien
        la produjo y como se deshace. Recorrer la cinta al reves es la
        retropropagacion, que es la regla de la cadena y nada mas.

     2. OPERACIONES. Las minimas con vuelta atras escrita a mano (producto
        de matrices, activaciones, softmax, convolucion, embedding...) y
        el resto COMPUESTAS a partir de ellas: la atencion y la celda LSTM
        se escriben aqui igual que se escribirian en la pizarra, y asi no
        hay una segunda derivada que pueda estar mal.

     3. OPTIMIZADORES Y BUCLE. SGD, momento y Adam. Y un bucle de
        entrenamiento con requestAnimationFrame que se para solo al salir
        de pantalla, porque el nucleo no traia ninguno: hasta ahora el
        unico animado era el visor de shaders.

   IMPORTANTE: el bucle NO arranca al construirse. tests.html monta todos
   los temas del curso en un contenedor oculto; si cada demo empezara a
   entrenar al nacer, la auditoria lanzaria decenas de bucles a la vez.
   Se arranca con un boton o al hacerse visible.

   Depende de util.js (U.rng). Nada mas.
   =================================================================== */
(function (global) {
  'use strict';

  var U = global.U;
  var NN = {};

  /* ================================================================
     1. TENSORES Y CINTA
     ================================================================ */

  /* Un tensor: la forma (p.ej. [3, 4] o [8, 8, 3]), los valores y el
     gradiente. Los dos arrays van planos, en orden de fila. */
  function Tensor(forma, valores) {
    this.forma = forma;
    this.n = NN.tam(forma);
    this.v = valores || new Float32Array(this.n);
    this.g = new Float32Array(this.n);
    this.padres = [];
    this.atras = null;      // como repartir mi gradiente entre mis padres
    this.entrena = false;   // ¿es un parametro que el optimizador mueve?
  }

  NN.tam = function (forma) {
    var n = 1;
    for (var i = 0; i < forma.length; i++) n *= forma[i];
    return n;
  };

  /* La cinta: las operaciones en el orden en que ocurrieron. */
  var cinta = [];

  NN.limpia = function () { cinta = []; };
  NN.largoCinta = function () { return cinta.length; };

  /* Crear un nodo de la cinta. Si no tiene padres es una hoja (un dato o
     un parametro) y no se graba: no hay nada que deshacer en ella. */
  function nodo(forma, valores, padres, atras) {
    var t = new Tensor(forma, valores);
    if (padres && padres.length) {
      t.padres = padres;
      t.atras = atras;
      cinta.push(t);
    }
    return t;
  }

  /* Un tensor de datos: entra en la red y no se entrena. */
  NN.t = function (forma, valores) {
    var t = new Tensor(forma);
    if (valores) for (var i = 0; i < t.n && i < valores.length; i++) t.v[i] = valores[i];
    return t;
  };

  /* Un parametro: se inicializa al azar y el optimizador lo mueve.
     La escala por defecto es la de He: raiz de 2 partido por las
     entradas, que es la que evita que la señal se apague o se dispare
     al atravesar muchas capas. */
  NN.param = function (forma, r, escala) {
    var t = new Tensor(forma);
    var entradas = forma.length > 1 ? forma[0] : 1;
    var s = escala === undefined ? Math.sqrt(2 / entradas) : escala;
    if (r) for (var i = 0; i < t.n; i++) t.v[i] = r.real(-1, 1, 6) * s;
    t.entrena = true;
    return t;
  };

  /* Un parametro con un valor de partida fijo (sesgos a cero, la escala
     de una normalizacion a uno). */
  NN.constante = function (forma, valor) {
    var t = new Tensor(forma);
    if (valor) for (var i = 0; i < t.n; i++) t.v[i] = valor;
    t.entrena = true;
    return t;
  };

  /* LA RETROPROPAGACION, entera. Se pone a 1 la derivada de la perdida
     respecto de si misma y se recorre la cinta hacia atras: cada
     operacion reparte lo que le ha llegado entre sus padres. */
  NN.atras = function (perdida, params) {
    var i;
    for (i = 0; i < cinta.length; i++) cinta[i].g.fill(0);
    if (params) for (i = 0; i < params.length; i++) params[i].g.fill(0);
    perdida.g[0] = 1;
    for (i = cinta.length - 1; i >= 0; i--) cinta[i].atras();
  };

  /* ================================================================
     2. OPERACIONES
     ================================================================ */

  /* --- producto de matrices: [f, k] · [k, c] = [f, c] ---
     La operacion central. Una capa de una red es esto mas un sesgo. */
  NN.mm = function (a, b) {
    var f = a.forma[0], k = a.forma[1], c = b.forma[1];
    var out = new Float32Array(f * c);
    var i, j, t, s;
    for (i = 0; i < f; i++) {
      for (j = 0; j < c; j++) {
        s = 0;
        for (t = 0; t < k; t++) s += a.v[i * k + t] * b.v[t * c + j];
        out[i * c + j] = s;
      }
    }
    return nodo([f, c], out, [a, b], function () {
      var g = this.g, ii, jj, tt;
      for (ii = 0; ii < f; ii++) {
        for (tt = 0; tt < k; tt++) {
          var sa = 0;
          for (jj = 0; jj < c; jj++) sa += g[ii * c + jj] * b.v[tt * c + jj];
          a.g[ii * k + tt] += sa;
        }
      }
      for (tt = 0; tt < k; tt++) {
        for (jj = 0; jj < c; jj++) {
          var sb = 0;
          for (ii = 0; ii < f; ii++) sb += a.v[ii * k + tt] * g[ii * c + jj];
          b.g[tt * c + jj] += sb;
        }
      }
    });
  };

  /* --- suma, con el sesgo repartido por filas ---
     Si b tiene una sola fila se suma a todas las de a: es el sesgo de
     una capa, que es el mismo para todos los datos del lote. */
  NN.suma = function (a, b) {
    var n = a.n, ancho = a.forma[a.forma.length - 1];
    var difunde = b.n === ancho && b.n !== n;
    var out = new Float32Array(n);
    for (var i = 0; i < n; i++) out[i] = a.v[i] + b.v[difunde ? i % ancho : i];
    return nodo(a.forma.slice(), out, [a, b], function () {
      for (var i = 0; i < n; i++) {
        a.g[i] += this.g[i];
        b.g[difunde ? i % ancho : i] += this.g[i];
      }
    });
  };

  /* --- producto elemento a elemento (las puertas de una LSTM) --- */
  NN.prod = function (a, b) {
    var n = a.n, out = new Float32Array(n);
    for (var i = 0; i < n; i++) out[i] = a.v[i] * b.v[i];
    return nodo(a.forma.slice(), out, [a, b], function () {
      for (var i = 0; i < n; i++) {
        a.g[i] += this.g[i] * b.v[i];
        b.g[i] += this.g[i] * a.v[i];
      }
    });
  };

  /* --- multiplicar por un numero --- */
  NN.escala = function (a, k) {
    var n = a.n, out = new Float32Array(n);
    for (var i = 0; i < n; i++) out[i] = a.v[i] * k;
    return nodo(a.forma.slice(), out, [a], function () {
      for (var i = 0; i < n; i++) a.g[i] += this.g[i] * k;
    });
  };

  /* --- trasponer una matriz --- */
  NN.trans = function (a) {
    var f = a.forma[0], c = a.forma[1], out = new Float32Array(f * c);
    for (var i = 0; i < f; i++) for (var j = 0; j < c; j++) out[j * f + i] = a.v[i * c + j];
    return nodo([c, f], out, [a], function () {
      for (var i = 0; i < f; i++) for (var j = 0; j < c; j++) a.g[i * c + j] += this.g[j * f + i];
    });
  };

  /* --- activaciones ---
     Todas elemento a elemento, asi que la vuelta atras es multiplicar
     por la derivada en ese punto. */
  function elemento(nombre, f, df) {
    NN[nombre] = function (a) {
      var n = a.n, out = new Float32Array(n);
      for (var i = 0; i < n; i++) out[i] = f(a.v[i]);
      return nodo(a.forma.slice(), out, [a], function () {
        for (var i = 0; i < n; i++) a.g[i] += this.g[i] * df(a.v[i], out[i]);
      });
    };
  }

  elemento('relu', function (x) { return x > 0 ? x : 0; },
                   function (x) { return x > 0 ? 1 : 0; });
  elemento('sigmoide', function (x) { return 1 / (1 + Math.exp(-x)); },
                       function (x, y) { return y * (1 - y); });
  elemento('tanh', function (x) { var e = Math.exp(2 * x); return (e - 1) / (e + 1); },
                   function (x, y) { return 1 - y * y; });
  /* El escalon del perceptron: su derivada es cero en todas partes, y
     por eso NO se puede entrenar con gradiente. Esta aqui justamente
     para que el alumno lo vea fallar en ia-sigmoide. */
  elemento('escalon', function (x) { return x > 0 ? 1 : 0; },
                      function () { return 0; });

  /* --- softmax por filas ---
     Convierte cada fila en una distribucion de probabilidad. Se resta el
     maximo antes de exponenciar: la respuesta es la misma y no se
     desborda. */
  NN.softmax = function (a) {
    var f = a.forma[0], c = a.forma[1], out = new Float32Array(f * c);
    for (var i = 0; i < f; i++) {
      var max = -Infinity, j, s = 0;
      for (j = 0; j < c; j++) if (a.v[i * c + j] > max) max = a.v[i * c + j];
      for (j = 0; j < c; j++) { out[i * c + j] = Math.exp(a.v[i * c + j] - max); s += out[i * c + j]; }
      for (j = 0; j < c; j++) out[i * c + j] /= s;
    }
    return nodo([f, c], out, [a], function () {
      for (var i = 0; i < f; i++) {
        var punto = 0, j;
        for (j = 0; j < c; j++) punto += this.g[i * c + j] * out[i * c + j];
        for (j = 0; j < c; j++) a.g[i * c + j] += out[i * c + j] * (this.g[i * c + j] - punto);
      }
    });
  };

  /* --- entropia cruzada, con el softmax dentro ---
     Se juntan a proposito: el gradiente de las dos cosas encadenadas es
     simplemente «probabilidad menos lo que deberia», que es la formula
     mas limpia de todo el bloque y la que se deduce a mano en ia-perdida.
     `objetivo` es un array con el indice de la clase correcta de cada fila. */
  NN.entropiaCruzada = function (logits, objetivo) {
    var f = logits.forma[0], c = logits.forma[1];
    var p = new Float32Array(f * c), perdida = 0;
    for (var i = 0; i < f; i++) {
      var max = -Infinity, j, s = 0;
      for (j = 0; j < c; j++) if (logits.v[i * c + j] > max) max = logits.v[i * c + j];
      for (j = 0; j < c; j++) { p[i * c + j] = Math.exp(logits.v[i * c + j] - max); s += p[i * c + j]; }
      for (j = 0; j < c; j++) p[i * c + j] /= s;
      perdida += -Math.log(Math.max(p[i * c + objetivo[i]], 1e-12));
    }
    var r = nodo([1], new Float32Array([perdida / f]), [logits], function () {
      for (var i = 0; i < f; i++) {
        for (var j = 0; j < c; j++) {
          var deberia = (j === objetivo[i]) ? 1 : 0;
          logits.g[i * c + j] += this.g[0] * (p[i * c + j] - deberia) / f;
        }
      }
    });
    r.probs = p;
    return r;
  };

  /* --- error cuadratico medio --- */
  NN.ecm = function (pred, real) {
    var n = pred.n, s = 0;
    for (var i = 0; i < n; i++) { var d = pred.v[i] - real.v[i]; s += d * d; }
    return nodo([1], new Float32Array([s / n]), [pred], function () {
      for (var i = 0; i < n; i++) pred.g[i] += this.g[0] * 2 * (pred.v[i] - real.v[i]) / n;
    });
  };

  /* --- media de todas las componentes (para cerrar una perdida) --- */
  NN.media = function (a) {
    var n = a.n, s = 0;
    for (var i = 0; i < n; i++) s += a.v[i];
    return nodo([1], new Float32Array([s / n]), [a], function () {
      for (var i = 0; i < n; i++) a.g[i] += this.g[0] / n;
    });
  };

  /* --- convolucion 2D ---
     x: [alto, ancho, centrada]   nucleo: [csal, kh, kw, cent]
     Sin relleno: la salida encoge en kh-1 y kw-1. Los MISMOS pesos
     recorren toda la imagen, y esa es la idea entera de una CNN. */
  NN.conv2d = function (x, nucleo) {
    var H = x.forma[0], W = x.forma[1], C = x.forma[2];
    var S = nucleo.forma[0], KH = nucleo.forma[1], KW = nucleo.forma[2];
    var OH = H - KH + 1, OW = W - KW + 1;
    var out = new Float32Array(OH * OW * S);
    var s, y, xx, dy, dx, ci, acc;
    for (s = 0; s < S; s++) {
      for (y = 0; y < OH; y++) {
        for (xx = 0; xx < OW; xx++) {
          acc = 0;
          for (dy = 0; dy < KH; dy++) {
            for (dx = 0; dx < KW; dx++) {
              for (ci = 0; ci < C; ci++) {
                acc += x.v[((y + dy) * W + (xx + dx)) * C + ci] *
                       nucleo.v[((s * KH + dy) * KW + dx) * C + ci];
              }
            }
          }
          out[(y * OW + xx) * S + s] = acc;
        }
      }
    }
    return nodo([OH, OW, S], out, [x, nucleo], function () {
      var g = this.g, s2, y2, x2, dy2, dx2, c2, gi;
      for (s2 = 0; s2 < S; s2++) {
        for (y2 = 0; y2 < OH; y2++) {
          for (x2 = 0; x2 < OW; x2++) {
            gi = g[(y2 * OW + x2) * S + s2];
            if (!gi) continue;
            for (dy2 = 0; dy2 < KH; dy2++) {
              for (dx2 = 0; dx2 < KW; dx2++) {
                for (c2 = 0; c2 < C; c2++) {
                  var ix = ((y2 + dy2) * W + (x2 + dx2)) * C + c2;
                  var ik = ((s2 * KH + dy2) * KW + dx2) * C + c2;
                  x.g[ix] += gi * nucleo.v[ik];
                  nucleo.g[ik] += gi * x.v[ix];
                }
              }
            }
          }
        }
      }
    });
  };

  /* --- agrupacion por maximo ---
     Encoge la imagen quedandose con el mayor de cada cuadrado. El
     gradiente vuelve entero al que gano: los demas no influyeron. */
  NN.agrupa = function (x, tam) {
    tam = tam || 2;
    var H = x.forma[0], W = x.forma[1], C = x.forma[2];
    var OH = Math.floor(H / tam), OW = Math.floor(W / tam);
    var out = new Float32Array(OH * OW * C), quien = new Int32Array(OH * OW * C);
    var y, xx, c, dy, dx;
    for (y = 0; y < OH; y++) {
      for (xx = 0; xx < OW; xx++) {
        for (c = 0; c < C; c++) {
          var mejor = -Infinity, idx = 0;
          for (dy = 0; dy < tam; dy++) {
            for (dx = 0; dx < tam; dx++) {
              var i = ((y * tam + dy) * W + (xx * tam + dx)) * C + c;
              if (x.v[i] > mejor) { mejor = x.v[i]; idx = i; }
            }
          }
          out[(y * OW + xx) * C + c] = mejor;
          quien[(y * OW + xx) * C + c] = idx;
        }
      }
    }
    return nodo([OH, OW, C], out, [x], function () {
      for (var i = 0; i < quien.length; i++) x.g[quien[i]] += this.g[i];
    });
  };

  /* --- cambiar la forma sin tocar los numeros (aplanar una imagen) --- */
  NN.reforma = function (a, forma) {
    var out = new Float32Array(a.n);
    out.set(a.v);
    return nodo(forma, out, [a], function () {
      for (var i = 0; i < a.n; i++) a.g[i] += this.g[i];
    });
  };

  /* --- embedding: elegir filas de una tabla ---
     La tabla tiene una fila por palabra del vocabulario. Buscar es
     indexar, y el gradiente se acumula en las filas que se usaron. */
  NN.embedding = function (tabla, indices) {
    var d = tabla.forma[1], L = indices.length;
    var out = new Float32Array(L * d);
    for (var i = 0; i < L; i++) {
      for (var j = 0; j < d; j++) out[i * d + j] = tabla.v[indices[i] * d + j];
    }
    return nodo([L, d], out, [tabla], function () {
      for (var i = 0; i < L; i++) {
        for (var j = 0; j < d; j++) tabla.g[indices[i] * d + j] += this.g[i * d + j];
      }
    });
  };

  /* --- mascara causal ---
     Pone a menos infinito lo que esta por encima de la diagonal, para
     que despues del softmax valga cero: un token no puede mirar a los
     que vienen detras. */
  NN.mascaraCausal = function (a) {
    var f = a.forma[0], c = a.forma[1], out = new Float32Array(f * c);
    for (var i = 0; i < f; i++) {
      for (var j = 0; j < c; j++) out[i * c + j] = j > i ? -1e9 : a.v[i * c + j];
    }
    return nodo([f, c], out, [a], function () {
      for (var i = 0; i < f; i++) {
        for (var j = 0; j < c; j++) if (j <= i) a.g[i * c + j] += this.g[i * c + j];
      }
    });
  };

  /* --- normalizacion por filas ---
     Tipificar cada fila: restar su media y dividir por su desviacion.
     Es exactamente lo de pe-normal, aplicado a las activaciones. */
  NN.normaliza = function (x, gamma, beta) {
    var f = x.forma[0], c = x.forma[1];
    var out = new Float32Array(f * c), mu = new Float32Array(f), sg = new Float32Array(f);
    var xh = new Float32Array(f * c);
    for (var i = 0; i < f; i++) {
      var s = 0, j;
      for (j = 0; j < c; j++) s += x.v[i * c + j];
      mu[i] = s / c;
      var q = 0;
      for (j = 0; j < c; j++) { var d = x.v[i * c + j] - mu[i]; q += d * d; }
      sg[i] = Math.sqrt(q / c + 1e-5);
      for (j = 0; j < c; j++) {
        xh[i * c + j] = (x.v[i * c + j] - mu[i]) / sg[i];
        out[i * c + j] = xh[i * c + j] * (gamma ? gamma.v[j] : 1) + (beta ? beta.v[j] : 0);
      }
    }
    var padres = [x];
    if (gamma) padres.push(gamma);
    if (beta) padres.push(beta);
    return nodo([f, c], out, padres, function () {
      for (var i = 0; i < f; i++) {
        var j, gx = new Float64Array(c), sum1 = 0, sum2 = 0;
        for (j = 0; j < c; j++) {
          var gy = this.g[i * c + j] * (gamma ? gamma.v[j] : 1);
          gx[j] = gy;
          sum1 += gy;
          sum2 += gy * xh[i * c + j];
          if (gamma) gamma.g[j] += this.g[i * c + j] * xh[i * c + j];
          if (beta) beta.g[j] += this.g[i * c + j];
        }
        for (j = 0; j < c; j++) {
          x.g[i * c + j] += (gx[j] - sum1 / c - xh[i * c + j] * sum2 / c) / sg[i];
        }
      }
    });
  };

  /* --- ATENCION, compuesta a partir de lo anterior ---
     Se escribe igual que en la pizarra: puntuar con un producto escalar,
     dividir por la raiz de d, tapar el futuro, softmax, y usar esos
     pesos para promediar los valores. Al estar compuesta, su vuelta
     atras sale sola de las piezas: no hay nada mas que pueda fallar. */
  NN.atencion = function (q, k, v, causal) {
    var d = q.forma[1];
    var puntos = NN.escala(NN.mm(q, NN.trans(k)), 1 / Math.sqrt(d));
    if (causal) puntos = NN.mascaraCausal(puntos);
    var pesos = NN.softmax(puntos);
    var salida = NN.mm(pesos, v);
    salida.pesos = pesos;          // para pintar el mapa de atencion
    return salida;
  };

  /* --- CELDA LSTM, tambien compuesta ---
     Tres puertas y un candidato. `p` trae las matrices y los sesgos.
     Devuelve el estado nuevo: {h, c}. */
  NN.lstm = function (x, h, c, p) {
    var junto = NN.suma(NN.mm(x, p.Wx), NN.mm(h, p.Wh));
    var z = NN.suma(junto, p.b);
    var d = p.Wh.forma[0];
    var olvida = NN.sigmoide(NN.trozo(z, 0, d));
    var entra = NN.sigmoide(NN.trozo(z, d, d));
    var sale = NN.sigmoide(NN.trozo(z, 2 * d, d));
    var cand = NN.tanh(NN.trozo(z, 3 * d, d));
    var cNuevo = NN.suma(NN.prod(olvida, c), NN.prod(entra, cand));
    var hNuevo = NN.prod(sale, NN.tanh(cNuevo));
    return { h: hNuevo, c: cNuevo, puertas: { olvida: olvida, entra: entra, sale: sale } };
  };

  /* --- quedarse con unas columnas (para partir las cuatro puertas) --- */
  NN.trozo = function (a, desde, ancho) {
    var f = a.forma[0], c = a.forma[1], out = new Float32Array(f * ancho);
    for (var i = 0; i < f; i++) {
      for (var j = 0; j < ancho; j++) out[i * ancho + j] = a.v[i * c + desde + j];
    }
    return nodo([f, ancho], out, [a], function () {
      for (var i = 0; i < f; i++) {
        for (var j = 0; j < ancho; j++) a.g[i * c + desde + j] += this.g[i * ancho + j];
      }
    });
  };

  /* ================================================================
     3. OPTIMIZADORES
     ================================================================ */

  /* Descenso de gradiente, con momento opcional: la «bola pesada» que
     acumula velocidad y atraviesa lomas pequeñas. Con momento 0 es el
     descenso de toda la vida de av-optimizacion. */
  NN.SGD = function (params, o) {
    o = o || {};
    var lr = o.lr === undefined ? 0.1 : o.lr;
    var momento = o.momento || 0;
    var vel = params.map(function (p) { return new Float32Array(p.n); });
    return {
      lr: lr,
      paso: function () {
        for (var i = 0; i < params.length; i++) {
          var p = params[i], vv = vel[i];
          for (var j = 0; j < p.n; j++) {
            vv[j] = momento * vv[j] - this.lr * p.g[j];
            p.v[j] += vv[j];
          }
        }
      }
    };
  };

  /* Adam: dos medias moviles exponenciales, la del gradiente y la de su
     cuadrado, y se divide una por la raiz de la otra. La media movil es
     exactamente la de cib-filtrado, y por eso Adam se explica alli y no
     en av-optimizacion. */
  NN.Adam = function (params, o) {
    o = o || {};
    var lr = o.lr === undefined ? 0.01 : o.lr;
    var b1 = o.b1 === undefined ? 0.9 : o.b1;
    var b2 = o.b2 === undefined ? 0.999 : o.b2;
    var eps = 1e-8, t = 0;
    var m = params.map(function (p) { return new Float32Array(p.n); });
    var v = params.map(function (p) { return new Float32Array(p.n); });
    return {
      lr: lr,
      paso: function () {
        t++;
        var c1 = 1 - Math.pow(b1, t), c2 = 1 - Math.pow(b2, t);
        for (var i = 0; i < params.length; i++) {
          var p = params[i], mi = m[i], vi = v[i];
          for (var j = 0; j < p.n; j++) {
            mi[j] = b1 * mi[j] + (1 - b1) * p.g[j];
            vi[j] = b2 * vi[j] + (1 - b2) * p.g[j] * p.g[j];
            p.v[j] -= this.lr * (mi[j] / c1) / (Math.sqrt(vi[j] / c2) + eps);
          }
        }
      },
      estado: function (i, j) { return { m: m[i][j], v: v[i][j] }; }
    };
  };

  /* ================================================================
     4. EL BUCLE DE ENTRENAMIENTO
     ================================================================ */

  /* Entrenar sin congelar la pagina: un paso (o unos cuantos) por
     fotograma, con requestAnimationFrame. Se para solo al salir de
     pantalla, como el visor de shaders, y NO arranca al construirse.

       var b = NN.bucle({
         host: elemento,          // para saber si se ve
         porFotograma: 5,         // pasos de entrenamiento por fotograma
         paso: function (n) {...},// un paso; devuelve la perdida
         pinta: function (n) {...}// repintar, una vez por fotograma
       });
       b.arranca();  b.pausa();  b.para();                             */
  NN.bucle = function (o) {
    var raf = 0, vivo = false, visible = true, n = 0, io = null;
    var porFotograma = o.porFotograma || 1;

    function fotograma() {
      raf = 0;
      if (!vivo) return;
      if (visible) {
        for (var i = 0; i < porFotograma; i++) {
          if (o.hasta && n >= o.hasta) { api.para(); break; }
          o.paso(n); n++;
        }
        if (o.pinta) o.pinta(n);
      }
      if (vivo) raf = global.requestAnimationFrame(fotograma);
    }

    var api = {
      get pasos() { return n; },
      arranca: function () {
        if (vivo) return api;
        vivo = true;
        if (!raf) raf = global.requestAnimationFrame(fotograma);
        return api;
      },
      pausa: function () {
        vivo = false;
        if (raf) { global.cancelAnimationFrame(raf); raf = 0; }
        return api;
      },
      para: function () {
        api.pausa();
        if (o.alAcabar) o.alAcabar(n);
        return api;
      },
      reinicia: function () {
        api.pausa(); n = 0;
        if (o.alReiniciar) o.alReiniciar();
        if (o.pinta) o.pinta(0);
        return api;
      },
      activo: function () { return vivo; }
    };

    /* Si sale de pantalla, deja de gastar. Es lo mismo que hace el visor
       de shaders, y por la misma razon: un curso con veintitantos temas
       abiertos no puede tener veintitantos bucles corriendo. */
    if (o.host && global.IntersectionObserver) {
      io = new IntersectionObserver(function (ents) {
        visible = ents[0].isIntersecting;
      }, { threshold: 0 });
      io.observe(o.host);
    }
    return api;
  };

  /* ================================================================
     5. AYUDAS PARA LOS TEMAS
     ================================================================ */

  /* Comprobar un gradiente contra diferencias finitas. Es lo que hace
     ia-retropropagacion delante del alumno, y lo que tests.html usa para
     auditar cada operacion de este archivo. */
  NN.compruebaGradiente = function (construye, params, h) {
    h = h || 1e-3;
    var peor = 0;
    NN.limpia();
    var perdida = construye();
    NN.atras(perdida, params);
    var analitico = params.map(function (p) {
      var copia = new Float32Array(p.n);
      copia.set(p.g);
      return copia;
    });
    for (var i = 0; i < params.length; i++) {
      for (var j = 0; j < params[i].n; j++) {
        var guarda = params[i].v[j];
        params[i].v[j] = guarda + h; NN.limpia(); var mas = construye().v[0];
        params[i].v[j] = guarda - h; NN.limpia(); var menos = construye().v[0];
        params[i].v[j] = guarda;
        var num = (mas - menos) / (2 * h), ana = analitico[i][j];
        var err = Math.abs(num - ana) / Math.max(1e-4, Math.abs(num) + Math.abs(ana));
        if (err > peor) peor = err;
      }
    }
    return peor;
  };

  /* Nubes de puntos generadas por formula: nada viene de fuera. */
  NN.datos = {
    /* Dos lunas entrelazadas: no separables por una recta. */
    lunas: function (r, n, ruido) {
      ruido = ruido === undefined ? 0.12 : ruido;
      var X = [], y = [];
      for (var i = 0; i < n; i++) {
        var c = i % 2, t = Math.PI * (i / n) * 2;
        if (c === 0) X.push([Math.cos(t) + r.real(-ruido, ruido, 4), Math.sin(t) + r.real(-ruido, ruido, 4)]);
        else X.push([1 - Math.cos(t) + r.real(-ruido, ruido, 4), 0.5 - Math.sin(t) + r.real(-ruido, ruido, 4)]);
        y.push(c);
      }
      return { X: X, y: y };
    },
    /* Dos circulos concentricos. */
    circulos: function (r, n, ruido) {
      ruido = ruido === undefined ? 0.1 : ruido;
      var X = [], y = [];
      for (var i = 0; i < n; i++) {
        var c = i % 2, a = r.real(0, 2 * Math.PI, 5), rad = (c ? 1.6 : 0.7) + r.real(-ruido, ruido, 4);
        X.push([rad * Math.cos(a), rad * Math.sin(a)]);
        y.push(c);
      }
      return { X: X, y: y };
    },
    /* Dos espirales: el caso dificil. */
    espirales: function (r, n, ruido) {
      ruido = ruido === undefined ? 0.08 : ruido;
      var X = [], y = [];
      for (var i = 0; i < n; i++) {
        var c = i % 2, t = 1.2 * Math.PI * (i / n) + 0.4;
        var a = t + c * Math.PI;
        X.push([t * Math.cos(a) / 2 + r.real(-ruido, ruido, 4), t * Math.sin(a) / 2 + r.real(-ruido, ruido, 4)]);
        y.push(c);
      }
      return { X: X, y: y };
    },
    /* Las cuatro esquinas del XOR. */
    xor: function (r, n, ruido) {
      ruido = ruido === undefined ? 0.22 : ruido;
      var X = [], y = [];
      for (var i = 0; i < n; i++) {
        var a = (i % 2) ? 1 : -1, b = (Math.floor(i / 2) % 2) ? 1 : -1;
        X.push([a + r.real(-ruido, ruido, 4), b + r.real(-ruido, ruido, 4)]);
        y.push(a * b > 0 ? 1 : 0);
      }
      return { X: X, y: y };
    },
    /* Dos gaussianas separadas: el caso facil. */
    nubes: function (r, n, sep) {
      sep = sep === undefined ? 1.6 : sep;
      var X = [], y = [];
      for (var i = 0; i < n; i++) {
        var c = i % 2, s = c ? sep : -sep;
        X.push([s + r.real(-1, 1, 4) + r.real(-1, 1, 4), s * 0.6 + r.real(-1, 1, 4) + r.real(-1, 1, 4)]);
        y.push(c);
      }
      return { X: X, y: y };
    }
  };

  /* Una lista de vectores a un tensor [filas, columnas]. */
  NN.deFilas = function (filas) {
    var f = filas.length, c = filas[0].length, v = new Float32Array(f * c);
    for (var i = 0; i < f; i++) for (var j = 0; j < c; j++) v[i * c + j] = filas[i][j];
    return NN.t([f, c], v);
  };

  /* Cuantos aciertos, comparando la clase mas probable con la verdadera. */
  NN.aciertos = function (logits, y) {
    var f = logits.forma[0], c = logits.forma[1], bien = 0;
    for (var i = 0; i < f; i++) {
      var mejor = 0;
      for (var j = 1; j < c; j++) if (logits.v[i * c + j] > logits.v[i * c + mejor]) mejor = j;
      if (mejor === y[i]) bien++;
    }
    return bien / f;
  };

  global.NN = NN;
})(window);
