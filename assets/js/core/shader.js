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
    '#define PI 3.14159265359',
    '#define TAU 6.28318530718'
  ];

  var CIERRE =
    '\nvoid main(){\n' +
    '  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);\n' +
    '  mainImage(color, gl_FragCoord.xy);\n' +
    '  gl_FragColor = vec4(color.rgb, 1.0);\n' +
    '}\n';

  function fuenteCompleta(codigo, mandos) {
    var pre = PREAMBULO.slice();
    (mandos || []).forEach(function (m) { pre.push('uniform float ' + m.n + ';'); });
    return { texto: pre.join('\n') + '\n' + codigo + CIERRE, saltadas: pre.length + 1 };
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
  function compila(gl, codigo, mandos) {
    var f = fuenteCompleta(codigo, mandos);
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
    if (!errores.length) errores.push({ linea: 0, msg: 'no compila' });
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
    if (!a) return { ok: false, motivo: 'la respuesta no compila' };
    if (!b) return { ok: false, motivo: 'la referencia no compila' };
    var suma = 0, n = tam * tam;
    for (var i = 0; i < n; i++) {
      var k = i * 4;
      suma += Math.abs(a[k] - b[k]) + Math.abs(a[k + 1] - b[k + 1]) + Math.abs(a[k + 2] - b[k + 2]);
    }
    var media = suma / (n * 3);
    return { ok: media <= tol, distancia: media };
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
      'aria-label': o.aria || 'Resultado del shader. Cada píxel de este dibujo lo calcula el código de abajo.'
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
        html: 'Código del shader &nbsp;<span class="shd__pista">se recompila solo al escribir</span>'
      }));
      this.ed = U.el('textarea.shd__ed', {
        id: idEd, spellcheck: 'false', autocapitalize: 'off',
        autocorrect: 'off', autocomplete: 'off', wrap: 'off',
        rows: String(Math.max(6, Math.min(22, this.original.split('\n').length + 1)))
      });
      this.ed.value = this.original;
      this.el.appendChild(this.ed);
      var espera = null;
      this.ed.addEventListener('input', function () {
        clearTimeout(espera);
        espera = setTimeout(function () { self.recompila(); self.guarda(); }, 420);
      });
    }

    this.err = U.el('div.shd__err', { role: 'status', 'aria-live': 'polite' });
    this.el.appendChild(this.err);

    /* --- botones --- */
    this.bPausa = U.el('button.btn', { type: 'button', html: '&#10074;&#10074; Pausa' });
    this.bReset = U.el('button.btn', { type: 'button', html: '&#8635; Volver al original' });
    this.bPausa.addEventListener('click', function () { self.alterna(); });
    this.bReset.addEventListener('click', function () { self.reinicia(); });
    var pie = U.el('div.shd__pie', null, [this.bPausa, this.bReset]);
    if (o.editable !== false) {
      this.bYa = U.el('button.btn.btn--main', { type: 'button', text: 'Ejecutar' });
      this.bYa.addEventListener('click', function () { self.recompila(); self.guarda(); });
      pie.insertBefore(this.bYa, pie.firstChild);
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

    /* --- el contexto no se crea hasta que se ve --- */
    if (global.IntersectionObserver) {
      this.io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) self.despierta(); else self.duerme();
        });
      }, { rootMargin: '120px' });
      this.io.observe(this.stage);
    } else {
      this.despierta();
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
      this.aviso.textContent = 'Este navegador no tiene WebGL, así que no puede mostrar shaders. ' +
        'El código de abajo se puede leer igual.';
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
    if (!this.corriendo) this.pinta();
  };

  Visor.prototype.recompila = function () {
    var gl = this.gl;
    if (!gl) return;
    var r = compila(gl, this.codigo(), this.mandos);
    if (!r.ok) {
      this.muestraErrores(r.errores);
      return false;
    }
    var pr = gl.createProgram();
    gl.attachShader(pr, this.vs);
    gl.attachShader(pr, r.shader);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      this.muestraErrores([{ linea: 0, msg: gl.getProgramInfoLog(pr) || 'no enlaza' }]);
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
      f: gl.getUniformLocation(pr, 'iFrame')
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
      return '<span class="shd__ln">' + (e.linea ? 'línea ' + e.linea : 'shader') + '</span> ' +
        U.escape(e.msg);
    }).join('<br>');
    this.el.classList.add('shd--roto');
  };

  Visor.prototype.sinErrores = function () {
    this.err.className = 'shd__err is-bien';
    this.err.textContent = 'Compila.';
    this.el.classList.remove('shd--roto');
  };

  /* ---------------- pintado ---------------- */

  Visor.prototype.pinta = function () {
    var gl = this.gl;
    if (!gl || !this.prog) return;
    var self = this;
    gl.useProgram(this.prog);
    if (this.u.res) gl.uniform3f(this.u.res, this.W, this.H, 1);
    if (this.u.t) gl.uniform1f(this.u.t, this.tiempo());
    if (this.u.f) gl.uniform1f(this.u.f, this.frame);
    if (this.u.m) gl.uniform4f(this.u.m, this.raton[0], this.raton[1], this.raton[2], this.raton[3]);
    this.mandos.forEach(function (m) {
      if (self.um[m.n]) gl.uniform1f(self.um[m.n], self.valores[m.n]);
    });
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
    this.bPausa.innerHTML = this.corriendo ? '&#10074;&#10074; Pausa' : '&#9654; Seguir';
  };

  Visor.prototype.reinicia = function () {
    if (this.ed) this.ed.value = this.original;
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

  W.glslIguales = iguales;
  W.glslPreambulo = PREAMBULO;

})(window);
