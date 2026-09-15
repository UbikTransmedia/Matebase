/* ===================================================================
   Matebase · sonido.js
   EL SINTETIZADOR. Un sonido es una funcion del tiempo, y aqui se escribe
   como tal: `function sonido(t) { return ...; }` devuelve, para cada
   instante t en segundos, un numero entre -1 y 1. El motor la evalua
   44 100 veces por segundo, dibuja la onda y el espectro, y la manda a los
   altavoces. Es a la sintesis de sonido lo que shader.js es a la imagen:
   se escribe una vez y lo usan todos los temas del bloque.

   Decisiones que conviene entender antes de tocar nada:

   · UNA FUNCION DEL TIEMPO. Igual que el shader recibe un pixel y devuelve
     un color, esto recibe un instante y devuelve una presion. El codigo es
     JavaScript, el idioma del navegador, con las funciones de siempre
     (sin, cos, exp, floor...) y unas pocas mas que son musica: sierra,
     cuadrada, nota, ruido, anterior, antes.

   · CON MEMORIA, SI SE PIDE. `anterior(k)` devuelve la salida de hace k
     muestras y `antes(s)` la de hace s segundos. Con eso una formula se
     convierte en una recurrencia: un filtro, un eco, una cuerda. Es la
     sucesion recurrente del bloque de funciones, sonando.

   · TODO SE CALCULA SIN SONAR. `SON.render` devuelve la lista de
     muestras y no toca ningun altavoz: asi tests.html audita cada ejemplo
     y cada ejercicio de codigo sin que nadie oiga nada. El AudioContext se
     crea al pulsar «Tocar», que es lo que exige el navegador y lo que
     pide la cortesia.

   · SE CORRIGE POR LO QUE SUENA. `SON.iguales` compara dos codigos por su
     espectro medio, su envolvente y su nivel, no por el texto: `sin` y
     `cos` a la misma frecuencia son el mismo sonido, y asi se aceptan.
   =================================================================== */
(function (global) {
  'use strict';

  var U = global.U, W = global.W;

  /* Rotulos y mensajes de error, que los lee una persona. Frases enteras
     con huecos -{x}, {n}- y nunca trozos pegados con +: en otro idioma el
     orden de las palabras cambia. Lo que NO pasa por aqui es el codigo: los
     nombres de las funciones del sintetizador son parte del lenguaje. */
  function UI(s) { return global.I18N ? I18N.ui(s) : s; }
  function con(s, vals) {
    var t = UI(s);
    for (var k in vals) t = t.split('{' + k + '}').join(vals[k]);
    return t;
  }

  var SR = 44100;
  var TAU = 2 * Math.PI;
  var SON = { SR: SR, TAU: TAU };

  /* ------------------ las funciones que son musica ------------------ */

  function fract(x) { return x - Math.floor(x); }
  /** Diente de sierra de -1 a 1, con frecuencia f, en el instante t. */
  function sierra(f, t) { return 2 * fract(f * t) - 1; }
  /** Onda cuadrada: +1 la primera mitad del periodo, -1 la segunda. */
  function cuadrada(f, t) { return fract(f * t) < 0.5 ? 1 : -1; }
  /** Triangulo de -1 a 1. */
  function triangulo(f, t) { return 4 * Math.abs(fract(f * t) - 0.5) - 1; }
  /** Pulso: +1 durante una fraccion `ancho` del periodo, -1 el resto. */
  function pulso(f, t, ancho) { return fract(f * t) < (ancho === undefined ? 0.5 : ancho) ? 1 : -1; }
  /** Frecuencia de una nota MIDI: el 69 es el La de 440 Hz y cada 12 dobla. */
  function nota(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function clamp(x, a, b) { return Math.min(b, Math.max(a, x)); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function step(e, x) { return x < e ? 0 : 1; }
  function smoothstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function mod(a, b) { return a - b * Math.floor(a / b); }
  function sign(x) { return x > 0 ? 1 : (x < 0 ? -1 : 0); }
  /** Cae exponencialmente: vale 1 en t = 0 y 1/e en t = tau. */
  function decae(t, tau) { return t < 0 ? 0 : Math.exp(-t / tau); }
  /** Envolvente ADSR de una nota de duracion `dur` (segundos): ataque a,
      caida d hasta el nivel s, y liberacion r cuando la nota termina. */
  function adsr(t, a, d, s, r, dur) {
    if (t < 0) return 0;
    if (dur === undefined) dur = 1e9;
    if (t < a) return a > 0 ? t / a : 1;
    if (t < a + d) return d > 0 ? 1 - (1 - s) * (t - a) / d : s;
    if (t < dur) return s;
    var q = t - dur;
    return r > 0 ? s * Math.max(0, 1 - q / r) : 0;
  }

  /** Un generador reproducible: el mismo ruido cada vez que se calcula,
      para que la auditoria y el alumno oigan lo mismo. */
  function rng(semilla) {
    var s = (semilla >>> 0) || 0x9e3779b9;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var z = s;
      z = Math.imul(z ^ (z >>> 15), z | 1);
      z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
    };
  }

  var PURAS = { sierra: sierra, cuadrada: cuadrada, triangulo: triangulo, pulso: pulso, nota: nota,
    fract: fract, clamp: clamp, mix: mix, step: step, smoothstep: smoothstep, mod: mod, sign: sign,
    decae: decae, adsr: adsr };
  SON.f = PURAS;

  /* ------------------------ compilar ------------------------ */

  /* El preambulo va delante del codigo del alumno. Se cuenta cuantas
     lineas tiene para poder restarlas al traducir un numero de linea. */
  var PREAMBULO =
    'var sin=Math.sin,cos=Math.cos,tan=Math.tan,abs=Math.abs,floor=Math.floor,ceil=Math.ceil,round=Math.round,' +
    'sqrt=Math.sqrt,exp=Math.exp,log=Math.log,pow=Math.pow,min=Math.min,max=Math.max,atan=Math.atan2,' +
    'PI=Math.PI,TAU=2*Math.PI,SR=__H.SR;\n' +
    'var sierra=__H.sierra,cuadrada=__H.cuadrada,triangulo=__H.triangulo,pulso=__H.pulso,nota=__H.nota,' +
    'fract=__H.fract,clamp=__H.clamp,mix=__H.mix,step=__H.step,smoothstep=__H.smoothstep,mod=__H.mod,' +
    'sign=__H.sign,decae=__H.decae,adsr=__H.adsr,ruido=__H.ruido,anterior=__H.anterior,antes=__H.antes;\n';
  var LINEAS_PRE = PREAMBULO.split('\n').length - 1;   // 2

  /** Nombres que el codigo del alumno ve: los de arriba mas los mandos. */
  SON.NOMBRES = ('sin cos tan abs floor ceil round sqrt exp log pow min max atan PI TAU SR ' +
    'sierra cuadrada triangulo pulso nota fract clamp mix step smoothstep mod sign decae adsr ruido anterior antes').split(' ');

  /** Compila el codigo y devuelve una fabrica: fabrica(H, M) -> sonido(t, i).
      Se separa de render para que un error de sintaxis se distinga de uno de
      ejecucion, y para no volver a compilar al mover un mando. */
  SON.compila = function (codigo, mandos) {
    var decl = '';
    (mandos || []).forEach(function (m) {
      var n = m.n || m;
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(n)) decl += 'var ' + n + '=__M["' + n + '"];';
    });
    var src = PREAMBULO + decl + '\n' + String(codigo || '') +
      '\n;return (typeof sonido === "function") ? sonido : null;';
    try {
      var fabrica = new Function('__H', '__M', src);
      return { ok: true, fabrica: fabrica, pre: LINEAS_PRE + 1 };
    } catch (e) {
      return { ok: false, error: { msg: mensaje(e), linea: null } };
    }
  };

  function mensaje(e) {
    var m = String(e && e.message || e);
    var TR = [
      [/^(\w+) is not defined$/, UI('«$1» no existe. ¿Está bien escrito? Las funciones que hay son sin, cos, sierra, cuadrada, nota, ruido, anterior…')],
      [/Unexpected token '?\)'?/, UI('Sobra un paréntesis, o falta algo antes de él.')],
      [/Unexpected token '?\}'?/, UI('Sobra una llave, o falta un punto y coma antes.')],
      [/Unexpected end of input/, UI('El código se acaba antes de tiempo: falta cerrar un paréntesis o una llave.')],
      [/Unexpected identifier/, UI('Dos nombres seguidos sin operador entre ellos: falta un *, un + o una coma.')],
      [/Unexpected number/, UI('Un número donde no se esperaba: falta un operador delante.')],
      [/^(.+?) is not a function$/, UI('«$1» se usa como si fuera una función y no lo es.')],
      [/Invalid or unexpected token/, UI('Hay un carácter que no se entiende (¿una comilla sin cerrar?).')],
      [/missing \) after argument list/, UI('Falta un paréntesis de cierre.')],
      [/missing ; before statement/, UI('Falta un punto y coma, o un operador, antes de esta parte.')],
      [/expected expression, got '?\)'?/, UI('Sobra un paréntesis, o falta algo antes de él.')],
      [/expected expression, got end of script/, UI('El código se acaba antes de tiempo: falta cerrar un paréntesis o una llave.')],
      [/missing \} /, UI('Falta cerrar una llave.')]
    ];
    for (var i = 0; i < TR.length; i++) if (TR[i][0].test(m)) return m.replace(TR[i][0], TR[i][1]);
    return m;
  }

  /** La linea del codigo del alumno en la que salto un error de ejecucion,
      leida de la pila del navegador y corregida por el preambulo. */
  function lineaDe(e, pre) {
    var st = String(e && e.stack || '');
    var m = /(?:<anonymous>|Function|eval):(\d+):\d+/.exec(st) || /:(\d+):\d+\)?\s*$/m.exec(st);
    if (!m) return null;
    var n = parseInt(m[1], 10);
    /* Chrome envuelve el cuerpo en dos lineas -«function anonymous(__H,__M\n) {»-,
       Firefox en ninguna. Se prueban las dos y se acepta la que caiga dentro. */
    var candidatos = [n - 2 - pre, n - pre];
    for (var i = 0; i < candidatos.length; i++) if (candidatos[i] >= 1) return candidatos[i];
    return null;
  }

  /* ------------------------ calcular ------------------------ */

  /** Evalua el codigo y devuelve las muestras.
      o: { dur (s, 2), sr (44100), mandos, valores, semilla, compilado }
      -> { ok, muestras: Float32Array, sr, dur, pico, rms, recorte, silencio }
      -> { ok: false, error: { msg, linea } }                                 */
  SON.render = function (codigo, o) {
    o = o || {};
    var sr = o.sr || SR, dur = o.dur || 2;
    var comp = o.compilado || SON.compila(codigo, o.mandos);
    if (!comp.ok) return comp;
    var N = Math.max(1, Math.round(dur * sr));
    var out = new Float32Array(N);
    var st = { i: 0 };
    var azar = rng(o.semilla === undefined ? 1234 : o.semilla);
    var H = {
      SR: sr,
      sierra: sierra, cuadrada: cuadrada, triangulo: triangulo, pulso: pulso, nota: nota,
      fract: fract, clamp: clamp, mix: mix, step: step, smoothstep: smoothstep, mod: mod, sign: sign,
      decae: decae, adsr: adsr,
      ruido: function () { return 2 * azar() - 1; },
      anterior: function (k) {
        var j = st.i - (k === undefined ? 1 : Math.round(k));
        return j >= 0 && j < st.i ? out[j] : 0;
      },
      antes: function (s) { return H.anterior(Math.round(s * sr)); }
    };
    var M = {};
    (o.mandos || []).forEach(function (m) {
      M[m.n] = (o.valores && o.valores[m.n] !== undefined) ? o.valores[m.n] : m.value;
    });
    var fn;
    try { fn = comp.fabrica(H, M); }
    catch (e) { return { ok: false, error: { msg: mensaje(e), linea: lineaDe(e, comp.pre) } }; }
    if (typeof fn !== 'function') return { ok: false, error: { msg: UI('No hay ninguna función llamada «sonido». Tiene que empezar por: function sonido(t) {'), linea: null } };

    var pico = 0, suma2 = 0, recorte = 0;
    try {
      for (var i = 0; i < N; i++) {
        st.i = i;
        var y = fn(i / sr, i);
        if (typeof y !== 'number' || y !== y) {
          if (i === 0) return { ok: false, error: { msg: UI('La función no devuelve un número. ¿Falta el «return»?'), linea: null } };
          y = 0;
        }
        if (y > 1 || y < -1) recorte++;
        if (y > 8) y = 8; else if (y < -8) y = -8;   // una realimentacion desbocada no se lleva el navegador
        out[i] = y;
        var a = Math.abs(y);
        if (a > pico) pico = a;
        suma2 += y * y;
      }
    } catch (e) {
      return { ok: false, error: { msg: mensaje(e), linea: lineaDe(e, comp.pre) } };
    }
    var rms = Math.sqrt(suma2 / N);
    return { ok: true, muestras: out, sr: sr, dur: N / sr, pico: pico, rms: rms,
      recorte: recorte / N, silencio: rms < 1e-4 };
  };

  /* ------------------------ analizar ------------------------ */

  /** Transformada rapida de Fourier, radix 2, en el sitio. re e im son
      Float64Array de longitud potencia de dos. */
  function fft(re, im) {
    var n = re.length, i, j, k, m;
    for (i = 1, j = 0; i < n; i++) {
      var bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { var t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (m = 2; m <= n; m <<= 1) {
      var ang = -TAU / m, wr = Math.cos(ang), wi = Math.sin(ang);
      for (i = 0; i < n; i += m) {
        var cr = 1, ci = 0;
        for (k = 0; k < m / 2; k++) {
          var a = i + k, b = a + m / 2;
          var xr = re[b] * cr - im[b] * ci, xi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - xr; im[b] = im[a] - xi;
          re[a] += xr; im[a] += xi;
          var nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
        }
      }
    }
  }
  SON.fft = fft;

  /** Espectro de amplitud medio: se parte la señal en ventanas de n muestras
      (con ventana de Hann), se hace la FFT de cada una y se promedia el
      modulo. Devuelve Float32Array de n/2 valores; el k-esimo es la amplitud
      a la frecuencia k * sr / n. Normalizado para que un seno de amplitud 1
      de aproximadamente 1 en su bin. */
  SON.espectro = function (muestras, o) {
    o = o || {};
    var n = o.n || 4096, sr = o.sr || SR;
    var mag = new Float32Array(n / 2);
    if (!muestras || muestras.length < 64) return mag;
    var paso = Math.max(1, Math.floor(n / 2));
    var ventanas = 0;
    var re = new Float64Array(n), im = new Float64Array(n);
    var hann = new Float64Array(n);
    for (var i = 0; i < n; i++) hann[i] = 0.5 - 0.5 * Math.cos(TAU * i / n);
    var maxVent = o.maxVentanas || 12;
    for (var ini = 0; ini + n <= muestras.length && ventanas < maxVent; ini += paso) {
      for (i = 0; i < n; i++) { re[i] = muestras[ini + i] * hann[i]; im[i] = 0; }
      fft(re, im);
      for (i = 0; i < n / 2; i++) mag[i] += Math.sqrt(re[i] * re[i] + im[i] * im[i]);
      ventanas++;
    }
    if (!ventanas) {
      /* mas corta que una ventana: se rellena con ceros */
      for (i = 0; i < n; i++) { re[i] = i < muestras.length ? muestras[i] * hann[i] : 0; im[i] = 0; }
      fft(re, im);
      for (i = 0; i < n / 2; i++) mag[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
      ventanas = 1;
    }
    var esc = 4 / (n * ventanas);          // Hann reparte la mitad: 2/n por ventana, x2 por el lado negativo
    for (i = 0; i < n / 2; i++) mag[i] *= esc;
    mag.sr = sr; mag.n = n;
    return mag;
  };

  /** La frecuencia dominante, en Hz, con interpolacion parabolica entre bins. */
  SON.frecuenciaPico = function (mag, sr, n) {
    sr = sr || mag.sr || SR; n = n || mag.n || (mag.length * 2);
    var k = 1, best = -1;
    for (var i = 1; i < mag.length - 1; i++) if (mag[i] > best) { best = mag[i]; k = i; }
    if (best <= 0) return 0;
    var a = mag[k - 1], b = mag[k], c = mag[k + 1];
    var d = (a - c) / (2 * (a - 2 * b + c) || 1);
    if (!(d > -1 && d < 1)) d = 0;
    return (k + d) * sr / n;
  };

  /** Envolvente: RMS por bloques de `ms` milisegundos. */
  SON.envolvente = function (muestras, sr, ms) {
    sr = sr || SR; ms = ms || 20;
    var L = Math.max(1, Math.round(sr * ms / 1000));
    var nb = Math.ceil(muestras.length / L), env = new Float32Array(nb);
    for (var b = 0; b < nb; b++) {
      var s = 0, c = 0;
      for (var i = b * L; i < Math.min(muestras.length, (b + 1) * L); i++) { s += muestras[i] * muestras[i]; c++; }
      env[b] = c ? Math.sqrt(s / c) : 0;
    }
    return env;
  };

  function coseno(a, b) {
    var s = 0, na = 0, nb = 0, n = Math.min(a.length, b.length);
    for (var i = 0; i < n; i++) { s += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    if (!na || !nb) return (!na && !nb) ? 1 : 0;
    return s / Math.sqrt(na * nb);
  }

  /** ¿Suenan igual dos codigos? Compara el espectro medio (que frecuencias
      hay y con que peso), la envolvente (como evoluciona el volumen) y el
      nivel global. Se acepta cualquier escritura que produzca el mismo
      sonido: `sin` y `cos`, `2*x` y `x+x`, un seno y su suma de armonicos
      equivalente. Devuelve { ok, espectro, envolvente, nivel } o `motivo`. */
  SON.iguales = function (codA, codB, o) {
    o = o || {};
    var dur = o.dur || 1.5;
    var a = SON.render(codA, { dur: dur, mandos: o.mandos, valores: o.valores, semilla: 7 });
    if (!a.ok) return { ok: false, motivo: UI('la respuesta no compila'), error: a.error };
    var b = SON.render(codB, { dur: dur, mandos: o.mandos, valores: o.valores, semilla: 7 });
    if (!b.ok) return { ok: false, motivo: UI('la referencia no compila'), error: b.error };
    var ea = SON.espectro(a.muestras), eb = SON.espectro(b.muestras);
    /* En escala logaritmica los armonicos flojos tambien cuentan: un seno y
       una sierra tienen el mismo pico y no suenan igual. */
    var la = new Float32Array(ea.length), lb = new Float32Array(eb.length);
    var topA = 0, topB = 0, i;
    for (i = 0; i < ea.length; i++) { if (ea[i] > topA) topA = ea[i]; if (eb[i] > topB) topB = eb[i]; }
    var piso = 1e-3;
    for (i = 0; i < ea.length; i++) {
      la[i] = Math.max(0, Math.log(ea[i] / (topA || 1) + piso) - Math.log(piso));
      lb[i] = Math.max(0, Math.log(eb[i] / (topB || 1) + piso) - Math.log(piso));
    }
    var esp = coseno(la, lb);
    var env = coseno(SON.envolvente(a.muestras), SON.envolvente(b.muestras));
    var nivel = (b.rms > 1e-6) ? a.rms / b.rms : (a.rms < 1e-6 ? 1 : 99);
    var tolE = o.tolEspectro === undefined ? 0.97 : o.tolEspectro;
    var tolV = o.tolEnvolvente === undefined ? 0.95 : o.tolEnvolvente;
    var tolN = o.tolNivel === undefined ? 0.35 : o.tolNivel;      // ±35 % de RMS, unos 3 dB
    var ok = esp >= tolE && env >= tolV && Math.abs(nivel - 1) <= tolN;
    if (b.silencio) ok = a.silencio;
    return { ok: ok, espectro: esp, envolvente: env, nivel: nivel, silencio: a.silencio };
  };

  /* ------------------------ coloreado ------------------------ */

  var LEXICO = {};
  (function () {
    var grupos = {
      key: 'function return var let const if else for while do break continue true false new',
      typ: 'Math',
      fun: 'sin cos tan abs floor ceil round sqrt exp log pow min max atan sierra cuadrada triangulo pulso nota fract clamp mix step smoothstep mod sign decae adsr ruido anterior antes',
      uni: 'PI TAU SR t i'
    };
    Object.keys(grupos).forEach(function (clase) {
      grupos[clase].split(' ').forEach(function (w) { if (w) LEXICO[w] = clase; });
    });
  })();
  var RE_TOK = /\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\n]*|\b\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+(?:[eE][-+]?\d+)?|[A-Za-z_$][A-Za-z0-9_$]*|[^\sA-Za-z0-9_$]+|\s+/g;
  function escapa(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /** El codigo convertido en HTML con un <span> por trozo, con los mismos
      ocho papeles y las mismas clases que el editor de shaders. */
  /* Se exporta para que tests.html compruebe que la referencia de la
     columna derecha explica cada palabra que el editor colorea. */
  SON.lexico = LEXICO;

  SON.pinta = function (texto, mandos) {
    var propios = {};
    (mandos || []).forEach(function (m) { propios[m.n || m] = 1; });
    var out = '', m, t, c;
    RE_TOK.lastIndex = 0;
    texto = String(texto);
    while ((m = RE_TOK.exec(texto)) !== null) {
      t = m[0]; c = null;
      if (t.slice(0, 2) === '//' || t.slice(0, 2) === '/*') c = 'com';
      else if (/^\.?\d/.test(t)) c = 'num';
      else if (/^[A-Za-z_$]/.test(t)) {
        if (propios[t]) c = 'uni';
        else if (LEXICO[t]) c = LEXICO[t];
        else c = /^\s*\(/.test(texto.slice(RE_TOK.lastIndex)) ? 'fun' : null;
      } else if (/^\s/.test(t)) c = null;
      else c = 'pun';
      out += c ? '<span class="cod-' + c + '">' + escapa(t) + '</span>' : escapa(t);
    }
    return out;
  };

  /* ------------------------ el altavoz ------------------------ */

  var ctx = null, actual = null;
  SON.contexto = function () {
    if (ctx) return ctx;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { ctx = null; }
    return ctx;
  };
  /** Solo suena un visor a la vez: al arrancar uno, el anterior se calla. */
  SON.silencia = function (excepto) {
    if (actual && actual !== excepto) actual.para();
    actual = excepto || null;
  };

  /* ------------------------ el visor ------------------------ */

  function Visor(host, o) {
    o = o || {};
    var self = this;
    this.o = o;
    this.original = (o.codigo || '').replace(/^\n/, '');
    this.mandos = o.mandos || [];
    this.valores = {};
    this.mandos.forEach(function (m) { self.valores[m.n] = m.value; });
    this.dur = o.dur || 2;
    this.loop = o.loop !== false;
    this.ventana = o.ventana || 20;        // ms de onda que se enseñan
    this.fmax = o.fmax || 4000;            // Hz que enseña el espectro
    this.res = null; this.fuente = null; this.gan = null; this.t0 = 0; this.sonando = false;
    this.build(host);
  }

  Visor.prototype.build = function (host) {
    var self = this, o = this.o;
    this.el = U.el('div.son');
    this.el.__son = this;                   // el asa para tests.html

    /* --- las dos vistas y la tira --- */
    var vistas = U.el('div.son__vistas');
    this.cOnda = U.el('canvas.son__lienzo', { role: 'img', 'aria-label': con('Forma de onda: los primeros {n} milisegundos del sonido que calcula el código de abajo.', { n: this.ventana }) });
    this.cEsp = U.el('canvas.son__lienzo', { role: 'img', 'aria-label': con('Espectro: qué frecuencias contiene el sonido y con qué amplitud, hasta {n} hercios.', { n: this.fmax }) });
    vistas.appendChild(U.el('div.son__vista', null, [U.el('span.son__rot', { text: con('onda · {n} ms', { n: this.ventana }) }), this.cOnda]));
    this.espectrograma = !!o.espectrograma;
    if (this.espectrograma) this.cEsp.setAttribute('aria-label', con('Espectrograma: el tiempo de izquierda a derecha, la frecuencia de abajo arriba hasta {n} hercios, y el brillo es la amplitud.', { n: this.fmax }));
    vistas.appendChild(U.el('div.son__vista', null, [U.el('span.son__rot', {
      text: UI(this.espectrograma ? 'espectrograma' : 'espectro') + ' · ' +
        con('hasta {f}', { f: this.fmax >= 1000 ? (this.fmax / 1000) + ' kHz' : this.fmax + ' Hz' })
    }), this.cEsp]));
    this.el.appendChild(vistas);
    this.cTira = U.el('canvas.son__tira', { role: 'img', 'aria-label': UI('El sonido entero, de principio a fin, con la posición de reproducción.') });
    this.el.appendChild(this.cTira);
    this.aviso = U.el('div.son__aviso', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(this.aviso);

    /* --- mandos --- */
    if (this.mandos.length) {
      var fila = W.row(this.el);
      this.sliders = {};
      var espera2 = null;
      this.mandos.forEach(function (m) {
        self.sliders[m.n] = W.slider(fila, {
          label: m.label || m.n, min: m.min, max: m.max, step: m.step, value: m.value, dec: m.dec,
          on: function (v) {
            self.valores[m.n] = v;
            clearTimeout(espera2);
            espera2 = setTimeout(function () { self.recalcula(true); }, 120);
          }
        });
      });
    }

    /* --- el editor, de dos capas como el de shaders --- */
    if (o.editable !== false) {
      var idEd = 'son' + (Visor.n = (Visor.n || 0) + 1);
      this.el.appendChild(U.el('label.shd__lab', {
        'for': idEd,
        html: UI('Código del sonido') + ' &nbsp;<span class="shd__pista">' +
          UI('se vuelve a calcular solo al escribir') + '</span>'
      }));
      this.caja = U.el('div.shd__caja.shd__caja--prog');
      this.capa = U.el('pre.shd__pinta', { 'aria-hidden': 'true' });
      this.caja.appendChild(this.capa);
      this.ed = U.el('textarea.shd__ed', {
        id: idEd, spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', wrap: 'off',
        rows: String(Math.max(5, Math.min(22, this.original.split('\n').length + 1)))
      });
      this.ed.value = this.original;
      this.caja.appendChild(this.ed);
      this.el.appendChild(this.caja);
      var espera = null;
      this.ed.addEventListener('input', function () {
        self.repintaCodigo();
        clearTimeout(espera);
        espera = setTimeout(function () { self.recalcula(true); self.guarda(); }, 450);
      });
      this.ed.addEventListener('scroll', function () {
        self.capa.scrollTop = self.ed.scrollTop; self.capa.scrollLeft = self.ed.scrollLeft;
      });
      if (global.ResizeObserver) {
        this.ro = new ResizeObserver(function () { self.ajustaCapa(); });
        this.ro.observe(this.ed);
      }
    }

    this.err = U.el('div.shd__err', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(this.err);

    /* --- botones --- */
    this.bToca = U.el('button.btn.btn--main', { type: 'button', html: '&#9654; ' + UI('Tocar'), 'aria-label': UI('Tocar el sonido') });
    this.bPara = U.el('button.btn', { type: 'button', html: '&#9632; ' + UI('Parar'), 'aria-label': UI('Parar el sonido') });
    this.bReset = U.el('button.btn', { type: 'button', html: '&#8635; ' + UI('Volver al original') });
    this.bToca.addEventListener('click', function () { self.toca(); });
    this.bPara.addEventListener('click', function () { self.para(); });
    this.bReset.addEventListener('click', function () { self.reinicia(); });
    var vol = U.el('label.son__vol', null, [
      U.el('span', { text: UI('volumen') }),
      this.vol = U.el('input', { type: 'range', min: '0', max: '1', step: '0.05', value: '0.5', 'aria-label': UI('Volumen') })
    ]);
    this.vol.addEventListener('input', function () { if (self.gan) self.gan.gain.value = self.volumen(); });
    this.info = U.el('span.son__info', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(U.el('div.shd__pie', null, [this.bToca, this.bPara, this.bReset, vol, this.info]));
    if (o.nota) W.hint(this.el, o.nota);
    host.appendChild(this.el);

    if (o.id && this.ed) {
      var g = global.Progress && Progress.pref('son:' + o.id);
      if (g) this.ed.value = g;
    }
    this.repintaCodigo();

    /* Se calcula al verse, no antes: en un tema con seis visores no hace
       falta evaluar seis funciones 88 000 veces al abrir la pagina. */
    if (global.IntersectionObserver) {
      this.io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { if (!self.res) self.recalcula(false); }
          else self.para();
        });
      }, { rootMargin: '120px' });
      this.io.observe(this.el);
    } else {
      this.recalcula(false);
    }
    if (global.U && U.bus) U.bus.on('theme', function () { if (self.res) self.dibuja(); });
  };

  Visor.prototype.volumen = function () { return parseFloat(this.vol.value) * 0.6; };
  Visor.prototype.codigo = function () { return this.ed ? this.ed.value : this.original; };
  Visor.prototype.guarda = function () {
    if (this.o.id && this.ed && global.Progress) Progress.pref('son:' + this.o.id, this.ed.value);
  };
  Visor.prototype.repintaCodigo = function () {
    if (!this.capa || !this.ed) return;
    this.capa.innerHTML = SON.pinta(this.ed.value, this.mandos) + '\n';
    this.ajustaCapa();
    this.capa.scrollTop = this.ed.scrollTop; this.capa.scrollLeft = this.ed.scrollLeft;
  };
  Visor.prototype.ajustaCapa = function () {
    if (!this.capa || !this.ed) return;
    this.capa.style.paddingBottom = '';
    var falta = (this.ed.scrollHeight - this.ed.clientHeight) - (this.capa.scrollHeight - this.capa.clientHeight);
    if (falta > 0) {
      var base = parseFloat(getComputedStyle(this.capa).paddingBottom) || 0;
      this.capa.style.paddingBottom = (base + falta) + 'px';
    }
  };
  Visor.prototype.reinicia = function () {
    if (this.ed) { this.ed.value = this.original; this.repintaCodigo(); }
    if (this.o.id && global.Progress) Progress.pref('son:' + this.o.id, '');
    this.mandos.forEach(function (m) { this.valores[m.n] = m.value; if (this.sliders && this.sliders[m.n] && this.sliders[m.n].set) this.sliders[m.n].set(m.value); }, this);
    this.recalcula(true);
  };

  /** Vuelve a evaluar el codigo. Si estaba sonando y `enCaliente`, cambia el
      sonido sin parar: es lo que permite mover un mando mientras suena. */
  Visor.prototype.recalcula = function (enCaliente) {
    var r = SON.render(this.codigo(), { dur: this.dur, mandos: this.mandos, valores: this.valores });
    if (!r.ok) {
      this.res = null;
      this.err.className = 'shd__err is-mal';
      this.err.innerHTML = (r.error.linea ? '<span class="shd__ln">' + con('línea {n}', { n: r.error.linea }) + '</span>' : '') + escapa(r.error.msg);
      this.el.classList.add('son--roto');
      this.info.textContent = '';
      this.para();
      this.dibujaVacio();
      return;
    }
    this.el.classList.remove('son--roto');
    this.res = r;
    this.err.className = 'shd__err';
    this.err.textContent = '';
    var f0 = SON.frecuenciaPico(SON.espectro(r.muestras));
    this.info.textContent = U.fmt(r.dur, 1) + ' s · ' +
      con('pico {p} · nivel {n}', { p: U.fmt(r.pico, 2), n: U.fmt(r.rms, 2) }) +
      (r.silencio ? ' · ' + UI('silencio')
        : ' · ' + (f0 >= 20 ? con('dominante {f} Hz', { f: U.fmt(f0, f0 < 1000 ? 1 : 0) }) : UI('sin tono claro'))) +
      (r.recorte > 0.001 ? ' · ' + con('recorta el {p} %', { p: U.fmt(100 * r.recorte, 1) }) : '');
    this.dibuja();
    if (this.sonando && enCaliente) this.toca();
  };

  Visor.prototype.toca = function () {
    var self = this;
    if (!this.res) { this.recalcula(false); if (!this.res) return; }
    var c = SON.contexto();
    if (!c) {
      this.aviso.textContent = UI('Este navegador no puede reproducir sonido, pero la onda y el espectro de arriba son el sonido calculado.');
      this.aviso.classList.add('is-on');
      return;
    }
    SON.silencia(this);
    if (c.state === 'suspended' && c.resume) c.resume();
    this.paraFuente();
    var r = this.res, N = r.muestras.length;
    var buf = c.createBuffer(1, N, r.sr);
    var ch = buf.getChannelData(0);
    var fade = Math.min(Math.round(r.sr * 0.004), N >> 2);   // 4 ms para que el bucle no chasque
    for (var i = 0; i < N; i++) {
      var y = Math.max(-1, Math.min(1, r.muestras[i]));
      if (this.loop || i < fade || i >= N - fade) {
        if (i < fade) y *= i / fade;
        else if (i >= N - fade) y *= (N - 1 - i) / fade;
      }
      ch[i] = y;
    }
    if (!this.gan) { this.gan = c.createGain(); this.gan.connect(c.destination); }
    this.gan.gain.value = this.volumen();
    var src = c.createBufferSource();
    src.buffer = buf; src.loop = this.loop;
    src.connect(this.gan);
    src.onended = function () { if (self.fuente === src) { self.fuente = null; self.sonando = false; self.pintaEstado(); } };
    src.start();
    this.fuente = src; this.t0 = c.currentTime; this.sonando = true;
    this.pintaEstado();
    this.anima();
    /* Si el tema se cierra con el sonido puesto, que se calle solo. */
    clearInterval(this.vigila);
    this.vigila = setInterval(function () { if (!self.el.isConnected) self.para(); }, 500);
  };

  Visor.prototype.paraFuente = function () {
    if (this.fuente) { try { this.fuente.onended = null; this.fuente.stop(); } catch (e) { } this.fuente = null; }
  };
  Visor.prototype.para = function () {
    this.paraFuente();
    this.sonando = false;
    clearInterval(this.vigila);
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    if (actual === this) actual = null;
    this.pintaEstado();
    if (this.res) this.dibujaTira(-1);
  };
  Visor.prototype.pintaEstado = function () {
    this.el.classList.toggle('son--sonando', !!this.sonando);
    this.bToca.innerHTML = '&#9654; ' + UI(this.sonando ? 'Otra vez' : 'Tocar');
  };
  Visor.prototype.anima = function () {
    var self = this;
    if (this.raf) cancelAnimationFrame(this.raf);
    var paso = function () {
      if (!self.sonando || !self.res) return;
      var c = SON.contexto();
      var t = c ? c.currentTime - self.t0 : 0;
      if (self.loop) t = t % self.res.dur;
      self.dibujaTira(t);
      self.raf = requestAnimationFrame(paso);
    };
    this.raf = requestAnimationFrame(paso);
  };

  /* ------------------------ dibujar ------------------------ */

  function colores(el) {
    var cs = getComputedStyle(el);
    var v = function (n, d) { var x = cs.getPropertyValue(n).trim(); return x || d; };
    return { bg: v('--plot-bg', '#fff'), grid: v('--plot-grid', '#ddd'), axis: v('--plot-axis', '#888'),
      ink: v('--plot-ink', '#333'), acc: v('--accent', '#3f5bd9'), soft: v('--accent-soft', '#dde'), c2: v('--c2', '#d1495b') };
  }
  function prepara(canvas, alto) {
    var w = canvas.clientWidth || 300, dpr = global.devicePixelRatio || 1;
    var h = alto;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    }
    canvas.style.height = h + 'px';
    var g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g: g, w: w, h: h };
  }

  Visor.prototype.dibujaVacio = function () {
    var col = colores(this.el);
    [this.cOnda, this.cEsp].forEach(function (c) {
      var p = prepara(c, 120); p.g.fillStyle = col.bg; p.g.fillRect(0, 0, p.w, p.h);
    });
    var p = prepara(this.cTira, 26); p.g.fillStyle = col.bg; p.g.fillRect(0, 0, p.w, p.h);
  };

  Visor.prototype.dibuja = function () {
    if (!this.res) return;
    var r = this.res, col = colores(this.el);
    /* la onda */
    var p = prepara(this.cOnda, 120), g = p.g;
    g.fillStyle = col.bg; g.fillRect(0, 0, p.w, p.h);
    g.strokeStyle = col.grid; g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, p.h / 2); g.lineTo(p.w, p.h / 2); g.stroke();
    var n = Math.min(r.muestras.length, Math.round(r.sr * this.ventana / 1000));
    g.strokeStyle = col.acc; g.lineWidth = 1.6; g.beginPath();
    var paso = Math.max(1, Math.floor(n / (p.w * 2)));
    for (var i = 0; i < n; i += paso) {
      var x = i / n * p.w, y = p.h / 2 - Math.max(-1.05, Math.min(1.05, r.muestras[i])) * (p.h / 2 - 4);
      if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
    g.fillStyle = col.axis; g.font = '10px ' + (getComputedStyle(this.el).getPropertyValue('--sans') || 'sans-serif');
    g.fillText('+1', 3, 11); g.fillText('−1', 3, p.h - 4);
    if (this.espectrograma) { this.dibujaEspectrograma(); this.dibujaTira(this.sonando ? 0 : -1); return; }
    /* el espectro */
    var mag = SON.espectro(r.muestras);
    var kmax = Math.min(mag.length - 1, Math.floor(this.fmax * mag.n / mag.sr));
    var top = 0;
    for (i = 0; i <= kmax; i++) if (mag[i] > top) top = mag[i];
    p = prepara(this.cEsp, 120); g = p.g;
    g.fillStyle = col.bg; g.fillRect(0, 0, p.w, p.h);
    g.strokeStyle = col.grid; g.lineWidth = 1;
    var cadaHz = this.fmax > 2500 ? 1000 : (this.fmax > 800 ? 500 : 100);
    g.fillStyle = col.axis;
    for (var f = cadaHz; f < this.fmax; f += cadaHz) {
      var xx = f / this.fmax * p.w;
      g.beginPath(); g.moveTo(xx, 0); g.lineTo(xx, p.h); g.stroke();
      g.fillText((f >= 1000 ? (f / 1000) + 'k' : f), xx + 2, p.h - 4);
    }
    if (top > 0) {
      g.fillStyle = col.acc; g.strokeStyle = col.acc;
      var ancho = Math.max(1, p.w / (kmax + 1));
      for (i = 0; i <= kmax; i++) {
        var hh = mag[i] / top * (p.h - 14);
        if (hh < 0.5) continue;
        g.fillRect(i / (kmax + 1) * p.w, p.h - hh, ancho + 0.5, hh);
      }
    }
    this.dibujaTira(this.sonando ? 0 : -1);
  };

  /** El espectro, ventana a ventana, como imagen: tiempo en horizontal,
      frecuencia en vertical, amplitud como brillo del color del acento. */
  Visor.prototype.dibujaEspectrograma = function () {
    var r = this.res, col = colores(this.el);
    var p = prepara(this.cEsp, 120), g = p.g;
    g.fillStyle = col.bg; g.fillRect(0, 0, p.w, p.h);
    var n = 1024, N = r.muestras.length;
    var cols = Math.max(8, Math.min(160, Math.floor(p.w / 3)));
    var filas = 96, kmax = Math.min(n / 2 - 1, Math.floor(this.fmax * n / r.sr));
    var re = new Float64Array(n), im = new Float64Array(n), hann = new Float64Array(n);
    for (var i = 0; i < n; i++) hann[i] = 0.5 - 0.5 * Math.cos(TAU * i / n);
    var mapa = [], top = 1e-6, c, k, f;
    for (c = 0; c < cols; c++) {
      var ini = Math.floor(c * (N - n) / Math.max(1, cols - 1));
      if (ini < 0) ini = 0;
      for (i = 0; i < n; i++) { var s = ini + i < N ? r.muestras[ini + i] : 0; re[i] = s * hann[i]; im[i] = 0; }
      fft(re, im);
      var colum = new Float32Array(filas);
      for (f = 0; f < filas; f++) {
        var k0 = Math.floor(f * kmax / filas), k1 = Math.max(k0 + 1, Math.floor((f + 1) * kmax / filas)), m = 0;
        for (k = k0; k < k1; k++) { var v = Math.sqrt(re[k] * re[k] + im[k] * im[k]); if (v > m) m = v; }
        colum[f] = m; if (m > top) top = m;
      }
      mapa.push(colum);
    }
    var acc = (function (h) {
      var m = /^#([0-9a-f]{6})$/i.exec(h.trim());
      return m ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)] : [63, 91, 217];
    })(col.acc);
    var bgc = (function (h) {
      var m = /^#([0-9a-f]{6})$/i.exec(h.trim());
      return m ? [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)] : [255, 255, 255];
    })(col.bg);
    var img = g.createImageData(cols, filas), d = img.data;
    for (f = 0; f < filas; f++) for (c = 0; c < cols; c++) {
      var a = Math.log(1 + 60 * mapa[c][f] / top) / Math.log(61);     // escala logaritmica
      var o = ((filas - 1 - f) * cols + c) * 4;
      d[o] = Math.round(bgc[0] + (acc[0] - bgc[0]) * a);
      d[o + 1] = Math.round(bgc[1] + (acc[1] - bgc[1]) * a);
      d[o + 2] = Math.round(bgc[2] + (acc[2] - bgc[2]) * a);
      d[o + 3] = 255;
    }
    var tmp = document.createElement('canvas'); tmp.width = cols; tmp.height = filas;
    tmp.getContext('2d').putImageData(img, 0, 0);
    g.imageSmoothingEnabled = false;
    g.drawImage(tmp, 0, 0, p.w, p.h);
    g.fillStyle = col.axis; g.font = '10px sans-serif';
    var cadaHz = this.fmax > 2500 ? 1000 : (this.fmax > 800 ? 500 : 100);
    for (f = cadaHz; f < this.fmax; f += cadaHz) {
      var yy = p.h - f / this.fmax * p.h;
      g.fillRect(0, yy, 6, 1);
      g.fillText((f >= 1000 ? (f / 1000) + 'k' : f), 8, yy + 3);
    }
  };

  Visor.prototype.dibujaTira = function (t) {
    if (!this.res) return;
    var r = this.res, col = colores(this.el);
    var p = prepara(this.cTira, 26), g = p.g;
    g.fillStyle = col.bg; g.fillRect(0, 0, p.w, p.h);
    var N = r.muestras.length, cols = Math.max(1, Math.floor(p.w));
    g.fillStyle = col.acc;
    for (var c = 0; c < cols; c++) {
      var a = Math.floor(c * N / cols), b = Math.floor((c + 1) * N / cols), mx = 0;
      for (var i = a; i < b; i++) { var v = Math.abs(r.muestras[i]); if (v > mx) mx = v; }
      var hh = Math.min(1, mx) * (p.h - 2);
      g.fillRect(c, (p.h - hh) / 2, 1, hh);
    }
    if (t >= 0) {
      g.fillStyle = col.c2;
      g.fillRect(t / r.dur * p.w - 1, 0, 2, p.h);
    }
    g.fillStyle = col.axis; g.font = '9px sans-serif';
    g.fillText('0 s', 2, 9); g.fillText(U.fmt(r.dur, 1) + ' s', p.w - 24, 9);
  };

  W.sinte = function (host, o) { return new Visor(host, o); };
  SON.Visor = Visor;
  global.SON = SON;
})(window);
