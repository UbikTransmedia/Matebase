/* ===================================================================
   Matebase · shader.js
   VISOR DE SHADERS. Un lienzo WebGL, un editor de texto y tres botones.
   Es a la programacion grafica lo que Plot2D es al resto del curso: se
   escribe una vez y lo usan todos los temas del bloque.

   Decisiones que conviene entender antes de tocar nada:

   · SOLO FRAGMENT SHADERS. El vertice es siempre el mismo triangulo que
     tapa la pantalla; el alumno nunca lo ve ni lo necesita. Todo ocurre
     en el fragmento, que es donde esta la idea: cada pixel se pregunta
     de que color es.

   · COMPATIBLE CON SHADERTOY. Mismo preambulo (iResolution, iTime,
     iMouse) y misma firma mainImage(out vec4, in vec2). Asi el alumno
     puede pegar aqui cualquier shader de los cientos de miles que hay
     publicados, y llevarse los suyos alli. El curso deja de ser una isla.

   · CONTEXTO PEREZOSO. El navegador solo aguanta una docena y media de
     contextos WebGL vivos. El contexto se crea cuando el lienzo entra en
     pantalla, y no antes: asi una pagina con seis visores no se ahoga, y
     la auditoria de tests.html -que construye los 108 temas en un
     contenedor oculto- no crea ninguno.

   · SE PARA SOLO. Fuera de pantalla no se pinta. Si el sistema pide menos
     movimiento, arranca en pausa con el primer fotograma dibujado.
   =================================================================== */
(function (global) {
  'use strict';

  /* Rotulos y mensajes de error del editor de shaders: los lee una
     persona y pasan por el diccionario, en frases enteras con huecos.
     El codigo GLSL y sus nombres de funcion no se tocan. */
  function UI(s) { return global.I18N ? I18N.ui(s) : s; }
  function con(s, vals) {
    var t = UI(s);
    for (var k in vals) t = t.split('{' + k + '}').join(vals[k]);
    return t;
  }

  var VERTICE =
    'attribute vec2 vPos;\n' +
    'void main(){ gl_Position = vec4(vPos, 0.0, 1.0); }';

  /* El preambulo va delante del codigo del alumno. Su numero de lineas
     importa: los errores de compilacion vienen numerados sobre el fuente
     completo y hay que restarlo para senalar la linea del editor. */
  var PREAMBULO = [
    '#extension GL_OES_standard_derivatives : enable',
    'precision highp float;',
    'uniform vec3  iResolution;',
    'uniform float iTime;',
    'uniform vec4  iMouse;',
    'uniform float iFrame;',
    // El fotograma anterior, en los visores con memoria (buffer: true). En
    // los demas no se usa, y declararlo siempre deja pegar cualquier shader
    // de Shadertoy que lo nombre sin tocar nada.
    'uniform sampler2D iChannel0;',
    // Los visores con imagen (imagen: true) ponen en el canal 1 una foto que
    // pinta el propio curso, o la camara si el alumno la enciende. El tamano
    // de la imagen de cada canal va en iChannelResolution, como en Shadertoy.
    'uniform sampler2D iChannel1;',
    'uniform vec3  iChannelResolution[4];',
    '#define PI 3.14159265359',
    '#define TAU 6.28318530718'
  ];

  var CIERRE =
    '\nvoid main(){\n' +
    '  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n' +
    '  mainImage(color, gl_FragCoord.xy);\n' +
    '  gl_FragColor = vec4(color.rgb, 1.0);\n' +
    '}\n';

  /* En la pasada de simulacion de un visor con memoria el color no va a la
     pantalla sino al estado, y ahi el cuarto canal es un numero mas: se
     guarda tal cual, como en los buffers de Shadertoy. Forzarlo a 1 dejaba
     el estado con tres canales utiles aunque el tema prometiera cuatro. */
  var CIERRE_ESTADO =
    '\nvoid main(){\n' +
    '  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n' +
    '  mainImage(color, gl_FragCoord.xy);\n' +
    '  gl_FragColor = color;\n' +
    '}\n';

  function fuenteCompleta(codigo, mandos, estado) {
    var pre = PREAMBULO.slice();
    (mandos || []).forEach(function (m) { pre.push('uniform float ' + m.n + ';'); });
    return {
      texto: pre.join('\n') + '\n' + codigo + (estado ? CIERRE_ESTADO : CIERRE),
      saltadas: pre.length + 1
    };
  }

  /* ---------------- contexto auxiliar compartido ----------------
     Uno solo para todo el curso, y para dos cosas que no se ven: comprobar
     que un shader compila (lo usa tests.html) y comparar dos shaders pixel
     a pixel (lo usan los correctores de los ejercicios). */
  var aux = null;
  function auxGL() {
    if (aux !== null) return aux;
    var c = document.createElement('canvas');
    c.width = 64; c.height = 64;
    aux = c.getContext('webgl', { preserveDrawingBuffer: true }) ||
          c.getContext('experimental-webgl', { preserveDrawingBuffer: true }) || false;
    if (aux) aux.getExtension('OES_standard_derivatives');
    return aux;
  }

  /** Compila y devuelve {ok, errores:[{linea, msg}]}. No pinta nada. */
  function compila(gl, codigo, mandos, estado) {
    var f = fuenteCompleta(codigo, mandos, estado);
    var sh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(sh, f.texto);
    gl.compileShader(sh);
    if (gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      return { ok: true, shader: sh, errores: [] };
    }
    var log = gl.getShaderInfoLog(sh) || '';
    gl.deleteShader(sh);
    var errores = [];
    log.split('\n').forEach(function (l) {
      var m = /^\s*(ERROR|WARNING):\s*\d+:(\d+):\s*(.*)$/.exec(l);
      if (m) errores.push({ linea: Math.max(1, (+m[2]) - f.saltadas + 1), msg: m[3].trim() });
      else if (l.trim() && l.charCodeAt(0) !== 0) errores.push({ linea: 0, msg: l.trim() });
    });
    if (!errores.length) errores.push({ linea: 0, msg: UI('no compila') });
    return { ok: false, errores: errores };
  }

  /** ¿Compila este código? Para las pruebas del curso. */
  var glslCompila = function (codigo, mandos) {
    var gl = auxGL();
    if (!gl) return { ok: true, errores: [], sinWebgl: true };
    var r = compila(gl, codigo, mandos);
    if (r.shader) gl.deleteShader(r.shader);
    return r;
  };

  /* ---------------- la foto del curso ----------------
     Los filtros de imagen necesitan una imagen, y el curso no puede traer
     archivos ni pedirlos por la red. Se pinta una con el Canvas 2D: un paisaje
     con cielo, sol, montañas, un lago y una casa, y encima una carta de colores
     y unas letras, que es donde se ve si un filtro respeta los tonos y los
     bordes. Se pinta una sola vez; cada contexto WebGL la sube a su textura. */
  var FOTO = null;
  function foto() {
    if (FOTO) return FOTO;
    /* 2:1, como casi todos los visores, y lo importante en la franja central:
       al cubrir un lienzo mas apaisado se recorta por arriba y por abajo. */
    var an = 800, al = 400, x, k;
    var c = document.createElement('canvas');
    c.width = an; c.height = al;
    FOTO = c;
    var g = c.getContext('2d');
    if (!g) return c;
    var semilla = 7;
    function azar() { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647; }

    // cielo, sol y nubes
    var cielo = g.createLinearGradient(0, 0, 0, 260);
    cielo.addColorStop(0, '#1f4f96'); cielo.addColorStop(0.55, '#6fa6dc'); cielo.addColorStop(1, '#f4c592');
    g.fillStyle = cielo; g.fillRect(0, 0, an, 270);
    var halo = g.createRadialGradient(330, 105, 8, 330, 105, 105);
    halo.addColorStop(0, 'rgba(255,250,225,1)'); halo.addColorStop(0.22, 'rgba(255,236,170,0.9)');
    halo.addColorStop(1, 'rgba(255,220,150,0)');
    g.fillStyle = halo; g.beginPath(); g.arc(330, 105, 105, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.78)';
    [[120, 58, 60, 16], [166, 50, 42, 13], [470, 78, 70, 15], [690, 38, 54, 12]].forEach(function (n) {
      g.beginPath(); g.ellipse(n[0], n[1], n[2], n[3], 0, 0, Math.PI * 2); g.fill();
    });

    // dos sierras: la lejana, azulada por el aire; la cercana, verde
    function sierra(base, amp, frec, fase, color) {
      g.fillStyle = color; g.beginPath(); g.moveTo(0, 280);
      for (var xx = 0; xx <= an; xx += 8) {
        g.lineTo(xx, base - amp * (0.6 * Math.abs(Math.sin(xx * frec + fase)) +
          0.4 * Math.abs(Math.sin(xx * frec * 2.7 + fase * 1.9))));
      }
      g.lineTo(an, 280); g.closePath(); g.fill();
    }
    sierra(218, 96, 0.009, 0.6, '#7d93b8');
    sierra(246, 60, 0.014, 2.1, '#4f7156');

    // casa y pinos en la orilla
    g.fillStyle = '#e8dcc2'; g.fillRect(70, 206, 74, 56);
    g.fillStyle = '#b3432f'; g.beginPath(); g.moveTo(62, 210); g.lineTo(107, 172); g.lineTo(152, 210); g.closePath(); g.fill();
    g.fillStyle = '#5a3b2a'; g.fillRect(98, 232, 16, 30);
    g.fillStyle = '#ffd66b'; g.fillRect(78, 220, 14, 12); g.fillRect(122, 220, 14, 12);
    function pino(px, py, h) {
      g.fillStyle = '#4a3322'; g.fillRect(px - 2, py - h * 0.2, 4, h * 0.2);
      g.fillStyle = '#1f4a2c';
      for (var i = 0; i < 3; i++) {
        g.beginPath();
        g.moveTo(px - h * (0.32 - i * 0.07), py - h * (0.18 + i * 0.22));
        g.lineTo(px, py - h * (0.6 + i * 0.2));
        g.lineTo(px + h * (0.32 - i * 0.07), py - h * (0.18 + i * 0.22));
        g.closePath(); g.fill();
      }
    }
    [[26, 80], [48, 62], [180, 55], [470, 70], [494, 52]].forEach(function (t) { pino(t[0], 262, t[1]); });

    // el lago, con el reflejo del sol y el de la casa
    var agua = g.createLinearGradient(0, 262, 0, 334);
    agua.addColorStop(0, '#9bb9cf'); agua.addColorStop(1, '#2c5673');
    g.fillStyle = agua; g.fillRect(0, 262, an, 72);
    g.globalAlpha = 0.28; g.fillStyle = '#e8dcc2'; g.fillRect(70, 264, 74, 26); g.globalAlpha = 1;
    for (k = 0; k < 14; k++) {
      g.fillStyle = 'rgba(255,240,200,' + (0.55 - k * 0.035).toFixed(3) + ')';
      g.fillRect(306 + azar() * 12 - k * 0.5, 266 + k * 5, 38 - k * 1.2 + azar() * 10, 2);
    }

    // el prado, con briznas
    var prado = g.createLinearGradient(0, 326, 0, al);
    prado.addColorStop(0, '#5f8f3e'); prado.addColorStop(1, '#2f5a26');
    g.fillStyle = prado; g.beginPath(); g.moveTo(0, 334);
    for (x = 0; x <= an; x += 20) g.lineTo(x, 327 + 6 * Math.sin(x * 0.02));
    g.lineTo(an, al); g.lineTo(0, al); g.closePath(); g.fill();
    g.lineWidth = 1;
    for (k = 0; k < 360; k++) {
      var hx = azar() * an, hy = 336 + azar() * 62;
      g.strokeStyle = azar() < 0.5 ? 'rgba(30,60,20,0.55)' : 'rgba(160,200,95,0.5)';
      g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + (azar() - 0.5) * 4, hy - 4 - azar() * 6); g.stroke();
    }

    // un cartel en la orilla: letras, carta de colores y escala de grises, que
    // es donde se ve si un filtro respeta los bordes y los tonos
    g.fillStyle = '#5a3b2a'; g.fillRect(566, 226, 8, 44); g.fillRect(726, 226, 8, 44);
    g.fillStyle = '#26303a'; g.fillRect(534, 118, 232, 112);
    g.fillStyle = '#f4f1ea'; g.fillRect(540, 124, 220, 100);
    g.font = 'bold 34px "Trebuchet MS", Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    g.fillStyle = '#1c2530'; g.fillText('MATEBASE', 650, 160);
    ['#d62728', '#ff7f0e', '#f2d024', '#2ca02c', '#1f77b4', '#9467bd'].forEach(function (t, i) {
      g.fillStyle = t; g.fillRect(548 + i * 34.5, 170, 32, 22);
    });
    for (k = 0; k < 6; k++) {
      var v = Math.round(k * 255 / 5);
      g.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; g.fillRect(548 + k * 34.5, 196, 32, 20);
    }
    return c;
  }

  /** Sube a una textura una imagen, un canvas o un video. Se voltea en vertical
      para que uv = (0, 0) sea la esquina de abajo a la izquierda, como
      fragCoord y como en Shadertoy. Usa la unidad de textura activa. */
  function subeImagen(gl, tex, fuente) {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fuente);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }

  function texturaImagen(gl, fuente) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    subeImagen(gl, t, fuente);
    return t;
  }

  /* ---------------- pintar en el contexto auxiliar ---------------- */
  function pintaEnAux(codigo, mandos, valores, tam, t) {
    var gl = auxGL();
    if (!gl) return null;
    var c = gl.canvas;
    c.width = tam; c.height = tam;
    var r = compila(gl, codigo, mandos);
    if (!r.ok) return null;
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VERTICE); gl.compileShader(vs);
    var pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, r.shader);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'vPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(gl.getUniformLocation(pr, 'iResolution'), tam, tam, 1);
    gl.uniform1f(gl.getUniformLocation(pr, 'iTime'), t || 0);
    gl.uniform1f(gl.getUniformLocation(pr, 'iFrame'), 0);
    gl.uniform4f(gl.getUniformLocation(pr, 'iMouse'), 0, 0, 0, 0);
    // La foto va siempre en el canal 1: asi se auditan y se corrigen los
    // filtros de imagen, que sin imagen pintarian un negro liso.
    gl.activeTexture(gl.TEXTURE1);
    if (!gl.__foto) gl.__foto = texturaImagen(gl, foto());
    gl.bindTexture(gl.TEXTURE_2D, gl.__foto);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    var uc1 = gl.getUniformLocation(pr, 'iChannel1');
    if (uc1) gl.uniform1i(uc1, 1);
    var ucr = gl.getUniformLocation(pr, 'iChannelResolution[1]');
    if (ucr) gl.uniform3f(ucr, FOTO.width, FOTO.height, 1);
    (mandos || []).forEach(function (m) {
      var u = gl.getUniformLocation(pr, m.n);
      if (u) gl.uniform1f(u, (valores && valores[m.n] !== undefined) ? valores[m.n] : m.value);
    });
    gl.viewport(0, 0, tam, tam);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    var px = new Uint8Array(tam * tam * 4);
    gl.readPixels(0, 0, tam, tam, gl.RGBA, gl.UNSIGNED_BYTE, px);
    gl.deleteProgram(pr); gl.deleteShader(vs); gl.deleteShader(r.shader); gl.deleteBuffer(buf);
    return px;
  }

  /** ¿Pintan lo mismo dos shaders? Es el corrector de los ejercicios:
      acepta cualquier solución equivalente, la haya escrito como la haya
      escrito, porque compara el resultado y no el texto. */
  function iguales(codigoA, codigoB, o) {
    o = o || {};
    var tam = o.tam || 48, tol = o.tol === undefined ? 10 : o.tol;
    var a = pintaEnAux(codigoA, o.mandos, o.valores, tam, o.t);
    var b = pintaEnAux(codigoB, o.mandos, o.valores, tam, o.t);
    if (!a) return { ok: false, motivo: UI('la respuesta no compila') };
    if (!b) return { ok: false, motivo: UI('la referencia no compila') };
    var suma = 0, n = tam * tam;
    for (var i = 0; i < n; i++) {
      var k = i * 4;
      suma += Math.abs(a[k] - b[k]) + Math.abs(a[k + 1] - b[k + 1]) + Math.abs(a[k + 2] - b[k + 2]);
    }
    var media = suma / (n * 3);
    return { ok: media <= tol, distancia: media };
  }


  /* ================== coloreado del codigo ==================
     Un lexico de GLSL suficientemente bueno para leer, que no es lo mismo
     que un compilador: no valida nada, solo reparte cada trozo en uno de
     ocho papeles. Se ejecuta en cada pulsacion de tecla, asi que es una
     sola pasada con una expresion regular y nada mas. */

  var LEXICO = {};
  (function () {
    var grupos = {
      key: 'if else for while do break continue return discard void struct ' +
           'const uniform attribute varying in out inout precision highp ' +
           'mediump lowp invariant true false',
      typ: 'float int bool vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 ' +
           'bvec4 mat2 mat3 mat4 sampler2D samplerCube',
      fun: 'radians degrees sin cos tan asin acos atan sinh cosh tanh pow ' +
           'exp log exp2 log2 sqrt inversesqrt abs sign floor ceil fract ' +
           'mod min max clamp mix step smoothstep length distance dot cross ' +
           'normalize faceforward reflect refract matrixCompMult lessThan ' +
           'lessThanEqual greaterThan greaterThanEqual equal notEqual any ' +
           'all not texture2D textureCube dFdx dFdy fwidth',
      uni: 'iResolution iTime iMouse iFrame iChannel0 iChannel1 iChannelResolution PI TAU ' +
           'gl_FragCoord gl_FragColor ' +
           'gl_Position gl_PointSize gl_PointCoord gl_FrontFacing'
    };
    Object.keys(grupos).forEach(function (clase) {
      grupos[clase].split(' ').forEach(function (w) { if (w) LEXICO[w] = clase; });
    });
  })();

  /* El orden de las alternativas importa: los comentarios van delante para
     que una barra de division no se coma un bloque, y los numeros delante de
     los identificadores para que 2.0 no se parta en dos. */
  var RE_TOK = /\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\n]*|#[A-Za-z_]+|\b\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+(?:[eE][-+]?\d+)?|[A-Za-z_][A-Za-z0-9_]*|[^\sA-Za-z0-9_]+|\s+/g;

  function escapa(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** El texto de un shader convertido en HTML con un <span> por trozo.
      `extra` es la lista de mandos: sus nombres se pintan como lo que son,
      valores que llegan de fuera, para que el alumno los distinga de sus
      propias variables de un vistazo. */
  function pintaGLSL(texto, extra) {
    var propios = {};
    (extra || []).forEach(function (m) { propios[m.n || m] = 1; });

    var out = '', m, t, c;
    RE_TOK.lastIndex = 0;
    while ((m = RE_TOK.exec(String(texto))) !== null) {
      t = m[0];
      c = null;
      if (t.charAt(0) === '#') c = 'pre';
      else if (t.slice(0, 2) === '//' || t.slice(0, 2) === '/*') c = 'com';
      else if (/^\.?\d/.test(t)) c = 'num';   // el punto suelto de p.xy no lo es
      else if (/^[A-Za-z_]/.test(t)) {
        if (propios[t]) c = 'uni';
        else if (LEXICO[t]) c = LEXICO[t];
        else {
          // un identificador con un parentesis detras es una llamada
          var resto = RE_TOK.lastIndex;
          var sig = /^\s*\(/.test(String(texto).slice(resto));
          c = sig ? 'fun' : null;
        }
      } else if (/^\s/.test(t)) c = null;
      else c = 'pun';

      out += c ? '<span class="cod-' + c + '">' + escapa(t) + '</span>' : escapa(t);
    }
    return out;
  }

  /** Colorea los recuadros de codigo de los enunciados. Recorre los nodos de
      texto y deja en paz los elementos que ya haya dentro -el <strong> que
      marca el hueco que el alumno tiene que rellenar, por ejemplo-, que es lo
      que permite colorear sin romper el enunciado. */
  function pintaBloques(raiz) {
    if (!raiz || !raiz.querySelectorAll) return;
    [].forEach.call(raiz.querySelectorAll('.shd__mini'), function (pre) {
      if (pre.getAttribute('data-pintado')) return;
      pre.setAttribute('data-pintado', '1');
      var textos = [];
      (function anda(n) {
        for (var i = 0; i < n.childNodes.length; i++) {
          var h = n.childNodes[i];
          if (h.nodeType === 3) textos.push(h);
          else if (h.nodeType === 1) anda(h);
        }
      })(pre);
      textos.forEach(function (nodo) {
        var html = pintaGLSL(nodo.data, null);
        if (html === escapa(nodo.data)) return;      // nada que colorear
        var caja = document.createElement('span');
        caja.innerHTML = html;
        nodo.parentNode.replaceChild(caja, nodo);
      });
    });
  }

  /* ========================= el visor ========================= */

  function Visor(host, o) {
    o = o || {};
    var self = this;
    this.o = o;
    this.original = (o.codigo || '').replace(/^\n/, '');
    this.mandos = o.mandos || [];
    this.valores = {};
    this.mandos.forEach(function (m) { self.valores[m.n] = m.value; });
    this.alto = o.alto || 280;
    this.t0 = 0; this.acumulado = 0; this.frame = 0;
    this.corriendo = false; this.gl = null; this.prog = null;
    this.raton = [0, 0, 0, 0];
    /* Con memoria: el shader lee en iChannel0 lo que pintó en el fotograma
       anterior. Es lo que convierte una formula en una simulacion -un
       automata celular, una reaccion quimica-, y es literalmente un bucle
       de realimentacion. `escala` reduce la resolucion del estado para que
       la simulacion vaya ligera; `pasos` da varios pasos por fotograma, y
       `vista` es una funcion GLSL vec3 vista(vec4 estado) que decide como
       se pinta el estado en pantalla. */
    this.buffer = !!o.buffer;
    this.escala = o.escala || 0.5;
    this.pasos = Math.max(1, o.pasos || 1);
    this.tex = [null, null]; this.fb = [null, null];
    /* Con imagen: en iChannel1 hay una foto, o la camara si se enciende. */
    this.imagen = !!o.imagen;
    this.texImg = null; this.cam = null;
    this.build(host);
  }

  Visor.prototype.build = function (host) {
    var self = this, o = this.o;

    this.el = U.el('div.shd');
    /* Un asa para las pruebas: tests.html recorre los visores de cada tema
       y compila su codigo original, para que un shader roto salga alli y no
       en la cara del alumno. */
    this.el.__shd = this;

    /* --- el lienzo --- */
    this.stage = U.el('div.shd__stage');
    this.canvas = U.el('canvas.shd__canvas', {
      role: 'img',
      'aria-label': o.aria || UI('Resultado del shader. Cada píxel de este dibujo lo calcula el código de abajo.')
    });
    this.stage.appendChild(this.canvas);
    this.aviso = U.el('div.shd__aviso', { role: 'status', 'aria-live': 'polite' });
    this.stage.appendChild(this.aviso);
    this.el.appendChild(this.stage);

    /* --- los mandos, si los hay --- */
    if (this.mandos.length) {
      var fila = W.row(this.el);
      this.sliders = {};
      this.mandos.forEach(function (m) {
        self.sliders[m.n] = W.slider(fila, {
          label: m.label || m.n, min: m.min, max: m.max, step: m.step,
          value: m.value, dec: m.dec,
          on: function (v) { self.valores[m.n] = v; if (!self.corriendo) self.pinta(); }
        });
      });
    }

    /* --- el editor --- */
    if (o.editable !== false) {
      var idEd = 'shd' + (Visor.n = (Visor.n || 0) + 1);
      this.el.appendChild(U.el('label.shd__lab', {
        'for': idEd,
        html: UI('Código del shader') + ' &nbsp;<span class="shd__pista">' +
          UI('se recompila solo al escribir') + '</span>'
      }));
      /* Dos capas: debajo un <pre> con el codigo coloreado y encima el
         textarea con la letra transparente y el cursor visible. Es la unica
         manera de tener colores en un campo editable sin traerse un editor
         entero, y funciona mientras las dos midan exactamente igual. */
      this.caja = U.el('div.shd__caja');
      this.capa = U.el('pre.shd__pinta', { 'aria-hidden': 'true' });
      this.caja.appendChild(this.capa);

      this.ed = U.el('textarea.shd__ed', {
        id: idEd, spellcheck: 'false', autocapitalize: 'off',
        autocorrect: 'off', autocomplete: 'off', wrap: 'off',
        rows: String(Math.max(6, Math.min(22, this.original.split('\n').length + 1)))
      });
      this.ed.value = this.original;
      this.caja.appendChild(this.ed);
      this.el.appendChild(this.caja);

      var espera = null;
      this.ed.addEventListener('input', function () {
        self.repintaCodigo();                 // el color, al momento
        clearTimeout(espera);
        espera = setTimeout(function () {     // compilar, con calma
          self.recompila(); self.guarda();
        }, 420);
      });
      /* La capa de abajo no tiene barras: se la lleva a rastras. */
      this.ed.addEventListener('scroll', function () {
        self.capa.scrollTop = self.ed.scrollTop;
        self.capa.scrollLeft = self.ed.scrollLeft;
      });
      /* El editor se puede estirar con el raton, y al estirarlo cambia cuanto
         recorrido le sobra: hay que volver a medir. */
      if (global.ResizeObserver) {
        this.ro = new ResizeObserver(function () { self.ajustaCapa(); });
        this.ro.observe(this.ed);
      }
    }

    this.err = U.el('div.shd__err', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(this.err);

    /* --- botones --- */
    this.bPausa = U.el('button.btn', { type: 'button', html: '&#10074;&#10074; ' + UI('Pausa') });
    this.bReset = U.el('button.btn', { type: 'button', html: '&#8635; ' + UI('Volver al original') });
    this.bPausa.addEventListener('click', function () { self.alterna(); });
    this.bReset.addEventListener('click', function () { self.reinicia(); });
    var pie = U.el('div.shd__pie', null, [this.bPausa, this.bReset]);
    if (o.editable !== false) {
      this.bYa = U.el('button.btn.btn--main', { type: 'button', text: UI('Ejecutar') });
      this.bYa.addEventListener('click', function () { self.recompila(); self.guarda(); });
      pie.insertBefore(this.bYa, pie.firstChild);
    }
    /* La camara solo se pide al pulsar, y su imagen no sale del ordenador:
       se pinta en la tarjeta grafica y ahi se queda. */
    if (this.imagen && global.navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.bCam = U.el('button.btn', {
        type: 'button', text: UI('Usar la cámara'),
        title: UI('Aplicar el shader a la imagen de tu cámara en lugar de a la foto')
      });
      this.bCam.addEventListener('click', function () {
        if (self.cam) self.apagaCamara(); else self.enciendeCamara();
      });
      pie.appendChild(this.bCam);
    }
    if (this.imagen) {
      this.camEstado = U.el('span.shd__cam', { role: 'status', 'aria-live': 'polite' });
      pie.appendChild(this.camEstado);
    }
    this.el.appendChild(pie);

    if (o.nota) W.hint(this.el, o.nota);

    host.appendChild(this.el);

    /* --- raton, a la manera de Shadertoy --- */
    this.canvas.addEventListener('pointerdown', function (e) { self.pointer(e, true); });
    this.canvas.addEventListener('pointermove', function (e) { if (e.buttons) self.pointer(e, false); });

    /* --- recuperar lo que el alumno estaba escribiendo --- */
    if (o.id && this.ed) {
      var g = Progress.pref('shd:' + o.id);
      if (g) this.ed.value = g;
    }
    this.repintaCodigo();

    /* --- el contexto no se crea hasta que se ve --- */
    if (global.IntersectionObserver) {
      this.io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) self.despierta();
          else { self.duerme(); self.apagaCamara(); }     // sin mirar, sin camara
        });
      }, { rootMargin: '120px' });
      this.io.observe(this.stage);
    } else {
      this.despierta();
    }
  };

  /** Rehace la capa coloreada a partir de lo que hay escrito. El salto de
      linea del final es necesario: sin el, un <pre> se come la ultima linea
      vacia y el texto se descuadra del cursor al llegar abajo. */
  Visor.prototype.repintaCodigo = function () {
    if (!this.capa || !this.ed) return;
    this.capa.innerHTML = pintaGLSL(this.ed.value, this.mandos) + '\n';
    this.ajustaCapa();
    this.capa.scrollTop = this.ed.scrollTop;
    this.capa.scrollLeft = this.ed.scrollLeft;
  };

  /** El textarea reserva sitio para su barra de desplazamiento horizontal y la
      capa de color no, asi que la capa tiene menos recorrido y se queda corta
      justo al llegar al final del codigo: media linea de desfase donde mas se
      nota. En vez de suponer cuanto ocupa esa barra -que depende del navegador
      y del sistema-, se mide la diferencia de recorrido y se compensa con
      relleno por abajo, que es lo unico que no mueve ni una letra de sitio. */
  Visor.prototype.ajustaCapa = function () {
    if (!this.capa || !this.ed) return;
    this.capa.style.paddingBottom = '';
    var falta = (this.ed.scrollHeight - this.ed.clientHeight) -
                (this.capa.scrollHeight - this.capa.clientHeight);
    if (falta > 0) {
      var base = parseFloat(getComputedStyle(this.capa).paddingBottom) || 0;
      this.capa.style.paddingBottom = (base + falta) + 'px';
    }
  };

  Visor.prototype.pointer = function (e, nuevo) {
    var r = this.canvas.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width * this.W;
    var y = (1 - (e.clientY - r.top) / r.height) * this.H;
    this.raton[0] = x; this.raton[1] = y;
    if (nuevo) { this.raton[2] = x; this.raton[3] = y; }
    if (!this.corriendo) this.pinta();
  };

  Visor.prototype.guarda = function () {
    if (this.o.id && this.ed) Progress.pref('shd:' + this.o.id, this.ed.value);
  };

  Visor.prototype.codigo = function () {
    return this.ed ? this.ed.value : this.original;
  };

  /* ---------------- ciclo de vida ---------------- */

  Visor.prototype.despierta = function () {
    if (this.gl === null) this.arranca();
    if (this.gl === false) return;
    if (!this.pausadoPorMano) this.play();
  };

  Visor.prototype.duerme = function () {
    this.corriendo = false;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
  };

  Visor.prototype.arranca = function () {
    var gl = this.canvas.getContext('webgl', { antialias: false, alpha: false }) ||
             this.canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
    if (gl) gl.getExtension('OES_standard_derivatives');
    if (!gl) {
      this.gl = false;
      this.aviso.textContent = UI('Este navegador no tiene WebGL, así que no puede mostrar shaders. ' +
        'El código de abajo se puede leer igual.');
      this.aviso.classList.add('is-on');
      this.el.classList.add('shd--sinwebgl');
      return;
    }
    this.gl = gl;
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VERTICE); gl.compileShader(vs);
    this.vs = vs;
    this.buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    if (this.buffer) this.preparaBuffer();
    if (this.imagen) {
      gl.activeTexture(gl.TEXTURE1);
      this.texImg = texturaImagen(gl, foto());
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      this.imgW = FOTO.width; this.imgH = FOTO.height;
    }

    var self = this;
    this._resize = function () { self.mide(); };
    if (global.ResizeObserver) {
      this.ro = new ResizeObserver(this._resize);
      this.ro.observe(this.stage);
    }
    this.mide();
    this.recompila();

    /* Si el sistema pide menos movimiento, se muestra el primer fotograma
       y ahí se queda: el alumno decide si lo pone en marcha. */
    if (U.pocoMovimiento()) { this.pausadoPorMano = true; this.pinta(); this.pintaBoton(); }
  };

  Visor.prototype.mide = function () {
    if (!this.gl) return;
    var dpr = Math.min(global.devicePixelRatio || 1, 1.6);   // tope: son muchos píxeles
    var w = this.stage.clientWidth || 560;
    this.W = Math.round(w * dpr);
    this.H = Math.round(this.alto * dpr);
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.canvas.style.height = this.alto + 'px';
    this.gl.viewport(0, 0, this.W, this.H);
    if (this.buffer && this.progVista) this.texturas();
    if (!this.corriendo) this.pinta();
  };

  /* ---------------- el visor con memoria ---------------- */

  Visor.prototype.usa = function (pr) {
    var gl = this.gl;
    gl.useProgram(pr);
    var loc = gl.getAttribLocation(pr, 'vPos');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  };

  /** ¿Se puede pintar en una textura de este tipo de numero? */
  Visor.prototype.pruebaTipo = function (tipo) {
    var gl = this.gl;
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, tipo, null);
    var f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(f);
    gl.deleteTexture(t);
    return ok;
  };

  Visor.prototype.preparaBuffer = function () {
    var gl = this.gl;
    /* Coma flotante si se puede: con 256 niveles por canal una simulacion
       quimica se estanca en cuanto los cambios son mas finos que un nivel.
       Si no hay, se trabaja con bytes y el shader lo nota, pero funciona. */
    this.tipoTex = gl.UNSIGNED_BYTE;
    this.filtro = gl.LINEAR;
    if (gl.getExtension('OES_texture_float') && this.pruebaTipo(gl.FLOAT)) {
      this.tipoTex = gl.FLOAT;
      if (!gl.getExtension('OES_texture_float_linear')) this.filtro = gl.NEAREST;
    } else {
      var half = gl.getExtension('OES_texture_half_float');
      if (half && this.pruebaTipo(half.HALF_FLOAT_OES)) {
        this.tipoTex = half.HALF_FLOAT_OES;
        if (!gl.getExtension('OES_texture_half_float_linear')) this.filtro = gl.NEAREST;
      }
    }
    var fuente = 'precision highp float;\nuniform sampler2D uTex;\nuniform vec2 uRes;\n' +
      (this.o.vista || 'vec3 vista(vec4 s) { return s.rgb; }') +
      '\nvoid main(){ gl_FragColor = vec4(vista(texture2D(uTex, gl_FragCoord.xy / uRes)), 1.0); }';
    var sh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(sh, fuente);
    gl.compileShader(sh);
    var pr = gl.createProgram();
    gl.attachShader(pr, this.vs);
    gl.attachShader(pr, sh);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      this.muestraErrores([{ linea: 0, msg: con('la vista no compila: {m}', { m: gl.getShaderInfoLog(sh) || '' }) }]);
      return;
    }
    this.progVista = pr;
    this.uVista = { tex: gl.getUniformLocation(pr, 'uTex'), res: gl.getUniformLocation(pr, 'uRes') };
  };

  /** Las dos texturas entre las que rebota el estado. */
  Visor.prototype.texturas = function () {
    var gl = this.gl;
    var tw = Math.max(8, Math.round(this.W * this.escala));
    var th = Math.max(8, Math.round(this.H * this.escala));
    if (this.tex[0] && this.tw === tw && this.th === th) return;
    this.tw = tw; this.th = th;
    for (var i = 0; i < 2; i++) {
      if (this.tex[i]) gl.deleteTexture(this.tex[i]);
      if (this.fb[i]) gl.deleteFramebuffer(this.fb[i]);
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filtro);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filtro);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, this.tipoTex, null);
      var f = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      this.tex[i] = t; this.fb[i] = f;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.frame = 0;        // textura nueva, estado nuevo: el shader vuelve a sembrar
  };

  Visor.prototype.uniformes = function (w, h, esc) {
    var gl = this.gl, self = this;
    if (this.u.res) gl.uniform3f(this.u.res, w, h, 1);
    if (this.u.t) gl.uniform1f(this.u.t, this.tiempo());
    if (this.u.f) gl.uniform1f(this.u.f, this.frame);
    if (this.u.m) gl.uniform4f(this.u.m, this.raton[0] * esc, this.raton[1] * esc, this.raton[2] * esc, this.raton[3] * esc);
    if (this.u.ch) gl.uniform1i(this.u.ch, 0);
    if (this.u.cr0) gl.uniform3f(this.u.cr0, this.tw, this.th, 1);
    this.canalImagen();
    this.mandos.forEach(function (m) {
      if (self.um[m.n]) gl.uniform1f(self.um[m.n], self.valores[m.n]);
    });
  };

  Visor.prototype.pintaBuffer = function () {
    var gl = this.gl;
    if (!this.tex[0]) this.texturas();
    this.actualizaCamara();
    this.usa(this.prog);
    for (var k = 0; k < this.pasos; k++) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb[1]);
      gl.viewport(0, 0, this.tw, this.th);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.tex[0]);
      this.uniformes(this.tw, this.th, this.escala);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      var t = this.tex[0]; this.tex[0] = this.tex[1]; this.tex[1] = t;
      var f = this.fb[0]; this.fb[0] = this.fb[1]; this.fb[1] = f;
      this.frame++;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.W, this.H);
    this.usa(this.progVista);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex[0]);
    gl.uniform1i(this.uVista.tex, 0);
    gl.uniform2f(this.uVista.res, this.W, this.H);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  Visor.prototype.recompila = function () {
    var gl = this.gl;
    if (!gl) return;
    var r = compila(gl, this.codigo(), this.mandos, this.buffer);
    if (!r.ok) {
      this.muestraErrores(r.errores);
      return false;
    }
    var pr = gl.createProgram();
    gl.attachShader(pr, this.vs);
    gl.attachShader(pr, r.shader);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      this.muestraErrores([{ linea: 0, msg: gl.getProgramInfoLog(pr) || UI('no enlaza') }]);
      return false;
    }
    if (this.prog) gl.deleteProgram(this.prog);
    gl.deleteShader(r.shader);
    this.prog = pr;
    gl.useProgram(pr);
    var loc = gl.getAttribLocation(pr, 'vPos');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {
      res: gl.getUniformLocation(pr, 'iResolution'),
      t: gl.getUniformLocation(pr, 'iTime'),
      m: gl.getUniformLocation(pr, 'iMouse'),
      f: gl.getUniformLocation(pr, 'iFrame'),
      ch: gl.getUniformLocation(pr, 'iChannel0'),
      ch1: gl.getUniformLocation(pr, 'iChannel1'),
      cr0: gl.getUniformLocation(pr, 'iChannelResolution[0]'),
      cr1: gl.getUniformLocation(pr, 'iChannelResolution[1]')
    };
    var self = this;
    this.um = {};
    this.mandos.forEach(function (m) { self.um[m.n] = gl.getUniformLocation(pr, m.n); });
    this.sinErrores();
    if (!this.corriendo && !this.pausadoPorMano) this.play(); else this.pinta();
    return true;
  };

  Visor.prototype.muestraErrores = function (errs) {
    var self = this;
    this.err.className = 'shd__err is-mal';
    this.err.innerHTML = errs.slice(0, 4).map(function (e) {
      return '<span class="shd__ln">' + (e.linea ? con('línea {n}', { n: e.linea }) : UI('shader')) + '</span> ' +
        U.escape(e.msg);
    }).join('<br>');
    this.el.classList.add('shd--roto');
  };

  Visor.prototype.sinErrores = function () {
    this.err.className = 'shd__err is-bien';
    this.err.textContent = UI('Compila.');
    this.el.classList.remove('shd--roto');
  };

  /* ---------------- la imagen y la camara ---------------- */

  /** Deja la imagen en la unidad 1 para el programa en uso. */
  Visor.prototype.canalImagen = function () {
    var gl = this.gl;
    if (!this.imagen || !this.texImg || !this.u) return;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texImg);
    gl.activeTexture(gl.TEXTURE0);
    if (this.u.ch1) gl.uniform1i(this.u.ch1, 1);
    if (this.u.cr1) gl.uniform3f(this.u.cr1, this.imgW, this.imgH, 1);
  };

  /** Copia el fotograma de la camara en la textura de la imagen, dado la
      vuelta como un espejo, que es como uno espera verse. */
  Visor.prototype.actualizaCamara = function () {
    var cam = this.cam, gl = this.gl;
    if (!cam || !gl || !cam.video || cam.video.readyState < 2) return;
    if (!this.el.isConnected) { this.apagaCamara(); return; }
    var vw = cam.video.videoWidth, vh = cam.video.videoHeight;
    if (!vw || !vh) return;
    var an = Math.min(640, vw), al = Math.round(an * vh / vw);
    if (cam.lienzo.width !== an || cam.lienzo.height !== al) { cam.lienzo.width = an; cam.lienzo.height = al; }
    cam.ctx.save();
    cam.ctx.translate(an, 0); cam.ctx.scale(-1, 1);
    cam.ctx.drawImage(cam.video, 0, 0, an, al);
    cam.ctx.restore();
    gl.activeTexture(gl.TEXTURE1);
    subeImagen(gl, this.texImg, cam.lienzo);
    gl.activeTexture(gl.TEXTURE0);
    this.imgW = an; this.imgH = al;
  };

  Visor.prototype.estadoCamara = function (msg) {
    if (this.camEstado) this.camEstado.textContent = msg;
  };

  Visor.prototype.enciendeCamara = function () {
    var self = this;
    if (this.cam || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    this.estadoCamara(UI('Pidiendo permiso para usar la cámara…'));
    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
      .then(function (flujo) {
        if (!self.el.isConnected || self.gl === false) {
          flujo.getTracks().forEach(function (t) { t.stop(); });
          return;
        }
        var video = document.createElement('video');
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.srcObject = flujo;
        var pr = video.play();
        if (pr && pr.catch) pr.catch(function () { });
        var lienzo = document.createElement('canvas');
        self.cam = { flujo: flujo, video: video, lienzo: lienzo, ctx: lienzo.getContext('2d') };
        if (self.bCam) self.bCam.textContent = UI('Volver a la foto');
        self.estadoCamara(UI('Cámara encendida. La imagen no sale de tu ordenador.'));
        // con la camara encendida lo natural es verla moverse
        self.pausadoPorMano = false;
        if (!self.corriendo) self.play();
        self.pintaBoton();
      })
      .catch(function (e) {
        var denegado = e && (e.name === 'NotAllowedError' || e.name === 'SecurityError');
        self.estadoCamara(UI(denegado
          ? 'No se ha podido abrir la cámara: el navegador no ha dado permiso. Se sigue usando la foto.'
          : 'No se ha podido abrir la cámara. Se sigue usando la foto.'));
      });
  };

  Visor.prototype.apagaCamara = function () {
    if (!this.cam) return;
    this.cam.flujo.getTracks().forEach(function (t) { t.stop(); });
    this.cam.video.srcObject = null;
    this.cam = null;
    if (this.gl && this.texImg) {
      this.gl.activeTexture(this.gl.TEXTURE1);
      subeImagen(this.gl, this.texImg, foto());
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.imgW = FOTO.width; this.imgH = FOTO.height;
    }
    if (this.bCam) this.bCam.textContent = UI('Usar la cámara');
    this.estadoCamara('');
    if (this.gl && !this.corriendo) this.pinta();
  };

  /* ---------------- pintado ---------------- */

  Visor.prototype.pinta = function () {
    var gl = this.gl;
    if (!gl || !this.prog) return;
    if (this.buffer && this.progVista) { this.pintaBuffer(); return; }
    var self = this;
    gl.useProgram(this.prog);
    if (this.u.res) gl.uniform3f(this.u.res, this.W, this.H, 1);
    if (this.u.t) gl.uniform1f(this.u.t, this.tiempo());
    if (this.u.f) gl.uniform1f(this.u.f, this.frame);
    if (this.u.m) gl.uniform4f(this.u.m, this.raton[0], this.raton[1], this.raton[2], this.raton[3]);
    this.mandos.forEach(function (m) {
      if (self.um[m.n]) gl.uniform1f(self.um[m.n], self.valores[m.n]);
    });
    this.actualizaCamara();
    this.canalImagen();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    this.frame++;
  };

  Visor.prototype.tiempo = function () {
    return this.acumulado + (this.corriendo ? (performance.now() - this.t0) / 1000 : 0);
  };

  Visor.prototype.play = function () {
    if (this.corriendo || !this.gl) return;
    this.corriendo = true;
    this.t0 = performance.now();
    var self = this;
    (function bucle() {
      if (!self.corriendo) return;
      self.pinta();
      self.raf = requestAnimationFrame(bucle);
    })();
    this.pintaBoton();
  };

  Visor.prototype.pausa = function () {
    if (!this.corriendo) return;
    this.acumulado = this.tiempo();
    this.duerme();
    this.pintaBoton();
  };

  Visor.prototype.alterna = function () {
    if (this.corriendo) { this.pausadoPorMano = true; this.pausa(); }
    else { this.pausadoPorMano = false; this.play(); }
    this.pintaBoton();
  };

  Visor.prototype.pintaBoton = function () {
    this.bPausa.innerHTML = this.corriendo
      ? '&#10074;&#10074; ' + UI('Pausa')
      : '&#9654; ' + UI('Seguir');
  };

  Visor.prototype.reinicia = function () {
    if (this.ed) { this.ed.value = this.original; this.repintaCodigo(); }
    if (this.o.id) Progress.pref('shd:' + this.o.id, '');
    this.acumulado = 0; this.frame = 0; this.t0 = performance.now();
    // «Volver al original» es literal: también los mandos.
    var self = this;
    this.mandos.forEach(function (m) {
      self.valores[m.n] = m.value;
      if (self.sliders && self.sliders[m.n]) self.sliders[m.n].set(m.value, false);
    });
    this.recompila();
  };

  /* ---------------- la puerta ---------------- */
  W.shader = function (host, o) { return new Visor(host, o); };
  W.glslCompila = glslCompila;
  /** Estadisticas de lo que pinta un shader. Sirve para una prueba que
      no se puede hacer compilando: una imagen puede compilar de maravilla
      y salir completamente lisa, que en un tema es un error mudo. */
  W.glslEstadisticas = function (codigo, mandos, o) {
    o = o || {};
    var tam = o.tam || 32;
    var px = pintaEnAux(codigo, mandos, o.valores, tam, o.t === undefined ? 1.7 : o.t);
    if (!px) return null;
    var n = tam * tam, ch, i, v, suma, media, acum;
    var desv = 0, medias = [];
    /* La desviacion se mide DENTRO de cada canal, no mezclandolos: una
       imagen de un solo color plano tiene variacion entre canales pero
       ninguna dentro de uno, que es justo lo que queremos detectar. */
    for (ch = 0; ch < 3; ch++) {
      suma = 0;
      for (i = 0; i < n; i++) suma += px[i * 4 + ch];
      media = suma / n;
      acum = 0;
      for (i = 0; i < n; i++) { v = px[i * 4 + ch] - media; acum += v * v; }
      medias.push(media);
      desv = Math.max(desv, Math.sqrt(acum / n));
    }
    return { medias: medias, desv: desv };
  };

  W.glslPinta = pintaGLSL;
  /* Las palabras que el coloreado reconoce. tests.html comprueba que cada
     una tiene su entrada en la referencia GLSL del panel lateral. */
  W.glslLexico = LEXICO;
  /** La foto que ven los visores con imagen (un canvas de 800 x 400). */
  W.glslFoto = foto;
  W.pintaBloques = pintaBloques;
  W.glslIguales = iguales;
  W.glslPreambulo = PREAMBULO;

})(window);
